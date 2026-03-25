document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
        duration: 2.0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        wheelMultiplier: 0.7,
        mouseMultiplier: 0.7,
        smoothTouch: false,
        touchMultiplier: 1,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. ASCII Spinner Ping-Pong Loop & Document Meta Title
    const spinnerFrames = ["✻", "✽", "✶", "✢"];
    let frameIndex = 0;
    let direction = 1;
    const spinnerEls = document.querySelectorAll('.ascii-spinner');

    if (spinnerEls.length > 0) {
        setInterval(() => {
            const frame = spinnerFrames[frameIndex];
            spinnerEls.forEach(el => el.textContent = frame);
            document.title = `${frame} Anna Bielska ${frame}`;
            
            frameIndex += direction;
            if (frameIndex === spinnerFrames.length - 1 || frameIndex === 0) {
                direction *= -1;
            }
        }, 150);
    }

    // 3. Smooth Center Check for Image Unblurs
    const wrappers = document.querySelectorAll('.work-image-wrapper');
    const checkCenter = () => {
        if (window.innerWidth >= 768) {
            wrappers.forEach(w => w.classList.remove('in-view'));
            return;
        }

        const viewportCenter = window.innerHeight / 2;
        let closest = null;
        let minDistance = Infinity;

        wrappers.forEach(wrapper => {
            const rect = wrapper.getBoundingClientRect();
            const elementCenter = rect.top + rect.height / 2;
            const dist = Math.abs(viewportCenter - elementCenter);
            if (dist < minDistance) { minDistance = dist; closest = wrapper; }
        });

        wrappers.forEach(wrapper => {
            if (wrapper === closest) wrapper.classList.add('in-view');
            else wrapper.classList.remove('in-view');
        });
    };

    // 4. Staggered Text Reveal Observer
    const textEls = document.querySelectorAll('main h2, main li, main p, header h1, header .header-details');
    const textObserver = new IntersectionObserver((entries) => {
        let delayCount = 0;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = `${delayCount * 100}ms`;
                entry.target.classList.add('revealed');
                delayCount++;
            } else {
                entry.target.style.transitionDelay = '0ms';
                entry.target.classList.remove('revealed');
            }
        });
    }, { rootMargin: "0px 0px -20px 0px", threshold: 0.1 });
    
    textEls.forEach(el => textObserver.observe(el));

    let ticking = false;
    const onScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                checkCenter();
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', onScroll);
    lenis.on('scroll', onScroll);
    window.addEventListener('resize', checkCenter);
    checkCenter();
});
