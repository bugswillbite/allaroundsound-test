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

// ---------- EVENT TYPE KNOB ----------
const eventRadios = [...document.querySelectorAll('.clock-input input[type="radio"]')];
const dialEl = document.querySelector('.clock-input .dial');
const eventValue = document.getElementById('event-value');

if (eventRadios.length && dialEl && eventValue) {
  const count = eventRadios.length;
  const step = 360 / count;
  let current = Math.max(0, eventRadios.findIndex(r => r.checked));
  let angle = current * step; // cumulative, so the knob never spins backwards
  let fadeTimer;

  dialEl.style.setProperty('--angle', `${angle}deg`);
  eventValue.textContent = eventRadios[current].dataset.label;

  eventRadios.forEach((radio, index) => {
    radio.addEventListener('change', () => {
      if (!radio.checked) return;

      // shortest direction: clicking turns clockwise, arrow keys can turn back
      let delta = (index - current + count) % count;
      if (delta > count / 2) delta -= count;
      angle += delta * step;
      current = index;
      dialEl.style.setProperty('--angle', `${angle}deg`);

      // screen: fade out, swap text, fade in
      clearTimeout(fadeTimer);
      eventValue.style.opacity = '0';
      eventValue.style.transform = 'translateY(2px)';
      fadeTimer = setTimeout(() => {
        eventValue.textContent = radio.dataset.label;
        eventValue.style.opacity = '1';
        eventValue.style.transform = 'translateY(0)';
      }, 100);
    });
  });
}

// ---------- BUILD YOUR EVENT ----------
const hoursRange = document.getElementById('hours-range');
const hoursValue = document.getElementById('hours-value');
const toggles = document.querySelectorAll('.toggle-switch');
const quoteReel = document.getElementById('quote-reel');
const quoteMachine = document.getElementById('quote-machine');
const spinBtn = document.getElementById('spin-btn');

if (spinBtn && hoursRange && quoteReel && quoteMachine) {

  // ---- Add-ons that can cover less than the whole event ----
  // (DJ and lighting always follow the event hours)
  const PARTIAL_SERVICES = ['photobooth', 'karaoke', 'photography', 'videography'];
  const MIN_HOURS = 2; // shortest bookable length (first column of the price tables)
  const addons = {};   // service -> { mode, hours, panel, ... }

  PARTIAL_SERVICES.forEach(service => {
    const toggle = document.querySelector(`.toggle-switch[data-service="${service}"]`);
    if (!toggle) return;
    const name = toggle.querySelector('strong')?.textContent ?? service;

    // wrap the toggle so the options panel can sit directly under it
    const item = document.createElement('div');
    item.className = 'service-item';
    toggle.before(item);
    item.appendChild(toggle);

    const panel = document.createElement('div');
    panel.className = 'duration-options';
    panel.hidden = true;
    panel.innerHTML = `
      <div class="duration-choices" role="group" aria-label="${name} coverage">
        <button type="button" class="duration-chip is-active" data-mode="whole">Whole event</button>
        <button type="button" class="duration-chip" data-mode="custom">Specific hours</button>
      </div>
      <div class="duration-hours hours-fader" hidden>
        <div class="snd-regulator-context">
          <div class="snd-fader-panel snd-fader-panel--compact">
            <div class="snd-fader-container">
              <input type="range" class="snd-audio-fader" min="${MIN_HOURS}" max="${MIN_HOURS}" step="1" value="${MIN_HOURS}" aria-label="${name} hours">
            </div>
          </div>
        </div>
        <div class="hours-readout"><strong>${MIN_HOURS}</strong><small>HRS</small></div>
      </div>`;
    item.appendChild(panel);

    const state = {
      mode: 'whole',
      hours: MIN_HOURS,
      panel,
      chips: [...panel.querySelectorAll('.duration-chip')],
      hoursWrap: panel.querySelector('.duration-hours'),
      slider: panel.querySelector('input[type="range"]'),
      readout: panel.querySelector('.hours-readout strong'),
    };
    addons[service] = state;

    state.chips.forEach(chip => {
      chip.addEventListener('click', () => {
        if (chip.disabled) return;
        state.mode = chip.dataset.mode;
        syncAddon(service);
      });
    });

    state.slider.addEventListener('input', () => {
      state.hours = Number(state.slider.value);
      syncAddon(service);
    });
  });

  function eventHours() {
    return Number(hoursRange.value);
  }

  // hours this service is actually booked for (never more than the event)
  function serviceHours(service) {
    const total = eventHours();
    const a = addons[service];
    if (!a || a.mode === 'whole') return total;
    return Math.min(Math.max(a.hours, MIN_HOURS), total);
  }

  function syncAddon(service) {
    const a = addons[service];
    const total = eventHours();
    const canSplit = total > MIN_HOURS; // a 2-hour event has nothing shorter to pick

    if (!canSplit) a.mode = 'whole';
    a.hours = Math.min(Math.max(a.hours, MIN_HOURS), total);

    a.slider.max = String(total);
    a.slider.parentElement.style.setProperty('--steps', Math.max(1, total - MIN_HOURS)); // tick marks: one per hour
    a.slider.value = String(a.hours);
    a.readout.textContent = a.hours;

    a.chips.forEach(chip => {
      chip.classList.toggle('is-active', chip.dataset.mode === a.mode);
      if (chip.dataset.mode === 'custom') {
        chip.disabled = !canSplit;
        chip.title = canSplit ? '' : 'The event is only 2 hours long';
      }
    });
    a.hoursWrap.hidden = a.mode !== 'custom';
  }

  function syncAddons() {
    Object.entries(addons).forEach(([service, a]) => {
      const toggle = document.querySelector(`.toggle-switch[data-service="${service}"]`);
      a.panel.hidden = !toggle.classList.contains('is-active');
      syncAddon(service);
    });
  }

  hoursRange.addEventListener('input', () => {
    hoursValue.textContent = hoursRange.value;
    syncAddons(); // keeps add-on hours from exceeding the event
  });

  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('is-active');
      syncAddons();
    });
  });

  syncAddons();

  // Pricing model: price per hours of coverage (2 to 10)
  const PRICES = {
    //            2h    3h    4h    5h    6h    7h    8h    9h    10h
    lighting:    [150,  150,  150,  150,  150,  250,  250,  250,  250],
    photobooth:  [500,  650,  800,  900, 1000, 1100, 1200, 1400, 1600],
    karaoke:     [200,  300,  400,  500,  600,  700,  800,  900, 1000],
    photography: [700,  950,  1250,  1500, 1750, 2000, 2250, 2500, 2750],
    videography: [600,  800,  1050,  1300, 1500, 1700, 1900, 2100, 2300],
  };

  // DJ has two pricing structures, chosen by event type
  const DJ_PRICING = {
    // Weddings + Bar/Bat Mitzvahs: set price per hours of coverage
    // (2h and 3h are PLACEHOLDERS - confirm)
    premium: {
      //      2h   3h    4h    5h    6h    7h    8h    9h    10h
      prices: [800, 1000, 1200, 1400, 1600, 1800, 2000, 2400, 2600],
      setupFee: 0, // set to 200 if the prices above do NOT already include set up/break down
    },
    // Corporate + Parties: hourly rate plus flat set up/break down fee
    standard: {
      hourlyRate: 100,
      setupFee: 200,
    },
  };

  function getDjTotal(hours) {
    const type = document.querySelector('.clock-input input:checked')?.dataset.type;
    if (type === 'Wedding' || type === 'Mitzvah') {
      const p = DJ_PRICING.premium;
      return (p.prices[hours - 2] ?? 0) + p.setupFee;
    }
    const p = DJ_PRICING.standard;
    return hours * p.hourlyRate + p.setupFee;
  }

  function calculateQuote() {
    const hours = Number(hoursRange.value);

    let total = 0;
    toggles.forEach(toggle => {
      if (!toggle.classList.contains('is-active')) return;
      const service = toggle.dataset.service;
      if (service === 'dj') {
        total += getDjTotal(hours);
      } else if (service === 'lighting') {
        total += PRICES.lighting[hours - 2] ?? 0; // follows the event hours
      } else if (PRICES[service]) {
        // add-ons use their own hours (event hours unless set shorter)
        total += PRICES[service][serviceHours(service) - 2] ?? 0;
      }
    });
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