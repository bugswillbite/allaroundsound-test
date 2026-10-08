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
const testimonials = [
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

  /*
    -------------------------------------------------------
    EMAIL SERVICE GOES HERE
    -------------------------------------------------------

    Your current static site does not have an email backend.

    When you connect this to Formspree, EmailJS, Wix,
    or another form service, put the request here.

    Example:

    const formData = new FormData(contactForm);

    await fetch('YOUR_FORM_ENDPOINT', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    -------------------------------------------------------
  */

  // Temporary frontend confirmation
  // Replace this section with your real email request.

  await new Promise(resolve => setTimeout(resolve, 700));

  contactFormState.style.display = 'none';

  contactSuccess.hidden = false;

  contactSuccess.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest'
  });
});


// ---------- SEND ANOTHER REQUEST ----------

contactReset?.addEventListener('click', () => {
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


const records = [...document.querySelectorAll(".record-sleeve")];

const answerBox = document.querySelector(".faq-answer");
const faqSection = document.querySelector(".faq-section");
const answerNumber = document.querySelector(".answer-number");
const answerTitle = document.querySelector(".answer-content h3");
const answerText = document.querySelector(".answer-content p");
const closeButton = document.querySelector(".answer-close");


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

    record.addEventListener("click", () => {

      // mark the clicked card as selected, clear the rest
      records.forEach((r) => r.classList.remove("is-active"));
      record.classList.add("is-active");

      const number =
        Number(record.dataset.faq);

      const faq =
        faqData[number];

      if (!faq) return;

      answerNumber.textContent =
        String(number).padStart(2, "0");

      answerTitle.textContent =
        faq.title;

      answerText.textContent =
        faq.answer;

      answerBox.classList.add("active");
      faqSection.classList.add("has-answer");

    });

  });


  /* =========================================
     CLOSE ANSWER
  ========================================= */

  closeButton?.addEventListener("click", () => {

    answerBox.classList.remove("active");
    faqSection.classList.remove("has-answer");

    records.forEach((r) => r.classList.remove("is-active"));

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

      records.forEach((r) => r.classList.remove("is-active"));

    }

  });

}