!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;"undefined"!=typeof window?t=window:"undefined"!=typeof global?t=global:"undefined"!=typeof self&&(t=self),t.sbjs=e()}}(function(){return function e(t,r,n){function a(s,o){if(!r[s]){if(!t[s]){var c="function"==typeof require&&require;if(!o&&c)return c(s,!0);if(i)return i(s,!0);var u=new Error("Cannot find module '"+s+"'");throw u.code="MODULE_NOT_FOUND",u}var p=r[s]={exports:{}};t[s][0].call(p.exports,function(e){var r=t[s][1][e];return a(r||e)},p,p.exports,e,t,r,n)}return r[s].exports}for(var i="function"==typeof require&&require,s=0;s<n.length;s++)a(n[s]);return a}({1:[function(e,t,r){"use strict";var n=e("./init"),a={init:function(e){this.get=n(e),e&&e.callback&&"function"==typeof e.callback&&e.callback(this.get)}};t.exports=a},{"./init":6}],2:[function(e,t,r){"use strict";var n=e("./terms"),a=e("./helpers/utils"),i={containers:{current:"sbjs_current",current_extra:"sbjs_current_add",first:"sbjs_first",first_extra:"sbjs_first_add",session:"sbjs_session",udata:"sbjs_udata",promocode:"sbjs_promo"},service:{migrations:"sbjs_migrations"},delimiter:"|||",aliases:{main:{type:"typ",source:"src",medium:"mdm",campaign:"cmp",content:"cnt",term:"trm",id:"id",platform:"plt",format:"fmt",tactic:"tct"},extra:{fire_date:"fd",entrance_point:"ep",referer:"rf"},session:{pages_seen:"pgs",current_page:"cpg"},udata:{visits:"vst",ip:"uip",agent:"uag"},promo:"code"},pack:{main:function(e){return i.aliases.main.type+"="+e.type+i.delimiter+i.aliases.main.source+"="+e.source+i.delimiter+i.aliases.main.medium+"="+e.medium+i.delimiter+i.aliases.main.campaign+"="+e.campaign+i.delimiter+i.aliases.main.content+"="+e.content+i.delimiter+i.aliases.main.term+"="+e.term+i.delimiter+i.aliases.main.id+"="+e.id+i.delimiter+i.aliases.main.platform+"="+e.platform+i.delimiter+i.aliases.main.format+"="+e.format+i.delimiter+i.aliases.main.tactic+"="+e.tactic},extra:function(e){return i.aliases.extra.fire_date+"="+a.setDate(new Date,e)+i.delimiter+i.aliases.extra.entrance_point+"="+document.location.href+i.delimiter+i.aliases.extra.referer+"="+(document.referrer||n.none)},user:function(e,t){return i.aliases.udata.visits+"="+e+i.delimiter+i.aliases.udata.ip+"="+t+i.delimiter+i.aliases.udata.agent+"="+navigator.userAgent},session:function(e){return i.aliases.session.pages_seen+"="+e+i.delimiter+i.aliases.session.current_page+"="+document.location.href},promo:function(e){return i.aliases.promo+"="+a.setLeadingZeroToInt(a.randomInt(e.min,e.max),e.max.toString().length)}}};t.exports=i},{"./helpers/utils":5,"./terms":9}],3:[function(e,t,r){"use strict";var n=e("../data").delimiter;t.exports={useBase64:!1,setBase64Flag:function(e){this.useBase64=e},encodeData:function(e){return encodeURIComponent(e).replace(/\!/g,"%21").replace(/\~/g,"%7E").replace(/\*/g,"%2A").replace(/\'/g,"%27").replace(/\(/g,"%28").replace(/\)/g,"%29")},decodeData:function(e){try{return decodeURIComponent(e).replace(/\%21/g,"!").replace(/\%7E/g,"~").replace(/\%2A/g,"*").replace(/\%27/g,"'").replace(/\%28/g,"(").replace(/\%29/g,")")}catch(t){try{return unescape(e)}catch(r){return""}}},set:function(e,t,r,n,a){var i,s;if(r){var o=new Date;o.setTime(o.getTime()+60*r*1e3),i="; expires="+o.toGMTString()}else i="";s=n&&!a?";domain=."+n:"";var c=this.encodeData(t);this.useBase64&&(c=btoa(c).replace(/=+$/,"")),document.cookie=this.encodeData(e)+"="+c+i+s+"; path=/"},get:function(e){for(var t=this.encodeData(e)+"=",r=document.cookie.split(";"),n=0;n<r.length;n++){for(var a=r[n];" "===a.charAt(0);)a=a.substring(1,a.length);if(0===a.indexOf(t)){var i=a.substring(t.length,a.length);if(/^[A-Za-z0-9+/]+$/.test(i))try{i=atob(i.padEnd(4*Math.ceil(i.length/4),"="))}catch(s){}return this.decodeData(i)}}return null},destroy:function(e,t,r){this.set(e,"",-1,t,r)},parse:function(e){var t=[],r={};if("string"==typeof e)t.push(e);else for(var a in e)e.hasOwnProperty(a)&&t.push(e[a]);for(var i=0;i<t.length;i++){var s;r[this.unsbjs(t[i])]={},s=this.get(t[i])?this.get(t[i]).split(n):[];for(var o=0;o<s.length;o++){var c=s[o].split("="),u=c.splice(0,1);u.push(c.join("=")),r[this.unsbjs(t[i])][u[0]]=this.decodeData(u[1])}}return r},unsbjs:function(e){return e.replace("sbjs_","")}}},{"../data":2}],4:[function(e,t,r){"use strict";t.exports={parse:function(e){for(var t=this.parseOptions,r=t.parser[t.strictMode?"strict":"loose"].exec(e),n={},a=14;a--;)n[t.key[a]]=r[a]||"";return n[t.q.name]={},n[t.key[12]].replace(t.q.parser,function(e,r,a){r&&(n[t.q.name][r]=a)}),n},parseOptions:{strictMode:!1,key:["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],q:{name:"queryKey",parser:/(?:^|&)([^&=]*)=?([^&]*)/g},parser:{strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/}},getParam:function(e){for(var t={},r=(e||window.location.search.substring(1)).split("&"),n=0;n<r.length;n++){var a=r[n].split("=");if("undefined"==typeof t[a[0]])t[a[0]]=a[1];else if("string"==typeof t[a[0]]){var i=[t[a[0]],a[1]];t[a[0]]=i}else t[a[0]].push(a[1])}return t},getHost:function(e){return this.parse(e).host.replace("www.","")}}},{}],5:[function(e,t,r){"use strict";t.exports={escapeRegexp:function(e){return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")},setDate:function(e,t){var r=e.getTimezoneOffset()/60,n=e.getHours(),a=t||0===t?t:-r;return e.setHours(n+r+a),e.getFullYear()+"-"+this.setLeadingZeroToInt(e.getMonth()+1,2)+"-"+this.setLeadingZeroToInt(e.getDate(),2)+" "+this.setLeadingZeroToInt(e.getHours(),2)+":"+this.setLeadingZeroToInt(e.getMinutes(),2)+":"+this.setLeadingZeroToInt(e.getSeconds(),2)},setLeadingZeroToInt:function(e,t){for(var r=e+"";r.length<t;)r="0"+r;return r},randomInt:function(e,t){return Math.floor(Math.random()*(t-e+1))+e}}},{}],6:[function(e,t,r){"use strict";var n=e("./data"),a=e("./terms"),i=e("./helpers/cookies"),s=e("./helpers/uri"),o=e("./helpers/utils"),c=e("./params"),u=e("./migrations");t.exports=function(e){var t,r,p,f,m,d,l,g,h,y,_,v,b,x=c.fetch(e),k=s.getParam(),w=x.domain.host,q=x.domain.isolate,I=x.lifetime;function j(e){switch(e){case a.traffic.utm:t=a.traffic.utm,r="undefined"!=typeof k.utm_source?k.utm_source:"undefined"!=typeof k.gclid?"google":"undefined"!=typeof k.yclid?"yandex":a.none,p="undefined"!=typeof k.utm_medium?k.utm_medium:"undefined"!=typeof k.gclid?"cpc":"undefined"!=typeof k.yclid?"cpc":a.none,f="undefined"!=typeof k.utm_campaign?k.utm_campaign:"undefined"!=typeof k[x.campaign_param]?k[x.campaign_param]:"undefined"!=typeof k.gclid?"google_cpc":"undefined"!=typeof k.yclid?"yandex_cpc":a.none,m="undefined"!=typeof k.utm_content?k.utm_content:"undefined"!=typeof k[x.content_param]?k[x.content_param]:a.none,l=k.utm_id||a.none,g=k.utm_source_platform||a.none,h=k.utm_creative_format||a.none,y=k.utm_marketing_tactic||a.none,d="undefined"!=typeof k.utm_term?k.utm_term:"undefined"!=typeof k[x.term_param]?k[x.term_param]:function(){var e=document.referrer;if(k.utm_term)return k.utm_term;if(!(e&&s.parse(e).host&&s.parse(e).host.match(/^(?:.*\.)?yandex\..{2,9}$/i)))return!1;try{return s.getParam(s.parse(document.referrer).query).text}catch(t){return!1}}()||a.none;break;case a.traffic.organic:t=a.traffic.organic,r=r||s.getHost(document.referrer),p=a.referer.organic,f=a.none,m=a.none,d=a.none,l=a.none,g=a.none,h=a.none,y=a.none;break;case a.traffic.referral:t=a.traffic.referral,r=r||s.getHost(document.referrer),p=p||a.referer.referral,f=a.none,m=s.parse(document.referrer).path,d=a.none,l=a.none,g=a.none,h=a.none,y=a.none;break;case a.traffic.typein:t=a.traffic.typein,r=x.typein_attributes.source,p=x.typein_attributes.medium,f=a.none,m=a.none,d=a.none,l=a.none,g=a.none,h=a.none,y=a.none;break;default:t=a.oops,r=a.oops,p=a.oops,f=a.oops,m=a.oops,d=a.oops,l=a.oops,g=a.oops,h=a.oops,y=a.oops}var i={type:t,source:r,medium:p,campaign:f,content:m,term:d,id:l,platform:g,format:h,tactic:y};return n.pack.main(i)}function R(e){var t=document.referrer;switch(e){case a.traffic.organic:return!!t&&H(t)&&function(e){var t=new RegExp("^(?:.*\\.)?"+o.escapeRegexp("yandex")+"\\..{2,9}$"),n=new RegExp(".*"+o.escapeRegexp("text")+"=.*"),a=new RegExp("^(?:www\\.)?"+o.escapeRegexp("google")+"\\..{2,9}$");if(s.parse(e).query&&s.parse(e).host.match(t)&&s.parse(e).query.match(n))return r="yandex",!0;if(s.parse(e).host.match(a))return r="google",!0;if(!s.parse(e).query)return!1;for(var i=0;i<x.organics.length;i++){if(s.parse(e).host.match(new RegExp("^(?:.*\\.)?"+o.escapeRegexp(x.organics[i].host)+"$","i"))&&s.parse(e).query.match(new RegExp(".*"+o.escapeRegexp(x.organics[i].param)+"=.*","i")))return r=x.organics[i].display||x.organics[i].host,!0;if(i+1===x.organics.length)return!1}}(t);case a.traffic.referral:return!!t&&H(t)&&function(e){if(!(x.referrals.length>0))return r=s.getHost(e),!0;for(var t=0;t<x.referrals.length;t++){if(s.parse(e).host.match(new RegExp("^(?:.*\\.)?"+o.escapeRegexp(x.referrals[t].host)+"$","i")))return r=x.referrals[t].display||x.referrals[t].host,p=x.referrals[t].medium||a.referer.referral,!0;if(t+1===x.referrals.length)return r=s.getHost(e),!0}}(t);default:return!1}}function H(e){if(x.domain){if(q)return s.getHost(e)!==s.getHost(w);var t=new RegExp("^(?:.*\\.)?"+o.escapeRegexp(w)+"$","i");return!s.getHost(e).match(t)}return s.getHost(e)!==s.getHost(document.location.href)}function D(){i.set(n.containers.current_extra,n.pack.extra(x.timezone_offset),I,w,q),i.get(n.containers.first_extra)||i.set(n.containers.first_extra,n.pack.extra(x.timezone_offset),I,w,q)}return i.setBase64Flag(x.base64),u.go(I,w,q),i.set(n.containers.current,function(){var e;if("undefined"!=typeof k.utm_source||"undefined"!=typeof k.utm_medium||"undefined"!=typeof k.utm_campaign||"undefined"!=typeof k.utm_content||"undefined"!=typeof k.utm_term||"undefined"!=typeof k.utm_id||"undefined"!=typeof k.utm_source_platform||"undefined"!=typeof k.utm_creative_format||"undefined"!=typeof k.utm_marketing_tactic||"undefined"!=typeof k.gclid||"undefined"!=typeof k.yclid||"undefined"!=typeof k[x.campaign_param]||"undefined"!=typeof k[x.term_param]||"undefined"!=typeof k[x.content_param])D(),e=j(a.traffic.utm);else if(R(a.traffic.organic))D(),e=j(a.traffic.organic);else if(!i.get(n.containers.session)&&R(a.traffic.referral))D(),e=j(a.traffic.referral);else{if(i.get(n.containers.first)||i.get(n.containers.current))return i.get(n.containers.current);D(),e=j(a.traffic.typein)}return e}(),I,w,q),i.get(n.containers.first)||i.set(n.containers.first,i.get(n.containers.current),I,w,q),i.get(n.containers.udata)?(_=parseInt(i.parse(n.containers.udata)[i.unsbjs(n.containers.udata)][n.aliases.udata.visits])||1,_=i.get(n.containers.session)?_:_+1,v=n.pack.user(_,x.user_ip)):(_=1,v=n.pack.user(_,x.user_ip)),i.set(n.containers.udata,v,I,w,q),i.get(n.containers.session)?(b=parseInt(i.parse(n.containers.session)[i.unsbjs(n.containers.session)][n.aliases.session.pages_seen])||1,b+=1):b=1,i.set(n.containers.session,n.pack.session(b),x.session_length,w,q),x.promocode&&!i.get(n.containers.promocode)&&i.set(n.containers.promocode,n.pack.promo(x.promocode),I,w,q),i.parse(n.containers)}},{"./data":2,"./helpers/cookies":3,"./helpers/uri":4,"./helpers/utils":5,"./migrations":7,"./params":8,"./terms":9}],7:[function(e,t,r){"use strict";var n=e("./data"),a=e("./helpers/cookies");t.exports={go:function(e,t,r){var i,s=this.migrations,o={l:e,d:t,i:r};if(a.get(n.containers.first)||a.get(n.service.migrations)){if(!a.get(n.service.migrations))for(i=0;i<s.length;i++)s[i].go(s[i].id,o)}else{var c=[];for(i=0;i<s.length;i++)c.push(s[i].id);var u="";for(i=0;i<c.length;i++)u+=c[i]+"=1",i<c.length-1&&(u+=n.delimiter);a.set(n.service.migrations,u,o.l,o.d,o.i)}},migrations:[{id:"1418474375998",version:"1.0.0-beta",go:function(e,t){var r=e+"=1",i=e+"=0",s=function(e,t,r){return t||r?e:n.delimiter};try{var o=[];for(var c in n.containers)n.containers.hasOwnProperty(c)&&o.push(n.containers[c]);for(var u=0;u<o.length;u++)if(a.get(o[u])){var p=a.get(o[u]).replace(/(\|)?\|(\|)?/g,s);a.destroy(o[u],t.d,t.i),a.destroy(o[u],t.d,!t.i),a.set(o[u],p,t.l,t.d,t.i)}a.get(n.containers.session)&&a.set(n.containers.session,n.pack.session(0),t.l,t.d,t.i),a.set(n.service.migrations,r,t.l,t.d,t.i)}catch(f){a.set(n.service.migrations,i,t.l,t.d,t.i)}}}]}},{"./data":2,"./helpers/cookies":3}],8:[function(e,t,r){"use strict";var n=e("./terms"),a=e("./helpers/uri");t.exports={fetch:function(e){var t=e||{},r={};if(r.lifetime=this.validate.checkFloat(t.lifetime)||6,r.lifetime=parseInt(30*r.lifetime*24*60),r.session_length=this.validate.checkInt(t.session_length)||30,r.timezone_offset=this.validate.checkInt(t.timezone_offset),r.base64=t.base64||!1,r.campaign_param=t.campaign_param||!1,r.term_param=t.term_param||!1,r.content_param=t.content_param||!1,r.user_ip=t.user_ip||n.none,t.promocode?(r.promocode={},r.promocode.min=parseInt(t.promocode.min)||1e5,r.promocode.max=parseInt(t.promocode.max)||999999):r.promocode=!1,t.typein_attributes&&t.typein_attributes.source&&t.typein_attributes.medium?(r.typein_attributes={},r.typein_attributes.source=t.typein_attributes.source,r.typein_attributes.medium=t.typein_attributes.medium):r.typein_attributes={source:"(direct)",medium:"(none)"},t.domain&&this.validate.isString(t.domain)?r.domain={host:t.domain,isolate:!1}:t.domain&&t.domain.host?r.domain=t.domain:r.domain={host:a.getHost(document.location.hostname),isolate:!1},r.referrals=[],t.referrals&&t.referrals.length>0)for(var i=0;i<t.referrals.length;i++)t.referrals[i].host&&r.referrals.push(t.referrals[i]);if(r.organics=[],t.organics&&t.organics.length>0)for(var s=0;s<t.organics.length;s++)t.organics[s].host&&t.organics[s].param&&r.organics.push(t.organics[s]);return r.organics.push({host:"bing.com",param:"q",display:"bing"}),r.organics.push({host:"yahoo.com",param:"p",display:"yahoo"}),r.organics.push({host:"about.com",param:"q",display:"about"}),r.organics.push({host:"aol.com",param:"q",display:"aol"}),r.organics.push({host:"ask.com",param:"q",display:"ask"}),r.organics.push({host:"globososo.com",param:"q",display:"globo"}),r.organics.push({host:"go.mail.ru",param:"q",display:"go.mail.ru"}),r.organics.push({host:"rambler.ru",param:"query",display:"rambler"}),r.organics.push({host:"tut.by",param:"query",display:"tut.by"}),r.referrals.push({host:"t.co",display:"twitter.com"}),r.referrals.push({host:"plus.url.google.com",display:"plus.google.com"}),r},validate:{checkFloat:function(e){return!(!e||!this.isNumeric(parseFloat(e)))&&parseFloat(e)},checkInt:function(e){return!(!e||!this.isNumeric(parseInt(e)))&&parseInt(e)},isNumeric:function(e){return!isNaN(e)},isString:function(e){return"[object String]"===Object.prototype.toString.call(e)}}}},{"./helpers/uri":4,"./terms":9}],9:[function(e,t,r){"use strict";t.exports={traffic:{utm:"utm",organic:"organic",referral:"referral",typein:"typein"},referer:{referral:"referral",organic:"organic",social:"social"},none:"(none)",oops:"(Houston, we have a problem)"}},{}]},{},[1])(1)});;
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
;
