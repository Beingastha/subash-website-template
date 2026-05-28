/* Main dynamic data loading and component rendering */

/* Color Theme and Preferences Initialization */
(function() {
  // 1. Theme Color scheme injection from window.schoolData if loaded
  if (window.schoolData && window.schoolData.themeColors) {
    applyThemeColors(window.schoolData.themeColors);
  }

  // 2. Dark/Light Mode activation
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark-theme');
  } else {
    document.documentElement.classList.remove('dark-theme');
  }

  // 3. Sync Language Cookie
  const savedLang = localStorage.getItem('selectedLanguage') || 'en';
  const cookieMatch = document.cookie.match(/googtrans=([^;]+)/);
  const expectedCookieValue = savedLang === 'hi' ? '/en/hi' : '/en/en';
  if (!cookieMatch || cookieMatch[1] !== expectedCookieValue) {
    const cookieDomain = window.location.hostname === 'localhost' ? '' : '; domain=' + window.location.hostname;
    if (savedLang === 'hi') {
      document.cookie = "googtrans=/en/hi; path=/" + cookieDomain;
      document.cookie = "googtrans=/en/hi; path=/";
    } else {
      document.cookie = "googtrans=/en/en; path=/" + cookieDomain;
      document.cookie = "googtrans=/en/en; path=/";
    }
  }
})();

// Global function to change language
window.changeLanguage = function(langCode) {
  localStorage.setItem('selectedLanguage', langCode);
  const cookieDomain = window.location.hostname === 'localhost' ? '' : '; domain=' + window.location.hostname;
  
  if (langCode === 'hi') {
    document.cookie = "googtrans=/en/hi; path=/" + cookieDomain;
    document.cookie = "googtrans=/en/hi; path=/";
  } else {
    document.cookie = "googtrans=/en/en; path=/" + cookieDomain;
    document.cookie = "googtrans=/en/en; path=/";
    // Clear cookie
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/" + cookieDomain;
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
  window.location.reload();
};

function applyThemeColors(tc) {
  if (!tc) return;
  const root = document.documentElement;
  if (tc.primary) root.style.setProperty('--color-primary', tc.primary);
  if (tc.primaryLight) root.style.setProperty('--color-primary-light', tc.primaryLight);
  if (tc.primaryDark) root.style.setProperty('--color-primary-dark', tc.primaryDark);
  if (tc.secondary) root.style.setProperty('--color-secondary', tc.secondary);
  if (tc.secondaryLight) root.style.setProperty('--color-secondary-light', tc.secondaryLight);
  if (tc.secondaryDark) root.style.setProperty('--color-secondary-dark', tc.secondaryDark);
}

let schoolData = null;

// Fetch and load database data
async function loadSchoolData() {
  if (schoolData) return schoolData;
  if (window.schoolData) {
    schoolData = window.schoolData;
    applyThemeColors(schoolData.themeColors);
    return schoolData;
  }
  try {
    const response = await fetch('data/school-data.json');
    if (!response.ok) throw new Error('Network response was not ok');
    schoolData = await response.json();
    applyThemeColors(schoolData.themeColors);
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

  const savedTheme = localStorage.getItem('theme') || 'light';
  const savedLang = localStorage.getItem('selectedLanguage') || 'en';

  const shortName = data.school.shortName.split(',')[0];
  const logoUrl = getImagePath(data.images.logo);

  const homeActive = activePage === 'home' ? 'text-gse-gold font-semibold' : 'text-white';
  const academicsActive = activePage === 'academics' ? 'text-gse-gold font-semibold' : 'text-white';
  const facilitiesActive = (activePage === 'activities' || activePage === 'hostel') ? 'text-gse-gold font-semibold' : 'text-white';
  const achievementsActive = activePage === 'achievements' ? 'text-gse-gold font-semibold' : 'text-white';
  const teachersActive = activePage === 'teachers' ? 'text-gse-gold font-semibold' : 'text-white';
  const aboutActive = (activePage === 'about' || activePage === 'principal') ? 'text-gse-gold font-semibold' : 'text-white';

  const linksHtml = `
    <a href="index.html" class="nav-link px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${homeActive}">
      Home
    </a>
    <div class="relative group inline-block">
      <button class="nav-link px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 inline-flex items-center gap-1 ${aboutActive}">
        About <i data-lucide="chevron-down" class="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"></i>
      </button>
      <div class="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-1 border border-gse-border">
        <a href="index.html#about" class="block px-4 py-2 text-sm text-gse-charcoal hover:bg-gse-cream hover:text-gse-green transition-colors">
          About School
        </a>
        <a href="principal.html" class="block px-4 py-2 text-sm text-gse-charcoal hover:bg-gse-cream hover:text-gse-green transition-colors">
          From Principal's desk
        </a>
      </div>
    </div>
    <a href="index.html#academics" class="nav-link px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${academicsActive}">
      Academics
    </a>
    <div class="relative group inline-block">
      <button class="nav-link px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 inline-flex items-center gap-1 ${facilitiesActive}">
        Facilities <i data-lucide="chevron-down" class="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"></i>
      </button>
      <div class="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-1 border border-gse-border">
        <a href="activities.html" class="block px-4 py-2 text-sm text-gse-charcoal hover:bg-gse-cream hover:text-gse-green transition-colors">
          Sports & Activities
        </a>
        <a href="hostel.html" class="block px-4 py-2 text-sm text-gse-charcoal hover:bg-gse-cream hover:text-gse-green transition-colors">
          Hostel & Mess
        </a>
      </div>
    </div>
    <a href="achievements.html" class="nav-link px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${achievementsActive}">
      Achievements
    </a>
    <a href="teachers.html" class="nav-link px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${teachersActive}">
      Teachers
    </a>
  `;

  const mobileLinksHtml = `
    <a href="index.html" class="block px-4 py-3 text-sm font-medium rounded-md text-gse-charcoal hover:bg-gse-cream transition-colors">
      Home
    </a>
    <div class="px-4 py-2 bg-gse-offwhite rounded-md border border-gse-border/50 my-1">
      <span class="block text-xs font-semibold uppercase tracking-wider text-gse-gray/60 mb-1">About</span>
      <a href="index.html#about" class="block pl-3 py-2 text-sm font-medium rounded-md text-gse-charcoal hover:bg-gse-cream transition-colors">
        About School
      </a>
      <a href="principal.html" class="block pl-3 py-2 text-sm font-medium rounded-md text-gse-charcoal hover:bg-gse-cream transition-colors">
        From Principal's desk
      </a>
    </div>
    <a href="index.html#academics" class="block px-4 py-3 text-sm font-medium rounded-md text-gse-charcoal hover:bg-gse-cream transition-colors">
      Academics
    </a>
    <div class="px-4 py-2 bg-gse-offwhite rounded-md border border-gse-border/50 my-1">
      <span class="block text-xs font-semibold uppercase tracking-wider text-gse-gray/60 mb-1">Facilities</span>
      <a href="activities.html" class="block pl-3 py-2 text-sm font-medium rounded-md text-gse-charcoal hover:bg-gse-cream transition-colors">
        Sports & Activities
      </a>
      <a href="hostel.html" class="block pl-3 py-2 text-sm font-medium rounded-md text-gse-charcoal hover:bg-gse-cream transition-colors">
        Hostel & Mess
      </a>
    </div>
    <a href="achievements.html" class="block px-4 py-3 text-sm font-medium rounded-md text-gse-charcoal hover:bg-gse-cream transition-colors">
      Achievements
    </a>
    <a href="teachers.html" class="block px-4 py-3 text-sm font-medium rounded-md text-gse-charcoal hover:bg-gse-cream transition-colors">
      Teachers
    </a>
  `;

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
          
          <!-- Theme Toggle Button -->
          <button id="theme-toggle-btn" class="ml-2 p-2 text-white hover:text-gse-gold rounded-full transition-colors duration-200 flex items-center justify-center" aria-label="Toggle theme">
            <i data-lucide="${savedTheme === 'dark' ? 'sun' : 'moon'}" class="w-5 h-5"></i>
          </button>

          <!-- Language Selector Dropdown -->
          <div class="relative inline-block text-left ml-1" id="language-selector">
            <button id="lang-dropdown-btn" class="px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 inline-flex items-center gap-1.5 text-white hover:text-gse-gold">
              <i data-lucide="globe" class="w-4 h-4"></i>
              <span>${savedLang === 'hi' ? 'हिन्दी' : 'EN'}</span>
              <i data-lucide="chevron-down" class="w-3.5 h-3.5 transition-transform duration-200"></i>
            </button>
            <div id="lang-dropdown-menu" class="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible transition-all duration-200 z-50 py-1 border border-gse-border">
              <button onclick="changeLanguage('en')" class="w-full text-left block px-4 py-2 text-sm text-gse-charcoal hover:bg-gse-cream hover:text-gse-green transition-colors ${savedLang !== 'hi' ? 'lang-active' : ''}">
                English
              </button>
              <button onclick="changeLanguage('hi')" class="w-full text-left block px-4 py-2 text-sm text-gse-charcoal hover:bg-gse-cream hover:text-gse-green transition-colors ${savedLang === 'hi' ? 'lang-active' : ''}">
                हिन्दी (Hindi)
              </button>
            </div>
          </div>

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
        
        <!-- Mobile Preferences Section -->
        <div class="px-4 py-2 bg-gse-offwhite rounded-md border border-gse-border/50 my-1">
          <span class="block text-xs font-semibold uppercase tracking-wider text-gse-gray/60 mb-2">Preferences</span>
          <div class="flex items-center justify-between py-1">
            <span class="text-sm font-medium text-gse-charcoal">Theme (Dark Mode)</span>
            <button id="mobile-theme-toggle-btn" class="p-2 bg-white rounded-lg border border-gse-border text-gse-charcoal hover:bg-gse-cream transition-colors flex items-center justify-center">
              <i data-lucide="${savedTheme === 'dark' ? 'sun' : 'moon'}" class="w-4 h-4"></i>
            </button>
          </div>
          <div class="flex items-center justify-between py-1 mt-2 border-t border-gse-border/30 pt-2">
            <span class="text-sm font-medium text-gse-charcoal">Language</span>
            <div class="flex gap-2">
              <button onclick="changeLanguage('en')" class="px-3 py-1 text-xs font-semibold rounded-md border border-gse-border ${savedLang !== 'hi' ? 'bg-gse-green text-white' : 'bg-white text-gse-charcoal'} hover:bg-gse-cream transition-colors">
                English
              </button>
              <button onclick="changeLanguage('hi')" class="px-3 py-1 text-xs font-semibold rounded-md border border-gse-border ${savedLang === 'hi' ? 'bg-gse-green text-white' : 'bg-white text-gse-charcoal'} hover:bg-gse-cream transition-colors">
                हिन्दी
              </button>
            </div>
          </div>
        </div>

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

  // Setup theme toggle logic
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark-theme');
    const newTheme = isDark ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    
    // Update both icons
    const desktopIcon = document.querySelector('#theme-toggle-btn i');
    const mobileIcon = document.querySelector('#mobile-theme-toggle-btn i');
    
    if (desktopIcon) {
      desktopIcon.setAttribute('data-lucide', newTheme === 'dark' ? 'sun' : 'moon');
    }
    if (mobileIcon) {
      mobileIcon.setAttribute('data-lucide', newTheme === 'dark' ? 'sun' : 'moon');
    }
    
    lucide.createIcons();
  };

  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const mobileThemeToggleBtn = document.getElementById('mobile-theme-toggle-btn');
  if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
  if (mobileThemeToggleBtn) mobileThemeToggleBtn.addEventListener('click', toggleTheme);

  // Setup desktop language dropdown toggler
  const langDropdownBtn = document.getElementById('lang-dropdown-btn');
  const langDropdownMenu = document.getElementById('lang-dropdown-menu');
  if (langDropdownBtn && langDropdownMenu) {
    langDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = langDropdownMenu.classList.contains('invisible');
      if (isHidden) {
        langDropdownMenu.classList.remove('opacity-0', 'invisible');
      } else {
        langDropdownMenu.classList.add('opacity-0', 'invisible');
      }
    });
    
    document.addEventListener('click', () => {
      langDropdownMenu.classList.add('opacity-0', 'invisible');
    });
  }

  // Handle scroll background toggle
  const handleScroll = () => {
    const scrolled = window.scrollY > 50;
    const title = header.querySelector('.header-title');
    const subtitle = header.querySelector('.header-subtitle');
    const links = header.querySelectorAll('.nav-link');
    const themeBtn = header.querySelector('#theme-toggle-btn');
    const langBtn = header.querySelector('#lang-dropdown-btn');

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
      if (themeBtn) {
        themeBtn.classList.remove('text-white');
        themeBtn.classList.add('text-gse-charcoal');
      }
      if (langBtn) {
        langBtn.classList.remove('text-white');
        langBtn.classList.add('text-gse-charcoal');
      }
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
      if (themeBtn) {
        themeBtn.classList.add('text-white');
        themeBtn.classList.remove('text-gse-charcoal');
      }
      if (langBtn) {
        langBtn.classList.add('text-white');
        langBtn.classList.remove('text-gse-charcoal');
      }
      links.forEach(l => {
        if (!l.classList.contains('text-gse-gold')) {
          l.classList.remove('text-gse-charcoal');
          l.classList.add('text-white');
        }
      });
    }
  };

  window.addEventListener('scroll', handleScroll);
  // Initial call to check scrolled state on load
  setTimeout(handleScroll, 50);
}

// Render dynamic footer
function renderFooter(data) {
  const footer = document.getElementById('main-footer');
  if (!footer) return;

  const logoUrl = getImagePath(data.images.logo);
  const quickLinks = data.quickLinks;

  let linksHtml = '';
  quickLinks.forEach(link => {
    let relativeHref = link.href;
    if (relativeHref === '/') {
      relativeHref = 'index.html';
    } else if (relativeHref.startsWith('/#')) {
      relativeHref = 'index.html' + relativeHref.substring(1);
    } else if (relativeHref.startsWith('/')) {
      if (relativeHref.includes('#')) {
        const parts = relativeHref.substring(1).split('#');
        relativeHref = parts[0] + '.html#' + parts[1];
      } else {
        relativeHref = relativeHref.substring(1) + '.html';
      }
    }
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
// Initialize Google Translate
function initGoogleTranslate() {
  if (!document.getElementById('google_translate_element')) {
    const div = document.createElement('div');
    div.id = 'google_translate_element';
    div.style.display = 'none';
    document.body.appendChild(div);
  }
  
  window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
      pageLanguage: 'en',
      includedLanguages: 'en,hi',
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false
    }, 'google_translate_element');
  };
  
  const script = document.createElement('script');
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async = true;
  document.body.appendChild(script);
}

window.addEventListener('DOMContentLoaded', () => {
  initGoogleTranslate();
});
