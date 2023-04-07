const scrollBtn = document.querySelector('.body-container .btn-up');
let scrollWindow, scrollProperty;

function setBtn() {
  // проверяем прокрутку страницы
  scrollPosition = scrollWindow.scrollY || scrollProperty.scrollTop;

  // если страница прокручена больше чем на 400px, то делаем кнопку видимой, иначе скрываем
  scrollPosition > 400 ? scrollBtn.style.display = "flex" : scrollBtn.style.display = "none";
};

function sizeSwitch() {
  if (scrollWindow) scrollWindow.removeEventListener('scroll', setBtn);

  // проверяем ширину открытой страницы
  let windowWidth = window.innerWidth;

  // если ширина меньше 1281px, то присваиваем значения для поиска скролла во всем окне
  if (windowWidth <= 1280) {
    scrollWindow = window;
    scrollProperty = document.documentElement;
  }
  else {
    // иначе присваиваем значения для поиска скролла по элементу
    scrollWindow = document.querySelector('.body-container');
    scrollProperty = scrollWindow;
  }

  setBtn();
  scrollWindow.addEventListener('scroll', setBtn);
}

// при нажатии на кнопку .btn-up
scrollBtn.onclick = () => {
  // переместим в начало страницы
  scrollWindow.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
}

sizeSwitch();
window.addEventListener('resize', sizeSwitch);