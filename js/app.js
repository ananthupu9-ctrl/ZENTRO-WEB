/**
 * ZENTRO — HAUTE ATELIER & UNISEX FAMILY SALON (KAVANUR, MALAPPURAM)
 * Senior Architectural Script Suite
 * - Modular Atelier Finder (Fuzzy Search & Category Filtering)
 * - Zero-Advance WhatsApp Concierge Dispatch (+91 9074 616121)
 * - Accessible Modal & Drawer State Management (ARIA, Focus, Keyboard Escape)
 * - Inertia Sliding Gallery with Limits & Drag Guard
 * - Intelligent Typography Auto-Fit
 */

document.addEventListener('DOMContentLoaded', () => {

  const ZENTRO_WHATSAPP = '919074616121';

  /* ==========================================================================
     ATELIER SERVICES REPOSITORY (MASTER CATALOG)
     ========================================================================== */
  const SALON_SERVICES = [
    {
      id: '01',
      title: 'Bridal & Groom Makeup',
      category: 'bridal',
      categoryLabel: 'Wedding Atelier',
      description: 'Bespoke bridal makeup, hair styling, pre-wedding trials & groom grooming.',
      keywords: 'bridal wedding groom makeup couture suite trial styling reception'
    },
    {
      id: '02',
      title: 'Haircuts & Hair Styling',
      category: 'hair',
      categoryLabel: 'Hair Architecture',
      description: 'Precision haircuts, blowouts, fades, layers & bespoke styling for men and women.',
      keywords: 'hair haircut styling blowout fade beard trimming layers bob men women'
    },
    {
      id: '03',
      title: 'Hair Treatments',
      category: 'hair',
      categoryLabel: 'Hair Therapy',
      description: 'Keratin, smoothing, deep conditioning, scalp therapy & restorative hair rituals.',
      keywords: 'hair treatments keratin smoothing botox protein repair spa scalp shine'
    },
    {
      id: '04',
      title: 'Hair Colouring',
      category: 'color',
      categoryLabel: 'Color Studio',
      description: 'Global colour, French balayage, highlights, root touch-up & dimensional gloss.',
      keywords: 'hair colouring coloring color balayage highlights glaze blonde brunette root'
    },
    {
      id: '05',
      title: 'Advanced Skin Treatments',
      category: 'skin',
      categoryLabel: 'Clinical Derma',
      description: 'Clinical skin rejuvenation, brightening rituals, peels & customized dermal care.',
      keywords: 'advanced skin treatments derma clinical peel brightening glow facial glass skin'
    },
    {
      id: '06',
      title: 'Hydra Facial',
      category: 'skin',
      categoryLabel: 'Hydra Infusion',
      description: 'Deep vortex cleansing, gentle exfoliation, extraction & intensive hydration glow.',
      keywords: 'hydra facial hydrafacial skin hydration glow cleanup extraction derma'
    }
  ];

  /* ==========================================================================
     1. RESERVATION BOOKING CONCIERGE & WHATSAPP DISPATCH
     ========================================================================== */
  const bookingModal = document.getElementById('bookingModal');
  const bookingForm = document.getElementById('bookingFinalForm');
  const confirmedScreen = document.getElementById('bookingConfirmedScreen');
  const guestNameInput = document.getElementById('guestFullName');
  const guestPhoneInput = document.getElementById('guestPhone');
  const bookingDateInput = document.getElementById('modalBookingDate');
  const serviceSelect = document.getElementById('modalServiceSelect');
  const timeSlotSelect = document.getElementById('modalTimeSlotSelect');

  const guestPlaceholder = document.getElementById('confirmedGuestPlaceholder');
  const timePlaceholder = document.getElementById('confirmedTimePlaceholder');
  const paymentPlaceholder = document.getElementById('confirmedPaymentPlaceholder');
  const whatsappConfirmBtn = document.getElementById('confirmedWhatsAppBtn');

  // Prevent past dates in booking date picker
  if (bookingDateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const minDateStr = `${yyyy}-${mm}-${dd}`;
    bookingDateInput.min = minDateStr;
    if (!bookingDateInput.value || bookingDateInput.value < minDateStr) {
      bookingDateInput.value = minDateStr;
    }
  }

  // Payment radio cards interaction (Cash vs UPI)
  const paymentCards = document.querySelectorAll('.payment-method-card');
  paymentCards.forEach(card => {
    card.addEventListener('click', () => {
      paymentCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  function openBooking(preselectedService = null) {
    closeSearch();
    closeMobileDrawer();

    if (preselectedService && serviceSelect) {
      for (let i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].text.toLowerCase().includes(preselectedService.toLowerCase())) {
          serviceSelect.selectedIndex = i;
          break;
        }
      }
    }
    bookingForm?.classList.remove('hidden');
    confirmedScreen?.classList.add('hidden');
    bookingModal?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Focus guest name on open
    setTimeout(() => {
      guestNameInput?.focus();
    }, 80);
  }

  function closeBooking() {
    bookingModal?.classList.add('hidden');
    document.body.style.overflow = '';
  }

  // Open booking buttons across website
  document.querySelectorAll('[data-open-booking]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Ignore click if user clicked any video sound toggle button
      if (e.target.closest('[data-sound-toggle]') || e.target.closest('.gallery-video-sound-btn')) {
        return;
      }
      e.preventDefault();
      const s = btn.getAttribute('data-service');
      openBooking(s);
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', closeBooking);
  });

  bookingModal?.addEventListener('click', (e) => {
    if (e.target === bookingModal) closeBooking();
  });

  // Direct WhatsApp Reservation Form Submission
  bookingForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = guestNameInput ? guestNameInput.value.trim() : 'Valued Guest';
    const rawPhone = guestPhoneInput ? guestPhoneInput.value.trim() : '';
    const phoneDigits = rawPhone.replace(/\D/g, '');

    // Validate phone number length (at least 10 digits for Indian mobile numbers)
    if (phoneDigits.length < 10) {
      guestPhoneInput.style.borderColor = '#C53030';
      guestPhoneInput.focus();
      return;
    }
    guestPhoneInput.style.borderColor = '';

    const phone = rawPhone || '+91 9074 616121';
    const selectedService = serviceSelect ? serviceSelect.value : 'Salon Discipline';
    const selectedDate = bookingDateInput ? bookingDateInput.value : '';
    const selectedTime = timeSlotSelect ? timeSlotSelect.value : '02:00 PM (IST)';

    // Selected payment mode (Cash or UPI)
    const selectedPayRadio = document.querySelector('input[name="paymentPreference"]:checked');
    const paymentMode = selectedPayRadio ? selectedPayRadio.value : 'Cash at Reception';

    // Update confirmation screen placeholders
    if (guestPlaceholder) guestPlaceholder.textContent = name || 'Valued Guest';
    if (timePlaceholder) timePlaceholder.textContent = `${selectedDate ? selectedDate + ' • ' : ''}${selectedTime}`;
    if (paymentPlaceholder) {
      paymentPlaceholder.textContent = paymentMode.includes('UPI')
        ? '📱 UPI (GPay / PhonePe / Paytm)'
        : '💵 Cash at Reception';
    }

    // Professional WhatsApp Message Payload
    const msgText = `*ZENTRO UNISEX SALON — APPOINTMENT RESERVATION*
━━━━━━━━━━━━━━━━━━━━━━
👤 *Guest Name:* ${name}
📞 *Mobile / WhatsApp:* ${phone}
💇 *Service / Ritual:* ${selectedService}
📅 *Preferred Date:* ${selectedDate || 'Upcoming Slot'}
⏰ *Preferred Time:* ${selectedTime}
💵 *Payment Mode:* ${paymentMode} (Zero Advance)
📍 *Location:* Kavanur, Malappuram (https://maps.google.com/?q=11.194972,76.064611)
━━━━━━━━━━━━━━━━━━━━━━
_Please confirm my reservation slot at Zentro Kavanur. Thank you!_`;

    const waUrl = `https://wa.me/${ZENTRO_WHATSAPP}?text=${encodeURIComponent(msgText)}`;

    if (whatsappConfirmBtn) {
      whatsappConfirmBtn.href = waUrl;
    }

    // Direct WhatsApp Dispatch
    try {
      const win = window.open(waUrl, '_blank');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        window.location.href = waUrl;
      }
    } catch (err) {
      window.location.href = waUrl;
    }

    bookingForm.classList.add('hidden');
    confirmedScreen?.classList.remove('hidden');
  });

  /* ==========================================================================
     2. QUICK ATELIER FINDER / SEARCH OVERLAY
     ========================================================================== */
  const searchModal = document.getElementById('searchModal');
  const closeSearchBtn = document.getElementById('closeSearchBtn');
  const salonSearchInput = document.getElementById('salonSearchInput');
  const searchResultCount = document.getElementById('searchResultCount');
  const searchResultsContainer = document.getElementById('searchResultsContainer');
  const quickFilterTags = document.querySelectorAll('.quick-tag');

  let activeCategoryFilter = 'all';

  function renderSearchResults(query = '', category = 'all') {
    if (!searchResultsContainer) return;
    const cleanQ = query.trim().toLowerCase();

    const matches = SALON_SERVICES.filter(item => {
      const matchCategory = (category === 'all' || item.category === category);
      const matchQuery = cleanQ === '' ||
        item.title.toLowerCase().includes(cleanQ) ||
        item.description.toLowerCase().includes(cleanQ) ||
        item.keywords.toLowerCase().includes(cleanQ) ||
        item.categoryLabel.toLowerCase().includes(cleanQ);
      return matchCategory && matchQuery;
    });

    if (searchResultCount) {
      searchResultCount.textContent = `${matches.length} ${matches.length === 1 ? 'Ritual' : 'Disciplines'}`;
    }

    if (matches.length === 0) {
      searchResultsContainer.innerHTML = `
        <div style="text-align: center; padding: 2.5rem 1rem; color: var(--color-muted);">
          <p style="font-size: 0.9375rem; font-weight: 600; margin-bottom: 0.25rem;">No direct matching rituals found for "${query}"</p>
          <p style="font-size: 0.75rem;">Try searching "hair", "facial", "fade", "keratin", or click Reserve below.</p>
          <button class="search-result-btn" style="margin-top: 1rem; padding: 0.65rem 1.5rem;" onclick="document.dispatchEvent(new CustomEvent('openCustomBooking'))">
            CUSTOM APPOINTMENT →
          </button>
        </div>
      `;
      return;
    }

    searchResultsContainer.innerHTML = matches.map(s => `
      <div class="search-result-item" data-service-title="${s.title}">
        <div class="search-result-info">
          <span class="search-result-cat">${s.categoryLabel}</span>
          <span class="search-result-title">${s.title}</span>
        </div>
        <div class="search-result-meta">
          <button type="button" class="search-result-btn" data-book-service="${s.title}">
            RESERVE →
          </button>
        </div>
      </div>
    `).join('');

    // Attach click events on rendered search cards
    searchResultsContainer.querySelectorAll('[data-book-service], .search-result-item').forEach(el => {
      el.addEventListener('click', (e) => {
        const item = el.closest('.search-result-item');
        const sName = item ? item.getAttribute('data-service-title') : '';
        closeSearch();
        openBooking(sName);
      });
    });
  }

  function openSearch() {
    closeBooking();
    closeMobileDrawer();
    searchModal?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    renderSearchResults(salonSearchInput?.value || '', activeCategoryFilter);
    setTimeout(() => {
      salonSearchInput?.focus();
    }, 80);
  }

  function closeSearch() {
    searchModal?.classList.add('hidden');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-open-search]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openSearch();
    });
  });

  closeSearchBtn?.addEventListener('click', closeSearch);

  searchModal?.addEventListener('click', (e) => {
    if (e.target === searchModal) closeSearch();
  });

  salonSearchInput?.addEventListener('input', (e) => {
    renderSearchResults(e.target.value, activeCategoryFilter);
  });

  quickFilterTags.forEach(tag => {
    tag.addEventListener('click', () => {
      quickFilterTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      activeCategoryFilter = tag.getAttribute('data-filter') || 'all';
      renderSearchResults(salonSearchInput?.value || '', activeCategoryFilter);
    });
  });

  document.addEventListener('openCustomBooking', () => {
    closeSearch();
    openBooking();
  });

  /* ==========================================================================
     3. MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openMobileDrawer() {
    closeBooking();
    closeSearch();
    mobileDrawer?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    mobileDrawer?.classList.add('hidden');
    document.body.style.overflow = '';
  }

  mobileMenuBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    openMobileDrawer();
  });

  closeDrawerBtn?.addEventListener('click', closeMobileDrawer);

  mobileDrawer?.addEventListener('click', (e) => {
    if (e.target === mobileDrawer) closeMobileDrawer();
  });

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeMobileDrawer);
  });

  /* ==========================================================================
     4. GLOBAL KEYBOARD ACCESSIBILITY (ESCAPE KEY & SHORTCUTS)
     ========================================================================== */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeBooking();
      closeSearch();
      closeMobileDrawer();
    }
    // Keyboard shortcut '/' opens search when not in a text field
    if (e.key === '/' && !['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      openSearch();
    }
  });

  /* ==========================================================================
     5. ATELIER SLIDING GALLERY
     ========================================================================== */
  const galleryTrack = document.getElementById('galleryTrack');
  const galleryPrevBtn = document.getElementById('galleryPrevBtn');
  const galleryNextBtn = document.getElementById('galleryNextBtn');
  const galleryCounter = document.getElementById('galleryCounter');
  const galleryProgressBar = document.getElementById('galleryProgressBar');

  if (galleryTrack) {
    const cards = galleryTrack.querySelectorAll('.gallery-slide-card');
    const totalSlides = cards.length;

    function getCardScrollAmount() {
      const card = galleryTrack.querySelector('.gallery-slide-card');
      return card ? card.offsetWidth + 24 : 360;
    }

    function updateGalleryState() {
      const scrollLeft = galleryTrack.scrollLeft;
      const maxScroll = galleryTrack.scrollWidth - galleryTrack.clientWidth;
      const cardWidth = getCardScrollAmount();
      
      const currentIndex = Math.min(
        totalSlides,
        Math.max(1, Math.round(scrollLeft / cardWidth) + 1)
      );

      if (galleryCounter) {
        galleryCounter.textContent = `0${currentIndex} / 0${totalSlides}`;
      }

      if (galleryProgressBar && maxScroll > 0) {
        const progress = Math.min(100, Math.max(16.66, ((scrollLeft / maxScroll) * 83.34) + 16.66));
        galleryProgressBar.style.width = `${progress}%`;
      }

      // Visual arrow button limits
      if (galleryPrevBtn) {
        const atStart = scrollLeft <= 8;
        galleryPrevBtn.disabled = atStart;
        galleryPrevBtn.setAttribute('aria-disabled', String(atStart));
        galleryPrevBtn.style.opacity = atStart ? '0.35' : '1';
        galleryPrevBtn.style.cursor = atStart ? 'not-allowed' : 'pointer';
      }
      if (galleryNextBtn) {
        const atEnd = scrollLeft >= maxScroll - 8;
        galleryNextBtn.disabled = atEnd;
        galleryNextBtn.setAttribute('aria-disabled', String(atEnd));
        galleryNextBtn.style.opacity = atEnd ? '0.35' : '1';
        galleryNextBtn.style.cursor = atEnd ? 'not-allowed' : 'pointer';
      }
    }

    galleryPrevBtn?.addEventListener('click', () => {
      galleryTrack.scrollBy({ left: -getCardScrollAmount(), behavior: 'smooth' });
    });

    galleryNextBtn?.addEventListener('click', () => {
      galleryTrack.scrollBy({ left: getCardScrollAmount(), behavior: 'smooth' });
    });

    galleryTrack.addEventListener('scroll', updateGalleryState, { passive: true });

    // Drag to scroll for desktop mouse users with drag threshold guard
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    let hasDragged = false;

    galleryTrack.addEventListener('mousedown', (e) => {
      isDown = true;
      hasDragged = false;
      startX = e.pageX - galleryTrack.offsetLeft;
      scrollStart = galleryTrack.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
      isDown = false;
    });

    galleryTrack.addEventListener('mouseleave', () => {
      isDown = false;
    });

    galleryTrack.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - galleryTrack.offsetLeft;
      const walk = (x - startX) * 1.5;
      if (Math.abs(walk) > 8) hasDragged = true;
      galleryTrack.scrollLeft = scrollStart - walk;
    });

    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        // If user clicked any sound button, do not interfere in capture phase!
        if (e.target.closest('[data-sound-toggle]') || e.target.closest('.gallery-video-sound-btn')) {
          return;
        }
        if (hasDragged) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      }, true);
    });

    // Keyboard arrow keys when track is active
    galleryTrack.setAttribute('tabindex', '0');
    galleryTrack.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        galleryTrack.scrollBy({ left: -getCardScrollAmount(), behavior: 'smooth' });
      } else if (e.key === 'ArrowRight') {
        galleryTrack.scrollBy({ left: getCardScrollAmount(), behavior: 'smooth' });
      }
    });

    updateGalleryState();
  }

  /* ==========================================================================
     5b. GALLERY EDITORIAL VIDEOS & UNIFIED SOUND CONTROLLER
     ========================================================================== */
  const galleryVideos = document.querySelectorAll('.gallery-slide-video');
  const soundToggleBtns = document.querySelectorAll('[data-sound-toggle]');

  // Guarantee cross-browser autoplay for all 6 gallery videos
  galleryVideos.forEach(vid => {
    vid.muted = true;
    vid.defaultMuted = true;
    const playPromise = vid.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        vid.muted = true;
        vid.play().catch(() => {});
      });
    }
  });

  function updateSoundButtonUI(btn, isUnmuted) {
    if (!btn) return;
    const icon = btn.querySelector('.audio-icon');
    const label = btn.querySelector('.audio-label');
    if (isUnmuted) {
      btn.classList.add('is-unmuted');
      btn.setAttribute('aria-label', 'Sound is On. Click to Mute.');
      btn.setAttribute('title', 'Sound is On. Click to Mute.');
      if (icon) icon.textContent = '🔊';
      if (label) label.textContent = 'SOUND ON';
    } else {
      btn.classList.remove('is-unmuted');
      btn.setAttribute('aria-label', 'Sound is Muted. Click to Unmute.');
      btn.setAttribute('title', 'Sound is Muted. Click to Unmute.');
      if (icon) icon.textContent = '🔇';
      if (label) label.textContent = 'SOUND OFF';
    }
  }

  function muteAllGalleryVideosExcept(activeVideo = null) {
    galleryVideos.forEach(vid => {
      if (vid !== activeVideo) {
        vid.muted = true;
        vid.setAttribute('muted', '');
        const card = vid.closest('.gallery-slide-card');
        const btn = card ? card.querySelector('[data-sound-toggle]') : null;
        updateSoundButtonUI(btn, false);
      }
    });
  }

  soundToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent card from opening reservation modal

      const card = btn.closest('.gallery-slide-card');
      const video = card ? card.querySelector('video') : null;
      if (!video) return;

      const willUnmute = video.muted;

      if (willUnmute) {
        // 1. Mute all other 5 videos first so sounds don't overlap
        muteAllGalleryVideosExcept(video);

        // 2. Unmute target video with full browser compatibility
        video.muted = false;
        video.defaultMuted = false;
        video.removeAttribute('muted');
        video.volume = 1.0;

        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.warn('Playback error on unmute:', err);
          });
        }
        updateSoundButtonUI(btn, true);
      } else {
        // Mute target video
        video.muted = true;
        video.setAttribute('muted', '');
        updateSoundButtonUI(btn, false);
      }
    });
  });

  /* ==========================================================================
     6. INTELLIGENT RESPONSIVE WORDMARK AUTO-FIT
     ========================================================================== */
  const wordmark = document.querySelector('.hero-giant-wordmark');
  let resizeTimer;

  function fitWordmark() {
    if (!wordmark) return;
    const parent = wordmark.parentElement;
    if (!parent) return;

    // Reset to let CSS clamp evaluate naturally first
    wordmark.style.fontSize = '';

    requestAnimationFrame(() => {
      const paddingReduction = window.innerWidth <= 768 ? 16 : 40;
      const maxAvailableWidth = parent.clientWidth - paddingReduction;
      const naturalWidth = wordmark.scrollWidth;

      if (naturalWidth > maxAvailableWidth && maxAvailableWidth > 0) {
        const currentSize = parseFloat(window.getComputedStyle(wordmark).fontSize);
        const scale = maxAvailableWidth / naturalWidth;
        const minFloor = window.innerWidth <= 768 ? 32 : 60;
        const calculated = Math.max(minFloor, Math.floor(currentSize * scale * 0.98));
        wordmark.style.fontSize = `${calculated}px`;
      }
    });
  }

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fitWordmark, 60);
  });

  window.addEventListener('orientationchange', () => {
    setTimeout(fitWordmark, 100);
  });

  if (document.fonts) {
    document.fonts.ready.then(fitWordmark);
  }
  setTimeout(fitWordmark, 120);

  /* ==========================================================================
     7. NOIR GUEST ARCHIVES COMPACT SLIDING CAROUSEL
     ========================================================================== */
  const reviewsTrack = document.getElementById('reviewsSliderTrack');
  const reviewsPrevBtn = document.getElementById('reviewsPrevBtn');
  const reviewsNextBtn = document.getElementById('reviewsNextBtn');
  const reviewsCounter = document.getElementById('reviewsCounter');
  const reviewsProgressBar = document.getElementById('reviewsProgressBar');

  if (reviewsTrack) {
    const reviewCards = reviewsTrack.querySelectorAll('.noir-review-card-compact');
    const totalReviews = reviewCards.length || 6;

    function getScrollStep() {
      const firstCard = reviewCards[0];
      if (!firstCard) return 360;
      // Get actual rendered card width + flex gap (20px)
      return firstCard.offsetWidth + 20;
    }

    function updateReviewsSliderState() {
      const scrollLeft = reviewsTrack.scrollLeft;
      const maxScroll = reviewsTrack.scrollWidth - reviewsTrack.clientWidth;
      const step = getScrollStep();

      let activeIndex = Math.round(scrollLeft / step) + 1;
      if (activeIndex < 1) activeIndex = 1;
      if (activeIndex > totalReviews) activeIndex = totalReviews;

      if (maxScroll > 0 && scrollLeft >= maxScroll - 15) {
        activeIndex = totalReviews;
      }

      if (reviewsCounter) {
        const curFormatted = String(activeIndex).padStart(2, '0');
        const totFormatted = String(totalReviews).padStart(2, '0');
        reviewsCounter.textContent = `${curFormatted} / ${totFormatted}`;
      }

      if (reviewsProgressBar) {
        const minPercent = 100 / totalReviews;
        const progress = maxScroll > 0
          ? Math.min(100, Math.max(minPercent, (scrollLeft / maxScroll) * (100 - minPercent) + minPercent))
          : (activeIndex / totalReviews) * 100;
        reviewsProgressBar.style.width = `${progress}%`;
      }

      if (reviewsPrevBtn) {
        reviewsPrevBtn.disabled = scrollLeft <= 4;
      }
      if (reviewsNextBtn) {
        reviewsNextBtn.disabled = maxScroll > 0 && scrollLeft >= maxScroll - 4;
      }
    }

    // Prev / Next Button Controls
    if (reviewsNextBtn) {
      reviewsNextBtn.addEventListener('click', () => {
        const step = getScrollStep();
        reviewsTrack.scrollBy({ left: step, behavior: 'smooth' });
      });
    }

    if (reviewsPrevBtn) {
      reviewsPrevBtn.addEventListener('click', () => {
        const step = getScrollStep();
        reviewsTrack.scrollBy({ left: -step, behavior: 'smooth' });
      });
    }

    // Scroll Listener
    let scrollTicking = false;
    reviewsTrack.addEventListener('scroll', () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          updateReviewsSliderState();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });

    // Desktop Mouse Drag to Scroll
    let isDraggingReviews = false;
    let dragStartX = 0;
    let initialScroll = 0;

    reviewsTrack.addEventListener('mousedown', (e) => {
      if (e.target.closest('button, a')) return;
      isDraggingReviews = true;
      dragStartX = e.pageX;
      initialScroll = reviewsTrack.scrollLeft;
      reviewsTrack.classList.add('is-dragging');
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDraggingReviews) return;
      e.preventDefault();
      const deltaX = e.pageX - dragStartX;
      reviewsTrack.scrollLeft = initialScroll - deltaX;
    });

    const stopDragging = () => {
      if (!isDraggingReviews) return;
      isDraggingReviews = false;
      reviewsTrack.classList.remove('is-dragging');
    };

    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('mouseleave', stopDragging);

    // Initial state on load and resize
    updateReviewsSliderState();
    window.addEventListener('resize', () => {
      updateReviewsSliderState();
    }, { passive: true });
  }

  /* ==========================================================================
     8. ATELIER VISIT MOBILE TAB SWITCHER & SWIPE SYNC
     ========================================================================== */
  const atelierTabsWrap = document.getElementById('atelierMobileTabs');
  const atelierGrid = document.getElementById('atelierDetailsGrid');

  if (atelierTabsWrap && atelierGrid) {
    const tabBtns = Array.from(atelierTabsWrap.querySelectorAll('[data-atelier-tab]'));
    const atelierCards = Array.from(atelierGrid.querySelectorAll('.atelier-card'));

    const setActiveAtelierTab = (idx) => {
      tabBtns.forEach((btn, i) => {
        const isActive = i === idx;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    };

    tabBtns.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        const targetCard = atelierCards[idx];
        if (!targetCard) return;
        setActiveAtelierTab(idx);
        atelierGrid.scrollTo({
          left: targetCard.offsetLeft - atelierGrid.offsetLeft,
          behavior: 'smooth'
        });
      });
    });

    let atelierScrollTicking = false;
    atelierGrid.addEventListener('scroll', () => {
      if (atelierScrollTicking) return;
      atelierScrollTicking = true;
      window.requestAnimationFrame(() => {
        const scrollLeft = atelierGrid.scrollLeft;
        let closestIdx = 0;
        let minDistance = Infinity;
        atelierCards.forEach((card, i) => {
          const dist = Math.abs((card.offsetLeft - atelierGrid.offsetLeft) - scrollLeft);
          if (dist < minDistance) {
            minDistance = dist;
            closestIdx = i;
          }
        });
        setActiveAtelierTab(closestIdx);
        atelierScrollTicking = false;
      });
    }, { passive: true });
  }

});
