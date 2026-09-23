!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;"undefined"!=typeof window?t=window:"undefined"!=typeof global?t=global:"undefined"!=typeof self&&(t=self),t.sbjs=e()}}(function(){return function e(t,r,n){function a(s,o){if(!r[s]){if(!t[s]){var c="function"==typeof require&&require;if(!o&&c)return c(s,!0);if(i)return i(s,!0);var u=new Error("Cannot find module '"+s+"'");throw u.code="MODULE_NOT_FOUND",u}var p=r[s]={exports:{}};t[s][0].call(p.exports,function(e){var r=t[s][1][e];return a(r||e)},p,p.exports,e,t,r,n)}return r[s].exports}for(var i="function"==typeof require&&require,s=0;s<n.length;s++)a(n[s]);return a}({1:[function(e,t,r){"use strict";var n=e("./init"),a={init:function(e){this.get=n(e),e&&e.callback&&"function"==typeof e.callback&&e.callback(this.get)}};t.exports=a},{"./init":6}],2:[function(e,t,r){"use strict";var n=e("./terms"),a=e("./helpers/utils"),i={containers:{current:"sbjs_current",current_extra:"sbjs_current_add",first:"sbjs_first",first_extra:"sbjs_first_add",session:"sbjs_session",udata:"sbjs_udata",promocode:"sbjs_promo"},service:{migrations:"sbjs_migrations"},delimiter:"|||",aliases:{main:{type:"typ",source:"src",medium:"mdm",campaign:"cmp",content:"cnt",term:"trm",id:"id",platform:"plt",format:"fmt",tactic:"tct"},extra:{fire_date:"fd",entrance_point:"ep",referer:"rf"},session:{pages_seen:"pgs",current_page:"cpg"},udata:{visits:"vst",ip:"uip",agent:"uag"},promo:"code"},pack:{main:function(e){return i.aliases.main.type+"="+e.type+i.delimiter+i.aliases.main.source+"="+e.source+i.delimiter+i.aliases.main.medium+"="+e.medium+i.delimiter+i.aliases.main.campaign+"="+e.campaign+i.delimiter+i.aliases.main.content+"="+e.content+i.delimiter+i.aliases.main.term+"="+e.term+i.delimiter+i.aliases.main.id+"="+e.id+i.delimiter+i.aliases.main.platform+"="+e.platform+i.delimiter+i.aliases.main.format+"="+e.format+i.delimiter+i.aliases.main.tactic+"="+e.tactic},extra:function(e){return i.aliases.extra.fire_date+"="+a.setDate(new Date,e)+i.delimiter+i.aliases.extra.entrance_point+"="+document.location.href+i.delimiter+i.aliases.extra.referer+"="+(document.referrer||n.none)},user:function(e,t){return i.aliases.udata.visits+"="+e+i.delimiter+i.aliases.udata.ip+"="+t+i.delimiter+i.aliases.udata.agent+"="+navigator.userAgent},session:function(e){return i.aliases.session.pages_seen+"="+e+i.delimiter+i.aliases.session.current_page+"="+document.location.href},promo:function(e){return i.aliases.promo+"="+a.setLeadingZeroToInt(a.randomInt(e.min,e.max),e.max.toString().length)}}};t.exports=i},{"./helpers/utils":5,"./terms":9}],3:[function(e,t,r){"use strict";var n=e("../data").delimiter;t.exports={useBase64:!1,setBase64Flag:function(e){this.useBase64=e},encodeData:function(e){return encodeURIComponent(e).replace(/\!/g,"%21").replace(/\~/g,"%7E").replace(/\*/g,"%2A").replace(/\'/g,"%27").replace(/\(/g,"%28").replace(/\)/g,"%29")},decodeData:function(e){try{return decodeURIComponent(e).replace(/\%21/g,"!").replace(/\%7E/g,"~").replace(/\%2A/g,"*").replace(/\%27/g,"'").replace(/\%28/g,"(").replace(/\%29/g,")")}catch(t){try{return unescape(e)}catch(r){return""}}},set:function(e,t,r,n,a){var i,s;if(r){var o=new Date;o.setTime(o.getTime()+60*r*1e3),i="; expires="+o.toGMTString()}else i="";s=n&&!a?";domain=."+n:"";var c=this.encodeData(t);this.useBase64&&(c=btoa(c).replace(/=+$/,"")),document.cookie=this.encodeData(e)+"="+c+i+s+"; path=/"},get:function(e){for(var t=this.encodeData(e)+"=",r=document.cookie.split(";"),n=0;n<r.length;n++){for(var a=r[n];" "===a.charAt(0);)a=a.substring(1,a.length);if(0===a.indexOf(t)){var i=a.substring(t.length,a.length);if(/^[A-Za-z0-9+/]+$/.test(i))try{i=atob(i.padEnd(4*Math.ceil(i.length/4),"="))}catch(s){}return this.decodeData(i)}}return null},destroy:function(e,t,r){this.set(e,"",-1,t,r)},parse:function(e){var t=[],r={};if("string"==typeof e)t.push(e);else for(var a in e)e.hasOwnProperty(a)&&t.push(e[a]);for(var i=0;i<t.length;i++){var s;r[this.unsbjs(t[i])]={},s=this.get(t[i])?this.get(t[i]).split(n):[];for(var o=0;o<s.length;o++){var c=s[o].split("="),u=c.splice(0,1);u.push(c.join("=")),r[this.unsbjs(t[i])][u[0]]=this.decodeData(u[1])}}return r},unsbjs:function(e){return e.replace("sbjs_","")}}},{"../data":2}],4:[function(e,t,r){"use strict";t.exports={parse:function(e){for(var t=this.parseOptions,r=t.parser[t.strictMode?"strict":"loose"].exec(e),n={},a=14;a--;)n[t.key[a]]=r[a]||"";return n[t.q.name]={},n[t.key[12]].replace(t.q.parser,function(e,r,a){r&&(n[t.q.name][r]=a)}),n},parseOptions:{strictMode:!1,key:["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],q:{name:"queryKey",parser:/(?:^|&)([^&=]*)=?([^&]*)/g},parser:{strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/}},getParam:function(e){for(var t={},r=(e||window.location.search.substring(1)).split("&"),n=0;n<r.length;n++){var a=r[n].split("=");if("undefined"==typeof t[a[0]])t[a[0]]=a[1];else if("string"==typeof t[a[0]]){var i=[t[a[0]],a[1]];t[a[0]]=i}else t[a[0]].push(a[1])}return t},getHost:function(e){return this.parse(e).host.replace("www.","")}}},{}],5:[function(e,t,r){"use strict";t.exports={escapeRegexp:function(e){return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")},setDate:function(e,t){var r=e.getTimezoneOffset()/60,n=e.getHours(),a=t||0===t?t:-r;return e.setHours(n+r+a),e.getFullYear()+"-"+this.setLeadingZeroToInt(e.getMonth()+1,2)+"-"+this.setLeadingZeroToInt(e.getDate(),2)+" "+this.setLeadingZeroToInt(e.getHours(),2)+":"+this.setLeadingZeroToInt(e.getMinutes(),2)+":"+this.setLeadingZeroToInt(e.getSeconds(),2)},setLeadingZeroToInt:function(e,t){for(var r=e+"";r.length<t;)r="0"+r;return r},randomInt:function(e,t){return Math.floor(Math.random()*(t-e+1))+e}}},{}],6:[function(e,t,r){"use strict";var n=e("./data"),a=e("./terms"),i=e("./helpers/cookies"),s=e("./helpers/uri"),o=e("./helpers/utils"),c=e("./params"),u=e("./migrations");t.exports=function(e){var t,r,p,f,m,d,l,g,h,y,_,v,b,x=c.fetch(e),k=s.getParam(),w=x.domain.host,q=x.domain.isolate,I=x.lifetime;function j(e){switch(e){case a.traffic.utm:t=a.traffic.utm,r="undefined"!=typeof k.utm_source?k.utm_source:"undefined"!=typeof k.gclid?"google":"undefined"!=typeof k.yclid?"yandex":a.none,p="undefined"!=typeof k.utm_medium?k.utm_medium:"undefined"!=typeof k.gclid?"cpc":"undefined"!=typeof k.yclid?"cpc":a.none,f="undefined"!=typeof k.utm_campaign?k.utm_campaign:"undefined"!=typeof k[x.campaign_param]?k[x.campaign_param]:"undefined"!=typeof k.gclid?"google_cpc":"undefined"!=typeof k.yclid?"yandex_cpc":a.none,m="undefined"!=typeof k.utm_content?k.utm_content:"undefined"!=typeof k[x.content_param]?k[x.content_param]:a.none,l=k.utm_id||a.none,g=k.utm_source_platform||a.none,h=k.utm_creative_format||a.none,y=k.utm_marketing_tactic||a.none,d="undefined"!=typeof k.utm_term?k.utm_term:"undefined"!=typeof k[x.term_param]?k[x.term_param]:function(){var e=document.referrer;if(k.utm_term)return k.utm_term;if(!(e&&s.parse(e).host&&s.parse(e).host.match(/^(?:.*\.)?yandex\..{2,9}$/i)))return!1;try{return s.getParam(s.parse(document.referrer).query).text}catch(t){return!1}}()||a.none;break;case a.traffic.organic:t=a.traffic.organic,r=r||s.getHost(document.referrer),p=a.referer.organic,f=a.none,m=a.none,d=a.none,l=a.none,g=a.none,h=a.none,y=a.none;break;case a.traffic.referral:t=a.traffic.referral,r=r||s.getHost(document.referrer),p=p||a.referer.referral,f=a.none,m=s.parse(document.referrer).path,d=a.none,l=a.none,g=a.none,h=a.none,y=a.none;break;case a.traffic.typein:t=a.traffic.typein,r=x.typein_attributes.source,p=x.typein_attributes.medium,f=a.none,m=a.none,d=a.none,l=a.none,g=a.none,h=a.none,y=a.none;break;default:t=a.oops,r=a.oops,p=a.oops,f=a.oops,m=a.oops,d=a.oops,l=a.oops,g=a.oops,h=a.oops,y=a.oops}var i={type:t,source:r,medium:p,campaign:f,content:m,term:d,id:l,platform:g,format:h,tactic:y};return n.pack.main(i)}function R(e){var t=document.referrer;switch(e){case a.traffic.organic:return!!t&&H(t)&&function(e){var t=new RegExp("^(?:.*\\.)?"+o.escapeRegexp("yandex")+"\\..{2,9}$"),n=new RegExp(".*"+o.escapeRegexp("text")+"=.*"),a=new RegExp("^(?:www\\.)?"+o.escapeRegexp("google")+"\\..{2,9}$");if(s.parse(e).query&&s.parse(e).host.match(t)&&s.parse(e).query.match(n))return r="yandex",!0;if(s.parse(e).host.match(a))return r="google",!0;if(!s.parse(e).query)return!1;for(var i=0;i<x.organics.length;i++){if(s.parse(e).host.match(new RegExp("^(?:.*\\.)?"+o.escapeRegexp(x.organics[i].host)+"$","i"))&&s.parse(e).query.match(new RegExp(".*"+o.escapeRegexp(x.organics[i].param)+"=.*","i")))return r=x.organics[i].display||x.organics[i].host,!0;if(i+1===x.organics.length)return!1}}(t);case a.traffic.referral:return!!t&&H(t)&&function(e){if(!(x.referrals.length>0))return r=s.getHost(e),!0;for(var t=0;t<x.referrals.length;t++){if(s.parse(e).host.match(new RegExp("^(?:.*\\.)?"+o.escapeRegexp(x.referrals[t].host)+"$","i")))return r=x.referrals[t].display||x.referrals[t].host,p=x.referrals[t].medium||a.referer.referral,!0;if(t+1===x.referrals.length)return r=s.getHost(e),!0}}(t);default:return!1}}function H(e){if(x.domain){if(q)return s.getHost(e)!==s.getHost(w);var t=new RegExp("^(?:.*\\.)?"+o.escapeRegexp(w)+"$","i");return!s.getHost(e).match(t)}return s.getHost(e)!==s.getHost(document.location.href)}function D(){i.set(n.containers.current_extra,n.pack.extra(x.timezone_offset),I,w,q),i.get(n.containers.first_extra)||i.set(n.containers.first_extra,n.pack.extra(x.timezone_offset),I,w,q)}return i.setBase64Flag(x.base64),u.go(I,w,q),i.set(n.containers.current,function(){var e;if("undefined"!=typeof k.utm_source||"undefined"!=typeof k.utm_medium||"undefined"!=typeof k.utm_campaign||"undefined"!=typeof k.utm_content||"undefined"!=typeof k.utm_term||"undefined"!=typeof k.utm_id||"undefined"!=typeof k.utm_source_platform||"undefined"!=typeof k.utm_creative_format||"undefined"!=typeof k.utm_marketing_tactic||"undefined"!=typeof k.gclid||"undefined"!=typeof k.yclid||"undefined"!=typeof k[x.campaign_param]||"undefined"!=typeof k[x.term_param]||"undefined"!=typeof k[x.content_param])D(),e=j(a.traffic.utm);else if(R(a.traffic.organic))D(),e=j(a.traffic.organic);else if(!i.get(n.containers.session)&&R(a.traffic.referral))D(),e=j(a.traffic.referral);else{if(i.get(n.containers.first)||i.get(n.containers.current))return i.get(n.containers.current);D(),e=j(a.traffic.typein)}return e}(),I,w,q),i.get(n.containers.first)||i.set(n.containers.first,i.get(n.containers.current),I,w,q),i.get(n.containers.udata)?(_=parseInt(i.parse(n.containers.udata)[i.unsbjs(n.containers.udata)][n.aliases.udata.visits])||1,_=i.get(n.containers.session)?_:_+1,v=n.pack.user(_,x.user_ip)):(_=1,v=n.pack.user(_,x.user_ip)),i.set(n.containers.udata,v,I,w,q),i.get(n.containers.session)?(b=parseInt(i.parse(n.containers.session)[i.unsbjs(n.containers.session)][n.aliases.session.pages_seen])||1,b+=1):b=1,i.set(n.containers.session,n.pack.session(b),x.session_length,w,q),x.promocode&&!i.get(n.containers.promocode)&&i.set(n.containers.promocode,n.pack.promo(x.promocode),I,w,q),i.parse(n.containers)}},{"./data":2,"./helpers/cookies":3,"./helpers/uri":4,"./helpers/utils":5,"./migrations":7,"./params":8,"./terms":9}],7:[function(e,t,r){"use strict";var n=e("./data"),a=e("./helpers/cookies");t.exports={go:function(e,t,r){var i,s=this.migrations,o={l:e,d:t,i:r};if(a.get(n.containers.first)||a.get(n.service.migrations)){if(!a.get(n.service.migrations))for(i=0;i<s.length;i++)s[i].go(s[i].id,o)}else{var c=[];for(i=0;i<s.length;i++)c.push(s[i].id);var u="";for(i=0;i<c.length;i++)u+=c[i]+"=1",i<c.length-1&&(u+=n.delimiter);a.set(n.service.migrations,u,o.l,o.d,o.i)}},migrations:[{id:"1418474375998",version:"1.0.0-beta",go:function(e,t){var r=e+"=1",i=e+"=0",s=function(e,t,r){return t||r?e:n.delimiter};try{var o=[];for(var c in n.containers)n.containers.hasOwnProperty(c)&&o.push(n.containers[c]);for(var u=0;u<o.length;u++)if(a.get(o[u])){var p=a.get(o[u]).replace(/(\|)?\|(\|)?/g,s);a.destroy(o[u],t.d,t.i),a.destroy(o[u],t.d,!t.i),a.set(o[u],p,t.l,t.d,t.i)}a.get(n.containers.session)&&a.set(n.containers.session,n.pack.session(0),t.l,t.d,t.i),a.set(n.service.migrations,r,t.l,t.d,t.i)}catch(f){a.set(n.service.migrations,i,t.l,t.d,t.i)}}}]}},{"./data":2,"./helpers/cookies":3}],8:[function(e,t,r){"use strict";var n=e("./terms"),a=e("./helpers/uri");t.exports={fetch:function(e){var t=e||{},r={};if(r.lifetime=this.validate.checkFloat(t.lifetime)||6,r.lifetime=parseInt(30*r.lifetime*24*60),r.session_length=this.validate.checkInt(t.session_length)||30,r.timezone_offset=this.validate.checkInt(t.timezone_offset),r.base64=t.base64||!1,r.campaign_param=t.campaign_param||!1,r.term_param=t.term_param||!1,r.content_param=t.content_param||!1,r.user_ip=t.user_ip||n.none,t.promocode?(r.promocode={},r.promocode.min=parseInt(t.promocode.min)||1e5,r.promocode.max=parseInt(t.promocode.max)||999999):r.promocode=!1,t.typein_attributes&&t.typein_attributes.source&&t.typein_attributes.medium?(r.typein_attributes={},r.typein_attributes.source=t.typein_attributes.source,r.typein_attributes.medium=t.typein_attributes.medium):r.typein_attributes={source:"(direct)",medium:"(none)"},t.domain&&this.validate.isString(t.domain)?r.domain={host:t.domain,isolate:!1}:t.domain&&t.domain.host?r.domain=t.domain:r.domain={host:a.getHost(document.location.hostname),isolate:!1},r.referrals=[],t.referrals&&t.referrals.length>0)for(var i=0;i<t.referrals.length;i++)t.referrals[i].host&&r.referrals.push(t.referrals[i]);if(r.organics=[],t.organics&&t.organics.length>0)for(var s=0;s<t.organics.length;s++)t.organics[s].host&&t.organics[s].param&&r.organics.push(t.organics[s]);return r.organics.push({host:"bing.com",param:"q",display:"bing"}),r.organics.push({host:"yahoo.com",param:"p",display:"yahoo"}),r.organics.push({host:"about.com",param:"q",display:"about"}),r.organics.push({host:"aol.com",param:"q",display:"aol"}),r.organics.push({host:"ask.com",param:"q",display:"ask"}),r.organics.push({host:"globososo.com",param:"q",display:"globo"}),r.organics.push({host:"go.mail.ru",param:"q",display:"go.mail.ru"}),r.organics.push({host:"rambler.ru",param:"query",display:"rambler"}),r.organics.push({host:"tut.by",param:"query",display:"tut.by"}),r.referrals.push({host:"t.co",display:"twitter.com"}),r.referrals.push({host:"plus.url.google.com",display:"plus.google.com"}),r},validate:{checkFloat:function(e){return!(!e||!this.isNumeric(parseFloat(e)))&&parseFloat(e)},checkInt:function(e){return!(!e||!this.isNumeric(parseInt(e)))&&parseInt(e)},isNumeric:function(e){return!isNaN(e)},isString:function(e){return"[object String]"===Object.prototype.toString.call(e)}}}},{"./helpers/uri":4,"./terms":9}],9:[function(e,t,r){"use strict";t.exports={traffic:{utm:"utm",organic:"organic",referral:"referral",typein:"typein"},referer:{referral:"referral",organic:"organic",social:"social"},none:"(none)",oops:"(Houston, we have a problem)"}},{}]},{},[1])(1)});;
/* ================================================================
 * op-pe-search v1: PEファンドDB 検索エンジン（純粋関数・DOM非依存）
 *
 * 設計（2026-08 検索根本改善）:
 *  - 検索対象を「運用会社名 / ファンド属性 / 投資先」の3階層に構造化し、
 *    どのフィールドが一致したかを結果オブジェクトで返す（ブロブ連結+includesを廃止）。
 *  - relevance score によるランキング。優先順位は
 *      社名 Exact > Prefix > Substring > 別称(slug等) > Fuzzy > ファンド属性 > 投資先
 *  - 特定の検索語・特定ファンドへのハードコードは持たない。
 *  - 一覧(op-page-pe-funds.js)と URL ?q= の双方がこの1実装だけを使う。
 *  - Node からも読み込めるため回帰テスト可能（module.exports）。
 *
 * インデックス入力（PHP op_pe_search_index() が JSON で出力）:
 *   [{ s:slug, nj:日本語社名, ne:英語社名, at:[属性文字列...],
 *      pf:[[表示名, 業種表示, 追加検索キー(正規化済)], ...] }, ...]
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
    'エクイティ', 'ホールディングス', 'グループ',
    'capitalpartners', 'equitypartners', 'privateequity',
    'partners', 'capital', 'equity',
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
  root.opPeSearch = api;
})(typeof window !== 'undefined' ? window : globalThis);
;
document.documentElement.classList.add('js');

(function(){
  'use strict';
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header=document.getElementById('siteHeader');
  window.addEventListener('scroll',function(){header.classList.toggle('scrolled',window.scrollY>10);},{passive:true});
  var btn=document.querySelector('.menu-toggle');
  var nav=document.getElementById('gnav');
  if(btn&&nav){btn.addEventListener('click',function(){var o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',o?'true':'false');});}
  var targets=document.querySelectorAll('[data-reveal]');
  if('IntersectionObserver' in window && !reduced){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target);}});},{threshold:.15});
    targets.forEach(function(t){io.observe(t);});
  }else{targets.forEach(function(t){t.classList.add('is-in');});}
  var y=document.getElementById('year');
  if(y){y.textContent=new Date().getFullYear();}
})();

(function(){var t=document.querySelector(".to-top");if(!t)return;var f=function(){t.classList.toggle("show",window.scrollY>600)};window.addEventListener("scroll",f,{passive:true});f();t.addEventListener("click",function(e){e.preventDefault();window.scrollTo({top:0,behavior:"smooth"});});})();

(function(){
if(!document.body.classList.contains('has-ctabar')){var b=document.createElement('div');b.className='reading-progress';document.body.appendChild(b);var d=document.documentElement;var f=function(){var m=d.scrollHeight-window.innerHeight;b.style.transform='scaleX('+(m>0?Math.min(1,window.scrollY/m):0)+')';};window.addEventListener('scroll',f,{passive:true});f();}
var links=[].slice.call(document.querySelectorAll('.toc a'));links=links.filter(function(l){return (l.getAttribute('href')||'').charAt(0)==='#'});
if(links.length&&'IntersectionObserver' in window){var map={},cur=null;
links.forEach(function(l){var el=document.getElementById(l.getAttribute('href').slice(1));if(el)map[el.id]=l;});
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&map[e.target.id]){if(cur)cur.classList.remove('active');cur=map[e.target.id];cur.classList.add('active');}});},{rootMargin:'-15% 0px -70% 0px'});
Object.keys(map).forEach(function(id){io.observe(document.getElementById(id))});}
})();

/* op-motion-v1 */
(function(){'use strict';
if(window.__opMotion)return;window.__opMotion=1;
var d=document,reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
/* --- 1. scroll reveal (existing [data-reveal]/.is-in aesthetics) --- */
if(!reduced&&('IntersectionObserver' in window)){
  var sels=['.hub-card','.g-head','a.lib-item','.kb-card','.summary-box','.article-body h2[id]','.article-body .tbl-scroll','.article-body .cta-inline','.article-body .src-box','.side-cta','.side .toc','.related h2'];
  var cand=[];
  sels.forEach(function(s){[].forEach.call(d.querySelectorAll(s),function(el){
    if(el.__mrv)return;
    if(el.hasAttribute('data-reveal'))return;
    if(el.closest&&el.closest('[data-reveal]'))return;
    el.__mrv=1;cand.push(el);
  });});
  var vh=window.innerHeight||800;
  var below=[];
  for(var i=0;i<cand.length;i++){
    var r=cand[i].getBoundingClientRect();
    if(r.top>vh*0.88&&r.width>0)below.push(cand[i]);
  }
  if(below.length){
    below.forEach(function(el){el.setAttribute('data-reveal','');});
    var io=new IntersectionObserver(function(es){
      var j=0;
      es.forEach(function(e){
        if(!e.isIntersecting)return;
        e.target.style.setProperty('--d',String(Math.min(j++,6)));
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    },{threshold:.06,rootMargin:'0px 0px -36px'});
    below.forEach(function(el){io.observe(el);});
  }
}
/* --- 2. page transition curtain --- */
var cur=d.createElement('div');cur.id='opCurtain';cur.setAttribute('aria-hidden','true');d.body.appendChild(cur);
window.addEventListener('pageshow',function(){cur.classList.remove('on');});
function internalLink(a){
  var h=a.getAttribute('href');
  if(!h||h.charAt(0)==='#')return null;
  if(/^(https?:|mailto:|tel:|javascript:)/i.test(h))return null;
  if(a.target&&a.target!=='_self')return null;
  if(a.hasAttribute('download'))return null;
  if(h.charAt(0)!=='/'||h.indexOf('/wp-')===0)return null;
  return h;
}
if(!reduced){
  d.addEventListener('click',function(e){
    if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    var a=e.target.closest?e.target.closest('a[href]'):null;
    if(!a)return;
    var h=internalLink(a);
    if(!h)return;
    e.preventDefault();
    cur.classList.add('on');
    window.setTimeout(function(){window.location.href=h;},210);
  });
}
/* --- 3. cursor follower (fine pointer only) --- */
if(false){ /* op-cursor-removed 2026-08-30: マウス追従リング(#opCur)を全ページで無効化 */
  var ring=d.createElement('div');ring.id='opCur';ring.setAttribute('aria-hidden','true');d.body.appendChild(ring);
  var x=0,y=0,tx=0,ty=0,vis=false;
  d.addEventListener('mousemove',function(e){
    tx=e.clientX;ty=e.clientY;
    if(!vis){vis=true;x=tx;y=ty;ring.classList.add('v');}
  },{passive:true});
  d.addEventListener('mouseleave',function(){vis=false;ring.classList.remove('v');});
  d.addEventListener('mousedown',function(){ring.classList.add('dn');});
  d.addEventListener('mouseup',function(){ring.classList.remove('dn');});
  d.addEventListener('mouseover',function(e){
    var t=e.target.closest?e.target.closest('a,button,input,select,textarea,label,summary,[role="button"]'):null;
    ring.classList.toggle('act',!!t);
  });
  (function loop(){
    x+=(tx-x)*0.16;y+=(ty-y)*0.16;
    ring.style.transform='translate('+x+'px,'+y+'px) translate(-50%,-50%)';
    window.requestAnimationFrame(loop);
  })();
}
})();

/* op-nav-v2 */
(function(){'use strict';
var nav=document.getElementById('gnav');
if(!nav||!nav.classList.contains('nv2'))return;
var items=[].slice.call(nav.querySelectorAll('.nv-item'));
var HOVER_OPEN=true;
function setOpen(it,on){
  it.setAttribute('data-open',on?'true':'false');
  var b=it.querySelector('.nv-btn');
  if(b)b.setAttribute('aria-expanded',on?'true':'false');
}
function closeAll(except){
  items.forEach(function(it){if(it!==except)setOpen(it,false);});
}
items.forEach(function(it){
  setOpen(it,false);
  var b=it.querySelector('.nv-btn');
  if(!b)return;
  b.addEventListener('click',function(){
    var on=it.getAttribute('data-open')==='true';
    closeAll(it);
    setOpen(it,!on);
  });
  b.addEventListener('keydown',function(e){
    if(e.key==='ArrowDown'){
      e.preventDefault();
      if(it.getAttribute('data-open')!=='true'){closeAll(it);setOpen(it,true);}
      var f=it.querySelector('.nv-sub a');if(f)f.focus();
    }
  });
  if(HOVER_OPEN&&window.matchMedia('(hover: hover) and (min-width: 981px)').matches){
    var tm=null;
    it.addEventListener('mouseenter',function(){if(tm)clearTimeout(tm);closeAll(it);setOpen(it,true);});
    it.addEventListener('mouseleave',function(){tm=setTimeout(function(){setOpen(it,false);},140);});
  }
});
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){
    var open=items.filter(function(it){return it.getAttribute('data-open')==='true';})[0];
    if(open){var b=open.querySelector('.nv-btn');setOpen(open,false);if(b)b.focus();}
  }
});
document.addEventListener('click',function(e){
  if(!nav.contains(e.target))closeAll(null);
});
nav.addEventListener('focusout',function(){
  window.setTimeout(function(){
    if(!nav.contains(document.activeElement))closeAll(null);
  },10);
});
})();

/* ================= op-pefunds-v1: 一覧/個別/カオスマップ の操作レイヤー（SSR済DOMを拡張） ================= */
(function(){'use strict';
 var $=function(s,r){return (r||document).querySelector(s);};
 var $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s));};
 var PAGE=25;
 /* 検索正規化・採点は op-pe-search.js（単一実装）に委譲する。読み込み失敗時のみ最小フォールバック。 */
 var SE=window.opPeSearch||null;
 function opNorm(s){ if(SE)return SE.norm(s); s=String(s||''); try{s=s.normalize('NFKC');}catch(e){} return s.toLowerCase().replace(/[\s　・･/／\-–—_,、（）()「」]/g,''); }
 /* 検索ブロブは PHP 側が "|" 区切りのトークン列として出力する（op-pe-sectors.php）。
    2文字以下の短い語（AI/EC/IT/DX）は部分一致だと "daiwa"→"ai" のような誤ヒットが出るため、
    トークンの先頭一致で判定する。3文字以上は従来どおり部分一致（複合語・英語名に強い）。 */
 function opHit(hay,q){ if(!q)return true; if(!hay)return false;
  return q.length<=2 ? hay.indexOf('|'+q)>=0 : hay.indexOf(q)>=0; }

 /* ---------- LIST（op-pe-search v1.2: 検索UX本実装・左レール複数選択ファセット） ---------- */
 var tblBody=$('#tblBody');
 if(tblBody){
  var rows=$$('tr[data-slug]',tblBody);
  var cardWrap=$('#cardWrap');
  var cardMap={};
  $$('.f-card',cardWrap).forEach(function(c){cardMap[c.getAttribute('data-slug')]=c;});
  /* 構造化インデックス（#pfIndex JSON）を読み、slug で行/カードへ結合する。 */
  var sIndex={};
  (function(){
   var el=document.getElementById('pfIndex');
   if(!el||!SE)return;
   try{ SE.buildIndex(JSON.parse(el.textContent)).forEach(function(f){sIndex[f.s]=f;}); }
   catch(e){ if(window.console)console.error('pfIndex parse failed',e); }
  })();
  var items=rows.map(function(r){
   var slug=r.getAttribute('data-slug');
   var nameja=(r.querySelector('.f-name')||{}).textContent||'';
   var deals=+(r.getAttribute('data-deals')||0);
   return {slug:slug,row:r,card:cardMap[slug]||null,se:sIndex[slug]||null,hit:null,
    region:r.getAttribute('data-region')||'',country:r.getAttribute('data-country')||'',
    size:r.getAttribute('data-size')||'',sizeord:+(r.getAttribute('data-sizeord')||0),
    strat:r.getAttribute('data-strat')||'',sector:r.getAttribute('data-sector')||'',
    lineage:r.getAttribute('data-lineage')||'',
    activeN:+(r.getAttribute('data-active-n')||0),exitN:+(r.getAttribute('data-exit-n')||0),
    sectorActive:r.getAttribute('data-sector-active')||'',sectorExit:r.getAttribute('data-sector-exit')||'',
    nameen:(r.getAttribute('data-nameen')||''),nameja:nameja,
    deals:deals,updated:r.getAttribute('data-updated')||''};
  });
  var st={region:'all',q:'',sort:'name_ja',page:1,
   sel:{country:[],size:[],strategy:[],sector:[],dealstate:[],pfn:[],lineage:[],tier:[]}};
  var GROUPS=['country','size','strategy','sector','dealstate','pfn','lineage'];

  /* ---- ファセット判定（値1つに対して該当するか） ---- */
  function pfnTest(it,v){ if(v==='50')return it.deals>=50; if(v==='10')return it.deals>=10&&it.deals<50; if(v==='1')return it.deals>=1&&it.deals<10; return true; }
  function sectorPool(it){
   /* 投資状況の選択に応じて業種の母集団を切替える（食品×投資中＝いま食品会社を保有しているファンド）。
      dealstateが両方またはいずれも未選択なら全体の業種プールを使う。 */
   var ds=st.sel.dealstate;
   if(ds.length===1){ return ds[0]==='active'?it.sectorActive:it.sectorExit; }
   return it.sector;
  }
  function facetTest(it,g,v){
   if(g==='country')return it.country===v;
   if(g==='size')return it.size===v;
   if(g==='strategy')return it.strat.indexOf(v.toLowerCase())>=0;
   if(g==='sector')return (' '+sectorPool(it)+' ').indexOf(' '+v+' ')>=0;
   if(g==='dealstate')return v==='active'?it.activeN>0:it.exitN>0;
   if(g==='pfn')return pfnTest(it,v);
   if(g==='lineage')return it.lineage===v;
   if(g==='tier'){
    if(!it.hit)return false;
    if(v==='name')return it.hit.tier==='name'||it.hit.tier==='alias'||it.hit.tier==='fuzzy';
    if(v==='pf')return it.hit.pfCount>0;
    if(v==='attr')return !!it.hit.attr;
   }
   return true;
  }
  /* skip: このグループ自身は判定から除外する（「その選択肢を選んだら何件になるか」を出すため） */
  function passFacets(it,skip){
   for(var i=0;i<GROUPS.length;i++){
    var g=GROUPS[i]; if(g===skip)continue;
    var sels=st.sel[g]; if(!sels.length)continue;
    var ok=false; for(var j=0;j<sels.length;j++){ if(facetTest(it,g,sels[j])){ok=true;break;} }
    if(!ok)return false;
   }
   return true;
  }
  function regionMatch(it){ return st.region==='all' || (' '+it.region+' ').indexOf(' '+st.region+' ')>=0; }

  function cmp(a,b){
   var s=st.sort;
   if(s==='name_en')return (a.nameen||'zzz').localeCompare(b.nameen||'zzz');
   if(s==='size')return (b.sizeord-a.sizeord)||a.nameja.localeCompare(b.nameja,'ja');
   if(s==='deals')return (b.deals-a.deals)||a.nameja.localeCompare(b.nameja,'ja');
   if(s==='updated')return (b.updated||'').localeCompare(a.updated||'')||a.nameja.localeCompare(b.nameja,'ja');
   return a.nameja.localeCompare(b.nameja,'ja');
  }

  /* ---- URL同期（複数選択はカンマ区切り。single source of truth） ---- */
  function readURL(){
   var p=new URLSearchParams(location.search);
   st.region=p.get('region')||'all';st.q=p.get('q')||'';
   st.sort=p.get('sort')||'name_ja';st.page=+(p.get('page')||1);
   GROUPS.concat('tier').forEach(function(g){ var v=p.get(g); st.sel[g]=v?v.split(','):[]; });
   if($('#q'))$('#q').value=st.q; if($('#sort'))$('#sort').value=st.sort;
   $$('.rtab').forEach(function(b){b.setAttribute('aria-selected',b.getAttribute('data-r')===st.region?'true':'false');});
   $$('#peRail input[type=checkbox]').forEach(function(cb){
    var g=cb.getAttribute('data-g'),v=cb.getAttribute('data-v');
    cb.checked = st.sel[g] && st.sel[g].indexOf(v)>=0;
   });
  }
  function syncURL(){
   var p=new URLSearchParams();
   if(st.region!=='all')p.set('region',st.region);if(st.q)p.set('q',st.q);
   GROUPS.forEach(function(g){ if(st.sel[g].length)p.set(g,st.sel[g].join(',')); });
   if(st.sort!=='name_ja'&&st.sort!=='rel')p.set('sort',st.sort);
   if(st.page>1)p.set('page',st.page);
   var qs=p.toString();history.replaceState(null,'',qs?('?'+qs):location.pathname);
  }

  /* ---- 一致理由の表示（検索窓UX改善の中核。既存実装を維持） ---- */
  var WHY={name:'投資先名',sector:'業種',text:'事業内容'};
  function escH(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function hitWhyHTML(hit,qDisp){
   if(!hit)return '';
   if(hit.tier==='name')return '<span class="hw-tag hw-name">運用会社名に一致</span>';
   if(hit.tier==='alias')return '<span class="hw-tag hw-name">運用会社の別称に一致</span>';
   if(hit.tier==='fuzzy')return '<span class="hw-tag hw-name">運用会社名に類似一致</span>';
   var h='';
   if(hit.attr)h+='<span class="hw-tag hw-attr">投資戦略・重点分野「'+escH(hit.attr)+'」に一致</span>';
   if(hit.pfCount){
    h+='<span class="hw-tag hw-pf">投資先 '+hit.pfCount+'件が「'+escH(qDisp)+'」に一致</span>';
    var LIMIT=3;
    h+='<ul class="hw-list">';
    hit.pfHits.forEach(function(p,i){
     h+='<li'+(i>=LIMIT?' class="hw-extra" hidden':'')+'><b>'+escH(p.n)+'</b>'
       +(p.sec?'<span class="hw-sec">'+escH(p.sec)+'</span>':'')
       +'<span class="hw-why">'+(WHY[p.why]||'')+'が一致</span></li>';
    });
    h+='</ul>';
    if(hit.pfCount>LIMIT)h+='<span class="hw-more" role="button" tabindex="0" aria-expanded="false">一致した投資先をすべて見る（'+hit.pfCount+'件）</span>';
   }
   return h;
  }
  function setWhy(el,html){
   if(!el)return;
   var w=el.querySelector('.hit-why');
   if(!html){ if(w)w.remove(); return; }
   if(!w){
    w=document.createElement('div');w.className='hit-why';
    var host=el.tagName==='TR'?el.querySelector('td:nth-child(2)'):el;
    (host||el).appendChild(w);
   }
   w.innerHTML=html;
  }

  var pfFundCount=0,pfCompanyCount=0;
  function apply(){
   var Q=(st.q&&SE)?SE.prepQuery(st.q):null;
   var legacyQ=(st.q&&!SE)?opNorm(st.q):'';
   var hasQ=SE?!!Q:!!legacyQ;
   if(!hasQ)st.sel.tier=[];
   items.forEach(function(it){
    if(!hasQ){ it.hit=null; return; }
    if(SE){ it.hit=it.se?SE.score(it.se,Q):null; }
    else{ it.hit=(opNorm(it.nameja)+'|'+opNorm(it.nameen)).indexOf(legacyQ)>=0 ? {tier:'name',pfHits:[],pfCount:0,attr:null,score:1} : null; }
   });

   var filtered=items.filter(function(it){ return regionMatch(it) && (!hasQ||!!it.hit) && passFacets(it,null); });
   /* 投資先一致の件数表示は「現在表示中の結果」基準で数える（絞り込み前の全件基準にすると
      facet適用後の件数と食い違う。実際に戦略フィルタ併用時に総数と一致しない不具合があった）。 */
   pfFundCount=0;pfCompanyCount=0;
   filtered.forEach(function(it){ if(it.hit&&it.hit.pfCount){ pfFundCount++; pfCompanyCount+=it.hit.pfCount; } });
   filtered.sort(function(a,b){
    if(st.sort==='rel'||(hasQ&&st.sort==='name_ja')){ var d=(b.hit?b.hit.score:0)-(a.hit?a.hit.score:0); if(d)return d; }
    return cmp(a,b);
   });

   var total=filtered.length;
   var pages=Math.max(1,Math.ceil(total/PAGE));
   if(st.page>pages)st.page=pages;
   var start=(st.page-1)*PAGE, end=start+PAGE;
   items.forEach(function(it){it.row.style.display='none';if(it.card)it.card.style.display='none';setWhy(it.row,'');setWhy(it.card,'');});
   filtered.forEach(function(it,i){
    if(i>=start && i<end){
     var wh=hasQ?hitWhyHTML(it.hit,st.q):'';
     it.row.style.display='';tblBody.appendChild(it.row);setWhy(it.row,wh);
     if(it.card){it.card.style.display='';cardWrap.appendChild(it.card);setWhy(it.card,wh);}
    }
   });

   /* ---- ファセットの動的件数（このグループを除いた他条件下で、その選択肢を選ぶと何件か） ----
      地域タブ（regionMatch）はここでは加味しない＝左レールの件数・絞り込みは地域タブと独立させる
      （地域タブは「該当」結果一覧のみを絞り込み、左レールの選択肢件数は地域を切り替えても変動しない）。 */
   var railBase=items.filter(function(it){ return (!hasQ||!!it.hit); });
   $$('#peRail .fgroup[data-g]').forEach(function(gEl){
    var g=gEl.getAttribute('data-g');
    $$('input[type=checkbox]',gEl).forEach(function(cb){
     var v=cb.getAttribute('data-v');
     var n=railBase.filter(function(it){ return passFacets(it,g) && facetTest(it,g,v); }).length;
     var lab=cb.closest('label.fopt');
     lab.querySelector('.cnt').textContent=n;
     lab.classList.toggle('zero', n===0 && st.sel[g].indexOf(v)<0);
     lab.classList.toggle('on', st.sel[g].indexOf(v)>=0);
    });
   });
   var activeGroups=GROUPS.filter(function(g){return st.sel[g].length;}).length;
   var railCnt=$('#railActiveCnt'); if(railCnt)railCnt.textContent=activeGroups?('('+activeGroups+')'):'';
   $('#railToggle').classList.toggle('has-active',!!activeGroups);

   /* ---- 検索の一致対象ファセット（検索時のみ表示） ---- */
   var mg=$('#matchGroup');
   if(hasQ){
    mg.hidden=false;
    var mo=$('#matchOpts'); mo.innerHTML='';
    [['name','運用会社名に一致'],['attr','投資戦略・重点分野に一致'],['pf','投資先に一致']].forEach(function(d){
     var n=railBase.filter(function(it){ return passFacets(it,'tier') && facetTest(it,'tier',d[0]); }).length;
     var extra = d[0]==='pf' ? railBase.filter(function(it){return passFacets(it,'tier')&&facetTest(it,'tier','pf');}).reduce(function(s2,it){return s2+(it.hit?it.hit.pfCount:0);},0) : 0;
     var on=st.sel.tier.indexOf(d[0])>=0;
     var l=document.createElement('label'); l.className='fopt'+(on?' on':'')+(n===0&&!on?' zero':'');
     l.innerHTML='<input type="checkbox" '+(on?'checked':'')+'> '+d[1]+(extra?('（'+extra+'件）'):'')+' <span class="cnt">'+n+'</span>';
     l.querySelector('input').addEventListener('change',function(){ toggleFacet('tier',d[0]); });
     mo.appendChild(l);
    });
   }else{ mg.hidden=true; }

   /* ---- 適用中の条件チップ ---- */
   var chipsEl=$('#chips'); chipsEl.innerHTML='';
   var GLBL={country:'国',size:'投資サイズ',strategy:'戦略',sector:'業種',dealstate:'投資状況',pfn:'投資先数',lineage:'出自',tier:'一致対象'};
   var VLBL={active:'投資中あり',exit:'Exit実績あり',name:'運用会社名',attr:'戦略・分野',pf:'投資先',
    '50':'50件以上','10':'10〜49件','1':'1〜9件',Large:'Large',Medium:'Middle',Small:'Small',Undisclosed:'非開示'};
   GROUPS.concat('tier').forEach(function(g){
    st.sel[g].forEach(function(v){
     var c=document.createElement('span'); c.className='chip';
     c.innerHTML=GLBL[g]+': '+escH(VLBL[v]||v)+' <span class="x">×</span>';
     c.querySelector('.x').addEventListener('click',function(){ toggleFacet(g,v); });
     chipsEl.appendChild(c);
    });
   });

   var rl=$('#resultLine');
   if(rl){
    var line='該当 <b>'+total+'</b> 社'+(st.region!=='all'?'（'+st.region+'）':'');
    if(hasQ&&pfFundCount)line+=' ・ うち投資先の一致 <b>'+pfFundCount+'</b>社（'+pfCompanyCount+'件）';
    rl.innerHTML=line;
   }
   var em=$('#emptyMsg');if(em)em.style.display=total?'none':'block';
   var pg=$('#pager');
   if(pg){
    if(pages<=1){pg.innerHTML='';}
    else{
     var h='<button '+(st.page===1?'disabled':'')+' data-p="'+(st.page-1)+'">‹ 前へ</button>';
     for(var i=1;i<=pages;i++){if(i===1||i===pages||Math.abs(i-st.page)<=2){h+='<button class="'+(i===st.page?'cur':'')+'" data-p="'+i+'">'+i+'</button>';}else if(Math.abs(i-st.page)===3){h+='<span style="color:#b8c4d0">…</span>';}}
     h+='<button '+(st.page===pages?'disabled':'')+' data-p="'+(st.page+1)+'">次へ ›</button>';
     pg.innerHTML=h;
     $$('#pager button[data-p]').forEach(function(b){b.addEventListener('click',function(){st.page=+b.getAttribute('data-p');var rt=$('.region-tabs');window.scrollTo({top:(rt?rt.offsetTop-70:0),behavior:'smooth'});apply();syncURL();});});
    }
   }
  }
  function toggleFacet(g,v){
   var a=st.sel[g],i=a.indexOf(v); if(i<0)a.push(v);else a.splice(i,1);
   st.page=1; apply(); syncURL();
  }

  /* ---- ファセット・地域タブ・ソート・リセット ---- */
  $$('#peRail input[type=checkbox]').forEach(function(cb){
   cb.addEventListener('change',function(){ toggleFacet(cb.getAttribute('data-g'),cb.getAttribute('data-v')); });
  });
  $$('#peRail .fgroup h3').forEach(function(h){ h.addEventListener('click',function(){ h.closest('.fgroup').classList.toggle('closed'); }); });
  $$('.rtab').forEach(function(b){b.addEventListener('click',function(){st.region=b.getAttribute('data-r');st.page=1;$$('.rtab').forEach(function(x){x.setAttribute('aria-selected',x===b?'true':'false');});apply();syncURL();});});
  if($('#sort'))$('#sort').addEventListener('change',function(e){st.sort=e.target.value;apply();syncURL();});
  if($('#reset'))$('#reset').addEventListener('click',function(){
   st.q='';st.page=1; GROUPS.concat('tier').forEach(function(g){st.sel[g]=[];});
   if($('#q'))$('#q').value=''; $('#qClr').hidden=true;
   $$('#peRail input[type=checkbox]').forEach(function(cb){cb.checked=false;});
   apply();syncURL();
  });
  if($('#toMap'))$('#toMap').addEventListener('click',function(){var c=$('#chaosSec');if(c)c.scrollIntoView({behavior:'smooth'});});
  var railToggle=$('#railToggle'), rail=$('#peRail');
  if(railToggle&&rail){railToggle.addEventListener('click',function(){
   var open=railToggle.getAttribute('aria-expanded')==='true';
   railToggle.setAttribute('aria-expanded',open?'false':'true');
   rail.classList.toggle('open',!open);
  });}
  var tip=$('#sizeTip');
  if(tip){tip.querySelector('.tbtn').addEventListener('click',function(e){e.stopPropagation();tip.classList.toggle('open');});document.addEventListener('click',function(e){if(!tip.contains(e.target))tip.classList.remove('open');});}
  rows.forEach(function(r){r.addEventListener('click',function(e){if(e.target.closest('a'))return;var a=r.querySelector('a.f-name');if(a)window.location.href=a.getAttribute('href');});r.style.cursor='pointer';});
  $$('#chaosTabs .ctab').forEach(function(b){b.addEventListener('click',function(){var r=b.getAttribute('data-r');$$('#chaosTabs .ctab').forEach(function(x){x.setAttribute('aria-selected',x===b?'true':'false');});$$('.chaos-region').forEach(function(blk){blk.style.display=(blk.getAttribute('data-r')===r)?'':'none';});});});
  document.addEventListener('click',function(e){
   var m=e.target.closest?e.target.closest('.hw-more'):null;
   if(!m)return;
   e.preventDefault();e.stopPropagation();
   var box=m.closest('.hit-why');
   var on=m.getAttribute('aria-expanded')==='true';
   [].forEach.call(box.querySelectorAll('.hw-extra'),function(li){li.hidden=on;});
   m.setAttribute('aria-expanded',on?'false':'true');
   m.textContent=on?('一致した投資先をすべて見る（'+box.querySelectorAll('.hw-list li').length+'件）'):'一致した投資先を折りたたむ';
  },true);
  document.addEventListener('keydown',function(e){
   if((e.key==='Enter'||e.key===' ')&&e.target.classList&&e.target.classList.contains('hw-more')){e.preventDefault();e.target.click();}
  });

  /* ---- 検索窓UX: サジェスト・クリア・キーボード・IME・「/」ショートカット・検索例 ---- */
  var qEl=$('#q'), sugEl=$('#sug'), clrEl=$('#qClr');
  var qTm=null, composing=false, sugIdx=-1, sugItems=[];
  function hilite(text,q){
   var low=String(text).toLowerCase(), pos=low.indexOf(String(q).toLowerCase());
   if(pos<0)return escH(text);
   return escH(text.slice(0,pos))+'<mark>'+escH(text.slice(pos,pos+q.length))+'</mark>'+escH(text.slice(pos+q.length));
  }
  function buildSuggest(){
   if(!SE){sugEl.hidden=true;return;}
   var q=qEl.value, Q=q?SE.prepQuery(q):null;
   sugIdx=-1; sugItems=[];
   if(!Q){ sugEl.hidden=true; sugEl.innerHTML=''; return; }
   var scored=[];
   items.forEach(function(it){ if(!it.se)return; var h=SE.score(it.se,Q); if(h)scored.push({it:it,h:h}); });
   scored.sort(function(a,b){return b.h.score-a.h.score});
   var funds=scored.filter(function(x){return x.h.tier==='name'||x.h.tier==='alias'||x.h.tier==='fuzzy'}).slice(0,5);
   var pfs=[];
   scored.forEach(function(x){ (x.h.pfHits||[]).forEach(function(p){ if(p.why==='name'&&pfs.length<4) pfs.push({it:x.it,p:p}); }); });
   if(!funds.length&&!pfs.length){ sugEl.hidden=true; return; }
   var h='';
   if(funds.length){
    h+='<div class="grp">運用会社</div>';
    funds.forEach(function(x){
     h+='<div class="it" data-q="'+escH(x.it.nameja)+'"><span class="nm">'+hilite(x.it.nameja,q)+'</span><span class="en">'+hilite(x.it.nameen||'',q)+'</span><span class="via">'+x.it.deals+'件収録</span></div>';
    });
   }
   if(pfs.length){
    h+='<div class="grp">投資先企業から探す</div>';
    pfs.forEach(function(x){
     h+='<div class="it" data-q="'+escH(x.p.n)+'"><span class="nm">'+hilite(x.p.n,q)+'</span>'+(x.p.sec?'<span class="en">'+escH(x.p.sec)+'</span>':'')+'<span class="via">投資元: '+escH(x.it.nameja)+'</span></div>';
    });
   }
   h+='<div class="foot">Enterで絞り込み ・ ↑↓で候補選択 ・ Escで閉じる</div>';
   sugEl.innerHTML=h; sugEl.hidden=false;
   sugItems=$$('.it',sugEl);
   sugItems.forEach(function(it){ it.addEventListener('mousedown',function(e){ e.preventDefault(); pickSuggest(it); }); });
  }
  function pickSuggest(it){
   qEl.value=it.getAttribute('data-q'); st.q=qEl.value; st.page=1;
   sugEl.hidden=true; apply(); syncURL();
  }
  function onInput(){
   st.q=qEl.value; st.page=1;
   clrEl.hidden=!qEl.value;
   if(qTm)clearTimeout(qTm);
   qTm=setTimeout(function(){ apply(); syncURL(); buildSuggest(); },120);
  }
  if(qEl){
   qEl.addEventListener('compositionstart',function(){composing=true;});
   qEl.addEventListener('compositionend',function(){composing=false; onInput();});
   qEl.addEventListener('input',function(){ if(!composing) onInput(); });
   qEl.addEventListener('keydown',function(e){
    if(composing)return;
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){
     if(sugEl.hidden||!sugItems.length)return;
     e.preventDefault();
     sugIdx=(sugIdx+(e.key==='ArrowDown'?1:-1)+sugItems.length)%sugItems.length;
     sugItems.forEach(function(it,i){ it.classList.toggle('act',i===sugIdx); });
     sugItems[sugIdx].scrollIntoView({block:'nearest'});
    }else if(e.key==='Enter'){
     if(sugIdx>=0&&sugItems[sugIdx]){ e.preventDefault(); pickSuggest(sugItems[sugIdx]); }
     else{ sugEl.hidden=true; }
    }else if(e.key==='Escape'){
     if(!sugEl.hidden){ sugEl.hidden=true; }
     else if(qEl.value){ qEl.value=''; onInput(); }
     qEl.blur();
    }
   });
   qEl.addEventListener('blur',function(){ setTimeout(function(){ sugEl.hidden=true; },150); });
   qEl.addEventListener('focus',function(){ if(qEl.value) buildSuggest(); });
  }
  if(clrEl)clrEl.addEventListener('click',function(){ qEl.value=''; onInput(); qEl.focus(); });
  document.addEventListener('keydown',function(e){
   if(e.key==='/'&&document.activeElement!==qEl&&!/INPUT|TEXTAREA|SELECT/.test((document.activeElement||{}).tagName)){
    e.preventDefault(); qEl.focus();
   }
  });
  $$('.exchip').forEach(function(b){ b.addEventListener('click',function(){ qEl.value=b.getAttribute('data-q'); onInput(); qEl.focus(); }); });

  readURL();apply();
 }

 /* ---------- SINGLE: portfolio table ---------- */
 var pfBody=$('#pfBody');
 if(pfBody){
  /* pf-detail-v1: 詳細展開行(.pf-drow)はデータ行ではないため絞込/並替の対象から除外し、
     並替時は親行の直後に追従させる。開閉状態は親行の .pf-open クラスで保持する。 */
  var drowMap={};
  $$('tr.pf-drow',pfBody).forEach(function(r){drowMap[r.getAttribute('data-for')]=r;});
  var prows=$$('tr',pfBody).filter(function(r){return !r.classList.contains('pf-drow');});
  function drowOf(r){var k=r.getAttribute('data-di');return k?drowMap[k]||null:null;}
  var ps={st:'all',country:'',sector:'',sort:'invest',q:''};
  function pdraw(){
   var vis=prows.filter(function(r){
    if(ps.st!=='all' && r.getAttribute('data-st')!==ps.st)return false;
    if(ps.country && r.getAttribute('data-country')!==ps.country)return false;
    if(ps.sector){
     var secAttr=r.getAttribute('data-sector-major')||r.getAttribute('data-sector')||'';
     if((' '+secAttr+' ').indexOf(' '+ps.sector+' ')<0)return false;
    }
    if(ps.q){
     var hay=opNorm(r.getAttribute('data-search')||r.getAttribute('data-name')||'');
     if(!opHit(hay,ps.q))return false;
    }
    return true;
   });
   vis.sort(function(a,b){
    if(ps.sort==='name')return (a.getAttribute('data-name')||'').localeCompare(b.getAttribute('data-name')||'','ja');
    if(ps.sort==='exit')return (b.getAttribute('data-exit')||'').localeCompare(a.getAttribute('data-exit')||'');
    return (b.getAttribute('data-invest')||'').localeCompare(a.getAttribute('data-invest')||'');
   });
   prows.forEach(function(r){r.style.display='none';var d=drowOf(r);if(d)d.style.display='none';});
   vis.forEach(function(r){
    r.style.display='';pfBody.appendChild(r);
    var d=drowOf(r);
    if(d){pfBody.appendChild(d);d.style.display=r.classList.contains('pf-open')?'':'none';}
   });
   var c=$('#pfCount');if(c)c.textContent=vis.length+' 件';
  }
  function ptoggle(r){
   var d=drowOf(r);if(!d)return;
   var on=!r.classList.contains('pf-open');
   r.classList.toggle('pf-open',on);
   d.style.display=on?'':'none';
   var b=r.querySelector('.pf-more');if(b)b.setAttribute('aria-expanded',on?'true':'false');
  }
  prows.forEach(function(r){
   if(!r.getAttribute('data-di'))return;
   r.classList.add('pf-hasmore');
   r.addEventListener('click',function(e){
    if(e.target.closest('a'))return;
    ptoggle(r);
   });
  });
  $$('.pf-controls .chip').forEach(function(c){c.addEventListener('click',function(){ps.st=c.getAttribute('data-st');$$('.pf-controls .chip').forEach(function(x){x.setAttribute('aria-pressed',x===c?'true':'false');});pdraw();});});
  if($('#pfCountry'))$('#pfCountry').addEventListener('change',function(e){ps.country=e.target.value;pdraw();});
  if($('#pfSector'))$('#pfSector').addEventListener('change',function(e){ps.sector=e.target.value;pdraw();});
  if($('#pfSort'))$('#pfSort').addEventListener('change',function(e){ps.sort=e.target.value;pdraw();});
  if($('#pfQ'))$('#pfQ').addEventListener('input',function(e){ps.q=opNorm(e.target.value);pdraw();});
  if($('#pfReset'))$('#pfReset').addEventListener('click',function(){
   ps.st='all';ps.country='';ps.sector='';ps.q='';
   $$('.pf-controls .chip').forEach(function(x){x.setAttribute('aria-pressed',x.getAttribute('data-st')==='all'?'true':'false');});
   if($('#pfCountry'))$('#pfCountry').value='';
   if($('#pfSector'))$('#pfSector').value='';
   if($('#pfQ'))$('#pfQ').value='';
   pdraw();
  });
  pdraw();
 }
})();
;
