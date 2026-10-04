// ====== EDIT YOUR WEDDING DETAILS HERE ======
const WEDDING_DATE = new Date("2026-11-25T19:30:00+05:00");
// =============================================

// Smooth navigation
function scrollToSection(id){
  document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
}

// Countdown
function updateCountdown(){
  const now = new Date().getTime();
  const target = WEDDING_DATE.getTime();
  const distance = target - now;

  if(distance <= 0){
    ["days","hours","minutes","seconds"].forEach(id => {
      document.getElementById(id).textContent = "00";
    });
    return;
  }

  const days = Math.floor(distance/(1000*60*60*24));
  const hours = Math.floor((distance%(1000*60*60*24))/(1000*60*60));
  const minutes = Math.floor((distance%(1000*60*60))/(1000*60));
  const seconds = Math.floor((distance%(1000*60))/1000);

  document.getElementById("days").textContent = String(days).padStart(2,"0");
  document.getElementById("hours").textContent = String(hours).padStart(2,"0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2,"0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2,"0");
}
updateCountdown();
setInterval(updateCountdown,1000);

// Scratch-to-reveal canvas
const canvas = document.getElementById("scratchCanvas");
const ctx = canvas.getContext("2d", {willReadFrequently:true});

function resizeScratch(){
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * ratio);
  canvas.height = Math.round(rect.height * ratio);
  ctx.setTransform(ratio,0,0,ratio,0,0);

  // Cover
  const w = rect.width, h = rect.height;
  const grad = ctx.createLinearGradient(0,0,w,h);
  grad.addColorStop(0,"#9b887c");
  grad.addColorStop(.5,"#c5afa2");
  grad.addColorStop(1,"#8b7569");
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,w,h);

  ctx.fillStyle = "rgba(255,255,255,.18)";
  ctx.font = "600 11px Montserrat";
  ctx.textAlign = "center";
  ctx.fillText("SCRATCH HERE",w/2,h/2);
}
resizeScratch();
window.addEventListener("resize",resizeScratch);

let scratching = false;
let lastX = 0, lastY = 0;

function point(e){
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches ? e.touches[0] : e;
  return {x:touch.clientX-rect.left,y:touch.clientY-rect.top};
}
function scratch(e){
  if(!scratching) return;
  e.preventDefault();
  const p = point(e);
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(p.x,p.y,24,0,Math.PI*2);
  ctx.fill();
  ctx.lineWidth = 48;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(lastX,lastY);
  ctx.lineTo(p.x,p.y);
  ctx.stroke();
  lastX=p.x; lastY=p.y;
}
canvas.addEventListener("pointerdown",e=>{
  scratching=true;
  const p=point(e); lastX=p.x; lastY=p.y;
});
canvas.addEventListener("pointermove",scratch);
window.addEventListener("pointerup",()=>scratching=false);

// RSVP: opens WhatsApp with the guest's response.
// Replace this number with the host's WhatsApp number in international format.
const WHATSAPP_NUMBER = "923001234567";

document.getElementById("rsvpForm").addEventListener("submit", function(e){
  e.preventDefault();
  const name = document.getElementById("guestName").value.trim();
  const attendance = document.getElementById("attendance").value;
  const message = document.getElementById("message").value.trim();

  const text =
`Wedding RSVP
Name: ${name}
Attendance: ${attendance}
Message: ${message || "—"}`;

  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
    "_blank"
  );
  this.reset();
});

// Music button: placeholder for your wedding song.
// Put a file named music.mp3 beside index.html, then uncomment the Audio line.
let audio = null;
// audio = new Audio("music.mp3");
// audio.loop = true;

document.getElementById("musicControl").addEventListener("click",()=>{
  if(!audio){
    alert("Add your music.mp3 file beside index.html, then enable the audio line in script.js.");
    return;
  }
  if(audio.paused){
    audio.play();
    document.getElementById("musicControl").textContent="Ⅱ";
  }else{
    audio.pause();
    document.getElementById("musicControl").textContent="♪";
  }
});
