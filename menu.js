(()=>{'use strict';
const $=id=>document.getElementById(id),base='assets/sexta13/',query=new URLSearchParams(location.search),parentOrigin=query.get('origin'),standalone=window.parent===window;
// Aceite único por navegador e por edição do evento; não interfere no saldo nem no save.
const ACCEPT_KEY='mf-mini-evento-sexta13-2026-11-aceito';
const readAccepted=()=>{try{return localStorage.getItem(ACCEPT_KEY)==='1'}catch{return false}};
const saveAccepted=()=>{try{localStorage.setItem(ACCEPT_KEY,'1')}catch{}};
const DICE_MS=1300,CAT_MS=3170;let state={active:true,canPlay:true,spins:0,fed:false,coins:50000,level:1,nextFeedAt:0,lockUntil:0,noCatRolls:0,greenWins:0,feeds:0,luckUpgrades:0,greenBalance:15,lastRescueSpin:-10},pending=false,rolling=false,accepted=readAccepted(),queuedResult=null,queuedState=null,rollStarted=0;
const luckRate=s=>Math.min(99,Math.max(0,30+(Number(s?.feeds)||0)+15*(Number(s?.luckUpgrades)||0)));
const upgradeCost=s=>Number(s?.luckUpgrades)>=2?0:Number(s?.luckUpgrades)===1?10:2;
const feedPrice=s=>{const spins=Number(s?.spins)||0,level=Number(s?.level)||1,tier=spins<3?0:spins<6?1:2;return (level<=20?[150,450,700]:[400,700,950])[tier]};
let demoLastFeed=0;const fmt=n=>Math.max(0,Math.ceil(n/1000))+'s';const post=(type,extra={})=>{if(!standalone)window.parent.postMessage({type,...extra},parentOrigin||'*')};
function scale(){const v=$('viewport'),k=Math.min(1,v.clientWidth/600,v.clientHeight/560);$('menu').style.transform='scale('+k+')'}window.addEventListener('resize',scale);scale();
const img=(name,file)=>{const el=$(name);el.src=base+file;el.onerror=()=>{el.style.display='none';el.parentElement.textContent=name==='catImg'?'🐈‍⬛':'⚄'}};
function showMessage(message){$('message').textContent=message||''}
function render(){const t=Date.now(),s=state||{},lock=Math.max(0,(s.lockUntil||0)-t),cool=Math.max(0,(s.nextFeedAt||0)-t);$('count').textContent='Giros '+(s.spins||0)+' / 13';$('coins').textContent='Moedas '+(Number.isFinite(s.coins)?s.coins.toLocaleString('pt-BR'):'—');$('timer').textContent=lock?'Espera '+fmt(lock):cool?'Espera '+fmt(cool):'Espera Pronto!';$('feed').disabled=pending||rolling||!s.active||!s.canPlay||s.fed||lock>0||cool>0||(s.spins||0)>=13||Number(s.coins)<feedPrice(s);$('roll').disabled=pending||rolling||!s.active||!s.canPlay||!s.fed||lock>0;$('feed').textContent= s.fed?'✓ Alimentado':cool?'🐟 Alimentar em '+fmt(cool):'🐟 Alimentar • '+(Number.isFinite(s.feedCost)?s.feedCost:feedPrice(s))+' moedas';
 const luck=Number.isFinite(s.luckPercent)?s.luckPercent:luckRate(s);
 $('chances').textContent='🍀 SORTE '+luck+'%   💀 AZAR '+(100-luck)+'%';
 const cost=upgradeCost(s),max=cost===0,up=$('lessBad');
 up.disabled=pending||rolling||!s.active||!s.canPlay||max||Number(s.greenBalance||0)<cost;
 up.classList.toggle('maxed',max);
 $('lessBadText').textContent=max?'✓ Menos azar no máximo':'Menos azar • '+cost;
 $('greenBalance').textContent=max?'':'Saldo: '+(Number(s.greenBalance)||0);
 }
function animateCat(){img('catImg','gato-comendo.gif');setTimeout(()=>img('catImg','gato-parado.gif'),CAT_MS)}
function finalizeRoll(){const delay=Math.max(0,DICE_MS-(Date.now()-rollStarted));setTimeout(()=>{rolling=false;img('diceImg','dado-parado.gif');if(queuedResult){const result=queuedResult;queuedResult=null;if(result.state)state=result.state;showMessage(result.message||'Resultado recebido.');pending=false}else if(standalone){pending=false}else if(queuedState){state=queuedState;queuedState=null}render()},delay)}
function demo(kind){const t=Date.now();if(state.lockUntil&&t>=state.lockUntil){state.spins=0;state.lockUntil=0;state.nextFeedAt=0;state.fed=false;state.feeds=0;state.lastRescueSpin=-10}if(kind==='upgrade'){const cost=upgradeCost(state);if(!cost||state.greenBalance<cost)return;state.greenBalance-=cost;state.luckUpgrades++;showMessage('🍀 Menos azar melhorado! Sorte '+luckRate(state)+'%.')}if(kind==='feed'){if(state.fed||state.nextFeedAt>t||state.lockUntil>t||state.spins>=13||state.coins<feedPrice(state))return;state.coins-=feedPrice(state);state.fed=true;state.feeds=Math.min(13,(state.feeds||0)+1);demoLastFeed=t;state.nextFeedAt=t+60000;animateCat();showMessage('🐟 Gato alimentado! Um giro liberado.')}if(kind==='roll'){if(!state.fed)return;state.fed=false;state.spins++;const luck=state.spins>=11||Math.random()<luckRate(state)/100;let message='💀 AZAR! Sem recompensa.',reward=null;
 if(luck){
   const catRate=state.noCatRolls>=10?.30:.05;
   if(Math.random()<catRate)reward='rare';
   else{
     const weights=[40,35,20*Math.pow(.5,Math.min(state.greenWins,20))],sum=weights.reduce((a,b)=>a+b,0),draw=Math.random()*sum;
     reward=draw<weights[0]?'coins':draw<weights[0]+weights[1]?'xp':'mini-grana';
   }
   if(reward==='rare')message='🍀 SORTE! Você ganhou o Gatinho Preto (Mini Baú)!';
   if(reward==='coins'){const coins=500+Math.floor(Math.random()*1001);state.coins+=coins;message='🍀 SORTE! Você ganhou '+coins+' moedas!'}
   if(reward==='xp')message='🍀 SORTE! Você ganhou '+(50+Math.floor(Math.random()*201))+' XP!';
   if(reward==='mini-grana'){state.greenWins++;state.greenBalance+=1;message='🍀 SORTE! Você ganhou '+(1+Math.floor(Math.random()*2))+' Mini Grana(s)!'}
 }
 // No modo prévia a ajuda depende do saldo restante para a próxima ração.
 const nextCost=state.spins<13?feedPrice(state):0;
 const needHelp=state.spins>=1&&state.spins<13&&state.coins<nextCost&&nextCost-state.coins<=1500&&state.spins-state.lastRescueSpin>=3;
 if(needHelp){
   const gift=Math.max(500+Math.floor(Math.random()*1001),nextCost-state.coins);
   state.coins+=gift;state.lastRescueSpin=state.spins;reward='coins';
   message='🪙 Ajuda para continuar! Você ganhou '+gift+' moedas!';
 }
 state.noCatRolls=reward==='rare'?0:Math.min(1000000,state.noCatRolls+1);if(state.spins===13){state.lockUntil=t+13*3600000;message+=' O gato descansará por 13 horas.'}queuedResult={message,state:{...state}}}}
function action(kind){if(pending||rolling)return;if(kind==='upgrade'){if(upgradeCost(state)===0)return;if(standalone)demo('upgrade');else{pending=true;post('mf-mini-action',{action:kind,requestId:'s13-'+Date.now()})}render();return}if(kind==='feed'){if(standalone)demo(kind);else{pending=true;animateCat();post('mf-mini-action',{action:kind,requestId:'s13-'+Date.now()})}render();return}
if(kind==='roll'){if(!state.fed||pending)return;rolling=true;rollStarted=Date.now();showMessage('🎲 O dado está girando...');img('diceImg','dado-girando.gif');if(standalone)demo(kind);else{pending=true;post('mf-mini-action',{action:kind,requestId:'s13-'+Date.now()})}render();finalizeRoll()}}
function showGame(){accepted=true;$('intro').classList.add('hidden');$('game').classList.remove('hidden');post('mf-mini-open');render()}
$('accept').addEventListener('click',()=>{saveAccepted();showGame()});
$('close').addEventListener('click',()=>{if(standalone){if(accepted){$('game').classList.add('hidden');$('intro').classList.remove('hidden')}else{$('intro').classList.remove('hidden');$('game').classList.add('hidden')}}else post('mf-mini-close')});
$('lessBad').addEventListener('click',()=>action('upgrade'));
$('feed').addEventListener('click',()=>action('feed'));$('roll').addEventListener('click',()=>action('roll'));
window.addEventListener('message',e=>{if(standalone||e.source!==window.parent||parentOrigin&&e.origin!==parentOrigin)return;const d=e.data;if(!d||typeof d!=='object')return;if(d.type==='mf-mini-state'){if(rolling){queuedState=d.state;return}state=d.state;pending=false;render()}if(d.type==='mf-mini-result'){if(rolling){queuedResult=d;return}pending=false;if(d.state)state=d.state;showMessage(d.message||'');render()}});
setInterval(()=>{if(state.lockUntil&&Date.now()>=state.lockUntil&&standalone){state.spins=0;state.lockUntil=0;state.nextFeedAt=0;state.fed=false;state.feeds=0;state.lastRescueSpin=-10}render()},500);
if(accepted)showGame();post('mf-mini-ready');if(standalone)showMessage('Prévia: simulação sem prêmios reais.');render();
})();