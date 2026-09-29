// ---------- SERVICES TABS ----------
const serviceTabs = document.querySelectorAll('.service-tab');
const servicePanels = document.querySelectorAll('.service-panel');
serviceTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    serviceTabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected','false'); });
    servicePanels.forEach(p => p.classList.remove('is-active'));
    tab.classList.add('is-active');
    tab.setAttribute('aria-selected','true');
    document.querySelector(`.service-panel[data-panel="${tab.dataset.service}"]`).classList.add('is-active');
  });
});

// ---------- BUILD YOUR EVENT ----------
const typeChips = document.querySelectorAll('.type-chip');
const hoursRange = document.getElementById('hours-range');
const hoursValue = document.getElementById('hours-value');
const toggles = document.querySelectorAll('.toggle-switch');
const quoteReel = document.getElementById('quote-reel');
const quoteMachine = document.getElementById('quote-machine');
const spinBtn = document.getElementById('spin-btn');

if (spinBtn && hoursRange && quoteReel && quoteMachine) {

  typeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      typeChips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
    });
  });

  hoursRange.addEventListener('input', () => {
    hoursValue.textContent = hoursRange.value;
  });

  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('is-active');
    });
  });

  // Pricing model: DJ is hourly + a flat setup/breakdown fee.
  // Karaoke and Photo Booth are flat add-ons.
  // Photography and Videography are hourly, discounted to a combined
  // rate when both are booked together.
  function calculateQuote(){
    const hours = Number(hoursRange.value);
    const active = {};
    toggles.forEach(t => { active[t.dataset.service] = t.classList.contains('is-active'); });

    let total = 0;
    if (active.dj) total += hours * 100 + 100;
    if (active.photobooth) total += 295;
    if (active.karaoke) total += 100;

    const hasPhoto = active.photography;
    const hasVideo = active.videography;
    if (hasPhoto && hasVideo) total += hours * 75;
    else if (hasPhoto || hasVideo) total += hours * 50;

    return total;
  }

  function formatCurrency(n){
    return `$${n.toLocaleString('en-US')}`;
  }

  // Casino-style reveal: digits scramble rapidly, then lock in
  // left-to-right until the final total is shown.
  function rollReel(finalText){
    const chars = finalText.split('');
    const stopFrame = i => 14 + i * 3;
    const maxFrame = Math.max(...chars.map((ch, i) => /\d/.test(ch) ? stopFrame(i) : 0)) + 6;
    let frame = 0;

    const timer = setInterval(() => {
      let out = '';
      chars.forEach((ch, i) => {
        if (/\d/.test(ch)) {
          out += frame >= stopFrame(i) ? ch : Math.floor(Math.random() * 10);
        } else {
          out += ch;
        }
      });
      quoteReel.textContent = out;
      frame++;
      if (frame > maxFrame) {
        clearInterval(timer);
        quoteReel.textContent = finalText;
        quoteMachine.classList.add('is-revealed');
        spinBtn.classList.remove('is-rolling');
      }
    }, 45);
  }

  spinBtn.addEventListener('click', () => {
    quoteMachine.classList.remove('is-revealed');
    spinBtn.classList.add('is-rolling');
    rollReel(formatCurrency(calculateQuote()));
  });
}

// ---------- MOBILE NAV ----------
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
navToggle?.addEventListener('click', () => {
  const open = mainNav.style.display === 'flex';
  mainNav.style.display = open ? 'none' : 'flex';
  navToggle.setAttribute('aria-expanded', String(!open));
});