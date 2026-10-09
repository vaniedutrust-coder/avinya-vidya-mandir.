/**
 * Avinya Vidya Mandir (Vani Avitya Mandir) — Client Script
 * Handles navigation, interactive modals, admissions calculator, lightbox, animations, and API requests.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initModals();
  initInquiryForm();
  initTourForm();
  initContactForm();
  initNewsletterForm();
  initGallery();
  initFeeCalculator();
  initScrollAnimations();
  initMapSizingToggles();
  initCareersForm();
  initAlumni();
  initAcademicCalendar();
  initParentsPortal();
  initAccessibilityToolbar();
  initFloatingWhatsApp();
});

/* ==========================================================================
   Scroll-Reveal Animations
   ========================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.growth-card, .story-card, .pillar-card, .perk-card, .hero-badge-item, .tour-360-showcase');
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('reveal-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => {
    el.classList.add('reveal-init');
    observer.observe(el);
  });
}

/* ==========================================================================
   Toast Notification Helper
   ========================================================================== */
function showToast(message, type = 'success') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bg = type === 'success' ? '#278065' : '#df5433';
  toast.style.cssText = `
    background: ${bg};
    color: #ffffff;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 0.92rem;
    font-weight: 500;
    box-shadow: 0 8px 24px rgba(0,0,0,0.18);
    display: flex;
    align-items: center;
    gap: 10px;
    animation: fadeInToast 0.3s ease;
  `;
  toast.innerHTML = `<span>${type === 'success' ? '✓' : '⚠'}</span> <span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ==========================================================================
   Mobile Navigation
   ========================================================================== */
function initMobileNav() {
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    toggle.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
  });

  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      toggle.textContent = '☰';
    }
  });
}

/* ==========================================================================
   Modals (Inquiry, Campus Tour & 360° Walkthrough)
   ========================================================================== */
function initModals() {
  const openInquiryBtns = document.querySelectorAll('[data-open-modal="inquiry"], .open-enquiry-modal');
  const openTourBtns = document.querySelectorAll('[data-open-modal="tour"], .open-tour-modal');
  const open360Btns = document.querySelectorAll('[data-open-modal="360"], .open-360-modal');
  
  const inquiryModal = document.getElementById('enquiryModal') || document.getElementById('inquiry-modal');
  const tourModal = document.getElementById('tourModal') || document.getElementById('tour-modal');
  const tour360Modal = document.getElementById('tour360Modal');
  const modal360Iframe = document.getElementById('modal360Iframe');
  const closeBtns = document.querySelectorAll('.modal-close, .modal-360-close');
  const allModals = document.querySelectorAll('.modal-backdrop');

  function openM(modal) {
    if (!modal) return;
    closeAllModals();
    modal.classList.add('active');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeAllModals() {
    allModals.forEach(m => {
      m.classList.remove('active');
      m.classList.remove('open');
      m.setAttribute('aria-hidden', 'true');
    });
    document.body.style.overflow = '';
  }

  openInquiryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openM(inquiryModal);
    });
  });

  openTourBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const stage = btn.getAttribute('data-stage');
      if (stage && tourModal) {
        const gradeSelect = tourModal.querySelector('#tourChildGrade, #grade_interest');
        if (gradeSelect) {
          if (stage === 'kindergarten') gradeSelect.value = 'Kindergarten';
          if (stage === 'primary') gradeSelect.value = 'Primary (1-3)';
        }
      }
      openM(tourModal);
    });
  });

  open360Btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal360Iframe && (!modal360Iframe.src || modal360Iframe.src === 'about:blank' || modal360Iframe.src === window.location.href)) {
        modal360Iframe.src = modal360Iframe.getAttribute('data-src') || 'https://avinyaschool.dharamgraphics.in/';
      }
      openM(tour360Modal);
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => closeAllModals());
  });

  allModals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeAllModals();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  // Testimonial slider navigation
  const prevStoryBtn = document.querySelector('.prev-btn');
  const nextStoryBtn = document.querySelector('.next-btn');
  const storiesGrid = document.querySelector('.stories-grid');

  if (prevStoryBtn && nextStoryBtn && storiesGrid) {
    prevStoryBtn.addEventListener('click', () => {
      storiesGrid.scrollBy({ left: -320, behavior: 'smooth' });
    });
    nextStoryBtn.addEventListener('click', () => {
      storiesGrid.scrollBy({ left: 320, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   Admissions Inquiry Form Submission
   ========================================================================== */
function initInquiryForm() {
  // 1. Crayon Box Style Modal Enquiry Form (#enquiryForm)
  const enquiryForm = document.getElementById('enquiryForm');
  const enquirySuccess = document.getElementById('enquirySuccess');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = enquiryForm.querySelector('button[type="submit"]');
      const origText = btn ? btn.innerHTML : '';
      if (btn) { btn.innerHTML = 'Submitting Enquiry...'; btn.disabled = true; }

      const parentName = document.getElementById('enquiryParentName')?.value || '';
      const studentName = document.getElementById('enquiryStudentName')?.value || '';
      const phone = document.getElementById('enquiryPhone')?.value || '';
      const grade = document.getElementById('enquiryGrade')?.value || 'Playgroup';
      const message = document.getElementById('enquiryMessage')?.value || '';

      const data = {
        student_name: studentName,
        parent_name: parentName,
        parent_phone: phone,
        grade_applied: grade,
        counselor_notes: message
      };

      try {
        const res = await fetch('/api/admissions/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await res.json();
        if (res.ok && result.success) {
          if (enquirySuccess) {
            enquirySuccess.innerHTML = `✅ Thank you! Inquiry received with Ref: <strong>${result.appNo || result.app_no}</strong>. Our admissions team will reach out shortly.`;
            enquirySuccess.classList.add('show');
          }
          showToast(`Inquiry submitted! Application Ref: ${result.appNo || result.app_no}`);
          enquiryForm.reset();
          setTimeout(() => {
            const modal = document.getElementById('enquiryModal');
            if (modal) {
              modal.classList.remove('active', 'open');
              modal.setAttribute('aria-hidden', 'true');
              document.body.style.overflow = '';
            }
            if (enquirySuccess) enquirySuccess.classList.remove('show');
          }, 3500);
        } else {
          showToast(result.error || 'Failed to submit inquiry.', 'error');
        }
      } catch (err) {
        showToast('Network error. Please try again.', 'error');
      } finally {
        if (btn) { btn.innerHTML = origText; btn.disabled = false; }
      }
    });
  }

  // 2. Legacy / Page Inquiry Form (#inquiry-form)
  const forms = document.querySelectorAll('#inquiry-form');
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Submitting...';
      btn.disabled = true;

      const data = {
        student_name: form.student_name?.value,
        parent_name: form.parent_name?.value,
        parent_email: form.parent_email?.value,
        parent_phone: form.parent_phone?.value,
        grade_applied: form.grade_applied?.value,
        dob: form.dob?.value || '',
        locality: form.locality?.value || '',
        counselor_notes: form.counselor_notes?.value || ''
      };

      try {
        const res = await fetch('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await res.json();
        if (res.ok && result.success) {
          showToast(`Application submitted! Application Ref: ${result.app_no}`);
          form.reset();
          const modal = document.getElementById('inquiry-modal') || document.getElementById('enquiryModal');
          if (modal) {
            modal.classList.remove('active', 'open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
          }
        } else {
          showToast(result.error || 'Failed to submit inquiry.', 'error');
        }
      } catch (err) {
        showToast('Network error. Please try again.', 'error');
      } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    });
  });
}

/* ==========================================================================
   Campus Tour Booking Submission
   ========================================================================== */
function initTourForm() {
  // 1. Crayon Box Style Modal Tour Form (#tourForm)
  const tourFormModal = document.getElementById('tourForm');
  const tourSuccess = document.getElementById('tourSuccess');
  if (tourFormModal) {
    tourFormModal.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = tourFormModal.querySelector('button[type="submit"]');
      const origText = btn ? btn.innerHTML : '';
      if (btn) { btn.innerHTML = 'Reserving Slot...'; btn.disabled = true; }

      const parentName = document.getElementById('tourParentName')?.value || '';
      const phone = document.getElementById('tourPhone')?.value || '';
      const email = document.getElementById('tourEmail')?.value || '';
      const grade = document.getElementById('tourChildGrade')?.value || 'Playgroup';
      const date = document.getElementById('tourDate')?.value || new Date().toISOString().split('T')[0];

      const data = {
        parent_name: parentName,
        parent_phone: phone,
        parent_email: email,
        preferred_date: date,
        grade_interest: grade,
        preferred_time_slot: 'Morning (9:30 AM - 11:00 AM)'
      };

      try {
        const res = await fetch('/api/tours/book', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await res.json();
        if (res.ok && result.success) {
          if (tourSuccess) {
            tourSuccess.innerHTML = `✅ Walkthrough Confirmed! Booking Ref: <strong>${result.bookingRef || result.booking_ref}</strong>. We look forward to seeing you on ${date}.`;
            tourSuccess.classList.add('show');
          }
          showToast(`Walkthrough confirmed! Ref: ${result.bookingRef || result.booking_ref}`);
          tourFormModal.reset();
          setTimeout(() => {
            const modal = document.getElementById('tourModal');
            if (modal) {
              modal.classList.remove('active', 'open');
              modal.setAttribute('aria-hidden', 'true');
              document.body.style.overflow = '';
            }
            if (tourSuccess) tourSuccess.classList.remove('show');
          }, 3500);
        } else {
          showToast(result.error || 'Failed to book walkthrough.', 'error');
        }
      } catch (err) {
        showToast('Network error. Please try again.', 'error');
      } finally {
        if (btn) { btn.innerHTML = origText; btn.disabled = false; }
      }
    });
  }

  // 2. Legacy / Page Tour Form (#tour-form)
  const form = document.getElementById('tour-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Booking...';
      btn.disabled = true;

      const data = {
        parent_name: form.parent_name?.value,
        parent_phone: form.parent_phone?.value,
        parent_email: form.parent_email?.value,
        preferred_date: form.preferred_date?.value,
        preferred_time_slot: form.preferred_time_slot?.value,
        grade_interest: form.grade_interest?.value,
        attendee_count: parseInt(form.attendee_count?.value || '2', 10),
        special_queries: form.special_queries?.value || ''
      };

      try {
        const res = await fetch('/api/tours', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await res.json();
        if (res.ok && result.success) {
          showToast(`Tour confirmed! Booking Ref: ${result.booking_ref}`);
          form.reset();
          const modal = document.getElementById('tour-modal') || document.getElementById('tourModal');
          if (modal) {
            modal.classList.remove('active', 'open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
          }
        } else {
          showToast(result.error || 'Failed to book walkthrough.', 'error');
        }
      } catch (err) {
        showToast('Network error. Please try again.', 'error');
      } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    });
  }
}

/* ==========================================================================
   Contact Form Submission
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Sending...';
    btn.disabled = true;

    const data = {
      name: form.name?.value,
      email: form.email?.value,
      phone: form.phone?.value,
      subject: form.subject?.value,
      message: form.message?.value
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (res.ok && result.success) {
        showToast('Message sent! Our admissions desk will reply shortly.');
        form.reset();
      } else {
        showToast(result.error || 'Failed to send message.', 'error');
      }
    } catch (err) {
      showToast('Network error. Please try again.', 'error');
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  });
}

/* ==========================================================================
   Newsletter Subscription
   ========================================================================== */
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const email = input?.value;
    if (!email) return;

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const result = await res.json();
      if (res.ok && result.success) {
        showToast('Subscribed to Avinya Vidya Mandir updates!');
        form.reset();
      } else {
        showToast('Already subscribed or invalid email.', 'error');
      }
    } catch (err) {
      showToast('Error subscribing.', 'error');
    }
  });
}

/* ==========================================================================
   Gallery & Lightbox
   ========================================================================== */
let galleryData = [];
let currentPhotoIndex = 0;

async function initGallery() {
  const galleryGrid = document.getElementById('gallery-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const lightbox = document.getElementById('lightbox-modal');
  if (!galleryGrid) return;

  try {
    const res = await fetch('/api/gallery');
    galleryData = await res.json();
    renderGallery('all');
  } catch (e) {
    console.error('Error fetching gallery catalog:', e);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter');
      renderGallery(cat);
    });
  });

  if (lightbox) {
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', () => changeLightboxImage(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => changeLightboxImage(1));

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') changeLightboxImage(-1);
      if (e.key === 'ArrowRight') changeLightboxImage(1);
    });
  }
}

function renderGallery(filterCategory) {
  const galleryGrid = document.getElementById('gallery-grid');
  if (!galleryGrid) return;

  galleryGrid.innerHTML = '';
  const filtered = galleryData.filter(item => {
    if (filterCategory === 'all') return true;
    return item.category?.toLowerCase().includes(filterCategory.toLowerCase());
  });

  filtered.forEach((item) => {
    const card = document.createElement('div');
    card.className = `gallery-item ${item.orientation === 'portrait' ? 'portrait-item' : ''}`;
    card.innerHTML = `
      <img src="${item.thumb_src}" alt="${item.title}" loading="lazy" />
      <div class="gallery-overlay">
        <span class="gallery-item-cat">${item.category}</span>
        <h4 class="gallery-item-title">${item.title}</h4>
      </div>
    `;

    card.addEventListener('click', () => {
      openLightbox(galleryData.indexOf(item));
    });

    galleryGrid.appendChild(card);
  });
}

function openLightbox(index) {
  const lightbox = document.getElementById('lightbox-modal');
  if (!lightbox || !galleryData[index]) return;

  currentPhotoIndex = index;
  updateLightboxContent();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox-modal');
  if (!lightbox) return;
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function changeLightboxImage(direction) {
  currentPhotoIndex += direction;
  if (currentPhotoIndex < 0) currentPhotoIndex = galleryData.length - 1;
  if (currentPhotoIndex >= galleryData.length) currentPhotoIndex = 0;
  updateLightboxContent();
}

function updateLightboxContent() {
  const lightbox = document.getElementById('lightbox-modal');
  if (!lightbox) return;

  const item = galleryData[currentPhotoIndex];
  const img = lightbox.querySelector('.lightbox-img-wrap img');
  const title = lightbox.querySelector('.lightbox-caption h4');
  const desc = lightbox.querySelector('.lightbox-caption p');

  if (img) img.src = item.web_src;
  if (title) title.textContent = `${item.title} (${currentPhotoIndex + 1} of ${galleryData.length})`;
  if (desc) desc.textContent = item.description;
}

/* ==========================================================================
   Smooth & Robust Admissions Fee Calculator
   ========================================================================== */
function initFeeCalculator() {
  const gradeSelect = document.getElementById('calc-grade');
  const siblingSelect = document.getElementById('calc-sibling');
  const clubSelect = document.getElementById('calc-club');
  const totalDisplay = document.getElementById('calc-total');
  const baseFeeDisplay = document.getElementById('calc-base-fee');
  const siblingDiscountDisplay = document.getElementById('calc-sibling-discount');
  const clubBenefitDisplay = document.getElementById('calc-club-benefit');
  const applyBtn = document.getElementById('calc-apply-btn');

  if (!gradeSelect || !totalDisplay) return;

  const baseFees = {
    'playgroup': 3800,
    'nursery': 4200,
    'lkg': 4500,
    'ukg': 4500,
    'class1': 4800
  };

  const gradeNames = {
    'playgroup': 'Playgroup',
    'nursery': 'Nursery',
    'lkg': 'LKG',
    'ukg': 'UKG',
    'class1': 'Class 1'
  };

  function animateValue(el, start, end, duration) {
    if (start === end) {
      el.textContent = `₹${end.toLocaleString('en-IN')}`;
      return;
    }
    const range = end - start;
    let current = start;
    const increment = end > start ? Math.ceil(range / 15) : Math.floor(range / 15);
    const stepTime = Math.abs(Math.floor(duration / 15));
    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        current = end;
        clearInterval(timer);
      }
      el.textContent = `₹${current.toLocaleString('en-IN')}`;
    }, stepTime);
  }

  let previousTotal = 4800;

  function calculate() {
    const grade = gradeSelect.value || 'class1';
    const sibling = siblingSelect ? siblingSelect.value : 'first';
    const club = clubSelect ? clubSelect.value : 'cricket';

    const monthlyTuition = baseFees[grade] || 4800;
    let tuitionPayable = monthlyTuition;
    let siblingText = 'None (Standard 1st child)';

    if (sibling === 'second') {
      tuitionPayable = Math.round(monthlyTuition * 0.5);
      siblingText = `50% Concession (-₹${(monthlyTuition * 0.5).toLocaleString('en-IN')})`;
    } else if (sibling === 'third') {
      tuitionPayable = 0;
      siblingText = '100% Full Waiver (Free Tuition)';
    }

    if (baseFeeDisplay) {
      baseFeeDisplay.textContent = `₹${monthlyTuition.toLocaleString('en-IN')}/mo`;
    }

    if (siblingDiscountDisplay) {
      siblingDiscountDisplay.textContent = siblingText;
    }

    if (clubBenefitDisplay && clubSelect) {
      const selectedClubText = clubSelect.options[clubSelect.selectedIndex]?.text.split('(')[0].trim() || 'Selected Club';
      clubBenefitDisplay.textContent = `${selectedClubText} (1st Term Free)`;
    }

    animateValue(totalDisplay, previousTotal, tuitionPayable, 200);
    previousTotal = tuitionPayable;
  }

  [gradeSelect, siblingSelect, clubSelect].forEach(el => {
    if (el) {
      el.addEventListener('change', calculate);
      el.addEventListener('input', calculate);
    }
  });

  calculate();

  // Sync with Inquiry Modal when user clicks "Apply with Active Concessions"
  if (applyBtn) {
    applyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const grade = gradeSelect.value;
      const targetGradeText = gradeNames[grade] || 'Class 1';
      const sibling = siblingSelect ? siblingSelect.value : 'first';
      const club = clubSelect ? clubSelect.options[clubSelect.selectedIndex]?.text.split('(')[0].trim() : 'Enrichment Club';

      // Open Modal
      const inquiryModal = document.getElementById('inquiry-modal');
      if (inquiryModal) {
        inquiryModal.classList.add('active');

        // Pre-fill grade in modal
        const modalGradeSelect = inquiryModal.querySelector('select[name="grade_applied"]');
        if (modalGradeSelect) {
          for (let i = 0; i < modalGradeSelect.options.length; i++) {
            if (modalGradeSelect.options[i].value === targetGradeText) {
              modalGradeSelect.selectedIndex = i;
              break;
            }
          }
        }

        // Pre-fill notes with calculated concession details
        const notesField = inquiryModal.querySelector('textarea[name="counselor_notes"]');
        if (notesField) {
          let siblingNote = sibling === 'second' ? '50% Sibling Concession' : (sibling === 'third' ? '100% 3rd Sibling Waiver' : 'Standard 1st child');
          notesField.value = `[Applied from Calculator: Grade: ${targetGradeText} | ${siblingNote} | Club Selected: ${club} | 100% Founders Admission Waiver Claimed]`;
        }
      }
    });
  }
}

/* ==========================================================================
   Interactive Google Map View Switcher
   ========================================================================== */
function initMapSizingToggles() {
  const mapSizeBtns = document.querySelectorAll('.map-size-btn, .map-toggle-btn');
  const mapBoxes = document.querySelectorAll('.contact-map-frame-box, .map-frame-container');
  const mapFrames = document.querySelectorAll('.contact-map-frame-box iframe, .map-frame-container iframe');

  // Ensure all map iframes are 100% full-width
  mapFrames.forEach(frame => {
    frame.style.width = '100%';
    frame.style.maxWidth = '100%';
    frame.style.margin = '0';
  });

  if (!mapSizeBtns.length) return;

  mapSizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode') || btn.getAttribute('data-size');
      mapSizeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      mapBoxes.forEach(box => {
        box.classList.remove('mode-large', 'mode-compact', 'size-small', 'size-large');
        if (mode === 'large') {
          box.classList.add('mode-large');
          box.style.height = '680px';
        } else if (mode === 'compact' || mode === 'small') {
          box.classList.add('mode-compact');
          box.style.height = '380px';
        } else {
          // Standard / Medium default
          box.style.height = '520px';
        }
      });
    });
  });
}


/* ==========================================================================
   20. CAREERS & FACULTY APPLICATION (careers.html)
   ========================================================================== */
function initCareersForm() {
  const form = document.getElementById('facultyApplicationForm');
  const fileInput = document.getElementById('resumeUpload');
  const fileText = document.getElementById('resumeFileText');
  const toast = document.getElementById('careerToast');

  function showCareerToast(msg, isSuccess = true) {
    if (toast) {
      toast.innerHTML = (isSuccess ? '&#10004; ' : '&#9888; ') + msg;
      toast.style.backgroundColor = isSuccess ? '#1b634e' : '#b93e20';
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4500);
    } else {
      showToast(msg, isSuccess ? 'success' : 'error');
    }
  }

  if (fileInput && fileText) {
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        if (file.size > 5 * 1024 * 1024) {
          showCareerToast('Resume exceeds 5MB limit. Please upload a smaller file.', false);
          fileInput.value = '';
          fileText.textContent = 'Click to select Resume / CV (PDF or DOCX, max 5MB)';
        } else {
          fileText.textContent = '📄 ' + file.name + ' (' + (file.size / 1024).toFixed(1) + ' KB)';
        }
      } else {
        fileText.textContent = 'Click to select Resume / CV (PDF or DOCX, max 5MB)';
      }
    });
  }

  // Pre-fill position from URL hash or opening cards
  const applyRoleSelect = document.getElementById('applyRole');
  const openRoleBtns = document.querySelectorAll('.btn-apply-job');
  openRoleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const role = btn.getAttribute('data-job-title');
      if (applyRoleSelect && role) {
        applyRoleSelect.value = role;
      }
      const target = document.getElementById('apply-form');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const origText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.innerHTML = 'Uploading Application & Resume...';
        submitBtn.disabled = true;
      }

      try {
        let resumeBase64 = null;
        let resumeFilename = null;
        if (fileInput && fileInput.files.length > 0) {
          const file = fileInput.files[0];
          resumeFilename = file.name;
          resumeBase64 = await new Promise((res, rej) => {
            const reader = new FileReader();
            reader.onload = () => res(reader.result);
            reader.onerror = rej;
            reader.readAsDataURL(file);
          });
        }

        const payload = {
          candidateName: document.getElementById('applicantName')?.value || '',
          email: document.getElementById('applicantEmail')?.value || '',
          phone: document.getElementById('applicantPhone')?.value || '',
          position: document.getElementById('applyRole')?.value || '',
          qualification: document.getElementById('highestQualification')?.value || '',
          experience: document.getElementById('teachingExperience')?.value || '0',
          coverNote: document.getElementById('teachingPhilosophy')?.value || '',
          resumeBase64,
          resumeFilename
        };

        const res = await fetch('/api/careers/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (data.success) {
          if (submitBtn) {
            submitBtn.innerHTML = '✔ Applied (' + data.appId + ')!';
            submitBtn.style.backgroundColor = '#1b634e';
          }
          showCareerToast('Application Submitted! Ref ID: ' + data.appId + '. Our academic board will review your profile and reach out within 48 hours.');
          setTimeout(() => {
            form.reset();
            if (fileText) {
              fileText.innerHTML = 'Click to select Resume / CV (PDF or DOCX, max 5MB)';
            }
            if (submitBtn) {
              submitBtn.innerHTML = origText;
              submitBtn.style.backgroundColor = '';
              submitBtn.disabled = false;
            }
          }, 4000);
        } else {
          showCareerToast(data.error || 'Submission error', false);
          if (submitBtn) {
            submitBtn.innerHTML = origText;
            submitBtn.disabled = false;
          }
        }
      } catch (err) {
        console.error(err);
        showCareerToast('Network error while submitting application. Please try again.', false);
        if (submitBtn) {
          submitBtn.innerHTML = origText;
          submitBtn.disabled = false;
        }
      }
    });
  }
}

/* ==========================================================================
   21. ALUMNI DIRECTORY & REGISTRATION (alumni.html)
   ========================================================================== */
function initAlumni() {
  const searchInput = document.getElementById('alumniSearchInput');
  const filterBtns = document.querySelectorAll('.alumni-filter-btn');
  const storyModal = document.getElementById('alumniStoryModal');
  const modalName = document.getElementById('modalAlumniName');
  const modalRole = document.getElementById('modalAlumniRole');
  const modalBatch = document.getElementById('modalAlumniBatch');
  const modalBody = document.getElementById('modalAlumniBody');
  const regForm = document.getElementById('alumniRegistrationForm');
  const toast = document.getElementById('alumniToast');

  function showAlumniToast(msg, isSuccess = true) {
    if (toast) {
      toast.innerHTML = (isSuccess ? '&#10004; ' : '&#9888; ') + msg;
      toast.style.backgroundColor = isSuccess ? '#1b634e' : '#b93e20';
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4500);
    } else {
      showToast(msg, isSuccess ? 'success' : 'error');
    }
  }

  function filterAlumni() {
    const cards = document.querySelectorAll('.alumni-card');
    const activeBtn = document.querySelector('.alumni-filter-btn.active');
    const cat = activeBtn ? activeBtn.getAttribute('data-category') : 'all';
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    cards.forEach(card => {
      const cardCat = card.getAttribute('data-category') || '';
      const text = card.textContent.toLowerCase();
      const matchesCat = (cat === 'all' || cardCat === cat);
      const matchesQuery = (!query || text.includes(query));

      if (matchesCat && matchesQuery) {
        card.style.display = '';
        card.classList.add('in-view');
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterAlumni();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterAlumni);
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-read-alumni');
    if (btn && storyModal) {
      e.preventDefault();
      const name = btn.getAttribute('data-name') || 'Alumnus';
      const role = btn.getAttribute('data-role') || 'Graduate';
      const batch = btn.getAttribute('data-batch') || 'Batch';
      const bodyText = btn.getAttribute('data-body') || 'Journey narrative will be updated shortly.';

      if (modalName) modalName.textContent = name;
      if (modalRole) modalRole.textContent = role;
      if (modalBatch) modalBatch.textContent = batch;
      if (modalBody) modalBody.innerHTML = bodyText;

      storyModal.classList.add('open');
      storyModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  });

  const closeAlumniModal = () => {
    if (!storyModal) return;
    storyModal.classList.remove('open');
    storyModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.modal-alumni-close').forEach(b => b.addEventListener('click', closeAlumniModal));
  if (storyModal) {
    storyModal.addEventListener('click', (e) => {
      if (e.target === storyModal) closeAlumniModal();
    });
  }

  if (regForm) {
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = regForm.querySelector('button[type="submit"]');
      const origText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.innerHTML = 'Connecting with Network...';
        submitBtn.disabled = true;
      }

      const payload = {
        fullName: document.getElementById('alumniName')?.value || '',
        batchYear: parseInt(document.getElementById('alumniBatch')?.value || '2024', 10),
        email: document.getElementById('alumniEmail')?.value || '',
        phone: document.getElementById('alumniPhone')?.value || '',
        currentOrg: document.getElementById('alumniOrg')?.value || '',
        currentRole: document.getElementById('alumniDomain')?.value || '',
        city: 'Delhi',
        linkedinUrl: document.getElementById('alumniLinkedin')?.value || '',
        mentorship: true
      };

      try {
        const res = await fetch('/api/alumni/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const d = await res.json();
        if (d.success) {
          if (submitBtn) {
            submitBtn.innerHTML = '✔ Registered Successfully!';
            submitBtn.style.backgroundColor = '#1b634e';
          }
          showAlumniToast('Welcome back to the Avinya Vidya Mandir Alumni Network! Your details have been recorded.');
          setTimeout(() => {
            regForm.reset();
            if (submitBtn) {
              submitBtn.innerHTML = origText;
              submitBtn.style.backgroundColor = '';
              submitBtn.disabled = false;
            }
          }, 3500);
        }
      } catch (err) {
        console.error(err);
        showAlumniToast('Network error while registering. Please try again.', false);
        if (submitBtn) {
          submitBtn.innerHTML = origText;
          submitBtn.disabled = false;
        }
      }
    });
  }
}

/* ==========================================================================
   22. INTERACTIVE ACADEMIC CALENDAR (calendar.html)
   ========================================================================== */
const ACADEMIC_EVENTS = [
    // April 2026
    { date: '2026-04-06', title: 'New Academic Session Commences', category: 'cultural', time: '8:00 AM – 1:30 PM', grades: 'All Classes (Nursery to Gr 8)', venue: 'Main Campus', description: 'Welcoming learners with traditional orientation assemblies and class teacher bonding sessions.' },
    { date: '2026-04-11', title: 'Id-ul-Fitr (Holiday)', category: 'holiday', time: 'All Day', grades: 'All School', venue: 'School Closed', description: 'School closed on account of Id-ul-Fitr.' },
    { date: '2026-04-14', title: 'Dr. B.R. Ambedkar Jayanti & Baisakhi', category: 'holiday', time: 'All Day', grades: 'All School', venue: 'School Closed', description: 'Gazetted public holiday.' },
    { date: '2026-04-22', title: 'Earth Day Campus Tree Drive', category: 'cultural', time: '9:30 AM – 12:00 PM', grades: 'Grades 3 to 8', venue: 'Organic Campus Gardens', description: 'Hands-on organic sapling plantation and waste reduction workshops.' },
    { date: '2026-04-25', title: 'New Parent Pastoral Orientation (PTM)', category: 'ptm', time: '9:00 AM – 12:30 PM', grades: 'Foundational Stage', venue: 'Auditorium', description: 'Interactive pastoral and curriculum session with Principal and class counselors.' },

    // May 2026
    { date: '2026-05-01', title: 'International Workers Day Assembly', category: 'cultural', time: '8:15 AM – 9:00 AM', grades: 'All Classes', venue: 'Central Amphitheatre', description: 'Felicitation of transport, security, and cleaning support staff.' },
    { date: '2026-05-09', title: 'Rabindranath Tagore Jayanti Literature Fest', category: 'cultural', time: '10:00 AM – 1:00 PM', grades: 'Grades 1 to 8', venue: 'Language Studios', description: 'Poetry recitals, storytelling circles, and dramatic enactments.' },
    { date: '2026-05-16', title: 'Summer Vacation Begins (thru June 30)', category: 'holiday', time: 'All Day', grades: 'All Students', venue: 'School Closed', description: 'Summer break commences. Holiday exploration projects accessible on Parent ERP.' },
    { date: '2026-05-22', title: 'Optional STEAM Bootcamp Workshop', category: 'sports', time: '9:00 AM – 12:00 PM', grades: 'Grades 4 to 8', venue: 'Robotics Labs', description: '2-week hands-on coding and maker exploration.' },

    // June 2026
    { date: '2026-06-05', title: 'World Environment Day Eco-Contest', category: 'cultural', time: 'Online', grades: 'All Grades', venue: 'Virtual Parent Portal', description: 'Home energy audit and garden photography contest.' },
    { date: '2026-06-21', title: 'International Yoga Day Campus Session', category: 'sports', time: '7:00 AM – 8:30 AM', grades: 'Students & Parents', venue: 'Sports Turf', description: 'Sunrise Pranayama and Surya Namaskar session.' },

    // July 2026
    { date: '2026-07-01', title: 'School Reopens After Summer Break', category: 'cultural', time: '8:00 AM – 2:00 PM', grades: 'All Classes', venue: 'All Wings', description: 'Full scholastic schedule resumes across all grades.' },
    { date: '2026-07-17', title: 'Muharram (Gazetted Holiday)', category: 'holiday', time: 'All Day', grades: 'All School', venue: 'School Closed', description: 'School closed.' },
    { date: '2026-07-25', title: 'Periodic Assessment 1 (PA-1) Commences', category: 'exam', time: '8:30 AM – 11:30 AM', grades: 'Grades 1 to 8', venue: 'Classrooms', description: 'First formative testing cycle in major subject areas.' },
    { date: '2026-07-31', title: 'PA-1 Assessments Conclude', category: 'exam', time: '8:30 AM – 11:30 AM', grades: 'Grades 1 to 8', venue: 'Classrooms', description: 'Last day of Periodic Assessment 1.' },

    // August 2026
    { date: '2026-08-15', title: '80th Independence Day Celebration', category: 'cultural', time: '8:00 AM – 11:00 AM', grades: 'All Classes', venue: 'School Turf', description: 'Tricolor flag hoisting, march past, and patriotic choral symphony.' },
    { date: '2026-08-22', title: 'Term-1 Parent-Teacher Conference (PTM-1)', category: 'ptm', time: '8:30 AM – 1:00 PM', grades: 'All Grades', venue: 'Classrooms', description: 'PA-1 results evaluation and personalized feedback.' },
    { date: '2026-08-26', title: 'Inter-House Parliamentary Debate', category: 'cultural', time: '10:00 AM – 1:30 PM', grades: 'Grades 6 to 8', venue: 'Auditorium', description: 'Annual debate on artificial intelligence and ethics.' },
    { date: '2026-08-28', title: 'Raksha Bandhan (School Holiday)', category: 'holiday', time: 'All Day', grades: 'All School', venue: 'School Closed', description: 'Festive holiday.' },

    // September 2026
    { date: '2026-09-04', title: 'Janmashtami Celebrations', category: 'cultural', time: '9:00 AM – 12:00 PM', grades: 'Pre-Primary & Primary', venue: 'Amphitheatre', description: 'Cultural pageant, traditional attire, and folk tableaux.' },
    { date: '2026-09-05', title: 'Teachers’ Day (Student Council Takeover)', category: 'cultural', time: '8:30 AM – 1:30 PM', grades: 'All Wings', venue: 'Campus-wide', description: 'Senior students step into educator roles to honor teachers.' },
    { date: '2026-09-08', title: 'State Vedic Math Olympiad Contest', category: 'sports', time: '10:00 AM – 12:30 PM', grades: 'Grades 4 to 8', venue: 'Math Labs', description: 'Speed arithmetic contest across North Delhi schools.' },
    { date: '2026-09-15', title: 'Half-Yearly Summative Assessments (SA-1) Begin', category: 'exam', time: '8:30 AM – 12:00 PM', grades: 'Grades 1 to 8', venue: 'Examination Halls', description: 'Comprehensive mid-term evaluation covering Term-1 curriculum.' },
    { date: '2026-09-26', title: 'Half-Yearly Summative Assessments Conclude', category: 'exam', time: '8:30 AM – 12:00 PM', grades: 'Grades 1 to 8', venue: 'Examination Halls', description: 'Final day of SA-1 written examinations.' },

    // October 2026 (CURRENT)
    { date: '2026-10-02', title: 'Mahatma Gandhi Jayanti (Holiday)', category: 'holiday', time: 'All Day', grades: 'All School', venue: 'School Closed', description: 'National holiday in honor of Mahatma Gandhi.' },
    { date: '2026-10-05', title: 'Term 2 Academic Session Begins', category: 'cultural', time: '8:00 AM – 2:00 PM', grades: 'All Classes', venue: 'Main Campus', description: 'Commencement of Term-2 scholastic and co-curricular syllabus.' },
    { date: '2026-10-08', title: 'PA-2 Datesheet Released on Parent ERP', category: 'exam', time: '3:00 PM', grades: 'Grades 1 to 8', venue: 'Online Portal', description: 'Examination timetable and syllabus blueprints published.' },
    { date: '2026-10-09', title: 'Inter-Class Science Fair & Reading Hour (TODAY)', category: 'cultural', time: '9:00 AM – 1:30 PM', grades: 'All Classes', venue: 'Central Courtyard & Labs', description: 'Live science experiments, working hydraulic models, and guest author reading hour.' },
    { date: '2026-10-17', title: 'Term-1 Report Card Distribution PTM', category: 'ptm', time: '8:30 AM – 12:30 PM', grades: 'All Classes', venue: 'Classrooms', description: 'Detailed diagnostic discussion on student progress with parents.' },
    { date: '2026-10-18', title: 'Grandparents’ Day & Heritage Showcase', category: 'cultural', time: '9:30 AM – 12:30 PM', grades: 'Foundational Stage', venue: 'Amphitheatre', description: 'Folk games, music, and tea for loving grandparents.' },
    { date: '2026-10-19', title: 'Autumn Break (Dussehra Holidays thru Oct 22)', category: 'holiday', time: 'All Day', grades: 'All School', venue: 'School Closed', description: 'School closed for Autumn and Dussehra celebrations.' },
    { date: '2026-10-24', title: 'STEM & Robotics Fest "INNOVATE 2026"', category: 'sports', time: '9:00 AM – 3:30 PM', grades: 'Inter-School Invitational', venue: 'Labs & Auditorium', description: 'Over 28 schools compete in robotics, drone navigation, and game coding.' },
    { date: '2026-10-28', title: 'Diwali & Chhath Puja Festive Break (thru Nov 03)', category: 'holiday', time: 'All Day', grades: 'All School', venue: 'School Closed', description: 'School closed for Diwali, Govardhan Puja, Bhai Dooj and Chhath.' },

    // November 2026
    { date: '2026-11-04', title: 'School Reopens After Festive Break', category: 'cultural', time: '8:00 AM – 2:00 PM', grades: 'All Classes', venue: 'Campus', description: 'Classes resume with regular timetable.' },
    { date: '2026-11-14', title: 'Children’s Day Carnival & Annual Fete', category: 'cultural', time: '8:30 AM – 1:30 PM', grades: 'Whole School', venue: 'Sports Turf', description: 'Fun game stalls, magic show, food kiosks, and teacher musical performances.' },
    { date: '2026-11-16', title: 'Periodic Assessment 2 (PA-2) Commences', category: 'exam', time: '8:30 AM – 11:30 AM', grades: 'Grades 1 to 8', venue: 'Classrooms', description: 'Term-2 diagnostic pen-and-paper assessments.' },
    { date: '2026-11-24', title: 'Guru Nanak Jayanti (Holiday)', category: 'holiday', time: 'All Day', grades: 'All School', venue: 'School Closed', description: 'Gazetted holiday.' },
    { date: '2026-11-28', title: 'Post-PA-2 Parent Teacher Meeting (PTM)', category: 'ptm', time: '8:30 AM – 12:30 PM', grades: 'All Grades', venue: 'Classrooms', description: 'Review of PA-2 performance and remediation planning.' },

    // December 2026
    { date: '2026-12-05', title: 'Annual Athletic Sports Meet 2026', category: 'sports', time: '9:00 AM – 2:30 PM', grades: 'All Houses', venue: 'Burari Sports Turf', description: 'Sprint races, relays, hurdles, shotput, and parent running events.' },
    { date: '2026-12-19', title: 'Annual Cultural Gala "Rang Tarang"', category: 'cultural', time: '4:30 PM – 8:00 PM', grades: 'All Wings', venue: 'Main Auditorium', description: 'Grand musical theatre, classical dance ensembles, and choir symphony.' },
    { date: '2026-12-25', title: 'Christmas Day Celebration & Holiday', category: 'holiday', time: 'All Day', grades: 'All School', venue: 'School Closed', description: 'Christmas celebration.' },
    { date: '2026-12-30', title: 'Winter Vacation Begins (thru Jan 10, 2027)', category: 'holiday', time: 'All Day', grades: 'All School', venue: 'School Closed', description: 'Annual winter break for students.' },

    // January 2027
    { date: '2027-01-11', title: 'School Reopens After Winter Vacation', category: 'cultural', time: '8:30 AM – 2:00 PM', grades: 'All Classes', venue: 'Campus', description: 'Winter hours active (8:30 AM opening).' },
    { date: '2027-01-14', title: 'Makar Sankranti / Pongal Celebration', category: 'cultural', time: '9:00 AM – 11:00 AM', grades: 'All Classes', venue: 'Central Courtyard', description: 'Kite flying craft workshops and seasonal harvest assemblies.' },
    { date: '2027-01-26', title: 'Republic Day Parade & NCC Drills', category: 'cultural', time: '8:00 AM – 10:30 AM', grades: 'All Classes', venue: 'Sports Ground', description: 'Patriotic salute, student brass band, and award of merit badges.' },
    { date: '2027-01-30', title: 'Grade 8 Pre-Board Evaluation & Career Clinic', category: 'exam', time: '9:00 AM – 1:00 PM', grades: 'Grade 8', venue: 'Exam Halls', description: 'Diagnostic test preparing learners for high school subject streams.' },

    // February 2027
    { date: '2027-02-06', title: 'Pre-Exam Parent-Teacher Consultation (PTM)', category: 'ptm', time: '8:30 AM – 12:30 PM', grades: 'All Grades', venue: 'Classrooms', description: 'Final strategy alignment before annual examinations.' },
    { date: '2027-02-12', title: 'Maha Shivratri (School Holiday)', category: 'holiday', time: 'All Day', grades: 'All School', venue: 'School Closed', description: 'Gazetted holiday.' },
    { date: '2027-02-20', title: 'Class 8 Farewell & Graduation Gala', category: 'cultural', time: '11:00 AM – 2:00 PM', grades: 'Grade 7 & 8', venue: 'Auditorium', description: 'Honoring our senior graduating cohort as they step into high school.' },
    { date: '2027-02-28', title: 'National Science Day & Robotics Expo', category: 'cultural', time: '9:30 AM – 1:30 PM', grades: 'Grades 3 to 8', venue: 'STEAM Hub', description: 'Celebrating Sir C.V. Raman with working science inventions.' },

    // March 2027
    { date: '2027-03-03', title: 'Annual Final Examinations 2026–27 Begin', category: 'exam', time: '8:30 AM – 12:00 PM', grades: 'Grades 1 to 8', venue: 'Exam Halls', description: 'Scholastic end-of-year assessments.' },
    { date: '2027-03-15', title: 'Annual Examinations Conclude', category: 'exam', time: '8:30 AM – 12:00 PM', grades: 'Grades 1 to 8', venue: 'Exam Halls', description: 'Final exam paper submission.' },
    { date: '2027-03-17', title: 'Holi Festive Break', category: 'holiday', time: 'All Day', grades: 'All School', venue: 'School Closed', description: 'Festival of colors holiday.' },
    { date: '2027-03-27', title: 'Annual Result Declaration & PTM', category: 'ptm', time: '8:30 AM – 1:00 PM', grades: 'All Classes', venue: 'Classrooms', description: 'Collection of cumulative annual grade report cards.' },
    { date: '2027-03-31', title: 'Academic Session 2026–27 Concludes', category: 'cultural', time: 'All Day', grades: 'Whole School', venue: 'Campus', description: 'Official transition to Academic Session 2027–28.' }
  ];

function initAcademicCalendar() {
  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  let calCurrentYear = 2026;
  let calCurrentMonth = 9; // October 2026
  let calActiveCategory = 'all';

  const grid = document.getElementById('calendarMonthGrid');
  const label = document.getElementById('calendarCurrentMonthLabel');
  const dayModal = document.getElementById('calendarDayModal');

  if (!grid || !label) return;

  function renderMonthCalendar() {
    label.textContent = MONTH_NAMES[calCurrentMonth] + ' ' + calCurrentYear;

    const btnPrev = document.getElementById('btnCalPrevMonth');
    const btnNext = document.getElementById('btnCalNextMonth');
    if (btnPrev) btnPrev.disabled = (calCurrentYear === 2026 && calCurrentMonth === 3); // Apr 2026
    if (btnNext) btnNext.disabled = (calCurrentYear === 2027 && calCurrentMonth === 2); // Mar 2027

    grid.innerHTML = '';

    const firstDayIndex = new Date(calCurrentYear, calCurrentMonth, 1).getDay();
    const daysInMonth = new Date(calCurrentYear, calCurrentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(calCurrentYear, calCurrentMonth, 0).getDate();

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const cell = document.createElement('div');
      cell.className = 'calendar-day-cell inactive';
      cell.innerHTML = '<div class="calendar-day-top"><span class="calendar-day-num">' + (prevMonthDays - i) + '</span></div>';
      grid.appendChild(cell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement('div');
      cell.className = 'calendar-day-cell';

      const monthStr = String(calCurrentMonth + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const dateKey = calCurrentYear + '-' + monthStr + '-' + dayStr;

      const isToday = (dateKey === '2026-10-09');
      if (isToday) cell.classList.add('today');

      const dayEvents = ACADEMIC_EVENTS.filter(e => {
        if (e.date !== dateKey) return false;
        if (calActiveCategory === 'all') return true;
        return e.category === calActiveCategory;
      });

      let eventsHtml = '';
      dayEvents.forEach(ev => {
        eventsHtml += '<div class="event-pill ' + ev.category + '" title="' + ev.title + '">' +
          '<span class="cal-legend-dot dot-' + ev.category + '"></span>' +
          '<span class="event-pill-text">' + ev.title + '</span>' +
        '</div>';
      });

      cell.innerHTML = '<div class="calendar-day-top">' +
        '<span class="calendar-day-num">' + day + '</span>' +
        (isToday ? '<span class="calendar-today-pill">TODAY</span>' : '') +
      '</div>' +
      '<div class="calendar-day-events">' + eventsHtml + '</div>';

      cell.addEventListener('click', () => {
        openCalendarDayModal(dateKey, day, MONTH_NAMES[calCurrentMonth], calCurrentYear);
      });

      grid.appendChild(cell);
    }

    const totalRendered = firstDayIndex + daysInMonth;
    const remaining = (7 - (totalRendered % 7)) % 7;
    for (let j = 1; j <= remaining; j++) {
      const cell = document.createElement('div');
      cell.className = 'calendar-day-cell inactive';
      cell.innerHTML = '<div class="calendar-day-top"><span class="calendar-day-num">' + j + '</span></div>';
      grid.appendChild(cell);
    }
  }

  function openCalendarDayModal(dateKey, day, monthName, year) {
    if (!dayModal) return;
    const modalTitle = document.getElementById('modalDayDateTitle');
    const modalList = document.getElementById('modalDayEventsList');
    if (modalTitle) modalTitle.textContent = monthName + ' ' + day + ', ' + year;

    const dayEvents = ACADEMIC_EVENTS.filter(e => e.date === dateKey);

    if (modalList) {
      if (dayEvents.length === 0) {
        modalList.innerHTML = '<div style="text-align: center; padding: 30px; color: var(--text-muted);">' +
          '<div style="font-size: 2.2rem; margin-bottom: 8px;">📖</div>' +
          '<p>Regular Academic Timetable in session. No special examinations or scheduled holidays on this date.</p>' +
        '</div>';
      } else {
        modalList.innerHTML = dayEvents.map(ev => {
          const colorVar = ev.category === 'exam' ? 'blue' : (ev.category === 'holiday' ? 'magenta' : 'gold');
          return '<div class="day-modal-event-item" style="border-left: 4px solid var(--' + colorVar + '); padding: 12px 16px; margin-bottom: 12px; background: #fafbfc; border-radius: 6px;">' +
            '<div style="font-weight: 700; font-size: 1.05rem; color: var(--navy-900); margin-bottom: 4px;">' + ev.title + '</div>' +
            '<div style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 6px;">' +
              '⏰ ' + (ev.time || 'School Hours') + ' &bull; 🎓 ' + (ev.grades || 'All Classes') + ' &bull; 📍 ' + (ev.venue || 'Campus') +
            '</div>' +
            '<p style="font-size: 0.92rem; color: var(--text-main); margin: 0;">' + (ev.description || '') + '</p>' +
          '</div>';
        }).join('');
      }
    }

    dayModal.classList.add('open');
    dayModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCalendarDayModal() {
    if (!dayModal) return;
    dayModal.classList.remove('open');
    dayModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function downloadIcsCalendar() {
    let icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Avinya Vidya Mandir//Academic Calendar 2026-2027//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:Avinya Vidya Mandir Academic Calendar 2026-27',
      'X-WR-TIMEZONE:Asia/Kolkata'
    ];

    ACADEMIC_EVENTS.forEach((e, idx) => {
      const cleanDate = e.date.replace(/-/g, '');
      icsData.push(
        'BEGIN:VEVENT',
        'UID:avinya-event-' + idx + '-' + cleanDate + '@avinyaschool.com',
        'DTSTAMP:' + cleanDate + 'T090000Z',
        'DTSTART;VALUE=DATE:' + cleanDate,
        'SUMMARY:' + e.title + ' - Avinya Vidya Mandir',
        'DESCRIPTION:' + (e.description || '').replace(/,/g, '\,') + ' (' + (e.grades || 'All') + ')',
        'LOCATION:' + (e.venue || 'Burari Campus'),
        'STATUS:CONFIRMED',
        'END:VEVENT'
      );
    });

    icsData.push('END:VCALENDAR');
    const blob = new Blob([icsData.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'avinya-vidya-mandir-calendar-2026-27.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Academic Calendar downloaded (.ics file ready for Google & Apple Calendar)!');
  }

  const btnPrev = document.getElementById('btnCalPrevMonth');
  const btnNext = document.getElementById('btnCalNextMonth');
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (calCurrentMonth === 0) {
        calCurrentMonth = 11;
        calCurrentYear--;
      } else {
        calCurrentMonth--;
      }
      renderMonthCalendar();
    });
  }
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (calCurrentMonth === 11) {
        calCurrentMonth = 0;
        calCurrentYear++;
      } else {
        calCurrentMonth++;
      }
      renderMonthCalendar();
    });
  }

  document.querySelectorAll('.cal-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cal-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      calActiveCategory = btn.getAttribute('data-cal-category') || 'all';
      renderMonthCalendar();
    });
  });

  document.querySelectorAll('.close-day-modal, .modal-close').forEach(b => {
    b.addEventListener('click', closeCalendarDayModal);
  });
  if (dayModal) {
    dayModal.addEventListener('click', (e) => {
      if (e.target === dayModal) closeCalendarDayModal();
    });
  }

  document.querySelectorAll('.btn-sync-ical').forEach(b => b.addEventListener('click', downloadIcsCalendar));
  const printBtn = document.getElementById('btnPrintCalendar');
  if (printBtn) printBtn.addEventListener('click', () => window.print());

  renderMonthCalendar();
}

/* ==========================================================================
   23. PARENT CORNER & PORTAL (parents.html)
   ========================================================================== */
function initParentsPortal() {
  const erpModal = document.getElementById('erpModal');
  const openErpBtns = document.querySelectorAll('.open-erp-modal');
  const erpLoginForm = document.getElementById('erpLoginForm');
  const erpTabBtns = document.querySelectorAll('.erp-tab-btn');
  const erpPanels = document.querySelectorAll('.erp-tab-panel');

  openErpBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (erpModal) {
        erpModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  erpTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode');
      erpTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      erpPanels.forEach(panel => {
        panel.style.display = (panel.id === 'erpPanel-' + mode) ? 'block' : 'none';
      });
    });
  });

  if (erpLoginForm) {
    erpLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = erpLoginForm.querySelector('button[type="submit"]');
      const origText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.innerHTML = 'Connecting to Secure Server...';
        submitBtn.disabled = true;
      }
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.innerHTML = '✔ Authenticated!';
          submitBtn.style.backgroundColor = '#1b634e';
        }
        showToast('Secure Session Initialized! Redirecting to Parent Dashboard...');
        setTimeout(() => {
          erpLoginForm.reset();
          if (submitBtn) {
            submitBtn.innerHTML = origText;
            submitBtn.style.backgroundColor = '';
            submitBtn.disabled = false;
          }
          if (erpModal) erpModal.classList.remove('active');
          document.body.style.overflow = '';
        }, 1800);
      }, 1200);
    });
  }

  document.querySelectorAll('.btn-download-doc').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const docName = btn.getAttribute('data-doc-title') || btn.getAttribute('data-doc') || 'Document';
      showToast('Downloading: ' + docName + ' (Official PDF)');
    });
  });
}

/* ==========================================================================
   24. ACCESSIBILITY TOOLBAR (WCAG AAA)
   ========================================================================== */
function initAccessibilityToolbar() {
  const triggerBtn = document.getElementById('a11yTriggerBtn');
  const panel = document.getElementById('a11yPanel');
  const closeBtn = document.getElementById('a11yCloseBtn');
  const fontBtns = document.querySelectorAll('.a11y-font-btn');
  const contrastBtns = document.querySelectorAll('.a11y-contrast-btn');
  const dyslexiaSwitch = document.getElementById('a11yDyslexiaSwitch');
  const linksSwitch = document.getElementById('a11yLinksSwitch');
  const resetBtn = document.getElementById('a11yResetBtn');

  if (!triggerBtn || !panel) return;

  triggerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = panel.classList.toggle('open');
    triggerBtn.setAttribute('aria-expanded', isOpen);
    panel.setAttribute('aria-hidden', !isOpen);
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      panel.classList.remove('open');
      triggerBtn.setAttribute('aria-expanded', 'false');
      panel.setAttribute('aria-hidden', 'true');
    });
  }

  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && e.target !== triggerBtn) {
      panel.classList.remove('open');
      triggerBtn.setAttribute('aria-expanded', 'false');
      panel.setAttribute('aria-hidden', 'true');
    }
  });

  fontBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      fontBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const scale = btn.getAttribute('data-scale');
      document.body.classList.remove('font-scale-sm', 'font-scale-lg', 'font-scale-xl');
      if (scale !== 'base') {
        document.body.classList.add('font-scale-' + scale);
      }
    });
  });

  contrastBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      contrastBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-contrast');
      document.body.classList.remove('high-contrast', 'monochrome');
      if (mode === 'high') document.body.classList.add('high-contrast');
      if (mode === 'mono') document.body.classList.add('monochrome');
    });
  });

  if (dyslexiaSwitch) {
    dyslexiaSwitch.addEventListener('click', () => {
      const active = dyslexiaSwitch.classList.toggle('active');
      document.body.classList.toggle('dyslexia-font', active);
    });
  }

  if (linksSwitch) {
    linksSwitch.addEventListener('click', () => {
      const active = linksSwitch.classList.toggle('active');
      document.body.classList.toggle('highlight-links', active);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.body.classList.remove('font-scale-sm', 'font-scale-lg', 'font-scale-xl', 'high-contrast', 'monochrome', 'dyslexia-font', 'highlight-links');
      fontBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-scale') === 'base'));
      contrastBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-contrast') === 'default'));
      if (dyslexiaSwitch) dyslexiaSwitch.classList.remove('active');
      if (linksSwitch) linksSwitch.classList.remove('active');
      showToast('Accessibility settings reset to default');
    });
  }
}

/* ==========================================================================
   25. FLOATING QUICK WHATSAPP CONNECT
   ========================================================================== */
function initFloatingWhatsApp() {
  if (document.querySelector('.floating-quick-connect')) return;

  const aside = document.createElement('aside');
  aside.className = 'floating-quick-connect';
  aside.setAttribute('aria-label', 'Admissions WhatsApp Support');
  aside.innerHTML = `
    <a href="https://wa.me/919911102005?text=Hello%20Avinya%20Vidya%20Mandir%2C%20I%20would%20like%20to%20enquire%20about%20admissions%20for%20my%20child." 
       target="_blank" 
       rel="noopener noreferrer" 
       class="quick-whatsapp-btn" 
       aria-label="Chat with Admissions on WhatsApp">
      <svg class="wa-svg-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7.02 8.48 7.02 9.68C7.02 10.88 7.9 12.03 8.02 12.19C8.14 12.35 9.74 14.82 12.19 15.88C14.23 16.76 14.65 16.58 15.1 16.54C15.54 16.5 16.52 15.96 16.72 15.39C16.93 14.81 16.93 14.32 16.87 14.22C16.81 14.12 16.65 14.06 16.4 13.94C16.16 13.82 14.96 13.23 14.73 13.15C14.51 13.07 14.35 13.03 14.19 13.27C14.02 13.51 13.56 14.06 13.41 14.22C13.27 14.39 13.13 14.41 12.88 14.29C12.64 14.17 11.86 13.91 10.94 13.09C10.22 12.45 9.73 11.66 9.59 11.41C9.45 11.17 9.57 11.04 9.7 10.92C9.81 10.81 9.94 10.64 10.07 10.49C10.19 10.33 10.23 10.21 10.31 10.05C10.39 9.88 10.35 9.74 10.29 9.62C10.23 9.5 9.74 8.31 9.54 7.82C9.35 7.34 9.15 7.4 9 7.39C8.86 7.39 8.7 7.39 8.53 7.33Z"/>
      </svg>
      <span class="wa-text"><span class="wa-text-full">Chat on </span>WhatsApp</span>
    </a>
  `;
  document.body.appendChild(aside);
}

