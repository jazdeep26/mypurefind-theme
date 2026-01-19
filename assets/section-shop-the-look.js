class ShopTheLook extends HTMLElement {
    constructor() {
      super();
      this.items = this.querySelectorAll(".bls__lookbook-dot");
      this.ls = this.querySelector(".lookbook-swiper");
      this.sl = null;
      if (this.ls) {
        this.init(this.ls);
        if (this.items.length) {
          this.items.forEach((e) => {
            e.addEventListener("click", this.onButtonClick.bind(this), false);
          });
        }
      }
      BlsLazyloadImg.init();
    }
    onButtonClick(e) {
      e.preventDefault();
      const position = e.currentTarget.dataset.productPosition;
      if (position) {
        this.sl.slideToLoop(position - 1, 500);
      }
      this.items.forEach((item) => {
        item.classList.remove("active");
      });
      e.currentTarget.classList.add("active");
    }
    init(e) {
      var autoplaying = e?.dataset.autoplay === "true";
      var loop = e.dataset.loop === "true";
      var itemDesktop = e?.dataset.desktop ? e?.dataset.desktop : 4;
      var itemTablet = e?.dataset.tablet ? e?.dataset.tablet : 2;
      var itemMobile = e?.dataset.mobile ? e?.dataset.mobile : 1;
      var width = window.innerWidth;
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
      this.sl = new Swiper("#" + e.id, {
        slidesPerView: itemMobile,
        spaceBetween: spacing,
        autoplay: autoplaying,
        delay: 3000,
        loop: loop,
        effect: "slide",
        speed: 400,
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        grid: {
          rows: 1,
          fill: "row",
        },
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
  }
  customElements.define("shop-the-look", ShopTheLook);