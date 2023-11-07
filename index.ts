"use strict";
(function () {

  window.addEventListener("load", init);

  /**
   * Initialization function that should handle anything that needs to occur on page load.
   */
  function init() {
    setLazyLoadingObserver();
    setDynamicElementsObserver();
    setUpMenu();

    preloadImage("./assets/svg/back-to-top_hover.svg");

    spawnLeaf();
    displayLastUpdatedTime();

    const loader = document.getElementById("loader-container");
    loader?.classList.add("loaded");

    if (isBrowserFirefox()) document.getElementById("menu-container")?.classList.add("firefox-fix");
  }

  /**
   * Forces loading of an asset.
   * @param url Relative path to the asset
   */
  function preloadImage(url: string) {
    let img = new Image();
    img.src = url;
  }

  function setDynamicElementsObserver() {
    let options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5
    };

    // This observer will be run on all elements with the dynamic-item 
    // class. This class sets their opacity and some other styles to the
    // pre-animation state. Shown is the post-animation state. The animation
    // only happens once, since entries the screen is not intersecting don't
    // get their "shown" class removed.

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("shown");
          observer.unobserve(entry.target);
        }
        // else {
        //   entry.target.classList.remove("shown");
        // }
      })
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
          const lazyLoad = entry.target as HTMLImageElement;
          lazyLoad.src = lazyLoad.dataset.src!;
          lazyLoad.classList.remove("lazy-load");
          observer.unobserve(lazyLoad);
        }
      })
    });

    const lazyLoadElements = document.querySelectorAll(".lazy-load");
    lazyLoadElements.forEach((element) => observer.observe(element));
  }

  function setUpMenu() {
    // This checks if we have scrolled past a certain element, then 
    //adds the appropriate class to the indicator, which sets its cx position.

    const freelance = document.getElementById("freelance-section")!;
    const projects = document.getElementById("projects-section")!;
    const contact = document.getElementById("contact-section")!;

    const wrapper = document.getElementById("wrapper")!;
    const indicator = document.getElementById("indicator")!;

    wrapper.addEventListener("scroll", function () {
      let section = "home";

      if (scrolledPast(wrapper, contact)) {
        section = "contact";
      } else if (scrolledPast(wrapper, projects)) {
        section = "projects";
      } else if (scrolledPast(wrapper, freelance)) {
        section = "freelance";
      }

      indicator.classList.remove("home", "freelance", "projects", "contact");
      indicator.classList.add(section);
    });

    // Here we set the menu button listeners. These scroll to a certain
    // position if invisible circles on the menu are clicked.

    const homeButton = document.getElementById("home-btn");
    const backButton = document.getElementById("back-to-top-btn");
    const scrollTop = () => wrapper.scrollTo({ top: 0, behavior: "smooth" });

    homeButton?.addEventListener("click", scrollTop);
    backButton?.addEventListener("click", scrollTop);

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
      const nodeElement = document.getElementById(node.id)!;
      nodeElement.addEventListener("click", () => scrollTo(wrapper, node.target));
    });

    const contactButton = document.getElementById("goto-contact-btn");
    addActivationEvent(contactButton!, (evt) => {
      scrollTo(wrapper, contact);
      evt.preventDefault();
    });
  }

  /**
   * Adds both a click event listener add an enter keydown
   * event listener for accessibility purposes.
   * @param object The object to be watched by the listener 
   * @param event The funciton to occur on click/enter
   */
  function addActivationEvent(object: Element, event: (evt: Event) => void) {
    object.addEventListener("click", event);
    // @ts-expect-error
    object.addEventListener("keydown", (evt: KeyboardEvent) => {
      if (evt.code === "Enter") event(evt);
    });
  }

  /**
   * Returns a boolean based on whether the provided object has been
   * scrolled past, meaning it is more than halfway up the viewport.
   * @param scrollBody The DOM element being scrolled
   * @param object The child of scrollBody to check
   * @returns {boolean} Whether or not the object has been scrolled past
   */
  function scrolledPast(scrollBody: Element, object: HTMLElement): boolean {
    return (scrollBody.scrollTop > (object.offsetTop - 2 * object.offsetHeight));
  }

  /**
   * @param scrollBody The DOM element being scrolled
   * @param object The child of scrollBody to scroll to
   */
  function scrollTo(scrollBody: Element, object: HTMLElement) {
    scrollBody.scrollTo({ top: (object.offsetTop - object.offsetHeight), behavior: "smooth" });
  }

  /**
   * @param min The minimum number that should be possible
   * @param max The maximum number that should be possible
   * @returns A random integer number between min and max (inclusive)
   */
  function random(min: number, max: number) {
    return Math.max(min, Math.round(Math.random() * max));
  }

  function spawnLeaf() {
    const wrapper = document.getElementById("wrapper")!;
    const freelance = document.getElementById("freelance-section")!;

    // If we don't do this, then after switchign to another tab
    // and back after a few seconds several leaves build up and fall at once.
    if (document.visibilityState == "visible" && !scrolledPast(wrapper, freelance)) {
      const template = document.getElementById("leaf-template")!;
      const leaf = template.cloneNode(false) as HTMLElement;

      leaf.classList.remove("hidden");
      leaf.style.setProperty("--duration", `${random(3, 7)}s`);
      leaf.style.setProperty("--position", `${random(5, 95)}vw`);
      template.parentNode!.insertBefore(leaf, template);
      setTimeout(() => {
        leaf.remove();
      }, 8000);
    }
    setTimeout(spawnLeaf, random(3, 8) * 1000);
  }

  async function displayLastUpdatedTime() {
    let commitDate: Date | string | null = await getLastCommitDate("StefanTodoran", "StefanTodoran.github.io");
    if (!commitDate) return;

    commitDate = commitDate.toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric"
    });

    const lastUpdated = document.getElementById("last-updated")!;
    lastUpdated.innerText = commitDate;
  }

  /**
   * @param owner String github username of the target repo owner.
   * @param repo String repo name of the target repo.
   * @returns {Date} A date object representing the most recent commit in the repo,
   * or null if there was an issue getting the most recent commit time.
   */
  async function getLastCommitDate(owner: string, repo: string) {
    const url = `https://api.github.com/repos/${owner}/${repo}/commits`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!(data.length > 0)) {
        throw new Error("No commits found in the repository.");
      }

      const lastCommit = data[0];
      const commitDate = new Date(lastCommit.commit.author.date);
      return commitDate;
    }
    catch (error: any) {
      console.error("Error retrieving commit data:", error.message);
    }

    return null;
  }

  function isBrowserFirefox() {
    return navigator.userAgent.toLowerCase().indexOf("firefox") !== -1;
  }

})();