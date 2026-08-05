
(() => {
  const KEY = 'roosa-v2-demo-cart';
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
  const write = (cart) => { localStorage.setItem(KEY, JSON.stringify(cart)); render(); };
  const money = (cart) => cart.length ? new Intl.NumberFormat('de-CH',{style:'currency',currency:'CHF'}).format(cart.reduce((sum,item)=>sum+(Number(item.unitPrice)||0)*item.quantity,0)) : '-';
  const esc = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  function add(product, quantity = 1) {
    const cart = read(); const item = cart.find(x => x.id === product.id);
    if (item) item.quantity += Math.max(1, quantity); else cart.push({...product, quantity: Math.max(1, quantity)});
    write(cart); openCart(); announce(quantity + ' × ' + product.name + ' added to the demo cart.');
  }
  function update(id, delta) { const cart = read(); const item = cart.find(x => x.id === id); if (item) item.quantity = Math.max(1, item.quantity + delta); write(cart); }
  function remove(id) { write(read().filter(x => x.id !== id)); }
  function announce(message) { document.querySelectorAll('[data-feedback]').forEach(el => { el.textContent = message; }); }
  function openCart() { document.querySelector('[data-cart-drawer]')?.classList.add('w--open'); document.querySelector('[data-cart-backdrop]')?.classList.add('open'); document.querySelector('[data-cart-close]')?.focus(); }
  function closeCart() { document.querySelector('[data-cart-drawer]')?.classList.remove('w--open'); document.querySelector('[data-cart-backdrop]')?.classList.remove('open'); }
  function itemsMarkup(cart) { return cart.length ? cart.map(item => '<cart-item><div class="cart-item-wrapper"><div class="cart-image-wrapper"><button data-remove="'+esc(item.id)+'" class="remove-button" aria-label="Remove '+esc(item.name)+'">×</button><img src="'+esc(item.image)+'" alt="" class="cart-item-image"></div><div class="cart-item-data mini-cart"><div class="cart-item-title">'+esc(item.name)+'</div><div>'+esc(item.pack)+'</div><div>'+esc(item.price)+'</div><quantity-input><div class="cart-qty-controls"><button data-minus="'+esc(item.id)+'" '+(item.quantity <= 1 ? 'disabled' : '')+' aria-label="Decrease quantity">−</button><span>'+item.quantity+'</span><button data-plus="'+esc(item.id)+'" aria-label="Increase quantity">+</button></div></quantity-input></div></div></cart-item>').join('') : '<div class="empty-cart-label">Your demo cart is empty.</div>'; }
  function render() { const cart=read(); const count=cart.reduce((sum,x)=>sum+x.quantity,0); document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=count); document.querySelectorAll('[data-cart-items]').forEach(el=>el.innerHTML=itemsMarkup(cart)); document.querySelectorAll('[data-cart-total]').forEach(el=>el.textContent=money(cart)); document.querySelectorAll('[data-demo-checkout]').forEach(el=>el.disabled=!cart.length); }
  async function demoCheckout(button) {
    const cart=read(); if (!cart.length) return;
    const original=button.textContent; button.disabled=true; button.textContent='Creating demo order…';
    try {
      const response=await fetch('/api/demo/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:cart})});
      const result=await response.json(); if(!response.ok) throw new Error(result.message||'Demo checkout failed');
      document.querySelectorAll('[data-checkout-status]').forEach(el=>el.textContent='Demo order '+result.order.reference+' created · '+result.order.totalFormatted+' · no payment collected.');
      announce('Demo order '+result.order.reference+' created. No payment was collected.');
    } catch(error) {
      document.querySelectorAll('[data-checkout-status]').forEach(el=>el.textContent=error.message||'The demo checkout could not be created.');
    } finally { button.textContent=original; render(); }
  }
  document.addEventListener('click', event => {
    const target = event.target.closest('button,a'); if (!target) return;
    if (target.matches('[data-cart-open]')) { event.preventDefault(); openCart(); }
    if (target.matches('[data-cart-close],[data-cart-backdrop]')) { event.preventDefault(); closeCart(); }
    if (target.dataset.add) { event.preventDefault(); add(JSON.parse(target.dataset.add), Number(document.querySelector('[data-product-quantity]')?.value || 1)); }
    if (target.dataset.buy) { event.preventDefault(); add(JSON.parse(target.dataset.buy), Number(document.querySelector('[data-product-quantity]')?.value || 1)); announce('Demo item added. Shopify checkout is not configured.'); }
    if (target.dataset.minus) update(target.dataset.minus,-1); if (target.dataset.plus) update(target.dataset.plus,1); if (target.dataset.remove) remove(target.dataset.remove);
    if (target.matches('[data-qty-minus],[data-qty-plus]')) { const input=document.querySelector('[data-product-quantity]'); const delta=target.matches('[data-qty-plus]')?1:-1; input.value=Math.max(1,Number(input.value||1)+delta); document.querySelector('[data-qty-minus]').disabled=Number(input.value)<=1; }
    if (target.dataset.gallery) { document.querySelector('[data-main-image]').src=target.dataset.gallery; document.querySelectorAll('[data-gallery]').forEach(el=>el.classList.toggle('w--current',el===target)); }
    if (target.matches('[data-demo-checkout]')) { event.preventDefault(); demoCheckout(target); }
  });
  document.addEventListener('input', event => { if (event.target.matches('[data-product-quantity]')) { event.target.value=Math.max(1,Number(event.target.value||1)); document.querySelector('[data-qty-minus]').disabled=Number(event.target.value)<=1; } });
  document.addEventListener('keydown', event => { if(event.key==='Escape') closeCart(); });
  window.addEventListener('storage', render); render();
})();
