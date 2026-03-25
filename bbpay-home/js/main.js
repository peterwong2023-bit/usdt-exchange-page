/* ========================================
   BBpay 波币钱包 — 共享JS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileMenu();
    initScrollAnimations();
    initAboutTabs();
    initHelpAccordions();
});

function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        header.classList.toggle('scrolled', currentScroll > 20);
        lastScroll = currentScroll;
    }, { passive: true });
}

function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('mobileMenu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

function initScrollAnimations() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.anim-fade-up').forEach(el => observer.observe(el));
}

function initAboutTabs() {
    const tablist = document.querySelector('[data-about-tabs]');
    if (!tablist) return;

    const buttons = tablist.querySelectorAll('[data-tab]');
    const panels = document.querySelectorAll('[data-tab-panel]');

    function activate(tabId) {
        buttons.forEach((btn) => {
            const isOn = btn.getAttribute('data-tab') === tabId;
            btn.classList.toggle('active', isOn);
            btn.setAttribute('aria-selected', isOn ? 'true' : 'false');
        });
        panels.forEach((panel) => {
            const isOn = panel.getAttribute('data-tab-panel') === tabId;
            panel.classList.toggle('active', isOn);
            if (isOn) {
                panel.removeAttribute('hidden');
            } else {
                panel.setAttribute('hidden', '');
            }
        });
    }

    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-tab');
            if (id) activate(id);
        });
    });
}

/** 帮助中心：FAQ 与安全须知手风琴（仅 help 页存在对应节点时生效） */
function initHelpAccordions() {
    document.querySelectorAll('.faq-item .faq-trigger').forEach((btn) => {
        const item = btn.closest('.faq-item');
        if (!item) return;
        btn.addEventListener('click', () => {
            const open = item.classList.toggle('is-open');
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    });

    document.querySelectorAll('.safety-card .safety-trigger').forEach((btn) => {
        const card = btn.closest('.safety-card');
        if (!card) return;
        btn.addEventListener('click', () => {
            const open = card.classList.toggle('is-open');
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    });
}
