(function(){
const C=window.EMEDRESE_CAMPS||[],L=window.EMEDRESE_LESSONS||{},A=window.EMEDRESE_ANNOUNCEMENTS||[],U=window.EMEDRESE_USER||{};
const app=document.getElementById('app'),btn=document.getElementById('theme');
const e=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function theme(t){document.documentElement.dataset.theme=t;btn.textContent=t==='dark'?'☀️':'🌙';try{localStorage.setItem('theme',t)}catch(x){}}
let t;try{t=localStorage.getItem('theme')}catch(x){}
theme(t||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'));
btn.onclick=()=>theme(document.documentElement.dataset.theme==='dark'?'light':'dark');

const card=c=>`<a class="card" href="#/camp/${c.id}/dersler"><img src="${e(c.image)}" alt="">
<div class="b"><h3>${e(c.title)}</h3><div class="mute">${e(c.dateRange)}</div>
<div class="bar2"><i style="width:${+c.progressPercent||0}%"></i></div>
<div class="mute">${c.completedLessons}/${c.totalLessons} ders${c.certificateEarned?' • 🎓 Sertifika':''}</div></div></a>`;

function home(){
 const joined=C.filter(c=>c.joined),act=joined.filter(c=>c.status==='active'),done=joined.filter(c=>c.status==='completed');
 app.innerHTML=`<h1>Selâmün aleyküm, ${e(U.firstName)}</h1><div class="mute">Kamplarınız</div>
 ${act.length?`<h2>Aktif Kamplar</h2><div class="grid">${act.map(card).join('')}</div>`:''}
 ${done.length?`<h2>Biten Kamplar</h2><div class="grid">${done.map(card).join('')}</div>`:''}
 ${joined.length?'':'<div class="empty">Henüz bir kampa katılmadınız.</div>'}`;
}

function certSheet(c){
 return `<div class="sheet"><div class="c">${e(c.title)}</div><div class="k">KATILIM SERTİFİKASI</div>
 <div class="n">${e(U.firstName)} ${e(U.lastName)}</div><p>${e(c.certificateNote)}</p>
 <p>Katkı ve katılımınız için teşekkür eder, başarılarınızın devamını dileriz.</p><img src="assets/img/logo-siyer.png" alt=""></div>`;
}

function camp(id,tab){
 const c=C.find(x=>x.id===id);if(!c)return location.hash='#/';
 const ls=L[id]||[],an=A.filter(a=>a.campId===id);
 const tabs=[['dersler','📚','Dersler'],['yoklama','✅','Yoklama'],['duyurular','📢','Duyurular'],['sertifika','🎓','Sertifika']];
 let body='';
 if(tab==='dersler'){
  body=ls.map(l=>`<div class="row"><div class="top2"><h4>${e(l.title)}</h4><span class="mute">${e(l.videoDuration)}</span></div>
  <div class="mute">${e(l.instructor)} • ${e(l.date)}</div><div class="mute">${e(l.note)}</div></div>`).join('')||'<div class="empty">Ders bulunamadı.</div>';
 }else if(tab==='yoklama'){
  const ok=ls.filter(l=>l.status==='Onaylandı').length;
  body=`<div class="row"><b>${ok}/${ls.length}</b> derse katılımınız onaylandı</div>`+ls.map(l=>`<div class="row"><div class="top2"><div><h4>${e(l.order)}. ${e(l.title.replace(/^\d+\.\s*/,''))}</h4><div class="mute">${e(l.date)}</div></div>
  <span class="pill ${l.status==='Onaylandı'?'ok':'warn'}">${l.status==='Onaylandı'?'✓ ':''}${e(l.status)}</span></div></div>`).join('');
 }else if(tab==='duyurular'){
  body=an.map(a=>`<div class="row"><div class="top2"><h4>${e(a.title)}</h4>${a.isNew?'<span class="pill warn">Yeni</span>':''}</div>
  <div class="mute">${e(a.date)}</div><p>${e(a.body)}</p></div>`).join('')||'<div class="empty">Bu kamp için duyuru yok.</div>';
 }else{
  body=c.certificateEarned
   ?`<div class="row"><b>🎓 Sertifikanız hazır</b></div>${c.certificateImage?`<img class="cert" src="${e(c.certificateImage)}" alt="Sertifika">`:certSheet(c)}
     ${c.certificateImage?`<a class="btn" href="${e(c.certificateImage)}" download>Sertifikayı İndir</a>`:''}
     ${c.certificateCode?`<p class="mute">Sertifika no: ${e(c.certificateCode)}</p>`:''}`
   :`<div class="empty">🔒<br><b>Sertifika henüz alınmadı</b><br>${e(c.certificateNote||'')}</div>`;
 }
 app.innerHTML=`<a class="back" href="#/">← Kamplarım</a><h1>${e(c.title)}</h1>
 <div class="mute">${e(c.dateRange)} • <span class="pill ${c.status==='active'?'ok':''}">${c.status==='active'?'Devam ediyor':'Tamamlandı'}</span></div>
 <nav class="tabs">${tabs.map(x=>`<a href="#/camp/${id}/${x[0]}" class="${x[0]===tab?'on':''}"><b>${x[1]}</b>${x[2]}</a>`).join('')}</nav>${body}`;
}

function route(){
 const m=location.hash.match(/^#\/camp\/([^/]+)\/?([^/]*)/);
 m?camp(m[1],m[2]||'dersler'):home();
 scrollTo(0,0);
}
addEventListener('hashchange',route);route();
})();
