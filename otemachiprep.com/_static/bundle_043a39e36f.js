!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;"undefined"!=typeof window?t=window:"undefined"!=typeof global?t=global:"undefined"!=typeof self&&(t=self),t.sbjs=e()}}(function(){return function e(t,r,n){function a(s,o){if(!r[s]){if(!t[s]){var c="function"==typeof require&&require;if(!o&&c)return c(s,!0);if(i)return i(s,!0);var u=new Error("Cannot find module '"+s+"'");throw u.code="MODULE_NOT_FOUND",u}var p=r[s]={exports:{}};t[s][0].call(p.exports,function(e){var r=t[s][1][e];return a(r||e)},p,p.exports,e,t,r,n)}return r[s].exports}for(var i="function"==typeof require&&require,s=0;s<n.length;s++)a(n[s]);return a}({1:[function(e,t,r){"use strict";var n=e("./init"),a={init:function(e){this.get=n(e),e&&e.callback&&"function"==typeof e.callback&&e.callback(this.get)}};t.exports=a},{"./init":6}],2:[function(e,t,r){"use strict";var n=e("./terms"),a=e("./helpers/utils"),i={containers:{current:"sbjs_current",current_extra:"sbjs_current_add",first:"sbjs_first",first_extra:"sbjs_first_add",session:"sbjs_session",udata:"sbjs_udata",promocode:"sbjs_promo"},service:{migrations:"sbjs_migrations"},delimiter:"|||",aliases:{main:{type:"typ",source:"src",medium:"mdm",campaign:"cmp",content:"cnt",term:"trm",id:"id",platform:"plt",format:"fmt",tactic:"tct"},extra:{fire_date:"fd",entrance_point:"ep",referer:"rf"},session:{pages_seen:"pgs",current_page:"cpg"},udata:{visits:"vst",ip:"uip",agent:"uag"},promo:"code"},pack:{main:function(e){return i.aliases.main.type+"="+e.type+i.delimiter+i.aliases.main.source+"="+e.source+i.delimiter+i.aliases.main.medium+"="+e.medium+i.delimiter+i.aliases.main.campaign+"="+e.campaign+i.delimiter+i.aliases.main.content+"="+e.content+i.delimiter+i.aliases.main.term+"="+e.term+i.delimiter+i.aliases.main.id+"="+e.id+i.delimiter+i.aliases.main.platform+"="+e.platform+i.delimiter+i.aliases.main.format+"="+e.format+i.delimiter+i.aliases.main.tactic+"="+e.tactic},extra:function(e){return i.aliases.extra.fire_date+"="+a.setDate(new Date,e)+i.delimiter+i.aliases.extra.entrance_point+"="+document.location.href+i.delimiter+i.aliases.extra.referer+"="+(document.referrer||n.none)},user:function(e,t){return i.aliases.udata.visits+"="+e+i.delimiter+i.aliases.udata.ip+"="+t+i.delimiter+i.aliases.udata.agent+"="+navigator.userAgent},session:function(e){return i.aliases.session.pages_seen+"="+e+i.delimiter+i.aliases.session.current_page+"="+document.location.href},promo:function(e){return i.aliases.promo+"="+a.setLeadingZeroToInt(a.randomInt(e.min,e.max),e.max.toString().length)}}};t.exports=i},{"./helpers/utils":5,"./terms":9}],3:[function(e,t,r){"use strict";var n=e("../data").delimiter;t.exports={useBase64:!1,setBase64Flag:function(e){this.useBase64=e},encodeData:function(e){return encodeURIComponent(e).replace(/\!/g,"%21").replace(/\~/g,"%7E").replace(/\*/g,"%2A").replace(/\'/g,"%27").replace(/\(/g,"%28").replace(/\)/g,"%29")},decodeData:function(e){try{return decodeURIComponent(e).replace(/\%21/g,"!").replace(/\%7E/g,"~").replace(/\%2A/g,"*").replace(/\%27/g,"'").replace(/\%28/g,"(").replace(/\%29/g,")")}catch(t){try{return unescape(e)}catch(r){return""}}},set:function(e,t,r,n,a){var i,s;if(r){var o=new Date;o.setTime(o.getTime()+60*r*1e3),i="; expires="+o.toGMTString()}else i="";s=n&&!a?";domain=."+n:"";var c=this.encodeData(t);this.useBase64&&(c=btoa(c).replace(/=+$/,"")),document.cookie=this.encodeData(e)+"="+c+i+s+"; path=/"},get:function(e){for(var t=this.encodeData(e)+"=",r=document.cookie.split(";"),n=0;n<r.length;n++){for(var a=r[n];" "===a.charAt(0);)a=a.substring(1,a.length);if(0===a.indexOf(t)){var i=a.substring(t.length,a.length);if(/^[A-Za-z0-9+/]+$/.test(i))try{i=atob(i.padEnd(4*Math.ceil(i.length/4),"="))}catch(s){}return this.decodeData(i)}}return null},destroy:function(e,t,r){this.set(e,"",-1,t,r)},parse:function(e){var t=[],r={};if("string"==typeof e)t.push(e);else for(var a in e)e.hasOwnProperty(a)&&t.push(e[a]);for(var i=0;i<t.length;i++){var s;r[this.unsbjs(t[i])]={},s=this.get(t[i])?this.get(t[i]).split(n):[];for(var o=0;o<s.length;o++){var c=s[o].split("="),u=c.splice(0,1);u.push(c.join("=")),r[this.unsbjs(t[i])][u[0]]=this.decodeData(u[1])}}return r},unsbjs:function(e){return e.replace("sbjs_","")}}},{"../data":2}],4:[function(e,t,r){"use strict";t.exports={parse:function(e){for(var t=this.parseOptions,r=t.parser[t.strictMode?"strict":"loose"].exec(e),n={},a=14;a--;)n[t.key[a]]=r[a]||"";return n[t.q.name]={},n[t.key[12]].replace(t.q.parser,function(e,r,a){r&&(n[t.q.name][r]=a)}),n},parseOptions:{strictMode:!1,key:["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],q:{name:"queryKey",parser:/(?:^|&)([^&=]*)=?([^&]*)/g},parser:{strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/}},getParam:function(e){for(var t={},r=(e||window.location.search.substring(1)).split("&"),n=0;n<r.length;n++){var a=r[n].split("=");if("undefined"==typeof t[a[0]])t[a[0]]=a[1];else if("string"==typeof t[a[0]]){var i=[t[a[0]],a[1]];t[a[0]]=i}else t[a[0]].push(a[1])}return t},getHost:function(e){return this.parse(e).host.replace("www.","")}}},{}],5:[function(e,t,r){"use strict";t.exports={escapeRegexp:function(e){return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")},setDate:function(e,t){var r=e.getTimezoneOffset()/60,n=e.getHours(),a=t||0===t?t:-r;return e.setHours(n+r+a),e.getFullYear()+"-"+this.setLeadingZeroToInt(e.getMonth()+1,2)+"-"+this.setLeadingZeroToInt(e.getDate(),2)+" "+this.setLeadingZeroToInt(e.getHours(),2)+":"+this.setLeadingZeroToInt(e.getMinutes(),2)+":"+this.setLeadingZeroToInt(e.getSeconds(),2)},setLeadingZeroToInt:function(e,t){for(var r=e+"";r.length<t;)r="0"+r;return r},randomInt:function(e,t){return Math.floor(Math.random()*(t-e+1))+e}}},{}],6:[function(e,t,r){"use strict";var n=e("./data"),a=e("./terms"),i=e("./helpers/cookies"),s=e("./helpers/uri"),o=e("./helpers/utils"),c=e("./params"),u=e("./migrations");t.exports=function(e){var t,r,p,f,m,d,l,g,h,y,_,v,b,x=c.fetch(e),k=s.getParam(),w=x.domain.host,q=x.domain.isolate,I=x.lifetime;function j(e){switch(e){case a.traffic.utm:t=a.traffic.utm,r="undefined"!=typeof k.utm_source?k.utm_source:"undefined"!=typeof k.gclid?"google":"undefined"!=typeof k.yclid?"yandex":a.none,p="undefined"!=typeof k.utm_medium?k.utm_medium:"undefined"!=typeof k.gclid?"cpc":"undefined"!=typeof k.yclid?"cpc":a.none,f="undefined"!=typeof k.utm_campaign?k.utm_campaign:"undefined"!=typeof k[x.campaign_param]?k[x.campaign_param]:"undefined"!=typeof k.gclid?"google_cpc":"undefined"!=typeof k.yclid?"yandex_cpc":a.none,m="undefined"!=typeof k.utm_content?k.utm_content:"undefined"!=typeof k[x.content_param]?k[x.content_param]:a.none,l=k.utm_id||a.none,g=k.utm_source_platform||a.none,h=k.utm_creative_format||a.none,y=k.utm_marketing_tactic||a.none,d="undefined"!=typeof k.utm_term?k.utm_term:"undefined"!=typeof k[x.term_param]?k[x.term_param]:function(){var e=document.referrer;if(k.utm_term)return k.utm_term;if(!(e&&s.parse(e).host&&s.parse(e).host.match(/^(?:.*\.)?yandex\..{2,9}$/i)))return!1;try{return s.getParam(s.parse(document.referrer).query).text}catch(t){return!1}}()||a.none;break;case a.traffic.organic:t=a.traffic.organic,r=r||s.getHost(document.referrer),p=a.referer.organic,f=a.none,m=a.none,d=a.none,l=a.none,g=a.none,h=a.none,y=a.none;break;case a.traffic.referral:t=a.traffic.referral,r=r||s.getHost(document.referrer),p=p||a.referer.referral,f=a.none,m=s.parse(document.referrer).path,d=a.none,l=a.none,g=a.none,h=a.none,y=a.none;break;case a.traffic.typein:t=a.traffic.typein,r=x.typein_attributes.source,p=x.typein_attributes.medium,f=a.none,m=a.none,d=a.none,l=a.none,g=a.none,h=a.none,y=a.none;break;default:t=a.oops,r=a.oops,p=a.oops,f=a.oops,m=a.oops,d=a.oops,l=a.oops,g=a.oops,h=a.oops,y=a.oops}var i={type:t,source:r,medium:p,campaign:f,content:m,term:d,id:l,platform:g,format:h,tactic:y};return n.pack.main(i)}function R(e){var t=document.referrer;switch(e){case a.traffic.organic:return!!t&&H(t)&&function(e){var t=new RegExp("^(?:.*\\.)?"+o.escapeRegexp("yandex")+"\\..{2,9}$"),n=new RegExp(".*"+o.escapeRegexp("text")+"=.*"),a=new RegExp("^(?:www\\.)?"+o.escapeRegexp("google")+"\\..{2,9}$");if(s.parse(e).query&&s.parse(e).host.match(t)&&s.parse(e).query.match(n))return r="yandex",!0;if(s.parse(e).host.match(a))return r="google",!0;if(!s.parse(e).query)return!1;for(var i=0;i<x.organics.length;i++){if(s.parse(e).host.match(new RegExp("^(?:.*\\.)?"+o.escapeRegexp(x.organics[i].host)+"$","i"))&&s.parse(e).query.match(new RegExp(".*"+o.escapeRegexp(x.organics[i].param)+"=.*","i")))return r=x.organics[i].display||x.organics[i].host,!0;if(i+1===x.organics.length)return!1}}(t);case a.traffic.referral:return!!t&&H(t)&&function(e){if(!(x.referrals.length>0))return r=s.getHost(e),!0;for(var t=0;t<x.referrals.length;t++){if(s.parse(e).host.match(new RegExp("^(?:.*\\.)?"+o.escapeRegexp(x.referrals[t].host)+"$","i")))return r=x.referrals[t].display||x.referrals[t].host,p=x.referrals[t].medium||a.referer.referral,!0;if(t+1===x.referrals.length)return r=s.getHost(e),!0}}(t);default:return!1}}function H(e){if(x.domain){if(q)return s.getHost(e)!==s.getHost(w);var t=new RegExp("^(?:.*\\.)?"+o.escapeRegexp(w)+"$","i");return!s.getHost(e).match(t)}return s.getHost(e)!==s.getHost(document.location.href)}function D(){i.set(n.containers.current_extra,n.pack.extra(x.timezone_offset),I,w,q),i.get(n.containers.first_extra)||i.set(n.containers.first_extra,n.pack.extra(x.timezone_offset),I,w,q)}return i.setBase64Flag(x.base64),u.go(I,w,q),i.set(n.containers.current,function(){var e;if("undefined"!=typeof k.utm_source||"undefined"!=typeof k.utm_medium||"undefined"!=typeof k.utm_campaign||"undefined"!=typeof k.utm_content||"undefined"!=typeof k.utm_term||"undefined"!=typeof k.utm_id||"undefined"!=typeof k.utm_source_platform||"undefined"!=typeof k.utm_creative_format||"undefined"!=typeof k.utm_marketing_tactic||"undefined"!=typeof k.gclid||"undefined"!=typeof k.yclid||"undefined"!=typeof k[x.campaign_param]||"undefined"!=typeof k[x.term_param]||"undefined"!=typeof k[x.content_param])D(),e=j(a.traffic.utm);else if(R(a.traffic.organic))D(),e=j(a.traffic.organic);else if(!i.get(n.containers.session)&&R(a.traffic.referral))D(),e=j(a.traffic.referral);else{if(i.get(n.containers.first)||i.get(n.containers.current))return i.get(n.containers.current);D(),e=j(a.traffic.typein)}return e}(),I,w,q),i.get(n.containers.first)||i.set(n.containers.first,i.get(n.containers.current),I,w,q),i.get(n.containers.udata)?(_=parseInt(i.parse(n.containers.udata)[i.unsbjs(n.containers.udata)][n.aliases.udata.visits])||1,_=i.get(n.containers.session)?_:_+1,v=n.pack.user(_,x.user_ip)):(_=1,v=n.pack.user(_,x.user_ip)),i.set(n.containers.udata,v,I,w,q),i.get(n.containers.session)?(b=parseInt(i.parse(n.containers.session)[i.unsbjs(n.containers.session)][n.aliases.session.pages_seen])||1,b+=1):b=1,i.set(n.containers.session,n.pack.session(b),x.session_length,w,q),x.promocode&&!i.get(n.containers.promocode)&&i.set(n.containers.promocode,n.pack.promo(x.promocode),I,w,q),i.parse(n.containers)}},{"./data":2,"./helpers/cookies":3,"./helpers/uri":4,"./helpers/utils":5,"./migrations":7,"./params":8,"./terms":9}],7:[function(e,t,r){"use strict";var n=e("./data"),a=e("./helpers/cookies");t.exports={go:function(e,t,r){var i,s=this.migrations,o={l:e,d:t,i:r};if(a.get(n.containers.first)||a.get(n.service.migrations)){if(!a.get(n.service.migrations))for(i=0;i<s.length;i++)s[i].go(s[i].id,o)}else{var c=[];for(i=0;i<s.length;i++)c.push(s[i].id);var u="";for(i=0;i<c.length;i++)u+=c[i]+"=1",i<c.length-1&&(u+=n.delimiter);a.set(n.service.migrations,u,o.l,o.d,o.i)}},migrations:[{id:"1418474375998",version:"1.0.0-beta",go:function(e,t){var r=e+"=1",i=e+"=0",s=function(e,t,r){return t||r?e:n.delimiter};try{var o=[];for(var c in n.containers)n.containers.hasOwnProperty(c)&&o.push(n.containers[c]);for(var u=0;u<o.length;u++)if(a.get(o[u])){var p=a.get(o[u]).replace(/(\|)?\|(\|)?/g,s);a.destroy(o[u],t.d,t.i),a.destroy(o[u],t.d,!t.i),a.set(o[u],p,t.l,t.d,t.i)}a.get(n.containers.session)&&a.set(n.containers.session,n.pack.session(0),t.l,t.d,t.i),a.set(n.service.migrations,r,t.l,t.d,t.i)}catch(f){a.set(n.service.migrations,i,t.l,t.d,t.i)}}}]}},{"./data":2,"./helpers/cookies":3}],8:[function(e,t,r){"use strict";var n=e("./terms"),a=e("./helpers/uri");t.exports={fetch:function(e){var t=e||{},r={};if(r.lifetime=this.validate.checkFloat(t.lifetime)||6,r.lifetime=parseInt(30*r.lifetime*24*60),r.session_length=this.validate.checkInt(t.session_length)||30,r.timezone_offset=this.validate.checkInt(t.timezone_offset),r.base64=t.base64||!1,r.campaign_param=t.campaign_param||!1,r.term_param=t.term_param||!1,r.content_param=t.content_param||!1,r.user_ip=t.user_ip||n.none,t.promocode?(r.promocode={},r.promocode.min=parseInt(t.promocode.min)||1e5,r.promocode.max=parseInt(t.promocode.max)||999999):r.promocode=!1,t.typein_attributes&&t.typein_attributes.source&&t.typein_attributes.medium?(r.typein_attributes={},r.typein_attributes.source=t.typein_attributes.source,r.typein_attributes.medium=t.typein_attributes.medium):r.typein_attributes={source:"(direct)",medium:"(none)"},t.domain&&this.validate.isString(t.domain)?r.domain={host:t.domain,isolate:!1}:t.domain&&t.domain.host?r.domain=t.domain:r.domain={host:a.getHost(document.location.hostname),isolate:!1},r.referrals=[],t.referrals&&t.referrals.length>0)for(var i=0;i<t.referrals.length;i++)t.referrals[i].host&&r.referrals.push(t.referrals[i]);if(r.organics=[],t.organics&&t.organics.length>0)for(var s=0;s<t.organics.length;s++)t.organics[s].host&&t.organics[s].param&&r.organics.push(t.organics[s]);return r.organics.push({host:"bing.com",param:"q",display:"bing"}),r.organics.push({host:"yahoo.com",param:"p",display:"yahoo"}),r.organics.push({host:"about.com",param:"q",display:"about"}),r.organics.push({host:"aol.com",param:"q",display:"aol"}),r.organics.push({host:"ask.com",param:"q",display:"ask"}),r.organics.push({host:"globososo.com",param:"q",display:"globo"}),r.organics.push({host:"go.mail.ru",param:"q",display:"go.mail.ru"}),r.organics.push({host:"rambler.ru",param:"query",display:"rambler"}),r.organics.push({host:"tut.by",param:"query",display:"tut.by"}),r.referrals.push({host:"t.co",display:"twitter.com"}),r.referrals.push({host:"plus.url.google.com",display:"plus.google.com"}),r},validate:{checkFloat:function(e){return!(!e||!this.isNumeric(parseFloat(e)))&&parseFloat(e)},checkInt:function(e){return!(!e||!this.isNumeric(parseInt(e)))&&parseInt(e)},isNumeric:function(e){return!isNaN(e)},isString:function(e){return"[object String]"===Object.prototype.toString.call(e)}}}},{"./helpers/uri":4,"./terms":9}],9:[function(e,t,r){"use strict";t.exports={traffic:{utm:"utm",organic:"organic",referral:"referral",typein:"typein"},referer:{referral:"referral",organic:"organic",social:"social"},none:"(none)",oops:"(Houston, we have a problem)"}},{}]},{},[1])(1)});;
/* =====================================================================
 * op-career-fit-data.js — ファイナンスキャリア適性診断 設定データ＋スコアリングエンジン
 * =====================================================================
 * 大手町プレップ独自コンテンツ。設問・職種プロファイル・重み・結果文・
 * 学習パス・記事/ラボ/教材マッピングをUIから分離して管理する。
 * 決定論的（同じ回答→同じ結果）。Node.jsでもそのまま読み込めるため
 * ユニットテスト（tests/career-fit.test.js）から直接検証できる。
 *
 * スコアリング設計（op-career-fit-v1）:
 *  - 各設問は1つの評価軸(axis)に紐づく。5段階回答は 0..4、逆転項目は 4-値。
 *  - 軸スコア = 獲得点 / 満点（未回答設問は分母から除外）→ 0..1
 *  - 職種ごとに軸別の「理想値(ideal 0..1)」と「重要度(imp 0..3)」を持ち、
 *      適合度 = Σ imp × (1 − |軸スコア − ideal|) ÷ Σ imp
 *    をカテゴリ別に計算する。
 *  - キャリア相性 = 45%×興味・価値観 + 35%×行動特性 + 20%×働き方（0-100）
 *  - 現在の準備度 = 職種別の重み付きスキル軸平均（0-100・相性とは独立）
 *  - 同点時はキャリア相性→準備度→職種定義順で確定（決定論的）。
 *  - 回答のばらつき(SD)が小さい／同一回答の連続が長い場合は診断精度を下げる。
 * ===================================================================== */
(function (root, factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (root) { root.OPCF = api; }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : null), function () {
  'use strict';

  /* ---------------- 評価軸 ---------------- */
  var AXES = {
    /* A. 興味・価値観 */
    iDeal:     { cat: 'interest', label: 'M&A・大型案件への関心' },
    iInvest:   { cat: 'interest', label: '企業価値・投資判断への関心' },
    iMarket:   { cat: 'interest', label: '市場・マクロへの関心' },
    iBiz:      { cat: 'interest', label: '事業・経営への関心' },
    iAdvisory: { cat: 'interest', label: '助言・伴走へのやりがい' },
    iNum:      { cat: 'interest', label: '数字・分析への関心' },
    /* B. 行動特性 */
    tAnalytic: { cat: 'trait', label: '分析的思考・仮説構築' },
    tDetail:   { cat: 'trait', label: '細部への注意・正確性' },
    tPressure: { cat: 'trait', label: 'プレッシャー耐性' },
    tPeople:   { cat: 'trait', label: '対人・交渉・説明力' },
    tAutonomy: { cat: 'trait', label: '自律性・完遂力' },
    tCompete:  { cat: 'trait', label: '競争・成果志向' },
    /* C. 働く環境との相性 */
    wIntensity:{ cat: 'work', label: '高強度な働き方の許容' },
    wClient:   { cat: 'work', label: '対外・顧客接点の希望' },
    wTeam:     { cat: 'work', label: 'チーム協働の希望' },
    wReward:   { cat: 'work', label: '成果連動報酬の希望' },
    wPace:     { cat: 'work', label: '変化の速い環境の希望' },
    /* D. 現在の知識・スキル（準備度） */
    pAcct:     { cat: 'prep', label: '会計・財務三表' },
    pExcel:    { cat: 'prep', label: 'Excelスキル' },
    pModel:    { cat: 'prep', label: '財務モデリング・バリュエーション' },
    pAnalysis: { cat: 'prep', label: '財務・市場分析' },
    pWork:     { cat: 'prep', label: '関連実務経験' }
  };

  /* ---------------- 5段階選択肢（共通） ---------------- */
  var SCALE = [
    'まったく当てはまらない',
    'やや当てはまらない',
    'どちらともいえない',
    'やや当てはまる',
    '非常に当てはまる'
  ];

  /* ---------------- 設問（全38問・採点対象37問） ---------------- */
  /* type: 'scale'（5段階共通） / 'choice'（設問固有の選択肢＋値） / 'profile'（採点対象外） */
  var QUESTIONS = [
    /* ===== STEP 1: 現在地・経験（5問） ===== */
    { id: 'q01', step: 1, type: 'profile',
      text: 'あなたの現在の立場に最も近いものはどれですか？',
      options: ['大学生・大学院生', '社会人1〜3年目', '社会人4年目以上', '転職・キャリアチェンジを検討中'] },
    { id: 'q02', step: 1, type: 'choice', axis: 'pAcct',
      text: '会計・財務三表（PL・BS・CF）の知識について、最も近いものはどれですか？',
      options: ['これから学ぶ', '簿記や授業で基礎に触れた', '三表のつながりを説明できる', '実務や学習で日常的に使っている'],
      values: [0, 1, 3, 4] },
    { id: 'q03', step: 1, type: 'choice', axis: 'pExcel',
      text: 'Excelの使用経験について、最も近いものはどれですか？',
      options: ['ほとんど使わない', '基本操作・簡単な表計算はできる', '関数やピボットで分析に使っている', 'ショートカット中心で日常的に使いこなす'],
      values: [0, 1, 3, 4] },
    { id: 'q04', step: 1, type: 'choice', axis: 'pModel',
      text: '財務モデリング（3表連動・DCF・LBOなど）の経験について、最も近いものはどれですか？',
      options: ['まだ組んだことがない', '学習用に触れたことがある', 'DCFなど一部は自力で組める', '選考・実務レベルで複数の型を組める'],
      values: [0, 1, 3, 4] },
    { id: 'q05', step: 1, type: 'choice', axis: 'pWork',
      text: '財務・投資・審査などに関わる実務経験はありますか？',
      options: ['まだない', '営業・企画など隣接業務の経験がある', '経理・予実管理・審査などの経験がある', '投資・M&A・融資などの経験がある'],
      values: [0, 1, 3, 4] },

    /* ===== STEP 2: 興味・価値観（9問） ===== */
    { id: 'q06', step: 2, type: 'scale', axis: 'iDeal',
      text: '企業の買収・売却や大型の資金調達のニュースを見ると、仕組みや背景まで知りたくなる。' },
    { id: 'q07', step: 2, type: 'scale', axis: 'iInvest',
      text: '「この会社は今の値段より高いか、安いか」を自分なりに考えるのが好きだ。' },
    { id: 'q08', step: 2, type: 'scale', axis: 'iMarket',
      text: '金利・為替・株価など、市場の動きを日常的に追いかけるのは苦にならない。' },
    { id: 'q09', step: 2, type: 'scale', axis: 'iBiz',
      text: '企業のビジネスモデルや経営者の意思決定に、強い興味がある。' },
    { id: 'q10', step: 2, type: 'scale', axis: 'iBiz',
      text: '新しい産業やスタートアップが成長していく過程に、わくわくする。' },
    { id: 'q11', step: 2, type: 'scale', axis: 'iAdvisory',
      text: '自分の分析や提案で、誰かの重要な意思決定を支えることにやりがいを感じる。' },
    { id: 'q12', step: 2, type: 'scale', axis: 'iNum',
      text: '数字やデータを整理・分析する作業そのものが好きだ。' },
    { id: 'q13', step: 2, type: 'scale', axis: 'iNum', reverse: true,
      text: '一日の大半を数字と向き合って過ごすのは、正直つらいと感じる。' },
    { id: 'q14', step: 2, type: 'scale', axis: 'iDeal',
      text: '数ヶ月かけて大きな案件をやり遂げる仕事に、魅力を感じる。' },

    /* ===== STEP 3: 行動特性・仕事の進め方（11問） ===== */
    { id: 'q15', step: 3, type: 'scale', axis: 'tAnalytic',
      text: '複雑な問題は、要素に分解して構造を整理してから考えるほうだ。' },
    { id: 'q16', step: 3, type: 'scale', axis: 'tAnalytic',
      text: '情報が足りない場面でも、まず仮説を立てて、検証しながら前に進められる。' },
    { id: 'q17', step: 3, type: 'scale', axis: 'tDetail',
      text: '資料の数字のズレや誤字に、人より早く気づくほうだ。' },
    { id: 'q18', step: 3, type: 'scale', axis: 'tDetail', reverse: true,
      text: '細かい確認作業は苦手で、つい大まかに済ませてしまうことが多い。' },
    { id: 'q19', step: 3, type: 'scale', axis: 'tPressure',
      text: '締切が重なる状況でも、落ち着いて優先順位を付けて対処できる。' },
    { id: 'q20', step: 3, type: 'scale', axis: 'tPressure',
      text: '想定外のトラブルが起きても、感情的にならず淡々と対応できるほうだ。' },
    { id: 'q21', step: 3, type: 'scale', axis: 'tPeople',
      text: '初対面の相手とも、比較的早く信頼関係を築けるほうだ。' },
    { id: 'q22', step: 3, type: 'scale', axis: 'tPeople',
      text: '利害が対立する相手との調整や交渉は、嫌いではない。' },
    { id: 'q23', step: 3, type: 'scale', axis: 'tPeople',
      text: '複雑な内容を、相手の知識に合わせてかみ砕いて説明するのが得意だ。' },
    { id: 'q24', step: 3, type: 'scale', axis: 'tAutonomy',
      text: '細かい指示がなくても、自分で段取りを組んで最後までやり切れる。' },
    { id: 'q25', step: 3, type: 'scale', axis: 'tCompete',
      text: '成果が数字や順位で比較される環境のほうが、力が出る。' },

    /* ===== STEP 4: スキル・経験（7問） ===== */
    { id: 'q26', step: 4, type: 'scale', axis: 'pModel',
      text: 'DCF（将来キャッシュフローを割り引いて価値を測る考え方）を、人に説明できる。' },
    { id: 'q27', step: 4, type: 'scale', axis: 'pModel',
      text: 'LBOモデルやM&Aモデルがどのような計算をしているか、概ね理解している。' },
    { id: 'q28', step: 4, type: 'scale', axis: 'pAnalysis',
      text: '決算書を読んで、その会社の稼ぐ力や財務リスクを大まかに評価できる。' },
    { id: 'q29', step: 4, type: 'scale', axis: 'pAnalysis',
      text: '業界や市場を調べて、レポートや資料にまとめた経験がある。' },
    { id: 'q30', step: 4, type: 'scale', axis: 'pWork',
      text: '予算策定・予実管理・KPI管理などの業務を経験したことがある。' },
    { id: 'q31', step: 4, type: 'scale', axis: 'pWork',
      text: 'デューデリジェンス・監査・与信審査など、詳細なレビュー業務の経験がある。' },
    { id: 'q32', step: 4, type: 'scale', axis: 'pAnalysis',
      text: '統計・確率やリスクの考え方（分散・シナリオ分析など）に馴染みがある。' },

    /* ===== STEP 5: 働き方の希望（6問） ===== */
    { id: 'q33', step: 5, type: 'scale', axis: 'wIntensity',
      text: '成長のためなら、繁忙期に仕事最優先の生活になっても構わない。' },
    { id: 'q34', step: 5, type: 'scale', axis: 'wIntensity', reverse: true,
      text: '平日でも自分の時間をきちんと確保できる働き方を、何より優先したい。' },
    { id: 'q35', step: 5, type: 'scale', axis: 'wClient',
      text: '社外の顧客や投資家と日常的に向き合う仕事がしたい。' },
    { id: 'q36', step: 5, type: 'scale', axis: 'wTeam',
      text: 'ひとりで完結する仕事より、チームで進める仕事のほうが好きだ。' },
    { id: 'q37', step: 5, type: 'scale', axis: 'wReward',
      text: '報酬は安定しているより、成果に応じて大きく変わるほうがよい。' },
    { id: 'q38', step: 5, type: 'scale', axis: 'wPace',
      text: '変化が速く忙しい環境と、落ち着いてじっくり取り組む環境なら、前者を選ぶ。' }
  ];

  var STEPS = [
    { n: 0, label: '診断の説明' },
    { n: 1, label: '現在地・経験' },
    { n: 2, label: '興味・価値観' },
    { n: 3, label: '行動特性' },
    { n: 4, label: 'スキル・経験' },
    { n: 5, label: '働き方の希望' }
  ];

  /* ---------------- 職種プロファイル ----------------
   * profile: axis → [ideal(0..1), importance(0..3)]
   * prep:    axis → importance（準備度の重み）
   */
  var CAREERS = [
    {
      id: 'ib', name: '投資銀行・M&Aアドバイザリー', en: 'Investment Banking / M&A Advisory',
      profile: {
        iDeal: [1, 3], iInvest: [0.75, 2], iMarket: [0.5, 1], iBiz: [0.5, 1], iAdvisory: [0.75, 2], iNum: [0.75, 2],
        tAnalytic: [1, 2], tDetail: [1, 3], tPressure: [1, 3], tPeople: [0.75, 2], tAutonomy: [0.75, 1], tCompete: [0.75, 2],
        wIntensity: [1, 3], wClient: [0.75, 2], wTeam: [0.75, 1], wReward: [0.75, 2], wPace: [1, 2]
      },
      prep: { pAcct: 3, pExcel: 3, pModel: 3, pAnalysis: 2, pWork: 1 }
    },
    {
      id: 'fas', name: 'FAS・バリュエーション', en: 'FAS / Valuation',
      profile: {
        iDeal: [0.75, 2], iInvest: [1, 3], iMarket: [0.25, 1], iBiz: [0.5, 1], iAdvisory: [0.5, 1], iNum: [1, 3],
        tAnalytic: [1, 3], tDetail: [1, 3], tPressure: [0.75, 2], tPeople: [0.5, 1], tAutonomy: [0.75, 2], tCompete: [0.5, 1],
        wIntensity: [0.75, 2], wClient: [0.5, 1], wTeam: [0.75, 1], wReward: [0.5, 1], wPace: [0.5, 1]
      },
      prep: { pAcct: 3, pExcel: 3, pModel: 3, pAnalysis: 2, pWork: 2 }
    },
    {
      id: 'pe', name: 'PEファンド・バイアウト投資', en: 'Private Equity',
      profile: {
        iDeal: [1, 2], iInvest: [1, 3], iMarket: [0.5, 1], iBiz: [1, 3], iAdvisory: [0.5, 1], iNum: [0.75, 2],
        tAnalytic: [1, 3], tDetail: [0.75, 2], tPressure: [1, 2], tPeople: [0.75, 2], tAutonomy: [1, 2], tCompete: [0.75, 2],
        wIntensity: [1, 2], wClient: [0.5, 1], wTeam: [0.75, 1], wReward: [1, 2], wPace: [0.75, 1]
      },
      prep: { pAcct: 2, pExcel: 2, pModel: 3, pAnalysis: 2, pWork: 2 }
    },
    {
      id: 'vc', name: 'ベンチャーキャピタル', en: 'Venture Capital',
      profile: {
        iDeal: [0.5, 1], iInvest: [0.75, 2], iMarket: [0.5, 1], iBiz: [1, 3], iAdvisory: [0.75, 2], iNum: [0.5, 1],
        tAnalytic: [0.75, 2], tDetail: [0.5, 1], tPressure: [0.5, 1], tPeople: [1, 3], tAutonomy: [1, 2], tCompete: [0.5, 1],
        wIntensity: [0.75, 1], wClient: [1, 2], wTeam: [0.5, 1], wReward: [0.75, 1], wPace: [1, 2]
      },
      prep: { pAcct: 1, pExcel: 1, pModel: 2, pAnalysis: 3, pWork: 2 }
    },
    {
      id: 'corpdev', name: '事業会社M&A・コーポレートディベロップメント', en: 'Corporate Development',
      profile: {
        iDeal: [1, 3], iInvest: [0.75, 2], iMarket: [0.25, 1], iBiz: [1, 2], iAdvisory: [0.5, 1], iNum: [0.5, 1],
        tAnalytic: [0.75, 2], tDetail: [0.75, 2], tPressure: [0.5, 1], tPeople: [0.75, 2], tAutonomy: [0.75, 2], tCompete: [0.5, 1],
        wIntensity: [0.5, 2], wClient: [0.5, 1], wTeam: [0.75, 2], wReward: [0.25, 1], wPace: [0.5, 1]
      },
      prep: { pAcct: 2, pExcel: 2, pModel: 2, pAnalysis: 2, pWork: 3 }
    },
    {
      id: 'fpa', name: '経営企画・FP&A', en: 'Corporate Planning / FP&A',
      profile: {
        iDeal: [0.25, 1], iInvest: [0.5, 1], iMarket: [0.25, 1], iBiz: [1, 3], iAdvisory: [0.5, 2], iNum: [0.75, 2],
        tAnalytic: [0.75, 2], tDetail: [0.75, 2], tPressure: [0.5, 1], tPeople: [0.75, 2], tAutonomy: [0.75, 2], tCompete: [0.25, 1],
        wIntensity: [0.5, 2], wClient: [0.25, 1], wTeam: [0.75, 2], wReward: [0.25, 1], wPace: [0.5, 1]
      },
      prep: { pAcct: 3, pExcel: 3, pModel: 1, pAnalysis: 2, pWork: 2 }
    },
    {
      id: 'cm', name: 'ECM・DCM（資本市場業務）', en: 'Equity / Debt Capital Markets',
      profile: {
        iDeal: [0.75, 2], iInvest: [0.5, 1], iMarket: [1, 3], iBiz: [0.5, 1], iAdvisory: [0.75, 2], iNum: [0.5, 1],
        tAnalytic: [0.75, 2], tDetail: [0.75, 2], tPressure: [1, 2], tPeople: [1, 2], tAutonomy: [0.5, 1], tCompete: [0.75, 1],
        wIntensity: [0.75, 2], wClient: [1, 2], wTeam: [0.75, 1], wReward: [0.75, 1], wPace: [1, 2]
      },
      prep: { pAcct: 2, pExcel: 2, pModel: 2, pAnalysis: 3, pWork: 1 }
    },
    {
      id: 'er', name: 'エクイティリサーチ', en: 'Equity Research',
      profile: {
        iDeal: [0.25, 1], iInvest: [1, 3], iMarket: [1, 3], iBiz: [0.75, 2], iAdvisory: [0.5, 1], iNum: [1, 2],
        tAnalytic: [1, 3], tDetail: [0.75, 2], tPressure: [0.75, 1], tPeople: [0.5, 1], tAutonomy: [1, 2], tCompete: [0.5, 1],
        wIntensity: [0.75, 1], wClient: [0.5, 1], wTeam: [0.25, 1], wReward: [0.5, 1], wPace: [0.75, 1]
      },
      prep: { pAcct: 2, pExcel: 2, pModel: 3, pAnalysis: 3, pWork: 1 }
    },
    {
      id: 'am', name: 'アセットマネジメント', en: 'Asset Management',
      profile: {
        iDeal: [0.25, 1], iInvest: [1, 3], iMarket: [1, 3], iBiz: [0.5, 1], iAdvisory: [0.5, 1], iNum: [0.75, 2],
        tAnalytic: [1, 2], tDetail: [0.75, 2], tPressure: [0.5, 1], tPeople: [0.5, 1], tAutonomy: [0.75, 2], tCompete: [0.5, 1],
        wIntensity: [0.5, 2], wClient: [0.25, 1], wTeam: [0.5, 1], wReward: [0.5, 1], wPace: [0.5, 1]
      },
      prep: { pAcct: 1, pExcel: 2, pModel: 2, pAnalysis: 3, pWork: 1 }
    },
    {
      id: 'st', name: 'セールス＆トレーディング', en: 'Sales & Trading',
      profile: {
        iDeal: [0.25, 1], iInvest: [0.5, 1], iMarket: [1, 3], iBiz: [0.25, 1], iAdvisory: [0.5, 1], iNum: [0.75, 2],
        tAnalytic: [0.75, 2], tDetail: [0.5, 1], tPressure: [1, 3], tPeople: [0.75, 2], tAutonomy: [0.75, 1], tCompete: [1, 2],
        wIntensity: [0.75, 1], wClient: [0.75, 1], wTeam: [0.5, 1], wReward: [1, 2], wPace: [1, 3]
      },
      prep: { pAcct: 1, pExcel: 2, pModel: 1, pAnalysis: 3, pWork: 1 }
    },
    {
      id: 'credit', name: '法人融資・クレジット', en: 'Corporate Lending / Credit',
      profile: {
        iDeal: [0.25, 1], iInvest: [0.5, 1], iMarket: [0.5, 1], iBiz: [0.75, 2], iAdvisory: [0.75, 2], iNum: [0.75, 2],
        tAnalytic: [0.75, 2], tDetail: [1, 3], tPressure: [0.5, 1], tPeople: [0.75, 2], tAutonomy: [0.5, 1], tCompete: [0.25, 1],
        wIntensity: [0.25, 2], wClient: [0.75, 2], wTeam: [0.75, 1], wReward: [0.25, 1], wPace: [0.25, 1]
      },
      prep: { pAcct: 3, pExcel: 2, pModel: 1, pAnalysis: 3, pWork: 2 }
    },
    {
      id: 'risk', name: '市場・信用・オペレーショナルリスク管理', en: 'Risk Management',
      profile: {
        iDeal: [0, 1], iInvest: [0.25, 1], iMarket: [0.75, 2], iBiz: [0.25, 1], iAdvisory: [0.25, 1], iNum: [1, 3],
        tAnalytic: [1, 3], tDetail: [1, 3], tPressure: [0.5, 1], tPeople: [0.5, 1], tAutonomy: [0.75, 1], tCompete: [0, 1],
        wIntensity: [0.25, 2], wClient: [0, 2], wTeam: [0.5, 1], wReward: [0, 1], wPace: [0.25, 1]
      },
      prep: { pAcct: 2, pExcel: 2, pModel: 1, pAnalysis: 3, pWork: 2 }
    },
    {
      id: 'wm', name: 'ウェルスマネジメント', en: 'Wealth Management',
      profile: {
        iDeal: [0, 1], iInvest: [0.75, 2], iMarket: [0.75, 2], iBiz: [0.5, 1], iAdvisory: [1, 3], iNum: [0.5, 1],
        tAnalytic: [0.5, 1], tDetail: [0.5, 1], tPressure: [0.5, 1], tPeople: [1, 3], tAutonomy: [0.75, 1], tCompete: [0.5, 2],
        wIntensity: [0.5, 1], wClient: [1, 3], wTeam: [0.5, 1], wReward: [0.75, 2], wPace: [0.5, 1]
      },
      prep: { pAcct: 1, pExcel: 1, pModel: 1, pAnalysis: 2, pWork: 1 }
    }
  ];

  /* ---------------- キャリア相性の配合 ---------------- */
  var FIT_MIX = { interest: 0.45, trait: 0.35, work: 0.20 };

  return {
    AXES: AXES, SCALE: SCALE, QUESTIONS: QUESTIONS, STEPS: STEPS,
    CAREERS: CAREERS, FIT_MIX: FIT_MIX,

    /* ================= スコアリングエンジン ================= */

    /** 回答値（設問定義に基づく正規化前の素点 0..4）を返す。逆転処理込み。 */
    answerValue: function (q, idx) {
      if (idx == null || idx < 0) { return null; }
      if (q.type === 'choice') {
        if (idx >= q.values.length) { return null; }
        return q.values[idx];
      }
      if (idx > 4) { return null; }
      return q.reverse ? (4 - idx) : idx;
    },

    /** 軸スコア（0..1）を計算。answers = {qid: 選択肢index} */
    axisScores: function (answers) {
      var got = {}, max = {};
      for (var i = 0; i < QUESTIONS.length; i++) {
        var q = QUESTIONS[i];
        if (q.type === 'profile' || !q.axis) { continue; }
        var v = this.answerValue(q, answers ? answers[q.id] : null);
        if (v === null || typeof v === 'undefined') { continue; } /* 未回答・異常値は除外 */
        got[q.axis] = (got[q.axis] || 0) + v;
        max[q.axis] = (max[q.axis] || 0) + 4;
      }
      var out = {};
      for (var ax in AXES) {
        out[ax] = max[ax] ? (got[ax] / max[ax]) : 0;
      }
      return out;
    },

    /** カテゴリ別適合度（0..1）: Σimp×(1−|score−ideal|)/Σimp */
    categoryFit: function (career, axes, cat) {
      var num = 0, den = 0;
      for (var ax in career.profile) {
        if (AXES[ax].cat !== cat) { continue; }
        var ideal = career.profile[ax][0], imp = career.profile[ax][1];
        num += imp * (1 - Math.abs((axes[ax] || 0) - ideal));
        den += imp;
      }
      return den ? (num / den) : 0;
    },

    /** 準備度（0..100） */
    readiness: function (career, axes) {
      var num = 0, den = 0;
      for (var ax in career.prep) {
        num += career.prep[ax] * (axes[ax] || 0);
        den += career.prep[ax];
      }
      return den ? Math.round(100 * num / den) : 0;
    },

    /** 診断精度: 回答のばらつき・同一回答連続から判定 */
    confidence: function (answers) {
      var vals = [], streak = 1, maxStreak = 1, prev = null, answered = 0, total = 0;
      for (var i = 0; i < QUESTIONS.length; i++) {
        var q = QUESTIONS[i];
        if (q.type !== 'scale') { continue; }
        total++;
        var idx = answers ? answers[q.id] : null;
        if (idx == null || idx < 0 || idx > 4) { prev = null; continue; }
        answered++;
        vals.push(idx);
        if (prev !== null && idx === prev) { streak++; maxStreak = Math.max(maxStreak, streak); }
        else { streak = 1; }
        prev = idx;
      }
      var mean = 0, sd = 0;
      if (vals.length) {
        for (var j = 0; j < vals.length; j++) { mean += vals[j]; }
        mean /= vals.length;
        for (var k = 0; k < vals.length; k++) { sd += (vals[k] - mean) * (vals[k] - mean); }
        sd = Math.sqrt(sd / vals.length);
      }
      var level = 'high', note = '回答に十分なばらつきがあり、傾向を読み取りやすい状態です。';
      if (answered < total) {
        level = 'low'; note = '未回答の設問があるため、参考値として表示しています。';
      } else if (sd < 0.65) {
        level = 'low'; note = '回答のばらつきが小さいため、診断精度を低めに表示しています。選択肢の両端も使って再診断すると、傾向がより明確になります。';
      } else if (sd < 0.95 || maxStreak >= 12) {
        level = 'mid'; note = '回答の振れ幅がやや小さめです。結果は複数の可能性として読んでください。';
      }
      return { level: level, note: note, sd: Math.round(sd * 100) / 100, maxStreak: maxStreak, answered: answered, total: total };
    },

    /**
     * メイン: 全職種スコアを計算して降順ランキングを返す。
     * 同点時: キャリア相性→準備度→職種定義順（決定論的）。
     */
    score: function (answers) {
      var axes = this.axisScores(answers);
      var rows = [];
      for (var i = 0; i < CAREERS.length; i++) {
        var c = CAREERS[i];
        var fi = this.categoryFit(c, axes, 'interest');
        var ft = this.categoryFit(c, axes, 'trait');
        var fw = this.categoryFit(c, axes, 'work');
        var fit = Math.round(100 * (FIT_MIX.interest * fi + FIT_MIX.trait * ft + FIT_MIX.work * fw));
        rows.push({
          id: c.id, name: c.name, order: i,
          fit: Math.max(0, Math.min(100, fit)),
          interestFit: Math.round(100 * fi),
          traitFit: Math.round(100 * ft),
          workFit: Math.round(100 * fw),
          readiness: this.readiness(c, axes)
        });
      }
      rows.sort(function (a, b) {
        if (b.fit !== a.fit) { return b.fit - a.fit; }
        if (b.readiness !== a.readiness) { return b.readiness - a.readiness; }
        return a.order - b.order;
      });
      for (var r = 0; r < rows.length; r++) { rows[r].rank = r + 1; }
      return { axes: axes, careers: rows, top3: rows.slice(0, 3), confidence: this.confidence(answers) };
    },

    /** 準備度バンド（CTA出し分け・学習開始点） */
    readinessBand: function (v) {
      if (v >= 70) { return 'advanced'; }
      if (v >= 40) { return 'core'; }
      return 'foundation';
    }
  };
});

/* =====================================================================
 * 職種別コンテンツ（careerDescriptions / learningPaths / contentMappings /
 * productMappings）。リンクはすべて大手町プレップ内の実在ページのみ。
 * ===================================================================== */
(function (root) {
  'use strict';
  var OPCF = (typeof module !== 'undefined' && module.exports) ? module.exports : root.OPCF;
  if (!OPCF) { return; }

  /* 教材マスタ（存在する教材のみ。販売状況の表示はサーバー側の
     op_materials_data() が正で、ここではリンク先スラッグだけを持つ） */
  OPCF.MATERIALS = {
    '3statement': { title: '財務三表モデリング講座', href: '/materials/3statement/' },
    'dcf':        { title: 'DCFモデリング講座', href: '/materials/dcf/' },
    'comps':      { title: 'Compsモデリング講座', href: '/materials/comps/' },
    'ma':         { title: 'M&Aモデリング講座', href: '/materials/ma/' },
    'lbo':        { title: 'LBOモデリング講座', href: '/materials/lbo/' },
    'iv160':      { title: '投資銀行面接 想定問答160', href: '/materials/investment-banking-interview-160/' }
  };

  /* 教材ステータス表示 */
  OPCF.MATERIAL_STATUS = {
    full:      '対応教材あり',
    related:   '関連教材あり',
    free:      '無料記事で準備可能',
    preparing: '教材準備中'
  };

  /* 準備度バンド別の学習開始点（CTA出し分け） */
  OPCF.READINESS_CTA = {
    foundation: {
      label: 'まず会計・財務三表から始めましょう',
      desc: '三表のつながりが最初の土台です。無料記事と無料講座で基礎を固めてから、Excelで手を動かす段階へ進むのが最短です。',
      links: [
        { t: '無料記事：財務三表のつながり', href: '/acc-001-three-statements/' },
        { t: '財務モデリング講座（全28章・無料）', href: '/course/' },
        { t: '教材：財務三表モデリング講座の中身を見る', href: '/materials/3statement/' }
      ]
    },
    core: {
      label: '次はDCF・バリュエーションを学びましょう',
      desc: '基礎はできています。DCFとバリュエーションを一度自分の手で組むと、どの職種でも通用する核ができます。',
      links: [
        { t: '無料記事：DCF法の理論と実務論点', href: '/val-002-dcf-guide/' },
        { t: 'チュートリアル：DCFモデルをゼロから作る', href: '/tut-dcf-excel-build/' },
        { t: '教材：DCFモデリング講座の中身を見る', href: '/materials/dcf/' }
      ]
    },
    advanced: {
      label: 'M&A・LBO・モデルテスト対策へ進みましょう',
      desc: '準備度は十分です。取引系モデル（M&A・LBO）と選考対策で、実務・選考で証明できる状態に仕上げる段階です。',
      links: [
        { t: 'チュートリアル：LBOモデルをゼロから組む', href: '/tut-lbo-excel-build/' },
        { t: '無料記事：モデルテスト対策', href: '/car-005-modeling-test/' },
        { t: '教材：LBO / M&Aモデリング講座の中身を見る', href: '/materials/lbo/' }
      ]
    }
  };

  /* レーダーチャートの表示軸（ユーザー軸スコアの合成方法） */
  OPCF.RADAR = [
    { label: '分析・仮説構築', axes: ['tAnalytic'] },
    { label: '数字・正確性',   axes: ['tDetail', 'iNum'] },
    { label: '対人・交渉',     axes: ['tPeople'] },
    { label: '耐圧性・スピード', axes: ['tPressure', 'wPace'] },
    { label: '事業・投資への関心', axes: ['iDeal', 'iInvest', 'iBiz'] },
    { label: '市場への関心',   axes: ['iMarket'] }
  ];

  /* 職種別コンテンツ */
  OPCF.CONTENT = {
    ib: {
      tagline: 'M&Aや資金調達の大型案件を、高い密度でやり遂げる仕事',
      job: '企業の買収・売却や資金調達について、企業に助言する仕事です。バリュエーション、資料作成、交渉サポート、案件全体の進行管理まで、少人数チームで数ヶ月単位の案件を回します。若手のうちからモデリングと資料作成の量をこなし、案件の全工程に触れられるのが特徴です。',
      workstyle: '案件ドリブンで繁閑の差が大きく、佳境では仕事最優先の期間が続きます。密度の高い環境で短期間に技術を身につけたい人と相性のよい環境です。',
      mismatch: [
        '生活リズムの安定・自分の時間の確保を最優先したい場合、案件期の負荷とのギャップが大きくなりがちです',
        '数字の細部を詰める作業が苦手だと、資料・モデルの精度要求がストレスになります',
        '「じっくり一つの会社を深く見る」働き方を求める場合は、PE・リサーチ系のほうが近いことがあります'
      ],
      path: 'アナリスト→アソシエイトと進み、その後はPEファンド・事業会社M&A・スタートアップCFOなど選択肢が広いのが特徴です。',
      reasons: {
        iDeal: 'M&A・大型案件への関心が高く、案件を動かす仕事の中心的な動機と一致しています',
        tDetail: '数字や資料の細部に気づく傾向は、モデル・資料の精度が信用に直結するこの仕事で強みになります',
        tPressure: 'プレッシャー下でも優先順位を保てる傾向は、締切が重なる案件業務との相性が良い要素です',
        wIntensity: '高強度な働き方への許容度が、案件期の負荷と現実的に合っています',
        iNum: '数字・分析への関心が、日々のバリュエーション・モデリング業務を支えます',
        tPeople: '対人・説明力は、クライアント対応や社内調整で活きます'
      },
      learnOrder: ['会計・財務三表', 'Excel作法（投資銀行フォーマット）', 'バリュエーション（DCF・Comps）', 'M&Aモデル・プロセス理解', '面接・モデルテスト対策'],
      roadmap: {
        d30: '財務三表のつながりを説明できる状態にする。無料講座の第1部と「財務三表のつながり」を読み、無料Excelテンプレートで3表連動を触る。',
        d60: 'DCFをゼロから1本組む。「DCFモデルをゼロから作る」を完走し、WACC・ターミナルバリューの論点を言葉で説明できるようにする。',
        d90: 'M&Aプロセスとモデルの全体像を掴み、頻出30問・ペーパーLBOで選考レベルの受け答えを固める。'
      },
      articles: [
        { t: '投資銀行に転職したい人のキャリアガイド', href: '/car-001-ib-career/' },
        { t: 'M&Aのプロセス全体像', href: '/ma-001-ma-process/' },
        { t: '金融テクニカル面接の頻出質問', href: '/car-003-technical-interview/' },
        { t: '企業価値評価の全体像', href: '/val-001-valuation-overview/' }
      ],
      labs: [
        { t: 'DCFモデル（ブラウザで計算）', href: '/lab/#dcf' },
        { t: 'M&Aモデル', href: '/lab/#ma' },
        { t: '類似会社比較（Comps）', href: '/lab/#comps' }
      ],
      materials: ['ma', 'dcf', 'iv160'],
      materialStatus: 'full'
    },
    fas: {
      tagline: 'バリュエーションと財務分析の技術で、取引の根拠をつくる仕事',
      job: '株式価値算定・財務デューデリジェンス・モデリング支援など、M&Aや組織再編の「数字の根拠」を専門的につくる仕事です。評価手法の正確な適用と、前提の妥当性を説明する力が問われます。投資銀行より分析に特化し、手法の深さで勝負する領域です。',
      workstyle: '案件ベースですが、投資銀行よりは分析作業の比重が高く、技術を積み上げるキャリアです。正確さと論理で信頼を築きたい人と相性のよい環境です。',
      mismatch: [
        '対外的な交渉・営業の華やかさを求める場合、分析中心の日常とのギャップを感じることがあります',
        '細部の検証を「面倒」と感じるタイプには、評価書の精度要求が負担になります',
        '事業を自ら動かしたい志向が強い場合は、事業会社M&AやPEのほうが近いことがあります'
      ],
      path: 'FASで評価・DDの技術を固めたあと、PEファンド・投資銀行・事業会社M&Aへ移る例が多く、技術系ファイナンス職の登竜門です。',
      reasons: {
        iInvest: '「企業の価値はいくらか」への関心が、バリュエーション専門職の中核動機と一致しています',
        iNum: '数字・分析そのものへの関心が高く、評価・検証中心の業務と噛み合います',
        tDetail: '細部の違和感に気づく傾向は、評価書・DDレポートの品質に直結する強みです',
        tAnalytic: '構造化して考える傾向が、評価手法の適用・前提検証のプロセスと合っています',
        tAutonomy: '自分で段取りして完遂する力は、分析タスクを深く任される環境で活きます'
      },
      learnOrder: ['会計・財務三表', '財務分析', 'バリュエーション理論（DCF・Comps）', 'Excelでの評価モデル構築', 'DD・レポーティングの実務理解'],
      roadmap: {
        d30: '三表と財務分析の基礎を固める。「財務三表のつながり」「EBITDAとFCFの違い」を読み、指標の早見辞典で主要指標を引けるようにする。',
        d60: 'DCFとCompsを両方組む。「DCFモデルをゼロから作る」「Compsをゼロから組む」で評価手法を手で理解する。',
        d90: 'EVブリッジ・マルチプル選定・プレミアムなど評価の実務論点を固め、FAS・バリュエーション面接厳選10問で仕上げる。'
      },
      articles: [
        { t: 'M&A仲介・FAS・IBD・PEの違い', href: '/car-012-ma-career-comparison/' },
        { t: '企業価値評価の全体像', href: '/val-001-valuation-overview/' },
        { t: '類似会社比較法（Comps）', href: '/val-005-comps/' },
        { t: 'FAS・バリュエーション面接 厳選10問', href: '/car-015-fas-valuation-10questions/' }
      ],
      labs: [
        { t: 'DCFモデル', href: '/lab/#dcf' },
        { t: '類似会社比較（Comps）', href: '/lab/#comps' },
        { t: '類似取引比較', href: '/lab/#prec' }
      ],
      materials: ['dcf', 'comps', '3statement'],
      materialStatus: 'full'
    },
    pe: {
      tagline: '投資家として会社を買い、価値を上げて売る仕事',
      job: '投資ファンドの一員として、企業の買収（バイアウト）を検討・実行し、投資先の価値向上からエグジットまでを担います。LBOモデルによるリターン設計、DD、投資委員会向けの説明、投資後の経営モニタリングまで、投資家としての判断が仕事の中心です。',
      workstyle: '少人数で裁量が大きく、案件時は高負荷。成果がファンドのリターンとして数字で出る世界です。自律的に考え抜きたい人と相性のよい環境です。',
      mismatch: [
        '投資判断より「助言・サポート」にやりがいを感じる場合、アドバイザリー側のほうが合うことがあります',
        'モデリング・財務分析の技術水準が前提となるため、準備が浅い段階では選考の壁が高い領域です',
        '定型的で安定した業務リズムを好む場合、案件ごとの不確実性がストレスになります'
      ],
      path: '投資銀行・FAS・戦略コンサル出身者が多く、アソシエイトから investment professional として昇格していくのが典型です。',
      reasons: {
        iInvest: '投資判断・企業価値への関心が、投資家という仕事の中核と一致しています',
        iBiz: '事業や経営への関心が高く、投資先の価値向上に関わる仕事と噛み合います',
        tAnalytic: '仮説を立てて検証する思考が、投資テーマの構築・検証プロセスと合っています',
        tAutonomy: '自律的に完遂する力は、少人数で裁量の大きいファンドの働き方と相性が良い要素です',
        wReward: '成果連動の報酬環境への志向が、ファンドのインセンティブ構造と合っています'
      },
      learnOrder: ['会計・財務三表', 'バリュエーション（DCF）', 'LBOモデル', '投資テーマ・DD・IC メモの実務', 'ペーパーLBO・面接対策'],
      roadmap: {
        d30: 'LBOの基本構造（レバレッジがリターンを生む仕組み）を理解する。「LBOと投資リターンの基礎」を読み、三表の土台を確認する。',
        d60: 'LBOモデルをゼロから1本組む。「ExcelでLBOモデルを構築する」を完走し、ラボのLBOモジュールで感応度を確かめる。',
        d90: 'ペーパーLBO・PE面接頻出10問で選考レベルに仕上げ、IC メモ・投資テーマの型を学ぶ。'
      },
      articles: [
        { t: 'PEファンドに転職したい人のキャリアガイド', href: '/car-002-pe-career/' },
        { t: 'LBOと投資リターンの基礎', href: '/pe-001-lbo-basics/' },
        { t: 'ペーパーLBOの解き方', href: '/car-006-paper-lbo/' },
        { t: 'PE・LBO面接 頻出10問', href: '/car-014-pe-lbo-10questions/' }
      ],
      labs: [
        { t: 'LBOモデル', href: '/lab/#lbo' },
        { t: 'DCFモデル', href: '/lab/#dcf' }
      ],
      materials: ['lbo', 'ma'],
      materialStatus: 'full'
    },
    vc: {
      tagline: 'スタートアップの可能性を見極め、成長に伴走する投資の仕事',
      job: '創業初期〜成長期のスタートアップに投資し、経営チームに伴走する仕事です。市場・プロダクト・チームの見立て、資本政策の設計、投資後の支援まで、財務スキルに加えて「事業を見る目」と人的ネットワークが問われます。',
      workstyle: '外に出て人と会う時間が長く、不確実性の高い意思決定を繰り返します。変化の速い環境と対話が好きな人と相性のよい環境です。',
      mismatch: [
        '精緻なモデルで答えを出したいタイプには、情報が少ない段階での判断の多さが不安要素になります',
        '対人接点よりも分析に集中したい場合、リサーチ・運用系のほうが合うことがあります',
        '成果が出るまでの時間軸が長く、短期的な達成感を重視する人には物足りないことがあります'
      ],
      path: '事業会社・コンサル・金融・起業経験など入り口は多様で、キャピタリストとして実績を積むほか、スタートアップ経営側へ移る例もあります。',
      reasons: {
        iBiz: 'スタートアップや事業の成長への関心が、この仕事の中心的な動機と一致しています',
        tPeople: '信頼関係を築く力は、起業家との長期の伴走関係そのものです',
        tAutonomy: '自分で仮説を立てて動ける力は、正解のない投資判断の環境と合っています',
        wPace: '変化の速い環境への志向が、スタートアップの時間軸と噛み合います',
        iInvest: '投資判断への関心が、案件の見極め・条件設計で活きます'
      },
      learnOrder: ['スタートアップファイナンスの全体像', '会計・財務三表の基礎', 'バリュエーション（アーリー企業の評価の限界も含む）', '資本政策・希薄化の理解', '市場・産業分析'],
      roadmap: {
        d30: 'VC・スタートアップファイナンスの全体像を掴む。「VC・スタートアップの財務」を読み、資金調達の各ラウンドの意味を説明できるようにする。',
        d60: '評価と資本政策の基礎を固める。IPOの仕組み・未公開企業の評価を読み、DCFラボで前提が価値に与える影響を体感する。',
        d90: '関心のある業界の市場分析を1本まとめ、投資仮説（なぜこの市場・この会社か）を言語化する練習をする。'
      },
      articles: [
        { t: 'VC・スタートアップの財務', href: '/ind-007-vc-startup-finance/' },
        { t: 'IPOの仕組み', href: '/fin-012-ipo-mechanics/' },
        { t: '未公開企業の評価', href: '/val-012-private-company-valuation/' }
      ],
      labs: [
        { t: 'DCFモデル', href: '/lab/#dcf' },
        { t: '財務指標分析', href: '/lab/#ratio' }
      ],
      materials: [],
      materialStatus: 'free'
    },
    corpdev: {
      tagline: '自社の成長戦略としてM&Aを企画・実行する仕事',
      job: '事業会社の中で、買収・売却・提携などの案件を企画し、社外アドバイザーと連携しながら実行までやり切る仕事です。案件の発掘・評価に加え、社内の合意形成、DDの取りまとめ、買収後の統合（PMI）まで関与範囲が広いのが特徴です。',
      workstyle: '外部アドバイザーと違い、1つの案件に「当事者」として長く関わります。腰を据えて事業と向き合いたい人と相性のよい環境です。',
      mismatch: [
        '案件数をこなして技術を磨きたい初期キャリアでは、案件頻度の低さが物足りないことがあります',
        '社内調整・合意形成の比重が高く、分析だけに集中したい人にはギャップがあります',
        '報酬の成果連動性は金融専門職より低めです'
      ],
      path: '投資銀行・FAS出身者の受け皿として代表的なポジションで、経営企画・子会社経営・CFOラインへの展開が見えるキャリアです。',
      reasons: {
        iDeal: 'M&A・大型案件への関心を、事業の当事者として実現できるポジションです',
        iBiz: '事業・経営への関心が、買収後の統合・事業運営まで見る仕事と一致しています',
        tPeople: '社内外の調整・説明力は、合意形成が成果を左右するこの仕事の核になります',
        tDetail: '契約・数字の細部を丁寧に見る姿勢が、当事者としてのリスク管理で活きます',
        wTeam: 'チームで進める働き方の希望と、部門横断で動く実務が合っています'
      },
      learnOrder: ['会計・財務三表', 'M&Aプロセスの全体像', 'バリュエーションとシナジー評価', '財務DDの論点', '投資評価（社内稟議・NPV/IRR）'],
      roadmap: {
        d30: 'M&Aプロセスの全体像と自社側の役割を理解する。「M&Aのプロセス全体像」「スキーム比較」を読む。',
        d60: 'シナジー評価と財務DDの論点を学び、M&Aモデル（ラボ）で買収条件が損益に与える影響を確かめる。',
        d90: '社内投資評価（NPV・IRR）の型を身につけ、想定案件1件で簡単な投資メモを書いてみる。'
      },
      articles: [
        { t: 'M&Aのプロセス全体像', href: '/ma-001-ma-process/' },
        { t: 'シナジーの評価', href: '/ma-006-synergy-valuation/' },
        { t: '財務DDとQoE', href: '/ma-004-financial-dd-qoe/' },
        { t: '社内投資評価（Capex Appraisal）', href: '/fp-004-capex-appraisal/' }
      ],
      labs: [
        { t: 'M&Aモデル', href: '/lab/#ma' },
        { t: 'DCFモデル', href: '/lab/#dcf' }
      ],
      materials: ['ma'],
      materialStatus: 'full'
    },
    fpa: {
      tagline: '数字で経営の意思決定を支える、会社の司令塔に近い仕事',
      job: '予算策定・予実管理・業績見通し・KPI設計などを通じて、経営陣の意思決定を数字で支える仕事です。事業部との対話から数字の背景を掴み、経営会議に向けて「何が起きているか・どうすべきか」を組み立てます。中期経営計画や投資評価に関わることもあります。',
      workstyle: '月次・四半期のリズムで回る比較的計画的な働き方です。事業に寄り添いながら分析力を活かしたい人と相性のよい環境です。',
      mismatch: [
        '大型案件のダイナミズムを求める場合、日常業務の定常性が物足りないことがあります',
        '社内調整・事業部との対話が業務の大きな部分を占めるため、純粋な分析職を期待するとギャップがあります',
        '成果連動の大きな報酬を重視する場合、金融専門職との差を感じることがあります'
      ],
      path: '経営企画・FP&Aで経営数字の全体観を掴み、CFOライン・事業責任者・事業会社M&Aへ広がるキャリアです。',
      reasons: {
        iBiz: '事業・経営への関心が、事業の数字と日常的に向き合うこの仕事と一致しています',
        iNum: '数字への関心が、予実・KPI・見通しを扱う日々の業務を支えます',
        tPeople: '説明力・対話力は、事業部と経営の「翻訳者」となるこの仕事の核です',
        tDetail: '数字の違和感に気づく力が、予実差異の原因究明で活きます',
        wTeam: 'チーム・部門横断で進める働き方の希望と実務が合っています'
      },
      learnOrder: ['会計・財務三表', 'Excel実務（関数・ピボット）', '予実管理・差異分析', 'KPI設計', '3表連動モデル・投資評価'],
      roadmap: {
        d30: '三表と管理会計の基礎を固める。「財務三表のつながり」「予算と差異分析」を読む。',
        d60: 'KPI設計と見通し作成の型を学び、3表連動モデル（ラボ・チュートリアル）で計画数値の作り方を手で理解する。',
        d90: '中期経営計画・投資評価の論点まで広げ、自社（または任意の上場企業）の予実分析を1本まとめてみる。'
      },
      articles: [
        { t: '予算と差異分析', href: '/fp-001-budget-variance/' },
        { t: 'KPI設計', href: '/fp-003-kpi-design/' },
        { t: '中期経営計画のつくり方', href: '/fp-002-midterm-plan/' },
        { t: '事業計画からファイナンスへ', href: '/con-002-plan-to-finance/' }
      ],
      labs: [
        { t: '財務三表・オペレーティングモデル', href: '/lab/#op' },
        { t: '財務指標分析', href: '/lab/#ratio' }
      ],
      materials: ['3statement'],
      materialStatus: 'related'
    },
    cm: {
      tagline: '株式・債券市場から資金を調達する案件を組成する仕事',
      job: 'IPO・公募増資・社債発行など、企業が資本市場から資金を調達する案件を組成・執行する仕事です（ECM=株式、DCM=債券）。市場環境と投資家需要を読み、発行体と投資家の間で条件を設計します。市場が動いている時間の緊張感と、案件執行の正確さの両方が求められます。',
      workstyle: '市場が開いている時間はスピード勝負、案件執行は正確さ勝負という二面性があります。市場と案件の両方に興味がある人と相性のよい環境です。',
      mismatch: [
        '市場の値動きに興味が持てない場合、日々のマーケットウォッチが負担になります',
        '長期の腰を据えた分析を好む場合、市場のスピード感とのギャップがあります',
        'M&Aのような数ヶ月密着型の案件を求めるなら、アドバイザリー部門のほうが近いです'
      ],
      path: '投資銀行の資本市場部門を軸に、シンジケート・デットIR・財務部門（発行体側）などへ広がるキャリアです。',
      reasons: {
        iMarket: '市場・マクロへの関心が、毎日マーケットと向き合うこの仕事の前提と一致しています',
        iDeal: '案件を組成して世に出すことへの関心と、調達案件の執行がよく合います',
        tPeople: '発行体・投資家・社内をつなぐ調整力は、案件成立の鍵になります',
        tPressure: 'プライシング当日などの緊張感に、落ち着いて対処できる傾向が活きます',
        wPace: '変化の速い環境への志向が、市場ドリブンの業務リズムと合っています'
      },
      learnOrder: ['会計・財務三表', '資本市場の仕組み（IPO・社債）', '資本構成と調達手段の理論', '市場分析・投資家需要の見方', 'バリュエーション基礎'],
      roadmap: {
        d30: '調達手段の全体像を掴む。「IPOの仕組み」「負債の種類と使い分け」「資金調達手段の選び方」を読む。',
        d60: '債券利回り・資本構成の理論を固め、市場ニュース（金利・株式市場）を毎日15分追う習慣をつくる。',
        d90: '直近の大型IPO・社債発行を1件選び、発行条件・市場環境・投資家需要を自分の言葉で説明できるようにする。'
      },
      articles: [
        { t: 'IPOの仕組み', href: '/fin-012-ipo-mechanics/' },
        { t: '債券利回り（YTM）の基礎', href: '/fin-013-bond-ytm/' },
        { t: '負債の種類と使い分け', href: '/fin-007-debt-types/' },
        { t: '資金調達手段の選び方', href: '/fin-009-financing-choices/' }
      ],
      labs: [
        { t: '類似会社比較（Comps）', href: '/lab/#comps' },
        { t: 'DCFモデル', href: '/lab/#dcf' }
      ],
      materials: [],
      materialStatus: 'free'
    },
    er: {
      tagline: '企業を深く分析し、投資判断の材料を発信する仕事',
      job: '担当業界の上場企業を継続的に分析し、業績予想・目標株価・投資判断をレポートとして発信する仕事です。決算分析、経営陣との対話、業界取材、財務モデルの更新を繰り返し、投資家に対して「自分の見立て」を発信し続けます。',
      workstyle: '個人の見立てと分析の深さで勝負する、専門家型のキャリアです。一つの業界を深く追い続けることが好きな人と相性のよい環境です。',
      mismatch: [
        'チームで大きな案件を動かす達成感を求める場合、個人作業の比重の高さにギャップを感じることがあります',
        '決算期は集中的に忙しく、発信し続けるプレッシャーがあります',
        '自分の意見を公に問われることが苦手な場合、レーティングの公表が負担になります'
      ],
      path: 'セルサイドで分析力と業界知見を確立し、バイサイド（運用・ヘッジファンド）やIR・事業会社へ広がるキャリアです。',
      reasons: {
        iInvest: '「この会社は買いか」を考え続けることへの関心が、仕事の本質と一致しています',
        iMarket: '市場への関心が、日々の株価・決算・ニュースを追う業務と噛み合います',
        tAnalytic: '仮説を立てて検証する思考が、業績予想と投資判断の組み立てと合っています',
        tAutonomy: '自律的に深掘りする力は、担当業界を任される働き方で活きます',
        iNum: '数字・分析への関心が、モデル更新・決算分析の日常を支えます'
      },
      learnOrder: ['会計・財務三表', '財務分析・KPI', 'バリュエーション（Comps・DCF）', '業績予想モデルの構築', '業界分析・レポートライティング'],
      roadmap: {
        d30: '決算書を読む力を固める。「財務三表のつながり」と財務分析系の記事で、主要指標から会社の状況を語れるようにする。',
        d60: 'CompsとDCFを組み、マルチプル選定・逆算DCFなど「市場の期待を読む」技術を学ぶ。',
        d90: '関心業界の主要3社で簡易な業績予想と投資判断メモを書き、売上ドライバー分解の型を身につける。'
      },
      articles: [
        { t: '類似会社比較法（Comps）', href: '/val-005-comps/' },
        { t: 'マルチプルの選び方', href: '/val-008-multiple-selection/' },
        { t: 'リバースDCF（市場の期待を読む）', href: '/val-009-reverse-dcf/' },
        { t: '売上ドライバーの分解', href: '/mod-012-revenue-drivers/' }
      ],
      labs: [
        { t: '類似会社比較（Comps）', href: '/lab/#comps' },
        { t: 'DCFモデル', href: '/lab/#dcf' }
      ],
      materials: ['comps', 'dcf'],
      materialStatus: 'related'
    },
    am: {
      tagline: '顧客から預かった資産を、規律をもって運用する仕事',
      job: '年金・機関投資家・個人から預かった資産を、株式・債券などで運用する仕事です。リサーチに基づく銘柄選定、ポートフォリオ構築、リスク管理、運用報告までを組織として回します。短期の勝ち負けではなく、長期の規律あるプロセスで成果を出すことが求められます。',
      workstyle: '市場と向き合いつつも、トレーディングよりは腰を据えた分析・判断が中心です。長期目線でじっくり考えたい人と相性のよい環境です。',
      mismatch: [
        '案件のダイナミズムや対外交渉を求める場合、運用業務の淡々としたリズムが物足りないことがあります',
        '成果が市場環境に左右されるため、自分の努力がすぐ数字に出る仕事を好む人にはもどかしさがあります',
        '運用成績への説明責任があり、数字から逃げられない環境です'
      ],
      path: 'アナリストからファンドマネジャーへ、あるいはリサーチ・リスク管理・プロダクト側へ広がるキャリアです。',
      reasons: {
        iInvest: '投資判断への関心が、銘柄選定・ポートフォリオ構築の中核と一致しています',
        iMarket: '市場への関心が、日々のマーケット分析・運用判断を支えます',
        tAnalytic: '構造的に考える力が、投資プロセスの規律と噛み合います',
        tAutonomy: '自律的な深掘りが、担当領域のリサーチで活きます',
        tDetail: '丁寧な検証姿勢が、運用の再現性・説明責任と合っています'
      },
      learnOrder: ['会計・財務三表', '財務分析', 'バリュエーション（DCF・Comps・DDM）', 'ポートフォリオとリスクの基礎', '業界・マクロ分析'],
      roadmap: {
        d30: '企業分析の土台をつくる。三表・財務分析の記事と財務指標分析ラボで、企業を数値で比べる目を養う。',
        d60: 'DCF・配当割引など評価手法を広げ、「DCFとマルチプルの使い分け」で手法選択の考え方を掴む。',
        d90: '模擬ポートフォリオ（3〜5銘柄）を作り、選定理由・リスク・売却条件を運用メモとして言語化する。'
      },
      articles: [
        { t: '企業価値評価の全体像', href: '/val-001-valuation-overview/' },
        { t: 'DCFとマルチプルの使い分け', href: '/val-018-dcf-vs-multiple/' },
        { t: '配当と自社株買い', href: '/fin-005-dividends-buybacks/' },
        { t: 'リバースDCF', href: '/val-009-reverse-dcf/' }
      ],
      labs: [
        { t: 'DCFモデル', href: '/lab/#dcf' },
        { t: '財務指標分析', href: '/lab/#ratio' }
      ],
      materials: [],
      materialStatus: 'free'
    },
    st: {
      tagline: '市場の最前線で、価格とリスクを瞬時に判断する仕事',
      job: '株式・債券・為替などの市場で、機関投資家の売買を仲介（セールス）し、価格を提示してリスクを管理（トレーディング）する仕事です。市場が開いている間は判断の連続で、スピード・胆力・数理感覚が同時に問われます。',
      workstyle: '一日の中で成果とミスがはっきり出る、最も市場に近い環境です。瞬発力と切り替えの早さに自信がある人と相性のよい環境です。',
      mismatch: [
        'じっくり考えて結論を出したいタイプには、判断スピードの要求が強いストレスになります',
        '市場の値動きに一喜一憂しない胆力が必要で、安定した日常を好む人には不向きです',
        '長期的な案件をやり遂げる達成感を求めるなら、IB・PE系のほうが近いです'
      ],
      path: 'デスクごとの専門性を磨き、トレーダー・セールスとして市場キャリアを深めるか、運用・リスク管理側へ移る道があります。',
      reasons: {
        iMarket: '市場への強い関心が、一日中マーケットと向き合う仕事の大前提と一致しています',
        tPressure: 'プレッシャー下で淡々と判断できる傾向は、この仕事で最も重要な資質です',
        tCompete: '成果が数字で比較される環境を好む志向が、日次で損益が出る世界と合っています',
        wPace: '変化の速い環境への志向が、市場のスピードと噛み合います',
        wReward: '成果連動報酬への志向が、実力主義の報酬体系と合っています'
      },
      learnOrder: ['市場の基礎（金利・債券・株式）', '会計・財務の基礎', '確率・統計とリスクの考え方', 'Excel・データ分析', 'マーケットウォッチの習慣化'],
      roadmap: {
        d30: '金利と債券価格の関係を説明できるようにする。「債券利回り（YTM）の基礎」「資本構成」を読み、毎日市場をチェックする習慣をつくる。',
        d60: 'IPO・発行市場の仕組みまで広げ、金利変動が株式・為替に波及する経路を自分の言葉で説明する練習をする。',
        d90: '感応度・シナリオ分析の考え方をExcelで手を動かして学び、模擬トレード日誌（判断理由の記録）を2週間つける。'
      },
      articles: [
        { t: '債券利回り（YTM）の基礎', href: '/fin-013-bond-ytm/' },
        { t: 'IPOの仕組み', href: '/fin-012-ipo-mechanics/' },
        { t: '資本構成の考え方', href: '/fin-004-capital-structure/' }
      ],
      labs: [
        { t: '感応度分析（DCFラボ内）', href: '/lab/#dcf' },
        { t: '財務指標分析', href: '/lab/#ratio' }
      ],
      materials: [],
      materialStatus: 'free'
    },
    credit: {
      tagline: '企業の返済能力を見極め、融資で事業を支える仕事',
      job: '法人顧客の財務内容・事業性を分析して融資の可否と条件を判断し、実行後もモニタリングする仕事です。決算書を深く読み込み、キャッシュフローの持続性・担保・コベナンツを設計します。企業金融の土台であり、審査で培う財務分析力は他職種でも通用します。',
      workstyle: '規律と正確さが評価される、比較的安定したリズムの仕事です。顧客と長期の関係を築きながら数字で判断したい人と相性のよい環境です。',
      mismatch: [
        '大型案件のダイナミズムや成果連動報酬を求める場合、物足りなさを感じることがあります',
        'ルール・審査基準の中で判断する場面が多く、自由度の高い裁量を求める人にはギャップがあります',
        'エクイティ的な「アップサイドを追う」発想より、ダウンサイドを守る発想が中心です'
      ],
      path: '法人営業・審査で財務分析の土台を固め、ストラクチャードファイナンス・企業再生・クレジット投資へ広がるキャリアです。',
      reasons: {
        tDetail: '細部を丁寧に検証する姿勢は、審査の品質と直結する最大の強みです',
        iNum: '数字への関心が、決算書の読み込み・与信判断の日常を支えます',
        tPeople: '顧客との信頼構築力は、長期のリレーションが前提の法人金融で活きます',
        iAdvisory: '顧客の意思決定を支えることへのやりがいが、融資で事業を支える役割と一致しています',
        iBiz: '事業への関心が、事業性評価（ビジネスの持続性を見る目）と噛み合います'
      },
      learnOrder: ['会計・財務三表', '財務分析・安全性指標', '負債・コベナンツの知識', 'キャッシュフロー分析', '業界分析'],
      roadmap: {
        d30: '三表とキャッシュフロー計算書を固める。「財務三表のつながり」「キャッシュフロー計算書の読み方」を読む。',
        d60: '安全性指標・格付・コベナンツを学び、財務指標分析ラボで実在企業の財務を比較してみる。',
        d90: '任意の上場企業1社で「貸せるか」を判断する簡易審査メモ（返済原資・リスク・条件）を書いてみる。'
      },
      articles: [
        { t: '信用格付の仕組み', href: '/fin-006-credit-ratings/' },
        { t: '負債の種類と使い分け', href: '/fin-007-debt-types/' },
        { t: 'コベナンツの基礎', href: '/fin-008-covenants/' },
        { t: '安全性指標の見方', href: '/fin-014-safety-ratios/' }
      ],
      labs: [
        { t: '財務指標分析', href: '/lab/#ratio' },
        { t: '財務三表・オペレーティングモデル', href: '/lab/#op' }
      ],
      materials: ['3statement'],
      materialStatus: 'related'
    },
    risk: {
      tagline: '金融機関の健全性を、数理と規律で守る仕事',
      job: '市場リスク・信用リスク・オペレーショナルリスクを計測・管理し、金融機関が取るリスクを健全な範囲に保つ仕事です。ストレステスト、限度額管理、リスク指標のモニタリング、規制対応などを担い、トレーディングや融資の「ブレーキとハンドル」の役割を果たします。',
      workstyle: '市場に近いのに市場に振り回されない、分析特化型のポジションです。正確さと数理的な思考で貢献したい人と相性のよい環境です。',
      mismatch: [
        '自ら収益を上げるフロント業務の達成感を求める場合、管理部門の役割にギャップを感じることがあります',
        '対外的な華やかさは少なく、社内向けの説明・報告が業務の中心です',
        'ルール・規制の枠組みを窮屈に感じるタイプには不向きです'
      ],
      path: 'リスク管理で数理・規制の専門性を築き、クオンツ・ALM・経営管理・監督当局系へ広がるキャリアです。',
      reasons: {
        iNum: '数字・データへの関心が、リスク計測・モニタリングの日常と一致しています',
        tDetail: '細部の異常に気づく力は、リスクの早期発見という役割の核心です',
        tAnalytic: '構造化・仮説検証の思考が、ストレステストやシナリオ分析と噛み合います',
        wIntensity: '長時間労働より規律あるリズムを好む働き方の希望と、管理部門の実態が合っています',
        iMarket: '市場への関心を、market-facing でない立場から活かせるポジションです'
      },
      learnOrder: ['会計・財務三表', '統計・確率の基礎', '財務分析・安全性指標', '感応度・シナリオ分析', '金融規制の概観'],
      roadmap: {
        d30: '三表と安全性指標を固め、「信用格付の仕組み」でデフォルトリスクの見方を学ぶ。',
        d60: '感応度・シナリオ分析をExcelで手を動かして学び、変数の変化が結果に与える影響を定量的に説明できるようにする。',
        d90: '銀行の財務モデルの特殊性（ind-001）に触れ、任意の金融機関の開示資料からリスク指標を読み取る練習をする。'
      },
      articles: [
        { t: '安全性指標の見方', href: '/fin-014-safety-ratios/' },
        { t: '感応度分析・シナリオ分析', href: '/mod-007-sensitivity/' },
        { t: '信用格付の仕組み', href: '/fin-006-credit-ratings/' },
        { t: '銀行モデリングの基礎', href: '/ind-001-bank-modeling/' }
      ],
      labs: [
        { t: '財務指標分析', href: '/lab/#ratio' },
        { t: 'DCFモデル（感応度）', href: '/lab/#dcf' }
      ],
      materials: [],
      materialStatus: 'free'
    },
    wm: {
      tagline: '個人の資産と人生設計に、長期で伴走する仕事',
      job: '富裕層・個人顧客の資産運用・資産承継を、長期の信頼関係の中で支援する仕事です。運用提案に加え、税務・不動産・事業承継など幅広い論点を関係者と連携して整理します。金融知識と同じくらい、相手の価値観を理解する力が問われます。',
      workstyle: '顧客との対話が仕事の中心で、成果は信頼の積み重ねとして返ってきます。人と長く深く関わりたい人と相性のよい環境です。',
      mismatch: [
        '分析・モデリングに没頭したいタイプには、対人業務の比重の高さがギャップになります',
        '営業目標のプレッシャーがあり、顧客本位と数字の両立に悩む場面があります',
        '大型案件・市場の最前線のダイナミズムを求めるなら、IB・S&T系のほうが近いです'
      ],
      path: 'リテール・プライベートバンキングで顧客基盤と提案力を築き、より大きな資産を扱うポジションへ進むキャリアです。',
      reasons: {
        iAdvisory: '誰かの意思決定に伴走することへのやりがいが、この仕事の本質と一致しています',
        tPeople: '信頼関係を築く力は、長期のリレーションが全てのこの仕事で最大の資産です',
        wClient: '顧客と日常的に向き合いたいという希望と、仕事の実態が合っています',
        iMarket: '市場への関心が、運用提案の説得力を支えます',
        iInvest: '投資への関心が、顧客ポートフォリオの設計・説明で活きます'
      },
      learnOrder: ['金融商品の基礎（株式・債券・投信）', '会計・財務の基礎', 'ポートフォリオの考え方', '税務・承継の概観', '対話・提案力'],
      roadmap: {
        d30: '株式・債券・分配の基礎を固める。「配当と自社株買い」「債券利回りの基礎」を読み、金融商品を自分の言葉で説明できるようにする。',
        d60: '企業価値評価の全体像に触れ、マーケットニュースを顧客に説明するつもりで要約する練習を週1回行う。',
        d90: '模擬顧客（年代・資産・目標を設定）向けの運用提案書を1本作り、リスク説明まで含めて組み立てる。'
      },
      articles: [
        { t: '配当と自社株買い', href: '/fin-005-dividends-buybacks/' },
        { t: '債券利回り（YTM）の基礎', href: '/fin-013-bond-ytm/' },
        { t: '企業価値評価の全体像', href: '/val-001-valuation-overview/' }
      ],
      labs: [
        { t: '財務指標分析', href: '/lab/#ratio' },
        { t: 'DCFモデル', href: '/lab/#dcf' }
      ],
      materials: [],
      materialStatus: 'free'
    }
  };
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : null));
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

/* op-mcta */
(function(){'use strict';
if(window.matchMedia('(min-width: 641px)').matches)return;
if(document.body.classList.contains('has-ctabar')||document.getElementById('quickbar'))return;
var bar=document.createElement('div');bar.id='opMcta';
bar.innerHTML='<div class="m-txt"><b>無料記事から学ぶ</b>会計から評価・LBOまで全文無料</div><a href="../articles/index.html">記事を読む</a>';
document.body.appendChild(bar);
var shown=false;
function chk(){
  var y=window.scrollY||0;
  var nearEnd=(window.innerHeight+y)>(document.documentElement.scrollHeight-360);
  var on=y>680&&!nearEnd;
  if(on!==shown){shown=on;bar.classList.toggle('on',on);}
}
window.addEventListener('scroll',chk,{passive:true});
chk();
})();

/* =====================================================================
 * op-career-fit-v1: 診断アプリ本体（UIレイヤー）
 * データ・スコアリングは op-career-fit-data.js（window.OPCF）に分離。
 * 個人の回答内容は端末のlocalStorageにのみ保存し、外部送信しない。
 * ===================================================================== */
(function () {
  'use strict';
  if (typeof window === 'undefined' || !window.OPCF) { return; }
  var OPCF = window.OPCF;
  var $ = function (id) { return document.getElementById(id); };
  var intro = $('cfIntro'), quiz = $('cfQuiz'), resultBox = $('cfResult');
  if (!intro || !quiz || !resultBox) { return; }

  var STORE_KEY = 'opcf_v1';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var Q = OPCF.QUESTIONS;
  var state = { answers: {}, cursor: 0, done: false };
  var announcedSteps = {};

  /* ---- 計測: 回答内容・個人情報は送らない。存在する解析基盤のみ利用 ---- */
  function track(name, params) {
    try {
      var p = params || {};
      if (typeof window.gtag === 'function') { window.gtag('event', name, p); }
      else if (window.dataLayer && typeof window.dataLayer.push === 'function') {
        window.dataLayer.push({ event: name, career_fit: p });
      }
    } catch (e) { /* 計測失敗は診断機能に影響させない */ }
  }

  /* ---- 保存・復元 ---- */
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* private mode等 */ }
  }
  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) { return null; }
      var s = JSON.parse(raw);
      if (!s || typeof s !== 'object' || typeof s.answers !== 'object') { return null; }
      return s;
    } catch (e) { return null; }
  }
  function clearSaved() {
    try { localStorage.removeItem(STORE_KEY); } catch (e) { /* noop */ }
  }

  function answeredCount() {
    var n = 0;
    for (var i = 0; i < Q.length; i++) { if (state.answers[Q[i].id] != null) { n++; } }
    return n;
  }

  /* ---- 画面切替 ---- */
  function show(el) {
    intro.hidden = el !== intro; quiz.hidden = el !== quiz; resultBox.hidden = el !== resultBox;
  }

  /* ---- 設問描画 ---- */
  function stepLabel(n) {
    for (var i = 0; i < OPCF.STEPS.length; i++) { if (OPCF.STEPS[i].n === n) { return OPCF.STEPS[i].label; } }
    return '';
  }
  function renderQuestion() {
    var q = Q[state.cursor];
    var total = Q.length;
    var done = answeredCount();
    $('cfStepChip').textContent = 'STEP ' + q.step + '｜' + stepLabel(q.step);
    $('cfCount').textContent = (state.cursor + 1) + ' / ' + total;
    var pct = Math.round(100 * done / total);
    $('cfBarFill').style.width = pct + '%';
    $('cfBar').setAttribute('aria-valuenow', String(pct));
    $('cfQText').textContent = q.text;
    $('cfQNote').textContent = q.type === 'scale' ? '最も近いものを1つ選んでください。' : '当てはまるものを1つ選んでください。';

    var wrap = $('cfOpts');
    wrap.innerHTML = '';
    var opts = q.type === 'scale' ? OPCF.SCALE : q.options;
    var cur = state.answers[q.id];
    for (var i = 0; i < opts.length; i++) {
      (function (idx) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'cf-opt';
        b.setAttribute('aria-pressed', cur === idx ? 'true' : 'false');
        var dot = document.createElement('span'); dot.className = 'dot'; dot.setAttribute('aria-hidden', 'true');
        var t = document.createElement('span'); t.textContent = opts[idx];
        b.appendChild(dot); b.appendChild(t);
        b.addEventListener('click', function () { selectOption(idx); });
        b.addEventListener('keydown', function (e) {
          var list = wrap.querySelectorAll('.cf-opt');
          var pos = Array.prototype.indexOf.call(list, document.activeElement);
          if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); list[Math.min(pos + 1, list.length - 1)].focus(); }
          if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); list[Math.max(pos - 1, 0)].focus(); }
        });
        wrap.appendChild(b);
      })(i);
    }
    $('cfBack').disabled = state.cursor === 0;
    $('cfNext').disabled = cur == null;
    $('cfNext').textContent = state.cursor === total - 1 ? '結果を見る →' : '次へ →';
    /* 画面が上下に跳ねないよう、カード上端が見えない時のみ最小限スクロール */
    var card = $('cfQuiz');
    var r = card.getBoundingClientRect();
    if (r.top < 0) { card.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); }
  }

  function selectOption(idx) {
    var q = Q[state.cursor];
    var first = state.answers[q.id] == null;
    state.answers[q.id] = idx;
    save();
    var btns = $('cfOpts').querySelectorAll('.cf-opt');
    for (var i = 0; i < btns.length; i++) { btns[i].setAttribute('aria-pressed', i === idx ? 'true' : 'false'); }
    $('cfNext').disabled = false;
    if (first) {
      /* 選択で自動前進（最後の設問は明示ボタンのみ） */
      if (state.cursor < Q.length - 1) {
        window.setTimeout(next, reduced ? 80 : 260);
      }
    }
  }

  function maybeTrackStepComplete(prevStep, nextStep) {
    if (nextStep !== prevStep && !announcedSteps[prevStep]) {
      announcedSteps[prevStep] = true;
      track('career_fit_step_complete', { step: prevStep });
    }
  }

  function next() {
    var q = Q[state.cursor];
    if (state.answers[q.id] == null) { return; } /* 未回答では進めない */
    if (state.cursor >= Q.length - 1) { finish(); return; }
    var prevStep = q.step;
    state.cursor++;
    save();
    maybeTrackStepComplete(prevStep, Q[state.cursor].step);
    renderQuestion();
  }
  function back() {
    if (state.cursor === 0) { return; }
    state.cursor--;
    save();
    renderQuestion();
  }
  function restart(confirmNeeded) {
    if (confirmNeeded && !window.confirm('回答をすべて消去して最初からやり直しますか？')) { return; }
    state = { answers: {}, cursor: 0, done: false };
    announcedSteps = {};
    clearSaved();
    show(intro);
    syncIntro();
  }

  function start() {
    track('career_fit_start', {});
    show(quiz);
    renderQuestion();
  }
  function resume() {
    /* 最初の未回答設問へ */
    for (var i = 0; i < Q.length; i++) { if (state.answers[Q[i].id] == null) { state.cursor = i; break; } }
    show(quiz);
    renderQuestion();
  }

  function finish() {
    state.done = true;
    save();
    track('career_fit_complete', {});
    renderResult();
    show(resultBox);
    resultBox.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }

  /* =====================================================================
   * 結果描画
   * ===================================================================== */
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) { e.className = cls; }
    if (text != null) { e.textContent = text; }
    return e;
  }
  function radarValue(axes, def) {
    var s = 0;
    for (var i = 0; i < def.axes.length; i++) { s += axes[def.axes[i]] || 0; }
    return s / def.axes.length;
  }
  function radarIdeal(career, def) {
    var s = 0, n = 0;
    for (var i = 0; i < def.axes.length; i++) {
      var p = career.profile[def.axes[i]];
      s += p ? p[0] : 0.5; n++;
    }
    return n ? s / n : 0.5;
  }
  function buildRadar(axes, career) {
    var NS = 'http://www.w3.org/2000/svg';
    var size = 340, cx = size / 2, cy = size / 2 + 4, R = 108;
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + size + ' ' + size);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', '主要6軸のレーダーチャート。同じ内容は下の表でも確認できます。');
    var defs = OPCF.RADAR;
    function pt(i, r) {
      var a = -Math.PI / 2 + i * 2 * Math.PI / defs.length;
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    }
    /* グリッド */
    for (var g = 1; g <= 4; g++) {
      var poly = document.createElementNS(NS, 'polygon');
      var pts = [];
      for (var i = 0; i < defs.length; i++) { pts.push(pt(i, R * g / 4).join(',')); }
      poly.setAttribute('points', pts.join(' '));
      poly.setAttribute('fill', 'none');
      poly.setAttribute('stroke', '#DFE5EC');
      poly.setAttribute('stroke-width', g === 4 ? '1.4' : '1');
      svg.appendChild(poly);
    }
    for (var s = 0; s < defs.length; s++) {
      var ln = document.createElementNS(NS, 'line');
      var p = pt(s, R);
      ln.setAttribute('x1', cx); ln.setAttribute('y1', cy);
      ln.setAttribute('x2', p[0]); ln.setAttribute('y2', p[1]);
      ln.setAttribute('stroke', '#DFE5EC'); ln.setAttribute('stroke-width', '1');
      svg.appendChild(ln);
      var lp = pt(s, R + 26);
      var tx = document.createElementNS(NS, 'text');
      tx.setAttribute('x', lp[0]); tx.setAttribute('y', lp[1]);
      tx.setAttribute('text-anchor', 'middle');
      tx.setAttribute('font-size', '11');
      tx.setAttribute('fill', '#526075');
      tx.setAttribute('font-weight', '600');
      var words = defs[s].label.split('・');
      if (words.length > 1 && defs[s].label.length > 6) {
        var t1 = document.createElementNS(NS, 'tspan');
        t1.setAttribute('x', lp[0]); t1.setAttribute('dy', '-0.4em'); t1.textContent = words[0] + '・';
        var t2 = document.createElementNS(NS, 'tspan');
        t2.setAttribute('x', lp[0]); t2.setAttribute('dy', '1.15em'); t2.textContent = words.slice(1).join('・');
        tx.appendChild(t1); tx.appendChild(t2);
      } else { tx.textContent = defs[s].label; }
      svg.appendChild(tx);
    }
    /* 理想（第1候補） */
    var ideal = document.createElementNS(NS, 'polygon');
    var ip = [];
    for (var a = 0; a < defs.length; a++) { ip.push(pt(a, R * radarIdeal(career, defs[a])).join(',')); }
    ideal.setAttribute('points', ip.join(' '));
    ideal.setAttribute('fill', 'rgba(169,135,59,.14)');
    ideal.setAttribute('stroke', '#A9873B');
    ideal.setAttribute('stroke-width', '1.4');
    ideal.setAttribute('stroke-dasharray', '5 4');
    svg.appendChild(ideal);
    /* ユーザー */
    var me = document.createElementNS(NS, 'polygon');
    var mp = [];
    for (var b = 0; b < defs.length; b++) { mp.push(pt(b, R * radarValue(axes, defs[b])).join(',')); }
    me.setAttribute('points', mp.join(' '));
    me.setAttribute('fill', 'rgba(29,78,138,.2)');
    me.setAttribute('stroke', '#1D4E8A');
    me.setAttribute('stroke-width', '2');
    svg.appendChild(me);
    return svg;
  }

  function pickReasons(career, content, axes) {
    var cand = [];
    for (var ax in content.reasons) {
      var p = career.profile[ax];
      if (!p) { continue; }
      var closeness = 1 - Math.abs((axes[ax] || 0) - p[0]);
      cand.push({ ax: ax, w: closeness * p[1], text: content.reasons[ax] });
    }
    cand.sort(function (a, b) { return b.w - a.w; });
    return cand.slice(0, 3).map(function (c) { return c.text; });
  }
  function pickStrengths(axes, career) {
    var out = [];
    for (var ax in career.profile) {
      var cat = OPCF.AXES[ax].cat;
      if (cat !== 'interest' && cat !== 'trait') { continue; }
      if ((axes[ax] || 0) >= 0.625 && career.profile[ax][1] >= 2) {
        out.push({ label: OPCF.AXES[ax].label, v: axes[ax] * career.profile[ax][1] });
      }
    }
    out.sort(function (a, b) { return b.v - a.v; });
    return out.slice(0, 4).map(function (o) { return o.label; });
  }
  function pickGaps(axes, career) {
    var out = [];
    for (var ax in career.prep) {
      if (career.prep[ax] >= 2 && (axes[ax] || 0) < 0.5) {
        out.push({ label: OPCF.AXES[ax].label, v: career.prep[ax] * (0.5 - axes[ax]) });
      }
    }
    out.sort(function (a, b) { return b.v - a.v; });
    return out.map(function (o) { return o.label; });
  }
  function pickDrivers(axes, career) {
    var plus = [], minus = [];
    for (var ax in career.profile) {
      var ideal = career.profile[ax][0], imp = career.profile[ax][1];
      if (imp < 2) { continue; }
      var gap = Math.abs((axes[ax] || 0) - ideal);
      var item = { label: OPCF.AXES[ax].label, gap: gap, imp: imp };
      if (gap <= 0.25) { plus.push(item); } else if (gap >= 0.4) { minus.push(item); }
    }
    plus.sort(function (a, b) { return (a.gap - b.gap) || (b.imp - a.imp); });
    minus.sort(function (a, b) { return (b.gap * b.imp) - (a.gap * a.imp); });
    return { plus: plus.slice(0, 3), minus: minus.slice(0, 2) };
  }

  function scoreBlock(row) {
    var grid = el('div', 'cf-scores');
    var defs = [
      { k: 'キャリア相性', v: row.fit, cls: 'cf-score cf-score--fit' },
      { k: '現在の準備度', v: row.readiness, cls: 'cf-score' },
      { k: '働き方との相性', v: row.workFit, cls: 'cf-score' }
    ];
    for (var i = 0; i < defs.length; i++) {
      var d = defs[i];
      var box = el('div', d.cls);
      box.appendChild(el('span', 'k', d.k));
      var v = el('span', 'v', String(d.v));
      v.appendChild(el('small', null, ' /100'));
      box.appendChild(v);
      var g = el('span', 'g');
      var bar = el('i');
      bar.style.width = d.v + '%';
      g.appendChild(bar);
      box.appendChild(g);
      grid.appendChild(box);
    }
    return grid;
  }

  function linkList(items, tag, ev) {
    var grid = el('div', 'cf-links');
    for (var i = 0; i < items.length; i++) {
      var a = el('a', 'cf-link');
      a.href = items[i].href;
      a.setAttribute('data-cf-ev', ev);
      a.appendChild(el('span', 'tag', tag));
      a.appendChild(el('span', null, items[i].t));
      a.appendChild(el('span', 'ar', '→'));
      grid.appendChild(a);
    }
    return grid;
  }
  function h3(text, en) {
    var h = el('h3', 'cf-h3', text);
    if (en) { h.appendChild(el('span', 'en', en)); }
    return h;
  }

  function firstCareerCard(row, axes) {
    var career = null;
    for (var i = 0; i < OPCF.CAREERS.length; i++) { if (OPCF.CAREERS[i].id === row.id) { career = OPCF.CAREERS[i]; } }
    var content = OPCF.CONTENT[row.id];
    var card = el('article', 'cf-card cf-card--1');
    card.appendChild(el('p', 'cf-rank', '第1候補 — 最も相性が高い'));
    card.appendChild(el('h3', 'cf-cname', row.name));
    card.appendChild(el('p', 'cf-cen', content ? OPCF.CAREERS.filter(function(c){return c.id===row.id;})[0].en : ''));
    card.appendChild(el('p', 'cf-oneline', '現在の回答から見ると、あなたは「' + content.tagline + '」であるこの職種と最も傾向が近い状態です。'));
    card.appendChild(scoreBlock(row));

    /* レーダー＋テキスト代替 */
    var viz = el('div', 'cf-viz');
    var radar = el('div', 'cf-radar');
    radar.appendChild(buildRadar(axes, career));
    radar.appendChild(el('p', 'cf-radar-cap', '実線＝あなたの回答傾向／破線＝この職種で重視されやすいプロファイル（いずれも0〜100%）。'));
    viz.appendChild(radar);
    var vright = el('div');
    var tbl = el('table', 'cf-table cf-srtable');
    var cap = el('caption', null, '主要6軸の数値（レーダーチャートと同じ内容）');
    tbl.appendChild(cap);
    var thr = el('tr');
    thr.appendChild(el('th', null, '軸'));
    thr.appendChild(el('th', null, 'あなた'));
    thr.appendChild(el('th', null, 'この職種の理想'));
    tbl.appendChild(thr);
    for (var r = 0; r < OPCF.RADAR.length; r++) {
      var tr = el('tr');
      tr.appendChild(el('td', null, OPCF.RADAR[r].label));
      var td1 = el('td', 'num', Math.round(100 * radarValue(axes, OPCF.RADAR[r])) + '%');
      var td2 = el('td', 'num', Math.round(100 * radarIdeal(career, OPCF.RADAR[r])) + '%');
      tr.appendChild(td1); tr.appendChild(td2);
      tbl.appendChild(tr);
    }
    vright.appendChild(tbl);
    /* 影響した回答傾向 */
    var drv = pickDrivers(axes, career);
    var dbox = el('div', 'cf-drivers');
    dbox.appendChild(h3('スコアに影響した回答傾向', 'DRIVERS'));
    var dl = el('ul', 'cf-list');
    for (var dp = 0; dp < drv.plus.length; dp++) {
      dl.appendChild(el('li', null, '「' + drv.plus[dp].label + '」がこの職種の重視プロファイルと近く、相性を押し上げています。'));
    }
    for (var dm = 0; dm < drv.minus.length; dm++) {
      dl.appendChild(el('li', null, '「' + drv.minus[dm].label + '」は理想プロファイルとの差が大きく、相性を下げる方向に働いています。'));
    }
    if (!drv.plus.length && !drv.minus.length) {
      dl.appendChild(el('li', null, '回答が中間に集まっているため、明確な押し上げ・押し下げ要因は検出されませんでした。'));
    }
    dbox.appendChild(dl);
    vright.appendChild(dbox);
    viz.appendChild(vright);
    card.appendChild(viz);

    /* 理由・強み・不足 */
    card.appendChild(h3('相性がよいと考えられる理由', 'WHY'));
    var rl = el('ul', 'cf-list');
    var reasons = pickReasons(career, content, axes);
    for (var rr = 0; rr < reasons.length; rr++) { rl.appendChild(el('li', null, reasons[rr])); }
    card.appendChild(rl);

    card.appendChild(h3('活かせる強み', 'STRENGTHS'));
    var st = pickStrengths(axes, career);
    if (st.length) {
      var chips = el('div', 'cf-chips');
      for (var sc = 0; sc < st.length; sc++) { chips.appendChild(el('span', null, st[sc])); }
      card.appendChild(chips);
    } else {
      card.appendChild(el('p', 'cf-p', '現時点で突出した強みは検出されませんでしたが、これは伸びしろが広いということでもあります。学習を進めながら再診断してみてください。'));
    }

    card.appendChild(h3('不足している可能性があるスキル', 'GAPS'));
    var gaps = pickGaps(axes, career);
    if (gaps.length) {
      var gchips = el('div', 'cf-chips cf-chips--gap');
      for (var gc = 0; gc < gaps.length; gc++) { gchips.appendChild(el('span', null, gaps[gc])); }
      card.appendChild(gchips);
      card.appendChild(el('p', 'cf-p', 'キャリア相性と現在の準備度は別物です。準備度が低くても、下の学習順序で埋めていけば問題ありません。'));
    } else {
      card.appendChild(el('p', 'cf-p', 'この職種で重要となる知識・スキルについて、大きな不足は検出されませんでした。'));
    }

    /* 仕事内容など */
    card.appendChild(h3('仕事内容', 'WHAT YOU DO'));
    card.appendChild(el('p', 'cf-p', content.job));
    card.appendChild(h3('向いている働き方', 'WORK STYLE'));
    card.appendChild(el('p', 'cf-p', content.workstyle));
    card.appendChild(h3('ミスマッチになり得る点', 'WATCH OUT'));
    var ml = el('ul', 'cf-list cf-list--warn');
    for (var mm = 0; mm < content.mismatch.length; mm++) { ml.appendChild(el('li', null, content.mismatch[mm])); }
    card.appendChild(ml);
    card.appendChild(h3('代表的なキャリアパス', 'CAREER PATH'));
    card.appendChild(el('p', 'cf-p', content.path));

    /* 学習 */
    card.appendChild(h3('学習の優先順位', 'LEARNING ORDER'));
    var ol = el('ol', 'cf-list');
    for (var lo = 0; lo < content.learnOrder.length; lo++) {
      var li = el('li', null, (lo + 1) + '. ' + content.learnOrder[lo]);
      ol.appendChild(li);
    }
    card.appendChild(ol);

    card.appendChild(h3('30日・60日・90日ロードマップ', 'ROADMAP'));
    var rm = el('div', 'cf-roadmap');
    var days = [['30日', content.roadmap.d30], ['60日', content.roadmap.d60], ['90日', content.roadmap.d90]];
    for (var dd = 0; dd < days.length; dd++) {
      var rmi = el('div', 'cf-rm');
      rmi.appendChild(el('span', 'd', '〜' + days[dd][0]));
      rmi.appendChild(el('p', null, days[dd][1]));
      rm.appendChild(rmi);
    }
    card.appendChild(rm);

    /* 導線: 記事→ラボ→教材 */
    card.appendChild(h3('1. 無料記事で理解する', 'READ'));
    card.appendChild(linkList(content.articles, '記事', 'career_fit_article_click'));
    card.appendChild(h3('2. モデリングラボで試す', 'TRY'));
    card.appendChild(linkList(content.labs, 'ラボ', 'career_fit_lab_click'));

    var mh = h3('3. 教材で仕上げる', 'MATERIALS');
    mh.appendChild(el('span', 'cf-mstatus', OPCF.MATERIAL_STATUS[content.materialStatus]));
    card.appendChild(mh);
    if (content.materials.length) {
      var mitems = [];
      for (var mi = 0; mi < content.materials.length; mi++) {
        var m = OPCF.MATERIALS[content.materials[mi]];
        mitems.push({ t: m.title + 'の中身を見る', href: m.href });
      }
      card.appendChild(linkList(mitems, '教材', 'career_fit_material_click'));
    } else {
      card.appendChild(el('p', 'cf-p', 'この職種に直接対応する教材は現在準備中です。上の無料記事とモデリングラボで十分に土台をつくれます。'));
    }

    /* 準備度別CTA */
    var band = OPCF.readinessBand(row.readiness);
    var cta = OPCF.READINESS_CTA[band];
    var cbox = el('div', 'cf-cta');
    cbox.appendChild(el('h4', null, '次の一歩：' + cta.label));
    cbox.appendChild(el('p', null, 'あなたの現在の準備度は ' + row.readiness + '/100 です。' + cta.desc));
    var evmap = { '記事': 'career_fit_article_click' };
    var citems = el('div', 'cf-links');
    for (var ci = 0; ci < cta.links.length; ci++) {
      var ca = el('a', 'cf-link');
      ca.href = cta.links[ci].href;
      var isMat = cta.links[ci].href.indexOf('/materials/') === 0;
      var isLab = cta.links[ci].href.indexOf('/lab/') === 0;
      ca.setAttribute('data-cf-ev', isMat ? 'career_fit_material_click' : (isLab ? 'career_fit_lab_click' : 'career_fit_article_click'));
      ca.appendChild(el('span', 'tag', isMat ? '教材' : (isLab ? 'ラボ' : '学ぶ')));
      ca.appendChild(el('span', null, cta.links[ci].t));
      ca.appendChild(el('span', 'ar', '→'));
      citems.appendChild(ca);
    }
    cbox.appendChild(citems);
    card.appendChild(cbox);
    return card;
  }

  function subCareerCard(row, axes, rankLabel) {
    var content = OPCF.CONTENT[row.id];
    var career = null;
    for (var i = 0; i < OPCF.CAREERS.length; i++) { if (OPCF.CAREERS[i].id === row.id) { career = OPCF.CAREERS[i]; } }
    var d = document.createElement('details');
    d.className = 'cf-sub-career';
    var s = document.createElement('summary');
    var head = el('div');
    head.appendChild(el('p', 'cf-rank', rankLabel));
    head.appendChild(el('h3', 'cf-cname', row.name));
    s.appendChild(head);
    s.appendChild(el('span', 'mini', '相性 ' + row.fit + ' ／ 準備度 ' + row.readiness));
    s.appendChild(el('span', 'opn', '詳細を見る'));
    d.appendChild(s);
    var body = el('div', 'cf-body');
    body.appendChild(scoreBlock(row));
    body.appendChild(el('p', 'cf-p', content.tagline + '。' + content.job));
    var reasons = pickReasons(career, content, axes);
    if (reasons.length) {
      body.appendChild(h3('相性がよいと考えられる理由', 'WHY'));
      var rl = el('ul', 'cf-list');
      for (var rr = 0; rr < Math.min(2, reasons.length); rr++) { rl.appendChild(el('li', null, reasons[rr])); }
      body.appendChild(rl);
    }
    body.appendChild(h3('ミスマッチになり得る点', 'WATCH OUT'));
    var ml = el('ul', 'cf-list cf-list--warn');
    for (var mm = 0; mm < Math.min(2, content.mismatch.length); mm++) { ml.appendChild(el('li', null, content.mismatch[mm])); }
    body.appendChild(ml);
    body.appendChild(h3('まず読む・試す', 'START'));
    body.appendChild(linkList(content.articles.slice(0, 2), '記事', 'career_fit_article_click'));
    body.appendChild(linkList(content.labs.slice(0, 1), 'ラボ', 'career_fit_lab_click'));
    if (content.materials.length) {
      var m = OPCF.MATERIALS[content.materials[0]];
      body.appendChild(linkList([{ t: m.title + 'の中身を見る', href: m.href }], '教材', 'career_fit_material_click'));
    }
    d.appendChild(body);
    return d;
  }

  function renderResult() {
    var res = OPCF.score(state.answers);
    var box = resultBox;
    box.innerHTML = '';
    track('career_fit_result_view', { top_career: res.top3[0].id });

    var head = el('div');
    head.appendChild(el('p', 'eyebrow', 'RESULT'));
    head.appendChild(el('h2', null, '診断結果：あなたと相性がよい可能性が高い3職種'));
    var conf = el('span', 'cf-conf cf-conf--' + res.confidence.level,
      '診断精度：' + (res.confidence.level === 'high' ? '高' : res.confidence.level === 'mid' ? '中' : '低'));
    head.appendChild(conf);
    head.appendChild(el('p', 'cf-conf-note', res.confidence.note));
    head.appendChild(el('p', 'cf-p', 'この結果は現在の回答から見た「傾向」であり、職業適性を断定するものではありません。キャリア相性・現在の準備度・働き方との相性は別々の指標です。準備度が低くても、相性の高い職種は学習で十分に目指せます。'));
    box.appendChild(head);

    var cards = el('div', 'cf-cards');
    cards.appendChild(firstCareerCard(res.top3[0], res.axes));
    cards.appendChild(subCareerCard(res.top3[1], res.axes, '第2候補 — 有力候補'));
    cards.appendChild(subCareerCard(res.top3[2], res.axes, '第3候補 — 比較検討したい候補'));
    box.appendChild(cards);

    /* 上位3職種の比較表 */
    var cmp = el('div');
    cmp.appendChild(h3('上位3職種の比較', 'COMPARE'));
    var tbl = el('table', 'cf-table');
    var tr0 = el('tr');
    tr0.appendChild(el('th', null, '職種'));
    tr0.appendChild(el('th', null, 'キャリア相性'));
    tr0.appendChild(el('th', null, '現在の準備度'));
    tr0.appendChild(el('th', null, '働き方との相性'));
    tr0.appendChild(el('th', null, '教材状況'));
    tbl.appendChild(tr0);
    for (var i = 0; i < res.top3.length; i++) {
      var row = res.top3[i];
      var tr = el('tr');
      tr.appendChild(el('td', null, row.name));
      tr.appendChild(el('td', 'num', row.fit + ' /100'));
      tr.appendChild(el('td', 'num', row.readiness + ' /100'));
      tr.appendChild(el('td', 'num', row.workFit + ' /100'));
      tr.appendChild(el('td', null, OPCF.MATERIAL_STATUS[OPCF.CONTENT[row.id].materialStatus]));
      tbl.appendChild(tr);
    }
    cmp.appendChild(tbl);
    box.appendChild(cmp);

    /* 再診断など */
    var again = el('div', 'cf-again');
    var b1 = el('button', 'btn btn-solid', 'もう一度診断する');
    b1.type = 'button';
    b1.addEventListener('click', function () { restart(true); });
    again.appendChild(b1);
    var a2 = el('a', 'btn btn-line', '学習ロードマップを見る');
    a2.href = '/#roadmap';
    again.appendChild(a2);
    box.appendChild(again);

    box.appendChild(el('p', 'cf-disclaim', '本診断は学習の出発点を整理するための無料ツールであり、採用判断・能力証明・投資助言に用いるものではありません。回答内容はこの端末（ブラウザ）にのみ保存され、サーバーには送信されません。'));

    /* リンククリック計測（回答内容は送らない） */
    box.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[data-cf-ev]') : null;
      if (a) { track(a.getAttribute('data-cf-ev'), { href: a.getAttribute('href') }); }
    });
  }

  /* ---- 初期化 ---- */
  function syncIntro() {
    var saved = load();
    var resumeBox = $('cfResume');
    var startBtn = $('cfStart');
    if (saved && Object.keys(saved.answers || {}).length > 0) {
      state = { answers: saved.answers || {}, cursor: Math.min(saved.cursor || 0, Q.length - 1), done: !!saved.done };
      resumeBox.classList.add('show');
      if (state.done) {
        $('cfResumeText').textContent = '前回の診断結果が保存されています。';
        $('cfResumeLink').textContent = '前回の結果を見る →';
      } else {
        $('cfResumeText').textContent = '前回の回答（' + answeredCount() + ' / ' + Q.length + '問）が保存されています。';
        $('cfResumeLink').textContent = '続きから再開する →';
      }
      startBtn.textContent = '最初から診断する';
    } else {
      resumeBox.classList.remove('show');
      startBtn.textContent = '診断を始める';
    }
  }

  $('cfStart').addEventListener('click', function () {
    if (Object.keys(state.answers).length > 0) { restart(false); }
    start();
  });
  $('cfResumeLink').addEventListener('click', function (e) {
    e.preventDefault();
    if (state.done) { renderResult(); show(resultBox); }
    else { resume(); }
  });
  $('cfBack').addEventListener('click', back);
  $('cfNext').addEventListener('click', next);
  $('cfRestart').addEventListener('click', function () { restart(true); });

  syncIntro();
  track('career_fit_view', {});
})();
;
