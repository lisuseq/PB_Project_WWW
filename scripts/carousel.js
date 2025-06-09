document.addEventListener("DOMContentLoaded", function () {
    const gallery = document.querySelector("#gallery");
    const slides = document.querySelector(".carousel-slides");
    const slideItems = document.querySelectorAll(".carousel-slide"); 
    const nextBtn = document.querySelector(".carousel-button.next");
    const prevBtn = document.querySelector(".carousel-button.prev");

    if (!gallery || !slides || slideItems.length === 0 || !nextBtn || !prevBtn) {
        return; 
    }

    let index = 0;
    let intervalId; 

    function updateCarousel() {
        const slideWidth = slideItems[0].offsetWidth;
        slides.style.transform = `translateX(-${index * slideWidth}px)`;
    }

    function slideNext() {
        const maxIndex = slides.children.length - 1;
        index = (index + 1 > maxIndex) ? 0 : index + 1;
        updateCarousel();
    }

    function startAutoSlide() {
        clearInterval(intervalId);
        intervalId = setInterval(slideNext, 10000); 
    }

    nextBtn.addEventListener("click", () => {
        slideNext();
        startAutoSlide();
    });

    prevBtn.addEventListener("click", () => {
        const maxIndex = slides.children.length - 1;
        index = (index - 1 < 0) ? maxIndex : index - 1;
        updateCarousel();
        startAutoSlide();
    });

    window.addEventListener("resize", updateCarousel);

    gallery.addEventListener('mouseenter', () => {
        clearInterval(intervalId);
    });

    gallery.addEventListener('mouseleave', () => {
        startAutoSlide();
    });

    startAutoSlide();
});