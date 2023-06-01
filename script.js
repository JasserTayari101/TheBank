'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e){
  e.preventDefault();
  
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


//----implementing smooth scrolling when clicking on Learn more

const btnLearnMore = document.querySelector('.btn--scroll-to'); 
const section1 = document.querySelector('#section--1');

btnLearnMore.addEventListener('click',(e)=>{
  const s1coords = section1.getBoundingClientRect(); //returns a DOMRect object that contains properties like coordinates

  window.scrollTo({
    left:s1coords.x+window.pageXOffset,
    top:s1coords.y+window.pageYOffset,
    behavior: 'smooth'
  });

})



const linksList = document.querySelector('.nav__links');
const linkUp = document.querySelector('#link_up');
const links = linksList.querySelectorAll('.nav__link');


const tabContainer = document.querySelector('.operations__tab-container')
const tabBtns = document.querySelectorAll('.operations__tab');
const tabContents = document.querySelectorAll('.operations__content');
//------implementing event delegation-------
linksList.addEventListener('click',function(e){
  e.preventDefault();

  if(e.target.classList.contains('nav__link')){
    const targetId = e.target.getAttribute('href');
    smoothScroll(e,targetId);
  }
})

function smoothScroll(e,targetId){
    e.preventDefault();
    const section = document.querySelector(targetId);
    section.scrollIntoView({behavior:'smooth'});
}

linkUp.addEventListener('click',function(e){
  smoothScroll(e,this.getAttribute('href'));
})




//------implementing the tab component

tabContainer.addEventListener('click',function(e){
  if((e.target.classList.contains('operations__tab'))||(e.target.parentElement.classList.contains('operations__tab'))){
    const tabBtn = e.target.closest('.operations__tab');

    tabBtns.forEach(btn=>btn.classList.remove('operations__tab--active'));

    tabBtn.classList.add('operations__tab--active');

    const tabNumber = tabBtn.dataset.tab;
    let contentToActivate;
    let contentToDeactivate;
    tabContents.forEach(content=>{
      if(content.classList.contains(`operations__content--${tabNumber}`)){
        contentToActivate = content;
      }else if(content.classList.contains('operations__content--active')){
        contentToDeactivate = content;
      }
    })
    contentToDeactivate?.classList.remove('operations__content--active');
    contentToActivate.classList.add('operations__content--active');
  }
})


//navbar link fade animation

function changeOpacity(e,opacity,skip=null){
  if(e.target.classList.contains('nav__link')){
    links.forEach(link=>{
    if(link!==skip)
      link.style.opacity = opacity;
    })
  }
}



linksList.addEventListener('mouseover',(e)=>changeOpacity(e,.5,e.target))

linksList.addEventListener('mouseout',(e)=>changeOpacity(e,1))


//--------Sticky nav----------
const navbar = document.querySelector('.nav');
const header = document.querySelector('.header');
const navHeight = navbar.getBoundingClientRect().height;

function obsCallback(entries,stickyObserver){
  const [entry] = entries;
  console.log(entry);
  if(!entry.isIntersecting)
    navbar.classList.add('sticky');
  else
    navbar.classList.remove('sticky');
}

const obsOptions = {
  root:null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
}
const stickyObserver = new IntersectionObserver(obsCallback,obsOptions);
stickyObserver.observe(header);



//---------Reveal animation on scroll----------

const sections = document.querySelectorAll('.section');
const revealOptions = {
  root: null,
  threshold:0.15,
}
function revealCallback(entries,revealObserver){
  const [entry] = entries;
  if(entry.isIntersecting){
    entry.target.classList.remove('section--hidden');
    revealObserver.unobserve(entry.target);
  }
}



const revealObserver = new IntersectionObserver(revealCallback,revealOptions);

sections.forEach(section=>{
  section.classList.add('section--hidden');
  revealObserver.observe(section);
})


//---------lazy loading images---------

const images = document.querySelectorAll('.lazy-img');

function loadImg(entries,imageObserver){
  const [entry] = entries;
  if(entry.isIntersecting){
    entry.target.src = entry.target.dataset.src; //replace low res by high res img
    entry.target.addEventListener('load',function(){
      entry.target.classList.remove('lazy-img');
    })
    imageObserver.unobserve(entry.target);
  }
}

const imageObserver = new IntersectionObserver(loadImg,{
  root: null,
  threshold: 0.1,
})

images.forEach(image=>{
  imageObserver.observe(image);
})


//-----------Slider component------------
const slides = document.querySelectorAll('.slide');
const [larrow,rarrow] = document.querySelectorAll('.slider__btn');
let currentSlide = 0;


slides.forEach((slide,i)=>{
  slide.style.transform = `translateX(${i*100}%)`;
})


function setSlides(){
  slides.forEach((slide,i)=>{
    slide.style.transform = `translateX(${(i-currentSlide)*100}%)`;
  });
}



//-----------slider dots-------------
const dotContainer = document.querySelector('.dots');

function createDots(){
  for(let i=0;i<slides.length;i++){
    const dot = document.createElement('div');
    dot.classList.add('dots__dot');
    dot.dataset.slide = i;
    dot.addEventListener('click',function(e){
      dotContainer.childNodes[currentSlide].classList.remove('dots__dot--active');
      currentSlide = this.dataset.slide;
      dotContainer.childNodes[currentSlide].classList.add('dots__dot--active');
      setSlides();
    })
    dotContainer.append(dot);
  }
}

createDots();


//-------attach arrow events----------

dotContainer.firstElementChild.classList.add('dots__dot--active');


rarrow.addEventListener('click',()=>{
  if(currentSlide<(slides.length-1)){
    currentSlide++;
    dotContainer.childNodes[currentSlide-1].classList.remove('dots__dot--active');
  }
  else{
    currentSlide = 0;
    dotContainer.childNodes[slides.length-1].classList.remove('dots__dot--active');
  }
  
  dotContainer.childNodes[currentSlide].classList.add('dots__dot--active');
  setSlides();  
})

larrow.addEventListener('click',()=>{
  if(currentSlide>0){
    currentSlide--;
    dotContainer.childNodes[currentSlide+1].classList.remove('dots__dot--active'); 
  }
  else{
    currentSlide = slides.length-1;
    dotContainer.childNodes[0].classList.remove('dots__dot--active');
  }
  dotContainer.childNodes[currentSlide].classList.add('dots__dot--active');
    setSlides();
})

  