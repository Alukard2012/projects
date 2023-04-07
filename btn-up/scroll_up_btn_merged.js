const scrollBtn = document.querySelector('.body-container .btn-up');

let scrollWindow = document.querySelector('.body-container');
let scrollProperty = document.querySelector('.body-container');

function sizeSwitch() {
  let windowWidth = window.innerWidth;
  if (windowWidth <= 1280) {
    scrollWindow = window;
    scrollProperty = document.documentElement;
  }
  else {
    scrollWindow = document.querySelector('.body-container');
    scrollProperty = scrollWindow;
  }
};

sizeSwitch();
window.addEventListener('resize', sizeSwitch);



let btnUp = {
  addEventListener() {
    // при прокрутке содержимого страницы
    scrollWindow.addEventListener('scroll', () => {
      // определяем величину прокрутки
      let scrollY = scrollWindow.scrollY || scrollProperty.scrollTop;
      // если страница прокручена больше чем на 400px, то делаем кнопку видимой, иначе скрываем
      scrollY > 400 ? scrollBtn.style.display = "flex" : scrollBtn.style.display = "none";
    });
  }
}

// при нажатии на кнопку .btn-up
scrollBtn.onclick = () => {
  // переместим в начало страницы
  scrollWindow.scrollTo({ //тут тоже надо сменить путь, иначе не будет работать (window или scrollWindow)
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
}

btnUp.addEventListener();