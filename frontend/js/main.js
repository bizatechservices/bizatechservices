// =========================================
// Bizatech Services — Main JavaScript
// =========================================

const PAGES = ["home", "about", "services", "equipment", "why", "vision", "contact"];
let cur = "home";

function go(p) {
    if (!PAGES.includes(p)) return;
    document.querySelectorAll(".page").forEach(x => x.classList.remove("active"));
    document.getElementById("page-" + p).classList.add("active");
    document.querySelectorAll(".nl>li>a[data-page]").forEach(a => a.classList.toggle("act", a.dataset.page === p));
    document.getElementById("nav").classList.toggle("dark", p === "home");
    cur = p;
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(rv, 80);
}

// Set home as dark nav by default
document.getElementById("nav").classList.add("dark");

// Mobile menu
function oMob() {
    document.getElementById("mm").classList.add("open");
    document.getElementById("hbg").classList.add("open");
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
}

function cMob() {
    document.getElementById("mm").classList.remove("open");
    document.getElementById("hbg").classList.remove("open");
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.width = "";
}

// Industry tabs
function setInd(i, el) {
    const wasActive = el.classList.contains("on");

    if (wasActive) {
        // Collapse - just remove active state
        el.classList.remove("on");
        const panel = document.getElementById("ind" + i);
        if (panel) panel.classList.remove("on");
        return;
    }

    document.querySelectorAll(".itab").forEach(t => t.classList.remove("on"));
    document.querySelectorAll(".ipanel").forEach(p => p.classList.remove("on"));

    el.classList.add("on");
    const panel = document.getElementById("ind" + i);
    panel.classList.add("on");
    // Restore scroll-reveal for the newly shown panel
    panel.querySelectorAll(".rv:not(.in), .rl:not(.in), .rr:not(.in)").forEach((e, j) => {
        e.style.transitionDelay = j * .06 + "s";
        e.classList.add("in");
    });
    el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
}
// Mobile menu sub-links close menu - ensures mobile nav closes when a sub-link is tapped
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".mm-sub a").forEach(function (a) {
        a.addEventListener("click", cMob);
    });

    // Mobile menu accordion toggle for parent items that have sub-menus
    document.querySelectorAll(".mm-links > a").forEach(function (link) {
        // Check if this link has a following sibling .mm-sub
        var next = link.nextElementSibling;
        if (next && next.classList.contains("mm-sub")) {
            link.addEventListener("click", function (e) {
                // If the click target is the chevron icon, prevent page navigation
                if (e.target.classList.contains("arr")) {
                    e.preventDefault();
                    e.stopPropagation();
                }

                // Toggle the sub-menu
                var sub = this.nextElementSibling;
                if (sub && sub.classList.contains("mm-sub")) {
                    sub.classList.toggle("open");
                    this.classList.toggle("open");
                }
            });
        }
    });
});

// Scroll reveal
function rv() {
    const obs = new IntersectionObserver(es => {
        es.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add("in");
                obs.unobserve(e.target);
            }
        });
    }, { threshold: .06, rootMargin: "0px 0px -20px 0px" });

    document.querySelectorAll(
        "#page-" + cur + " .rv:not(.in), #page-" + cur + " .rl:not(.in), #page-" + cur + " .rr:not(.in)"
    ).forEach((el, i) => {
        el.style.transitionDelay = (i % 8) * .065 + "s";
        obs.observe(el);
    });
}

rv();

// Counters animation
const cobs = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { runCount(); cobs.disconnect(); } });
}, { threshold: .25 });
document.querySelectorAll(".cband").forEach(el => cobs.observe(el));

function runCount() {
    document.querySelectorAll(".counter").forEach(el => {
        if (el.dataset.done) return;
        el.dataset.done = "1";
        const target = +el.dataset.t;
        const duration = 1500;
        const start = performance.now();
        (function step(now) {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(ease * target);
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = target;
        })(performance.now());
    });
}

// Image Reel auto-scroll
(function () {
    const reel = document.getElementById("imageReel");
    if (!reel) return;
    const track = reel.querySelector(".reel-track");
    if (!track) return;

    let scrollAmount = 0;
    const speed = 0.8; // pixels per frame

    function autoScroll() {
        scrollAmount += speed;
        track.scrollLeft = scrollAmount;

        // Reset when we've scrolled past the duplicated content
        if (scrollAmount >= track.scrollWidth / 2) {
            scrollAmount = 0;
            track.scrollLeft = 0;
        }
        requestAnimationFrame(autoScroll);
    }

    // Pause on hover
    reel.addEventListener("mouseenter", () => scrollAmount = scrollAmount);
    reel.addEventListener("mouseleave", () => requestAnimationFrame(autoScroll));

    // Start the animation
    requestAnimationFrame(autoScroll);
})();

// Contact form submission
function doSubmit(btn) {
    // Collect form data (assuming input fields have IDs matching the backend expectations)
    const data = {
        firstName: document.getElementById('firstName')?.value?.trim() || '',
        lastName: document.getElementById('lastName')?.value?.trim() || '',
        email: document.getElementById('email')?.value?.trim() || '',
        phone: document.getElementById('phone')?.value?.trim() || '',
        company: document.getElementById('company')?.value?.trim() || '',
        service: document.getElementById('service')?.value?.trim() || '',
        details: document.getElementById('details')?.value?.trim() || ''
    };

    // Basic client-side validation
    if (!data.firstName || !data.lastName || !data.email || !data.phone || !data.service || !data.details) {
        btn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Missing fields';
        btn.style.background = '#dc2626'; // red
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            btn.style.background = '';
        }, 3000);
        return;
    }

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(json => {
            if (json.success) {
                btn.innerHTML = '<i class="fas fa-check-circle"></i> Message Sent!';
                btn.style.background = '#16a34a'; // green
            } else {
                btn.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + (json.message || 'Error');
                btn.style.background = '#dc2626';
            }
        })
        .catch(err => {
            console.error('Contact submit error:', err);
            btn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Network error';
            btn.style.background = '#dc2626';
        })
        .finally(() => {
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                btn.style.background = '';
                btn.disabled = false;
            }, 4000);
        });
}

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check-circle"></i> Message Sent!';
        btn.style.background = "#16a34a";
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            btn.style.background = "";
            btn.disabled = false;
        }, 4000);
    }, 1500);
}

// Live clock
function tick() {
    const clk = document.getElementById("clk");
    if (clk) {
        clk.textContent = new Date().toLocaleString("en-NG", {
            weekday: "short", month: "short", day: "numeric",
            hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true
        });
    }
}
tick();
setInterval(tick, 1000);

// iOS safe area
document.documentElement.style.setProperty("--sat", "env(safe-area-inset-top)");

// Market tabs (equipment page)
function setMkt(cat, el) {
    document.querySelectorAll('#mktabs .itab').forEach(t => t.classList.remove('on'));
    el.classList.add('on');
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    const cats = ['all', 'bullet', 'dome', 'solar', 'fire'];
    const chosen = cats[cat];
    document.querySelectorAll('.mk-card').forEach(card => {
        if (chosen === 'all' || card.dataset.cat === chosen) {
            card.classList.remove('mk-hidden');
            card.style.display = 'flex';
        } else {
            card.classList.add('mk-hidden');
            card.style.display = 'none';
        }
    });
}
// === CART SYSTEM ===
let cart = JSON.parse(localStorage.getItem('bizCart) || '[]');
function saveCart(){localStorage.setItem('bizCart',JSON.stringify(cart));updateCartCount()}
function updateCartCount(){const b=document.getElementById('cartBdg');if(b){const c=cart.length;b.textContent=c;b.style.display=c?'flex':'none'}}
function toggleCart(){const sb=document.getElementById('cartSb'),ov=document.getElementById('cartOv');if(!sb)return;const o=sb.classList.contains('open');sb.classList.toggle('open',!o);ov.classList.toggle('show',!o);document.body.style.overflow=o?' ':hidden';if(!o)renderCart()}
function addToCart(n,img,cat){const k=n+cat;if(cart.some(x=>x.key===k))return;cart.push({key:k,name:n,img,cat,qty:1});saveCart();renderCart();const btn=event?.target;if(btn&&btn.classList.contains('add-cart')){btn.textContent='✍ Added';btn.classList.add('in-cart')}}
function removeFromCart(k){cart=cart.filter(x=>x.key!==k);saveCart();renderCart()}
function renderCart(){const el=document.getElementById('cartBody'),ft=document.getElementById('cartFt');if(!el)return;if(!cart.length){el.innerHTML='<div class="cart-emp"><i class="fas fa-shopping-cart"></i><p>Your cart is empty</p><p style="font-size:.75rem;margin-top:.3rem">Browse equipment and add items you are interested in</p></div>';if(ft)ft.style.display='none';return}
let h='';cart.forEach(x=>{h+='<div class="cart-item"><img src="'+x.img+'" alt="'+x.name+'"><div class="cart-item-info"><h4>'+x.name+'</h4><p>'+x.cat+'</p></div><button class="cart-item-rm" onclick="removeFromCart(\''+x.key+'\')"><i class="fas fa-trash"></i></button></div>'});el.innerHTML=h;if(ft)ft.style.display='block'}
function submitCart(){if(!cart.length){alert('Your cart is empty. Add some items first.');return}
const items=cart.map(x=x.name+' ('+x.cat+')').join('%0A- ');
window.open('https://wa.me/2348036911154?text='+encodeURIComponent('*New Equipment Enquiry*\n\n*Items Interested In:*\n- '+items),'_blank');toggleCart()}
updateCartCount();
