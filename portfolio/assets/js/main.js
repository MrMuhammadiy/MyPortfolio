/**
 * Shared front-end behavior for all portfolio pages.
 *
 * Responsibilities:
 * - initialize Lucide icons
 * - write the current year into footer placeholders
 * - reveal sections on scroll
 * - add hover glow coordinates to interactive cards
 * - toggle a compact nav state while scrolling
 */

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealBlocks = document.querySelectorAll('.is-reveal');
    const interactiveBlocks = document.querySelectorAll('.hover-glow');
    const navigationBar = document.querySelector('.site-nav');
    const yearPlaceholders = document.querySelectorAll('[data-current-year]');
    const rootElement = document.documentElement;

    initializeIcons();
    writeCurrentYear(yearPlaceholders);
    setupRevealAnimation(revealBlocks, prefersReducedMotion);
    setupInteractiveGlow(interactiveBlocks, prefersReducedMotion);
    setupTypewriter();
    setupPhoneTypewriter();
});

/**
 * Typewriter effect for the main hero title
 */
function setupTypewriter() {
    const target = document.querySelector('.hero-title__accent');
    if (!target) return;

    const phrases = [
        "Abdumannobov Muhammadiy",
        "Mr.FoxCoder",
        "Mobile Developer"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            target.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            target.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at the end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

/**
 * Specialized typewriter for the Smartphone screen
 */
function setupPhoneTypewriter() {
    const target = document.getElementById('phone-typewriter');
    if (!target) return;

    const codePhrases = [
        "import 'flutter/material.dart';",
        "const App = () => <Mobile />;",
        "func renderUI() -> View",
        "while(isCoding) { coffee++ }",
        "Status: 100% Optimized",
        "Build success: v2.5.0"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let speed = 80;

    function typeCode() {
        const current = codePhrases[phraseIndex];

        if (isDeleting) {
            target.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            speed = 40;
        } else {
            target.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            speed = 100;
        }

        if (!isDeleting && charIndex === current.length) {
            isDeleting = true;
            speed = 1500;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % codePhrases.length;
            speed = 400;
        }

        setTimeout(typeCode, speed);
    }

    typeCode();
}

function initializeIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function writeCurrentYear(placeholders) {
    const currentYear = String(new Date().getFullYear());

    placeholders.forEach((placeholder) => {
        placeholder.textContent = currentYear;
    });
}

function setupRevealAnimation(revealBlocks, prefersReducedMotion) {
    if (prefersReducedMotion) {
        revealBlocks.forEach((block) => {
            block.classList.add('is-visible');
        });
        return;
    }

    if (!('IntersectionObserver' in window)) {
        revealBlocks.forEach((block) => {
            block.classList.add('is-visible');
        });
        return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.16,
        rootMargin: '0px 0px -40px 0px'
    });

    revealBlocks.forEach((block) => {
        revealObserver.observe(block);
    });
}

function setupInteractiveGlow(interactiveBlocks, prefersReducedMotion) {
    const supportsHover = window.matchMedia('(hover: hover)').matches;

    if (prefersReducedMotion || !supportsHover) {
        return;
    }

    interactiveBlocks.forEach((block) => {
        block.addEventListener('mousemove', (event) => {
            const blockBounds = block.getBoundingClientRect();
            const pointerX = event.clientX - blockBounds.left;
            const pointerY = event.clientY - blockBounds.top;

            block.style.setProperty('--mouse-x', `${pointerX}px`);
            block.style.setProperty('--mouse-y', `${pointerY}px`);
        });

        block.addEventListener('mouseleave', () => {
            block.style.removeProperty('--mouse-x');
            block.style.removeProperty('--mouse-y');
        });
    });
}

function setupStickyNavigation(navigationBar) {
    if (!navigationBar) {
        return;
    }

    const updateNavigationState = () => {
        navigationBar.classList.toggle('is-scrolled', window.scrollY > 24);
    };

    updateNavigationState();
    window.addEventListener('scroll', updateNavigationState, { passive: true });
}

function setupPointerParallax(rootElement, prefersReducedMotion) {
    const supportsHover = window.matchMedia('(hover: hover)').matches;

    if (!rootElement || prefersReducedMotion || !supportsHover) {
        return;
    }

    const updatePointer = (event) => {
        const horizontalOffset = ((event.clientX / window.innerWidth) - 0.5) * 24;
        const verticalOffset = ((event.clientY / window.innerHeight) - 0.5) * 24;

        rootElement.style.setProperty('--pointer-shift-x', `${horizontalOffset.toFixed(2)}px`);
        rootElement.style.setProperty('--pointer-shift-y', `${verticalOffset.toFixed(2)}px`);
    };

    const resetPointer = () => {
        rootElement.style.setProperty('--pointer-shift-x', '0px');
        rootElement.style.setProperty('--pointer-shift-y', '0px');
    };

    window.addEventListener('mousemove', updatePointer, { passive: true });
    window.addEventListener('mouseleave', resetPointer);
}
