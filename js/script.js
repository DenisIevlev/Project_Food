document.addEventListener('DOMContentLoaded', () => {

    let tabsHeader = document.querySelectorAll('.tabheader__item'),
    tabsContent = document.querySelectorAll('.tabcontent'),
    tabsItem = document.querySelector('.tabheader__items');
    
    function hideTabContent(){
        tabsContent.forEach(item => {
        item.classList.add('hide', 'fade');
        item.classList.remove('show');
        });
        tabsHeader.forEach(item => {
        item.classList.remove('tabheader__item_active');
        });
    }
    function showTabContent(i = 0){
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabsHeader[i].classList.add('tabheader__item_active');
    }
    
    tabsItem.addEventListener('click', (event) => {
    let target = event.target;
    if(target && target.classList.contains('tabheader__item')){
        tabsHeader.forEach((item, index) => {
        if(target == item){
        hideTabContent();
        showTabContent(index);
        }
        });
    }
    });
    hideTabContent();
    showTabContent();
    
    const deadline = '2021-03-31';
    
    function getTimeRemaining(endtime){
        let total = Date.parse(deadline) - Date.parse(new Date()),
         days = Math.floor(total / (1000 * 60 * 60 * 24)),
         hours = Math.floor((total / (1000 * 60 * 60) % 24)),
         minutes = Math.floor((total / 1000 / 60) % 60),
         seconds = Math.floor((total / 1000) % 60);
    
        return {
            total,
            days,
            hours,
            minutes,
            seconds
        };
    }
    
    function getZero(num){
        if(num >= 0 && num < 10){
            return `0${num}`;
        } else {
            return num;
        }
    }
    
    function getClock(selector, endtime){
        let time = document.querySelector(selector),
        days = time.querySelector('#days'),
        hours = time.querySelector('#hours'),
        minutes = time.querySelector('#minutes'),
        seconds = time.querySelector('#seconds');
        let timeInterval = setInterval(setClock, 1000);
        setClock();
        
        function setClock(){
            const time = getTimeRemaining(endtime);
            days.innerHTML = getZero(time.days);
            hours.innerHTML = getZero(time.hours);
            minutes.innerHTML = getZero(time.minutes);
            seconds.innerHTML = getZero(time.seconds);
            if(time.total <= 0){
                clearInterval(timeInterval);
            }
        }
    }
    getClock('.timer', deadline);
    
    const modalButtons = document.querySelectorAll('[data-modal]');
    const modalContent = document.querySelector('[data-content]');
    
    modalButtons.forEach(btn => {
    btn.addEventListener('click', openModal);
    });
    
    function openModal(){
        modalContent.classList.add('show');
        modalContent.classList.remove('hide');
        document.body.style.overflow = "hidden";
        clearInterval(modalTimer);
    }
    
    function closeModal(){
        modalContent.classList.add('hide');
        modalContent.classList.remove('show');
        document.body.style.overflow = "";
    }
    modalContent.addEventListener('click', (event) => {
    if(event.target === modalContent || event.target.getAttribute('data-close') == ""){
        closeModal();
    }
    });
    
    document.addEventListener('keydown', (event) => {
      if(event.code === 'Escape' && modalContent.classList.contains('show')){
          closeModal();
      }
    });
    
    const modalTimer = setInterval(openModal, 50000);
    
    function showModalByScroll(){
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
            openModal();
            window.removeEventListener('scroll',showModalByScroll);
    }
    }
    
    window.addEventListener('scroll', showModalByScroll);
    
    class Card{
         constructor(src, alt, title, description, price, parent, ...classes){
         this.src = src;
         this.alt = alt;
         this.title = title;
         this.description = description;
         this.price = price;
         this.transfer = 27; 
         this.changeToUAH();
         this.parent = document.querySelector(parent);
         this.classes = classes;
        }
        changeToUAH(){
        this.price = this.price * this.transfer;
        }
        createCards(){
         const element = document.createElement('div');
         if(this.classes.length === 0){
             this.element = 'menu__item';
              element.classList.add(this.element);
         } else {
         this.classes.forEach(className => element.classList.add(className));
         }
         element.innerHTML = `
         <img src=${this.src} alt=${this.alt}>
         <h3 class="menu__item-subtitle">${this.title}"</h3>
         <div class="menu__item-descr">${this.description}</div>
         <div class="menu__item-divider"></div>
         <div class="menu__item-price">
             <div class="menu__item-cost">Цена:</div>
             <div class="menu__item-total"><span>${this.price}</span> грн/день</div>`;
         this.parent.append(element);
        }
    }
    
    new Card(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
         `Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов.
          Продукт активных и здоровых людей. 
          Это абсолютно новый продукт с оптимальной ценой и высоким качеством!`,
         9,
         '.menu .container'
    ).createCards();
    new Card(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум',
         `В меню “Премиум” мы используем не только красивый дизайн упаковки, 
         но и качественное исполнение блюд. Красная рыба, морепродукты, 
         фрукты - ресторанное меню без похода в ресторан!`,
         12,
         '.menu .container'
    ).createCards();
    new Card(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное',
         `Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, 
         молоко из миндаля, овса, кокоса или гречки, 
         правильное количество белков за счет тофу и импортных вегетарианских стейков.`,
         7,
         '.menu .container'
    ).createCards();
    
    const forms = document.querySelectorAll('form');
    
    const message = {
        loading: 'img/spinner.svg',
        success: 'Номер отправлен. Мы с вами свяжемся в скором времени',
        failure: 'Ошибка'
    };
    
    forms.forEach(item => {
       postData(item);
    });
    
        function postData(form){
        form.addEventListener('submit', (event) => {
            event.preventDefault();
     
            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);
    
            const request = new XMLHttpRequest();
            request.open('POST', 'js/server.php');
            request.setRequestHeader('Content-type', 'application/json', 'charset=utf-8');
            const formData = new FormData(form);
    
            const object = {};
            formData.forEach(function(value, key){
            object[key] = value;
            });
    
            const json = JSON.stringify(object);
            
            request.send(json);
    
            request.addEventListener('load', () => {
                if(request.status === 200){
                 sweetModal(message.success);
                 form.reset();
                 statusMessage.remove();
                } else {
                    sweetModal(message.failure);
                }
            });
        });
    }
    
    function sweetModal(message){
    
        const previousModalMessage = document.querySelector('.modal__dialog');
        previousModalMessage.classList.add('hide');
        
        openModal();
    
        const nextModalMessage = document.createElement('div');
        nextModalMessage.classList.add('modal__dialog');
    
        nextModalMessage.innerHTML = `
        <div class="modal__content">
          <div class="modal__close" data-close>×</div>
          <div class="modal__title">${message}</div>
        </div>
        `;
    
        document.querySelector('.modal').append(nextModalMessage);
        setTimeout(() => {
         nextModalMessage.remove();
         previousModalMessage.classList.add('show');
         previousModalMessage.classList.remove('hide');
         closeModal();
    
        }, 3000);
    }
    });