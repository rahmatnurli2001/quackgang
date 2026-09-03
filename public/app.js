const tasks=["follow","repost","like","comment"];
const done=new Set();

const message=document.getElementById("message");
const commentLink=document.getElementById("commentLink");
const wallet=document.getElementById("wallet");
const submit=document.getElementById("submit");

function showCheck(name){
  done.add(name);
  const el=document.querySelector(`.${name}-check`);
  if(el) el.classList.add("visible");
}

function clearCheck(name){
  done.delete(name);
  const el=document.querySelector(`.${name}-check`);
  if(el) el.classList.remove("visible");
}

tasks.forEach(name=>{
  document.querySelector(`[data-task="${name}"]`)?.addEventListener("click",()=>{
    showCheck(name);
  });
});

commentLink.addEventListener("input",()=>{
  const v=commentLink.value.trim();
  const valid=/^https?:\/\/(www\.)?(x\.com|twitter\.com)\/[^/]+\/status\/\d+/i.test(v);
  if(valid) showCheck("comment");
  else clearCheck("comment");
});

function validWallet(v){
  return /^0x[a-fA-F0-9]{20,120}$/.test(v);
}

submit.addEventListener("click",async()=>{
  message.textContent="";
  message.style.color="#20d84b";

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
      body:JSON.stringify({wallet:w,commentLink:commentLink.value.trim()})
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

const modal=document.getElementById("infoModal");
const modalTitle=document.getElementById("modalTitle");
const modalBody=document.getElementById("modalBody");
const closeModal=document.getElementById("closeModal");

function openModal(title,html){
  modalTitle.textContent=title;
  modalBody.innerHTML=html;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
}
function hideModal(){
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden","true");
}

document.querySelector(".nav.home")?.addEventListener("click",e=>{
  e.preventDefault();
  window.scrollTo({top:0,behavior:"smooth"});
});

document.querySelector(".nav.join")?.addEventListener("click",e=>{
  e.preventDefault();
  document.getElementById("whitelist")?.scrollIntoView({behavior:"smooth",block:"center"});
});

document.querySelector(".nav.about")?.addEventListener("click",e=>{
  e.preventDefault();
  openModal("ABOUT QUACK GANG",
    "<p>QUACK GANG is a collection of 4,444 unique QUACKS on Robinhood Chain.</p><p>Be different. Be Quack.</p>");
});

document.querySelector(".nav.faq")?.addEventListener("click",e=>{
  e.preventDefault();
  openModal("FAQ",
    "<p><b>How many spots?</b><br>1,000 first wallets.</p><p><b>How do I join?</b><br>Complete the tasks, paste your GANG comment link, then submit your wallet.</p><p><b>Is the mint free?</b><br>Whitelist terms are announced by QUACK GANG.</p>");
});

closeModal?.addEventListener("click",hideModal);
modal?.addEventListener("click",e=>{if(e.target===modal) hideModal();});
document.addEventListener("keydown",e=>{if(e.key==="Escape") hideModal();});
