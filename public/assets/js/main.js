lucide.createIcons();

// Mobile Menu Toggle Logic
const menuBtn = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const iconMenu = document.getElementById('icon-menu');
const iconClose = document.getElementById('icon-close');
const mainNav = document.getElementById('main-nav');
let isMenuOpen = false;

function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
        mobileMenu.classList.remove('translate-x-full');
        
        // Icon Animation
        iconMenu.classList.add('opacity-0', 'rotate-90', 'scale-0');
        iconMenu.classList.remove('opacity-100', 'rotate-0', 'scale-100');
        
        iconClose.classList.remove('opacity-0', '-rotate-90', 'scale-0');
        iconClose.classList.add('opacity-100', 'rotate-0', 'scale-100');
        
        document.body.classList.add('menu-open');
        
        // Nav Solid Background
        if (mainNav) mainNav.classList.add('nav-solid');
    } else {
        mobileMenu.classList.add('translate-x-full');
        
        // Icon Animation
        iconMenu.classList.remove('opacity-0', 'rotate-90', 'scale-0');
        iconMenu.classList.add('opacity-100', 'rotate-0', 'scale-100');
        
        iconClose.classList.add('opacity-0', '-rotate-90', 'scale-0');
        iconClose.classList.remove('opacity-100', 'rotate-0', 'scale-100');

        document.body.classList.remove('menu-open');
        
        // Nav Solid Background
        if (mainNav) mainNav.classList.remove('nav-solid');
    }
}

function closeMenu() {
    isMenuOpen = false;
    mobileMenu.classList.add('translate-x-full');
    
    // Icon Animation
    iconMenu.classList.remove('opacity-0', 'rotate-90', 'scale-0');
    iconMenu.classList.add('opacity-100', 'rotate-0', 'scale-100');
    
    iconClose.classList.add('opacity-0', '-rotate-90', 'scale-0');
    iconClose.classList.remove('opacity-100', 'rotate-0', 'scale-100');

    document.body.classList.remove('menu-open');
     
    // Nav Solid Background
    if (mainNav) mainNav.classList.remove('nav-solid');
}

if (menuBtn) {
    menuBtn.addEventListener('click', toggleMenu);
}

// Mobile Services Toggle Logic
function toggleMobileServices() {
    const list = document.getElementById('mobile-services-list');
    const icon = document.getElementById('mobile-services-icon');
    
    if (list.classList.contains('mobile-sub-hidden')) {
        list.classList.remove('mobile-sub-hidden');
        list.classList.add('mobile-sub-visible');
        icon.style.transform = 'rotate(180deg)';
    } else {
        list.classList.add('mobile-sub-hidden');
        list.classList.remove('mobile-sub-visible');
        icon.style.transform = 'rotate(0deg)';
    }
}

// Mobile Resources Toggle Logic
function toggleMobileResources() {
    const list = document.getElementById('mobile-resources-list');
    const icon = document.getElementById('mobile-resources-icon');
    
    if (list.classList.contains('mobile-sub-hidden')) {
        list.classList.remove('mobile-sub-hidden');
        list.classList.add('mobile-sub-visible');
        icon.style.transform = 'rotate(180deg)';
    } else {
        list.classList.add('mobile-sub-hidden');
        list.classList.remove('mobile-sub-visible');
        icon.style.transform = 'rotate(0deg)';
    }
}

// SCROLL SPY LOGIC FOR SIDEBAR
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.sidebar-link');
    const sections = document.querySelectorAll('.service-section');
    
    // Check if we are on a page with scroll spy sections
    if (sections.length === 0) return;

    // Options for Intersection Observer
    // rootMargin: -100px from top ensures it triggers when the section title is near the top
    // threshold: 0 means trigger as soon as one pixel is visible (within the margin constraints)
    const observerOptions = {
        root: null,
        rootMargin: '-100px 0px -60% 0px', 
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Deactivate all links
                links.forEach(link => {
                    // Remove Active Styles
                    link.classList.remove('bg-[#3305d8]/5', 'text-[#3305d8]', 'font-semibold');
                    // Add Inactive Styles
                    link.classList.add('text-slate-600', 'font-medium', 'hover:text-slate-900', 'hover:bg-slate-50/80');
                    
                    // Handle Icon Color
                    const icon = link.querySelector('svg');
                    if(icon) {
                        icon.classList.remove('text-[#3305d8]');
                        icon.classList.add('text-slate-400', 'group-hover:text-slate-600');
                    }
                });

                // Activate the current link
                const activeLink = document.querySelector(`.sidebar-link[data-target="${entry.target.id}"]`);
                if (activeLink) {
                    // Remove Inactive Styles
                    activeLink.classList.remove('text-slate-600', 'font-medium', 'hover:text-slate-900', 'hover:bg-slate-50/80');
                    // Add Active Styles
                    activeLink.classList.add('bg-[#3305d8]/5', 'text-[#3305d8]', 'font-semibold');
                    
                    // Handle Icon Color
                    const icon = activeLink.querySelector('svg');
                    if(icon) {
                        icon.classList.remove('text-slate-400', 'group-hover:text-slate-600');
                        icon.classList.add('text-[#3305d8]');
                    }
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
});
