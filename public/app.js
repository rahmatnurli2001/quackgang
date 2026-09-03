const tasks=["follow","repost","like","comment"];
const done=new Set();
const message=document.getElementById("message");
const commentLink=document.getElementById("commentLink");
const wallet=document.getElementById("wallet");
const submit=document.getElementById("submit");

function showCheck(name){done.add(name);document.querySelector(`.${name}-check`)?.classList.add("visible")}
function clearCheck(name){done.delete(name);document.querySelector(`.${name}-check`)?.classList.remove("visible")}

tasks.forEach(name=>document.querySelector(`[data-task="${name}"]`)?.addEventListener("click",()=>showCheck(name)));
commentLink.addEventListener("input",()=>{
  const valid=/^https?:\/\/(www\.)?(x\.com|twitter\.com)\/[^/]+\/status\/\d+/i.test(commentLink.value.trim());
  valid?showCheck("commentLink"):clearCheck("commentLink");
});
function validWallet(v){return /^0x[a-fA-F0-9]{20,120}$/.test(v)}
submit.addEventListener("click",async()=>{
  message.textContent="";message.style.color="#20d84b";
  if(tasks.some(x=>!done.has(x))||!done.has("commentLink")){
    message.style.color="#ff5555";message.textContent="Please complete all tasks first.";return;
  }
  const w=wallet.value.trim();
  if(!validWallet(w)){message.style.color="#ff5555";message.textContent="Please enter a valid wallet address.";return}
  submit.disabled=true;
  try{
    const r=await fetch("/api/submit",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({wallet:w,commentLink:commentLink.value.trim()})});
    const d=await r.json();
    if(!r.ok)throw new Error(d.error||"Submission failed.");
    message.textContent="WHITELIST SUBMITTED ✓";wallet.value="";commentLink.value="";
  }catch(e){message.style.color="#ff5555";message.textContent=e.message||"Unable to submit right now."}
  finally{submit.disabled=false}
});
