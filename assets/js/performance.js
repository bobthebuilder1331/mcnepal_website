// Performance optimization for MCNepal.fun

class PerformanceOptimizer {
    constructor() {
        this.lazyImages = [];
        this.intersectionObserver = null;
        this.resourceLoadTimes = {};
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.preloadCriticalResources();
        this.optimizeImages();
        this.setupServiceWorker();
        this.monitorPerformance();
        this.setupResourceHints();
    }

    setupLazyLoading() {
        // Enhanced lazy loading for images
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Create a new image to preload
                    const newImg = new Image();
                    newImg.onload = () => {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        img.classList.remove('loading');
                    };
                    newImg.onerror = () => {
                        img.src = 'assets/images/server_icon.png';
                        img.classList.add('error');
                    };
                    newImg.src = img.dataset.src;
                    
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        // Observe all images with data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.classList.add('loading');
            imageObserver.observe(img);
        });

        // Lazy load background images
        const bgImageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const bgImage = element.dataset.bg;
                    if (bgImage) {
                        element.style.backgroundImage = `url(${bgImage})`;
                        element.classList.add('bg-loaded');
                        bgImageObserver.unobserve(element);
                    }
                }
            });
        });

        document.querySelectorAll('[data-bg]').forEach(el => {
            bgImageObserver.observe(el);
        });
    }

    preloadCriticalResources() {
        const criticalResources = [
            'assets/css/style.css',
            'assets/js/main.js',
            'assets/images/server_icon.png'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            
            if (resource.endsWith('.css')) {
                link.as = 'style';
            } else if (resource.endsWith('.js')) {
                link.as = 'script';
            } else if (resource.match(/\.(png|jpg|jpeg|webp|svg)$/)) {
                link.as = 'image';
            }
            
            link.href = resource;
            document.head.appendChild(link);
        });
    }

    optimizeImages() {
        // Add loading=lazy to images that don't have data-src
        document.querySelectorAll('img:not([data-src]):not([loading])').forEach(img => {
            if (!img.src.includes('data:')) {
                img.loading = 'lazy';
                img.decoding = 'async';
            }
        });

        // Convert images to WebP if supported
        this.convertToWebP();
    }

    convertToWebP() {
        const supportsWebP = this.checkWebPSupport();
        
        if (supportsWebP) {
            document.querySelectorAll('img[data-webp]').forEach(img => {
                if (img.dataset.webp) {
                    img.dataset.src = img.dataset.webp;
                }
            });
        }
    }

    checkWebPSupport() {
        return new Promise(resolve => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }

    monitorPerformance() {
        // Monitor Core Web Vitals
        this.measureCLS();
        this.measureFID();
        this.measureLCP();
        
        // Monitor resource loading
        this.trackResourceTiming();
        
        // Monitor JavaScript errors
        this.setupErrorTracking();
    }

    measureCLS() {
        if ('LayoutShift' in window) {
            let clsValue = 0;
            let clsSessionValue = 0;
            let sessionEntries = [];

            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                        const firstSessionEntry = sessionEntries[0];
                        const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

                        if (sessionEntries.length === 0 || 
                            entry.startTime - lastSessionEntry.startTime < 1000 &&
                            entry.startTime - firstSessionEntry.startTime < 5000) {
                            sessionEntries.push(entry);
                            clsSessionValue += entry.value;
                        } else {
                            clsValue = Math.max(clsValue, clsSessionValue);
                            sessionEntries = [entry];
                            clsSessionValue = entry.value;
                        }
                    }
                }
                clsValue = Math.max(clsValue, clsSessionValue);
                console.log('CLS:', clsValue);
            }).observe({ entryTypes: ['layout-shift'] });
        }
    }

    measureFID() {
        if ('PerformanceEventTiming' in window) {
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    const fid = entry.processingStart - entry.startTime;
                    console.log('FID:', fid);
                    break;
                }
            }).observe({ entryTypes: ['first-input'], buffered: true });
        }
    }

    measureLCP() {
        if ('LargestContentfulPaint' in window) {
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            }).observe({ entryTypes: ['largest-contentful-paint'], buffered: true });
        }
    }

    trackResourceTiming() {
        if ('PerformanceObserver' in window) {
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    this.resourceLoadTimes[entry.name] = {
                        duration: entry.duration,
                        size: entry.transferSize,
                        type: entry.initiatorType
                    };
                }
            }).observe({ entryTypes: ['resource'] });
        }
    }

    setupErrorTracking() {
        window.addEventListener('error', (event) => {
            console.error('JavaScript Error:', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            });
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled Promise Rejection:', event.reason);
        });
    }

    setupResourceHints() {
        // DNS prefetch for external resources
        const externalDomains = [
            'fonts.googleapis.com',
            'fonts.gstatic.com',
            'cdnjs.cloudflare.com',
            'cdn.jsdelivr.net'
        ];

        externalDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = `//${domain}`;
            document.head.appendChild(link);
        });

        // Preconnect to critical third-party origins
        const criticalOrigins = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com'
        ];

        criticalOrigins.forEach(origin => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = origin;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }

    // Utility methods for performance optimization
    debounce(func, wait, immediate) {
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

    throttle(func, limit) {
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

    // Critical CSS injection
    injectCriticalCSS(css) {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // Prefetch next page resources
    prefetchNextPage(url) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
    }

    // Image compression and optimization
    compressImage(file, quality = 0.8) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                canvas.toBlob(resolve, 'image/webp', quality);
            };

            img.src = URL.createObjectURL(file);
        });
    }

    // Bundle size analyzer
    analyzeBundleSize() {
        const resources = performance.getEntriesByType('resource');
        const bundleSizes = {};

        resources.forEach(resource => {
            if (resource.name.includes('.js') || resource.name.includes('.css')) {
                bundleSizes[resource.name] = {
                    transferSize: resource.transferSize,
                    decodedBodySize: resource.decodedBodySize,
                    loadTime: resource.duration
                };
            }
        });

        console.table(bundleSizes);
        return bundleSizes;
    }

    // Performance metrics reporting
    getPerformanceMetrics() {
        const metrics = {};
        
        // Navigation timing
        const navTiming = performance.getEntriesByType('navigation')[0];
        if (navTiming) {
            metrics.pageLoadTime = navTiming.loadEventEnd - navTiming.fetchStart;
            metrics.domContentLoaded = navTiming.domContentLoadedEventEnd - navTiming.fetchStart;
            metrics.firstByte = navTiming.responseStart - navTiming.fetchStart;
        }

        // Resource timing
        metrics.resourceCount = performance.getEntriesByType('resource').length;
        metrics.totalResourceSize = performance.getEntriesByType('resource')
            .reduce((total, resource) => total + (resource.transferSize || 0), 0);

        // Memory usage (if available)
        if (performance.memory) {
            metrics.memoryUsage = {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            };
        }

        return metrics;
    }
}

// Initialize performance optimizer
document.addEventListener('DOMContentLoaded', () => {
    window.performanceOptimizer = new PerformanceOptimizer();
});

// Export for use in other scripts
window.PerformanceOptimizer = PerformanceOptimizer;