/* op-vc-directory.js — VC・CVC一覧の操作性（検索・絞り込み・並べ替え・地域タブ・目的選択・URL状態・計測）
   既存PEページのHTML契約（data-* 属性 / 要素ID）に沿う純Vanilla実装。テーマ移植可。
   計測は analytics 基盤非依存の薄いディスパッチ（dataLayer / gtag / なければ no-op）。 */
(function () {
  "use strict";

  // ---- analytics: 個人情報は送らない（§15） ----
  function track(event, params) {
    try {
      var p = Object.assign({ event: event }, params || {});
      if (window.dataLayer && typeof window.dataLayer.push === "function") window.dataLayer.push(p);
      else if (typeof window.gtag === "function") window.gtag("event", event, params || {});
      // デバッグ可視化（本番は削除可）
      if (window.OP_VC_DEBUG) console.log("[vc-analytics]", event, params || {});
    } catch (e) {}
  }

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* 検索正規化・採点は op-vc-search.js（単一実装）に委譲する。読み込み失敗時のみ最小フォールバック。 */
  var SE = window.opVcSearch || null;

  var els = {
    q: $("#q"), qClr: $("#qClr"), sug: $("#sug"), sort: $("#sort"), reset: $("#reset"),
    rail: $("#peRail"), railToggle: $("#railToggle"), railActiveCnt: $("#railActiveCnt"),
    matchGroup: $("#matchGroup"), matchOpts: $("#matchOpts"), chips: $("#chips"),
    tabs: $("#regionTabs"), resultLine: $("#resultLine"),
    cardWrap: $("#cardWrap"), tblBody: $("#tblBody"),
    emptyMsg: $("#emptyMsg"),
    loadMore: $("#loadMore"), loadMoreWrap: $("#loadMoreWrap"),
    loadMoreRemain: $("#loadMoreRemain"), loadMoreNote: $("#loadMoreNote"),
    intent: $("#intentSeg"), intentNote: $("#intentNote")
  };

  // 段階描画（Load More）。全件はHTMLに存在（SEO/no-JSで全件可視）。JSは初期表示件数を絞る。
  var PAGE = 60, shown = PAGE;

  // 目的別の説明・並べ替え初期値・CTA強調
  var INTENTS = {
    research: { note: "通常の検索・絞り込みでVC・CVCの戦略・投資先・公式サイトを確認できます。", sort: "name_ja" },
    fundraise: { note: "投資ステージ・対象業種・Pitch受付窓口で絞り込み、資金調達の相談先を探せます。", sort: "name_ja", filterFlag: "pitch" },
    career: { note: "採用ページの有無で絞り込み、投資戦略・運用ファンドから志望先を研究できます。", sort: "name_ja", filterFlag: "careers" },
    learn: { note: "投資実務（バリュエーション・財務モデリング・投資判断）の関連教材を下部にまとめています。", sort: "name_ja" }
  };

  var GROUPS = ["country", "type", "stage", "sector", "pfn", "flags"];
  var state = {
    region: "all", q: "", sort: "name_ja", intent: "",
    sel: { country: [], type: [], stage: [], sector: [], pfn: [], flags: [], tier: [] }
  };

  function norm(s) { if (SE) return SE.norm(s); s = String(s || ""); try { s = s.normalize("NFKC"); } catch (e) {} return s.toLowerCase().replace(/[\s　・･/／\-–—_,、（）()「」]/g, ""); }

  // ---- 構造化インデックス（#vcIndex JSON）を読み、slug で行/カードへ結合する ----
  var tblBody = els.tblBody, cardWrap = els.cardWrap;
  var rows = $$("tr[data-slug]", tblBody);
  var cardMap = {};
  $$(".f-card", cardWrap).forEach(function (c) { cardMap[c.getAttribute("data-slug")] = c; });
  var sIndex = {};
  (function () {
    var el = document.getElementById("vcIndex");
    if (!el || !SE) return;
    try { SE.buildIndex(JSON.parse(el.textContent)).forEach(function (f) { sIndex[f.s] = f; }); }
    catch (e) { if (window.console) console.error("vcIndex parse failed", e); }
  })();
  var items = rows.map(function (r) {
    var d = r.dataset, slug = d.slug;
    return {
      slug: slug, row: r, card: cardMap[slug] || null, se: sIndex[slug] || null, hit: null,
      region: d.region || "", country: d.country || "", type: d.type || "",
      stage: d.stage || "", sector: d.sector || "",
      pitch: d.pitch === "1", careers: d.careers === "1",
      nameja: (r.querySelector(".f-name") || {}).textContent || "",
      nameen: d.nameen || "", deals: +(d.deals || 0),
      founded: d.founded || "", updated: d.updated || ""
    };
  });

  // ---- ファセット判定 ----
  function pfnTest(it, v) { if (v === "50") return it.deals >= 50; if (v === "10") return it.deals >= 10 && it.deals < 50; if (v === "1") return it.deals >= 1 && it.deals < 10; return true; }
  function facetTest(it, g, v) {
    if (g === "country") return it.country === v;
    if (g === "type") return it.type === v;
    if (g === "stage") return (" " + it.stage + " ").indexOf(" " + v + " ") >= 0;
    if (g === "sector") return (" " + it.sector + " ").indexOf(" " + v + " ") >= 0;
    if (g === "pfn") return pfnTest(it, v);
    if (g === "flags") return v === "pitch" ? it.pitch : it.careers;
    if (g === "tier") {
      if (!it.hit) return false;
      if (v === "name") return it.hit.tier === "name" || it.hit.tier === "alias" || it.hit.tier === "fuzzy";
      if (v === "pf") return it.hit.pfCount > 0;
      if (v === "attr") return !!it.hit.attr;
    }
    return true;
  }
  /* skip: このグループ自身は判定から除外する（「その選択肢を選んだら何件になるか」を出すため） */
  function passFacets(it, skip) {
    for (var i = 0; i < GROUPS.length; i++) {
      var g = GROUPS[i]; if (g === skip) continue;
      var sels = state.sel[g]; if (!sels.length) continue;
      var ok = false; for (var j = 0; j < sels.length; j++) { if (facetTest(it, g, sels[j])) { ok = true; break; } }
      if (!ok) return false;
    }
    return true;
  }
  function regionMatch(it) { return state.region === "all" || (" " + it.region + " ").indexOf(" " + state.region + " ") >= 0; }

  function cmp(a, b) {
    var s = state.sort;
    if (s === "name_en") return norm(a.nameen || "zzz").localeCompare(norm(b.nameen || "zzz"));
    if (s === "deals") return (b.deals - a.deals) || a.nameja.localeCompare(b.nameja, "ja");
    if (s === "updated") return (b.updated || "").localeCompare(a.updated || "") || a.nameja.localeCompare(b.nameja, "ja");
    if (s === "founded") return (b.founded || "").localeCompare(a.founded || "") || a.nameja.localeCompare(b.nameja, "ja");
    return a.nameja.localeCompare(b.nameja, "ja");
  }

  // ---- URL <-> state（複数選択はカンマ区切り。single source of truth） ----
  function readURL() {
    var u = new URLSearchParams(location.search);
    state.region = u.get("region") || "all";
    state.q = u.get("q") || "";
    state.sort = u.get("sort") || "name_ja";
    state.intent = u.get("intent") || "";
    GROUPS.concat("tier").forEach(function (g) { var v = u.get(g); state.sel[g] = v ? v.split(",") : []; });
    if (els.q) els.q.value = state.q;
    if (els.sort) els.sort.value = state.sort;
    $$(".rtab", els.tabs).forEach(function (t) { t.setAttribute("aria-selected", t.dataset.r === state.region ? "true" : "false"); });
    $$("#peRail input[type=checkbox]").forEach(function (cb) {
      var g = cb.getAttribute("data-g"), v = cb.getAttribute("data-v");
      cb.checked = state.sel[g] && state.sel[g].indexOf(v) >= 0;
    });
    if (els.intent) $$(".intent-btn", els.intent).forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.intent === state.intent ? "true" : "false"); });
    if (els.intentNote) els.intentNote.textContent = state.intent && INTENTS[state.intent] ? INTENTS[state.intent].note : "";
  }
  function writeURL() {
    var u = new URLSearchParams();
    if (state.region !== "all") u.set("region", state.region);
    if (state.q) u.set("q", state.q);
    GROUPS.forEach(function (g) { if (state.sel[g].length) u.set(g, state.sel[g].join(",")); });
    if (state.sort !== "name_ja" && state.sort !== "rel") u.set("sort", state.sort);
    if (state.intent) u.set("intent", state.intent);
    var qs = u.toString();
    history.replaceState(null, "", qs ? "?" + qs : location.pathname);
  }

  // ---- 一致理由の表示 ----
  var WHY = { name: "投資先名", sector: "業種", text: "事業内容・ステージ" };
  function escH(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function hitWhyHTML(hit, qDisp) {
    if (!hit) return "";
    if (hit.tier === "name") return '<span class="hw-tag hw-name">組織名に一致</span>';
    if (hit.tier === "alias") return '<span class="hw-tag hw-name">組織の別称に一致</span>';
    if (hit.tier === "fuzzy") return '<span class="hw-tag hw-name">組織名に類似一致</span>';
    var h = "";
    if (hit.attr) h += '<span class="hw-tag hw-attr">投資ステージ・重点分野「' + escH(hit.attr) + '」に一致</span>';
    if (hit.pfCount) {
      h += '<span class="hw-tag hw-pf">投資先 ' + hit.pfCount + '件が「' + escH(qDisp) + '」に一致</span>';
      var LIMIT = 3;
      h += '<ul class="hw-list">';
      hit.pfHits.forEach(function (p, i) {
        h += '<li' + (i >= LIMIT ? ' class="hw-extra" hidden' : '') + '><b>' + escH(p.n) + '</b>'
          + (p.sec ? '<span class="hw-sec">' + escH(p.sec) + '</span>' : '')
          + '<span class="hw-why">' + (WHY[p.why] || '') + 'が一致</span></li>';
      });
      h += '</ul>';
      if (hit.pfCount > LIMIT) h += '<span class="hw-more" role="button" tabindex="0" aria-expanded="false">一致した投資先をすべて見る（' + hit.pfCount + '件）</span>';
    }
    return h;
  }
  function setWhy(el, html) {
    if (!el) return;
    var w = el.querySelector(".hit-why");
    if (!html) { if (w) w.remove(); return; }
    if (!w) {
      w = document.createElement("div"); w.className = "hit-why";
      var host = el.tagName === "TR" ? el.querySelector("td:nth-child(2)") : el;
      (host || el).appendChild(w);
    }
    w.innerHTML = html;
  }

  function updateLoadMore(total) {
    if (!els.loadMoreWrap) return;
    var remain = total - shown;
    if (remain > 0) {
      els.loadMoreWrap.hidden = false;
      if (els.loadMoreRemain) els.loadMoreRemain.textContent = "（あと " + remain + " 社）";
      if (els.loadMoreNote) els.loadMoreNote.textContent = "表示中 " + Math.min(shown, total) + " / " + total + " 社";
    } else {
      els.loadMoreWrap.hidden = true;
      if (els.loadMoreNote) els.loadMoreNote.textContent = total ? "全 " + total + " 社を表示中" : "";
    }
  }

  var pfFundCount = 0, pfCompanyCount = 0;
  function apply(fromUser) {
    shown = PAGE; // 検索・絞り込み・並べ替え変更時は先頭ページに戻す
    var Q = (state.q && SE) ? SE.prepQuery(state.q) : null;
    var hasQ = !!Q;
    if (!hasQ) state.sel.tier = [];
    items.forEach(function (it) {
      if (!hasQ) { it.hit = null; return; }
      it.hit = it.se ? SE.score(it.se, Q) : null;
    });

    var filtered = items.filter(function (it) { return regionMatch(it) && (!hasQ || !!it.hit) && passFacets(it, null); });
    /* 投資先一致の件数表示は「現在表示中の結果」基準で数える（絞り込み前の全件基準にすると
       facet適用後の件数と食い違う。PE版で実際に不具合があった箇所と同一の注意点）。 */
    pfFundCount = 0; pfCompanyCount = 0;
    filtered.forEach(function (it) { if (it.hit && it.hit.pfCount) { pfFundCount++; pfCompanyCount += it.hit.pfCount; } });
    filtered.sort(function (a, b) {
      if (state.sort === "rel" || (hasQ && state.sort === "name_ja")) { var d = (b.hit ? b.hit.score : 0) - (a.hit ? a.hit.score : 0); if (d) return d; }
      return cmp(a, b);
    });

    var total = filtered.length;
    items.forEach(function (it) { it.row.style.display = "none"; if (it.card) it.card.style.display = "none"; setWhy(it.row, ""); setWhy(it.card, ""); });
    filtered.forEach(function (it, i) {
      var visible = i < shown;
      it.row.style.display = visible ? "" : "none"; tblBody.appendChild(it.row);
      if (it.card) { it.card.style.display = visible ? "" : "none"; cardWrap.appendChild(it.card); }
      if (visible) {
        var wh = hasQ ? hitWhyHTML(it.hit, state.q) : "";
        setWhy(it.row, wh); setWhy(it.card, wh);
      }
    });
    updateLoadMore(total);

    /* ---- ファセットの動的件数（このグループを除いた他条件下で、その選択肢を選ぶと何件か） ----
       地域タブ（regionMatch）はここでは加味しない＝左レールの件数・絞り込みは地域タブと独立させる
       （地域タブは「該当」結果一覧のみを絞り込み、左レールの選択肢件数は地域を切り替えても変動しない。PE版と同一設計）。 */
    var railBase = items.filter(function (it) { return (!hasQ || !!it.hit); });
    $$("#peRail .fgroup[data-g]").forEach(function (gEl) {
      var g = gEl.getAttribute("data-g");
      $$("input[type=checkbox]", gEl).forEach(function (cb) {
        var v = cb.getAttribute("data-v");
        var n = railBase.filter(function (it) { return passFacets(it, g) && facetTest(it, g, v); }).length;
        var lab = cb.closest("label.fopt");
        lab.querySelector(".cnt").textContent = n;
        lab.classList.toggle("zero", n === 0 && state.sel[g].indexOf(v) < 0);
        lab.classList.toggle("on", state.sel[g].indexOf(v) >= 0);
      });
    });
    var activeGroups = GROUPS.filter(function (g) { return state.sel[g].length; }).length;
    if (els.railActiveCnt) els.railActiveCnt.textContent = activeGroups ? ("(" + activeGroups + ")") : "";
    if (els.railToggle) els.railToggle.classList.toggle("has-active", !!activeGroups);

    /* ---- 検索の一致対象ファセット（検索時のみ表示） ---- */
    if (els.matchGroup) {
      if (hasQ) {
        els.matchGroup.hidden = false;
        els.matchOpts.innerHTML = "";
        [["name", "組織名に一致"], ["attr", "投資ステージ・重点分野に一致"], ["pf", "投資先に一致"]].forEach(function (d) {
          var n = railBase.filter(function (it) { return passFacets(it, "tier") && facetTest(it, "tier", d[0]); }).length;
          var extra = d[0] === "pf" ? railBase.filter(function (it) { return passFacets(it, "tier") && facetTest(it, "tier", "pf"); }).reduce(function (s2, it) { return s2 + (it.hit ? it.hit.pfCount : 0); }, 0) : 0;
          var on = state.sel.tier.indexOf(d[0]) >= 0;
          var l = document.createElement("label"); l.className = "fopt" + (on ? " on" : "") + (n === 0 && !on ? " zero" : "");
          l.innerHTML = '<input type="checkbox" ' + (on ? "checked" : "") + '> ' + d[1] + (extra ? ("（" + extra + "件）") : "") + ' <span class="cnt">' + n + "</span>";
          l.querySelector("input").addEventListener("change", function () { toggleFacet("tier", d[0]); });
          els.matchOpts.appendChild(l);
        });
      } else { els.matchGroup.hidden = true; }
    }

    /* ---- 適用中の条件チップ ---- */
    if (els.chips) {
      els.chips.innerHTML = "";
      var GLBL = { country: "国", type: "組織区分", stage: "投資ステージ", sector: "業種", pfn: "投資先数", flags: "受入窓口", tier: "一致対象" };
      var VLBL = { name: "組織名", attr: "ステージ・分野", pf: "投資先", pitch: "Pitch窓口", careers: "採用ページ", "50": "50件以上", "10": "10〜49件", "1": "1〜9件" };
      GROUPS.concat("tier").forEach(function (g) {
        state.sel[g].forEach(function (v) {
          var c = document.createElement("span"); c.className = "chip";
          c.innerHTML = GLBL[g] + ": " + escH(VLBL[v] || v) + ' <span class="x">×</span>';
          c.querySelector(".x").addEventListener("click", function () { toggleFacet(g, v); });
          els.chips.appendChild(c);
        });
      });
    }

    if (els.emptyMsg) els.emptyMsg.style.display = total ? "none" : "block";
    if (els.resultLine) {
      var line = "該当 <b>" + total + "</b> 社" + (state.region !== "all" ? "（" + state.region + "）" : "");
      if (hasQ && pfFundCount) line += " ・ うち投資先の一致 <b>" + pfFundCount + "</b>社（" + pfCompanyCount + "件）";
      els.resultLine.innerHTML = line;
    }
    writeURL();
    if (fromUser) track("vc_filter_apply", {
      region: state.region, selected_intent: state.intent || null,
      type: state.sel.type.join(",") || null, stage: state.sel.stage.join(",") || null, sector: state.sel.sector.join(",") || null,
      pitch: state.sel.flags.indexOf("pitch") >= 0, careers: state.sel.flags.indexOf("careers") >= 0, result_count: total
    });
    return total;
  }
  function toggleFacet(g, v) {
    var a = state.sel[g], i = a.indexOf(v); if (i < 0) a.push(v); else a.splice(i, 1);
    apply(true);
  }

  function applyIntent(intent, fromUser) {
    state.intent = intent;
    var cfg = INTENTS[intent];
    if (cfg && cfg.filterFlag && state.sel.flags.indexOf(cfg.filterFlag) < 0) { state.sel.flags.push(cfg.filterFlag); }
    $$("#peRail input[type=checkbox]").forEach(function (cb) {
      var g = cb.getAttribute("data-g"), v = cb.getAttribute("data-v");
      cb.checked = state.sel[g] && state.sel[g].indexOf(v) >= 0;
    });
    if (els.intent) $$(".intent-btn", els.intent).forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.intent === state.intent ? "true" : "false"); });
    if (els.intentNote) els.intentNote.textContent = state.intent && INTENTS[state.intent] ? INTENTS[state.intent].note : "";
    apply(false);
    if (fromUser) track("vc_intent_select", { selected_intent: intent });
    // 目的別CTAの強調
    $$("[data-intent-cta]").forEach(function (n) {
      n.style.display = (!intent || n.dataset.intentCta === intent) ? "" : "";
    });
  }

  // ---- ファセット・地域タブ・ソート・リセット ----
  $$("#peRail input[type=checkbox]").forEach(function (cb) {
    cb.addEventListener("change", function () { toggleFacet(cb.getAttribute("data-g"), cb.getAttribute("data-v")); });
  });
  $$("#peRail .fgroup h3").forEach(function (h) { h.addEventListener("click", function () { h.closest(".fgroup").classList.toggle("closed"); }); });
  if (els.tabs) els.tabs.addEventListener("click", function (e) {
    var t = e.target.closest(".rtab"); if (!t) return;
    state.region = t.dataset.r;
    $$(".rtab", els.tabs).forEach(function (x) { x.setAttribute("aria-selected", x === t ? "true" : "false"); });
    apply(true);
  });
  if (els.sort) els.sort.addEventListener("change", function () { state.sort = els.sort.value; apply(true); });
  if (els.intent) els.intent.addEventListener("click", function (e) {
    var b = e.target.closest(".intent-btn"); if (!b) return;
    applyIntent(state.intent === b.dataset.intent ? "" : b.dataset.intent, true);
  });
  if (els.reset) els.reset.addEventListener("click", function () {
    state.q = ""; GROUPS.concat("tier").forEach(function (g) { state.sel[g] = []; });
    if (els.q) els.q.value = ""; if (els.qClr) els.qClr.hidden = true;
    $$("#peRail input[type=checkbox]").forEach(function (cb) { cb.checked = false; });
    apply(true);
  });
  if (els.loadMore) els.loadMore.addEventListener("click", function () {
    shown += PAGE; apply(false);
    track("vc_load_more", { shown: shown, region: state.region });
  });
  var railToggle = els.railToggle, rail = els.rail;
  if (railToggle && rail) {
    railToggle.addEventListener("click", function () {
      var open = railToggle.getAttribute("aria-expanded") === "true";
      railToggle.setAttribute("aria-expanded", open ? "false" : "true");
      rail.classList.toggle("open", !open);
    });
  }
  document.addEventListener("click", function (e) {
    var m = e.target.closest ? e.target.closest(".hw-more") : null;
    if (!m) return;
    e.preventDefault(); e.stopPropagation();
    var box = m.closest(".hit-why");
    var on = m.getAttribute("aria-expanded") === "true";
    [].forEach.call(box.querySelectorAll(".hw-extra"), function (li) { li.hidden = on; });
    m.setAttribute("aria-expanded", on ? "false" : "true");
    m.textContent = on ? ("一致した投資先をすべて見る（" + box.querySelectorAll(".hw-list li").length + "件）") : "一致した投資先を折りたたむ";
  }, true);
  document.addEventListener("keydown", function (e) {
    if ((e.key === "Enter" || e.key === " ") && e.target.classList && e.target.classList.contains("hw-more")) { e.preventDefault(); e.target.click(); }
  });

  // ---- 検索窓UX: サジェスト・クリア・キーボード・IME・「/」ショートカット・検索例 ----
  var qEl = els.q, sugEl = els.sug, clrEl = els.qClr;
  var qTm = null, composing = false, sugIdx = -1, sugItems = [];
  function hilite(text, q) {
    var low = String(text).toLowerCase(), pos = low.indexOf(String(q).toLowerCase());
    if (pos < 0) return escH(text);
    return escH(text.slice(0, pos)) + "<mark>" + escH(text.slice(pos, pos + q.length)) + "</mark>" + escH(text.slice(pos + q.length));
  }
  function buildSuggest() {
    if (!SE || !sugEl) return;
    var q = qEl.value, Q = q ? SE.prepQuery(q) : null;
    sugIdx = -1; sugItems = [];
    if (!Q) { sugEl.hidden = true; sugEl.innerHTML = ""; return; }
    var scored = [];
    items.forEach(function (it) { if (!it.se) return; var h = SE.score(it.se, Q); if (h) scored.push({ it: it, h: h }); });
    scored.sort(function (a, b) { return b.h.score - a.h.score; });
    var orgs = scored.filter(function (x) { return x.h.tier === "name" || x.h.tier === "alias" || x.h.tier === "fuzzy"; }).slice(0, 5);
    var pfs = [];
    scored.forEach(function (x) { (x.h.pfHits || []).forEach(function (p) { if (p.why === "name" && pfs.length < 4) pfs.push({ it: x.it, p: p }); }); });
    if (!orgs.length && !pfs.length) { sugEl.hidden = true; return; }
    var h = "";
    if (orgs.length) {
      h += '<div class="grp">VC・CVC</div>';
      orgs.forEach(function (x) {
        h += '<div class="it" data-q="' + escH(x.it.nameja) + '"><span class="nm">' + hilite(x.it.nameja, q) + '</span><span class="en">' + hilite(x.it.nameen || "", q) + '</span><span class="via">' + x.it.deals + '件収録</span></div>';
      });
    }
    if (pfs.length) {
      h += '<div class="grp">投資先企業から探す</div>';
      pfs.forEach(function (x) {
        h += '<div class="it" data-q="' + escH(x.p.n) + '"><span class="nm">' + hilite(x.p.n, q) + '</span>' + (x.p.sec ? '<span class="en">' + escH(x.p.sec) + '</span>' : "") + '<span class="via">投資元: ' + escH(x.it.nameja) + '</span></div>';
      });
    }
    h += '<div class="foot">Enterで絞り込み ・ ↑↓で候補選択 ・ Escで閉じる</div>';
    sugEl.innerHTML = h; sugEl.hidden = false;
    sugItems = $$(".it", sugEl);
    sugItems.forEach(function (it) { it.addEventListener("mousedown", function (e) { e.preventDefault(); pickSuggest(it); }); });
  }
  function pickSuggest(it) {
    qEl.value = it.getAttribute("data-q"); state.q = qEl.value;
    sugEl.hidden = true; apply(true); if (clrEl) clrEl.hidden = !qEl.value;
  }
  function onInput() {
    state.q = qEl.value;
    if (clrEl) clrEl.hidden = !qEl.value;
    if (qTm) clearTimeout(qTm);
    qTm = setTimeout(function () { apply(true); buildSuggest(); }, 120);
  }
  if (qEl) {
    qEl.addEventListener("compositionstart", function () { composing = true; });
    qEl.addEventListener("compositionend", function () { composing = false; onInput(); });
    qEl.addEventListener("input", function () { if (!composing) onInput(); });
    qEl.addEventListener("keydown", function (e) {
      if (composing) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        if (sugEl.hidden || !sugItems.length) return;
        e.preventDefault();
        sugIdx = (sugIdx + (e.key === "ArrowDown" ? 1 : -1) + sugItems.length) % sugItems.length;
        sugItems.forEach(function (it, i) { it.classList.toggle("act", i === sugIdx); });
        sugItems[sugIdx].scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter") {
        if (sugIdx >= 0 && sugItems[sugIdx]) { e.preventDefault(); pickSuggest(sugItems[sugIdx]); }
        else { sugEl.hidden = true; }
      } else if (e.key === "Escape") {
        if (!sugEl.hidden) { sugEl.hidden = true; }
        else if (qEl.value) { qEl.value = ""; onInput(); }
        qEl.blur();
      }
    });
    qEl.addEventListener("blur", function () { setTimeout(function () { sugEl.hidden = true; }, 150); });
    qEl.addEventListener("focus", function () { if (qEl.value) buildSuggest(); });
  }
  if (clrEl) clrEl.addEventListener("click", function () { qEl.value = ""; onInput(); qEl.focus(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && document.activeElement !== qEl && !/INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName)) {
      e.preventDefault(); qEl.focus();
    }
  });
  $$(".exchip").forEach(function (b) { b.addEventListener("click", function () { qEl.value = b.getAttribute("data-q"); onInput(); qEl.focus(); }); });

  // view switch (table/cards on desktop)
  $$(".viewswitch button").forEach(function (b) {
    b.addEventListener("click", function () {
      var table = b.dataset.view === "table";
      document.body.classList.toggle("prefer-table", table);
      $$(".viewswitch button").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
    });
  });

  // 外部リンク・CTA計測（委任）
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a"); if (!a) return;
    var t = a.dataset.track; if (!t) return;
    var payload = {};
    ["vcSlug", "vcType", "placement", "courseId", "planId"].forEach(function (k) {
      if (a.dataset[k]) payload[k.replace(/([A-Z])/g, "_$1").toLowerCase()] = a.dataset[k];
    });
    track(t, payload);
  });

  // ---- init ----
  readURL();
  if (state.intent) applyIntent(state.intent, false);
  apply(false);
  track("vc_directory_view", { region: state.region, selected_intent: state.intent || null });

  window.OP_VC = { state: state, apply: apply };
})();

/* ---- サイト共通ヘッダーのナビ開閉 ----
   本ページは自己完結テンプレート（page-vc-funds.php）で独自ヘッダーを持つため、
   サイト本体のグローバルナビJSが読み込まれない。ドロップダウンは CSS の
   `.nv-item[data-open="true"] > .nv-sub` 、モバイルは `#gnav.open` で開く仕様なので、
   その属性/クラスを付与する最小トグルをここで実装（既存CSSに完全一致・追加CSS不要）。 */
(function () {
  "use strict";
  var header = document.getElementById("siteHeader");
  if (!header) return;
  var gnav = document.getElementById("gnav");
  var toggle = header.querySelector(".menu-toggle");
  var items = Array.prototype.slice.call(header.querySelectorAll(".nv-item"));

  function closeAll(except) {
    items.forEach(function (it) {
      if (it !== except) {
        it.removeAttribute("data-open");
        var b = it.querySelector(".nv-btn");
        if (b) b.setAttribute("aria-expanded", "false");
      }
    });
  }
  function closeMobile() {
    if (gnav && gnav.classList.contains("open")) {
      gnav.classList.remove("open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    }
  }

  items.forEach(function (it) {
    var btn = it.querySelector(".nv-btn");
    if (!btn) return; // 直リンク項目（nv-link）はそのまま遷移
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var open = it.getAttribute("data-open") === "true";
      closeAll(it);
      if (open) {
        it.removeAttribute("data-open");
        btn.setAttribute("aria-expanded", "false");
      } else {
        it.setAttribute("data-open", "true");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  if (toggle && gnav) {
    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var open = gnav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (!open) closeAll(null);
    });
  }

  document.addEventListener("click", function (e) {
    if (header.contains(e.target)) return;
    closeAll(null);
    closeMobile();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.keyCode === 27) {
      closeAll(null);
      closeMobile();
    }
  });
})();
