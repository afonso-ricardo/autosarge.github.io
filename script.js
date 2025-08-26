// Car Dealership Website - Main JavaScript
(function() {
  'use strict';

  // DOM Elements
  const mobileMenuBtn = document.querySelector('.mobile-menu');
  const mainNav = document.querySelector('.main-nav');
  const navLinks = document.querySelectorAll('.main-nav a');
  const contactForm = document.getElementById('contactForm');
  const featuredCarsContainer = document.getElementById('featured-cars');
  const searchForm = document.querySelector('.search-form');

  // Centralized data source
  const SITE_DATA = window.SITE_DATA || { cars: [], contact: {}, site: {} };
  const cars = SITE_DATA.cars || [];

  // Helper to select a car's primary image (supports new images array)
  const getCarPrimaryImage = (car) => {
    if (car && Array.isArray(car.images) && car.images.length > 0) return car.images[0];
    return car.image;
  };

  // --- Big Picture Overlay (no zoom; with navigation) ---
  let lbImages = [], lbIndex = 0, lbTitle = '';

  function ensureImageLightboxExists() {
    if (document.getElementById('imgLightbox')) return;
    const overlay = document.createElement('div');
    overlay.id = 'imgLightbox';
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Fechar">&times;</button>
        <button class="lightbox-arrow lightbox-prev" aria-label="Imagem anterior"><i class="fas fa-chevron-left"></i></button>
        <img class="lightbox-img" alt="Imagem ampliada" />
        <button class="lightbox-arrow lightbox-next" aria-label="Próxima imagem"><i class="fas fa-chevron-right"></i></button>
      </div>
    `;
    document.body.appendChild(overlay);

    // Close on outside click
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeImageLightbox(); });

    // Close button
    const closeBtn = overlay.querySelector('.lightbox-close');
    if (closeBtn) closeBtn.addEventListener('click', closeImageLightbox);

    // Navigation buttons
    const prevBtn = overlay.querySelector('.lightbox-prev');
    const nextBtn = overlay.querySelector('.lightbox-next');
    if (prevBtn) prevBtn.addEventListener('click', () => updateBigPicture(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => updateBigPicture(1));

    // Keyboard controls (capture so modal doesn't eat the event)
    document.addEventListener('keydown', (e) => {
      const lb = document.getElementById('imgLightbox');
      if (!lb || !lb.classList.contains('open')) return;
      if (e.key === 'Escape') { e.stopImmediatePropagation(); closeImageLightbox(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); updateBigPicture(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); updateBigPicture(1); }
    }, true);
  }

  function renderBigPicture() {
    const overlay = document.getElementById('imgLightbox');
    if (!overlay) return;
    const img = overlay.querySelector('.lightbox-img');
    if (!img || !Array.isArray(lbImages) || lbImages.length === 0) return;
    const safeIndex = ((lbIndex % lbImages.length) + lbImages.length) % lbImages.length;
    lbIndex = safeIndex;
    img.src = lbImages[lbIndex];
    img.alt = (lbTitle || 'Imagem') + ` (${lbIndex + 1}/${lbImages.length})`;
  }

  function updateBigPicture(step) {
    if (!Array.isArray(lbImages) || lbImages.length === 0) return;
    lbIndex = (lbIndex + step + lbImages.length) % lbImages.length;
    renderBigPicture();
  }

  function openBigPictureOverlay(images, startIndex, title) {
    ensureImageLightboxExists();
    lbImages = Array.isArray(images) ? images.slice() : [];
    lbIndex = Math.min(Math.max(0, startIndex | 0), Math.max(0, lbImages.length - 1));
    lbTitle = title || '';
    renderBigPicture();
    const overlay = document.getElementById('imgLightbox');
    if (overlay) {
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
    }
  }

  function closeImageLightbox() {
    const overlay = document.getElementById('imgLightbox');
    if (!overlay) return;
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
  }

  // Initialize the application
  function init() {
    setupEventListeners();
    // Populate header contact links and branding from SITE_DATA
    try {
      const navPhone = document.getElementById('navPhone');
      const navPhone2 = document.getElementById('navPhone2');
      const navEmail = document.getElementById('navEmail');
      if (SITE_DATA.contact && navPhone) {
        const phone = SITE_DATA.contact.phone || '';
        const phoneDisplay = SITE_DATA.contact.phoneDisplay || phone;
        navPhone.href = phone ? `tel:${phone}` : '#';
        navPhone.innerHTML = `<i class="fas fa-phone"></i> ${phoneDisplay}`;
      }
      // Optional secondary phone in header
      if (SITE_DATA.contact && navPhone2) {
        const phone2 = SITE_DATA.contact.phone2 || '';
        const phone2Display = SITE_DATA.contact.phone2Display || phone2;
        if (phone2) {
          navPhone2.href = `tel:${phone2}`;
          navPhone2.innerHTML = `<i class="fas fa-phone"></i> ${phone2Display}`;
          navPhone2.style.display = '';
        } else {
          navPhone2.style.display = 'none';
        }
      }
      if (SITE_DATA.contact && navEmail) {
        const email = SITE_DATA.contact.email || '';
        navEmail.href = email ? `mailto:${email}` : '#';
        navEmail.innerHTML = `<i class="fas fa-envelope"></i> ${email}`;
      }
      // Secondary phone in contact section and footer
      const contactPhone2El = document.getElementById('contactPhone2');
      if (contactPhone2El && SITE_DATA.contact) {
        const phone2 = SITE_DATA.contact.phone2 || '';
        const phone2Display = SITE_DATA.contact.phone2Display || phone2;
        if (phone2) {
          contactPhone2El.innerHTML = `<i class="fas fa-phone"></i> ${phone2Display}`;
          contactPhone2El.style.display = '';
        } else {
          contactPhone2El.style.display = 'none';
        }
      }
      const footerPhone2El = document.getElementById('footerPhone2');
      if (footerPhone2El && SITE_DATA.contact) {
        const phone2 = SITE_DATA.contact.phone2 || '';
        const phone2Display = SITE_DATA.contact.phone2Display || phone2;
        if (phone2) {
          footerPhone2El.innerHTML = `<i class=\"fas fa-phone\"></i> ${phone2Display}`;
          footerPhone2El.style.display = '';
        } else {
          footerPhone2El.style.display = 'none';
        }
      }
      // Optional: update logo text if provided
      const logoTitle = document.querySelector('.logo-text h1');
      const logoTagline = document.querySelector('.logo-text p');
      if (SITE_DATA.site && logoTitle) logoTitle.textContent = SITE_DATA.site.name || logoTitle.textContent;
      if (SITE_DATA.site && logoTagline) logoTagline.textContent = SITE_DATA.site.tagline || logoTagline.textContent;
      // Optional: update navbar logo image from data
      const logoImg = document.querySelector('.logo-img');
      if (SITE_DATA.site && SITE_DATA.site.logos && SITE_DATA.site.logos.nav && logoImg) {
        const navLogo = SITE_DATA.site.logos.nav;
        if (navLogo.url) logoImg.src = navLogo.url;
        if (navLogo.alt) logoImg.alt = navLogo.alt;
      }
      // Optional: update favicon from data
      const faviconEl = document.getElementById('siteFavicon');
      if (SITE_DATA.site && SITE_DATA.site.favicon && faviconEl) {
        if (SITE_DATA.site.favicon.url) faviconEl.href = SITE_DATA.site.favicon.url;
        if (SITE_DATA.site.favicon.type) faviconEl.type = SITE_DATA.site.favicon.type;
      }

      // Update document title from site name/tagline
      if (SITE_DATA.site && SITE_DATA.site.name) {
        const titleText = SITE_DATA.site.tagline
          ? `${SITE_DATA.site.name} - ${SITE_DATA.site.tagline}`
          : SITE_DATA.site.name;
        document.title = titleText;
      }

      // Populate hero content from data
      const heroTitle = document.querySelector('.hero-left h1');
      const heroText = document.querySelector('.hero-left p');
      const heroImg = document.querySelector('.hero-right img');
      if (SITE_DATA.hero) {
        if (heroTitle && SITE_DATA.hero.title) heroTitle.textContent = SITE_DATA.hero.title;
        if (heroText && SITE_DATA.hero.text) heroText.textContent = SITE_DATA.hero.text;
        if (heroImg && SITE_DATA.hero.image) {
          if (SITE_DATA.hero.image.url) heroImg.src = SITE_DATA.hero.image.url;
          if (SITE_DATA.hero.image.alt) heroImg.alt = SITE_DATA.hero.image.alt;
        }
      }
    } catch (e) {
      console.warn('Header data population skipped:', e);
    }
    displayFeaturedCars();
    buildFeaturedCarousel();
    buildSoldCarousel();
    setupSmoothScrolling();
    setupFormValidation();
    setupScrollAnimations();
    setupCarousels();
  }
  
  // Build slides for the Sold Cars carousel
  function buildSoldCarousel() {
    const soldSection = document.getElementById('vendidos-carousel');
    if (!soldSection) return;
    const track = soldSection.querySelector('.carousel-track');
    const dotsWrapper = soldSection.querySelector('.carousel-dots');
    if (!track) return;

    // Clear existing content (if any)
    track.innerHTML = '';
    if (dotsWrapper) dotsWrapper.innerHTML = '';

    const soldCars = cars.filter(c => c.sold === true && c.hidden !== true);
    if (soldCars.length === 0) {
      // Hide section if no sold cars
      soldSection.style.display = 'none';
      return;
    }
    soldSection.style.display = '';

    // Create slides
    soldCars.forEach(car => {
      const slide = createCarouselSlide(car);
      track.appendChild(slide);
    });

    // Create dots dynamically
    if (dotsWrapper) {
      soldCars.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (idx === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Slide ${idx + 1}`);
        dotsWrapper.appendChild(dot);
      });
    }
  }

  // Build slides for the Featured (Destaques) carousel
  function buildFeaturedCarousel() {
    const sections = Array.from(document.querySelectorAll('.featured-carousel-section'));
    const featuredSection = sections.find(sec => sec.id !== 'vendidos-carousel');
    if (!featuredSection) return;
    const track = featuredSection.querySelector('.carousel-track');
    const dotsWrapper = featuredSection.querySelector('.carousel-dots');
    if (!track) return;

    // Clear existing content (remove hardcoded slides/dots)
    track.innerHTML = '';
    if (dotsWrapper) dotsWrapper.innerHTML = '';

    const featuredCars = cars.filter(c => c.sold !== true && c.hidden !== true);
    if (featuredCars.length === 0) {
      featuredSection.style.display = 'none';
      return;
    }
    featuredSection.style.display = '';

    // Create slides
    featuredCars.forEach(car => {
      const slide = createCarouselSlide(car);
      track.appendChild(slide);
    });

    // Create dots dynamically
    if (dotsWrapper) {
      featuredCars.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (idx === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Slide ${idx + 1}`);
        dotsWrapper.appendChild(dot);
      });
    }
  }

  // Create a carousel slide element for a car
  function createCarouselSlide(car) {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';

    const card = document.createElement('div');
    card.className = 'carousel-card' + (car.sold ? ' sold' : '');
    card.innerHTML = `
      <div class="carousel-card-image">
        <img src="${getCarPrimaryImage(car)}" alt="${car.name || (car.make + ' ' + car.model)}">
      </div>
      <div class="carousel-card-content">
        <h3>${car.name || (car.make + ' ' + car.model)}</h3>
        <div class="car-specs">
          <span><i class="fas fa-tachometer-alt"></i> ${car.mileage.toLocaleString()} km</span>
          <span><i class="fas fa-gas-pump"></i> ${car.fuel}</span>
          <span><i class="fas fa-cog"></i> ${car.transmission}</span>
        </div>
        <div class="car-price">${car.sold ? 'VENDIDO' : car.price.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</div>
        <a href="#" class="btn btn-carousel">Ver Detalhes</a>
      </div>
    `;

    if (car.sold) {
      const badge = document.createElement('span');
      badge.className = 'sold-badge';
      badge.textContent = 'VENDIDO';
      card.appendChild(badge);
    }
    // Wire "Ver Detalhes" to open modal with this car
    const detailsLink = card.querySelector('.btn-carousel');
    if (detailsLink) {
      detailsLink.addEventListener('click', (e) => {
        e.preventDefault();
        openCarModal(car);
      });
    }

    slide.appendChild(card);
    return slide;
  }

  // Carousel functionality supporting multiple instances
  function setupCarousels() {
    const sections = Array.from(document.querySelectorAll('.featured-carousel-section'));
    sections.forEach(section => initCarouselFor(section));
  }

  function initCarouselFor(section) {
    const track = section.querySelector('.carousel-track');
    const slides = Array.from(section.querySelectorAll('.carousel-slide'));
    let dots = Array.from(section.querySelectorAll('.carousel-dot'));
    const prevButton = section.querySelector('.carousel-prev');
    const nextButton = section.querySelector('.carousel-next');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const slideCount = slides.length;

    const updateDots = () => {
      if (dots.length === 0) return;
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

    const initCarousel = () => {
      const prevIndex = (currentIndex - 1 + slideCount) % slideCount;
      const nextIndex = (currentIndex + 1) % slideCount;

      slides.forEach((slide, index) => {
        slide.classList.remove('prev', 'active', 'next');
        slide.style.opacity = '';
        slide.style.pointerEvents = '';
        slide.style.left = '';
        slide.style.right = '';
        slide.style.margin = '';

        if (index === currentIndex) {
          slide.classList.add('active');
        } else if (index === prevIndex) {
          slide.classList.add('prev');
        } else if (index === nextIndex) {
          slide.classList.add('next');
        } else {
          slide.style.opacity = '0';
          slide.style.pointerEvents = 'none';
        }
      });
      updateDots();
    };

    const goToSlide = (index) => {
      if (index < 0) index = slideCount - 1;
      if (index >= slideCount) index = 0;
      currentIndex = index;
      initCarousel();
    };

    // Initialize layout
    initCarousel();

    // Event listeners for navigation
    if (prevButton) prevButton.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (nextButton) nextButton.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Dot navigation (reselect after potential dynamic creation)
    dots = Array.from(section.querySelectorAll('.carousel-dot'));
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => goToSlide(index));
    });

    // Keyboard navigation (left/right arrows) when section in viewport
    document.addEventListener('keydown', (e) => {
      const rect = section.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;
      if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
      else if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
    });

    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      const swipeThreshold = 50;
      const difference = touchStartX - touchEndX;
      if (Math.abs(difference) > swipeThreshold) {
        if (difference > 0) goToSlide(currentIndex + 1);
        else goToSlide(currentIndex - 1);
      }
    }, { passive: true });

    // Auto-advance carousel (optional)
    let slideInterval;
    const startAutoSlide = () => {
      slideInterval = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, 5000);
    };
    const stopAutoSlide = () => clearInterval(slideInterval);

    const carousel = section;
    if (carousel) {
      carousel.addEventListener('mouseenter', stopAutoSlide);
      carousel.addEventListener('mouseleave', startAutoSlide);
    }
    startAutoSlide();

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => initCarousel(), 250);
    });
  }

  // Set up event listeners
  function setupEventListeners() {
    // Mobile menu toggle
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when clicking on a nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mainNav.classList.contains('active')) {
          toggleMobileMenu();
        }
      });
    });

    // Contact form submission
    if (contactForm) {
      contactForm.addEventListener('submit', handleContactSubmit);
    }

    // Search form submission
    if (searchForm) {
      searchForm.addEventListener('submit', handleSearchSubmit);
    }

    // Phone dropdown (support click/tap for mobile; hover is handled in CSS for desktop)
    const phoneDropdown = document.querySelector('.nav-phone-dropdown');
    const phoneTrigger = document.getElementById('navPhoneTrigger');
    if (phoneDropdown && phoneTrigger) {
      phoneTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = phoneDropdown.classList.toggle('open');
        phoneTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!phoneDropdown.classList.contains('open')) return;
        if (phoneDropdown.contains(e.target)) return;
        phoneDropdown.classList.remove('open');
        phoneTrigger.setAttribute('aria-expanded', 'false');
      });

      // Close on Escape
      document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (!phoneDropdown.classList.contains('open')) return;
        phoneDropdown.classList.remove('open');
        phoneTrigger.setAttribute('aria-expanded', 'false');
        try { phoneTrigger.focus(); } catch(_) {}
      });
    }
  }

  // Toggle mobile menu
  function toggleMobileMenu() {
    mainNav.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
  }

  // Display featured cars in the grid
  function displayFeaturedCars() {
    if (!featuredCarsContainer) return;

    // Clear loading message
    featuredCarsContainer.innerHTML = '';

    // Create and append car cards
    const visibleCars = cars.filter(c => c.hidden !== true);
    if (visibleCars.length === 0) {
      featuredCarsContainer.innerHTML = '<div class="empty">Sem veículos para mostrar.</div>';
      return;
    }
    visibleCars.forEach(car => {
      const carCard = createCarCard(car);
      featuredCarsContainer.appendChild(carCard);
    });
  }

  // Create HTML for a car card
  function createCarCard(car) {
    const carCard = document.createElement('div');
    carCard.className = 'car-card animate-fade-in';
    carCard.innerHTML = `
      <div class="car-gallery">
        <div class="car-gallery-main">
          <img src="${getCarPrimaryImage(car)}" alt="${car.name || (car.make + ' ' + car.model)}" class="car-gallery-img">
        </div>
      </div>
      <div class="car-info">
        <h3 class="car-title">${car.name || (car.make + ' ' + car.model)}</h3>
        <div class="car-specs">
          <span>${car.year}</span>
          <span>•</span>
          <span>${car.mileage.toLocaleString()} km</span>
          <span>•</span>
          <span>${car.fuel}</span>
          <span>•</span>
          <span>${car.transmission}</span>
        </div>
        <span class="car-price">${car.price.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</span>
        <div class="car-features">
          ${(car.features || []).slice(0, 4).map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
        </div>
        ${((car.features || []).length > 4) ? `<div class="more-features-note">+${(car.features || []).length - 4} características extra — clique em "Ver Detalhes"</div>` : ''}
        <button class="btn btn-primary btn-details" style="width: 100%; margin-top: 1rem;">Ver Detalhes</button>
      </div>
    `;
  
    // Apply sold state if flagged
    if (car.sold === true) {
      applySoldState(carCard);
    }
    // Gallery simplified on cards: show only primary image (no thumbs or arrows)
  
    // Details button -> open modal popup
    const detailsBtn = carCard.querySelector('.btn-details');
    if (detailsBtn) {
      detailsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openCarModal(car);
      });
    }
    return carCard;
  }

  // --- Modal utilities ---
  function ensureModalExists() {
    if (document.getElementById('carModal')) return;
    const overlay = document.createElement('div');
    overlay.id = 'carModal';
    overlay.className = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
      <div class="modal-dialog">
        <button class="modal-close" aria-label="Fechar">&times;</button>
        <div class="modal-body"></div>
      </div>
    `;
    document.body.appendChild(overlay);
    // Close on outside click (attach once)
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeCarModal(); });
  }

  function closeCarModal() {
    const overlay = document.getElementById('carModal');
    if (!overlay) return;
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    // Remove Escape handler
    document.removeEventListener('keydown', handleEscClose);
  }

  function handleEscClose(e) {
    if (e.key === 'Escape') closeCarModal();
  }

  function openCarModal(car) {
    ensureModalExists();
    const overlay = document.getElementById('carModal');
    const dialog = overlay.querySelector('.modal-dialog');
    const body = overlay.querySelector('.modal-body');
    const closeBtn = overlay.querySelector('.modal-close');

    // Build modal content
    const images = Array.isArray(car.images) && car.images.length > 0 ? car.images : [getCarPrimaryImage(car)];
    const title = car.name || (car.make + ' ' + car.model);
    // Build spec items with icons
    const specItems = [
      `<li class="spec-item"><i class="fas fa-calendar-alt" aria-hidden="true"></i><span>${car.year}</span></li>`,
      `<li class="spec-item"><i class="fas fa-tachometer-alt" aria-hidden="true"></i><span>${car.mileage.toLocaleString()} km</span></li>`,
      `<li class="spec-item"><i class="fas fa-gas-pump" aria-hidden="true"></i><span>${car.fuel}</span></li>`,
      `<li class="spec-item"><i class="fas fa-cog" aria-hidden="true"></i><span>${car.transmission}</span></li>`
    ];
    if (car.doors != null) specItems.push(`<li class="spec-item"><i class="fas fa-door-open" aria-hidden="true"></i><span>${car.doors} portas</span></li>`);
    if (car.seats != null) specItems.push(`<li class="spec-item"><i class="fas fa-chair" aria-hidden="true"></i><span>${car.seats} lugares</span></li>`);
    body.innerHTML = `
      <div class="car-modal">
        <div class="car-gallery">
          <div class="car-gallery-main">
            <img src="${images[0]}" alt="${title}" class="car-gallery-img">
            <button class="view-large-btn" aria-label="Ver imagem grande" title="Ver imagem grande"><i class="fas fa-expand"></i></button>
            ${images.length > 1 ? `
            <button class="car-gallery-arrow car-gallery-prev" aria-label="Imagem anterior"><i class="fas fa-chevron-left"></i></button>
            <button class="car-gallery-arrow car-gallery-next" aria-label="Próxima imagem"><i class="fas fa-chevron-right"></i></button>
            ` : ''}
          </div>
          ${images.length > 1 ? `
          <div class="car-thumbs">
            ${images.map((url, idx) => `<img src="${url}" data-full="${url}" class="car-thumb ${idx === 0 ? 'active' : ''}" alt="${title} thumb ${idx+1}">`).join('')}
          </div>` : ''}
        </div>
        <div class="car-info">
          <h3 class="car-title">${title}</h3>
          <ul class="spec-list">${specItems.join('')}</ul>
          <div class="car-features">
            ${(car.features || []).map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
          </div>
          <div class="price-row${car.sold ? ' sold' : ''}">
            ${car.sold ? '' : `<a href="#contato" class="btn btn-primary contact-btn">Contacte-nos</a>`}
            <span class="car-price">${car.sold ? 'VENDIDO' : car.price.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</span>
          </div>
        </div>
      </div>
    `;

    // Show modal
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    // Close handlers
    if (closeBtn) closeBtn.addEventListener('click', closeCarModal, { once: true });
    document.addEventListener('keydown', handleEscClose);

    // Wire gallery inside modal
    const mainImg = overlay.querySelector('.car-gallery-main img');
    const thumbs = overlay.querySelectorAll('.car-thumb');
    const prevBtn = overlay.querySelector('.car-gallery-prev');
    const nextBtn = overlay.querySelector('.car-gallery-next');
    let currentIndex = 0;
    const updateActiveThumb = (idx) => {
      if (thumbs.length === 0) return;
      thumbs.forEach(t => t.classList.remove('active'));
      const active = thumbs[idx];
      if (active) {
        active.classList.add('active');
        try { active.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' }); } catch(_) {}
      }
    };
    const updateToIndex = (idx) => {
      if (!mainImg || images.length === 0) return;
      currentIndex = (idx + images.length) % images.length;
      mainImg.src = images[currentIndex];
      updateActiveThumb(currentIndex);
    };
    if (thumbs.length > 0) {
      thumbs.forEach((thumb, idx) => thumb.addEventListener('click', () => updateToIndex(idx)));
    }
    if (prevBtn) prevBtn.addEventListener('click', () => updateToIndex(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => updateToIndex(currentIndex + 1));

    // View Large button opens big picture overlay (no zoom) with nav
    const viewLargeBtn = overlay.querySelector('.view-large-btn');
    if (viewLargeBtn) {
      viewLargeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openBigPictureOverlay(images, currentIndex, title);
      });
    }

    // Contacte-nos button: close modal and scroll to contact section
    const contactBtn = overlay.querySelector('.contact-btn');
    if (contactBtn) {
      contactBtn.addEventListener('click', (ev) => {
        ev.preventDefault();
        closeCarModal();
        const target = document.querySelector('#contato');
        if (target && 'scrollIntoView' in target) {
          setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
        } else {
          window.location.hash = '#contato';
        }
      });
    }
  }

  // Apply visual and text changes for sold cars
  function applySoldState(cardEl) {
    if (!cardEl) return;
    cardEl.classList.add('sold');
    // Add a visible "VENDIDO" badge overlay if not present
    if (!cardEl.querySelector('.sold-badge')) {
      const badge = document.createElement('span');
      badge.className = 'sold-badge';
      badge.textContent = 'VENDIDO';
      cardEl.appendChild(badge);
    }
    // Change price text to VENDIDO
    const priceEl = cardEl.querySelector('.car-price');
    if (priceEl) priceEl.textContent = 'VENDIDO';
  }

  // Handle contact form submission
  async function handleContactSubmit(e) {
    e.preventDefault();
    try {
      const formData = new FormData(contactForm);
      const payload = {
        name: (formData.get('name') || '').toString().trim(),
        email: (formData.get('email') || '').toString().trim(),
        phone: (formData.get('phone') || '').toString().trim(),
        message: (formData.get('message') || '').toString().trim()
      };
      const endpoint = (SITE_DATA.contact && SITE_DATA.contact.formEndpoint) || '';

      if (endpoint) {
        // If using Formspree, send as FormData for best compatibility
        const isFormspree = /formspree\.io/i.test(endpoint);
        if (isFormspree) {
          const fd = new FormData();
          fd.append('name', payload.name);
          fd.append('email', payload.email);
          fd.append('phone', payload.phone);
          fd.append('message', payload.message);
          fd.append('_subject', `Nova mensagem do site - ${payload.name}`);

          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: fd
          });
          if (!res.ok) {
            let msg = 'Falha ao enviar o formulário.';
            try { const data = await res.json(); if (data && (data.error || data.message)) msg = data.error || data.message; } catch(_) {}
            throw new Error(msg);
          }
          alert('Obrigado pela sua mensagem! Entraremos em contato em breve.');
          contactForm.reset();
          return;
        } else {
          // Generic JSON POST for other endpoints (custom API, etc.)
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
          if (!res.ok) {
            let msg = 'Falha ao enviar o formulário.';
            try { const data = await res.json(); if (data && (data.error || data.message)) msg = data.error || data.message; } catch(_) {}
            throw new Error(msg);
          }
          alert('Obrigado pela sua mensagem! Entraremos em contato em breve.');
          contactForm.reset();
          return;
        }
      }

      // Fallback: open mail client using mailto with the configured email
      if (SITE_DATA.contact && SITE_DATA.contact.email) {
        const subject = encodeURIComponent(`Nova mensagem do site - ${payload.name}`);
        const body = encodeURIComponent(
          `Nome: ${payload.name}\nEmail: ${payload.email}\nTelefone: ${payload.phone}\n\nMensagem:\n${payload.message}`
        );
        window.location.href = `mailto:${SITE_DATA.contact.email}?subject=${subject}&body=${body}`;
        return;
      }

      alert('O envio do formulário ainda não está configurado. Defina contact.formEndpoint ou contact.email em data.js.');
    } catch (err) {
      console.error('Contact form error:', err);
      alert('Ocorreu um erro ao enviar. Tente novamente mais tarde.');
    }
  }

  // Handle search form submission
  function handleSearchSubmit(e) {
    e.preventDefault();
    const formData = new FormData(searchForm);
    const searchParams = Object.fromEntries(formData.entries());
    
    // In a real app, you would filter cars based on search criteria
    console.log('Search submitted:', searchParams);
    
    // Show loading state
    featuredCarsContainer.innerHTML = '<div class="loading">A procurar veículos...</div>';
    
    // Simulate API call delay
    setTimeout(() => {
      displayFeaturedCars();
      // Scroll to results
      document.getElementById('veiculos').scrollIntoView({ behavior: 'smooth' });
    }, 1000);
  }

  // Set up smooth scrolling for anchor links
  function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const headerOffset = 100;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Set up form validation
  function setupFormValidation() {
    // Add validation for phone number
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', function(e) {
        // Remove any non-digit characters
        this.value = this.value.replace(/\D/g, '');
      });
    }
  }

  // Set up scroll animations
  function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }

  // Initialize the app when the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', init);
})();
