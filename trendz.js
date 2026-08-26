(function(){
function safe(fn){try{fn()}catch(e){console.warn('[trendz]',e)}}
var mob=matchMedia('(max-width:900px)');
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;

/* ---------- nav ---------- */
var nav=document.getElementById('nav'), hero=document.getElementById('hero');
function navState(){
  /* transparente uniquement tout en haut ; noire dès le premier scroll,
     y compris par-dessus la vidéo du header */
  var scrolled = scrollY > 8;
  nav.classList.toggle('over', !scrolled);
  nav.classList.toggle('solid', scrolled);
}
var navTick=false;addEventListener('scroll',function(){if(navTick)return;navTick=true;requestAnimationFrame(function(){navState();navTick=false})},{passive:true});addEventListener('resize',navState);navState();

/* ---------- intro ---------- */
var intro=document.getElementById('intro'), skip=document.getElementById('skip'),
    hv=document.getElementById('heroV'), shown=false;
function reveal(){
  if(shown)return; shown=true;
  intro.classList.add('done'); hero.classList.add('go');
  if(hv)hv.play().catch(function(){});
}
var introT=setTimeout(reveal,2350);
skip.addEventListener('click',function(){clearTimeout(introT);reveal()});
addEventListener('keydown',function(e){if(e.key==='Escape'){clearTimeout(introT);reveal()}});


/* ---------- révélations ---------- */
var io=new IntersectionObserver(function(es){es.forEach(function(e,i){
  if(e.isIntersecting){e.target.style.transitionDelay=(i*70)+'ms';e.target.classList.add('in');io.unobserve(e.target)}})},
  {threshold:.12,rootMargin:'0px 0px -5% 0px'});
document.querySelectorAll('.rv,.mask').forEach(function(el){io.observe(el)});
document.querySelectorAll('.hero .mask').forEach(function(el,i){setTimeout(function(){el.classList.add('in')},130+i*95)});

/* ---------- compteurs ---------- */
function count(el,to,ms){
  if(reduce){el.textContent=to;return}
  var t0=performance.now();
  (function s(t){var p=Math.min(1,(t-t0)/ms),e=1-Math.pow(1-p,3);
    el.textContent=Math.round(to*e);if(p<1)requestAnimationFrame(s)})(t0);
}
var cio=new IntersectionObserver(function(es){es.forEach(function(e){
  if(e.isIntersecting){count(e.target,+e.target.dataset.count,1500);cio.unobserve(e.target)}})},{threshold:.6});
document.querySelectorAll('[data-count]').forEach(function(el){cio.observe(el)});

/* ---------- titre de l'étude de cas : chaque ligne remplit la colonne ---------- */
function fit(){
  var h=document.getElementById('caseH');
  var w=h.clientWidth; if(!w)return;
  h.querySelectorAll('[data-fit]').forEach(function(s){
    s.style.transform='none';
    var nat=s.scrollWidth; if(!nat)return;
    s.style.transform='scaleX('+(w/nat).toFixed(4)+')';
  });
}
window.tzFit=fit;
addEventListener('resize',fit);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
setTimeout(fit,60);fit();

/* ---------- étude de cas : descente + rotation vers la droite ---------- */
var track=document.getElementById('caseTrack'), stage=document.getElementById('caseStage'),
    target=0, current=0, raf=null;

function onScroll(){
  if(mob.matches)return;
  var r=track.getBoundingClientRect();
  /* 0 quand la section entre par le bas, 1 quand elle sort par le haut */
  target=Math.min(1,Math.max(0,(innerHeight-r.top)/(innerHeight+r.height)));
  if(!raf)raf=requestAnimationFrame(loop);
}
function loop(){
  current+=(target-current)*0.12;
  if(Math.abs(target-current)<0.0012)current=target;
  var p=current;
  /* SEUIL : part de 0 = descente dès l'entrée, 0.5 = à mi-traversée.
     Baissez pour démarrer plus tôt, montez pour plus tard.        */
  var SEUIL=0.30;
  var pp=Math.max(0,(p-SEUIL)/(1-SEUIL));
  var fall=innerHeight*0.22*pp;
  stage.style.setProperty('--dy',fall.toFixed(1)+'px');
  raf=Math.abs(target-current)>0.0008?requestAnimationFrame(loop):null;
}
addEventListener('scroll',onScroll,{passive:true});
addEventListener('resize',onScroll);onScroll();

/* onglets de l'étude de cas : titre, chiffres et description changent */
safe(function(){
  var DATA={"jefe": {"name": "Jefe Burger", "l1": "De 20k à 180k", "l2": "d'abonnés", "stats": [["Abonnés", "182 K"], ["Likes cumulés", "4,3M"], ["Vues sur 12 mois", "38M"], ["Restaurants", "24"]], "desc": "Création du compte de zéro : identité sociale, rythme de publication hebdomadaire, mise en avant du burger signature et activation des ouvertures. L'enseigne s'est construit une audience avant même d'avoir un réseau national."}, "nst": {"name": "Newschooltacos", "l1": "De 100k à 400k", "l2": "d'abonnés", "stats": [["Abonnés", "429 K"], ["Likes cumulés", "11,7M"], ["Vues sur 12 mois", "100M"], ["Restaurants", "68"]], "desc": "Reprise complète du compte : nouvelle ligne éditoriale, tournage mensuel dans les restaurants du réseau, formats verticaux natifs et animation quotidienne de la communauté. La marque est passée du statut d'enseigne connue à celui de marque suivie."}, "krousti": {"name": "Krousti Sabaïdi", "l1": "De 100k à 500k", "l2": "d'abonnés", "stats": [["Abonnés", "512 K"], ["Likes cumulés", "8,9M"], ["Vues sur 12 mois", "74M"], ["Restaurants", "36"]], "desc": "Accompagnement sur douze mois : refonte de la ligne éditoriale, séries récurrentes tournées en cuisine et collaborations créateurs. Le compte est devenu le premier canal d'acquisition du réseau, devant les plateformes de livraison."}};
  var hd=document.getElementById('caseH'),
      st=document.getElementById('caseStats'),
      de=document.getElementById('caseDesc'),
      ctabs=[].slice.call(document.querySelectorAll('.tab'));
  function render(k){
    var d=DATA[k]; if(!d)return;
    hd.querySelector('.l1').textContent=d.l1;
    hd.querySelector('.l2').textContent=d.l2;
    de.textContent=d.desc;
    st.innerHTML=d.stats.map(function(s){return '<div><dt>'+s[0]+'</dt><dd>'+s[1]+'</dd></div>'}).join('');
    if(window.tzFit)window.tzFit();
  }
  ctabs.forEach(function(t){t.addEventListener('click',function(){
    ctabs.forEach(function(o){o.classList.remove('on');o.removeAttribute('aria-selected')});
    t.classList.add('on');t.setAttribute('aria-selected','true');
    render(t.dataset.k);})});
});

/* Safari ne lit pas le VP9 à canal alpha : on bascule sur le poster transparent. */
safe(function(){
  var v=document.getElementById('casePhone'), fb=document.getElementById('casePhoneFb');
  function fallback(){ v.hidden=true; fb.hidden=false; }
  if(!v.canPlayType('video/webm; codecs="vp9"')) return fallback();
  v.addEventListener('error',fallback,true);
  v.addEventListener('loadeddata',function(){ if(!v.videoWidth) fallback(); });
});


/* ---------- onglets Nos projets ---------- */
var wtabs=[].slice.call(document.querySelectorAll('.wtab')),
    panels=[].slice.call(document.querySelectorAll('.panel'));
var wTitle=document.getElementById('worksTitle');
wtabs.forEach(function(t){t.addEventListener('click',function(){
  if(wTitle){
    wTitle.textContent=t.textContent;
    wTitle.classList.remove('swap');
    void wTitle.offsetWidth;          /* force le navigateur à rejouer */
    wTitle.classList.add('swap');
  }
  wtabs.forEach(function(o){o.classList.remove('on');o.removeAttribute('aria-selected')});
  t.classList.add('on');t.setAttribute('aria-selected','true');
  panels.forEach(function(p){p.classList.toggle('on',p.dataset.p===t.dataset.p)});})});

/* ---------- une seule paire de flèches, qui pilote le panneau actif ---------- */
safe(function(){
  document.querySelectorAll('[data-nav]').forEach(function(b){
    b.addEventListener('click',function(){
      var pan=document.querySelector('.panel.on'); if(!pan)return;
      var dk=pan.querySelector('#deck');
      if(dk&&dk.__go){ dk.__go(+b.dataset.nav); return; }
      var t=pan.querySelector('.rail__t');
      if(t){
        t.style.animationPlayState='paused';
        var cur=parseFloat(t.dataset.x||0)+(-(+b.dataset.nav))*33;
        t.dataset.x=cur; t.style.transition='transform .6s cubic-bezier(.22,.61,.36,1)';
        t.style.transform='translateX('+cur+'%)';
        return;
      }
      var sl=[].slice.call(pan.querySelectorAll('.slide'));
      if(sl.length<2)return;
      var i=sl.findIndex(function(s){return s.classList.contains('on')});
      i=(i+(+b.dataset.nav)+sl.length)%sl.length;
      sl.forEach(function(s,k){s.classList.toggle('on',k===i)});
    });
  });
});




/* ---------- reportage presse ---------- */
safe(function(){
  var st=document.getElementById('pressStage'), v=document.getElementById('pressV'),
      b=document.getElementById('pressBtn'), bar=document.getElementById('pressBar'),
      tc=document.getElementById('pressTC');
  if(!v)return;
  function fmt(s){s=Math.max(0,s|0);return ('0'+(s/60|0)).slice(-2)+':'+('0'+s%60).slice(-2)}
  new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting){v.play().catch(function(){})}else{v.pause()}
  })},{threshold:.3}).observe(v);
  v.addEventListener('timeupdate',function(){
    if(v.duration){bar.style.width=(v.currentTime/v.duration*100)+'%'}
    tc.textContent=fmt(v.currentTime);
  });
  function open(){
    v.muted=false; v.loop=false; v.controls=true;
    v.play().catch(function(){});
    b.style.opacity='0';b.style.pointerEvents='none';
  }
  b.addEventListener('click',open);

});


/* ---------- toutes les vidéos : muettes en boucle, clic = son ---------- */
safe(function(){
  var cards=[].slice.call(document.querySelectorAll('[data-mute]'));

  function arm(c){
    var v=c.querySelector('video');
    if(!v) return null;
    if(!v.dataset.armed){
      v.dataset.armed=1;
      /* la vraie source (data-src) prime toujours sur le src de secours,
         sinon la vignette garde la vidéo placeholder et son audio */
      if(c.dataset.src && v.getAttribute('src')!==c.dataset.src) v.src=c.dataset.src;
      v.muted=true; v.loop=true; v.playsInline=true; v.preload='auto';
      v.load();
    }
    return v;
  }

  /* lecture seulement quand la vignette est visible */
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      var v=arm(e.target); if(!v)return;
      if(e.isIntersecting){ v.play().catch(function(){}) }
      else { v.pause(); }
    });
  },{threshold:.25});
  cards.forEach(function(c){io.observe(c)});

  function track(c){
    var t=c.closest('.wall__t, .rail__t');
    return t||null;
  }

  /* le son bascule dès le contact (pointerdown) : instantané, donc le
     défilement ne peut pas décaler la vignette entre l'appui et le relâchement */
  function toggleSound(c){
    var v=arm(c); if(!v)return;
    var actif = !c.classList.contains('sound');

    cards.forEach(function(o){
      if(o===c) return;
      var ov=o.querySelector('video');
      if(ov) ov.muted=true;
      o.classList.remove('sound');
      var ot=track(o); if(ot) ot.style.animationPlayState='';
    });

    v.muted = !actif;
    c.classList.toggle('sound', actif);
    v.play().catch(function(){});

    var t=track(c);
    if(t) t.style.animationPlayState = actif ? 'paused' : '';
  }

  cards.forEach(function(c){
    c.style.cursor='pointer';
    var sx=0,sy=0,moved=false;
    c.addEventListener('pointerdown',function(e){
      sx=e.clientX; sy=e.clientY; moved=false;
    },{passive:true});
    c.addEventListener('pointermove',function(e){
      if(Math.abs(e.clientX-sx)>8||Math.abs(e.clientY-sy)>8) moved=true;
    },{passive:true});
    c.addEventListener('pointerup',function(e){
      /* un glissement sert à faire défiler : on ne bascule le son
         que sur un vrai appui immobile */
      if(moved) return;
      e.preventDefault();
      toggleSound(c);
    });
    /* la carte est un <a> : on neutralise le clic qui suit */
    c.addEventListener('click',function(e){ e.preventDefault(); e.stopPropagation(); });
  });
});

/* ---------- produits : clic = photo suivante devant ---------- */

/* ---------- bandeau "ils parlent de nous" ---------- */

/* la vidéo de fond ne tourne que si elle est visible */


/* ---------- les carrousels ne tournent que s'ils sont à l'écran ---------- */
safe(function(){
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ e.target.classList.toggle('paused', !e.isIntersecting) });
  },{threshold:0});
  document.querySelectorAll('.wall,.rail,.refs').forEach(function(el){io.observe(el)});
});

/* ---------- ticket : les totaux se remplissent au fil du scroll ---------- */
safe(function(){
  var t=document.getElementById('ticket');
  var rows=[].slice.call(document.querySelectorAll('[data-tk]'));
  function upd(){
    var max=document.body.scrollHeight-innerHeight;
    var p=Math.min(1,Math.max(0,scrollY/(max||1)));
    t.classList.toggle('on', scrollY>innerHeight*0.6 && p<0.95);
    rows.forEach(function(el){
      el.textContent=Math.round(+el.dataset.tk*Math.min(1,p*1.15)).toLocaleString('fr-FR');
    });
  }
  addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true});
  addEventListener('resize',upd);
  upd();
});


/* ---------- campagnes produits : deck empile ---------- */
safe(function(){
  var DATA=[{"t": "Summer Thaï'm Edition", "d": "Cet été, les saveurs thaïlandaises s'invitent chez nous ! Découvrez une édition estivale aux inspirations street-food avec un Wrap Poulet façon Bánh Mì, un Wrap Krousty façon Bánh Mì et une salade Krousty. Trois recettes fraîches, gourmandes et dépaysantes pour voyager le temps d'un repas."}, {"t": "Big Jefe by Jefe Burger", "d": "Le BIG JEFE débarque chez JEFE BURGER ! Un nouveau burger à la carte, inspiré du célèbre Big Mac, qui revisite les codes du burger iconique à la sauce JEFE. Une nouveauté généreuse, gourmande et surtout… impossible à ignorer."}, {"t": "Krousty Sabaïdi × Jefe Burger", "d": "Quand deux univers gourmands se rencontrent, ça donne une collaboration explosive ! Krousty Sabaïdi et JEFE BURGER unissent leurs savoir-faire pour créer deux menus exclusifs qui mixent les incontournables des deux enseignes. Une collab' pensée pour les vrais gourmands."}, {"t": "Allez les Bleus !", "d": "Pour vibrer au rythme de la Coupe du Monde 2026, nos boissons passent aux couleurs de la France ! Bleu, blanc, rouge : trois boissons, trois couleurs, une seule mission… soutenir les Bleus avec style et fraîcheur. 🇫🇷"}, {"t": "Moi, tu me parles pas d'âge !", "d": "Pas besoin d'avoir un âge particulier pour profiter d'un bon plan ! Avec notre menu à seulement 5 €, tout le monde est invité à se régaler, sans condition et sans limite d'âge. Parce qu'une bonne affaire, ça se partage avec tout le monde."}, {"t": "L'Infiltrée", "d": "À l'occasion de la sortie du film L'Infiltrée, notre menu se glisse lui aussi dans la mission ! Découvrez une création exclusive inspirée de l'univers du film, avec un tacos habillé de rose pour une édition aussi surprenante qu'iconique. Une collaboration qui ne passera clairement pas inaperçue."}];
  var deck=document.getElementById('deck'); if(!deck)return;
  var cards=[].slice.call(deck.querySelectorAll('.dcard'));
  var num=document.getElementById('dNum'),ti=document.getElementById('dTitle'),de=document.getElementById('dDesc');
  var info=document.querySelector('.dinfo');
  var top=0;
  var ROT=[-3,2,-1.5,3,-2.5,1.5];

  function render(){
    cards.forEach(function(c,i){
      var pos=(i-top+cards.length)%cards.length;      /* 0 = devant */
      c.style.zIndex = cards.length-pos;
      c.style.transform =
        'translate('+(pos*14)+'px,'+(pos*-10)+'px) rotate('+ROT[pos%ROT.length]+'deg) scale('+(1-pos*.035)+')';
      c.style.opacity = pos>3 ? 0 : 1;
      c.style.pointerEvents = pos===0 ? 'auto' : 'none';
      c.setAttribute('aria-hidden', pos===0?'false':'true');
    });
    var d=DATA[top];
    num.textContent=('0'+(top+1)).slice(-2)+' / '+('0'+cards.length).slice(-2);
    ti.textContent=d.t; de.textContent=d.d;
    if(info){ info.classList.remove('swapin'); void info.offsetWidth; info.classList.add('swapin'); }
  }
  function go(step){ top=(top+step+cards.length)%cards.length; render(); }

  cards.forEach(function(c){ c.addEventListener('click',function(){ go(1); }); });
  deck.addEventListener('keydown',function(e){
    if(e.key==='ArrowRight'){go(1);} else if(e.key==='ArrowLeft'){go(-1);}
  });
  deck.__go=go;
  render();
});

/* ---------- spots sur mobile : defilement auto + glissement au doigt ---------- */
safe(function(){
  var rail=document.querySelector('.rail'); if(!rail)return;
  var SPEED=0.45;            /* px par frame */
  var held=false, resumeT=null, raf=null;

  /* uniquement la ou le rail defile vraiment (mobile) : sur grand ecran
     c'est l'animation CSS qui pilote, il ne faut pas la doubler */
  function scrollable(){
    var ox=getComputedStyle(rail).overflowX;
    return ox==='auto'||ox==='scroll';
  }
  function loopable(){ return scrollable() && rail.scrollWidth-rail.clientWidth>4; }

  function half(){ return rail.scrollWidth/2; }   /* la piste est dupliquee une fois */

  /* scrollLeft ignore les increments sous le pixel : on cumule en flottant */
  var pos=0, applied=0;
  function step(){
    raf=requestAnimationFrame(step);
    if(held||document.hidden||!loopable()) return;
    if(rail.querySelector('.vc.sound')) return;   /* on ne bouge pas si le son tourne */
    /* si l'utilisateur a fait glisser, on repart de sa position */
    if(Math.abs(rail.scrollLeft-applied)>2) pos=rail.scrollLeft;
    pos+=SPEED;
    if(pos>=half()) pos-=half();                  /* boucle sans saut visible */
    rail.scrollLeft=pos;
    applied=rail.scrollLeft;
  }

  /* le doigt (ou la souris) prend la main : on suspend, puis on reprend */
  function hold(){ held=true; clearTimeout(resumeT); }
  function release(){ clearTimeout(resumeT);
    resumeT=setTimeout(function(){ pos=rail.scrollLeft; applied=pos; held=false; },1200); }

  rail.addEventListener('pointerdown',hold,{passive:true});
  rail.addEventListener('pointerup',release,{passive:true});
  rail.addEventListener('pointercancel',release,{passive:true});
  rail.addEventListener('touchstart',hold,{passive:true});
  rail.addEventListener('touchend',release,{passive:true});
  rail.addEventListener('mouseenter',hold);
  rail.addEventListener('mouseleave',release);
  /* defilement inertiel : tant que ca bouge tout seul, on ne reprend pas */
  rail.addEventListener('scroll',function(){ if(held) release(); },{passive:true});

  /* on n'anime que quand la section est a l'ecran */
  var vio=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){ if(!raf) raf=requestAnimationFrame(step); }
      else if(raf){ cancelAnimationFrame(raf); raf=null; }
    });
  },{threshold:0});
  vio.observe(rail);
});

})();