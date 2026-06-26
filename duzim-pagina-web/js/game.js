const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const width = canvas.width; const height = canvas.height;

const player = { x: 60, y: height-60, w: 60, h: 30, vx:0, color:'#f59e0b', balance:100 };
let keys = {};
let helmets = [];
let obstacles = [];
let score = 0;
let tick = 0;

function spawnHelmet(){ helmets.push({x: width+20, y: height-80, w:24, h:24}); }
function spawnObstacle(){ obstacles.push({x: width+20, y: height-50, w:28, h:28}); }

function update(){
  tick++;
  if(keys['ArrowLeft']) player.x -= 4;
  if(keys['ArrowRight']) player.x += 4;
  if(keys[' '] ) player.balance = Math.max(0, player.balance-0.6);
  else player.balance = Math.min(100, player.balance+0.2);

  player.x = Math.max(8, Math.min(width-player.w-8, player.x));

  if(tick % 180 === 0) spawnHelmet();
  if(tick % 140 === 0) spawnObstacle();

  helmets.forEach(h => h.x -= 3);
  obstacles.forEach(o => o.x -= 4);

  helmets = helmets.filter(h => {
    if(collide(player,h)) { score += 10; player.balance = Math.min(100, player.balance+20); return false }
    return h.x + h.w > -10;
  });

  obstacles = obstacles.filter(o => {
    if(collide(player,o)) { score = Math.max(0, score-15); player.balance = Math.max(0, player.balance-30); return false }
    return o.x + o.w > -10;
  });
}

function collide(a,b){ return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y }

function draw(){
  ctx.clearRect(0,0,width,height);
  ctx.fillStyle = '#071022'; ctx.fillRect(0,0,width,height);

  // ground
  ctx.fillStyle = '#0b2032'; ctx.fillRect(0,height-28,width,28);

  // player
  ctx.fillStyle = player.color; ctx.fillRect(player.x, player.y, player.w, player.h);
  ctx.fillStyle = '#e6eef8'; ctx.fillRect(player.x+6, player.y-8, 18,10); // headlight/helmet

  // helmets
  helmets.forEach(h => {
    ctx.fillStyle = '#f59e0b'; ctx.fillRect(h.x, h.y, h.w, h.h);
    ctx.strokeStyle = '#e6eef8'; ctx.strokeRect(h.x, h.y, h.w, h.h);
  });

  // obstacles
  obstacles.forEach(o => {
    ctx.fillStyle = '#8b2330'; ctx.fillRect(o.x, o.y, o.w, o.h);
  });

  // HUD
  ctx.fillStyle = '#e6eef8'; ctx.font='16px Inter, Arial'; ctx.fillText('Pontuação: '+score, 12, 20);
  ctx.fillText('Equilíbrio: '+Math.round(player.balance)+'%', 12, 40);

  // balance bar
  ctx.fillStyle = '#333'; ctx.fillRect(12,48,140,12);
  ctx.fillStyle = '#4ade80'; ctx.fillRect(12,48, Math.max(0, player.balance/100*140),12);
}

function loop(){ update(); draw(); requestAnimationFrame(loop); }

window.addEventListener('keydown', e=>{ keys[e.key]=true; if(e.key===' '){ e.preventDefault(); } });
window.addEventListener('keyup', e=>{ keys[e.key]=false });

loop();
