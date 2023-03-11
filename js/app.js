(() => {
    "use strict";
    const modules_flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function spollers() {
        const spollersArray = document.querySelectorAll("[data-spollers]");
        if (spollersArray.length > 0) {
            const spollersRegular = Array.from(spollersArray).filter((function(item, index, self) {
                return !item.dataset.spollers.split(",")[0];
            }));
            if (spollersRegular.length) initSpollers(spollersRegular);
            let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
            function initSpollers(spollersArray, matchMedia = false) {
                spollersArray.forEach((spollersBlock => {
                    spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spollersBlock.classList.add("_spoller-init");
                        initSpollerBody(spollersBlock);
                        spollersBlock.addEventListener("click", setSpollerAction);
                    } else {
                        spollersBlock.classList.remove("_spoller-init");
                        initSpollerBody(spollersBlock, false);
                        spollersBlock.removeEventListener("click", setSpollerAction);
                    }
                }));
            }
            function initSpollerBody(spollersBlock, hideSpollerBody = true) {
                let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
                if (spollerTitles.length) {
                    spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spollers]") === spollersBlock));
                    spollerTitles.forEach((spollerTitle => {
                        if (hideSpollerBody) {
                            spollerTitle.removeAttribute("tabindex");
                            if (!spollerTitle.classList.contains("_spoller-active")) spollerTitle.nextElementSibling.hidden = true;
                        } else {
                            spollerTitle.setAttribute("tabindex", "-1");
                            spollerTitle.nextElementSibling.hidden = false;
                        }
                    }));
                }
            }
            function setSpollerAction(e) {
                const el = e.target;
                if (el.closest("[data-spoller]")) {
                    const spollerTitle = el.closest("[data-spoller]");
                    const spollersBlock = spollerTitle.closest("[data-spollers]");
                    const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    if (!spollersBlock.querySelectorAll("._slide").length) {
                        if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) hideSpollersBody(spollersBlock);
                        spollerTitle.classList.toggle("_spoller-active");
                        _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
                    }
                    e.preventDefault();
                }
            }
            function hideSpollersBody(spollersBlock) {
                const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
                const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
                    spollerActiveTitle.classList.remove("_spoller-active");
                    _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
                }
            }
            const spollersClose = document.querySelectorAll("[data-spoller-close]");
            if (spollersClose.length) document.addEventListener("click", (function(e) {
                const el = e.target;
                if (!el.closest("[data-spollers]")) spollersClose.forEach((spollerClose => {
                    const spollersBlock = spollerClose.closest("[data-spollers]");
                    if (spollersBlock.classList.contains("_spoller-init")) {
                        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                        spollerClose.classList.remove("_spoller-active");
                        _slideUp(spollerClose.nextElementSibling, spollerSpeed);
                    }
                }));
            }));
        }
    }
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    class Popup {
        constructor(options) {
            let config = {
                logging: true,
                init: true,
                attributeOpenButton: "data-popup",
                attributeCloseButton: "data-close",
                fixElementSelector: "[data-lp]",
                youtubeAttribute: "data-popup-youtube",
                youtubePlaceAttribute: "data-popup-youtube-place",
                setAutoplayYoutube: true,
                classes: {
                    popup: "popup",
                    popupContent: "popup__content",
                    popupActive: "popup_show",
                    bodyActive: "popup-show"
                },
                focusCatch: true,
                closeEsc: true,
                bodyLock: true,
                hashSettings: {
                    location: true,
                    goHash: true
                },
                on: {
                    beforeOpen: function() {},
                    afterOpen: function() {},
                    beforeClose: function() {},
                    afterClose: function() {}
                }
            };
            this.youTubeCode;
            this.isOpen = false;
            this.targetOpen = {
                selector: false,
                element: false
            };
            this.previousOpen = {
                selector: false,
                element: false
            };
            this.lastClosed = {
                selector: false,
                element: false
            };
            this._dataValue = false;
            this.hash = false;
            this._reopen = false;
            this._selectorOpen = false;
            this.lastFocusEl = false;
            this._focusEl = [ "a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])' ];
            this.options = {
                ...config,
                ...options,
                classes: {
                    ...config.classes,
                    ...options?.classes
                },
                hashSettings: {
                    ...config.hashSettings,
                    ...options?.hashSettings
                },
                on: {
                    ...config.on,
                    ...options?.on
                }
            };
            this.bodyLock = false;
            this.options.init ? this.initPopups() : null;
        }
        initPopups() {
            this.popupLogging(`Прокинувся`);
            this.eventsPopup();
        }
        eventsPopup() {
            document.addEventListener("click", function(e) {
                const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
                if (buttonOpen) {
                    e.preventDefault();
                    this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                    this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                    if ("error" !== this._dataValue) {
                        if (!this.isOpen) this.lastFocusEl = buttonOpen;
                        this.targetOpen.selector = `${this._dataValue}`;
                        this._selectorOpen = true;
                        this.open();
                        return;
                    } else this.popupLogging(`Йой, не заповнено атрибут у ${buttonOpen.classList}`);
                    return;
                }
                const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
                if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                if (this.options.closeEsc && 27 == e.which && "Escape" === e.code && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
                if (this.options.focusCatch && 9 == e.which && this.isOpen) {
                    this._focusCatch(e);
                    return;
                }
            }.bind(this));
            if (this.options.hashSettings.goHash) {
                window.addEventListener("hashchange", function() {
                    if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
                }.bind(this));
                window.addEventListener("load", function() {
                    if (window.location.hash) this._openToHash();
                }.bind(this));
            }
        }
        open(selectorValue) {
            if (bodyLockStatus) {
                this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
                if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) {
                    this.targetOpen.selector = selectorValue;
                    this._selectorOpen = true;
                }
                if (this.isOpen) {
                    this._reopen = true;
                    this.close();
                }
                if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
                if (!this._reopen) this.previousActiveElement = document.activeElement;
                this.targetOpen.element = document.querySelector(this.targetOpen.selector);
                if (this.targetOpen.element) {
                    if (this.youTubeCode) {
                        const codeVideo = this.youTubeCode;
                        const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                        const iframe = document.createElement("iframe");
                        iframe.setAttribute("allowfullscreen", "");
                        const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                        iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                        iframe.setAttribute("src", urlVideo);
                        if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                        }
                        this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                    }
                    if (this.options.hashSettings.location) {
                        this._getHash();
                        this._setHash();
                    }
                    this.options.on.beforeOpen(this);
                    document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.targetOpen.element.classList.add(this.options.classes.popupActive);
                    document.documentElement.classList.add(this.options.classes.bodyActive);
                    if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                    this.targetOpen.element.setAttribute("aria-hidden", "false");
                    this.previousOpen.selector = this.targetOpen.selector;
                    this.previousOpen.element = this.targetOpen.element;
                    this._selectorOpen = false;
                    this.isOpen = true;
                    setTimeout((() => {
                        this._focusTrap();
                    }), 50);
                    this.options.on.afterOpen(this);
                    document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.popupLogging(`Відкрив попап`);
                } else this.popupLogging(`Йой, такого попапу немає. Перевірте коректність введення. `);
            }
        }
        close(selectorValue) {
            if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) this.previousOpen.selector = selectorValue;
            if (!this.isOpen || !bodyLockStatus) return;
            this.options.on.beforeClose(this);
            document.dispatchEvent(new CustomEvent("beforePopupClose", {
                detail: {
                    popup: this
                }
            }));
            if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
            this.previousOpen.element.classList.remove(this.options.classes.popupActive);
            this.previousOpen.element.setAttribute("aria-hidden", "true");
            if (!this._reopen) {
                document.documentElement.classList.remove(this.options.classes.bodyActive);
                !this.bodyLock ? bodyUnlock() : null;
                this.isOpen = false;
            }
            this._removeHash();
            if (this._selectorOpen) {
                this.lastClosed.selector = this.previousOpen.selector;
                this.lastClosed.element = this.previousOpen.element;
            }
            this.options.on.afterClose(this);
            document.dispatchEvent(new CustomEvent("afterPopupClose", {
                detail: {
                    popup: this
                }
            }));
            setTimeout((() => {
                this._focusTrap();
            }), 50);
            this.popupLogging(`Закрив попап`);
        }
        _getHash() {
            if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
        }
        _openToHash() {
            let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
            const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
            this.youTubeCode = buttons.getAttribute(this.options.youtubeAttribute) ? buttons.getAttribute(this.options.youtubeAttribute) : null;
            if (buttons && classInHash) this.open(classInHash);
        }
        _setHash() {
            history.pushState("", "", this.hash);
        }
        _removeHash() {
            history.pushState("", "", window.location.href.split("#")[0]);
        }
        _focusCatch(e) {
            const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
            const focusArray = Array.prototype.slice.call(focusable);
            const focusedIndex = focusArray.indexOf(document.activeElement);
            if (e.shiftKey && 0 === focusedIndex) {
                focusArray[focusArray.length - 1].focus();
                e.preventDefault();
            }
            if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
                focusArray[0].focus();
                e.preventDefault();
            }
        }
        _focusTrap() {
            const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
            if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
        }
        popupLogging(message) {
            this.options.logging ? functions_FLS(`[Попапос]: ${message}`) : null;
        }
    }
    modules_flsModules.popup = new Popup({});
    let formValidate = {
        getErrors(form) {
            let error = 0;
            let formRequiredItems = form.querySelectorAll("*[data-required]");
            if (formRequiredItems.length) formRequiredItems.forEach((formRequiredItem => {
                if ((null !== formRequiredItem.offsetParent || "SELECT" === formRequiredItem.tagName) && !formRequiredItem.disabled) error += this.validateInput(formRequiredItem);
            }));
            return error;
        },
        validateInput(formRequiredItem) {
            let error = 0;
            if ("email" === formRequiredItem.dataset.required) {
                formRequiredItem.value = formRequiredItem.value.replace(" ", "");
                if (this.emailTest(formRequiredItem)) {
                    this.addError(formRequiredItem);
                    error++;
                } else this.removeError(formRequiredItem);
            } else if ("checkbox" === formRequiredItem.type && !formRequiredItem.checked) {
                this.addError(formRequiredItem);
                error++;
            } else if (!formRequiredItem.value.trim()) {
                this.addError(formRequiredItem);
                error++;
            } else this.removeError(formRequiredItem);
            return error;
        },
        addError(formRequiredItem) {
            formRequiredItem.classList.add("_form-error");
            formRequiredItem.parentElement.classList.add("_form-error");
            let inputError = formRequiredItem.parentElement.querySelector(".form__error");
            if (inputError) formRequiredItem.parentElement.removeChild(inputError);
            if (formRequiredItem.dataset.error) formRequiredItem.parentElement.insertAdjacentHTML("beforeend", `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
        },
        removeError(formRequiredItem) {
            formRequiredItem.classList.remove("_form-error");
            formRequiredItem.parentElement.classList.remove("_form-error");
            if (formRequiredItem.parentElement.querySelector(".form__error")) formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector(".form__error"));
        },
        formClean(form) {
            form.reset();
            setTimeout((() => {
                let inputs = form.querySelectorAll("input,textarea");
                for (let index = 0; index < inputs.length; index++) {
                    const el = inputs[index];
                    el.parentElement.classList.remove("_form-focus");
                    el.classList.remove("_form-focus");
                    formValidate.removeError(el);
                }
                let checkboxes = form.querySelectorAll(".checkbox__input");
                if (checkboxes.length > 0) for (let index = 0; index < checkboxes.length; index++) {
                    const checkbox = checkboxes[index];
                    checkbox.checked = false;
                }
                if (modules_flsModules.select) {
                    let selects = form.querySelectorAll(".select");
                    if (selects.length) for (let index = 0; index < selects.length; index++) {
                        const select = selects[index].querySelector("select");
                        modules_flsModules.select.selectBuild(select);
                    }
                }
            }), 0);
        },
        emailTest(formRequiredItem) {
            return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
        }
    };
    function formQuantity() {
        document.addEventListener("click", (function(e) {
            let targetElement = e.target;
            if (targetElement.closest("[data-quantity-plus]") || targetElement.closest("[data-quantity-minus]")) {
                const valueElement = targetElement.closest("[data-quantity]").querySelector("[data-quantity-value]");
                let value = parseInt(valueElement.value);
                if (targetElement.hasAttribute("data-quantity-plus")) {
                    value++;
                    if (+valueElement.dataset.quantityMax && +valueElement.dataset.quantityMax < value) value = valueElement.dataset.quantityMax;
                } else {
                    --value;
                    if (+valueElement.dataset.quantityMin) {
                        if (+valueElement.dataset.quantityMin > value) value = valueElement.dataset.quantityMin;
                    } else if (value < 1) value = 1;
                }
                targetElement.closest("[data-quantity]").querySelector("[data-quantity-value]").value = value;
            }
        }));
    }
    class SelectConstructor {
        constructor(props, data = null) {
            let defaultConfig = {
                init: true,
                logging: true
            };
            this.config = Object.assign(defaultConfig, props);
            this.selectClasses = {
                classSelect: "select",
                classSelectBody: "select__body",
                classSelectTitle: "select__title",
                classSelectValue: "select__value",
                classSelectLabel: "select__label",
                classSelectInput: "select__input",
                classSelectText: "select__text",
                classSelectLink: "select__link",
                classSelectOptions: "select__options",
                classSelectOptionsScroll: "select__scroll",
                classSelectOption: "select__option",
                classSelectContent: "select__content",
                classSelectRow: "select__row",
                classSelectData: "select__asset",
                classSelectDisabled: "_select-disabled",
                classSelectTag: "_select-tag",
                classSelectOpen: "_select-open",
                classSelectActive: "_select-active",
                classSelectFocus: "_select-focus",
                classSelectMultiple: "_select-multiple",
                classSelectCheckBox: "_select-checkbox",
                classSelectOptionSelected: "_select-selected",
                classSelectPseudoLabel: "_select-pseudo-label"
            };
            this._this = this;
            if (this.config.init) {
                const selectItems = data ? document.querySelectorAll(data) : document.querySelectorAll("select");
                if (selectItems.length) {
                    this.selectsInit(selectItems);
                    this.setLogging(`Прокинувся, построїв селектов: (${selectItems.length})`);
                } else this.setLogging("Сплю, немає жодного select");
            }
        }
        getSelectClass(className) {
            return `.${className}`;
        }
        getSelectElement(selectItem, className) {
            return {
                originalSelect: selectItem.querySelector("select"),
                selectElement: selectItem.querySelector(this.getSelectClass(className))
            };
        }
        selectsInit(selectItems) {
            selectItems.forEach(((originalSelect, index) => {
                this.selectInit(originalSelect, index + 1);
            }));
            document.addEventListener("click", function(e) {
                this.selectsActions(e);
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                this.selectsActions(e);
            }.bind(this));
            document.addEventListener("focusin", function(e) {
                this.selectsActions(e);
            }.bind(this));
            document.addEventListener("focusout", function(e) {
                this.selectsActions(e);
            }.bind(this));
        }
        selectInit(originalSelect, index) {
            const _this = this;
            let selectItem = document.createElement("div");
            selectItem.classList.add(this.selectClasses.classSelect);
            originalSelect.parentNode.insertBefore(selectItem, originalSelect);
            selectItem.appendChild(originalSelect);
            originalSelect.hidden = true;
            index ? originalSelect.dataset.id = index : null;
            if (this.getSelectPlaceholder(originalSelect)) {
                originalSelect.dataset.placeholder = this.getSelectPlaceholder(originalSelect).value;
                if (this.getSelectPlaceholder(originalSelect).label.show) {
                    const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
                    selectItemTitle.insertAdjacentHTML("afterbegin", `<span class="${this.selectClasses.classSelectLabel}">${this.getSelectPlaceholder(originalSelect).label.text ? this.getSelectPlaceholder(originalSelect).label.text : this.getSelectPlaceholder(originalSelect).value}</span>`);
                }
            }
            selectItem.insertAdjacentHTML("beforeend", `<div class="${this.selectClasses.classSelectBody}"><div hidden class="${this.selectClasses.classSelectOptions}"></div></div>`);
            this.selectBuild(originalSelect);
            originalSelect.dataset.speed = originalSelect.dataset.speed ? originalSelect.dataset.speed : "150";
            originalSelect.addEventListener("change", (function(e) {
                _this.selectChange(e);
            }));
        }
        selectBuild(originalSelect) {
            const selectItem = originalSelect.parentElement;
            selectItem.dataset.id = originalSelect.dataset.id;
            originalSelect.dataset.classModif ? selectItem.classList.add(`select_${originalSelect.dataset.classModif}`) : null;
            originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectMultiple) : selectItem.classList.remove(this.selectClasses.classSelectMultiple);
            originalSelect.hasAttribute("data-checkbox") && originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectCheckBox) : selectItem.classList.remove(this.selectClasses.classSelectCheckBox);
            this.setSelectTitleValue(selectItem, originalSelect);
            this.setOptions(selectItem, originalSelect);
            originalSelect.hasAttribute("data-search") ? this.searchActions(selectItem) : null;
            originalSelect.hasAttribute("data-open") ? this.selectAction(selectItem) : null;
            this.selectDisabled(selectItem, originalSelect);
        }
        selectsActions(e) {
            const targetElement = e.target;
            const targetType = e.type;
            if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect)) || targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
                const selectItem = targetElement.closest(".select") ? targetElement.closest(".select") : document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag)).dataset.selectId}"]`);
                const originalSelect = this.getSelectElement(selectItem).originalSelect;
                if ("click" === targetType) {
                    if (!originalSelect.disabled) if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
                        const targetTag = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag));
                        const optionItem = document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetTag.dataset.selectId}"] .select__option[data-value="${targetTag.dataset.value}"]`);
                        this.optionAction(selectItem, originalSelect, optionItem);
                    } else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTitle))) this.selectAction(selectItem); else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption))) {
                        const optionItem = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption));
                        this.optionAction(selectItem, originalSelect, optionItem);
                    }
                } else if ("focusin" === targetType || "focusout" === targetType) {
                    if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect))) "focusin" === targetType ? selectItem.classList.add(this.selectClasses.classSelectFocus) : selectItem.classList.remove(this.selectClasses.classSelectFocus);
                } else if ("keydown" === targetType && "Escape" === e.code) this.selectsСlose();
            } else this.selectsСlose();
        }
        selectsСlose(selectOneGroup) {
            const selectsGroup = selectOneGroup ? selectOneGroup : document;
            const selectActiveItems = selectsGroup.querySelectorAll(`${this.getSelectClass(this.selectClasses.classSelect)}${this.getSelectClass(this.selectClasses.classSelectOpen)}`);
            if (selectActiveItems.length) selectActiveItems.forEach((selectActiveItem => {
                this.selectСlose(selectActiveItem);
            }));
        }
        selectСlose(selectItem) {
            const originalSelect = this.getSelectElement(selectItem).originalSelect;
            const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            if (!selectOptions.classList.contains("_slide")) {
                selectItem.classList.remove(this.selectClasses.classSelectOpen);
                _slideUp(selectOptions, originalSelect.dataset.speed);
            }
        }
        selectAction(selectItem) {
            const originalSelect = this.getSelectElement(selectItem).originalSelect;
            const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            if (originalSelect.closest("[data-one-select]")) {
                const selectOneGroup = originalSelect.closest("[data-one-select]");
                this.selectsСlose(selectOneGroup);
            }
            if (!selectOptions.classList.contains("_slide")) {
                selectItem.classList.toggle(this.selectClasses.classSelectOpen);
                _slideToggle(selectOptions, originalSelect.dataset.speed);
            }
        }
        setSelectTitleValue(selectItem, originalSelect) {
            const selectItemBody = this.getSelectElement(selectItem, this.selectClasses.classSelectBody).selectElement;
            const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
            if (selectItemTitle) selectItemTitle.remove();
            selectItemBody.insertAdjacentHTML("afterbegin", this.getSelectTitleValue(selectItem, originalSelect));
            originalSelect.hasAttribute("data-search") ? this.searchActions(selectItem) : null;
        }
        getSelectTitleValue(selectItem, originalSelect) {
            let selectTitleValue = this.getSelectedOptionsData(originalSelect, 2).html;
            if (originalSelect.multiple && originalSelect.hasAttribute("data-tags")) {
                selectTitleValue = this.getSelectedOptionsData(originalSelect).elements.map((option => `<span role="button" data-select-id="${selectItem.dataset.id}" data-value="${option.value}" class="_select-tag">${this.getSelectElementContent(option)}</span>`)).join("");
                if (originalSelect.dataset.tags && document.querySelector(originalSelect.dataset.tags)) {
                    document.querySelector(originalSelect.dataset.tags).innerHTML = selectTitleValue;
                    if (originalSelect.hasAttribute("data-search")) selectTitleValue = false;
                }
            }
            selectTitleValue = selectTitleValue.length ? selectTitleValue : originalSelect.dataset.placeholder ? originalSelect.dataset.placeholder : "";
            let pseudoAttribute = "";
            let pseudoAttributeClass = "";
            if (originalSelect.hasAttribute("data-pseudo-label")) {
                pseudoAttribute = originalSelect.dataset.pseudoLabel ? ` data-pseudo-label="${originalSelect.dataset.pseudoLabel}"` : ` data-pseudo-label="Заповніть атрибут"`;
                pseudoAttributeClass = ` ${this.selectClasses.classSelectPseudoLabel}`;
            }
            this.getSelectedOptionsData(originalSelect).values.length ? selectItem.classList.add(this.selectClasses.classSelectActive) : selectItem.classList.remove(this.selectClasses.classSelectActive);
            if (originalSelect.hasAttribute("data-search")) return `<div class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}"><input autocomplete="off" type="text" placeholder="${selectTitleValue}" data-placeholder="${selectTitleValue}" class="${this.selectClasses.classSelectInput}"></span></div>`; else {
                const customClass = this.getSelectedOptionsData(originalSelect).elements.length && this.getSelectedOptionsData(originalSelect).elements[0].dataset.class ? ` ${this.getSelectedOptionsData(originalSelect).elements[0].dataset.class}` : "";
                return `<button type="button" class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}${pseudoAttributeClass}"><span class="${this.selectClasses.classSelectContent}${customClass}">${selectTitleValue}</span></span></button>`;
            }
        }
        getSelectElementContent(selectOption) {
            const selectOptionData = selectOption.dataset.asset ? `${selectOption.dataset.asset}` : "";
            const selectOptionDataHTML = selectOptionData.indexOf("img") >= 0 ? `<img src="${selectOptionData}" alt="">` : selectOptionData;
            let selectOptionContentHTML = ``;
            selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectRow}">` : "";
            selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectData}">` : "";
            selectOptionContentHTML += selectOptionData ? selectOptionDataHTML : "";
            selectOptionContentHTML += selectOptionData ? `</span>` : "";
            selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectText}">` : "";
            selectOptionContentHTML += selectOption.textContent;
            selectOptionContentHTML += selectOptionData ? `</span>` : "";
            selectOptionContentHTML += selectOptionData ? `</span>` : "";
            return selectOptionContentHTML;
        }
        getSelectPlaceholder(originalSelect) {
            const selectPlaceholder = Array.from(originalSelect.options).find((option => !option.value));
            if (selectPlaceholder) return {
                value: selectPlaceholder.textContent,
                show: selectPlaceholder.hasAttribute("data-show"),
                label: {
                    show: selectPlaceholder.hasAttribute("data-label"),
                    text: selectPlaceholder.dataset.label
                }
            };
        }
        getSelectedOptionsData(originalSelect, type) {
            let selectedOptions = [];
            if (originalSelect.multiple) selectedOptions = Array.from(originalSelect.options).filter((option => option.value)).filter((option => option.selected)); else selectedOptions.push(originalSelect.options[originalSelect.selectedIndex]);
            return {
                elements: selectedOptions.map((option => option)),
                values: selectedOptions.filter((option => option.value)).map((option => option.value)),
                html: selectedOptions.map((option => this.getSelectElementContent(option)))
            };
        }
        getOptions(originalSelect) {
            let selectOptionsScroll = originalSelect.hasAttribute("data-scroll") ? `data-simplebar` : "";
            let selectOptionsScrollHeight = originalSelect.dataset.scroll ? `style="max-height:${originalSelect.dataset.scroll}px"` : "";
            let selectOptions = Array.from(originalSelect.options);
            if (selectOptions.length > 0) {
                let selectOptionsHTML = ``;
                if (this.getSelectPlaceholder(originalSelect) && !this.getSelectPlaceholder(originalSelect).show || originalSelect.multiple) selectOptions = selectOptions.filter((option => option.value));
                selectOptionsHTML += selectOptionsScroll ? `<div ${selectOptionsScroll} ${selectOptionsScrollHeight} class="${this.selectClasses.classSelectOptionsScroll}">` : "";
                selectOptions.forEach((selectOption => {
                    selectOptionsHTML += this.getOption(selectOption, originalSelect);
                }));
                selectOptionsHTML += selectOptionsScroll ? `</div>` : "";
                return selectOptionsHTML;
            }
        }
        getOption(selectOption, originalSelect) {
            const selectOptionSelected = selectOption.selected && originalSelect.multiple ? ` ${this.selectClasses.classSelectOptionSelected}` : "";
            const selectOptionHide = selectOption.selected && !originalSelect.hasAttribute("data-show-selected") && !originalSelect.multiple ? `hidden` : ``;
            const selectOptionClass = selectOption.dataset.class ? ` ${selectOption.dataset.class}` : "";
            const selectOptionLink = selectOption.dataset.href ? selectOption.dataset.href : false;
            const selectOptionLinkTarget = selectOption.hasAttribute("data-href-blank") ? `target="_blank"` : "";
            let selectOptionHTML = ``;
            selectOptionHTML += selectOptionLink ? `<a ${selectOptionLinkTarget} ${selectOptionHide} href="${selectOptionLink}" data-value="${selectOption.value}" class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}">` : `<button ${selectOptionHide} class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}" data-value="${selectOption.value}" type="button">`;
            selectOptionHTML += this.getSelectElementContent(selectOption);
            selectOptionHTML += selectOptionLink ? `</a>` : `</button>`;
            return selectOptionHTML;
        }
        setOptions(selectItem, originalSelect) {
            const selectItemOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            selectItemOptions.innerHTML = this.getOptions(originalSelect);
        }
        optionAction(selectItem, originalSelect, optionItem) {
            if (originalSelect.multiple) {
                optionItem.classList.toggle(this.selectClasses.classSelectOptionSelected);
                const originalSelectSelectedItems = this.getSelectedOptionsData(originalSelect).elements;
                originalSelectSelectedItems.forEach((originalSelectSelectedItem => {
                    originalSelectSelectedItem.removeAttribute("selected");
                }));
                const selectSelectedItems = selectItem.querySelectorAll(this.getSelectClass(this.selectClasses.classSelectOptionSelected));
                selectSelectedItems.forEach((selectSelectedItems => {
                    originalSelect.querySelector(`option[value="${selectSelectedItems.dataset.value}"]`).setAttribute("selected", "selected");
                }));
            } else {
                if (!originalSelect.hasAttribute("data-show-selected")) {
                    if (selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`)) selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`).hidden = false;
                    optionItem.hidden = true;
                }
                originalSelect.value = optionItem.hasAttribute("data-value") ? optionItem.dataset.value : optionItem.textContent;
                this.selectAction(selectItem);
            }
            this.setSelectTitleValue(selectItem, originalSelect);
            this.setSelectChange(originalSelect);
        }
        selectChange(e) {
            const originalSelect = e.target;
            this.selectBuild(originalSelect);
            this.setSelectChange(originalSelect);
        }
        setSelectChange(originalSelect) {
            if (originalSelect.hasAttribute("data-validate")) formValidate.validateInput(originalSelect);
            if (originalSelect.hasAttribute("data-submit") && originalSelect.value) {
                let tempButton = document.createElement("button");
                tempButton.type = "submit";
                originalSelect.closest("form").append(tempButton);
                tempButton.click();
                tempButton.remove();
            }
            const selectItem = originalSelect.parentElement;
            this.selectCallback(selectItem, originalSelect);
        }
        selectDisabled(selectItem, originalSelect) {
            if (originalSelect.disabled) {
                selectItem.classList.add(this.selectClasses.classSelectDisabled);
                this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = true;
            } else {
                selectItem.classList.remove(this.selectClasses.classSelectDisabled);
                this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = false;
            }
        }
        searchActions(selectItem) {
            this.getSelectElement(selectItem).originalSelect;
            const selectInput = this.getSelectElement(selectItem, this.selectClasses.classSelectInput).selectElement;
            const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            const selectOptionsItems = selectOptions.querySelectorAll(`.${this.selectClasses.classSelectOption}`);
            const _this = this;
            selectInput.addEventListener("input", (function() {
                selectOptionsItems.forEach((selectOptionsItem => {
                    if (selectOptionsItem.textContent.toUpperCase().includes(selectInput.value.toUpperCase())) selectOptionsItem.hidden = false; else selectOptionsItem.hidden = true;
                }));
                true === selectOptions.hidden ? _this.selectAction(selectItem) : null;
            }));
        }
        selectCallback(selectItem, originalSelect) {
            document.dispatchEvent(new CustomEvent("selectCallback", {
                detail: {
                    select: originalSelect
                }
            }));
        }
        setLogging(message) {
            this.config.logging ? functions_FLS(`[select]: ${message}`) : null;
        }
    }
    modules_flsModules.select = new SelectConstructor({});
    function ssr_window_esm_isObject(obj) {
        return null !== obj && "object" === typeof obj && "constructor" in obj && obj.constructor === Object;
    }
    function extend(target = {}, src = {}) {
        Object.keys(src).forEach((key => {
            if ("undefined" === typeof target[key]) target[key] = src[key]; else if (ssr_window_esm_isObject(src[key]) && ssr_window_esm_isObject(target[key]) && Object.keys(src[key]).length > 0) extend(target[key], src[key]);
        }));
    }
    const ssrDocument = {
        body: {},
        addEventListener() {},
        removeEventListener() {},
        activeElement: {
            blur() {},
            nodeName: ""
        },
        querySelector() {
            return null;
        },
        querySelectorAll() {
            return [];
        },
        getElementById() {
            return null;
        },
        createEvent() {
            return {
                initEvent() {}
            };
        },
        createElement() {
            return {
                children: [],
                childNodes: [],
                style: {},
                setAttribute() {},
                getElementsByTagName() {
                    return [];
                }
            };
        },
        createElementNS() {
            return {};
        },
        importNode() {
            return null;
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        }
    };
    function ssr_window_esm_getDocument() {
        const doc = "undefined" !== typeof document ? document : {};
        extend(doc, ssrDocument);
        return doc;
    }
    const ssrWindow = {
        document: ssrDocument,
        navigator: {
            userAgent: ""
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        },
        history: {
            replaceState() {},
            pushState() {},
            go() {},
            back() {}
        },
        CustomEvent: function CustomEvent() {
            return this;
        },
        addEventListener() {},
        removeEventListener() {},
        getComputedStyle() {
            return {
                getPropertyValue() {
                    return "";
                }
            };
        },
        Image() {},
        Date() {},
        screen: {},
        setTimeout() {},
        clearTimeout() {},
        matchMedia() {
            return {};
        },
        requestAnimationFrame(callback) {
            if ("undefined" === typeof setTimeout) {
                callback();
                return null;
            }
            return setTimeout(callback, 0);
        },
        cancelAnimationFrame(id) {
            if ("undefined" === typeof setTimeout) return;
            clearTimeout(id);
        }
    };
    function ssr_window_esm_getWindow() {
        const win = "undefined" !== typeof window ? window : {};
        extend(win, ssrWindow);
        return win;
    }
    function makeReactive(obj) {
        const proto = obj.__proto__;
        Object.defineProperty(obj, "__proto__", {
            get() {
                return proto;
            },
            set(value) {
                proto.__proto__ = value;
            }
        });
    }
    class Dom7 extends Array {
        constructor(items) {
            if ("number" === typeof items) super(items); else {
                super(...items || []);
                makeReactive(this);
            }
        }
    }
    function arrayFlat(arr = []) {
        const res = [];
        arr.forEach((el => {
            if (Array.isArray(el)) res.push(...arrayFlat(el)); else res.push(el);
        }));
        return res;
    }
    function arrayFilter(arr, callback) {
        return Array.prototype.filter.call(arr, callback);
    }
    function arrayUnique(arr) {
        const uniqueArray = [];
        for (let i = 0; i < arr.length; i += 1) if (-1 === uniqueArray.indexOf(arr[i])) uniqueArray.push(arr[i]);
        return uniqueArray;
    }
    function qsa(selector, context) {
        if ("string" !== typeof selector) return [ selector ];
        const a = [];
        const res = context.querySelectorAll(selector);
        for (let i = 0; i < res.length; i += 1) a.push(res[i]);
        return a;
    }
    function dom7_esm_$(selector, context) {
        const window = ssr_window_esm_getWindow();
        const document = ssr_window_esm_getDocument();
        let arr = [];
        if (!context && selector instanceof Dom7) return selector;
        if (!selector) return new Dom7(arr);
        if ("string" === typeof selector) {
            const html = selector.trim();
            if (html.indexOf("<") >= 0 && html.indexOf(">") >= 0) {
                let toCreate = "div";
                if (0 === html.indexOf("<li")) toCreate = "ul";
                if (0 === html.indexOf("<tr")) toCreate = "tbody";
                if (0 === html.indexOf("<td") || 0 === html.indexOf("<th")) toCreate = "tr";
                if (0 === html.indexOf("<tbody")) toCreate = "table";
                if (0 === html.indexOf("<option")) toCreate = "select";
                const tempParent = document.createElement(toCreate);
                tempParent.innerHTML = html;
                for (let i = 0; i < tempParent.childNodes.length; i += 1) arr.push(tempParent.childNodes[i]);
            } else arr = qsa(selector.trim(), context || document);
        } else if (selector.nodeType || selector === window || selector === document) arr.push(selector); else if (Array.isArray(selector)) {
            if (selector instanceof Dom7) return selector;
            arr = selector;
        }
        return new Dom7(arrayUnique(arr));
    }
    dom7_esm_$.fn = Dom7.prototype;
    function addClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        this.forEach((el => {
            el.classList.add(...classNames);
        }));
        return this;
    }
    function removeClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        this.forEach((el => {
            el.classList.remove(...classNames);
        }));
        return this;
    }
    function toggleClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        this.forEach((el => {
            classNames.forEach((className => {
                el.classList.toggle(className);
            }));
        }));
    }
    function hasClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        return arrayFilter(this, (el => classNames.filter((className => el.classList.contains(className))).length > 0)).length > 0;
    }
    function attr(attrs, value) {
        if (1 === arguments.length && "string" === typeof attrs) {
            if (this[0]) return this[0].getAttribute(attrs);
            return;
        }
        for (let i = 0; i < this.length; i += 1) if (2 === arguments.length) this[i].setAttribute(attrs, value); else for (const attrName in attrs) {
            this[i][attrName] = attrs[attrName];
            this[i].setAttribute(attrName, attrs[attrName]);
        }
        return this;
    }
    function removeAttr(attr) {
        for (let i = 0; i < this.length; i += 1) this[i].removeAttribute(attr);
        return this;
    }
    function transform(transform) {
        for (let i = 0; i < this.length; i += 1) this[i].style.transform = transform;
        return this;
    }
    function transition(duration) {
        for (let i = 0; i < this.length; i += 1) this[i].style.transitionDuration = "string" !== typeof duration ? `${duration}ms` : duration;
        return this;
    }
    function on(...args) {
        let [eventType, targetSelector, listener, capture] = args;
        if ("function" === typeof args[1]) {
            [eventType, listener, capture] = args;
            targetSelector = void 0;
        }
        if (!capture) capture = false;
        function handleLiveEvent(e) {
            const target = e.target;
            if (!target) return;
            const eventData = e.target.dom7EventData || [];
            if (eventData.indexOf(e) < 0) eventData.unshift(e);
            if (dom7_esm_$(target).is(targetSelector)) listener.apply(target, eventData); else {
                const parents = dom7_esm_$(target).parents();
                for (let k = 0; k < parents.length; k += 1) if (dom7_esm_$(parents[k]).is(targetSelector)) listener.apply(parents[k], eventData);
            }
        }
        function handleEvent(e) {
            const eventData = e && e.target ? e.target.dom7EventData || [] : [];
            if (eventData.indexOf(e) < 0) eventData.unshift(e);
            listener.apply(this, eventData);
        }
        const events = eventType.split(" ");
        let j;
        for (let i = 0; i < this.length; i += 1) {
            const el = this[i];
            if (!targetSelector) for (j = 0; j < events.length; j += 1) {
                const event = events[j];
                if (!el.dom7Listeners) el.dom7Listeners = {};
                if (!el.dom7Listeners[event]) el.dom7Listeners[event] = [];
                el.dom7Listeners[event].push({
                    listener,
                    proxyListener: handleEvent
                });
                el.addEventListener(event, handleEvent, capture);
            } else for (j = 0; j < events.length; j += 1) {
                const event = events[j];
                if (!el.dom7LiveListeners) el.dom7LiveListeners = {};
                if (!el.dom7LiveListeners[event]) el.dom7LiveListeners[event] = [];
                el.dom7LiveListeners[event].push({
                    listener,
                    proxyListener: handleLiveEvent
                });
                el.addEventListener(event, handleLiveEvent, capture);
            }
        }
        return this;
    }
    function off(...args) {
        let [eventType, targetSelector, listener, capture] = args;
        if ("function" === typeof args[1]) {
            [eventType, listener, capture] = args;
            targetSelector = void 0;
        }
        if (!capture) capture = false;
        const events = eventType.split(" ");
        for (let i = 0; i < events.length; i += 1) {
            const event = events[i];
            for (let j = 0; j < this.length; j += 1) {
                const el = this[j];
                let handlers;
                if (!targetSelector && el.dom7Listeners) handlers = el.dom7Listeners[event]; else if (targetSelector && el.dom7LiveListeners) handlers = el.dom7LiveListeners[event];
                if (handlers && handlers.length) for (let k = handlers.length - 1; k >= 0; k -= 1) {
                    const handler = handlers[k];
                    if (listener && handler.listener === listener) {
                        el.removeEventListener(event, handler.proxyListener, capture);
                        handlers.splice(k, 1);
                    } else if (listener && handler.listener && handler.listener.dom7proxy && handler.listener.dom7proxy === listener) {
                        el.removeEventListener(event, handler.proxyListener, capture);
                        handlers.splice(k, 1);
                    } else if (!listener) {
                        el.removeEventListener(event, handler.proxyListener, capture);
                        handlers.splice(k, 1);
                    }
                }
            }
        }
        return this;
    }
    function trigger(...args) {
        const window = ssr_window_esm_getWindow();
        const events = args[0].split(" ");
        const eventData = args[1];
        for (let i = 0; i < events.length; i += 1) {
            const event = events[i];
            for (let j = 0; j < this.length; j += 1) {
                const el = this[j];
                if (window.CustomEvent) {
                    const evt = new window.CustomEvent(event, {
                        detail: eventData,
                        bubbles: true,
                        cancelable: true
                    });
                    el.dom7EventData = args.filter(((data, dataIndex) => dataIndex > 0));
                    el.dispatchEvent(evt);
                    el.dom7EventData = [];
                    delete el.dom7EventData;
                }
            }
        }
        return this;
    }
    function transitionEnd(callback) {
        const dom = this;
        function fireCallBack(e) {
            if (e.target !== this) return;
            callback.call(this, e);
            dom.off("transitionend", fireCallBack);
        }
        if (callback) dom.on("transitionend", fireCallBack);
        return this;
    }
    function dom7_esm_outerWidth(includeMargins) {
        if (this.length > 0) {
            if (includeMargins) {
                const styles = this.styles();
                return this[0].offsetWidth + parseFloat(styles.getPropertyValue("margin-right")) + parseFloat(styles.getPropertyValue("margin-left"));
            }
            return this[0].offsetWidth;
        }
        return null;
    }
    function dom7_esm_outerHeight(includeMargins) {
        if (this.length > 0) {
            if (includeMargins) {
                const styles = this.styles();
                return this[0].offsetHeight + parseFloat(styles.getPropertyValue("margin-top")) + parseFloat(styles.getPropertyValue("margin-bottom"));
            }
            return this[0].offsetHeight;
        }
        return null;
    }
    function offset() {
        if (this.length > 0) {
            const window = ssr_window_esm_getWindow();
            const document = ssr_window_esm_getDocument();
            const el = this[0];
            const box = el.getBoundingClientRect();
            const body = document.body;
            const clientTop = el.clientTop || body.clientTop || 0;
            const clientLeft = el.clientLeft || body.clientLeft || 0;
            const scrollTop = el === window ? window.scrollY : el.scrollTop;
            const scrollLeft = el === window ? window.scrollX : el.scrollLeft;
            return {
                top: box.top + scrollTop - clientTop,
                left: box.left + scrollLeft - clientLeft
            };
        }
        return null;
    }
    function styles() {
        const window = ssr_window_esm_getWindow();
        if (this[0]) return window.getComputedStyle(this[0], null);
        return {};
    }
    function css(props, value) {
        const window = ssr_window_esm_getWindow();
        let i;
        if (1 === arguments.length) if ("string" === typeof props) {
            if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(props);
        } else {
            for (i = 0; i < this.length; i += 1) for (const prop in props) this[i].style[prop] = props[prop];
            return this;
        }
        if (2 === arguments.length && "string" === typeof props) {
            for (i = 0; i < this.length; i += 1) this[i].style[props] = value;
            return this;
        }
        return this;
    }
    function each(callback) {
        if (!callback) return this;
        this.forEach(((el, index) => {
            callback.apply(el, [ el, index ]);
        }));
        return this;
    }
    function filter(callback) {
        const result = arrayFilter(this, callback);
        return dom7_esm_$(result);
    }
    function html(html) {
        if ("undefined" === typeof html) return this[0] ? this[0].innerHTML : null;
        for (let i = 0; i < this.length; i += 1) this[i].innerHTML = html;
        return this;
    }
    function dom7_esm_text(text) {
        if ("undefined" === typeof text) return this[0] ? this[0].textContent.trim() : null;
        for (let i = 0; i < this.length; i += 1) this[i].textContent = text;
        return this;
    }
    function is(selector) {
        const window = ssr_window_esm_getWindow();
        const document = ssr_window_esm_getDocument();
        const el = this[0];
        let compareWith;
        let i;
        if (!el || "undefined" === typeof selector) return false;
        if ("string" === typeof selector) {
            if (el.matches) return el.matches(selector);
            if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
            if (el.msMatchesSelector) return el.msMatchesSelector(selector);
            compareWith = dom7_esm_$(selector);
            for (i = 0; i < compareWith.length; i += 1) if (compareWith[i] === el) return true;
            return false;
        }
        if (selector === document) return el === document;
        if (selector === window) return el === window;
        if (selector.nodeType || selector instanceof Dom7) {
            compareWith = selector.nodeType ? [ selector ] : selector;
            for (i = 0; i < compareWith.length; i += 1) if (compareWith[i] === el) return true;
            return false;
        }
        return false;
    }
    function index() {
        let child = this[0];
        let i;
        if (child) {
            i = 0;
            while (null !== (child = child.previousSibling)) if (1 === child.nodeType) i += 1;
            return i;
        }
        return;
    }
    function eq(index) {
        if ("undefined" === typeof index) return this;
        const length = this.length;
        if (index > length - 1) return dom7_esm_$([]);
        if (index < 0) {
            const returnIndex = length + index;
            if (returnIndex < 0) return dom7_esm_$([]);
            return dom7_esm_$([ this[returnIndex] ]);
        }
        return dom7_esm_$([ this[index] ]);
    }
    function append(...els) {
        let newChild;
        const document = ssr_window_esm_getDocument();
        for (let k = 0; k < els.length; k += 1) {
            newChild = els[k];
            for (let i = 0; i < this.length; i += 1) if ("string" === typeof newChild) {
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = newChild;
                while (tempDiv.firstChild) this[i].appendChild(tempDiv.firstChild);
            } else if (newChild instanceof Dom7) for (let j = 0; j < newChild.length; j += 1) this[i].appendChild(newChild[j]); else this[i].appendChild(newChild);
        }
        return this;
    }
    function prepend(newChild) {
        const document = ssr_window_esm_getDocument();
        let i;
        let j;
        for (i = 0; i < this.length; i += 1) if ("string" === typeof newChild) {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = newChild;
            for (j = tempDiv.childNodes.length - 1; j >= 0; j -= 1) this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
        } else if (newChild instanceof Dom7) for (j = 0; j < newChild.length; j += 1) this[i].insertBefore(newChild[j], this[i].childNodes[0]); else this[i].insertBefore(newChild, this[i].childNodes[0]);
        return this;
    }
    function next(selector) {
        if (this.length > 0) {
            if (selector) {
                if (this[0].nextElementSibling && dom7_esm_$(this[0].nextElementSibling).is(selector)) return dom7_esm_$([ this[0].nextElementSibling ]);
                return dom7_esm_$([]);
            }
            if (this[0].nextElementSibling) return dom7_esm_$([ this[0].nextElementSibling ]);
            return dom7_esm_$([]);
        }
        return dom7_esm_$([]);
    }
    function nextAll(selector) {
        const nextEls = [];
        let el = this[0];
        if (!el) return dom7_esm_$([]);
        while (el.nextElementSibling) {
            const next = el.nextElementSibling;
            if (selector) {
                if (dom7_esm_$(next).is(selector)) nextEls.push(next);
            } else nextEls.push(next);
            el = next;
        }
        return dom7_esm_$(nextEls);
    }
    function prev(selector) {
        if (this.length > 0) {
            const el = this[0];
            if (selector) {
                if (el.previousElementSibling && dom7_esm_$(el.previousElementSibling).is(selector)) return dom7_esm_$([ el.previousElementSibling ]);
                return dom7_esm_$([]);
            }
            if (el.previousElementSibling) return dom7_esm_$([ el.previousElementSibling ]);
            return dom7_esm_$([]);
        }
        return dom7_esm_$([]);
    }
    function prevAll(selector) {
        const prevEls = [];
        let el = this[0];
        if (!el) return dom7_esm_$([]);
        while (el.previousElementSibling) {
            const prev = el.previousElementSibling;
            if (selector) {
                if (dom7_esm_$(prev).is(selector)) prevEls.push(prev);
            } else prevEls.push(prev);
            el = prev;
        }
        return dom7_esm_$(prevEls);
    }
    function dom7_esm_parent(selector) {
        const parents = [];
        for (let i = 0; i < this.length; i += 1) if (null !== this[i].parentNode) if (selector) {
            if (dom7_esm_$(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
        } else parents.push(this[i].parentNode);
        return dom7_esm_$(parents);
    }
    function parents(selector) {
        const parents = [];
        for (let i = 0; i < this.length; i += 1) {
            let parent = this[i].parentNode;
            while (parent) {
                if (selector) {
                    if (dom7_esm_$(parent).is(selector)) parents.push(parent);
                } else parents.push(parent);
                parent = parent.parentNode;
            }
        }
        return dom7_esm_$(parents);
    }
    function closest(selector) {
        let closest = this;
        if ("undefined" === typeof selector) return dom7_esm_$([]);
        if (!closest.is(selector)) closest = closest.parents(selector).eq(0);
        return closest;
    }
    function find(selector) {
        const foundElements = [];
        for (let i = 0; i < this.length; i += 1) {
            const found = this[i].querySelectorAll(selector);
            for (let j = 0; j < found.length; j += 1) foundElements.push(found[j]);
        }
        return dom7_esm_$(foundElements);
    }
    function children(selector) {
        const children = [];
        for (let i = 0; i < this.length; i += 1) {
            const childNodes = this[i].children;
            for (let j = 0; j < childNodes.length; j += 1) if (!selector || dom7_esm_$(childNodes[j]).is(selector)) children.push(childNodes[j]);
        }
        return dom7_esm_$(children);
    }
    function remove() {
        for (let i = 0; i < this.length; i += 1) if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
        return this;
    }
    const noTrigger = "resize scroll".split(" ");
    function shortcut(name) {
        function eventHandler(...args) {
            if ("undefined" === typeof args[0]) {
                for (let i = 0; i < this.length; i += 1) if (noTrigger.indexOf(name) < 0) if (name in this[i]) this[i][name](); else dom7_esm_$(this[i]).trigger(name);
                return this;
            }
            return this.on(name, ...args);
        }
        return eventHandler;
    }
    shortcut("click");
    shortcut("blur");
    shortcut("focus");
    shortcut("focusin");
    shortcut("focusout");
    shortcut("keyup");
    shortcut("keydown");
    shortcut("keypress");
    shortcut("submit");
    shortcut("change");
    shortcut("mousedown");
    shortcut("mousemove");
    shortcut("mouseup");
    shortcut("mouseenter");
    shortcut("mouseleave");
    shortcut("mouseout");
    shortcut("mouseover");
    shortcut("touchstart");
    shortcut("touchend");
    shortcut("touchmove");
    shortcut("resize");
    shortcut("scroll");
    const Methods = {
        addClass,
        removeClass,
        hasClass,
        toggleClass,
        attr,
        removeAttr,
        transform,
        transition,
        on,
        off,
        trigger,
        transitionEnd,
        outerWidth: dom7_esm_outerWidth,
        outerHeight: dom7_esm_outerHeight,
        styles,
        offset,
        css,
        each,
        html,
        text: dom7_esm_text,
        is,
        index,
        eq,
        append,
        prepend,
        next,
        nextAll,
        prev,
        prevAll,
        parent: dom7_esm_parent,
        parents,
        closest,
        find,
        children,
        filter,
        remove
    };
    Object.keys(Methods).forEach((methodName => {
        Object.defineProperty(dom7_esm_$.fn, methodName, {
            value: Methods[methodName],
            writable: true
        });
    }));
    const dom = dom7_esm_$;
    function deleteProps(obj) {
        const object = obj;
        Object.keys(object).forEach((key => {
            try {
                object[key] = null;
            } catch (e) {}
            try {
                delete object[key];
            } catch (e) {}
        }));
    }
    function utils_nextTick(callback, delay = 0) {
        return setTimeout(callback, delay);
    }
    function utils_now() {
        return Date.now();
    }
    function utils_getComputedStyle(el) {
        const window = ssr_window_esm_getWindow();
        let style;
        if (window.getComputedStyle) style = window.getComputedStyle(el, null);
        if (!style && el.currentStyle) style = el.currentStyle;
        if (!style) style = el.style;
        return style;
    }
    function utils_getTranslate(el, axis = "x") {
        const window = ssr_window_esm_getWindow();
        let matrix;
        let curTransform;
        let transformMatrix;
        const curStyle = utils_getComputedStyle(el, null);
        if (window.WebKitCSSMatrix) {
            curTransform = curStyle.transform || curStyle.webkitTransform;
            if (curTransform.split(",").length > 6) curTransform = curTransform.split(", ").map((a => a.replace(",", "."))).join(", ");
            transformMatrix = new window.WebKitCSSMatrix("none" === curTransform ? "" : curTransform);
        } else {
            transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
            matrix = transformMatrix.toString().split(",");
        }
        if ("x" === axis) if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41; else if (16 === matrix.length) curTransform = parseFloat(matrix[12]); else curTransform = parseFloat(matrix[4]);
        if ("y" === axis) if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42; else if (16 === matrix.length) curTransform = parseFloat(matrix[13]); else curTransform = parseFloat(matrix[5]);
        return curTransform || 0;
    }
    function utils_isObject(o) {
        return "object" === typeof o && null !== o && o.constructor && "Object" === Object.prototype.toString.call(o).slice(8, -1);
    }
    function isNode(node) {
        if ("undefined" !== typeof window && "undefined" !== typeof window.HTMLElement) return node instanceof HTMLElement;
        return node && (1 === node.nodeType || 11 === node.nodeType);
    }
    function utils_extend(...args) {
        const to = Object(args[0]);
        const noExtend = [ "__proto__", "constructor", "prototype" ];
        for (let i = 1; i < args.length; i += 1) {
            const nextSource = args[i];
            if (void 0 !== nextSource && null !== nextSource && !isNode(nextSource)) {
                const keysArray = Object.keys(Object(nextSource)).filter((key => noExtend.indexOf(key) < 0));
                for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
                    const nextKey = keysArray[nextIndex];
                    const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (void 0 !== desc && desc.enumerable) if (utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey]; else utils_extend(to[nextKey], nextSource[nextKey]); else if (!utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) {
                        to[nextKey] = {};
                        if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey]; else utils_extend(to[nextKey], nextSource[nextKey]);
                    } else to[nextKey] = nextSource[nextKey];
                }
            }
        }
        return to;
    }
    function utils_setCSSProperty(el, varName, varValue) {
        el.style.setProperty(varName, varValue);
    }
    function animateCSSModeScroll({swiper, targetPosition, side}) {
        const window = ssr_window_esm_getWindow();
        const startPosition = -swiper.translate;
        let startTime = null;
        let time;
        const duration = swiper.params.speed;
        swiper.wrapperEl.style.scrollSnapType = "none";
        window.cancelAnimationFrame(swiper.cssModeFrameID);
        const dir = targetPosition > startPosition ? "next" : "prev";
        const isOutOfBound = (current, target) => "next" === dir && current >= target || "prev" === dir && current <= target;
        const animate = () => {
            time = (new Date).getTime();
            if (null === startTime) startTime = time;
            const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
            const easeProgress = .5 - Math.cos(progress * Math.PI) / 2;
            let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);
            if (isOutOfBound(currentPosition, targetPosition)) currentPosition = targetPosition;
            swiper.wrapperEl.scrollTo({
                [side]: currentPosition
            });
            if (isOutOfBound(currentPosition, targetPosition)) {
                swiper.wrapperEl.style.overflow = "hidden";
                swiper.wrapperEl.style.scrollSnapType = "";
                setTimeout((() => {
                    swiper.wrapperEl.style.overflow = "";
                    swiper.wrapperEl.scrollTo({
                        [side]: currentPosition
                    });
                }));
                window.cancelAnimationFrame(swiper.cssModeFrameID);
                return;
            }
            swiper.cssModeFrameID = window.requestAnimationFrame(animate);
        };
        animate();
    }
    let support;
    function calcSupport() {
        const window = ssr_window_esm_getWindow();
        const document = ssr_window_esm_getDocument();
        return {
            smoothScroll: document.documentElement && "scrollBehavior" in document.documentElement.style,
            touch: !!("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch),
            passiveListener: function checkPassiveListener() {
                let supportsPassive = false;
                try {
                    const opts = Object.defineProperty({}, "passive", {
                        get() {
                            supportsPassive = true;
                        }
                    });
                    window.addEventListener("testPassiveListener", null, opts);
                } catch (e) {}
                return supportsPassive;
            }(),
            gestures: function checkGestures() {
                return "ongesturestart" in window;
            }()
        };
    }
    function getSupport() {
        if (!support) support = calcSupport();
        return support;
    }
    let deviceCached;
    function calcDevice({userAgent} = {}) {
        const support = getSupport();
        const window = ssr_window_esm_getWindow();
        const platform = window.navigator.platform;
        const ua = userAgent || window.navigator.userAgent;
        const device = {
            ios: false,
            android: false
        };
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
        let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
        const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
        const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
        const windows = "Win32" === platform;
        let macos = "MacIntel" === platform;
        const iPadScreens = [ "1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810" ];
        if (!ipad && macos && support.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
            ipad = ua.match(/(Version)\/([\d.]+)/);
            if (!ipad) ipad = [ 0, 1, "13_0_0" ];
            macos = false;
        }
        if (android && !windows) {
            device.os = "android";
            device.android = true;
        }
        if (ipad || iphone || ipod) {
            device.os = "ios";
            device.ios = true;
        }
        return device;
    }
    function getDevice(overrides = {}) {
        if (!deviceCached) deviceCached = calcDevice(overrides);
        return deviceCached;
    }
    let browser;
    function calcBrowser() {
        const window = ssr_window_esm_getWindow();
        function isSafari() {
            const ua = window.navigator.userAgent.toLowerCase();
            return ua.indexOf("safari") >= 0 && ua.indexOf("chrome") < 0 && ua.indexOf("android") < 0;
        }
        return {
            isSafari: isSafari(),
            isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent)
        };
    }
    function getBrowser() {
        if (!browser) browser = calcBrowser();
        return browser;
    }
    function Resize({swiper, on, emit}) {
        const window = ssr_window_esm_getWindow();
        let observer = null;
        let animationFrame = null;
        const resizeHandler = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            emit("beforeResize");
            emit("resize");
        };
        const createObserver = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            observer = new ResizeObserver((entries => {
                animationFrame = window.requestAnimationFrame((() => {
                    const {width, height} = swiper;
                    let newWidth = width;
                    let newHeight = height;
                    entries.forEach((({contentBoxSize, contentRect, target}) => {
                        if (target && target !== swiper.el) return;
                        newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
                        newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
                    }));
                    if (newWidth !== width || newHeight !== height) resizeHandler();
                }));
            }));
            observer.observe(swiper.el);
        };
        const removeObserver = () => {
            if (animationFrame) window.cancelAnimationFrame(animationFrame);
            if (observer && observer.unobserve && swiper.el) {
                observer.unobserve(swiper.el);
                observer = null;
            }
        };
        const orientationChangeHandler = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            emit("orientationchange");
        };
        on("init", (() => {
            if (swiper.params.resizeObserver && "undefined" !== typeof window.ResizeObserver) {
                createObserver();
                return;
            }
            window.addEventListener("resize", resizeHandler);
            window.addEventListener("orientationchange", orientationChangeHandler);
        }));
        on("destroy", (() => {
            removeObserver();
            window.removeEventListener("resize", resizeHandler);
            window.removeEventListener("orientationchange", orientationChangeHandler);
        }));
    }
    function Observer({swiper, extendParams, on, emit}) {
        const observers = [];
        const window = ssr_window_esm_getWindow();
        const attach = (target, options = {}) => {
            const ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
            const observer = new ObserverFunc((mutations => {
                if (1 === mutations.length) {
                    emit("observerUpdate", mutations[0]);
                    return;
                }
                const observerUpdate = function observerUpdate() {
                    emit("observerUpdate", mutations[0]);
                };
                if (window.requestAnimationFrame) window.requestAnimationFrame(observerUpdate); else window.setTimeout(observerUpdate, 0);
            }));
            observer.observe(target, {
                attributes: "undefined" === typeof options.attributes ? true : options.attributes,
                childList: "undefined" === typeof options.childList ? true : options.childList,
                characterData: "undefined" === typeof options.characterData ? true : options.characterData
            });
            observers.push(observer);
        };
        const init = () => {
            if (!swiper.params.observer) return;
            if (swiper.params.observeParents) {
                const containerParents = swiper.$el.parents();
                for (let i = 0; i < containerParents.length; i += 1) attach(containerParents[i]);
            }
            attach(swiper.$el[0], {
                childList: swiper.params.observeSlideChildren
            });
            attach(swiper.$wrapperEl[0], {
                attributes: false
            });
        };
        const destroy = () => {
            observers.forEach((observer => {
                observer.disconnect();
            }));
            observers.splice(0, observers.length);
        };
        extendParams({
            observer: false,
            observeParents: false,
            observeSlideChildren: false
        });
        on("init", init);
        on("destroy", destroy);
    }
    const events_emitter = {
        on(events, handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if ("function" !== typeof handler) return self;
            const method = priority ? "unshift" : "push";
            events.split(" ").forEach((event => {
                if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
                self.eventsListeners[event][method](handler);
            }));
            return self;
        },
        once(events, handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if ("function" !== typeof handler) return self;
            function onceHandler(...args) {
                self.off(events, onceHandler);
                if (onceHandler.__emitterProxy) delete onceHandler.__emitterProxy;
                handler.apply(self, args);
            }
            onceHandler.__emitterProxy = handler;
            return self.on(events, onceHandler, priority);
        },
        onAny(handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if ("function" !== typeof handler) return self;
            const method = priority ? "unshift" : "push";
            if (self.eventsAnyListeners.indexOf(handler) < 0) self.eventsAnyListeners[method](handler);
            return self;
        },
        offAny(handler) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsAnyListeners) return self;
            const index = self.eventsAnyListeners.indexOf(handler);
            if (index >= 0) self.eventsAnyListeners.splice(index, 1);
            return self;
        },
        off(events, handler) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsListeners) return self;
            events.split(" ").forEach((event => {
                if ("undefined" === typeof handler) self.eventsListeners[event] = []; else if (self.eventsListeners[event]) self.eventsListeners[event].forEach(((eventHandler, index) => {
                    if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) self.eventsListeners[event].splice(index, 1);
                }));
            }));
            return self;
        },
        emit(...args) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsListeners) return self;
            let events;
            let data;
            let context;
            if ("string" === typeof args[0] || Array.isArray(args[0])) {
                events = args[0];
                data = args.slice(1, args.length);
                context = self;
            } else {
                events = args[0].events;
                data = args[0].data;
                context = args[0].context || self;
            }
            data.unshift(context);
            const eventsArray = Array.isArray(events) ? events : events.split(" ");
            eventsArray.forEach((event => {
                if (self.eventsAnyListeners && self.eventsAnyListeners.length) self.eventsAnyListeners.forEach((eventHandler => {
                    eventHandler.apply(context, [ event, ...data ]);
                }));
                if (self.eventsListeners && self.eventsListeners[event]) self.eventsListeners[event].forEach((eventHandler => {
                    eventHandler.apply(context, data);
                }));
            }));
            return self;
        }
    };
    function updateSize() {
        const swiper = this;
        let width;
        let height;
        const $el = swiper.$el;
        if ("undefined" !== typeof swiper.params.width && null !== swiper.params.width) width = swiper.params.width; else width = $el[0].clientWidth;
        if ("undefined" !== typeof swiper.params.height && null !== swiper.params.height) height = swiper.params.height; else height = $el[0].clientHeight;
        if (0 === width && swiper.isHorizontal() || 0 === height && swiper.isVertical()) return;
        width = width - parseInt($el.css("padding-left") || 0, 10) - parseInt($el.css("padding-right") || 0, 10);
        height = height - parseInt($el.css("padding-top") || 0, 10) - parseInt($el.css("padding-bottom") || 0, 10);
        if (Number.isNaN(width)) width = 0;
        if (Number.isNaN(height)) height = 0;
        Object.assign(swiper, {
            width,
            height,
            size: swiper.isHorizontal() ? width : height
        });
    }
    function updateSlides() {
        const swiper = this;
        function getDirectionLabel(property) {
            if (swiper.isHorizontal()) return property;
            return {
                width: "height",
                "margin-top": "margin-left",
                "margin-bottom ": "margin-right",
                "margin-left": "margin-top",
                "margin-right": "margin-bottom",
                "padding-left": "padding-top",
                "padding-right": "padding-bottom",
                marginRight: "marginBottom"
            }[property];
        }
        function getDirectionPropertyValue(node, label) {
            return parseFloat(node.getPropertyValue(getDirectionLabel(label)) || 0);
        }
        const params = swiper.params;
        const {$wrapperEl, size: swiperSize, rtlTranslate: rtl, wrongRTL} = swiper;
        const isVirtual = swiper.virtual && params.virtual.enabled;
        const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
        const slides = $wrapperEl.children(`.${swiper.params.slideClass}`);
        const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
        let snapGrid = [];
        const slidesGrid = [];
        const slidesSizesGrid = [];
        let offsetBefore = params.slidesOffsetBefore;
        if ("function" === typeof offsetBefore) offsetBefore = params.slidesOffsetBefore.call(swiper);
        let offsetAfter = params.slidesOffsetAfter;
        if ("function" === typeof offsetAfter) offsetAfter = params.slidesOffsetAfter.call(swiper);
        const previousSnapGridLength = swiper.snapGrid.length;
        const previousSlidesGridLength = swiper.slidesGrid.length;
        let spaceBetween = params.spaceBetween;
        let slidePosition = -offsetBefore;
        let prevSlideSize = 0;
        let index = 0;
        if ("undefined" === typeof swiperSize) return;
        if ("string" === typeof spaceBetween && spaceBetween.indexOf("%") >= 0) spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiperSize;
        swiper.virtualSize = -spaceBetween;
        if (rtl) slides.css({
            marginLeft: "",
            marginBottom: "",
            marginTop: ""
        }); else slides.css({
            marginRight: "",
            marginBottom: "",
            marginTop: ""
        });
        if (params.centeredSlides && params.cssMode) {
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-before", "");
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-after", "");
        }
        const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
        if (gridEnabled) swiper.grid.initSlides(slidesLength);
        let slideSize;
        const shouldResetSlideSize = "auto" === params.slidesPerView && params.breakpoints && Object.keys(params.breakpoints).filter((key => "undefined" !== typeof params.breakpoints[key].slidesPerView)).length > 0;
        for (let i = 0; i < slidesLength; i += 1) {
            slideSize = 0;
            const slide = slides.eq(i);
            if (gridEnabled) swiper.grid.updateSlide(i, slide, slidesLength, getDirectionLabel);
            if ("none" === slide.css("display")) continue;
            if ("auto" === params.slidesPerView) {
                if (shouldResetSlideSize) slides[i].style[getDirectionLabel("width")] = ``;
                const slideStyles = getComputedStyle(slide[0]);
                const currentTransform = slide[0].style.transform;
                const currentWebKitTransform = slide[0].style.webkitTransform;
                if (currentTransform) slide[0].style.transform = "none";
                if (currentWebKitTransform) slide[0].style.webkitTransform = "none";
                if (params.roundLengths) slideSize = swiper.isHorizontal() ? slide.outerWidth(true) : slide.outerHeight(true); else {
                    const width = getDirectionPropertyValue(slideStyles, "width");
                    const paddingLeft = getDirectionPropertyValue(slideStyles, "padding-left");
                    const paddingRight = getDirectionPropertyValue(slideStyles, "padding-right");
                    const marginLeft = getDirectionPropertyValue(slideStyles, "margin-left");
                    const marginRight = getDirectionPropertyValue(slideStyles, "margin-right");
                    const boxSizing = slideStyles.getPropertyValue("box-sizing");
                    if (boxSizing && "border-box" === boxSizing) slideSize = width + marginLeft + marginRight; else {
                        const {clientWidth, offsetWidth} = slide[0];
                        slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
                    }
                }
                if (currentTransform) slide[0].style.transform = currentTransform;
                if (currentWebKitTransform) slide[0].style.webkitTransform = currentWebKitTransform;
                if (params.roundLengths) slideSize = Math.floor(slideSize);
            } else {
                slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
                if (params.roundLengths) slideSize = Math.floor(slideSize);
                if (slides[i]) slides[i].style[getDirectionLabel("width")] = `${slideSize}px`;
            }
            if (slides[i]) slides[i].swiperSlideSize = slideSize;
            slidesSizesGrid.push(slideSize);
            if (params.centeredSlides) {
                slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
                if (0 === prevSlideSize && 0 !== i) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
                if (0 === i) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
                if (Math.abs(slidePosition) < 1 / 1e3) slidePosition = 0;
                if (params.roundLengths) slidePosition = Math.floor(slidePosition);
                if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
                slidesGrid.push(slidePosition);
            } else {
                if (params.roundLengths) slidePosition = Math.floor(slidePosition);
                if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
                slidesGrid.push(slidePosition);
                slidePosition = slidePosition + slideSize + spaceBetween;
            }
            swiper.virtualSize += slideSize + spaceBetween;
            prevSlideSize = slideSize;
            index += 1;
        }
        swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
        if (rtl && wrongRTL && ("slide" === params.effect || "coverflow" === params.effect)) $wrapperEl.css({
            width: `${swiper.virtualSize + params.spaceBetween}px`
        });
        if (params.setWrapperSize) $wrapperEl.css({
            [getDirectionLabel("width")]: `${swiper.virtualSize + params.spaceBetween}px`
        });
        if (gridEnabled) swiper.grid.updateWrapperSize(slideSize, snapGrid, getDirectionLabel);
        if (!params.centeredSlides) {
            const newSlidesGrid = [];
            for (let i = 0; i < snapGrid.length; i += 1) {
                let slidesGridItem = snapGrid[i];
                if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
                if (snapGrid[i] <= swiper.virtualSize - swiperSize) newSlidesGrid.push(slidesGridItem);
            }
            snapGrid = newSlidesGrid;
            if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) snapGrid.push(swiper.virtualSize - swiperSize);
        }
        if (0 === snapGrid.length) snapGrid = [ 0 ];
        if (0 !== params.spaceBetween) {
            const key = swiper.isHorizontal() && rtl ? "marginLeft" : getDirectionLabel("marginRight");
            slides.filter(((_, slideIndex) => {
                if (!params.cssMode) return true;
                if (slideIndex === slides.length - 1) return false;
                return true;
            })).css({
                [key]: `${spaceBetween}px`
            });
        }
        if (params.centeredSlides && params.centeredSlidesBounds) {
            let allSlidesSize = 0;
            slidesSizesGrid.forEach((slideSizeValue => {
                allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
            }));
            allSlidesSize -= params.spaceBetween;
            const maxSnap = allSlidesSize - swiperSize;
            snapGrid = snapGrid.map((snap => {
                if (snap < 0) return -offsetBefore;
                if (snap > maxSnap) return maxSnap + offsetAfter;
                return snap;
            }));
        }
        if (params.centerInsufficientSlides) {
            let allSlidesSize = 0;
            slidesSizesGrid.forEach((slideSizeValue => {
                allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
            }));
            allSlidesSize -= params.spaceBetween;
            if (allSlidesSize < swiperSize) {
                const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
                snapGrid.forEach(((snap, snapIndex) => {
                    snapGrid[snapIndex] = snap - allSlidesOffset;
                }));
                slidesGrid.forEach(((snap, snapIndex) => {
                    slidesGrid[snapIndex] = snap + allSlidesOffset;
                }));
            }
        }
        Object.assign(swiper, {
            slides,
            snapGrid,
            slidesGrid,
            slidesSizesGrid
        });
        if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-before", `${-snapGrid[0]}px`);
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-after", `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
            const addToSnapGrid = -swiper.snapGrid[0];
            const addToSlidesGrid = -swiper.slidesGrid[0];
            swiper.snapGrid = swiper.snapGrid.map((v => v + addToSnapGrid));
            swiper.slidesGrid = swiper.slidesGrid.map((v => v + addToSlidesGrid));
        }
        if (slidesLength !== previousSlidesLength) swiper.emit("slidesLengthChange");
        if (snapGrid.length !== previousSnapGridLength) {
            if (swiper.params.watchOverflow) swiper.checkOverflow();
            swiper.emit("snapGridLengthChange");
        }
        if (slidesGrid.length !== previousSlidesGridLength) swiper.emit("slidesGridLengthChange");
        if (params.watchSlidesProgress) swiper.updateSlidesOffset();
        if (!isVirtual && !params.cssMode && ("slide" === params.effect || "fade" === params.effect)) {
            const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
            const hasClassBackfaceClassAdded = swiper.$el.hasClass(backFaceHiddenClass);
            if (slidesLength <= params.maxBackfaceHiddenSlides) {
                if (!hasClassBackfaceClassAdded) swiper.$el.addClass(backFaceHiddenClass);
            } else if (hasClassBackfaceClassAdded) swiper.$el.removeClass(backFaceHiddenClass);
        }
    }
    function updateAutoHeight(speed) {
        const swiper = this;
        const activeSlides = [];
        const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
        let newHeight = 0;
        let i;
        if ("number" === typeof speed) swiper.setTransition(speed); else if (true === speed) swiper.setTransition(swiper.params.speed);
        const getSlideByIndex = index => {
            if (isVirtual) return swiper.slides.filter((el => parseInt(el.getAttribute("data-swiper-slide-index"), 10) === index))[0];
            return swiper.slides.eq(index)[0];
        };
        if ("auto" !== swiper.params.slidesPerView && swiper.params.slidesPerView > 1) if (swiper.params.centeredSlides) (swiper.visibleSlides || dom([])).each((slide => {
            activeSlides.push(slide);
        })); else for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
            const index = swiper.activeIndex + i;
            if (index > swiper.slides.length && !isVirtual) break;
            activeSlides.push(getSlideByIndex(index));
        } else activeSlides.push(getSlideByIndex(swiper.activeIndex));
        for (i = 0; i < activeSlides.length; i += 1) if ("undefined" !== typeof activeSlides[i]) {
            const height = activeSlides[i].offsetHeight;
            newHeight = height > newHeight ? height : newHeight;
        }
        if (newHeight || 0 === newHeight) swiper.$wrapperEl.css("height", `${newHeight}px`);
    }
    function updateSlidesOffset() {
        const swiper = this;
        const slides = swiper.slides;
        for (let i = 0; i < slides.length; i += 1) slides[i].swiperSlideOffset = swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop;
    }
    function updateSlidesProgress(translate = this && this.translate || 0) {
        const swiper = this;
        const params = swiper.params;
        const {slides, rtlTranslate: rtl, snapGrid} = swiper;
        if (0 === slides.length) return;
        if ("undefined" === typeof slides[0].swiperSlideOffset) swiper.updateSlidesOffset();
        let offsetCenter = -translate;
        if (rtl) offsetCenter = translate;
        slides.removeClass(params.slideVisibleClass);
        swiper.visibleSlidesIndexes = [];
        swiper.visibleSlides = [];
        for (let i = 0; i < slides.length; i += 1) {
            const slide = slides[i];
            let slideOffset = slide.swiperSlideOffset;
            if (params.cssMode && params.centeredSlides) slideOffset -= slides[0].swiperSlideOffset;
            const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
            const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
            const slideBefore = -(offsetCenter - slideOffset);
            const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
            const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;
            if (isVisible) {
                swiper.visibleSlides.push(slide);
                swiper.visibleSlidesIndexes.push(i);
                slides.eq(i).addClass(params.slideVisibleClass);
            }
            slide.progress = rtl ? -slideProgress : slideProgress;
            slide.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
        }
        swiper.visibleSlides = dom(swiper.visibleSlides);
    }
    function updateProgress(translate) {
        const swiper = this;
        if ("undefined" === typeof translate) {
            const multiplier = swiper.rtlTranslate ? -1 : 1;
            translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
        }
        const params = swiper.params;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        let {progress, isBeginning, isEnd} = swiper;
        const wasBeginning = isBeginning;
        const wasEnd = isEnd;
        if (0 === translatesDiff) {
            progress = 0;
            isBeginning = true;
            isEnd = true;
        } else {
            progress = (translate - swiper.minTranslate()) / translatesDiff;
            isBeginning = progress <= 0;
            isEnd = progress >= 1;
        }
        Object.assign(swiper, {
            progress,
            isBeginning,
            isEnd
        });
        if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate);
        if (isBeginning && !wasBeginning) swiper.emit("reachBeginning toEdge");
        if (isEnd && !wasEnd) swiper.emit("reachEnd toEdge");
        if (wasBeginning && !isBeginning || wasEnd && !isEnd) swiper.emit("fromEdge");
        swiper.emit("progress", progress);
    }
    function updateSlidesClasses() {
        const swiper = this;
        const {slides, params, $wrapperEl, activeIndex, realIndex} = swiper;
        const isVirtual = swiper.virtual && params.virtual.enabled;
        slides.removeClass(`${params.slideActiveClass} ${params.slideNextClass} ${params.slidePrevClass} ${params.slideDuplicateActiveClass} ${params.slideDuplicateNextClass} ${params.slideDuplicatePrevClass}`);
        let activeSlide;
        if (isVirtual) activeSlide = swiper.$wrapperEl.find(`.${params.slideClass}[data-swiper-slide-index="${activeIndex}"]`); else activeSlide = slides.eq(activeIndex);
        activeSlide.addClass(params.slideActiveClass);
        if (params.loop) if (activeSlide.hasClass(params.slideDuplicateClass)) $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass); else $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass);
        let nextSlide = activeSlide.nextAll(`.${params.slideClass}`).eq(0).addClass(params.slideNextClass);
        if (params.loop && 0 === nextSlide.length) {
            nextSlide = slides.eq(0);
            nextSlide.addClass(params.slideNextClass);
        }
        let prevSlide = activeSlide.prevAll(`.${params.slideClass}`).eq(0).addClass(params.slidePrevClass);
        if (params.loop && 0 === prevSlide.length) {
            prevSlide = slides.eq(-1);
            prevSlide.addClass(params.slidePrevClass);
        }
        if (params.loop) {
            if (nextSlide.hasClass(params.slideDuplicateClass)) $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${nextSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicateNextClass); else $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${nextSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicateNextClass);
            if (prevSlide.hasClass(params.slideDuplicateClass)) $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${prevSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicatePrevClass); else $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${prevSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicatePrevClass);
        }
        swiper.emitSlidesClasses();
    }
    function updateActiveIndex(newActiveIndex) {
        const swiper = this;
        const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
        const {slidesGrid, snapGrid, params, activeIndex: previousIndex, realIndex: previousRealIndex, snapIndex: previousSnapIndex} = swiper;
        let activeIndex = newActiveIndex;
        let snapIndex;
        if ("undefined" === typeof activeIndex) {
            for (let i = 0; i < slidesGrid.length; i += 1) if ("undefined" !== typeof slidesGrid[i + 1]) {
                if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) activeIndex = i; else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) activeIndex = i + 1;
            } else if (translate >= slidesGrid[i]) activeIndex = i;
            if (params.normalizeSlideIndex) if (activeIndex < 0 || "undefined" === typeof activeIndex) activeIndex = 0;
        }
        if (snapGrid.indexOf(translate) >= 0) snapIndex = snapGrid.indexOf(translate); else {
            const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
            snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
        }
        if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
        if (activeIndex === previousIndex) {
            if (snapIndex !== previousSnapIndex) {
                swiper.snapIndex = snapIndex;
                swiper.emit("snapIndexChange");
            }
            return;
        }
        const realIndex = parseInt(swiper.slides.eq(activeIndex).attr("data-swiper-slide-index") || activeIndex, 10);
        Object.assign(swiper, {
            snapIndex,
            realIndex,
            previousIndex,
            activeIndex
        });
        swiper.emit("activeIndexChange");
        swiper.emit("snapIndexChange");
        if (previousRealIndex !== realIndex) swiper.emit("realIndexChange");
        if (swiper.initialized || swiper.params.runCallbacksOnInit) swiper.emit("slideChange");
    }
    function updateClickedSlide(e) {
        const swiper = this;
        const params = swiper.params;
        const slide = dom(e).closest(`.${params.slideClass}`)[0];
        let slideFound = false;
        let slideIndex;
        if (slide) for (let i = 0; i < swiper.slides.length; i += 1) if (swiper.slides[i] === slide) {
            slideFound = true;
            slideIndex = i;
            break;
        }
        if (slide && slideFound) {
            swiper.clickedSlide = slide;
            if (swiper.virtual && swiper.params.virtual.enabled) swiper.clickedIndex = parseInt(dom(slide).attr("data-swiper-slide-index"), 10); else swiper.clickedIndex = slideIndex;
        } else {
            swiper.clickedSlide = void 0;
            swiper.clickedIndex = void 0;
            return;
        }
        if (params.slideToClickedSlide && void 0 !== swiper.clickedIndex && swiper.clickedIndex !== swiper.activeIndex) swiper.slideToClickedSlide();
    }
    const update = {
        updateSize,
        updateSlides,
        updateAutoHeight,
        updateSlidesOffset,
        updateSlidesProgress,
        updateProgress,
        updateSlidesClasses,
        updateActiveIndex,
        updateClickedSlide
    };
    function getSwiperTranslate(axis = (this.isHorizontal() ? "x" : "y")) {
        const swiper = this;
        const {params, rtlTranslate: rtl, translate, $wrapperEl} = swiper;
        if (params.virtualTranslate) return rtl ? -translate : translate;
        if (params.cssMode) return translate;
        let currentTranslate = utils_getTranslate($wrapperEl[0], axis);
        if (rtl) currentTranslate = -currentTranslate;
        return currentTranslate || 0;
    }
    function setTranslate(translate, byController) {
        const swiper = this;
        const {rtlTranslate: rtl, params, $wrapperEl, wrapperEl, progress} = swiper;
        let x = 0;
        let y = 0;
        const z = 0;
        if (swiper.isHorizontal()) x = rtl ? -translate : translate; else y = translate;
        if (params.roundLengths) {
            x = Math.floor(x);
            y = Math.floor(y);
        }
        if (params.cssMode) wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] = swiper.isHorizontal() ? -x : -y; else if (!params.virtualTranslate) $wrapperEl.transform(`translate3d(${x}px, ${y}px, ${z}px)`);
        swiper.previousTranslate = swiper.translate;
        swiper.translate = swiper.isHorizontal() ? x : y;
        let newProgress;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        if (0 === translatesDiff) newProgress = 0; else newProgress = (translate - swiper.minTranslate()) / translatesDiff;
        if (newProgress !== progress) swiper.updateProgress(translate);
        swiper.emit("setTranslate", swiper.translate, byController);
    }
    function minTranslate() {
        return -this.snapGrid[0];
    }
    function maxTranslate() {
        return -this.snapGrid[this.snapGrid.length - 1];
    }
    function translateTo(translate = 0, speed = this.params.speed, runCallbacks = true, translateBounds = true, internal) {
        const swiper = this;
        const {params, wrapperEl} = swiper;
        if (swiper.animating && params.preventInteractionOnTransition) return false;
        const minTranslate = swiper.minTranslate();
        const maxTranslate = swiper.maxTranslate();
        let newTranslate;
        if (translateBounds && translate > minTranslate) newTranslate = minTranslate; else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate; else newTranslate = translate;
        swiper.updateProgress(newTranslate);
        if (params.cssMode) {
            const isH = swiper.isHorizontal();
            if (0 === speed) wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate; else {
                if (!swiper.support.smoothScroll) {
                    animateCSSModeScroll({
                        swiper,
                        targetPosition: -newTranslate,
                        side: isH ? "left" : "top"
                    });
                    return true;
                }
                wrapperEl.scrollTo({
                    [isH ? "left" : "top"]: -newTranslate,
                    behavior: "smooth"
                });
            }
            return true;
        }
        if (0 === speed) {
            swiper.setTransition(0);
            swiper.setTranslate(newTranslate);
            if (runCallbacks) {
                swiper.emit("beforeTransitionStart", speed, internal);
                swiper.emit("transitionEnd");
            }
        } else {
            swiper.setTransition(speed);
            swiper.setTranslate(newTranslate);
            if (runCallbacks) {
                swiper.emit("beforeTransitionStart", speed, internal);
                swiper.emit("transitionStart");
            }
            if (!swiper.animating) {
                swiper.animating = true;
                if (!swiper.onTranslateToWrapperTransitionEnd) swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
                    if (!swiper || swiper.destroyed) return;
                    if (e.target !== this) return;
                    swiper.$wrapperEl[0].removeEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
                    swiper.$wrapperEl[0].removeEventListener("webkitTransitionEnd", swiper.onTranslateToWrapperTransitionEnd);
                    swiper.onTranslateToWrapperTransitionEnd = null;
                    delete swiper.onTranslateToWrapperTransitionEnd;
                    if (runCallbacks) swiper.emit("transitionEnd");
                };
                swiper.$wrapperEl[0].addEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
                swiper.$wrapperEl[0].addEventListener("webkitTransitionEnd", swiper.onTranslateToWrapperTransitionEnd);
            }
        }
        return true;
    }
    const translate = {
        getTranslate: getSwiperTranslate,
        setTranslate,
        minTranslate,
        maxTranslate,
        translateTo
    };
    function setTransition(duration, byController) {
        const swiper = this;
        if (!swiper.params.cssMode) swiper.$wrapperEl.transition(duration);
        swiper.emit("setTransition", duration, byController);
    }
    function transitionEmit({swiper, runCallbacks, direction, step}) {
        const {activeIndex, previousIndex} = swiper;
        let dir = direction;
        if (!dir) if (activeIndex > previousIndex) dir = "next"; else if (activeIndex < previousIndex) dir = "prev"; else dir = "reset";
        swiper.emit(`transition${step}`);
        if (runCallbacks && activeIndex !== previousIndex) {
            if ("reset" === dir) {
                swiper.emit(`slideResetTransition${step}`);
                return;
            }
            swiper.emit(`slideChangeTransition${step}`);
            if ("next" === dir) swiper.emit(`slideNextTransition${step}`); else swiper.emit(`slidePrevTransition${step}`);
        }
    }
    function transitionStart(runCallbacks = true, direction) {
        const swiper = this;
        const {params} = swiper;
        if (params.cssMode) return;
        if (params.autoHeight) swiper.updateAutoHeight();
        transitionEmit({
            swiper,
            runCallbacks,
            direction,
            step: "Start"
        });
    }
    function transitionEnd_transitionEnd(runCallbacks = true, direction) {
        const swiper = this;
        const {params} = swiper;
        swiper.animating = false;
        if (params.cssMode) return;
        swiper.setTransition(0);
        transitionEmit({
            swiper,
            runCallbacks,
            direction,
            step: "End"
        });
    }
    const core_transition = {
        setTransition,
        transitionStart,
        transitionEnd: transitionEnd_transitionEnd
    };
    function slideTo(index = 0, speed = this.params.speed, runCallbacks = true, internal, initial) {
        if ("number" !== typeof index && "string" !== typeof index) throw new Error(`The 'index' argument cannot have type other than 'number' or 'string'. [${typeof index}] given.`);
        if ("string" === typeof index) {
            const indexAsNumber = parseInt(index, 10);
            const isValidNumber = isFinite(indexAsNumber);
            if (!isValidNumber) throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index}] given.`);
            index = indexAsNumber;
        }
        const swiper = this;
        let slideIndex = index;
        if (slideIndex < 0) slideIndex = 0;
        const {params, snapGrid, slidesGrid, previousIndex, activeIndex, rtlTranslate: rtl, wrapperEl, enabled} = swiper;
        if (swiper.animating && params.preventInteractionOnTransition || !enabled && !internal && !initial) return false;
        const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
        let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
        if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
        const translate = -snapGrid[snapIndex];
        if (params.normalizeSlideIndex) for (let i = 0; i < slidesGrid.length; i += 1) {
            const normalizedTranslate = -Math.floor(100 * translate);
            const normalizedGrid = Math.floor(100 * slidesGrid[i]);
            const normalizedGridNext = Math.floor(100 * slidesGrid[i + 1]);
            if ("undefined" !== typeof slidesGrid[i + 1]) {
                if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) slideIndex = i; else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) slideIndex = i + 1;
            } else if (normalizedTranslate >= normalizedGrid) slideIndex = i;
        }
        if (swiper.initialized && slideIndex !== activeIndex) {
            if (!swiper.allowSlideNext && translate < swiper.translate && translate < swiper.minTranslate()) return false;
            if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) if ((activeIndex || 0) !== slideIndex) return false;
        }
        if (slideIndex !== (previousIndex || 0) && runCallbacks) swiper.emit("beforeSlideChangeStart");
        swiper.updateProgress(translate);
        let direction;
        if (slideIndex > activeIndex) direction = "next"; else if (slideIndex < activeIndex) direction = "prev"; else direction = "reset";
        if (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate) {
            swiper.updateActiveIndex(slideIndex);
            if (params.autoHeight) swiper.updateAutoHeight();
            swiper.updateSlidesClasses();
            if ("slide" !== params.effect) swiper.setTranslate(translate);
            if ("reset" !== direction) {
                swiper.transitionStart(runCallbacks, direction);
                swiper.transitionEnd(runCallbacks, direction);
            }
            return false;
        }
        if (params.cssMode) {
            const isH = swiper.isHorizontal();
            const t = rtl ? translate : -translate;
            if (0 === speed) {
                const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
                if (isVirtual) {
                    swiper.wrapperEl.style.scrollSnapType = "none";
                    swiper._immediateVirtual = true;
                }
                wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
                if (isVirtual) requestAnimationFrame((() => {
                    swiper.wrapperEl.style.scrollSnapType = "";
                    swiper._swiperImmediateVirtual = false;
                }));
            } else {
                if (!swiper.support.smoothScroll) {
                    animateCSSModeScroll({
                        swiper,
                        targetPosition: t,
                        side: isH ? "left" : "top"
                    });
                    return true;
                }
                wrapperEl.scrollTo({
                    [isH ? "left" : "top"]: t,
                    behavior: "smooth"
                });
            }
            return true;
        }
        swiper.setTransition(speed);
        swiper.setTranslate(translate);
        swiper.updateActiveIndex(slideIndex);
        swiper.updateSlidesClasses();
        swiper.emit("beforeTransitionStart", speed, internal);
        swiper.transitionStart(runCallbacks, direction);
        if (0 === speed) swiper.transitionEnd(runCallbacks, direction); else if (!swiper.animating) {
            swiper.animating = true;
            if (!swiper.onSlideToWrapperTransitionEnd) swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
                if (!swiper || swiper.destroyed) return;
                if (e.target !== this) return;
                swiper.$wrapperEl[0].removeEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
                swiper.$wrapperEl[0].removeEventListener("webkitTransitionEnd", swiper.onSlideToWrapperTransitionEnd);
                swiper.onSlideToWrapperTransitionEnd = null;
                delete swiper.onSlideToWrapperTransitionEnd;
                swiper.transitionEnd(runCallbacks, direction);
            };
            swiper.$wrapperEl[0].addEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
            swiper.$wrapperEl[0].addEventListener("webkitTransitionEnd", swiper.onSlideToWrapperTransitionEnd);
        }
        return true;
    }
    function slideToLoop(index = 0, speed = this.params.speed, runCallbacks = true, internal) {
        if ("string" === typeof index) {
            const indexAsNumber = parseInt(index, 10);
            const isValidNumber = isFinite(indexAsNumber);
            if (!isValidNumber) throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index}] given.`);
            index = indexAsNumber;
        }
        const swiper = this;
        let newIndex = index;
        if (swiper.params.loop) newIndex += swiper.loopedSlides;
        return swiper.slideTo(newIndex, speed, runCallbacks, internal);
    }
    function slideNext(speed = this.params.speed, runCallbacks = true, internal) {
        const swiper = this;
        const {animating, enabled, params} = swiper;
        if (!enabled) return swiper;
        let perGroup = params.slidesPerGroup;
        if ("auto" === params.slidesPerView && 1 === params.slidesPerGroup && params.slidesPerGroupAuto) perGroup = Math.max(swiper.slidesPerViewDynamic("current", true), 1);
        const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
        if (params.loop) {
            if (animating && params.loopPreventsSlide) return false;
            swiper.loopFix();
            swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
        }
        if (params.rewind && swiper.isEnd) return swiper.slideTo(0, speed, runCallbacks, internal);
        return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
    }
    function slidePrev(speed = this.params.speed, runCallbacks = true, internal) {
        const swiper = this;
        const {params, animating, snapGrid, slidesGrid, rtlTranslate, enabled} = swiper;
        if (!enabled) return swiper;
        if (params.loop) {
            if (animating && params.loopPreventsSlide) return false;
            swiper.loopFix();
            swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
        }
        const translate = rtlTranslate ? swiper.translate : -swiper.translate;
        function normalize(val) {
            if (val < 0) return -Math.floor(Math.abs(val));
            return Math.floor(val);
        }
        const normalizedTranslate = normalize(translate);
        const normalizedSnapGrid = snapGrid.map((val => normalize(val)));
        let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
        if ("undefined" === typeof prevSnap && params.cssMode) {
            let prevSnapIndex;
            snapGrid.forEach(((snap, snapIndex) => {
                if (normalizedTranslate >= snap) prevSnapIndex = snapIndex;
            }));
            if ("undefined" !== typeof prevSnapIndex) prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
        }
        let prevIndex = 0;
        if ("undefined" !== typeof prevSnap) {
            prevIndex = slidesGrid.indexOf(prevSnap);
            if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;
            if ("auto" === params.slidesPerView && 1 === params.slidesPerGroup && params.slidesPerGroupAuto) {
                prevIndex = prevIndex - swiper.slidesPerViewDynamic("previous", true) + 1;
                prevIndex = Math.max(prevIndex, 0);
            }
        }
        if (params.rewind && swiper.isBeginning) {
            const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
            return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
        }
        return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
    }
    function slideReset(speed = this.params.speed, runCallbacks = true, internal) {
        const swiper = this;
        return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
    }
    function slideToClosest(speed = this.params.speed, runCallbacks = true, internal, threshold = .5) {
        const swiper = this;
        let index = swiper.activeIndex;
        const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
        const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
        const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
        if (translate >= swiper.snapGrid[snapIndex]) {
            const currentSnap = swiper.snapGrid[snapIndex];
            const nextSnap = swiper.snapGrid[snapIndex + 1];
            if (translate - currentSnap > (nextSnap - currentSnap) * threshold) index += swiper.params.slidesPerGroup;
        } else {
            const prevSnap = swiper.snapGrid[snapIndex - 1];
            const currentSnap = swiper.snapGrid[snapIndex];
            if (translate - prevSnap <= (currentSnap - prevSnap) * threshold) index -= swiper.params.slidesPerGroup;
        }
        index = Math.max(index, 0);
        index = Math.min(index, swiper.slidesGrid.length - 1);
        return swiper.slideTo(index, speed, runCallbacks, internal);
    }
    function slideToClickedSlide() {
        const swiper = this;
        const {params, $wrapperEl} = swiper;
        const slidesPerView = "auto" === params.slidesPerView ? swiper.slidesPerViewDynamic() : params.slidesPerView;
        let slideToIndex = swiper.clickedIndex;
        let realIndex;
        if (params.loop) {
            if (swiper.animating) return;
            realIndex = parseInt(dom(swiper.clickedSlide).attr("data-swiper-slide-index"), 10);
            if (params.centeredSlides) if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
                swiper.loopFix();
                slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
                utils_nextTick((() => {
                    swiper.slideTo(slideToIndex);
                }));
            } else swiper.slideTo(slideToIndex); else if (slideToIndex > swiper.slides.length - slidesPerView) {
                swiper.loopFix();
                slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
                utils_nextTick((() => {
                    swiper.slideTo(slideToIndex);
                }));
            } else swiper.slideTo(slideToIndex);
        } else swiper.slideTo(slideToIndex);
    }
    const slide = {
        slideTo,
        slideToLoop,
        slideNext,
        slidePrev,
        slideReset,
        slideToClosest,
        slideToClickedSlide
    };
    function loopCreate() {
        const swiper = this;
        const document = ssr_window_esm_getDocument();
        const {params, $wrapperEl} = swiper;
        const $selector = $wrapperEl.children().length > 0 ? dom($wrapperEl.children()[0].parentNode) : $wrapperEl;
        $selector.children(`.${params.slideClass}.${params.slideDuplicateClass}`).remove();
        let slides = $selector.children(`.${params.slideClass}`);
        if (params.loopFillGroupWithBlank) {
            const blankSlidesNum = params.slidesPerGroup - slides.length % params.slidesPerGroup;
            if (blankSlidesNum !== params.slidesPerGroup) {
                for (let i = 0; i < blankSlidesNum; i += 1) {
                    const blankNode = dom(document.createElement("div")).addClass(`${params.slideClass} ${params.slideBlankClass}`);
                    $selector.append(blankNode);
                }
                slides = $selector.children(`.${params.slideClass}`);
            }
        }
        if ("auto" === params.slidesPerView && !params.loopedSlides) params.loopedSlides = slides.length;
        swiper.loopedSlides = Math.ceil(parseFloat(params.loopedSlides || params.slidesPerView, 10));
        swiper.loopedSlides += params.loopAdditionalSlides;
        if (swiper.loopedSlides > slides.length && swiper.params.loopedSlidesLimit) swiper.loopedSlides = slides.length;
        const prependSlides = [];
        const appendSlides = [];
        slides.each(((el, index) => {
            const slide = dom(el);
            slide.attr("data-swiper-slide-index", index);
        }));
        for (let i = 0; i < swiper.loopedSlides; i += 1) {
            const index = i - Math.floor(i / slides.length) * slides.length;
            appendSlides.push(slides.eq(index)[0]);
            prependSlides.unshift(slides.eq(slides.length - index - 1)[0]);
        }
        for (let i = 0; i < appendSlides.length; i += 1) $selector.append(dom(appendSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
        for (let i = prependSlides.length - 1; i >= 0; i -= 1) $selector.prepend(dom(prependSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
    }
    function loopFix() {
        const swiper = this;
        swiper.emit("beforeLoopFix");
        const {activeIndex, slides, loopedSlides, allowSlidePrev, allowSlideNext, snapGrid, rtlTranslate: rtl} = swiper;
        let newIndex;
        swiper.allowSlidePrev = true;
        swiper.allowSlideNext = true;
        const snapTranslate = -snapGrid[activeIndex];
        const diff = snapTranslate - swiper.getTranslate();
        if (activeIndex < loopedSlides) {
            newIndex = slides.length - 3 * loopedSlides + activeIndex;
            newIndex += loopedSlides;
            const slideChanged = swiper.slideTo(newIndex, 0, false, true);
            if (slideChanged && 0 !== diff) swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
        } else if (activeIndex >= slides.length - loopedSlides) {
            newIndex = -slides.length + activeIndex + loopedSlides;
            newIndex += loopedSlides;
            const slideChanged = swiper.slideTo(newIndex, 0, false, true);
            if (slideChanged && 0 !== diff) swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
        }
        swiper.allowSlidePrev = allowSlidePrev;
        swiper.allowSlideNext = allowSlideNext;
        swiper.emit("loopFix");
    }
    function loopDestroy() {
        const swiper = this;
        const {$wrapperEl, params, slides} = swiper;
        $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass},.${params.slideClass}.${params.slideBlankClass}`).remove();
        slides.removeAttr("data-swiper-slide-index");
    }
    const loop = {
        loopCreate,
        loopFix,
        loopDestroy
    };
    function setGrabCursor(moving) {
        const swiper = this;
        if (swiper.support.touch || !swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
        const el = "container" === swiper.params.touchEventsTarget ? swiper.el : swiper.wrapperEl;
        el.style.cursor = "move";
        el.style.cursor = moving ? "grabbing" : "grab";
    }
    function unsetGrabCursor() {
        const swiper = this;
        if (swiper.support.touch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
        swiper["container" === swiper.params.touchEventsTarget ? "el" : "wrapperEl"].style.cursor = "";
    }
    const grab_cursor = {
        setGrabCursor,
        unsetGrabCursor
    };
    function closestElement(selector, base = this) {
        function __closestFrom(el) {
            if (!el || el === ssr_window_esm_getDocument() || el === ssr_window_esm_getWindow()) return null;
            if (el.assignedSlot) el = el.assignedSlot;
            const found = el.closest(selector);
            if (!found && !el.getRootNode) return null;
            return found || __closestFrom(el.getRootNode().host);
        }
        return __closestFrom(base);
    }
    function onTouchStart(event) {
        const swiper = this;
        const document = ssr_window_esm_getDocument();
        const window = ssr_window_esm_getWindow();
        const data = swiper.touchEventsData;
        const {params, touches, enabled} = swiper;
        if (!enabled) return;
        if (swiper.animating && params.preventInteractionOnTransition) return;
        if (!swiper.animating && params.cssMode && params.loop) swiper.loopFix();
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        let $targetEl = dom(e.target);
        if ("wrapper" === params.touchEventsTarget) if (!$targetEl.closest(swiper.wrapperEl).length) return;
        data.isTouchEvent = "touchstart" === e.type;
        if (!data.isTouchEvent && "which" in e && 3 === e.which) return;
        if (!data.isTouchEvent && "button" in e && e.button > 0) return;
        if (data.isTouched && data.isMoved) return;
        const swipingClassHasValue = !!params.noSwipingClass && "" !== params.noSwipingClass;
        const eventPath = event.composedPath ? event.composedPath() : event.path;
        if (swipingClassHasValue && e.target && e.target.shadowRoot && eventPath) $targetEl = dom(eventPath[0]);
        const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
        const isTargetShadow = !!(e.target && e.target.shadowRoot);
        if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, $targetEl[0]) : $targetEl.closest(noSwipingSelector)[0])) {
            swiper.allowClick = true;
            return;
        }
        if (params.swipeHandler) if (!$targetEl.closest(params.swipeHandler)[0]) return;
        touches.currentX = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX;
        touches.currentY = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY;
        const startX = touches.currentX;
        const startY = touches.currentY;
        const edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
        const edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;
        if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold)) if ("prevent" === edgeSwipeDetection) event.preventDefault(); else return;
        Object.assign(data, {
            isTouched: true,
            isMoved: false,
            allowTouchCallbacks: true,
            isScrolling: void 0,
            startMoving: void 0
        });
        touches.startX = startX;
        touches.startY = startY;
        data.touchStartTime = utils_now();
        swiper.allowClick = true;
        swiper.updateSize();
        swiper.swipeDirection = void 0;
        if (params.threshold > 0) data.allowThresholdMove = false;
        if ("touchstart" !== e.type) {
            let preventDefault = true;
            if ($targetEl.is(data.focusableElements)) {
                preventDefault = false;
                if ("SELECT" === $targetEl[0].nodeName) data.isTouched = false;
            }
            if (document.activeElement && dom(document.activeElement).is(data.focusableElements) && document.activeElement !== $targetEl[0]) document.activeElement.blur();
            const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
            if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !$targetEl[0].isContentEditable) e.preventDefault();
        }
        if (swiper.params.freeMode && swiper.params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) swiper.freeMode.onTouchStart();
        swiper.emit("touchStart", e);
    }
    function onTouchMove(event) {
        const document = ssr_window_esm_getDocument();
        const swiper = this;
        const data = swiper.touchEventsData;
        const {params, touches, rtlTranslate: rtl, enabled} = swiper;
        if (!enabled) return;
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        if (!data.isTouched) {
            if (data.startMoving && data.isScrolling) swiper.emit("touchMoveOpposite", e);
            return;
        }
        if (data.isTouchEvent && "touchmove" !== e.type) return;
        const targetTouch = "touchmove" === e.type && e.targetTouches && (e.targetTouches[0] || e.changedTouches[0]);
        const pageX = "touchmove" === e.type ? targetTouch.pageX : e.pageX;
        const pageY = "touchmove" === e.type ? targetTouch.pageY : e.pageY;
        if (e.preventedByNestedSwiper) {
            touches.startX = pageX;
            touches.startY = pageY;
            return;
        }
        if (!swiper.allowTouchMove) {
            if (!dom(e.target).is(data.focusableElements)) swiper.allowClick = false;
            if (data.isTouched) {
                Object.assign(touches, {
                    startX: pageX,
                    startY: pageY,
                    currentX: pageX,
                    currentY: pageY
                });
                data.touchStartTime = utils_now();
            }
            return;
        }
        if (data.isTouchEvent && params.touchReleaseOnEdges && !params.loop) if (swiper.isVertical()) {
            if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
                data.isTouched = false;
                data.isMoved = false;
                return;
            }
        } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) return;
        if (data.isTouchEvent && document.activeElement) if (e.target === document.activeElement && dom(e.target).is(data.focusableElements)) {
            data.isMoved = true;
            swiper.allowClick = false;
            return;
        }
        if (data.allowTouchCallbacks) swiper.emit("touchMove", e);
        if (e.targetTouches && e.targetTouches.length > 1) return;
        touches.currentX = pageX;
        touches.currentY = pageY;
        const diffX = touches.currentX - touches.startX;
        const diffY = touches.currentY - touches.startY;
        if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;
        if ("undefined" === typeof data.isScrolling) {
            let touchAngle;
            if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) data.isScrolling = false; else if (diffX * diffX + diffY * diffY >= 25) {
                touchAngle = 180 * Math.atan2(Math.abs(diffY), Math.abs(diffX)) / Math.PI;
                data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
            }
        }
        if (data.isScrolling) swiper.emit("touchMoveOpposite", e);
        if ("undefined" === typeof data.startMoving) if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) data.startMoving = true;
        if (data.isScrolling) {
            data.isTouched = false;
            return;
        }
        if (!data.startMoving) return;
        swiper.allowClick = false;
        if (!params.cssMode && e.cancelable) e.preventDefault();
        if (params.touchMoveStopPropagation && !params.nested) e.stopPropagation();
        if (!data.isMoved) {
            if (params.loop && !params.cssMode) swiper.loopFix();
            data.startTranslate = swiper.getTranslate();
            swiper.setTransition(0);
            if (swiper.animating) swiper.$wrapperEl.trigger("webkitTransitionEnd transitionend");
            data.allowMomentumBounce = false;
            if (params.grabCursor && (true === swiper.allowSlideNext || true === swiper.allowSlidePrev)) swiper.setGrabCursor(true);
            swiper.emit("sliderFirstMove", e);
        }
        swiper.emit("sliderMove", e);
        data.isMoved = true;
        let diff = swiper.isHorizontal() ? diffX : diffY;
        touches.diff = diff;
        diff *= params.touchRatio;
        if (rtl) diff = -diff;
        swiper.swipeDirection = diff > 0 ? "prev" : "next";
        data.currentTranslate = diff + data.startTranslate;
        let disableParentSwiper = true;
        let resistanceRatio = params.resistanceRatio;
        if (params.touchReleaseOnEdges) resistanceRatio = 0;
        if (diff > 0 && data.currentTranslate > swiper.minTranslate()) {
            disableParentSwiper = false;
            if (params.resistance) data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
        } else if (diff < 0 && data.currentTranslate < swiper.maxTranslate()) {
            disableParentSwiper = false;
            if (params.resistance) data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
        }
        if (disableParentSwiper) e.preventedByNestedSwiper = true;
        if (!swiper.allowSlideNext && "next" === swiper.swipeDirection && data.currentTranslate < data.startTranslate) data.currentTranslate = data.startTranslate;
        if (!swiper.allowSlidePrev && "prev" === swiper.swipeDirection && data.currentTranslate > data.startTranslate) data.currentTranslate = data.startTranslate;
        if (!swiper.allowSlidePrev && !swiper.allowSlideNext) data.currentTranslate = data.startTranslate;
        if (params.threshold > 0) if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
            if (!data.allowThresholdMove) {
                data.allowThresholdMove = true;
                touches.startX = touches.currentX;
                touches.startY = touches.currentY;
                data.currentTranslate = data.startTranslate;
                touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
                return;
            }
        } else {
            data.currentTranslate = data.startTranslate;
            return;
        }
        if (!params.followFinger || params.cssMode) return;
        if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();
        }
        if (swiper.params.freeMode && params.freeMode.enabled && swiper.freeMode) swiper.freeMode.onTouchMove();
        swiper.updateProgress(data.currentTranslate);
        swiper.setTranslate(data.currentTranslate);
    }
    function onTouchEnd(event) {
        const swiper = this;
        const data = swiper.touchEventsData;
        const {params, touches, rtlTranslate: rtl, slidesGrid, enabled} = swiper;
        if (!enabled) return;
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        if (data.allowTouchCallbacks) swiper.emit("touchEnd", e);
        data.allowTouchCallbacks = false;
        if (!data.isTouched) {
            if (data.isMoved && params.grabCursor) swiper.setGrabCursor(false);
            data.isMoved = false;
            data.startMoving = false;
            return;
        }
        if (params.grabCursor && data.isMoved && data.isTouched && (true === swiper.allowSlideNext || true === swiper.allowSlidePrev)) swiper.setGrabCursor(false);
        const touchEndTime = utils_now();
        const timeDiff = touchEndTime - data.touchStartTime;
        if (swiper.allowClick) {
            const pathTree = e.path || e.composedPath && e.composedPath();
            swiper.updateClickedSlide(pathTree && pathTree[0] || e.target);
            swiper.emit("tap click", e);
            if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) swiper.emit("doubleTap doubleClick", e);
        }
        data.lastClickTime = utils_now();
        utils_nextTick((() => {
            if (!swiper.destroyed) swiper.allowClick = true;
        }));
        if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || 0 === touches.diff || data.currentTranslate === data.startTranslate) {
            data.isTouched = false;
            data.isMoved = false;
            data.startMoving = false;
            return;
        }
        data.isTouched = false;
        data.isMoved = false;
        data.startMoving = false;
        let currentPos;
        if (params.followFinger) currentPos = rtl ? swiper.translate : -swiper.translate; else currentPos = -data.currentTranslate;
        if (params.cssMode) return;
        if (swiper.params.freeMode && params.freeMode.enabled) {
            swiper.freeMode.onTouchEnd({
                currentPos
            });
            return;
        }
        let stopIndex = 0;
        let groupSize = swiper.slidesSizesGrid[0];
        for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
            const increment = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
            if ("undefined" !== typeof slidesGrid[i + increment]) {
                if (currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment]) {
                    stopIndex = i;
                    groupSize = slidesGrid[i + increment] - slidesGrid[i];
                }
            } else if (currentPos >= slidesGrid[i]) {
                stopIndex = i;
                groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
            }
        }
        let rewindFirstIndex = null;
        let rewindLastIndex = null;
        if (params.rewind) if (swiper.isBeginning) rewindLastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1; else if (swiper.isEnd) rewindFirstIndex = 0;
        const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
        const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
        if (timeDiff > params.longSwipesMs) {
            if (!params.longSwipes) {
                swiper.slideTo(swiper.activeIndex);
                return;
            }
            if ("next" === swiper.swipeDirection) if (ratio >= params.longSwipesRatio) swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment); else swiper.slideTo(stopIndex);
            if ("prev" === swiper.swipeDirection) if (ratio > 1 - params.longSwipesRatio) swiper.slideTo(stopIndex + increment); else if (null !== rewindLastIndex && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) swiper.slideTo(rewindLastIndex); else swiper.slideTo(stopIndex);
        } else {
            if (!params.shortSwipes) {
                swiper.slideTo(swiper.activeIndex);
                return;
            }
            const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);
            if (!isNavButtonTarget) {
                if ("next" === swiper.swipeDirection) swiper.slideTo(null !== rewindFirstIndex ? rewindFirstIndex : stopIndex + increment);
                if ("prev" === swiper.swipeDirection) swiper.slideTo(null !== rewindLastIndex ? rewindLastIndex : stopIndex);
            } else if (e.target === swiper.navigation.nextEl) swiper.slideTo(stopIndex + increment); else swiper.slideTo(stopIndex);
        }
    }
    function onResize() {
        const swiper = this;
        const {params, el} = swiper;
        if (el && 0 === el.offsetWidth) return;
        if (params.breakpoints) swiper.setBreakpoint();
        const {allowSlideNext, allowSlidePrev, snapGrid} = swiper;
        swiper.allowSlideNext = true;
        swiper.allowSlidePrev = true;
        swiper.updateSize();
        swiper.updateSlides();
        swiper.updateSlidesClasses();
        if (("auto" === params.slidesPerView || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides) swiper.slideTo(swiper.slides.length - 1, 0, false, true); else swiper.slideTo(swiper.activeIndex, 0, false, true);
        if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) swiper.autoplay.run();
        swiper.allowSlidePrev = allowSlidePrev;
        swiper.allowSlideNext = allowSlideNext;
        if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
    }
    function onClick(e) {
        const swiper = this;
        if (!swiper.enabled) return;
        if (!swiper.allowClick) {
            if (swiper.params.preventClicks) e.preventDefault();
            if (swiper.params.preventClicksPropagation && swiper.animating) {
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        }
    }
    function onScroll() {
        const swiper = this;
        const {wrapperEl, rtlTranslate, enabled} = swiper;
        if (!enabled) return;
        swiper.previousTranslate = swiper.translate;
        if (swiper.isHorizontal()) swiper.translate = -wrapperEl.scrollLeft; else swiper.translate = -wrapperEl.scrollTop;
        if (0 === swiper.translate) swiper.translate = 0;
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
        let newProgress;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        if (0 === translatesDiff) newProgress = 0; else newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
        if (newProgress !== swiper.progress) swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
        swiper.emit("setTranslate", swiper.translate, false);
    }
    let dummyEventAttached = false;
    function dummyEventListener() {}
    const events = (swiper, method) => {
        const document = ssr_window_esm_getDocument();
        const {params, touchEvents, el, wrapperEl, device, support} = swiper;
        const capture = !!params.nested;
        const domMethod = "on" === method ? "addEventListener" : "removeEventListener";
        const swiperMethod = method;
        if (!support.touch) {
            el[domMethod](touchEvents.start, swiper.onTouchStart, false);
            document[domMethod](touchEvents.move, swiper.onTouchMove, capture);
            document[domMethod](touchEvents.end, swiper.onTouchEnd, false);
        } else {
            const passiveListener = "touchstart" === touchEvents.start && support.passiveListener && params.passiveListeners ? {
                passive: true,
                capture: false
            } : false;
            el[domMethod](touchEvents.start, swiper.onTouchStart, passiveListener);
            el[domMethod](touchEvents.move, swiper.onTouchMove, support.passiveListener ? {
                passive: false,
                capture
            } : capture);
            el[domMethod](touchEvents.end, swiper.onTouchEnd, passiveListener);
            if (touchEvents.cancel) el[domMethod](touchEvents.cancel, swiper.onTouchEnd, passiveListener);
        }
        if (params.preventClicks || params.preventClicksPropagation) el[domMethod]("click", swiper.onClick, true);
        if (params.cssMode) wrapperEl[domMethod]("scroll", swiper.onScroll);
        if (params.updateOnWindowResize) swiper[swiperMethod](device.ios || device.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize, true); else swiper[swiperMethod]("observerUpdate", onResize, true);
    };
    function attachEvents() {
        const swiper = this;
        const document = ssr_window_esm_getDocument();
        const {params, support} = swiper;
        swiper.onTouchStart = onTouchStart.bind(swiper);
        swiper.onTouchMove = onTouchMove.bind(swiper);
        swiper.onTouchEnd = onTouchEnd.bind(swiper);
        if (params.cssMode) swiper.onScroll = onScroll.bind(swiper);
        swiper.onClick = onClick.bind(swiper);
        if (support.touch && !dummyEventAttached) {
            document.addEventListener("touchstart", dummyEventListener);
            dummyEventAttached = true;
        }
        events(swiper, "on");
    }
    function detachEvents() {
        const swiper = this;
        events(swiper, "off");
    }
    const core_events = {
        attachEvents,
        detachEvents
    };
    const isGridEnabled = (swiper, params) => swiper.grid && params.grid && params.grid.rows > 1;
    function setBreakpoint() {
        const swiper = this;
        const {activeIndex, initialized, loopedSlides = 0, params, $el} = swiper;
        const breakpoints = params.breakpoints;
        if (!breakpoints || breakpoints && 0 === Object.keys(breakpoints).length) return;
        const breakpoint = swiper.getBreakpoint(breakpoints, swiper.params.breakpointsBase, swiper.el);
        if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
        const breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : void 0;
        const breakpointParams = breakpointOnlyParams || swiper.originalParams;
        const wasMultiRow = isGridEnabled(swiper, params);
        const isMultiRow = isGridEnabled(swiper, breakpointParams);
        const wasEnabled = params.enabled;
        if (wasMultiRow && !isMultiRow) {
            $el.removeClass(`${params.containerModifierClass}grid ${params.containerModifierClass}grid-column`);
            swiper.emitContainerClasses();
        } else if (!wasMultiRow && isMultiRow) {
            $el.addClass(`${params.containerModifierClass}grid`);
            if (breakpointParams.grid.fill && "column" === breakpointParams.grid.fill || !breakpointParams.grid.fill && "column" === params.grid.fill) $el.addClass(`${params.containerModifierClass}grid-column`);
            swiper.emitContainerClasses();
        }
        [ "navigation", "pagination", "scrollbar" ].forEach((prop => {
            const wasModuleEnabled = params[prop] && params[prop].enabled;
            const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;
            if (wasModuleEnabled && !isModuleEnabled) swiper[prop].disable();
            if (!wasModuleEnabled && isModuleEnabled) swiper[prop].enable();
        }));
        const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
        const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
        if (directionChanged && initialized) swiper.changeDirection();
        utils_extend(swiper.params, breakpointParams);
        const isEnabled = swiper.params.enabled;
        Object.assign(swiper, {
            allowTouchMove: swiper.params.allowTouchMove,
            allowSlideNext: swiper.params.allowSlideNext,
            allowSlidePrev: swiper.params.allowSlidePrev
        });
        if (wasEnabled && !isEnabled) swiper.disable(); else if (!wasEnabled && isEnabled) swiper.enable();
        swiper.currentBreakpoint = breakpoint;
        swiper.emit("_beforeBreakpoint", breakpointParams);
        if (needsReLoop && initialized) {
            swiper.loopDestroy();
            swiper.loopCreate();
            swiper.updateSlides();
            swiper.slideTo(activeIndex - loopedSlides + swiper.loopedSlides, 0, false);
        }
        swiper.emit("breakpoint", breakpointParams);
    }
    function getBreakpoint(breakpoints, base = "window", containerEl) {
        if (!breakpoints || "container" === base && !containerEl) return;
        let breakpoint = false;
        const window = ssr_window_esm_getWindow();
        const currentHeight = "window" === base ? window.innerHeight : containerEl.clientHeight;
        const points = Object.keys(breakpoints).map((point => {
            if ("string" === typeof point && 0 === point.indexOf("@")) {
                const minRatio = parseFloat(point.substr(1));
                const value = currentHeight * minRatio;
                return {
                    value,
                    point
                };
            }
            return {
                value: point,
                point
            };
        }));
        points.sort(((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10)));
        for (let i = 0; i < points.length; i += 1) {
            const {point, value} = points[i];
            if ("window" === base) {
                if (window.matchMedia(`(min-width: ${value}px)`).matches) breakpoint = point;
            } else if (value <= containerEl.clientWidth) breakpoint = point;
        }
        return breakpoint || "max";
    }
    const breakpoints = {
        setBreakpoint,
        getBreakpoint
    };
    function prepareClasses(entries, prefix) {
        const resultClasses = [];
        entries.forEach((item => {
            if ("object" === typeof item) Object.keys(item).forEach((classNames => {
                if (item[classNames]) resultClasses.push(prefix + classNames);
            })); else if ("string" === typeof item) resultClasses.push(prefix + item);
        }));
        return resultClasses;
    }
    function addClasses() {
        const swiper = this;
        const {classNames, params, rtl, $el, device, support} = swiper;
        const suffixes = prepareClasses([ "initialized", params.direction, {
            "pointer-events": !support.touch
        }, {
            "free-mode": swiper.params.freeMode && params.freeMode.enabled
        }, {
            autoheight: params.autoHeight
        }, {
            rtl
        }, {
            grid: params.grid && params.grid.rows > 1
        }, {
            "grid-column": params.grid && params.grid.rows > 1 && "column" === params.grid.fill
        }, {
            android: device.android
        }, {
            ios: device.ios
        }, {
            "css-mode": params.cssMode
        }, {
            centered: params.cssMode && params.centeredSlides
        }, {
            "watch-progress": params.watchSlidesProgress
        } ], params.containerModifierClass);
        classNames.push(...suffixes);
        $el.addClass([ ...classNames ].join(" "));
        swiper.emitContainerClasses();
    }
    function removeClasses_removeClasses() {
        const swiper = this;
        const {$el, classNames} = swiper;
        $el.removeClass(classNames.join(" "));
        swiper.emitContainerClasses();
    }
    const classes = {
        addClasses,
        removeClasses: removeClasses_removeClasses
    };
    function loadImage(imageEl, src, srcset, sizes, checkForComplete, callback) {
        const window = ssr_window_esm_getWindow();
        let image;
        function onReady() {
            if (callback) callback();
        }
        const isPicture = dom(imageEl).parent("picture")[0];
        if (!isPicture && (!imageEl.complete || !checkForComplete)) if (src) {
            image = new window.Image;
            image.onload = onReady;
            image.onerror = onReady;
            if (sizes) image.sizes = sizes;
            if (srcset) image.srcset = srcset;
            if (src) image.src = src;
        } else onReady(); else onReady();
    }
    function preloadImages() {
        const swiper = this;
        swiper.imagesToLoad = swiper.$el.find("img");
        function onReady() {
            if ("undefined" === typeof swiper || null === swiper || !swiper || swiper.destroyed) return;
            if (void 0 !== swiper.imagesLoaded) swiper.imagesLoaded += 1;
            if (swiper.imagesLoaded === swiper.imagesToLoad.length) {
                if (swiper.params.updateOnImagesReady) swiper.update();
                swiper.emit("imagesReady");
            }
        }
        for (let i = 0; i < swiper.imagesToLoad.length; i += 1) {
            const imageEl = swiper.imagesToLoad[i];
            swiper.loadImage(imageEl, imageEl.currentSrc || imageEl.getAttribute("src"), imageEl.srcset || imageEl.getAttribute("srcset"), imageEl.sizes || imageEl.getAttribute("sizes"), true, onReady);
        }
    }
    const core_images = {
        loadImage,
        preloadImages
    };
    function checkOverflow() {
        const swiper = this;
        const {isLocked: wasLocked, params} = swiper;
        const {slidesOffsetBefore} = params;
        if (slidesOffsetBefore) {
            const lastSlideIndex = swiper.slides.length - 1;
            const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + 2 * slidesOffsetBefore;
            swiper.isLocked = swiper.size > lastSlideRightEdge;
        } else swiper.isLocked = 1 === swiper.snapGrid.length;
        if (true === params.allowSlideNext) swiper.allowSlideNext = !swiper.isLocked;
        if (true === params.allowSlidePrev) swiper.allowSlidePrev = !swiper.isLocked;
        if (wasLocked && wasLocked !== swiper.isLocked) swiper.isEnd = false;
        if (wasLocked !== swiper.isLocked) swiper.emit(swiper.isLocked ? "lock" : "unlock");
    }
    const check_overflow = {
        checkOverflow
    };
    const defaults = {
        init: true,
        direction: "horizontal",
        touchEventsTarget: "wrapper",
        initialSlide: 0,
        speed: 300,
        cssMode: false,
        updateOnWindowResize: true,
        resizeObserver: true,
        nested: false,
        createElements: false,
        enabled: true,
        focusableElements: "input, select, option, textarea, button, video, label",
        width: null,
        height: null,
        preventInteractionOnTransition: false,
        userAgent: null,
        url: null,
        edgeSwipeDetection: false,
        edgeSwipeThreshold: 20,
        autoHeight: false,
        setWrapperSize: false,
        virtualTranslate: false,
        effect: "slide",
        breakpoints: void 0,
        breakpointsBase: "window",
        spaceBetween: 0,
        slidesPerView: 1,
        slidesPerGroup: 1,
        slidesPerGroupSkip: 0,
        slidesPerGroupAuto: false,
        centeredSlides: false,
        centeredSlidesBounds: false,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        normalizeSlideIndex: true,
        centerInsufficientSlides: false,
        watchOverflow: true,
        roundLengths: false,
        touchRatio: 1,
        touchAngle: 45,
        simulateTouch: true,
        shortSwipes: true,
        longSwipes: true,
        longSwipesRatio: .5,
        longSwipesMs: 300,
        followFinger: true,
        allowTouchMove: true,
        threshold: 0,
        touchMoveStopPropagation: false,
        touchStartPreventDefault: true,
        touchStartForcePreventDefault: false,
        touchReleaseOnEdges: false,
        uniqueNavElements: true,
        resistance: true,
        resistanceRatio: .85,
        watchSlidesProgress: false,
        grabCursor: false,
        preventClicks: true,
        preventClicksPropagation: true,
        slideToClickedSlide: false,
        preloadImages: true,
        updateOnImagesReady: true,
        loop: false,
        loopAdditionalSlides: 0,
        loopedSlides: null,
        loopedSlidesLimit: true,
        loopFillGroupWithBlank: false,
        loopPreventsSlide: true,
        rewind: false,
        allowSlidePrev: true,
        allowSlideNext: true,
        swipeHandler: null,
        noSwiping: true,
        noSwipingClass: "swiper-no-swiping",
        noSwipingSelector: null,
        passiveListeners: true,
        maxBackfaceHiddenSlides: 10,
        containerModifierClass: "swiper-",
        slideClass: "swiper-slide",
        slideBlankClass: "swiper-slide-invisible-blank",
        slideActiveClass: "swiper-slide-active",
        slideDuplicateActiveClass: "swiper-slide-duplicate-active",
        slideVisibleClass: "swiper-slide-visible",
        slideDuplicateClass: "swiper-slide-duplicate",
        slideNextClass: "swiper-slide-next",
        slideDuplicateNextClass: "swiper-slide-duplicate-next",
        slidePrevClass: "swiper-slide-prev",
        slideDuplicatePrevClass: "swiper-slide-duplicate-prev",
        wrapperClass: "swiper-wrapper",
        runCallbacksOnInit: true,
        _emitClasses: false
    };
    function moduleExtendParams(params, allModulesParams) {
        return function extendParams(obj = {}) {
            const moduleParamName = Object.keys(obj)[0];
            const moduleParams = obj[moduleParamName];
            if ("object" !== typeof moduleParams || null === moduleParams) {
                utils_extend(allModulesParams, obj);
                return;
            }
            if ([ "navigation", "pagination", "scrollbar" ].indexOf(moduleParamName) >= 0 && true === params[moduleParamName]) params[moduleParamName] = {
                auto: true
            };
            if (!(moduleParamName in params && "enabled" in moduleParams)) {
                utils_extend(allModulesParams, obj);
                return;
            }
            if (true === params[moduleParamName]) params[moduleParamName] = {
                enabled: true
            };
            if ("object" === typeof params[moduleParamName] && !("enabled" in params[moduleParamName])) params[moduleParamName].enabled = true;
            if (!params[moduleParamName]) params[moduleParamName] = {
                enabled: false
            };
            utils_extend(allModulesParams, obj);
        };
    }
    const prototypes = {
        eventsEmitter: events_emitter,
        update,
        translate,
        transition: core_transition,
        slide,
        loop,
        grabCursor: grab_cursor,
        events: core_events,
        breakpoints,
        checkOverflow: check_overflow,
        classes,
        images: core_images
    };
    const extendedDefaults = {};
    class core_Swiper {
        constructor(...args) {
            let el;
            let params;
            if (1 === args.length && args[0].constructor && "Object" === Object.prototype.toString.call(args[0]).slice(8, -1)) params = args[0]; else [el, params] = args;
            if (!params) params = {};
            params = utils_extend({}, params);
            if (el && !params.el) params.el = el;
            if (params.el && dom(params.el).length > 1) {
                const swipers = [];
                dom(params.el).each((containerEl => {
                    const newParams = utils_extend({}, params, {
                        el: containerEl
                    });
                    swipers.push(new core_Swiper(newParams));
                }));
                return swipers;
            }
            const swiper = this;
            swiper.__swiper__ = true;
            swiper.support = getSupport();
            swiper.device = getDevice({
                userAgent: params.userAgent
            });
            swiper.browser = getBrowser();
            swiper.eventsListeners = {};
            swiper.eventsAnyListeners = [];
            swiper.modules = [ ...swiper.__modules__ ];
            if (params.modules && Array.isArray(params.modules)) swiper.modules.push(...params.modules);
            const allModulesParams = {};
            swiper.modules.forEach((mod => {
                mod({
                    swiper,
                    extendParams: moduleExtendParams(params, allModulesParams),
                    on: swiper.on.bind(swiper),
                    once: swiper.once.bind(swiper),
                    off: swiper.off.bind(swiper),
                    emit: swiper.emit.bind(swiper)
                });
            }));
            const swiperParams = utils_extend({}, defaults, allModulesParams);
            swiper.params = utils_extend({}, swiperParams, extendedDefaults, params);
            swiper.originalParams = utils_extend({}, swiper.params);
            swiper.passedParams = utils_extend({}, params);
            if (swiper.params && swiper.params.on) Object.keys(swiper.params.on).forEach((eventName => {
                swiper.on(eventName, swiper.params.on[eventName]);
            }));
            if (swiper.params && swiper.params.onAny) swiper.onAny(swiper.params.onAny);
            swiper.$ = dom;
            Object.assign(swiper, {
                enabled: swiper.params.enabled,
                el,
                classNames: [],
                slides: dom(),
                slidesGrid: [],
                snapGrid: [],
                slidesSizesGrid: [],
                isHorizontal() {
                    return "horizontal" === swiper.params.direction;
                },
                isVertical() {
                    return "vertical" === swiper.params.direction;
                },
                activeIndex: 0,
                realIndex: 0,
                isBeginning: true,
                isEnd: false,
                translate: 0,
                previousTranslate: 0,
                progress: 0,
                velocity: 0,
                animating: false,
                allowSlideNext: swiper.params.allowSlideNext,
                allowSlidePrev: swiper.params.allowSlidePrev,
                touchEvents: function touchEvents() {
                    const touch = [ "touchstart", "touchmove", "touchend", "touchcancel" ];
                    const desktop = [ "pointerdown", "pointermove", "pointerup" ];
                    swiper.touchEventsTouch = {
                        start: touch[0],
                        move: touch[1],
                        end: touch[2],
                        cancel: touch[3]
                    };
                    swiper.touchEventsDesktop = {
                        start: desktop[0],
                        move: desktop[1],
                        end: desktop[2]
                    };
                    return swiper.support.touch || !swiper.params.simulateTouch ? swiper.touchEventsTouch : swiper.touchEventsDesktop;
                }(),
                touchEventsData: {
                    isTouched: void 0,
                    isMoved: void 0,
                    allowTouchCallbacks: void 0,
                    touchStartTime: void 0,
                    isScrolling: void 0,
                    currentTranslate: void 0,
                    startTranslate: void 0,
                    allowThresholdMove: void 0,
                    focusableElements: swiper.params.focusableElements,
                    lastClickTime: utils_now(),
                    clickTimeout: void 0,
                    velocities: [],
                    allowMomentumBounce: void 0,
                    isTouchEvent: void 0,
                    startMoving: void 0
                },
                allowClick: true,
                allowTouchMove: swiper.params.allowTouchMove,
                touches: {
                    startX: 0,
                    startY: 0,
                    currentX: 0,
                    currentY: 0,
                    diff: 0
                },
                imagesToLoad: [],
                imagesLoaded: 0
            });
            swiper.emit("_swiper");
            if (swiper.params.init) swiper.init();
            return swiper;
        }
        enable() {
            const swiper = this;
            if (swiper.enabled) return;
            swiper.enabled = true;
            if (swiper.params.grabCursor) swiper.setGrabCursor();
            swiper.emit("enable");
        }
        disable() {
            const swiper = this;
            if (!swiper.enabled) return;
            swiper.enabled = false;
            if (swiper.params.grabCursor) swiper.unsetGrabCursor();
            swiper.emit("disable");
        }
        setProgress(progress, speed) {
            const swiper = this;
            progress = Math.min(Math.max(progress, 0), 1);
            const min = swiper.minTranslate();
            const max = swiper.maxTranslate();
            const current = (max - min) * progress + min;
            swiper.translateTo(current, "undefined" === typeof speed ? 0 : speed);
            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();
        }
        emitContainerClasses() {
            const swiper = this;
            if (!swiper.params._emitClasses || !swiper.el) return;
            const cls = swiper.el.className.split(" ").filter((className => 0 === className.indexOf("swiper") || 0 === className.indexOf(swiper.params.containerModifierClass)));
            swiper.emit("_containerClasses", cls.join(" "));
        }
        getSlideClasses(slideEl) {
            const swiper = this;
            if (swiper.destroyed) return "";
            return slideEl.className.split(" ").filter((className => 0 === className.indexOf("swiper-slide") || 0 === className.indexOf(swiper.params.slideClass))).join(" ");
        }
        emitSlidesClasses() {
            const swiper = this;
            if (!swiper.params._emitClasses || !swiper.el) return;
            const updates = [];
            swiper.slides.each((slideEl => {
                const classNames = swiper.getSlideClasses(slideEl);
                updates.push({
                    slideEl,
                    classNames
                });
                swiper.emit("_slideClass", slideEl, classNames);
            }));
            swiper.emit("_slideClasses", updates);
        }
        slidesPerViewDynamic(view = "current", exact = false) {
            const swiper = this;
            const {params, slides, slidesGrid, slidesSizesGrid, size: swiperSize, activeIndex} = swiper;
            let spv = 1;
            if (params.centeredSlides) {
                let slideSize = slides[activeIndex].swiperSlideSize;
                let breakLoop;
                for (let i = activeIndex + 1; i < slides.length; i += 1) if (slides[i] && !breakLoop) {
                    slideSize += slides[i].swiperSlideSize;
                    spv += 1;
                    if (slideSize > swiperSize) breakLoop = true;
                }
                for (let i = activeIndex - 1; i >= 0; i -= 1) if (slides[i] && !breakLoop) {
                    slideSize += slides[i].swiperSlideSize;
                    spv += 1;
                    if (slideSize > swiperSize) breakLoop = true;
                }
            } else if ("current" === view) for (let i = activeIndex + 1; i < slides.length; i += 1) {
                const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;
                if (slideInView) spv += 1;
            } else for (let i = activeIndex - 1; i >= 0; i -= 1) {
                const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;
                if (slideInView) spv += 1;
            }
            return spv;
        }
        update() {
            const swiper = this;
            if (!swiper || swiper.destroyed) return;
            const {snapGrid, params} = swiper;
            if (params.breakpoints) swiper.setBreakpoint();
            swiper.updateSize();
            swiper.updateSlides();
            swiper.updateProgress();
            swiper.updateSlidesClasses();
            function setTranslate() {
                const translateValue = swiper.rtlTranslate ? -1 * swiper.translate : swiper.translate;
                const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
                swiper.setTranslate(newTranslate);
                swiper.updateActiveIndex();
                swiper.updateSlidesClasses();
            }
            let translated;
            if (swiper.params.freeMode && swiper.params.freeMode.enabled) {
                setTranslate();
                if (swiper.params.autoHeight) swiper.updateAutoHeight();
            } else {
                if (("auto" === swiper.params.slidesPerView || swiper.params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) translated = swiper.slideTo(swiper.slides.length - 1, 0, false, true); else translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
                if (!translated) setTranslate();
            }
            if (params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
            swiper.emit("update");
        }
        changeDirection(newDirection, needUpdate = true) {
            const swiper = this;
            const currentDirection = swiper.params.direction;
            if (!newDirection) newDirection = "horizontal" === currentDirection ? "vertical" : "horizontal";
            if (newDirection === currentDirection || "horizontal" !== newDirection && "vertical" !== newDirection) return swiper;
            swiper.$el.removeClass(`${swiper.params.containerModifierClass}${currentDirection}`).addClass(`${swiper.params.containerModifierClass}${newDirection}`);
            swiper.emitContainerClasses();
            swiper.params.direction = newDirection;
            swiper.slides.each((slideEl => {
                if ("vertical" === newDirection) slideEl.style.width = ""; else slideEl.style.height = "";
            }));
            swiper.emit("changeDirection");
            if (needUpdate) swiper.update();
            return swiper;
        }
        changeLanguageDirection(direction) {
            const swiper = this;
            if (swiper.rtl && "rtl" === direction || !swiper.rtl && "ltr" === direction) return;
            swiper.rtl = "rtl" === direction;
            swiper.rtlTranslate = "horizontal" === swiper.params.direction && swiper.rtl;
            if (swiper.rtl) {
                swiper.$el.addClass(`${swiper.params.containerModifierClass}rtl`);
                swiper.el.dir = "rtl";
            } else {
                swiper.$el.removeClass(`${swiper.params.containerModifierClass}rtl`);
                swiper.el.dir = "ltr";
            }
            swiper.update();
        }
        mount(el) {
            const swiper = this;
            if (swiper.mounted) return true;
            const $el = dom(el || swiper.params.el);
            el = $el[0];
            if (!el) return false;
            el.swiper = swiper;
            const getWrapperSelector = () => `.${(swiper.params.wrapperClass || "").trim().split(" ").join(".")}`;
            const getWrapper = () => {
                if (el && el.shadowRoot && el.shadowRoot.querySelector) {
                    const res = dom(el.shadowRoot.querySelector(getWrapperSelector()));
                    res.children = options => $el.children(options);
                    return res;
                }
                if (!$el.children) return dom($el).children(getWrapperSelector());
                return $el.children(getWrapperSelector());
            };
            let $wrapperEl = getWrapper();
            if (0 === $wrapperEl.length && swiper.params.createElements) {
                const document = ssr_window_esm_getDocument();
                const wrapper = document.createElement("div");
                $wrapperEl = dom(wrapper);
                wrapper.className = swiper.params.wrapperClass;
                $el.append(wrapper);
                $el.children(`.${swiper.params.slideClass}`).each((slideEl => {
                    $wrapperEl.append(slideEl);
                }));
            }
            Object.assign(swiper, {
                $el,
                el,
                $wrapperEl,
                wrapperEl: $wrapperEl[0],
                mounted: true,
                rtl: "rtl" === el.dir.toLowerCase() || "rtl" === $el.css("direction"),
                rtlTranslate: "horizontal" === swiper.params.direction && ("rtl" === el.dir.toLowerCase() || "rtl" === $el.css("direction")),
                wrongRTL: "-webkit-box" === $wrapperEl.css("display")
            });
            return true;
        }
        init(el) {
            const swiper = this;
            if (swiper.initialized) return swiper;
            const mounted = swiper.mount(el);
            if (false === mounted) return swiper;
            swiper.emit("beforeInit");
            if (swiper.params.breakpoints) swiper.setBreakpoint();
            swiper.addClasses();
            if (swiper.params.loop) swiper.loopCreate();
            swiper.updateSize();
            swiper.updateSlides();
            if (swiper.params.watchOverflow) swiper.checkOverflow();
            if (swiper.params.grabCursor && swiper.enabled) swiper.setGrabCursor();
            if (swiper.params.preloadImages) swiper.preloadImages();
            if (swiper.params.loop) swiper.slideTo(swiper.params.initialSlide + swiper.loopedSlides, 0, swiper.params.runCallbacksOnInit, false, true); else swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
            swiper.attachEvents();
            swiper.initialized = true;
            swiper.emit("init");
            swiper.emit("afterInit");
            return swiper;
        }
        destroy(deleteInstance = true, cleanStyles = true) {
            const swiper = this;
            const {params, $el, $wrapperEl, slides} = swiper;
            if ("undefined" === typeof swiper.params || swiper.destroyed) return null;
            swiper.emit("beforeDestroy");
            swiper.initialized = false;
            swiper.detachEvents();
            if (params.loop) swiper.loopDestroy();
            if (cleanStyles) {
                swiper.removeClasses();
                $el.removeAttr("style");
                $wrapperEl.removeAttr("style");
                if (slides && slides.length) slides.removeClass([ params.slideVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass ].join(" ")).removeAttr("style").removeAttr("data-swiper-slide-index");
            }
            swiper.emit("destroy");
            Object.keys(swiper.eventsListeners).forEach((eventName => {
                swiper.off(eventName);
            }));
            if (false !== deleteInstance) {
                swiper.$el[0].swiper = null;
                deleteProps(swiper);
            }
            swiper.destroyed = true;
            return null;
        }
        static extendDefaults(newDefaults) {
            utils_extend(extendedDefaults, newDefaults);
        }
        static get extendedDefaults() {
            return extendedDefaults;
        }
        static get defaults() {
            return defaults;
        }
        static installModule(mod) {
            if (!core_Swiper.prototype.__modules__) core_Swiper.prototype.__modules__ = [];
            const modules = core_Swiper.prototype.__modules__;
            if ("function" === typeof mod && modules.indexOf(mod) < 0) modules.push(mod);
        }
        static use(module) {
            if (Array.isArray(module)) {
                module.forEach((m => core_Swiper.installModule(m)));
                return core_Swiper;
            }
            core_Swiper.installModule(module);
            return core_Swiper;
        }
    }
    Object.keys(prototypes).forEach((prototypeGroup => {
        Object.keys(prototypes[prototypeGroup]).forEach((protoMethod => {
            core_Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
        }));
    }));
    core_Swiper.use([ Resize, Observer ]);
    const core = core_Swiper;
    function create_element_if_not_defined_createElementIfNotDefined(swiper, originalParams, params, checkProps) {
        const document = ssr_window_esm_getDocument();
        if (swiper.params.createElements) Object.keys(checkProps).forEach((key => {
            if (!params[key] && true === params.auto) {
                let element = swiper.$el.children(`.${checkProps[key]}`)[0];
                if (!element) {
                    element = document.createElement("div");
                    element.className = checkProps[key];
                    swiper.$el.append(element);
                }
                params[key] = element;
                originalParams[key] = element;
            }
        }));
        return params;
    }
    function Navigation({swiper, extendParams, on, emit}) {
        extendParams({
            navigation: {
                nextEl: null,
                prevEl: null,
                hideOnClick: false,
                disabledClass: "swiper-button-disabled",
                hiddenClass: "swiper-button-hidden",
                lockClass: "swiper-button-lock",
                navigationDisabledClass: "swiper-navigation-disabled"
            }
        });
        swiper.navigation = {
            nextEl: null,
            $nextEl: null,
            prevEl: null,
            $prevEl: null
        };
        function getEl(el) {
            let $el;
            if (el) {
                $el = dom(el);
                if (swiper.params.uniqueNavElements && "string" === typeof el && $el.length > 1 && 1 === swiper.$el.find(el).length) $el = swiper.$el.find(el);
            }
            return $el;
        }
        function toggleEl($el, disabled) {
            const params = swiper.params.navigation;
            if ($el && $el.length > 0) {
                $el[disabled ? "addClass" : "removeClass"](params.disabledClass);
                if ($el[0] && "BUTTON" === $el[0].tagName) $el[0].disabled = disabled;
                if (swiper.params.watchOverflow && swiper.enabled) $el[swiper.isLocked ? "addClass" : "removeClass"](params.lockClass);
            }
        }
        function update() {
            if (swiper.params.loop) return;
            const {$nextEl, $prevEl} = swiper.navigation;
            toggleEl($prevEl, swiper.isBeginning && !swiper.params.rewind);
            toggleEl($nextEl, swiper.isEnd && !swiper.params.rewind);
        }
        function onPrevClick(e) {
            e.preventDefault();
            if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind) return;
            swiper.slidePrev();
            emit("navigationPrev");
        }
        function onNextClick(e) {
            e.preventDefault();
            if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind) return;
            swiper.slideNext();
            emit("navigationNext");
        }
        function init() {
            const params = swiper.params.navigation;
            swiper.params.navigation = create_element_if_not_defined_createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
                nextEl: "swiper-button-next",
                prevEl: "swiper-button-prev"
            });
            if (!(params.nextEl || params.prevEl)) return;
            const $nextEl = getEl(params.nextEl);
            const $prevEl = getEl(params.prevEl);
            if ($nextEl && $nextEl.length > 0) $nextEl.on("click", onNextClick);
            if ($prevEl && $prevEl.length > 0) $prevEl.on("click", onPrevClick);
            Object.assign(swiper.navigation, {
                $nextEl,
                nextEl: $nextEl && $nextEl[0],
                $prevEl,
                prevEl: $prevEl && $prevEl[0]
            });
            if (!swiper.enabled) {
                if ($nextEl) $nextEl.addClass(params.lockClass);
                if ($prevEl) $prevEl.addClass(params.lockClass);
            }
        }
        function destroy() {
            const {$nextEl, $prevEl} = swiper.navigation;
            if ($nextEl && $nextEl.length) {
                $nextEl.off("click", onNextClick);
                $nextEl.removeClass(swiper.params.navigation.disabledClass);
            }
            if ($prevEl && $prevEl.length) {
                $prevEl.off("click", onPrevClick);
                $prevEl.removeClass(swiper.params.navigation.disabledClass);
            }
        }
        on("init", (() => {
            if (false === swiper.params.navigation.enabled) disable(); else {
                init();
                update();
            }
        }));
        on("toEdge fromEdge lock unlock", (() => {
            update();
        }));
        on("destroy", (() => {
            destroy();
        }));
        on("enable disable", (() => {
            const {$nextEl, $prevEl} = swiper.navigation;
            if ($nextEl) $nextEl[swiper.enabled ? "removeClass" : "addClass"](swiper.params.navigation.lockClass);
            if ($prevEl) $prevEl[swiper.enabled ? "removeClass" : "addClass"](swiper.params.navigation.lockClass);
        }));
        on("click", ((_s, e) => {
            const {$nextEl, $prevEl} = swiper.navigation;
            const targetEl = e.target;
            if (swiper.params.navigation.hideOnClick && !dom(targetEl).is($prevEl) && !dom(targetEl).is($nextEl)) {
                if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
                let isHidden;
                if ($nextEl) isHidden = $nextEl.hasClass(swiper.params.navigation.hiddenClass); else if ($prevEl) isHidden = $prevEl.hasClass(swiper.params.navigation.hiddenClass);
                if (true === isHidden) emit("navigationShow"); else emit("navigationHide");
                if ($nextEl) $nextEl.toggleClass(swiper.params.navigation.hiddenClass);
                if ($prevEl) $prevEl.toggleClass(swiper.params.navigation.hiddenClass);
            }
        }));
        const enable = () => {
            swiper.$el.removeClass(swiper.params.navigation.navigationDisabledClass);
            init();
            update();
        };
        const disable = () => {
            swiper.$el.addClass(swiper.params.navigation.navigationDisabledClass);
            destroy();
        };
        Object.assign(swiper.navigation, {
            enable,
            disable,
            update,
            init,
            destroy
        });
    }
    function initSliders() {
        if (document.querySelector(".category__slider")) new core(".category__slider", {
            modules: [ Navigation ],
            observer: true,
            observeParents: true,
            slidesPerView: 4,
            spaceBetween: 15,
            autoHeight: true,
            speed: 800,
            navigation: {
                prevEl: ".category__slider-button-prev",
                nextEl: ".category__slider-button-next"
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 0,
                    autoHeight: true
                },
                450: {
                    slidesPerView: 2,
                    spaceBetween: 15,
                    autoHeight: true
                },
                640: {
                    slidesPerView: 3,
                    spaceBetween: 15,
                    autoHeight: true
                },
                1268: {
                    slidesPerView: 4,
                    spaceBetween: 30
                }
            },
            on: {}
        });
    }
    window.addEventListener("load", (function(e) {
        initSliders();
    }));
    class parallax_Parallax {
        constructor(elements) {
            if (elements.length) this.elements = Array.from(elements).map((el => new parallax_Parallax.Each(el, this.options)));
        }
        destroyEvents() {
            this.elements.forEach((el => {
                el.destroyEvents();
            }));
        }
        setEvents() {
            this.elements.forEach((el => {
                el.setEvents();
            }));
        }
    }
    parallax_Parallax.Each = class {
        constructor(parent) {
            this.parent = parent;
            this.elements = this.parent.querySelectorAll("[data-prlx]");
            this.animation = this.animationFrame.bind(this);
            this.offset = 0;
            this.value = 0;
            this.smooth = parent.dataset.prlxSmooth ? Number(parent.dataset.prlxSmooth) : 15;
            this.setEvents();
        }
        setEvents() {
            this.animationID = window.requestAnimationFrame(this.animation);
        }
        destroyEvents() {
            window.cancelAnimationFrame(this.animationID);
        }
        animationFrame() {
            const topToWindow = this.parent.getBoundingClientRect().top;
            const heightParent = this.parent.offsetHeight;
            const heightWindow = window.innerHeight;
            const positionParent = {
                top: topToWindow - heightWindow,
                bottom: topToWindow + heightParent
            };
            const centerPoint = this.parent.dataset.prlxCenter ? this.parent.dataset.prlxCenter : "center";
            if (positionParent.top < 30 && positionParent.bottom > -30) switch (centerPoint) {
              case "top":
                this.offset = -1 * topToWindow;
                break;

              case "center":
                this.offset = heightWindow / 2 - (topToWindow + heightParent / 2);
                break;

              case "bottom":
                this.offset = heightWindow - (topToWindow + heightParent);
                break;
            }
            this.value += (this.offset - this.value) / this.smooth;
            this.animationID = window.requestAnimationFrame(this.animation);
            this.elements.forEach((el => {
                const parameters = {
                    axis: el.dataset.axis ? el.dataset.axis : "v",
                    direction: el.dataset.direction ? el.dataset.direction + "1" : "-1",
                    coefficient: el.dataset.coefficient ? Number(el.dataset.coefficient) : 5,
                    additionalProperties: el.dataset.properties ? el.dataset.properties : ""
                };
                this.parameters(el, parameters);
            }));
        }
        parameters(el, parameters) {
            if ("v" == parameters.axis) el.style.transform = `translate3D(0, ${(parameters.direction * (this.value / parameters.coefficient)).toFixed(2)}px,0) ${parameters.additionalProperties}`; else if ("h" == parameters.axis) el.style.transform = `translate3D(${(parameters.direction * (this.value / parameters.coefficient)).toFixed(2)}px,0,0) ${parameters.additionalProperties}`;
        }
    };
    if (document.querySelectorAll("[data-prlx-parent]")) modules_flsModules.parallax = new parallax_Parallax(document.querySelectorAll("[data-prlx-parent]"));
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    class DynamicAdapt {
        constructor(type) {
            this.type = type;
        }
        init() {
            this.оbjects = [];
            this.daClassname = "_dynamic_adapt_";
            this.nodes = [ ...document.querySelectorAll("[data-da]") ];
            this.nodes.forEach((node => {
                const data = node.dataset.da.trim();
                const dataArray = data.split(",");
                const оbject = {};
                оbject.element = node;
                оbject.parent = node.parentNode;
                оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
                оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
                оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.оbjects.push(оbject);
            }));
            this.arraySort(this.оbjects);
            this.mediaQueries = this.оbjects.map((({breakpoint}) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)).filter(((item, index, self) => self.indexOf(item) === index));
            this.mediaQueries.forEach((media => {
                const mediaSplit = media.split(",");
                const matchMedia = window.matchMedia(mediaSplit[0]);
                const mediaBreakpoint = mediaSplit[1];
                const оbjectsFilter = this.оbjects.filter((({breakpoint}) => breakpoint === mediaBreakpoint));
                matchMedia.addEventListener("change", (() => {
                    this.mediaHandler(matchMedia, оbjectsFilter);
                }));
                this.mediaHandler(matchMedia, оbjectsFilter);
            }));
        }
        mediaHandler(matchMedia, оbjects) {
            if (matchMedia.matches) оbjects.forEach((оbject => {
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            })); else оbjects.forEach((({parent, element, index}) => {
                if (element.classList.contains(this.daClassname)) this.moveBack(parent, element, index);
            }));
        }
        moveTo(place, element, destination) {
            element.classList.add(this.daClassname);
            if ("last" === place || place >= destination.children.length) {
                destination.append(element);
                return;
            }
            if ("first" === place) {
                destination.prepend(element);
                return;
            }
            destination.children[place].before(element);
        }
        moveBack(parent, element, index) {
            element.classList.remove(this.daClassname);
            if (void 0 !== parent.children[index]) parent.children[index].before(element); else parent.append(element);
        }
        indexInParent(parent, element) {
            return [ ...parent.children ].indexOf(element);
        }
        arraySort(arr) {
            if ("min" === this.type) arr.sort(((a, b) => {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if ("first" === a.place || "last" === b.place) return -1;
                    if ("last" === a.place || "first" === b.place) return 1;
                    return 0;
                }
                return a.breakpoint - b.breakpoint;
            })); else {
                arr.sort(((a, b) => {
                    if (a.breakpoint === b.breakpoint) {
                        if (a.place === b.place) return 0;
                        if ("first" === a.place || "last" === b.place) return 1;
                        if ("last" === a.place || "first" === b.place) return -1;
                        return 0;
                    }
                    return b.breakpoint - a.breakpoint;
                }));
                return;
            }
        }
    }
    const da = new DynamicAdapt("max");
    da.init();
    /**!
 * MixItUp v3.3.1
 * A high-performance, dependency-free library for animated filtering, sorting and more
 * Build 94e0fbf6-cd0b-4987-b3c0-14b59b67b8a0
 *
 * @copyright Copyright 2014-2018 KunkaLabs Limited.
 * @author    KunkaLabs Limited.
 * @link      https://www.kunkalabs.com/mixitup/
 *
 * @license   Commercial use requires a commercial license.
 *            https://www.kunkalabs.com/mixitup/licenses/
 *
 *            Non-commercial use permitted under same terms as CC BY-NC 3.0 license.
 *            http://creativecommons.org/licenses/by-nc/3.0/
 */
    (function(window) {
        "use strict";
        var mixitup = null, h = null;
        (function() {
            var VENDORS = [ "webkit", "moz", "o", "ms" ], canary = window.document.createElement("div"), i = -1;
            for (i = 0; i < VENDORS.length && !window.requestAnimationFrame; i++) window.requestAnimationFrame = window[VENDORS[i] + "RequestAnimationFrame"];
            if ("undefined" === typeof canary.nextElementSibling) Object.defineProperty(window.Element.prototype, "nextElementSibling", {
                get: function() {
                    var el = this.nextSibling;
                    while (el) {
                        if (1 === el.nodeType) return el;
                        el = el.nextSibling;
                    }
                    return null;
                }
            });
            (function(ElementPrototype) {
                ElementPrototype.matches = ElementPrototype.matches || ElementPrototype.machesSelector || ElementPrototype.mozMatchesSelector || ElementPrototype.msMatchesSelector || ElementPrototype.oMatchesSelector || ElementPrototype.webkitMatchesSelector || function(selector) {
                    return Array.prototype.indexOf.call(this.parentElement.querySelectorAll(selector), this) > -1;
                };
            })(window.Element.prototype);
            if (!Object.keys) Object.keys = function() {
                var hasOwnProperty = Object.prototype.hasOwnProperty, hasDontEnumBug = false, dontEnums = [], dontEnumsLength = -1;
                hasDontEnumBug = !{
                    toString: null
                }.propertyIsEnumerable("toString");
                dontEnums = [ "toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor" ];
                dontEnumsLength = dontEnums.length;
                return function(obj) {
                    var result = [], prop = "", i = -1;
                    if ("object" !== typeof obj && ("function" !== typeof obj || null === obj)) throw new TypeError("Object.keys called on non-object");
                    for (prop in obj) if (hasOwnProperty.call(obj, prop)) result.push(prop);
                    if (hasDontEnumBug) for (i = 0; i < dontEnumsLength; i++) if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
                    return result;
                };
            }();
            if (!Array.isArray) Array.isArray = function(arg) {
                return "[object Array]" === Object.prototype.toString.call(arg);
            };
            if ("function" !== typeof Object.create) Object.create = function(undefined) {
                var Temp = function() {};
                return function(prototype, propertiesObject) {
                    if (prototype !== Object(prototype) && null !== prototype) throw TypeError("Argument must be an object, or null");
                    Temp.prototype = prototype || {};
                    var result = new Temp;
                    Temp.prototype = null;
                    if (propertiesObject !== undefined) Object.defineProperties(result, propertiesObject);
                    if (null === prototype) result.__proto__ = null;
                    return result;
                };
            }();
            if (!String.prototype.trim) String.prototype.trim = function() {
                return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
            };
            if (!Array.prototype.indexOf) Array.prototype.indexOf = function(searchElement) {
                var n, k, t, len;
                if (null === this) throw new TypeError;
                t = Object(this);
                len = t.length >>> 0;
                if (0 === len) return -1;
                n = 0;
                if (arguments.length > 1) {
                    n = Number(arguments[1]);
                    if (n !== n) n = 0; else if (0 !== n && n !== 1 / 0 && n !== -1 / 0) n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
                if (n >= len) return -1;
                for (k = n >= 0 ? n : Math.max(len - Math.abs(n), 0); k < len; k++) if (k in t && t[k] === searchElement) return k;
                return -1;
            };
            if (!Function.prototype.bind) Function.prototype.bind = function(oThis) {
                var aArgs, self, FNOP, fBound;
                if ("function" !== typeof this) throw new TypeError;
                aArgs = Array.prototype.slice.call(arguments, 1);
                self = this;
                FNOP = function() {};
                fBound = function() {
                    return self.apply(this instanceof FNOP ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
                };
                if (this.prototype) FNOP.prototype = this.prototype;
                fBound.prototype = new FNOP;
                return fBound;
            };
            if (!window.Element.prototype.dispatchEvent) window.Element.prototype.dispatchEvent = function(event) {
                try {
                    return this.fireEvent("on" + event.type, event);
                } catch (err) {}
            };
        })();
        mixitup = function(container, config, foreignDoc) {
            var el = null, returnCollection = false, instance = null, facade = null, doc = null, output = null, instances = [], id = "", elements = [], i = -1;
            doc = foreignDoc || window.document;
            if (returnCollection = arguments[3]) returnCollection = "boolean" === typeof returnCollection;
            if ("string" === typeof container) elements = doc.querySelectorAll(container); else if (container && "object" === typeof container && h.isElement(container, doc)) elements = [ container ]; else if (container && "object" === typeof container && container.length) elements = container; else throw new Error(mixitup.messages.errorFactoryInvalidContainer());
            if (elements.length < 1) throw new Error(mixitup.messages.errorFactoryContainerNotFound());
            for (i = 0; el = elements[i]; i++) {
                if (i > 0 && !returnCollection) break;
                if (!el.id) {
                    id = "MixItUp" + h.randomHex();
                    el.id = id;
                } else id = el.id;
                if (mixitup.instances[id] instanceof mixitup.Mixer) {
                    instance = mixitup.instances[id];
                    if (!config || config && config.debug && false !== config.debug.showWarnings) console.warn(mixitup.messages.warningFactoryPreexistingInstance());
                } else {
                    instance = new mixitup.Mixer;
                    instance.attach(el, doc, id, config);
                    mixitup.instances[id] = instance;
                }
                facade = new mixitup.Facade(instance);
                if (config && config.debug && config.debug.enable) instances.push(instance); else instances.push(facade);
            }
            if (returnCollection) output = new mixitup.Collection(instances); else output = instances[0];
            return output;
        };
        mixitup.use = function(extension) {
            mixitup.Base.prototype.callActions.call(mixitup, "beforeUse", arguments);
            if ("function" === typeof extension && "mixitup-extension" === extension.TYPE) {
                if ("undefined" === typeof mixitup.extensions[extension.NAME]) {
                    extension(mixitup);
                    mixitup.extensions[extension.NAME] = extension;
                }
            } else if (extension.fn && extension.fn.jquery) mixitup.libraries.$ = extension;
            mixitup.Base.prototype.callActions.call(mixitup, "afterUse", arguments);
        };
        mixitup.instances = {};
        mixitup.extensions = {};
        mixitup.libraries = {};
        h = {
            hasClass: function(el, cls) {
                return !!el.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
            },
            addClass: function(el, cls) {
                if (!this.hasClass(el, cls)) el.className += el.className ? " " + cls : cls;
            },
            removeClass: function(el, cls) {
                if (this.hasClass(el, cls)) {
                    var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
                    el.className = el.className.replace(reg, " ").trim();
                }
            },
            extend: function(destination, source, deep, handleErrors) {
                var sourceKeys = [], key = "", i = -1;
                deep = deep || false;
                handleErrors = handleErrors || false;
                try {
                    if (Array.isArray(source)) for (i = 0; i < source.length; i++) sourceKeys.push(i); else if (source) sourceKeys = Object.keys(source);
                    for (i = 0; i < sourceKeys.length; i++) {
                        key = sourceKeys[i];
                        if (!deep || "object" !== typeof source[key] || this.isElement(source[key])) destination[key] = source[key]; else if (Array.isArray(source[key])) {
                            if (!destination[key]) destination[key] = [];
                            this.extend(destination[key], source[key], deep, handleErrors);
                        } else {
                            if (!destination[key]) destination[key] = {};
                            this.extend(destination[key], source[key], deep, handleErrors);
                        }
                    }
                } catch (err) {
                    if (handleErrors) this.handleExtendError(err, destination); else throw err;
                }
                return destination;
            },
            handleExtendError: function(err, destination) {
                var re = /property "?(\w*)"?[,:] object/i, matches = null, erroneous = "", message = "", suggestion = "", probableMatch = "", key = "", mostMatchingChars = -1, i = -1;
                if (err instanceof TypeError && (matches = re.exec(err.message))) {
                    erroneous = matches[1];
                    for (key in destination) {
                        i = 0;
                        while (i < erroneous.length && erroneous.charAt(i) === key.charAt(i)) i++;
                        if (i > mostMatchingChars) {
                            mostMatchingChars = i;
                            probableMatch = key;
                        }
                    }
                    if (mostMatchingChars > 1) suggestion = mixitup.messages.errorConfigInvalidPropertySuggestion({
                        probableMatch
                    });
                    message = mixitup.messages.errorConfigInvalidProperty({
                        erroneous,
                        suggestion
                    });
                    throw new TypeError(message);
                }
                throw err;
            },
            template: function(str) {
                var re = /\${([\w]*)}/g, dynamics = {}, matches = null;
                while (matches = re.exec(str)) dynamics[matches[1]] = new RegExp("\\${" + matches[1] + "}", "g");
                return function(data) {
                    var key = "", output = str;
                    data = data || {};
                    for (key in dynamics) output = output.replace(dynamics[key], "undefined" !== typeof data[key] ? data[key] : "");
                    return output;
                };
            },
            on: function(el, type, fn, useCapture) {
                if (!el) return;
                if (el.addEventListener) el.addEventListener(type, fn, useCapture); else if (el.attachEvent) {
                    el["e" + type + fn] = fn;
                    el[type + fn] = function() {
                        el["e" + type + fn](window.event);
                    };
                    el.attachEvent("on" + type, el[type + fn]);
                }
            },
            off: function(el, type, fn) {
                if (!el) return;
                if (el.removeEventListener) el.removeEventListener(type, fn, false); else if (el.detachEvent) {
                    el.detachEvent("on" + type, el[type + fn]);
                    el[type + fn] = null;
                }
            },
            getCustomEvent: function(eventType, detail, doc) {
                var event = null;
                doc = doc || window.document;
                if ("function" === typeof window.CustomEvent) event = new window.CustomEvent(eventType, {
                    detail,
                    bubbles: true,
                    cancelable: true
                }); else if ("function" === typeof doc.createEvent) {
                    event = doc.createEvent("CustomEvent");
                    event.initCustomEvent(eventType, true, true, detail);
                } else {
                    event = doc.createEventObject(), event.type = eventType;
                    event.returnValue = false;
                    event.cancelBubble = false;
                    event.detail = detail;
                }
                return event;
            },
            getOriginalEvent: function(e) {
                if (e.touches && e.touches.length) return e.touches[0]; else if (e.changedTouches && e.changedTouches.length) return e.changedTouches[0]; else return e;
            },
            index: function(el, selector) {
                var i = 0;
                while (null !== (el = el.previousElementSibling)) if (!selector || el.matches(selector)) ++i;
                return i;
            },
            camelCase: function(str) {
                return str.toLowerCase().replace(/([_-][a-z])/g, (function($1) {
                    return $1.toUpperCase().replace(/[_-]/, "");
                }));
            },
            pascalCase: function(str) {
                return (str = this.camelCase(str)).charAt(0).toUpperCase() + str.slice(1);
            },
            dashCase: function(str) {
                return str.replace(/([A-Z])/g, "-$1").replace(/^-/, "").toLowerCase();
            },
            isElement: function(el, doc) {
                doc = doc || window.document;
                if (window.HTMLElement && el instanceof window.HTMLElement) return true; else if (doc.defaultView && doc.defaultView.HTMLElement && el instanceof doc.defaultView.HTMLElement) return true; else return null !== el && 1 === el.nodeType && "string" === typeof el.nodeName;
            },
            createElement: function(htmlString, doc) {
                var frag = null, temp = null;
                doc = doc || window.document;
                frag = doc.createDocumentFragment();
                temp = doc.createElement("div");
                temp.innerHTML = htmlString.trim();
                while (temp.firstChild) frag.appendChild(temp.firstChild);
                return frag;
            },
            removeWhitespace: function(node) {
                var deleting;
                while (node && "#text" === node.nodeName) {
                    deleting = node;
                    node = node.previousSibling;
                    deleting.parentElement && deleting.parentElement.removeChild(deleting);
                }
            },
            isEqualArray: function(a, b) {
                var i = a.length;
                if (i !== b.length) return false;
                while (i--) if (a[i] !== b[i]) return false;
                return true;
            },
            deepEquals: function(a, b) {
                var key;
                if ("object" === typeof a && a && "object" === typeof b && b) {
                    if (Object.keys(a).length !== Object.keys(b).length) return false;
                    for (key in a) if (!b.hasOwnProperty(key) || !this.deepEquals(a[key], b[key])) return false;
                } else if (a !== b) return false;
                return true;
            },
            arrayShuffle: function(oldArray) {
                var newArray = oldArray.slice(), len = newArray.length, i = len, p = -1, t = [];
                while (i--) {
                    p = ~~(Math.random() * len);
                    t = newArray[i];
                    newArray[i] = newArray[p];
                    newArray[p] = t;
                }
                return newArray;
            },
            arrayFromList: function(list) {
                var output, i;
                try {
                    return Array.prototype.slice.call(list);
                } catch (err) {
                    output = [];
                    for (i = 0; i < list.length; i++) output.push(list[i]);
                    return output;
                }
            },
            debounce: function(func, wait, immediate) {
                var timeout;
                return function() {
                    var self = this, args = arguments, callNow = immediate && !timeout, later = null;
                    later = function() {
                        timeout = null;
                        if (!immediate) func.apply(self, args);
                    };
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                    if (callNow) func.apply(self, args);
                };
            },
            position: function(element) {
                var xPosition = 0, yPosition = 0, offsetParent = element;
                while (element) {
                    xPosition -= element.scrollLeft;
                    yPosition -= element.scrollTop;
                    if (element === offsetParent) {
                        xPosition += element.offsetLeft;
                        yPosition += element.offsetTop;
                        offsetParent = element.offsetParent;
                    }
                    element = element.parentElement;
                }
                return {
                    x: xPosition,
                    y: yPosition
                };
            },
            getHypotenuse: function(node1, node2) {
                var distanceX = node1.x - node2.x, distanceY = node1.y - node2.y;
                distanceX = distanceX < 0 ? -1 * distanceX : distanceX, distanceY = distanceY < 0 ? -1 * distanceY : distanceY;
                return Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
            },
            getIntersectionRatio: function(box1, box2) {
                var controlArea = box1.width * box1.height, intersectionX = -1, intersectionY = -1, intersectionArea = -1, ratio = -1;
                intersectionX = Math.max(0, Math.min(box1.left + box1.width, box2.left + box2.width) - Math.max(box1.left, box2.left));
                intersectionY = Math.max(0, Math.min(box1.top + box1.height, box2.top + box2.height) - Math.max(box1.top, box2.top));
                intersectionArea = intersectionY * intersectionX;
                ratio = intersectionArea / controlArea;
                return ratio;
            },
            closestParent: function(el, selector, includeSelf, doc) {
                var parent = el.parentNode;
                doc = doc || window.document;
                if (includeSelf && el.matches(selector)) return el;
                while (parent && parent != doc.body) if (parent.matches && parent.matches(selector)) return parent; else if (parent.parentNode) parent = parent.parentNode; else return null;
                return null;
            },
            children: function(el, selector, doc) {
                var children = [], tempId = "";
                doc = doc || window.doc;
                if (el) {
                    if (!el.id) {
                        tempId = "Temp" + this.randomHexKey();
                        el.id = tempId;
                    }
                    children = doc.querySelectorAll("#" + el.id + " > " + selector);
                    if (tempId) el.removeAttribute("id");
                }
                return children;
            },
            clean: function(originalArray) {
                var cleanArray = [], i = -1;
                for (i = 0; i < originalArray.length; i++) if ("" !== originalArray[i]) cleanArray.push(originalArray[i]);
                return cleanArray;
            },
            defer: function(libraries) {
                var deferred = null, promiseWrapper = null, $ = null;
                promiseWrapper = new this.Deferred;
                if (mixitup.features.has.promises) promiseWrapper.promise = new Promise((function(resolve, reject) {
                    promiseWrapper.resolve = resolve;
                    promiseWrapper.reject = reject;
                })); else if (($ = window.jQuery || libraries.$) && "function" === typeof $.Deferred) {
                    deferred = $.Deferred();
                    promiseWrapper.promise = deferred.promise();
                    promiseWrapper.resolve = deferred.resolve;
                    promiseWrapper.reject = deferred.reject;
                } else if (window.console) console.warn(mixitup.messages.warningNoPromiseImplementation());
                return promiseWrapper;
            },
            all: function(tasks, libraries) {
                var $ = null;
                if (mixitup.features.has.promises) return Promise.all(tasks); else if (($ = window.jQuery || libraries.$) && "function" === typeof $.when) return $.when.apply($, tasks).done((function() {
                    return arguments;
                }));
                if (window.console) console.warn(mixitup.messages.warningNoPromiseImplementation());
                return [];
            },
            getPrefix: function(el, property, vendors) {
                var i = -1, prefix = "";
                if (h.dashCase(property) in el.style) return "";
                for (i = 0; prefix = vendors[i]; i++) if (prefix + property in el.style) return prefix.toLowerCase();
                return "unsupported";
            },
            randomHex: function() {
                return ("00000" + (16777216 * Math.random() << 0).toString(16)).substr(-6).toUpperCase();
            },
            getDocumentState: function(doc) {
                doc = "object" === typeof doc.body ? doc : window.document;
                return {
                    scrollTop: window.pageYOffset,
                    scrollLeft: window.pageXOffset,
                    docHeight: doc.documentElement.scrollHeight,
                    docWidth: doc.documentElement.scrollWidth,
                    viewportHeight: doc.documentElement.clientHeight,
                    viewportWidth: doc.documentElement.clientWidth
                };
            },
            bind: function(obj, fn) {
                return function() {
                    return fn.apply(obj, arguments);
                };
            },
            isVisible: function(el) {
                var styles = null;
                if (el.offsetParent) return true;
                styles = window.getComputedStyle(el);
                if ("fixed" === styles.position && "hidden" !== styles.visibility && "0" !== styles.opacity) return true;
                return false;
            },
            seal: function(obj) {
                if ("function" === typeof Object.seal) Object.seal(obj);
            },
            freeze: function(obj) {
                if ("function" === typeof Object.freeze) Object.freeze(obj);
            },
            compareVersions: function(control, specimen) {
                var controlParts = control.split("."), specimenParts = specimen.split("."), controlPart = -1, specimenPart = -1, i = -1;
                for (i = 0; i < controlParts.length; i++) {
                    controlPart = parseInt(controlParts[i].replace(/[^\d.]/g, ""));
                    specimenPart = parseInt(specimenParts[i].replace(/[^\d.]/g, "") || 0);
                    if (specimenPart < controlPart) return false; else if (specimenPart > controlPart) return true;
                }
                return true;
            },
            Deferred: function() {
                this.promise = null;
                this.resolve = null;
                this.reject = null;
                this.id = h.randomHex();
            },
            isEmptyObject: function(obj) {
                var key = "";
                if ("function" === typeof Object.keys) return 0 === Object.keys(obj).length;
                for (key in obj) if (obj.hasOwnProperty(key)) return false;
                return true;
            },
            getClassname: function(classNames, elementName, modifier) {
                var classname = "";
                classname += classNames.block;
                if (classname.length) classname += classNames.delineatorElement;
                classname += classNames["element" + this.pascalCase(elementName)];
                if (!modifier) return classname;
                if (classname.length) classname += classNames.delineatorModifier;
                classname += modifier;
                return classname;
            },
            getProperty: function(obj, stringKey) {
                var parts = stringKey.split("."), returnCurrent = null, current = "", i = 0;
                if (!stringKey) return obj;
                returnCurrent = function(obj) {
                    if (!obj) return null; else return obj[current];
                };
                while (i < parts.length) {
                    current = parts[i];
                    obj = returnCurrent(obj);
                    i++;
                }
                if ("undefined" !== typeof obj) return obj; else return null;
            }
        };
        mixitup.h = h;
        mixitup.Base = function() {};
        mixitup.Base.prototype = {
            constructor: mixitup.Base,
            callActions: function(actionName, args) {
                var self = this, hooks = self.constructor.actions[actionName], extensionName = "";
                if (!hooks || h.isEmptyObject(hooks)) return;
                for (extensionName in hooks) hooks[extensionName].apply(self, args);
            },
            callFilters: function(filterName, input, args) {
                var self = this, hooks = self.constructor.filters[filterName], output = input, extensionName = "";
                if (!hooks || h.isEmptyObject(hooks)) return output;
                args = args || [];
                for (extensionName in hooks) {
                    args = h.arrayFromList(args);
                    args.unshift(output);
                    output = hooks[extensionName].apply(self, args);
                }
                return output;
            }
        };
        mixitup.BaseStatic = function() {
            this.actions = {};
            this.filters = {};
            this.extend = function(extension) {
                h.extend(this.prototype, extension);
            };
            this.registerAction = function(hookName, extensionName, func) {
                (this.actions[hookName] = this.actions[hookName] || {})[extensionName] = func;
            };
            this.registerFilter = function(hookName, extensionName, func) {
                (this.filters[hookName] = this.filters[hookName] || {})[extensionName] = func;
            };
        };
        mixitup.Features = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.boxSizingPrefix = "";
            this.transformPrefix = "";
            this.transitionPrefix = "";
            this.boxSizingPrefix = "";
            this.transformProp = "";
            this.transformRule = "";
            this.transitionProp = "";
            this.perspectiveProp = "";
            this.perspectiveOriginProp = "";
            this.has = new mixitup.Has;
            this.canary = null;
            this.BOX_SIZING_PROP = "boxSizing";
            this.TRANSITION_PROP = "transition";
            this.TRANSFORM_PROP = "transform";
            this.PERSPECTIVE_PROP = "perspective";
            this.PERSPECTIVE_ORIGIN_PROP = "perspectiveOrigin";
            this.VENDORS = [ "Webkit", "moz", "O", "ms" ];
            this.TWEENABLE = [ "opacity", "width", "height", "marginRight", "marginBottom", "x", "y", "scale", "translateX", "translateY", "translateZ", "rotateX", "rotateY", "rotateZ" ];
            this.callActions("afterConstruct");
        };
        mixitup.BaseStatic.call(mixitup.Features);
        mixitup.Features.prototype = Object.create(mixitup.Base.prototype);
        h.extend(mixitup.Features.prototype, {
            constructor: mixitup.Features,
            init: function() {
                var self = this;
                self.callActions("beforeInit", arguments);
                self.canary = document.createElement("div");
                self.setPrefixes();
                self.runTests();
                self.callActions("beforeInit", arguments);
            },
            runTests: function() {
                var self = this;
                self.callActions("beforeRunTests", arguments);
                self.has.promises = "function" === typeof window.Promise;
                self.has.transitions = "unsupported" !== self.transitionPrefix;
                self.callActions("afterRunTests", arguments);
                h.freeze(self.has);
            },
            setPrefixes: function() {
                var self = this;
                self.callActions("beforeSetPrefixes", arguments);
                self.transitionPrefix = h.getPrefix(self.canary, "Transition", self.VENDORS);
                self.transformPrefix = h.getPrefix(self.canary, "Transform", self.VENDORS);
                self.boxSizingPrefix = h.getPrefix(self.canary, "BoxSizing", self.VENDORS);
                self.boxSizingProp = self.boxSizingPrefix ? self.boxSizingPrefix + h.pascalCase(self.BOX_SIZING_PROP) : self.BOX_SIZING_PROP;
                self.transitionProp = self.transitionPrefix ? self.transitionPrefix + h.pascalCase(self.TRANSITION_PROP) : self.TRANSITION_PROP;
                self.transformProp = self.transformPrefix ? self.transformPrefix + h.pascalCase(self.TRANSFORM_PROP) : self.TRANSFORM_PROP;
                self.transformRule = self.transformPrefix ? "-" + self.transformPrefix + "-" + self.TRANSFORM_PROP : self.TRANSFORM_PROP;
                self.perspectiveProp = self.transformPrefix ? self.transformPrefix + h.pascalCase(self.PERSPECTIVE_PROP) : self.PERSPECTIVE_PROP;
                self.perspectiveOriginProp = self.transformPrefix ? self.transformPrefix + h.pascalCase(self.PERSPECTIVE_ORIGIN_PROP) : self.PERSPECTIVE_ORIGIN_PROP;
                self.callActions("afterSetPrefixes", arguments);
            }
        });
        mixitup.Has = function() {
            this.transitions = false;
            this.promises = false;
            h.seal(this);
        };
        mixitup.features = new mixitup.Features;
        mixitup.features.init();
        mixitup.ConfigAnimation = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.enable = true;
            this.effects = "fade scale";
            this.effectsIn = "";
            this.effectsOut = "";
            this.duration = 600;
            this.easing = "ease";
            this.applyPerspective = true;
            this.perspectiveDistance = "3000px";
            this.perspectiveOrigin = "50% 50%";
            this.queue = true;
            this.queueLimit = 3;
            this.animateResizeContainer = true;
            this.animateResizeTargets = false;
            this.staggerSequence = null;
            this.reverseOut = false;
            this.nudge = true;
            this.clampHeight = true;
            this.clampWidth = true;
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.ConfigAnimation);
        mixitup.ConfigAnimation.prototype = Object.create(mixitup.Base.prototype);
        mixitup.ConfigAnimation.prototype.constructor = mixitup.ConfigAnimation;
        mixitup.ConfigBehavior = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.liveSort = false;
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.ConfigBehavior);
        mixitup.ConfigBehavior.prototype = Object.create(mixitup.Base.prototype);
        mixitup.ConfigBehavior.prototype.constructor = mixitup.ConfigBehavior;
        mixitup.ConfigCallbacks = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.onMixStart = null;
            this.onMixBusy = null;
            this.onMixEnd = null;
            this.onMixFail = null;
            this.onMixClick = null;
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.ConfigCallbacks);
        mixitup.ConfigCallbacks.prototype = Object.create(mixitup.Base.prototype);
        mixitup.ConfigCallbacks.prototype.constructor = mixitup.ConfigCallbacks;
        mixitup.ConfigControls = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.enable = true;
            this.live = false;
            this.scope = "global";
            this.toggleLogic = "or";
            this.toggleDefault = "all";
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.ConfigControls);
        mixitup.ConfigControls.prototype = Object.create(mixitup.Base.prototype);
        mixitup.ConfigControls.prototype.constructor = mixitup.ConfigControls;
        mixitup.ConfigClassNames = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.block = "mixitup";
            this.elementContainer = "container";
            this.elementFilter = "control";
            this.elementSort = "control";
            this.elementMultimix = "control";
            this.elementToggle = "control";
            this.modifierActive = "active";
            this.modifierDisabled = "disabled";
            this.modifierFailed = "failed";
            this.delineatorElement = "-";
            this.delineatorModifier = "-";
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.ConfigClassNames);
        mixitup.ConfigClassNames.prototype = Object.create(mixitup.Base.prototype);
        mixitup.ConfigClassNames.prototype.constructor = mixitup.ConfigClassNames;
        mixitup.ConfigData = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.uidKey = "";
            this.dirtyCheck = false;
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.ConfigData);
        mixitup.ConfigData.prototype = Object.create(mixitup.Base.prototype);
        mixitup.ConfigData.prototype.constructor = mixitup.ConfigData;
        mixitup.ConfigDebug = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.enable = false;
            this.showWarnings = true;
            this.fauxAsync = false;
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.ConfigDebug);
        mixitup.ConfigDebug.prototype = Object.create(mixitup.Base.prototype);
        mixitup.ConfigDebug.prototype.constructor = mixitup.ConfigDebug;
        mixitup.ConfigLayout = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.allowNestedTargets = true;
            this.containerClassName = "";
            this.siblingBefore = null;
            this.siblingAfter = null;
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.ConfigLayout);
        mixitup.ConfigLayout.prototype = Object.create(mixitup.Base.prototype);
        mixitup.ConfigLayout.prototype.constructor = mixitup.ConfigLayout;
        mixitup.ConfigLoad = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.filter = "all";
            this.sort = "default:asc";
            this.dataset = null;
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.ConfigLoad);
        mixitup.ConfigLoad.prototype = Object.create(mixitup.Base.prototype);
        mixitup.ConfigLoad.prototype.constructor = mixitup.ConfigLoad;
        mixitup.ConfigSelectors = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.target = ".mix";
            this.control = "";
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.ConfigSelectors);
        mixitup.ConfigSelectors.prototype = Object.create(mixitup.Base.prototype);
        mixitup.ConfigSelectors.prototype.constructor = mixitup.ConfigSelectors;
        mixitup.ConfigRender = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.target = null;
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.ConfigRender);
        mixitup.ConfigRender.prototype = Object.create(mixitup.Base.prototype);
        mixitup.ConfigRender.prototype.constructor = mixitup.ConfigRender;
        mixitup.ConfigTemplates = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.ConfigTemplates);
        mixitup.ConfigTemplates.prototype = Object.create(mixitup.Base.prototype);
        mixitup.ConfigTemplates.prototype.constructor = mixitup.ConfigTemplates;
        mixitup.Config = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.animation = new mixitup.ConfigAnimation;
            this.behavior = new mixitup.ConfigBehavior;
            this.callbacks = new mixitup.ConfigCallbacks;
            this.controls = new mixitup.ConfigControls;
            this.classNames = new mixitup.ConfigClassNames;
            this.data = new mixitup.ConfigData;
            this.debug = new mixitup.ConfigDebug;
            this.layout = new mixitup.ConfigLayout;
            this.load = new mixitup.ConfigLoad;
            this.selectors = new mixitup.ConfigSelectors;
            this.render = new mixitup.ConfigRender;
            this.templates = new mixitup.ConfigTemplates;
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.Config);
        mixitup.Config.prototype = Object.create(mixitup.Base.prototype);
        mixitup.Config.prototype.constructor = mixitup.Config;
        mixitup.MixerDom = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.document = null;
            this.body = null;
            this.container = null;
            this.parent = null;
            this.targets = [];
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.MixerDom);
        mixitup.MixerDom.prototype = Object.create(mixitup.Base.prototype);
        mixitup.MixerDom.prototype.constructor = mixitup.MixerDom;
        mixitup.UiClassNames = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.base = "";
            this.active = "";
            this.disabled = "";
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.UiClassNames);
        mixitup.UiClassNames.prototype = Object.create(mixitup.Base.prototype);
        mixitup.UiClassNames.prototype.constructor = mixitup.UiClassNames;
        mixitup.CommandDataset = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.dataset = null;
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.CommandDataset);
        mixitup.CommandDataset.prototype = Object.create(mixitup.Base.prototype);
        mixitup.CommandDataset.prototype.constructor = mixitup.CommandDataset;
        mixitup.CommandMultimix = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.filter = null;
            this.sort = null;
            this.insert = null;
            this.remove = null;
            this.changeLayout = null;
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.CommandMultimix);
        mixitup.CommandMultimix.prototype = Object.create(mixitup.Base.prototype);
        mixitup.CommandMultimix.prototype.constructor = mixitup.CommandMultimix;
        mixitup.CommandFilter = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.selector = "";
            this.collection = null;
            this.action = "show";
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.CommandFilter);
        mixitup.CommandFilter.prototype = Object.create(mixitup.Base.prototype);
        mixitup.CommandFilter.prototype.constructor = mixitup.CommandFilter;
        mixitup.CommandSort = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.sortString = "";
            this.attribute = "";
            this.order = "asc";
            this.collection = null;
            this.next = null;
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.CommandSort);
        mixitup.CommandSort.prototype = Object.create(mixitup.Base.prototype);
        mixitup.CommandSort.prototype.constructor = mixitup.CommandSort;
        mixitup.CommandInsert = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.index = 0;
            this.collection = [];
            this.position = "before";
            this.sibling = null;
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.CommandInsert);
        mixitup.CommandInsert.prototype = Object.create(mixitup.Base.prototype);
        mixitup.CommandInsert.prototype.constructor = mixitup.CommandInsert;
        mixitup.CommandRemove = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.targets = [];
            this.collection = [];
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.CommandRemove);
        mixitup.CommandRemove.prototype = Object.create(mixitup.Base.prototype);
        mixitup.CommandRemove.prototype.constructor = mixitup.CommandRemove;
        mixitup.CommandChangeLayout = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.containerClassName = "";
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.CommandChangeLayout);
        mixitup.CommandChangeLayout.prototype = Object.create(mixitup.Base.prototype);
        mixitup.CommandChangeLayout.prototype.constructor = mixitup.CommandChangeLayout;
        mixitup.ControlDefinition = function(type, selector, live, parent) {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.type = type;
            this.selector = selector;
            this.live = live || false;
            this.parent = parent || "";
            this.callActions("afterConstruct");
            h.freeze(this);
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.ControlDefinition);
        mixitup.ControlDefinition.prototype = Object.create(mixitup.Base.prototype);
        mixitup.ControlDefinition.prototype.constructor = mixitup.ControlDefinition;
        mixitup.controlDefinitions = [];
        mixitup.controlDefinitions.push(new mixitup.ControlDefinition("multimix", "[data-filter][data-sort]"));
        mixitup.controlDefinitions.push(new mixitup.ControlDefinition("filter", "[data-filter]"));
        mixitup.controlDefinitions.push(new mixitup.ControlDefinition("sort", "[data-sort]"));
        mixitup.controlDefinitions.push(new mixitup.ControlDefinition("toggle", "[data-toggle]"));
        mixitup.Control = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.el = null;
            this.selector = "";
            this.bound = [];
            this.pending = -1;
            this.type = "";
            this.status = "inactive";
            this.filter = "";
            this.sort = "";
            this.canDisable = false;
            this.handler = null;
            this.classNames = new mixitup.UiClassNames;
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.Control);
        mixitup.Control.prototype = Object.create(mixitup.Base.prototype);
        h.extend(mixitup.Control.prototype, {
            constructor: mixitup.Control,
            init: function(el, type, selector) {
                var self = this;
                this.callActions("beforeInit", arguments);
                self.el = el;
                self.type = type;
                self.selector = selector;
                if (self.selector) self.status = "live"; else {
                    self.canDisable = "boolean" === typeof self.el.disable;
                    switch (self.type) {
                      case "filter":
                        self.filter = self.el.getAttribute("data-filter");
                        break;

                      case "toggle":
                        self.filter = self.el.getAttribute("data-toggle");
                        break;

                      case "sort":
                        self.sort = self.el.getAttribute("data-sort");
                        break;

                      case "multimix":
                        self.filter = self.el.getAttribute("data-filter");
                        self.sort = self.el.getAttribute("data-sort");
                        break;
                    }
                }
                self.bindClick();
                mixitup.controls.push(self);
                this.callActions("afterInit", arguments);
            },
            isBound: function(mixer) {
                var self = this, isBound = false;
                this.callActions("beforeIsBound", arguments);
                isBound = self.bound.indexOf(mixer) > -1;
                return self.callFilters("afterIsBound", isBound, arguments);
            },
            addBinding: function(mixer) {
                var self = this;
                this.callActions("beforeAddBinding", arguments);
                if (!self.isBound()) self.bound.push(mixer);
                this.callActions("afterAddBinding", arguments);
            },
            removeBinding: function(mixer) {
                var self = this, removeIndex = -1;
                this.callActions("beforeRemoveBinding", arguments);
                if ((removeIndex = self.bound.indexOf(mixer)) > -1) self.bound.splice(removeIndex, 1);
                if (self.bound.length < 1) {
                    self.unbindClick();
                    removeIndex = mixitup.controls.indexOf(self);
                    mixitup.controls.splice(removeIndex, 1);
                    if ("active" === self.status) self.renderStatus(self.el, "inactive");
                }
                this.callActions("afterRemoveBinding", arguments);
            },
            bindClick: function() {
                var self = this;
                this.callActions("beforeBindClick", arguments);
                self.handler = function(e) {
                    self.handleClick(e);
                };
                h.on(self.el, "click", self.handler);
                this.callActions("afterBindClick", arguments);
            },
            unbindClick: function() {
                var self = this;
                this.callActions("beforeUnbindClick", arguments);
                h.off(self.el, "click", self.handler);
                self.handler = null;
                this.callActions("afterUnbindClick", arguments);
            },
            handleClick: function(e) {
                var self = this, button = null, mixer = null, isActive = false, returnValue = void 0, command = {}, clone = null, commands = [], i = -1;
                this.callActions("beforeHandleClick", arguments);
                this.pending = 0;
                mixer = self.bound[0];
                if (!self.selector) button = self.el; else button = h.closestParent(e.target, mixer.config.selectors.control + self.selector, true, mixer.dom.document);
                if (!button) {
                    self.callActions("afterHandleClick", arguments);
                    return;
                }
                switch (self.type) {
                  case "filter":
                    command.filter = self.filter || button.getAttribute("data-filter");
                    break;

                  case "sort":
                    command.sort = self.sort || button.getAttribute("data-sort");
                    break;

                  case "multimix":
                    command.filter = self.filter || button.getAttribute("data-filter");
                    command.sort = self.sort || button.getAttribute("data-sort");
                    break;

                  case "toggle":
                    command.filter = self.filter || button.getAttribute("data-toggle");
                    if ("live" === self.status) isActive = h.hasClass(button, self.classNames.active); else isActive = "active" === self.status;
                    break;
                }
                for (i = 0; i < self.bound.length; i++) {
                    clone = new mixitup.CommandMultimix;
                    h.extend(clone, command);
                    commands.push(clone);
                }
                commands = self.callFilters("commandsHandleClick", commands, arguments);
                self.pending = self.bound.length;
                for (i = 0; mixer = self.bound[i]; i++) {
                    command = commands[i];
                    if (!command) continue;
                    if (!mixer.lastClicked) mixer.lastClicked = button;
                    mixitup.events.fire("mixClick", mixer.dom.container, {
                        state: mixer.state,
                        instance: mixer,
                        originalEvent: e,
                        control: mixer.lastClicked
                    }, mixer.dom.document);
                    if ("function" === typeof mixer.config.callbacks.onMixClick) {
                        returnValue = mixer.config.callbacks.onMixClick.call(mixer.lastClicked, mixer.state, e, mixer);
                        if (false === returnValue) continue;
                    }
                    if ("toggle" === self.type) isActive ? mixer.toggleOff(command.filter) : mixer.toggleOn(command.filter); else mixer.multimix(command);
                }
                this.callActions("afterHandleClick", arguments);
            },
            update: function(command, toggleArray) {
                var self = this, actions = new mixitup.CommandMultimix;
                self.callActions("beforeUpdate", arguments);
                self.pending--;
                self.pending = Math.max(0, self.pending);
                if (self.pending > 0) return;
                if ("live" === self.status) self.updateLive(command, toggleArray); else {
                    actions.sort = self.sort;
                    actions.filter = self.filter;
                    self.callFilters("actionsUpdate", actions, arguments);
                    self.parseStatusChange(self.el, command, actions, toggleArray);
                }
                self.callActions("afterUpdate", arguments);
            },
            updateLive: function(command, toggleArray) {
                var self = this, controlButtons = null, actions = null, button = null, i = -1;
                self.callActions("beforeUpdateLive", arguments);
                if (!self.el) return;
                controlButtons = self.el.querySelectorAll(self.selector);
                for (i = 0; button = controlButtons[i]; i++) {
                    actions = new mixitup.CommandMultimix;
                    switch (self.type) {
                      case "filter":
                        actions.filter = button.getAttribute("data-filter");
                        break;

                      case "sort":
                        actions.sort = button.getAttribute("data-sort");
                        break;

                      case "multimix":
                        actions.filter = button.getAttribute("data-filter");
                        actions.sort = button.getAttribute("data-sort");
                        break;

                      case "toggle":
                        actions.filter = button.getAttribute("data-toggle");
                        break;
                    }
                    actions = self.callFilters("actionsUpdateLive", actions, arguments);
                    self.parseStatusChange(button, command, actions, toggleArray);
                }
                self.callActions("afterUpdateLive", arguments);
            },
            parseStatusChange: function(button, command, actions, toggleArray) {
                var self = this, alias = "", toggle = "", i = -1;
                self.callActions("beforeParseStatusChange", arguments);
                switch (self.type) {
                  case "filter":
                    if (command.filter === actions.filter) self.renderStatus(button, "active"); else self.renderStatus(button, "inactive");
                    break;

                  case "multimix":
                    if (command.sort === actions.sort && command.filter === actions.filter) self.renderStatus(button, "active"); else self.renderStatus(button, "inactive");
                    break;

                  case "sort":
                    if (command.sort.match(/:asc/g)) alias = command.sort.replace(/:asc/g, "");
                    if (command.sort === actions.sort || alias === actions.sort) self.renderStatus(button, "active"); else self.renderStatus(button, "inactive");
                    break;

                  case "toggle":
                    if (toggleArray.length < 1) self.renderStatus(button, "inactive");
                    if (command.filter === actions.filter) self.renderStatus(button, "active");
                    for (i = 0; i < toggleArray.length; i++) {
                        toggle = toggleArray[i];
                        if (toggle === actions.filter) {
                            self.renderStatus(button, "active");
                            break;
                        }
                        self.renderStatus(button, "inactive");
                    }
                    break;
                }
                self.callActions("afterParseStatusChange", arguments);
            },
            renderStatus: function(button, status) {
                var self = this;
                self.callActions("beforeRenderStatus", arguments);
                switch (status) {
                  case "active":
                    h.addClass(button, self.classNames.active);
                    h.removeClass(button, self.classNames.disabled);
                    if (self.canDisable) self.el.disabled = false;
                    break;

                  case "inactive":
                    h.removeClass(button, self.classNames.active);
                    h.removeClass(button, self.classNames.disabled);
                    if (self.canDisable) self.el.disabled = false;
                    break;

                  case "disabled":
                    if (self.canDisable) self.el.disabled = true;
                    h.addClass(button, self.classNames.disabled);
                    h.removeClass(button, self.classNames.active);
                    break;
                }
                if ("live" !== self.status) self.status = status;
                self.callActions("afterRenderStatus", arguments);
            }
        });
        mixitup.controls = [];
        mixitup.StyleData = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.x = 0;
            this.y = 0;
            this.top = 0;
            this.right = 0;
            this.bottom = 0;
            this.left = 0;
            this.width = 0;
            this.height = 0;
            this.marginRight = 0;
            this.marginBottom = 0;
            this.opacity = 0;
            this.scale = new mixitup.TransformData;
            this.translateX = new mixitup.TransformData;
            this.translateY = new mixitup.TransformData;
            this.translateZ = new mixitup.TransformData;
            this.rotateX = new mixitup.TransformData;
            this.rotateY = new mixitup.TransformData;
            this.rotateZ = new mixitup.TransformData;
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.StyleData);
        mixitup.StyleData.prototype = Object.create(mixitup.Base.prototype);
        mixitup.StyleData.prototype.constructor = mixitup.StyleData;
        mixitup.TransformData = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.value = 0;
            this.unit = "";
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.TransformData);
        mixitup.TransformData.prototype = Object.create(mixitup.Base.prototype);
        mixitup.TransformData.prototype.constructor = mixitup.TransformData;
        mixitup.TransformDefaults = function() {
            mixitup.StyleData.apply(this);
            this.callActions("beforeConstruct");
            this.scale.value = .01;
            this.scale.unit = "";
            this.translateX.value = 20;
            this.translateX.unit = "px";
            this.translateY.value = 20;
            this.translateY.unit = "px";
            this.translateZ.value = 20;
            this.translateZ.unit = "px";
            this.rotateX.value = 90;
            this.rotateX.unit = "deg";
            this.rotateY.value = 90;
            this.rotateY.unit = "deg";
            this.rotateX.value = 90;
            this.rotateX.unit = "deg";
            this.rotateZ.value = 180;
            this.rotateZ.unit = "deg";
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.TransformDefaults);
        mixitup.TransformDefaults.prototype = Object.create(mixitup.StyleData.prototype);
        mixitup.TransformDefaults.prototype.constructor = mixitup.TransformDefaults;
        mixitup.transformDefaults = new mixitup.TransformDefaults;
        mixitup.EventDetail = function() {
            this.state = null;
            this.futureState = null;
            this.instance = null;
            this.originalEvent = null;
        };
        mixitup.Events = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.mixStart = null;
            this.mixBusy = null;
            this.mixEnd = null;
            this.mixFail = null;
            this.mixClick = null;
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.Events);
        mixitup.Events.prototype = Object.create(mixitup.Base.prototype);
        mixitup.Events.prototype.constructor = mixitup.Events;
        mixitup.Events.prototype.fire = function(eventType, el, detail, doc) {
            var self = this, event = null, eventDetail = new mixitup.EventDetail;
            self.callActions("beforeFire", arguments);
            if ("undefined" === typeof self[eventType]) throw new Error('Event type "' + eventType + '" not found.');
            eventDetail.state = new mixitup.State;
            h.extend(eventDetail.state, detail.state);
            if (detail.futureState) {
                eventDetail.futureState = new mixitup.State;
                h.extend(eventDetail.futureState, detail.futureState);
            }
            eventDetail.instance = detail.instance;
            if (detail.originalEvent) eventDetail.originalEvent = detail.originalEvent;
            event = h.getCustomEvent(eventType, eventDetail, doc);
            self.callFilters("eventFire", event, arguments);
            el.dispatchEvent(event);
        };
        mixitup.events = new mixitup.Events;
        mixitup.QueueItem = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.args = [];
            this.instruction = null;
            this.triggerElement = null;
            this.deferred = null;
            this.isToggling = false;
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.QueueItem);
        mixitup.QueueItem.prototype = Object.create(mixitup.Base.prototype);
        mixitup.QueueItem.prototype.constructor = mixitup.QueueItem;
        mixitup.Mixer = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.config = new mixitup.Config;
            this.id = "";
            this.isBusy = false;
            this.isToggling = false;
            this.incPadding = true;
            this.controls = [];
            this.targets = [];
            this.origOrder = [];
            this.cache = {};
            this.toggleArray = [];
            this.targetsMoved = 0;
            this.targetsImmovable = 0;
            this.targetsBound = 0;
            this.targetsDone = 0;
            this.staggerDuration = 0;
            this.effectsIn = null;
            this.effectsOut = null;
            this.transformIn = [];
            this.transformOut = [];
            this.queue = [];
            this.state = null;
            this.lastOperation = null;
            this.lastClicked = null;
            this.userCallback = null;
            this.userDeferred = null;
            this.dom = new mixitup.MixerDom;
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.Mixer);
        mixitup.Mixer.prototype = Object.create(mixitup.Base.prototype);
        h.extend(mixitup.Mixer.prototype, {
            constructor: mixitup.Mixer,
            attach: function(container, document, id, config) {
                var self = this, target = null, i = -1;
                self.callActions("beforeAttach", arguments);
                self.id = id;
                if (config) h.extend(self.config, config, true, true);
                self.sanitizeConfig();
                self.cacheDom(container, document);
                if (self.config.layout.containerClassName) h.addClass(self.dom.container, self.config.layout.containerClassName);
                if (!mixitup.features.has.transitions) self.config.animation.enable = false;
                if ("undefined" === typeof window.console) self.config.debug.showWarnings = false;
                if (self.config.data.uidKey) self.config.controls.enable = false;
                self.indexTargets();
                self.state = self.getInitialState();
                for (i = 0; target = self.lastOperation.toHide[i]; i++) target.hide();
                if (self.config.controls.enable) {
                    self.initControls();
                    self.buildToggleArray(null, self.state);
                    self.updateControls({
                        filter: self.state.activeFilter,
                        sort: self.state.activeSort
                    });
                }
                self.parseEffects();
                self.callActions("afterAttach", arguments);
            },
            sanitizeConfig: function() {
                var self = this;
                self.callActions("beforeSanitizeConfig", arguments);
                self.config.controls.scope = self.config.controls.scope.toLowerCase().trim();
                self.config.controls.toggleLogic = self.config.controls.toggleLogic.toLowerCase().trim();
                self.config.controls.toggleDefault = self.config.controls.toggleDefault.toLowerCase().trim();
                self.config.animation.effects = self.config.animation.effects.trim();
                self.callActions("afterSanitizeConfig", arguments);
            },
            getInitialState: function() {
                var self = this, state = new mixitup.State, operation = new mixitup.Operation;
                self.callActions("beforeGetInitialState", arguments);
                state.activeContainerClassName = self.config.layout.containerClassName;
                if (self.config.load.dataset) {
                    if (!self.config.data.uidKey || "string" !== typeof self.config.data.uidKey) throw new TypeError(mixitup.messages.errorConfigDataUidKeyNotSet());
                    operation.startDataset = operation.newDataset = state.activeDataset = self.config.load.dataset.slice();
                    operation.startContainerClassName = operation.newContainerClassName = state.activeContainerClassName;
                    operation.show = self.targets.slice();
                    state = self.callFilters("stateGetInitialState", state, arguments);
                } else {
                    state.activeFilter = self.parseFilterArgs([ self.config.load.filter ]).command;
                    state.activeSort = self.parseSortArgs([ self.config.load.sort ]).command;
                    state.totalTargets = self.targets.length;
                    state = self.callFilters("stateGetInitialState", state, arguments);
                    if (state.activeSort.collection || state.activeSort.attribute || "random" === state.activeSort.order || "desc" === state.activeSort.order) {
                        operation.newSort = state.activeSort;
                        self.sortOperation(operation);
                        self.printSort(false, operation);
                        self.targets = operation.newOrder;
                    } else operation.startOrder = operation.newOrder = self.targets;
                    operation.startFilter = operation.newFilter = state.activeFilter;
                    operation.startSort = operation.newSort = state.activeSort;
                    operation.startContainerClassName = operation.newContainerClassName = state.activeContainerClassName;
                    if ("all" === operation.newFilter.selector) operation.newFilter.selector = self.config.selectors.target; else if ("none" === operation.newFilter.selector) operation.newFilter.selector = "";
                }
                operation = self.callFilters("operationGetInitialState", operation, [ state ]);
                self.lastOperation = operation;
                if (operation.newFilter) self.filterOperation(operation);
                state = self.buildState(operation);
                return state;
            },
            cacheDom: function(el, document) {
                var self = this;
                self.callActions("beforeCacheDom", arguments);
                self.dom.document = document;
                self.dom.body = self.dom.document.querySelector("body");
                self.dom.container = el;
                self.dom.parent = el;
                self.callActions("afterCacheDom", arguments);
            },
            indexTargets: function() {
                var self = this, target = null, el = null, dataset = null, i = -1;
                self.callActions("beforeIndexTargets", arguments);
                self.dom.targets = self.config.layout.allowNestedTargets ? self.dom.container.querySelectorAll(self.config.selectors.target) : h.children(self.dom.container, self.config.selectors.target, self.dom.document);
                self.dom.targets = h.arrayFromList(self.dom.targets);
                self.targets = [];
                if ((dataset = self.config.load.dataset) && dataset.length !== self.dom.targets.length) throw new Error(mixitup.messages.errorDatasetPrerenderedMismatch());
                if (self.dom.targets.length) {
                    for (i = 0; el = self.dom.targets[i]; i++) {
                        target = new mixitup.Target;
                        target.init(el, self, dataset ? dataset[i] : void 0);
                        target.isInDom = true;
                        self.targets.push(target);
                    }
                    self.dom.parent = self.dom.targets[0].parentElement === self.dom.container ? self.dom.container : self.dom.targets[0].parentElement;
                }
                self.origOrder = self.targets;
                self.callActions("afterIndexTargets", arguments);
            },
            initControls: function() {
                var self = this, definition = "", controlElements = null, el = null, parent = null, delagators = null, control = null, i = -1, j = -1;
                self.callActions("beforeInitControls", arguments);
                switch (self.config.controls.scope) {
                  case "local":
                    parent = self.dom.container;
                    break;

                  case "global":
                    parent = self.dom.document;
                    break;

                  default:
                    throw new Error(mixitup.messages.errorConfigInvalidControlsScope());
                }
                for (i = 0; definition = mixitup.controlDefinitions[i]; i++) if (self.config.controls.live || definition.live) {
                    if (definition.parent) {
                        delagators = self.dom[definition.parent];
                        if (!delagators || delagators.length < 0) continue;
                        if ("number" !== typeof delagators.length) delagators = [ delagators ];
                    } else delagators = [ parent ];
                    for (j = 0; el = delagators[j]; j++) {
                        control = self.getControl(el, definition.type, definition.selector);
                        self.controls.push(control);
                    }
                } else {
                    controlElements = parent.querySelectorAll(self.config.selectors.control + definition.selector);
                    for (j = 0; el = controlElements[j]; j++) {
                        control = self.getControl(el, definition.type, "");
                        if (!control) continue;
                        self.controls.push(control);
                    }
                }
                self.callActions("afterInitControls", arguments);
            },
            getControl: function(el, type, selector) {
                var self = this, control = null, i = -1;
                self.callActions("beforeGetControl", arguments);
                if (!selector) for (i = 0; control = mixitup.controls[i]; i++) if (control.el === el && control.isBound(self)) return self.callFilters("controlGetControl", null, arguments); else if (control.el === el && control.type === type && control.selector === selector) {
                    control.addBinding(self);
                    return self.callFilters("controlGetControl", control, arguments);
                }
                control = new mixitup.Control;
                control.init(el, type, selector);
                control.classNames.base = h.getClassname(self.config.classNames, type);
                control.classNames.active = h.getClassname(self.config.classNames, type, self.config.classNames.modifierActive);
                control.classNames.disabled = h.getClassname(self.config.classNames, type, self.config.classNames.modifierDisabled);
                control.addBinding(self);
                return self.callFilters("controlGetControl", control, arguments);
            },
            getToggleSelector: function() {
                var self = this, delineator = "or" === self.config.controls.toggleLogic ? ", " : "", toggleSelector = "";
                self.callActions("beforeGetToggleSelector", arguments);
                self.toggleArray = h.clean(self.toggleArray);
                toggleSelector = self.toggleArray.join(delineator);
                if ("" === toggleSelector) toggleSelector = self.config.controls.toggleDefault;
                return self.callFilters("selectorGetToggleSelector", toggleSelector, arguments);
            },
            buildToggleArray: function(command, state) {
                var self = this, activeFilterSelector = "";
                self.callActions("beforeBuildToggleArray", arguments);
                if (command && command.filter) activeFilterSelector = command.filter.selector.replace(/\s/g, ""); else if (state) activeFilterSelector = state.activeFilter.selector.replace(/\s/g, ""); else return;
                if (activeFilterSelector === self.config.selectors.target || "all" === activeFilterSelector) activeFilterSelector = "";
                if ("or" === self.config.controls.toggleLogic) self.toggleArray = activeFilterSelector.split(","); else self.toggleArray = self.splitCompoundSelector(activeFilterSelector);
                self.toggleArray = h.clean(self.toggleArray);
                self.callActions("afterBuildToggleArray", arguments);
            },
            splitCompoundSelector: function(compoundSelector) {
                var partials = compoundSelector.split(/([\.\[])/g), toggleArray = [], selector = "", i = -1;
                if ("" === partials[0]) partials.shift();
                for (i = 0; i < partials.length; i++) {
                    if (i % 2 === 0) selector = "";
                    selector += partials[i];
                    if (i % 2 !== 0) toggleArray.push(selector);
                }
                return toggleArray;
            },
            updateControls: function(command) {
                var self = this, control = null, output = new mixitup.CommandMultimix, i = -1;
                self.callActions("beforeUpdateControls", arguments);
                if (command.filter) output.filter = command.filter.selector; else output.filter = self.state.activeFilter.selector;
                if (command.sort) output.sort = self.buildSortString(command.sort); else output.sort = self.buildSortString(self.state.activeSort);
                if (output.filter === self.config.selectors.target) output.filter = "all";
                if ("" === output.filter) output.filter = "none";
                h.freeze(output);
                for (i = 0; control = self.controls[i]; i++) control.update(output, self.toggleArray);
                self.callActions("afterUpdateControls", arguments);
            },
            buildSortString: function(command) {
                var self = this;
                var output = "";
                output += command.sortString;
                if (command.next) output += " " + self.buildSortString(command.next);
                return output;
            },
            insertTargets: function(command, operation) {
                var self = this, nextSibling = null, insertionIndex = -1, frag = null, target = null, el = null, i = -1;
                self.callActions("beforeInsertTargets", arguments);
                if ("undefined" === typeof command.index) command.index = 0;
                nextSibling = self.getNextSibling(command.index, command.sibling, command.position);
                frag = self.dom.document.createDocumentFragment();
                if (nextSibling) insertionIndex = h.index(nextSibling, self.config.selectors.target); else insertionIndex = self.targets.length;
                if (command.collection) {
                    for (i = 0; el = command.collection[i]; i++) {
                        if (self.dom.targets.indexOf(el) > -1) throw new Error(mixitup.messages.errorInsertPreexistingElement());
                        el.style.display = "none";
                        frag.appendChild(el);
                        frag.appendChild(self.dom.document.createTextNode(" "));
                        if (!h.isElement(el, self.dom.document) || !el.matches(self.config.selectors.target)) continue;
                        target = new mixitup.Target;
                        target.init(el, self);
                        target.isInDom = true;
                        self.targets.splice(insertionIndex, 0, target);
                        insertionIndex++;
                    }
                    self.dom.parent.insertBefore(frag, nextSibling);
                }
                operation.startOrder = self.origOrder = self.targets;
                self.callActions("afterInsertTargets", arguments);
            },
            getNextSibling: function(index, sibling, position) {
                var self = this, element = null;
                index = Math.max(index, 0);
                if (sibling && "before" === position) element = sibling; else if (sibling && "after" === position) element = sibling.nextElementSibling || null; else if (self.targets.length > 0 && "undefined" !== typeof index) element = index < self.targets.length || !self.targets.length ? self.targets[index].dom.el : self.targets[self.targets.length - 1].dom.el.nextElementSibling; else if (0 === self.targets.length && self.dom.parent.children.length > 0) if (self.config.layout.siblingAfter) element = self.config.layout.siblingAfter; else if (self.config.layout.siblingBefore) element = self.config.layout.siblingBefore.nextElementSibling; else self.dom.parent.children[0]; else null === element;
                return self.callFilters("elementGetNextSibling", element, arguments);
            },
            filterOperation: function(operation) {
                var self = this, testResult = false, index = -1, action = "", target = null, i = -1;
                self.callActions("beforeFilterOperation", arguments);
                action = operation.newFilter.action;
                for (i = 0; target = operation.newOrder[i]; i++) {
                    if (operation.newFilter.collection) testResult = operation.newFilter.collection.indexOf(target.dom.el) > -1; else if ("" === operation.newFilter.selector) testResult = false; else testResult = target.dom.el.matches(operation.newFilter.selector);
                    self.evaluateHideShow(testResult, target, action, operation);
                }
                if (operation.toRemove.length) for (i = 0; target = operation.show[i]; i++) if (operation.toRemove.indexOf(target) > -1) {
                    operation.show.splice(i, 1);
                    if ((index = operation.toShow.indexOf(target)) > -1) operation.toShow.splice(index, 1);
                    operation.toHide.push(target);
                    operation.hide.push(target);
                    i--;
                }
                operation.matching = operation.show.slice();
                if (0 === operation.show.length && "" !== operation.newFilter.selector && 0 !== self.targets.length) operation.hasFailed = true;
                self.callActions("afterFilterOperation", arguments);
            },
            evaluateHideShow: function(testResult, target, action, operation) {
                var self = this, filteredTestResult = false, args = Array.prototype.slice.call(arguments, 1);
                filteredTestResult = self.callFilters("testResultEvaluateHideShow", testResult, args);
                self.callActions("beforeEvaluateHideShow", arguments);
                if (true === filteredTestResult && "show" === action || false === filteredTestResult && "hide" === action) {
                    operation.show.push(target);
                    !target.isShown && operation.toShow.push(target);
                } else {
                    operation.hide.push(target);
                    target.isShown && operation.toHide.push(target);
                }
                self.callActions("afterEvaluateHideShow", arguments);
            },
            sortOperation: function(operation) {
                var self = this, newOrder = [], target = null, el = null, i = -1;
                self.callActions("beforeSortOperation", arguments);
                operation.startOrder = self.targets;
                if (operation.newSort.collection) {
                    newOrder = [];
                    for (i = 0; el = operation.newSort.collection[i]; i++) {
                        if (self.dom.targets.indexOf(el) < 0) throw new Error(mixitup.messages.errorSortNonExistentElement());
                        target = new mixitup.Target;
                        target.init(el, self);
                        target.isInDom = true;
                        newOrder.push(target);
                    }
                    operation.newOrder = newOrder;
                } else if ("random" === operation.newSort.order) operation.newOrder = h.arrayShuffle(operation.startOrder); else if ("" === operation.newSort.attribute) {
                    operation.newOrder = self.origOrder.slice();
                    if ("desc" === operation.newSort.order) operation.newOrder.reverse();
                } else {
                    operation.newOrder = operation.startOrder.slice();
                    operation.newOrder.sort((function(a, b) {
                        return self.compare(a, b, operation.newSort);
                    }));
                }
                if (h.isEqualArray(operation.newOrder, operation.startOrder)) operation.willSort = false;
                self.callActions("afterSortOperation", arguments);
            },
            compare: function(a, b, command) {
                var self = this, order = command.order, attrA = self.getAttributeValue(a, command.attribute), attrB = self.getAttributeValue(b, command.attribute);
                if (isNaN(1 * attrA) || isNaN(1 * attrB)) {
                    attrA = attrA.toLowerCase();
                    attrB = attrB.toLowerCase();
                } else {
                    attrA *= 1;
                    attrB *= 1;
                }
                if (attrA < attrB) return "asc" === order ? -1 : 1;
                if (attrA > attrB) return "asc" === order ? 1 : -1;
                if (attrA === attrB && command.next) return self.compare(a, b, command.next);
                return 0;
            },
            getAttributeValue: function(target, attribute) {
                var self = this, value = "";
                value = target.dom.el.getAttribute("data-" + attribute);
                if (null === value) if (self.config.debug.showWarnings) console.warn(mixitup.messages.warningInconsistentSortingAttributes({
                    attribute: "data-" + attribute
                }));
                return self.callFilters("valueGetAttributeValue", value || 0, arguments);
            },
            printSort: function(isResetting, operation) {
                var self = this, startOrder = isResetting ? operation.newOrder : operation.startOrder, newOrder = isResetting ? operation.startOrder : operation.newOrder, nextSibling = startOrder.length ? startOrder[startOrder.length - 1].dom.el.nextElementSibling : null, frag = window.document.createDocumentFragment(), whitespace = null, target = null, el = null, i = -1;
                self.callActions("beforePrintSort", arguments);
                for (i = 0; target = startOrder[i]; i++) {
                    el = target.dom.el;
                    if ("absolute" === el.style.position) continue;
                    h.removeWhitespace(el.previousSibling);
                    el.parentElement.removeChild(el);
                }
                whitespace = nextSibling ? nextSibling.previousSibling : self.dom.parent.lastChild;
                if (whitespace && "#text" === whitespace.nodeName) h.removeWhitespace(whitespace);
                for (i = 0; target = newOrder[i]; i++) {
                    el = target.dom.el;
                    if (h.isElement(frag.lastChild)) frag.appendChild(window.document.createTextNode(" "));
                    frag.appendChild(el);
                }
                if (self.dom.parent.firstChild && self.dom.parent.firstChild !== nextSibling) frag.insertBefore(window.document.createTextNode(" "), frag.childNodes[0]);
                if (nextSibling) {
                    frag.appendChild(window.document.createTextNode(" "));
                    self.dom.parent.insertBefore(frag, nextSibling);
                } else self.dom.parent.appendChild(frag);
                self.callActions("afterPrintSort", arguments);
            },
            parseSortString: function(sortString, command) {
                var self = this, rules = sortString.split(" "), current = command, rule = [], i = -1;
                for (i = 0; i < rules.length; i++) {
                    rule = rules[i].split(":");
                    current.sortString = rules[i];
                    current.attribute = h.dashCase(rule[0]);
                    current.order = rule[1] || "asc";
                    switch (current.attribute) {
                      case "default":
                        current.attribute = "";
                        break;

                      case "random":
                        current.attribute = "";
                        current.order = "random";
                        break;
                    }
                    if (!current.attribute || "random" === current.order) break;
                    if (i < rules.length - 1) {
                        current.next = new mixitup.CommandSort;
                        h.freeze(current);
                        current = current.next;
                    }
                }
                return self.callFilters("commandsParseSort", command, arguments);
            },
            parseEffects: function() {
                var self = this, transformName = "", effectsIn = self.config.animation.effectsIn || self.config.animation.effects, effectsOut = self.config.animation.effectsOut || self.config.animation.effects;
                self.callActions("beforeParseEffects", arguments);
                self.effectsIn = new mixitup.StyleData;
                self.effectsOut = new mixitup.StyleData;
                self.transformIn = [];
                self.transformOut = [];
                self.effectsIn.opacity = self.effectsOut.opacity = 1;
                self.parseEffect("fade", effectsIn, self.effectsIn, self.transformIn);
                self.parseEffect("fade", effectsOut, self.effectsOut, self.transformOut, true);
                for (transformName in mixitup.transformDefaults) {
                    if (!(mixitup.transformDefaults[transformName] instanceof mixitup.TransformData)) continue;
                    self.parseEffect(transformName, effectsIn, self.effectsIn, self.transformIn);
                    self.parseEffect(transformName, effectsOut, self.effectsOut, self.transformOut, true);
                }
                self.parseEffect("stagger", effectsIn, self.effectsIn, self.transformIn);
                self.parseEffect("stagger", effectsOut, self.effectsOut, self.transformOut, true);
                self.callActions("afterParseEffects", arguments);
            },
            parseEffect: function(effectName, effectString, effects, transform, isOut) {
                var self = this, re = /\(([^)]+)\)/, propIndex = -1, str = "", match = [], val = "", units = [ "%", "px", "em", "rem", "vh", "vw", "deg" ], unit = "", i = -1;
                self.callActions("beforeParseEffect", arguments);
                if ("string" !== typeof effectString) throw new TypeError(mixitup.messages.errorConfigInvalidAnimationEffects());
                if (effectString.indexOf(effectName) < 0) {
                    if ("stagger" === effectName) self.staggerDuration = 0;
                    return;
                }
                propIndex = effectString.indexOf(effectName + "(");
                if (propIndex > -1) {
                    str = effectString.substring(propIndex);
                    match = re.exec(str);
                    val = match[1];
                }
                switch (effectName) {
                  case "fade":
                    effects.opacity = val ? parseFloat(val) : 0;
                    break;

                  case "stagger":
                    self.staggerDuration = val ? parseFloat(val) : 100;
                    break;

                  default:
                    if (isOut && self.config.animation.reverseOut && "scale" !== effectName) effects[effectName].value = -1 * (val ? parseFloat(val) : mixitup.transformDefaults[effectName].value); else effects[effectName].value = val ? parseFloat(val) : mixitup.transformDefaults[effectName].value;
                    if (val) {
                        for (i = 0; unit = units[i]; i++) if (val.indexOf(unit) > -1) {
                            effects[effectName].unit = unit;
                            break;
                        }
                    } else effects[effectName].unit = mixitup.transformDefaults[effectName].unit;
                    transform.push(effectName + "(" + effects[effectName].value + effects[effectName].unit + ")");
                }
                self.callActions("afterParseEffect", arguments);
            },
            buildState: function(operation) {
                var self = this, state = new mixitup.State, target = null, i = -1;
                self.callActions("beforeBuildState", arguments);
                for (i = 0; target = self.targets[i]; i++) if (!operation.toRemove.length || operation.toRemove.indexOf(target) < 0) state.targets.push(target.dom.el);
                for (i = 0; target = operation.matching[i]; i++) state.matching.push(target.dom.el);
                for (i = 0; target = operation.show[i]; i++) state.show.push(target.dom.el);
                for (i = 0; target = operation.hide[i]; i++) if (!operation.toRemove.length || operation.toRemove.indexOf(target) < 0) state.hide.push(target.dom.el);
                state.id = self.id;
                state.container = self.dom.container;
                state.activeFilter = operation.newFilter;
                state.activeSort = operation.newSort;
                state.activeDataset = operation.newDataset;
                state.activeContainerClassName = operation.newContainerClassName;
                state.hasFailed = operation.hasFailed;
                state.totalTargets = self.targets.length;
                state.totalShow = operation.show.length;
                state.totalHide = operation.hide.length;
                state.totalMatching = operation.matching.length;
                state.triggerElement = operation.triggerElement;
                return self.callFilters("stateBuildState", state, arguments);
            },
            goMix: function(shouldAnimate, operation) {
                var self = this, deferred = null;
                self.callActions("beforeGoMix", arguments);
                if (!self.config.animation.duration || !self.config.animation.effects || !h.isVisible(self.dom.container)) shouldAnimate = false;
                if (!operation.toShow.length && !operation.toHide.length && !operation.willSort && !operation.willChangeLayout) shouldAnimate = false;
                if (!operation.startState.show.length && !operation.show.length) shouldAnimate = false;
                mixitup.events.fire("mixStart", self.dom.container, {
                    state: operation.startState,
                    futureState: operation.newState,
                    instance: self
                }, self.dom.document);
                if ("function" === typeof self.config.callbacks.onMixStart) self.config.callbacks.onMixStart.call(self.dom.container, operation.startState, operation.newState, self);
                h.removeClass(self.dom.container, h.getClassname(self.config.classNames, "container", self.config.classNames.modifierFailed));
                if (!self.userDeferred) deferred = self.userDeferred = h.defer(mixitup.libraries); else deferred = self.userDeferred;
                self.isBusy = true;
                if (!shouldAnimate || !mixitup.features.has.transitions) {
                    if (self.config.debug.fauxAsync) setTimeout((function() {
                        self.cleanUp(operation);
                    }), self.config.animation.duration); else self.cleanUp(operation);
                    return self.callFilters("promiseGoMix", deferred.promise, arguments);
                }
                if (window.pageYOffset !== operation.docState.scrollTop) window.scrollTo(operation.docState.scrollLeft, operation.docState.scrollTop);
                if (self.config.animation.applyPerspective) {
                    self.dom.parent.style[mixitup.features.perspectiveProp] = self.config.animation.perspectiveDistance;
                    self.dom.parent.style[mixitup.features.perspectiveOriginProp] = self.config.animation.perspectiveOrigin;
                }
                if (self.config.animation.animateResizeContainer && operation.startHeight !== operation.newHeight && operation.viewportDeltaY !== operation.startHeight - operation.newHeight) self.dom.parent.style.height = operation.startHeight + "px";
                if (self.config.animation.animateResizeContainer && operation.startWidth !== operation.newWidth && operation.viewportDeltaX !== operation.startWidth - operation.newWidth) self.dom.parent.style.width = operation.startWidth + "px";
                if (operation.startHeight === operation.newHeight) self.dom.parent.style.height = operation.startHeight + "px";
                if (operation.startWidth === operation.newWidth) self.dom.parent.style.width = operation.startWidth + "px";
                if (operation.startHeight === operation.newHeight && operation.startWidth === operation.newWidth) self.dom.parent.style.overflow = "hidden";
                requestAnimationFrame((function() {
                    self.moveTargets(operation);
                }));
                return self.callFilters("promiseGoMix", deferred.promise, arguments);
            },
            getStartMixData: function(operation) {
                var self = this, parentStyle = window.getComputedStyle(self.dom.parent), parentRect = self.dom.parent.getBoundingClientRect(), target = null, data = {}, i = -1, boxSizing = parentStyle[mixitup.features.boxSizingProp];
                self.incPadding = "border-box" === boxSizing;
                self.callActions("beforeGetStartMixData", arguments);
                for (i = 0; target = operation.show[i]; i++) {
                    data = target.getPosData();
                    operation.showPosData[i] = {
                        startPosData: data
                    };
                }
                for (i = 0; target = operation.toHide[i]; i++) {
                    data = target.getPosData();
                    operation.toHidePosData[i] = {
                        startPosData: data
                    };
                }
                operation.startX = parentRect.left;
                operation.startY = parentRect.top;
                operation.startHeight = self.incPadding ? parentRect.height : parentRect.height - parseFloat(parentStyle.paddingTop) - parseFloat(parentStyle.paddingBottom) - parseFloat(parentStyle.borderTop) - parseFloat(parentStyle.borderBottom);
                operation.startWidth = self.incPadding ? parentRect.width : parentRect.width - parseFloat(parentStyle.paddingLeft) - parseFloat(parentStyle.paddingRight) - parseFloat(parentStyle.borderLeft) - parseFloat(parentStyle.borderRight);
                self.callActions("afterGetStartMixData", arguments);
            },
            setInter: function(operation) {
                var self = this, target = null, i = -1;
                self.callActions("beforeSetInter", arguments);
                if (self.config.animation.clampHeight) {
                    self.dom.parent.style.height = operation.startHeight + "px";
                    self.dom.parent.style.overflow = "hidden";
                }
                if (self.config.animation.clampWidth) {
                    self.dom.parent.style.width = operation.startWidth + "px";
                    self.dom.parent.style.overflow = "hidden";
                }
                for (i = 0; target = operation.toShow[i]; i++) target.show();
                if (operation.willChangeLayout) {
                    h.removeClass(self.dom.container, operation.startContainerClassName);
                    h.addClass(self.dom.container, operation.newContainerClassName);
                }
                self.callActions("afterSetInter", arguments);
            },
            getInterMixData: function(operation) {
                var self = this, target = null, i = -1;
                self.callActions("beforeGetInterMixData", arguments);
                for (i = 0; target = operation.show[i]; i++) operation.showPosData[i].interPosData = target.getPosData();
                for (i = 0; target = operation.toHide[i]; i++) operation.toHidePosData[i].interPosData = target.getPosData();
                self.callActions("afterGetInterMixData", arguments);
            },
            setFinal: function(operation) {
                var self = this, target = null, i = -1;
                self.callActions("beforeSetFinal", arguments);
                operation.willSort && self.printSort(false, operation);
                for (i = 0; target = operation.toHide[i]; i++) target.hide();
                self.callActions("afterSetFinal", arguments);
            },
            getFinalMixData: function(operation) {
                var self = this, parentStyle = null, parentRect = null, target = null, i = -1;
                self.callActions("beforeGetFinalMixData", arguments);
                for (i = 0; target = operation.show[i]; i++) operation.showPosData[i].finalPosData = target.getPosData();
                for (i = 0; target = operation.toHide[i]; i++) operation.toHidePosData[i].finalPosData = target.getPosData();
                if (self.config.animation.clampHeight || self.config.animation.clampWidth) self.dom.parent.style.height = self.dom.parent.style.width = self.dom.parent.style.overflow = "";
                if (!self.incPadding) parentStyle = window.getComputedStyle(self.dom.parent);
                parentRect = self.dom.parent.getBoundingClientRect();
                operation.newX = parentRect.left;
                operation.newY = parentRect.top;
                operation.newHeight = self.incPadding ? parentRect.height : parentRect.height - parseFloat(parentStyle.paddingTop) - parseFloat(parentStyle.paddingBottom) - parseFloat(parentStyle.borderTop) - parseFloat(parentStyle.borderBottom);
                operation.newWidth = self.incPadding ? parentRect.width : parentRect.width - parseFloat(parentStyle.paddingLeft) - parseFloat(parentStyle.paddingRight) - parseFloat(parentStyle.borderLeft) - parseFloat(parentStyle.borderRight);
                operation.viewportDeltaX = operation.docState.viewportWidth - this.dom.document.documentElement.clientWidth;
                operation.viewportDeltaY = operation.docState.viewportHeight - this.dom.document.documentElement.clientHeight;
                if (operation.willSort) self.printSort(true, operation);
                for (i = 0; target = operation.toShow[i]; i++) target.hide();
                for (i = 0; target = operation.toHide[i]; i++) target.show();
                if (operation.willChangeLayout) {
                    h.removeClass(self.dom.container, operation.newContainerClassName);
                    h.addClass(self.dom.container, self.config.layout.containerClassName);
                }
                self.callActions("afterGetFinalMixData", arguments);
            },
            getTweenData: function(operation) {
                var self = this, target = null, posData = null, effectNames = Object.getOwnPropertyNames(self.effectsIn), effectName = "", effect = null, widthChange = -1, heightChange = -1, i = -1, j = -1;
                self.callActions("beforeGetTweenData", arguments);
                for (i = 0; target = operation.show[i]; i++) {
                    posData = operation.showPosData[i];
                    posData.posIn = new mixitup.StyleData;
                    posData.posOut = new mixitup.StyleData;
                    posData.tweenData = new mixitup.StyleData;
                    if (target.isShown) {
                        posData.posIn.x = posData.startPosData.x - posData.interPosData.x;
                        posData.posIn.y = posData.startPosData.y - posData.interPosData.y;
                    } else posData.posIn.x = posData.posIn.y = 0;
                    posData.posOut.x = posData.finalPosData.x - posData.interPosData.x;
                    posData.posOut.y = posData.finalPosData.y - posData.interPosData.y;
                    posData.posIn.opacity = target.isShown ? 1 : self.effectsIn.opacity;
                    posData.posOut.opacity = 1;
                    posData.tweenData.opacity = posData.posOut.opacity - posData.posIn.opacity;
                    if (!target.isShown && !self.config.animation.nudge) {
                        posData.posIn.x = posData.posOut.x;
                        posData.posIn.y = posData.posOut.y;
                    }
                    posData.tweenData.x = posData.posOut.x - posData.posIn.x;
                    posData.tweenData.y = posData.posOut.y - posData.posIn.y;
                    if (self.config.animation.animateResizeTargets) {
                        posData.posIn.width = posData.startPosData.width;
                        posData.posIn.height = posData.startPosData.height;
                        widthChange = (posData.startPosData.width || posData.finalPosData.width) - posData.interPosData.width;
                        posData.posIn.marginRight = posData.startPosData.marginRight - widthChange;
                        heightChange = (posData.startPosData.height || posData.finalPosData.height) - posData.interPosData.height;
                        posData.posIn.marginBottom = posData.startPosData.marginBottom - heightChange;
                        posData.posOut.width = posData.finalPosData.width;
                        posData.posOut.height = posData.finalPosData.height;
                        widthChange = (posData.finalPosData.width || posData.startPosData.width) - posData.interPosData.width;
                        posData.posOut.marginRight = posData.finalPosData.marginRight - widthChange;
                        heightChange = (posData.finalPosData.height || posData.startPosData.height) - posData.interPosData.height;
                        posData.posOut.marginBottom = posData.finalPosData.marginBottom - heightChange;
                        posData.tweenData.width = posData.posOut.width - posData.posIn.width;
                        posData.tweenData.height = posData.posOut.height - posData.posIn.height;
                        posData.tweenData.marginRight = posData.posOut.marginRight - posData.posIn.marginRight;
                        posData.tweenData.marginBottom = posData.posOut.marginBottom - posData.posIn.marginBottom;
                    }
                    for (j = 0; effectName = effectNames[j]; j++) {
                        effect = self.effectsIn[effectName];
                        if (!(effect instanceof mixitup.TransformData) || !effect.value) continue;
                        posData.posIn[effectName].value = effect.value;
                        posData.posOut[effectName].value = 0;
                        posData.tweenData[effectName].value = posData.posOut[effectName].value - posData.posIn[effectName].value;
                        posData.posIn[effectName].unit = posData.posOut[effectName].unit = posData.tweenData[effectName].unit = effect.unit;
                    }
                }
                for (i = 0; target = operation.toHide[i]; i++) {
                    posData = operation.toHidePosData[i];
                    posData.posIn = new mixitup.StyleData;
                    posData.posOut = new mixitup.StyleData;
                    posData.tweenData = new mixitup.StyleData;
                    posData.posIn.x = target.isShown ? posData.startPosData.x - posData.interPosData.x : 0;
                    posData.posIn.y = target.isShown ? posData.startPosData.y - posData.interPosData.y : 0;
                    posData.posOut.x = self.config.animation.nudge ? 0 : posData.posIn.x;
                    posData.posOut.y = self.config.animation.nudge ? 0 : posData.posIn.y;
                    posData.tweenData.x = posData.posOut.x - posData.posIn.x;
                    posData.tweenData.y = posData.posOut.y - posData.posIn.y;
                    if (self.config.animation.animateResizeTargets) {
                        posData.posIn.width = posData.startPosData.width;
                        posData.posIn.height = posData.startPosData.height;
                        widthChange = posData.startPosData.width - posData.interPosData.width;
                        posData.posIn.marginRight = posData.startPosData.marginRight - widthChange;
                        heightChange = posData.startPosData.height - posData.interPosData.height;
                        posData.posIn.marginBottom = posData.startPosData.marginBottom - heightChange;
                    }
                    posData.posIn.opacity = 1;
                    posData.posOut.opacity = self.effectsOut.opacity;
                    posData.tweenData.opacity = posData.posOut.opacity - posData.posIn.opacity;
                    for (j = 0; effectName = effectNames[j]; j++) {
                        effect = self.effectsOut[effectName];
                        if (!(effect instanceof mixitup.TransformData) || !effect.value) continue;
                        posData.posIn[effectName].value = 0;
                        posData.posOut[effectName].value = effect.value;
                        posData.tweenData[effectName].value = posData.posOut[effectName].value - posData.posIn[effectName].value;
                        posData.posIn[effectName].unit = posData.posOut[effectName].unit = posData.tweenData[effectName].unit = effect.unit;
                    }
                }
                self.callActions("afterGetTweenData", arguments);
            },
            moveTargets: function(operation) {
                var self = this, target = null, moveData = null, posData = null, statusChange = "", willTransition = false, staggerIndex = -1, i = -1, checkProgress = self.checkProgress.bind(self);
                self.callActions("beforeMoveTargets", arguments);
                for (i = 0; target = operation.show[i]; i++) {
                    moveData = new mixitup.IMoveData;
                    posData = operation.showPosData[i];
                    statusChange = target.isShown ? "none" : "show";
                    willTransition = self.willTransition(statusChange, operation.hasEffect, posData.posIn, posData.posOut);
                    if (willTransition) staggerIndex++;
                    target.show();
                    moveData.posIn = posData.posIn;
                    moveData.posOut = posData.posOut;
                    moveData.statusChange = statusChange;
                    moveData.staggerIndex = staggerIndex;
                    moveData.operation = operation;
                    moveData.callback = willTransition ? checkProgress : null;
                    target.move(moveData);
                }
                for (i = 0; target = operation.toHide[i]; i++) {
                    posData = operation.toHidePosData[i];
                    moveData = new mixitup.IMoveData;
                    statusChange = "hide";
                    willTransition = self.willTransition(statusChange, posData.posIn, posData.posOut);
                    moveData.posIn = posData.posIn;
                    moveData.posOut = posData.posOut;
                    moveData.statusChange = statusChange;
                    moveData.staggerIndex = i;
                    moveData.operation = operation;
                    moveData.callback = willTransition ? checkProgress : null;
                    target.move(moveData);
                }
                if (self.config.animation.animateResizeContainer) {
                    self.dom.parent.style[mixitup.features.transitionProp] = "height " + self.config.animation.duration + "ms ease, " + "width " + self.config.animation.duration + "ms ease ";
                    requestAnimationFrame((function() {
                        if (operation.startHeight !== operation.newHeight && operation.viewportDeltaY !== operation.startHeight - operation.newHeight) self.dom.parent.style.height = operation.newHeight + "px";
                        if (operation.startWidth !== operation.newWidth && operation.viewportDeltaX !== operation.startWidth - operation.newWidth) self.dom.parent.style.width = operation.newWidth + "px";
                    }));
                }
                if (operation.willChangeLayout) {
                    h.removeClass(self.dom.container, self.config.layout.ContainerClassName);
                    h.addClass(self.dom.container, operation.newContainerClassName);
                }
                self.callActions("afterMoveTargets", arguments);
            },
            hasEffect: function() {
                var self = this, EFFECTABLES = [ "scale", "translateX", "translateY", "translateZ", "rotateX", "rotateY", "rotateZ" ], effectName = "", effect = null, result = false, value = -1, i = -1;
                if (1 !== self.effectsIn.opacity) return self.callFilters("resultHasEffect", true, arguments);
                for (i = 0; effectName = EFFECTABLES[i]; i++) {
                    effect = self.effectsIn[effectName];
                    value = typeof effect && "undefined" !== effect.value ? effect.value : effect;
                    if (0 !== value) {
                        result = true;
                        break;
                    }
                }
                return self.callFilters("resultHasEffect", result, arguments);
            },
            willTransition: function(statusChange, hasEffect, posIn, posOut) {
                var self = this, result = false;
                if (!h.isVisible(self.dom.container)) result = false; else if ("none" !== statusChange && hasEffect || posIn.x !== posOut.x || posIn.y !== posOut.y) result = true; else if (self.config.animation.animateResizeTargets) result = posIn.width !== posOut.width || posIn.height !== posOut.height || posIn.marginRight !== posOut.marginRight || posIn.marginTop !== posOut.marginTop; else result = false;
                return self.callFilters("resultWillTransition", result, arguments);
            },
            checkProgress: function(operation) {
                var self = this;
                self.targetsDone++;
                if (self.targetsBound === self.targetsDone) self.cleanUp(operation);
            },
            cleanUp: function(operation) {
                var self = this, target = null, whitespaceBefore = null, whitespaceAfter = null, nextInQueue = null, i = -1;
                self.callActions("beforeCleanUp", arguments);
                self.targetsMoved = self.targetsImmovable = self.targetsBound = self.targetsDone = 0;
                for (i = 0; target = operation.show[i]; i++) {
                    target.cleanUp();
                    target.show();
                }
                for (i = 0; target = operation.toHide[i]; i++) {
                    target.cleanUp();
                    target.hide();
                }
                if (operation.willSort) self.printSort(false, operation);
                self.dom.parent.style[mixitup.features.transitionProp] = self.dom.parent.style.height = self.dom.parent.style.width = self.dom.parent.style.overflow = self.dom.parent.style[mixitup.features.perspectiveProp] = self.dom.parent.style[mixitup.features.perspectiveOriginProp] = "";
                if (operation.willChangeLayout) {
                    h.removeClass(self.dom.container, operation.startContainerClassName);
                    h.addClass(self.dom.container, operation.newContainerClassName);
                }
                if (operation.toRemove.length) {
                    for (i = 0; target = self.targets[i]; i++) if (operation.toRemove.indexOf(target) > -1) {
                        if ((whitespaceBefore = target.dom.el.previousSibling) && "#text" === whitespaceBefore.nodeName && (whitespaceAfter = target.dom.el.nextSibling) && "#text" === whitespaceAfter.nodeName) h.removeWhitespace(whitespaceBefore);
                        if (!operation.willSort) self.dom.parent.removeChild(target.dom.el);
                        self.targets.splice(i, 1);
                        target.isInDom = false;
                        i--;
                    }
                    self.origOrder = self.targets;
                }
                if (operation.willSort) self.targets = operation.newOrder;
                self.state = operation.newState;
                self.lastOperation = operation;
                self.dom.targets = self.state.targets;
                mixitup.events.fire("mixEnd", self.dom.container, {
                    state: self.state,
                    instance: self
                }, self.dom.document);
                if ("function" === typeof self.config.callbacks.onMixEnd) self.config.callbacks.onMixEnd.call(self.dom.container, self.state, self);
                if (operation.hasFailed) {
                    mixitup.events.fire("mixFail", self.dom.container, {
                        state: self.state,
                        instance: self
                    }, self.dom.document);
                    if ("function" === typeof self.config.callbacks.onMixFail) self.config.callbacks.onMixFail.call(self.dom.container, self.state, self);
                    h.addClass(self.dom.container, h.getClassname(self.config.classNames, "container", self.config.classNames.modifierFailed));
                }
                if ("function" === typeof self.userCallback) self.userCallback.call(self.dom.container, self.state, self);
                if ("function" === typeof self.userDeferred.resolve) self.userDeferred.resolve(self.state);
                self.userCallback = null;
                self.userDeferred = null;
                self.lastClicked = null;
                self.isToggling = false;
                self.isBusy = false;
                if (self.queue.length) {
                    self.callActions("beforeReadQueueCleanUp", arguments);
                    nextInQueue = self.queue.shift();
                    self.userDeferred = nextInQueue.deferred;
                    self.isToggling = nextInQueue.isToggling;
                    self.lastClicked = nextInQueue.triggerElement;
                    if (nextInQueue.instruction.command instanceof mixitup.CommandMultimix) self.multimix.apply(self, nextInQueue.args); else self.dataset.apply(self, nextInQueue.args);
                }
                self.callActions("afterCleanUp", arguments);
            },
            parseMultimixArgs: function(args) {
                var self = this, instruction = new mixitup.UserInstruction, arg = null, i = -1;
                instruction.animate = self.config.animation.enable;
                instruction.command = new mixitup.CommandMultimix;
                for (i = 0; i < args.length; i++) {
                    arg = args[i];
                    if (null === arg) continue;
                    if ("object" === typeof arg) h.extend(instruction.command, arg); else if ("boolean" === typeof arg) instruction.animate = arg; else if ("function" === typeof arg) instruction.callback = arg;
                }
                if (instruction.command.insert && !(instruction.command.insert instanceof mixitup.CommandInsert)) instruction.command.insert = self.parseInsertArgs([ instruction.command.insert ]).command;
                if (instruction.command.remove && !(instruction.command.remove instanceof mixitup.CommandRemove)) instruction.command.remove = self.parseRemoveArgs([ instruction.command.remove ]).command;
                if (instruction.command.filter && !(instruction.command.filter instanceof mixitup.CommandFilter)) instruction.command.filter = self.parseFilterArgs([ instruction.command.filter ]).command;
                if (instruction.command.sort && !(instruction.command.sort instanceof mixitup.CommandSort)) instruction.command.sort = self.parseSortArgs([ instruction.command.sort ]).command;
                if (instruction.command.changeLayout && !(instruction.command.changeLayout instanceof mixitup.CommandChangeLayout)) instruction.command.changeLayout = self.parseChangeLayoutArgs([ instruction.command.changeLayout ]).command;
                instruction = self.callFilters("instructionParseMultimixArgs", instruction, arguments);
                h.freeze(instruction);
                return instruction;
            },
            parseFilterArgs: function(args) {
                var self = this, instruction = new mixitup.UserInstruction, arg = null, i = -1;
                instruction.animate = self.config.animation.enable;
                instruction.command = new mixitup.CommandFilter;
                for (i = 0; i < args.length; i++) {
                    arg = args[i];
                    if ("string" === typeof arg) instruction.command.selector = arg; else if (null === arg) instruction.command.collection = []; else if ("object" === typeof arg && h.isElement(arg, self.dom.document)) instruction.command.collection = [ arg ]; else if ("object" === typeof arg && "undefined" !== typeof arg.length) instruction.command.collection = h.arrayFromList(arg); else if ("object" === typeof arg) h.extend(instruction.command, arg); else if ("boolean" === typeof arg) instruction.animate = arg; else if ("function" === typeof arg) instruction.callback = arg;
                }
                if (instruction.command.selector && instruction.command.collection) throw new Error(mixitup.messages.errorFilterInvalidArguments());
                instruction = self.callFilters("instructionParseFilterArgs", instruction, arguments);
                h.freeze(instruction);
                return instruction;
            },
            parseSortArgs: function(args) {
                var self = this, instruction = new mixitup.UserInstruction, arg = null, sortString = "", i = -1;
                instruction.animate = self.config.animation.enable;
                instruction.command = new mixitup.CommandSort;
                for (i = 0; i < args.length; i++) {
                    arg = args[i];
                    if (null === arg) continue;
                    switch (typeof arg) {
                      case "string":
                        sortString = arg;
                        break;

                      case "object":
                        if (arg.length) instruction.command.collection = h.arrayFromList(arg);
                        break;

                      case "boolean":
                        instruction.animate = arg;
                        break;

                      case "function":
                        instruction.callback = arg;
                        break;
                    }
                }
                if (sortString) instruction.command = self.parseSortString(sortString, instruction.command);
                instruction = self.callFilters("instructionParseSortArgs", instruction, arguments);
                h.freeze(instruction);
                return instruction;
            },
            parseInsertArgs: function(args) {
                var self = this, instruction = new mixitup.UserInstruction, arg = null, i = -1;
                instruction.animate = self.config.animation.enable;
                instruction.command = new mixitup.CommandInsert;
                for (i = 0; i < args.length; i++) {
                    arg = args[i];
                    if (null === arg) continue;
                    if ("number" === typeof arg) instruction.command.index = arg; else if ("string" === typeof arg && [ "before", "after" ].indexOf(arg) > -1) instruction.command.position = arg; else if ("string" === typeof arg) instruction.command.collection = h.arrayFromList(h.createElement(arg).childNodes); else if ("object" === typeof arg && h.isElement(arg, self.dom.document)) !instruction.command.collection.length ? instruction.command.collection = [ arg ] : instruction.command.sibling = arg; else if ("object" === typeof arg && arg.length) !instruction.command.collection.length ? instruction.command.collection = arg : instruction.command.sibling = arg[0]; else if ("object" === typeof arg && arg.childNodes && arg.childNodes.length) !instruction.command.collection.length ? instruction.command.collection = h.arrayFromList(arg.childNodes) : instruction.command.sibling = arg.childNodes[0]; else if ("object" === typeof arg) h.extend(instruction.command, arg); else if ("boolean" === typeof arg) instruction.animate = arg; else if ("function" === typeof arg) instruction.callback = arg;
                }
                if (instruction.command.index && instruction.command.sibling) throw new Error(mixitup.messages.errorInsertInvalidArguments());
                if (!instruction.command.collection.length && self.config.debug.showWarnings) console.warn(mixitup.messages.warningInsertNoElements());
                instruction = self.callFilters("instructionParseInsertArgs", instruction, arguments);
                h.freeze(instruction);
                return instruction;
            },
            parseRemoveArgs: function(args) {
                var self = this, instruction = new mixitup.UserInstruction, target = null, arg = null, i = -1;
                instruction.animate = self.config.animation.enable;
                instruction.command = new mixitup.CommandRemove;
                for (i = 0; i < args.length; i++) {
                    arg = args[i];
                    if (null === arg) continue;
                    switch (typeof arg) {
                      case "number":
                        if (self.targets[arg]) instruction.command.targets[0] = self.targets[arg];
                        break;

                      case "string":
                        instruction.command.collection = h.arrayFromList(self.dom.parent.querySelectorAll(arg));
                        break;

                      case "object":
                        if (arg && arg.length) instruction.command.collection = arg; else if (h.isElement(arg, self.dom.document)) instruction.command.collection = [ arg ]; else h.extend(instruction.command, arg);
                        break;

                      case "boolean":
                        instruction.animate = arg;
                        break;

                      case "function":
                        instruction.callback = arg;
                        break;
                    }
                }
                if (instruction.command.collection.length) for (i = 0; target = self.targets[i]; i++) if (instruction.command.collection.indexOf(target.dom.el) > -1) instruction.command.targets.push(target);
                if (!instruction.command.targets.length && self.config.debug.showWarnings) console.warn(mixitup.messages.warningRemoveNoElements());
                h.freeze(instruction);
                return instruction;
            },
            parseDatasetArgs: function(args) {
                var self = this, instruction = new mixitup.UserInstruction, arg = null, i = -1;
                instruction.animate = self.config.animation.enable;
                instruction.command = new mixitup.CommandDataset;
                for (i = 0; i < args.length; i++) {
                    arg = args[i];
                    if (null === arg) continue;
                    switch (typeof arg) {
                      case "object":
                        if (Array.isArray(arg) || "number" === typeof arg.length) instruction.command.dataset = arg; else h.extend(instruction.command, arg);
                        break;

                      case "boolean":
                        instruction.animate = arg;
                        break;

                      case "function":
                        instruction.callback = arg;
                        break;
                    }
                }
                h.freeze(instruction);
                return instruction;
            },
            parseChangeLayoutArgs: function(args) {
                var self = this, instruction = new mixitup.UserInstruction, arg = null, i = -1;
                instruction.animate = self.config.animation.enable;
                instruction.command = new mixitup.CommandChangeLayout;
                for (i = 0; i < args.length; i++) {
                    arg = args[i];
                    if (null === arg) continue;
                    switch (typeof arg) {
                      case "string":
                        instruction.command.containerClassName = arg;
                        break;

                      case "object":
                        h.extend(instruction.command, arg);
                        break;

                      case "boolean":
                        instruction.animate = arg;
                        break;

                      case "function":
                        instruction.callback = arg;
                        break;
                    }
                }
                h.freeze(instruction);
                return instruction;
            },
            queueMix: function(queueItem) {
                var self = this, deferred = null, toggleSelector = "";
                self.callActions("beforeQueueMix", arguments);
                deferred = h.defer(mixitup.libraries);
                if (self.config.animation.queue && self.queue.length < self.config.animation.queueLimit) {
                    queueItem.deferred = deferred;
                    self.queue.push(queueItem);
                    if (self.config.controls.enable) if (self.isToggling) {
                        self.buildToggleArray(queueItem.instruction.command);
                        toggleSelector = self.getToggleSelector();
                        self.updateControls({
                            filter: {
                                selector: toggleSelector
                            }
                        });
                    } else self.updateControls(queueItem.instruction.command);
                } else {
                    if (self.config.debug.showWarnings) console.warn(mixitup.messages.warningMultimixInstanceQueueFull());
                    deferred.resolve(self.state);
                    mixitup.events.fire("mixBusy", self.dom.container, {
                        state: self.state,
                        instance: self
                    }, self.dom.document);
                    if ("function" === typeof self.config.callbacks.onMixBusy) self.config.callbacks.onMixBusy.call(self.dom.container, self.state, self);
                }
                return self.callFilters("promiseQueueMix", deferred.promise, arguments);
            },
            getDataOperation: function(newDataset) {
                var self = this, operation = new mixitup.Operation, startDataset = [];
                operation = self.callFilters("operationUnmappedGetDataOperation", operation, arguments);
                if (self.dom.targets.length && !(startDataset = self.state.activeDataset || []).length) throw new Error(mixitup.messages.errorDatasetNotSet());
                operation.id = h.randomHex();
                operation.startState = self.state;
                operation.startDataset = startDataset;
                operation.newDataset = newDataset.slice();
                self.diffDatasets(operation);
                operation.startOrder = self.targets;
                operation.newOrder = operation.show;
                if (self.config.animation.enable) {
                    self.getStartMixData(operation);
                    self.setInter(operation);
                    operation.docState = h.getDocumentState(self.dom.document);
                    self.getInterMixData(operation);
                    self.setFinal(operation);
                    self.getFinalMixData(operation);
                    self.parseEffects();
                    operation.hasEffect = self.hasEffect();
                    self.getTweenData(operation);
                }
                self.targets = operation.show.slice();
                operation.newState = self.buildState(operation);
                Array.prototype.push.apply(self.targets, operation.toRemove);
                operation = self.callFilters("operationMappedGetDataOperation", operation, arguments);
                return operation;
            },
            diffDatasets: function(operation) {
                var self = this, persistantStartIds = [], persistantNewIds = [], insertedTargets = [], data = null, target = null, el = null, frag = null, nextEl = null, uids = {}, id = "", i = -1;
                self.callActions("beforeDiffDatasets", arguments);
                for (i = 0; data = operation.newDataset[i]; i++) {
                    if ("undefined" === typeof (id = data[self.config.data.uidKey]) || id.toString().length < 1) throw new TypeError(mixitup.messages.errorDatasetInvalidUidKey({
                        uidKey: self.config.data.uidKey
                    }));
                    if (!uids[id]) uids[id] = true; else throw new Error(mixitup.messages.errorDatasetDuplicateUid({
                        uid: id
                    }));
                    if ((target = self.cache[id]) instanceof mixitup.Target) {
                        if (self.config.data.dirtyCheck && !h.deepEquals(data, target.data)) {
                            el = target.render(data);
                            target.data = data;
                            if (el !== target.dom.el) {
                                if (target.isInDom) {
                                    target.unbindEvents();
                                    self.dom.parent.replaceChild(el, target.dom.el);
                                }
                                if (!target.isShown) el.style.display = "none";
                                target.dom.el = el;
                                if (target.isInDom) target.bindEvents();
                            }
                        }
                        el = target.dom.el;
                    } else {
                        target = new mixitup.Target;
                        target.init(null, self, data);
                        target.hide();
                    }
                    if (!target.isInDom) {
                        if (!frag) frag = self.dom.document.createDocumentFragment();
                        if (frag.lastElementChild) frag.appendChild(self.dom.document.createTextNode(" "));
                        frag.appendChild(target.dom.el);
                        target.isInDom = true;
                        target.unbindEvents();
                        target.bindEvents();
                        target.hide();
                        operation.toShow.push(target);
                        insertedTargets.push(target);
                    } else {
                        nextEl = target.dom.el.nextElementSibling;
                        persistantNewIds.push(id);
                        if (frag) {
                            if (frag.lastElementChild) frag.appendChild(self.dom.document.createTextNode(" "));
                            self.insertDatasetFrag(frag, target.dom.el, insertedTargets);
                            frag = null;
                        }
                    }
                    operation.show.push(target);
                }
                if (frag) {
                    nextEl = nextEl || self.config.layout.siblingAfter;
                    if (nextEl) frag.appendChild(self.dom.document.createTextNode(" "));
                    self.insertDatasetFrag(frag, nextEl, insertedTargets);
                }
                for (i = 0; data = operation.startDataset[i]; i++) {
                    id = data[self.config.data.uidKey];
                    target = self.cache[id];
                    if (operation.show.indexOf(target) < 0) {
                        operation.hide.push(target);
                        operation.toHide.push(target);
                        operation.toRemove.push(target);
                    } else persistantStartIds.push(id);
                }
                if (!h.isEqualArray(persistantStartIds, persistantNewIds)) operation.willSort = true;
                self.callActions("afterDiffDatasets", arguments);
            },
            insertDatasetFrag: function(frag, nextEl, targets) {
                var self = this;
                var insertAt = nextEl ? h.arrayFromList(self.dom.parent.children).indexOf(nextEl) : self.targets.length;
                self.dom.parent.insertBefore(frag, nextEl);
                while (targets.length) {
                    self.targets.splice(insertAt, 0, targets.shift());
                    insertAt++;
                }
            },
            willSort: function(sortCommandA, sortCommandB) {
                var self = this, result = false;
                if (self.config.behavior.liveSort || "random" === sortCommandA.order || sortCommandA.attribute !== sortCommandB.attribute || sortCommandA.order !== sortCommandB.order || sortCommandA.collection !== sortCommandB.collection || null === sortCommandA.next && sortCommandB.next || sortCommandA.next && null === sortCommandB.next) result = true; else if (sortCommandA.next && sortCommandB.next) result = self.willSort(sortCommandA.next, sortCommandB.next); else result = false;
                return self.callFilters("resultWillSort", result, arguments);
            },
            show: function() {
                var self = this;
                return self.filter("all");
            },
            hide: function() {
                var self = this;
                return self.filter("none");
            },
            isMixing: function() {
                var self = this;
                return self.isBusy;
            },
            filter: function() {
                var self = this, instruction = self.parseFilterArgs(arguments);
                return self.multimix({
                    filter: instruction.command
                }, instruction.animate, instruction.callback);
            },
            toggleOn: function() {
                var self = this, instruction = self.parseFilterArgs(arguments), selector = instruction.command.selector, toggleSelector = "";
                self.isToggling = true;
                if (self.toggleArray.indexOf(selector) < 0) self.toggleArray.push(selector);
                toggleSelector = self.getToggleSelector();
                return self.multimix({
                    filter: toggleSelector
                }, instruction.animate, instruction.callback);
            },
            toggleOff: function() {
                var self = this, instruction = self.parseFilterArgs(arguments), selector = instruction.command.selector, selectorIndex = self.toggleArray.indexOf(selector), toggleSelector = "";
                self.isToggling = true;
                if (selectorIndex > -1) self.toggleArray.splice(selectorIndex, 1);
                toggleSelector = self.getToggleSelector();
                return self.multimix({
                    filter: toggleSelector
                }, instruction.animate, instruction.callback);
            },
            sort: function() {
                var self = this, instruction = self.parseSortArgs(arguments);
                return self.multimix({
                    sort: instruction.command
                }, instruction.animate, instruction.callback);
            },
            changeLayout: function() {
                var self = this, instruction = self.parseChangeLayoutArgs(arguments);
                return self.multimix({
                    changeLayout: instruction.command
                }, instruction.animate, instruction.callback);
            },
            dataset: function() {
                var self = this, instruction = self.parseDatasetArgs(arguments), operation = null, queueItem = null, animate = false;
                self.callActions("beforeDataset", arguments);
                if (!self.isBusy) {
                    if (instruction.callback) self.userCallback = instruction.callback;
                    animate = instruction.animate ^ self.config.animation.enable ? instruction.animate : self.config.animation.enable;
                    operation = self.getDataOperation(instruction.command.dataset);
                    return self.goMix(animate, operation);
                } else {
                    queueItem = new mixitup.QueueItem;
                    queueItem.args = arguments;
                    queueItem.instruction = instruction;
                    return self.queueMix(queueItem);
                }
            },
            multimix: function() {
                var self = this, operation = null, animate = false, queueItem = null, instruction = self.parseMultimixArgs(arguments);
                self.callActions("beforeMultimix", arguments);
                if (!self.isBusy) {
                    operation = self.getOperation(instruction.command);
                    if (self.config.controls.enable) {
                        if (instruction.command.filter && !self.isToggling) {
                            self.toggleArray.length = 0;
                            self.buildToggleArray(operation.command);
                        }
                        if (self.queue.length < 1) self.updateControls(operation.command);
                    }
                    if (instruction.callback) self.userCallback = instruction.callback;
                    animate = instruction.animate ^ self.config.animation.enable ? instruction.animate : self.config.animation.enable;
                    self.callFilters("operationMultimix", operation, arguments);
                    return self.goMix(animate, operation);
                } else {
                    queueItem = new mixitup.QueueItem;
                    queueItem.args = arguments;
                    queueItem.instruction = instruction;
                    queueItem.triggerElement = self.lastClicked;
                    queueItem.isToggling = self.isToggling;
                    return self.queueMix(queueItem);
                }
            },
            getOperation: function(multimixCommand) {
                var self = this, sortCommand = multimixCommand.sort, filterCommand = multimixCommand.filter, changeLayoutCommand = multimixCommand.changeLayout, removeCommand = multimixCommand.remove, insertCommand = multimixCommand.insert, operation = new mixitup.Operation;
                operation = self.callFilters("operationUnmappedGetOperation", operation, arguments);
                operation.id = h.randomHex();
                operation.command = multimixCommand;
                operation.startState = self.state;
                operation.triggerElement = self.lastClicked;
                if (self.isBusy) {
                    if (self.config.debug.showWarnings) console.warn(mixitup.messages.warningGetOperationInstanceBusy());
                    return null;
                }
                if (insertCommand) self.insertTargets(insertCommand, operation);
                if (removeCommand) operation.toRemove = removeCommand.targets;
                operation.startSort = operation.newSort = operation.startState.activeSort;
                operation.startOrder = operation.newOrder = self.targets;
                if (sortCommand) {
                    operation.startSort = operation.startState.activeSort;
                    operation.newSort = sortCommand;
                    operation.willSort = self.willSort(sortCommand, operation.startState.activeSort);
                    if (operation.willSort) self.sortOperation(operation);
                }
                operation.startFilter = operation.startState.activeFilter;
                if (filterCommand) operation.newFilter = filterCommand; else operation.newFilter = h.extend(new mixitup.CommandFilter, operation.startFilter);
                if ("all" === operation.newFilter.selector) operation.newFilter.selector = self.config.selectors.target; else if ("none" === operation.newFilter.selector) operation.newFilter.selector = "";
                self.filterOperation(operation);
                operation.startContainerClassName = operation.startState.activeContainerClassName;
                if (changeLayoutCommand) {
                    operation.newContainerClassName = changeLayoutCommand.containerClassName;
                    if (operation.newContainerClassName !== operation.startContainerClassName) operation.willChangeLayout = true;
                } else operation.newContainerClassName = operation.startContainerClassName;
                if (self.config.animation.enable) {
                    self.getStartMixData(operation);
                    self.setInter(operation);
                    operation.docState = h.getDocumentState(self.dom.document);
                    self.getInterMixData(operation);
                    self.setFinal(operation);
                    self.getFinalMixData(operation);
                    self.parseEffects();
                    operation.hasEffect = self.hasEffect();
                    self.getTweenData(operation);
                }
                if (operation.willSort) self.targets = operation.newOrder;
                operation.newState = self.buildState(operation);
                return self.callFilters("operationMappedGetOperation", operation, arguments);
            },
            tween: function(operation, multiplier) {
                var target = null, posData = null, toHideIndex = -1, i = -1;
                multiplier = Math.min(multiplier, 1);
                multiplier = Math.max(multiplier, 0);
                for (i = 0; target = operation.show[i]; i++) {
                    posData = operation.showPosData[i];
                    target.applyTween(posData, multiplier);
                }
                for (i = 0; target = operation.hide[i]; i++) {
                    if (target.isShown) target.hide();
                    if ((toHideIndex = operation.toHide.indexOf(target)) > -1) {
                        posData = operation.toHidePosData[toHideIndex];
                        if (!target.isShown) target.show();
                        target.applyTween(posData, multiplier);
                    }
                }
            },
            insert: function() {
                var self = this, args = self.parseInsertArgs(arguments);
                return self.multimix({
                    insert: args.command
                }, args.animate, args.callback);
            },
            insertBefore: function() {
                var self = this, args = self.parseInsertArgs(arguments);
                return self.insert(args.command.collection, "before", args.command.sibling, args.animate, args.callback);
            },
            insertAfter: function() {
                var self = this, args = self.parseInsertArgs(arguments);
                return self.insert(args.command.collection, "after", args.command.sibling, args.animate, args.callback);
            },
            prepend: function() {
                var self = this, args = self.parseInsertArgs(arguments);
                return self.insert(0, args.command.collection, args.animate, args.callback);
            },
            append: function() {
                var self = this, args = self.parseInsertArgs(arguments);
                return self.insert(self.state.totalTargets, args.command.collection, args.animate, args.callback);
            },
            remove: function() {
                var self = this, args = self.parseRemoveArgs(arguments);
                return self.multimix({
                    remove: args.command
                }, args.animate, args.callback);
            },
            getConfig: function(stringKey) {
                var self = this, value = null;
                if (!stringKey) value = self.config; else value = h.getProperty(self.config, stringKey);
                return self.callFilters("valueGetConfig", value, arguments);
            },
            configure: function(config) {
                var self = this;
                self.callActions("beforeConfigure", arguments);
                h.extend(self.config, config, true, true);
                self.callActions("afterConfigure", arguments);
            },
            getState: function() {
                var self = this, state = null;
                state = new mixitup.State;
                h.extend(state, self.state);
                h.freeze(state);
                return self.callFilters("stateGetState", state, arguments);
            },
            forceRefresh: function() {
                var self = this;
                self.indexTargets();
            },
            forceRender: function() {
                var self = this, target = null, el = null, id = "";
                for (id in self.cache) {
                    target = self.cache[id];
                    el = target.render(target.data);
                    if (el !== target.dom.el) {
                        if (target.isInDom) {
                            target.unbindEvents();
                            self.dom.parent.replaceChild(el, target.dom.el);
                        }
                        if (!target.isShown) el.style.display = "none";
                        target.dom.el = el;
                        if (target.isInDom) target.bindEvents();
                    }
                }
                self.state = self.buildState(self.lastOperation);
            },
            destroy: function(cleanUp) {
                var self = this, control = null, target = null, i = 0;
                self.callActions("beforeDestroy", arguments);
                for (i = 0; control = self.controls[i]; i++) control.removeBinding(self);
                for (i = 0; target = self.targets[i]; i++) {
                    if (cleanUp) target.show();
                    target.unbindEvents();
                }
                if (self.dom.container.id.match(/^MixItUp/)) self.dom.container.removeAttribute("id");
                delete mixitup.instances[self.id];
                self.callActions("afterDestroy", arguments);
            }
        });
        mixitup.IMoveData = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.posIn = null;
            this.posOut = null;
            this.operation = null;
            this.callback = null;
            this.statusChange = "";
            this.duration = -1;
            this.staggerIndex = -1;
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.IMoveData);
        mixitup.IMoveData.prototype = Object.create(mixitup.Base.prototype);
        mixitup.IMoveData.prototype.constructor = mixitup.IMoveData;
        mixitup.TargetDom = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.el = null;
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.TargetDom);
        mixitup.TargetDom.prototype = Object.create(mixitup.Base.prototype);
        mixitup.TargetDom.prototype.constructor = mixitup.TargetDom;
        mixitup.Target = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.id = "";
            this.sortString = "";
            this.mixer = null;
            this.callback = null;
            this.isShown = false;
            this.isBound = false;
            this.isExcluded = false;
            this.isInDom = false;
            this.handler = null;
            this.operation = null;
            this.data = null;
            this.dom = new mixitup.TargetDom;
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.Target);
        mixitup.Target.prototype = Object.create(mixitup.Base.prototype);
        h.extend(mixitup.Target.prototype, {
            constructor: mixitup.Target,
            init: function(el, mixer, data) {
                var self = this, id = "";
                self.callActions("beforeInit", arguments);
                self.mixer = mixer;
                if (!el) el = self.render(data);
                self.cacheDom(el);
                self.bindEvents();
                if ("none" !== self.dom.el.style.display) self.isShown = true;
                if (data && mixer.config.data.uidKey) {
                    if ("undefined" === typeof (id = data[mixer.config.data.uidKey]) || id.toString().length < 1) throw new TypeError(mixitup.messages.errorDatasetInvalidUidKey({
                        uidKey: mixer.config.data.uidKey
                    }));
                    self.id = id;
                    self.data = data;
                    mixer.cache[id] = self;
                }
                self.callActions("afterInit", arguments);
            },
            render: function(data) {
                var self = this, render = null, el = null, temp = null, output = "";
                self.callActions("beforeRender", arguments);
                render = self.callFilters("renderRender", self.mixer.config.render.target, arguments);
                if ("function" !== typeof render) throw new TypeError(mixitup.messages.errorDatasetRendererNotSet());
                output = render(data);
                if (output && "object" === typeof output && h.isElement(output)) el = output; else if ("string" === typeof output) {
                    temp = document.createElement("div");
                    temp.innerHTML = output;
                    el = temp.firstElementChild;
                }
                return self.callFilters("elRender", el, arguments);
            },
            cacheDom: function(el) {
                var self = this;
                self.callActions("beforeCacheDom", arguments);
                self.dom.el = el;
                self.callActions("afterCacheDom", arguments);
            },
            getSortString: function(attributeName) {
                var self = this, value = self.dom.el.getAttribute("data-" + attributeName) || "";
                self.callActions("beforeGetSortString", arguments);
                value = isNaN(1 * value) ? value.toLowerCase() : 1 * value;
                self.sortString = value;
                self.callActions("afterGetSortString", arguments);
            },
            show: function() {
                var self = this;
                self.callActions("beforeShow", arguments);
                if (!self.isShown) {
                    self.dom.el.style.display = "";
                    self.isShown = true;
                }
                self.callActions("afterShow", arguments);
            },
            hide: function() {
                var self = this;
                self.callActions("beforeHide", arguments);
                if (self.isShown) {
                    self.dom.el.style.display = "none";
                    self.isShown = false;
                }
                self.callActions("afterHide", arguments);
            },
            move: function(moveData) {
                var self = this;
                self.callActions("beforeMove", arguments);
                if (!self.isExcluded) self.mixer.targetsMoved++;
                self.applyStylesIn(moveData);
                requestAnimationFrame((function() {
                    self.applyStylesOut(moveData);
                }));
                self.callActions("afterMove", arguments);
            },
            applyTween: function(posData, multiplier) {
                var self = this, propertyName = "", tweenData = null, posIn = posData.posIn, currentTransformValues = [], currentValues = new mixitup.StyleData, i = -1;
                self.callActions("beforeApplyTween", arguments);
                currentValues.x = posIn.x;
                currentValues.y = posIn.y;
                if (0 === multiplier) self.hide(); else if (!self.isShown) self.show();
                for (i = 0; propertyName = mixitup.features.TWEENABLE[i]; i++) {
                    tweenData = posData.tweenData[propertyName];
                    if ("x" === propertyName) {
                        if (!tweenData) continue;
                        currentValues.x = posIn.x + tweenData * multiplier;
                    } else if ("y" === propertyName) {
                        if (!tweenData) continue;
                        currentValues.y = posIn.y + tweenData * multiplier;
                    } else if (tweenData instanceof mixitup.TransformData) {
                        if (!tweenData.value) continue;
                        currentValues[propertyName].value = posIn[propertyName].value + tweenData.value * multiplier;
                        currentValues[propertyName].unit = tweenData.unit;
                        currentTransformValues.push(propertyName + "(" + currentValues[propertyName].value + tweenData.unit + ")");
                    } else {
                        if (!tweenData) continue;
                        currentValues[propertyName] = posIn[propertyName] + tweenData * multiplier;
                        self.dom.el.style[propertyName] = currentValues[propertyName];
                    }
                }
                if (currentValues.x || currentValues.y) currentTransformValues.unshift("translate(" + currentValues.x + "px, " + currentValues.y + "px)");
                if (currentTransformValues.length) self.dom.el.style[mixitup.features.transformProp] = currentTransformValues.join(" ");
                self.callActions("afterApplyTween", arguments);
            },
            applyStylesIn: function(moveData) {
                var self = this, posIn = moveData.posIn, isFading = 1 !== self.mixer.effectsIn.opacity, transformValues = [];
                self.callActions("beforeApplyStylesIn", arguments);
                transformValues.push("translate(" + posIn.x + "px, " + posIn.y + "px)");
                if (self.mixer.config.animation.animateResizeTargets) {
                    if ("show" !== moveData.statusChange) {
                        self.dom.el.style.width = posIn.width + "px";
                        self.dom.el.style.height = posIn.height + "px";
                    }
                    self.dom.el.style.marginRight = posIn.marginRight + "px";
                    self.dom.el.style.marginBottom = posIn.marginBottom + "px";
                }
                isFading && (self.dom.el.style.opacity = posIn.opacity);
                if ("show" === moveData.statusChange) transformValues = transformValues.concat(self.mixer.transformIn);
                self.dom.el.style[mixitup.features.transformProp] = transformValues.join(" ");
                self.callActions("afterApplyStylesIn", arguments);
            },
            applyStylesOut: function(moveData) {
                var self = this, transitionRules = [], transformValues = [], isResizing = self.mixer.config.animation.animateResizeTargets, isFading = "undefined" !== typeof self.mixer.effectsIn.opacity;
                self.callActions("beforeApplyStylesOut", arguments);
                transitionRules.push(self.writeTransitionRule(mixitup.features.transformRule, moveData.staggerIndex));
                if ("none" !== moveData.statusChange) transitionRules.push(self.writeTransitionRule("opacity", moveData.staggerIndex, moveData.duration));
                if (isResizing) {
                    transitionRules.push(self.writeTransitionRule("width", moveData.staggerIndex, moveData.duration));
                    transitionRules.push(self.writeTransitionRule("height", moveData.staggerIndex, moveData.duration));
                    transitionRules.push(self.writeTransitionRule("margin", moveData.staggerIndex, moveData.duration));
                }
                if (!moveData.callback) {
                    self.mixer.targetsImmovable++;
                    if (self.mixer.targetsMoved === self.mixer.targetsImmovable) self.mixer.cleanUp(moveData.operation);
                    return;
                }
                self.operation = moveData.operation;
                self.callback = moveData.callback;
                !self.isExcluded && self.mixer.targetsBound++;
                self.isBound = true;
                self.applyTransition(transitionRules);
                if (isResizing && moveData.posOut.width > 0 && moveData.posOut.height > 0) {
                    self.dom.el.style.width = moveData.posOut.width + "px";
                    self.dom.el.style.height = moveData.posOut.height + "px";
                    self.dom.el.style.marginRight = moveData.posOut.marginRight + "px";
                    self.dom.el.style.marginBottom = moveData.posOut.marginBottom + "px";
                }
                if (!self.mixer.config.animation.nudge && "hide" === moveData.statusChange) transformValues.push("translate(" + moveData.posOut.x + "px, " + moveData.posOut.y + "px)");
                switch (moveData.statusChange) {
                  case "hide":
                    isFading && (self.dom.el.style.opacity = self.mixer.effectsOut.opacity);
                    transformValues = transformValues.concat(self.mixer.transformOut);
                    break;

                  case "show":
                    isFading && (self.dom.el.style.opacity = 1);
                }
                if (self.mixer.config.animation.nudge || !self.mixer.config.animation.nudge && "hide" !== moveData.statusChange) transformValues.push("translate(" + moveData.posOut.x + "px, " + moveData.posOut.y + "px)");
                self.dom.el.style[mixitup.features.transformProp] = transformValues.join(" ");
                self.callActions("afterApplyStylesOut", arguments);
            },
            writeTransitionRule: function(property, staggerIndex, duration) {
                var self = this, delay = self.getDelay(staggerIndex), rule = "";
                rule = property + " " + (duration > 0 ? duration : self.mixer.config.animation.duration) + "ms " + delay + "ms " + ("opacity" === property ? "linear" : self.mixer.config.animation.easing);
                return self.callFilters("ruleWriteTransitionRule", rule, arguments);
            },
            getDelay: function(index) {
                var self = this, delay = -1;
                if ("function" === typeof self.mixer.config.animation.staggerSequence) index = self.mixer.config.animation.staggerSequence.call(self, index, self.state);
                delay = !!self.mixer.staggerDuration ? index * self.mixer.staggerDuration : 0;
                return self.callFilters("delayGetDelay", delay, arguments);
            },
            applyTransition: function(rules) {
                var self = this, transitionString = rules.join(", ");
                self.callActions("beforeApplyTransition", arguments);
                self.dom.el.style[mixitup.features.transitionProp] = transitionString;
                self.callActions("afterApplyTransition", arguments);
            },
            handleTransitionEnd: function(e) {
                var self = this, propName = e.propertyName, canResize = self.mixer.config.animation.animateResizeTargets;
                self.callActions("beforeHandleTransitionEnd", arguments);
                if (self.isBound && e.target.matches(self.mixer.config.selectors.target) && (propName.indexOf("transform") > -1 || propName.indexOf("opacity") > -1 || canResize && propName.indexOf("height") > -1 || canResize && propName.indexOf("width") > -1 || canResize && propName.indexOf("margin") > -1)) {
                    self.callback.call(self, self.operation);
                    self.isBound = false;
                    self.callback = null;
                    self.operation = null;
                }
                self.callActions("afterHandleTransitionEnd", arguments);
            },
            eventBus: function(e) {
                var self = this;
                self.callActions("beforeEventBus", arguments);
                switch (e.type) {
                  case "webkitTransitionEnd":
                  case "transitionend":
                    self.handleTransitionEnd(e);
                }
                self.callActions("afterEventBus", arguments);
            },
            unbindEvents: function() {
                var self = this;
                self.callActions("beforeUnbindEvents", arguments);
                h.off(self.dom.el, "webkitTransitionEnd", self.handler);
                h.off(self.dom.el, "transitionend", self.handler);
                self.callActions("afterUnbindEvents", arguments);
            },
            bindEvents: function() {
                var self = this, transitionEndEvent = "";
                self.callActions("beforeBindEvents", arguments);
                transitionEndEvent = "webkit" === mixitup.features.transitionPrefix ? "webkitTransitionEnd" : "transitionend";
                self.handler = function(e) {
                    return self.eventBus(e);
                };
                h.on(self.dom.el, transitionEndEvent, self.handler);
                self.callActions("afterBindEvents", arguments);
            },
            getPosData: function(getBox) {
                var self = this, styles = {}, rect = null, posData = new mixitup.StyleData;
                self.callActions("beforeGetPosData", arguments);
                posData.x = self.dom.el.offsetLeft;
                posData.y = self.dom.el.offsetTop;
                if (self.mixer.config.animation.animateResizeTargets || getBox) {
                    rect = self.dom.el.getBoundingClientRect();
                    posData.top = rect.top;
                    posData.right = rect.right;
                    posData.bottom = rect.bottom;
                    posData.left = rect.left;
                    posData.width = rect.width;
                    posData.height = rect.height;
                }
                if (self.mixer.config.animation.animateResizeTargets) {
                    styles = window.getComputedStyle(self.dom.el);
                    posData.marginBottom = parseFloat(styles.marginBottom);
                    posData.marginRight = parseFloat(styles.marginRight);
                }
                return self.callFilters("posDataGetPosData", posData, arguments);
            },
            cleanUp: function() {
                var self = this;
                self.callActions("beforeCleanUp", arguments);
                self.dom.el.style[mixitup.features.transformProp] = "";
                self.dom.el.style[mixitup.features.transitionProp] = "";
                self.dom.el.style.opacity = "";
                if (self.mixer.config.animation.animateResizeTargets) {
                    self.dom.el.style.width = "";
                    self.dom.el.style.height = "";
                    self.dom.el.style.marginRight = "";
                    self.dom.el.style.marginBottom = "";
                }
                self.callActions("afterCleanUp", arguments);
            }
        });
        mixitup.Collection = function(instances) {
            var instance = null, i = -1;
            this.callActions("beforeConstruct");
            for (i = 0; instance = instances[i]; i++) this[i] = instance;
            this.length = instances.length;
            this.callActions("afterConstruct");
            h.freeze(this);
        };
        mixitup.BaseStatic.call(mixitup.Collection);
        mixitup.Collection.prototype = Object.create(mixitup.Base.prototype);
        h.extend(mixitup.Collection.prototype, {
            constructor: mixitup.Collection,
            mixitup: function(methodName) {
                var self = this, instance = null, args = Array.prototype.slice.call(arguments), tasks = [], i = -1;
                this.callActions("beforeMixitup");
                args.shift();
                for (i = 0; instance = self[i]; i++) tasks.push(instance[methodName].apply(instance, args));
                return self.callFilters("promiseMixitup", h.all(tasks, mixitup.libraries), arguments);
            }
        });
        mixitup.Operation = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.id = "";
            this.args = [];
            this.command = null;
            this.showPosData = [];
            this.toHidePosData = [];
            this.startState = null;
            this.newState = null;
            this.docState = null;
            this.willSort = false;
            this.willChangeLayout = false;
            this.hasEffect = false;
            this.hasFailed = false;
            this.triggerElement = null;
            this.show = [];
            this.hide = [];
            this.matching = [];
            this.toShow = [];
            this.toHide = [];
            this.toMove = [];
            this.toRemove = [];
            this.startOrder = [];
            this.newOrder = [];
            this.startSort = null;
            this.newSort = null;
            this.startFilter = null;
            this.newFilter = null;
            this.startDataset = null;
            this.newDataset = null;
            this.viewportDeltaX = 0;
            this.viewportDeltaY = 0;
            this.startX = 0;
            this.startY = 0;
            this.startHeight = 0;
            this.startWidth = 0;
            this.newX = 0;
            this.newY = 0;
            this.newHeight = 0;
            this.newWidth = 0;
            this.startContainerClassName = "";
            this.startDisplay = "";
            this.newContainerClassName = "";
            this.newDisplay = "";
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.Operation);
        mixitup.Operation.prototype = Object.create(mixitup.Base.prototype);
        mixitup.Operation.prototype.constructor = mixitup.Operation;
        mixitup.State = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.id = "";
            this.activeFilter = null;
            this.activeSort = null;
            this.activeContainerClassName = "";
            this.container = null;
            this.targets = [];
            this.hide = [];
            this.show = [];
            this.matching = [];
            this.totalTargets = -1;
            this.totalShow = -1;
            this.totalHide = -1;
            this.totalMatching = -1;
            this.hasFailed = false;
            this.triggerElement = null;
            this.activeDataset = null;
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.State);
        mixitup.State.prototype = Object.create(mixitup.Base.prototype);
        mixitup.State.prototype.constructor = mixitup.State;
        mixitup.UserInstruction = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.command = {};
            this.animate = false;
            this.callback = null;
            this.callActions("afterConstruct");
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.UserInstruction);
        mixitup.UserInstruction.prototype = Object.create(mixitup.Base.prototype);
        mixitup.UserInstruction.prototype.constructor = mixitup.UserInstruction;
        mixitup.Messages = function() {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct");
            this.ERROR_FACTORY_INVALID_CONTAINER = "[MixItUp] An invalid selector or element reference was passed to the mixitup factory function";
            this.ERROR_FACTORY_CONTAINER_NOT_FOUND = "[MixItUp] The provided selector yielded no container element";
            this.ERROR_CONFIG_INVALID_ANIMATION_EFFECTS = "[MixItUp] Invalid value for `animation.effects`";
            this.ERROR_CONFIG_INVALID_CONTROLS_SCOPE = "[MixItUp] Invalid value for `controls.scope`";
            this.ERROR_CONFIG_INVALID_PROPERTY = '[MixitUp] Invalid configuration object property "${erroneous}"${suggestion}';
            this.ERROR_CONFIG_INVALID_PROPERTY_SUGGESTION = '. Did you mean "${probableMatch}"?';
            this.ERROR_CONFIG_DATA_UID_KEY_NOT_SET = "[MixItUp] To use the dataset API, a UID key must be specified using `data.uidKey`";
            this.ERROR_DATASET_INVALID_UID_KEY = '[MixItUp] The specified UID key "${uidKey}" is not present on one or more dataset items';
            this.ERROR_DATASET_DUPLICATE_UID = '[MixItUp] The UID "${uid}" was found on two or more dataset items. UIDs must be unique.';
            this.ERROR_INSERT_INVALID_ARGUMENTS = "[MixItUp] Please provider either an index or a sibling and position to insert, not both";
            this.ERROR_INSERT_PREEXISTING_ELEMENT = "[MixItUp] An element to be inserted already exists in the container";
            this.ERROR_FILTER_INVALID_ARGUMENTS = "[MixItUp] Please provide either a selector or collection `.filter()`, not both";
            this.ERROR_DATASET_NOT_SET = "[MixItUp] To use the dataset API with pre-rendered targets, a starting dataset must be set using `load.dataset`";
            this.ERROR_DATASET_PRERENDERED_MISMATCH = "[MixItUp] `load.dataset` does not match pre-rendered targets";
            this.ERROR_DATASET_RENDERER_NOT_SET = "[MixItUp] To insert an element via the dataset API, a target renderer function must be provided to `render.target`";
            this.ERROR_SORT_NON_EXISTENT_ELEMENT = "[MixItUp] An element to be sorted does not already exist in the container";
            this.WARNING_FACTORY_PREEXISTING_INSTANCE = "[MixItUp] WARNING: This element already has an active MixItUp instance. The provided configuration object will be ignored." + " If you wish to perform additional methods on this instance, please create a reference.";
            this.WARNING_INSERT_NO_ELEMENTS = "[MixItUp] WARNING: No valid elements were passed to `.insert()`";
            this.WARNING_REMOVE_NO_ELEMENTS = "[MixItUp] WARNING: No valid elements were passed to `.remove()`";
            this.WARNING_MULTIMIX_INSTANCE_QUEUE_FULL = "[MixItUp] WARNING: An operation was requested but the MixItUp instance was busy. The operation was rejected because the " + "queue is full or queuing is disabled.";
            this.WARNING_GET_OPERATION_INSTANCE_BUSY = "[MixItUp] WARNING: Operations can be be created while the MixItUp instance is busy.";
            this.WARNING_NO_PROMISE_IMPLEMENTATION = "[MixItUp] WARNING: No Promise implementations could be found. If you wish to use promises with MixItUp please install" + " an ES6 Promise polyfill.";
            this.WARNING_INCONSISTENT_SORTING_ATTRIBUTES = '[MixItUp] WARNING: The requested sorting data attribute "${attribute}" was not present on one or more target elements' + " which may product unexpected sort output";
            this.callActions("afterConstruct");
            this.compileTemplates();
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.Messages);
        mixitup.Messages.prototype = Object.create(mixitup.Base.prototype);
        mixitup.Messages.prototype.constructor = mixitup.Messages;
        mixitup.Messages.prototype.compileTemplates = function() {
            var errorKey = "";
            var errorMessage = "";
            for (errorKey in this) {
                if ("string" !== typeof (errorMessage = this[errorKey])) continue;
                this[h.camelCase(errorKey)] = h.template(errorMessage);
            }
        };
        mixitup.messages = new mixitup.Messages;
        mixitup.Facade = function Mixer(mixer) {
            mixitup.Base.call(this);
            this.callActions("beforeConstruct", arguments);
            this.configure = mixer.configure.bind(mixer);
            this.show = mixer.show.bind(mixer);
            this.hide = mixer.hide.bind(mixer);
            this.filter = mixer.filter.bind(mixer);
            this.toggleOn = mixer.toggleOn.bind(mixer);
            this.toggleOff = mixer.toggleOff.bind(mixer);
            this.sort = mixer.sort.bind(mixer);
            this.changeLayout = mixer.changeLayout.bind(mixer);
            this.multimix = mixer.multimix.bind(mixer);
            this.dataset = mixer.dataset.bind(mixer);
            this.tween = mixer.tween.bind(mixer);
            this.insert = mixer.insert.bind(mixer);
            this.insertBefore = mixer.insertBefore.bind(mixer);
            this.insertAfter = mixer.insertAfter.bind(mixer);
            this.prepend = mixer.prepend.bind(mixer);
            this.append = mixer.append.bind(mixer);
            this.remove = mixer.remove.bind(mixer);
            this.destroy = mixer.destroy.bind(mixer);
            this.forceRefresh = mixer.forceRefresh.bind(mixer);
            this.forceRender = mixer.forceRender.bind(mixer);
            this.isMixing = mixer.isMixing.bind(mixer);
            this.getOperation = mixer.getOperation.bind(mixer);
            this.getConfig = mixer.getConfig.bind(mixer);
            this.getState = mixer.getState.bind(mixer);
            this.callActions("afterConstruct", arguments);
            h.freeze(this);
            h.seal(this);
        };
        mixitup.BaseStatic.call(mixitup.Facade);
        mixitup.Facade.prototype = Object.create(mixitup.Base.prototype);
        mixitup.Facade.prototype.constructor = mixitup.Facade;
        if ("object" === typeof exports && "object" === typeof module) module.exports = mixitup; else if ("function" === typeof define && define.amd) define((function() {
            return mixitup;
        })); else if ("undefined" === typeof window.mixitup || "function" !== typeof window.mixitup) window.mixitup = mixitup;
        mixitup.BaseStatic.call(mixitup.constructor);
        mixitup.NAME = "mixitup";
        mixitup.CORE_VERSION = "3.3.1";
    })(window);
    window["FLS"] = true;
    isWebp();
    menuInit();
    spollers();
    formQuantity();
    mixitup(".container-filter");
})();