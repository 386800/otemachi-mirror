/* Otemachi Prep Membership — opm.js
   ヘッダー（検索トグル／アカウントメニュー）・フォーム（表示切替／二重送信防止／
   クライアント側バリデーション）・GA4イベント。
   グローバルナビの開閉は子テーマの otemachi-prep.js が担当するため、
   本スクリプトは同スクリプトが読み込まれていない場合のみ代替バインドする。 */
(function () {
  'use strict';

  var d = document;

  function on(el, ev, fn) { if (el) el.addEventListener(ev, fn); }
  function all(sel, root) { return Array.prototype.slice.call((root || d).querySelectorAll(sel)); }

  /* ---------------- GA4 ---------------- */
  function track(name, params) {
    try {
      if (typeof window.opmTrack === 'function') {
        var o = params ? JSON.parse(JSON.stringify(params)) : {};
        o.event = name;
        window.opmTrack(o);
      }
    } catch (e) { /* 計測失敗でUIは止めない */ }
  }

  d.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-ga4]') : null;
    if (!t) return;
    /* op-dash-v3: data-ga4-p='{"op_course":"lbo"}' のようなJSONを付けると、イベントパラメータとして併送する（省略可）。 */
    var p = null;
    if (t.hasAttribute('data-ga4-p')) { try { p = JSON.parse(t.getAttribute('data-ga4-p')); } catch (err) { p = null; } }
    track('op_' + t.getAttribute('data-ga4'), p);
  }, true);

  /* ---------------- ヘッダー：スクロール時に下段ナビだけ残す ----------------
     ヘッダー全体を sticky にし、top を「上段の実測高さ × -1」にする。
     JSが動かない場合は CSS 既定の 0px（ヘッダー全体が固定）にフォールバックする。 */
  (function () {
    var hdr = d.querySelector('.op-hdr2');
    var uh = d.querySelector('.op-hdr2 .op-uh');
    if (!hdr || !uh) return;
    var apply = function () {
      if (window.innerWidth <= 900) {
        hdr.style.setProperty('--opm-stick-top', '0px');
        return;
      }
      var h = Math.round(uh.getBoundingClientRect().height);
      hdr.style.setProperty('--opm-stick-top', h > 0 ? (-h + 'px') : '0px');
    };
    apply();
    window.addEventListener('resize', apply, { passive: true });
    window.addEventListener('load', apply);
  })();

  /* ---------------- ヘッダー：モバイル検索 ---------------- */
  var sToggle = d.querySelector('.op-hs-toggle');
  var sPanel = d.getElementById('opm-hs-m');
  on(sToggle, 'click', function () {
    var open = sPanel && !sPanel.hasAttribute('hidden');
    if (!sPanel) return;
    if (open) {
      sPanel.setAttribute('hidden', '');
      sToggle.setAttribute('aria-expanded', 'false');
    } else {
      sPanel.removeAttribute('hidden');
      sToggle.setAttribute('aria-expanded', 'true');
      var f = sPanel.querySelector('input[type="search"]');
      if (f) f.focus();
    }
  });

  /* ---------------- ヘッダー：アカウントメニュー ---------------- */
  var acct = d.querySelector('[data-opm-acct]');
  if (acct) {
    var aBtn = acct.querySelector('.op-acct-more');
    var aMenu = acct.querySelector('.op-acct-menu');
    var closeAcct = function () {
      if (!aMenu) return;
      aMenu.setAttribute('hidden', '');
      if (aBtn) aBtn.setAttribute('aria-expanded', 'false');
    };
    on(aBtn, 'click', function (e) {
      e.stopPropagation();
      if (!aMenu) return;
      if (aMenu.hasAttribute('hidden')) {
        aMenu.removeAttribute('hidden');
        aBtn.setAttribute('aria-expanded', 'true');
      } else {
        closeAcct();
      }
    });
    on(d, 'click', function (e) { if (!acct.contains(e.target)) closeAcct(); });
    on(d, 'keydown', function (e) { if (e.key === 'Escape') closeAcct(); });
  }

  /* ---------------- グローバルナビの開閉 ----------------
     ナビ開閉（ハンバーガー・ドロップダウン・Esc・scrolledクラス）は
     class-opm-assets.php の nav_js() からインライン出力している。
     WordPress.com Atomic ではプラグインエディタからの .js 書き込みが通らず、
     修正のたびに再アップロードが必要になるため、PHP側に置いている。 */

  /* ---------------- 空検索の抑止 ---------------- */
  all('form[role="search"]').forEach(function (f) {
    on(f, 'submit', function (e) {
      var i = f.querySelector('input[type="search"]');
      if (i && !i.value.trim()) {
        e.preventDefault();
        i.setAttribute('aria-invalid', 'true');
        i.focus();
        if (!f.querySelector('.op-hs-warn')) {
          var p = d.createElement('p');
          p.className = 'op-hs-warn op-err';
          p.setAttribute('role', 'alert');
          p.textContent = '検索キーワードを入力してください。';
          f.appendChild(p);
          setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, 4000);
        }
      }
    });
  });

  /* ---------------- パスワード表示切替 ---------------- */
  all('.op-pw-toggle').forEach(function (btn) {
    on(btn, 'click', function () {
      var input = d.getElementById(btn.getAttribute('data-target'));
      if (!input) return;
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.textContent = show ? '隠す' : '表示';
      btn.setAttribute('aria-pressed', show ? 'true' : 'false');
      btn.setAttribute('aria-label', show ? 'パスワードを隠す' : 'パスワードを表示');
    });
  });

  /* ---------------- フォーム：検証と二重送信防止 ---------------- */
  function setErr(fieldId, msg) {
    var input = d.getElementById(fieldId);
    if (!input) return;
    var wrap = input.closest('.op-field');
    var key = fieldId.replace('opm-reg-', '').replace('opm-login-', '');
    var box = d.getElementById('opm-err-' + key);
    if (msg) {
      if (wrap) wrap.classList.add('has-error');
      input.setAttribute('aria-invalid', 'true');
      if (box) {
        box.textContent = '';
        var ic = d.createElement('span');
        ic.className = 'op-err-ico';
        ic.setAttribute('aria-hidden', 'true');
        ic.textContent = '!';
        box.appendChild(ic);
        box.appendChild(d.createTextNode(msg));
        box.removeAttribute('hidden');
        box.setAttribute('role', 'alert');
      }
    } else {
      if (wrap) wrap.classList.remove('has-error');
      input.removeAttribute('aria-invalid');
      if (box) { box.textContent = ''; box.setAttribute('hidden', ''); }
    }
  }

  // 入力項目は メールアドレス / パスワード / パスワード確認 の3つ。
  // メールアドレスの確認欄は、メール認証フローに置き換えたため廃止。
  function validateRegister() {
    var ok = true;
    var email = d.getElementById('opm-reg-email');
    var pass = d.getElementById('opm-reg-pass');
    var pass2 = d.getElementById('opm-reg-pass2');

    if (!email || !email.value.trim()) { setErr('opm-reg-email', 'メールアドレスを入力してください'); ok = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { setErr('opm-reg-email', 'メールアドレスの形式が正しくありません'); ok = false; }
    else setErr('opm-reg-email', '');

    if (!pass || pass.value.length < 8) { setErr('opm-reg-pass', 'パスワードは8文字以上で設定してください'); ok = false; }
    else setErr('opm-reg-pass', '');

    if (pass && pass2 && pass.value.length >= 8 && pass.value !== pass2.value) { setErr('opm-reg-pass2', 'パスワードが一致していません'); ok = false; }
    else if (pass2) setErr('opm-reg-pass2', '');

    return ok;
  }

  all('[data-opm-form]').forEach(function (form) {
    var kind = form.getAttribute('data-opm-form');
    var btn = form.querySelector('[data-opm-submit]');
    var started = false;

    if (kind === 'register') {
      form.addEventListener('input', function () {
        if (!started) { started = true; track('op_register_start'); }
      }, { once: false });
    }

    // Enterでの意図しない送信は許容しつつ、送信は1回だけに制限する。
    on(form, 'submit', function (e) {
      if (form.dataset.opmBusy === '1') { e.preventDefault(); return; }

      if (kind === 'register' && !validateRegister()) {
        e.preventDefault();
        var firstErr = form.querySelector('.op-field.has-error input, .op-field.has-error');
        if (firstErr && firstErr.focus) firstErr.focus();
        return;
      }

      form.dataset.opmBusy = '1';
      if (btn) {
        btn.disabled = true;
        btn.classList.add('is-busy');
        btn.setAttribute('aria-busy', 'true');
        var label = btn.textContent;
        btn.textContent = kind === 'register' ? '登録しています' : '送信しています';
        // 何らかの理由で遷移しなかった場合に操作不能にならないよう復帰させる。
        setTimeout(function () {
          form.dataset.opmBusy = '';
          btn.disabled = false;
          btn.classList.remove('is-busy');
          btn.removeAttribute('aria-busy');
          btn.textContent = label;
        }, 12000);
      }
    });
  });

  /* ---------------- ページ内イベント ---------------- */
  all('[data-opm-ev]').forEach(function (el) {
    track('op_' + el.getAttribute('data-opm-ev'));
  });

  /* ---------------- 無料登録CTAの表示計測（設置場所ごとに1回） ----------------
     実際に表示されているものだけを数える。ヘッダー用とスマホ用のCTAは画面幅で
     出し分けているため、非表示のものまで数えると「表示回数」が実態とずれる。 */
  (function () {
    var seen = {};
    all('[data-opm-cta]').forEach(function (el) {
      // display:none の要素は offsetParent が null になる（position:fixed は別途 rect で判定）。
      var r = el.getBoundingClientRect();
      if (el.offsetParent === null && r.width === 0 && r.height === 0) return;
      if (r.width === 0 || r.height === 0) return;
      var loc = el.getAttribute('data-opm-cta') || 'other';
      if (seen[loc]) return;
      seen[loc] = true;
      track('op_cta_signup_view', { op_loc: loc });
    });
  })();

  /* ---------------- ソーシャルログイン：二重クリック防止 ---------------- */
  all('[data-opm-sso]').forEach(function (a) {
    on(a, 'click', function () {
      if (a.classList.contains('is-busy')) return;
      a.classList.add('is-busy');
      a.setAttribute('aria-disabled', 'true');
      setTimeout(function () {
        a.classList.remove('is-busy');
        a.removeAttribute('aria-disabled');
      }, 12000);
    });
  });

  /* ---------------- フッターの年号 ---------------- */
  var y = d.getElementById('year');
  if (y && !y.textContent.trim()) y.textContent = String(new Date().getFullYear());
})();
