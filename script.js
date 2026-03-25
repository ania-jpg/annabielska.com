document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. ASCII Spinner Ping-Pong Loop
    const spinnerFrames = ["✻", "✽", "✶", "✢"];
    let frameIndex = 0;
    let direction = 1;
    const spinnerEls = document.querySelectorAll('.ascii-spinner');

    if (spinnerEls.length > 0) {
        setInterval(() => {
            const frame = spinnerFrames[frameIndex];
            spinnerEls.forEach(el => el.textContent = frame);
            frameIndex += direction;
            if (frameIndex === spinnerFrames.length - 1 || frameIndex === 0) {
                direction *= -1;
            }
        }, 150);
    }

    // 3. Smooth Center Check for Mobile (No timeout lag)
    const wrappers = document.querySelectorAll('.work-image-wrapper');
    const checkCenter = () => {
        // Only run automatic center unblurring on mobile
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
            
            if (dist < minDistance) {
                minDistance = dist;
                closest = wrapper;
            }
        });

        wrappers.forEach(wrapper => {
            if (wrapper === closest) {
                wrapper.classList.add('in-view');
            } else {
                wrapper.classList.remove('in-view');
            }
        });
    };

    let ticking = false;
    // Bind to both window scroll and Lenis scroll for smoothness
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
