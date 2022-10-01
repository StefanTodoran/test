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

    // const contact_btn = document.getElementById('contact-btn');
    // const modal = document.getElementById('modal');
    // const close_btn_1 = document.getElementById('close-btn-1');
    // const close_btn_2 = document.getElementById('close-btn-2');
    
    // const toggle = function() { modal.classList.toggle('shown'); }
    // contact_btn.addEventListener('click', toggle);
    // close_btn_1.addEventListener('click', toggle);
    // close_btn_2.addEventListener('click', toggle);
    // modal.addEventListener('click', function(e) {
    //   if (e.target !== this) { return; }
    //   toggle();
    // });
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

  function scrolledPast(scroll_body, object) {
    return (scroll_body.scrollTop > (object.offsetTop - 2 * object.offsetHeight));
  }

  function scrollTo(scroll_body, object) {
    scroll_body.scrollTo({top: (object.offsetTop - 1.15 * object.offsetHeight), behavior: 'smooth'});
  }
  
})();