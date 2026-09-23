/* op-maadv-v1: FA・M&A仲介会社DB ページの操作レイヤー（SSR済DOMを拡張）
   共通クローム（メニュー開閉・to-top）は op-page-pe-funds.js と同じ実装を先頭に内蔵。 */
(function(){'use strict';
 /* ===== 共通chrome: モバイルメニュー・サブナビ開閉 ===== */
 var mt=document.querySelector('.menu-toggle'), gn=document.getElementById('gnav');
 if(mt&&gn){
  mt.addEventListener('click',function(){
   var open=mt.getAttribute('aria-expanded')==='true';
   mt.setAttribute('aria-expanded',open?'false':'true');
   document.body.classList.toggle('nav-open',!open);
  });
 }
 document.querySelectorAll('.nv-btn').forEach(function(b){
  b.addEventListener('click',function(e){
   e.stopPropagation();
   var open=b.getAttribute('aria-expanded')==='true';
   document.querySelectorAll('.nv-btn').forEach(function(x){x.setAttribute('aria-expanded','false');x.parentElement.classList.remove('open');});
   if(!open){b.setAttribute('aria-expanded','true');b.parentElement.classList.add('open');}
  });
 });
 document.addEventListener('click',function(e){
  if(!e.target.closest('.nv-item')){
   document.querySelectorAll('.nv-btn').forEach(function(x){x.setAttribute('aria-expanded','false');x.parentElement.classList.remove('open');});
  }
 });
 var yr=document.getElementById('year'); if(yr)yr.textContent=String(new Date().getFullYear());
 var tt=document.querySelector('.to-top');
 if(tt){tt.addEventListener('click',function(e){e.preventDefault();window.scrollTo({top:0,behavior:'smooth'});});}
})();

(function(){'use strict';
 var $=function(s,r){return (r||document).querySelector(s);};
 var $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s));};
 var PAGE=25;
 function opNorm(s){ s=String(s||''); try{s=s.normalize('NFKC');}catch(e){} return s.toLowerCase().replace(/[\s　・･/／\-–—_,、（）()「」]/g,''); }

 /* ---- 個別ページ: 成約実績「もっと見る」 ---- */
 var dealsMore=$('#dealsMore');
 if(dealsMore){
  dealsMore.addEventListener('click',function(){
   $$('.deal-hidden').forEach(function(tr){tr.hidden=false;tr.classList.remove('deal-hidden');});
   dealsMore.remove();
  });
 }

 var tblBody=$('#tblBody');
 if(!tblBody)return;
 /* 検索正規化・採点は op-ma-search.js（単一実装）に委譲する。読み込み失敗時のみ最小フォールバック。 */
 var SE=window.opMaSearch||null;
 var rows=$$('tr[data-slug]',tblBody);
 var cardWrap=$('#cardWrap');
 var cardMap={};
 $$('.f-card',cardWrap).forEach(function(c){cardMap[c.getAttribute('data-slug')]=c;});
 /* 構造化インデックス（#maIndex JSON）を読み、slug で行/カードへ結合する。 */
 var sIndex={};
 (function(){
  var el=document.getElementById('maIndex');
  if(!el||!SE)return;
  try{ SE.buildIndex(JSON.parse(el.textContent)).forEach(function(f){sIndex[f.s]=f;}); }
  catch(e){ if(window.console)console.error('maIndex parse failed',e); }
 })();
 var items=rows.map(function(r){
  var slug=r.getAttribute('data-slug');
  var nameja=(r.querySelector('.f-name')||{}).textContent||'';
  return {slug:slug,row:r,card:cardMap[slug]||null,se:sIndex[slug]||null,hit:null,
   keitai:r.getAttribute('data-keitai')||'',type:r.getAttribute('data-type')||'',
   area:r.getAttribute('data-area')||'',ind:r.getAttribute('data-ind')||'',
   cc:(r.getAttribute('data-cc')||'').split(' ').filter(Boolean),
   senju:+(r.getAttribute('data-senju')||0),
   minfee:r.getAttribute('data-minfee')!==''?+(r.getAttribute('data-minfee')):null,
   feecase:r.getAttribute('data-feecase')!==''?+(r.getAttribute('data-feecase')):null,
   ret0:r.getAttribute('data-ret0')==='1',int0:r.getAttribute('data-int0')==='1',
   full:r.getAttribute('data-full')==='1',shokei:r.getAttribute('data-shokei')==='1',
   pe:r.getAttribute('data-pe')==='1',cb:r.getAttribute('data-cb')==='1',
   carve:r.getAttribute('data-carve')==='1',pmi:r.getAttribute('data-pmi')==='1',
   large:r.getAttribute('data-large')==='1',sme:r.getAttribute('data-sme')==='1',
   deals:+(r.getAttribute('data-deals')||0),
   nameen:'',kana:r.getAttribute('data-kana')||'',
   nameja:nameja,updated:r.getAttribute('data-updated')||''};
 });
 var GROUPS=['type','area','ind','minfee','fee','feature','cc'];
 var st={keitai:'all',q:'',sort:'senju',page:1,
  sel:{type:[],area:[],ind:[],minfee:[],fee:[],feature:[],cc:[],tier:[]}};

 /* ---- ファセット判定（値1つに対して該当するか） ---- */
 function facetTest(it,g,v){
  if(g==='type')return it.type===v;
  if(g==='area')return (' '+it.area+' ').indexOf(' '+v+' ')>=0;
  if(g==='ind')return (' '+it.ind+' ').indexOf(' '+v+' ')>=0;
  if(g==='minfee'){
   var m=it.minfee;
   if(v==='open')return m!==null;
   if(m===null)return false;
   if(v==='u500')return m<=5000000;
   if(v==='u1000')return m>5000000&&m<=10000000;
   if(v==='u2500')return m>10000000&&m<=25000000;
   if(v==='o2500')return m>25000000;
  }
  if(g==='fee')return v==='ret0'?it.ret0:(v==='int0'?it.int0:it.full);
  if(g==='feature')return !!it[v];
  if(g==='cc')return it.cc.indexOf(v)>=0;
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
 function keitaiMatch(it){
  if(st.keitai==='all')return true;
  return it.keitai===st.keitai;
 }

 function cmp(a,b){
  var s=st.sort;
  function nullLast(av,bv,asc){
   if(av===null&&bv===null)return 0;
   if(av===null)return 1;
   if(bv===null)return -1;
   return asc?(av-bv):(bv-av);
  }
  if(s==='kana')return (a.kana||a.nameja).localeCompare(b.kana||b.nameja,'ja');
  if(s==='minfee')return nullLast(a.minfee,b.minfee,true)||(b.senju-a.senju);
  if(s==='feecase')return nullLast(a.feecase,b.feecase,true)||(b.senju-a.senju);
  if(s==='deals')return (b.deals-a.deals)||(b.senju-a.senju);
  if(s==='updated')return (b.updated||'').localeCompare(a.updated||'')||(b.senju-a.senju);
  return (b.senju-a.senju)||(a.kana||a.nameja).localeCompare(b.kana||b.nameja,'ja');
 }

 /* ---- URL同期（複数選択はカンマ区切り。single source of truth） ---- */
 function readURL(){
  var p=new URLSearchParams(location.search);
  st.keitai=p.get('keitai')||'all';st.q=p.get('q')||'';
  st.sort=p.get('sort')||'senju';st.page=+(p.get('page')||1);
  GROUPS.concat('tier').forEach(function(g){ var v=p.get(g); st.sel[g]=v?v.split(','):[]; });
  if($('#q'))$('#q').value=st.q; if($('#sort'))$('#sort').value=st.sort;
  $$('.rtab').forEach(function(b){b.setAttribute('aria-selected',b.getAttribute('data-r')===st.keitai?'true':'false');});
  $$('#peRail input[type=checkbox]').forEach(function(cb){
   var g=cb.getAttribute('data-g'),v=cb.getAttribute('data-v');
   cb.checked = st.sel[g] && st.sel[g].indexOf(v)>=0;
  });
 }
 function syncURL(){
  var p=new URLSearchParams();
  if(st.keitai!=='all')p.set('keitai',st.keitai);if(st.q)p.set('q',st.q);
  GROUPS.forEach(function(g){ if(st.sel[g].length)p.set(g,st.sel[g].join(',')); });
  if(st.sort!=='senju'&&st.sort!=='rel')p.set('sort',st.sort);
  if(st.page>1)p.set('page',st.page);
  var qs=p.toString();history.replaceState(null,'',qs?('?'+qs):location.pathname);
 }

 /* ---- 一致理由の表示（PE/VC版と同じ実装。「投資先」を「成約実績（取引先企業）」に読み替え） ---- */
 var WHY={name:'取引先企業名',sector:'業種',text:'取引内容・区分'};
 function escH(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
 function hitWhyHTML(hit,qDisp){
  if(!hit)return '';
  if(hit.tier==='name')return '<span class="hw-tag hw-name">会社名に一致</span>';
  if(hit.tier==='alias')return '<span class="hw-tag hw-name">会社の別称に一致</span>';
  if(hit.tier==='fuzzy')return '<span class="hw-tag hw-name">会社名に類似一致</span>';
  var h='';
  if(hit.attr)h+='<span class="hw-tag hw-attr">得意業種・特徴「'+escH(hit.attr)+'」に一致</span>';
  if(hit.pfCount){
   h+='<span class="hw-tag hw-pf">成約実績 '+hit.pfCount+'件が「'+escH(qDisp)+'」に一致</span>';
   var LIMIT=3;
   h+='<ul class="hw-list">';
   hit.pfHits.forEach(function(p,i){
    h+='<li'+(i>=LIMIT?' class="hw-extra" hidden':'')+'><b>'+escH(p.n)+'</b>'
      +(p.sec?'<span class="hw-sec">'+escH(p.sec)+'</span>':'')
      +'<span class="hw-why">'+(WHY[p.why]||'')+'が一致</span></li>';
   });
   h+='</ul>';
   if(hit.pfCount>LIMIT)h+='<span class="hw-more" role="button" tabindex="0" aria-expanded="false">一致した成約実績をすべて見る（'+hit.pfCount+'件）</span>';
  }
  return h;
 }
 function setWhy(el,html){
  if(!el)return;
  var w=el.querySelector('.hit-why');
  if(!html){ if(w)w.remove(); return; }
  if(!w){
   w=document.createElement('div');w.className='hit-why';
   var host=el.tagName==='TR'?el.querySelector('td.co-cell'):el;
   (host||el).appendChild(w);
  }
  w.innerHTML=html;
 }

 var pfFundCount=0,pfCompanyCount=0;
 function apply(){
  var Q=(st.q&&SE)?SE.prepQuery(st.q):null;
  var hasQ=!!Q;
  if(!hasQ)st.sel.tier=[];
  items.forEach(function(it){
   if(!hasQ){ it.hit=null; return; }
   it.hit=it.se?SE.score(it.se,Q):null;
  });

  var filtered=items.filter(function(it){ return keitaiMatch(it) && (!hasQ||!!it.hit) && passFacets(it,null); });
  /* 投資先一致件数と同様、成約実績の一致件数も「現在表示中の結果」基準で数える
     （facet適用後の件数と食い違うPE版の既知不具合と同じ罠を避ける）。 */
  pfFundCount=0;pfCompanyCount=0;
  filtered.forEach(function(it){ if(it.hit&&it.hit.pfCount){ pfFundCount++; pfCompanyCount+=it.hit.pfCount; } });
  filtered.sort(function(a,b){
   if(st.sort==='rel'||(hasQ&&st.sort==='senju')){ var d=(b.hit?b.hit.score:0)-(a.hit?a.hit.score:0); if(d)return d; }
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

  /* ---- ファセットの動的件数 ---- */
  var railBase=items.filter(function(it){ return keitaiMatch(it) && (!hasQ||!!it.hit); });
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
  var rt=$('#railToggle'); if(rt)rt.classList.toggle('has-active',!!activeGroups);

  /* ---- 検索の一致対象ファセット（検索時のみ表示） ---- */
  var mg=$('#matchGroup');
  if(mg){
   if(hasQ){
    mg.hidden=false;
    var mo=$('#matchOpts'); mo.innerHTML='';
    [['name','会社名に一致'],['attr','得意業種・特徴に一致'],['pf','成約実績に一致']].forEach(function(d){
     var n=railBase.filter(function(it){ return passFacets(it,'tier') && facetTest(it,'tier',d[0]); }).length;
     var extra = d[0]==='pf' ? railBase.filter(function(it){return passFacets(it,'tier')&&facetTest(it,'tier','pf');}).reduce(function(s2,it){return s2+(it.hit?it.hit.pfCount:0);},0) : 0;
     var on=st.sel.tier.indexOf(d[0])>=0;
     var l=document.createElement('label'); l.className='fopt'+(on?' on':'')+(n===0&&!on?' zero':'');
     l.innerHTML='<input type="checkbox" '+(on?'checked':'')+'> '+d[1]+(extra?('（'+extra+'件）'):'')+' <span class="cnt">'+n+'</span>';
     l.querySelector('input').addEventListener('change',function(){ toggleFacet('tier',d[0]); });
     mo.appendChild(l);
    });
   }else{ mg.hidden=true; }
  }

  /* ---- 適用中の条件チップ ---- */
  var chipsEl=$('#chips');
  if(chipsEl){
   chipsEl.innerHTML='';
   var GLBL={type:'会社分類',area:'エリア',ind:'業種',minfee:'最低成功報酬',fee:'料金',feature:'特徴',cc:'海外実績国',tier:'一致対象'};
   var VLBL={name:'会社名',attr:'業種・特徴',pf:'成約実績',
    ret0:'着手金なし',int0:'中間金なし',full:'完全成功報酬',
    shokei:'事業承継',pe:'PEファンド案件',cb:'クロスボーダー',carve:'カーブアウト',pmi:'PMI',large:'中堅・大型案件',sme:'中小企業M&A',
    u500:'〜500万円',u1000:'500万〜1,000万円',u2500:'1,000万〜2,500万円',o2500:'2,500万円超',open:'料金公開会社のみ'};
   GROUPS.concat('tier').forEach(function(g){
    st.sel[g].forEach(function(v){
     var c=document.createElement('span'); c.className='chip';
     var label = g==='cc' ? ccName(v) : (VLBL[v]||v);
     c.innerHTML=GLBL[g]+': '+escH(label)+' <span class="x">×</span>';
     c.querySelector('.x').addEventListener('click',function(){ toggleFacet(g,v); });
     chipsEl.appendChild(c);
    });
   });
  }

  var rl=$('#resultLine');
  if(rl){
   var line='該当 <b>'+total+'</b> 社'+(st.keitai!=='all'?'（'+st.keitai+'）':'');
   if(hasQ&&pfFundCount)line+=' ・ うち成約実績の一致 <b>'+pfFundCount+'</b>社（'+pfCompanyCount+'件）';
   rl.innerHTML=line;
  }
  var em=$('#emptyMsg');if(em)em.style.display=total?'none':'block';
  var pg=$('#pager');
  if(pg){
   if(pages<=1){pg.innerHTML='';}
   else{
    var h='<button '+(st.page===1?'disabled':'')+' data-p="'+(st.page-1)+'">‹ 前へ</button>';
    for(var i2=1;i2<=pages;i2++){if(i2===1||i2===pages||Math.abs(i2-st.page)<=2){h+='<button class="'+(i2===st.page?'cur':'')+'" data-p="'+i2+'">'+i2+'</button>';}else if(Math.abs(i2-st.page)===3){h+='<span style="color:#b8c4d0">…</span>';}}
    h+='<button '+(st.page===pages?'disabled':'')+' data-p="'+(st.page+1)+'">次へ ›</button>';
    pg.innerHTML=h;
    $$('#pager button[data-p]').forEach(function(b){b.addEventListener('click',function(){st.page=+b.getAttribute('data-p');var rt2=$('.region-tabs');window.scrollTo({top:(rt2?rt2.offsetTop-70:0),behavior:'smooth'});apply();syncURL();});});
   }
  }
 }
 function toggleFacet(g,v){
  var a=st.sel[g],i=a.indexOf(v); if(i<0)a.push(v);else a.splice(i,1);
  st.page=1; apply(); syncURL();
 }

 function ccName(cc){var el=$('#peRail input[data-g="cc"][data-v="'+cc+'"]');return el?el.closest('label').textContent.replace(/\d+$/,'').trim():cc;}

 /* ---- ファセット・region-tabs（keitai）・ソート・リセット ---- */
 $$('#peRail input[type=checkbox]').forEach(function(cb){
  cb.addEventListener('change',function(){ toggleFacet(cb.getAttribute('data-g'),cb.getAttribute('data-v')); });
 });
 $$('#peRail .fgroup h3').forEach(function(h){ h.addEventListener('click',function(){ h.closest('.fgroup').classList.toggle('closed'); }); });
 $$('.rtab').forEach(function(b){b.addEventListener('click',function(){st.keitai=b.getAttribute('data-r');st.page=1;$$('.rtab').forEach(function(x){x.setAttribute('aria-selected',x===b?'true':'false');});apply();syncURL();});});
 if($('#sort'))$('#sort').addEventListener('change',function(e){st.sort=e.target.value;st.page=1;apply();syncURL();});
 if($('#reset'))$('#reset').addEventListener('click',function(){
  st.q='';st.page=1; GROUPS.concat('tier').forEach(function(g){st.sel[g]=[];});
  if($('#q'))$('#q').value=''; var qc=$('#qClr'); if(qc)qc.hidden=true;
  $$('#peRail input[type=checkbox]').forEach(function(cb){cb.checked=false;});
  apply();syncURL();
 });
 rows.forEach(function(r){r.addEventListener('click',function(e){if(e.target.closest('a'))return;var a=r.querySelector('a.f-name');if(a)window.location.href=a.getAttribute('href');});r.style.cursor='pointer';});
 var railToggle=$('#railToggle'), rail=$('#peRail');
 if(railToggle&&rail){railToggle.addEventListener('click',function(){
  var open=railToggle.getAttribute('aria-expanded')==='true';
  railToggle.setAttribute('aria-expanded',open?'false':'true');
  rail.classList.toggle('open',!open);
 });}
 document.addEventListener('click',function(e){
  var m=e.target.closest?e.target.closest('.hw-more'):null;
  if(!m)return;
  e.preventDefault();e.stopPropagation();
  var box=m.closest('.hit-why');
  var on=m.getAttribute('aria-expanded')==='true';
  [].forEach.call(box.querySelectorAll('.hw-extra'),function(li){li.hidden=on;});
  m.setAttribute('aria-expanded',on?'false':'true');
  m.textContent=on?('一致した成約実績をすべて見る（'+box.querySelectorAll('.hw-list li').length+'件）'):'一致した成約実績を折りたたむ';
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
  if(!SE||!sugEl){return;}
  var q=qEl.value, Q=q?SE.prepQuery(q):null;
  sugIdx=-1; sugItems=[];
  if(!Q){ sugEl.hidden=true; sugEl.innerHTML=''; return; }
  var scored=[];
  items.forEach(function(it){ if(!it.se)return; var h=SE.score(it.se,Q); if(h)scored.push({it:it,h:h}); });
  scored.sort(function(a,b){return b.h.score-a.h.score});
  var orgs=scored.filter(function(x){return x.h.tier==='name'||x.h.tier==='alias'||x.h.tier==='fuzzy'}).slice(0,5);
  var pfs=[];
  scored.forEach(function(x){ (x.h.pfHits||[]).forEach(function(p){ if(p.why==='name'&&pfs.length<4) pfs.push({it:x.it,p:p}); }); });
  if(!orgs.length&&!pfs.length){ sugEl.hidden=true; return; }
  var h='';
  if(orgs.length){
   h+='<div class="grp">FA・M&amp;A仲介会社</div>';
   orgs.forEach(function(x){
    h+='<div class="it" data-q="'+escH(x.it.nameja)+'"><span class="nm">'+hilite(x.it.nameja,q)+'</span><span class="via">専従'+x.it.senju+'名 ／ 実績'+x.it.deals+'件</span></div>';
   });
  }
  if(pfs.length){
   h+='<div class="grp">成約実績（取引先企業）から探す</div>';
   pfs.forEach(function(x){
    h+='<div class="it" data-q="'+escH(x.p.n)+'"><span class="nm">'+hilite(x.p.n,q)+'</span>'+(x.p.sec?'<span class="en">'+escH(x.p.sec)+'</span>':'')+'<span class="via">担当: '+escH(x.it.nameja)+'</span></div>';
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
  if(clrEl)clrEl.hidden=!qEl.value;
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
})();
