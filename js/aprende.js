// ══ CAPACITACIONES DOCENTE Y PADRES ══════════════════════════
// Este archivo solo define datos y funciones de render.
// La inicialización ocurre desde go() en core.js.

const DOC_CAPS = [
  {fuente:'MINSA Perú · Oficial',       titulo:'Salud Mental en el Entorno Escolar',               desc:'Identifica señales de alerta en estudiantes y activa protocolos de apoyo.', dur:'~15 min', bg:'linear-gradient(135deg,#3B82F6,#1E3A8A)', ico:'🧠', url:'https://www.youtube.com/watch?v=7wjSQCLdVTJo'},
  {fuente:'UNICEF Perú · Oficial',       titulo:'Cómo hablar con adolescentes sobre sus emociones', desc:'Técnicas de escucha activa y espacios seguros en el aula.', dur:'~12 min', bg:'linear-gradient(135deg,#10B981,#065F46)', ico:'👥', url:'https://www.youtube.com/watch?v=H4q6MfpN3d0'},
  {fuente:'MINEDU · Protocolo oficial',  titulo:'Protocolo SÍSEVE — Violencia Escolar paso a paso', desc:'Pasos exactos para activar el protocolo según normativa peruana.', dur:'~20 min', bg:'linear-gradient(135deg,#F59E0B,#78350F)', ico:'🛡️', url:'https://www.youtube.com/watch?v=TFbv757kup4'},
  {fuente:'Psych2Go Español · Animado',  titulo:'Burnout estudiantil — qué es y cómo ayudar',       desc:'Señales de agotamiento escolar y cómo intervenir antes de la crisis.', dur:'~8 min', bg:'linear-gradient(135deg,#8B5FC0,#4A2575)', ico:'📚', url:'https://www.youtube.com/watch?v=hnpQrMqDoqE'},
  {fuente:'TED · Subtítulos ES',         titulo:'El secreto de vivir bien — Kelly McGonigal',        desc:'Cómo manejar tu propio estrés para ser más efectivo en el aula.', dur:'~14 min', bg:'linear-gradient(135deg,#EC4899,#9D174D)', ico:'🌿', url:'https://www.youtube.com/watch?v=RcmgBwL8kj4'},
  {fuente:'OPS · Oficial',               titulo:'Involucramiento familiar en salud mental escolar',  desc:'Cómo coordinar con padres sin vulnerar la privacidad del alumno.', dur:'~18 min', bg:'linear-gradient(135deg,#14B8A6,#0F766E)', ico:'🏠', url:'https://www.youtube.com/watch?v=v0t42xBIYIs'},
  {fuente:'Fundación ONCE',              titulo:'Inteligencia emocional para docentes',              desc:'Herramientas para gestionar tus propias emociones en el aula.', dur:'~11 min', bg:'linear-gradient(135deg,#F97316,#9A3412)', ico:'❤️', url:'https://www.youtube.com/watch?v=G6a070CpGj8'},
  {fuente:'DEVIDA Perú',                 titulo:'Consumo de sustancias en adolescentes — señales',   desc:'Indicadores de consumo de alcohol y drogas en secundaria.', dur:'~16 min', bg:'linear-gradient(135deg,#EF4444,#7F1D1D)', ico:'⚠️', url:'https://www.youtube.com/watch?v=nRQLzOObOoI'},
];

const PAD_CAPS = [
  {fuente:'UNICEF Perú · Oficial',      titulo:'Cómo hablar con tu hijo adolescente sobre sus emociones', desc:'Técnicas de comunicación para padres: cómo abrir el diálogo sin que se cierre.', dur:'~10 min', bg:'linear-gradient(135deg,#2874A6,#1A5276)', ico:'👨‍👩‍👧', url:'https://www.youtube.com/watch?v=7PmELbqKrTo'},
  {fuente:'Psych2Go Español · Animado', titulo:'Señales de depresión adolescente que los padres no ven', desc:'Las señales que pasan desapercibidas en casa y cuándo actuar.', dur:'~7 min',  bg:'linear-gradient(135deg,#3B82F6,#1E3A8A)', ico:'😔', url:'https://www.youtube.com/watch?v=HznNEBACPTU'},
  {fuente:'Psych2Go Español · Animado', titulo:'Cómo apoyar la autoestima de tu hijo adolescente',       desc:'Lo que los padres hacen que más afecta la autoestima en esta etapa.', dur:'~8 min', bg:'linear-gradient(135deg,#8B5FC0,#4A2575)', ico:'💪', url:'https://www.youtube.com/watch?v=FkfNSKHJIbk'},
  {fuente:'Psych2Go Español · Animado', titulo:'7 señales de ansiedad en adolescentes',                  desc:'Cómo identificar ansiedad en tus hijos y qué puedes hacer para ayudar.', dur:'~6 min', bg:'linear-gradient(135deg,#F59E0B,#78350F)', ico:'😰', url:'https://www.youtube.com/watch?v=B-sjnMIdFiQ'},
  {fuente:'MINSA Perú · Oficial',       titulo:'Habla sin miedo — comunicación familiar',                desc:'Guía oficial del MINSA para hablar abiertamente sobre bienestar.', dur:'~13 min', bg:'linear-gradient(135deg,#10B981,#065F46)', ico:'💬', url:'https://www.youtube.com/watch?v=g-i6QMvIAA0'},
  {fuente:'TED · Subtítulos ES',        titulo:'Cómo el estrés de los padres afecta a los hijos',       desc:'Investigación reciente sobre el contagio emocional intergeneracional.', dur:'~15 min', bg:'linear-gradient(135deg,#EC4899,#9D174D)', ico:'🌿', url:'https://www.youtube.com/watch?v=WPPPFqsECz0'},
  {fuente:'OMS · Oficial',              titulo:'Apego y salud mental adolescente',                       desc:'Por qué el vínculo familiar sigue siendo el factor protector más importante.', dur:'~12 min', bg:'linear-gradient(135deg,#14B8A6,#0F766E)', ico:'❤️', url:'https://www.youtube.com/watch?v=oHv6vTKD6lg'},
  {fuente:'DEVIDA Perú',                titulo:'Prevención de consumo de sustancias — guía para padres', desc:'Cómo hablar con tus hijos sobre alcohol y drogas sin que se bloqueen.', dur:'~14 min', bg:'linear-gradient(135deg,#F97316,#9A3412)', ico:'⚠️', url:'https://www.youtube.com/watch?v=1Evwgu369Jw'},
];

function capCardHTML(cap){
  return `<div class="cap-card" onclick="window.open('${cap.url}','_blank')">
    <div class="cap-thumb" style="background:${cap.bg}">
      <div class="cap-play">▶</div>
      <div style="font-size:1.4rem;position:absolute;bottom:.5rem;right:.6rem">${cap.ico}</div>
    </div>
    <div class="cap-info">
      <div class="cap-fuente">${cap.fuente}</div>
      <div class="cap-title">${cap.titulo}</div>
      <div class="cap-desc">${cap.desc}</div>
      <div style="display:flex;gap:.45rem;margin-top:.4rem;flex-wrap:wrap">
        <span class="cap-tag">📺 YouTube</span><span class="cap-tag">${cap.dur}</span><span class="cap-tag cap-tag-gr">Gratuito</span>
      </div>
    </div>
  </div>`;
}

function initDocCaps(){
  const cont=document.getElementById('doc-cap-list');
  if(cont && cont.children.length===0) cont.innerHTML=DOC_CAPS.map(capCardHTML).join('');
}
function initPadCaps(){
  const cont=document.getElementById('pad-cap-list');
  if(cont && cont.children.length===0) cont.innerHTML=PAD_CAPS.map(capCardHTML).join('');
}
