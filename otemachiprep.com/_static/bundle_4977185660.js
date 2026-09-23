!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;"undefined"!=typeof window?t=window:"undefined"!=typeof global?t=global:"undefined"!=typeof self&&(t=self),t.sbjs=e()}}(function(){return function e(t,r,n){function a(s,o){if(!r[s]){if(!t[s]){var c="function"==typeof require&&require;if(!o&&c)return c(s,!0);if(i)return i(s,!0);var u=new Error("Cannot find module '"+s+"'");throw u.code="MODULE_NOT_FOUND",u}var p=r[s]={exports:{}};t[s][0].call(p.exports,function(e){var r=t[s][1][e];return a(r||e)},p,p.exports,e,t,r,n)}return r[s].exports}for(var i="function"==typeof require&&require,s=0;s<n.length;s++)a(n[s]);return a}({1:[function(e,t,r){"use strict";var n=e("./init"),a={init:function(e){this.get=n(e),e&&e.callback&&"function"==typeof e.callback&&e.callback(this.get)}};t.exports=a},{"./init":6}],2:[function(e,t,r){"use strict";var n=e("./terms"),a=e("./helpers/utils"),i={containers:{current:"sbjs_current",current_extra:"sbjs_current_add",first:"sbjs_first",first_extra:"sbjs_first_add",session:"sbjs_session",udata:"sbjs_udata",promocode:"sbjs_promo"},service:{migrations:"sbjs_migrations"},delimiter:"|||",aliases:{main:{type:"typ",source:"src",medium:"mdm",campaign:"cmp",content:"cnt",term:"trm",id:"id",platform:"plt",format:"fmt",tactic:"tct"},extra:{fire_date:"fd",entrance_point:"ep",referer:"rf"},session:{pages_seen:"pgs",current_page:"cpg"},udata:{visits:"vst",ip:"uip",agent:"uag"},promo:"code"},pack:{main:function(e){return i.aliases.main.type+"="+e.type+i.delimiter+i.aliases.main.source+"="+e.source+i.delimiter+i.aliases.main.medium+"="+e.medium+i.delimiter+i.aliases.main.campaign+"="+e.campaign+i.delimiter+i.aliases.main.content+"="+e.content+i.delimiter+i.aliases.main.term+"="+e.term+i.delimiter+i.aliases.main.id+"="+e.id+i.delimiter+i.aliases.main.platform+"="+e.platform+i.delimiter+i.aliases.main.format+"="+e.format+i.delimiter+i.aliases.main.tactic+"="+e.tactic},extra:function(e){return i.aliases.extra.fire_date+"="+a.setDate(new Date,e)+i.delimiter+i.aliases.extra.entrance_point+"="+document.location.href+i.delimiter+i.aliases.extra.referer+"="+(document.referrer||n.none)},user:function(e,t){return i.aliases.udata.visits+"="+e+i.delimiter+i.aliases.udata.ip+"="+t+i.delimiter+i.aliases.udata.agent+"="+navigator.userAgent},session:function(e){return i.aliases.session.pages_seen+"="+e+i.delimiter+i.aliases.session.current_page+"="+document.location.href},promo:function(e){return i.aliases.promo+"="+a.setLeadingZeroToInt(a.randomInt(e.min,e.max),e.max.toString().length)}}};t.exports=i},{"./helpers/utils":5,"./terms":9}],3:[function(e,t,r){"use strict";var n=e("../data").delimiter;t.exports={useBase64:!1,setBase64Flag:function(e){this.useBase64=e},encodeData:function(e){return encodeURIComponent(e).replace(/\!/g,"%21").replace(/\~/g,"%7E").replace(/\*/g,"%2A").replace(/\'/g,"%27").replace(/\(/g,"%28").replace(/\)/g,"%29")},decodeData:function(e){try{return decodeURIComponent(e).replace(/\%21/g,"!").replace(/\%7E/g,"~").replace(/\%2A/g,"*").replace(/\%27/g,"'").replace(/\%28/g,"(").replace(/\%29/g,")")}catch(t){try{return unescape(e)}catch(r){return""}}},set:function(e,t,r,n,a){var i,s;if(r){var o=new Date;o.setTime(o.getTime()+60*r*1e3),i="; expires="+o.toGMTString()}else i="";s=n&&!a?";domain=."+n:"";var c=this.encodeData(t);this.useBase64&&(c=btoa(c).replace(/=+$/,"")),document.cookie=this.encodeData(e)+"="+c+i+s+"; path=/"},get:function(e){for(var t=this.encodeData(e)+"=",r=document.cookie.split(";"),n=0;n<r.length;n++){for(var a=r[n];" "===a.charAt(0);)a=a.substring(1,a.length);if(0===a.indexOf(t)){var i=a.substring(t.length,a.length);if(/^[A-Za-z0-9+/]+$/.test(i))try{i=atob(i.padEnd(4*Math.ceil(i.length/4),"="))}catch(s){}return this.decodeData(i)}}return null},destroy:function(e,t,r){this.set(e,"",-1,t,r)},parse:function(e){var t=[],r={};if("string"==typeof e)t.push(e);else for(var a in e)e.hasOwnProperty(a)&&t.push(e[a]);for(var i=0;i<t.length;i++){var s;r[this.unsbjs(t[i])]={},s=this.get(t[i])?this.get(t[i]).split(n):[];for(var o=0;o<s.length;o++){var c=s[o].split("="),u=c.splice(0,1);u.push(c.join("=")),r[this.unsbjs(t[i])][u[0]]=this.decodeData(u[1])}}return r},unsbjs:function(e){return e.replace("sbjs_","")}}},{"../data":2}],4:[function(e,t,r){"use strict";t.exports={parse:function(e){for(var t=this.parseOptions,r=t.parser[t.strictMode?"strict":"loose"].exec(e),n={},a=14;a--;)n[t.key[a]]=r[a]||"";return n[t.q.name]={},n[t.key[12]].replace(t.q.parser,function(e,r,a){r&&(n[t.q.name][r]=a)}),n},parseOptions:{strictMode:!1,key:["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],q:{name:"queryKey",parser:/(?:^|&)([^&=]*)=?([^&]*)/g},parser:{strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/}},getParam:function(e){for(var t={},r=(e||window.location.search.substring(1)).split("&"),n=0;n<r.length;n++){var a=r[n].split("=");if("undefined"==typeof t[a[0]])t[a[0]]=a[1];else if("string"==typeof t[a[0]]){var i=[t[a[0]],a[1]];t[a[0]]=i}else t[a[0]].push(a[1])}return t},getHost:function(e){return this.parse(e).host.replace("www.","")}}},{}],5:[function(e,t,r){"use strict";t.exports={escapeRegexp:function(e){return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")},setDate:function(e,t){var r=e.getTimezoneOffset()/60,n=e.getHours(),a=t||0===t?t:-r;return e.setHours(n+r+a),e.getFullYear()+"-"+this.setLeadingZeroToInt(e.getMonth()+1,2)+"-"+this.setLeadingZeroToInt(e.getDate(),2)+" "+this.setLeadingZeroToInt(e.getHours(),2)+":"+this.setLeadingZeroToInt(e.getMinutes(),2)+":"+this.setLeadingZeroToInt(e.getSeconds(),2)},setLeadingZeroToInt:function(e,t){for(var r=e+"";r.length<t;)r="0"+r;return r},randomInt:function(e,t){return Math.floor(Math.random()*(t-e+1))+e}}},{}],6:[function(e,t,r){"use strict";var n=e("./data"),a=e("./terms"),i=e("./helpers/cookies"),s=e("./helpers/uri"),o=e("./helpers/utils"),c=e("./params"),u=e("./migrations");t.exports=function(e){var t,r,p,f,m,d,l,g,h,y,_,v,b,x=c.fetch(e),k=s.getParam(),w=x.domain.host,q=x.domain.isolate,I=x.lifetime;function j(e){switch(e){case a.traffic.utm:t=a.traffic.utm,r="undefined"!=typeof k.utm_source?k.utm_source:"undefined"!=typeof k.gclid?"google":"undefined"!=typeof k.yclid?"yandex":a.none,p="undefined"!=typeof k.utm_medium?k.utm_medium:"undefined"!=typeof k.gclid?"cpc":"undefined"!=typeof k.yclid?"cpc":a.none,f="undefined"!=typeof k.utm_campaign?k.utm_campaign:"undefined"!=typeof k[x.campaign_param]?k[x.campaign_param]:"undefined"!=typeof k.gclid?"google_cpc":"undefined"!=typeof k.yclid?"yandex_cpc":a.none,m="undefined"!=typeof k.utm_content?k.utm_content:"undefined"!=typeof k[x.content_param]?k[x.content_param]:a.none,l=k.utm_id||a.none,g=k.utm_source_platform||a.none,h=k.utm_creative_format||a.none,y=k.utm_marketing_tactic||a.none,d="undefined"!=typeof k.utm_term?k.utm_term:"undefined"!=typeof k[x.term_param]?k[x.term_param]:function(){var e=document.referrer;if(k.utm_term)return k.utm_term;if(!(e&&s.parse(e).host&&s.parse(e).host.match(/^(?:.*\.)?yandex\..{2,9}$/i)))return!1;try{return s.getParam(s.parse(document.referrer).query).text}catch(t){return!1}}()||a.none;break;case a.traffic.organic:t=a.traffic.organic,r=r||s.getHost(document.referrer),p=a.referer.organic,f=a.none,m=a.none,d=a.none,l=a.none,g=a.none,h=a.none,y=a.none;break;case a.traffic.referral:t=a.traffic.referral,r=r||s.getHost(document.referrer),p=p||a.referer.referral,f=a.none,m=s.parse(document.referrer).path,d=a.none,l=a.none,g=a.none,h=a.none,y=a.none;break;case a.traffic.typein:t=a.traffic.typein,r=x.typein_attributes.source,p=x.typein_attributes.medium,f=a.none,m=a.none,d=a.none,l=a.none,g=a.none,h=a.none,y=a.none;break;default:t=a.oops,r=a.oops,p=a.oops,f=a.oops,m=a.oops,d=a.oops,l=a.oops,g=a.oops,h=a.oops,y=a.oops}var i={type:t,source:r,medium:p,campaign:f,content:m,term:d,id:l,platform:g,format:h,tactic:y};return n.pack.main(i)}function R(e){var t=document.referrer;switch(e){case a.traffic.organic:return!!t&&H(t)&&function(e){var t=new RegExp("^(?:.*\\.)?"+o.escapeRegexp("yandex")+"\\..{2,9}$"),n=new RegExp(".*"+o.escapeRegexp("text")+"=.*"),a=new RegExp("^(?:www\\.)?"+o.escapeRegexp("google")+"\\..{2,9}$");if(s.parse(e).query&&s.parse(e).host.match(t)&&s.parse(e).query.match(n))return r="yandex",!0;if(s.parse(e).host.match(a))return r="google",!0;if(!s.parse(e).query)return!1;for(var i=0;i<x.organics.length;i++){if(s.parse(e).host.match(new RegExp("^(?:.*\\.)?"+o.escapeRegexp(x.organics[i].host)+"$","i"))&&s.parse(e).query.match(new RegExp(".*"+o.escapeRegexp(x.organics[i].param)+"=.*","i")))return r=x.organics[i].display||x.organics[i].host,!0;if(i+1===x.organics.length)return!1}}(t);case a.traffic.referral:return!!t&&H(t)&&function(e){if(!(x.referrals.length>0))return r=s.getHost(e),!0;for(var t=0;t<x.referrals.length;t++){if(s.parse(e).host.match(new RegExp("^(?:.*\\.)?"+o.escapeRegexp(x.referrals[t].host)+"$","i")))return r=x.referrals[t].display||x.referrals[t].host,p=x.referrals[t].medium||a.referer.referral,!0;if(t+1===x.referrals.length)return r=s.getHost(e),!0}}(t);default:return!1}}function H(e){if(x.domain){if(q)return s.getHost(e)!==s.getHost(w);var t=new RegExp("^(?:.*\\.)?"+o.escapeRegexp(w)+"$","i");return!s.getHost(e).match(t)}return s.getHost(e)!==s.getHost(document.location.href)}function D(){i.set(n.containers.current_extra,n.pack.extra(x.timezone_offset),I,w,q),i.get(n.containers.first_extra)||i.set(n.containers.first_extra,n.pack.extra(x.timezone_offset),I,w,q)}return i.setBase64Flag(x.base64),u.go(I,w,q),i.set(n.containers.current,function(){var e;if("undefined"!=typeof k.utm_source||"undefined"!=typeof k.utm_medium||"undefined"!=typeof k.utm_campaign||"undefined"!=typeof k.utm_content||"undefined"!=typeof k.utm_term||"undefined"!=typeof k.utm_id||"undefined"!=typeof k.utm_source_platform||"undefined"!=typeof k.utm_creative_format||"undefined"!=typeof k.utm_marketing_tactic||"undefined"!=typeof k.gclid||"undefined"!=typeof k.yclid||"undefined"!=typeof k[x.campaign_param]||"undefined"!=typeof k[x.term_param]||"undefined"!=typeof k[x.content_param])D(),e=j(a.traffic.utm);else if(R(a.traffic.organic))D(),e=j(a.traffic.organic);else if(!i.get(n.containers.session)&&R(a.traffic.referral))D(),e=j(a.traffic.referral);else{if(i.get(n.containers.first)||i.get(n.containers.current))return i.get(n.containers.current);D(),e=j(a.traffic.typein)}return e}(),I,w,q),i.get(n.containers.first)||i.set(n.containers.first,i.get(n.containers.current),I,w,q),i.get(n.containers.udata)?(_=parseInt(i.parse(n.containers.udata)[i.unsbjs(n.containers.udata)][n.aliases.udata.visits])||1,_=i.get(n.containers.session)?_:_+1,v=n.pack.user(_,x.user_ip)):(_=1,v=n.pack.user(_,x.user_ip)),i.set(n.containers.udata,v,I,w,q),i.get(n.containers.session)?(b=parseInt(i.parse(n.containers.session)[i.unsbjs(n.containers.session)][n.aliases.session.pages_seen])||1,b+=1):b=1,i.set(n.containers.session,n.pack.session(b),x.session_length,w,q),x.promocode&&!i.get(n.containers.promocode)&&i.set(n.containers.promocode,n.pack.promo(x.promocode),I,w,q),i.parse(n.containers)}},{"./data":2,"./helpers/cookies":3,"./helpers/uri":4,"./helpers/utils":5,"./migrations":7,"./params":8,"./terms":9}],7:[function(e,t,r){"use strict";var n=e("./data"),a=e("./helpers/cookies");t.exports={go:function(e,t,r){var i,s=this.migrations,o={l:e,d:t,i:r};if(a.get(n.containers.first)||a.get(n.service.migrations)){if(!a.get(n.service.migrations))for(i=0;i<s.length;i++)s[i].go(s[i].id,o)}else{var c=[];for(i=0;i<s.length;i++)c.push(s[i].id);var u="";for(i=0;i<c.length;i++)u+=c[i]+"=1",i<c.length-1&&(u+=n.delimiter);a.set(n.service.migrations,u,o.l,o.d,o.i)}},migrations:[{id:"1418474375998",version:"1.0.0-beta",go:function(e,t){var r=e+"=1",i=e+"=0",s=function(e,t,r){return t||r?e:n.delimiter};try{var o=[];for(var c in n.containers)n.containers.hasOwnProperty(c)&&o.push(n.containers[c]);for(var u=0;u<o.length;u++)if(a.get(o[u])){var p=a.get(o[u]).replace(/(\|)?\|(\|)?/g,s);a.destroy(o[u],t.d,t.i),a.destroy(o[u],t.d,!t.i),a.set(o[u],p,t.l,t.d,t.i)}a.get(n.containers.session)&&a.set(n.containers.session,n.pack.session(0),t.l,t.d,t.i),a.set(n.service.migrations,r,t.l,t.d,t.i)}catch(f){a.set(n.service.migrations,i,t.l,t.d,t.i)}}}]}},{"./data":2,"./helpers/cookies":3}],8:[function(e,t,r){"use strict";var n=e("./terms"),a=e("./helpers/uri");t.exports={fetch:function(e){var t=e||{},r={};if(r.lifetime=this.validate.checkFloat(t.lifetime)||6,r.lifetime=parseInt(30*r.lifetime*24*60),r.session_length=this.validate.checkInt(t.session_length)||30,r.timezone_offset=this.validate.checkInt(t.timezone_offset),r.base64=t.base64||!1,r.campaign_param=t.campaign_param||!1,r.term_param=t.term_param||!1,r.content_param=t.content_param||!1,r.user_ip=t.user_ip||n.none,t.promocode?(r.promocode={},r.promocode.min=parseInt(t.promocode.min)||1e5,r.promocode.max=parseInt(t.promocode.max)||999999):r.promocode=!1,t.typein_attributes&&t.typein_attributes.source&&t.typein_attributes.medium?(r.typein_attributes={},r.typein_attributes.source=t.typein_attributes.source,r.typein_attributes.medium=t.typein_attributes.medium):r.typein_attributes={source:"(direct)",medium:"(none)"},t.domain&&this.validate.isString(t.domain)?r.domain={host:t.domain,isolate:!1}:t.domain&&t.domain.host?r.domain=t.domain:r.domain={host:a.getHost(document.location.hostname),isolate:!1},r.referrals=[],t.referrals&&t.referrals.length>0)for(var i=0;i<t.referrals.length;i++)t.referrals[i].host&&r.referrals.push(t.referrals[i]);if(r.organics=[],t.organics&&t.organics.length>0)for(var s=0;s<t.organics.length;s++)t.organics[s].host&&t.organics[s].param&&r.organics.push(t.organics[s]);return r.organics.push({host:"bing.com",param:"q",display:"bing"}),r.organics.push({host:"yahoo.com",param:"p",display:"yahoo"}),r.organics.push({host:"about.com",param:"q",display:"about"}),r.organics.push({host:"aol.com",param:"q",display:"aol"}),r.organics.push({host:"ask.com",param:"q",display:"ask"}),r.organics.push({host:"globososo.com",param:"q",display:"globo"}),r.organics.push({host:"go.mail.ru",param:"q",display:"go.mail.ru"}),r.organics.push({host:"rambler.ru",param:"query",display:"rambler"}),r.organics.push({host:"tut.by",param:"query",display:"tut.by"}),r.referrals.push({host:"t.co",display:"twitter.com"}),r.referrals.push({host:"plus.url.google.com",display:"plus.google.com"}),r},validate:{checkFloat:function(e){return!(!e||!this.isNumeric(parseFloat(e)))&&parseFloat(e)},checkInt:function(e){return!(!e||!this.isNumeric(parseInt(e)))&&parseInt(e)},isNumeric:function(e){return!isNaN(e)},isString:function(e){return"[object String]"===Object.prototype.toString.call(e)}}}},{"./helpers/uri":4,"./terms":9}],9:[function(e,t,r){"use strict";t.exports={traffic:{utm:"utm",organic:"organic",referral:"referral",typein:"typein"},referer:{referral:"referral",organic:"organic",social:"social"},none:"(none)",oops:"(Houston, we have a problem)"}},{}]},{},[1])(1)});;
document.documentElement.classList.add('js');

/* ===== OP Model Lab compute core (DOM非依存) ===== */
function labParse(v,def){var n=parseFloat(v);return isNaN(n)?def:n;}
function labSeries(P,o){
  var p={}; for(var k in P)p[k]=P[k]; if(o)for(var k2 in o)p[k2]=o[k2];
  var N=Math.max(3,Math.min(10,Math.round(p.N||5)));
  var S=[p.S0],EB=[],DA=[],EBIT=[],NOP=[],CX=[],DW=[],FCF=[];
  for(var t=1;t<=N;t++){S.push(S[t-1]*(1+p.g));}
  for(t=0;t<=N;t++){EB.push(S[t]*p.m);DA.push(S[t]*p.da);EBIT.push(EB[t]-DA[t]);NOP.push(EBIT[t]*(1-p.tax));CX.push(S[t]*p.cx);}
  DW.push(0);FCF.push(0);
  for(t=1;t<=N;t++){DW.push(p.wc*(S[t]-S[t-1]));FCF.push(NOP[t]+DA[t]-CX[t]-DW[t]);}
  return {p:p,N:N,S:S,EB:EB,DA:DA,EBIT:EBIT,NOP:NOP,CX:CX,DW:DW,FCF:FCF};
}
function labRatio(P){
  var s=labSeries(P),r={};
  r.EB0=s.EB[0];r.EBIT0=s.EBIT[0];r.int0=P.debt*P.ir;
  r.PBT=r.EBIT0-r.int0;r.NI=r.PBT*(1-P.tax);
  r.ND=P.debt-P.cash;r.mcap=(P.px>0&&P.sh>0)?P.px*P.sh:NaN;r.EV=isNaN(r.mcap)?NaN:r.mcap+r.ND;
  r.ndEb=r.EB0>0?r.ND/r.EB0:NaN;r.icov=r.int0>0?r.EB0/r.int0:NaN;
  r.evEb=(!isNaN(r.EV)&&r.EB0>0)?r.EV/r.EB0:NaN;
  r.eps=P.sh>0?r.NI/P.sh:NaN;r.per=(P.px>0&&r.eps>0)?P.px/r.eps:NaN;
  r.bps=P.sh>0?P.eq0/P.sh:NaN;r.pbr=(P.px>0&&r.bps>0)?P.px/r.bps:NaN;
  r.roe=P.eq0>0?r.NI/P.eq0:NaN;var ic=P.debt+P.eq0-P.cash;r.roic=ic>0?s.NOP[0]/ic:NaN;
  r.fcf1=s.FCF[1];r.conv=s.EB[1]>0?s.FCF[1]/s.EB[1]:NaN;
  r.mE=P.m;r.mEbit=s.S[0]>0?r.EBIT0/s.S[0]:NaN;r.mNi=s.S[0]>0?r.NI/s.S[0]:NaN;
  return r;
}
function labDCF(P,o){
  var s=labSeries(P,o),p=s.p;
  if(!(p.wacc>p.tvg))return {err:"WACCは永久成長率より大きい必要があります。"};
  var pvF=0,rows=[];
  for(var t=1;t<=s.N;t++){var df=Math.pow(1+p.wacc,-t);pvF+=s.FCF[t]*df;rows.push({t:t,fcf:s.FCF[t],df:df,pv:s.FCF[t]*df});}
  var tv=s.FCF[s.N]*(1+p.tvg)/(p.wacc-p.tvg);
  var pvT=tv*Math.pow(1+p.wacc,-s.N);
  var ev=pvF+pvT,nd=p.debt-p.cash,eqv=ev-nd;
  var ps=p.sh>0?eqv/p.sh:NaN;
  return {err:null,s:s,rows:rows,pvF:pvF,tv:tv,pvT:pvT,ev:ev,nd:nd,eqv:eqv,ps:ps,tvPct:ev>0?pvT/ev:NaN};
}
function labLBO(P,o){
  var s=labSeries(P,o),p=s.p;
  var H=Math.max(1,Math.min(s.N,Math.round(p.H||5)));
  if(!(p.en>0))return {err:"入口倍率を入力してください。"};
  if(p.dx>=p.en)return {err:"デット倍率は入口倍率より小さくしてください（エクイティがゼロ以下になります）。"};
  var E0=s.EB[0],evIn=p.en*E0,dIn=p.dx*E0,eqIn=evIn-dIn;
  var nd=dIn,rows=[],warn=false;
  for(var t=1;t<=H;t++){
    var ndBeg=nd,intr=Math.max(0,ndBeg)*p.il;
    var pbt=s.EBIT[t]-intr,taxp=Math.max(0,pbt)*p.tax,ni=pbt-taxp;
    var fcf=ni+s.DA[t]-s.CX[t]-s.DW[t];
    nd=ndBeg-fcf; if(fcf<0)warn=true;
    rows.push({t:t,eb:s.EB[t],intr:intr,ni:ni,fcf:fcf,ndBeg:ndBeg,ndEnd:nd});
  }
  var ebH=s.EB[H],evOut=p.ex*ebH,eqOut=evOut-nd;
  var moic=eqIn>0?eqOut/eqIn:NaN;
  var irr=(moic>0)?Math.pow(moic,1/H)-1:NaN;
  var brGrowth=(ebH-E0)*p.en, brMult=(p.ex-p.en)*ebH, brDebt=dIn-nd;
  return {err:null,s:s,H:H,E0:E0,evIn:evIn,dIn:dIn,eqIn:eqIn,rows:rows,ndEnd:nd,ebH:ebH,evOut:evOut,eqOut:eqOut,moic:moic,irr:irr,brGrowth:brGrowth,brMult:brMult,brDebt:brDebt,warn:warn};
}
function labBisect(fn,lo,hi,target,tol,maxIt){
  tol=tol||1e-7;maxIt=maxIt||80;
  var flo=fn(lo),fhi=fn(hi);
  if(isNaN(flo)||isNaN(fhi))return null;
  var a=lo,b=hi,fa=flo-target,fb=fhi-target;
  if(fa===0)return lo; if(fb===0)return hi;
  if(fa*fb>0)return null;
  for(var i=0;i<maxIt;i++){
    var m2=(a+b)/2,fm=fn(m2)-target;
    if(isNaN(fm))return null;
    if(Math.abs(fm)<tol||(b-a)/2<tol)return m2;
    if(fa*fm<0){b=m2;fb=fm;}else{a=m2;fa=fm;}
  }
  return (a+b)/2;
}

/* ===== OP Model Lab core v2（Comps/Precedents/M&A/Pro拡張・DOM非依存） ===== */
function labStats(arr){
  var a=arr.filter(function(x){return !isNaN(x)&&x>0;}).slice().sort(function(x,y){return x-y;});
  var n=a.length;if(!n)return null;
  function q(p){var pos=(n-1)*p,lo=Math.floor(pos),hi=Math.ceil(pos);return a[lo]+(a[hi]-a[lo])*(pos-lo);}
  var mean=0;for(var i=0;i<n;i++)mean+=a[i];mean/=n;
  return {n:n,min:a[0],max:a[n-1],q1:q(0.25),med:q(0.5),q3:q(0.75),mean:mean};
}
function labMult(P,mults,ndOverride){
  var st=labStats(mults);if(!st)return {err:"倍率を1つ以上入力してください。"};
  var E0=P.S0*P.m,nd=(ndOverride===undefined||ndOverride===null)?(P.debt-P.cash):ndOverride;
  function ap(x){var ev=x*E0;return {ev:ev,eq:ev-nd,ps:P.sh>0?(ev-nd)/P.sh:NaN};}
  return {err:null,st:st,E0:E0,nd:nd,med:ap(st.med),q1:ap(st.q1),q3:ap(st.q3),mean:ap(st.mean)};
}
function labMA(P,A){
  if(!(A.sha>0&&A.pxa>0))return {err:"買い手の株式数・株価を入力してください。"};
  var eps0=A.nia/A.sha;
  var stk=A.v*A.s, cashp=A.v*(1-A.s);
  var newSh=A.sha+(A.pxa>0?stk/A.pxa:0);
  var intAT=cashp*A.i*(1-P.tax), synAT=A.syn*(1-P.tax);
  var comb=A.nia+A.nit+synAT-intAT;
  var eps1=comb/newSh, ad=eps1/eps0-1;
  var beSyn=((eps0*newSh)-A.nia-A.nit+cashp*A.i*(1-P.tax))/(1-P.tax);
  return {err:null,eps0:eps0,eps1:eps1,ad:ad,newSh:newSh,intAT:intAT,synAT:synAT,comb:comb,beSyn:beSyn,perPaid:A.nit>0?A.v/A.nit:NaN,perBuyer:eps0>0?A.pxa/eps0:NaN};
}
function labWACC(W,tax){
  var ke=W.rf+W.beta*W.erp+(W.sp||0);
  var wacc=(1-W.wd)*ke+W.wd*W.kd*(1-tax);
  return {ke:ke,wacc:wacc};
}
function labSeries2(P,o){
  var p={};for(var k in P)p[k]=P[k];if(o)for(var k2 in o)p[k2]=o[k2];
  var N=Math.max(3,Math.min(10,Math.round(p.N||5)));
  function pick(arr,scalar,t){return (arr&&arr.length>=t&&!isNaN(arr[t-1]))?arr[t-1]:scalar;}
  var S=[p.S0],EB=[],DA=[],EBIT=[],NOP=[],CX=[],W=[],DW=[],FCF=[];
  for(var t=1;t<=N;t++){S.push(S[t-1]*(1+pick(p.gArr,p.g,t)));}
  for(t=0;t<=N;t++){
    var mm=t===0?p.m:pick(p.mArr,p.m,t), dd=t===0?p.da:pick(p.daArr,p.da,t);
    EB.push(S[t]*mm);DA.push(S[t]*dd);EBIT.push(EB[t]-DA[t]);NOP.push(EBIT[t]*(1-p.tax));
  }
  for(t=0;t<=N;t++){
    var cc=t===0?p.cx:pick(p.cxArr,p.cx,t);
    var cxv=S[t]*cc;
    if(t>=1){
      if(p.cxMode==="da"){cxv=DA[t]*(p.cxDa||1);}
      else if(p.cxMode==="amt"&&p.cxAmtArr&&!isNaN(p.cxAmtArr[t-1])){cxv=p.cxAmtArr[t-1];}
    }
    CX.push(cxv);
  }
  for(t=0;t<=N;t++){
    var wv;
    var wr=t===0?p.wc:pick(p.wcArr,p.wc,t);
    if(p.wcMode==="days"){
      var cog=S[t]*(p.cogsR||0);
      wv=S[t]*(p.dso||0)/365+cog*((p.dio||0)-(p.dpo||0))/365;
    }else if(p.wcMode==="amt"&&p.wcLvlArr&&!isNaN(p.wcLvlArr[t])){
      wv=p.wcLvlArr[t];
    }else{
      wv=wr*S[t];
    }
    W.push(wv);
  }
  DW.push(0);FCF.push(0);
  for(t=1;t<=N;t++){DW.push(W[t]-W[t-1]);FCF.push(NOP[t]+DA[t]-CX[t]-DW[t]);}
  return {p:p,N:N,S:S,EB:EB,DA:DA,EBIT:EBIT,NOP:NOP,CX:CX,W:W,DW:DW,FCF:FCF};
}
function labDCF2(P,o,opt){
  opt=opt||{};
  var s=labSeries2(P,o),p=s.p;
  if(!(p.wacc>p.tvg))return {err:"WACCは永久成長率より大きい必要があります。"};
  var mid=!!opt.mid,pvF=0,rows=[];
  for(var t=1;t<=s.N;t++){var ex=mid?t-0.5:t;var df=Math.pow(1+p.wacc,-ex);pvF+=s.FCF[t]*df;rows.push({t:t,fcf:s.FCF[t],df:df,pv:s.FCF[t]*df});}
  var tv=s.FCF[s.N]*(1+p.tvg)/(p.wacc-p.tvg);
  var exT=mid?s.N-0.5:s.N;
  var pvT=tv*Math.pow(1+p.wacc,-exT);
  var nd;
  if(opt.ndx){var x=opt.ndx;nd=x.debt+(x.min||0)+(x.dl||0)-x.cash-(x.inv||0);}else{nd=p.debt-p.cash;}
  var ev=pvF+pvT,eqv=ev-nd,ps=p.sh>0?eqv/p.sh:NaN;
  return {err:null,s:s,rows:rows,pvF:pvF,tv:tv,pvT:pvT,ev:ev,nd:nd,eqv:eqv,ps:ps,tvPct:ev>0?pvT/ev:NaN,mid:mid};
}
function labLBO2(P,o,L){
  var s=labSeries2(P,o),p=s.p;
  var H=Math.max(1,Math.min(s.N,Math.round(L.H||p.H||5)));
  var E0=s.EB[0],evIn=L.en*E0;
  var A0=L.ta.x*E0,B0=L.tb.x*E0,fee=(L.fee||0)*evIn;
  var eqIn=evIn+fee-A0-B0;
  if(eqIn<=0)return {err:"エクイティがゼロ以下です。デット倍率または入口倍率を見直してください。"};
  var TA=A0,TB=B0,cash=0,rows=[],warn=false,amortAmt=(L.ta.amort||0)*A0;
  for(var t=1;t<=H;t++){
    var iA=TA*L.ta.r,iB=TB*L.tb.r;
    var pbt=s.EBIT[t]-iA-iB,tx=Math.max(0,pbt)*p.tax,ni=pbt-tx;
    var fcf=ni+s.DA[t]-s.CX[t]-s.DW[t];
    var payA=0,payB=0;
    if(fcf>=0){payA=Math.min(TA,amortAmt,fcf);var rem=fcf-payA;payB=Math.min(TB,rem*(L.tb.sweep||0));cash+=fcf-payA-payB;}
    else{warn=true;cash+=fcf;}
    TA-=payA;TB-=payB;
    rows.push({t:t,eb:s.EB[t],iA:iA,iB:iB,fcf:fcf,payA:payA,payB:payB,TA:TA,TB:TB,cash:cash,nd:TA+TB-cash});
  }
  var ebH=s.EB[H],evOut=L.ex*ebH,eqOut=evOut-TA-TB+cash;
  var moic=eqOut/eqIn,irr=moic>0?Math.pow(moic,1/H)-1:NaN;
  return {err:null,s:s,H:H,E0:E0,evIn:evIn,fee:fee,A0:A0,B0:B0,eqIn:eqIn,rows:rows,TA:TA,TB:TB,cash:cash,ebH:ebH,evOut:evOut,eqOut:eqOut,moic:moic,irr:irr,warn:warn};
}
function labPackRow(co){
  function f(px){if(!(px>0&&co.sh>0&&co.eb>0))return NaN;return (px*co.sh+co.nd)/co.eb;}
  return {prev:f(co.p_prev),m1:f(co.p_1m),m3:f(co.p_3m)};
}

/* ===== OP Model Lab UI v2（無料版・7モジュール） ===== */
function fN(n,d){if(n===null||n===undefined||isNaN(n))return "–";d=d||0;
  var neg=n<0,v=Math.abs(n);var s=v.toLocaleString("ja-JP",{minimumFractionDigits:d,maximumFractionDigits:d});
  return neg?"("+s+")":s;}
function fP(n,d){if(isNaN(n))return "–";return (n*100).toFixed(d===undefined?1:d)+"%";}
function fX(n,d){if(isNaN(n))return "–";return n.toFixed(d===undefined?2:d)+"x";}
function gv(id,def){var el=document.getElementById(id);return labParse(el?el.value:null,def);}
function gt(id){var el=document.getElementById(id);return el?(el.value||""):"";}
function readP(){return {
  S0:gv("i_S0",1000),g:gv("i_g",5)/100,m:gv("i_m",20)/100,da:gv("i_da",4)/100,cx:gv("i_cx",5)/100,
  wc:gv("i_wc",10)/100,tax:gv("i_tax",25)/100,N:gv("i_N",5),
  cash:gv("i_cash",100),debt:gv("i_debt",300),eq0:gv("i_eq0",600),ir:gv("i_ir",4)/100,
  px:gv("i_px",0),sh:gv("i_sh",100),
  wacc:gv("i_wacc",8)/100,tvg:gv("i_tvg",2)/100,
  en:gv("i_en",7),dx:gv("i_dx",4.5),il:gv("i_il",6)/100,ex:gv("i_ex",7),H:gv("i_H",5)};}
function readMult(pre){var out=[],labels=[];
  for(var i=1;i<=5;i++){var m=gv(pre+"_m"+i,NaN),l=gt(pre+"_l"+i);
    if(!isNaN(m)&&m>0){out.push(m);labels.push(l||("#"+i));}}
  return {mults:out,labels:labels};}
function readMA(P){return {nia:gv("m_nia",150),sha:gv("m_sha",100),pxa:gv("m_pxa",15),
  nit:gv("m_nit",110),v:gv("m_v",1200),s:gv("m_s",50)/100,i:gv("m_i",4)/100,syn:gv("m_syn",20)};}
var LAB_IDS=["i_S0","i_g","i_m","i_da","i_cx","i_wc","i_tax","i_N","i_cash","i_debt","i_eq0","i_ir","i_px","i_sh","i_wacc","i_tvg","i_en","i_dx","i_il","i_ex","i_H",
"c_l1","c_m1","c_l2","c_m2","c_l3","c_m3","c_l4","c_m4","c_l5","c_m5",
"q_l1","q_m1","q_l2","q_m2","q_l3","q_m3","q_l4","q_m4","q_l5","q_m5",
"m_nia","m_sha","m_pxa","m_nit","m_v","m_s","m_i","m_syn"];
var LAB_PRESET={i_S0:1000,i_g:5,i_m:20,i_da:4,i_cx:5,i_wc:10,i_tax:25,i_N:5,i_cash:100,i_debt:300,i_eq0:600,i_ir:4,i_px:12,i_sh:100,i_wacc:8,i_tvg:2,i_en:7,i_dx:4.5,i_il:6,i_ex:7,i_H:5,
c_l1:"A社",c_m1:8,c_l2:"B社",c_m2:9,c_l3:"C社",c_m3:11,c_l4:"",c_m4:"",c_l5:"",c_m5:"",
q_l1:"取引X",q_m1:9.5,q_l2:"取引Y",q_m2:10.5,q_l3:"取引Z",q_m3:12,q_l4:"",q_m4:"",q_l5:"",q_m5:"",
m_nia:150,m_sha:100,m_pxa:15,m_nit:110,m_v:1200,m_s:50,m_i:4,m_syn:20};
function heatCell(v,min,max){
  if(isNaN(v)||min===max)return "";
  var t=(v-min)/(max-min);t=Math.max(0,Math.min(1,t));
  var a=[241,245,249],b=[20,53,95];
  var r=Math.round(a[0]+(b[0]-a[0])*t),g2=Math.round(a[1]+(b[1]-a[1])*t),b2=Math.round(a[2]+(b[2]-a[2])*t);
  var col=t>0.55?"#fff":"#24292F";
  return ' style="background:rgb('+r+","+g2+","+b2+');color:'+col+'"';}
function svgBars(vals,labels,opts){
  opts=opts||{};var W=580,Hh=170,padL=8,padB=26,padT=22;
  var n=vals.length;if(!n)return "";
  var mx=Math.max.apply(null,vals.map(function(v){return isNaN(v)?0:v;})),mn=Math.min(0,Math.min.apply(null,vals));
  if(mx===mn)mx=mn+1;
  var plotH=Hh-padB-padT,zero=padT+plotH*(mx/(mx-mn));
  var bw=Math.min(64,(W-padL*2)/n*0.62),gap=(W-padL*2)/n;
  var s='<svg viewBox="0 0 '+W+' '+Hh+'" style="display:block;width:100%;height:auto" role="img" aria-label="'+(opts.label||"チャート")+'">';
  s+='<line x1="'+padL+'" y1="'+zero+'" x2="'+(W-padL)+'" y2="'+zero+'" stroke="#DFE5EC"/>';
  for(var i=0;i<n;i++){
    var v=vals[i],x=padL+gap*i+(gap-bw)/2;
    var h=Math.abs(v)/(mx-mn)*plotH,y=v>=0?zero-h:zero;
    s+='<rect x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" width="'+bw.toFixed(1)+'" height="'+Math.max(1,h).toFixed(1)+'" fill="'+(opts.color||"#14355F")+'" opacity="'+(v>=0?"1":"0.55")+'"/>';
    s+='<text x="'+(x+bw/2).toFixed(1)+'" y="'+(v>=0?(y-6):(y+h+13)).toFixed(1)+'" text-anchor="middle" font-size="10" fill="#526075" font-family="Inter,sans-serif">'+fN(v)+'</text>';
    s+='<text x="'+(x+bw/2).toFixed(1)+'" y="'+(Hh-8)+'" text-anchor="middle" font-size="10" fill="#8496AC" font-family="Inter,sans-serif">'+labels[i]+'</text>';
  }
  return s+"</svg>";}
function kpi(label,val,sub){return '<div class="lab-kpi"><p class="k-l">'+label+'</p><p class="k-v">'+val+'</p>'+(sub?'<p class="k-s">'+sub+'</p>':'')+'</div>';}
function renderRatio(P){
  var r=labRatio(P);
  var rows=[["EBITDA","EBITDAマージン",fN(r.EB0)+"（"+fP(r.mE)+"）","売上 × マージン"],
  ["EBIT","EBITマージン",fN(r.EBIT0)+"（"+fP(r.mEbit)+"）","EBITDA − D&A"],
  ["純利益（近似）","純利益率",fN(r.NI)+"（"+fP(r.mNi)+"）","(EBIT − 支払利息) × (1 − 税率)"],
  ["ネットデット","ND / EBITDA",fN(r.ND)+"（"+fX(r.ndEb)+"）","有利子負債 − 現金"],
  ["インタレスト・カバレッジ","",fX(r.icov,1),"EBITDA ÷ 支払利息"],
  ["FCF（来期・アンレバード）","FCF転換率",fN(r.fcf1)+"（"+fP(r.conv)+"）","NOPAT + D&A − Capex − ΔWC"],
  ["ROE","",fP(r.roe),"純利益 ÷ 純資産"],
  ["ROIC（近似）","",fP(r.roic),"NOPAT ÷ (有利子負債 + 純資産 − 現金)"],
  ["EV / EBITDA","",fX(r.evEb,1),"(時価総額 + ND) ÷ EBITDA ※株価入力時"],
  ["PER","",isNaN(r.per)?"–":r.per.toFixed(1)+"倍","株価 ÷ EPS"],
  ["PBR","",isNaN(r.pbr)?"–":r.pbr.toFixed(2)+"倍","株価 ÷ BPS"]];
  var h='<div class="lab-kpis">'+kpi("EBITDA",fN(r.EB0),fP(r.mE)+" マージン")+kpi("ND/EBITDA",fX(r.ndEb,1),"レバレッジ")+kpi("ROIC（近似）",fP(r.roic),"vs WACCで価値創造判定")+kpi("EV/EBITDA",fX(r.evEb,1),"株価入力時のみ")+"</div>";
  h+='<div class="lab-scroll"><table class="lab-t"><thead><tr><th>指標</th><th style="text-align:right">値</th><th>計算式</th></tr></thead><tbody>';
  for(var i=0;i<rows.length;i++){h+="<tr><td>"+rows[i][0]+(rows[i][1]?'<span class="sub">'+rows[i][1]+"</span>":"")+'</td><td style="text-align:right">'+rows[i][2]+"</td><td class=\"formula\">"+rows[i][3]+"</td></tr>";}
  h+="</tbody></table></div>";
  h+='<p class="lab-note">指標の読み方は<a href="../reference/index.html">指標リファレンス</a>、ROICとWACCの関係は<a href="../fin-003-roic/index.html">ROICと価値創造</a>へ。</p>';
  document.getElementById("out-ratio").innerHTML=h;window.__q=window.__q||{};window.__q.ratio="EBITDA "+fN(r.EB0)+"・ROIC "+fP(r.roic);}
function renderOp(P){
  var s=labSeries(P);
  var yl=[],fv=[];for(var t=1;t<=s.N;t++){yl.push("Y"+t);fv.push(s.FCF[t]);}
  var cum=0,convS=0;for(t=1;t<=s.N;t++){cum+=s.FCF[t];convS+=s.EB[t]>0?s.FCF[t]/s.EB[t]:0;}
  var h='<div class="lab-kpis">'+kpi("売上（最終年）",fN(s.S[s.N]),"CAGR "+fP(P.g,1))+kpi("EBITDA（最終年）",fN(s.EB[s.N]),fP(P.m)+" マージン")+kpi("FCF累計",fN(cum),"Y1〜Y"+s.N)+kpi("平均FCF転換率",fP(convS/s.N),"FCF ÷ EBITDA")+"</div>";
  h+='<h3 class="lab-h3">アンレバードFCFの推移</h3>'+svgBars(fv,yl,{label:"FCF推移"});
  h+='<div class="lab-scroll"><table class="lab-t"><thead><tr><th>項目</th><th style="text-align:right">Y0</th>';
  for(t=1;t<=s.N;t++)h+='<th style="text-align:right">Y'+t+"</th>";h+="</tr></thead><tbody>";
  function row(name,arr,d,strong){h+="<tr"+(strong?' class="strong"':"")+"><td>"+name+"</td>";for(var q=0;q<=s.N;q++){h+='<td style="text-align:right">'+(arr[q]===null?"–":fN(arr[q],d||0))+"</td>";}h+="</tr>";}
  row("売上高",s.S);row("EBITDA",s.EB,0,true);row("D&A",s.DA);row("EBIT",s.EBIT);row("NOPAT",s.NOP);
  row("Capex",s.CX);row("運転資本の増減",[null].concat(s.DW.slice(1)));row("FCF（アンレバード）",[null].concat(s.FCF.slice(1)),0,true);
  h+="</tbody></table></div>";
  h+='<p class="lab-note">3表への拡張は<a href="../tut-ops-3stmt-build/index.html">3表連動モデル構築</a>、前提の置き方は<a href="../mod-012-revenue-drivers/index.html">売上ドライバー設計</a>へ。</p>';
  document.getElementById("out-op").innerHTML=h;window.__q=window.__q||{};window.__q.op="FCF累計 "+fN(cum)+"（Y1–Y"+s.N+"）";}
function renderDCF(P){
  var d=labDCF(P),el=document.getElementById("out-dcf");
  if(d.err){el.innerHTML='<p class="lab-err">'+d.err+"</p>";window.__q=window.__q||{};window.__q.dcf="前提エラー";return;}
  var h='<div class="lab-kpis">'+kpi("事業価値 EV",fN(d.ev))+kpi("株式価値",fN(d.eqv),"EV − ネットデット "+fN(d.nd))+kpi("1株あたり",isNaN(d.ps)?"–":fN(d.ps,1),"株式数 "+fN(P.sh))+kpi("TV依存度",fP(d.tvPct),"PV(TV) ÷ EV")+"</div>";
  h+='<div class="lab-scroll"><table class="lab-t"><thead><tr><th>年度</th><th style="text-align:right">FCF</th><th style="text-align:right">割引係数</th><th style="text-align:right">現在価値</th></tr></thead><tbody>';
  for(var i=0;i<d.rows.length;i++){var r=d.rows[i];h+="<tr><td>Y"+r.t+'</td><td style="text-align:right">'+fN(r.fcf)+'</td><td style="text-align:right">'+r.df.toFixed(3)+'</td><td style="text-align:right">'+fN(r.pv)+"</td></tr>";}
  h+='<tr class="strong"><td>予測期間 合計</td><td></td><td></td><td style="text-align:right">'+fN(d.pvF)+"</td></tr>";
  h+='<tr><td>ターミナルバリュー（Y'+d.s.N+'末: '+fN(d.tv)+'）</td><td></td><td></td><td style="text-align:right">'+fN(d.pvT)+"</td></tr>";
  h+='<tr class="strong"><td>事業価値 EV</td><td></td><td></td><td style="text-align:right">'+fN(d.ev)+"</td></tr>";
  h+='<tr><td>− ネットデット</td><td></td><td></td><td style="text-align:right">'+fN(-d.nd)+"</td></tr>";
  h+='<tr class="strong"><td>株式価値</td><td></td><td></td><td style="text-align:right">'+fN(d.eqv)+"</td></tr></tbody></table></div>";
  h+=sensDCF(P,d);
  window.__q=window.__q||{};window.__q.dcf="株式価値 "+fN(d.eqv)+(isNaN(d.ps)?"":"｜1株 "+fN(d.ps,1));h+='<p class="lab-note">考え方は<a href="../val-002-dcf-guide/index.html">DCF完全ガイド</a>・<a href="../val-004-terminal-value/index.html">ターミナルバリュー</a>、構築は<a href="../tut-dcf-excel-build/index.html">チュートリアル</a>へ。</p>';
  el.innerHTML=h;}
function sensDCF(P,d){
  var ws=[],gs=[];for(var i=-2;i<=2;i++){ws.push(P.wacc+i*0.005);gs.push(P.tvg+i*0.0025);}
  var vals=[],min=1/0,max=-1/0;
  for(i=0;i<5;i++){vals.push([]);for(var j=0;j<5;j++){var r=labDCF(P,{wacc:ws[i],tvg:gs[j]});var v=r.err?NaN:r.eqv;vals[i].push(v);if(!isNaN(v)){if(v<min)min=v;if(v>max)max=v;}}}
  var h='<h3 class="lab-h3">感応度：株式価値（WACC × 永久成長率）</h3><div class="lab-scroll"><table class="lab-t sens"><thead><tr><th>WACC＼g</th>';
  for(j=0;j<5;j++)h+='<th style="text-align:right">'+fP(gs[j],2)+"</th>";h+="</tr></thead><tbody>";
  for(i=0;i<5;i++){h+="<tr><td>"+fP(ws[i],2)+"</td>";
    for(j=0;j<5;j++){var cls="sc"+((i===2&&j===2)?" center":"");h+='<td class="'+cls+'" data-w="'+ws[i]+'" data-g="'+gs[j]+'"'+heatCell(vals[i][j],min,max)+">"+fN(vals[i][j])+"</td>";}
    h+="</tr>";}
  return h+"</tbody></table></div><p class=\"sens-hint\">セルをクリックすると、その組み合わせを前提に反映します。</p>";}
function renderLBO(P){
  var d=labLBO(P),el=document.getElementById("out-lbo");
  if(d.err){el.innerHTML='<p class="lab-err">'+d.err+"</p>";return;}
  var h='<div class="lab-kpis">'+kpi("MOIC",fX(d.moic),"投資 "+fN(d.eqIn)+" → 回収 "+fN(d.eqOut))+kpi("IRR（年率）",fP(d.irr),d.H+"年保有・中間分配なし")+kpi("入口",fX(P.en,1)+" / D "+fX(P.dx,1),"EV "+fN(d.evIn)+"・Equity "+fN(d.eqIn))+kpi("出口",fX(P.ex,1),"EV "+fN(d.evOut)+"・残ND "+fN(d.ndEnd))+"</div>";
  if(d.warn)h+='<p class="lab-err soft">一部年度でFCFがマイナスです（不足分はネットデット増として処理）。前提をご確認ください。</p>';
  h+='<div class="lab-scroll"><table class="lab-t"><thead><tr><th>S&U</th><th style="text-align:right">金額</th><th style="text-align:right">×EBITDA</th></tr></thead><tbody>';
  h+='<tr><td>買収EV（Uses）</td><td style="text-align:right">'+fN(d.evIn)+'</td><td style="text-align:right">'+fX(P.en,1)+"</td></tr>";
  h+='<tr><td>デット（Sources）</td><td style="text-align:right">'+fN(d.dIn)+'</td><td style="text-align:right">'+fX(P.dx,1)+"</td></tr>";
  h+='<tr class="strong"><td>エクイティ（Sources）</td><td style="text-align:right">'+fN(d.eqIn)+'</td><td style="text-align:right">'+fX(P.en-P.dx,1)+"</td></tr></tbody></table></div>";
  var yl=["Y0"],nds=[d.dIn];for(var i2=0;i2<d.rows.length;i2++){yl.push("Y"+d.rows[i2].t);nds.push(d.rows[i2].ndEnd);}
  h+='<h3 class="lab-h3">ネットデットの推移（スイープ100%の簡易前提）</h3>'+svgBars(nds,yl,{label:"ネットデット推移",color:"#3C6EA5"});
  h+='<div class="lab-scroll"><table class="lab-t"><thead><tr><th>年度</th><th style="text-align:right">EBITDA</th><th style="text-align:right">支払利息</th><th style="text-align:right">レバードFCF</th><th style="text-align:right">期末ND</th></tr></thead><tbody>';
  for(i2=0;i2<d.rows.length;i2++){var r=d.rows[i2];h+="<tr><td>Y"+r.t+'</td><td style="text-align:right">'+fN(r.eb)+'</td><td style="text-align:right">'+fN(r.intr)+'</td><td style="text-align:right">'+fN(r.fcf)+'</td><td style="text-align:right">'+fN(r.ndEnd)+"</td></tr>";}
  h+="</tbody></table></div>";
  h+='<h3 class="lab-h3">リターンの3源泉分解</h3><div class="lab-scroll"><table class="lab-t"><tbody>';
  h+='<tr><td>EBITDA成長効果</td><td style="text-align:right">'+fN(d.brGrowth)+"</td></tr>";
  h+='<tr><td>マルチプル効果</td><td style="text-align:right">'+fN(d.brMult)+"</td></tr>";
  h+='<tr><td>デット返済効果</td><td style="text-align:right">'+fN(d.brDebt)+"</td></tr>";
  h+='<tr class="strong"><td>エクイティ増加額 合計</td><td style="text-align:right">'+fN(d.eqOut-d.eqIn)+"</td></tr></tbody></table></div>";
  h+=sensLBO(P);
  window.__q=window.__q||{};window.__q.lbo="IRR "+fP(d.irr)+"｜MOIC "+fX(d.moic);h+='<p class="lab-note">仕組みは<a href="../pe-001-lbo-basics/index.html">LBO完全ガイド</a>・<a href="../pe-005-irr-moic/index.html">IRRとMOIC</a>、構築は<a href="../tut-lbo-excel-build/index.html">チュートリアル</a>へ。</p>';
  el.innerHTML=h;}
function sensLBO(P){
  var ens=[],exs=[];for(var i=-2;i<=2;i++){ens.push(P.en+i*0.5);exs.push(P.ex+i*0.5);}
  var vals=[],min=1/0,max=-1/0;
  for(i=0;i<5;i++){vals.push([]);for(var j=0;j<5;j++){
    var v=NaN;if(ens[i]>P.dx){var r=labLBO(P,{en:ens[i],ex:exs[j]});if(!r.err)v=r.irr;}
    vals[i].push(v);if(!isNaN(v)){if(v<min)min=v;if(v>max)max=v;}}}
  var h='<h3 class="lab-h3">感応度：IRR（入口倍率 × 出口倍率）</h3><div class="lab-scroll"><table class="lab-t sens"><thead><tr><th>入口＼出口</th>';
  for(j=0;j<5;j++)h+='<th style="text-align:right">'+fX(exs[j],1)+"</th>";h+="</tr></thead><tbody>";
  for(i=0;i<5;i++){h+="<tr><td>"+fX(ens[i],1)+"</td>";
    for(j=0;j<5;j++){var cls="sc2"+((i===2&&j===2)?" center":"");h+='<td class="'+cls+'" data-en="'+ens[i]+'" data-ex="'+exs[j]+'"'+heatCell(vals[i][j],min,max)+">"+fP(vals[i][j])+"</td>";}
    h+="</tr>";}
  return h+"</tbody></table></div><p class=\"sens-hint\">セルをクリックすると、その組み合わせを前提に反映します。</p>";}
function renderMultMod(P,pre,outId,titles){
  var rm=readMult(pre),el=document.getElementById(outId);
  var d=labMult(P,rm.mults);
  if(d.err){el.innerHTML='<p class="lab-err">'+d.err+"</p>";return;}
  var h='<div class="lab-kpis">'+kpi("中央値",fX(d.st.med,1),titles.kind+" n="+d.st.n)+kpi("株式価値（中央値）",fN(d.med.eq),"EV "+fN(d.med.ev)+" − ND "+fN(d.nd))+kpi("レンジ（Q1–Q3）",fN(d.q1.eq)+"〜"+fN(d.q3.eq),"四分位ベース")+kpi("1株あたり（中央値）",isNaN(d.med.ps)?"–":fN(d.med.ps,1),"株式数 "+fN(P.sh))+"</div>";
  h+='<div class="lab-scroll"><table class="lab-t"><thead><tr><th>'+titles.rowH+'</th><th style="text-align:right">EV/EBITDA</th></tr></thead><tbody>';
  for(var i=0;i<rm.mults.length;i++){h+="<tr><td>"+rm.labels[i]+'</td><td style="text-align:right">'+fX(rm.mults[i],1)+"</td></tr>";}
  h+='<tr class="strong"><td>第1四分位（25%）</td><td style="text-align:right">'+fX(d.st.q1,2)+"</td></tr>";
  h+='<tr class="strong"><td>中央値</td><td style="text-align:right">'+fX(d.st.med,2)+"</td></tr>";
  h+='<tr class="strong"><td>第3四分位（75%）</td><td style="text-align:right">'+fX(d.st.q3,2)+"</td></tr>";
  h+='<tr><td>平均</td><td style="text-align:right">'+fX(d.st.mean,2)+"</td></tr></tbody></table></div>";
  h+='<h3 class="lab-h3">対象への適用（EBITDA '+fN(d.E0)+"）</h3>";
  h+='<div class="lab-scroll"><table class="lab-t"><thead><tr><th>適用</th><th style="text-align:right">EV</th><th style="text-align:right">株式価値</th><th style="text-align:right">1株あたり</th></tr></thead><tbody>';
  function ap(name,o){h+="<tr><td>"+name+'</td><td style="text-align:right">'+fN(o.ev)+'</td><td style="text-align:right">'+fN(o.eq)+'</td><td style="text-align:right">'+(isNaN(o.ps)?"–":fN(o.ps,1))+"</td></tr>";}
  ap("Q1（"+fX(d.st.q1,2)+"）",d.q1);ap("中央値（"+fX(d.st.med,2)+"）",d.med);ap("Q3（"+fX(d.st.q3,2)+"）",d.q3);
  h+="</tbody></table></div>";
  h+='<p class="lab-note">'+titles.note+"</p>";
  el.innerHTML=h;window.__q=window.__q||{};window.__q[pre==="c"?"comps":"prec"]="中央値 "+fX(d.st.med,2)+"→株式価値 "+fN(d.med.eq);}
function renderMA(P){
  var A=readMA(P),el=document.getElementById("out-ma");
  var d=labMA(P,A);
  if(d.err){el.innerHTML='<p class="lab-err">'+d.err+"</p>";return;}
  var h='<div class="lab-kpis">'+kpi("EPS（買収前）",fN(d.eps0,2),"買い手PER "+(isNaN(d.perBuyer)?"–":d.perBuyer.toFixed(1)+"倍"))+kpi("EPS（買収後）",fN(d.eps1,2),"新株式数 "+fN(d.newSh,1))+kpi("EPS影響（A/D）",fP(d.ad),d.ad>=0?"Accretive（増加）":"Dilutive（希薄化）")+kpi("中立に必要なシナジー",fN(d.beSyn),"税前・ブレークイーブン")+"</div>";
  h+='<div class="lab-scroll"><table class="lab-t"><thead><tr><th>項目</th><th style="text-align:right">金額</th></tr></thead><tbody>';
  h+='<tr><td>買い手 純利益</td><td style="text-align:right">'+fN(A.nia)+"</td></tr>";
  h+='<tr><td>対象 純利益（取得PER '+(isNaN(d.perPaid)?"–":d.perPaid.toFixed(1)+"倍")+'）</td><td style="text-align:right">'+fN(A.nit)+"</td></tr>";
  h+='<tr><td>＋シナジー（税後）</td><td style="text-align:right">'+fN(d.synAT)+"</td></tr>";
  h+='<tr><td>−現金対価の調達利息（税後）</td><td style="text-align:right">'+fN(-d.intAT)+"</td></tr>";
  h+='<tr class="strong"><td>合算純利益</td><td style="text-align:right">'+fN(d.comb)+"</td></tr></tbody></table></div>";
  h+='<p class="lab-note">全株式対価なら「買い手PERが取得PERを上回ればAccretive」の早見が使えます（'+(isNaN(d.perBuyer)||isNaN(d.perPaid)?"—":(d.perBuyer.toFixed(1)+"倍 vs "+d.perPaid.toFixed(1)+"倍"))+'）。仕組みは<a href="../ma-003-merger-model/index.html">A/D分析</a>、EPSと価値の違いは<a href="../ma-006-synergy-valuation/index.html">シナジーの定量化</a>へ。本モデルはのれん・PPA償却・取引費用を含みません。</p>';
  el.innerHTML=h;window.__q=window.__q||{};window.__q.ma="A/D "+fP(d.ad)+"｜中立syn "+fN(d.beSyn);}
function runGoalDcf(){
  var P=readP(),tsel=gt("gsD_t"),val=labParse(gt("gsD_v"),NaN),vsel=gt("gsD_x"),out=document.getElementById("gsD_out");
  if(isNaN(val)){out.textContent="目標値を入力してください。";return;}
  function f(key,x){var o={};o[key]=x;var d=labDCF(P,o);if(d.err)return NaN;return tsel==="ps"?d.ps:(tsel==="ev"?d.ev:d.eqv);}
  var cfg={wacc:{id:"i_wacc",mul:100,lo:Math.max(0.005,P.tvg+0.001),hi:0.40,f:function(x){return fP(x,2);},n:"WACC"},
           tvg:{id:"i_tvg",mul:100,lo:-0.10,hi:P.wacc-0.001,f:function(x){return fP(x,2);},n:"永久成長率"},
           g:{id:"i_g",mul:100,lo:-0.30,hi:0.60,f:function(x){return fP(x,1);},n:"売上成長率"},
           m:{id:"i_m",mul:100,lo:0.005,hi:0.80,f:function(x){return fP(x,1);},n:"EBITDAマージン"},
           cx:{id:"i_cx",mul:100,lo:0,hi:0.60,f:function(x){return fP(x,1);},n:"Capex率"}}[vsel];
  var ans=labBisect(function(x){return f(vsel,x);},cfg.lo,cfg.hi,val);
  out.innerHTML=(ans===null)?"探索範囲内に解がありません。目標値・前提を見直してください。":
    "目標を満たす<b>"+cfg.n+" ＝ "+cfg.f(ans)+"</b>（他は現在値のまま／二分法）。感応度表で近傍の安定性も確認を。"+gsBtn(cfg,ans);}
function runGoalLbo(){
  var P=readP(),tsel=gt("gsL_t"),val=labParse(gt("gsL_v"),NaN),vsel=gt("gsL_x"),out=document.getElementById("gsL_out");
  if(isNaN(val)){out.textContent="目標値を入力してください。";return;}
  var target=tsel==="irr"?val/100:val;
  function f(key,x){var o={};o[key]=x;var d=labLBO(P,o);if(d.err)return NaN;return tsel==="irr"?d.irr:d.moic;}
  var cfg={en:{id:"i_en",mul:1,lo:P.dx+0.05,hi:30,f:function(x){return fX(x,2);},n:"入口倍率（支払上限の目安）"},
           ex:{id:"i_ex",mul:1,lo:0.2,hi:30,f:function(x){return fX(x,2);},n:"出口倍率"},
           g:{id:"i_g",mul:100,lo:-0.30,hi:0.60,f:function(x){return fP(x,1);},n:"売上成長率"},
           dx:{id:"i_dx",mul:1,lo:0,hi:P.en-0.05,f:function(x){return fX(x,2);},n:"デット倍率"},
           il:{id:"i_il",mul:100,lo:0,hi:0.30,f:function(x){return fP(x,2);},n:"デット金利"}}[vsel];
  var ans=labBisect(function(x){return f(vsel,x);},cfg.lo,cfg.hi,target);
  out.innerHTML=(ans===null)?"探索範囲内に解がありません。目標値・前提を見直してください。":
    "目標を満たす<b>"+cfg.n+" ＝ "+cfg.f(ans)+"</b>（他は現在値のまま／二分法）。感応度表で近傍の安定性も確認を。"+gsBtn(cfg,ans);}
function runGoalMult(pre,tId,vId,outId){
  var P=readP(),tsel=gt(tId),val=labParse(gt(vId),NaN),out=document.getElementById(outId);
  if(isNaN(val)){out.textContent="目標値を入力してください。";return;}
  var E0=P.S0*P.m,nd=P.debt-P.cash;
  var needEV=tsel==="ps"?(val*P.sh+nd):(val+nd);
  if(E0<=0){out.textContent="EBITDAが0以下です。";return;}
  var mult=needEV/E0;
  var rm=readMult(pre),st=labStats(rm.mults);
  var cmp=st?("中央値 "+fX(st.med,2)+" に対し "+(mult>=st.med?"+":"")+fX(mult-st.med,2)+"の乖離。この差を説明できるか（成長・質・プレミアム）が論点です。"):"";
  out.innerHTML="必要な適用倍率 ＝ <b>"+fX(mult,2)+"</b>（EBITDA "+fN(E0)+"・ND "+fN(nd)+"）。"+cmp;}
function runGoalMA(){
  var P=readP(),A=readMA(P),val=labParse(gt("gsM_v"),NaN),vsel=gt("gsM_x"),out=document.getElementById("gsM_out");
  if(isNaN(val)){out.textContent="目標A/D（%）を入力してください。0＝中立です。";return;}
  var adT=val/100;
  if(vsel==="syn"){
    var epsT=(A.nia/A.sha)*(1+adT);
    var stk=A.v*A.s,cashp=A.v*(1-A.s),newSh=A.sha+stk/A.pxa;
    var syn=((epsT*newSh)-A.nia-A.nit+cashp*A.i*(1-P.tax))/(1-P.tax);
    out.innerHTML="必要シナジー（税前）＝ <b>"+fN(syn)+"</b>／年。"+gsBtn({id:"m_syn",mul:1},syn)+"実現可能性は<a href=\"/ma-006-synergy-valuation/\">定量化の作法</a>で検証を。";return;}
  function f(key,x){var B={};for(var k in A)B[k]=A[k];B[key]=x;var d=labMA(P,B);return d.err?NaN:d.ad;}
  var cfg={v:{id:"m_v",mul:1,lo:1,hi:Math.max(A.v*10,A.nia*50),f:function(x){return fN(x);},n:"対価の上限（株式価値）"},
           s:{id:"m_s",mul:100,lo:0,hi:1,f:function(x){return fP(x,0);},n:"株式対価比率"}}[vsel];
  var ans=labBisect(function(x){return f(vsel,x);},cfg.lo,cfg.hi,adT);
  out.innerHTML=(ans===null)?"探索範囲内に解がありません（符号が変わらない構造の可能性）。":
    "目標を満たす<b>"+cfg.n+" ＝ "+cfg.f(ans)+"</b>（他は現在値のまま）。"+gsBtn(cfg,ans);}
function labRecalc(){
  var P=readP();
  try{renderRatio(P);}catch(e){}
  try{renderOp(P);}catch(e){}
  try{renderDCF(P);}catch(e){}
  try{renderLBO(P);}catch(e){}
  try{renderMultMod(P,"c","out-comps",{kind:"類似会社",rowH:"類似会社",note:'作法は<a href="../val-005-comps/index.html">Comps完全ガイド</a>と<a href="../tut-comps-comps-build/index.html">構築チュートリアル</a>、倍率の選び方は<a href="../val-008-multiple-selection/index.html">こちら</a>へ。'});}catch(e){}
  try{renderMultMod(P,"q","out-prec",{kind:"類似取引",rowH:"参照取引",note:'支配権プレミアム込みの水準です。理屈は<a href="../val-013-control-premium/index.html">コントロールプレミアム</a>、プロセスは<a href="../ma-001-ma-process/index.html">M&Aプロセス</a>へ。'});}catch(e){}
  try{renderMA(P);}catch(e){}
  try{localStorage.setItem("opLab2",JSON.stringify(collect()));}catch(e){}}
function collect(){var o={};LAB_IDS.forEach(function(id){var el=document.getElementById(id);if(el)o[id]=el.value;});return o;}
function applyVals(o){LAB_IDS.forEach(function(id){var el=document.getElementById(id);if(el&&o[id]!==undefined)el.value=o[id];});}
var CARD_MAP={dcf:"card-dcf",lbo:"card-lbo",comps:"card-comps",prec:"card-prec",ma:"card-ma"};
function switchTab(mod){
  document.querySelectorAll(".lab-tab").forEach(function(b){b.classList.toggle("on",b.getAttribute("data-mod")===mod);});
  document.querySelectorAll(".lab-mod").forEach(function(s){s.style.display=(s.id==="mod-"+mod)?"":"none";});
  for(var k in CARD_MAP){var el=document.getElementById(CARD_MAP[k]);if(el)el.style.display=(k===mod)?"":"none";}}
window.LAB_RECALC=labRecalc;window.LAB_TABKEY="opLabTab2";
window.LAB_SLIDERS={i_g:[-10,30,0.5],i_m:[0,60,0.5],i_da:[0,20,0.5],i_cx:[0,30,0.5],i_wc:[0,40,0.5],i_tax:[0,55,1],i_wacc:[3,20,0.25],i_tvg:[-2,6,0.25],i_en:[1,15,0.25],i_dx:[0,10,0.25],i_il:[0,15,0.25],i_ex:[1,15,0.25],i_H:[1,10,1]};
window.LAB_ENTER=[["gsD_v","btnGsD"],["gsL_v","btnGsL"],["gsC_v","btnGsC"],["gsQ_v","btnGsQ"],["gsM_v","btnGsM"]];
window.LAB_SENSMAP={sc:{a:["i_wacc",100,"data-w"],b:["i_tvg",100,"data-g"]},sc2:{a:["i_en",1,"data-en"],b:["i_ex",1,"data-ex"]}};
function labInit(){
  var saved=null;try{saved=JSON.parse(localStorage.getItem("opLab2")||"null");}catch(e){}
  applyVals(saved||LAB_PRESET);
  LAB_IDS.forEach(function(id){var el=document.getElementById(id);if(el)el.addEventListener("input",labRecalc);});
  document.querySelectorAll(".lab-tab").forEach(function(b){b.addEventListener("click",function(){switchTab(b.getAttribute("data-mod"));});});
  document.getElementById("btnPreset").addEventListener("click",function(){applyVals(LAB_PRESET);labRecalc();});
  document.getElementById("btnGsD").addEventListener("click",runGoalDcf);
  document.getElementById("btnGsL").addEventListener("click",runGoalLbo);
  document.getElementById("btnGsC").addEventListener("click",function(){runGoalMult("c","gsC_t","gsC_v","gsC_out");});
  document.getElementById("btnGsQ").addEventListener("click",function(){runGoalMult("q","gsQ_t","gsQ_v","gsQ_out");});
  document.getElementById("btnGsM").addEventListener("click",runGoalMA);
  var tb=null;try{tb=localStorage.getItem(window.LAB_TABKEY);}catch(e){}
  if(location.hash&&document.getElementById("mod-"+location.hash.slice(1)))tb=location.hash.slice(1);
  switchTab(tb&&document.getElementById("mod-"+tb)?tb:"dcf");labRecalc();}
if(typeof document!=="undefined"){if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",labInit);}else{labInit();}}

/* ===== OP Model Lab 共通UX層 v2 ===== */
(function(){
 function $(id){return document.getElementById(id);}
 window.gsBtn=function(cfg,ans){return (cfg&&cfg.id)?(' <button type="button" class="gs-ap" data-id="'+cfg.id+'" data-val="'+(ans*(cfg.mul||1)).toFixed(4)+'">↳ 入力に反映</button>'):"";};
 var css='.gs-ap{margin-left:8px;font-size:.72rem;font-weight:700;padding:5px 10px;border:1px solid var(--navy);background:#fff;color:var(--navy);cursor:pointer}.gs-ap:hover{background:var(--navy);color:#fff}.gs-ap:disabled{opacity:.6;cursor:default}'
 +'.lab-slider{width:100%;margin:0 0 6px;accent-color:#14355F;height:20px;grid-column:1 / -1}'
 +'.lab-card h2{display:flex;align-items:center;justify-content:space-between;gap:8px}'
 +'td.sc,td.sc2{cursor:pointer}td.sc:hover,td.sc2:hover{outline:2px solid #1D4E8A;outline-offset:-2px}'
 +'.sens-hint{font-size:.7rem;color:#8496AC;margin:4px 0 0}'
 +'#quickbar{display:none}'
 +'@media (max-width:960px){#quickbar{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:96;background:rgba(255,255,255,.97);backdrop-filter:blur(8px);border-top:1px solid #DFE5EC;padding:8px 12px calc(8px + env(safe-area-inset-bottom));align-items:center;gap:8px}'
 +'#quickbar .qv{flex:1;font-size:.78rem;font-weight:700;color:#14355F;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
 +'#quickbar button{font-size:.7rem;font-weight:700;padding:8px 10px;border:1px solid #DFE5EC;background:#F1F5F9;color:#14355F;white-space:nowrap;cursor:pointer}'
 +'body{padding-bottom:62px}'
 +'.lab-card.clps:not(.open)>*:not(h2){display:none!important}'
 +'.lab-card.clps h2{cursor:pointer}'
 +'.lab-card.clps h2::after{content:"▾";font-size:.7rem;color:#8496AC;transition:transform .2s;margin-left:6px}'
 +'.lab-card.clps:not(.open) h2::after{transform:rotate(-90deg)}}'
 +'.stp-wrap{position:relative;display:block}'
 +'.stp-wrap input{padding-right:24px !important}'
 +'.stp-wrap input::-webkit-outer-spin-button,.stp-wrap input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}'
 +'.stp-wrap input[type=number]{-moz-appearance:textfield}'
 +'.stp{position:absolute;right:3px;width:18px;height:calc(50% - 4px);display:flex;align-items:center;justify-content:center;font-size:7px;line-height:1;color:#5B6B82;background:#F1F5F9;border:1px solid #DFE5EC;cursor:pointer;padding:0;user-select:none}'
 +'.stp.up{top:3px;border-radius:2px 2px 0 0}'
 +'.stp.dn{bottom:3px;border-radius:0 0 2px 2px}'
 +'.stp:hover{background:var(--navy);color:#fff;border-color:var(--navy)}'
 +'.stp:active{background:var(--navy-2)}';
 var st=document.createElement('style');st.id="op-lab-ux2";st.textContent=css;document.head.appendChild(st);
 document.addEventListener('wheel',function(e){var t=e.target;
  if(t&&t.tagName==='INPUT'&&t.type==='number'&&document.activeElement===t){t.blur();}},{passive:true});
 var S=window.LAB_SLIDERS||{};
 Object.keys(S).forEach(function(id){var el=$(id);if(!el)return;var cfg=S[id];
  var r=document.createElement('input');r.type='range';r.min=cfg[0];r.max=cfg[1];r.step=cfg[2];
  r.value=el.value===''?cfg[0]:el.value;r.className='lab-slider';
  r.setAttribute('aria-label',(el.previousElementSibling?el.previousElementSibling.textContent:id)+' スライダー');
  el.parentNode.appendChild(r);
  r.addEventListener('input',function(){el.value=r.value;el.dispatchEvent(new Event('input',{bubbles:true}));});
  el.addEventListener('input',function(){if(el.value!=='')r.value=el.value;});});
 (window.LAB_ENTER||[]).forEach(function(p){var i=$(p[0]),b=$(p[1]);
  if(i&&b)i.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();b.click();}});});
 document.addEventListener('click',function(e){var t=e.target;
  if(t.classList&&t.classList.contains('gs-ap')){var el=$(t.getAttribute('data-id'));
   if(el){el.value=parseFloat(t.getAttribute('data-val'));el.dispatchEvent(new Event('input',{bubbles:true}));
    t.textContent='✓ 反映しました';t.disabled=true;}return;}
  var td=t.closest?t.closest('td.sc,td.sc2'):null;
  if(td&&window.LAB_SENSMAP){var m=window.LAB_SENSMAP[td.classList.contains('sc2')?'sc2':'sc'];
   var va=td.getAttribute(m.a[2]),vb=td.getAttribute(m.b[2]);
   if(va!==null&&vb!==null){var ea=$(m.a[0]),eb=$(m.b[0]);
    if(eb){eb.value=(parseFloat(vb)*m.b[1]).toFixed(2);}
    if(ea){ea.value=(parseFloat(va)*m.a[1]).toFixed(2);ea.dispatchEvent(new Event('input',{bubbles:true}));}
    else if(eb){eb.dispatchEvent(new Event('input',{bubbles:true}));}}}
 });

 /* ---- 微調整ステッパー（クリック=細かい刻み／Shift=粗い刻み／長押し=連続） ---- */
 var INT_IDS={i_N:1,i_H:1,mc_seed:1,mc_n:1};
 function fineStep(el){
  if(INT_IDS[el.id])return 1;
  var u=null,lab=el.closest?el.closest(".lab-f,.mc-r,.lab-r"):null;
  if(lab){var us=lab.querySelector(".u");u=us?us.textContent:null;
   if(!u){var lb=lab.querySelector("label");u=lb?lb.textContent:null;}}
  if(u){if(u.indexOf("百万")>-1)return 1;if(u.indexOf("%")>-1||u.indexOf("x")>-1)return 0.01;}
  var st=parseFloat(el.getAttribute("step"));
  if(!isNaN(st)&&st>=10)return 1;
  return 0.01;}
 function decimals(x){var s=String(x);var i=s.indexOf(".");return i<0?0:(s.length-i-1);}
 function stpApply(el,dir,coarse){
  var fine=fineStep(el);
  var big=parseFloat(el.getAttribute("data-coarse"))||Math.max(fine,parseFloat(el.getAttribute("step"))||fine);
  var step=coarse?Math.max(big,fine):fine;
  var v=parseFloat(el.value);if(isNaN(v))v=0;
  var nv=v+dir*step;
  var mn=parseFloat(el.getAttribute("min")),mx=parseFloat(el.getAttribute("max"));
  if(!isNaN(mn)&&nv<mn)nv=mn;if(!isNaN(mx)&&nv>mx)nv=mx;
  var d=Math.max(decimals(fine),coarse?decimals(step):0);
  el.value=nv.toFixed(Math.min(4,d));
  el.dispatchEvent(new Event("input",{bubbles:true}));}
 function addStepper(el){
  if(el.type!=="number"||el.closest(".stp-wrap"))return;
  var coarse=el.getAttribute("step");if(coarse)el.setAttribute("data-coarse",coarse);
  var fine=fineStep(el);el.setAttribute("step",String(fine));
  var w=document.createElement("span");w.className="stp-wrap";
  el.parentNode.insertBefore(w,el);w.appendChild(el);
  [["up",1,"▲"],["dn",-1,"▼"]].forEach(function(cfgB){
   var b=document.createElement("button");b.type="button";b.className="stp "+cfgB[0];b.textContent=cfgB[2];
   b.setAttribute("aria-label",(cfgB[1]>0?"増やす":"減らす")+"（刻み"+fine+"／Shiftで大きく）");
   b.title="クリック: ±"+fine+"　Shift+クリック: 粗い刻み　長押し: 連続";
   var tm=null,iv=null;
   function fire(e){stpApply(el,cfgB[1],e&&e.shiftKey);}
   b.addEventListener("click",function(e){e.preventDefault();fire(e);});
   b.addEventListener("mousedown",function(e){
    tm=setTimeout(function(){iv=setInterval(function(){fire(e);},70);},420);});
   ["mouseup","mouseleave","blur"].forEach(function(ev){b.addEventListener(ev,function(){clearTimeout(tm);clearInterval(iv);});});
   b.addEventListener("touchstart",function(e){tm=setTimeout(function(){iv=setInterval(function(){fire(e);},70);},420);},{passive:true});
   ["touchend","touchcancel"].forEach(function(ev){b.addEventListener(ev,function(){clearTimeout(tm);clearInterval(iv);});});
   w.appendChild(b);});}
 document.querySelectorAll(".lab-card input[type=number], .lab-gs input[type=number]").forEach(addStepper);
 document.querySelectorAll(".dynBody").forEach(function(host){
  if(window.MutationObserver){new MutationObserver(function(){
    host.querySelectorAll("input[type=number]").forEach(addStepper);}).observe(host,{childList:true,subtree:true});}
  host.querySelectorAll("input[type=number]").forEach(addStepper);});
 var qb=document.createElement('div');qb.id='quickbar';
 qb.innerHTML='<span class="qv" id="qbVal">—</span><button type="button" id="qbIn">入力へ</button><button type="button" id="qbOut">結果へ</button>';
 document.body.appendChild(qb);
 function activeMod(){var b=document.querySelector('.lab-tab.on');return b?b.getAttribute('data-mod'):null;}
 function updateQ(){var q=(window.__q||{})[activeMod()];var el=$('qbVal');if(el)el.textContent=q||'—';}
 document.addEventListener('input',function(){setTimeout(updateQ,0);});
 var isM=window.matchMedia('(max-width:960px)').matches;
 function openCardFor(mod){if(!isM)return;var map=window.CARD_MAP||{};
  document.querySelectorAll('.lab-inputs .lab-card.clps').forEach(function(c){c.classList.remove('open');});
  var first=document.querySelector('.lab-inputs .lab-card');if(first)first.classList.add('open');
  var id=map[mod];if(id&&$(id))$(id).classList.add('open');}
 document.addEventListener('click',function(e){var t=e.target;
  if(t.classList&&t.classList.contains('lab-tab')){var mod=t.getAttribute('data-mod');
   try{localStorage.setItem(window.LAB_TABKEY||'opLabTab',mod);}catch(err){}
   setTimeout(function(){updateQ();openCardFor(mod);},0);}});
 var bIn=$('qbIn'),bOut=$('qbOut');
 if(bIn)bIn.addEventListener('click',function(){var el=document.querySelector('.lab-inputs');if(el)el.scrollIntoView({behavior:'smooth'});});
 if(bOut)bOut.addEventListener('click',function(){var el=document.querySelector('.lab-tabs');if(el)el.scrollIntoView({behavior:'smooth'});});
 if(isM){document.querySelectorAll('.lab-inputs .lab-card').forEach(function(c,i){
   c.classList.add('clps');if(i===0)c.classList.add('open');
   var h=c.querySelector('h2');if(h)h.addEventListener('click',function(ev){if(ev.target.tagName==='INPUT')return;c.classList.toggle('open');});});
  openCardFor(activeMod());}
 var h2f=document.querySelector('.lab-inputs .lab-card h2');
 if(h2f){var sv=document.createElement('span');
  sv.style.cssText='font-size:.62rem;color:#8496AC;font-weight:600;opacity:0;transition:opacity .3s;white-space:nowrap';
  sv.textContent='自動保存 ✓';h2f.appendChild(sv);var tm=null;
  document.addEventListener('input',function(e){
   if(e.target.closest&&e.target.closest('.lab-inputs')){sv.style.opacity='1';clearTimeout(tm);tm=setTimeout(function(){sv.style.opacity='0';},1200);}});}
 setTimeout(updateQ,80);
})();

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
;
