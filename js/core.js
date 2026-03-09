// ══ CONFIGURACIÓN ══════════════════════════════════
// ⚠️ REEMPLAZA CON TU API KEY DE GROQ (console.groq.com → API keys — GRATIS)
const APIKEY = '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';

// ══ ESTADO ════════════════════════════════════════
let userData = {};
let padreData = {};
let tamAns = [], tamStep = 0;
let nivResult = 'verde';
let citaData = { posta:'', dia:'', turno:'' };
let retosHechos = 0;

// ══ GRADOS POR NIVEL ═══════════════════════════════
const GRADOS_PRIMARIA   = ['1° Primaria','2° Primaria','3° Primaria','4° Primaria','5° Primaria','6° Primaria'];
const GRADOS_SECUNDARIA = ['1° Secundaria','2° Secundaria','3° Secundaria','4° Secundaria','5° Secundaria'];

function selNivel(nivel, btn){
  document.querySelectorAll('.nivel-btn').forEach(b=>b.classList.remove('sel'));
  btn.classList.add('sel');
  const sel = document.getElementById('reg-grado');
  sel.disabled = false;
  sel.innerHTML = '<option value="">Selecciona grado</option>';
  const grados = nivel === 'primaria' ? GRADOS_PRIMARIA : GRADOS_SECUNDARIA;
  grados.forEach(g=>{ const o=document.createElement('option'); o.value=g; o.textContent=g; sel.appendChild(o); });
  userData._nivel = nivel;
  checkRegBtn();
}

// ── Helpers para saber si un alumno es de primaria ─────────
function esPrimaria(grado){ return grado && grado.includes('Primaria'); }
function esSecundaria(grado){ return grado && grado.includes('Secundaria'); }
function getNumGrado(grado){ return parseInt((grado||'').match(/\d/)?.[0]||'1'); }


// ══ LOGIN PADRES ═══════════════════════════════════
function checkPadreLogin(){
  const ok = document.getElementById('pad-login-codigo').value.trim();
  document.getElementById('pad-login-btn').disabled = !ok;
}
function startPadre(){
  const saved = localStorage.getItem('uk_padre');
  if(saved){ padreData=JSON.parse(saved); updatePadreUI(); go('s-padres'); return; }
  go('s-login-padre');
}
function completarLoginPadre(){
  padreData = {
    codigoHijo: document.getElementById('pad-login-codigo').value.trim(),
    nombre:     document.getElementById('pad-login-nombre').value.trim() || 'Familia',
  };
  localStorage.setItem('uk_padre', JSON.stringify(padreData));
  updatePadreUI();
  go('s-padres');
}
function updatePadreUI(){
  const badge = document.getElementById('pad-nombre-badge');
  if(badge && padreData.nombre) badge.textContent = `${padreData.nombre} — código: ${padreData.codigoHijo}`;
}
function cerrarSesionPadre(){
  if(!confirm('¿Cerrar sesión familiar?\nDeberás volver a ingresar el código del estudiante.')) return;
  localStorage.removeItem('uk_padre');
  padreData = {};
  go('s-profiles');
}


// ══ VIDEOS — POR EDAD ══════════════════════════════
// Primaria (1°-6°): animados, simples, lenguaje de niños
// Secundaria (1°-5°): más profundos, lenguaje adolescente
const VIDEOS = [
  // ═══ PRIMARIA ═══
  // Emociones básicas — para niños 6-12 años
  {id:'p1', cat:'emociones', nivel:'primaria',
   yt:'zp4BMR5vij4', titulo:'¿Qué son las emociones? — Para niños',
   desc:'Aprende qué son la alegría, la tristeza, el miedo y la rabia con animaciones divertidas y fáciles de entender.',
   dur:'4 min', badge:'⭐ Para ti', char:'😊', edades:'1°-3° Primaria'},
  {id:'p2', cat:'emociones', nivel:'primaria',
   yt:'K0k7SJgKVXs', titulo:'Cómo expresar lo que siento',
   desc:'¿A veces no sabes cómo decir lo que te pasa? Este video te enseña palabras para hablar de tus emociones.',
   dur:'3 min', badge:'💬 Habla', char:'🗣️', edades:'1°-4° Primaria'},
  {id:'p3', cat:'ansiedad', nivel:'primaria',
   yt:'aXItOY0sAYM', titulo:'Respiración para calmarse — para niños',
   desc:'Cuando te sientes nervioso o asustado, esta respiración funciona en menos de 1 minuto. ¡Pruébala ahora!',
   dur:'3 min', badge:'🌬️ Técnica', char:'🫁', edades:'1°-6° Primaria'},
  {id:'p4', cat:'autoestima', nivel:'primaria',
   yt:'l_NYrWqUR40', titulo:'Soy especial: quiérete a ti mismo',
   desc:'Todos somos diferentes y eso es genial. Aprende a ver lo bueno que hay en ti con este video animado.',
   dur:'4 min', badge:'💛 Amor propio', char:'🌟', edades:'2°-6° Primaria'},
  {id:'p5', cat:'estres', nivel:'primaria',
   yt:'eLoShQ5XYAM', titulo:'Organiza tu mochila y tu día',
   desc:'Cuando hay mucha tarea y no sabes por dónde empezar, este truco sencillo te ayuda a organizarte sin estresarte.',
   dur:'3 min', badge:'🎒 Organización', char:'📚', edades:'3°-6° Primaria'},
  {id:'p6', cat:'emociones', nivel:'primaria',
   yt:'G6a070CpGj8', titulo:'¿Por qué a veces me enojo mucho?',
   desc:'La rabia es normal. Aprende para qué sirve y cómo manejarla para no meterte en problemas con tus amigos.',
   dur:'4 min', badge:'😠 Rabia', char:'🔥', edades:'2°-6° Primaria'},
  {id:'p7', cat:'autoestima', nivel:'primaria',
   yt:'FkfNSKHJIbk', titulo:'Mis superpoderes: lo que soy bueno haciendo',
   desc:'Todos tenemos talentos. Descubre los tuyos con este video divertido y aprende a usarlos cada día.',
   dur:'3 min', badge:'✨ Talentos', char:'💪', edades:'1°-6° Primaria'},
  {id:'p8', cat:'ansiedad', nivel:'primaria',
   yt:'E-BOT47LnR4', titulo:'¿Por qué me da miedo a veces?',
   desc:'El miedo es una emoción que nos protege. Pero a veces se pasa de grande. Aprende cuándo pedir ayuda.',
   dur:'4 min', badge:'😨 Miedo', char:'😰', edades:'1°-5° Primaria'},
  // ═══ SECUNDARIA ═══
  // Ansiedad — adolescentes
  {id:'s1', cat:'ansiedad', nivel:'secundaria',
   yt:'B-sjnMIdFiQ', titulo:'7 señales de que tienes ansiedad',
   desc:'Aprende qué es la ansiedad, por qué la sentimos y 3 técnicas reales para manejarla en el colegio y en casa.',
   dur:'6 min', badge:'⭐ Más visto', char:'😰', edades:'1°-5° Secundaria'},
  {id:'s2', cat:'ansiedad', nivel:'secundaria',
   yt:'nRQLzOObOoI', titulo:'Cómo manejar la ansiedad paso a paso',
   desc:'Técnica de respiración y reestructuración cognitiva explicada de forma sencilla para adolescentes.',
   dur:'5 min', badge:'🔧 Técnica', char:'🫁', edades:'1°-5° Secundaria'},
  {id:'s3', cat:'ansiedad', nivel:'secundaria',
   yt:'RcGyVTAoXEU', titulo:'La ansiedad social en el colegio',
   desc:'¿Te da vergüenza hablar en clase o estar con gente nueva? Entender la ansiedad social es el primer paso.',
   dur:'7 min', badge:'👥 Social', char:'🙈', edades:'3°-5° Secundaria'},
  // Tristeza/depresión
  {id:'s4', cat:'depresion', nivel:'secundaria',
   yt:'HznNEBACPTU', titulo:'Señales de depresión que debes conocer',
   desc:'Diferencia entre tristeza normal y señales de que necesitas apoyo profesional. Cómo dar el primer paso.',
   dur:'7 min', badge:'💜 Importante', char:'😔', edades:'2°-5° Secundaria'},
  {id:'s5', cat:'depresion', nivel:'secundaria',
   yt:'g-i6QMvIAA0', titulo:'Cómo dejar de sentirte triste',
   desc:'Cuando todo se siente pesado: técnicas basadas en evidencia para retomar el movimiento poco a poco.',
   dur:'5 min', badge:'🌱 Esperanza', char:'🌤️', edades:'1°-5° Secundaria'},
  // Autoestima
  {id:'s6', cat:'autoestima', nivel:'secundaria',
   yt:'FkfNSKHJIbk', titulo:'Construye tu autoestima',
   desc:'Identifica el diálogo interno negativo y aprende a reemplazarlo por uno que te impulse hacia adelante.',
   dur:'6 min', badge:'💪 Autoestima', char:'💪', edades:'1°-5° Secundaria'},
  {id:'s7', cat:'autoestima', nivel:'secundaria',
   yt:'1Evwgu369Jw', titulo:'Deja de compararte con los demás',
   desc:'Las redes sociales y el colegio nos hacen compararnos. Aprende por qué eso te daña y cómo parar.',
   dur:'6 min', badge:'📵 Comparación', char:'🚫', edades:'2°-5° Secundaria'},
  // Estrés
  {id:'s8', cat:'estres', nivel:'secundaria',
   yt:'hnpQrMqDoqE', titulo:'Burnout estudiantil: estás agotado/a?',
   desc:'Señales de agotamiento escolar y estrategias reales para estudiantes de colegios públicos peruanos.',
   dur:'5 min', badge:'📖 Práctico', char:'📚', edades:'3°-5° Secundaria'},
  {id:'s9', cat:'estres', nivel:'secundaria',
   yt:'eLoShQ5XYAM', titulo:'Organiza tu semana sin agobiarte',
   desc:'Cómo planificar tareas y tiempo libre de forma sencilla para sentirte menos abrumado/a cada semana.',
   dur:'4 min', badge:'🗓️ Organización', char:'🗂️', edades:'1°-5° Secundaria'},
  // Emociones/IE
  {id:'s10', cat:'emociones', nivel:'secundaria',
   yt:'G6a070CpGj8', titulo:'Inteligencia emocional explicada',
   desc:'Qué es la inteligencia emocional y por qué es más importante que las notas para tu vida.',
   dur:'6 min', badge:'🧠 IE', char:'❤️', edades:'2°-5° Secundaria'},
  {id:'s11', cat:'emociones', nivel:'secundaria',
   yt:'WPPPFqsECz0', titulo:'Controla tus emociones sin suprimirlas',
   desc:'Regulación emocional real: no se trata de no sentir, sino de responder en lugar de reaccionar.',
   dur:'7 min', badge:'⚖️ Regulación', char:'🧘', edades:'3°-5° Secundaria'},
  {id:'s12', cat:'emociones', nivel:'secundaria',
   yt:'oHv6vTKD6lg', titulo:'¿Por qué soy tan sensible?',
   desc:'Ser muy sensible no es una debilidad. Aprende cómo usar esa sensibilidad a tu favor.',
   dur:'6 min', badge:'💜 Sensibilidad', char:'🌸', edades:'1°-5° Secundaria'},
];

const CAT_NM = { ansiedad:'😰 Ansiedad', depresion:'😔 Tristeza', autoestima:'💪 Autoestima', estres:'📚 Estrés', emociones:'❤️ Emociones' };
const CAT_BANNER_DATA = {
  todos:     {ico:'🌟', t:'Todos los temas',              s:'Videos animados pensados para ti'},
  ansiedad:  {ico:'😰', t:'Ansiedad',                     s:'Entiende y maneja la ansiedad con técnicas reales'},
  depresion: {ico:'😔', t:'Tristeza',                     s:'Videos para cuando te sientes muy mal'},
  autoestima:{ico:'💪', t:'Autoestima',                   s:'Construye amor propio más allá de las notas'},
  estres:    {ico:'📚', t:'Estrés del colegio',           s:'Técnicas para manejar el estrés escolar'},
  emociones: {ico:'❤️', t:'Emociones',                   s:'Entiende tus emociones y regúlalas'},
};
let catActual = 'todos';
let videosVistos = JSON.parse(localStorage.getItem('uk-vidos')||'[]');
let aprPuntos = parseInt(localStorage.getItem('uk-aptpuntos')||'0');

function getVideosPorNivel(){
  // Filtra videos según el nivel del usuario registrado
  const nivel = userData?.nivel || 'secundaria';
  return VIDEOS.filter(v => v.nivel === nivel);
}

function marcarVisto(vid_id){
  if(!videosVistos.includes(vid_id)){
    videosVistos.push(vid_id);
    aprPuntos += 10;
    localStorage.setItem('uk-vidos', JSON.stringify(videosVistos));
    localStorage.setItem('uk-aptpuntos', String(aprPuntos));
    const ptEl = document.getElementById('apr-pts-v');
    if(ptEl) ptEl.textContent = aprPuntos;
    const card = document.getElementById('vc-'+vid_id);
    if(card){ card.style.borderColor='#10B981'; setTimeout(()=>card.style.borderColor='transparent',1800); }
  }
}

function renderVideos(){
  const lista = document.getElementById('videos-list');
  if(!lista) return;
  // Banner por categoría
  const bd = CAT_BANNER_DATA[catActual]||CAT_BANNER_DATA.todos;
  const bIco=document.getElementById('apr-banner-ico'), bT=document.getElementById('apr-banner-t'), bS=document.getElementById('apr-banner-s');
  if(bIco) bIco.textContent=bd.ico;
  if(bT) bT.textContent=bd.t;
  if(bS) bS.textContent=bd.s;
  // Badge de nivel en la sección
  const lvlBadge = document.getElementById('apr-nivel-badge');
  if(lvlBadge){
    const niv = userData?.nivel || 'secundaria';
    lvlBadge.textContent = niv==='primaria' ? '🏫 Primaria' : '🎓 Secundaria';
    lvlBadge.style.display = 'inline-block';
  }
  const ptEl=document.getElementById('apr-pts-v'); if(ptEl) ptEl.textContent=aprPuntos;
  const baseVideos = getVideosPorNivel();
  const filtrados = catActual==='todos' ? baseVideos : baseVideos.filter(v=>v.cat===catActual);
  if(filtrados.length===0){
    lista.innerHTML=`<div style="text-align:center;padding:2rem 1rem;color:var(--gr);font-size:.85rem">
      <div style="font-size:2rem;margin-bottom:.5rem">🎬</div>
      No hay videos de este tema para tu grado todavía.<br>
      <span style="font-size:.75rem;color:var(--pul);font-weight:700;cursor:pointer" onclick="filtrarVideos('todos',null,'eb-todos')">Ver todos los videos →</span>
    </div>`;
    return;
  }
  lista.innerHTML = filtrados.map((v,i)=>{
    const vid_id = v.id||v.yt;
    const visto = videosVistos.includes(vid_id);
    return `<div class="vid-card" id="vc-${vid_id}" style="${visto?'border-color:#D1FAE5;':''}" onclick="marcarVisto('${vid_id}')">
      <div class="vid-thumb">
        <iframe src="https://www.youtube.com/embed/${v.yt}?rel=0&modestbranding=1" allowfullscreen loading="lazy"></iframe>
        ${visto ? '<div style="position:absolute;top:.5rem;right:.5rem;background:#10B981;color:#fff;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:.82rem;font-weight:900;z-index:2">✓</div>' : ''}
      </div>
      <div class="vid-info">
        <div class="vid-cat">${CAT_NM[v.cat]||v.cat}${v.edades ? ` <span style="font-size:.6rem;background:var(--gof);color:var(--go);border-radius:6px;padding:.1rem .4rem;margin-left:.3rem;font-weight:800">${v.edades}</span>` : ''}</div>
        <div class="vid-title">${v.titulo}</div>
        <div class="vid-desc">${v.desc}</div>
        <div class="vid-meta">
          <span class="vid-dur">⏱ ${v.dur}</span>
          <span class="vid-badge">${v.badge}</span>
          ${visto ? '<span class="vid-visto">✓ Visto +10⭐</span>' : '<span style="background:var(--gof);color:#7A5C00;border-radius:7px;padding:.18rem .48rem;font-size:.65rem;font-weight:800">+10 ⭐</span>'}
        </div>
      </div>
    </div>`;
  }).join('');
}

function filtrarVideos(cat, btn, ecId){
  catActual=cat;
  document.querySelectorAll('.echar-big').forEach(e=>e.classList.remove('act'));
  if(ecId) document.getElementById(ecId)?.classList.add('act');
  renderVideos();
}

// ══ PERSONAJES SVG ═════════════════════════════════
function charVerde(){return` <img src="imagenes/animacion1.png" alt="UmaKay" style="width:90px;height:90px;object-fit:contain;border-radius:50%;margin:0 auto .6rem;display:block;filter:drop-shadow(0 4px 12px rgba(107,63,160,.3))"/>`;}

function charAmarillo(){return`<svg width="110" height="100" viewBox="0 0 110 100" class="char-bounce">
  <ellipse cx="55" cy="42" rx="27" ry="23" fill="#9B6DD4"/>
  <ellipse cx="55" cy="42" rx="23" ry="19" fill="#B08AE0"/>
  <path d="M36 36 Q43 30 51 36 Q58 42 66 36 Q72 30 78 36" stroke="#7A52B0" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <ellipse cx="44" cy="41" rx="5" ry="5.5" fill="#fff"/>
  <ellipse cx="66" cy="41" rx="5" ry="5.5" fill="#fff"/>
  <circle cx="45" cy="41" r="2.8" fill="#2D1B6B"/><circle cx="67" cy="41" r="2.8" fill="#2D1B6B"/>
  <path d="M47 53 Q55 57 63 53" stroke="#6B3FA0" stroke-width="2" fill="none" stroke-linecap="round"/>
  <ellipse cx="25" cy="50" rx="7" ry="4" fill="#9B6DD4" transform="rotate(-25 25 50)"/>
  <ellipse cx="85" cy="50" rx="7" ry="4" fill="#9B6DD4" transform="rotate(25 85 50)"/>
  <ellipse cx="46" cy="68" rx="6" ry="8" fill="#8B5FC0"/>
  <ellipse cx="64" cy="68" rx="6" ry="8" fill="#8B5FC0"/>
  <ellipse cx="45" cy="77" rx="8" ry="4" fill="#D4A017"/>
  <ellipse cx="65" cy="77" rx="8" ry="4" fill="#D4A017"/>
  <text x="28" y="22" font-size="16" fill="#F59E0B">💛</text>
</svg>`;}

function charRojo(){return`<svg width="110" height="100" viewBox="0 0 110 100" class="char-bounce">
  <ellipse cx="55" cy="42" rx="27" ry="23" fill="#8B5FC0"/>
  <ellipse cx="55" cy="42" rx="23" ry="19" fill="#9B6DD4"/>
  <path d="M36 36 Q43 30 51 36 Q58 42 66 36 Q72 30 78 36" stroke="#6B3FA0" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <ellipse cx="44" cy="41" rx="5" ry="5.5" fill="#fff"/>
  <ellipse cx="66" cy="41" rx="5" ry="5.5" fill="#fff"/>
  <circle cx="45" cy="42" r="2.8" fill="#2D1B6B"/><circle cx="67" cy="42" r="2.8" fill="#2D1B6B"/>
  <!-- Cejas preocupadas -->
  <path d="M41 37 Q44 35 47 37" stroke="#4A2575" stroke-width="2" fill="none"/>
  <path d="M63 37 Q66 35 69 37" stroke="#4A2575" stroke-width="2" fill="none"/>
  <!-- Boca triste -->
  <path d="M48 55 Q55 50 62 55" stroke="#6B3FA0" stroke-width="2" fill="none" stroke-linecap="round"/>
  <!-- Lágrima -->
  <ellipse cx="48" cy="48" rx="2" ry="3" fill="rgba(100,150,255,.5)"/>
  <ellipse cx="25" cy="52" rx="7" ry="4" fill="#8B5FC0" transform="rotate(-30 25 52)"/>
  <ellipse cx="85" cy="52" rx="7" ry="4" fill="#8B5FC0" transform="rotate(30 85 52)"/>
  <ellipse cx="46" cy="68" rx="6" ry="8" fill="#7A4FB0"/>
  <ellipse cx="64" cy="68" rx="6" ry="8" fill="#7A4FB0"/>
  <ellipse cx="45" cy="77" rx="8" ry="4" fill="#C4901A"/>
  <ellipse cx="65" cy="77" rx="8" ry="4" fill="#C4901A"/>
  <text x="62" y="22" font-size="14" fill="#9B6DD4">💜</text>
</svg>`;}

// ══ NAVEGACIÓN ════════════════════════════════════
function go(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0,0);
  if(id==='s-chat' && chatHist.length===0) initChat();
  if(id==='s-aprende'){
    catActual='todos';
    document.querySelectorAll('.echar-big').forEach(e=>e.classList.remove('act'));
    document.getElementById('eb-todos')?.classList.add('act');
    const ptEl=document.getElementById('apr-pts-v'); if(ptEl) ptEl.textContent=aprPuntos;
    const days=parseInt(localStorage.getItem('uk-astreak')||'0');
    const sm=document.getElementById('apr-streak-msg'),sn=document.getElementById('apr-streak-n');
    if(sm) sm.textContent=days>0?`¡Llevas ${days} día${days>1?'s':''} aprendiendo!`:'¡Empieza tu racha hoy!';
    if(sn) sn.textContent=days;
    renderVideos();
  }
  if(id==='s-misiones'){ renderMisiones(); }
  if(id==='s-home'){ renderHomePreview(); }
  if(id==='s-pad-cap'){ setTimeout(initPadCaps,30); }
}
function comingSoon(){ alert('🚧 Próximamente\nEsta sección estará disponible pronto.'); }

// ══ REGISTRO ESTUDIANTE ════════════════════════════
function startStudent(){
  const saved = localStorage.getItem('uk_user');
  if(saved){
    userData=JSON.parse(saved);
    const tam=localStorage.getItem('uk_tam');
    if(tam){ updateHomeSaludo(); go('s-home'); }
    else{ tamAns=[]; tamStep=0; renderTam(); go('s-tamizaje'); }
    return;
  }
  go('s-registro');
}
function checkRegBtn(){
  const ok = document.getElementById('reg-codigo').value.trim() &&
             document.getElementById('reg-grado').value &&
             document.getElementById('reg-seccion').value;
  document.getElementById('reg-btn').disabled=!ok;
}
function completarRegistro(){
  const grado   = document.getElementById('reg-grado').value;
  const seccion = document.getElementById('reg-seccion').value;
  userData={
    codigo:  document.getElementById('reg-codigo').value.trim(),
    nombre:  document.getElementById('reg-nombre').value.trim()||null,
    grado,
    seccion,
    nivel:   esPrimaria(grado) ? 'primaria' : 'secundaria',
    numGrado: getNumGrado(grado),
  };
  localStorage.setItem('uk_user',JSON.stringify(userData));
  tamAns=[]; tamStep=0; renderTam(); go('s-tamizaje');
}
function updateHomeSaludo(){
  const el=document.getElementById('home-saludo');
  if(!el) return;
  const nombre = userData.nombre || `${userData.grado} ${userData.seccion}`;
  el.textContent=`¡Hola, ${nombre}! 👋`;
  // Mostrar badge de grado
  const badge = document.getElementById('home-grado-badge');
  if(badge && userData.grado){
    badge.textContent = `${userData.grado} ${userData.seccion}`;
    badge.style.display='inline-block';
  }
}
function cerrarSesionEstudiante(){
  if(!confirm('¿Cerrar sesión?\nTu progreso quedará guardado.')) return;
  localStorage.removeItem('uk_user');
  localStorage.removeItem('uk_tam');
  userData = {};
  go('s-profiles');
}

// ══ TAMIZAJE ══════════════════════════════════════
const PQS=[
  {b:'Bloque 1 · Estado de ánimo',q:'En las últimas 2 semanas, ¿con qué frecuencia te sentiste triste o sin ganas de hacer nada?',o:['😊 Nunca','🙂 Algunos días','😔 Más de la mitad de días','😢 Casi todos los días'],c:false},
  {b:'Bloque 1 · Estado de ánimo',q:'¿Has perdido interés en cosas que antes te gustaban, como jugar, salir o hablar con amigos?',o:['😊 Nunca','🙂 Algunos días','😔 Más de la mitad de días','😢 Casi todos los días'],c:false},
  {b:'Bloque 1 · Estado de ánimo',q:'¿Te has sentido sin energía o muy cansado/a aunque hayas dormido bien?',o:['😊 Nunca','🙂 Algunos días','😔 Más de la mitad de días','😢 Casi todos los días'],c:false},
  {b:'Bloque 1 · Estado de ánimo',q:'¿Has tenido pensamientos de que sería mejor no estar aquí, o de hacerte daño?',o:['😊 Nunca','🙂 Rara vez','😔 A veces','😢 Con frecuencia'],c:true},
  {b:'Bloque 2 · Ansiedad',q:'¿Con qué frecuencia te has sentido nervioso/a, ansioso/a o con los nervios de punta?',o:['😊 Nunca','🙂 Algunos días','😔 Más de la mitad de días','😢 Casi todos los días'],c:false},
  {b:'Bloque 2 · Ansiedad',q:'¿Has tenido dificultad para dejar de preocuparte por las cosas del colegio, familia u otras?',o:['😊 Nunca','🙂 Algunos días','😔 Más de la mitad de días','😢 Casi todos los días'],c:false},
  {b:'Bloque 2 · Ansiedad',q:'¿Sientes el corazón acelerado, te sudan las manos o te falta el aire sin razón aparente?',o:['😊 Nunca','🙂 A veces','😔 Frecuentemente','😢 Casi siempre'],c:false},
  {b:'Bloque 2 · Ansiedad',q:'¿Has evitado ir al colegio o salir de casa por miedo, nervios o tristeza?',o:['😊 Nunca','🙂 Una o dos veces','😔 Varias veces','😢 Con mucha frecuencia'],c:false},
  {b:'Bloque 3 · Sueño y concentración',q:'¿Cómo ha sido tu sueño en las últimas semanas?',o:['😊 Duermo bien','🙂 A veces me cuesta','😔 Me cuesta bastante','😢 No puedo dormir bien'],c:false},
  {b:'Bloque 3 · Sueño y concentración',q:'¿Te ha costado concentrarte en clases o tareas más de lo normal?',o:['😊 No, me concentro bien','🙂 Un poco','😔 Bastante','😢 No puedo concentrarme'],c:false},
  {b:'Bloque 4 · Entorno y relaciones',q:'¿Te has sentido solo/a o que nadie te entiende?',o:['😊 Nunca','🙂 Algunos días','😔 Con frecuencia','😢 Casi siempre'],c:false},
  {b:'Bloque 4 · Entorno y relaciones',q:'¿Has tenido conflictos frecuentes con tus amigos, compañeros o familia?',o:['😊 No','🙂 Alguna vez','😔 Frecuentemente','😢 Todo el tiempo'],c:false},
  {b:'Bloque 4 · Entorno y relaciones',q:'¿Alguien en tu entorno te ha hecho sentir mal, agredido o humillado?',o:['😊 No','🙂 Una vez','😔 Varias veces','😢 Con frecuencia'],c:false},
  {b:'Bloque 5 · Autocuidado',q:'¿Has comido muy poco o demasiado sin querer en las últimas semanas?',o:['😊 No, como normal','🙂 Un poco diferente','😔 Bastante diferente','😢 Muy diferente a lo normal'],c:false},
  {b:'Bloque 5 · Autocuidado',q:'¿Cómo describirías tu bienestar general en este momento?',o:['😊 Me siento bien','🙂 Más o menos','😔 No muy bien','😢 Me siento muy mal'],c:false},
];

function renderTam(){
  const p=PQS[tamStep];
  document.getElementById('t-sub').textContent=`Pregunta ${tamStep+1} de ${PQS.length}`;
  document.getElementById('t-blk').textContent=p.b;
  document.getElementById('t-q').textContent=p.q;
  document.getElementById('t-crisis').style.display=p.c?'block':'none';
  document.getElementById('t-pf').style.width=`${((tamStep+1)/PQS.length)*100}%`;
  document.getElementById('t-bk').style.visibility=tamStep===0?'hidden':'visible';
  document.getElementById('t-nx').disabled=tamAns[tamStep]===undefined;
  const el=document.getElementById('t-opts'); el.innerHTML='';
  p.o.forEach((opt,i)=>{
    const parts=opt.split(' '); const e=parts[0]; const t=parts.slice(1).join(' ');
    const b=document.createElement('button'); b.className='t-opt'+(tamAns[tamStep]===i?' sel':'');
    b.innerHTML=`<span class="t-opt-e">${e}</span><span class="t-opt-t">${t}</span>`;
    b.onclick=()=>{
      document.querySelectorAll('.t-opt').forEach(x=>x.classList.remove('sel'));
      b.classList.add('sel'); tamAns[tamStep]=i;
      document.getElementById('t-nx').disabled=false;
    };
    el.appendChild(b);
  });
}
function tamBack(){if(tamStep>0){tamStep--;renderTam();}}
function tamNext(){
  if(tamAns[tamStep]===undefined) return;
  if(tamStep<PQS.length-1){tamStep++;renderTam();}
  else calcResult();
}

// ══ RESULTADO ═════════════════════════════════════
async function calcResult(){
  go('s-resultado');
  const score=tamAns.reduce((a,b)=>a+b,0);
  const crisis=tamAns[3]>=2;
  const tag=`🎓 ${userData.grado}${userData.seccion} · Código ...${(userData.codigo||'').slice(-4)}`;
  document.getElementById('rc-tag').textContent=tag;

  let charHtml, niv, nvCls, title, txt;
  if(crisis){
    charHtml=charRojo(); niv='🚨 Atención urgente'; nvCls='nv-ur'; nivResult='urgente';
    title='Necesitas apoyo ahora mismo';
    txt='Gracias por tu honestidad. Lo que sientes es real e importante. Hay personas que quieren ayudarte hoy.';
    document.getElementById('rc-crisis').style.display='block';
  } else if(score<=10){
    charHtml=charVerde(); niv='🟢 Bienestar estable'; nvCls='nv-ve'; nivResult='verde';
    title='¡Estás bien!';
    txt='Tus respuestas muestran un estado de bienestar adecuado. Sigue usando UmaKay para mantener tus hábitos saludables.';
    spawnConfetti();
  } else if(score<=20){
    charHtml=charAmarillo(); niv='🟡 Señales de alerta'; nvCls='nv-am'; nivResult='amarillo';
    title='Hay algunas señales a atender';
    txt='Tus respuestas muestran señales que vale trabajar. No estás solo/a — UmaKay hará seguimiento semanal contigo.';
  } else {
    charHtml=charRojo(); niv='🔴 Atención prioritaria'; nvCls='nv-ro'; nivResult='rojo';
    title='Te mereces apoyo profesional';
    txt='Estás pasando por un momento difícil. Es importante hablar con alguien esta semana — UmaKay te ayuda a dar ese paso.';
  }

  document.getElementById('res-char-wrap').innerHTML=charHtml;
  document.getElementById('rc-niv').textContent=niv;
  document.getElementById('rc-niv').className=`rc-niv ${nvCls}`;
  document.getElementById('rc-title').textContent=title;
  document.getElementById('rc-txt').textContent=txt;

  const resumen=PQS.map((p,i)=>`${p.q}: ${p.o[tamAns[i]||0]}`).join('\n');
  try{
    const ia=await askClaude([{role:'user',content:`Analiza este tamizaje de un adolescente peruano (puntaje ${score}/42) y escribe un mensaje personalizado, cálido y esperanzador en español simple (máximo 2 oraciones). NO diagnostiques. Sé empático y real.\n${resumen}`}],150,'Eres asistente empático de salud mental para adolescentes peruanos. Español simple y cálido.');
    document.getElementById('rc-ia-txt').textContent=ia;
  } catch(e){
    document.getElementById('rc-ia-txt').textContent='Lo que sientes es válido y UmaKay está aquí para acompañarte en cada paso del camino. 💜';
  }
  localStorage.setItem('uk_tam',JSON.stringify({score,niv,date:new Date().toISOString()}));
  updateHomeSaludo();
  updateTips();
}

function spawnConfetti(){
  const colors=['#D4A017','#6B3FA0','#10B981','#F59E0B','#8B5FC0','#4ADE80'];
  const c=document.getElementById('confetti'); c.innerHTML='';
  for(let i=0;i<20;i++){
    const d=document.createElement('div'); d.className='cfl';
    d.style.cssText=`left:${Math.random()*100}%;background:${colors[i%colors.length]};animation-delay:${Math.random()*.7}s;animation-duration:${1+Math.random()*.9}s;top:${-10+Math.random()*20}px;transform:rotate(${Math.random()*360}deg)`;
    c.appendChild(d);
  }
}

function irABienvenida(){
  const nombre=userData.nombre?`, ${userData.nombre}`:'';
  const niveles={
    verde:{
      charFn:charVerde,
      titulo:`¡Estás en buen camino${nombre}! 🌟`,
      sub:'Esto es lo que UmaKay hará por ti:',
      steps:[{i:'📅',t:'Check-in diario',s:'30 segundos cada mañana para registrar cómo estás'},
             {i:'💬',t:'Chat siempre disponible',s:'Habla con la IA cuando lo necesites, sin esperas'},
             {i:'🎓',t:'Videos y retos',s:'Aprende sobre tu mente con videos animados y retos semanales'}]
    },
    amarillo:{
      charFn:charAmarillo,
      titulo:`Estamos aquí contigo${nombre} 💛`,
      sub:'Detectamos algunas señales. Esto es lo que haremos juntos:',
      steps:[{i:'📊',t:'Seguimiento semanal',s:'Te preguntaremos cómo estás cada semana para acompañarte'},
             {i:'💬',t:'Chat de apoyo 24/7',s:'Un asistente disponible cuando sientas que necesitas hablar'},
             {i:'👨‍🏫',t:'Apoyo del orientador',s:'Tu tutor recibirá una alerta general — sin ver tu contenido'}]
    },
    rojo:{
      charFn:charRojo,
      titulo:`No estás solo/a${nombre} 💜`,
      sub:'Lo que sientes es válido. Vamos paso a paso:',
      steps:[{i:'🏥',t:'Cita en posta cercana',s:'Te ayudamos a agendar una cita profesional esta semana'},
             {i:'💬',t:'Chat de apoyo ahora',s:'Habla con nosotros en este momento si lo necesitas'},
             {i:'📞',t:'Línea 113 opción 5',s:'Apoyo profesional gratuito disponible 24/7'}]
    },
    urgente:{
      charFn:charRojo,
      titulo:`Hay personas que quieren ayudarte 🚨`,
      sub:'Lo que sientes importa muchísimo. Haz esto ahora:',
      steps:[{i:'📞',t:'Llama: Línea 113 opción 5',s:'Gratis, 24/7, completamente confidencial'},
             {i:'🏥',t:'Ir a la posta más cercana',s:'C.S. Santa Rosa — Av. Los Pinos 234 (0.8 km)'},
             {i:'👨‍🏫',t:'Habla con tu orientador hoy',s:'Está preparado y entrenado para ayudarte'}]
    }
  };
  const n=niveles[nivResult]||niveles.verde;
  document.getElementById('bv-char').innerHTML=n.charFn();
  document.getElementById('bv-titulo').textContent=n.titulo;
  document.getElementById('bv-sub').textContent=n.sub;
  const sc=document.getElementById('bv-steps'); sc.innerHTML='';
  n.steps.forEach(s=>{
    sc.innerHTML+=`<div class="bv-step"><div class="bv-step-ico">${s.i}</div><div><div class="bv-step-t">${s.t}</div><div class="bv-step-s">${s.s}</div></div></div>`;
  });
  go('s-bienvenida');
}

// ══ TIPS ══════════════════════════════════════════
const TIPS=[
  {t:'Respiración',tx:'Respirar profundo 3 veces activa el sistema nervioso parasimpático y reduce la ansiedad en menos de 60 segundos.'},
  {t:'Dato del día',tx:'Dormir 8 horas mejora la memoria un 40%. Tu cerebro procesa lo que aprendiste mientras duermes.'},
  {t:'Recuerda',tx:'Pedir ayuda no es debilidad — es inteligencia emocional. Los valientes hablan cuando lo necesitan.'},
  {t:'Tip de bienestar',tx:'Caminar 10 minutos al día reduce el estrés tanto como 45 minutos de ejercicio intenso.'},
  {t:'Lo sabías',tx:'Escribir en un diario por 5 minutos reduce la ansiedad. No hace falta que sea perfecto.'},
];
function updateTips(){
  const t=TIPS[Math.floor(Math.random()*TIPS.length)];
  document.getElementById('tip-titulo').textContent=t.t;
  document.getElementById('tip-txt').textContent=t.tx;
}

// ══ CHECK-IN ══════════════════════════════════════
function mood(btn,m){
  document.querySelectorAll('.ci-btn').forEach(b=>b.classList.remove('sel'));
  btn.classList.add('sel');
  setTimeout(()=>{
    if(['Mal','Muy mal'].includes(m)){
      if(confirm(`Entiendo que hoy te sientes "${m.toLowerCase()}" 💙\n\n¿Te gustaría hablar con alguien de forma anónima ahora?`)) go('s-chat');
    } else {
      alert(`¡Qué bueno que te sientes ${m.toLowerCase()}! 🌟\nUmaKay siempre está aquí para ti.`);
    }
  },250);
}

// ══ RETOS DIARIOS ═════════════════════════════════
let retosCompletados=new Set();
// ══ CITA ══════════════════════════════════════════
function selPosta(id,nm,dist){
  document.querySelectorAll('.posta-card').forEach(c=>c.classList.remove('sel'));
  document.getElementById(id).classList.add('sel');
  citaData.posta=nm+' · '+dist; checkCitaBtn();
}
function selDia(id,dia){
  document.querySelectorAll('.hora-btn').forEach(c=>c.classList.remove('sel'));
  document.getElementById(id).classList.add('sel');
  citaData.dia=dia; checkCitaBtn();
}
function selTurno(id,turno){
  document.querySelectorAll('.turno-btn').forEach(c=>c.classList.remove('sel'));
  document.getElementById(id).classList.add('sel');
  citaData.turno=turno; checkCitaBtn();
}
function checkCitaBtn(){
  document.getElementById('cita-btn').disabled=!(citaData.posta&&citaData.dia&&citaData.turno);
}
function confirmarCita(){
  const tam=JSON.parse(localStorage.getItem('uk_tam')||'{}');
  document.getElementById('c-posta').textContent=citaData.posta;
  document.getElementById('c-dia').textContent=citaData.dia;
  document.getElementById('c-turno').textContent=citaData.turno;
  document.getElementById('c-nivel').textContent=tam.niv||'Seguimiento general';
  const grid=document.getElementById('qr-grid'); grid.innerHTML='';
  const p=[1,1,1,0,1,1,1,1,0,0,0,0,1,1,1,0,1,0,0,1,1,1,0,0,1,0,1,0,1,1,1,0,1,0,1,0,1,0,0,1,1,1,0,0,0,0,1,0,1,1,1,0,0,0,0,1,0,1,1,1,0,1,0,1,1,1,0,0,0,1,0,0,1,0,1,1,0,0,1,0,1,0,1,0,0,0,1,1,1,0,1,0,0,0,1,1,0,1];
  for(let i=0;i<49;i++){const c=document.createElement('div');c.className='qr-cell';c.style.background=p[i%p.length]?'#1A0A2E':'transparent';grid.appendChild(c);}
  go('s-confirmcita');
}

// ══ GROQ API (GRATIS) ═════════════════════════════
async function askClaude(messages,maxTok=600,system){
  if(!APIKEY || APIKEY==='REEMPLAZA_CON_TU_API_KEY_GROQ'){
    throw new Error('API key de Groq no configurada en js/core.js');
  }
  const msgs = [];
  if(system) msgs.push({role:'system', content:system});
  msgs.push(...messages);

  let r;
  try{
    r=await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer '+APIKEY
      },
      body:JSON.stringify({
        model:'llama-3.1-8b-instant',
        max_tokens:maxTok,
        messages:msgs
      })
    });
  }catch(netErr){
    console.error('[UmaKay] Error de red:', netErr);
    throw new Error('Sin conexion a internet');
  }
  let d;
  try{ d=await r.json(); }
  catch(e){ throw new Error('HTTP '+r.status+' '+r.statusText); }
  if(d.error){
    console.error('[UmaKay] Groq error:', JSON.stringify(d.error));
    throw new Error(d.error.message);
  }
  if(!d.choices || !d.choices[0]){ throw new Error('Respuesta vacia de Groq'); }
  return d.choices[0].message.content;
}

// ══ CHATBOT ═══════════════════════════════════════
let chatHist=[],botBusy=false;
// ══ SISTEMA DE ALERTAS ════════════════════════════════════════
// Palabras que activan ALERTA NARANJA (maltrato/abuso)
const KEYWORDS_ABUSO = [
  'me pegó','me golpeó','me pega','me golpea','me jala','me hala',
  'me quema','me amarra','me encierra','me chantajea','me toca',
  'padrastro','mamá me','papá me','me hace daño','me hizo daño',
  'abuso','abusó','violencia en casa','me maltrata','me maltrató',
  'me duele porque','me lastimó','no me deja salir','me amedrenta',
  'me tiene miedo','tengo miedo en casa','me amenaza'
];
// Palabras que sugieren BROMA
const KEYWORDS_BROMA = [
  'jajaja','jeje','es broma','en broma','de mentira','XD','lol',
  'chiste','a ver qué dice','a ver cómo','probando','test','esto es mentira',
  'no es cierto','lo inventé'
];
// Contador de alertas falsas por sesión
let falsasAlertas = 0;
let alertaNaranjaActiva = false;
let bromaDetectada = false;
let esperandoConfirmacion = false;

function detectarAlerta(texto) {
  const t = texto.toLowerCase();
  // Detectar broma primero
  if (KEYWORDS_BROMA.some(k => t.includes(k))) return 'broma';
  // Detectar abuso/maltrato
  if (KEYWORDS_ABUSO.some(k => t.includes(k))) return 'naranja';
  return null;
}

function activarAlertaNaranja() {
  alertaNaranjaActiva = true;
  // En producción: llamada al backend para notificar al orientador
  console.log('[UMAKAY ALERTA NARANJA] Código:', userData.codigo, '- Grado:', userData.grado, userData.seccion);
  // Mostrar banner discreto en el chat
  const c = document.getElementById('cmsgs');
  const banner = document.createElement('div');
  banner.style.cssText = 'background:linear-gradient(135deg,#FEF3C7,#FDE68A);border:1.5px solid #F59E0B;border-radius:12px;padding:.65rem .9rem;font-size:.73rem;font-weight:700;color:#78350F;margin:.4rem 0;text-align:center;';
  banner.innerHTML = '🛡️ Tu mensaje fue recibido con cuidado. Una persona de confianza en tu colegio será notificada para apoyarte. Tú no estás solo/a.';
  c.appendChild(banner);
  scrollC();
}

function registrarFalsaAlerta() {
  falsasAlertas++;
  const cod = userData.codigo || 'anon';
  try { 
    const prev = JSON.parse(localStorage.getItem('uk_bromas')||'{}');
    prev[cod] = (prev[cod]||0) + 1;
    localStorage.setItem('uk_bromas', JSON.stringify(prev));
    if(prev[cod] >= 2) {
      // Notificar al orientador — anonimato levantado para este comportamiento
      console.log('[UMAKAY BROMA REITERADA] Código:', cod, '- Orientador notificado');
    }
  } catch(e){}
}

const SYS = `Eres el asistente de UmaKay, app de salud mental para estudiantes de colegios públicos del Perú.
ROL: Escuchar activamente, validar emociones y orientar hacia recursos. NUNCA diagnostiques ni des consejos médicos.

LENGUAJE:
- Cálido, cercano y natural. Habla como una persona real que escucha de verdad.
- NADA de jergas forzadas. Suenan artificiales y rompen la confianza.
- Usa frases simples y honestas: "Tiene sentido que te sientas así", "Eso suena muy difícil", "Gracias por contarme".
- Máximo 3-4 oraciones por respuesta. 1 emoji solo cuando aporte calidez, no de relleno.
- Con primaria: lenguaje más simple y suave. Con secundaria: más maduro y directo.

CONFIANZA — cómo ganarla:
- Valida PRIMERO siempre, antes de cualquier consejo o pregunta
- Nunca respondas de forma genérica. Si dicen "me siento mal", pregunta por esa situación específica
- Si detectas humor o broma: "Oye, lo que dices suena importante — ¿me lo cuentas de verdad?"
- Si confirman que es broma: "Entiendo 😄 Cuando quieras hablar de algo, aquí estoy."
- No juzgues el humor — muchos adolescentes lo usan para hablar de cosas difíciles

MALTRATO Y ABUSO EN CASA — protocolo obligatorio:
Si el alumno menciona golpes, maltrato físico, abuso, violencia del padrastro/padre/madre/familiar:
1. Responde con MUCHA calma: "Gracias por contarme eso. Lo que describes es serio y merece atención."
2. NO preguntes detalles del abuso — solo escucha lo que quiera compartir
3. Informa con calma: "Voy a hacer que alguien de confianza en tu colegio esté al tanto para apoyarte. Nadie más sabrá lo que me contaste."
4. Da recursos: "También puedes llamar al 100 (MIMP) o al 1800-MUJER — gratis, 24/7, desde cualquier celular"
5. NUNCA sugieras hablar con los padres si el abuso viene de ellos

CRISIS INMEDIATA (ideas de hacerse daño o suicidio):
→ Da inmediatamente: "Línea 113 opción 5, 24h, gratis y confidencial"
→ Muestra calma absoluta, no alarmes

RESPONDE SIEMPRE en español, tono cálido y natural.`;


// ══ DETECCIÓN DE ALERTAS EN botReply ══════════════════════════
async function botReply(txt) {
  if(botBusy) return; botBusy=true; document.getElementById('sbtn').disabled=true;
  
  // Analizar el texto antes de enviar a Claude
  const alerta = detectarAlerta(txt);
  
  if(alerta === 'broma' && !esperandoConfirmacion) {
    bromaDetectada = true;
    esperandoConfirmacion = true;
    hideTyp();
    // Respuesta de verificación
    setTimeout(()=>{
      addBot('Oe, lo que me dices suena importante 👀 Solo quiero asegurarme — ¿me lo estás contando de verdad, o estás probando cómo funciona la app?', [
        {e:'✅', t:'Te lo cuento de verdad, es real'},
        {e:'😄', t:'Jaja era broma, solo probando'},
      ]);
      botBusy=false; document.getElementById('sbtn').disabled=false;
      esperandoConfirmacion=false;
    }, 800);
    return;
  }
  
  if(alerta === 'naranja' && !alertaNaranjaActiva) {
    activarAlertaNaranja();
  }
  
  // Enviar a Claude con contexto de alerta si aplica
  const sysConAlerta = alerta === 'naranja' 
    ? SYS + '\n\nCONTEXTO ESPECIAL: El alumno acaba de mencionar situación de maltrato o violencia en casa. Activa el protocolo de maltrato descrito arriba.'
    : SYS;
  
  showTyp();
  try{
    const reply = await askClaude([...chatHist], 500, sysConAlerta);
    hideTyp();
    chatHist.push({role:'assistant', content:reply});
    addBot(reply);
  } catch(e){
    hideTyp();
    console.error('[UmaKay] botReply error:', e.message);
    // Mostrar error específico en desarrollo, mensaje amigable en producción
    const devMsg = e.message ? ` (${e.message})` : '';
    addBot('Perdona, hubo un problema de conexión. ¿Puedes intentarlo de nuevo? 💙' + (window.location.protocol==='file:' ? devMsg : ''));
  }
  botBusy=false; document.getElementById('sbtn').disabled=false;
}

async function sendMsg(){
  const inp=document.getElementById('cinp');
  const txt=inp.value.trim(); if(!txt||botBusy) return;
  
  // Verificar si el usuario está respondiendo sobre una broma previa
  if(bromaDetectada) {
    bromaDetectada=false;
    if(txt.toLowerCase().includes('broma') || txt.toLowerCase().includes('probando') || txt.toLowerCase().includes('jaja')) {
      registrarFalsaAlerta();
    }
  }
  
  inp.value=''; inp.style.height='auto';
  addUser(txt); chatHist.push({role:'user',content:txt}); botReply(txt);
}

function initChat(){
  chatHist=[];
  document.getElementById('cmsgs').innerHTML='';
  const nom=userData.nombre?`, ${userData.nombre}`:'';
  setTimeout(()=>addBot(`Hola${nom} 👋 Soy UmaKay.\n\nEste espacio es completamente anónimo — nadie más puede leer esto.\n\n¿Cómo te has sentido esta semana? 🌿`,[
    {e:'😄',t:'Bien, me siento tranquilo/a'},
    {e:'😐',t:'Más o menos, con altibajos'},
    {e:'😔',t:'No muy bien, con tristeza'},
    {e:'😰',t:'Con mucha ansiedad o estrés'},
  ]),700);
}

function addBot(text,opts){
  const c=document.getElementById('cmsgs');
  const d=document.createElement('div'); d.className='msg bot';
  d.innerHTML=`<div class="mb">${text.replace(/\n/g,'<br>')}</div><div class="mt">${now()}</div>`;
  c.appendChild(d);
  if(opts){
    const oc=document.createElement('div'); oc.className='opts';
    opts.forEach(o=>{
      const b=document.createElement('button'); b.className='obt';
      b.innerHTML=`<span>${o.e}</span>${o.t}`;
      b.onclick=()=>{
        oc.querySelectorAll('.obt').forEach(x=>x.disabled=true);
        oc.style.opacity='.45';
        addUser(o.t); chatHist.push({role:'user',content:o.t}); botReply(o.t);
      };
      oc.appendChild(b);
    });
    c.appendChild(oc);
  }
  scrollC();
}
function addUser(t){
  const c=document.getElementById('cmsgs');
  const d=document.createElement('div'); d.className='msg user';
  d.innerHTML=`<div class="mb">${t}</div><div class="mt">${now()}</div>`;
  c.appendChild(d); scrollC();
}
function showTyp(){const c=document.getElementById('cmsgs');const d=document.createElement('div');d.className='msg bot';d.id='typ';d.innerHTML=`<div class="typi"><div class="tdd"></div><div class="tdd"></div><div class="tdd"></div></div>`;c.appendChild(d);scrollC();}
function hideTyp(){const t=document.getElementById('typ');if(t)t.remove();}
function handleKey(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMsg();}}
function autoR(el){el.style.height='auto';el.style.height=Math.min(el.scrollHeight,72)+'px';}
function scrollC(){const c=document.getElementById('cmsgs');setTimeout(()=>c.scrollTop=c.scrollHeight,80);}
function now(){return new Date().toLocaleTimeString('es',{hour:'2-digit',minute:'2-digit'});}

// ══ BREATHING ═════════════════════════════════════
let bInt=null,bPh=0;
const bPs=[{t:'Inhala...',n:4,s:1.4},{t:'Mantén...',n:4,s:1},{t:'Exhala...',n:6,s:.8},{t:'Descansa...',n:2,s:1}];
function showBreath(){document.getElementById('bov').style.display='flex';bPh=0;runB();}
function runB(){
  const p=bPs[bPh%bPs.length];
  document.getElementById('bcirc').style.transform=`scale(${p.s})`;
  document.getElementById('bcirc').textContent=p.t.replace('...','');
  document.getElementById('bact').textContent=p.t;
  if(document.getElementById('breath-char'))
    document.getElementById('breath-char').style.transform=`scale(${p.s})`;
  let n=p.n; document.getElementById('bnum').textContent=n;
  clearInterval(bInt);
  bInt=setInterval(()=>{n--;document.getElementById('bnum').textContent=n;if(n<=0){clearInterval(bInt);bPh++;setTimeout(runB,200);}},1000);
}
function stopBreath(){clearInterval(bInt);document.getElementById('bov').style.display='none';}

// ══ INIT ══════════════════════════════════════════
updateTips();
if(_sp){ padreData=JSON.parse(_sp); updatePadreUI(); }
// Inicializar preview de misiones en home al cargar
setTimeout(()=>{ try{ renderHomePreview(); }catch(e){} }, 400);