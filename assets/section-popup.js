class NewsletterPopup extends Popup {
    constructor() {
        super();
        this.init();
        this.initMessage();
    }

    init() {
        const _this = this;
        const wrapperNewsletter = this.querySelector(".bls__newsletter-wrapper");
        const showPopup = this.dataset.show;
        const disableMobile = this.dataset.showMobile === "true";
        if (
            (showPopup === "show-on-all-pages" || showPopup === "show-on-homepage") && getCookie("bls-newsletter-popup").length === 0
        ) {
            if (!Shopify.designMode) {
                this.initPopupJs(
                    wrapperNewsletter.innerHTML,
                    "",
                    "newsletterp",
                    true,
                    false,
                    disableMobile,
                    2000 
                );
                this.popup.onShow = function () {
                    _this.checkNotShowNewletter();
                    wrapperNewsletter.remove();
                };
                BlsLazyloadImg.init();
            }
        }
        if (Shopify.designMode) {
            document.addEventListener("shopify:section:select", (e) => {
                if (!this.closest("section")) return;
                if (!this.closest("section").dataset.shopifyEditorSection) return;
                if (!e.detail.sectionId) return;
                if (
                    JSON.parse(this.closest("section").dataset.shopifyEditorSection)
                        .id === e.detail.sectionId
                ) {
                    this.initPopupJs(
                        wrapperNewsletter.innerHTML,
                        "",
                        "newsletterp",
                        true,
                        false,
                        true
                    );
                    this.popup.onShow = function () {
                        _this.checkNotShowNewletter();
                    };
                    BlsLazyloadImg.init();
                } else {
                    if (!this.popup) return;
                    this.popup.destroy();
                }
            });
            document.addEventListener("shopify:section:load", (e) => {
                const target = e.target;
                const newsletterPopup = target
                    .closest("body")
                    .querySelector("[id^=newsletterp_0]");
                if (newsletterPopup) {
                    if (this.popup != null) {
                        this.popup.hide();
                    }
                    this.initPopupJs(
                        document.querySelector(".bls__newsletter-wrapper").innerHTML,
                        "",
                        "newsletterp",
                        true,
                        false
                    );
                }
            });
        }
    }

    checkNotShowNewletter() {
        const check = document.querySelector("#newsletterp_0 .doNotShow");
        if (check) {
            check.addEventListener("change", (e) => {
                if (e.currentTarget.checked) {
                    setCookie("bls-newsletter-popup", 99999, "bls");
                } else {
                    deleteCookie("bls-newsletter-popup");
                }
            });
        }
    }

    initMessage() {
        const urlInfo = window.location.href;
        const formInfo = document.querySelector(".form-infor");
        const fi = document.querySelector(".form-infor,.close-form-info");
        const formErr = document.querySelector(".form-infor-body.noti-error");
        const formSuccess = document.querySelector(".form-infor-body.noti-success");
      console.log(fi)
        if (fi) {
          
            fi.addEventListener("click", (e) => {
                const target = e.currentTarget;
                const closet = target.closest(".form-infor");
                 console.log(target)
                e.preventDefault();
                if (closet.classList.contains("show-noti-form")) {
                    closet.classList.remove("show-noti-form");
                }
            });
        }
        if (urlInfo.indexOf("customer_posted=true#newsletter-form-popup") >= 1) {
            formInfo.classList.add("show-noti-form");
            formErr.style.display = "none";
            if (this.popup != null) {
                this.popup.destroy();
            }
            setCookie("bls-newsletter-popup", 99999, "bls");
            const newURL = location.href.split("?")[0];
            window.history.pushState("object", document.title, newURL);
        }
        if (
            urlInfo.indexOf(
                "contact%5Btags%5D=newsletter&form_type=customer#newsletter-form-popup"
            ) >= 1
        ) {
            formInfo.classList.add("show-noti-form");
            formSuccess.style.display = "none";
            const newURL = location.href.split("?")[0];
            window.history.pushState("object", document.title, newURL);
        }
    }
}
customElements.define("newsletter-popup", NewsletterPopup);

class PromotionPopup extends Popup {
    constructor() {
        super();
        this.init();
    }

    init() {
        const _this = this;
        const wrapperPromotion = this.querySelector(".promotion-wrapper");
        const showPopup = this.dataset.show;
        const disableMobile = this.dataset.showMb === "true";
        if (
            (showPopup === "show-on-all-pages" || showPopup === "show-on-homepage") && getCookie("bls-promotion-popup").length === 0
        ) {
            if (!Shopify.designMode) {
                this.initPopupJs(
                    wrapperPromotion.innerHTML,
                    "",
                    "promotionp",
                    true,
                    false,
                    disableMobile,
                    6000
                );
                this.popup.onShow = function () {
                    _this.copyPromotion();
                    _this.checkNotShowPromotion();
                    _this.remove();
                };
                BlsLazyloadImg.init();
            }
        }
        if (Shopify.designMode) {
            document.addEventListener("shopify:section:select", (e) => {
                if (!this.closest("section")) return;
                if (!this.closest("section").dataset.shopifyEditorSection) return;
                if (!e.detail.sectionId) return;
                if (
                    JSON.parse(this.closest("section").dataset.shopifyEditorSection)
                        .id === e.detail.sectionId
                ) {
                    this.initPopupJs(
                        wrapperPromotion.innerHTML,
                        "",
                        "promotionp",
                        true,
                        false,
                        true
                    );
                    this.popup.onShow = function () {
                        _this.copyPromotion();
                    };
                    BlsLazyloadImg.init();
                } else {
                    if (!this.popup) return;
                    this.popup.destroy();
                }
            });
            document.addEventListener("shopify:section:load", (e) => {
                const target = e.target;
                const promotionPopup = target
                    .closest("body")
                    .querySelector("[id^=promotionp_0]");
                if (promotionPopup) {
                    if (this.popup != null) {
                        this.popup.hide();
                    }
                    this.initPopupJs(
                        document.querySelector(".promotion-wrapper").innerHTML,
                        "",
                        "newsletterp",
                        true,
                        false
                    );
                }
            });
        }
    }

    checkNotShowPromotion() {
        const check = document.querySelector("#promotionp_0 .doNotShow");
        if (check) {
            check.addEventListener("change", (e) => {
                if (e.currentTarget.checked) {
                    setCookie("bls-promotion-popup", 1, "bls");
                } else {
                    deleteCookie("bls-promotion-popup");
                }
            });
        }
    }

    copyPromotion() {
        const cp = document.querySelector("#promotionp_0 .discount");
        if (cp !== null) {
            cp.addEventListener("click", (el) => {
                el.preventDefault();
                const currentTarget = el.currentTarget;
                navigator.clipboard.writeText(currentTarget?.dataset.code);
                currentTarget.classList.add("action-copy");
                setTimeout(() => {
                    currentTarget.classList.remove("action-copy");
                }, 1500);
            });
        }
    }
}
customElements.define("promotion-popup", PromotionPopup);
class AgeVerifier extends HTMLElement {
    constructor() {
        super();
        this.ageVerifyDetail = this.querySelector(".age-verify-detail");
        this.declineVerifyDetail = this.querySelector(".decline-verify-detail");
        this.init();
        this.mainFunction();
        if (Shopify.designMode) {
            document.addEventListener("shopify:section:load", () => this.init());
            document.addEventListener("shopify:section:load", () =>
                this.mainFunction()
            );
        }
    }
    init() {
        const _this = this;
        const designMode = _this.dataset.enableDesignMode;
        if (!Shopify.designMode) {
            if (!getCookie("bls_age_verifier")) {
                setTimeout(() => {
                    _this.setAttribute("open", "");
                    this.declineVerifyDetail.classList.add("d-none");
                    this.ageVerifyDetail.classList.remove("d-none");
                }, 150);
            } else {
                if (getCookie("bls_age_verifier") == "false") {
                    setTimeout(() => {
                        _this.setAttribute("open", "");
                        this.declineVerifyDetail.classList.remove("d-none");
                        this.ageVerifyDetail.classList.add("d-none");
                    }, 150);
                } else {
                    _this.removeAttribute("open");
                }
            }
        } else {
            if (designMode == "true") {
                document.addEventListener("shopify:section:select", (e) => {
                    var qbe = document.querySelector(".overlay-age-verifier")?.dataset
                        .shopifyEditorSection;
                    if (qbe && JSON.parse(qbe).id === e.detail.sectionId) {
                        _this.setAttribute("open", "");
                        this.declineVerifyDetail.classList.add("d-none");
                        this.ageVerifyDetail.classList.remove("d-none");
                    } else {
                        _this.setAttribute("closing", "true");
                        setTimeout(() => {
                            _this.removeAttribute("closing");
                            _this.removeAttribute("open");
                        }, 150);
                    }
                });
            } else {
                _this.setAttribute("closing", "true");
                setTimeout(() => {
                    _this.removeAttribute("closing");
                    _this.removeAttribute("open");
                }, 150);
            }
        }
    }

    mainFunction() {
        const approve = this.querySelector(".age-verifier-approve");
        const decline = this.querySelector(".age-verifier-decline");
        const returnBtn = this.querySelector(".age-verifier-return");
        if (returnBtn) {
            returnBtn.addEventListener("click", () => this.handleReturn());
        }

        if (!approve || !decline) return;
        approve.addEventListener("click", () => this.handleApprove());
        decline.addEventListener("click", () => this.handleDecline());
    }
    handleReturn() {
        if (!Shopify.designMode) {
            setCookie("bls_age_verifier", "false", "-1");
            this.init();
        } else {
            this.setAttribute("open", "");
            this.declineVerifyDetail.classList.add("d-none");
            this.ageVerifyDetail.classList.remove("d-none");
        }
    }
    handleDecline() {
        if (!Shopify.designMode) {
            setCookie("bls_age_verifier", "false", "365");
            this.init();
        } else {
            this.setAttribute("open", "");
            this.declineVerifyDetail.classList.remove("d-none");
            this.ageVerifyDetail.classList.add("d-none");
        }
    }
    handleApprove() {
        if (!Shopify.designMode) {
            setCookie("bls_age_verifier", "true", "false");
            this.setAttribute("closing", "true");
            setTimeout(() => {
                this.removeAttribute("closing");
                this.removeAttribute("open");
            }, 150);
        } else {
            this.setAttribute("closing", "true");
            setTimeout(() => {
                this.removeAttribute("closing");
                this.removeAttribute("open");
            }, 150);
        }
    }
}
customElements.define("age-verifier", AgeVerifier);
var BlsPopupMessage = (function () {
    return {
        init: function () {
            this.checkFormInfo(), this.checkShowMsgStockNotify();
        },
        checkFormInfo: function () {
            const urlInfo = window.location.href;
            const formInfo = document.querySelector(".form-infor");
            const formError = document.querySelector(".form-infor-body.noti-error");
            const formSuccess = document.querySelector(
                ".form-infor-body.noti-success"
            );
            const closeButton = document.querySelector(
                ".form-infor .close-form-info"
            );
            if (closeButton) {
                closeButton.addEventListener("click", (e) => {
                    const closestForm = e.currentTarget.closest(".form-infor");
                    e.preventDefault();
                    if (closestForm.classList.contains("show-noti-form")) {
                        closestForm.classList.remove("show-noti-form");
                    }
                });
            }
            const checkUrlAndAct = (urlCheck, action) => {
                if (urlInfo.indexOf(urlCheck) > -1) {
                    action();
                }
            };
            const showNotificationSuccess = () => {
                formInfo.classList.add("show-noti-form");
                formError.style.display = "none";
                setCookie("bls-newsletter-popup", "99999", "bls");
                removeElementById("newsletterp_0");
                updateHistoryState();
            };
            const showNotificationError = () => {
                formInfo.classList.add("show-noti-form");
                formSuccess.style.display = "none";
                updateHistoryState();
            };
            checkUrlAndAct(
                "contact[tags]=newsletter&form_type=customer",
                showNotificationError
            );
            checkUrlAndAct("customer_posted=true", showNotificationSuccess);
            checkUrlAndAct(
                "contact_posted=true#askquestion",
                showNotificationSuccess
            );
            function removeElementById(id) {
                const element = document.getElementById(id);
                if (element) {
                    element.remove();
                }
            }
            function updateHistoryState() {
                const baseURL = location.href.split("?")[0];
                window.history.pushState(
                    { object: "newTitle" },
                    document.title,
                    baseURL
                );
            }
        },
        checkShowMsgStockNotify: function () {
            const urlInfo = window.location.href;
            const formInfo = document.querySelector(".stock-notify");
            const fi = document.querySelector(
                ".stock-notify,.close-form-stock-notify"
            );
            if (fi) {
                fi.addEventListener("click", (e) => {
                    const target = e.currentTarget;
                    const closet = target.closest(".stock-notify");
                    e.preventDefault();
                    if (closet.classList.contains("show-noti-form")) {
                        closet.classList.remove("show-noti-form");
                    }
                });
            }
            if (urlInfo.indexOf("contact_posted=true#FormStockNotify") > -1) {
                formInfo.classList.add("show-noti-form");
                const newURL = location.href.split("?")[0];
                window.history.pushState("object", document.title, newURL);
            }
        },
    };
})();
BlsPopupMessage.init();

class LoginPopup extends Popup {
    constructor() {
        super();
        this.init();
    }

    init() {
        const action = this.querySelector(".action-login");
        const _this = this;
        if (action !== null) {
            action.addEventListener("click", (e) => {
                e.preventDefault();
                _this.fetchDataLogin();
                document.body.classList.add("login-popup-show");
            });
        }
    }

    clickTab() {
        const hidden = document.querySelectorAll("[data-login-hidden]");
        const show = document.querySelectorAll("[data-login-show]");
        const iTitle = document.querySelector(
            "#loginp_0 .dlg-heading .popup-title"
        );
        show.forEach((e) => {
            var s = e?.dataset.loginShow;
            e.addEventListener("click", function (el) {
                el.preventDefault();
                hidden.forEach((eh) => {
                    var h = eh?.dataset.loginHidden;
                    if (eh.getAttribute("aria-hidden") === "true" && s === h) {
                        eh.setAttribute("aria-hidden", "false");
                        if (iTitle) {
                            iTitle.innerText = s;
                        }
                    } else {
                        eh.setAttribute("aria-hidden", "true");
                    }
                });
            });
        });
    }

    fetchDataLogin() {
        const url = `${window.location.pathname}?section_id=login-popup`;
        const _this = this;
        fetch(url)
            .then((response) => response.text())
            .then((responseText) => {
                const html = newParser.parseFromString(responseText, "text/html");
                const l = html.querySelector("#login-popup");
                if (l) {
                    var titleLoginDefault = l.querySelector("[data-title-default]");
                    var dataTitleLogin = titleLoginDefault.dataset.titleDefault;
                    this.initPopupJs(
                        l.innerHTML,
                        dataTitleLogin,
                        "loginp",
                        true,
                        false
                    );
                }
                _this.clickTab();
            })
            .catch((e) => {
                throw e;
            });
    }
}
customElements.define("login-popup", LoginPopup);
class InstagramShop extends Popup {
    constructor() {
        super();
        this.querySelectorAll("img").forEach((button) =>
            button.addEventListener("click", this.onButtonClick.bind(this))
        );
    }

    onButtonClick(event) {
        event.preventDefault();
        const is_shown = document.querySelector("#dlg-lookbook_0");
        if (event.currentTarget && is_shown === null) {
            this.initPopupJs(
                this.htmlRender(event.currentTarget).innerHTML,
                "",
                "dlg-lookbook",
                false,
                false
            );
        }
    }

    htmlRender(ct) {
        const bli = ct.closest(".bls__lookbook-items");
        const is = ct.closest("instagram-shop");
        if (bli) {
            const id = bli.id;
            if (is) {
                const data = JSON.parse(is.querySelector(".igShopBlock").textContent);
                if (data) {
                    const getData = data.find((x) => x.id === id);
                    const img = getData.bl_img;
                    const {
                        ot_1,
                        ol_1,
                        p_1,
                        ot_2,
                        ol_2,
                        p_2,
                        ot_3,
                        ol_3,
                        p_3,
                        ot_4,
                        ol_4,
                        p_4,
                        ot_5,
                        ol_5,
                        p_5,
                        cap_1,
                        cap_2,
                        cap_3,
                        cap_4,
                        p_img_1,
                        p_img_2,
                        p_img_3,
                        p_img_4,
                        p_img_5,
                        pn_1,
                        pn_2,
                        pn_3,
                        pn_4,
                        pn_5,
                        pp_1,
                        pp_2,
                        pp_3,
                        pp_4,
                        pp_5,
                        pcp_1,
                        pcp_2,
                        pcp_3,
                        pcp_4,
                        pcp_5,
                        ar,
                        cr,
                        pr,
                    } = getData;
                    const p_1_d = p_1 ? "" : "d-none";
                    const p_2_d = p_2 ? "" : "d-none";
                    const p_3_d = p_3 ? "" : "d-none";
                    const p_4_d = p_4 ? "" : "d-none";
                    const p_5_d = p_5 ? "" : "d-none";

                    const pp_d_1 =
                        Number(pcp_1.replace(/[^0-9]/g, "")) <
                            Number(pp_1.replace(/[^0-9]/g, "")) || pcp_1 === ""
                            ? "d-none"
                            : "";
                    const pp_d_2 =
                        Number(pcp_2.replace(/[^0-9]/g, "")) <
                            Number(pp_2.replace(/[^0-9]/g, "")) || pcp_2 === ""
                            ? "d-none"
                            : "";
                    const pp_d_3 =
                        Number(pcp_3.replace(/[^0-9]/g, "")) <
                            Number(pp_3.replace(/[^0-9]/g, "")) || pcp_3 === ""
                            ? "d-none"
                            : "";
                    const pp_d_4 =
                        Number(pcp_4.replace(/[^0-9]/g, "")) <
                            Number(pp_4.replace(/[^0-9]/g, "")) || pcp_4 === ""
                            ? "d-none"
                            : "";
                    const pp_d_5 =
                        Number(pcp_5.replace(/[^0-9]/g, "")) <
                            Number(pp_5.replace(/[^0-9]/g, "")) || pcp_5 === ""
                            ? "d-none"
                            : "";
                    const container = document.createElement("div");
                    const aspect_ratio = ar === "custom" ? cr.replace(":", "/") : ar;
                    container.innerHTML = `
              <div class="bls__instagram-shop">
                <div class="bls__lookbook-items">
                  <div class="bls__lookbook-image">
                    <div
                      class="bls__responsive-image bls-image-js"
                      style="--aspect-ratio: ${aspect_ratio};"
                    >
                      <img
                        srcset="${img}"
                      >
                    </div>
                  </div>
                  <div
                    class="bls__product-item absolute ${p_1_d}"
                    style="top: ${ot_1}%; left: ${ol_1}%; transform: translate(-${ot_1}%,-${ol_1}%)"
                  >
                    <a href="${p_1}" target="_blank">
                      <span class="icon-dot icon">
                      <i class="picon-plus fs-12"></i>
                      </span>
                    </a>
                  </div>
                  <div
                    class="bls__product-item absolute ${p_2_d}"
                    style="top: ${ot_2}%; left: ${ol_2}%; transform: translate(-${ot_2}%,-${ol_2}%)"
                  >
                    <a href="${p_2}" target="_blank">
                      <span class="icon-dot icon">
                      <i class="picon-plus fs-12"></i>
                      </span>
                    </a>
                  </div>
                  <div
                    class="bls__product-item absolute ${p_3_d}"
                    style="top: ${ot_3}%; left: ${ol_3}%; transform: translate(-${ot_3}%,-${ol_3}%)"
                  >
                    <a href="${p_3}" target="_blank">
                      <span class="icon-dot icon">
                      <i class="picon-plus fs-12"></i>
                      </span>
                    </a>
                  </div>
                  <div
                    class="bls__product-item absolute ${p_4_d}"
                    style="top: ${ot_4}%; left: ${ol_4}%; transform: translate(-${ot_4}%,-${ol_4}%)"
                  >
                    <a href="${p_4}" target="_blank">
                      <span class="icon-dot icon">
                      <i class="picon-plus fs-12"></i>
                      </span>
                    </a>
                  </div>
                  <div
                    class="bls__product-item absolute ${p_5_d}"
                    style="top: ${ot_5}%; left: ${ol_5}%; transform: translate(-${ot_5}%,-${ol_5}%)"
                  >
                    <a href="${p_5}" target="_blank">
                      <span class="icon-dot icon">
                      <i class="picon-plus fs-12"></i>
                      </span>
                    </a>
                  </div>
                </div>
                <div class="bls__lookbook-content">
                  <div class="bls__lookbook-info custom-scrollbar">
                    <div class="bls__lookbook-product">
                      <div class="bls__lookbook-product-items ${p_1_d}">
                        <a href="${p_1}" target="_blank">
                          <div
                            class="bls__responsive-image bls-image-js"
                            style="--aspect-ratio: ${pr};"
                          >
                            <img
                              srcset="${p_img_1}"
                            >
                          </div>
                          <div
                          class="bls__product-details pt-10"
                          >
                            <div class="bls__product-name regular mb-0">${pn_1}</div>
                            <p class="bls__product-price mb-4" ><span>${pp_1}</span><s class="px-5 ${pp_d_1}">${pcp_1}</s></p>
                          </div>
                        </a>
                      </div>
                      <div class="bls__lookbook-product-items ${p_2_d}">
                        <a href="${p_2}" target="_blank">
                          <div
                            class="bls__responsive-image bls-image-js"
                            style="--aspect-ratio: ${pr};"
                          >
                            <img
                              srcset="${p_img_2}"
                            >
                          </div>
                          <div
                          class="bls__product-details pt-10"
                          >
                          <div class="bls__product-name regular mb-0">${pn_2}</div>
                          <p class="bls__product-price mb-4" ><span>${pp_2}</span><s class="px-5 ${pp_d_2}">${pcp_2}</s></p>
                          </div>
                        </a>
                      </div>
                      <div class="bls__lookbook-product-items ${p_3_d}">
                        <a href="${p_3}" target="_blank">
                          <div
                            class="bls__responsive-image bls-image-js"
                            style="--aspect-ratio: ${pr};"
                          >
                            <img
                              srcset="${p_img_3}"
                            >
                          </div>
                          <div
                          class="bls__product-details pt-10"
                          >
                          <div class="bls__product-name regular mb-0">${pn_3}</div>
                          <p class="bls__product-price mb-4" ><span>${pp_3}</span><s class="px-5 ${pp_d_3}">${pcp_3}</s></p>
                          </div>
                        </a>
                      </div>
                      <div class="bls__lookbook-product-items ${p_4_d}">
                        <a href="${p_4}" target="_blank">
                          <div
                            class="bls__responsive-image bls-image-js"
                            style="--aspect-ratio: ${pr};"
                          >
                            <img
                              srcset="${p_img_4}"
                            >
                          </div>
                          <div
                          class="bls__product-details pt-10"
                          >
                          <div class="bls__product-name regular mb-0">${pn_4}</div>
                          <p class="bls__product-price mb-4" ><span>${pp_4}</span><s class="px-5 ${pp_d_4}">${pcp_4}</s></p>
                          </div>
                        </a>
                      </div>
                      <div class="bls__lookbook-product-items ${p_5_d}">
                        <a href="${p_5}" target="_blank">
                          <div
                            class="bls__responsive-image bls-image-js"
                            style="--aspect-ratio: ${pr};"
                          >
                            <img
                              srcset="${p_img_5}"
                            >
                          </div>
                          <div
                          class="bls__product-details pt-10"
                          >
                          <div class="bls__product-name regular mb-0">${pn_5}</div>
                          <p class="bls__product-price mb-4" ><span>${pp_5}</span><s class="px-5 ${pp_d_5}">${pcp_5}</s></p>
                          </div>
                        </a>
                      </div>
                    </div>
                  
                  <div class="bls__lookbook-caption">
                    <p>
                    ${cap_1.replaceAll(/\n/g, "<br>")}
                    </p>
                    <p>
                      ${cap_2}
                    </p>
                  </div>
                  <a href="${cap_4}" target="_blank" class="heading-weight d-flex align-items-center">
                    <i class="picon-instagram mr-5"></i> ${cap_3}
                  </a>
                  </div>
                </div>
              </div>
            `;
                    return container;
                }
            }
        }
    }
}
customElements.define("instagram-shop", InstagramShop);
