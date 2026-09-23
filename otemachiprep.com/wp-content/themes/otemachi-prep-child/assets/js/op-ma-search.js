/* ================================================================
 * op-ma-search v1: FA・M&A仲介会社DB 検索エンジン（純粋関数・DOM非依存）
 * op-pe-search v1 と同一実装（PEファンドDBの検索根本改善で確立）を移植。
 * エンジン自体はドメイン非依存のため、PE固有のハードコードは持たない。
 *
 * 設計:
 *  - 検索対象を「会社名 / 会社属性 / 成約実績（取引先企業）」の3階層に構造化し、
 *    どのフィールドが一致したかを結果オブジェクトで返す（ブロブ連結+includesを廃止）。
 *  - relevance score によるランキング。優先順位は
 *      会社名 Exact > Prefix > Substring > 別称(slug等) > Fuzzy > 会社属性 > 成約実績
 *  - 特定の検索語・特定会社へのハードコードは持たない。
 *  - 一覧(op-page-ma-advisors.js)と URL ?q= の双方がこの1実装だけを使う。
 *  - Node からも読み込めるため回帰テスト可能（module.exports）。
 *
 * インデックス入力（PHP op_ma_search_index() が JSON で出力）:
 *   [{ s:slug, nj:日本語会社名, ne:英語社名, at:[属性文字列...],
 *      pf:[[取引先企業名, 業種表示, 追加検索キー(正規化済)], ...] }, ...]
 * ================================================================ */
(function (root) {
  'use strict';

  /* ---------- 正規化 ---------- */

  /** 基本正規化: NFKC・小文字化・空白/区切り記号（中黒/スラッシュ/ハイフン/長音ダッシュ類/括弧）除去。
   *  PHP 側 op_pe_search_norm() と同一の変換（インデックス側とクエリ側の対）。 */
  function norm(s) {
    s = String(s == null ? '' : s);
    try { s = s.normalize('NFKC'); } catch (e) { /* 旧環境 */ }
    return s.toLowerCase().replace(/[\s　・･/／\-–—_,、（）()「」]/g, '');
  }

  /** 法人格・冠語の除去（社名照合キー用）。一般語のみで、特定社名は含めない。 */
  var CORP_RE = /(株式会社|合同会社|有限会社|㈱|\b(inc|llc|llp|ltd|co|corp|corporation|company|group|holdings)\b\.?|,)/g;
  /** 社名末尾の一般語（これを剥がした「コア名」でも照合する。
   *  「アドバンテッジ」→「アドバンテッジパートナーズ」の完全一致級ヒットを実現する一般規則）。 */
  var TAIL_WORDS = [
    'キャピタルパートナーズ', 'エクイティパートナーズ', 'プライベートエクイティ', 'アセットマネジメント',
    'パートナーズ', 'パートナース', 'キャピタル', 'インベストメンツ', 'インベストメント',
    'エクイティ', 'ホールディングス', 'グループ', 'アドバイザリー', 'コンサルティング',
    'capitalpartners', 'equitypartners', 'privateequity',
    'partners', 'capital', 'equity', 'advisory', 'consulting',
    'investments', 'investment', 'management', 'advisors', 'associates', 'holdings', 'group'
  ];

  function stripCorp(k) { return k.replace(CORP_RE, ''); }

  /** コア名: 正規化済みキーから末尾の一般語を（繰り返し）剥がす。2文字以下まで縮んだら剥がさない。 */
  function coreName(k) {
    var changed = true;
    while (changed) {
      changed = false;
      for (var i = 0; i < TAIL_WORDS.length; i++) {
        var w = TAIL_WORDS[i];
        if (k.length > w.length + 2 && k.slice(-w.length) === w) {
          k = k.slice(0, -w.length);
          changed = true;
          break;
        }
      }
    }
    return k;
  }

  /** ゆるいカナキー: 長音「ー」・促音「ッ」・中点類を落とし、カナ表記揺れを吸収する。
   *  例: アドバンテージ / アドバンテッジ → 同一キー。英字はそのまま。 */
  function looseKana(k) {
    return k.replace(/[ーｰ‐ッｯ]/g, '').replace(/ヴ/g, 'ブ');
  }

  /** 編集距離が1以内か（挿入/削除/置換/隣接転置）。fuzzy 用の軽量判定。 */
  function within1(a, b) {
    if (a === b) { return true; }
    var la = a.length, lb = b.length;
    if (Math.abs(la - lb) > 1) { return false; }
    var i = 0, j = 0, edits = 0;
    while (i < la && j < lb) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (edits++) { return false; }
      if (la === lb) {
        // 置換 or 隣接転置
        if (a[i] === b[j + 1] && a[i + 1] === b[j]) { i += 2; j += 2; continue; }
        i++; j++; continue;
      }
      if (la > lb) { i++; } else { j++; }
    }
    return true;
  }

  /* ---------- インデックス構築 ---------- */

  /** 生インデックス（PHP出力）→ 照合キーを前計算した検索用エントリ配列。1回だけ実行する。 */
  function buildIndex(raw) {
    var out = [];
    for (var i = 0; i < raw.length; i++) {
      var f = raw[i];
      var njk = norm(f.nj), nek = norm(f.ne);
      var names = [];                                     // 社名照合キー（本体＋コア名）
      if (njk) { names.push(stripCorp(njk)); }
      if (nek && nek !== njk) { names.push(stripCorp(nek)); }
      var cores = {};
      var baseLen = names.length;
      for (var n = 0; n < baseLen; n++) {
        var c = coreName(names[n]);
        if (c && c !== names[n] && !cores[c]) { cores[c] = 1; names.push(c); }
      }
      var loose = [];
      for (n = 0; n < names.length; n++) {
        var lk = looseKana(names[n]);
        if (lk !== names[n]) { loose.push(lk); }
      }
      var slugk = norm(f.s || '').replace(/-/g, '');
      var at = [], atDisp = [];
      for (n = 0; n < (f.at || []).length; n++) {
        var ak = norm(f.at[n]);
        if (ak) { at.push(ak); atDisp.push(f.at[n]); }
      }
      // 投資先: [表示名, 業種表示, 追加キー(正規化済)] → 照合キーを前計算＋一括ブロブ（高速一次判定用）
      var pf = [], blob = [];
      for (n = 0; n < (f.pf || []).length; n++) {
        var e = f.pf[n];
        var dk = norm(e[0]), sk = norm(e[1]), xk = String(e[2] || '');
        pf.push({ n: e[0], sec: e[1], dk: dk, sk: sk, xk: xk });
        blob.push(dk, sk, xk);
      }
      out.push({
        s: f.s, nj: f.nj, ne: f.ne,
        names: names, loose: loose, slugk: slugk,
        at: at, atDisp: atDisp,
        pf: pf, pfBlob: blob.join('|')
      });
    }
    return out;
  }

  /** クエリの前計算（1入力につき1回）。 */
  function prepQuery(q) {
    var k = norm(q);
    return k ? { k: k, loose: looseKana(k), len: k.length } : null;
  }

  /* ---------- スコアリング ---------- */

  var TIER = {
    NAME_EXACT: 1000, NAME_PREFIX: 900, NAME_SUB: 800,
    ALIAS: 700, FUZZY: 600,
    ATTR_EXACT: 500, ATTR_SUB: 440,
    PF_NAME: 300, PF_SECTOR: 260, PF_TEXT: 220
  };

  /**
   * 1ファンドを採点する。
   * @return null（不一致）| { score, tier, attr: 表示用属性文字列|null,
   *                         pfHits: [{n,sec,why}...], pfCount }
   *   tier: 'name'|'alias'|'fuzzy'|'attr'|'pf'  why: 'name'|'sector'|'text'
   */
  function score(fund, Q) {
    if (!Q) { return null; }
    var q = Q.k, i;
    /* 短い英字略語（IT/AI/EC/DX 等）は部分一致だと "cap-it-al" のような社名中の
       偶然の並びに誤ヒットするため、全階層で前方一致・トークン先頭一致に制限する。
       日本語の2文字語（家具・食品・医療 等）は情報量が大きく誤ヒットしないため対象外。 */
    var shortQ = q.length <= 2 && /^[a-z0-9]+$/.test(q);

    /* 1) 運用会社名（Exact / Prefix / Substring） */
    var best = 0;
    for (i = 0; i < fund.names.length; i++) {
      var key = fund.names[i];
      if (key === q) { best = TIER.NAME_EXACT; break; }
      if (key.indexOf(q) === 0) { best = Math.max(best, TIER.NAME_PREFIX); }
      else if (q.length >= 2 && !shortQ && key.indexOf(q) > 0) { best = Math.max(best, TIER.NAME_SUB); }
    }
    if (best) { return { score: best, tier: 'name', attr: null, pfHits: [], pfCount: 0 }; }

    /* 2) 別称（slug）: ハイフン除去済み slug への部分一致（英語圏の略記に効く） */
    if (q.length >= 3 && fund.slugk && (shortQ ? fund.slugk.indexOf(q) === 0 : fund.slugk.indexOf(q) >= 0)) {
      return { score: TIER.ALIAS, tier: 'alias', attr: null, pfHits: [], pfCount: 0 };
    }

    /* 3) Fuzzy: ゆるいカナキー一致（長音/促音ゆれ）→ 編集距離1（4文字以上のみ） */
    if (q.length >= 3 && Q.loose) {
      for (i = 0; i < fund.loose.length; i++) {
        if (fund.loose[i] === Q.loose || fund.loose[i].indexOf(Q.loose) === 0) {
          return { score: TIER.FUZZY, tier: 'fuzzy', attr: null, pfHits: [], pfCount: 0 };
        }
      }
    }
    if (q.length >= 4) {
      for (i = 0; i < fund.names.length; i++) {
        var key2 = fund.names[i];
        if (within1(key2, q) || (key2.length > q.length && within1(key2.slice(0, q.length), q))) {
          return { score: TIER.FUZZY, tier: 'fuzzy', attr: null, pfHits: [], pfCount: 0 };
        }
      }
    }

    /* 4) ファンド属性（投資戦略・重点業種・案件タイプ・地域・ファンド名） */
    var attrBest = 0, attrDisp = null;
    for (i = 0; i < fund.at.length; i++) {
      if (fund.at[i] === q) { attrBest = TIER.ATTR_EXACT; attrDisp = fund.atDisp[i]; break; }
      var aHit = shortQ ? fund.at[i].indexOf(q) === 0 : fund.at[i].indexOf(q) >= 0;
      if (q.length >= 2 && aHit && attrBest < TIER.ATTR_SUB) {
        attrBest = TIER.ATTR_SUB; attrDisp = fund.atDisp[i];
      }
    }

    /* 5) 投資先（社名 > 業種 > 事業内容等）。一括ブロブで一次判定してから個別走査。 */
    var pfHits = [], pfTierBest = 0;
    var blobHit = shortQ ? fund.pfBlob.indexOf('|' + q) >= 0 || fund.pfBlob.indexOf(q) === 0
                         : fund.pfBlob.indexOf(q) >= 0;
    if (q.length >= 2 && blobHit) {
      for (i = 0; i < fund.pf.length; i++) {
        var e = fund.pf[i], why = null, t = 0;
        var dHit = shortQ ? e.dk.indexOf(q) === 0 : e.dk.indexOf(q) >= 0;
        var sHit = shortQ ? e.sk.indexOf(q) === 0 : e.sk.indexOf(q) >= 0;
        var xHit = shortQ ? ('|' + e.xk).indexOf('|' + q) >= 0 : e.xk.indexOf(q) >= 0;
        if (dHit) { why = 'name'; t = TIER.PF_NAME; }
        else if (sHit) { why = 'sector'; t = TIER.PF_SECTOR; }
        else if (xHit) { why = 'text'; t = TIER.PF_TEXT; }
        if (why) {
          pfHits.push({ n: e.n, sec: e.sec, why: why });
          if (t > pfTierBest) { pfTierBest = t; }
        }
      }
    }

    if (!attrBest && !pfTierBest) { return null; }
    // 属性一致と投資先一致は併存しうる。スコアは高い方＋投資先件数の微小ボーナス（同格内の順位付け）。
    var sc = Math.max(attrBest, pfTierBest) + Math.min(pfHits.length, 20);
    return {
      score: sc,
      tier: attrBest >= pfTierBest ? 'attr' : 'pf',
      attr: attrDisp,
      pfHits: pfHits,
      pfCount: pfHits.length
    };
  }

  var api = { norm: norm, coreName: coreName, looseKana: looseKana, within1: within1,
              buildIndex: buildIndex, prepQuery: prepQuery, score: score, TIER: TIER };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  root.opMaSearch = api;
})(typeof window !== 'undefined' ? window : globalThis);
