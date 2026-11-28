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
var LB={accueil:["Accueil","Home"],protection:["Protection","Protection"],rankup:["Rankup","Rankup"],interserveur:["Interserveur","Interserver"],fonctions:["Fonctions","Features"],apercus:["Aperçus","Previews"],direct:["En direct","Live"],gratuit:["Gratuit","Free"],faq:["FAQ","FAQ"],rejoindre:["Rejoindre","Join"]},
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

/* ── passerelle Discord : fenêtre sécurisée avant d'ouvrir l'invitation du bot ou le serveur support ── */
(function(){
"use strict";
var cs=document.currentScript;if(cs&&cs.hasAttribute("data-lite"))return;
var TX={fr:{g:"PASSERELLE SÉCURISÉE",bot:"Inviter CoreLab",sup:"Rejoindre le support",dom:"Domaine vérifié",tls:"Connexion chiffrée (HTTPS)",adm:"Permissions demandées",admv:"Administrateur",srv:"Serveur",srvv:"Support officiel CoreLab",an:"ANALYSE DU LIEN…",ok:"DOMAINE OFFICIEL DISCORD",go:"Continuer vers Discord",no:"Annuler",w:"Vérifie les permissions avant d'accepter."},
en:{g:"SECURE GATEWAY",bot:"Invite CoreLab",sup:"Join the support server",dom:"Verified domain",tls:"Encrypted connection (HTTPS)",adm:"Requested permissions",admv:"Administrator",srv:"Server",srvv:"Official CoreLab support",an:"ANALYZING LINK…",ok:"OFFICIAL DISCORD DOMAIN",go:"Continue to Discord",no:"Cancel",w:"Check the permissions before accepting."}};
function kind(a){var u;try{u=new URL(a.href,location.href)}catch(e){return null}
if(u.hostname==="discord.com"&&u.pathname.indexOf("/oauth2/authorize")===0)return{k:"bot",u:u};
if(u.hostname==="discord.gg"||(u.hostname==="discord.com"&&u.pathname.indexOf("/invite/")===0))return{k:"sup",u:u};
return null}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function css(){if(document.getElementById("gwcss"))return;var s=document.createElement("style");s.id="gwcss";
s.textContent=".gw{position:fixed;inset:0;z-index:100000;display:grid;place-items:center;padding:20px;background:rgba(10,11,13,.84);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);animation:gwf .25s ease-out;font-family:ui-monospace,Menlo,Consolas,monospace}"+
".gw-b{position:relative;width:min(440px,100%);padding:28px 24px 22px;background:#1e1f22;border:1px solid #3f4147;color:#f2f3f5;box-shadow:0 0 60px rgba(232,81,13,.18);animation:gwu .35s cubic-bezier(.2,.7,.2,1)}"+
".gw-c{position:absolute;width:20px;height:20px;border:0 solid #e8510d}.gw-c.a{top:-1px;left:-1px;border-top-width:2px;border-left-width:2px}.gw-c.b{top:-1px;right:-1px;border-top-width:2px;border-right-width:2px}.gw-c.c{bottom:-1px;left:-1px;border-bottom-width:2px;border-left-width:2px}.gw-c.d{bottom:-1px;right:-1px;border-bottom-width:2px;border-right-width:2px}"+
".gw-sh{position:relative;width:64px;margin:0 auto 12px;overflow:hidden}.gw-sh svg{display:block;width:64px;height:auto;overflow:visible}"+
".gw-sh .s{fill:rgba(232,81,13,.14);stroke:#e8510d;stroke-width:2.5;stroke-linejoin:round;stroke-dasharray:400;stroke-dashoffset:400;animation:gwd .7s ease-out forwards}"+
".gw-sh .c{fill:none;stroke:#2fb872;stroke-width:5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:60;stroke-dashoffset:60;animation:gwd .35s 1.2s ease-out forwards}"+
".gw-sh i{position:absolute;left:0;right:0;top:0;height:2px;background:#2fb872;box-shadow:0 0 10px 2px rgba(47,184,114,.55);animation:gws 1.1s .15s ease-in-out forwards;opacity:0}"+
".gw-g{text-align:center;font-size:10.5px;letter-spacing:.24em;color:#e8510d}.gw h3{margin:6px 0 16px;text-align:center;font:800 22px/1.2 system-ui,-apple-system,'Segoe UI',sans-serif;letter-spacing:-.01em}"+
".gw ul{list-style:none;margin:0 0 14px;padding:0;display:flex;flex-direction:column;gap:7px;font-size:12px;color:#b5bac1}"+
".gw li{display:flex;gap:8px;opacity:0;animation:gwo .25s forwards}.gw li::before{content:'✓';color:#2fb872;font-weight:700}.gw li.w::before{content:'!';color:#e8510d}.gw li b{margin-left:auto;color:#f2f3f5;font-weight:600;text-align:right}"+
".gw li:nth-child(1){animation-delay:.4s}.gw li:nth-child(2){animation-delay:.7s}.gw li:nth-child(3){animation-delay:1s}"+
".gw-bar{height:3px;background:#313338;overflow:hidden}.gw-bar i{display:block;height:100%;background:linear-gradient(90deg,#e8510d,#2fb872);transform-origin:left;transform:scaleX(0);animation:gwp 1.25s .1s ease-in-out forwards}"+
".gw-st{margin:8px 0 14px;text-align:center;font-size:10.5px;letter-spacing:.2em;color:#b5bac1}.gw-st.ok{color:#2fb872}"+
".gw-w{margin:-4px 0 14px;text-align:center;font:12px system-ui,sans-serif;color:#b5bac1}"+
".gw-bt{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}.gw-bt button{font:600 14px system-ui,sans-serif;padding:11px 20px;border-radius:8px;cursor:pointer;border:1px solid #e8510d;background:#e8510d;color:#fff;transition:opacity .2s,transform .15s}"+
".gw-bt button:hover:not(:disabled){transform:translateY(-1px)}.gw-bt button:disabled{opacity:.35;cursor:wait}.gw-bt .g{background:transparent;border-color:#3f4147;color:#f2f3f5}"+
"@keyframes gwf{from{opacity:0}}@keyframes gwu{from{opacity:0;transform:translateY(14px) scale(.97)}}@keyframes gwd{to{stroke-dashoffset:0}}@keyframes gwo{to{opacity:1}}@keyframes gwp{to{transform:scaleX(1)}}@keyframes gws{0%{opacity:1;transform:translateY(0)}90%{opacity:1}100%{opacity:0;transform:translateY(60px)}}"+
"@media(prefers-reduced-motion:reduce){.gw,.gw *{animation-duration:.01s!important;animation-delay:0s!important}}";
document.head.appendChild(s)}
function open(info,from){css();
var t=TX[document.documentElement.lang==="en"?"en":"fr"],o=el("div","gw"),b=el("div","gw-b"),prev=document.activeElement;
o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label",t[info.k]);
["a","b","c","d"].forEach(function(x){b.appendChild(el("i","gw-c "+x))});
var sh=el("div","gw-sh");sh.innerHTML='<svg viewBox="0 0 100 120"><path class="s" d="M50 5 91 20v33c0 27-17 45-41 54C26 98 9 80 9 53V20z"/><path class="c" d="M34 56l12 12 22-26"/></svg><i></i>';
b.appendChild(sh);b.appendChild(el("div","gw-g",t.g));b.appendChild(el("h3",null,t[info.k]));
var ul=el("ul"),l1=el("li");l1.appendChild(document.createTextNode(t.dom));l1.appendChild(el("b",null,info.u.hostname));ul.appendChild(l1);
if(info.u.protocol==="https:"){var l2=el("li");l2.appendChild(document.createTextNode(t.tls));ul.appendChild(l2)}
var l3=el("li");
if(info.k==="bot"&&info.u.searchParams.get("permissions")==="8"){l3.className="w";l3.appendChild(document.createTextNode(t.adm));l3.appendChild(el("b",null,t.admv))}
else if(info.k==="sup"){l3.appendChild(document.createTextNode(t.srv));l3.appendChild(el("b",null,t.srvv))}
else l3=null;
if(l3)ul.appendChild(l3);b.appendChild(ul);
var bar=el("div","gw-bar");bar.appendChild(el("i"));b.appendChild(bar);
var st=el("div","gw-st",t.an);b.appendChild(st);
if(info.k==="bot")b.appendChild(el("div","gw-w",t.w));
var bt=el("div","gw-bt"),go=el("button",null,t.go),no=el("button","g",t.no);go.type=no.type="button";go.disabled=true;bt.appendChild(go);bt.appendChild(no);b.appendChild(bt);
o.appendChild(b);document.body.appendChild(o);
function close(){clearTimeout(tm);document.removeEventListener("keydown",key,true);if(o.parentNode)o.parentNode.removeChild(o);if(prev&&prev.focus)try{prev.focus()}catch(e){}}
function key(e){if(e.key==="Escape"){e.preventDefault();close()}}
var tm=setTimeout(function(){st.textContent=t.ok;st.className="gw-st ok";go.disabled=false;go.focus()},1350);
document.addEventListener("keydown",key,true);
no.onclick=close;o.addEventListener("click",function(e){if(e.target===o)close()});
go.onclick=function(){window.open(info.u.href,"_blank","noopener");close()}}
document.addEventListener("click",function(e){
if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
var a=e.target&&e.target.closest?e.target.closest("a[href]"):null;if(!a)return;
var i=kind(a);if(!i)return;e.preventDefault();open(i,a)},true);
})();


/* ── CYBER++ : viseur, flux de données, titres qui se décryptent ── */
(function(){
"use strict";
var cs=document.currentScript;if(cs&&cs.hasAttribute("data-lite"))return;
var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches,
fine=window.matchMedia&&matchMedia("(hover:hover) and (pointer:fine)").matches;
if(reduce)return;
function div(c){var d=document.createElement("div");d.className=c;document.body.appendChild(d);return d}
function init(){
if(fine){document.documentElement.classList.add("tl-on");var r=div("tl-ring"),d=div("tl-dot"),x=-100,y=-100,rx=x,ry=y;
addEventListener("mousemove",function(e){x=e.clientX;y=e.clientY;d.style.translate=x+"px "+y+"px";
var t=e.target&&e.target.closest?e.target.closest("a,button,summary,label,input,select,textarea,[role=button]"):null;r.classList.toggle("lk",!!t)},{passive:true});
(function f(){rx+=(x-rx)*.2;ry+=(y-ry)*.2;r.style.translate=rx+"px "+ry+"px";requestAnimationFrame(f)})()}
["l","r"].forEach(function(s){var c=document.createElement("canvas");c.className="tl-str "+s;c.setAttribute("aria-hidden","true");document.body.appendChild(c);
var g=c.getContext("2d"),W=c.width=40,H,dr=[0,0],last=0,HX="0123456789ABCDEF";
function sz(){H=c.height=innerHeight;dr=[Math.random()*H/14,Math.random()*H/14]}sz();addEventListener("resize",sz);
(function fr(t){requestAnimationFrame(fr);if(document.hidden||t-last<70||innerWidth<=1280)return;last=t;g.clearRect(0,0,W,H);g.font="12px ui-monospace,Menlo,Consolas,monospace";
for(var i=0;i<2;i++){for(var k=0;k<14;k++){var yy=(dr[i]-k)*14;if(yy<0||yy>H)continue;g.fillStyle="rgba(47,184,114,"+(k?(.5*(1-k/14)).toFixed(2):.9)+")";g.fillText(HX.charAt(Math.random()*16|0),6+i*16,yy)}
dr[i]+=1;if(dr[i]*14>H+200&&Math.random()>.97)dr[i]=0}})(0)});
var CH="01ABCDEF#$%&<>/",hs=document.querySelectorAll("h2");
if(!("IntersectionObserver" in window))return;
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var h=e.target,t=h.textContent;if(!t||h.children.length)return;io.unobserve(h);
var n=0,N=16,iv=setInterval(function(){n++;var o="";for(var i=0;i<t.length;i++){var ch=t.charAt(i);o+=(ch===" "||i<t.length*n/N)?ch:CH.charAt(Math.random()*CH.length|0)}
h.textContent=o;if(n>=N){clearInterval(iv);h.textContent=t}},35)})},{threshold:.6});
for(var i=0;i<hs.length;i++)io.observe(hs[i])}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();