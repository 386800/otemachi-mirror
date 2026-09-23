/*!
 * op-page-activist-funds.js — 日本株アクティビストファンド分析（op-activist-v1）
 * 1) 一覧: 検索・並べ替え（SSR済みDOMの絞り込みのみ・データはサーバー描画）
 * 2) 案件: 日次終値SVGチャート（終値折れ線＋出来高バー＋イベントマーカー＋ツールチップ）
 * 3) 共通: セクションナビの現在地ハイライト、ヘッダー・モバイルメニュー補助
 * 依存ライブラリなし。過度なアニメーションなし。
 */
(function () {
  'use strict';

  /* ================= 共通: ヘッダー（既存PE/VCページと同挙動） ================= */
  var header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
  }
  var toggle = document.querySelector('.menu-toggle');
  var gnav = document.getElementById('gnav');
  if (toggle && gnav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      gnav.classList.toggle('is-open', !open);
      document.body.classList.toggle('nav-open', !open);
    });
  }
  // ドロップダウン開閉（クリック・キーボード。Escで閉じる）
  document.querySelectorAll('.nv-item > .nv-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.nv-item > .nv-btn[aria-expanded="true"]').forEach(function (b) {
        if (b !== btn) { b.setAttribute('aria-expanded', 'false'); b.parentElement.classList.remove('is-open'); }
      });
      btn.setAttribute('aria-expanded', String(!open));
      btn.parentElement.classList.toggle('is-open', !open);
    });
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') {
      document.querySelectorAll('.nv-item > .nv-btn[aria-expanded="true"]').forEach(function (b) {
        b.setAttribute('aria-expanded', 'false'); b.parentElement.classList.remove('is-open'); b.focus();
      });
    }
  });
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }

  /* ================= 一覧: 検索・並べ替え ================= */
  var q = document.getElementById('q');
  var sortSel = document.getElementById('sort');
  if (q || sortSel) {
    var rows = Array.prototype.slice.call(document.querySelectorAll('#tblBody > tr'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('#cardWrap > .f-card'));
    var resultLine = document.getElementById('resultLine');
    var emptyMsg = document.getElementById('emptyMsg');
    var fType = document.getElementById('fType');
    var fStyle = document.getElementById('fStyle');
    var fYear = document.getElementById('fYear');
    var fDisc = document.getElementById('fDisc');
    var apply = function () {
      var kw = (q && q.value ? q.value : '').toLowerCase().trim();
      var ty = fType ? fType.value : '';
      var st = fStyle ? fStyle.value : '';
      var yr = fYear ? fYear.value : '';
      var dc = fDisc ? fDisc.value : '';
      var n = 0;
      var test = function (el) {
        var hit = (!kw || (el.getAttribute('data-name') || '').indexOf(kw) !== -1)
          && (!ty || el.getAttribute('data-type') === ty)
          && (!st || (el.getAttribute('data-styles') || '').split('|').indexOf(st) !== -1)
          && (!yr || (el.getAttribute('data-years') || '').split(' ').indexOf(yr) !== -1)
          && (!dc || (el.getAttribute('data-disclosure') || '').split(' ').indexOf(dc) !== -1);
        el.style.display = hit ? '' : 'none';
        return hit;
      };
      rows.forEach(function (el) { if (test(el)) { n++; } });
      cards.forEach(test);
      if (resultLine) { resultLine.innerHTML = '該当 <b>' + n + '</b> 主体'; }
      if (emptyMsg) { emptyMsg.style.display = n === 0 ? '' : 'none'; }
    };
    [fType, fStyle, fYear, fDisc].forEach(function (s) { if (s) { s.addEventListener('change', apply); } });
    var resort = function () {
      var key = sortSel ? sortSel.value : 'name';
      var cmp = function (a, b) {
        if (key === 'engagements') { return (+b.getAttribute('data-engagements') || 0) - (+a.getAttribute('data-engagements') || 0); }
        if (key === 'holdings') { return (+b.getAttribute('data-holdings') || 0) - (+a.getAttribute('data-holdings') || 0); }
        if (key === 'updated') { return (b.getAttribute('data-updated') || '').localeCompare(a.getAttribute('data-updated') || ''); }
        return (a.getAttribute('data-name') || '').localeCompare(b.getAttribute('data-name') || '');
      };
      var tb = document.getElementById('tblBody');
      var cw = document.getElementById('cardWrap');
      if (tb) { rows.sort(cmp).forEach(function (el) { tb.appendChild(el); }); }
      if (cw) { cards.sort(cmp).forEach(function (el) { cw.appendChild(el); }); }
    };
    if (q) { q.addEventListener('input', apply); }
    if (sortSel) { sortSel.addEventListener('change', function () { resort(); apply(); }); }
  }

  /* ================= 一覧: 企業別逆引きの絞り込み ================= */
  var coList = document.getElementById('coList');
  if (coList) {
    var coItems = Array.prototype.slice.call(coList.querySelectorAll('.co-item'));
    var qco = document.getElementById('qco');
    var coEmpty = document.getElementById('coEmpty');
    if (qco) {
      qco.addEventListener('input', function () {
        var kw = qco.value.toLowerCase().trim();
        var n = 0;
        coItems.forEach(function (el) {
          var hit = !kw || (el.getAttribute('data-key') || '').indexOf(kw) !== -1;
          el.hidden = !hit;
          if (hit) { n++; }
        });
        if (coEmpty) { coEmpty.hidden = n !== 0; }
      });
    }
  }

  /* ================= ファンド: 公式発表アーカイブの絞り込み ================= */
  var prList = document.getElementById('prList');
  if (prList) {
    var prItems = Array.prototype.slice.call(prList.querySelectorAll('.pr-item'));
    var selY = document.getElementById('prYear');
    var selC = document.getElementById('prCo');
    var selK = document.getElementById('prCat');
    var prCount = document.getElementById('prCount');
    var prEmpty = document.getElementById('prEmpty');
    var prMore = document.getElementById('prMore');
    var LIMIT = 12;
    var shown = LIMIT;
    var applyPr = function () {
      var y = selY.value, c = selC.value, k = selK.value;
      var matched = prItems.filter(function (el) {
        return (!y || el.getAttribute('data-year') === y)
            && (!c || el.getAttribute('data-co') === c)
            && (!k || el.getAttribute('data-cat') === k);
      });
      var filtering = !!(y || c || k);
      prItems.forEach(function (el) { el.hidden = true; });
      // 絞り込み中は全件表示（該当が少ないため）。無絞り込み時のみ段階表示。
      var visible = filtering ? matched : matched.slice(0, shown);
      visible.forEach(function (el) { el.hidden = false; });
      if (prCount) { prCount.textContent = matched.length + '件'; }
      if (prEmpty) { prEmpty.hidden = matched.length !== 0; }
      if (prMore) {
        var remain = filtering ? 0 : matched.length - visible.length;
        prMore.parentElement.hidden = remain <= 0;
        var r = prMore.querySelector('.lm-remain');
        if (r) { r.textContent = '（残り ' + remain + ' 件）'; }
      }
    };
    [selY, selC, selK].forEach(function (s) { if (s) { s.addEventListener('change', function () { shown = LIMIT; applyPr(); }); } });
    if (prMore) { prMore.addEventListener('click', function () { shown += 20; applyPr(); }); }
    applyPr();
  }

  /* ================= 案件: セクションナビ現在地 ================= */
  var secLinks = Array.prototype.slice.call(document.querySelectorAll('.sec-nav a'));
  if (secLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    secLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          secLinks.forEach(function (a) { a.classList.remove('is-active'); });
          map[en.target.id].classList.add('is-active');
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { io.observe(el); }
    });
  }

  /* ================= 案件: 株価チャート ================= */
  var dataEl = document.getElementById('opActChartData');
  var chartEl = document.getElementById('opActChart');
  if (!dataEl || !chartEl) { return; }
  var D;
  try { D = JSON.parse(dataEl.textContent); } catch (e) { return; }
  var rows = D.rows || [];
  if (!rows.length) { return; }

  var CAT = {
    holding:  { label: '保有開示',    sym: '■', shape: 'rect',     color: '#14355F' },
    activist: { label: 'ファンド公表', sym: '▲', shape: 'triangle', color: '#B08A3C' },
    company:  { label: '会社側',      sym: '●', shape: 'circle',   color: '#526075' },
    meeting:  { label: '株主総会',    sym: '◆', shape: 'diamond',  color: '#1E7A46' },
    ir:       { label: 'IR・適時開示', sym: '○', shape: 'ring',     color: '#8496AC' }
  };
  var fmt = function (n) { return Number(n).toLocaleString('ja-JP'); };
  var fmtD = function (iso) { var p = iso.split('-'); return p[0] + '年' + (+p[1]) + '月' + (+p[2]) + '日'; };

  // 直近終値ヘッダー
  var latest = rows[rows.length - 1];
  var latestEl = document.getElementById('chartLatest');
  if (latestEl) {
    latestEl.innerHTML = '直近終値 <b>' + fmt(latest[4]) + '円</b>（' + fmtD(latest[0]) + '）／基準日 ' + fmtD(D.anchor) + (D.isDummy ? '｜<span class="dummy-badge">開発用ダミーデータ</span>' : '');
  }

  // 同日イベントの集約
  var evByDate = {};
  (D.markers || []).forEach(function (m) {
    (evByDate[m.date] = evByDate[m.date] || []).push(m);
  });
  // 保有比率の日付引き（ツールチップ用: その日までに開示された最新値）
  var holdings = (D.holdings || []).filter(function (h) { return h.date; }).sort(function (a, b) { return a.date < b.date ? -1 : 1; });
  var holdingAt = function (date) {
    var last = null;
    for (var i = 0; i < holdings.length; i++) { if (holdings[i].date <= date) { last = holdings[i]; } }
    return last;
  };

  // レイアウト
  var W = 920, H = 420, padL = 62, padR = 74, padT = 46, priceH = 250, volH = 64, volTop = padT + priceH + 22;
  var n = rows.length;
  var xs = function (i) { return padL + (W - padL - padR) * (n === 1 ? 0.5 : i / (n - 1)); };
  var min = Infinity, max = -Infinity, vmax = 0;
  rows.forEach(function (r) {
    if (r[4] < min) { min = r[4]; }
    if (r[4] > max) { max = r[4]; }
    if (r[5] > vmax) { vmax = r[5]; }
  });
  var span = (max - min) || 1; min -= span * 0.06; max += span * 0.06;
  var ys = function (v) { return padT + priceH - (priceH * (v - min) / (max - min)); };
  var yv = function (v) { return volTop + volH - (volH * v / (vmax || 1)); };
  var dateIndex = {};
  rows.forEach(function (r, i) { dateIndex[r[0]] = i; });
  // 営業日でない日付のマーカーは直後の営業日に対応付け
  var idxFor = function (date) {
    if (date in dateIndex) { return dateIndex[date]; }
    for (var i = 0; i < n; i++) { if (rows[i][0] >= date) { return i; } }
    return null;
  };

  var svgParts = [];
  svgParts.push('<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" font-family="Inter,\'Noto Sans JP\',sans-serif">');
  // グリッド＋Y軸ラベル（終値）
  for (var g = 0; g <= 4; g++) {
    var vy = min + (max - min) * g / 4;
    var gy = ys(vy);
    svgParts.push('<line x1="' + padL + '" y1="' + gy + '" x2="' + (W - padR) + '" y2="' + gy + '" stroke="#EDF1F5" stroke-width="1"/>');
    svgParts.push('<text x="' + (padL - 8) + '" y="' + (gy + 4) + '" text-anchor="end" font-size="10.5" fill="#8496AC">' + fmt(Math.round(vy)) + '</text>');
  }
  // X軸ラベル（月初）
  var lastMonth = '';
  rows.forEach(function (r, i) {
    var m = r[0].slice(0, 7);
    if (m !== lastMonth) {
      lastMonth = m;
      var x = xs(i);
      svgParts.push('<line x1="' + x + '" y1="' + padT + '" x2="' + x + '" y2="' + (volTop + volH) + '" stroke="#F3F6F9" stroke-width="1"/>');
      svgParts.push('<text x="' + x + '" y="' + (volTop + volH + 16) + '" text-anchor="middle" font-size="10" fill="#8496AC">' + (+m.slice(5, 7)) + '月</text>');
      if (m.slice(5, 7) === '01' || i === 0) {
        svgParts.push('<text x="' + x + '" y="' + (volTop + volH + 30) + '" text-anchor="middle" font-size="10" fill="#8496AC">' + m.slice(0, 4) + '</text>');
      }
    }
  });
  // 基準日ライン（点線・ラベル）— 色以外（線種・注記）でも区別
  var ai = idxFor(D.anchor);
  if (ai !== null) {
    var ax = xs(ai);
    svgParts.push('<line x1="' + ax + '" y1="' + (padT - 14) + '" x2="' + ax + '" y2="' + (volTop + volH) + '" stroke="#B08A3C" stroke-width="1.4" stroke-dasharray="5 4"/>');
    svgParts.push('<text x="' + ax + '" y="' + (padT - 20) + '" text-anchor="middle" font-size="10.5" font-weight="700" fill="#8A6A28">基準日</text>');
  }
  // 出来高バー
  var bw = Math.max(1, (W - padL - padR) / n * 0.62);
  rows.forEach(function (r, i) {
    svgParts.push('<rect x="' + (xs(i) - bw / 2) + '" y="' + yv(r[5]) + '" width="' + bw + '" height="' + (volTop + volH - yv(r[5])) + '" fill="#C8D4E2"/>');
  });
  svgParts.push('<text x="' + (padL - 8) + '" y="' + (volTop + 10) + '" text-anchor="end" font-size="10" fill="#8496AC">出来高</text>');
  // 終値折れ線
  var path = '';
  rows.forEach(function (r, i) { path += (i ? 'L' : 'M') + xs(i).toFixed(1) + ' ' + ys(r[4]).toFixed(1); });
  svgParts.push('<path d="' + path + '" fill="none" stroke="#14355F" stroke-width="1.8" stroke-linejoin="round"/>');
  // 直近終値ラベル（右端）
  svgParts.push('<g><rect x="' + (W - padR + 6) + '" y="' + (ys(latest[4]) - 11) + '" width="' + (padR - 10) + '" height="22" rx="4" fill="#14355F"/>' +
    '<text x="' + (W - padR / 2 + 2) + '" y="' + (ys(latest[4]) + 4) + '" text-anchor="middle" font-size="10.5" font-weight="700" fill="#fff">' + fmt(latest[4]) + '</text></g>');
  // ダミーデータ透かし
  if (D.isDummy) {
    svgParts.push('<text x="' + (padL + (W - padL - padR) / 2) + '" y="' + (padT + priceH / 2) + '" text-anchor="middle" font-size="26" font-weight="700" fill="rgba(179,58,58,.13)" transform="rotate(-14 ' + (W / 2) + ' ' + (padT + priceH / 2) + ')">開発用ダミーデータ（実在の株価ではありません）</text>');
  }
  // イベントマーカー（同日は縦に集約表示・形＋記号で区別・focus可能）
  Object.keys(evByDate).sort().forEach(function (date) {
    var list = evByDate[date];
    var i = idxFor(date);
    if (i === null) { return; }
    var x = xs(i);
    list.forEach(function (m, k) {
      var cat = CAT[m.cat] || CAT.ir;
      var y = padT + 8 + k * 18;
      var s = 6;
      var shape = '';
      if (cat.shape === 'rect') { shape = '<rect x="' + (x - s) + '" y="' + (y - s) + '" width="' + s * 2 + '" height="' + s * 2 + '" fill="' + cat.color + '"/>'; }
      else if (cat.shape === 'triangle') { shape = '<path d="M' + x + ' ' + (y - s) + ' L' + (x + s) + ' ' + (y + s) + ' L' + (x - s) + ' ' + (y + s) + ' Z" fill="' + cat.color + '"/>'; }
      else if (cat.shape === 'diamond') { shape = '<path d="M' + x + ' ' + (y - s) + ' L' + (x + s) + ' ' + y + ' L' + x + ' ' + (y + s) + ' L' + (x - s) + ' ' + y + ' Z" fill="' + cat.color + '"/>'; }
      else if (cat.shape === 'ring') { shape = '<circle cx="' + x + '" cy="' + y + '" r="' + (s - 1) + '" fill="#fff" stroke="' + cat.color + '" stroke-width="2"/>'; }
      else { shape = '<circle cx="' + x + '" cy="' + y + '" r="' + s + '" fill="' + cat.color + '"/>'; }
      svgParts.push('<g class="evm" tabindex="0" role="button" data-date="' + date + '" data-k="' + k + '" aria-label="' + fmtD(date) + ' ' + cat.label + '：' + (m.title || '').replace(/"/g, '&quot;') + '">' + shape +
        '<line x1="' + x + '" y1="' + (y + s + 1) + '" x2="' + x + '" y2="' + ys(rows[i][4]) + '" stroke="' + cat.color + '" stroke-width="1" stroke-dasharray="2 3" opacity=".55"/></g>');
    });
  });
  // ホバー用透明レイヤ
  svgParts.push('<rect id="chartHover" x="' + padL + '" y="' + padT + '" width="' + (W - padL - padR) + '" height="' + (volTop + volH - padT) + '" fill="transparent"/>');
  svgParts.push('<line id="crosshair" x1="0" y1="' + padT + '" x2="0" y2="' + (volTop + volH) + '" stroke="#8496AC" stroke-width="1" stroke-dasharray="3 3" visibility="hidden"/>');
  svgParts.push('</svg>');
  chartEl.innerHTML = svgParts.join('');

  // 凡例（形＋記号＋ラベル。色のみに依存しない）
  var legendEl = document.getElementById('opActChartLegend');
  if (legendEl) {
    var lg = ['<span class="lg"><span class="sym" style="color:#14355F">━</span>終値（円）</span>',
              '<span class="lg"><span class="sym" style="color:#C8D4E2">▮</span>出来高</span>',
              '<span class="lg"><span class="sym" style="color:#8A6A28">┄</span>基準日</span>'];
    Object.keys(CAT).forEach(function (k) {
      lg.push('<span class="lg"><span class="sym" style="color:' + CAT[k].color + '">' + CAT[k].sym + '</span>' + CAT[k].label + '</span>');
    });
    legendEl.innerHTML = lg.join('');
  }

  // アクセシビリティ代替テーブル（イベント日と月末のみの要約）
  var tbl = document.querySelector('#opActChartTable tbody');
  if (tbl) {
    var frag = [];
    rows.forEach(function (r, i) {
      var evs = evByDate[r[0]];
      var isMonthEnd = (i === n - 1) || rows[i + 1][0].slice(0, 7) !== r[0].slice(0, 7);
      if (!evs && !isMonthEnd) { return; }
      var evTxt = evs ? evs.map(function (m) { return (CAT[m.cat] || CAT.ir).sym + ' ' + m.title; }).join('／') : '';
      frag.push('<tr><td>' + r[0] + '</td><td style="text-align:right">' + fmt(r[4]) + '</td><td style="text-align:right">' + fmt(r[5]) + '</td><td>' + evTxt + '</td></tr>');
    });
    tbl.innerHTML = frag.join('');
  }

  // ツールチップ
  var tip = document.getElementById('opActChartTip');
  var svg = chartEl.querySelector('svg');
  var hover = svg ? svg.querySelector('#chartHover') : null;
  var cross = svg ? svg.querySelector('#crosshair') : null;
  var showTip = function (i, clientX, clientY) {
    if (!tip) { return; }
    var r = rows[i];
    var prev = i > 0 ? rows[i - 1] : null;
    var chg = prev ? r[4] - prev[4] : null;
    var chgTxt = chg === null ? '' : '（前日比 ' + (chg >= 0 ? '+' : '') + fmt(chg) + '円）';
    var html = '<div class="tp-date">' + fmtD(r[0]) + '</div>終値 ' + fmt(r[4]) + '円' + chgTxt + '<br>出来高 ' + fmt(r[5]);
    var h = holdingAt(r[0]);
    if (h && h.ratio !== null) {
      html += '<br>開示保有比率 ' + h.ratio + '%' + (h.prev !== null && h.prev !== undefined ? '（前回 ' + h.prev + '%）' : '') + (h.shares ? '・' + fmt(h.shares) + '株' : '');
    }
    var evs = evByDate[r[0]];
    if (evs) {
      evs.forEach(function (m) {
        var cat = CAT[m.cat] || CAT.ir;
        html += '<div class="tp-ev">' + cat.sym + ' ' + cat.label + '：' + m.title + (m.url ? '<br><span style="opacity:.75">一次情報リンクはタイムライン参照</span>' : '') + '</div>';
      });
    }
    tip.innerHTML = html;
    tip.hidden = false;
    var shell = chartEl.closest('.chart-shell');
    var rect = shell.getBoundingClientRect();
    var tx = clientX - rect.left + 14, ty = clientY - rect.top + 10;
    if (tx + 300 > rect.width) { tx = Math.max(4, clientX - rect.left - 310); }
    tip.style.left = tx + 'px'; tip.style.top = ty + 'px';
  };
  var hideTip = function () { if (tip) { tip.hidden = true; } if (cross) { cross.setAttribute('visibility', 'hidden'); } };
  if (hover && svg) {
    var pt = svg.createSVGPoint();
    var toIdx = function (ev) {
      pt.x = ev.clientX; pt.y = ev.clientY;
      var p = pt.matrixTransform(svg.getScreenCTM().inverse());
      var t = (p.x - padL) / (W - padL - padR);
      return Math.max(0, Math.min(n - 1, Math.round(t * (n - 1))));
    };
    hover.addEventListener('mousemove', function (ev) {
      var i = toIdx(ev);
      if (cross) { cross.setAttribute('x1', xs(i)); cross.setAttribute('x2', xs(i)); cross.setAttribute('visibility', 'visible'); }
      showTip(i, ev.clientX, ev.clientY);
    });
    hover.addEventListener('mouseleave', hideTip);
  }
  // イベントマーカー: click/keyboard → タイムラインの該当項目へ（イベント一覧との連動）
  chartEl.querySelectorAll('.evm').forEach(function (g) {
    var go = function () {
      var date = g.getAttribute('data-date');
      var list = evByDate[date] || [];
      var m = list[+g.getAttribute('data-k')] || list[0];
      if (m && m.id) {
        var t = document.getElementById(m.id);
        if (t) { t.scrollIntoView({ behavior: 'smooth', block: 'center' }); t.style.background = '#FCF6E8'; setTimeout(function () { t.style.background = ''; }, 1600); }
      }
    };
    g.addEventListener('click', go);
    g.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); go(); } });
    g.addEventListener('focus', function () {
      var i = idxFor(g.getAttribute('data-date'));
      if (i !== null) { var box = g.getBoundingClientRect(); showTip(i, box.left + box.width / 2, box.bottom); }
    });
    g.addEventListener('blur', hideTip);
  });
})();

/* ---- 株主提案一覧の絞り込み（/activist-funds/shareholder-proposals/） ----
   選択肢はサーバー側で収載データから生成しているため、ここでは照合のみ行う。 */
(function () {
  var list = document.getElementById('propList');
  if (!list) { return; }
  var rows = Array.prototype.slice.call(list.querySelectorAll('.prop-row'));
  var y  = document.getElementById('pYear'),
      f  = document.getElementById('pFund'),
      c  = document.getElementById('pCat'),
      r  = document.getElementById('pResult'),
      jt = document.getElementById('pJoint'),
      ed = document.getElementById('pEdinet'),
      q  = document.getElementById('pq'),
      n  = document.getElementById('pCount'),
      em = document.getElementById('pEmpty');

  function apply() {
    var vy = y ? y.value : '', vf = f ? f.value : '', vc = c ? c.value : '',
        vr = r ? r.value : '', vj = jt ? jt.value : '', ve = ed ? ed.value : '',
        vq = q ? q.value.trim().toLowerCase() : '';
    var shown = 0;
    rows.forEach(function (el) {
      var ok = true;
      if (vy && el.getAttribute('data-year') !== vy) { ok = false; }
      if (ok && vf && el.getAttribute('data-fund') !== vf) { ok = false; }
      if (ok && vc) {
        var cats = (el.getAttribute('data-cats') || '').split('|');
        if (cats.indexOf(vc) === -1) { ok = false; }
      }
      if (ok && vr && el.getAttribute('data-result') !== vr) { ok = false; }
      if (ok && vj && el.getAttribute('data-joint') !== vj) { ok = false; }
      if (ok && ve && el.getAttribute('data-edinet') !== ve) { ok = false; }
      if (ok && vq && (el.getAttribute('data-search') || '').toLowerCase().indexOf(vq) === -1) { ok = false; }
      el.hidden = !ok;
      if (ok) { shown++; }
    });
    if (n) { n.textContent = shown + '件を表示（全' + rows.length + '件）'; }
    if (em) { em.hidden = shown !== 0; }
  }

  [y, f, c, r, jt, ed].forEach(function (el) { if (el) { el.addEventListener('change', apply); } });
  if (q) { q.addEventListener('input', apply); }
  apply();
})();


/* ---- 大量保有報告書の表示切替 ---------------------------------------
 * 初期表示は「新しい順」かつ「最新開示のみ展開」。
 * 並べ替えはDOMの入れ替えのみで、数値・差分には一切触れない。
 * JSが動かない環境でも、サーバー側が新しい順で出力しているため意味は変わらない。
 */
(function () {
  var list = document.getElementById('hrList');
  if (!list) { return; }
  var ctl = document.querySelector('.hr-ctl');
  if (!ctl) { return; }
  var items = Array.prototype.slice.call(list.querySelectorAll('.hr-item'));
  if (!items.length) { return; }

  // サーバー側の出力順（新しい順）を基準として保持する
  var descOrder = items.slice();
  var ascOrder = items.slice().reverse();

  function press(name, on) {
    var b = ctl.querySelector('[data-hr="' + name + '"]');
    if (b) { b.setAttribute('aria-pressed', on ? 'true' : 'false'); }
  }

  function order(dir) {
    var seq = (dir === 'asc') ? ascOrder : descOrder;
    seq.forEach(function (el) { list.appendChild(el); });
    press('desc', dir !== 'asc');
    press('asc', dir === 'asc');
  }

  function openOnly(el) {
    items.forEach(function (d) { d.open = (d === el); });
    press('latest', true);
  }

  ctl.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-hr]') : null;
    if (!b) { return; }
    var act = b.getAttribute('data-hr');
    if (act === 'expand') { items.forEach(function (d) { d.open = true; }); press('latest', false); }
    else if (act === 'collapse') { items.forEach(function (d) { d.open = false; }); press('latest', false); }
    else if (act === 'latest') { openOnly(descOrder[0]); }
    else if (act === 'asc' || act === 'desc') { order(act); }
  });

  list.addEventListener('toggle', function () { press('latest', false); }, true);
})();
