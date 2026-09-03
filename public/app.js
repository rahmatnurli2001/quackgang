
const counter=document.getElementById("counter");
async function updateCounter(){
  if(!counter) return;
  try{
    const r=await fetch("/api/count",{cache:"no-store"});
    const d=await r.json();
    const n=Math.max(0,Math.min(1000,Number(d.count)||0));
    counter.querySelector(".counter-number").textContent=n.toLocaleString();
  }catch(e){
    counter.querySelector(".counter-number").textContent="0";
  }
}
updateCounter();
const tasks=["follow","repost","like","quote"];
const done=new Set();
const message=document.getElementById("message");
const wallet=document.getElementById("wallet");
const submit=document.getElementById("submit");

function showCheck(name){done.add(name);document.querySelector(`.${name}-check`)?.classList.add("visible")}


const quoteText="4444 QUACK GANG IS COMING TO ROBINHOOD CHAIN\n#ROBINHOOD #QUACKGANG #NFT";
const pinnedPost="https://x.com/QuackGangRH/status/2095050569119674381?s=20";
const quoteTask=document.querySelector('[data-task="quote"]');

if(quoteTask){
  quoteTask.href=`https://x.com/intent/tweet?text=${encodeURIComponent(quoteText)}&url=${encodeURIComponent(pinnedPost)}`;
  quoteTask.target="_blank";
  quoteTask.rel="noopener";
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
    message.textContent="WHITELIST SUBMITTED ✓";wallet.value="";updateCounter();
  }catch(e){message.style.color="#ff5555";message.textContent=e.message||"Unable to submit right now"}
  finally{submit.disabled=false}
});
