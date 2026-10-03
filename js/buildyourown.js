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

  // Pricing model
function calculateQuote() {
  const hours = Number(hoursRange.value);

  const active = {};

  toggles.forEach(toggle => {
    active[toggle.dataset.service] =
      toggle.classList.contains('is-active');
  });

  let total = 0;


  /* =========================================
     DJ
  ========================================= */

  if (active.dj) {

    let djRate;

    if (
      document
        .querySelector('.type-chip.is-active')
        ?.dataset.type === 'Wedding' ||
      document
        .querySelector('.type-chip.is-active')
        ?.dataset.type === 'Mitzvah'
    ) {
      // Weddings + Bar/Bat Mitzvahs
      djRate = 400;
    } else {
      // Corporate + Parties
      djRate = 100;
    }

    total += (hours * djRate) + 200;
  }


  /* =========================================
     LIGHTING
  ========================================= */

  if (active.lighting) {

    if (hours <= 6) {
    total += 150;
    } else if (hours >= 7) {
      total += 250;
    }
  }


  /* =========================================
     PHOTO BOOTH
  ========================================= */

  if (active.photobooth) {

    if (hours === 2) {
      total += 500;
    } else if (hours === 3) {
      total += 650;
    } else if (hours === 4) {
      total += 800;
    } else if (hours === 5) {
      total += 900;
    } else if (hours === 6) {
      total += 1000;
    } else if (hours === 7) {
      total += 1100;
    } else if (hours === 8) {
      total += 1200;
    } else if (hours === 9) {
      total += 1400;
    } else if (hours === 10) {
      total += 1600;
    }
    
  }


  /* =========================================
     KARAOKE
  ========================================= */

  if (active.karaoke) {
    total += hours * 100;
  }


  /* =========================================
     PHOTOGRAPHY
  ========================================= */

  if (active.photography) {

    if (hours === 2) {
      total += 400;
    } else if (hours === 3) {
      total += 550;
    } else if (hours === 4) {
      total += 700;
    } else if (hours === 5) {
      total += 850;
    } else if (hours === 6) {
      total += 1000;
    } else if (hours === 7) {
      total += 1150;
    } else if (hours === 8) {
      total += 1300;
    } else if (hours === 9) {
      total += 1450;
    } else if (hours === 10) {
      total += 1600;
    }

  }


  /* =========================================
     VIDEOGRAPHY
  ========================================= */

  if (active.videography) {

    if (hours === 2) {
      total += 400;
    } else if (hours === 3) {
      total += 550;
    } else if (hours === 4) {
      total += 700;
    } else if (hours === 5) {
      total += 850;
    } else if (hours === 6) {
      total += 1000;
    } else if (hours === 7) {
      total += 1150;
    } else if (hours === 8) {
      total += 1300;
    } else if (hours === 9) {
      total += 1450;
    } else if (hours === 10) {
      total += 1600;
    }

  }


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