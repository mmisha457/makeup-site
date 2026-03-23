document.addEventListener('DOMContentLoaded', () => {
  
  /* 1. MOBILE MENU */
  const burger = document.querySelector('.header__burger');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav__link');

  burger.addEventListener('click', () => {
    burger.classList.toggle('header__burger--active');
    nav.classList.toggle('nav--active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('header__burger--active');
      nav.classList.remove('nav--active');
    });
  });

  /* 2. SCROLL REVEAL ANIMATIONS */
  const revealElements = document.querySelectorAll('.reveal');
  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('active');
      observer.unobserve(entry.target); 
    });
  }, revealOptions);

  revealElements.forEach(el => revealOnScroll.observe(el));

  /* 3. CSS GRID FILTERS (ЧИСТЫЙ JS) */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio__item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        if (filterValue === 'all' || item.classList.contains(filterValue)) {
          item.classList.remove('hide');
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.classList.add('hide');
          }, 400);
        }
      });
    });
  });

  /* 4. SMART LIGHTBOX */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const btnClose = document.querySelector('.lightbox__close');
  const btnNext = document.querySelector('.lightbox__nav--next');
  const btnPrev = document.querySelector('.lightbox__nav--prev');
  
  let visiblePhotos = [];
  let currentIndex = 0;

  function updateVisiblePhotos() {
    visiblePhotos = Array.from(document.querySelectorAll('.portfolio__item:not(.hide) .project__photo'));
  }

  document.querySelector('.portfolio__grid').addEventListener('click', (e) => {
    if (e.target.classList.contains('project__photo')) {
      updateVisiblePhotos();
      currentIndex = visiblePhotos.indexOf(e.target);
      updateLightbox();
      openLightbox();
    }
  });

  function updateLightbox() {
    if (visiblePhotos.length === 0) return;
    const imgSrc = visiblePhotos[currentIndex].getAttribute('src');
    const imgAlt = visiblePhotos[currentIndex].getAttribute('alt');
    
    lightboxImg.style.opacity = 0;
    setTimeout(() => {
      lightboxImg.setAttribute('src', imgSrc);
      lightboxImg.setAttribute('alt', imgAlt);
      lightboxImg.style.opacity = 1;
    }, 200);
    
    lightboxCounter.textContent = `${currentIndex + 1} / ${visiblePhotos.length}`;
  }

  function openLightbox() {
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function nextImage() {
    if (visiblePhotos.length === 0) return;
    currentIndex = (currentIndex + 1) % visiblePhotos.length;
    updateLightbox();
  }

  function prevImage() {
    if (visiblePhotos.length === 0) return;
    currentIndex = (currentIndex - 1 + visiblePhotos.length) % visiblePhotos.length;
    updateLightbox();
  }

  btnClose.addEventListener('click', closeLightbox);
  btnNext.addEventListener('click', nextImage);
  btnPrev.addEventListener('click', prevImage);
  
  lightbox.addEventListener('click', (e) => {
    if (e.target.classList.contains('lightbox__overlay') || e.target.classList.contains('lightbox__content')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });
});
