"use strict";
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function setCookie(cname, cvalue, exdays) {
  const date = new Date();
  date.setTime(date.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + date.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function deleteCookie(cname) {
  document.cookie = cname + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}
var BlsLazyloadImg = (function () {
  return {
    init: function () {
      this.lazyReady();
    },
    lazyReady: function () {
      if (!!window.IntersectionObserver) {
        let observer = new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.width = entry.boundingClientRect.width;
                entry.target.height = entry.boundingClientRect.height;
                entry.target.sizes = `${entry.boundingClientRect.width}px`;
                entry.target.classList.add("bls-loaded-image");
                entry.target
                  .closest(".bls-image-js")
                  .classList.remove("bls-loading-image");
                observer.unobserve(entry.target);
              }
            });
          },
          { rootMargin: "10px" }
        );
        document.querySelectorAll(".bls-image-js img").forEach((img) => {
          observer.observe(img);
        });
      }
    },
  };
})();
BlsLazyloadImg.init();
var BlsSettingsSwiper = (function () {
  return {
    init: function () {
      this.BlsSettingsCarousel();
    },
    BlsSettingsCarousel: function () {
      document.querySelectorAll(".bls__swiper").forEach((element) => {
        this.BlsCarousel(element);
      });
    },
    BlsCarousel: function (e) {
      var sliderGlobal;
      var autoplaying = e?.dataset.autoplay === "true";
      var loop = e?.dataset.loop === "true";
      var dataSlideshow = e?.dataset.slideshow ? e?.dataset.slideshow : 0;
      var dataBanner = e?.dataset.banner ? e?.dataset.banner : 0;
      var dataImageIcon = e?.dataset.imageIcon ? e?.dataset.imageIcon : 0;
      var dataCollection = e?.dataset.collection ? e?.dataset.collection : 0;
      var dataArrowCenterImage = e?.dataset.arrowCenterimage
        ? e?.dataset.arrowCenterimage
        : 0;
      var itemDesktop = e?.dataset.desktop ? e?.dataset.desktop : 4;
      var itemTablet = e?.dataset.tablet ? e?.dataset.tablet : 2;
      var itemMobile = e?.dataset.mobile ? e?.dataset.mobile : 1;
      var itemSmallMobile = e?.dataset.smallMobile ? e?.dataset.smallMobile : 1;
      var autoplaySpeed = e?.dataset.autoplaySpeed
        ? e?.dataset.autoplaySpeed
        : 3000;
      var speed = e?.dataset.speed ? e?.dataset.speed : 400;
      var effect = e?.dataset.effect ? e?.dataset.effect : "slide";
      var sectionId = e?.dataset.sectionId;
      var row = e?.dataset.row ? e?.dataset.row : 1;
      var spacing = e?.dataset.spacing ? e?.dataset.spacing : 0;
      var progressbar = e?.dataset.paginationProgressbar === "true";
      var autoItem = e?.dataset.itemMobile === "true";
      spacing = Number(spacing);
      autoplaySpeed = Number(autoplaySpeed);
      speed = Number(speed);
      if (autoplaying) {
        var autoplaying = { delay: autoplaySpeed };
      }
      sliderGlobal = new Swiper("#bls__swiper-" + sectionId, {
        slidesPerView: autoItem ? "auto" : dataCollection ? itemSmallMobile : itemMobile,
        spaceBetween: spacing >= 15 ? 15 : spacing,
        autoplay: autoplaying,
        loop: loop,
        effect: effect,
        speed: speed,
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        grid: {
          rows: row,
          fill: "row",
        },
        navigation: {
          nextEl: dataBanner
            ? e.querySelector(".swiper-arrow-next")
            : e.querySelector(".swiper-button-next"),
          prevEl: dataBanner
            ? e.querySelector(".swiper-arrow-prev")
            : e.querySelector(".swiper-button-prev"),
        },
        pagination: {
          clickable: true,
          el: e.querySelector(".swiper-pagination"),
          type: progressbar ? "progressbar" : "bullets",
        },
        breakpoints: {
          576: {
            slidesPerView: dataImageIcon ? itemTablet : itemMobile,
          },
          768: {
            slidesPerView: itemTablet,
            spaceBetween: spacing >= 30 ? 30 : spacing,
          },
          1200: {
            slidesPerView: itemDesktop,
            spaceBetween: spacing,
          },
        },
        on: {
          init: function () {
            let resizeTimeout;
            function reloadArrowsOffset() {
              if (dataArrowCenterImage) {
                var swiper = document.getElementById(
                  "bls__swiper-" + sectionId
                );
                var items_slide = swiper.querySelectorAll(
                  ".bls__responsive-image"
                );
                if (items_slide.length != 0) {
                  var oH = [];
                  items_slide.forEach((e) => {
                    oH.push(e.offsetHeight / 2);
                  });
                  var max = Math.max(...oH);
                  var arrowsOffset = "--arrows-offset-top: " + max + "px";
                  if (swiper.querySelectorAll(".swiper-arrow")) {
                    swiper
                      .querySelectorAll(".swiper-arrow")
                      .forEach((arrow) => {
                        arrow.setAttribute("style", arrowsOffset);
                      });
                  }
                }
              }
            }

            reloadArrowsOffset();

            window.addEventListener(
              "resize",
              () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                  reloadArrowsOffset();
                }, 100);
              },
              true
            );
            window.addEventListener("load", () => {
              reloadArrowsOffset();
            });
          },
        },
      });

      if (dataSlideshow) {
        sliderGlobal.on("slideChange", function () {
          document.querySelectorAll(".video-slider").forEach((video) => {
            var dataVideo = video.dataset.video;
            var dataPoster = video.dataset.poster;
            video.innerHTML = `
              <video playsinline="true" loop="loop" muted="muted" autoplay="autoplay" preload="metadata"
                poster="${dataPoster}">
                <source
                  src="${dataVideo}"
                  type="video/mp4">
              </video>
              `;
          });
        });
      }

      if (dataBanner) {
        sliderGlobal.on("slideChange", function () {
          BlsLazyloadImg.init();
        });
      }
    },
  };
})();
BlsSettingsSwiper.init();
