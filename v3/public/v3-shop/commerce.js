
(() => {
  const KEY = 'roosa-v2-demo-cart';
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
  const write = (cart) => { localStorage.setItem(KEY, JSON.stringify(cart)); render(); };
  const money = (cart) => cart.length ? 'Calculated at checkout' : '—';
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
  function render() { const cart=read(); const count=cart.reduce((sum,x)=>sum+x.quantity,0); document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=count); document.querySelectorAll('[data-cart-items]').forEach(el=>el.innerHTML=itemsMarkup(cart)); document.querySelectorAll('[data-cart-total]').forEach(el=>el.textContent=money(cart)); }
  document.addEventListener('click', event => {
    const target = event.target.closest('button,a'); if (!target) return;
    if (target.matches('[data-cart-open]')) { event.preventDefault(); openCart(); }
    if (target.matches('[data-cart-close],[data-cart-backdrop]')) { event.preventDefault(); closeCart(); }
    if (target.dataset.add) { event.preventDefault(); add(JSON.parse(target.dataset.add), Number(document.querySelector('[data-product-quantity]')?.value || 1)); }
    if (target.dataset.buy) { event.preventDefault(); add(JSON.parse(target.dataset.buy), Number(document.querySelector('[data-product-quantity]')?.value || 1)); announce('Demo item added. Shopify checkout is not configured.'); }
    if (target.dataset.minus) update(target.dataset.minus,-1); if (target.dataset.plus) update(target.dataset.plus,1); if (target.dataset.remove) remove(target.dataset.remove);
    if (target.matches('[data-qty-minus],[data-qty-plus]')) { const input=document.querySelector('[data-product-quantity]'); const delta=target.matches('[data-qty-plus]')?1:-1; input.value=Math.max(1,Number(input.value||1)+delta); document.querySelector('[data-qty-minus]').disabled=Number(input.value)<=1; }
    if (target.dataset.gallery) { document.querySelector('[data-main-image]').src=target.dataset.gallery; document.querySelectorAll('[data-gallery]').forEach(el=>el.classList.toggle('w--current',el===target)); }
  });
  document.addEventListener('input', event => { if (event.target.matches('[data-product-quantity]')) { event.target.value=Math.max(1,Number(event.target.value||1)); document.querySelector('[data-qty-minus]').disabled=Number(event.target.value)<=1; } });
  document.addEventListener('keydown', event => { if(event.key==='Escape') closeCart(); });
  window.addEventListener('storage', render); render();
})();
