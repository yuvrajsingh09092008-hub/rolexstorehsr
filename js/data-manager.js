// data-manager.js - products stored in localStorage under key 'products'
const STORAGE_KEY = 'products';

function formatPrice(n){ try{ return '₹' + Number(n).toLocaleString('en-IN'); }catch(e){ return '₹0'; } }

function loadAllProducts(){
  try{ const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : {}; }catch(e){ console.warn(e); return {}; }
}
function saveAllProducts(obj){ localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); }

function generateId(){ return 'p' + Date.now().toString(36) + Math.floor(Math.random()*900).toString(); }

function saveOrUpdateProduct({id,name,price,image,isFeatured}){
  const all = loadAllProducts();
  const pid = id || generateId();
  all[pid] = { id: pid, name, price: Number(price), image, isFeatured: !!isFeatured };
  saveAllProducts(all);
  return pid;
}
function getProductById(id){ return loadAllProducts()[id] || null; }
function deleteProduct(id){ const all = loadAllProducts(); delete all[id]; saveAllProducts(all); }
function initSampleProducts(){
  const existing = loadAllProducts();
  if(Object.keys(existing).length>0) return;
  const sample = {
    p1: { id:'p1', name:'Rolex Submariner (Black)', price:125000, image:'https://cdn.watchstylers.com/wp-content/uploads/2022/01/Rolex-Submariner-116610-LN-1.jpg', isFeatured:true },
    p2: { id:'p2', name:'Rolex Datejust 36', price:99000, image:'https://www.rolex.com/content/dam/rolex-com/feature/why-rolex/reading-watch/Datejust_36.jpg', isFeatured:true },
    p3: { id:'p3', name:'Rolex Daytona', price:220000, image:'https://www.rolex.com/content/dam/rolex-com/watches/collection/daytona/m126500ln-0002/intro.jpg', isFeatured:false }
  };
  saveAllProducts(sample);
}

function renderFeaturedProducts(){
  const row = document.getElementById('featured-products-row');
  if(!row) return;
  const products = Object.values(loadAllProducts()).filter(p=>p.isFeatured);
  if(products.length===0){ row.innerHTML = '<div class="col-12"><p class="text-center">No featured products.</p></div>'; return; }
  let html = '';
  products.forEach(p=>{
    html += `<div class="col-md-4 mb-3"><div class="card product-card p-2"><img src="${p.image||'https://via.placeholder.com/300'}" style="height:180px;object-fit:contain"><div class="p-2"><h5>${p.name}</h5><p class="text-gold">${formatPrice(p.price)}</p><div class="d-grid gap-2"><button class="btn btn-success" onclick="addToCart('${p.id}')"><i class="fas fa-cart-plus"></i> Add to Cart</button><a class="btn btn-outline-success" href="${getWhatsAppLink(p.name, formatPrice(p.price))}" target="_blank"><i class="fab fa-whatsapp"></i> WhatsApp</a><a class="btn btn-sm btn-outline-primary mt-1" href="admin/dashboard.html?editId=${p.id}">Admin Edit</a></div></div></div></div>`;
  });
  row.innerHTML = html;
}

function renderAllProducts(targetId){
  const container = document.getElementById(targetId);
  if(!container) return;
  const products = Object.values(loadAllProducts());
  if(products.length===0){ container.innerHTML = '<div class="col-12"><p class="text-center">No products</p></div>'; return; }
  let html='';
  products.forEach(p=>{
    html += `<div class="col-xl-3 col-lg-4 col-md-6 mb-4"><div class="card product-card p-2"><img src="${p.image||'https://via.placeholder.com/300'}" style="height:160px;object-fit:contain"><div class="p-2"><h5>${p.name}</h5><p class="text-gold">${formatPrice(p.price)}</p><div class="d-grid gap-2"><button class="btn btn-success" onclick="addToCart('${p.id}')"><i class="fas fa-cart-plus"></i> Add to Cart</button><a class="btn btn-outline-success" href="${getWhatsAppLink(p.name, formatPrice(p.price))}" target="_blank"><i class="fab fa-whatsapp"></i> WhatsApp</a><a class="btn btn-sm btn-outline-primary mt-1" href="admin/dashboard.html?editId=${p.id}">Admin Edit</a></div></div></div></div>`;
  });
  container.innerHTML = html;
}

function getWhatsAppLink(name, price){
  const STORE_PHONE = '919563775000';
  const msg = `Hello, I'm interested in the ${name} priced at ${price}. Is it available?`;
  return 'https://wa.me/' + STORE_PHONE + '?text=' + encodeURIComponent(msg);
}

// Init auto
document.addEventListener('DOMContentLoaded', function(){ initSampleProducts(); try{ renderFeaturedProducts(); }catch(e){} try{ renderAllProducts('all-products-row'); }catch(e){} });
