var BlsSettingsSwiperTestimonial = (function () {
    return {
        init: function () {
            this.BlsSettingsCarouselTestimonial();
        },
        BlsSettingsCarouselTestimonial: function () {
            document.querySelectorAll(".bls__testimonial").forEach((element) => {
                this.BlsCarouselTestimonial(element);
            });
        },
        BlsCarouselTestimonial: function (e) {
            var autoplaying = e?.dataset.autoplay === "true";
            var loop = e?.dataset.loop === "true";
            var itemDesktop = e?.dataset.desktop ? e?.dataset.desktop : 4;
            var itemTablet = e?.dataset.tablet ? e?.dataset.tablet : 2;
            var itemMobile = e?.dataset.mobile ? e?.dataset.mobile : 1;
            var sectionId = e?.dataset.sectionId;
            var width = window.innerWidth;
            var showThumb = e?.dataset.thumb === "true";
            var spacing = e?.dataset.spacing ? e?.dataset.spacing : 0;
            var progressbar = e?.dataset.paginationProgressbar === "true";
            spacing = Number(spacing);
            if (width <= 767) {
                if (spacing >= 15) {
                    spacing = 15;
                }
            } else if (width <= 1199) {
                if (spacing >= 30) {
                    spacing = 30;
                }
            }
            if (showThumb) {
                new Swiper("#bls__testimonial-" + sectionId, {
                    slidesPerView: itemMobile,
                    spaceBetween: spacing,
                    autoplay: autoplaying,
                    loop: loop,
                    watchSlidesProgress: true,
                    watchSlidesVisibility: true,
                    navigation: {
                        nextEl: e.querySelector(".swiper-button-next"),
                        prevEl: e.querySelector(".swiper-button-prev"),
                    },
                    pagination: {
                        clickable: true,
                        el: e.querySelector(".swiper-pagination"),
                    },
                    breakpoints: {
                        768: {
                            slidesPerView: itemTablet,
                        },
                        1200: {
                            slidesPerView: itemDesktop,
                        },
                    },
                    thumbs: {
                        swiper: {
                            el: `.testimonial-thumb-${sectionId}`,
                            multipleActiveThumbs: true,
                            spaceBetween: 10,
                            slidesPerView: "auto",
                            freeMode: true,
                            centerInsufficientSlides: true,
                            watchSlidesProgress: true,
                        },
                    },
                });
            } else {
                new Swiper("#bls__testimonial-" + sectionId, {
                    slidesPerView: itemMobile,
                    spaceBetween: spacing,
                    autoplay: autoplaying,
                    loop: loop,
                    watchSlidesProgress: true,
                    watchSlidesVisibility: true,
                    navigation: {
                        nextEl: e.querySelector(".swiper-button-next"),
                        prevEl: e.querySelector(".swiper-button-prev"),
                    },
                    pagination: {
                        clickable: true,
                        el: e.querySelector(".swiper-pagination"),
                        type: progressbar ? "progressbar" : "bullets",
                    },
                    breakpoints: {
                        768: {
                            slidesPerView: itemTablet,
                        },
                        1200: {
                            slidesPerView: itemDesktop,
                        },
                    },
                });
            }
        },
    };
})();
BlsSettingsSwiperTestimonial.init();