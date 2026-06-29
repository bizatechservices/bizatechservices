// Bizatech Services — Main JavaScript
const PAGES=["home","about","services","equipment","why","vision","contact"];
let cur="home";

function go(p){
  if(!PAGES.includes(p))return;
  document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));
  const page=document.getElementById("page-"+p);
  if(page)page.classList.add("active");
  document.querySelectorAll(".nl>li>a[data-page]").forEach(a=>a.classList.toggle("act",a.dataset.page===p));
  const nav=document.getElementById("nav");
  if(nav)nav.classList.toggle("dark",p==="home");
  cur=p;
  window.scrollTo({top:0,behavior:"smooth"});
  setTimeout(rv,80);
}

document.addEventListener("DOMContentLoaded",()=>{
  const nav=document.getElementById("nav");
  if(nav)nav.classList.add("dark");
  rv();
});

function oMob(){
  document.getElementById("mm").classList.add("open");
  document.getElementById("hbg").classList.add("open");
  document.body.style.overflow="hidden";
  document.body.style.position="fixed";
  document.body.style.width="100%";
}
function cMob(){
  document.getElementById("mm").classList.remove("open");
  document.getElementById("hbg").classList.remove("open");
  document.body.style.overflow="";
  document.body.style.position="";
  document.body.style.width="";
}

function setInd(i,el){
  document.querySelectorAll(".itab").forEach(t=>t.classList.remove("on"));
  document.querySelectorAll(".ipanel").forEach(p=>p.classList.remove("on"));
  el.classList.add("on");
  const p=document.getElementById("ind"+i);
  if(p){
    p.classList.add("on");
    p.querySelectorAll(".rv:not(.in),.rl:not(.in),.rr:not(.in)").forEach((e,j)=>{
      e.style.transitionDelay=j*.06+"s";
      e.classList.add("in");
    });
  }
  el.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"});
}

function rv(){
  const obs=new IntersectionObserver(es=>{
    es.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add("in");
        obs.unobserve(e.target);
      }
    });
  },{threshold:.06,rootMargin:"0px 0px -20px 0px"});
  document.querySelectorAll("#page-"+cur+" .rv:not(.in),#page-"+cur+" .rl:not(.in),#page-"+cur+" .rr:not(.in)").forEach((el,i)=>{
    el.style.transitionDelay=(i%8)*.065+"s";
    obs.observe(el);
  });
}

// Mobile menu behavior
document.addEventListener("click",e=>{
  const link=e.target.closest(".mm-links > a");
  if(!link)return;
  const sub=link.nextElementSibling;
  if(sub&&sub.classList.contains("mm-sub")){
    e.preventDefault();
    sub.classList.toggle("open");
    link.classList.toggle("open");
  }
});
document.addEventListener("click",e=>{
  if(e.target.closest(".mm-sub a")){
    cMob();
  }
});

// Market tabs
function setMkt(cat,el){
  document.querySelectorAll('#mktabs .itab').forEach(t=>t.classList.remove('on'));
  el.classList.add('on');
  const cats=['all','bullet','dome','solar','fire'];
  const chosen=cats[cat];
  document.querySelectorAll('.mk-card').forEach(card=>{
    if(chosen==='all'||card.dataset.cat===chosen){
      card.classList.remove('mk-hidden');
      card.style.display='flex';
    }else{
      card.classList.add('mk-hidden');
      card.style.display='none';
    }
  });
}

// Form submit — open WhatsApp with enquiry details
function doSubmit(btn){
  btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled=true;
  setTimeout(()=>{
    btn.innerHTML='<i class="fas fa-check-circle"></i> Sent! Check WhatsApp';
    btn.style.background="#16a34a";
    setTimeout(()=>{
      btn.innerHTML='<i class="fas fa-paper-plane"></i> Send Message';
      btn.style.background="";
      btn.disabled=false;
    },4000);
  },1200);
}// Real WhatsApp form submission
function doSubmit(btn){
  const f=btn.closest('form')||btn.parentElement;
  const fd={
    name:(f.querySelector('[name=name]')||f.querySelector('input[placeholder*=John]')||{}).value||'',
    email:(f.querySelector('[type=email]')||{}).value||'',
    phone:(f.querySelector('[type=tel]')||{}).value||'',
    service:(f.querySelector('select')||{}).value||'',
    msg:(f.querySelector('textarea')||{}).value||''
  };
  if(!fd.name||!fd.email||!fd.phone){
    btn.innerHTML='<i class="fas fa-exclamation-circle"></i> Fill required fields';
    btn.style.background='#dc2626';
    setTimeout(()=>{btn.innerHTML='<i class="fas fa-paper-plane"></i> Send Message';btn.style.background=''},3000);
    return;
  }
  btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Opening WhatsApp...';
  btn.disabled=true;
  const text='*New Enquiry from Bizatech Services*\n\n*Name:* '+fd.name+'\n*Email:* '+fd.email+'\n*Phone:* '+fd.phone+'\n*Service:* '+fd.service+'\n*Message:* '+fd.msg;
  window.open('https://wa.me/2348036911154?text='+encodeURIComponent(text),'_blank');
  btn.innerHTML='<i class="fas fa-check-circle"></i> Sent! Check WhatsApp';
  btn.style.background='#16a34a';
  setTimeout(()=>{btn.innerHTML='<i class="fas fa-paper-plane"></i> Send Message';btn.style.background='';btn.disabled=false},5000);
}