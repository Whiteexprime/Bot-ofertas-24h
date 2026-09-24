(() => {
  const menu = document.querySelector('.menu');
  const button = document.querySelector('.dots');
  if (menu && button) {
    button.addEventListener('click', e => { e.stopPropagation(); menu.classList.toggle('open'); playTone('click'); });
    document.addEventListener('click', e => { if (!menu.contains(e.target)) menu.classList.remove('open'); });
  }

  let audioCtx = null;
  let soundOn = localStorage.getItem('botofertas-sound') === 'on';
  const soundBtn = document.querySelector('.sound-toggle');
  const getCtx = () => audioCtx || (audioCtx = new (window.AudioContext || window.webkitAudioContext)());
  function playTone(type='soft') {
    if (!soundOn) return;
    try {
      const ctx=getCtx(); if(ctx.state==='suspended') ctx.resume();
      const o=ctx.createOscillator(), g=ctx.createGain();
      o.type='sine';
      const now=ctx.currentTime;
      const freq=type==='click'?520:type==='open'?660:420;
      o.frequency.setValueAtTime(freq,now); o.frequency.exponentialRampToValueAtTime(freq*1.08,now+.07);
      g.gain.setValueAtTime(.0001,now); g.gain.exponentialRampToValueAtTime(.025,now+.012); g.gain.exponentialRampToValueAtTime(.0001,now+.09);
      o.connect(g); g.connect(ctx.destination); o.start(now); o.stop(now+.1);
    } catch(e){}
  }
  function updateSound(){ if(!soundBtn)return; soundBtn.querySelector('span').textContent=soundOn?'🔊':'🔇'; soundBtn.setAttribute('aria-label',soundOn?'Desativar sons':'Ativar sons'); }
  if(soundBtn){ updateSound(); soundBtn.addEventListener('click',()=>{soundOn=!soundOn;localStorage.setItem('botofertas-sound',soundOn?'on':'off');updateSound();if(soundOn)playTone('open');}); }

  document.querySelectorAll('a.btn, .text-link, .drop a').forEach(el=>el.addEventListener('click',()=>playTone('click')));
  document.querySelectorAll('.btn').forEach(el=>el.addEventListener('pointerenter',()=>playTone('soft'),{passive:true}));
  document.querySelectorAll('.card,.community-card,.metric,.panel').forEach(el=>el.classList.add('lift-in'));
})();