document.addEventListener('DOMContentLoaded', () => {
    // 1. Инициализация иконок Lucide
    lucide.createIcons();

    // 2. Мобильное меню
    const burgerBtn = document.getElementById('burgerBtn');
    const headerNav = document.getElementById('headerNav');
    const navLinks = document.querySelectorAll('.header__link, .header__btn');

    // Открытие/закрытие меню
    burgerBtn.addEventListener('click', () => {
        headerNav.classList.toggle('active');
        
        // Меняем иконку при клике
        const icon = burgerBtn.querySelector('svg'); // Lucide заменяет <i> на <svg>
        if (headerNav.classList.contains('active')) {
            burgerBtn.innerHTML = '<i data-lucide="x"></i>';
        } else {
            burgerBtn.innerHTML = '<i data-lucide="menu"></i>';
        }
        lucide.createIcons(); // Ре-инициализация новой иконки
    });

    // Закрытие меню при клике на ссылку
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            headerNav.classList.remove('active');
            burgerBtn.innerHTML = '<i data-lucide="menu"></i>';
            lucide.createIcons();
        });
    });
});
/* --- Hero Animation (Anime.js) --- */
// Запускаем только если элемент существует
if (document.querySelector('.hero')) {
    
    // 1. Анимация текстового контента
    anime({
        targets: ['.hero__badge', '.hero__title', '.hero__text', '.hero__actions', '.hero__note'],
        translateY: [30, 0],
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 1200,
        delay: anime.stagger(150, {start: 300}) // Задержка между элементами
    });

    // 2. Анимация главного изображения
    anime({
        targets: '.hero__img',
        scale: [0.9, 1],
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 1400,
        delay: 600
    });

    // 3. Анимация плавающих карточек
    anime({
        targets: '.hero__card--1',
        translateX: [-50, 0],
        opacity: [0, 1],
        easing: 'spring(1, 80, 10, 0)',
        delay: 1000
    });

    anime({
        targets: '.hero__card--2',
        translateX: [50, 0],
        opacity: [0, 1],
        easing: 'spring(1, 80, 10, 0)',
        delay: 1200
    });

    // 4. Постоянная левитация фигур (фоновая анимация)
    anime({
        targets: '.hero__shape--1',
        translateY: [-20, 20],
        translateX: [10, -10],
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
        duration: 4000
    });
}
/* --- Scroll Animation (Intersection Observer) --- */
const observerOptions = {
    threshold: 0.1 // Срабатывает, когда 10% элемента видно
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Анимируем только один раз
        }
    });
}, observerOptions);

document.querySelectorAll('.scroll-anim').forEach(el => {
    observer.observe(el);
});
/* --- Quiz Logic --- */
const quizOptions = document.querySelectorAll('.quiz-opt');
quizOptions.forEach(btn => {
    btn.addEventListener('click', function() {
        const currentStep = this.closest('.quiz-step');
        const nextStepNum = parseInt(currentStep.dataset.step) + 1;
        const nextStep = document.querySelector(`.quiz-step[data-step="${nextStepNum}"]`);

        if (nextStep) {
            // Анимация скрытия текущего
            currentStep.style.display = 'none';
            currentStep.classList.remove('active');
            
            // Показ следующего
            nextStep.style.display = 'block';
            setTimeout(() => nextStep.classList.add('active'), 10);
            
            // Если это последний шаг (результат), ре-инициализируем иконки
            if(nextStep.querySelector('.quiz-result')) {
               lucide.createIcons();
            }
        }
    });
});

/* --- Contact Form & Math Captcha --- */
const form = document.getElementById('mainForm');
const captchaLabel = document.getElementById('captcha-question');
const captchaInput = document.getElementById('captcha');
const formMessage = document.getElementById('formMessage');

// Генерируем случайную задачу: A + B
let num1 = Math.floor(Math.random() * 10) + 1;
let num2 = Math.floor(Math.random() * 10) + 1;
captchaLabel.textContent = `${num1} + ${num2}`;

form.addEventListener('submit', (e) => {
    e.preventDefault();
    formMessage.textContent = '';
    formMessage.className = 'form-message';

    const userAnswer = parseInt(captchaInput.value);
    const correctAnswer = num1 + num2;

    // 1. Проверка капчи
    if (userAnswer !== correctAnswer) {
        formMessage.textContent = 'Ошибка! Неверный ответ в примере.';
        formMessage.classList.add('error');
        return;
    }

    // 2. Имитация отправки
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Отправка...';
    btn.disabled = true;

    setTimeout(() => {
        // Успех
        form.reset();
        // Генерируем новую капчу
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        captchaLabel.textContent = `${num1} + ${num2}`;
        
        btn.textContent = originalText;
        btn.disabled = false;
        
        formMessage.textContent = 'Спасибо! Ваша заявка успешно отправлена.';
        formMessage.classList.add('success');
    }, 1500);
});
/* --- Cookie Logic --- */
const cookiePopup = document.getElementById('cookiePopup');
const acceptBtn = document.getElementById('acceptCookie');

// Проверяем, есть ли запись в localStorage
if (!localStorage.getItem('cookieConsent')) {
    // Показываем с небольшой задержкой
    setTimeout(() => {
        cookiePopup.classList.add('active');
    }, 2000);
}

acceptBtn.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'true');
    cookiePopup.classList.remove('active');
});
/* --- Blog Slider (Swiper.js) --- */
// Проверяем, есть ли слайдер на странице
if (document.querySelector('.blogSwiper')) {
    const swiper = new Swiper(".blogSwiper", {
        slidesPerView: 1, // На мобильном 1 карточка
        spaceBetween: 24, // Отступ между карточками
        loop: true,       // Бесконечная прокрутка
        grabCursor: true, // Курсор "рука" при наведении
        
        // Адаптивные настройки
        breakpoints: {
            640: {
                slidesPerView: 2, // Планшет
                spaceBetween: 24,
            },
            1024: {
                slidesPerView: 3, // Десктоп
                spaceBetween: 30,
            },
        },
        
        // Пагинация (точки)
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        
        // Навигация (наши кастомные кнопки)
        navigation: {
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
        },
    });
}