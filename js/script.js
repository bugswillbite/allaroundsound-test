import { wix, imgUrl } from './wix.js';

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

// ---------- TESTIMONIALS CAROUSEL ----------
// This list is the fallback. If the Wix "Testimonials" collection has items, they replace it.
let testimonials = [
  { quote: "All Around Sound of Monroe County is absolutely fantastic! DJ Stu is incredibly professional, responsive, and accommodating, and his prices are very competitive. We had the pleasure of working with his new DJ, Sam, who was excellent and played all the hits that kept everyone on the dance floor.", name: "Adam Connors" },
  { quote: "DJ Sam at All Around Sound was the perfect choice for our Back to School night. He kept the kids engaged and having fun with dance parties, contests, and so much more. It was also very easy to work with DJ Stu to schedule the event and keep in touch on the details.", name: "Krissy Jones" },
  { quote: "DJ Stu and Sam have been working with my local school for at least a couple of years. They are professional, organized, flexible and wonderful to work with. They got the kids dancing and are always the highlight of the school events.", name: "Jenifer Ruske" },
  { quote: "We recently used All Around Sound for a corporate event. They provided a DJ and a photo booth. The music was great, and the photo booth was a big hit. Stu and his group are easy to work with, very accommodating and true professionals.", name: "Jim Nasso" },
  { quote: "The All Around Sound team contributed to one of the best life experiences ever for our son's Bar Mitzvah! They are professional, engaging, entertaining and truly made it the most memorable family experience ever.", name: "Azanaw Tassew, MD" },
  { quote: "We had All Around Sound for our wedding and they were phenomenal to work with. Both the owner, Stu, and our DJ, Chris, had amazing customer service. Chris played a fantastic range of music and created such a fun atmosphere.", name: "Sarah Maynard" },
];
let quoteIndex = 0;
const quoteText = document.getElementById('quote-text');
const quoteName = document.getElementById('quote-name');
const quoteCount = document.getElementById('quote-count');

function renderQuote(){
  const t = testimonials[quoteIndex];
  quoteText.textContent = `“${t.quote}”`;
  quoteName.textContent = t.name;
  quoteCount.textContent = `${quoteIndex + 1} / ${testimonials.length}`;
}
const quotePrev = document.getElementById('quote-prev');
const quoteNext = document.getElementById('quote-next');
if (quoteText && quoteName && quoteCount && quotePrev && quoteNext) {
  quotePrev.addEventListener('click', () => {
    quoteIndex = (quoteIndex - 1 + testimonials.length) % testimonials.length;
    renderQuote();
  });
  quoteNext.addEventListener('click', () => {
    quoteIndex = (quoteIndex + 1) % testimonials.length;
    renderQuote();
  });
  renderQuote();
}

async function loadTestimonials() {
  if (!quoteText) return; // not the page with the carousel
  try {
    const { items: rows } = await wix.items.query('Testimonials')
      .eq('visible', true).ascending('order').limit(100).find();
    if (!rows.length) return;
    testimonials = rows.map(r => ({ quote: r.quote, name: r.name }));
    quoteIndex = 0;
    renderQuote();
  } catch (err) {
    console.error('Could not load testimonials:', err);
  }
}
loadTestimonials();

// ---------- TEAM (from Wix CMS) ----------
const teamGrid = document.querySelector('.team-grid');

function buildTeamCard(m) {
  const card = document.createElement('div');
  card.className = 'team-card glass-panel';

  if (m.photo) {
    const img = document.createElement('img');
    img.className = 'team-photo';
    img.src = imgUrl(m.photo, 600, 600);
    img.alt = m.name;
    img.loading = 'lazy';
    img.decoding = 'async';
    card.append(img);
  }

  const h3 = document.createElement('h3');
  h3.textContent = m.name;
  const role = document.createElement('span');
  role.className = 'team-role';
  role.textContent = m.role;

  const bio = document.createElement('div');
  bio.className = 'team-bio';
  const p = document.createElement('p');
  p.textContent = m.bioShort;
  bio.append(p);

  const more = (m.bioMore || '').split(/\n+|\s*\|\|\s*/).map(s => s.trim()).filter(Boolean);
  if (more.length) {
    const details = document.createElement('details');
    details.className = 'team-bio-more';
    details.innerHTML = '<summary><span>Read more</span><span>Read less</span></summary>';
    const wrap = document.createElement('div');
    more.forEach(text => {
      const mp = document.createElement('p');
      mp.textContent = text;
      wrap.append(mp);
    });
    details.append(wrap);
    bio.append(details);
  }

  card.append(h3, role, bio);
  return card;
}

async function loadTeam() {
  if (!teamGrid) return;
  try {
    const { items: rows } = await wix.items.query('Team')
      .eq('visible', true).ascending('order').limit(50).find();
    if (!rows.length) return;               // keep the hardcoded cards as a fallback
    teamGrid.replaceChildren(...rows.map(buildTeamCard));
  } catch (err) {
    console.error('Could not load team:', err);
  }
}
loadTeam();

// ---------- MOBILE NAV ----------
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
navToggle?.addEventListener('click', () => {
  const open = mainNav.style.display === 'flex';
  mainNav.style.display = open ? 'none' : 'flex';
  navToggle.setAttribute('aria-expanded', String(!open));
});

// ---------- CONTACT FORM ----------

const contactForm = document.getElementById('contact-form');
const contactFormState = document.getElementById('contact-form-state');
const contactSuccess = document.getElementById('contact-success');
const contactReset = document.getElementById('contact-reset');

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Prevent double submissions
  const submitButton = contactForm.querySelector('.contact-submit');
  submitButton.disabled = true;

  const originalButtonText = submitButton.innerHTML;

  submitButton.innerHTML = `
    <span>Sending...</span>
    <span class="submit-arrow">→</span>
  `;

  try {
    const data = Object.fromEntries(new FormData(contactForm));
    await wix.items.insert('ContactMessages', data);
  } catch (err) {
    console.error('Contact failed:', err);
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
    alert('Sorry, something went wrong. Please try again or email us directly.');
    return;
  }

  contactFormState.style.display = 'none';

  contactSuccess.hidden = false;

  contactSuccess.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest'
  });
});


// ---------- SEND ANOTHER REQUEST ----------

contactReset?.addEventListener('click', () => {
  const btn = contactForm.querySelector('.contact-submit');
  btn.disabled = false;
  btn.innerHTML = `<span>Request my quote</span><span class="submit-arrow">→</span>`;

  contactSuccess.hidden = true;

  contactForm.reset();

  contactFormState.style.display = '';

  contactFormState.animate(
    [
      {
        opacity: 0,
        transform: 'translateY(10px)'
      },
      {
        opacity: 1,
        transform: 'translateY(0)'
      }
    ],
    {
      duration: 350,
      easing: 'cubic-bezier(.22,.61,.36,1)'
    }
  );
});


// ---------- LEAVE A REVIEW ----------
// Name and review are both mandatory.

const reviewForm = document.getElementById('review-form');
const reviewFormState = document.getElementById('review-form-state');
const reviewSuccess = document.getElementById('review-success');
const reviewReset = document.getElementById('review-reset');
const reviewName = document.getElementById('review-name');
const reviewText = document.getElementById('review-text');
const reviewError = document.getElementById('review-error');

function showReviewError(message, field) {
  reviewError.textContent = message;
  reviewError.hidden = false;
  [reviewName, reviewText].forEach(f => f.classList.toggle('is-invalid', f === field));
  field.focus();
}

function clearReviewError() {
  reviewError.hidden = true;
  [reviewName, reviewText].forEach(f => f.classList.remove('is-invalid'));
}

reviewForm?.addEventListener('input', clearReviewError);

reviewForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  // trim first so a name or review of only spaces doesn't count
  const name = reviewName.value.trim();
  const review = reviewText.value.trim();

  if (!name) {
    showReviewError('Please enter your name.', reviewName);
    return;
  }
  if (!review) {
    showReviewError('Please write your review.', reviewText);
    return;
  }
  if (review.length < 10) {
    showReviewError('Your review is a little short. Please tell us a bit more.', reviewText);
    return;
  }
  clearReviewError();

  const submitButton = reviewForm.querySelector('.contact-submit');
  submitButton.disabled = true;
  const originalButtonText = submitButton.innerHTML;
  submitButton.innerHTML = `
    <span>Sending...</span>
    <span class="submit-arrow">→</span>
  `;

  try {
    await wix.items.insert('ReviewSubmissions', { name, review });
  } catch (err) {
    console.error('Review failed:', err);
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
    showReviewError('Sorry, something went wrong. Please try again in a moment.', reviewText);
    return;
  }

  submitButton.disabled = false;
  submitButton.innerHTML = originalButtonText;
  reviewFormState.style.display = 'none';
  reviewSuccess.hidden = false;
  reviewSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

reviewReset?.addEventListener('click', () => {
  reviewSuccess.hidden = true;
  reviewForm.reset();
  clearReviewError();
  reviewFormState.style.display = '';
});


// ---------- FAQ RECORDS ----------

const records = [...document.querySelectorAll(".record-sleeve")];

const answerBox = document.querySelector(".faq-answer");
const faqSection = document.querySelector(".faq-section");
const answerNumber = document.querySelector(".answer-number");
const answerTitle = document.querySelector(".answer-content h3");
const answerText = document.querySelector(".answer-content p");
const closeButton = document.querySelector(".answer-close");
const nextButton = document.querySelector(".answer-next");


const faqData = {
  1: {
    title: "What do I bring?",
    answer:
        "Not much, just make sure you have an available power outlet and most importantly make sure you have on your best dancing pants!"
    },

  2: {
    title: "What do you bring?",
    answer:
      "We come prepared! Depending on your events needs, we can provide professional speakers, wireless microphones, mixers, speaker stands, dance floor and ambient lighting, uplighting, special effects, and our All Around Sound DJ booth! We also offer more event-specific equipment if you are interested in our other services. We'll help you choose the right setup to create the perfect atmosphere, deliver exceptional sound, and keep everything running smoothly from start to finish - so your event is as memorable as possible!"
    },

  3: {
    title: "Can I pick the music?",
    answer:
      "Absolutely! We want the music at your event to be your style! Send us your favorite songs, artists, genres, playlists, must plays, or even a do not play list. If there are certain songs you want for specific moments, just let us know!"
  },

  4: {
    title: "Do you travel?",
    answer:
      "We’re based in Rochester, NY, but we're happy to travel throughout a large surrounding area! Just let us know where your event is taking place, and we'll let you know about availability and any additional travel costs. Wherever the party is, we'll do our best to get there!"
  },

  5: {
    title: "How does the booking work?",
    answer:
      "Ready to start planning? Get in touch with us! Send over your information including event date, time, location, type of event, and any other details want us to know. From there, we will create a blue print for you! We'll answer any questions you have, and help put together the right entertainment setup for your event. Whether you already know exactly what you want, or if you’re still figuring things out, we’re happy to help you build an experience that fits your event, and your budget. If you want to get a rough idea of pricing before reaching out, check out our Build Your Own Event page and put together your own personalized event!"
  },

  6: {
    title: "What do you offer?",
    answer:
      "We provide professional DJ entertainment for weddings, private parties, corporate events, school functions, and any event you want to have a good time at! To make your event even more awesome, we also offer our fun interactive Photo Booth experience, our immersive Karaoke service, and to make sure your happiest moments are preserved forever, we also offer our high quality photography and videography options as well. Whether you need music to keep your guests dancing or a complete entertainment package, our experienced team has everything you need to make your event a success!"
  }
};


if (answerBox && records.length) {
  const showFaq = (record) => {
    const number = Number(record.dataset.faq);
    const faq = faqData[number];

    if (!faq) return;

    records.forEach((item) => {
      const isActive = item === record;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    answerNumber.textContent = String(number).padStart(2, "0");
    answerTitle.textContent = faq.title;
    answerText.textContent = faq.answer;
    answerBox.classList.add("active");
    faqSection.classList.add("has-answer");
  };

  /* =========================================
  RECORDS
  ========================================= */

  records.forEach((record, index) => {

    const behind = records.slice(0, index);

    record.addEventListener("mouseenter", () => {
      behind.forEach((r) => r.classList.add("is-nudged"));
    });

    record.addEventListener("mouseleave", () => {
      behind.forEach((r) => r.classList.remove("is-nudged"));
    });

  });


  /* =========================================
     CLICK RECORD → SHOW ANSWER
  ========================================= */

  records.forEach((record) => {

    record.addEventListener("click", () => showFaq(record));

    record.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showFaq(record);
      }
    });

  });

  nextButton?.addEventListener("click", () => {
    const activeIndex = records.findIndex((record) =>
      record.classList.contains("is-active")
    );

    if (activeIndex !== -1) {
      showFaq(records[(activeIndex + 1) % records.length]);
    }
  });


  /* =========================================
     CLOSE ANSWER
  ========================================= */

  closeButton?.addEventListener("click", () => {

    answerBox.classList.remove("active");
    faqSection.classList.remove("has-answer");

    records.forEach((record) => {
      record.classList.remove("is-active");
      record.setAttribute("aria-pressed", "false");
    });

  });


  /* =========================================
     CLOSE WHEN CLICKING OUTSIDE
  ========================================= */

  document.addEventListener("click", (event) => {

    if (
      !event.target.closest(".record-sleeve") &&
      !event.target.closest(".faq-answer")
    ) {

      answerBox.classList.remove("active");
      faqSection.classList.remove("has-answer");

      records.forEach((record) => {
        record.classList.remove("is-active");
        record.setAttribute("aria-pressed", "false");
      });

    }

  });

}