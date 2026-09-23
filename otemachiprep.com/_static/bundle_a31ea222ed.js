!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;"undefined"!=typeof window?t=window:"undefined"!=typeof global?t=global:"undefined"!=typeof self&&(t=self),t.sbjs=e()}}(function(){return function e(t,r,n){function a(s,o){if(!r[s]){if(!t[s]){var c="function"==typeof require&&require;if(!o&&c)return c(s,!0);if(i)return i(s,!0);var u=new Error("Cannot find module '"+s+"'");throw u.code="MODULE_NOT_FOUND",u}var p=r[s]={exports:{}};t[s][0].call(p.exports,function(e){var r=t[s][1][e];return a(r||e)},p,p.exports,e,t,r,n)}return r[s].exports}for(var i="function"==typeof require&&require,s=0;s<n.length;s++)a(n[s]);return a}({1:[function(e,t,r){"use strict";var n=e("./init"),a={init:function(e){this.get=n(e),e&&e.callback&&"function"==typeof e.callback&&e.callback(this.get)}};t.exports=a},{"./init":6}],2:[function(e,t,r){"use strict";var n=e("./terms"),a=e("./helpers/utils"),i={containers:{current:"sbjs_current",current_extra:"sbjs_current_add",first:"sbjs_first",first_extra:"sbjs_first_add",session:"sbjs_session",udata:"sbjs_udata",promocode:"sbjs_promo"},service:{migrations:"sbjs_migrations"},delimiter:"|||",aliases:{main:{type:"typ",source:"src",medium:"mdm",campaign:"cmp",content:"cnt",term:"trm",id:"id",platform:"plt",format:"fmt",tactic:"tct"},extra:{fire_date:"fd",entrance_point:"ep",referer:"rf"},session:{pages_seen:"pgs",current_page:"cpg"},udata:{visits:"vst",ip:"uip",agent:"uag"},promo:"code"},pack:{main:function(e){return i.aliases.main.type+"="+e.type+i.delimiter+i.aliases.main.source+"="+e.source+i.delimiter+i.aliases.main.medium+"="+e.medium+i.delimiter+i.aliases.main.campaign+"="+e.campaign+i.delimiter+i.aliases.main.content+"="+e.content+i.delimiter+i.aliases.main.term+"="+e.term+i.delimiter+i.aliases.main.id+"="+e.id+i.delimiter+i.aliases.main.platform+"="+e.platform+i.delimiter+i.aliases.main.format+"="+e.format+i.delimiter+i.aliases.main.tactic+"="+e.tactic},extra:function(e){return i.aliases.extra.fire_date+"="+a.setDate(new Date,e)+i.delimiter+i.aliases.extra.entrance_point+"="+document.location.href+i.delimiter+i.aliases.extra.referer+"="+(document.referrer||n.none)},user:function(e,t){return i.aliases.udata.visits+"="+e+i.delimiter+i.aliases.udata.ip+"="+t+i.delimiter+i.aliases.udata.agent+"="+navigator.userAgent},session:function(e){return i.aliases.session.pages_seen+"="+e+i.delimiter+i.aliases.session.current_page+"="+document.location.href},promo:function(e){return i.aliases.promo+"="+a.setLeadingZeroToInt(a.randomInt(e.min,e.max),e.max.toString().length)}}};t.exports=i},{"./helpers/utils":5,"./terms":9}],3:[function(e,t,r){"use strict";var n=e("../data").delimiter;t.exports={useBase64:!1,setBase64Flag:function(e){this.useBase64=e},encodeData:function(e){return encodeURIComponent(e).replace(/\!/g,"%21").replace(/\~/g,"%7E").replace(/\*/g,"%2A").replace(/\'/g,"%27").replace(/\(/g,"%28").replace(/\)/g,"%29")},decodeData:function(e){try{return decodeURIComponent(e).replace(/\%21/g,"!").replace(/\%7E/g,"~").replace(/\%2A/g,"*").replace(/\%27/g,"'").replace(/\%28/g,"(").replace(/\%29/g,")")}catch(t){try{return unescape(e)}catch(r){return""}}},set:function(e,t,r,n,a){var i,s;if(r){var o=new Date;o.setTime(o.getTime()+60*r*1e3),i="; expires="+o.toGMTString()}else i="";s=n&&!a?";domain=."+n:"";var c=this.encodeData(t);this.useBase64&&(c=btoa(c).replace(/=+$/,"")),document.cookie=this.encodeData(e)+"="+c+i+s+"; path=/"},get:function(e){for(var t=this.encodeData(e)+"=",r=document.cookie.split(";"),n=0;n<r.length;n++){for(var a=r[n];" "===a.charAt(0);)a=a.substring(1,a.length);if(0===a.indexOf(t)){var i=a.substring(t.length,a.length);if(/^[A-Za-z0-9+/]+$/.test(i))try{i=atob(i.padEnd(4*Math.ceil(i.length/4),"="))}catch(s){}return this.decodeData(i)}}return null},destroy:function(e,t,r){this.set(e,"",-1,t,r)},parse:function(e){var t=[],r={};if("string"==typeof e)t.push(e);else for(var a in e)e.hasOwnProperty(a)&&t.push(e[a]);for(var i=0;i<t.length;i++){var s;r[this.unsbjs(t[i])]={},s=this.get(t[i])?this.get(t[i]).split(n):[];for(var o=0;o<s.length;o++){var c=s[o].split("="),u=c.splice(0,1);u.push(c.join("=")),r[this.unsbjs(t[i])][u[0]]=this.decodeData(u[1])}}return r},unsbjs:function(e){return e.replace("sbjs_","")}}},{"../data":2}],4:[function(e,t,r){"use strict";t.exports={parse:function(e){for(var t=this.parseOptions,r=t.parser[t.strictMode?"strict":"loose"].exec(e),n={},a=14;a--;)n[t.key[a]]=r[a]||"";return n[t.q.name]={},n[t.key[12]].replace(t.q.parser,function(e,r,a){r&&(n[t.q.name][r]=a)}),n},parseOptions:{strictMode:!1,key:["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],q:{name:"queryKey",parser:/(?:^|&)([^&=]*)=?([^&]*)/g},parser:{strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/}},getParam:function(e){for(var t={},r=(e||window.location.search.substring(1)).split("&"),n=0;n<r.length;n++){var a=r[n].split("=");if("undefined"==typeof t[a[0]])t[a[0]]=a[1];else if("string"==typeof t[a[0]]){var i=[t[a[0]],a[1]];t[a[0]]=i}else t[a[0]].push(a[1])}return t},getHost:function(e){return this.parse(e).host.replace("www.","")}}},{}],5:[function(e,t,r){"use strict";t.exports={escapeRegexp:function(e){return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")},setDate:function(e,t){var r=e.getTimezoneOffset()/60,n=e.getHours(),a=t||0===t?t:-r;return e.setHours(n+r+a),e.getFullYear()+"-"+this.setLeadingZeroToInt(e.getMonth()+1,2)+"-"+this.setLeadingZeroToInt(e.getDate(),2)+" "+this.setLeadingZeroToInt(e.getHours(),2)+":"+this.setLeadingZeroToInt(e.getMinutes(),2)+":"+this.setLeadingZeroToInt(e.getSeconds(),2)},setLeadingZeroToInt:function(e,t){for(var r=e+"";r.length<t;)r="0"+r;return r},randomInt:function(e,t){return Math.floor(Math.random()*(t-e+1))+e}}},{}],6:[function(e,t,r){"use strict";var n=e("./data"),a=e("./terms"),i=e("./helpers/cookies"),s=e("./helpers/uri"),o=e("./helpers/utils"),c=e("./params"),u=e("./migrations");t.exports=function(e){var t,r,p,f,m,d,l,g,h,y,_,v,b,x=c.fetch(e),k=s.getParam(),w=x.domain.host,q=x.domain.isolate,I=x.lifetime;function j(e){switch(e){case a.traffic.utm:t=a.traffic.utm,r="undefined"!=typeof k.utm_source?k.utm_source:"undefined"!=typeof k.gclid?"google":"undefined"!=typeof k.yclid?"yandex":a.none,p="undefined"!=typeof k.utm_medium?k.utm_medium:"undefined"!=typeof k.gclid?"cpc":"undefined"!=typeof k.yclid?"cpc":a.none,f="undefined"!=typeof k.utm_campaign?k.utm_campaign:"undefined"!=typeof k[x.campaign_param]?k[x.campaign_param]:"undefined"!=typeof k.gclid?"google_cpc":"undefined"!=typeof k.yclid?"yandex_cpc":a.none,m="undefined"!=typeof k.utm_content?k.utm_content:"undefined"!=typeof k[x.content_param]?k[x.content_param]:a.none,l=k.utm_id||a.none,g=k.utm_source_platform||a.none,h=k.utm_creative_format||a.none,y=k.utm_marketing_tactic||a.none,d="undefined"!=typeof k.utm_term?k.utm_term:"undefined"!=typeof k[x.term_param]?k[x.term_param]:function(){var e=document.referrer;if(k.utm_term)return k.utm_term;if(!(e&&s.parse(e).host&&s.parse(e).host.match(/^(?:.*\.)?yandex\..{2,9}$/i)))return!1;try{return s.getParam(s.parse(document.referrer).query).text}catch(t){return!1}}()||a.none;break;case a.traffic.organic:t=a.traffic.organic,r=r||s.getHost(document.referrer),p=a.referer.organic,f=a.none,m=a.none,d=a.none,l=a.none,g=a.none,h=a.none,y=a.none;break;case a.traffic.referral:t=a.traffic.referral,r=r||s.getHost(document.referrer),p=p||a.referer.referral,f=a.none,m=s.parse(document.referrer).path,d=a.none,l=a.none,g=a.none,h=a.none,y=a.none;break;case a.traffic.typein:t=a.traffic.typein,r=x.typein_attributes.source,p=x.typein_attributes.medium,f=a.none,m=a.none,d=a.none,l=a.none,g=a.none,h=a.none,y=a.none;break;default:t=a.oops,r=a.oops,p=a.oops,f=a.oops,m=a.oops,d=a.oops,l=a.oops,g=a.oops,h=a.oops,y=a.oops}var i={type:t,source:r,medium:p,campaign:f,content:m,term:d,id:l,platform:g,format:h,tactic:y};return n.pack.main(i)}function R(e){var t=document.referrer;switch(e){case a.traffic.organic:return!!t&&H(t)&&function(e){var t=new RegExp("^(?:.*\\.)?"+o.escapeRegexp("yandex")+"\\..{2,9}$"),n=new RegExp(".*"+o.escapeRegexp("text")+"=.*"),a=new RegExp("^(?:www\\.)?"+o.escapeRegexp("google")+"\\..{2,9}$");if(s.parse(e).query&&s.parse(e).host.match(t)&&s.parse(e).query.match(n))return r="yandex",!0;if(s.parse(e).host.match(a))return r="google",!0;if(!s.parse(e).query)return!1;for(var i=0;i<x.organics.length;i++){if(s.parse(e).host.match(new RegExp("^(?:.*\\.)?"+o.escapeRegexp(x.organics[i].host)+"$","i"))&&s.parse(e).query.match(new RegExp(".*"+o.escapeRegexp(x.organics[i].param)+"=.*","i")))return r=x.organics[i].display||x.organics[i].host,!0;if(i+1===x.organics.length)return!1}}(t);case a.traffic.referral:return!!t&&H(t)&&function(e){if(!(x.referrals.length>0))return r=s.getHost(e),!0;for(var t=0;t<x.referrals.length;t++){if(s.parse(e).host.match(new RegExp("^(?:.*\\.)?"+o.escapeRegexp(x.referrals[t].host)+"$","i")))return r=x.referrals[t].display||x.referrals[t].host,p=x.referrals[t].medium||a.referer.referral,!0;if(t+1===x.referrals.length)return r=s.getHost(e),!0}}(t);default:return!1}}function H(e){if(x.domain){if(q)return s.getHost(e)!==s.getHost(w);var t=new RegExp("^(?:.*\\.)?"+o.escapeRegexp(w)+"$","i");return!s.getHost(e).match(t)}return s.getHost(e)!==s.getHost(document.location.href)}function D(){i.set(n.containers.current_extra,n.pack.extra(x.timezone_offset),I,w,q),i.get(n.containers.first_extra)||i.set(n.containers.first_extra,n.pack.extra(x.timezone_offset),I,w,q)}return i.setBase64Flag(x.base64),u.go(I,w,q),i.set(n.containers.current,function(){var e;if("undefined"!=typeof k.utm_source||"undefined"!=typeof k.utm_medium||"undefined"!=typeof k.utm_campaign||"undefined"!=typeof k.utm_content||"undefined"!=typeof k.utm_term||"undefined"!=typeof k.utm_id||"undefined"!=typeof k.utm_source_platform||"undefined"!=typeof k.utm_creative_format||"undefined"!=typeof k.utm_marketing_tactic||"undefined"!=typeof k.gclid||"undefined"!=typeof k.yclid||"undefined"!=typeof k[x.campaign_param]||"undefined"!=typeof k[x.term_param]||"undefined"!=typeof k[x.content_param])D(),e=j(a.traffic.utm);else if(R(a.traffic.organic))D(),e=j(a.traffic.organic);else if(!i.get(n.containers.session)&&R(a.traffic.referral))D(),e=j(a.traffic.referral);else{if(i.get(n.containers.first)||i.get(n.containers.current))return i.get(n.containers.current);D(),e=j(a.traffic.typein)}return e}(),I,w,q),i.get(n.containers.first)||i.set(n.containers.first,i.get(n.containers.current),I,w,q),i.get(n.containers.udata)?(_=parseInt(i.parse(n.containers.udata)[i.unsbjs(n.containers.udata)][n.aliases.udata.visits])||1,_=i.get(n.containers.session)?_:_+1,v=n.pack.user(_,x.user_ip)):(_=1,v=n.pack.user(_,x.user_ip)),i.set(n.containers.udata,v,I,w,q),i.get(n.containers.session)?(b=parseInt(i.parse(n.containers.session)[i.unsbjs(n.containers.session)][n.aliases.session.pages_seen])||1,b+=1):b=1,i.set(n.containers.session,n.pack.session(b),x.session_length,w,q),x.promocode&&!i.get(n.containers.promocode)&&i.set(n.containers.promocode,n.pack.promo(x.promocode),I,w,q),i.parse(n.containers)}},{"./data":2,"./helpers/cookies":3,"./helpers/uri":4,"./helpers/utils":5,"./migrations":7,"./params":8,"./terms":9}],7:[function(e,t,r){"use strict";var n=e("./data"),a=e("./helpers/cookies");t.exports={go:function(e,t,r){var i,s=this.migrations,o={l:e,d:t,i:r};if(a.get(n.containers.first)||a.get(n.service.migrations)){if(!a.get(n.service.migrations))for(i=0;i<s.length;i++)s[i].go(s[i].id,o)}else{var c=[];for(i=0;i<s.length;i++)c.push(s[i].id);var u="";for(i=0;i<c.length;i++)u+=c[i]+"=1",i<c.length-1&&(u+=n.delimiter);a.set(n.service.migrations,u,o.l,o.d,o.i)}},migrations:[{id:"1418474375998",version:"1.0.0-beta",go:function(e,t){var r=e+"=1",i=e+"=0",s=function(e,t,r){return t||r?e:n.delimiter};try{var o=[];for(var c in n.containers)n.containers.hasOwnProperty(c)&&o.push(n.containers[c]);for(var u=0;u<o.length;u++)if(a.get(o[u])){var p=a.get(o[u]).replace(/(\|)?\|(\|)?/g,s);a.destroy(o[u],t.d,t.i),a.destroy(o[u],t.d,!t.i),a.set(o[u],p,t.l,t.d,t.i)}a.get(n.containers.session)&&a.set(n.containers.session,n.pack.session(0),t.l,t.d,t.i),a.set(n.service.migrations,r,t.l,t.d,t.i)}catch(f){a.set(n.service.migrations,i,t.l,t.d,t.i)}}}]}},{"./data":2,"./helpers/cookies":3}],8:[function(e,t,r){"use strict";var n=e("./terms"),a=e("./helpers/uri");t.exports={fetch:function(e){var t=e||{},r={};if(r.lifetime=this.validate.checkFloat(t.lifetime)||6,r.lifetime=parseInt(30*r.lifetime*24*60),r.session_length=this.validate.checkInt(t.session_length)||30,r.timezone_offset=this.validate.checkInt(t.timezone_offset),r.base64=t.base64||!1,r.campaign_param=t.campaign_param||!1,r.term_param=t.term_param||!1,r.content_param=t.content_param||!1,r.user_ip=t.user_ip||n.none,t.promocode?(r.promocode={},r.promocode.min=parseInt(t.promocode.min)||1e5,r.promocode.max=parseInt(t.promocode.max)||999999):r.promocode=!1,t.typein_attributes&&t.typein_attributes.source&&t.typein_attributes.medium?(r.typein_attributes={},r.typein_attributes.source=t.typein_attributes.source,r.typein_attributes.medium=t.typein_attributes.medium):r.typein_attributes={source:"(direct)",medium:"(none)"},t.domain&&this.validate.isString(t.domain)?r.domain={host:t.domain,isolate:!1}:t.domain&&t.domain.host?r.domain=t.domain:r.domain={host:a.getHost(document.location.hostname),isolate:!1},r.referrals=[],t.referrals&&t.referrals.length>0)for(var i=0;i<t.referrals.length;i++)t.referrals[i].host&&r.referrals.push(t.referrals[i]);if(r.organics=[],t.organics&&t.organics.length>0)for(var s=0;s<t.organics.length;s++)t.organics[s].host&&t.organics[s].param&&r.organics.push(t.organics[s]);return r.organics.push({host:"bing.com",param:"q",display:"bing"}),r.organics.push({host:"yahoo.com",param:"p",display:"yahoo"}),r.organics.push({host:"about.com",param:"q",display:"about"}),r.organics.push({host:"aol.com",param:"q",display:"aol"}),r.organics.push({host:"ask.com",param:"q",display:"ask"}),r.organics.push({host:"globososo.com",param:"q",display:"globo"}),r.organics.push({host:"go.mail.ru",param:"q",display:"go.mail.ru"}),r.organics.push({host:"rambler.ru",param:"query",display:"rambler"}),r.organics.push({host:"tut.by",param:"query",display:"tut.by"}),r.referrals.push({host:"t.co",display:"twitter.com"}),r.referrals.push({host:"plus.url.google.com",display:"plus.google.com"}),r},validate:{checkFloat:function(e){return!(!e||!this.isNumeric(parseFloat(e)))&&parseFloat(e)},checkInt:function(e){return!(!e||!this.isNumeric(parseInt(e)))&&parseInt(e)},isNumeric:function(e){return!isNaN(e)},isString:function(e){return"[object String]"===Object.prototype.toString.call(e)}}}},{"./helpers/uri":4,"./terms":9}],9:[function(e,t,r){"use strict";t.exports={traffic:{utm:"utm",organic:"organic",referral:"referral",typein:"typein"},referer:{referral:"referral",organic:"organic",social:"social"},none:"(none)",oops:"(Houston, we have a problem)"}},{}]},{},[1])(1)});;
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
    window.setTimeout(function(){window.location.href=h;},160);
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

/* op-articles-v1: 記事ライブラリ（検索コンボボックス／分野カルーセル／A–Z絞り込み／URL状態／計測） */
(function(){'use strict';
var d=document;
var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function ev(name,p){p=p||{};try{
  if(typeof window.gtag==='function'){window.gtag('event',name,p);}
  else if(window.dataLayer&&typeof window.dataLayer.push==='function'){window.dataLayer.push({event:name,articles:p});}
}catch(e){}}
function slugOf(a){var m=/^https?:\/\/[^/]+\/([^/?#]+)\/?/.exec(a.href||'');return m?decodeURIComponent(m[1]):'';}
function norm(s){s=String(s||'');if(s.normalize){s=s.normalize('NFKC');}
  s=s.toLowerCase().replace(/[\u30a1-\u30f6]/g,function(c){return String.fromCharCode(c.charCodeAt(0)-0x60);});
  return s.replace(/[\s\u3000]+/g,' ').trim();}
function debounce(fn,ms){var t;return function(){var a=arguments,c=this;clearTimeout(t);t=setTimeout(function(){fn.apply(c,a);},ms);};}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}

/* ---------- 計測（クリック委譲） ---------- */
d.addEventListener('click',function(e){
  var a=e.target.closest?e.target.closest('a,button'):null;if(!a)return;
  if(a.classList.contains('al-card')){ev('articles_card_click',{slug:a.getAttribute('data-slug')||slugOf(a),group:a.getAttribute('data-g')||'',placement:a.closest('.al-grid')?'grid':'carousel'});return;}
  if(a.classList.contains('al-viewall')){ev('articles_viewall_click',{group:a.getAttribute('data-g')||''});return;}
  var li=a.closest('.al-li');if(li){ev('articles_list_click',{slug:li.getAttribute('data-slug')||'',group:li.getAttribute('data-g')||''});return;}
  var fvr=a.closest('#fvr-art');if(fvr){
    if(a.classList.contains('fvr-tab')){ev('articles_rank_tab',{window:a.getAttribute('data-fvr-tab')||''});return;}
    var item=a.closest('.fvr-item');if(item&&a.tagName==='A'){var panel=a.closest('.fvr-panel');var rank=[].indexOf.call(item.parentNode.children,item)+1;ev('articles_rank_click',{slug:slugOf(a),rank:rank,window:panel?panel.getAttribute('data-fvr-panel'):''});}
  }
},true);

/* ---------- A–Z 一覧インデックス ---------- */
var list=d.getElementById('alList');
var items=[];
if(list){
  items=[].map.call(list.querySelectorAll('.al-li'),function(li){
    var a=li.querySelector('a'),t=li.querySelector('.al-li-t'),c=li.querySelector('.al-li-cat');
    var title=t?t.textContent.trim():'';
    return {el:li,slug:li.getAttribute('data-slug')||'',g:li.getAttribute('data-g')||'',v:+(li.getAttribute('data-v')||0),t:norm(title),k:norm((li.getAttribute('data-k')||'')+' '+(c?c.textContent:'')),title:title,url:a?a.href:'#',cat:c?c.textContent.trim():'',min:''};
  });
}
var total=items.length;
function tokens(q){return norm(q).split(' ').filter(Boolean);}
function score(it,toks){var s=0;
  for(var i=0;i<toks.length;i++){var tk=toks[i];
    if(it.t.indexOf(tk)===0)s+=5;else if(it.t.indexOf(tk)>-1)s+=3;else if(it.k.indexOf(tk)>-1)s+=1;else return 0;}
  return s+Math.max(0,40-it.title.length)/100+Math.min(it.v,99999)/1e7;} /* 関連度が同じときだけ直近30日閲覧数で前に */
function search(q,limit){var toks=tokens(q);if(!toks.length)return [];
  var out=[];for(var i=0;i<items.length;i++){var s=score(items[i],toks);if(s>0)out.push({it:items[i],s:s});}
  out.sort(function(a,b){return b.s-a.s;});
  return (limit?out.slice(0,limit):out).map(function(x){return x.it;});}

/* ---------- 絞り込み適用＋URL状態 ---------- */
var countEl=d.getElementById('alAllCount'),emptyEl=d.getElementById('alEmpty');
var inputs=[].slice.call(d.querySelectorAll('.al-search-in'));
var curQ='';
function applyFilter(q,src){
  q=String(q||'').trim();curQ=q;
  inputs.forEach(function(i){if(i.value!==q)i.value=q;var c=i.parentNode.querySelector('.al-search-clear');if(c)c.hidden=!q;});
  if(!list)return 0;
  var toks=tokens(q),shown=0;
  for(var i=0;i<items.length;i++){var hit=!toks.length||score(items[i],toks)>0;items[i].el.hidden=!hit;if(hit)shown++;}
  if(countEl){countEl.textContent=q?('「'+q+'」に一致：'+shown+'本 / 全'+total+'本'):('全'+total+'本');}
  if(emptyEl){emptyEl.hidden=!(q&&shown===0);}
  return shown;
}
function setUrl(q,push){
  try{var u=new URL(location.href);if(q){u.searchParams.set('q',q);}else{u.searchParams.delete('q');}
    var st={alq:q};if(push){history.pushState(st,'',u);}else{history.replaceState(st,'',u);}}catch(e){}
}
var lastLogged='';
function logSearch(q,shown,name){if(!q||q.length<2||q===lastLogged)return;lastLogged=q;ev(name,{search_term:q.slice(0,60),results:shown});}

/* ---------- コンボボックス ---------- */
inputs.forEach(function(input){
  var wrap=input.closest('.al-search'),box=d.getElementById(input.getAttribute('aria-controls')),status=wrap.querySelector('.al-search-status'),clearBtn=wrap.querySelector('.al-search-clear');
  var isTop=(input.id==='alq'),active=-1,results=[],openFlag=false;
  function close(){openFlag=false;box.hidden=true;box.innerHTML='';input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');active=-1;}
  function render(q){
    results=search(q,8);
    if(!q.trim()){close();if(status)status.textContent='';return;}
    var toks=tokens(q),html='';
    results.forEach(function(it,i){
      var t=esc(it.title);
      if(toks[0]){var re=new RegExp('('+toks[0].replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','i');t=t.replace(re,'<mark>$1</mark>');}
      html+='<li id="'+input.id+'-opt'+i+'" class="al-sug-item" role="option" aria-selected="false" data-i="'+i+'"><span class="al-sug-t">'+t+'</span><span class="al-sug-m">'+esc(it.cat)+'</span></li>';
    });
    var all=search(q,0).length;
    html+='<li class="al-sug-foot" role="presentation">'+(all?('<kbd>Enter</kbd> で一覧を'+all+'本に絞り込む'):'一致する記事がありません（英語表記・略語でも検索できます）')+'</li>';
    box.innerHTML=html;box.hidden=false;openFlag=true;input.setAttribute('aria-expanded','true');active=-1;
    if(status)status.textContent=all?(all+'本が一致'):'一致なし';
  }
  function setActive(i){var opts=box.querySelectorAll('[role="option"]');if(!opts.length)return;
    if(i<0)i=opts.length-1;if(i>=opts.length)i=0;active=i;
    [].forEach.call(opts,function(o,k){o.setAttribute('aria-selected',k===i?'true':'false');});
    input.setAttribute('aria-activedescendant',opts[i].id);
    if(opts[i].scrollIntoView)opts[i].scrollIntoView({block:'nearest'});}
  function go(it,via){ev('articles_search_click',{slug:it.slug,search_term:input.value.slice(0,60),via:via});location.href=it.url;}
  function commit(){
    var q=input.value.trim();close();
    var shown=applyFilter(q,isTop?'top':'list');
    setUrl(q,isTop);
    logSearch(q,shown,isTop?'articles_search':'articles_list_search');
    if(isTop&&q){var all=d.getElementById('all');if(all){all.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});}
      var second=d.getElementById('alq2');if(second)second.focus({preventScroll:true});}
  }
  var liveFilter=debounce(function(){if(isTop)return;var q=input.value.trim();var shown=applyFilter(q,'list');setUrl(q,false);logSearch(q,shown,'articles_list_search');},120);
  var liveSug=debounce(function(){render(input.value);},90);
  input.addEventListener('input',function(){if(clearBtn)clearBtn.hidden=!input.value;liveSug();liveFilter();});
  input.addEventListener('keydown',function(e){
    if(e.key==='ArrowDown'){if(!openFlag&&input.value.trim()){render(input.value);}e.preventDefault();setActive(active+1);}
    else if(e.key==='ArrowUp'){e.preventDefault();setActive(active-1);}
    else if(e.key==='Enter'){e.preventDefault();if(openFlag&&active>=0&&results[active]){go(results[active],'keyboard');}else{commit();}}
    else if(e.key==='Escape'){if(openFlag){close();}else if(input.value){input.value='';applyFilter('', 'clear');setUrl('',false);}}
    else if(e.key==='Tab'){close();}
  });
  box.addEventListener('mousedown',function(e){e.preventDefault();});
  box.addEventListener('click',function(e){var li=e.target.closest?e.target.closest('[role="option"]'):null;if(!li)return;var it=results[+li.getAttribute('data-i')];if(it)go(it,'click');});
  input.addEventListener('blur',function(){setTimeout(close,120);});
  input.addEventListener('focus',function(){if(input.value.trim()&&!openFlag)render(input.value);});
  if(clearBtn){clearBtn.addEventListener('click',function(){input.value='';close();applyFilter('', 'clear');setUrl('',false);input.focus();});}
  if(input.form){input.form.addEventListener('submit',function(e){e.preventDefault();commit();});}
});

/* 初期状態: ?q= を復元（戻る／進むにも対応） */
function restore(){try{var q=new URL(location.href).searchParams.get('q')||'';applyFilter(q,'restore');}catch(e){applyFilter('','restore');}}
restore();
window.addEventListener('popstate',restore);

/* ---------- カルーセル（scroll-snap＋矢印＋ドット） ---------- */
var store={};try{store=JSON.parse(sessionStorage.getItem('opAlCar:'+location.pathname)||'{}');}catch(e){}
var saveStore=debounce(function(){try{sessionStorage.setItem('opAlCar:'+location.pathname,JSON.stringify(store));}catch(e){}},200);
[].forEach.call(d.querySelectorAll('.al-car'),function(car){
  var track=car.querySelector('.al-track'),cards=track.children,prev=car.querySelector('.al-prev'),next=car.querySelector('.al-next'),dots=car.querySelector('.al-dots');
  var sec=car.closest('.al-sec'),g=sec?sec.getAttribute('data-g'):'';
  if(!track||!cards.length)return;
  var byButton=false,pages=1,pageW=1,perView=1;
  function gap(){var s=getComputedStyle(track).columnGap||getComputedStyle(track).gap||'16px';return parseFloat(s)||16;}
  function measure(){
    var cw=cards[0].offsetWidth||cards[0].getBoundingClientRect().width,gp=gap(); // offsetWidth: ページズーム等の影響を受けないレイアウト幅
    perView=Math.max(1,Math.round((track.clientWidth+gp)/(cw+gp)));
    pageW=perView*(cw+gp);
    pages=Math.max(1,Math.ceil(cards.length/perView));
    var html='';
    if(pages>12){html='<span class="al-dots-txt" aria-live="polite"><span data-cur>1</span> / '+pages+'</span>';} /* ドットが多すぎる場合はカウンタ表示 */
    else{for(var i=0;i<pages;i++){html+='<button type="button" class="al-dot" data-p="'+i+'" aria-label="'+(i+1)+' / '+pages+' ページ目"></button>';}}
    dots.innerHTML=pages>1?html:'';
    var multi=pages>1;
    if(prev)prev.hidden=!multi;if(next)next.hidden=!multi;
    update();
  }
  function pageIndex(){return Math.min(pages-1,Math.max(0,Math.round(track.scrollLeft/pageW)));}
  function update(){
    var p=pageIndex(),maxL=track.scrollWidth-track.clientWidth-2;
    [].forEach.call(dots.querySelectorAll('.al-dot'),function(b,i){b.setAttribute('aria-current',i===p?'true':'false');});
    var cur=dots.querySelector('[data-cur]');if(cur)cur.textContent=String(p+1);
    if(prev)prev.setAttribute('aria-disabled',track.scrollLeft<=2?'true':'false');
    if(next)next.setAttribute('aria-disabled',track.scrollLeft>=maxL?'true':'false');
  }
  function goPage(p,action){p=Math.min(pages-1,Math.max(0,p));byButton=true;
    track.scrollTo({left:p*pageW,behavior:reduced?'auto':'smooth'});
    ev('articles_carousel',{group:g,action:action,page:p+1});
    setTimeout(function(){byButton=false;update();},600);}
  if(prev)prev.addEventListener('click',function(){goPage(pageIndex()-1,'prev');});
  if(next)next.addEventListener('click',function(){goPage(pageIndex()+1,'next');});
  dots.addEventListener('click',function(e){var b=e.target.closest?e.target.closest('.al-dot'):null;if(b)goPage(+b.getAttribute('data-p'),'dot');});
  track.addEventListener('keydown',function(e){
    if(e.key==='ArrowRight'){e.preventDefault();goPage(pageIndex()+1,'key');}
    else if(e.key==='ArrowLeft'){e.preventDefault();goPage(pageIndex()-1,'key');}
  });
  var tm=null,swipeLogged=false;
  track.addEventListener('scroll',function(){ /* rAFは非アクティブタブで止まるためsetTimeoutで間引く */
    if(tm)return;tm=setTimeout(function(){tm=null;update();store[g]=track.scrollLeft;saveStore();
      if(!byButton&&!swipeLogged){swipeLogged=true;ev('articles_carousel',{group:g,action:'swipe'});}},60);
  },{passive:true});
  // カードへのフォーカス移動時に、スナップ位置へ揃える
  track.addEventListener('focusin',function(e){var c=e.target.closest?e.target.closest('.al-card'):null;if(!c)return;
    var i=[].indexOf.call(cards,c);if(i<0)return;var p=Math.floor(i/perView);if(p!==pageIndex()){byButton=true;track.scrollTo({left:p*pageW,behavior:'auto'});setTimeout(function(){byButton=false;},300);}});
  measure();
  if(store[g]){byButton=true;track.scrollTo({left:store[g],behavior:'auto'});setTimeout(function(){byButton=false;update();},300);}
  if('ResizeObserver' in window){var ro=new ResizeObserver(debounce(measure,120));ro.observe(track);}
  else{window.addEventListener('resize',debounce(measure,150));}
});
})();
;
