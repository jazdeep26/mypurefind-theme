"use strict";
const global = {
  announcementBar: "announcement-bar",
  overlay: ".bls__overlay",
  header: "header",
  mobile_stickybar: "shopify-section-mobile-stickybar",
};
const SCROLL_ZOOM_IN_TRIGGER_CLASSNAME = "animate--zoom-in";

window.addEventListener("load", function () {
  const padding = window.innerWidth - document.body.clientWidth;
  if (padding > 0) {
    document
      .querySelector("html")
      .setAttribute("style", `--padding-right: ${padding}px`);
  }
});

function throttle(fn, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return fn(...args);
  };
}

function initializeScrollZoomAnimationTrigger() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const animationTriggerElements = Array.from(
    document.getElementsByClassName(SCROLL_ZOOM_IN_TRIGGER_CLASSNAME)
  );

  if (animationTriggerElements.length === 0) return;

  const scaleAmount = 0.2 / 100;

  animationTriggerElements.forEach((element) => {
    let elementIsVisible = false;
    const observer = new IntersectionObserver((elements) => {
      elements.forEach((entry) => {
        elementIsVisible = entry.isIntersecting;
      });
    });
    observer.observe(element);
    element.style.setProperty(
      "--zoom-in-ratio",
      1 + scaleAmount * percentageSeen(element)
    );
    window.addEventListener(
      "scroll",
      throttle(() => {
        if (!elementIsVisible) return;
        element.style.setProperty(
          "--zoom-in-ratio",
          1 + scaleAmount * percentageSeen(element)
        );
      }),
      { passive: true }
    );
  });
}

function percentageSeen(element) {
  const viewportHeight = window.innerHeight;
  const scrollY = window.scrollY;
  const elementPositionY = element.getBoundingClientRect().top + scrollY;
  const elementHeight = element.offsetHeight;
  if (elementPositionY > scrollY + viewportHeight) {
    return 0;
  } else if (elementPositionY + elementHeight < scrollY) {
    return 100;
  }
  const distance = scrollY + viewportHeight - elementPositionY;
  let percentage = distance / ((viewportHeight + elementHeight) / 100);
  return Math.round(percentage);
}

window.addEventListener("DOMContentLoaded", () => {
  initializeScrollZoomAnimationTrigger();
});

function HoverIntent(elements, userConfig) {
  const defaultOptions = {
    exitDelay: 180,
    interval: 100,
    sensitivity: 6,
  };
  let config = {};
  let currX, currY, prevX, prevY;
  let allElems, pollTimer, exitTimer;
  const extend = function (defaults, userArgs) {
    for (let i in userArgs) {
      defaults[i] = userArgs[i];
    }
    return defaults;
  };
  const mouseTrack = function (ev) {
    currX = ev.pageX;
    currY = ev.pageY;
  };
  const mouseCompare = function (targetElem) {
    const distX = prevX - currX,
      distY = prevY - currY;
    const distance = Math.sqrt(distX * distX + distY * distY);
    if (distance < config.sensitivity) {
      clearTimeout(exitTimer);
      for (let elem of allElems) {
        if (elem.isActive) {
          config.onExit(elem);
          elem.isActive = false;
        }
      }
      config.onEnter(targetElem);
      targetElem.isActive = true;
    } else {
      prevX = currX;
      prevY = currY;
      pollTimer = setTimeout(function () {
        mouseCompare(targetElem);
      }, config.interval);
    }
  };
  const init = function (elements, userConfig) {
    if (!userConfig || !userConfig.onEnter || !userConfig.onExit) {
      throw "onEnter and onExit callbacks must be provided";
    }
    config = extend(defaultOptions, userConfig);
    allElems = elements;
    for (let elem of allElems) {
      if (!elem) return;
      elem.isActive = false;
      elem.addEventListener("mousemove", mouseTrack);
      elem.addEventListener("mouseenter", function (ev) {
        prevX = ev.pageX;
        prevY = ev.pageY;
        if (elem.isActive) {
          clearTimeout(exitTimer);
          return;
        }
        pollTimer = setTimeout(function () {
          mouseCompare(elem);
        }, config.interval);
      });
      elem.addEventListener("mouseleave", function (ev) {
        clearTimeout(pollTimer);
        if (!elem.isActive) return;
        exitTimer = setTimeout(function () {
          config.onExit(elem);
          elem.isActive = false;
        }, config.exitDelay);
      });
    }
  };
  init(elements, userConfig);
}
var menuItems = document.querySelectorAll(".bls__menu-parent");
var hi = HoverIntent(menuItems, {
  // required parameters
  onEnter: function (targetItem) {
    targetItem.classList.add("visible");
  },
  onExit: function (targetItem) {
    targetItem.classList.remove("visible");
  },
});

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

function backToTop() {
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  var scrolled = (winScroll / height) * 100;
  if (document.getElementById("bls__back-top")) {
    document.getElementById("bls__back-top").style.height = scrolled + "%";
  }
  const b = document.querySelector(".back-top");
  if (b) {
    document.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        b.classList.add("show");
      } else {
        b.classList.remove("show");
      }
    });
    b.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}

function mobileStickyBar() {
  var stickybar = document.querySelector(".bls__mobile-stickybar");
  if (!stickybar) {
    return;
  }
  var currentScroll = window.pageYOffset;
  let headerbar = 0;
  if (document.getElementById("announcement-bar")) {
    headerbar = document.getElementById("announcement-bar")?.clientHeight;
  }
  let headertopbar = 0;
  if (document.getElementById("shopify-section-top-bar")) {
    headertopbar = document.getElementById(
      "shopify-section-top-bar"
    ).clientHeight;
  }
  let headerpage = document.getElementById("page-header")?.clientHeight;
  let headerh = headerbar + headertopbar + headerpage + 50;
  if (currentScroll > headerh) {
    stickybar.classList.remove("d-none");
  } else {
    stickybar.classList.add("d-none");
  }
}

function initComparisons() {
  var x, i;
  x = document.getElementsByClassName("img-comp-overlay");
  for (i = 0; i < x.length; i++) {
    compareImages(x[i]);
  }
  function compareImages(img) {
    var slider,
      img,
      clicked = 0,
      w,
      h;
    w = img.offsetWidth;
    h = img.offsetHeight;
    const icc = img.closest(".img-comp-container");
    if (icc) {
      slider = icc.querySelector(".image-comparison__button");
    }
    if (slider) {
      slider.addEventListener("touchstart", slideReady);
      slider.addEventListener("mousedown", slideReady);
    }
    window.addEventListener("mouseup", slideFinish);
    window.addEventListener("touchend", slideFinish);
    function slideReady(e) {
      e.preventDefault();
      clicked = 1;
      window.addEventListener("mousemove", slideMove);
      window.addEventListener("touchmove", slideMove);
    }
    function slideFinish() {
      clicked = 0;
    }
    function slideMove(e) {
      var pos;
      if (clicked == 0) return false;
      pos = getCursorPos(e);
      if (pos < 0) pos = 0;
      if (pos > w) pos = w;
      slide(pos);
    }
    function getCursorPos(e) {
      var a,
        x = 0;
      e = e.changedTouches ? e.changedTouches[0] : e;
      a = img.getBoundingClientRect();
      x = e.pageX - a.left;
      x = x - window.pageXOffset;

      return x;
    }
    function slide(x) {
      if (slider) {
        var x_ps = x + slider.offsetWidth / 2 + 10;
        var percent = (x_ps / w) * 100;
        if (percent >= 100 - ((slider.offsetWidth / 2 + 10) / w) * 100) {
          percent = 100 - ((slider.offsetWidth / 2 + 10) / w) * 100;
        }
      }

      img
        .closest(".img-comp-container")
        .setAttribute(
          "style",
          "--percent: " + percent.toFixed(4) + "%;--height: " + h + "px "
        );
    }
  }
}
initComparisons();

function showAnime(target) {
  const styles = getComputedStyle(target);
  const duration = 400;
  const easing = "ease";
  target.style.overflow = "hidden";
  target.style.display = "block";
  const heightVal = {
    height: target.getBoundingClientRect().height + "px",
    marginTop: styles.marginTop,
    marginBottom: styles.marginBottom,
    paddingTop: styles.paddingTop,
    paddingBottom: styles.paddingBottom,
  };
  Object.keys(heightVal).forEach((key) => {
    if (parseFloat(heightVal[key]) === 0) {
      delete heightVal[key];
    }
  });
  if (Object.keys(heightVal).length === 0) {
    return false;
  }
  let showAnime;
  Object.keys(heightVal).forEach((key) => {
    target.style[key] = 0;
  });
  showAnime = target.animate(heightVal, {
    duration: duration,
    easing: easing,
  });
  showAnime.finished.then(() => {
    target.style.overflow = "";
    Object.keys(heightVal).forEach((key) => {
      target.style[key] = "";
    });
  });
}

function hideAnime(target) {
  const styles = getComputedStyle(target);
  const duration = 300;
  const easing = "ease";
  target.style.overflow = "hidden";
  const heightVal = {
    height: target.getBoundingClientRect().height + "px",
    marginTop: styles.marginTop,
    marginBottom: styles.marginBottom,
    paddingTop: styles.paddingTop,
    paddingBottom: styles.paddingBottom,
  };
  Object.keys(heightVal).forEach((key) => {
    if (parseFloat(heightVal[key]) === 0) {
      delete heightVal[key];
    }
  });
  if (Object.keys(heightVal).length === 0) {
    return false;
  }
  let hideAnime;
  Object.keys(heightVal).forEach((key) => {
    target.style[key] = heightVal[key];
    heightVal[key] = 0;
  });
  hideAnime = target.animate(heightVal, {
    duration: duration,
    easing: easing,
  });
  hideAnime.finished.then(() => {
    target.style.overflow = "";
    Object.keys(heightVal).forEach((key) => {
      target.style[key] = "";
      target.style.display = "none";
    });
  });
}

const slideAnimeHidden = (() => {
  let isAnimating = false;
  return (setOptions) => {
    const defaultOptions = {
      target: false,
      duration: 400,
      easing: "ease",
    };
    const options = Object.assign({}, defaultOptions, setOptions);
    const target = options.target;
    if (!target) {
      return;
    }
    const styles = getComputedStyle(target);
    target.style.overflow = "hidden";
    const duration = options.duration;
    const easing = options.easing;
    const heightVal = {
      height: target.getBoundingClientRect().height + "px",
      marginTop: styles.marginTop,
      marginBottom: styles.marginBottom,
      paddingTop: styles.paddingTop,
      paddingBottom: styles.paddingBottom,
    };
    Object.keys(heightVal).forEach((key) => {
      if (parseFloat(heightVal[key]) === 0) {
        delete heightVal[key];
      }
    });
    if (Object.keys(heightVal).length === 0) {
      isAnimating = false;
      return false;
    }
    let slideAnime;
    Object.keys(heightVal).forEach((key) => {
      target.style[key] = heightVal[key];
      heightVal[key] = 0;
    });
    slideAnime = target.animate(heightVal, {
      duration: duration,
      easing: easing,
    });
    slideAnime.finished.then(() => {
      target.style.overflow = "";
      Object.keys(heightVal).forEach((key) => {
        target.style[key] = "";
      });
      target.style.display = "none";
      isAnimating = false;
    });
  };
})();

const slideAnime = (() => {
  let isAnimating = false;
  return (setOptions) => {
    const defaultOptions = {
      target: false,
      animeType: "slideToggle",
      duration: 400,
      easing: "ease",
      isDisplayStyle: "block",
    };
    const options = Object.assign({}, defaultOptions, setOptions);
    const target = options.target;
    if (!target) {
      return;
    }
    if (isAnimating) {
      return;
    }
    isAnimating = true;
    let animeType = options.animeType;
    const styles = getComputedStyle(target);
    if (animeType === "slideToggle") {
      animeType = styles.display === "none" ? "slideDown" : "slideUp";
    }
    if (
      (animeType === "slideUp" && styles.display === "none") ||
      (animeType === "slideDown" && styles.display !== "none") ||
      (animeType !== "slideUp" && animeType !== "slideDown")
    ) {
      isAnimating = false;
      return false;
    }
    target.style.overflow = "hidden";
    const duration = options.duration;
    const easing = options.easing;
    const isDisplayStyle = options.isDisplayStyle;
    if (animeType === "slideDown") {
      target.style.display = isDisplayStyle;
    }
    const heightVal = {
      height: target.getBoundingClientRect().height + "px",
      marginTop: styles.marginTop,
      marginBottom: styles.marginBottom,
      paddingTop: styles.paddingTop,
      paddingBottom: styles.paddingBottom,
    };
    Object.keys(heightVal).forEach((key) => {
      if (parseFloat(heightVal[key]) === 0) {
        delete heightVal[key];
      }
    });
    if (Object.keys(heightVal).length === 0) {
      isAnimating = false;
      return false;
    }
    let slideAnime;
    if (animeType === "slideDown") {
      Object.keys(heightVal).forEach((key) => {
        target.style[key] = 0;
      });
      slideAnime = target.animate(heightVal, {
        duration: duration,
        easing: easing,
      });
    } else if (animeType === "slideUp") {
      Object.keys(heightVal).forEach((key) => {
        target.style[key] = heightVal[key];
        heightVal[key] = 0;
      });
      slideAnime = target.animate(heightVal, {
        duration: duration,
        easing: easing,
      });
    }
    slideAnime.finished.then(() => {
      target.style.overflow = "";
      Object.keys(heightVal).forEach((key) => {
        target.style[key] = "";
      });
      if (animeType === "slideUp") {
        target.style.display = "none";
      }
      isAnimating = false;
    });
  };
})();

var BlsEventShopify = (function () {
  return {
    init: function () {
      this.setupEventListeners();
      Shopify.eventCountDownTimer();
      Shopify.eventFlashingBrowseTab();
    },
    setupEventListeners: function () {
      window.addEventListener("scroll", () => {
        backToTop();
        mobileStickyBar();
      });

      document
        .querySelectorAll(".collection-infinite-scroll a")
        .forEach((showMore) => {
          showMore.addEventListener(
            "click",
            (e) => {
              for (var item of document.querySelectorAll(
                ".collection-list__item.grid__item"
              )) {
                item.classList.remove("d-none");
              }
              showMore.parentElement.remove();
            },
            false
          );
        });

      const footer_block = document.querySelectorAll(
        ".bls__footer_block-title"
      );
      footer_block.forEach((footer) => {
        footer.addEventListener("click", (e) => {
          let reactiveTimeout;
          const target = e.currentTarget;
          const parent = target.parentElement;
          const footerContent = parent.querySelector(
            ".bls__footer_block-content"
          );
          slideAnime({
            target: footerContent,
            animeType: "slideToggle",
          });
          const footer_block = target.closest(".bls__footer_block");
          if (!footer_block.classList.contains("active")) {
            clearTimeout(reactiveTimeout);
            reactiveTimeout = setTimeout(() => {
              footer_block.classList.add("active");
            }, 100);
          } else {
            clearTimeout(reactiveTimeout);
            reactiveTimeout = setTimeout(() => {
              footer_block.classList.remove("active");
            }, 100);
          }
        });
      });
      window.addEventListener("resize", function () {
        let windowWidth = window.innerWidth;
        ac(windowWidth);
      });
      window.addEventListener("load", function () {
        let windowWidth = screen.width;
        al(windowWidth);
      });
      function ac(width) {
        if (width >= 768) {
          const footerContent = document.querySelectorAll(
            ".bls__footer_block-content"
          );
          footerContent.forEach((i) => {
            i.style.display = "block";
          });
        } else {
          const footerContent = document.querySelectorAll(
            ".bls__footer_block-content"
          );
          footerContent.forEach((i) => {
            if (i.closest(".bls__footer_block.active")) {
              i.style.display = "block";
            } else {
              i.style.display = "none";
            }
          });
        }
      }
      function al(width) {
        if (width >= 768) {
          const footerContent = document.querySelectorAll(
            ".bls__footer_block-content"
          );
          footerContent.forEach((i) => {
            i.style.display = "block";
          });
        }
      }
      const mobile_stickybar = document.getElementById(global.mobile_stickybar);
      const ft = document.querySelector("footer");
      if (mobile_stickybar && ft) {
        ft.classList.add("enable_menu-bottom");
      }

      const cookie_bar = document.getElementById("bls_cookie");
      if (cookie_bar) {
        if (!getCookie("cookie_bar")) {
          cookie_bar.classList.remove("d-none");
        }
        document
          .querySelectorAll("#bls_cookie .cookie-dismiss")
          .forEach((closeCookie) => {
            closeCookie.addEventListener(
              "click",
              (e) => {
                e.preventDefault();
                const target = e.currentTarget;
                target.closest("#bls_cookie").remove();
                setCookie("cookie_bar", "dismiss", 30);
              },
              false
            );
          });
      }

      const announcementBar = document.getElementById(global.announcementBar);
      if (announcementBar) {
        const swc = announcementBar.querySelector(".swiper-announcementBar");
        if (swc) {
          swc.style.maxHeight = announcementBar.offsetHeight + "px";
          var swiper = new Swiper(".swiper-announcementBar", {
            loop: true,
            slidesPerView: 1,
            direction: "vertical",
            autoplay: {
              delay: 3000,
            },
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
          });
        }
        const cds = announcementBar.querySelectorAll(
          ".countdown-announcementBar"
        );
        cds.forEach((cd) => {
          const cddl = cd?.dataset.blockDeadline;
          const dateParts = cddl.split("-");
          const isoDate =
            dateParts[2] +
            "-" +
            dateParts[0].padStart(2, "0") +
            "-" +
            dateParts[1].padStart(2, "0") +
            "T00:00:00Z";
          if (cddl && Date.parse(isoDate)) {
            const deadline = new Date(isoDate);
            const calculateTimeLeft = () => {
              const difference = +deadline - +new Date();
              let timeLeft = {};
              if (difference > 0) {
                timeLeft = {
                  days_announcementBar: Math.floor(
                    difference / (1000 * 60 * 60 * 24)
                  ),
                  hours_announcementBar: Math.floor(
                    (difference / (1000 * 60 * 60)) % 24
                  ),
                  minutes_announcementBar: Math.floor(
                    (difference / 1000 / 60) % 60
                  ),
                  seconds_announcementBar: Math.floor((difference / 1000) % 60),
                };
              }
              return timeLeft;
            };
            const updateCountdown = () => {
              const timeLeft = calculateTimeLeft();
              Object.entries(timeLeft).forEach(([key, value]) => {
                cd.querySelector("." + key).innerHTML = value;
              });
            };

            setInterval(updateCountdown, 1000);
          }
        });
        document
          .querySelectorAll("#announcement-bar .announcement-close")
          .forEach((closeAnnouncement) => {
            closeAnnouncement.addEventListener(
              "click",
              (e) => {
                e.preventDefault();
                const target = e.currentTarget;
                target.closest("#announcement-bar").remove();
                setCookie("announcement_bar", 1, 1);
              },
              false
            );
          });
      }
      const conditions = document.getElementById("product_conditions_form");
      const bpb = document.querySelector(".bls__payment-button");
      if (conditions) {
        if (getCookie("term_conditions")) {
          conditions.setAttribute("checked", "");
          if (bpb) {
            bpb.classList.remove("disabled");
          }
        } else {
          conditions.addEventListener("change", (event) => {
            setCookie("term_conditions", 1, 1);

            if (bpb) {
              if (event.currentTarget.checked) {
                bpb.classList.remove("disabled");
              } else {
                bpb.classList.add("disabled");
              }
            }
          });
        }
      }

      document.querySelectorAll(global.overlay).forEach((event) => {
        event.addEventListener(
          "click",
          (e) => {
            const target = e.currentTarget;
            target.classList.add("d-none-overlay");
            if (target.classList.contains('d-block-overlay-collection')) {
              target.classList.remove("d-block-overlay-collection");
            }
            document.documentElement.classList.remove("hside_opened");
            document.documentElement.classList.remove("vetical-overlay");
            for (var item of document.querySelectorAll(".bls__opend-popup")) {
              item.classList.remove("bls__opend-popup");
            }
            const btn = document.querySelector(".btn-filter");
            if (btn && btn.classList.contains("actived")) {
              btn.classList.remove("actived");
            }
            for (var item of document.querySelectorAll(".bls__addon")) {
              item.classList.remove("is-open");
            }
            for (var item of document.querySelectorAll(
              ".bls-minicart-wrapper"
            )) {
              item.classList.remove("addons-open");
            }
            for (var item of document.querySelectorAll(".vertical-menu")) {
              item.classList.remove("open");
            }
          },
          false
        );
      });

      document.querySelectorAll(".bls__terms-conditions a").forEach((event) => {
        event.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
            const content = document.getElementById("popup-terms-conditions");
            if (!content) return;
            const text = content.getAttribute("data-text");
            var promotion = EasyDialogBox.create(
              "popup-terms-conditions",
              "dlg dlg-disable-footer dlg-disable-drag",
              text,
              content.innerHTML
            );
            promotion.onClose = promotion.destroy;
            promotion.show(300);
          },
          false
        );
      });
    },
  };
})();
BlsEventShopify.init();

let newParser = new DOMParser();

var BlsAddMetatagScale = (function () {
  return {
    init: function () {
      this.addMeta();
    },
    addMeta: function () {
      const body = document.querySelector("body");
      const metaTag = document.querySelector('meta[name="viewport"]');
      const currentContent = metaTag.getAttribute("content");
      const updatedContent = currentContent + ", maximum-scale=1";
      body.addEventListener("touchstart", function () {
        metaTag.setAttribute("content", updatedContent);
      });
    },
  };
})();
BlsAddMetatagScale.init();

const rdc = {
  mode: "same-origin",
  credentials: "same-origin",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
  },
};
let parser = new DOMParser();
var BlsReloadEvents = (function () {
  return {
    init: function () {
      this.setupEventListeners();
    },

    setupEventListeners: function () {
      document.addEventListener("shopify:section:load", function (event) {
        var id = event.detail.sectionId;

        var section = event.target.querySelector(
          "[" + "data-id" + '="' + id + '"]'
        );

        if (section != undefined) {
          const { type } = section?.dataset;
          switch (type) {
            case "instagram":
              BlsInstagramShopify.init();
              break;
            case "product_grid":
              BlsProductGridEvents.init();
              BlsProductTabEvents.init();
              BlsColorSwatchesShopify.init();
              break;
            case "product_carousel":
              BlsProductGridEvents.init();
              BlsProductTabEvents.init();
              BlsColorSwatchesShopify.init();
              break;
            case "recently_viewed_products":
              BlsRVProductsShopify.init();
              break;
            case "product_recommendations":
              BlsProductRecommendsEvents.init();
              break;
            case "product_single":
              BlsColorSwatchesShopify.init();
              break;
            case "product_deal":
              BlsColorSwatchesShopify.init();
              BlsCountdownTimer.init();
              break;
            default:
              break;
          }
        }
      });
    },
  };
})();
BlsReloadEvents.init();

var BlsColorSwatchesShopify = (function () {
  return {
    init: function () {
      this.initSwatches();
    },

    initSwatches: function () {
      const _this = this;
      const actionSwatchColor = document.querySelectorAll(
        ".bls__product-color-swatches"
      );
      actionSwatchColor.forEach((e) => {
        _this.checkSwatches(e);
      });
      var t;
      const actionSwatch = document.querySelectorAll(
        ".bls__option-swatch-js,.bls__product-compare,.bls__product-wishlist"
      );
      if (actionSwatch.length > 0) {
        actionSwatch.forEach((e) => {
          const productTarget = e.closest(".bls__product-item");
          if (productTarget) {
            e.addEventListener(
              "mouseout",
              function () {
                if (e.closest(".swiper")) {
                  t = setTimeout(() => {
                    e.closest(".swiper").classList.remove("show-tooltip");
                  }, 400);
                }
              },
              false
            );
            e.addEventListener("mouseover", () => {
              clearTimeout(t);
              _this.listenerColor(e, productTarget);
              if (e.closest(".swiper")) {
                e.closest(".swiper").classList.add("show-tooltip");
              }
            });
          }
        });
      }
    },

    listenerColor: function (e, productTarget) {
      const _this = this;
      setTimeout(() => {
        if (!e.classList.contains("active")) {
          if (e.closest(".bls__product-option")) {
            const activeSwatches = e
              .closest(".bls__product-option")
              .querySelectorAll(".bls__option-swatch-js");
            activeSwatches.forEach((el) => {
              el.classList.remove("active");
            });
            e.classList.toggle("active");
            _this.swapProduct(productTarget);
          }
        }
      }, 0);
    },

    updateMasterId(options, variantData) {
      var result = variantData.find((variant) => {
        return !variant.options
          .map((option, index) => {
            return options[index] === option;
          })
          .includes(false);
      });
      return result;
    },

    updatePrice(currentVariant, productTarget) {
      if (!currentVariant) return;
      const compare_at_price = currentVariant.compare_at_price;
      const price = currentVariant.price;
      const unit_price = currentVariant.unit_price;
      const unit_price_measurement = currentVariant.unit_price_measurement;
      const price_format = Shopify.formatMoney(
        currentVariant.price,
        cartStrings?.money_format
      );
      if (unit_price && unit_price_measurement) {
        const price_num = Shopify.formatMoney(
          unit_price,
          cartStrings?.money_format
        );
        const price_unit =
          unit_price_measurement.reference_value != 1
            ? unit_price_measurement.reference_value
            : unit_price_measurement.reference_unit;
        const upn = productTarget.querySelector(".unit-price .number");
        const upu = productTarget.querySelector(".unit-price .unit");
        if (upn) {
          upn.innerHTML = price_num;
        }
        if (upu) {
          upu.innerHTML = price_unit;
        }
      }
      const prp = productTarget.querySelector(".price__regular.price");
      if (prp) {
        prp.innerHTML = price_format;
      }
      const bls__price = productTarget.querySelector(".bls__price");
      bls__price.classList.remove("price--sold-out", "price--on-sale");
      bls__price
        .querySelector(".price__regular.price")
        .classList.remove("special-price");
      if (compare_at_price && compare_at_price > price) {
        const compare_format = Shopify.formatMoney(
          compare_at_price,
          cartStrings?.money_format
        );
        if (!bls__price.querySelector(".compare-price")) {
          var ps = bls__price.querySelector(".price__sale");
          var cp = document.createElement("s");
          cp.classList.add("price-item", "compare-price");
          if (ps) {
            ps.appendChild(cp);
          }
        }
        if (bls__price.querySelector(".compare-price")) {
          bls__price.querySelector(".compare-price").innerHTML = compare_format;
        }
        bls__price.classList.add("price--on-sale");
        bls__price
          .querySelector(".price__regular.price")
          .classList.add("special-price");
      } else if (!currentVariant.available) {
        bls__price.classList.add("price--sold-out");
      }
    },

    updateMedia(currentVariant, productTarget) {
      if (!currentVariant) return;
      if (!currentVariant.featured_media) return;
      setTimeout(() => {
        productTarget
          .querySelector(".bls__product-main-img img")
          .removeAttribute("srcset");
        productTarget
          .querySelector(".bls__product-main-img img")
          .setAttribute("src", currentVariant.featured_media.preview_image.src);
      }, 200);
    },

    renderProductInfo(currentVariant, variantQtyData, productTarget, color) {
      let qty = 0;
      let percent = 0;
      let sale = false;
      let sold_out = false;
      let pre_order = false;
      let av = false;
      let im = false;
      const compare_at_price = currentVariant.compare_at_price;
      const price = currentVariant.price;
      const vqd = variantQtyData.reduce((acc, item) => {
        const existingItem = acc.find((i) => i.option === item.option);
        if (existingItem) {
          existingItem.qty += item.qty;
          if (item.available === true) {
            existingItem.available = true;
          }
          if (item.mamagement === "") {
            existingItem.mamagement = "";
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, []);
      vqd.find((variantQty) => {
        if (variantQty.option === currentVariant.option1) {
          qty = variantQty.qty;
          av = variantQty.available;
          im = variantQty.mamagement;
        }
      });
      if (compare_at_price && compare_at_price > price) {
        sale = true;
        percent = ((compare_at_price - price) / compare_at_price) * 100;
      }
      if (im === "") {
        sold_out = false;
        pre_order = false;
      } else {
        if (av && qty < 1) {
          pre_order = true;
        } else if (!av) {
          sold_out = true;
        }
      }
      const product_label = productTarget.querySelector(".bls__product-label");
      const product_scrolling = productTarget.querySelector(
        ".bls__product-text-scrolling"
      );
      if (product_label) {
        product_label.remove();
      }
      if (product_scrolling) {
        const content = product_scrolling?.dataset.textProductScrolling;
        if (sale) {
          product_scrolling.style.display = "flex";
          let content_replace;
          if (window.productLabel.saleType == "price") {
            content_replace = content.replace(
              "[percent_sale]",
              "- " +
                Shopify.formatMoney(
                  compare_at_price - price,
                  cartStrings.money_format
                )
            );
          } else if (window.productLabel.saleType == "percent") {
            content_replace = content.replace(
              "[percent_sale]",
              percent.toFixed(0) + "%"
            );
          } else {
            content_replace = content.replace("[percent_sale]", "");
          }
          product_scrolling
            .querySelectorAll(".sale-content-product")
            .forEach((sale) => {
              sale.innerText = content_replace;
            });
        } else {
          product_scrolling.style.display = "none";
        }
      }
      if (sale || pre_order || sold_out) {
        var element = document.createElement("div");
        element.classList.add(
          "bls__product-label",
          "fs-12",
          "pointer-events-none",
          "absolute"
        );
        productTarget.querySelector(".bls__product-img").appendChild(element);
        const label = productTarget.querySelector(".bls__product-label");

        if (sale) {
          if (label.querySelector(".bls__sale-label")) {
            if (window.productLabel.saleType == "price") {
              label.querySelector(".bls__sale-label").innerText =
                "- " +
                Shopify.formatMoney(
                  compare_at_price - price,
                  cartStrings.money_format
                );
            } else if (window.productLabel.saleType == "text") {
              label.querySelector(".bls__sale-label").innerText =
                window.productLabel.saleLabel;
            } else {
              label.querySelector(".bls__sale-label").innerText =
                -percent.toFixed(0) + "%";
            }
          } else {
            var element_sale = document.createElement("div");
            element_sale.classList.add("bls__sale-label");
            if (window.productLabel.saleType == "price") {
              element_sale.innerText =
                "- " +
                Shopify.formatMoney(
                  compare_at_price - price,
                  cartStrings.money_format
                );
            } else if (window.productLabel.saleType == "text") {
              element_sale.innerText = window.productLabel.saleLabel;
            } else {
              element_sale.innerText = -percent.toFixed(0) + "%";
            }
            if (label) {
              label.appendChild(element_sale);
            }
          }
        }
        if (sold_out) {
          if (label.querySelector(".bls__sold-out-label")) {
            label.querySelector(".bls__sold-out-label").innerText =
              window.variantStrings?.soldOut;
          } else {
            var element_sold_out = document.createElement("div");
            element_sold_out.classList.add("bls__sold-out-label");
            element_sold_out.innerText = window.variantStrings?.soldOut;
            if (label) {
              label.appendChild(element_sold_out);
            }
          }
        }
        if (pre_order) {
          var element_pre_order = document.createElement("div");
          element_pre_order.classList.add("bls__pre-order-label");
          element_pre_order.innerText = window.variantStrings?.preOrder;
          if (label) {
            label.appendChild(element_pre_order);
          }
        }
      }

      const productAddCartDiv = productTarget.querySelector(
        ".bls__product-addtocart-js"
      );
      if (productAddCartDiv) {
        const currentVariantId = productAddCartDiv.dataset.productVariantId;
        if (Number(currentVariantId) !== currentVariant.id) {
          productAddCartDiv.dataset.productVariantId = currentVariant.id;
        }
      }
      this.toggleAddButton(
        !currentVariant.available,
        window.variantStrings?.soldOut,
        productTarget,
        pre_order
      );
    },

    toggleAddButton(disable = true, text, productTarget, pre_order = false) {
      const productForm = productTarget;
      if (!productForm) return;
      const addButton = productForm.querySelector(".bls__js-addtocart");
      const addButtonText = productTarget.querySelector(
        ".bls__js-addtocart .bls__button-content"
      );
      const addButtonTooltipText = productTarget.querySelector(
        ".bls__js-addtocart .bls_tooltip-content"
      );
      if (!addButton) return;

      if (disable) {
        addButton.setAttribute("disabled", "disabled");
        if (text) {
          addButtonText.textContent = text;
          if (addButtonTooltipText) {
            addButtonTooltipText.textContent = text;
          }
        }
      } else {
        addButton.removeAttribute("disabled");
        if (pre_order) {
          addButtonText.textContent = window.variantStrings?.preOrder;
          if (addButtonTooltipText) {
            addButtonTooltipText.textContent = window.variantStrings?.preOrder;
          }
        } else {
          addButtonText.textContent = window.variantStrings?.addToCart;
          if (addButtonTooltipText) {
            addButtonTooltipText.textContent = window.variantStrings?.addToCart;
          }
        }
      }
    },

    setUnavailable(productTarget) {
      const addButton = productTarget.querySelector(".bls__js-addtocart");
      const addButtonText = productTarget.querySelector(
        ".bls__js-addtocart .bls__button-content"
      );
      const addButtonTooltipText = productTarget.querySelector(
        ".bls__js-addtocart .bls_tooltip-content"
      );
      if (!addButton) return;
      addButtonText.textContent = window.variantStrings?.unavailable;
      addButtonTooltipText.textContent = window.variantStrings?.unavailable;
    },

    swapProduct: function (productTarget) {
      const product_swatch_active = productTarget.querySelector(
        ".bls__option-swatch-js.active"
      );
      const position_swatch =
        product_swatch_active.getAttribute("data-position");
      const variantData = JSON.parse(
        productTarget.querySelector(".productinfo").textContent
      );
      const variantQtyData = JSON.parse(
        productTarget.querySelector(".productVariantsQty").textContent
      );
      let options = Array.from(
        productTarget.querySelectorAll(".bls__option-swatch-js.active"),
        (select) => select.getAttribute("data-value")
      );
      variantData.find((variant) => {
        if (options.length == 1) {
          const variantOptions = {
            1: variant.option1,
            2: variant.option2,
            3: variant.option3,
          };
          if (variantOptions[position_swatch] === options[0]) {
            options = variant.options;
          }
        }
      });
      const currentVariant = this.updateMasterId(options, variantData);
      this.toggleAddButton(true, "", productTarget);
      if (!currentVariant) {
        this.toggleAddButton(true, "", productTarget);
        this.setUnavailable(productTarget);
      } else {
        this.updatePrice(currentVariant, productTarget);
        this.updateMedia(currentVariant, productTarget);
        this.renderProductInfo(
          currentVariant,
          variantQtyData,
          productTarget,
          product_swatch_active.dataset.color
        );
      }
    },

    checkSwatches: function (e) {
      const { color, image } = e?.dataset;
      if (this.checkColor(color)) {
        e.style.backgroundColor = color;
      } else {
        if (image) {
          e.classList.add = "bls__" + color.replace(" ", "-");
          e.style.backgroundColor = null;
          e.style.backgroundImage = "url('" + image + "')";
          e.style.backgroundSize = "cover";
          e.style.backgroundRepeat = "no-repeat";
        }
      }
    },

    checkColor: function (strColor) {
      var s = new Option().style;
      s.color = strColor;
      return s.color == strColor;
    },
  };
})();
BlsColorSwatchesShopify.init();

var BlsCountdownTimer = (function () {
  return {
    init: function () {
      this.handleCountdown();
      this.eventCountDownTimer();
    },

    eventCountDownTimer: function () {
      const element = document.querySelectorAll(".bls__countdown-timer");

      if (element.length === 0) return;
      element.forEach((e) => {
        const day = e.getAttribute("data-days");
        const hrs = e.getAttribute("data-hrs");
        const secs = e.getAttribute("data-secs");
        const mins = e.getAttribute("data-mins");
        const time = e.getAttribute("data-time");
        var countDownDate = new Date(time).getTime();
        var timer = setInterval(function () {
          var now = new Date().getTime();
          var distance = countDownDate - now;
          var days = Math.floor(distance / (1000 * 60 * 60 * 24));
          var hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          var seconds = Math.floor((distance % (1000 * 60)) / 1000);
          var html =
            '<span class="countdown-days"><span class="countdown_ti heading-weight">' +
            days +
            '</span> <span class="countdown_tx">' +
            day +
            "</span></span> " +
            '<span class="countdown-hours"><span class="countdown_ti heading-weight">' +
            hours +
            '</span> <span class="countdown_tx">' +
            hrs +
            "</span></span> " +
            '<span class="countdown-min"><span class="countdown_ti heading-weight">' +
            minutes +
            '</span> <span class="countdown_tx">' +
            mins +
            "</span></span> " +
            '<span class="countdown-sec"><span class="countdown_ti heading-weight">' +
            seconds +
            '</span> <span class="countdown_tx">' +
            secs +
            "</span></span>";
          const cd = e.querySelector(".bls__product-countdown");
          if (cd) {
            cd.innerHTML = html;
          }
          if (distance < 0) {
            clearInterval(timer);
          }
        }, 1000);
      });
    },

    handleCountdown: function () {
      var second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24;
      const timer = document.querySelectorAll(".bls__timer");
      timer.forEach((e) => {
        const { timer } = e?.dataset;
        const dateParts = timer.split("-");
        const isoDate =
          dateParts[2] +
          "-" +
          dateParts[0].padStart(2, "0") +
          "-" +
          dateParts[1].padStart(2, "0") +
          "T00:00:00Z";
        if (Date.parse(isoDate)) {
          var countDown = new Date(isoDate).getTime();
          if (countDown) {
            setInterval(function () {
              var now = new Date().getTime(),
                distance = countDown - now;
              if (countDown >= now) {
                (e.querySelector(".js-timer-days").innerText =
                  Math.floor(distance / day) < 10
                    ? ("0" + Math.floor(distance / day)).slice(-2)
                    : Math.floor(distance / day)),
                  (e.querySelector(".js-timer-hours").innerText = (
                    "0" + Math.floor((distance % day) / hour)
                  ).slice(-2)),
                  (e.querySelector(".js-timer-minutes").innerText = (
                    "0" + Math.floor((distance % hour) / minute)
                  ).slice(-2)),
                  (e.querySelector(".js-timer-seconds").innerText = (
                    "0" + Math.floor((distance % minute) / second)
                  ).slice(-2));
              }
            }, second);
          }
        }
      });
    },
  };
})();
BlsCountdownTimer.init();

var BlsWishlistHeader = (function () {
  return {
    init: function () {
      this.handleCount();
    },
    handleCount: function () {
      const wishlist = document.querySelectorAll(".bls-header-wishlist");
      const items = JSON.parse(localStorage.getItem("bls__wishlist-items"));
      wishlist.forEach((item) => {
        const numb = item.querySelector(".wishlist-count");
        if (numb) {
          numb.innerText =
            items !== null && items.length != 0 ? items.length : 0;
        }
      });
    },
  };
})();

var BlsWishlistLoad = (function () {
  return {
    init: function (productHandle, wishlist_items) {
      const is_page_wishlist = document.querySelector(
        ".bls__wishlist-page-section"
      );
      if (productHandle) {
        const arr_items = [];
        if (wishlist_items === null) {
          arr_items.push(productHandle);
          localStorage.setItem(
            "bls__wishlist-items",
            JSON.stringify(arr_items)
          );
        } else {
          let index = wishlist_items.indexOf(productHandle);
          arr_items.push(...wishlist_items);
          if (index === -1) {
            arr_items.push(productHandle);
            localStorage.setItem(
              "bls__wishlist-items",
              JSON.stringify(arr_items)
            );
          } else if (index > -1) {
            arr_items.splice(index, 1);
            localStorage.setItem(
              "bls__wishlist-items",
              JSON.stringify(arr_items)
            );
            if (is_page_wishlist) {
              const div_no_product = is_page_wishlist.querySelector(
                ".bls__wishlist-no-product-js"
              );
              const item_remove = document.querySelector(
                '.bls__wishlist-list[data-product-handle="' +
                  productHandle +
                  '"]'
              );
              if (item_remove) {
                item_remove.remove();
              }
              const it =
                is_page_wishlist.querySelectorAll(".bls__product-item");
              if (wishlist_items.length <= 1 || it.length < 1) {
                div_no_product.classList.remove("d-none");
              }
            }
          }
        }
        BlsSubActionProduct.handleInitWishlist();
      }
    },
  };
})();

var BlsCompareLoad = (function () {
  return {
    init: function (productTarget, compare_items) {
      const is_page_compare = document.querySelector(
        ".bls__compare-page-section"
      );
      if (productTarget) {
        const productHandle = productTarget.dataset.productHandle;
        const arr_items = [];
        if (compare_items === null) {
          arr_items.push(productHandle);
          localStorage.setItem("bls__compare-items", JSON.stringify(arr_items));
        } else {
          let index = compare_items.indexOf(productHandle);
          arr_items.push(...compare_items);
          if (index === -1) {
            arr_items.push(productHandle);
            localStorage.setItem(
              "bls__compare-items",
              JSON.stringify(arr_items)
            );
          } else if (index > -1) {
            arr_items.splice(index, 1);
            localStorage.setItem(
              "bls__compare-items",
              JSON.stringify(arr_items)
            );
            if (is_page_compare) {
              const div_no_product = is_page_compare.querySelector(
                ".bls__compare-no-product-js"
              );
              const item_remove = document.querySelectorAll(
                '.bls__compare-value[data-product-handle="' +
                  productHandle +
                  '"]'
              );
              if (item_remove.length !== 0) {
                item_remove.forEach((i) => {
                  i.remove();
                });
              }
              const it = is_page_compare.querySelectorAll(".bls__product-item");
              if (compare_items.length <= 1 || it.length < 1) {
                div_no_product.classList.remove("d-none");
                const attr_remove = document.querySelector(
                  ".bls__compare-table"
                );
                if (attr_remove) {
                  attr_remove.classList.add("d-none");
                }
              }
            }
          }
        }
        BlsSubActionProduct.handleInitCompare();
      }
    },
  };
})();

var BlsSubActionProduct = (function () {
  return {
    init: function () {
      this.handleInitQuickviewAction();
      this.handleActionWishlist();
      this.handleInitWishlist();
      this.handleActionCompare();
      this.handleInitCompare();
    },

    handleInitQuickviewAction: function () {
      const _this = this;
      const qvbtn = document.querySelectorAll(".bls__product-quickview");
      if (qvbtn.length > 0) {
        qvbtn.forEach((e) => {
          e.addEventListener("click", () => {
            e.classList.add("btn-loading");
            const exist_load = e.querySelectorAll("span.loader-icon");
            if (exist_load.length === 0) {
              const exist_loading = e.querySelectorAll("div.loader-icon");
              if (exist_loading.length === 0) {
                const spanLoading = document.createElement("div");
                spanLoading.classList.add("loader-icon");
                e.appendChild(spanLoading);
              }
            }
            const productTarget = e.closest(".bls__product-item");
            _this.handleFetchDataQuickView(
              e,
              productTarget.dataset.productHandle
            );
          });
        });
      }
    },

    handleFetchDataQuickView: function (e, handle) {
      const _this = this;
      if (handle) {
        fetch(
          `${window.Shopify.routes.root}products/${handle}/?section_id=product-quickview`
        )
          .then((response) => response.text())
          .then((responseText) => {
            const html = parser.parseFromString(responseText, "text/html");
            html
              .querySelectorAll("#shopify-section-product-quickview")
              .forEach((el) => {
                var quickviewBox = EasyDialogBox.create(
                  "qvdialog",
                  "dlg dlg-disable-heading dlg-multi dlg-disable-footer dlg-disable-drag",
                  "",
                  el.innerHTML
                );
                quickviewBox.onClose = quickviewBox.destroy;
                quickviewBox.show();
                BlsColorSwatchesShopify.init();
                BlsReloadSpr.init();
                Shopify.eventFlashSold("dlg");
                Shopify.eventCountDownTimer("dlg");
                Shopify.swiperSlideQickview();
                BlsLazyloadImg.init();
                Shopify.PaymentButton.init();
              });
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            _this.handleActionWishlist();
            _this.handleInitWishlist();
            _this.handleActionCompare();
            _this.handleInitCompare();
            _this.showPopupStockNotify();
            Shopify.termsConditionsAction();
            e.classList.remove("btn-loading");
            e.querySelectorAll(".loader-icon").forEach((el) => {
              el.remove();
            });
          });
      }
    },

    handleInitWishlist: function () {
      const wishlist_items = JSON.parse(
        localStorage.getItem("bls__wishlist-items")
      );
      const wishlist_icon = document.querySelectorAll(".bls__product-wishlist");
      wishlist_icon.forEach((e) => {
        const { proAddWishlist, proRemoveWishlist, removeWishlist, action } =
          e?.dataset;
        const is_page_wishlist = document.querySelector(
          ".bls__wishlist-page-section"
        );
        const tooltip_wishlist = e.querySelector(".bls_tooltip-content");
        const productHandle = e.dataset.productHandle;
        if (wishlist_items !== null) {
          let index = wishlist_items.indexOf(productHandle);
          if (index !== -1) {
            e.querySelector(".bls__product-icon").classList.add("active");
            if (is_page_wishlist) {
              tooltip_wishlist.innerText =
                window.stringsTemplate?.messageRemoveWishlist;
            } else {
              if (action === "remove") {
                tooltip_wishlist.innerText = removeWishlist;
              } else {
                tooltip_wishlist.innerText = proRemoveWishlist;
              }
            }
          } else {
            e.querySelector(".bls__product-icon").classList.remove("active");
            tooltip_wishlist.innerText = proAddWishlist;
          }
        }
        BlsWishlistHeader.init();
      });
    },

    handleActionWishlist: function () {
      const btnWishlist = document.querySelectorAll(
        ".bls__product-wishlist-js"
      );
      if (btnWishlist.length > 0) {
        btnWishlist.forEach((e) => {
          e.addEventListener("click", this.handleWishlistFunctionClick);
        });
      }
    },

    handleWishlistFunctionClick: function (evt) {
      evt.preventDefault();
      const e = evt.currentTarget;
      const wishlist_items = JSON.parse(
        localStorage.getItem("bls__wishlist-items")
      );
      const productHandle = e.dataset.productHandle;
      const action = e.dataset.action;
      const is_page_wishlist = document.querySelector(
        ".bls__wishlist-page-section"
      );
      const is_minicart = document.querySelector(".bls-minicart-wrapper");
      if (is_page_wishlist) {
        BlsWishlistLoad.init(productHandle, wishlist_items);
      }
      const arr_items = [];
      if (wishlist_items === null) {
        arr_items.push(productHandle);
        localStorage.setItem("bls__wishlist-items", JSON.stringify(arr_items));
        BlsSubActionProduct.handleInitWishlist();
      } else {
        let index = wishlist_items.indexOf(productHandle);
        arr_items.push(...wishlist_items);
        if (index === -1) {
          arr_items.push(productHandle);
          localStorage.setItem(
            "bls__wishlist-items",
            JSON.stringify(arr_items)
          );
          BlsSubActionProduct.handleInitWishlist();
        } else if (index > -1) {
          if (is_page_wishlist) {
            arr_items.splice(index, 1);
            localStorage.setItem(
              "bls__wishlist-items",
              JSON.stringify(arr_items)
            );
          } else {
            if (action === "remove") {
              BlsWishlistLoad.init(productHandle, wishlist_items);
            } else {
              window.location.href = `${window.shopUrl}${window.Shopify.routes.root}pages/wishlist`;
            }
          }
        }
      }
    },

    handleCompareFunctionClick: function (evt) {
      const e = evt.currentTarget;
      const compare_items = JSON.parse(
        localStorage.getItem("bls__compare-items")
      );
      const productHandle = e.dataset.productHandle;
      const arr_items = [];
      if (compare_items === null) {
        arr_items.push(productHandle);
        localStorage.setItem("bls__compare-items", JSON.stringify(arr_items));
        BlsSubActionProduct.handleInitCompare();
      } else {
        let index = compare_items.indexOf(productHandle);
        arr_items.push(...compare_items);
        if (index === -1) {
          arr_items.push(productHandle);
          localStorage.setItem("bls__compare-items", JSON.stringify(arr_items));
          BlsSubActionProduct.handleInitCompare();
        } else if (index > -1) {
          window.location.href = `${window.shopUrl}${window.Shopify.routes.root}pages/compare`;
        }
      }
    },

    handleInitCompare: function () {
      const compare_items = JSON.parse(
        localStorage.getItem("bls__compare-items")
      );
      const compare_icon = document.querySelectorAll(".bls__product-compare");
      const is_page_compare = document.querySelector(
        ".bls__compare-page-section"
      );
      compare_icon.forEach((e) => {
        const { proAddCompare, proRemoveCompare } = e?.dataset;
        const tooltip_compare = e.querySelector(".bls_tooltip-content");
        const productHandle = e.dataset.productHandle;
        if (compare_items !== null) {
          let index = compare_items.indexOf(productHandle);
          if (index !== -1) {
            e.querySelector(".bls__product-icon").classList.add("active");
            if (is_page_compare) {
              tooltip_compare.innerText =
                window.stringsTemplate?.messageRemoveCompare;
            } else {
              tooltip_compare.innerText = proRemoveCompare;
            }
          } else {
            e.querySelector(".bls__product-icon").classList.remove("active");
            tooltip_compare.innerText = proAddCompare;
          }
        }
      });
    },

    handleActionCompare: function () {
      const btnCompare = document.querySelectorAll(".bls__product-compare-js");
      if (btnCompare.length > 0) {
        btnCompare.forEach((e) => {
          e.addEventListener("click", this.handleCompareFunctionClick);
        });
      }
    },

    showPopupStockNotify: function () {
      const stockClass = document.querySelectorAll(".product-notify-stock");
      const _this = this;
      stockClass.forEach((stock) => {
        stock.addEventListener("click", (e) => {
          const target = e.currentTarget;
          const variantId = target.getAttribute("data-product-variant");
          e.preventDefault();
          _this.fetchDataStockNotifySection(variantId);
        });
      });
    },

    fetchDataStockNotifySection: function (variantId) {
      const url = "/variants/" + variantId + "/?section_id=stock-notify";
      fetch(url)
        .then((response) => response.text())
        .then((responseText) => {
          const html = newParser.parseFromString(responseText, "text/html");
          const id = html.querySelector("#bls-stock-notify");
          const text = id.getAttribute("data-stock-title");
          if (id) {
            var createPopupStock = EasyDialogBox.create(
              "stockNotify",
              "dlg dlg-multi dlg-disable-footer dlg-disable-drag",
              text,
              id.innerHTML
            );
            createPopupStock.center();
            createPopupStock.onClose = createPopupStock.destroy;
            createPopupStock.show();
          }
        })
        .catch((e) => {
          throw e;
        });
    },
  };
})();
BlsSubActionProduct.init();

var BlsSubActionProductPreLoad = (function () {
  return {
    handleActionPg: function () {
      const btnRemoveCompare = document.querySelectorAll(
        ".bls__compare-remove-js"
      );
      if (btnRemoveCompare.length > 0) {
        btnRemoveCompare.forEach((e) => {
          e.addEventListener("click", function () {
            const compare_items = JSON.parse(
              localStorage.getItem("bls__compare-items")
            );
            const productTarget = e.closest(".bls__product-item");
            if (productTarget) {
              BlsCompareLoad.init(productTarget, compare_items);
            }
          });
        });
      }
    },
  };
})();

var BlsReloadSpr = (function () {
  return {
    init: function () {
      if (window.SPR) {
        window.SPR.registerCallbacks();
        window.SPR.initRatingHandler();
        window.SPR.initDomEls();
        window.SPR.loadProducts();
        window.SPR.loadBadges();
      }
    },
  };
})();

var BlsMainMenuShopify = (function () {
  return {
    init: function () {
      this.initMainMenu();
      this.initVerticalMenu();
    },
    initMainMenu: function () {
      var _this = this;
      const header = document.querySelector(global.header);
      const sticky = header?.getAttribute("data-sticky");
      const sticky_mobile = header?.getAttribute("data-sticky-mobile");
      const verticalmenu = document.querySelector(".verticalmenu-list");
      const bls_main_menu = document.querySelector(".bls_main_menu");
      var menu_parent = "li.bls__menu-parent";

      // _this.onMenuMobileItem();
      // _this.loadMoreMenu();
      document.querySelectorAll(".nav-toggle").forEach((navToggle) => {
        navToggle.addEventListener("click", (e) => {
          if (document.documentElement.classList.contains("nav-open")) {
            document.documentElement.classList.remove("nav-open");
            if (!bls_main_menu) {
              document.documentElement.classList.remove("nav-verticalmenu");
            }
          } else {
            document.documentElement.classList.add("nav-open");
            if (!bls_main_menu) {
              document.documentElement.classList.add("nav-verticalmenu");
            }
          }
        });
      });

      document.querySelectorAll(".close-menu").forEach((closeToggle) => {
        closeToggle.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
            document.documentElement.classList.remove("nav-open");
            document
              .querySelectorAll(".submenu,.subchildmenu")
              .forEach((item) => {
                item.classList.remove("is--open");
                if (item.classList.contains("is--open-lv2")) {
                  item.classList.remove("is--open-lv2");
                }
                if (item.classList.contains("is--open-lv3")) {
                  item.classList.remove("is--open-lv3");
                }
              });
          },
          false
        );
      });

      if (verticalmenu && bls_main_menu) {
        const article = document.querySelector(".verticalmenu-html");
        const limitItemShow = article.dataset.limitshowitem;
        const html_title =
          '<a data-menu="verticalmenu-list" href="#">' +
          window.menuStrings?.verticalTitle +
          "</a>";
        const verticalmenu_html =
          document.querySelector(".verticalmenu-list").innerHTML;
        const el = document.createElement("ul");
        el.classList.add("verticalmenu-list");
        el.classList.add("verticalmenu-mobile");
        el.style.display = "none";
        el.setAttribute("data-limitshowitem", limitItemShow);
        el.innerHTML = verticalmenu_html;
        document
          .querySelector(".bls_main_menu .mobile-menu-content")
          .appendChild(el);
        document
          .querySelector(".bls_main_menu .menu-mobile-title")
          .insertAdjacentHTML("beforeend", html_title);
        // _this.onMenuMobileItem("verticalmenu");
      }

      document
        .querySelectorAll(".bls_main_menu .menu-mobile-title a")
        .forEach((navToggle) => {
          navToggle.addEventListener(
            "click",
            (e) => {
              e.preventDefault();
              const target = e.currentTarget;
              const data = target.getAttribute("data-menu");
              for (var item_title of document.querySelectorAll(
                ".bls_main_menu .menu-mobile-title a"
              )) {
                item_title.classList.remove("active");
              }
              target.classList.add("active");
              for (var item_menu of document.querySelectorAll(
                ".bls_main_menu .mobile-menu-content > ul"
              )) {
                item_menu.style.display = "none";
              }
              document.querySelector(
                ".bls_main_menu ." + data + ""
              ).style.display = "block";
            },
            false
          );
        });

      let width = screen.width;
      document
        .querySelectorAll("li.bls__menu-parent .submenu")
        .forEach((menuItem, index) => {
          if (width > 1024) {
            menuItem.addEventListener("mouseenter", (e) => {
              const target = e.currentTarget;
              target
                .closest(".bls__menu-parent")
                .classList.add("bls-item-active-submenu");
            });
            menuItem.addEventListener("mouseleave", (e) => {
              const target = e.currentTarget;
              target
                .closest(".bls__menu-parent")
                .classList.remove("bls-item-active-submenu");
            });
          }
        });

      document
        .querySelectorAll(".bls-menu-item.type_banner")
        .forEach((menuItem, index) => {
          if (menuItem.classList.contains("space-banner")) {
            menuItem.closest(".submenu").classList.add("submenu-space-banner");
          }
        });

      let windowWidth = window.innerWidth;
      window.addEventListener("resize", function () {
        windowWidth = window.innerWidth;
        ac(windowWidth);
      });
      window.addEventListener("load", function () {
        windowWidth = screen.width;
        al(windowWidth);
      });
      function al(windowWidth) {
        if (windowWidth <= 1024) {
          if (document.querySelector(".show-localization")) {
            if (document.querySelector(".lang-curentcy")) {
              document.querySelector(".lang-curentcy")?.remove();
            }
            // if (document.querySelector(".topbar")) {
            //   document
            //     .querySelectorAll(".topbar localization-form")
            //     .forEach((item) => {
            //       if (item) {
            //         item.remove();
            //       }
            //     });
            // }
          } else {
            document.querySelectorAll(".disclosure-mobile").forEach((item) => {
              if (item) {
                item.remove();
              }
            });
          }
        }
      }
      function ac(windowWidth) {
        const categoriesListMenuMobile = document.querySelector(
          ".categories-list-menu-mobile"
        );
        const categoriesListMenu = document.querySelector(
          '[data-menu="categories-list"]'
        );
        const categoriesListMenuVertical = document.querySelector(
          '[data-menu="verticalmenu-list"]'
        );
        const categoriesListMenuVerticalMobile = document.querySelector(
          ".verticalmenu-mobile"
        );
        const horizontalList = document.querySelector(".horizontal-list");

        if (document.querySelectorAll("li.advanced-content > .sub").length) {
          if (windowWidth <= 1024) {
            for (var item_content of document.querySelectorAll(
              "li.advanced-content > .sub"
            )) {
              item_content.classList.remove("active");
            }
          } else {
            for (var item_content of document.querySelectorAll(
              "li.advanced-content > .sub"
            )) {
              item_content.classList.add("active");
              break;
            }
          }
        }
        if (windowWidth <= 1024) {
          if (document.querySelector(".show-localization")) {
            if (document.querySelector(".lang-curentcy")) {
              document.querySelector(".lang-curentcy")?.remove();
            }
            // if (document.querySelector(".topbar")) {
            //   document
            //     .querySelectorAll(".topbar localization-form")
            //     .forEach((item) => {
            //       if (item) {
            //         item.remove();
            //       }
            //     });
            // }
          } else {
            document.querySelectorAll(".disclosure-mobile").forEach((item) => {
              if (item) {
                item.remove();
              }
            });
          }
          if (document.querySelector(".verticalmenu-mobile")) {
            document.querySelector(".categories-list-menu-mobile")?.remove();
            document.querySelector('[data-menu="categories-list"]')?.remove();
          }
          if (
            (horizontalList &&
              categoriesListMenu?.classList.contains("active")) ||
            categoriesListMenuVertical?.classList.contains("active")
          ) {
            horizontalList.style.display = "none";
          }
          if (
            categoriesListMenuMobile &&
            categoriesListMenu.classList.contains("active")
          ) {
            categoriesListMenuMobile.style.display = "block";
          }
          if (
            categoriesListMenuVerticalMobile &&
            categoriesListMenuVertical.classList.contains("active")
          ) {
            categoriesListMenuVerticalMobile.style.display = "block";
          }
        } else {
          if (
            categoriesListMenuMobile &&
            categoriesListMenu.classList.contains("active")
          ) {
            categoriesListMenuMobile.style.display = "none";
          }

          if (
            categoriesListMenuVerticalMobile &&
            categoriesListMenuVertical.classList.contains("active")
          ) {
            categoriesListMenuVerticalMobile.style.display = "none";
          }

          if (
            (horizontalList &&
              categoriesListMenu?.classList.contains("active")) ||
            categoriesListMenuVertical?.classList.contains("active")
          ) {
            horizontalList.style.display = "block";
          }
        }
      }
      ac(windowWidth);
      al(windowWidth);
      document.querySelectorAll("li.advanced-main a").forEach((item) => {
        item.addEventListener(
          "mouseenter",
          (e) => {
            const target = e.currentTarget;
            const data = target.getAttribute("data-link");
            if (data) {
              for (var item_content of document.querySelectorAll(
                "li.advanced-content > .sub"
              )) {
                item_content.classList.remove("active");
              }
              for (var item of document.querySelectorAll(
                "li.advanced-main a"
              )) {
                item.classList.remove("active");
              }

              target.classList.add("active");
              if (document.getElementById(data)) {
                document.getElementById(data).classList.add("active");
              }
            }
          },
          false
        );
      });
      let headerbar = 0;
      if (document.getElementById("announcement-bar")) {
        headerbar = document.getElementById("announcement-bar")?.clientHeight;
      }
      let sticky_height = 0;
      if (document.getElementById("bls__sticky-addcart")) {
        sticky_height = document.getElementById(
          "bls__sticky-addcart"
        )?.clientHeight;
      }
      let headertopbar = 0;
      if (document.getElementById("top-bar")) {
        headertopbar = document.getElementById("top-bar").clientHeight;
      }
      let headerpage = document.getElementById("page-header")?.clientHeight;
      document
        .querySelector("body")
        .setAttribute(
          "style",
          "--height-bar: " +
            headerbar +
            "px;--height-header: " +
            headerpage +
            "px;--height-top-bar: " +
            headertopbar +
            "px;--height-sticky: " +
            sticky_height +
            "px "
        );
      if (sticky == "true") {
        if (sticky_mobile == "false" && window.innerWidth < 1025) {
          return;
        }
        let headerSpaceH =
          document.getElementById("sticky-header").offsetHeight;
        let newdiv = document.createElement("div");
        let headerh = headerbar + headertopbar + headerSpaceH;
        newdiv.style.height = headerSpaceH + "px";
        newdiv.classList.add("headerSpace", "unvisible");
        document.querySelector("#sticky-header").after(newdiv);
        window.addEventListener("scroll", () => {
          const currentScroll = window.pageYOffset;
          if (
            currentScroll <= header.querySelector(".header-middle").offsetTop
          ) {
            if (header.classList.contains("transparent")) {
              header.classList.add("transparent");
            }
            return;
          }
          if (header.classList.contains("transparent")) {
            header.classList.remove("transparent");
          }
        });
        window.addEventListener("scroll", () => {
          stickyFunction();
        });
        function stickyFunction() {
          if (window.pageYOffset > headerh) {
            header.classList.add("header_scroll_down");
            header.classList.add("header_scroll_up");
            header.querySelector(".headerSpace").classList.remove("unvisible");
            if (document.querySelector(".extent-button-right-bar")) {
              document
                .querySelector(".extent-button-right-bar")
                .classList.add("d-xxl-block");
            }
          } else {
            header.classList.remove("header_scroll_down");
            header.querySelector(".headerSpace").classList.add("unvisible");
            if (document.querySelector(".extent-button-right-bar")) {
              document
                .querySelector(".extent-button-right-bar")
                .classList.remove("d-xxl-block");
            }
            if (document.querySelector(".bls__overlay")) {
              document.documentElement.classList.remove("vetical-overlay");
              document
                .querySelector(".bls__overlay")
                .classList.add("d-none-overlay");
            }
            if (document.querySelector(".vertical-menu")) {
              if (
                document
                  .querySelector(".vertical-menu")
                  .classList.contains("open")
              ) {
                document
                  .querySelector(".vertical-menu")
                  .classList.remove("open");
              }
            }
          }
        }
      }

      if (bls_main_menu) {
        _this.loadImageMenu();
        let width = window.innerWidth;
        
        if (width > 1024) {
          _this.addCssSubMenu();
        }
        window.addEventListener(
          "resize",
          function (event) {
            let width = window.innerWidth;
            if (width > 1024) {
              _this.addCssSubMenu();
            } else {
              document
                .querySelectorAll(".horizontal-list .menu-width-custom")
                .forEach((submenu) => {
                  submenu.style.left = 0;
                });
            }
          },
          false
        );
      }
    },
    initVerticalMenu: function () {
      document.querySelectorAll(".close-menu").forEach((closeToggle) => {
        closeToggle.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
            document.documentElement.classList.remove("nav-open");
            document
              .querySelectorAll(".submenu,.subchildmenu")
              .forEach((item) => {
                item.classList.remove("is--open");
                if (item.classList.contains("is--open-lv2")) {
                  item.classList.remove("is--open-lv2");
                }
                if (item.classList.contains("is--open-lv3")) {
                  item.classList.remove("is--open-lv3");
                }
              });
          },
          false
        );
      });
      let width = screen.width;
      const article = document.querySelector(".verticalmenu-html");
      if (article === null) return;
      const limitItemShow = article.dataset.limitshowitem;
      const lenghtLi = document.querySelectorAll(
        ".verticalmenu-html .level0"
      ).length;
      if (width > 1024) {
        if (lenghtLi > limitItemShow) {
          var lineItem = Array.from(
            document.querySelectorAll(".verticalmenu-html .level0")
          );
          lineItem.forEach((element, index) => {
            if (index > limitItemShow - 1) {
              const item = lineItem[index];
              if (item.classList.contains("expand-menu-link")) {
                return;
              }
              item.classList.add("orther-link");
              item.style.display = "none";
            }
          });
          document.querySelector(
            ".verticalmenu-html .expand-menu-link"
          ).style.display = "block";
          document
            .querySelector(".verticalmenu-html .expand-menu-link a")
            .addEventListener(
              "click",
              (e) => {
                e.preventDefault();
                const target = e.currentTarget;
                const parent = target.parentElement;
                if (!parent.classList.contains("expanding")) {
                  parent.classList.add("expanding");
                  parent.querySelector("a").innerHTML =
                    window.menuStrings?.hideMenus;
                  for (var item of document.querySelectorAll(
                    ".verticalmenu-html .level0.orther-link"
                  )) {
                    showAnime(item);
                  }
                } else {
                  parent.classList.remove("expanding");
                  parent.querySelector("a").innerHTML =
                    window.menuStrings?.moreMenus;
                  for (var item of document.querySelectorAll(
                    ".verticalmenu-html .level0.orther-link"
                  )) {
                    hideAnime(item);
                  }
                }
              },
              false
            );
        } else {
          document.querySelector(".expand-menu-link").style.display = "none";
        }
      }
      if (document.querySelector(".bls_vertical_menu .title-menu-dropdown")) {
        document
          .querySelector(".bls_vertical_menu .title-menu-dropdown")
          .addEventListener("click", (event) => {
            event.preventDefault();
            const target = event.currentTarget;
            const closest = target.closest(".vertical-menu");
            if (closest.classList.contains("open")) {
              closest.classList.remove("open");
              if (document.querySelector(".bls__overlay")) {
                document.documentElement.classList.remove("vetical-overlay");
                document
                  .querySelector(".bls__overlay")
                  .classList.add("d-none-overlay");
              }
            } else {
              closest.classList.add("open");
              if (document.querySelector(".bls__overlay")) {
                document.documentElement.classList.add("vetical-overlay");
                document
                  .querySelector(".bls__overlay")
                  .classList.remove("d-none-overlay");
              }
            }
          });
      }
    },
    onMenuItemEnter: function (evt, index) {
      const target = evt;
      target.classList.add("bls-item-active");
    },
    onMenuItemLeave: function (evt, index) {
      const target = evt;
      target.classList.remove("bls-item-active");
    },
    onMenuMobileItem: function (evt) {
      var menu_parent = "li.bls__menu-parent > .open-children-toggle";
      var menu_submenu = "li.bls__menu-parent .submenu .open-children-toggle";
      if (evt) {
        menu_parent =
          ".verticalmenu-list li.bls__menu-parent > .open-children-toggle";
        menu_submenu =
          ".verticalmenu-list li.bls__menu-parent .submenu .open-children-toggle";
      }
      document.querySelectorAll(menu_parent).forEach((childrenToggle) => {
        childrenToggle.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
            const target = e.currentTarget;
            const parent = target.parentElement;
            const submenu = parent.querySelector(".submenu");
            slideAnime({
              target: submenu,
              animeType: "slideToggle",
            });
            if (!parent.querySelector("a").classList.contains("active")) {
              parent.querySelector("a").classList.add("active");
            } else {
              parent.querySelector("a").classList.remove("active");
            }
          },
          false
        );
      });

      document.querySelectorAll(menu_submenu).forEach((childrenToggle) => {
        childrenToggle.addEventListener("click", (e) => {
          const target = e.currentTarget;
          const parent = target.parentElement;
          const submenu = parent.querySelector(".subchildmenu");
          slideAnime({
            target: submenu,
            animeType: "slideToggle",
          });
          if (!parent.querySelector("a").classList.contains("active")) {
            parent.querySelector("a").classList.add("active");
          } else {
            parent.querySelector("a").classList.remove("active");
          }
        });
      });
    },
    addCssSubMenu: function () {
      const bodyWidth =
        document.documentElement.clientWidth || document.body.clientWidth;

      const header = document.querySelector("header");
      const submenu_center = document.querySelector(".bls_submenu-center");
      const width_sub_center = 800;
      if (!header || window.innerWidth < 1024) return;
      var padding = 30;
      if (bodyWidth < 1200) {
        padding = 15;
      }
      document
        .querySelectorAll(".horizontal-list .menu-width-custom")
        .forEach((submenu) => {
          if (submenu_center) {
            var submenu_data = submenu.getBoundingClientRect();
            var width = submenu_data.width;
            var left = submenu_data.left;
            var right = submenu_data.right;
            if (width_sub_center <= width) {
              var left_style = (left - (right - bodyWidth)) / 2;
              submenu.style.left = left_style + "px";
            }
          } else {
            const elementWidth = submenu.clientWidth;
            const elementLeft = submenu.offsetLeft;
            if (bodyWidth - (elementWidth + elementLeft) < 0) {
              var left = bodyWidth - (elementWidth + elementLeft);
              left = left + elementLeft - padding;
              if (elementLeft < 0) {
                left = 0;
              }
              submenu.style.left = left + "px";
            }
          }
        });
    },
    loadImageMenu: function () {
      const menu_parent = document.querySelectorAll(".bls__menu-parent");
      var width = window.innerWidth;
      menu_parent.forEach((menu) => {
        menu.addEventListener("mouseover", (items) => {
          var target = items.currentTarget;
          target.querySelectorAll(".menu-banner-loaded").forEach((item) => {
            var dataImgBanner = item?.dataset.imageBanner;
            var dataImgWidth = item?.dataset.width;
            var dataImgHeight = item?.dataset.height;
            var img = item.querySelector(".image-banner-loaded");
            if (img == null && dataImgBanner != undefined) {
              item.innerHTML = `<img 
              src=${dataImgBanner} 
              alt="Menu banner" 
              srcset="${dataImgBanner}&amp;width=375 375w, ${dataImgBanner}&amp;width=550 550w, ${dataImgBanner}&amp;width=750 750w, ${dataImgBanner}&amp;width=1100 1100w, ${dataImgBanner}&amp;width=1500 1500w, ${dataImgBanner}&amp;width=1780 1780w, ${dataImgBanner}&amp;width=2000 2000w, ${dataImgBanner}&amp;width=3000 3000w, ${dataImgBanner}&amp;width=3840 3840w" 
              sizes="100vw",
              class="image-banner-loaded"
              loading="lazy"
              width="${dataImgWidth}"
              height="${dataImgHeight}"
            >`;
            }
          });
        });
      });
    },
    loadMoreMenu: function () {
      let firstMenuParent =
        document.querySelector(".horizontal-list")?.firstChild;
      let submenu = firstMenuParent?.querySelector(".submenu");
      let loadmore = submenu?.querySelector(".extent-loadmore-button");
      let loadmoreButton = document.querySelector(".loadmore-menu");
      if (loadmoreButton == null) {
        let loadmoreHtml = `<div class="loadmore-menu text-center">
          <a  class="demo whitespace-nowrap btn-primary" role="link" aria-label="View All Demos">
            View All Demos
          </a>
        </div>`;
        loadmore?.insertAdjacentHTML("beforeend", loadmoreHtml);
        loadmore?.init();
      }
    },
  };
})();
BlsMainMenuShopify.init();

var BlsMenuActionMobile = (function () {
  return {
    init: function () {
      this.menuTabActions();
    },
    menuTabActions: function () {
      var back_main_menu = ".back-main-menu",
        back_main_menu_lv1 = ".back-main-menu-lv1",
        back_main_menu_lv2 = ".back-main-menu-lv2",
        back_main_menu_lv3 = ".back-main-menu-lv3",
        menu_parent_link = "li.bls__menu-parent > a",
        menu_parent = "li.bls__menu-parent > .open-children-toggle",
        submenu = ".submenu",
        subchildmenu = ".subchildmenu",
        menu_lv2 = "[data-menu-level2]",
        dropdown_lv2 = ".submenu .dropdown li.level-1 > .open-children-toggle",
        dropdown_lv3 = ".submenu .dropdown li.level-2 > .open-children-toggle";
      let windowWidth = window.innerWidth;
      if (windowWidth <= 1024) {
        document.querySelectorAll(menu_parent_link).forEach((link) => {
          const main = link
            .closest(".main-nav")
            ?.getAttribute("data-action-mobile");
          if (main === "false") {
            link.removeAttribute("href");
            link.classList.add("not-links");
            link.setAttribute("role", "link");
          }
        });
      }
      document.querySelectorAll(menu_parent).forEach((main) => {
        main.addEventListener("click", (e) => {
          const target = e.currentTarget;
          const parent = target.parentElement;
          var menu_lv2_nodes = parent.querySelectorAll(
            ".submenu [data-menu-level2]"
          );
          if (menu_lv2_nodes) {
            var menu_lv2_last = menu_lv2_nodes[menu_lv2_nodes.length - 1];
            if (menu_lv2_last) {
              menu_lv2_last.classList.add("last-child");
            }
          }
          if (parent.querySelector(".submenu")) {
            if (
              !parent.querySelector(".submenu").classList.contains("is--open")
            ) {
              parent.querySelector(".submenu").classList.add("is--open");
            } else {
              parent.querySelector(".submenu").classList.remove("is--open");
            }
          }
        });
      });

      document.querySelectorAll(back_main_menu).forEach((back) => {
        back.addEventListener("click", (e) => {
          const target = e.currentTarget;
          e.preventDefault();
          target.closest(submenu).classList.remove("is--open");
        });
      });

      document.querySelectorAll(menu_lv2).forEach((lv2) => {
        lv2.addEventListener("click", (e) => {
          const target = e.currentTarget;
          const parent = target.parentElement;
          if (
            !parent
              .querySelector(".subchildmenu")
              ?.classList.contains("is--open")
          ) {
            parent.querySelector(".subchildmenu").classList.add("is--open");
          } else {
            parent.querySelector(".subchildmenu").classList.remove("is--open");
          }
        });
      });

      document.querySelectorAll(back_main_menu_lv1).forEach((back) => {
        back.addEventListener("click", (e) => {
          e.preventDefault();
          for (var item of document.querySelectorAll(subchildmenu)) {
            item.classList.remove("is--open");
          }
        });
      });

      document.querySelectorAll(back_main_menu_lv2).forEach((back) => {
        back.addEventListener("click", (e) => {
          e.preventDefault();
          const target = e.currentTarget;
          target.closest(subchildmenu).classList.remove("is--open-lv2");
        });
      });

      document.querySelectorAll(back_main_menu_lv3).forEach((back) => {
        back.addEventListener("click", (e) => {
          e.preventDefault();
          const target = e.currentTarget;
          target.closest(subchildmenu).classList.remove("is--open-lv3");
        });
      });

      document.querySelectorAll(dropdown_lv2).forEach((lv3) => {
        lv3.addEventListener("click", (e) => {
          const target = e.currentTarget;
          const parent = target.parentElement;
          if (
            !parent
              .querySelector("li .subchildmenu")
              ?.classList.contains("is--open-lv2")
          ) {
            parent
              .querySelector("li .subchildmenu")
              .classList.add("is--open-lv2");
          } else {
            parent
              .querySelector("li .subchildmenu")
              .classList.remove("is--open-lv2");
          }
        });
      });

      document.querySelectorAll(dropdown_lv3).forEach((lv3) => {
        lv3.addEventListener("click", (e) => {
          const target = e.currentTarget;
          const parent = target.parentElement;
          if (
            !parent
              .querySelector("li .subchildmenu")
              ?.classList.contains("is--open-lv3")
          ) {
            parent
              .querySelector("li .subchildmenu")
              .classList.add("is--open-lv3");
          } else {
            parent
              .querySelector("li .subchildmenu")
              .classList.remove("is--open-lv3");
          }
        });
      });
    },
  };
})();
BlsMenuActionMobile.init();

var BlsSearchShopify = (function () {
  return {
    init: function () {
      var predictive = document.querySelector("#predictive-search");
      if (predictive) {
        this.setupEventListeners();
      }
      const form = document.querySelector("#search-form");
      document.querySelectorAll(".top-search-toggle").forEach((navToggle) => {
        navToggle.addEventListener("click", () => {
          if (!form.classList.contains("bls__opend-popup-header")) {
            form.classList.add("bls__opend-popup-header");
            document.documentElement.classList.add("hside_opened");
            document.documentElement.classList.add("open-search");
            setTimeout(function () {
              form.querySelector('input[type="search"]').focus();
            }, 100);
          } else {
            form.classList.remove("bls__opend-popup-header");
            document.documentElement.classList.remove("hside_opened");
            document.documentElement.classList.remove("open-search");
          }
        });
      });
      document
        .querySelectorAll(".mini_search_header .button-close")
        .forEach((navToggle) => {
          navToggle.addEventListener("click", () => {
            form.classList.remove("bls__opend-popup-header");
            document.documentElement.classList.remove("hside_opened");
            document.documentElement.classList.remove("open-search");
          });
        });
      const sf = document.querySelector(".search-full");
      if (sf) {
        const hs = sf.closest(".header_search");
        document.addEventListener("click", (e) => {
          const ehs = e.target.closest(".header_search");
          if (!ehs) {
            if (hs) {
              const ps = hs.querySelector(".popup-search");
              ps.classList.remove("popup-search-show");
              if (document.querySelector('.top-search')) {
                document.querySelector(".bls__overlay").classList.add("d-none-overlay");
                document.querySelector(".bls__overlay").classList.remove("popup-top-search");
              }
            }
          } else {
            const ps = ehs.querySelector(".popup-search");
            if(!e.target.closest(".button-close")){
              ps.classList.add("popup-search-show");
              if (document.querySelector('.top-search')) {
                document.querySelector(".bls__overlay").classList.remove("d-none-overlay");
                document.querySelector(".bls__overlay").classList.add("popup-top-search");
              }
            }    
            if ((e.target && e.target.classList.contains("popup-search-show") ) || e.target.closest(".button-close") ) {
              ps.classList.remove("popup-search-show");
              if (document.querySelector('.top-search')) {
                document.querySelector(".bls__overlay").classList.add("d-none-overlay");
                document.querySelector(".bls__overlay").classList.remove("popup-top-search");
              }
            }
          }
        });
        document.querySelector(".bls__overlay").addEventListener("click", () => {
          if (document.querySelector(".bls__overlay").classList.contains("popup-top-search")) {
            document.querySelector(".bls__overlay").classList.remove("popup-top-search");
          }
        });
      }
    },
    setupEventListeners: function () {
      const input = document.querySelector('input[type="search"]');
      const form = document.querySelector("form.search");
      form.addEventListener("submit", this.onFormSubmit.bind(this));
      input.addEventListener(
        "input",
        this.debounce((event) => {
          this.onChange(event);
        }, 300).bind(this)
      );
      input.addEventListener("focus", this.onFocus.bind(this));
      document.addEventListener("focusout", this.onFocusOut.bind(this));
      document.addEventListener("keyup", this.onKeyup.bind(this));
      document
        .querySelectorAll('.select_cat [data-name="product_type"] li')
        .forEach((product_type) => {
          product_type.addEventListener("click", (e) => {
            const target = e.currentTarget;
            if (target.classList.contains("active")) {
              return;
            } else {
              for (var item of document.querySelectorAll(
                '.select_cat [data-name="product_type"] li'
              )) {
                item.classList.remove("active");
              }
              target.classList.add("active");
              document
                .querySelector("#search_mini_form")
                .querySelector('[name="category"]').value =
                target.getAttribute("data-value");
              this.onChange();
            }
          });
        });
    },

    debounce: function (fn, wait) {
      let t;
      return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
      };
    },

    getQuery: function () {
      return document.querySelector('input[type="search"]').value.trim();
    },

    onChange: function () {
      const searchTerm = this.getQuery();
      if (!searchTerm.length) {
        this.close(true);
        return;
      }
      this.getSearchResults(searchTerm);
    },

    onFormSubmit: function (event) {
      if (
        !this.getQuery().length ||
        this.querySelector('[aria-selected="true"] a')
      )
        event.preventDefault();
    },

    onFocus: function () {
      const searchTerm = this.getQuery();
      if (!searchTerm.length) return;
      if (
        document
          .querySelector("#predictive-search")
          .classList.contains("results")
      ) {
        this.open();
      } else {
        this.getSearchResults(searchTerm);
      }
    },

    onFocusOut: function () {
      setTimeout(() => {
        if (!document.contains(document.activeElement)) this.close();
      });
    },

    onKeyup: function (event) {
      if (!this.getQuery().length) this.close(true);
      event.preventDefault();

      switch (event.code) {
        case "ArrowUp":
          this.switchOption("up");
          break;
        case "ArrowDown":
          this.switchOption("down");
          break;
        case "Enter":
          this.selectOption();
          break;
      }
    },

    switchOption: function (direction) {
      if (!this.getAttribute("open")) return;
      const moveUp = direction === "up";
      const selectedElement = document.querySelector('[aria-selected="true"]');
      const allElements = document.querySelectorAll("li");
      let activeElement = document.querySelector("li");

      if (moveUp && !selectedElement) return;

      this.statusElement.textContent = "";

      if (!moveUp && selectedElement) {
        activeElement = selectedElement.nextElementSibling || allElements[0];
      } else if (moveUp) {
        activeElement =
          selectedElement.previousElementSibling ||
          allElements[allElements.length - 1];
      }

      if (activeElement === selectedElement) return;

      activeElement.setAttribute("aria-selected", true);
      if (selectedElement) selectedElement.setAttribute("aria-selected", false);
      document
        .querySelector('input[type="search"]')
        .setAttribute("aria-activedescendant", activeElement.id);
    },

    selectOption: function () {
      const selectedProduct = document.querySelector(
        '[aria-selected="true"] a, [aria-selected="true"] button'
      );

      if (selectedProduct) selectedProduct.click();
    },

    getSearchResults: function (searchTerm) {
      const cachedResults = {};
      const queryKey = searchTerm.replace(" ", "-").toLowerCase();
      this.setLiveRegionLoadingState();
      if (cachedResults[queryKey]) {
        this.renderSearchResults(cachedResults[queryKey]);
        return;
      }
      if (document.querySelector(".search_type_popup")) {
        var section_id = "search-predictive-grid";
      } else {
        var section_id = "search-predictive-list";
      }
      if (document.querySelector(".predictive_search_suggest")) {
        var search_url = `${
          routes?.predictive_search_url
        }?q=${encodeURIComponent(
          searchTerm
        )}&resources[type]=product,page,article,query,collection&section_id=${section_id}`;
      } else {
        var search_url = `${routes.search_url}?q=${encodeURIComponent(
          searchTerm
        )}&resources[type]=product,page,article,query,collection&section_id=${section_id}`;
      }
      fetch(`${search_url}`)
        .then((response) => {
          if (!response.ok) {
            var error = new Error(response.status);
            this.close();
            throw error;
          }
          return response.text();
        })
        .then((text) => {
          const resultsMarkup = new DOMParser()
            .parseFromString(text, "text/html")
            .querySelector("#shopify-section-" + section_id + "").innerHTML;
          cachedResults[queryKey] = resultsMarkup;
          this.renderSearchResults(resultsMarkup);
          BlsColorSwatchesShopify.init();
          BlsLazyloadImg.init();
        })
        .catch((error) => {
          this.close();
          throw error;
        });
    },

    setLiveRegionLoadingState: function () {
      document.querySelector("#search_mini_form").classList.add("loading");
      document.querySelector("#predictive-search").classList.add("loading");
    },

    setLiveRegionResults: function () {
      document.querySelector("#search_mini_form").classList.remove("loading");
      document.querySelector("#predictive-search").classList.remove("loading");
    },

    renderSearchResults: function (resultsMarkup) {
      document.querySelector("[data-predictive-search]").innerHTML =
        resultsMarkup;
      document.querySelector("#predictive-search").classList.add("results");
      const quick_search = document.querySelector("#quick-search");
      if (quick_search) {
        quick_search.classList.add("d-none");
      }
      this.setLiveRegionResults();
      this.open();
    },

    open: function () {
      document
        .querySelector('input[type="search"]')
        .setAttribute("aria-expanded", true);
      this.isOpen = true;
    },

    close: function (clearSearchTerm = false) {
      if (clearSearchTerm) {
        document.querySelector('input[type="search"]').value = "";
        document
          .querySelector("#predictive-search")
          .classList.remove("results");
        const quick_search = document.querySelector("#quick-search");
        if (quick_search) {
          quick_search.classList.remove("d-none");
        }
      }
      const selected = document.querySelector('[aria-selected="true"]');
      if (selected) selected.setAttribute("aria-selected", false);
      document
        .querySelector('input[type="search"]')
        .setAttribute("aria-activedescendant", "");
      document
        .querySelector('input[type="search"]')
        .setAttribute("aria-expanded", false);
      this.resultsMaxHeight = false;
      document
        .querySelector("[data-predictive-search]")
        .removeAttribute("style");
      this.isOpen = false;
    },
  };
})();
BlsSearchShopify.init();

var BlsRokanAdminLi = (function () {
  return {
    init: function () {
      this.BlsCheckLi();
    },
    BlsCheckLi: function () {
      const _this = this;
      if (typeof rokan_app === "object") {
        if (rokan_app.mode === "admin") {
          if (rokan_app.action === "active") {
            if (_this.checkCookie(rokan_app.lic) === false) {
              _this.BlsActive();
            }
          } else {
            const url =
              "https://mageblueskytech.com/rokan/api/remove-license/?code=" +
              rokan_app.lic +
              "&domain=" +
              rokan_app.shop;
            fetch(url)
              .then((response) => response.json())
              .then((responseText) => {
                if (responseText) {
                  const dateCreate = new Date(new Date().getTime() - 36e6);
                  _this.setCookie(rokan_app.lic, dateCreate);
                }
                _this.BlsRenderHtml(3);
              })
              .catch((e) => {
                console.log(e);
              });
          }
        }
      } else {
        _this.BlsRenderHtml(0);
      }
    },
    BlsRenderHtml: function (cs) {
      const shop = window.location.hostname.replace(/\./g, "-");
      if (!document.querySelector("#" + "bls__" + shop)) {
        const a = document.createElement("DIV");
        const n = document.createElement("DIV");
        const b = document.createElement("h3");
        const c = document.createElement("p");
        const step2p = document.createElement("p");
        const step3p = document.createElement("p");
        const elementH5 = document.createElement("h5");
        const e = document.createElement("h5");
        const f = document.createElement("h5");
        const g = document.createElement("h5");
        const h = document.createElement("strong");
        const sp1 = document.createElement("span");
        const sp2 = document.createElement("span");
        const sp3 = document.createElement("span");
        const pca = document.createElement("a");
        const eca = document.createElement("a");
        const mail = document.createElement("a");
        const br1 = document.createElement("br");
        const br2 = document.createElement("br");
        const br3 = document.createElement("br");
        const br4 = document.createElement("br");
        const spPrice = document.createElement("span");
        const spBold1 = document.createElement("span");
        const spBold2 = document.createElement("span");
        const ecbuy = document.createElement("a");

        var text = "";
        switch (cs) {
          case 1:
            text = "This purchase code was activated for another domain!";
            break;
          case 2:
            text = "This purchase code is invalid!";
            break;
          case 3:
            text = "Purchase Code deleted successfully!";
            break;
          default:
            text = "Welcome to Rokan - Shopify Themes OS 2.0 🎉 ";
            break;
        }
        const t = document.createTextNode(text);
        const s = document.createTextNode(
          "Follow these simple steps to use Rokan theme:"
        );
        const q = document.createTextNode(
          "Step 1: Add Rokan theme file to your 'Online store' > 'Theme'."
        );
        const p = document.createTextNode("Step 2: Insert purchase code");
        const k = document.createTextNode("Step 3: Activate purchase code");
        const r = document.createTextNode("Recommend: Install ");
        const ec = document.createTextNode("EComposer Page Builder");
        const fao = document.createTextNode(" - FREE Add-on for Rokan");
        const wh = document.createTextNode(
          "Why you need EComposer Page Builder?"
        );
        const ad1 = document.createTextNode(
          "- One more option to customize Rokan layouts."
        );
        const ad2 = document.createTextNode(
          "- Provide another highly flexible editor."
        );
        const ad3 = document.createTextNode("- Especially, ");
        const ad3_3 = document.createTextNode(
          " for Rokan users, we offer the "
        );
        const ad3_4 = document.createTextNode(" of this app ");
        const only = document.createTextNode("only");
        const partner = document.createTextNode("Theme Partner Plan");
        const price = document.createTextNode("$114) ");
        const ad3_2 = document.createTextNode(" every year), ");
        const plan_content = document.createTextNode(
          "contact us to upgrade your plan."
        );
        const w = document.createTextNode(
          "Go to 'Theme setting' > 'Purchase code' to insert your purchase code."
        );
        const x = document.createTextNode(
          "Go to 'Theme setting' > 'Purchase code action' and select 'Active purchase code'."
        );
        const m = document.createTextNode("👉 Get Rokan purchase code");
        const ecbuy_content = document.createTextNode(
          "👉 Install EComposer Here"
        );
        const step1 = document.createElement("DIV");
        const step2 = document.createElement("DIV");
        const step3 = document.createElement("DIV");
        const recommend = document.createElement("DIV");
        pca.setAttribute("target", "_blank");
        eca.setAttribute("target", "_blank");
        ecbuy.setAttribute("target", "_blank");
        pca.setAttribute(
          "href",
          "#"
        );
        eca.setAttribute(
          "href",
          "https://ecomposer.app/referral?ref=Blueskytechco"
        );
        mail.setAttribute("href", "mailto:the4studio.net@gmail.com");
        ecbuy.setAttribute(
          "href",
          "https://ecomposer.app/referral?ref=Blueskytechco"
        );
        b.setAttribute("class", `msg-${cs}`);
        eca.setAttribute("class", "link");
        mail.setAttribute("class", "link");
        pca.setAttribute("class", "popup-btn");
        ecbuy.setAttribute("class", "popup-btn ecom");
        spPrice.setAttribute("class", "ecom-price");
        spBold1.setAttribute("class", "ecom-bold");
        spBold2.setAttribute("class", "ecom-bold");
        step1.setAttribute("class", "step-1");
        step2.setAttribute("class", "step-2");
        step3.setAttribute("class", "step-3");
        pca.appendChild(m);
        ecbuy.appendChild(ecbuy_content);
        eca.appendChild(ec);
        step2p.appendChild(w);
        step3p.appendChild(x);
        b.appendChild(t);
        c.appendChild(s);
        elementH5.appendChild(q);
        e.appendChild(p);
        f.appendChild(k);
        g.appendChild(r);
        g.appendChild(eca);
        g.appendChild(fao);
        h.appendChild(wh);
        sp1.appendChild(ad1);
        sp2.appendChild(ad2);
        sp3.appendChild(ad3);
        spBold1.appendChild(only);
        sp3.appendChild(spBold1);
        sp3.appendChild(ad3_3);
        spBold2.appendChild(partner);
        sp3.appendChild(spBold2);
        sp3.appendChild(ad3_4);
        // spPrice.appendChild(price);
        sp3.appendChild(spPrice);
        // sp3.appendChild(ad3_2);
        mail.appendChild(plan_content);
        sp3.appendChild(mail);
        step1.appendChild(elementH5);
        step2.appendChild(e);
        step2.appendChild(step2p);
        step2.appendChild(pca);
        step3.appendChild(f);
        step3.appendChild(step3p);
        recommend.appendChild(g);
        recommend.appendChild(h);
        recommend.appendChild(br1);
        recommend.appendChild(sp1);
        recommend.appendChild(br2);
        recommend.appendChild(sp2);
        recommend.appendChild(br3);
        recommend.appendChild(sp3);
        recommend.appendChild(br4);
        recommend.appendChild(ecbuy);
        a.setAttribute("id", "bls__not-active");
        n.appendChild(b);
        n.appendChild(c);
        n.appendChild(step1);
        n.appendChild(step2);
        n.appendChild(step3);
        // n.appendChild(recommend);
        a.appendChild(n);
        setInterval(() => {
          if (document.getElementById("bls__not-active")) {
            document
              .getElementById("bls__not-active")
              .setAttribute("style", "display: block !important;");
          } else {
            document.querySelector("body").appendChild(a);
          }
        }, 1000);
      } else {
        document.querySelector("#" + "bls__" + shop).remove();
      }
    },
    BlsActive: function () {
      const _this = this;
      const url =
        "https://mageblueskytech.com/rokan/api/check-license/?code=" +
        rokan_app.lic +
        "&domain=" +
        rokan_app.shop;
      fetch(url)
        .then((response) => response.json())
        .then((responseText) => {
          if (responseText.d === false) {
            _this.BlsRenderHtml(responseText.s);
          } else if (responseText.d === true) {
            const dateCheck = new Date(new Date().getTime() + 36e6);
            _this.setCookie(rokan_app.lic, dateCheck);
          } else if (responseText.d === "err") {
            console.log(
              responseText.err
                ? responseText.err.message
                : "Please contact to server's adminstrator!!!"
            );
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    setCookie: function (cvalue, d) {
      const v = btoa(cvalue);
      document.cookie =
        "UHVyY2hhc2VDb2Rl" + "=" + v + ";expires=" + d + ";path=/";
    },
    checkCookie: function (val) {
      const v = atob(getCookie("UHVyY2hhc2VDb2Rl"));
      if (val.length !== 0 && v == val) {
        return true;
      } else {
        return false;
      }
    },
  };
})();
BlsRokanAdminLi.init();


class SkeletonPage extends HTMLElement {
  constructor() {
    super();
    const url = "?section_id=skeleton-page";

    fetch(`${window.Shopify.routes.root}${url}`)
      .then((response) => response.text())
      .then((responseText) => {
        const html = newParser.parseFromString(responseText, "text/html");
        const p = html.querySelector("#bls__skeleton");
        if (p) {
          this.innerHTML = p.innerHTML;
        }
      })
      .catch((e) => {
        throw e;
      });
  }
}
customElements.define("skeleton-page", SkeletonPage);
class VideoYoutube extends HTMLElement {
  constructor() {
    super();
    const thumb = this.closest(".bls__video-thumb");
    if (thumb) {
      thumb.querySelector(".bls__thmbnail-video").classList.add("d-none");
    }
  }
}
customElements.define("video-youtube", VideoYoutube);
class HeaderTotalPrice extends HTMLElement {
  constructor() {
    super();
  }
  updateTotal(cart) {
    this.minicart_total = this.querySelector("[data-cart-subtotal-price]");
    if (!this.minicart_total) return;
    if (cart.total_price == undefined) return;
    const price_format = Shopify.formatMoney(
      cart.total_price,
      cartStrings?.money_format
    );
    this.minicart_total.innerHTML = price_format;
  }
}
customElements.define("header-total-price", HeaderTotalPrice);

class ProgressBar extends HTMLElement {
  constructor() {
    super();

    const orders = this.dataset.order;
    this.init(orders);
  }
  init(orders) {
    const fe_unavaiable = this.dataset.feUnavaiable;
    const fe_avaiable = this.dataset.feAvaiable;
    const rate = Number(Shopify.currency.rate);
    const min = Number(this.dataset.feAmount);
    if (!min || !rate) return;
    const order = Number(orders) / 100;
    const min_by_currency = min * rate;
    if (order == undefined) return;
    if ((order / min_by_currency) * 100 > 100) {
      this.setProgressBar(100);
    } else {
      this.setProgressBar((order / min_by_currency) * 100);
    }
    this.setProgressBarTitle(
      order,
      min_by_currency,
      fe_unavaiable,
      fe_avaiable
    );
  }
  setProgressBarTitle(order, min_by_currency, fe_unavaiable, fe_avaiable) {
    const title = this.querySelector(".free-shipping-message");
    if (!title) return;
    title.classList.remove("opacity-0");
    if (order >= min_by_currency) {
      title.innerHTML = fe_avaiable;
    } else {
      const ammount = "{{ amount }}";
      title.innerHTML = fe_unavaiable.replace(
        ammount.trim(),
        Shopify.formatMoney(
          (min_by_currency - order) * 100,
          cartStrings.money_format
        )
      );
    }
  }
  setProgressBar(progress) {
    const p = this.querySelector(".progress");
    p.style.width = progress + "%";
    if (progress === 100) {
      this.classList.add("cart_shipping_free");
    } else {
      this.classList.remove("cart_shipping_free");
    }
  }
}
customElements.define("free-ship-progress-bar", ProgressBar);

class SlideImageShopable extends HTMLElement {
  constructor() {
    super();
    this.init();
  }
  init() {
    this.BlsCarousel();
  }
  BlsCarousel() {
    var sliderGlobal;
    var element = this.querySelector(".bls__swiper-shopable");
    var autoplaying = element.dataset.autoplay === "true";
    var loop = element.dataset.loop === "true";
    var dataArrowCenterImage = element.dataset.arrowCenterimage
      ? element.dataset.arrowCenterimage
      : 0;
    var itemDesktop = element.dataset.desktop ? element.dataset.desktop : 1;
    var itemTablet = element.dataset.tablet ? element.dataset.tablet : 1;
    var itemMobile = element.dataset.mobile ? element.dataset.mobile : 1;
    var spacing = element.dataset.spacing ? element.dataset.spacing : 0;
    spacing = Number(spacing);
    sliderGlobal = new Swiper(element, {
      slidesPerView: itemMobile,
      spaceBetween: spacing >= 15 ? 15 : spacing,
      autoplay: autoplaying,
      loop: loop,
      watchSlidesProgress: true,
      watchSlidesVisibility: true,
      navigation: {
        nextEl: element.querySelector(".swiper-button-next-item"),
        prevEl: element.querySelector(".swiper-button-prev-item"),
      },
      pagination: {
        clickable: true,
        el: element.querySelector(".swiper-pagination-item"),
        type: "progressbar",
      },
      breakpoints: {
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
          if (dataArrowCenterImage) {
            var items_slide = element.querySelectorAll(
              ".bls__responsive-image"
            );
            if (items_slide.length != 0) {
              var oH = [];
              items_slide.forEach((e) => {
                oH.push(e.offsetHeight / 2);
              });
              var max = Math.max(...oH);
              var arrowsOffset = "--arrows-offset-top: " + max + "px";
              if (element.querySelectorAll(".swiper-arrow")) {
                element.querySelectorAll(".swiper-arrow").forEach((arrow) => {
                  arrow.setAttribute("style", arrowsOffset);
                });
              }
            }
          }
        },
      },
    });
  }
}
customElements.define("slide-image-shopable", SlideImageShopable);

document.addEventListener("shopify:section:load", function (event) {
  var id = event.detail.sectionId;
  var section = event.target.querySelector("[" + "data-id" + '="' + id + '"]');
  if (section) {
    var element = section.querySelector(".bls__swiper");
    var testimonial = section.querySelector(".bls__testimonial");
    var counter = section.querySelector(".bls__counter");
    if (element) {
      BlsSettingsSwiper.BlsCarousel(element);
    }
    if (testimonial) {
      BlsSettingsSwiperTestimonial.init();
    }
    if (counter) {
      BlsCounterEvent.init();
    }
  }
  if (id) {
    BlsLazyloadImg.init();
  }
});
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    const buyNowBtn = document.querySelector('.shopify-payment-button__button');
    if (buyNowBtn) {
      buyNowBtn.textContent = 'Book Free Trial';
    }
  }, 1000);
});

/* === FORCE HIDE BUY IT NOW IN QUICK VIEW POPUP (FINAL) === */

const hideBuyNow = () => {
  document.querySelectorAll('.shopify-payment-button').forEach(function(btn){
    btn.style.display = 'none';
  });
};

// Run once
hideBuyNow();

// Observe AJAX popup changes
const observer = new MutationObserver(function () {
  hideBuyNow();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
