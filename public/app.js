const tasks=["follow","repost","like"];
const done=new Set();
const message=document.getElementById("message");
const commentLink=document.getElementById("commentLink");
const wallet=document.getElementById("wallet");
const submit=document.getElementById("submit");

function showCheck(name){
  done.add(name);
  document.querySelector(`.${name}-check`)?.classList.add("visible");
}

tasks.forEach(name=>{
  document.querySelector(`[data-task="${name}"]`)?.addEventListener("click",()=>{
    setTimeout(()=>showCheck(name),500);
  });
});

commentLink.addEventListener("input",()=>{
  const v=commentLink.value.trim();
  const valid=/^https?:\/\/(www\.)?(x\.com|twitter\.com)\/[^/]+\/status\/\d+/i.test(v);
  if(valid) showCheck("comment");
  else{
    done.delete("comment");
    document.querySelector(".comment-check")?.classList.remove("visible");
  }
});

function validWallet(v){return /^0x[a-fA-F0-9]{20,120}$/.test(v)}

submit.addEventListener("click",async()=>{
  message.textContent="";
  message.style.color="#20d84b";

  if(["follow","repost","like","comment"].some(x=>!done.has(x))){
    message.style.color="#ff5555";
    message.textContent="Please complete all tasks first.";
    return;
  }
  if(!validWallet(wallet.value.trim())){
    message.style.color="#ff5555";
    message.textContent="Please enter a valid wallet address.";
    return;
  }

  submit.disabled=true;
  try{
    const r=await fetch("/api/submit",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        wallet:wallet.value.trim(),
        commentLink:commentLink.value.trim()
      })
    });
    const d=await r.json();
    if(!r.ok) throw new Error(d.error||"Submission failed.");
    message.textContent="WHITELIST SUBMITTED ✓";
    wallet.value="";
    commentLink.value="";
  }catch(e){
    message.style.color="#ff5555";
    message.textContent=e.message||"Unable to submit right now.";
    submit.disabled=false;
  }
});
