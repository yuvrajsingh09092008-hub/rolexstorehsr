// simple cart using localStorage key 'cart' (array of {id, qty})
function loadCart(){ try{ return JSON.parse(localStorage.getItem('cart')||'[]'); }catch(e){ return []; } }
function saveCart(c){ localStorage.setItem('cart', JSON.stringify(c)); updateCartCount(); }

function addToCart(id){ const cart = loadCart(); const item = cart.find(i=>i.id===id); if(item) item.qty++; else cart.push({id, qty:1}); saveCart(cart); alert('Added to cart'); }

function removeFromCart(id){ let cart = loadCart(); cart = cart.filter(i=>i.id!==id); saveCart(cart); renderCart(); }

function updateCartCount(){ const cart = loadCart(); const count = cart.reduce((s,i)=>s+i.qty,0); const els = [document.getElementById('cart-count'), document.getElementById('cart-count-2')]; els.forEach(el=>{ if(el) el.innerText = count; }); }

function renderCart(){ const container = document.getElementById('cart-items'); if(!container) return; const cart = loadCart(); if(cart.length===0){ container.innerHTML='<p>Your cart is empty.</p>'; updateCartCount(); return; } let html=''; cart.forEach(ci=>{ const p = getProductById(ci.id); if(!p) return; html += `<div class="card p-2 mb-2"><div class="d-flex align-items-center"><img src="${p.image||'https://via.placeholder.com/120'}" style="width:90px;height:70px;object-fit:cover;margin-right:12px"><div class="flex-grow-1"><strong>${p.name}</strong><div>${formatPrice(p.price)} x ${ci.qty}</div></div><div><button class="btn btn-sm btn-danger" onclick="removeFromCart('${ci.id}')">Remove</button></div></div></div>`; }); container.innerHTML = html + '<div class="mt-2"><strong>Total: ' + formatPrice(cart.reduce((s,i)=>{ const p=getProductById(i.id); return s + (p? p.price*i.qty:0); },0)) + '</strong></div>'; updateCartCount(); }

document.addEventListener('DOMContentLoaded', function(){
  updateCartCount();
  const checkoutBtn = document.getElementById('checkout-btn');
  if(checkoutBtn){
    checkoutBtn.addEventListener('click', function(){
      const cart = loadCart(); if(cart.length===0){ alert('Cart empty'); return; }
      const orders = JSON.parse(localStorage.getItem('orders')||'[]');
      const order = { id: 'o' + Date.now().toString(36), items: cart, total: cart.reduce((s,i)=>{ const p=getProductById(i.id); return s + (p? p.price*i.qty:0); },0), createdAt: new Date().toISOString() };
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));
      localStorage.removeItem('cart');
      document.getElementById('checkout-result').innerHTML = `<div class="alert alert-success">Order placed (demo). Order ID: ${order.id}</div>`;
      updateCartCount();
      renderCart();
    });
  }
  try{ renderCart(); }catch(e){}
});
