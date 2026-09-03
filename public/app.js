const MAX_WALLETS=1000;
const walletInput=document.getElementById("wallet");
const humanCheck=document.getElementById("human");
const submitButton=document.getElementById("submit");
const message=document.getElementById("message");
const countDisplay=document.getElementById("count");
const progress=document.getElementById("progress");

document.querySelectorAll("[data-task]").forEach(el=>{
  el.addEventListener("click",()=>{
    const card=el.closest("[data-task-card]");
    if(card) card.classList.add("task-completed");
  });
});

async function updateCounter(){
 try{
  const r=await fetch("/api/count"); const d=await r.json();
  const n=Number(d.count||0); countDisplay.textContent=n.toLocaleString();
  progress.style.width=Math.min(100,n/MAX_WALLETS*100)+"%";
  if(n>=MAX_WALLETS){submitButton.disabled=true;submitButton.textContent="WHITELIST FULL";walletInput.disabled=true;humanCheck.disabled=true;}
 }catch(e){}
}
function validWallet(w){return /^0x[a-fA-F0-9]{20,120}$/.test(w)}
submitButton.addEventListener("click",async()=>{
 message.textContent="";
 const w=walletInput.value.trim();
 if(!validWallet(w)){message.textContent="Please enter a valid wallet address.";return}
 if(!humanCheck.checked){message.textContent="Please complete the human verification.";return}
 submitButton.disabled=true;submitButton.textContent="SUBMITTING...";
 try{
  const r=await fetch("/api/submit",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({wallet:w})});
  const d=await r.json(); if(!r.ok) throw new Error(d.error||"Submission failed.");
  message.textContent="WHITELIST SUBMITTED ✓ Your wallet has been recorded.";
  message.style.color="#20d84b"; walletInput.value=""; humanCheck.checked=false; await updateCounter();
  if(Number(countDisplay.textContent.replace(/,/g,""))<MAX_WALLETS){submitButton.disabled=false;submitButton.textContent="SUBMIT & JOIN THE GANG 🦆"}
 }catch(e){message.textContent=e.message||"Unable to submit right now.";message.style.color="#ff5555";submitButton.disabled=false;submitButton.textContent="SUBMIT & JOIN THE GANG 🦆"}
});
updateCounter();