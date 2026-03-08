// ══ SISTEMA DE MISIONES GAMIFICADAS ══════════════════════════

const MISIONES_BANCO = [
  {id:'m_agua',    ico:'💧', bg:'#DBEAFE', titulo:'Toma 3 vasos de agua',         desc:'La hidratación afecta directamente tu estado de ánimo y concentración.',          xp:15, tipo:'Físico',  accion:null},
  {id:'m_camina',  ico:'🚶', bg:'#D1FAE5', titulo:'Camina 10 minutos',             desc:'Salir a caminar libera endorfinas — el antidepresivo natural de tu cuerpo.',       xp:20, tipo:'Físico',  accion:null},
  {id:'m_duerme',  ico:'😴', bg:'#EDE7F6', titulo:'Acuéstate antes de las 11pm',   desc:'El sueño es el cargador de tu cerebro. Sin él, todo se ve peor.',                 xp:20, tipo:'Físico',  accion:null},
  {id:'m_come',    ico:'🍎', bg:'#FEF9EC', titulo:'Come algo nutritivo hoy',        desc:'Tu cerebro usa el 20% de tu energía. Aliméntalo bien.',                            xp:10, tipo:'Físico',  accion:null},
  {id:'m_sol',     ico:'☀️', bg:'#FEF3C7', titulo:'5 minutos de sol natural',       desc:'La luz solar regula tu ritmo circadiano y sube la serotonina.',                    xp:15, tipo:'Físico',  accion:null},
  {id:'m_respira', ico:'🌬️', bg:'#F3EEF9', titulo:'Ejercicio de respiración',       desc:'3 minutos de respiración profunda activan tu sistema nervioso parasimpático.',    xp:15, tipo:'Mente',   accion:'breath'},
  {id:'m_diario',  ico:'📝', bg:'#FDF6E3', titulo:'Escribe 3 cosas buenas de hoy', desc:'Anotar lo positivo reprograma tu cerebro para notar más cosas buenas.',            xp:20, tipo:'Mente',   accion:null},
  {id:'m_chat',    ico:'💬', bg:'#F3EEF9', titulo:'Habla con UmaKay IA',            desc:'Cuéntale algo — lo que sea. La expresión emocional reduce el estrés.',            xp:25, tipo:'Mente',   accion:'chat'},
  {id:'m_musica',  ico:'🎵', bg:'#FFF1F2', titulo:'Escucha tu canción favorita',    desc:'La música activa el núcleo accumbens, el centro de recompensa del cerebro.',      xp:10, tipo:'Mente',   accion:null},
  {id:'m_off',     ico:'📵', bg:'#E0F2FE', titulo:'30 min sin redes sociales',      desc:'Un descanso digital reduce la ansiedad comparativa y mejora tu autoestima.',      xp:25, tipo:'Mente',   accion:null},
  {id:'m_amigo',   ico:'🤝', bg:'#D1FAE5', titulo:'Habla con alguien de confianza', desc:'Una conversación real de 5 minutos hace más que 1 hora de scroll.',              xp:20, tipo:'Social',  accion:null},
  {id:'m_gracias', ico:'💌', bg:'#FEE2E2', titulo:'Agradece a alguien hoy',         desc:'Expresar gratitud fortalece los vínculos y sube tu bienestar emocional.',         xp:15, tipo:'Social',  accion:null},
  {id:'m_video',   ico:'🎓', bg:'#EDE7F6', titulo:'Ve un video de Aprende',          desc:'5 minutos aprendiendo sobre tu mente valen más que una hora preocupándote.',     xp:20, tipo:'Aprende', accion:'aprende'},
  {id:'m_lee',     ico:'📖', bg:'#FEF3C7', titulo:'Lee 5 páginas de lo que quieras', desc:'La lectura baja el cortisol en un 68% según estudios de la Univ. de Sussex.',   xp:15, tipo:'Aprende', accion:null},
];

const MISIONES_NIVEL = {
  verde: [
    {id:'mv1', ico:'🌱', bg:'#D1FAE5', titulo:'Mantén tu racha — check-in de hoy', desc:'Ya estás bien. El check-in diario te ayuda a detectar cambios antes de que crezcan.',  xp:10, tipo:'Bienestar', accion:null},
    {id:'mv2', ico:'⭐', bg:'#FEF9EC', titulo:'Comparte algo bueno que te pasó',    desc:'Recordar momentos positivos refuerza las redes neuronales del bienestar.',            xp:15, tipo:'Bienestar', accion:null},
  ],
  amarillo: [
    {id:'ma1', ico:'🌬️', bg:'#F3EEF9', titulo:'Haz la respiración 4-7-8 ahora',   desc:'Detectamos señales. Esta técnica calma el sistema nervioso en 90 segundos.',        xp:20, tipo:'Prioridad', accion:'breath'},
    {id:'ma2', ico:'💬', bg:'#F3EEF9', titulo:'Cuéntale algo al chat hoy',          desc:'No tienes que cargar solo/a con lo que sientes. El chat está aquí.',                  xp:25, tipo:'Prioridad', accion:'chat'},
  ],
  rojo: [
    {id:'mr1', ico:'🏥', bg:'#FEE2E2', titulo:'Agenda una cita esta semana',        desc:'Lo que sientes merece atención real. Una visita a la posta es el primer paso.',      xp:30, tipo:'🔴 Urgente', accion:'cita'},
    {id:'mr2', ico:'💬', bg:'#F3EEF9', titulo:'Habla con el chat ahora',            desc:'No estás solo/a. El chat escucha sin juzgarte, las 24 horas.',                       xp:25, tipo:'🔴 Urgente', accion:'chat'},
  ],
};

const LOGROS = [
  {id:'l_primer',  ico:'🌱', nombre:'Primer paso',     cond: s=>s.totalXP>=1},
  {id:'l_racha3',  ico:'🔥', nombre:'3 días seguidos', cond: s=>s.racha>=3},
  {id:'l_agua',    ico:'💧', nombre:'Hidratado/a',      cond: s=>s.hechas.includes('m_agua')},
  {id:'l_chat',    ico:'💬', nombre:'Me abrí',          cond: s=>s.hechas.includes('m_chat')},
  {id:'l_video',   ico:'🎓', nombre:'Aprendiz',         cond: s=>s.hechas.includes('m_video')},
  {id:'l_camina',  ico:'🚶', nombre:'En movimiento',    cond: s=>s.hechas.includes('m_camina')},
  {id:'l_lv2',     ico:'🌿', nombre:'Nivel 2',          cond: s=>s.totalXP>=100},
  {id:'l_lv3',     ico:'🌳', nombre:'Nivel 3',          cond: s=>s.totalXP>=250},
  {id:'l_lv4',     ico:'⭐', nombre:'Nivel 4',          cond: s=>s.totalXP>=500},
  {id:'l_lv5',     ico:'🏆', nombre:'Leyenda UmaKay',   cond: s=>s.totalXP>=1000},
  {id:'l_social',  ico:'🤝', nombre:'Conector',         cond: s=>s.hechas.includes('m_amigo')},
  {id:'l_grat',    ico:'💌', nombre:'Agradecido/a',     cond: s=>s.hechas.includes('m_gracias')},
];

const NIVELES = [
  {min:0,    max:99,   lv:1, nombre:'🌱 Explorador'},
  {min:100,  max:249,  lv:2, nombre:'🌿 Aprendiz'},
  {min:250,  max:499,  lv:3, nombre:'🌳 Guardián'},
  {min:500,  max:999,  lv:4, nombre:'⭐ Guerrero'},
  {min:1000, max:9999, lv:5, nombre:'🏆 Leyenda'},
];

let misState = JSON.parse(localStorage.getItem('uk-mis') || '{"totalXP":0,"hechas":[],"racha":0}');

// ── Helpers ──────────────────────────────────────────────────
function getNivel(xp){ return NIVELES.find(n=>xp>=n.min&&xp<=n.max)||NIVELES[0]; }

function getMisionesHoy(){
  const dia = new Date().getDate();
  const shuffled = [...MISIONES_BANCO].sort((a,b)=>{
    const h = s=>s.split('').reduce((acc,c)=>acc+c.charCodeAt(0),0);
    return h(a.id+dia)-h(b.id+dia);
  });
  return shuffled.slice(0,3);
}

function getMisionesNivel(){
  const nivel = (typeof userData !== 'undefined' && userData?.nivel) || 'verde';
  return MISIONES_NIVEL[nivel] || MISIONES_NIVEL.verde;
}

// ── Efectos visuales ─────────────────────────────────────────
function spawnConfetti(x, y){
  const colors=['#6B3FA0','#D4A017','#10B981','#F59E0B','#EF4444','#8B5FC0','#F0C840'];
  for(let i=0;i<12;i++){
    const el=document.createElement('div');
    el.className='confetti-piece';
    el.style.cssText=`left:${x+Math.random()*60-30}px;top:${y}px;background:${colors[i%colors.length]};transform:rotate(${Math.random()*360}deg);animation-delay:${Math.random()*0.3}s;animation-duration:${0.9+Math.random()*0.5}s;`;
    document.body.appendChild(el);
    setTimeout(()=>el.remove(),1800);
  }
}

function showXpPop(xp, x, y){
  const el=document.createElement('div');
  el.className='xp-pop';
  el.textContent=`⚡ +${xp} XP`;
  el.style.left=`${x}px`;
  el.style.top=`${y}px`;
  document.body.appendChild(el);
  setTimeout(()=>el.remove(),1000);
}

function checkNivelUp(xpAntes, xpDespues){
  const a=getNivel(xpAntes), b=getNivel(xpDespues);
  if(b.lv <= a.lv) return;
  const overlay=document.createElement('div');
  overlay.className='nivel-up-overlay';
  const banner=document.createElement('div');
  banner.className='nivel-up-banner';
  banner.innerHTML=`
    <div style="font-size:2.8rem;margin-bottom:.5rem">🎉</div>
    <div style="font-size:.7rem;font-weight:800;color:rgba(255,255,255,.6);text-transform:uppercase;letter-spacing:2px;margin-bottom:.3rem">¡Subiste de nivel!</div>
    <div style="font-family:'Fraunces',serif;font-size:1.6rem;font-weight:900;color:#F0C840;margin-bottom:.3rem">${b.nombre}</div>
    <div style="font-size:.8rem;color:rgba(255,255,255,.7);margin-bottom:1.2rem">Sigue así, causa 💪</div>
    <button onclick="document.querySelector('.nivel-up-banner').remove();document.querySelector('.nivel-up-overlay').remove()"
      style="background:linear-gradient(135deg,#D4A017,#F0C840);color:#1A0A2E;border:none;border-radius:50px;padding:.65rem 1.8rem;font-size:.88rem;font-weight:900;cursor:pointer">
      ¡Qué paja! →
    </button>`;
  document.body.appendChild(overlay);
  document.body.appendChild(banner);
  const close=()=>{overlay.remove();banner.remove();};
  overlay.onclick=close;
  setTimeout(close, 6000);
}

// ── Completar misión (SIN recursión en el render) ─────────────
function completarMision(id, accion){
  if(misState.hechas.includes(id)) return;
  const xpAntes = misState.totalXP;
  misState.hechas.push(id);
  const todos = [...MISIONES_BANCO,...MISIONES_NIVEL.verde,...MISIONES_NIVEL.amarillo,...MISIONES_NIVEL.rojo];
  const mis = todos.find(m=>m.id===id);
  if(mis) misState.totalXP += mis.xp;
  localStorage.setItem('uk-mis', JSON.stringify(misState));

  // Efectos visuales desde el elemento actual (sin re-renderizar primero)
  const card = document.getElementById('mc-'+id);
  if(card){
    card.classList.add('done','celebrando');
    card.querySelector('.mis-ico-wrap').textContent='✅';
    card.querySelector('.mis-check').textContent='✓';
    card.querySelector('.mis-check').style.background='#10B981';
    card.querySelector('.mis-title').style.color='#065F46';
    const rect = card.getBoundingClientRect();
    spawnConfetti(rect.left+rect.width/2, rect.top+rect.height/2);
    showXpPop(mis?.xp||10, rect.left+rect.width/2, rect.top-10);
    setTimeout(()=>card.classList.remove('celebrando'),700);
  }

  // Actualizar contadores y barra XP sin destruir el DOM completo
  actualizarXPBar();
  actualizarProgreso();
  comprobarLogros();
  checkNivelUp(xpAntes, misState.totalXP);

  // Ejecutar acción (con delay para no bloquear la animación)
  if(accion==='breath')  setTimeout(()=>showBreath(),500);
  if(accion==='chat')    setTimeout(()=>go('s-chat'),500);
  if(accion==='aprende') setTimeout(()=>go('s-aprende'),500);
  if(accion==='cita')    setTimeout(()=>go('s-cita'),500);
}

// ── Render (solo se llama al abrir la pantalla) ───────────────
function misCardHTML(m){
  const done = misState.hechas.includes(m.id);
  const urgente = m.tipo?.includes('Urgente');
  return `<div class="mis-card ${done?'done':''}" id="mc-${m.id}"
    ${done?'':'onclick="completarMision(\''+m.id+'\',\''+(m.accion||'')+'\')"'}
    style="${urgente&&!done?'border-color:#EF4444;':''}"
  >
    <div class="mis-ico-wrap" style="background:${m.bg}">${done?'✅':m.ico}</div>
    <div class="mis-info">
      <div class="mis-title">${done?'✓ ':''}${m.titulo}</div>
      <div class="mis-desc">${m.desc}</div>
      <div class="mis-reward">
        <span class="mis-xp">⚡ +${m.xp} XP</span>
        <span class="mis-tipo">${m.tipo}</span>
        ${m.accion&&!done?'<span class="mis-tipo" style="background:#EDE7F6;color:var(--pu)">→ Ir ahora</span>':''}
      </div>
    </div>
    <div class="mis-check" style="${done?'background:#10B981':''}">${done?'✓':'○'}</div>
  </div><div style="height:.5rem"></div>`;
}

function renderMisiones(){
  const hoyList   = document.getElementById('mis-hoy-list');
  const bienList  = document.getElementById('mis-bienestar-list');
  if(!hoyList||!bienList) return;
  hoyList.innerHTML  = getMisionesHoy().map(misCardHTML).join('');
  bienList.innerHTML = getMisionesNivel().map(misCardHTML).join('');
  const lbl = document.getElementById('mis-bienestar-lbl');
  const nivel = (typeof userData!=='undefined'&&userData?.nivel)||'verde';
  if(lbl) lbl.textContent = nivel==='rojo'?'🔴 MISIONES PRIORITARIAS':nivel==='amarillo'?'🟡 MISIONES DE APOYO':'💚 MISIONES DE BIENESTAR';
  actualizarXPBar();
  renderLogros();
}

function actualizarXPBar(){
  const xp  = misState.totalXP;
  const niv = getNivel(xp);
  const pct = Math.min(100,((xp-niv.min)/(niv.max-niv.min))*100);
  const el = (id)=>document.getElementById(id);
  if(el('xp-fill'))       el('xp-fill').style.width=pct+'%';
  if(el('xp-nivel-badge'))el('xp-nivel-badge').textContent=niv.nombre;
  if(el('xp-total'))      el('xp-total').textContent=xp;
  if(el('xp-actual-n'))   el('xp-actual-n').textContent=xp;
  if(el('xp-next-n'))     el('xp-next-n').textContent=niv.max+1;
  if(el('nivel-actual'))  el('nivel-actual').textContent=niv.lv;
}

function actualizarProgreso(){
  const todas = [...getMisionesHoy(),...getMisionesNivel().slice(0,1)];
  const completadas = todas.filter(m=>misState.hechas.includes(m.id)).length;
  const pval=document.getElementById('retos-pval');
  const pfil=document.getElementById('retos-pfil');
  if(pval) pval.textContent=`${completadas} / ${todas.length}`;
  if(pfil) pfil.style.width=`${Math.round((completadas/todas.length)*100)}%`;
}

function renderLogros(){
  const grid = document.getElementById('logros-grid');
  if(!grid) return;
  grid.innerHTML = LOGROS.map(l=>{
    const ok = l.cond(misState);
    return `<div class="logro ${ok?'':'locked'}" title="${l.nombre}">
      <div class="logro-ico">${l.ico}</div>
      <div class="logro-nm">${l.nombre}</div>
    </div>`;
  }).join('');
}

function comprobarLogros(){ renderLogros(); }

// ── Preview en home (sin onclick que cause recursión) ─────────
function renderHomePreview(){
  const cont = document.getElementById('home-misiones-preview');
  if(!cont) return;
  const hoy   = getMisionesHoy().slice(0,3);
  const bien  = getMisionesNivel().slice(0,1);
  const todas = [...hoy,...bien];
  const completadas = todas.filter(m=>misState.hechas.includes(m.id)).length;

  // Construimos HTML sin inline onclick que referencie renderHomePreview
  let html = `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.55rem">
    <div style="font-size:.73rem;color:var(--gr);font-weight:700">${completadas} de ${todas.length} completadas hoy</div>
    <div style="background:var(--puf);color:var(--pu);border-radius:20px;padding:.2rem .7rem;font-size:.7rem;font-weight:800;cursor:pointer" onclick="go('s-misiones')">Ver todas →</div>
  </div>`;

  html += todas.map(m=>{
    const done = misState.hechas.includes(m.id);
    // *** CLAVE: no ponemos renderHomePreview() en el onclick — evita la recursión ***
    const clickAttr = done ? '' : `data-mis-id="${m.id}" data-mis-accion="${m.accion||''}"`;
    return `<div class="mis-preview-card ${done?'done':''}" ${clickAttr} style="cursor:${done?'default':'pointer'}">
      <div class="mis-prev-ico" style="background:${m.bg}">${done?'✅':m.ico}</div>
      <div class="mis-prev-info">
        <div class="mis-prev-t">${m.titulo}</div>
        <div class="mis-prev-xp">⚡ +${m.xp} XP · ${m.tipo}</div>
      </div>
      <div class="mis-prev-check">${done?'✅':'→'}</div>
    </div>`;
  }).join('');

  cont.innerHTML = html;

  // Event delegation — UN solo listener en el contenedor
  cont.onclick = e=>{
    const card = e.target.closest('[data-mis-id]');
    if(!card) return;
    const id = card.dataset.misId;
    const accion = card.dataset.misAccion;
    completarMision(id, accion);
    // Solo actualizamos los datos y el badge sin re-renderizar todo el preview
    card.classList.add('done');
    card.removeAttribute('data-mis-id');
    card.removeAttribute('data-mis-accion');
    card.style.cursor='default';
    card.querySelector('.mis-prev-ico').textContent='✅';
    card.querySelector('.mis-prev-check').textContent='✅';
    card.querySelector('.mis-prev-t').style.color='#065F46';
    actualizarProgreso();
  };

  actualizarProgreso();
}

function doReto(){ /* legacy */ }
function openRetos(){ go('s-misiones'); }
