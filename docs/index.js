"use strict";!function(){function e(e){(new Image).src=e}function t(e,t){e.addEventListener("click",t),e.addEventListener("keydown",(e=>{"Enter"===e.code&&t()}))}function n(e,t){return e.scrollTop>t.offsetTop-2*t.offsetHeight}function o(e,t){e.scrollTo({top:t.offsetTop-t.offsetHeight,behavior:"smooth"})}function c(e,t){return Math.max(e,Math.round(Math.random()*t))}function s(){if("visible"==document.visibilityState&&!n(document.getElementById("wrapper"),document.getElementById("freelance-section"))){const e=document.getElementById("leaf-template"),t=e.cloneNode(!1);t.classList.remove("hidden"),t.style.setProperty("--duration",`${c(3,7)}s`),t.style.setProperty("--position",`${c(5,95)}vw`),e.parentNode.insertBefore(t,e),setTimeout((()=>{t.remove()}),8e3)}setTimeout(s,1e3*c(3,8))}window.addEventListener("load",(function(){(function(){const e=new IntersectionObserver((e=>{e.forEach((e=>{e.isIntersecting?e.target.classList.add("shown"):e.target.classList.remove("shown")}))}),{root:null,rootMargin:"0px",threshold:.5});document.querySelectorAll(".dynamic-item").forEach((t=>e.observe(t))),e.observe(document.getElementById("client-tip"))})(),function(){const e=document.getElementById("freelance-section"),c=document.getElementById("projects-section"),s=document.getElementById("contact-section"),d=document.getElementById("wrapper"),r=document.getElementById("indicator");d.addEventListener("scroll",(function(){let t="home";n(d,s)?t="contact":n(d,c)?t="projects":n(d,e)&&(t="freelance"),r.classList.remove("home","freelance","projects","contact"),r.classList.add(t)}));document.getElementById("home-btn").addEventListener("click",(function(){d.scrollTo({top:0,behavior:"smooth"})}));const i=document.getElementById("freelance-btn"),l=document.getElementById("scroll-arrow");i.addEventListener("click",(()=>{o(d,e)})),t(l,(()=>{o(d,e)}));document.getElementById("projects-btn").addEventListener("click",(()=>{o(d,c)}));const a=document.getElementById("contact-btn"),m=document.getElementById("contact-icon");a.addEventListener("click",(()=>{o(d,s)})),t(m,(()=>{o(d,s)}))}(),e("./assets/svg/resume_hover.svg"),e("./assets/svg/contact_hover.svg");document.getElementById("loader-container").classList.add("loaded"),s()}))}();