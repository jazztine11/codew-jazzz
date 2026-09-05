/*
  ==========================
  CUSTOMIZE THIS ONE LINE
  ==========================
*/
const CONFIG = {
  birthdayName: "HER NAME"
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const game = document.getElementById("game");
const instructions = document.getElementById("instructions");
const startBtn = document.getElementById("startBtn");
const againBtn = document.getElementById("againBtn");
const arrowsEl = document.getElementById("arrows");
const powerWrap = document.getElementById("powerWrap");
const powerEl = document.getElementById("power");
const message = document.getElementById("message");
const celebration = document.getElementById("celebration");
const burst = document.getElementById("burst");
document.getElementById("birthdayName").textContent = CONFIG.birthdayName;

let W,H,dpr;
let running=false,won=false,arrows=5;
let pointer={x:0,y:0,down:false};
let aim={x:0,y:0};
let arrow=null;
let particles=[];
let stars=[];
let clouds=[];
let cake={x:0,y:0,r:58,phase:0};
let shake=0;
let last=0;

function resize(){
  dpr=Math.min(devicePixelRatio||1,2);
  W=game.clientWidth; H=game.clientHeight;
  canvas.width=W*dpr; canvas.height=H*dpr;
  canvas.style.width=W+"px";canvas.style.height=H+"px";
  ctx.setTransform(dpr,0,0,dpr,0,0);
  cake.x=W*.76; cake.y=H*.42;
  if(!running) aim={x:W*.28,y:H*.43};
  createBackground();
}
window.addEventListener("resize",resize);

function createBackground(){
  stars=[];
  for(let i=0;i<110;i++) stars.push({x:Math.random()*W,y:Math.random()*H*.7,r:.5+Math.random()*1.5,a:.2+Math.random()*.8,s:Math.random()*3});
  clouds=[
    {x:W*.14,y:H*.22,s:1},
    {x:W*.72,y:H*.18,s:.75},
    {x:W*.48,y:H*.1,s:.55}
  ];
}

function roundRect(x,y,w,h,r,fill,stroke){
  ctx.beginPath();ctx.roundRect(x,y,w,h,r);
  if(fill){ctx.fillStyle=fill;ctx.fill()}
  if(stroke){ctx.strokeStyle=stroke;ctx.stroke()}
}

function drawBackground(t){
  let g=ctx.createLinearGradient(0,0,W,H);
  g.addColorStop(0,"#160b24");g.addColorStop(.48,"#210b19");g.addColorStop(1,"#050308");
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);

  let rg=ctx.createRadialGradient(W*.72,H*.38,10,W*.72,H*.38,W*.62);
  rg.addColorStop(0,"#ff547733");rg.addColorStop(1,"transparent");
  ctx.fillStyle=rg;ctx.fillRect(0,0,W,H);

  for(const s of stars){
    let a=s.a*(.65+.35*Math.sin(t*.001+s.s));
    ctx.globalAlpha=a;ctx.fillStyle="#fff";
    ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();
  }
  ctx.globalAlpha=1;

  // moon
  ctx.fillStyle="#fff0d2";ctx.shadowBlur=35;ctx.shadowColor="#fff0d277";
  ctx.beginPath();ctx.arc(W*.82,H*.18,42,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;

  // soft clouds
  ctx.globalAlpha=.07;ctx.fillStyle="#ffd8d0";
  clouds.forEach(c=>{
    ctx.beginPath();
    ctx.arc(c.x,c.y,45*c.s,0,Math.PI*2);
    ctx.arc(c.x+40*c.s,c.y+8*c.s,35*c.s,0,Math.PI*2);
    ctx.arc(c.x-38*c.s,c.y+12*c.s,28*c.s,0,Math.PI*2);
    ctx.fill();
  });
  ctx.globalAlpha=1;

  // ground
  const ground=ctx.createLinearGradient(0,H*.72,0,H);
  ground.addColorStop(0,"transparent");ground.addColorStop(1,"#030205");
  ctx.fillStyle=ground;ctx.fillRect(0,H*.65,W,H*.35);
}

function drawBow(){
  const bx=W*.18, by=H*.62;
  let ang=Math.atan2(aim.y-by,aim.x-bx);
  ctx.save();ctx.translate(bx,by);ctx.rotate(ang);

  // bow
  ctx.strokeStyle="#d9a46d";ctx.lineWidth=7;ctx.lineCap="round";
  ctx.beginPath();ctx.arc(0,0,105,-Math.PI*.72,Math.PI*.72,false);ctx.stroke();
  ctx.strokeStyle="#f3e0cb";ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(-31,-100);ctx.lineTo(-31,100);ctx.stroke();

  // grip
  ctx.strokeStyle="#6f382d";ctx.lineWidth=14;ctx.beginPath();ctx.moveTo(-5,-17);ctx.lineTo(-5,17);ctx.stroke();

  // arrow nocked
  if(!arrow && running){
    ctx.strokeStyle="#f2d7ad";ctx.lineWidth=3;
    ctx.beginPath();ctx.moveTo(-31,0);ctx.lineTo(180,0);ctx.stroke();
    ctx.fillStyle="#fff0ce";ctx.beginPath();ctx.moveTo(180,0);ctx.lineTo(165,-6);ctx.lineTo(165,6);ctx.closePath();ctx.fill();
  }
  ctx.restore();

  // crosshair at aim
  if(running&&!arrow){
    ctx.strokeStyle="#ffffff55";ctx.lineWidth=1;
    ctx.beginPath();ctx.arc(aim.x,aim.y,13,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.moveTo(aim.x-20,aim.y);ctx.lineTo(aim.x-7,aim.y);ctx.moveTo(aim.x+7,aim.y);ctx.lineTo(aim.x+20,aim.y);ctx.moveTo(aim.x,aim.y-20);ctx.lineTo(aim.x,aim.y-7);ctx.moveTo(aim.x,aim.y+7);ctx.lineTo(aim.x,aim.y+20);ctx.stroke();
  }
}

function drawCake(t){
  const bob=Math.sin(t*.002)*6;
  const x=cake.x,y=cake.y+bob,r=cake.r;
  cake._drawY=y;

  // target ring
  ctx.save();ctx.translate(x,y);
  ctx.shadowBlur=25;ctx.shadowColor="#ff779055";
  ctx.strokeStyle="#ff9db255";ctx.lineWidth=3;
  ctx.beginPath();ctx.arc(0,0,r+25,0,Math.PI*2);ctx.stroke();
  ctx.strokeStyle="#ffd18f55";ctx.lineWidth=1;
  ctx.beginPath();ctx.arc(0,0,r+36,0,Math.PI*2);ctx.stroke();
  ctx.shadowBlur=0;

  // plate
  ctx.fillStyle="#f9dfe5";ctx.beginPath();ctx.ellipse(0,54,86,14,0,0,Math.PI*2);ctx.fill();

  // cake layers
  roundRect(-62,-10,124,50,13,"#f2a0b2");
  roundRect(-60,-30,120,42,12,"#ffd2b9");
  roundRect(-54,-51,108,35,10,"#fff0df");

  // frosting drips
  ctx.fillStyle="#fff8ed";
  for(let i=-40;i<=40;i+=20){
    ctx.beginPath();ctx.arc(i,-49,10,0,Math.PI);ctx.lineTo(i+10,-40);ctx.lineTo(i-10,-40);ctx.closePath();ctx.fill();
  }

  // candle
  ctx.fillStyle="#e5a5b6";ctx.fillRect(-5,-78,10,27);
  ctx.fillStyle="#ffd071";ctx.shadowBlur=15;ctx.shadowColor="#ffd071";
  ctx.beginPath();ctx.ellipse(0,-88,7,11,0,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;

  // tiny hearts
  ctx.fillStyle="#d65d79";
  heart(35,-18,7);heart(-28,-18,6);heart(0,-2,5);
  ctx.restore();

  // label
  ctx.font="10px 'DM Mono'";ctx.textAlign="center";ctx.fillStyle="#ffffffaa";
  ctx.fillText("★  HIT THE CAKE  ★",x,y+r+62);
}

function heart(x,y,s){
  ctx.save();ctx.translate(x,y);ctx.rotate(-Math.PI/4);
  ctx.beginPath();ctx.rect(-s/2,-s/2,s,s);ctx.fill();
  ctx.beginPath();ctx.arc(0,-s/2,s/2,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(s/2,0,s/2,0,Math.PI*2);ctx.fill();ctx.restore();
}

function fireParticle(x,y){
  for(let i=0;i<12;i++){
    particles.push({
      x,y,vx:(Math.random()-.5)*7,vy:(Math.random()-.7)*7,
      life:1,size:2+Math.random()*4,type:"spark"
    });
  }
}

function drawParticles(dt){
  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.12;p.life-=dt*.0015;
    ctx.globalAlpha=Math.max(0,p.life);
    ctx.fillStyle=p.type==="spark"?"#ffd18f":"#ff8fa7";
    ctx.beginPath();ctx.arc(p.x,p.y,p.size*p.life,0,Math.PI*2);ctx.fill();
    if(p.life<=0)particles.splice(i,1);
  }
  ctx.globalAlpha=1;
}

function shoot(){
  if(!running||won||arrow||arrows<=0)return;
  const bx=W*.18,by=H*.62;
  const ang=Math.atan2(aim.y-by,aim.x-bx);
  const speed=17;
  arrow={x:bx+Math.cos(ang)*175,y:by+Math.sin(ang)*175,vx:Math.cos(ang)*speed,vy:Math.sin(ang)*speed,trail:[]};
  arrows--;arrowsEl.textContent=arrows;
  message.textContent="NICE SHOT!";
  message.classList.remove("show");
}

function updateArrow(){
  if(!arrow)return;
  arrow.trail.push({x:arrow.x,y:arrow.y});
  if(arrow.trail.length>12)arrow.trail.shift();
  arrow.x+=arrow.vx;arrow.y+=arrow.vy;arrow.vy+=.16;

  const dx=arrow.x-cake.x,dy=arrow.y-cake._drawY;
  if(Math.hypot(dx,dy)<cake.r+14){
    hitCake();return;
  }
  if(arrow.x>W+100||arrow.y>H+100||arrow.y<-100){
    arrow=null;
    if(arrows<=0){
      message.textContent="Out of arrows — try again!";
      message.classList.add("show");
      setTimeout(reset,900);
    }
  }
}

function drawArrow(){
  if(!arrow)return;
  ctx.strokeStyle="#ffffff44";ctx.lineWidth=2;
  for(let i=1;i<arrow.trail.length;i++){
    const a=arrow.trail[i-1],b=arrow.trail[i];
    ctx.globalAlpha=i/arrow.trail.length*.4;
    ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
  }
  ctx.globalAlpha=1;
  const ang=Math.atan2(arrow.vy,arrow.vx);
  ctx.save();ctx.translate(arrow.x,arrow.y);ctx.rotate(ang);
  ctx.strokeStyle="#f5d7ad";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-45,0);ctx.lineTo(13,0);ctx.stroke();
  ctx.fillStyle="#fff1d5";ctx.beginPath();ctx.moveTo(25,0);ctx.lineTo(8,-8);ctx.lineTo(8,8);ctx.closePath();ctx.fill();
  ctx.strokeStyle="#ff91a8";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-45,-7);ctx.lineTo(-34,0);ctx.lineTo(-45,7);ctx.stroke();
  ctx.restore();
}

function hitCake(){
  won=true;arrow=null;shake=12;
  fireParticle(cake.x,cake._drawY);
  message.classList.remove("show");
  setTimeout(showCelebration,380);
}

function showCelebration(){
  celebration.classList.add("show");
  burst.innerHTML="";
  for(let i=0;i<100;i++){
    const c=document.createElement("i");c.className="confetti";
    c.style.setProperty("--x",(Math.random()*1000-500)+"px");
    c.style.setProperty("--y",(Math.random()*900-450)+"px");
    c.style.setProperty("--r",(Math.random()*1100-550)+"deg");
    c.style.background=["#ff91aa","#ffd28e","#fff0d8","#d89bff","#8fe7e0"][i%5];
    c.style.animationDelay=(Math.random()*.35)+"s";
    burst.appendChild(c);
  }
}

function reset(){
  celebration.classList.remove("show");
  arrows=5;arrowsEl.textContent=arrows;arrow=null;won=false;running=true;
  message.classList.remove("show");
  aim={x:W*.4,y:H*.42};
}

function start(){
  instructions.classList.add("hide");
  powerWrap.classList.add("show");
  reset();
}

function pointerMove(x,y){
  const rect=canvas.getBoundingClientRect();
  aim={x:x-rect.left,y:y-rect.top};
  pointer.x=aim.x;pointer.y=aim.y;
}

canvas.addEventListener("pointermove",e=>pointerMove(e.clientX,e.clientY));
canvas.addEventListener("pointerdown",e=>{
  if(!running||won)return;
  pointer.down=true;
  pointerMove(e.clientX,e.clientY);
});
canvas.addEventListener("pointerup",e=>{
  if(!running||won)return;
  pointer.down=false;
  pointerMove(e.clientX,e.clientY);
  shoot();
});
canvas.addEventListener("pointercancel",()=>pointer.down=false);

startBtn.addEventListener("click",start);
againBtn.addEventListener("click",()=>{
  reset();
  celebration.classList.remove("show");
});

function loop(t){
  const dt=Math.min(32,t-last||16);last=t;
  ctx.save();
  if(shake>0){
    ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);
    shake*=.88;if(shake<.3)shake=0;
  }
  drawBackground(t);
  if(running&&!won)drawCake(t);
  else if(!running)drawCake(t);
  drawBow();
  updateArrow();
  drawArrow();
  drawParticles(dt);

  if(pointer.down&&!arrow&&running){
    const p=(Math.sin(t*.008)+1)/2;
    powerEl.style.width=(35+p*65)+"%";
  }else powerEl.style.width="0%";
  ctx.restore();
  requestAnimationFrame(loop);
}

resize();
requestAnimationFrame(loop);
