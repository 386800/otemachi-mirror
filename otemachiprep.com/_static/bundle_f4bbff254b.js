!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;"undefined"!=typeof window?t=window:"undefined"!=typeof global?t=global:"undefined"!=typeof self&&(t=self),t.sbjs=e()}}(function(){return function e(t,r,n){function a(s,o){if(!r[s]){if(!t[s]){var c="function"==typeof require&&require;if(!o&&c)return c(s,!0);if(i)return i(s,!0);var u=new Error("Cannot find module '"+s+"'");throw u.code="MODULE_NOT_FOUND",u}var p=r[s]={exports:{}};t[s][0].call(p.exports,function(e){var r=t[s][1][e];return a(r||e)},p,p.exports,e,t,r,n)}return r[s].exports}for(var i="function"==typeof require&&require,s=0;s<n.length;s++)a(n[s]);return a}({1:[function(e,t,r){"use strict";var n=e("./init"),a={init:function(e){this.get=n(e),e&&e.callback&&"function"==typeof e.callback&&e.callback(this.get)}};t.exports=a},{"./init":6}],2:[function(e,t,r){"use strict";var n=e("./terms"),a=e("./helpers/utils"),i={containers:{current:"sbjs_current",current_extra:"sbjs_current_add",first:"sbjs_first",first_extra:"sbjs_first_add",session:"sbjs_session",udata:"sbjs_udata",promocode:"sbjs_promo"},service:{migrations:"sbjs_migrations"},delimiter:"|||",aliases:{main:{type:"typ",source:"src",medium:"mdm",campaign:"cmp",content:"cnt",term:"trm",id:"id",platform:"plt",format:"fmt",tactic:"tct"},extra:{fire_date:"fd",entrance_point:"ep",referer:"rf"},session:{pages_seen:"pgs",current_page:"cpg"},udata:{visits:"vst",ip:"uip",agent:"uag"},promo:"code"},pack:{main:function(e){return i.aliases.main.type+"="+e.type+i.delimiter+i.aliases.main.source+"="+e.source+i.delimiter+i.aliases.main.medium+"="+e.medium+i.delimiter+i.aliases.main.campaign+"="+e.campaign+i.delimiter+i.aliases.main.content+"="+e.content+i.delimiter+i.aliases.main.term+"="+e.term+i.delimiter+i.aliases.main.id+"="+e.id+i.delimiter+i.aliases.main.platform+"="+e.platform+i.delimiter+i.aliases.main.format+"="+e.format+i.delimiter+i.aliases.main.tactic+"="+e.tactic},extra:function(e){return i.aliases.extra.fire_date+"="+a.setDate(new Date,e)+i.delimiter+i.aliases.extra.entrance_point+"="+document.location.href+i.delimiter+i.aliases.extra.referer+"="+(document.referrer||n.none)},user:function(e,t){return i.aliases.udata.visits+"="+e+i.delimiter+i.aliases.udata.ip+"="+t+i.delimiter+i.aliases.udata.agent+"="+navigator.userAgent},session:function(e){return i.aliases.session.pages_seen+"="+e+i.delimiter+i.aliases.session.current_page+"="+document.location.href},promo:function(e){return i.aliases.promo+"="+a.setLeadingZeroToInt(a.randomInt(e.min,e.max),e.max.toString().length)}}};t.exports=i},{"./helpers/utils":5,"./terms":9}],3:[function(e,t,r){"use strict";var n=e("../data").delimiter;t.exports={useBase64:!1,setBase64Flag:function(e){this.useBase64=e},encodeData:function(e){return encodeURIComponent(e).replace(/\!/g,"%21").replace(/\~/g,"%7E").replace(/\*/g,"%2A").replace(/\'/g,"%27").replace(/\(/g,"%28").replace(/\)/g,"%29")},decodeData:function(e){try{return decodeURIComponent(e).replace(/\%21/g,"!").replace(/\%7E/g,"~").replace(/\%2A/g,"*").replace(/\%27/g,"'").replace(/\%28/g,"(").replace(/\%29/g,")")}catch(t){try{return unescape(e)}catch(r){return""}}},set:function(e,t,r,n,a){var i,s;if(r){var o=new Date;o.setTime(o.getTime()+60*r*1e3),i="; expires="+o.toGMTString()}else i="";s=n&&!a?";domain=."+n:"";var c=this.encodeData(t);this.useBase64&&(c=btoa(c).replace(/=+$/,"")),document.cookie=this.encodeData(e)+"="+c+i+s+"; path=/"},get:function(e){for(var t=this.encodeData(e)+"=",r=document.cookie.split(";"),n=0;n<r.length;n++){for(var a=r[n];" "===a.charAt(0);)a=a.substring(1,a.length);if(0===a.indexOf(t)){var i=a.substring(t.length,a.length);if(/^[A-Za-z0-9+/]+$/.test(i))try{i=atob(i.padEnd(4*Math.ceil(i.length/4),"="))}catch(s){}return this.decodeData(i)}}return null},destroy:function(e,t,r){this.set(e,"",-1,t,r)},parse:function(e){var t=[],r={};if("string"==typeof e)t.push(e);else for(var a in e)e.hasOwnProperty(a)&&t.push(e[a]);for(var i=0;i<t.length;i++){var s;r[this.unsbjs(t[i])]={},s=this.get(t[i])?this.get(t[i]).split(n):[];for(var o=0;o<s.length;o++){var c=s[o].split("="),u=c.splice(0,1);u.push(c.join("=")),r[this.unsbjs(t[i])][u[0]]=this.decodeData(u[1])}}return r},unsbjs:function(e){return e.replace("sbjs_","")}}},{"../data":2}],4:[function(e,t,r){"use strict";t.exports={parse:function(e){for(var t=this.parseOptions,r=t.parser[t.strictMode?"strict":"loose"].exec(e),n={},a=14;a--;)n[t.key[a]]=r[a]||"";return n[t.q.name]={},n[t.key[12]].replace(t.q.parser,function(e,r,a){r&&(n[t.q.name][r]=a)}),n},parseOptions:{strictMode:!1,key:["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],q:{name:"queryKey",parser:/(?:^|&)([^&=]*)=?([^&]*)/g},parser:{strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/}},getParam:function(e){for(var t={},r=(e||window.location.search.substring(1)).split("&"),n=0;n<r.length;n++){var a=r[n].split("=");if("undefined"==typeof t[a[0]])t[a[0]]=a[1];else if("string"==typeof t[a[0]]){var i=[t[a[0]],a[1]];t[a[0]]=i}else t[a[0]].push(a[1])}return t},getHost:function(e){return this.parse(e).host.replace("www.","")}}},{}],5:[function(e,t,r){"use strict";t.exports={escapeRegexp:function(e){return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")},setDate:function(e,t){var r=e.getTimezoneOffset()/60,n=e.getHours(),a=t||0===t?t:-r;return e.setHours(n+r+a),e.getFullYear()+"-"+this.setLeadingZeroToInt(e.getMonth()+1,2)+"-"+this.setLeadingZeroToInt(e.getDate(),2)+" "+this.setLeadingZeroToInt(e.getHours(),2)+":"+this.setLeadingZeroToInt(e.getMinutes(),2)+":"+this.setLeadingZeroToInt(e.getSeconds(),2)},setLeadingZeroToInt:function(e,t){for(var r=e+"";r.length<t;)r="0"+r;return r},randomInt:function(e,t){return Math.floor(Math.random()*(t-e+1))+e}}},{}],6:[function(e,t,r){"use strict";var n=e("./data"),a=e("./terms"),i=e("./helpers/cookies"),s=e("./helpers/uri"),o=e("./helpers/utils"),c=e("./params"),u=e("./migrations");t.exports=function(e){var t,r,p,f,m,d,l,g,h,y,_,v,b,x=c.fetch(e),k=s.getParam(),w=x.domain.host,q=x.domain.isolate,I=x.lifetime;function j(e){switch(e){case a.traffic.utm:t=a.traffic.utm,r="undefined"!=typeof k.utm_source?k.utm_source:"undefined"!=typeof k.gclid?"google":"undefined"!=typeof k.yclid?"yandex":a.none,p="undefined"!=typeof k.utm_medium?k.utm_medium:"undefined"!=typeof k.gclid?"cpc":"undefined"!=typeof k.yclid?"cpc":a.none,f="undefined"!=typeof k.utm_campaign?k.utm_campaign:"undefined"!=typeof k[x.campaign_param]?k[x.campaign_param]:"undefined"!=typeof k.gclid?"google_cpc":"undefined"!=typeof k.yclid?"yandex_cpc":a.none,m="undefined"!=typeof k.utm_content?k.utm_content:"undefined"!=typeof k[x.content_param]?k[x.content_param]:a.none,l=k.utm_id||a.none,g=k.utm_source_platform||a.none,h=k.utm_creative_format||a.none,y=k.utm_marketing_tactic||a.none,d="undefined"!=typeof k.utm_term?k.utm_term:"undefined"!=typeof k[x.term_param]?k[x.term_param]:function(){var e=document.referrer;if(k.utm_term)return k.utm_term;if(!(e&&s.parse(e).host&&s.parse(e).host.match(/^(?:.*\.)?yandex\..{2,9}$/i)))return!1;try{return s.getParam(s.parse(document.referrer).query).text}catch(t){return!1}}()||a.none;break;case a.traffic.organic:t=a.traffic.organic,r=r||s.getHost(document.referrer),p=a.referer.organic,f=a.none,m=a.none,d=a.none,l=a.none,g=a.none,h=a.none,y=a.none;break;case a.traffic.referral:t=a.traffic.referral,r=r||s.getHost(document.referrer),p=p||a.referer.referral,f=a.none,m=s.parse(document.referrer).path,d=a.none,l=a.none,g=a.none,h=a.none,y=a.none;break;case a.traffic.typein:t=a.traffic.typein,r=x.typein_attributes.source,p=x.typein_attributes.medium,f=a.none,m=a.none,d=a.none,l=a.none,g=a.none,h=a.none,y=a.none;break;default:t=a.oops,r=a.oops,p=a.oops,f=a.oops,m=a.oops,d=a.oops,l=a.oops,g=a.oops,h=a.oops,y=a.oops}var i={type:t,source:r,medium:p,campaign:f,content:m,term:d,id:l,platform:g,format:h,tactic:y};return n.pack.main(i)}function R(e){var t=document.referrer;switch(e){case a.traffic.organic:return!!t&&H(t)&&function(e){var t=new RegExp("^(?:.*\\.)?"+o.escapeRegexp("yandex")+"\\..{2,9}$"),n=new RegExp(".*"+o.escapeRegexp("text")+"=.*"),a=new RegExp("^(?:www\\.)?"+o.escapeRegexp("google")+"\\..{2,9}$");if(s.parse(e).query&&s.parse(e).host.match(t)&&s.parse(e).query.match(n))return r="yandex",!0;if(s.parse(e).host.match(a))return r="google",!0;if(!s.parse(e).query)return!1;for(var i=0;i<x.organics.length;i++){if(s.parse(e).host.match(new RegExp("^(?:.*\\.)?"+o.escapeRegexp(x.organics[i].host)+"$","i"))&&s.parse(e).query.match(new RegExp(".*"+o.escapeRegexp(x.organics[i].param)+"=.*","i")))return r=x.organics[i].display||x.organics[i].host,!0;if(i+1===x.organics.length)return!1}}(t);case a.traffic.referral:return!!t&&H(t)&&function(e){if(!(x.referrals.length>0))return r=s.getHost(e),!0;for(var t=0;t<x.referrals.length;t++){if(s.parse(e).host.match(new RegExp("^(?:.*\\.)?"+o.escapeRegexp(x.referrals[t].host)+"$","i")))return r=x.referrals[t].display||x.referrals[t].host,p=x.referrals[t].medium||a.referer.referral,!0;if(t+1===x.referrals.length)return r=s.getHost(e),!0}}(t);default:return!1}}function H(e){if(x.domain){if(q)return s.getHost(e)!==s.getHost(w);var t=new RegExp("^(?:.*\\.)?"+o.escapeRegexp(w)+"$","i");return!s.getHost(e).match(t)}return s.getHost(e)!==s.getHost(document.location.href)}function D(){i.set(n.containers.current_extra,n.pack.extra(x.timezone_offset),I,w,q),i.get(n.containers.first_extra)||i.set(n.containers.first_extra,n.pack.extra(x.timezone_offset),I,w,q)}return i.setBase64Flag(x.base64),u.go(I,w,q),i.set(n.containers.current,function(){var e;if("undefined"!=typeof k.utm_source||"undefined"!=typeof k.utm_medium||"undefined"!=typeof k.utm_campaign||"undefined"!=typeof k.utm_content||"undefined"!=typeof k.utm_term||"undefined"!=typeof k.utm_id||"undefined"!=typeof k.utm_source_platform||"undefined"!=typeof k.utm_creative_format||"undefined"!=typeof k.utm_marketing_tactic||"undefined"!=typeof k.gclid||"undefined"!=typeof k.yclid||"undefined"!=typeof k[x.campaign_param]||"undefined"!=typeof k[x.term_param]||"undefined"!=typeof k[x.content_param])D(),e=j(a.traffic.utm);else if(R(a.traffic.organic))D(),e=j(a.traffic.organic);else if(!i.get(n.containers.session)&&R(a.traffic.referral))D(),e=j(a.traffic.referral);else{if(i.get(n.containers.first)||i.get(n.containers.current))return i.get(n.containers.current);D(),e=j(a.traffic.typein)}return e}(),I,w,q),i.get(n.containers.first)||i.set(n.containers.first,i.get(n.containers.current),I,w,q),i.get(n.containers.udata)?(_=parseInt(i.parse(n.containers.udata)[i.unsbjs(n.containers.udata)][n.aliases.udata.visits])||1,_=i.get(n.containers.session)?_:_+1,v=n.pack.user(_,x.user_ip)):(_=1,v=n.pack.user(_,x.user_ip)),i.set(n.containers.udata,v,I,w,q),i.get(n.containers.session)?(b=parseInt(i.parse(n.containers.session)[i.unsbjs(n.containers.session)][n.aliases.session.pages_seen])||1,b+=1):b=1,i.set(n.containers.session,n.pack.session(b),x.session_length,w,q),x.promocode&&!i.get(n.containers.promocode)&&i.set(n.containers.promocode,n.pack.promo(x.promocode),I,w,q),i.parse(n.containers)}},{"./data":2,"./helpers/cookies":3,"./helpers/uri":4,"./helpers/utils":5,"./migrations":7,"./params":8,"./terms":9}],7:[function(e,t,r){"use strict";var n=e("./data"),a=e("./helpers/cookies");t.exports={go:function(e,t,r){var i,s=this.migrations,o={l:e,d:t,i:r};if(a.get(n.containers.first)||a.get(n.service.migrations)){if(!a.get(n.service.migrations))for(i=0;i<s.length;i++)s[i].go(s[i].id,o)}else{var c=[];for(i=0;i<s.length;i++)c.push(s[i].id);var u="";for(i=0;i<c.length;i++)u+=c[i]+"=1",i<c.length-1&&(u+=n.delimiter);a.set(n.service.migrations,u,o.l,o.d,o.i)}},migrations:[{id:"1418474375998",version:"1.0.0-beta",go:function(e,t){var r=e+"=1",i=e+"=0",s=function(e,t,r){return t||r?e:n.delimiter};try{var o=[];for(var c in n.containers)n.containers.hasOwnProperty(c)&&o.push(n.containers[c]);for(var u=0;u<o.length;u++)if(a.get(o[u])){var p=a.get(o[u]).replace(/(\|)?\|(\|)?/g,s);a.destroy(o[u],t.d,t.i),a.destroy(o[u],t.d,!t.i),a.set(o[u],p,t.l,t.d,t.i)}a.get(n.containers.session)&&a.set(n.containers.session,n.pack.session(0),t.l,t.d,t.i),a.set(n.service.migrations,r,t.l,t.d,t.i)}catch(f){a.set(n.service.migrations,i,t.l,t.d,t.i)}}}]}},{"./data":2,"./helpers/cookies":3}],8:[function(e,t,r){"use strict";var n=e("./terms"),a=e("./helpers/uri");t.exports={fetch:function(e){var t=e||{},r={};if(r.lifetime=this.validate.checkFloat(t.lifetime)||6,r.lifetime=parseInt(30*r.lifetime*24*60),r.session_length=this.validate.checkInt(t.session_length)||30,r.timezone_offset=this.validate.checkInt(t.timezone_offset),r.base64=t.base64||!1,r.campaign_param=t.campaign_param||!1,r.term_param=t.term_param||!1,r.content_param=t.content_param||!1,r.user_ip=t.user_ip||n.none,t.promocode?(r.promocode={},r.promocode.min=parseInt(t.promocode.min)||1e5,r.promocode.max=parseInt(t.promocode.max)||999999):r.promocode=!1,t.typein_attributes&&t.typein_attributes.source&&t.typein_attributes.medium?(r.typein_attributes={},r.typein_attributes.source=t.typein_attributes.source,r.typein_attributes.medium=t.typein_attributes.medium):r.typein_attributes={source:"(direct)",medium:"(none)"},t.domain&&this.validate.isString(t.domain)?r.domain={host:t.domain,isolate:!1}:t.domain&&t.domain.host?r.domain=t.domain:r.domain={host:a.getHost(document.location.hostname),isolate:!1},r.referrals=[],t.referrals&&t.referrals.length>0)for(var i=0;i<t.referrals.length;i++)t.referrals[i].host&&r.referrals.push(t.referrals[i]);if(r.organics=[],t.organics&&t.organics.length>0)for(var s=0;s<t.organics.length;s++)t.organics[s].host&&t.organics[s].param&&r.organics.push(t.organics[s]);return r.organics.push({host:"bing.com",param:"q",display:"bing"}),r.organics.push({host:"yahoo.com",param:"p",display:"yahoo"}),r.organics.push({host:"about.com",param:"q",display:"about"}),r.organics.push({host:"aol.com",param:"q",display:"aol"}),r.organics.push({host:"ask.com",param:"q",display:"ask"}),r.organics.push({host:"globososo.com",param:"q",display:"globo"}),r.organics.push({host:"go.mail.ru",param:"q",display:"go.mail.ru"}),r.organics.push({host:"rambler.ru",param:"query",display:"rambler"}),r.organics.push({host:"tut.by",param:"query",display:"tut.by"}),r.referrals.push({host:"t.co",display:"twitter.com"}),r.referrals.push({host:"plus.url.google.com",display:"plus.google.com"}),r},validate:{checkFloat:function(e){return!(!e||!this.isNumeric(parseFloat(e)))&&parseFloat(e)},checkInt:function(e){return!(!e||!this.isNumeric(parseInt(e)))&&parseInt(e)},isNumeric:function(e){return!isNaN(e)},isString:function(e){return"[object String]"===Object.prototype.toString.call(e)}}}},{"./helpers/uri":4,"./terms":9}],9:[function(e,t,r){"use strict";t.exports={traffic:{utm:"utm",organic:"organic",referral:"referral",typein:"typein"},referer:{referral:"referral",organic:"organic",social:"social"},none:"(none)",oops:"(Houston, we have a problem)"}},{}]},{},[1])(1)});;
/* ================================================================
 * op-vc-search v1: VC・CVC DB 検索エンジン（純粋関数・DOM非依存）
 * op-pe-search v1 と同一実装（PEファンドDBの検索根本改善で確立）を移植。
 * エンジン自体はドメイン非依存のため、PE固有のハードコードは持たない。
 *
 * 設計:
 *  - 検索対象を「組織名 / 組織属性 / 投資先」の3階層に構造化し、
 *    どのフィールドが一致したかを結果オブジェクトで返す（ブロブ連結+includesを廃止）。
 *  - relevance score によるランキング。優先順位は
 *      組織名 Exact > Prefix > Substring > 別称(slug等) > Fuzzy > 組織属性 > 投資先
 *  - 特定の検索語・特定組織へのハードコードは持たない。
 *  - 一覧(op-page-vc-funds.js)と URL ?q= の双方がこの1実装だけを使う。
 *  - Node からも読み込めるため回帰テスト可能（module.exports）。
 *
 * インデックス入力（PHP op_vc_search_index() が JSON で出力）:
 *   [{ s:slug, nj:日本語組織名, ne:英語組織名, at:[属性文字列...],
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
    'ベンチャーズキャピタル', 'ベンチャーキャピタル', 'ベンチャーズ', 'ベンチャー',
    'パートナーズ', 'パートナース', 'キャピタル', 'インベストメンツ', 'インベストメント',
    'エクイティ', 'ホールディングス', 'グループ', 'ファンド',
    'capitalpartners', 'equitypartners', 'privateequity', 'venturecapital', 'ventures', 'venture',
    'partners', 'capital', 'equity',
    'investments', 'investment', 'management', 'advisors', 'associates', 'holdings', 'group', 'fund'
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
  root.opVcSearch = api;
})(typeof window !== 'undefined' ? window : globalThis);
;
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
;
