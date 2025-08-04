// Main JavaScript for MCNepal.fun Website

// DOM Elements
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeTooltips();
    initializeLazyLoading();
    initializeScrollToTop();
    initializeTypewriter();
});

// Navigation Functions
function initializeNavigation() {
    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }

    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Active navigation highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    });
}

// Scroll Effects
function initializeScrollEffects() {
    // Create intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.feature-card, .rank-card, .coin-package, .stats-card, .community-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-content');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Animation Functions
function initializeAnimations() {
    // Stagger animations for cards
    const cards = document.querySelectorAll('.feature-card, .rank-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Number counter animation
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }

    // Initialize counters when they come into view
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target') || counter.textContent);
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    });

    document.querySelectorAll('.stat-number').forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Tooltip System
function initializeTooltips() {
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 14px;
        pointer-events: none;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
        max-width: 200px;
        word-wrap: break-word;
    `;
    document.body.appendChild(tooltip);

    // Add tooltips to elements with data-tooltip attribute
    document.querySelectorAll('[data-tooltip]').forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const tooltipText = this.getAttribute('data-tooltip');
            tooltip.textContent = tooltipText;
            tooltip.style.opacity = '1';
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        });

        element.addEventListener('mouseleave', function() {
            tooltip.style.opacity = '0';
        });

        element.addEventListener('mousemove', function(e) {
            tooltip.style.left = e.pageX - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = e.pageY - tooltip.offsetHeight - 10 + 'px';
        });
    });
}

// Lazy Loading for Images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Scroll to Top Button
function initializeScrollToTop() {
    // Create scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
        border: none;
        color: white;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
    `;
    document.body.appendChild(scrollToTopBtn);

    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });

    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Hover effect
    scrollToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.1)';
        this.style.boxShadow = '0 6px 20px rgba(0, 212, 255, 0.5)';
    });

    scrollToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 4px 15px rgba(0, 212, 255, 0.3)';
    });
}

// Typewriter Effect
function initializeTypewriter() {
    const typewriterElements = document.querySelectorAll('.typewriter');
    
    typewriterElements.forEach(element => {
        const text = element.textContent;
        const speed = parseInt(element.getAttribute('data-speed')) || 100;
        
        element.textContent = '';
        element.style.borderRight = '2px solid #00d4ff';
        
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            } else {
                // Blinking cursor effect
                setInterval(() => {
                    element.style.borderRightColor = element.style.borderRightColor === 'transparent' ? '#00d4ff' : 'transparent';
                }, 500);
            }
        }
        
        // Start typing when element comes into view
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(element);
    });
}

// Copy to Clipboard Function
function copyToClipboard(text, element = null) {
    navigator.clipboard.writeText(text).then(function() {
        showNotification('Copied to clipboard!', 'success');
        
        if (element) {
            const originalText = element.innerHTML;
            element.innerHTML = '<i class="fas fa-check"></i> Copied!';
            element.style.background = 'var(--success-color)';
            
            setTimeout(() => {
                element.innerHTML = originalText;
                element.style.background = '';
            }, 2000);
        }
    }).catch(function(err) {
        console.error('Could not copy text: ', err);
        showNotification('Failed to copy to clipboard', 'error');
    });
}

// Server IP Copy Function
function copyServerIP() {
    const serverIP = document.getElementById('server-ip').textContent;
    const button = event.target.closest('.cta-button');
    copyToClipboard(serverIP, button);
}

// Notification System
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;

    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    notification.style.background = colors[type] || colors.info;

    document.body.appendChild(notification);

    // Slide in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Slide out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);

    // Click to dismiss
    notification.addEventListener('click', function() {
        this.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
        }, 300);
    });
}

// Form Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        const value = input.value.trim();
        const errorElement = input.nextElementSibling;

        // Remove existing error styling
        input.classList.remove('error');
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.remove();
        }

        // Validate based on input type
        if (!value) {
            showInputError(input, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && !validateEmail(value)) {
            showInputError(input, 'Please enter a valid email address');
            isValid = false;
        } else if (input.minLength && value.length < input.minLength) {
            showInputError(input, `Minimum ${input.minLength} characters required`);
            isValid = false;
        }
    });

    return isValid;
}

function showInputError(input, message) {
    input.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #ef4444;
        font-size: 12px;
        margin-top: 5px;
        margin-bottom: 10px;
    `;
    
    input.parentNode.insertBefore(errorElement, input.nextSibling);
}

// Loading State Management
function setLoadingState(element, isLoading) {
    if (isLoading) {
        element.disabled = true;
        element.innerHTML = '<span class="loading-spinner"></span> Loading...';
        element.classList.add('loading');
    } else {
        element.disabled = false;
        element.classList.remove('loading');
    }
}

// Utility Functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance optimization: throttle scroll events
const throttledScrollHandler = throttle(function() {
    // Add any scroll-related functionality here
}, 100);

window.addEventListener('scroll', throttledScrollHandler);

// Export functions for use in other scripts
window.MCNepal = {
    copyToClipboard,
    copyServerIP,
    showNotification,
    validateForm,
    setLoadingState,
    debounce,
    throttle
};