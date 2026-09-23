/* OTEMACHI PREP LP — 元index.htmlの全<script>を順序保存で統合（Vanilla JS） */
/* ---- inline block ---- */
document.documentElement.classList.add('js');

/* ---- inline block ---- */
(function(){
  'use strict';
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var header=document.getElementById('siteHeader');
  window.addEventListener('scroll',function(){
    header.classList.toggle('scrolled',window.scrollY>10);
  },{passive:true});

  var btn=document.querySelector('.menu-toggle');
  var nav=document.getElementById('gnav');
  if(btn&&nav){
    btn.addEventListener('click',function(){
      var open=nav.classList.toggle('open');
      btn.setAttribute('aria-expanded',open?'true':'false');
    });
  }

  var hm=document.getElementById('heroMedia');
  if(hm){
    var im=hm.querySelector('img');
    var done=function(){requestAnimationFrame(function(){hm.classList.add('loaded');});};
    if(im.complete){done();}else{im.addEventListener('load',done);im.addEventListener('error',done);}
  }

  var targets=document.querySelectorAll('[data-reveal]');
  if('IntersectionObserver' in window && !reduced){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target);}
      });
    },{threshold:.15,rootMargin:'0px 0px -40px'});
    targets.forEach(function(t){io.observe(t);});
  }else{
    targets.forEach(function(t){t.classList.add('is-in');});
  }

  function animateCount(el){
    var to=parseInt(el.getAttribute('data-count-to'),10)||0;
    var from=parseInt(el.getAttribute('data-count-from'),10); if(isNaN(from))from=0;
    if(reduced){el.textContent=to;return;}            /* op-lp-v4: 0開始をやめHTML実値を保つ */
    var start=null,dur=1100;
    function tick(ts){
      if(!start)start=ts;
      var p=Math.min((ts-start)/dur,1);
      el.textContent=Math.round(from+(to-from)*(1-Math.pow(1-p,3)));
      if(p<1)requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var counters=document.querySelectorAll('[data-count-to]');
  if('IntersectionObserver' in window){
    var cio=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting){animateCount(e.target);cio.unobserve(e.target);}
      });
    },{threshold:.6});
    counters.forEach(function(c){cio.observe(c);});
  }else{
    counters.forEach(animateCount);
  }

  var STEPS=[
    {c:'C3',f:'=B3*(1+$F$3)',v:'5,940'},
    {c:'D3',f:'=C3*(1+$F$3)',v:'6,415'},
    {c:'E3',f:'=D3*(1+$F$3)',v:'6,928'},
    {c:'E4',f:'=E3*$F$4',v:'1,455'},
    {c:'E5',f:'=E4*$F$5',v:'11,640'},
    {c:'E7',f:'=E5-E6',v:'7,740'},
    {c:'E8',f:'=(E7/3800)^(1/3)-1',v:'2.0x ／ 26.7%'}
  ];
  var xlName=document.getElementById('xlName');
  var xlFx=document.getElementById('xlFx');
  var xlCaret=document.getElementById('xlCaret');
  var xlStep=document.getElementById('xlStep');
  var grid=document.getElementById('xlGrid');
  function cellOf(ref){return grid?grid.querySelector('[data-cell="'+ref+'"]'):null;}
  function fillAll(){
    STEPS.forEach(function(s){var td=cellOf(s.c);if(td)td.textContent=s.v;});
    if(xlStep)xlStep.textContent='準備完了';
  }
  function resetCells(){
    STEPS.forEach(function(s){
      var td=cellOf(s.c);if(!td)return;
      td.textContent='';td.classList.remove('flash','typing','sel');
    });
  }
  function typeStep(i,done){
    var s=STEPS[i];var td=cellOf(s.c);
    if(!td){done();return;}
    td.classList.add('sel','typing');
    if(xlName)xlName.textContent=s.c;
    if(xlStep)xlStep.textContent='入力中… '+s.c;
    if(xlCaret)xlCaret.style.visibility='visible';
    var j=0;
    (function typeChar(){
      if(j<=s.f.length){
        var part=s.f.slice(0,j);
        if(xlFx)xlFx.textContent=part;
        td.textContent=part;
        j++;
        setTimeout(typeChar,60+Math.random()*55);
      }else{
        setTimeout(function(){
          td.classList.remove('sel','typing');
          td.textContent=s.v;
          td.classList.add('flash');
          if(xlFx)xlFx.textContent='';
          if(xlCaret)xlCaret.style.visibility='hidden';
          setTimeout(done,620);
        },320);
      }
    })();
  }
  function runXl(){
    var i=0;
    (function next(){
      if(i<STEPS.length){
        typeStep(i,function(){i++;next();});
      }else{
        if(xlStep)xlStep.textContent='準備完了';
        if(xlName)xlName.textContent='E8';
        setTimeout(function(){resetCells();setTimeout(runXl,900);},4200);
      }
    })();
  }
  if(grid){
    if(reduced){fillAll();}
    else if('IntersectionObserver' in window){
      var xio=new IntersectionObserver(function(es){
        es.forEach(function(e){
          if(e.isIntersecting){setTimeout(runXl,700);xio.unobserve(e.target);}
        });
      },{threshold:.35});
      if(grid)xio.observe(grid);
    }else{
      setTimeout(runXl,1200);
    }
  }

  var y=document.getElementById('year');
  if(y){y.textContent=new Date().getFullYear();}
})();

/* ---- inline block ---- */
(function(){
  var bar=document.getElementById('pgbar');
  if(!bar)return;
  var on=function(){
    var h=document.documentElement.scrollHeight-window.innerHeight;
    bar.style.width=(h>0?(window.scrollY/h)*100:0)+'%';
  };
  window.addEventListener('scroll',on,{passive:true});on();
})();

/* ---- inline block ---- */
(function(){var t=document.querySelector(".to-top");if(!t)return;var f=function(){t.classList.toggle("show",window.scrollY>600)};window.addEventListener("scroll",f,{passive:true});f();t.addEventListener("click",function(e){e.preventDefault();window.scrollTo({top:0,behavior:"smooth"});});})();

/* ---- inline block id='op-ux-v4js' ---- */
(function(){
if(!document.body.classList.contains('has-ctabar')){var b=document.createElement('div');b.className='reading-progress';document.body.appendChild(b);var d=document.documentElement;var f=function(){var m=d.scrollHeight-window.innerHeight;b.style.transform='scaleX('+(m>0?Math.min(1,window.scrollY/m):0)+')';};window.addEventListener('scroll',f,{passive:true});f();}
var links=[].slice.call(document.querySelectorAll('.toc a'));links=links.filter(function(l){return (l.getAttribute('href')||'').charAt(0)==='#'});
if(links.length&&'IntersectionObserver' in window){var map={},cur=null;
links.forEach(function(l){var el=document.getElementById(l.getAttribute('href').slice(1));if(el)map[el.id]=l;});
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&map[e.target.id]){if(cur)cur.classList.remove('active');cur=map[e.target.id];cur.classList.add('active');}});},{rootMargin:'-15% 0px -70% 0px'});
Object.keys(map).forEach(function(id){io.observe(document.getElementById(id))});}
})();

/* ---- inline block ---- */
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
  if(!/\.html(#[^"]*)?$/i.test(h))return null;
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

/* ---- inline block ---- */
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
  if(HOVER_OPEN&&window.matchMedia('(hover: hover) and (min-width: 1121px)').matches){
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

/* ---- inline block ---- */
/* op-mcta */
(function(){'use strict';
if(window.matchMedia('(min-width: 641px)').matches)return;
if(document.body.classList.contains('has-ctabar')||document.getElementById('quickbar'))return;
var bar=document.createElement('div');bar.id='opMcta';
bar.innerHTML='<div class="m-txt"><b>無料記事から学ぶ</b>会計から評価・LBOまで全文無料</div><a href="../../../../../articles/index.html">記事を読む</a>';
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

/* op-lpmotion-v2: hero写真のloaded付与＋軽量パララックス（PCのみ・reduced-motion無効） */
(function(){'use strict';
var m=document.querySelector('.hero-media');if(!m)return;
var img=m.querySelector('img');
function on(){m.classList.add('loaded');}
if(img){if(img.complete){on();}else{img.addEventListener('load',on);img.addEventListener('error',on);}}
var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(reduced||window.matchMedia('(max-width: 880px)').matches)return;
var ticking=false;
function upd(){
  var y=window.scrollY||0;
  if(y<1000){m.style.transform='translate3d(0,'+(y*0.16).toFixed(1)+'px,0)';}
  ticking=false;
}
window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(upd);}},{passive:true});
})();

/* op-lp-v4: Modeling Lab タブUI（表示切替のみ・クリック＋左右キー・aria管理。JS無効時は最初のパネルが表示） */
(function(){'use strict';
var tl=document.querySelector('.olw-tabs[role="tablist"]');
if(!tl)return;
var tabs=[].slice.call(tl.querySelectorAll('.olw-tab'));
if(!tabs.length)return;
function panelOf(t){return document.getElementById(t.getAttribute('aria-controls'));}
function select(tab,focus){
  tabs.forEach(function(t){
    var on=(t===tab);
    t.setAttribute('aria-selected',on?'true':'false');
    t.tabIndex=on?0:-1;
    var p=panelOf(t);
    if(p){ if(on){p.removeAttribute('hidden');} else {p.setAttribute('hidden','');} }
  });
  if(focus&&tab.focus)tab.focus();
}
tl.addEventListener('click',function(e){
  var t=e.target.closest?e.target.closest('.olw-tab'):null;
  if(t)select(t,false);
});
tl.addEventListener('keydown',function(e){
  var i=tabs.indexOf(document.activeElement);
  if(i<0)return;
  var n=null;
  if(e.key==='ArrowRight'||e.key==='ArrowDown')n=tabs[(i+1)%tabs.length];
  else if(e.key==='ArrowLeft'||e.key==='ArrowUp')n=tabs[(i-1+tabs.length)%tabs.length];
  else if(e.key==='Home')n=tabs[0];
  else if(e.key==='End')n=tabs[tabs.length-1];
  if(n){e.preventDefault();select(n,true);}
});
})();

/* op-lp-v4b: ヒーロー ピッチブック自動切替（装飾・pointer/hoverのみ・aria-hidden・reduced-motion対応） */
(function(){'use strict';
var hb=document.getElementById('opHb'); if(!hb)return;
var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var tabs=[].slice.call(hb.querySelectorAll('.ophb-tab'));
var slides=[].slice.call(hb.querySelectorAll('.ophb-sl'));
var titleEl=document.getElementById('opHbTitle');
var dotsWrap=document.getElementById('opHbDots');
var titles=['Valuation — Football Field','Sum-of-the-Parts（EV分解）','Sensitivity — 株式価値','LBO Returns — Value Bridge'];
var cur=0,timer=null;
[].forEach.call(hb.querySelectorAll('.ophb-dcell'),function(c){
  var v=(parseFloat(c.getAttribute('data-v'))||0)/100;
  c.style.background='rgba(29,78,138,'+(0.10+v*0.90).toFixed(3)+')';
  if(v>=0.7&&c.className.indexOf('base')<0)c.style.color='#fff';
});
slides.forEach(function(_,i){var d=document.createElement('i');d.setAttribute('data-i',i);if(i===0)d.className='on';dotsWrap.appendChild(d);});
var dots=[].slice.call(dotsWrap.children);
function fmt(v,dec){return dec>0?v.toFixed(dec):Math.round(v).toLocaleString();}
function countUp(el){
  var to=parseFloat(el.getAttribute('data-to'));var dec=parseInt(el.getAttribute('data-dec')||'0',10);
  var suf=el.getAttribute('data-suf')||'';var target=dec>0?to/Math.pow(10,dec):to;
  if(reduced){el.textContent=fmt(target,dec)+suf;return;}
  var t0=null,dur=850;
  function tick(ts){if(!t0)t0=ts;var p=Math.min((ts-t0)/dur,1);var v=target*(1-Math.pow(1-p,3));el.textContent=fmt(v,dec)+suf;if(p<1)requestAnimationFrame(tick);}
  requestAnimationFrame(tick);
}
function show(i){
  cur=i;
  slides.forEach(function(s,k){s.classList.toggle('on',k===i);});
  tabs.forEach(function(t,k){t.classList.toggle('on',k===i);});
  dots.forEach(function(d,k){d.classList.toggle('on',k===i);});
  if(titleEl)titleEl.textContent=titles[i];
  var cs=slides[i].querySelectorAll('[data-to]');
  if(!reduced){[].forEach.call(cs,function(el){el.textContent='0';});setTimeout(function(){[].forEach.call(cs,countUp);},240);}
  else{[].forEach.call(cs,countUp);}
}
function next(){show((cur+1)%slides.length);}
function start(){if(reduced)return;stop();timer=setInterval(next,5000);}
function stop(){if(timer){clearInterval(timer);timer=null;}}
tabs.forEach(function(t){t.addEventListener('click',function(){show(+t.getAttribute('data-i'));start();});});
dots.forEach(function(d){d.addEventListener('click',function(){show(+d.getAttribute('data-i'));start();});});
hb.addEventListener('mouseenter',stop);hb.addEventListener('mouseleave',start);
show(0);
if(!reduced){
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)start();else stop();});},{threshold:.2});
    io.observe(hb);
  }else{start();}
}
})();

/* ============================================================
   op-lp-v6 (2026-07) — INPUT×OUTPUT学習体系LP 追加スクリプト
   タブUI（中核領域・スポットライト・ユースケース）／学習体系プログレスライン／
   採点バー演出／画像ライトボックス／高速スクロール時のreveal取りこぼし防止。
   すべてJS無効・IntersectionObserver非対応でも本文が読める構造を前提とする。
   ============================================================ */
(function(){'use strict';
var d=document,reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* --- 0. 高速スクロール時に[data-reveal]が空白のまま残らない安全網 --- */
(function(){
  var pending=[].slice.call(d.querySelectorAll('[data-reveal]'));
  if(!pending.length)return;
  var ticking=false;
  function sweep(){
    ticking=false;
    var vh=window.innerHeight||800;
    pending=pending.filter(function(el){
      if(el.classList.contains('is-in'))return false;
      var r=el.getBoundingClientRect();
      if(r.top<vh*0.96){el.classList.add('is-in');return false;}
      return true;
    });
  }
  window.addEventListener('scroll',function(){
    if(!ticking){ticking=true;requestAnimationFrame(sweep);}
  },{passive:true});
  window.setTimeout(sweep,900);
})();

/* --- 1. 汎用タブUI（dom-tabs / spx-tabs / uc-tabs）。olw-tabsは既存実装のまま --- */
function initTabs(tl){
  var tabs=[].slice.call(tl.querySelectorAll('[role="tab"]'));
  if(!tabs.length)return null;
  function panelOf(t){return d.getElementById(t.getAttribute('aria-controls'));}
  function select(tab,focus){
    tabs.forEach(function(t){
      var on=(t===tab);
      t.setAttribute('aria-selected',on?'true':'false');
      t.tabIndex=on?0:-1;
      var p=panelOf(t);
      if(p){if(on){p.removeAttribute('hidden');}else{p.setAttribute('hidden','');}}
    });
    if(focus&&tab.focus)tab.focus();
  }
  tl.addEventListener('click',function(e){
    var t=e.target.closest?e.target.closest('[role="tab"]'):null;
    if(t&&tabs.indexOf(t)>-1)select(t,false);
  });
  tl.addEventListener('keydown',function(e){
    var i=tabs.indexOf(d.activeElement);
    if(i<0)return;
    var n=null;
    if(e.key==='ArrowRight'||e.key==='ArrowDown')n=tabs[(i+1)%tabs.length];
    else if(e.key==='ArrowLeft'||e.key==='ArrowUp')n=tabs[(i-1+tabs.length)%tabs.length];
    else if(e.key==='Home')n=tabs[0];
    else if(e.key==='End')n=tabs[tabs.length-1];
    if(n){e.preventDefault();select(n,true);}
  });
  return {tabs:tabs,select:select};
}
['.dom-tabs','.uc-tabs'].forEach(function(s){
  var tl=d.querySelector(s);
  if(tl)initTabs(tl);
});

/* --- 2. 学習体系プログレスライン（スクロール連動） --- */
(function(){
  var flow=d.getElementById('jrnFlow');
  if(!flow)return;
  var steps=[].slice.call(flow.querySelectorAll('.jrn-step'));
  var line=flow.querySelector('.jrn-line');
  function placeLine(){
    if(!line)return;
    var dot=flow.querySelector('.jrn-dot');
    if(!dot)return;
    var fr=flow.getBoundingClientRect(),dr=dot.getBoundingClientRect();
    if(dr.width>0){line.style.top=(dr.top-fr.top+dr.height/2-1)+'px';}
  }
  if(reduced||!('IntersectionObserver' in window)){
    flow.style.setProperty('--jp','1');
    steps.forEach(function(s){s.classList.add('on');});
    placeLine();
    return;
  }
  placeLine();
  window.addEventListener('resize',placeLine);
  var ticking=false;
  function upd(){
    ticking=false;
    var r=flow.getBoundingClientRect();
    var vh=window.innerHeight||800;
    var p=(vh*0.82-r.top)/(r.height*0.98);
    p=Math.max(0,Math.min(1,p));
    flow.style.setProperty('--jp',p.toFixed(4));
    var n=steps.length;
    steps.forEach(function(s,i){
      s.classList.toggle('on',p>=(i+0.55)/n);
    });
  }
  window.addEventListener('scroll',function(){
    if(!ticking){ticking=true;requestAnimationFrame(upd);}
  },{passive:true});
  window.addEventListener('load',function(){placeLine();upd();});
  upd();
})();

/* --- 3. 教材スポットライト（サムネ切替・自動送り・停止制御） --- */
(function(){
  var spx=d.getElementById('spx');
  if(!spx)return;
  var tl=spx.querySelector('.spx-tabs');
  var api=tl?initTabs(tl):null;

  /* サムネイル切替（パネル内のメイン画像・キャプションを差し替え） */
  var BASE=null;
  (function(){
    var img=spx.querySelector('.spx-zoom img');
    if(img){
      var m=img.getAttribute('src').match(/^(.*\/assets\/materials\/)/);
      if(m)BASE=m[1];
    }
  })();
  spx.addEventListener('click',function(e){
    var th=e.target.closest?e.target.closest('.spx-th'):null;
    if(!th||!BASE)return;
    var panel=th.closest('.spx-panel');
    if(!panel)return;
    var img=panel.querySelector('.spx-zoom img');
    var cap=panel.querySelector('.spx-cap');
    if(img){img.src=BASE+th.getAttribute('data-img');img.alt=th.getAttribute('data-alt')||'';}
    if(cap){cap.textContent=th.getAttribute('data-cap')||'';}
    [].forEach.call(panel.querySelectorAll('.spx-th'),function(b){b.classList.toggle('on',b===th);});
  });

  /* パネル高さの最大値でコンテナを固定（自動送りでもレイアウトシフトを起こさない） */
  var panels=[].slice.call(spx.querySelectorAll('.spx-panel'));
  function lockHeight(){
    var max=0;
    panels.forEach(function(p){
      var hidden=p.hasAttribute('hidden');
      if(hidden){p.removeAttribute('hidden');p.style.visibility='hidden';p.style.position='absolute';p.style.width='100%';}
      var h=p.offsetHeight;
      if(h>max)max=h;
      if(hidden){p.setAttribute('hidden','');p.style.visibility='';p.style.position='';p.style.width='';}
    });
    if(max>0)spx.style.minHeight=(max+(tl?tl.offsetHeight+40:0))+'px';
  }
  window.addEventListener('load',lockHeight);
  var rzT=null;
  window.addEventListener('resize',function(){if(rzT)clearTimeout(rzT);rzT=setTimeout(lockHeight,220);});
  lockHeight();

  /* 自動送り：5.5秒間隔。ホバー・フォーカス中は一時停止、ユーザー操作で完全停止 */
  if(!api||reduced)return;
  var timer=null,stopped=false,inView=false,hovering=false;
  function cur(){
    for(var i=0;i<api.tabs.length;i++){if(api.tabs[i].getAttribute('aria-selected')==='true')return i;}
    return 0;
  }
  function tickAuto(){
    if(stopped||hovering||!inView)return;
    api.select(api.tabs[(cur()+1)%api.tabs.length],false);
  }
  function start(){if(timer||stopped)return;timer=setInterval(tickAuto,5500);}
  function stop(){if(timer){clearInterval(timer);timer=null;}}
  function kill(){stopped=true;stop();}
  spx.addEventListener('mouseenter',function(){hovering=true;});
  spx.addEventListener('mouseleave',function(){hovering=false;});
  spx.addEventListener('focusin',function(){hovering=true;});
  spx.addEventListener('focusout',function(){window.setTimeout(function(){if(!spx.contains(d.activeElement))hovering=false;},10);});
  spx.addEventListener('pointerdown',kill,true);
  spx.addEventListener('keydown',kill,true);
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){
        inView=e.isIntersecting;
        if(inView){start();}else{stop();}
      });
    },{threshold:.25});
    io.observe(spx);
  }
})();

/* --- 4. Assessment採点バー（表示イメージ・サンプル） --- */
(function(){
  var box=d.querySelector('.asm-sample');
  if(!box)return;
  var bars=[].slice.call(box.querySelectorAll('.ab-bar'));
  var total=box.querySelector('[data-score-total]');
  function setBars(){
    bars.forEach(function(b,i){
      var v=parseFloat(b.getAttribute('data-score'))||0;
      var mx=parseFloat(b.getAttribute('data-max'))||100;
      if(reduced){b.style.setProperty('--p',(v/mx).toFixed(3));return;}
      window.setTimeout(function(){b.style.setProperty('--p',(v/mx).toFixed(3));},120+i*90);
    });
    if(total){
      var to=parseInt(total.getAttribute('data-score-total'),10)||0;
      if(reduced){total.textContent=to;return;}
      var t0=null,dur=950;
      function tick(ts){
        if(!t0)t0=ts;
        var p=Math.min((ts-t0)/dur,1);
        total.textContent=Math.round(to*(1-Math.pow(1-p,3)));
        if(p<1)requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
  }
  var done=false;
  function run(){if(done)return;done=true;setBars();}
  if(reduced||!('IntersectionObserver' in window)){run();return;}
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){run();io.disconnect();}});
  },{threshold:.35});
  io.observe(box);
  /* タブ切替で初表示された場合にも対応（hidden解除時はIOが発火する） */
})();

/* --- 5. 画像ライトボックス（クリック／タップで拡大・ESCで閉じる） --- */
(function(){
  var overlay=null,imgEl=null,capEl=null,lastFocus=null;
  function build(){
    overlay=d.createElement('div');
    overlay.className='zlx';
    overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');
    overlay.setAttribute('aria-label','画像の拡大表示');
    overlay.innerHTML='<button type="button" class="zlx-close" aria-label="閉じる">×</button><div class="zlx-inner"><img alt=""><p class="zlx-cap"></p></div>';
    d.body.appendChild(overlay);
    imgEl=overlay.querySelector('img');
    capEl=overlay.querySelector('.zlx-cap');
    overlay.addEventListener('click',function(e){
      if(e.target===overlay||e.target.classList.contains('zlx-close'))close();
    });
    d.addEventListener('keydown',function(e){
      if(e.key==='Escape'&&overlay.classList.contains('on'))close();
    });
  }
  function open(src,alt,cap,trigger){
    if(!overlay)build();
    lastFocus=trigger||d.activeElement;
    imgEl.src=src;imgEl.alt=alt||'';
    capEl.textContent=cap||'';
    overlay.classList.add('on');
    d.body.style.overflow='hidden';
    overlay.querySelector('.zlx-close').focus();
  }
  function close(){
    overlay.classList.remove('on');
    d.body.style.overflow='';
    if(lastFocus&&lastFocus.focus)lastFocus.focus();
  }
  d.addEventListener('click',function(e){
    var z=e.target.closest?e.target.closest('.spx-zoom'):null;
    if(z){
      var im=z.querySelector('img');
      var fig=z.closest('.spx-panel');
      var cap=fig?fig.querySelector('.spx-cap'):null;
      if(im)open(im.src,im.alt,cap?cap.textContent:'',z);
      return;
    }
    var df=e.target.closest?e.target.closest('.dom-fig'):null;
    if(df){
      var im2=df.querySelector('img');
      var fc=df.querySelector('figcaption');
      if(im2)open(im2.src,im2.alt,fc?fc.textContent:'',null);
    }
  });
})();
})();

/* ============================================================
   op-lp-v7 (2026-08) — Platform LP 追加スクリプト
   Platform Numbersのカウントアップのみ（reveal・タブ等は既存を流用）。
   prefers-reduced-motion時は即時表示。要素が無いページでは何もしない。
   ============================================================ */
(function(){
'use strict';
var els=[].slice.call(document.querySelectorAll('.x7-cnt[data-cnt]'));
if(!els.length)return;
var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function setFinal(el){var to=parseInt(el.getAttribute('data-cnt'),10)||0;el.textContent=to.toLocaleString('ja-JP');}
if(reduced||!('IntersectionObserver' in window)){els.forEach(setFinal);return;}
var run=function(el){
  var to=parseInt(el.getAttribute('data-cnt'),10)||0,t0=null,dur=900;
  function tick(ts){if(!t0)t0=ts;var p=Math.min((ts-t0)/dur,1);var v=Math.round(to*(1-Math.pow(1-p,3)));el.textContent=v.toLocaleString('ja-JP');if(p<1)requestAnimationFrame(tick);}
  requestAnimationFrame(tick);
};
var io=new IntersectionObserver(function(es){
  es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);run(e.target);}});
},{threshold:.4});
els.forEach(function(el){io.observe(el);});
})();
