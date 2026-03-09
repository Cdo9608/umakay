// ══ CAPACITACIONES PADRES ════════════════════════════════════
// Este archivo solo define datos y funciones de render.
// La inicialización ocurre desde go() en core.js.

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

function initPadCaps(){
  const cont=document.getElementById('pad-cap-list');
  if(cont && cont.children.length===0) cont.innerHTML=PAD_CAPS.map(capCardHTML).join('');
}