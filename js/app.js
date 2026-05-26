/* Main dynamic data loading and component rendering */

let schoolData = null;

// Fetch and load database data
async function loadSchoolData() {
  if (schoolData) return schoolData;
  if (window.schoolData) {
    schoolData = window.schoolData;
    return schoolData;
  }
  try {
    const response = await fetch('data/school-data.json');
    if (!response.ok) throw new Error('Network response was not ok');
    schoolData = await response.json();
    return schoolData;
  } catch (error) {
    console.error('Error loading school data:', error);
  }
}

// Convert absolute path from JSON to relative path for static site
function getImagePath(path) {
  if (!path) return '';
  return path.startsWith('/') ? path.slice(1) : path;
}

// Render dynamic navigation bar
function renderNavigation(activePage, data) {
  const header = document.getElementById('main-header');
  if (!header) return;

  const navLinks = data.navLinks;
  const shortName = data.school.shortName.split(',')[0];
  const logoUrl = getImagePath(data.images.logo);

  let linksHtml = '';
  navLinks.forEach(link => {
    let isActive = false;
    const cleanHref = link.href;
    if (cleanHref === '/' || cleanHref === '') {
      isActive = activePage === 'home';
    } else if (cleanHref.startsWith('/#')) {
      isActive = activePage === 'home';
    } else {
      const pageName = cleanHref.replace('/', '');
      isActive = activePage === pageName;
    }

    let relativeHref = cleanHref;
    if (cleanHref === '/' || cleanHref === '') {
      relativeHref = 'index.html';
    } else if (cleanHref.startsWith('/#')) {
      relativeHref = 'index.html' + cleanHref.substring(1);
    } else {
      relativeHref = cleanHref.substring(1) + '.html';
    }

    const activeClass = isActive ? 'text-gse-gold font-semibold' : '';

    linksHtml += `
      <a href="${relativeHref}" class="nav-link px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${activeClass}">
        ${link.name}
      </a>
    `;
  });

  let mobileLinksHtml = '';
  navLinks.forEach(link => {
    let relativeHref = link.href === '/' ? 'index.html' : (link.href.startsWith('/#') ? 'index.html' + link.href.substring(1) : link.href.substring(1) + '.html');
    mobileLinksHtml += `
      <a href="${relativeHref}" class="block px-4 py-3 text-sm font-medium rounded-md text-gse-charcoal hover:bg-gse-cream transition-colors">
        ${link.name}
      </a>
    `;
  });

  header.className = "fixed top-0 left-0 right-0 z-50 transition-all duration-300 nav-transparent";
  header.innerHTML = `
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 md:h-20">
        <!-- Logo and Name -->
        <a href="index.html" class="flex items-center gap-3 shrink-0">
          <div class="relative w-10 h-10 md:w-12 md:h-12">
            <img src="${logoUrl}" alt="${data.school.shortName} Logo" class="object-contain w-10 h-10 md:w-12 md:h-12" />
          </div>
          <div class="hidden sm:block">
            <h1 class="text-sm md:text-base font-bold leading-tight text-white transition-colors duration-300 header-title">
              ${shortName}
            </h1>
            <p class="text-xs text-gse-gold-light transition-colors duration-300 header-subtitle">
              ${data.school.address.area}, ${data.school.address.city}
            </p>
          </div>
        </a>

        <!-- Desktop Navigation -->
        <div class="hidden lg:flex items-center gap-1">
          ${linksHtml}
          <a href="contact.html" class="ml-3 px-5 py-2 bg-gse-gold text-gse-charcoal text-sm font-semibold rounded-md hover:bg-gse-gold-light transition-all duration-200 shadow-md hover:shadow-lg">
            Apply Now
          </a>
        </div>

        <!-- Mobile Menu Button -->
        <button id="mobile-menu-btn" class="lg:hidden p-2 rounded-md text-white transition-colors" aria-label="Toggle menu">
          <i data-lucide="menu" class="w-6 h-6"></i>
        </button>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <div id="mobile-menu" class="lg:hidden max-h-0 opacity-0 overflow-hidden transition-all duration-300 bg-white shadow-xl border-t border-gse-border">
      <div class="px-4 py-3 space-y-1">
        ${mobileLinksHtml}
        <a href="contact.html" class="block mt-3 px-4 py-3 bg-gse-gold text-gse-charcoal text-sm font-semibold rounded-md text-center hover:bg-gse-gold-light transition-colors">
          Apply Now
        </a>
      </div>
    </div>
  `;

  // Reinitialize icons in header
  lucide.createIcons();

  // Setup mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  mobileMenuBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('opacity-100');
    if (isOpen) {
      mobileMenu.classList.remove('max-h-screen', 'opacity-100', 'py-3');
      mobileMenu.classList.add('max-h-0', 'opacity-0');
      mobileMenuBtn.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
    } else {
      mobileMenu.classList.remove('max-h-0', 'opacity-0');
      mobileMenu.classList.add('max-h-screen', 'opacity-100', 'py-3');
      mobileMenuBtn.innerHTML = '<i data-lucide="x" class="w-6 h-6"></i>';
    }
    lucide.createIcons();
  });

  // Handle scroll background toggle
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 50;
    const title = header.querySelector('.header-title');
    const subtitle = header.querySelector('.header-subtitle');
    const links = header.querySelectorAll('.nav-link');

    if (scrolled) {
      header.className = "fixed top-0 left-0 right-0 z-50 transition-all duration-300 nav-solid";
      if (title) {
        title.classList.remove('text-white');
        title.classList.add('text-gse-charcoal');
      }
      if (subtitle) {
        subtitle.classList.remove('text-gse-gold-light');
        subtitle.classList.add('text-gse-gray');
      }
      mobileMenuBtn.classList.remove('text-white');
      mobileMenuBtn.classList.add('text-gse-charcoal');
      links.forEach(l => {
        if (!l.classList.contains('text-gse-gold')) {
          l.classList.add('text-gse-charcoal');
          l.classList.remove('text-white');
        }
      });
    } else {
      header.className = "fixed top-0 left-0 right-0 z-50 transition-all duration-300 nav-transparent";
      if (title) {
        title.classList.add('text-white');
        title.classList.remove('text-gse-charcoal');
      }
      if (subtitle) {
        subtitle.classList.add('text-gse-gold-light');
        subtitle.classList.remove('text-gse-gray');
      }
      mobileMenuBtn.classList.add('text-white');
      mobileMenuBtn.classList.remove('text-gse-charcoal');
      links.forEach(l => {
        if (!l.classList.contains('text-gse-gold')) {
          l.classList.remove('text-gse-charcoal');
          l.classList.add('text-white');
        }
      });
    }
  });
}

// Render dynamic footer
function renderFooter(data) {
  const footer = document.getElementById('main-footer');
  if (!footer) return;

  const logoUrl = getImagePath(data.images.logo);
  const quickLinks = data.quickLinks;

  let linksHtml = '';
  quickLinks.forEach(link => {
    let relativeHref = link.href === '/' ? 'index.html' : (link.href.startsWith('/#') ? 'index.html' + link.href.substring(1) : link.href.substring(1) + '.html');
    linksHtml += `
      <li>
        <a href="${relativeHref}" class="text-gray-400 hover:text-gse-gold text-sm transition-colors duration-200">
          ${link.label}
        </a>
      </li>
    `;
  });

  footer.className = "bg-gse-charcoal text-white pt-16 pb-8 border-t border-white/10";
  footer.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <!-- Logo & Description -->
        <div class="col-span-1 md:col-span-1">
          <div class="flex items-center gap-3 mb-4">
            <img src="${logoUrl}" alt="${data.school.shortName} Logo" class="w-10 h-10 object-contain" />
            <span class="font-bold text-lg text-gse-gold">${data.school.shortName.split(',')[0]}</span>
          </div>
          <p class="text-gray-400 text-sm leading-relaxed mb-4">
            A designated ${data.school.type} under the ${data.school.department}. Nurturing tomorrow's leaders today.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-white font-bold mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
          <ul class="space-y-2">
            ${linksHtml}
          </ul>
        </div>

        <!-- Contact Information -->
        <div>
          <h4 class="text-white font-bold mb-4 uppercase tracking-wider text-sm">Contact Info</h4>
          <ul class="space-y-3 text-gray-400 text-sm">
            <li class="flex items-start gap-2.5">
              <i data-lucide="phone" class="w-4 h-4 text-gse-gold shrink-0 mt-0.5"></i>
              <span>${data.school.contact.phone}</span>
            </li>
            <li class="flex items-start gap-2.5">
              <i data-lucide="mail" class="w-4 h-4 text-gse-gold shrink-0 mt-0.5"></i>
              <span class="break-all">${data.school.contact.email}</span>
            </li>
            <li class="flex items-start gap-2.5">
              <i data-lucide="clock" class="w-4 h-4 text-gse-gold shrink-0 mt-0.5"></i>
              <span>${data.school.contact.officeHours}</span>
            </li>
          </ul>
        </div>

        <!-- Address -->
        <div>
          <h4 class="text-white font-bold mb-4 uppercase tracking-wider text-sm">School Location</h4>
          <ul class="space-y-3 text-gray-400 text-sm">
            <li class="flex items-start gap-2.5">
              <i data-lucide="map-pin" class="w-4 h-4 text-gse-gold shrink-0 mt-0.5"></i>
              <span>
                ${data.school.address.street},<br/>
                ${data.school.address.area}, ${data.school.address.city},<br/>
                ${data.school.address.state} - ${data.school.address.pincode}
              </span>
            </li>
            <li class="flex items-start gap-2.5">
              <i data-lucide="shield" class="w-4 h-4 text-gse-gold shrink-0 mt-0.5"></i>
              <span>UDISE Code: ${data.school.udiseCode}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Copyright -->
      <div class="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-xs">
        <p>© ${new Date().getFullYear()} ${data.school.fullName}. All rights reserved.</p>
        <div class="flex gap-4">
          <a href="${data.school.social.facebook}" target="_blank" class="hover:text-gse-gold"><i data-lucide="facebook" class="w-4 h-4"></i></a>
          <a href="${data.school.social.instagram}" target="_blank" class="hover:text-gse-gold"><i data-lucide="instagram" class="w-4 h-4"></i></a>
          <a href="${data.school.social.linkedin}" target="_blank" class="hover:text-gse-gold"><i data-lucide="linkedin" class="w-4 h-4"></i></a>
          <a href="${data.school.social.youtube}" target="_blank" class="hover:text-gse-gold"><i data-lucide="youtube" class="w-4 h-4"></i></a>
        </div>
      </div>
    </div>
  `;

  lucide.createIcons();
}

// Scroll reveal animation observer
function initScrollReveal() {
  const elements = document.querySelectorAll('.animate-on-scroll, .animate-on-scroll-left, .animate-on-scroll-right, .animate-on-scroll-scale');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  elements.forEach(el => observer.observe(el));
}

// Stat counters animation observer
function initCounters() {
  const elements = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3
  });

  elements.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const endValue = parseInt(el.getAttribute('data-value'), 10);
  const suffix = el.getAttribute('data-suffix') || '';
  let startValue = 0;
  const duration = 2000;
  const increment = endValue / (duration / 16);

  const timer = setInterval(() => {
    startValue += increment;
    if (startValue >= endValue) {
      el.textContent = endValue + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(startValue) + suffix;
    }
  }, 16);
}
