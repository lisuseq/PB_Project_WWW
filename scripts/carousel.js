document.addEventListener("DOMContentLoaded", function () {
    const slides = document.querySelector(".carousel-slides");
    const slide = document.querySelector(".carousel-slide");
    const nextBtn = document.querySelector(".carousel-button.next");
    const prevBtn = document.querySelector(".carousel-button.prev");


    let index = 0;
    const slideWidth = slide.offsetWidth;

    function updateCarousel() {
        slides.style.transform = `translateX(-${index * slideWidth}px)`;
    }

    nextBtn.addEventListener("click", () => {
        const maxIndex = slides.children.length - 1;
        index = (index + 1 > maxIndex) ? 0 : index + 1;
        updateCarousel();
    });

    prevBtn.addEventListener("click", () => {
        const maxIndex = slides.children.length - 1;
        index = (index - 1 < 0) ? maxIndex : index - 1;
        updateCarousel();
    });

    window.addEventListener("resize", () => {
        updateCarousel(); // przelicz szerokość
    });
});