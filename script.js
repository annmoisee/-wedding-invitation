(function() {
    'use strict';

    // ----- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ РАБОТЫ С GSAP НА ПРОМИСАХ -----
    function animate(el, props, duration = 0.8, ease = 'power2.inOut') {
        return new Promise(resolve => {
            gsap.to(el, { ...props, duration, ease, onComplete: resolve });
        });
    }

    function showChapter(el, delay = 0) {
        return new Promise(resolve => {
            gsap.to(el, {
                opacity: 1,
                visibility: 'visible',
                duration: 0.6,
                delay: delay,
                ease: 'power2.out',
                onComplete: resolve
            });
        });
    }

    function hideChapter(el, duration = 0.6) {
        return new Promise(resolve => {
            gsap.to(el, {
                opacity: 0,
                visibility: 'hidden',
                duration: duration,
                ease: 'power2.in',
                onComplete: resolve
            });
        });
    }

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
    const seal = document.getElementById('seal');
    const sealArea = document.getElementById('sealArea');
    const envelopeImg = document.getElementById('envelopeImg');

    // ----- ТАЙМЕР -----
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    let timerInterval;

    function updateTimer() {
        const target = new Date('September 19, 2026 00:00:00').getTime();
        const now = Date.now();
        let diff = Math.max(0, target - now);
        const days = Math.floor(diff / (1000*60*60*24));
        diff -= days * (1000*60*60*24);
        const hours = Math.floor(diff / (1000*60*60));
        diff -= hours * (1000*60*60);
        const minutes = Math.floor(diff / (1000*60));
        diff -= minutes * (1000*60);
        const seconds = Math.floor(diff / 1000);

        const vals = {
            days: String(days).padStart(2, '0'),
            hours: String(hours).padStart(2, '0'),
            minutes: String(minutes).padStart(2, '0'),
            seconds: String(seconds).padStart(2, '0')
        };

        ['days','hours','minutes','seconds'].forEach(id => {
            const el = document.getElementById(id);
            if (el.textContent !== vals[id]) {
                // Эффект перелистывания
                gsap.to(el, {
                    scaleY: 0,
                    duration: 0.15,
                    ease: 'power2.in',
                    onComplete: () => {
                        el.textContent = vals[id];
                        gsap.to(el, { scaleY: 1, duration: 0.2, ease: 'power2.out' });
                    }
                });
            }
        });
    }

    // ----- ЗВУК ОТКРЫТИЯ (Web Audio) -----
    function playOpenSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 800;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.3);
            setTimeout(() => {
                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                osc2.connect(gain2);
                gain2.connect(ctx.destination);
                osc2.frequency.value = 1200;
                osc2.type = 'sine';
                gain2.gain.setValueAtTime(0.15, ctx.currentTime);
                gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
                osc2.start(ctx.currentTime);
                osc2.stop(ctx.currentTime + 0.15);
            }, 100);
        } catch(e) { console.log('AudioContext не поддерживается'); }
    }

    // ----- МУЗЫКА -----
    function startMusic() {
        if (bgMusic.paused) {
            bgMusic.play().catch(e => console.log('Музыка не запустилась'));
        }
    }

    // ----- ГЛАВНАЯ ЛОГИКА ПОСЛЕДОВАТЕЛЬНЫХ АНИМАЦИЙ -----
    async function startStory() {
        try {
            // 1. Анимация печати: продавливание
            await animate(seal, { scale: 0.92 }, 0.4, 'power2.inOut');
            // 2. Отделение печати (улетает вверх с вращением)
            await animate(sealArea, { y: -80, rotation: 20, opacity: 0 }, 0.8, 'power3.inOut');
            // 3. Звук
            playOpenSound();
            // 4. Конверт "раскрывается" (имитация: блик, увеличение)
            await animate(envelopeImg, { scale: 1.04, filter: 'brightness(1.3)' }, 0.6, 'power2.out');
            // 5. Скрываем конверт
            await hideChapter(chapters.cover, 0.8);
            // 6. Показываем письмо
            await showChapter(chapters.letter, 0.2);
            // 7. Ждём клика по кнопке
            return new Promise(resolve => {
                const handler = () => {
                    letterBtn.removeEventListener('click', handler);
                    resolve();
                };
                letterBtn.addEventListener('click', handler);
            });
        } catch(e) {
            console.error('Ошибка в startStory:', e);
        }
    }

    async function continueStory() {
        try {
            // 3. История
            await hideChapter(chapters.letter, 0.6);
            await showChapter(chapters.story, 0.3);
            // Анимация элементов истории
            const photo = document.querySelector('.photo-wrapper');
            const textBlock = document.querySelector('.story-text-block');
            await animate(photo, { opacity: 1, y: 0 }, 1.2, 'power2.out');
            await animate(textBlock.children, { opacity: 1, y: 0 }, 1, 'power2.out', 0.3);
            await delay(4000);
            await hideChapter(chapters.story, 0.8);

            // 4. День свадьбы
            await showChapter(chapters.day, 0.3);
            const events = document.querySelectorAll('.day-event');
            for (let el of events) {
                await animate(el, { opacity: 1, x: 0 }, 1, 'power2.out');
            }
            await delay(4000);
            await hideChapter(chapters.day, 0.8);

            // 5. Таймер
            await showChapter(chapters.timer, 0.3);
            const blocks = document.querySelectorAll('.timer-block');
            for (let el of blocks) {
                await animate(el, { opacity: 1, scale: 1 }, 0.8, 'back.out(1.7)');
            }
            timerInterval = setInterval(updateTimer, 1000);
            updateTimer();
            await delay(5000);
            await hideChapter(chapters.timer, 0.8);

            // 6. Dress Code
            await showChapter(chapters.dress, 0.3);
            const swatches = document.querySelectorAll('.swatch');
            for (let el of swatches) {
                await animate(el, { opacity: 1, scale: 1 }, 0.7, 'back.out(1.5)');
            }
            await delay(4000);
            await hideChapter(chapters.dress, 0.8);

            // 7. RSVP
            await showChapter(chapters.rsvp, 0.3);
            const btns = document.querySelectorAll('.rsvp-btn');
            for (let el of btns) {
                await animate(el, { opacity: 1, y: 0 }, 0.8, 'power2.out');
            }
            // Ждём клика
            const rsvpPromise = new Promise(resolve => {
                let clicked = false;
                const handler = (e) => {
                    if (clicked) return;
                    clicked = true;
                    const btn = e.currentTarget;
                    gsap.to(btn, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
                    btns.forEach(b => b.removeEventListener('click', handler));
                    setTimeout(resolve, 500);
                };
                btns.forEach(b => b.addEventListener('click', handler));
            });
            await rsvpPromise;
            await hideChapter(chapters.rsvp, 0.8);

            // 8. Финал
            await showChapter(chapters.final, 0.3);
            const finalText = document.querySelector('.final-text');
            await animate(finalText, { opacity: 1, y: 0 }, 1.5, 'power2.out');
            clearInterval(timerInterval);
        } catch(e) {
            console.error('Ошибка в continueStory:', e);
        }
    }

    function delay(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    // ----- ОБРАБОТЧИК КЛИКА ПО ПЕЧАТИ -----
    sealClick.addEventListener('click', async function(e) {
        e.preventDefault();
        sealClick.style.pointerEvents = 'none'; // блокируем повтор
        startMusic();
        await startStory();
        await continueStory();
    });

    // Для мобильных
    sealClick.addEventListener('touchstart', function(e) {
        e.preventDefault();
        if (!sealClick.style.pointerEvents || sealClick.style.pointerEvents !== 'none') {
            sealClick.click();
        }
    }, { passive: false });

    // ----- БЛОКИРОВКА СКРОЛЛА НА КОНВЕРТЕ -----
    document.querySelector('#chapter-cover')?.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

    // ----- ИНИЦИАЛИЗАЦИЯ: все главы скрыты, кроме конверта -----
    Object.keys(chapters).forEach(key => {
        if (key !== 'cover') {
            gsap.set(chapters[key], { opacity: 0, visibility: 'hidden' });
        }
    });
    gsap.set(chapters.cover, { opacity: 1, visibility: 'visible', pointerEvents: 'auto' });

    // Дополнительно: если фото не загружено, покажем заглушку
    const storyPhoto = document.getElementById('storyPhoto');
    storyPhoto.onerror = function() {
        this.style.display = 'none';
        const wrapper = this.parentNode;
        const placeholder = document.createElement('div');
        placeholder.style.cssText = 'width:100%; padding-bottom:70%; background:#2a1f1a; border-radius:20px; display:flex; align-items:center; justify-content:center; color:#f5e6d3; font-family:Playfair Display; font-size:1.2rem;';
        placeholder.textContent = 'Фото';
        wrapper.appendChild(placeholder);
    };
    // То же для финала
    const finalBg = document.getElementById('finalBg');
    finalBg.onerror = function() {
        this.style.background = '#2a1f1a';
        this.style.opacity = '1';
    };

    console.log('Свадебное приглашение загружено. Нажмите на печать.');
})();