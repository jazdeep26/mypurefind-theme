var BlsInstagramShopify = (function () {
    return {
        init: function () {
            this.loadInstagram();
        },

        loadInstagram: function () {
            const ig_class = document.querySelectorAll(".bls__instagram-api");
            ig_class.forEach((e) => {
                if (e != undefined) {
                    const { accessToken, images, igType } = e?.dataset;
                    if (accessToken) {
                        this.initInstagram(e, accessToken, images, igType);
                    } else {
                        console.warn("Access Token is invalid!");
                    }
                }
            });
        },

        initInstagram: async function (nodeElement, at, num_img, igType) {
            const _this = this;
            let i = num_img !== undefined ? num_img : 4;
            const resp = await this.fetchCache(
                `https://graph.instagram.com/me/media?fields=caption,id,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=${at}`,
                {
                    cache: "force-cache",
                }
            );
            if (!resp) return;

            if (resp.error) {
                return console.error("Instagram error: ", resp.error?.message);
            }
            if (igType === "carousel") {
                _this.initCarousel(resp.data, nodeElement, i);
            } else {
                _this.initGrid(resp.data, nodeElement, i);
            }
        },

        fetchCache: function (u, fetchOption) {
            let cf = fetchOption !== undefined ? fetchOption : rdc;
            const newMap = new Map();
            return new Promise((resolve, reject) => {
                if (newMap.get(u)) {
                    return resolve(newMap.get(u));
                }
                fetch(u, cf)
                    .then((res) => {
                        if (res.ok) {
                            const j = res.json();
                            resolve(j);
                            newMap.set(u, j);
                            return j;
                        } else {
                            reject(res);
                        }
                    })
                    .catch(reject);
            });
        },

        initCarousel: function (images, nodeElement, i) {
            images
                .filter(
                    (d) => d.media_type === "IMAGE" || d.media_type === "CAROUSEL_ALBUM"
                )
                .slice(0, i)
                .forEach((image) => {
                    var node = document.createElement("div");
                    node.classList.add("swiper-slide");
                    var responsiveImageNode = document.createElement("div");
                    var node_ig_item = document.createElement("div");
                    node_ig_item.classList.add("bls__instagram-item");
                    var imgUrl = document.createElement("a");
                    var ig_logo = document.createElement("span");
                    ig_logo.classList.add("bls__instagram-icon");
                    responsiveImageNode.classList.add("bls__responsive-image");
                    responsiveImageNode.classList.add("bls_instagram-image");
                    responsiveImageNode.classList.add("bls-image-js");
                    responsiveImageNode.setAttribute("style", "--aspect-ratio:1/1");
                    responsiveImageNode.innerHTML += `<img src="${image.media_url}" srcset="${image.media_url}&width=165 165w,${image.media_url}&width=330 330w,${image.media_url}&width=535 535w,${image.media_url}&width=750 750w,${image.media_url}&width=1000 1000w,${image.media_url}&width=1500 1500w,${image.media_url}&width=3000 3000w" sizes="(min-width: 1260px) 282px, (min-width: 990px) calc((100vw - 130px) / 4), (min-width: 750px) calc((100vw - 120px) / 3), calc((100vw - 35px) / 2)" loading="lazy" alt="instagram">`;
                    imgUrl.setAttribute("href", image.permalink);
                    imgUrl.appendChild(responsiveImageNode);
                    imgUrl.appendChild(ig_logo);
                    node_ig_item.appendChild(imgUrl);
                    node.appendChild(node_ig_item);
                    nodeElement.querySelector(".swiper-wrapper").appendChild(node);
                });
            BlsLazyloadImg.init();
        },

        initGrid: function (images, nodeElement, limits) {
            const _this = this;
            const gridNode = nodeElement.querySelector(".bls__instagram-grid");
            if (gridNode) {
                const { spacing } = gridNode?.dataset;
                nodeElement.setAttribute("style", "--bs-gutter-x:" + spacing + "px");
                var items = Number(limits);
                images
                    .filter(
                        (d) => d.media_type === "IMAGE" || d.media_type === "CAROUSEL_ALBUM"
                    )
                    .slice(0, items)
                    .forEach((image) => {
                        var node = document.createElement("div");
                        node.classList.add("bls__instagram-item");
                        var imgUrl = document.createElement("a");
                        var ig_logo = document.createElement("span");
                        ig_logo.classList.add("bls__instagram-icon");
                        var nodeChild = document.createElement("div");
                        nodeChild.classList.add("bls__responsive-image");
                        nodeChild.classList.add("bls-image-js");
                        nodeChild.setAttribute("style", "--aspect-ratio: 1/1");
                        nodeChild.classList.add("bls_instagram-image");
                        nodeChild.innerHTML += `<img src="${image.media_url}" srcset="${image.media_url}&width=165 165w,${image.media_url}&width=330 330w,${image.media_url}&width=535 535w,${image.media_url}&width=750 750w,${image.media_url}&width=1000 1000w,${image.media_url}&width=1500 1500w,${image.media_url}&width=3000 3000w" sizes="(min-width: 1260px) 282px, (min-width: 990px) calc((100vw - 130px) / 4), (min-width: 750px) calc((100vw - 120px) / 3), calc((100vw - 35px) / 2)" loading="lazy" alt="instagram">`;
                        imgUrl.setAttribute("href", image.permalink);
                        imgUrl.appendChild(nodeChild);
                        imgUrl.appendChild(ig_logo);
                        node.appendChild(imgUrl);
                        gridNode.querySelector(".row").appendChild(node);
                        BlsLazyloadImg.init();
                    });
            }
        },
    };
})();
BlsInstagramShopify.init();