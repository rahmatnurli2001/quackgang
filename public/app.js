
// Top-right JOIN THE GANG button scrolls directly to the whitelist tasks.
const joinButton=document.querySelector('.hotspot.join');
const whitelistAnchor=document.getElementById('whitelist');
joinButton?.addEventListener('click',e=>{
  e.preventDefault();
  whitelistAnchor?.scrollIntoView({behavior:'smooth',block:'center'});
});
const tasks=["follow","repost","like","quote"];
const done=new Set();
const message=document.getElementById("message");
const wallet=document.getElementById("wallet");
const submit=document.getElementById("submit");

function showCheck(name){done.add(name);document.querySelector(`.${name}-check`)?.classList.add("visible")}
const quoteText="4444 QUACK GANG IS COMING TO ROBINHOOD CHAIN\n\n#ROBINHOOD #QUACKGANG #NFT";
const pinnedPost="https://x.com/quackgangrh/status/2095050569119674381";
const quoteTask=document.querySelector('[data-task="quote"]');
if(quoteTask){
  quoteTask.href=`https://twitter.com/intent/tweet?text=${encodeURIComponent(quoteText)}&url=${encodeURIComponent(pinnedPost)}`;
}
tasks.forEach(name=>document.querySelector(`[data-task="${name}"]`)?.addEventListener("click",()=>showCheck(name)));
function validWallet(v){return /^0x[a-fA-F0-9]{20,120}$/.test(v)}
submit.addEventListener("click",async()=>{
  message.textContent="";message.style.color="#20d84b";
  if(tasks.some(x=>!done.has(x))){message.style.color="#ff5555";message.textContent="Please complete all tasks first.";return}
  const w=wallet.value.trim();
  if(!validWallet(w)){message.style.color="#ff5555";message.textContent="Please enter a valid wallet address.";return}
  submit.disabled=true;
  try{
    const r=await fetch("/api/submit",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({wallet:w})});
    const d=await r.json();
    if(!r.ok)throw new Error(d.error||"Submission failed.");
    message.textContent="WHITELIST SUBMITTED ✓";wallet.value="";
  }catch(e){message.style.color="#ff5555";message.textContent=e.message||"Unable to submit right now"}
  finally{submit.disabled=false}
});
