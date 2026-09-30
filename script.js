(function(){
  var frame = document.getElementById('reelFrame');
  var dotsWrap = document.getElementById('reelDots');
  if(!frame || !dotsWrap) return;

  var videos = frame.querySelectorAll('.reel-video');
  var playBtn = document.getElementById('reelPlay');
  var muteBtn = document.getElementById('reelMute');
  var bar = document.getElementById('reelBar');
  var current = 0;
  var muted = false;

  var dots = [];
  videos.forEach(function(_, i){
    var dot = document.createElement('span');
    dot.setAttribute('role','button');
    dot.setAttribute('tabindex','0');
    dot.setAttribute('aria-label','Reel ' + (i+1));
    if(i === 0) dot.className = 'active';
    dot.addEventListener('click', function(){ goTo(i, true); });
    dot.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); goTo(i, true); }
    });
    dotsWrap.appendChild(dot);
    dots.push(dot);
  });

  function setPlaying(on){ frame.classList.toggle('playing', on); }

  function goTo(i, autoplay){
    var old = videos[current];
    old.pause();
    old.currentTime = 0;
    old.classList.remove('active');
    dots[current].classList.remove('active');
    current = i;
    var v = videos[current];
    v.muted = muted;
    v.classList.add('active');
    dots[current].classList.add('active');
    bar.style.width = '0';
    setPlaying(false);
    if(autoplay){ v.play().catch(function(){}); }
  }

  function toggle(){
    var v = videos[current];
    if(v.paused){ v.muted = muted; v.play().catch(function(){}); }
    else { v.pause(); }
  }

  videos.forEach(function(v, i){
    v.addEventListener('click', function(){ if(swiped){ swiped = false; return; } toggle(); });
    v.addEventListener('play', function(){ if(i === current) setPlaying(true); });
    v.addEventListener('pause', function(){ if(i === current) setPlaying(false); });
    v.addEventListener('timeupdate', function(){
      if(i === current && v.duration) bar.style.width = (v.currentTime / v.duration * 100) + '%';
    });
    v.addEventListener('ended', function(){ goTo((i + 1) % videos.length, true); });
  });

  var swiped = false;
  var startX = null, startY = null;
  function next(){ goTo((current + 1) % videos.length, true); }
  function prev(){ goTo((current - 1 + videos.length) % videos.length, true); }

  frame.addEventListener('pointerdown', function(e){ startX = e.clientX; startY = e.clientY; });
  frame.addEventListener('pointerup', function(e){
    if(startX === null) return;
    var dx = e.clientX - startX, dy = e.clientY - startY;
    startX = null;
    if(Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5){
      swiped = true;
      setTimeout(function(){ swiped = false; }, 350);
      if(dx < 0) next(); else prev();
    }
  });
  frame.addEventListener('pointercancel', function(){ startX = null; });
  frame.setAttribute('tabindex','0');
  frame.addEventListener('keydown', function(e){
    if(e.key === 'ArrowRight'){ e.preventDefault(); next(); }
    if(e.key === 'ArrowLeft'){ e.preventDefault(); prev(); }
  });

  playBtn.addEventListener('click', toggle);
  muteBtn.addEventListener('click', function(){
    muted = !muted;
    videos[current].muted = muted;
    muteBtn.textContent = muted ? '🔇' : '🔊';
  });
})();
