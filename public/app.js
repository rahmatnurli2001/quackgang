const tasks=["follow","repost","like","comment"];
const done=new Set();
const $=s=>document.querySelector(s);
const message=$("#message"), commentLink=$("#commentLink"), wallet=$("#wallet"), submit=$("#submit");

function check(name){done.add(name);$(`.${name}-check`)?.classList.add("visible")}
function uncheck(name){done.delete(name);$(`.${name}-check`)?.classList.remove("visible")}

tasks.forEach(name=>{
  $(`[data-task="${name}"]`)?.addEventListener("click",()=>check(name));
});

commentLink.addEventListener("input",()=>{
  const v=commentLink.value.trim();
  /^https?:\/\/(www\.)?(x\.com|twitter\.com)\/[^/]+\/status\/\d+/i.test(v)?check("comment"):uncheck("comment");
});

function validWallet(v){return /^0x[a-fA-F0-9]{20,120}$/.test(v)}

async function loadCount(){
  try{
    const r=await fetch("/api/count",{cache:"no-store"});
    const d=await r.json();
    const n=Math.max(0,Math.min(1000,Number(d.count)||0));
    $("#counter").textContent=`${n.toLocaleString("en-US")} / 1,000`;
    $("#progress").style.transform=`scaleX(${n/1000})`;
  }catch(e){}
}
loadCount();

submit.addEventListener("click",async()=>{
  message.textContent="";
  message.style.color="#20d84b";
  if(tasks.some(x=>!done.has(x))){
    message.style.color="#ff5555";message.textContent="Please complete all tasks first.";return;
  }
  const w=wallet.value.trim();
  if(!validWallet(w)){
    message.style.color="#ff5555";message.textContent="Please enter a valid wallet address.";return;
  }
  submit.disabled=true;
  try{
    const r=await fetch("/api/submit",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({wallet:w,commentLink:commentLink.value.trim()})});
    const d=await r.json();
    if(!r.ok)throw new Error(d.error||"Submission failed.");
    message.textContent="WHITELIST SUBMITTED ✓";
    wallet.value="";commentLink.value="";
    tasks.forEach(uncheck);
    loadCount();
  }catch(e){
    message.style.color="#ff5555";message.textContent=e.message||"Unable to submit right now.";
  }finally{submit.disabled=false}
});

const modal=$("#modal"),title=$("#modalTitle"),body=$("#modalBody");
function openModal(t,b){title.textContent=t;body.innerHTML=b;modal.classList.add("open")}
function closeModal(){modal.classList.remove("open")}
$(".home").onclick=e=>{e.preventDefault();scrollTo({top:0,behavior:"smooth"})};
$(".join").onclick=e=>{e.preventDefault();$("#whitelist").scrollIntoView({behavior:"smooth"})};
$(".about").onclick=e=>{e.preventDefault();openModal("ABOUT QUACK GANG","<p>QUACK GANG is a collection of 4,444 unique QUACKS on Robinhood Chain.</p><p>Be different. Be Quack.</p>")};
$(".faq").onclick=e=>{e.preventDefault();openModal("FAQ","<p><b>How many whitelist spots?</b><br>1,000 first wallets.</p><p><b>How do I join?</b><br>Complete the tasks, paste your GANG comment link, then submit your wallet.</p>")};
$("#close").onclick=closeModal;
modal.onclick=e=>{if(e.target===modal)closeModal()};
