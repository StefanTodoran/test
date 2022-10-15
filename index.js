'use strict';
(function () {

  window.addEventListener('load', init);

  /**
   * Initialization function that should handle anything that needs to occur on page load.
   */
  function init() {
    setDynamicElementsObserver();
    setUpMenu();
  
    preloadImage('./assets/svg/resume_hover.svg');
    preloadImage('./assets/svg/contact_hover.svg');

    const loader = document.getElementById('loader-container');
    loader.classList.add('loaded');

    spawnLeaf();
  }

  /**
   * Forces loading of an asset.
   * @param {string} url Relative path to the asset
   */
  function preloadImage(url) {
    let img = new Image();
    img.src = url;
  }

  function setDynamicElementsObserver() {
    let options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    // This observer will be run on all elements with the dynamic-item 
    // class. This class sets their opacity and some other styles to the
    // pre-animation state. Shown is the post-animation state. The animation
    // only happens once, since entries the screen is not intersecting don't
    // get their 'shown' class removed.

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('shown');
        } else {
          entry.target.classList.remove('shown');
        }
      })
    }, options);
    
    const dynamic_elements = document.querySelectorAll('.dynamic-item');
    dynamic_elements.forEach((element) => observer.observe(element));

    observer.observe(document.getElementById('client-tip'));
  }

  function setUpMenu() {
    // This checks if we have scrolled past a certain element, then 
    //adds the appropriate class to the indicator, which sets its cx position.

    const freelance = document.getElementById('freelance-section');
    const projects = document.getElementById('projects-section');
    const contact = document.getElementById('contact-section');

    const wrapper = document.getElementById('wrapper');
    const indicator = document.getElementById('indicator');
    wrapper.addEventListener('scroll', function() {
      let section = 'home';
      
      if (scrolledPast(wrapper, contact)) {
        section = 'contact';
      } else if (scrolledPast(wrapper, projects)) {
        section = 'projects';
      } else if (scrolledPast(wrapper, freelance)) {
        section = 'freelance';
      }

      indicator.classList.remove('home', 'freelance', 'projects', 'contact');
      indicator.classList.add(section);
    });

    // Here we set the menu button listeners. These scroll to a certain
    // position if invisible circles on the menu are clicked.

    const home_btn = document.getElementById('home-btn');
    home_btn.addEventListener('click', function() {
      wrapper.scrollTo({top: 0, behavior: 'smooth'});
    });

    const freelance_btn = document.getElementById('freelance-btn');
    const scroll_arrow = document.getElementById('scroll-arrow');
    freelance_btn.addEventListener('click', () => { scrollTo(wrapper, freelance) });
    scroll_arrow.addEventListener('click', () => { scrollTo(wrapper, freelance) });

    const projects_btn = document.getElementById('projects-btn');
    projects_btn.addEventListener('click', () => { scrollTo(wrapper, projects) });

    const contact_btn = document.getElementById('contact-btn');
    const contact_icon = document.getElementById('contact-icon');
    contact_btn.addEventListener('click', () => { scrollTo(wrapper, contact) });
    contact_icon.addEventListener('click', () => { scrollTo(wrapper, contact) });

  }

  /**
   * Returns a boolean based on whether the provided object has been
   * scrolled past, meaning it is more than halfway up the viewport.
   * @param {Node} scroll_body The DOM element being scrolled
   * @param {Node} object The child of scroll_body to check
   * @returns {boolean} Whether or not the object has been scrolled past
   */
  function scrolledPast(scroll_body, object) {
    return (scroll_body.scrollTop > (object.offsetTop - 2 * object.offsetHeight));
  }

  /**
   * @param {Node} scroll_body The DOM element being scrolled
   * @param {Node} object The child of scroll_body to scroll to
   */
  function scrollTo(scroll_body, object) {
    scroll_body.scrollTo({top: (object.offsetTop - object.offsetHeight), behavior: 'smooth'});
  }

  /**
   * @param {number} min The minimum number that should be possible
   * @param {number} max The maximum number that should be possible
   * @returns A random integer number between min and max (inclusive)
   */
  function random(min, max) {
    return Math.max(min, Math.round(Math.random() * max));
  }

  function spawnLeaf() {
    // If we don't do this, then after switchign to another tab
    // and back after a few seconds several leaves build up and fall at once.
    if (document.visibilityState == "visible" && !scrolledPast(document.getElementById('wrapper'), document.getElementById('freelance-section'))) {
      const template = document.getElementById('leaf-template');
      const leaf = template.cloneNode(false);

      leaf.classList.remove('hidden');
      leaf.style.setProperty('--duration', `${random(3, 7)}s`);
      leaf.style.setProperty('--position', `${random(5, 95)}vw`);
      template.parentNode.insertBefore(leaf, template);
      setTimeout(() => {
        leaf.remove();
      }, 8000);
    }
    setTimeout(spawnLeaf, random(3, 8) * 1000);
  }
  
})();