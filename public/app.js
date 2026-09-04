const tasks=["follow","repost","like","quote"];
const done=new Set();
const message=document.getElementById("message");
const wallet=document.getElementById("wallet");
const submit=document.getElementById("submit");
const liveNumber=document.getElementById("live-number");
const liveFill=document.getElementById("live-fill");

function showCheck(name){
  done.add(name);
  document.querySelector(`.${name}-check`)?.classList.add("visible");
}

const quoteText="4444 QUACK GANG IS COMING TO ROBINHOOD CHAIN\n#ROBINHOOD #QUACKGANG #NFT";
const pinnedPost="https://x.com/QuackGangRH/status/2095050569119674381?s=20";

document.querySelector('[data-task="quote"]')?.addEventListener("click",e=>{
  e.currentTarget.href=`https://x.com/intent/tweet?text=${encodeURIComponent(quoteText)}&url=${encodeURIComponent(pinnedPost)}`;
  showCheck("quote");
});

tasks.filter(x=>x!=="quote").forEach(name=>{
  document.querySelector(`[data-task="${name}"]`)?.addEventListener("click",()=>showCheck(name));
});

async function updateCounter(){
  try{
    const r=await fetch("/api/count",{cache:"no-store"});
    const d=await r.json();
    const n=Math.max(0,Math.min(1000,Number(d.count)||0));
    liveNumber.textContent=`${n.toLocaleString()} / 1,000`;
    liveFill.style.transform=`scaleX(${n/1000})`;
  }catch(e){
    liveNumber.textContent="0 / 1,000";
    liveFill.style.transform="scaleX(0)";
  }
}
updateCounter();

function validWallet(v){return /^0x[a-fA-F0-9]{20,120}$/.test(v)}

submit.addEventListener("click",async()=>{
  message.textContent="";
  if(tasks.some(x=>!done.has(x))){
    message.style.color="#ff5555";
    message.textContent="Please complete all tasks first.";
    return;
  }
  const w=wallet.value.trim();
  if(!validWallet(w)){
    message.style.color="#ff5555";
    message.textContent="Please enter a valid wallet address.";
    return;
  }
  submit.disabled=true;
  try{
    const r=await fetch("/api/submit",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({wallet:w})
    });
    const d=await r.json();
    if(!r.ok)throw new Error(d.error||"Submission failed.");
    message.style.color="#20d84b";
    message.textContent="WHITELIST SUBMITTED ✓";
    wallet.value="";
    await updateCounter();
  }catch(e){
    message.style.color="#ff5555";
    message.textContent=e.message||"Unable to submit right now";
  }finally{
    submit.disabled=false;
  }
});
