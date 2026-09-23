/* ============================================================
 * op-gltip.js — 用語プレビュー（コンテキスト用語解説基盤）v1.0.0
 * - PC(hover/pointer:fine): 200ms遅延のホバー/フォーカスでポップオーバー表示。
 *   クリック/Enterで用語ページへ遷移。Esc・外側クリック・マウスアウトで閉じる。
 * - タッチ端末: 初回タップでボトムシート、シート内ボタンまたは同一用語の再タップで遷移。
 * - データはサーバーが当該ページで実際に使った用語だけを #op-gt-data に出力。
 * - 計測: window.opmTrack（既存dataLayerブリッジ）があれば使用、無ければdataLayer、
 *   どちらも無ければno-op。個人情報は送らない。preview_openはページ内で用語ごとに1回。
 * - JS無効時は通常の内部リンクとしてそのまま機能する（本スクリプトは装飾のみ）。
 * ============================================================ */
(function () {
	'use strict';
	var dataEl = document.getElementById('op-gt-data');
	if (!dataEl) { return; }
	var DB;
	try { DB = JSON.parse(dataEl.textContent || '{}'); } catch (e) { return; }
	var TERMS = DB.terms || {};
	var SRC_TYPE = DB.st || 'page';
	var SRC_PATH = location.pathname;

	/* ---- 計測（no-opラッパー・重複除外つき） ---- */
	var seenOpen = {};
	function track(ev, params) {
		try {
			var p = { event: ev, source_path: SRC_PATH, source_type: SRC_TYPE };
			for (var k in params) { p[k] = params[k]; }
			if (typeof window.opmTrack === 'function') { window.opmTrack(p); return; }
			window.dataLayer = window.dataLayer || [];
			window.dataLayer.push(p);
		} catch (err) { /* 計測失敗は本文閲覧を妨げない */ }
	}
	function trackOpen(slug, method) {
		if (seenOpen[slug]) { return; }
		seenOpen[slug] = true;
		var t = TERMS[slug];
		track('glossary_preview_open', { term_id: slug, canonical_term: t ? t.t : slug, input_method: method });
	}
	function trackClick(slug, method) {
		var t = TERMS[slug];
		track('glossary_term_click', { term_id: slug, canonical_term: t ? t.t : slug, input_method: method, destination_path: t ? t.u : '' });
	}

	function isTouchMode() {
		return window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)').matches;
	}
	function subLabel(t) {
		if (t.e && t.a && t.e !== t.a) { return t.e + '｜' + t.a; }
		return t.e || t.a || '';
	}

	/* ============================ PC: ポップオーバー ============================ */
	var pop = null, popName, popEn, popSd;
	var curAnchor = null, showTimer = 0, hideTimer = 0;

	function buildPop() {
		if (pop) { return; }
		pop = document.createElement('div');
		pop.className = 'op-gt-pop';
		pop.id = 'op-gt-pop';
		pop.setAttribute('role', 'tooltip');
		popName = document.createElement('p'); popName.className = 'gt-name';
		popEn = document.createElement('p'); popEn.className = 'gt-en';
		popSd = document.createElement('p'); popSd.className = 'gt-sd';
		var hint = document.createElement('span');
		hint.className = 'gt-hint';
		hint.innerHTML = 'クリックして詳しい解説へ <span class="ar">→</span>';
		pop.appendChild(popName); pop.appendChild(popEn); pop.appendChild(popSd); pop.appendChild(hint);
		document.body.appendChild(pop);
		pop.addEventListener('mouseenter', function () { clearTimeout(hideTimer); });
		pop.addEventListener('mouseleave', function () { scheduleHide(); });
	}
	function positionPop(a) {
		var r = a.getBoundingClientRect();
		pop.style.left = '0px'; pop.style.top = '0px';        // 一旦リセットして実寸を測る
		var pw = pop.offsetWidth, ph = pop.offsetHeight;
		var vw = window.innerWidth, vh = window.innerHeight;
		var x = r.left + (r.width / 2) - (pw / 2);
		x = Math.max(8, Math.min(x, vw - pw - 8));            // 左右端は画面内へクランプ
		var y = r.top - ph - 10;                              // 原則は上側
		if (y < 8) { y = r.bottom + 10; }                     // 上に収まらなければ下側
		if (y + ph > vh - 8) { y = Math.max(8, vh - ph - 8); }
		pop.style.left = x + 'px';
		pop.style.top = y + 'px';
	}
	function showPop(a, method) {
		var slug = a.getAttribute('data-gt');
		var t = TERMS[slug];
		if (!t) { return; }
		buildPop();
		popName.textContent = t.t;
		var sub = subLabel(t);
		popEn.textContent = sub;
		popEn.style.display = sub ? '' : 'none';
		popSd.textContent = t.s;
		curAnchor = a;
		a.setAttribute('aria-describedby', 'op-gt-pop');
		pop.classList.add('is-open');
		positionPop(a);
		trackOpen(slug, method);
	}
	function hidePop() {
		clearTimeout(showTimer); clearTimeout(hideTimer);
		if (pop) { pop.classList.remove('is-open'); }
		if (curAnchor) { curAnchor.removeAttribute('aria-describedby'); curAnchor = null; }
	}
	function scheduleHide() {
		clearTimeout(hideTimer);
		hideTimer = setTimeout(hidePop, 250);
	}

	document.addEventListener('mouseover', function (ev) {
		if (isTouchMode()) { return; }
		var a = ev.target && ev.target.closest ? ev.target.closest('a.op-gt[data-gt]') : null;
		if (!a) { return; }
		clearTimeout(hideTimer);
		if (curAnchor === a && pop && pop.classList.contains('is-open')) { return; }
		clearTimeout(showTimer);
		showTimer = setTimeout(function () { showPop(a, 'mouse'); }, 200); // 通過だけの点滅・誤発火を防ぐ表示遅延
	});
	document.addEventListener('mouseout', function (ev) {
		if (isTouchMode()) { return; }
		var a = ev.target && ev.target.closest ? ev.target.closest('a.op-gt[data-gt]') : null;
		if (!a) { return; }
		clearTimeout(showTimer);
		var to = ev.relatedTarget;
		if (to && pop && (to === pop || pop.contains(to))) { return; }    // ポップオーバーへの移動は閉じない
		scheduleHide();
	});
	document.addEventListener('focusin', function (ev) {
		if (isTouchMode()) { return; }
		var a = ev.target && ev.target.closest ? ev.target.closest('a.op-gt[data-gt]') : null;
		if (a) { clearTimeout(hideTimer); showPop(a, 'keyboard'); return; }
		if (pop && pop.classList.contains('is-open')) { hidePop(); }
	});
	document.addEventListener('keydown', function (ev) {
		if (ev.key !== 'Escape') { return; }
		if (sheetOpen) { closeSheet(true); ev.stopPropagation(); return; }
		if (pop && pop.classList.contains('is-open')) { hidePop(); }
	});
	document.addEventListener('scroll', function () {
		if (curAnchor && pop && pop.classList.contains('is-open')) { positionPop(curAnchor); }
	}, { passive: true });

	/* ============================ タッチ端末: ボトムシート ============================ */
	var sheet = null, backdrop = null, sheetName, sheetEn, sheetSd, sheetGo, sheetClose;
	var sheetOpen = false, sheetSlug = '', lastFocus = null, pushedState = false;

	function buildSheet() {
		if (sheet) { return; }
		backdrop = document.createElement('div');
		backdrop.className = 'op-gt-backdrop';
		backdrop.addEventListener('click', function () { closeSheet(true); });
		sheet = document.createElement('div');
		sheet.className = 'op-gt-sheet';
		sheet.id = 'op-gt-sheet';
		sheet.setAttribute('role', 'dialog');
		sheet.setAttribute('aria-modal', 'true');
		sheet.setAttribute('aria-labelledby', 'op-gt-sheet-name');
		var grab = document.createElement('div'); grab.className = 'gt-grab';
		sheetName = document.createElement('p'); sheetName.className = 'gt-name'; sheetName.id = 'op-gt-sheet-name';
		sheetEn = document.createElement('p'); sheetEn.className = 'gt-en';
		sheetSd = document.createElement('p'); sheetSd.className = 'gt-sd';
		sheetGo = document.createElement('a'); sheetGo.className = 'gt-go';
		sheetGo.innerHTML = '用語集で詳しく読む <span class="ar">→</span>';
		sheetGo.addEventListener('click', function () { trackClick(sheetSlug, 'touch'); });
		sheetClose = document.createElement('button');
		sheetClose.type = 'button';
		sheetClose.className = 'gt-close';
		sheetClose.setAttribute('aria-label', '閉じる');
		sheetClose.innerHTML = '×';
		sheetClose.addEventListener('click', function () { closeSheet(true); });
		sheet.appendChild(grab); sheet.appendChild(sheetClose); sheet.appendChild(sheetName);
		sheet.appendChild(sheetEn); sheet.appendChild(sheetSd); sheet.appendChild(sheetGo);
		document.body.appendChild(backdrop);
		document.body.appendChild(sheet);
		// 簡易フォーカストラップ（シート内の close ↔ リンクを循環）
		sheet.addEventListener('keydown', function (ev) {
			if (ev.key !== 'Tab') { return; }
			var f = [sheetClose, sheetGo];
			var idx = f.indexOf(document.activeElement);
			if (ev.shiftKey && idx <= 0) { ev.preventDefault(); f[f.length - 1].focus(); }
			else if (!ev.shiftKey && idx === f.length - 1) { ev.preventDefault(); f[0].focus(); }
		});
	}
	function openSheet(slug) {
		var t = TERMS[slug];
		if (!t) { return; }
		buildSheet();
		sheetName.textContent = t.t;
		var sub = subLabel(t);
		sheetEn.textContent = sub;
		sheetEn.style.display = sub ? '' : 'none';
		sheetSd.textContent = t.s;
		sheetGo.setAttribute('href', t.u);
		sheetSlug = slug;
		sheetOpen = true;
		lastFocus = document.activeElement;
		backdrop.classList.add('is-open');
		sheet.classList.add('is-open');
		document.documentElement.classList.add('op-gt-lock');
		try { history.pushState({ opGt: 1 }, ''); pushedState = true; } catch (e) { pushedState = false; }
		sheetClose.focus();
		trackOpen(slug, 'touch');
	}
	function closeSheet(viaUi) {
		if (!sheetOpen) { return; }
		sheetOpen = false;
		sheetSlug = '';
		backdrop.classList.remove('is-open');
		sheet.classList.remove('is-open');
		document.documentElement.classList.remove('op-gt-lock');
		if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
		if (viaUi && pushedState) {
			pushedState = false;
			try { history.back(); } catch (e2) {}
		}
	}
	window.addEventListener('popstate', function () {
		if (sheetOpen) { pushedState = false; closeSheet(false); } // 戻る操作で閉じる
	});

	document.addEventListener('click', function (ev) {
		var a = ev.target && ev.target.closest ? ev.target.closest('a.op-gt[data-gt]') : null;
		if (!a) { return; }
		var slug = a.getAttribute('data-gt');
		if (isTouchMode()) {
			if (sheetOpen && sheetSlug === slug) {              // 同一用語の再タップは詳細ページへ
				trackClick(slug, 'touch');
				closeSheet(false);
				return;                                         // 既定動作＝リンク遷移
			}
			ev.preventDefault();                                // 初回タップはシート表示
			openSheet(slug);
			return;
		}
		trackClick(slug, ev.detail === 0 ? 'keyboard' : 'mouse'); // Enterキー起動はdetail=0
	});
})();
