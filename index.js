"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function () {
    window.addEventListener("load", init);
    function init() {
        var _a;
        setLazyLoadingObserver();
        setDynamicElementsObserver();
        setUpMenu();
        preloadImage("./assets/svg/back-to-top_hover.svg");
        spawnLeaf();
        displayLastUpdatedTime();
        const loader = document.getElementById("loader-container");
        loader === null || loader === void 0 ? void 0 : loader.classList.add("loaded");
        if (isBrowserFirefox())
            (_a = document.getElementById("menu-container")) === null || _a === void 0 ? void 0 : _a.classList.add("firefox-fix");
    }
    function preloadImage(url) {
        let img = new Image();
        img.src = url;
    }
    function setDynamicElementsObserver() {
        let options = {
            root: null,
            rootMargin: "0px",
            threshold: 0.5
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("shown");
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        const dynamicElements = document.querySelectorAll(".dynamic-item");
        dynamicElements.forEach((element) => observer.observe(element));
        const clientTips = document.querySelectorAll(".client-tip");
        clientTips.forEach((element) => observer.observe(element));
    }
    function setLazyLoadingObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const lazyLoad = entry.target;
                    lazyLoad.src = lazyLoad.dataset.src;
                    lazyLoad.classList.remove("lazy-load");
                    observer.unobserve(lazyLoad);
                }
            });
        });
        const lazyLoadElements = document.querySelectorAll(".lazy-load");
        lazyLoadElements.forEach((element) => observer.observe(element));
    }
    function setUpMenu() {
        const freelance = document.getElementById("freelance-section");
        const projects = document.getElementById("projects-section");
        const contact = document.getElementById("contact-section");
        const wrapper = document.getElementById("wrapper");
        const indicator = document.getElementById("indicator");
        wrapper.addEventListener("scroll", function () {
            let section = "home";
            if (scrolledPast(wrapper, contact)) {
                section = "contact";
            }
            else if (scrolledPast(wrapper, projects)) {
                section = "projects";
            }
            else if (scrolledPast(wrapper, freelance)) {
                section = "freelance";
            }
            indicator.classList.remove("home", "freelance", "projects", "contact");
            indicator.classList.add(section);
        });
        const homeButton = document.getElementById("home-btn");
        const backButton = document.getElementById("back-to-top-btn");
        const scrollTop = () => wrapper.scrollTo({ top: 0, behavior: "smooth" });
        homeButton === null || homeButton === void 0 ? void 0 : homeButton.addEventListener("click", scrollTop);
        backButton === null || backButton === void 0 ? void 0 : backButton.addEventListener("click", scrollTop);
        const menuNodes = [
            {
                id: "freelance-btn",
                target: freelance,
            },
            {
                id: "projects-btn",
                target: projects,
            },
            {
                id: "contact-btn",
                target: contact,
            },
        ];
        menuNodes.forEach(node => {
            const nodeElement = document.getElementById(node.id);
            nodeElement.addEventListener("click", () => scrollTo(wrapper, node.target));
        });
        const contactButton = document.getElementById("goto-contact-btn");
        addActivationEvent(contactButton, (evt) => {
            scrollTo(wrapper, contact);
            evt.preventDefault();
        });
    }
    function addActivationEvent(object, event) {
        object.addEventListener("click", event);
        object.addEventListener("keydown", (evt) => {
            if (evt.code === "Enter")
                event(evt);
        });
    }
    function scrolledPast(scrollBody, object) {
        return (scrollBody.scrollTop > (object.offsetTop - 2 * object.offsetHeight));
    }
    function scrollTo(scrollBody, object) {
        scrollBody.scrollTo({ top: (object.offsetTop - object.offsetHeight), behavior: "smooth" });
    }
    function random(min, max) {
        return Math.max(min, Math.round(Math.random() * max));
    }
    function spawnLeaf() {
        const wrapper = document.getElementById("wrapper");
        const freelance = document.getElementById("freelance-section");
        if (document.visibilityState == "visible" && !scrolledPast(wrapper, freelance)) {
            const template = document.getElementById("leaf-template");
            const leaf = template.cloneNode(false);
            leaf.classList.remove("hidden");
            leaf.style.setProperty("--duration", `${random(3, 7)}s`);
            leaf.style.setProperty("--position", `${random(5, 95)}vw`);
            template.parentNode.insertBefore(leaf, template);
            setTimeout(() => {
                leaf.remove();
            }, 8000);
        }
        setTimeout(spawnLeaf, random(3, 8) * 1000);
    }
    function displayLastUpdatedTime() {
        return __awaiter(this, void 0, void 0, function* () {
            let commitDate = yield getLastCommitDate("StefanTodoran", "StefanTodoran.github.io");
            if (!commitDate)
                return;
            commitDate = commitDate.toLocaleString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric"
            });
            const lastUpdated = document.getElementById("last-updated");
            lastUpdated.innerText = commitDate;
        });
    }
    function getLastCommitDate(owner, repo) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `https://api.github.com/repos/${owner}/${repo}/commits`;
            try {
                const response = yield fetch(url);
                const data = yield response.json();
                if (!(data.length > 0)) {
                    throw new Error("No commits found in the repository.");
                }
                const lastCommit = data[0];
                const commitDate = new Date(lastCommit.commit.author.date);
                return commitDate;
            }
            catch (error) {
                console.error("Error retrieving commit data:", error.message);
            }
            return null;
        });
    }
    function isBrowserFirefox() {
        return navigator.userAgent.toLowerCase().indexOf("firefox") !== -1;
    }
})();
