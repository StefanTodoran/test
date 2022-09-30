'use strict';
(function () {

  window.addEventListener('load', init);

  /**
   * Initialization function that should handle anything that needs to occur
   * on page load (include changing from one page to another).
   */
  function init() {
    setDynamicElementsObserver();
    setUpMenu();
  
    preloadImage('./assets/svg/resume_hover.svg');
    preloadImage('./assets/svg/contact_hover.svg');

    const contact_btn = document.getElementById('contact-btn');
    const modal = document.getElementById('modal');
    const close_btn_1 = document.getElementById('close-btn-1');
    const close_btn_2 = document.getElementById('close-btn-2');
    
    const toggle = function() { modal.classList.toggle('shown'); }
    contact_btn.addEventListener('click', toggle);
    close_btn_1.addEventListener('click', toggle);
    close_btn_2.addEventListener('click', toggle);
    modal.addEventListener('click', function(e) {
      if (e.target !== this) { return; }
      toggle();
    });
  }

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
  }

  function setUpMenu() {
    // This checks if we have scrolled past a certain element, then 
    //adds the appropriate class to the indicator, which sets its cx position.

    const freelance = document.getElementById('freelance-section');
    const projects = document.getElementById('projects-section');

    const wrapper = document.getElementById('wrapper');
    const indicator = document.getElementById('indicator');
    wrapper.addEventListener('scroll', function() {
      let section = 'home';
      
      if (wrapper.scrollTop > (freelance.offsetTop - 2 * freelance.offsetHeight)) {
        section = 'freelance';
      }
      if (wrapper.scrollTop > (projects.offsetTop - 2 * projects.offsetHeight)) {
        section = 'projects';
      }

      indicator.classList.remove('home', 'freelance', 'projects');
      indicator.classList.add(section);
    });

    // Here we set the menu button listeners. These scroll to a certain
    // position if invisible circles on the menu are clicked.

    const home_btn = document.getElementById('home-btn');
    home_btn.addEventListener('click', function() {
      wrapper.scrollTo({top: 0, behavior: 'smooth'});
    });

    const freelance_btn = document.getElementById('freelance-btn');
    const freelance_scroll =  function() {
      wrapper.scrollTo({top: (freelance.offsetTop - 1.15 * freelance.offsetHeight), behavior: 'smooth'});
    }
    freelance_btn.addEventListener('click', freelance_scroll);

    const projects_btn = document.getElementById('projects-btn');
    projects_btn.addEventListener('click', function() {
      wrapper.scrollTo({top: (projects.offsetTop - 1.15 * projects.offsetHeight), behavior: 'smooth'});
    });

    const scroll_arrow = document.getElementById('scroll-arrow');
    scroll_arrow.addEventListener('click', freelance_scroll);
  }
  
})();