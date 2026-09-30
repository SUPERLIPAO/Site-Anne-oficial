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
    v.addEventListener('click', toggle);
    v.addEventListener('play', function(){ if(i === current) setPlaying(true); });
    v.addEventListener('pause', function(){ if(i === current) setPlaying(false); });
    v.addEventListener('timeupdate', function(){
      if(i === current && v.duration) bar.style.width = (v.currentTime / v.duration * 100) + '%';
    });
    v.addEventListener('ended', function(){ goTo((i + 1) % videos.length, true); });
  });

  playBtn.addEventListener('click', toggle);
  muteBtn.addEventListener('click', function(){
    muted = !muted;
    videos[current].muted = muted;
    muteBtn.textContent = muted ? '🔇' : '🔊';
  });
})();
