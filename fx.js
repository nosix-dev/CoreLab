/* CoreLab FX : effets néon partagés. <script src="fx.js" defer data-lite> = version légère (dashboard). */
(function(){
"use strict";
var lite=!!(document.currentScript&&document.currentScript.hasAttribute("data-lite")),
reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches,
fine=window.matchMedia&&matchMedia("(hover:hover) and (pointer:fine)").matches,
SEL=".card,.plan,.stat,.tile,.ent,.fcard,.rel,.post,.mod,.nf,.sc,.term",
TILT=".card,.plan,.post,.mod,.tile,.fcard";
function cl(v,a,b){return Math.max(a,Math.min(b,v))}

/* ── étoiles qui dérivent (parallaxe au scroll et à la souris) ── */
function stars(){
var cv=document.createElement("canvas");cv.id="fxbg";cv.setAttribute("aria-hidden","true");document.body.insertBefore(cv,document.body.firstChild);
var c=cv.getContext("2d"),W,H,D,P=[],mx=.5;
function size(){D=Math.min(2,window.devicePixelRatio||1);W=cv.width=innerWidth*D;H=cv.height=innerHeight*D;
P=[];for(var i=0,n=Math.round(Math.min(90,innerWidth/16));i<n;i++)P.push({x:Math.random()*W,y:Math.random()*H,z:.3+Math.random()*.9,v:.05+Math.random()*.15,o:Math.random()*6.28,t:Math.random()<.2})}
function frame(t){c.clearRect(0,0,W,H);var sy=scrollY*D*.25;
for(var i=0;i<P.length;i++){var p=P[i];if(!reduce)p.y-=p.v*p.z*D;if(p.y<-4)p.y=H+4;
var y=((p.y-sy*p.z)%H+H)%H,x=p.x+(mx-.5)*p.z*40*D,a=.22+.4*Math.abs(Math.sin(t/1400*p.z+p.o));
c.globalAlpha=a;c.fillStyle=p.t?"#ff9d6b":"#ffffff";var s=p.z*1.7*D;c.fillRect(x,y,s,s)}
c.globalAlpha=1;if(!reduce)requestAnimationFrame(frame)}
size();addEventListener("resize",function(){size();if(reduce)frame(0)});
addEventListener("pointermove",function(e){mx=e.clientX/innerWidth},{passive:true});
requestAnimationFrame(frame)}

/* ── lueur qui suit le curseur ── */
function light(){
var d=document.createElement("div");d.id="fxlight";d.setAttribute("aria-hidden","true");document.body.insertBefore(d,document.body.firstChild);
var x=0,y=0,tx=0,ty=0,on=false;
addEventListener("pointermove",function(e){tx=e.clientX;ty=e.clientY;if(!on){on=true;x=tx;y=ty;d.style.opacity=1;loop()}},{passive:true});
document.addEventListener("mouseleave",function(){d.style.opacity=0;on=false});
function loop(){if(!on)return;x+=(tx-x)*.12;y+=(ty-y)*.12;d.style.transform="translate("+x.toFixed(1)+"px,"+y.toFixed(1)+"px)";requestAnimationFrame(loop)}}

/* ── cartes : bordure lumineuse + inclinaison 3D ── */
function mark(){
[].forEach.call(document.querySelectorAll(SEL),function(e){
if(e.querySelector(":scope>.fxg"))return;e.classList.add("fxc");
var g=document.createElement("i");g.className="fxg";g.setAttribute("aria-hidden","true");e.appendChild(g)})}
function cards(){
document.addEventListener("pointermove",function(e){
var el=e.target.closest&&e.target.closest(".fxc");if(!el)return;
var r=el.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
el.style.setProperty("--mx",x+"px");el.style.setProperty("--my",y+"px");
if(!lite&&!reduce&&el.matches(TILT)){el.classList.add("fxt");
el.style.transform="perspective(900px) rotateX("+((.5-y/r.height)*7).toFixed(2)+"deg) rotateY("+((x/r.width-.5)*9).toFixed(2)+"deg) translateY(-4px)"}},{passive:true});
document.addEventListener("pointerout",function(e){
var el=e.target.closest&&e.target.closest(".fxt");
if(el&&!el.contains(e.relatedTarget)){el.classList.remove("fxt");el.style.transform=""}})}

/* ── titres : le dernier mot brille (si la page n'a pas déjà balisé un <em>) ── */
function glow(){
[].forEach.call(document.querySelectorAll("h1"),function(h){
if(h.children.length||h.querySelector("em,.gl"))return;
var t=h.textContent.trim(),i=t.lastIndexOf(" ");if(i<1)return;
var e=document.createElement("em");e.className="gl";e.textContent=t.slice(i+1);
h.textContent=t.slice(0,i+1);h.appendChild(e)})}

/* ── hero : avancement du scroll pour estomper le halo pendant la désintégration ── */
var acc=document.getElementById("accueil"),pin=acc&&acc.querySelector(".pin");
function hero(){
if(!pin)return;var r=acc.getBoundingClientRect(),tot=acc.offsetHeight-innerHeight;
pin.style.setProperty("--hp",(tot>0?cl(-r.top/tot,0,1):0).toFixed(3))}

/* ── rail de sections « 03 / 09 » ── */
var LB={accueil:["Accueil","Home"],protection:["Protection","Protection"],rankup:["Rankup","Rankup"],fonctions:["Fonctions","Features"],apercus:["Aperçus","Previews"],direct:["En direct","Live"],gratuit:["Gratuit","Free"],faq:["FAQ","FAQ"],rejoindre:["Rejoindre","Join"]},
rail,secs=[],lastK=-1,lastL="";
function buildRail(){
secs=[].filter.call(document.querySelectorAll("main section[id]"),function(s){return LB[s.id]});
if(secs.length<4)return;
rail=document.createElement("div");rail.id="fxrail";rail.setAttribute("aria-hidden","true");
rail.innerHTML='<div class="n"></div><div class="l"></div><div class="t">'+secs.map(function(){return"<b></b>"}).join("")+"</div>";
document.body.appendChild(rail)}
function railUpdate(){
if(!rail)return;var y=scrollY+innerHeight*.4,k=0;
secs.forEach(function(s,i){if(s.offsetTop<=y)k=i});
var p=function(n){return(n<10?"0":"")+n},en=document.documentElement.lang==="en"?1:0;
if(k===lastK&&document.documentElement.lang===lastL)return;lastK=k;lastL=document.documentElement.lang;
rail.firstChild.innerHTML=p(k+1)+"<i>/"+p(secs.length)+"</i>";
rail.children[1].textContent=LB[secs[k].id][en];
[].forEach.call(rail.lastChild.children,function(b,i){b.className=i===k?"on":""})}

var tick=false;
function onScroll(){tick=false;hero();railUpdate()}
function init(){
glow();mark();
if(!lite)stars();
if(!lite&&fine&&!reduce)light();
cards();
if(!lite){buildRail();onScroll();
addEventListener("scroll",function(){if(!tick){tick=true;requestAnimationFrame(onScroll)}},{passive:true});
addEventListener("resize",onScroll)}
/* les pages se re-rendent (langue, blog, docs) : on ré-applique les effets */
var q=false;
new MutationObserver(function(){if(q)return;q=true;requestAnimationFrame(function(){q=false;glow();mark();railUpdate()})}).observe(document.body,{childList:true,subtree:true,characterData:true});
document.addEventListener("click",function(e){if(e.target.closest&&e.target.closest(".lang button"))setTimeout(railUpdate,50)})}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();