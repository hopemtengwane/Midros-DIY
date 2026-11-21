const products = [
  {id:'service-filter',name:'Oil filter',category:'Service',eyebrow:'SERVICE ESSENTIAL',description:'A starting point for your next routine service.',keywords:'filter service oil maintenance',art:'art-1',mark:'OF',svg:'<path d="M29 20h42v12H29zM33 32v35h34V32M40 42h20M40 51h20"/><path d="M37 20v-7h26v7"/>'},
  {id:'brake-pads',name:'Brake pads',category:'Service',eyebrow:'BRAKING',description:'Tell us your vehicle details so we can check fitment.',keywords:'brake pads braking service',art:'art-2',mark:'BP',svg:'<path d="M27 22h40v38H27zM33 29h27v22H33z"/><path d="M22 29h5M22 39h5M22 49h5M67 29h6M67 39h6M67 49h6"/><circle cx="46" cy="40" r="6"/>'},
  {id:'battery-charger',name:'Battery charger',category:'Electrical',eyebrow:'ELECTRICAL',description:'Ask about charging and starting essentials.',keywords:'battery charger electrical jump starter',art:'art-3',mark:'12V',svg:'<rect x="26" y="23" width="48" height="39" rx="3"/><path d="M38 23v-6h8v6m8 0v-6h8v6M50 32l-7 12h8l-4 10 12-15h-8l4-7Z"/>'},
  {id:'tyre-wheel',name:'Tyres & wheels',category:'Wheels',eyebrow:'WHEELS',description:'Share your tyre size or vehicle to get started.',keywords:'tyre tires wheel wheels rim',art:'art-4',mark:'R',svg:'<circle cx="50" cy="42" r="25"/><circle cx="50" cy="42" r="10"/><path d="M50 17v15m0 20v15M25 42h15m20 0h15M32.3 24.3l10.6 10.6m14.2 14.2 10.6 10.6m0-35.4L57.1 34.9M42.9 49.1 32.3 59.7"/>'},
  {id:'diy-tool-set',name:'DIY tool set',category:'Workshop',eyebrow:'WORKSHOP',description:'Tell us the job you have in mind and we’ll check options.',keywords:'tools workshop diy socket spanner',art:'art-5',mark:'DIY',svg:'<path d="M36 20a13 13 0 0 0 16 16l17 17a6 6 0 0 1-9 9L43 45a13 13 0 0 0-17-16l9 9-8 8-9-9a13 13 0 0 0 18-17Z"/>'},
  {id:'engine-oil',name:'Engine oil',category:'Oils',eyebrow:'OILS & FLUIDS',description:'Ask about oil grade and quantity for your vehicle.',keywords:'engine oil fluid lubricant service',art:'art-6',mark:'OIL',svg:'<path d="M37 15h26v10l8 8v31H29V33l8-8V15Z"/><path d="M37 25h26M29 39h42M42 49c0-5 5-9 5-9s6 4 6 9a5.5 5.5 0 0 1-11 0Z"/>'},
  {id:'wiper-blades',name:'Wiper blades',category:'Accessories',eyebrow:'VISIBILITY',description:'Send your car model and year for a fitment check.',keywords:'wiper blades windscreen accessories visibility',art:'art-2',mark:'WB',svg:'<path d="m28 58 37-33M35 63 71 31M25 54l8 9m31-42 8 9M30 48l10 11M40 39l11 11M50 30l11 11"/>'},
  {id:'led-driving-lamps',name:'LED driving lamps',category:'Electrical',eyebrow:'LIGHTING',description:'Ask about lamps, wiring kits and vehicle compatibility.',keywords:'led driving lamps lighting electrical',art:'art-3',mark:'LED',svg:'<path d="M28 23h44l-5 38H33l-5-38Z"/><path d="M35 31h30M38 39h24M41 47h18M43 55h14"/><path d="m28 28-9-4m9 13-11-1m12 10-10 3"/>'}
];

// Development switch: set to false to suppress the specials modal.
const SPECIALS_POPUP_ENABLED = true;
const SPECIALS_POPUP_DELAY_MS = 550;

let activeFilter = 'All';
let searchTerm = '';
let bag = JSON.parse(localStorage.getItem('midros-enquiry-bag') || '[]');
let toastTimer;
const grid = document.getElementById('product-grid');
const bagDrawer = document.getElementById('bag-drawer');
const backdrop = document.getElementById('drawer-backdrop');
const specialsModal = document.getElementById('specials-modal');
const specialsBackdrop = document.getElementById('specials-backdrop');

function itemSvg(product){return `<svg viewBox="0 0 100 84" aria-hidden="true">${product.svg}</svg>`}
function visibleProducts(){
  const needle=searchTerm.trim().toLowerCase();
  let shown=products.filter(p=>(activeFilter==='All'||p.category===activeFilter)&&(!needle||`${p.name} ${p.category} ${p.description} ${p.keywords}`.toLowerCase().includes(needle)));
  if(document.getElementById('sort-select').value==='az')shown=shown.slice().sort((a,b)=>a.name.localeCompare(b.name));
  return shown;
}
function renderProducts(){
  const shown=visibleProducts();
  grid.innerHTML=shown.length?shown.map((p,i)=>`<article class="product-card"><div class="product-art ${p.art}"><div class="art-disc"></div>${itemSvg(p)}<span class="product-tag">${p.eyebrow}</span><button class="product-fave" type="button" aria-label="Save ${p.name}" title="Save for later">♡</button></div><div class="product-info"><span class="product-kicker">${p.category} · ASK FOR AVAILABILITY</span><h3>${p.name}</h3><p>${p.description}</p><div class="product-actions"><span class="ask-price">Price on enquiry</span><button class="add-item" type="button" data-add="${p.id}" aria-label="Add ${p.name} to enquiry bag">+</button></div></div></article>`).join(''):`<div class="no-results"><b>No matching sample items.</b><span>Try a broader search or ask MIDROS DIY directly.</span><a href="https://wa.me/27742715986" target="_blank" rel="noreferrer">Ask the store ›</a></div>`;
  document.querySelectorAll('.product-fave').forEach(btn=>btn.addEventListener('click',()=>{btn.classList.toggle('active');btn.textContent=btn.classList.contains('active')?'♥':'♡';showToast(btn.classList.contains('active')?'Saved for this visit':'Removed from saved items')}));
  document.querySelectorAll('[data-add]').forEach(btn=>btn.addEventListener('click',()=>addToBag(btn.dataset.add)));
}
function persistBag(){localStorage.setItem('midros-enquiry-bag',JSON.stringify(bag));renderBag()}
function addToBag(id){const item=bag.find(x=>x.id===id);if(item)item.quantity+=1;else bag.push({id,quantity:1});persistBag();showToast(`${products.find(p=>p.id===id).name} added to your enquiry bag`)}
function setQuantity(id,delta){const item=bag.find(x=>x.id===id);if(!item)return;item.quantity+=delta;if(item.quantity<1)bag=bag.filter(x=>x.id!==id);persistBag()}
function renderBag(){
  const total=bag.reduce((sum,item)=>sum+item.quantity,0);
  document.getElementById('bag-count').textContent=total;
  document.getElementById('drawer-count').textContent=`(${total})`;
  const empty=bag.length===0;
  document.getElementById('bag-empty').style.display=empty?'flex':'none';
  document.getElementById('bag-items').innerHTML=bag.map(item=>{const p=products.find(x=>x.id===item.id);if(!p)return '';return `<div class="bag-item"><div class="bag-item-art">${itemSvg(p)}</div><div><b>${p.name}</b><small>${p.category} · PRICE ON ENQUIRY</small></div><div class="item-qty"><button data-qty="${p.id}" data-delta="-1" aria-label="Remove one ${p.name}">−</button><span>${item.quantity}</span><button data-qty="${p.id}" data-delta="1" aria-label="Add one ${p.name}">+</button></div></div>`}).join('');
  document.querySelectorAll('[data-qty]').forEach(btn=>btn.addEventListener('click',()=>setQuantity(btn.dataset.qty,Number(btn.dataset.delta))));
  document.getElementById('send-enquiry').disabled=empty;
}
function showBag(){bagDrawer.classList.add('open');backdrop.classList.add('open');bagDrawer.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
function hideBag(){bagDrawer.classList.remove('open');backdrop.classList.remove('open');bagDrawer.setAttribute('aria-hidden','true');document.body.style.overflow=''}
function showToast(message){const toast=document.getElementById('toast');toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2400)}
function openSpecials(){if(!SPECIALS_POPUP_ENABLED||sessionStorage.getItem('midrosSpecialsDismissed')==='1')return;window.setTimeout(()=>{specialsModal.classList.add('is-open');specialsBackdrop.classList.add('is-open');specialsModal.setAttribute('aria-hidden','false');specialsBackdrop.setAttribute('aria-hidden','false');document.body.classList.add('specials-open');document.getElementById('specials-close').focus()},SPECIALS_POPUP_DELAY_MS)}
function closeSpecials(){specialsModal.classList.remove('is-open');specialsBackdrop.classList.remove('is-open');specialsModal.setAttribute('aria-hidden','true');specialsBackdrop.setAttribute('aria-hidden','true');document.body.classList.remove('specials-open');sessionStorage.setItem('midrosSpecialsDismissed','1')}
function selectTab(tab){document.querySelectorAll('.finder-tabs button').forEach(button=>button.classList.toggle('active',button.dataset.tab===tab));document.getElementById('vehicle-form').classList.toggle('hidden',tab!=='vehicle');document.getElementById('part-form').classList.toggle('hidden',tab!=='part');if(tab==='part')setTimeout(()=>document.getElementById('search-input').focus(),50)}
function setFilter(filter){activeFilter=filter;searchTerm='';document.getElementById('search-input').value='';document.querySelectorAll('#filter-pills button').forEach(button=>button.classList.toggle('selected',button.dataset.filter===filter));renderProducts()}

document.querySelectorAll('.finder-tabs button').forEach(button=>button.addEventListener('click',()=>selectTab(button.dataset.tab)));
document.getElementById('vehicle-form').addEventListener('submit',event=>{event.preventDefault();const make=document.getElementById('make').value;const model=document.getElementById('model').value.trim();const variant=document.getElementById('variant').value.trim();const year=document.getElementById('year').value;if(!make&&!model){showToast('Add a make or model so the store knows what you’re driving.');document.getElementById('make').focus();return}const details=[make,model,variant,year].filter(Boolean).join(' ');const message=`Hi MIDROS DIY, I’m looking for parts for my ${details}. Could you please check availability and pricing?`;window.open(`https://wa.me/27742715986?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer')});
document.getElementById('part-form').addEventListener('submit',event=>{event.preventDefault();searchTerm=document.getElementById('search-input').value;activeFilter='All';document.querySelectorAll('#filter-pills button').forEach(button=>button.classList.toggle('selected',button.dataset.filter==='All'));renderProducts();document.getElementById('products').scrollIntoView({behavior:'smooth'});if(!visibleProducts().length)showToast('No matching sample items. Ask the store and we’ll help you look.')});
document.getElementById('search-input').addEventListener('input',event=>{searchTerm=event.target.value;activeFilter='All';document.querySelectorAll('#filter-pills button').forEach(button=>button.classList.toggle('selected',button.dataset.filter==='All'));renderProducts()});
document.querySelectorAll('#filter-pills button').forEach(button=>button.addEventListener('click',()=>setFilter(button.dataset.filter)));
document.querySelectorAll('.category-card').forEach(card=>card.addEventListener('click',()=>setFilter(card.dataset.filter)));
document.getElementById('sort-select').addEventListener('change',renderProducts);
document.getElementById('open-bag').addEventListener('click',showBag);
document.getElementById('close-bag').addEventListener('click',hideBag);
backdrop.addEventListener('click',hideBag);
document.getElementById('continue-shopping').addEventListener('click',()=>{hideBag();document.getElementById('products').scrollIntoView({behavior:'smooth'})});
document.getElementById('send-enquiry').addEventListener('click',()=>{if(!bag.length)return;const lines=bag.map(item=>{const p=products.find(x=>x.id===item.id);return `${item.quantity} x ${p.name}`});const message=`Hi MIDROS DIY, please could you check the price and availability of these items for me?\n\n${lines.join('\n')}\n\nMy vehicle details (if needed):`;window.open(`https://wa.me/27742715986?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer')});
document.querySelectorAll('[data-focus-search]').forEach(button=>button.addEventListener('click',()=>{selectTab('part');document.getElementById('garage').scrollIntoView({behavior:'smooth'})}));
document.getElementById('menu-toggle').addEventListener('click',()=>document.querySelector('.main-nav').classList.toggle('open'));
document.querySelectorAll('.main-nav a').forEach(link=>link.addEventListener('click',()=>document.querySelector('.main-nav').classList.remove('open')));
document.getElementById('specials-close').addEventListener('click',closeSpecials);
document.getElementById('specials-later').addEventListener('click',closeSpecials);
specialsBackdrop.addEventListener('click',closeSpecials);
window.addEventListener('keydown',event=>{if(event.key==='Escape'&&specialsModal.classList.contains('is-open'))closeSpecials()});
document.getElementById('year-now').textContent=new Date().getFullYear();
renderProducts();renderBag();openSpecials();
