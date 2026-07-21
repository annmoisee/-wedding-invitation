(function() {
    'use strict';

    // ----- ЭЛЕМЕНТЫ -----
    const cover = document.getElementById('cover');
    const letter = document.getElementById('letter');
    const invitation = document.getElementById('invitation');
    const sealClick = document.getElementById('sealClick');
    const bgMusic = document.getElementById('bg-music');

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    // ----- СОСТОЯНИЕ -----
    let isOpened = false;
    let animationRunning = false;

    // ----- ФУНКЦИЯ ОБНОВЛЕНИЯ ТАЙМЕРА -----
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

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    // Обновляем таймер каждую секунду
    setInterval(updateTimer, 1000);
    updateTimer();

    // ----- АНИМАЦИЯ ОТКРЫТИЯ (GSAP) -----
    function openInvitation() {
        if (animationRunning || isOpened) return;
        animationRunning = true;

        // 1. Запустить музыку (если ещё не играет)
        if (bgMusic.paused) {
            bgMusic.play().catch(err => console.log('Audio play failed:', err));
        }

        // 2. Создаём таймлайн
        const tl = gsap.timeline({
            defaults: { ease: 'power2.inOut' },
            onComplete: () => {
                animationRunning = false;
                isOpened = true;
                // Показываем приглашение и даём возможность скролла
                invitation.style.pointerEvents = 'auto';
                // Скрываем письмо после того, как оно показано
                gsap.to(letter, {
                    opacity: 0,
                    visibility: 'hidden',
                    duration: 0.8,
                    delay: 0.5,
                    ease: 'power2.in'
                });
                // Показываем приглашение
                gsap.to(invitation, {
                    opacity: 1,
                    visibility: 'visible',
                    duration: 1.2,
                    ease: 'power2.out',
                    delay: 0.3
                });
            }
        });

        // 2.1 Конверт: улетает вверх и исчезает
        tl.to(cover, {
            y: '-100%',
            opacity: 0,
            duration: 1.2,
            ease: 'power3.inOut',
            onComplete: () => {
                cover.style.pointerEvents = 'none';
            }
        }, 0);

        // 2.2 Письмо: появляется и выезжает снизу вверх
        tl.to(letter, {
            opacity: 1,
            visibility: 'visible',
            duration: 0.2,
            ease: 'none'
        }, 0.4)
        .fromTo(letter, 
            { y: '100%' },
            { y: '0%', duration: 1.4, ease: 'power3.out' },
            '-=0.1'
        )
        .to(letter, {
            opacity: 1,
            duration: 0.2,
            ease: 'none'
        }, '-=0.6');

        // 2.3 Анимация текста письма (появление по буквам или fade)
        const letterText = document.querySelector('.letter-text');
        tl.fromTo(letterText, 
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' },
            '+=0.3'
        );

        // 2.4 Задержка, чтобы текст письма подольше показался
        tl.to(letter, {
            opacity: 1,
            duration: 0.5,
            ease: 'none',
            delay: 1.5 // время показа письма
        });
    }

    // ----- ОБРАБОТЧИК КЛИКА ПО ПЕЧАТИ -----
    sealClick.addEventListener('click', function(e) {
        e.preventDefault();
        openInvitation();
    });

    // Также по касанию для мобильных
    sealClick.addEventListener('touchstart', function(e) {
        e.preventDefault();
        openInvitation();
    }, { passive: false });

    // ----- ПОДДЕРЖКА АВТОЗАПУСКА МУЗЫКИ НА IOS (если нужно) -----
    // Небольшой хак: если пользователь не кликнул, но мы хотим дать возможность
    // запустить музыку при первом касании страницы — но у нас уже есть клик по печати.
    // Оставляем как есть.

    // ----- ДОПОЛНИТЕЛЬНО: ПЛАВНОЕ ПОЯВЛЕНИЕ ПРИ ЗАГРУЗКЕ (конверт уже виден) -----
    // Конверт изначально виден, ничего не делаем.

    // ----- ОБРАБОТЧИК ДЛЯ КНОПКИ RSVP (просто пример) -----
    document.querySelector('.rsvp-btn')?.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Спасибо за подтверждение! Мы ждём вас.');
    });

    // ----- ПРЕДОТВРАЩАЕМ СКРОЛЛ НА КОНВЕРТЕ -----
    cover.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });

    // ----- ЕСЛИ ПОЛЬЗОВАТЕЛЬ НЕ КЛИКНУЛ, НО МЫ ХОТИМ, ЧТОБЫ КОНВЕРТ БЫЛ ВИДЕН -----
    console.log('Сайт свадебного приглашения загружен. Нажмите на печать конверта.');

})();