//v2
'use strict'
document.addEventListener("DOMContentLoaded", function(event) {

// Путь страницы, с которым будем сверяться.
  const controlUrl = '/docs/ru/erudite/web/Content/Erudite/Home.htm';

// Количество кликов для активации скрипта.
  const clicks = 10;

// Порядковый номер последней картинки в каталоге. Названия начинаются с 0 в формате "0.png".
// Если количество картинок на странице == количеству картинок в каталоге, то присвоить значение usingImagesListCounter.  
  const imgAmount = 62;

// Путь до каталога с картинками, закрывать слэшем, подставляется в <img src="каталог + название">.
  const imgDir = '../Resources/Images/Erudite/Home_Page/stickers/';

//функция определения рандомного числа в интервале между минимальным и максимальным значениями.
  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  const logo = document.querySelector('.logo');
  const currentUrl = document.location.pathname;
  if (logo) {
    logo.addEventListener('click', (e) => {
          if (clicks == e.detail && currentUrl == controlUrl) {
            const usingImagesList = document.querySelectorAll('p.tile-content img');
            const usingImagesListCounter = usingImagesList.length;
            let changedImagesNumbers = [];
            if (usingImagesListCounter > 0) {
              for (let i = 0; i < imgAmount; i++) {
                  changedImagesNumbers.push(imgDir + i + '.png');
                }
              }
             for (let j = 0; j < usingImagesListCounter; j++) {
               if (usingImagesList.item(j).hasAttribute('src')) {
                 let changedImageIndex = getRndInteger(0, changedImagesNumbers.length - 1);
                  usingImagesList.item(j).setAttribute('src', changedImagesNumbers[changedImageIndex]);
                  changedImagesNumbers.splice(changedImageIndex, 1);
                }
            }
          }
      });
    }
  });
