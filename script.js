(function() {
    'use strict';

    // ----- ЭЛЕМЕНТЫ ГЛАВ -----
    const chapters = {
        cover: document.getElementById('chapter-cover'),
        letter: document.getElementById('chapter-letter'),
        story: document.getElementById('chapter-story'),
        day: document.getElementById('chapter-day'),
        timer: document.getElementById('chapter-timer'),
        dress: document.getElementById('chapter-dress'),
        rsvp: document.getElementById('chapter-rsvp'),
        final: document.getElementById('chapter-final')
    };

    const sealClick = document.getElementById('sealClick');
    const letterBtn = document.getElementById('letterBtn');
    const bgMusic = document.getElementById('bg-music');

    // Таймер элементы
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    // ----- ЗВУК ОТКРЫТИЯ (Web Audio) -----
    function playOpenSound() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.3);
            // второй короткий щелчок
            setTimeout(() => {
                const osc2 = audioCtx.createOscillator();
                const gain2 = audioCtx.createGain();
                osc2.connect(gain2);
                gain2.connect(audioCtx.destination);
                osc2.frequency.value = 1200;
                osc2.type = 'sine';
                gain2.gain.setValueAtTime(0.15, audioCtx.currentTime);
                gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
                osc2.start(audioCtx.currentTime);
                osc2.stop(audioCtx.currentTime + 0.15);
            }, 100);
        } catch(e) { console.log('AudioContext not supported'); }
    }

    // ----- ПОКАЗ ГЛАВЫ (с анимацией) -----
    function showChapter(chapterElement, delay = 0) {
        return new Promise(resolve => {
            gsap.to(chapterElement, {
                opacity: 1,
                visibility: 'visible',
                duration: 0.8,
                delay: delay,
                ease: 'power2.out',
                onComplete: resolve
            });
        });
    }

    function hideChapter(chapterElement, duration = 0.6) {
        return new Promise(resolve => {
            gsap.to(chapterElement, {
                opacity: 0,
                visibility: 'hidden',
                duration: duration,
                ease: 'power2.in',
                onComplete: resolve
            });
        });
    }

    // ----- ТАЙМЕР С АНИМАЦИЕЙ ПЕРЕЛИСТЫВАНИЯ -----
    let timerInterval;
    function updateTimer() {
        const target = new Date('September 19, 2026 00:00:00').getTime();
        const now = Date.now();
        let diff = Math.max(0, target - now);

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        diff -= days * 1000 * 60 * 60 * 24;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        diff -= hours * 1000 * 60 * 60;
        const minutes = Math.floor(diff / (1000 * 60));
        diff -= minutes * 1000 * 60;
        const seconds = Math.floor(diff / 1000);

        const vals = {
            days: String(days).padStart(2, '0'),
            hours: String(hours).padStart(2, '0'),
            minutes: String(minutes).padStart(2, '0'),
            seconds: String(seconds).padStart(2, '0')
        };

        // Анимируем перелистывание для каждой цифры (эффект смены)
        ['days', 'hours', 'minutes', 'seconds'].forEach(id => {
            const el = document.getElementById(id);
            if (el.textContent !== vals[id]) {
                // Эффект "перелистывания": сначала сжимаем по вертикали, меняем текст, разжимаем
                gsap.to(el, {
                    scaleY: 0,
                    duration: 0.15,
                    ease: 'power2.in',
                    onComplete: () => {
                        el.textContent = vals[id];
                        gsap.to(el, {
                            scaleY: 1,
                            duration: 0.2,
                            ease: 'power2.out'
                        });
                    }
                });
            }
        });
    }

    // ----- ГЛАВНАЯ ЛОГИКА ПОСЛЕДОВАТЕЛЬНОГО ПОКАЗА -----
    async function startStory() {
        // 1. Конверт: анимация печати
        const seal = document.querySelector('.seal');
        const sealWrapper = document.querySelector('.seal-wrapper');
        const envelopeImg = document.querySelector('.envelope-image');

        // Продавливание печати
        await gsap.to(seal, {
            scale: 0.92,
            duration: 0.4,
            ease: 'power2.inOut'
        });

        // Отделение печати (поднимается и вращается)
        await gsap.to(sealWrapper, {
            y: -50,
            rotation: 15,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.inOut'
        });

        // Звук открытия
        playOpenSound();

        // Конверт раскрывается (имитация: увеличиваем масштаб и затемняем)
        await gsap.to(envelopeImg, {
            scale: 1.05,
            filter: 'brightness(1.3)',
            duration: 0.6,
            ease: 'power2.out'
        });

        // Скрываем конверт
        await hideChapter(chapters.cover, 0.8);

        // 2. Показываем письмо
        await showChapter(chapters.letter, 0.2);

        // Ждём клика по кнопке
        return new Promise(resolve => {
            letterBtn.addEventListener('click', async function onClick() {
                letterBtn.removeEventListener('click', onClick);
                await hideChapter(chapters.letter, 0.6);
                resolve();
            });
        });
    }

    async function continueStory() {
        // 3. История (фото + имена)
        await showChapter(chapters.story, 0.3);
        // Анимация появления элементов
        const storyPhoto = document.querySelector('.story-photo-wrapper');
        const storyOverlay = document.querySelector('.story-overlay');
        gsap.fromTo(storyPhoto, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' });
        gsap.fromTo(storyOverlay.children, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, stagger: 0.3, delay: 0.5, ease: 'power2.out' });

        // Ждём 4 секунды, затем переходим
        await new Promise(r => setTimeout(r, 4500));
        await hideChapter(chapters.story, 0.8);

        // 4. День свадьбы
        await showChapter(chapters.day, 0.3);
        gsap.fromTo('.day-event', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1, stagger: 0.4, ease: 'power2.out' });
        await new Promise(r => setTimeout(r, 4000));
        await hideChapter(chapters.day, 0.8);

        // 5. Таймер
        await showChapter(chapters.timer, 0.3);
        // Анимируем появление таймера
        gsap.fromTo('.timer-block', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1, stagger: 0.2, ease: 'back.out(1.7)' });
        timerInterval = setInterval(updateTimer, 1000);
        updateTimer();
        await new Promise(r => setTimeout(r, 5000));
        await hideChapter(chapters.timer, 0.8);

        // 6. Dress Code
        await showChapter(chapters.dress, 0.3);
        gsap.fromTo('.color-swatch', { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.5)' });
        await new Promise(r => setTimeout(r, 4000));
        await hideChapter(chapters.dress, 0.8);

        // 7. RSVP
        await showChapter(chapters.rsvp, 0.3);
        gsap.fromTo('.rsvp-btn', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.3, ease: 'power2.out' });
        // Ждём клика на одну из кнопок
        const rsvpButtons = document.querySelectorAll('.rsvp-btn');
        let rsvpClicked = false;
        const rsvpPromise = new Promise(resolve => {
            rsvpButtons.forEach(btn => {
                btn.addEventListener('click', function handler() {
                    if (rsvpClicked) return;
                    rsvpClicked = true;
                    rsvpButtons.forEach(b => b.removeEventListener('click', handler));
                    // Анимация нажатия
                    gsap.to(btn, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
                    setTimeout(resolve, 500);
                });
            });
        });
        await rsvpPromise;
        await hideChapter(chapters.rsvp, 0.8);

        // 8. Финал
        await showChapter(chapters.final, 0.3);
        gsap.fromTo('.final-text', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out' });
        // Останавливаем таймер
        clearInterval(timerInterval);
    }

    // ----- ЗАПУСК МУЗЫКИ (при первом касании) -----
    function startMusic() {
        if (bgMusic.paused) {
            bgMusic.play().catch(e => console.log('Music play blocked'));
        }
    }

    // ----- ОБРАБОТЧИК НА ПЕЧАТИ -----
    sealClick.addEventListener('click', async function(e) {
        e.preventDefault();
        sealClick.style.pointerEvents = 'none'; // блокируем повторный клик
        startMusic();
        await startStory();
        // После письма запускаем остальные главы
        continueStory();
    });

    // Для мобильных: touchstart
    sealClick.addEventListener('touchstart', function(e) {
        e.preventDefault();
        if (!sealClick.style.pointerEvents || sealClick.style.pointerEvents !== 'none') {
            sealClick.click();
        }
    }, { passive: false });

    // ----- ПРЕДОТВРАЩАЕМ СКРОЛЛ НА КОНВЕРТЕ -----
    document.querySelector('.cover-chapter')?.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });

    // ----- ИНИЦИАЛИЗАЦИЯ: скрываем все главы, кроме конверта -----
    Object.keys(chapters).forEach(key => {
        if (key !== 'cover') {
            chapters[key].style.opacity = '0';
            chapters[key].style.visibility = 'hidden';
        }
    });
    chapters.cover.style.opacity = '1';
    chapters.cover.style.visibility = 'visible';
    chapters.cover.style.pointerEvents = 'auto';

    console.log('Свадебное приглашение загружено. Нажмите на печать.');
})();