/* IKASU Academy: menu and enquiry forms */
const WA_NUMBER = '';       /* e.g. '919XXXXXXXXX' to show a WhatsApp button after submit */
const FORM_ENDPOINT = '';   /* Formspree / Apps Script / Supabase URL to receive enquiries */
const burger = document.getElementById('burger'), menu = document.getElementById('menu');
if (burger) burger.addEventListener('click', () => { const o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
document.querySelectorAll('.dd > a').forEach(a => a.addEventListener('click', e => {
  if (window.innerWidth <= 820 && !a.parentElement.classList.contains('open')) { e.preventDefault(); a.parentElement.classList.add('open'); }
}));
const q = new URLSearchParams(location.search).get('course');
document.querySelectorAll('form[data-form]').forEach(form => {
  if (q) { const s = form.elements.course; [...s.options].forEach(o => { if (o.value.toLowerCase().startsWith(q)) s.value = o.value; }); }
  const mark = (n, on) => form.elements[n].closest('.f').classList.toggle('bad', on);
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    d.name = (d.name || '').trim(); d.phone = (d.phone || '').replace(/\D/g, '');
    const a = d.name.length > 1, b = /^[6-9]\d{9}$/.test(d.phone), c = !d.email || /^\S+@\S+\.\S+$/.test(d.email);
    mark('name', !a); mark('phone', !b); mark('email', !c);
    if (!(a && b && c)) return;
    d.at = new Date().toISOString(); d.page = location.pathname;
    try { const k = JSON.parse(localStorage.getItem('ikasu_enquiries') || '[]'); k.push(d); localStorage.setItem('ikasu_enquiries', JSON.stringify(k)); } catch (_) {}
    if (FORM_ENDPOINT) { try { await fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) }); } catch (_) {} }
    [...form.children].forEach(x => { if (!x.classList.contains('ok')) x.hidden = true; });
    const ok = form.querySelector('.ok'); ok.hidden = false; ok.querySelector('.nm').textContent = d.name.split(' ')[0];
    const w = ok.querySelector('.wal');
    if (WA_NUMBER) { w.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi IKASU Academy, I am ${d.name}. I am interested in ${d.course || 'your courses'}. My number: +91 ${d.phone}.`)}`; } else { w.hidden = true; }
  });
});
