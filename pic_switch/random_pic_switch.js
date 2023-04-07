'use strict'
document.addEventListener("DOMContentLoaded", function(event) {
  const controlUrl = '/C:/Users/Fa1thLeSS/Desktop/AF/april_fool.html';
  const clicks = 2;

  //функция определения рандомного числа в интервале между минимальным и максимальным значениями
  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  const logo = document.querySelector('.logo');
  const currentUrl = document.location.pathname;
  if (logo) {
    logo.addEventListener('click', (e) => {
          if (clicks == e.detail && currentUrl == controlUrl) {
            const usingImagesList = document.querySelectorAll('div.tile-content img');
            const usingImagesListCounter = usingImagesList.length;
            console.log('Количество картинок на странице: ' + usingImagesList.length);
            if (usingImagesListCounter > 0) {
              let changedImagesNumbers = [];
              for (let i = Math.floor(Math.random() * (usingImagesListCounter + 1)); changedImagesNumbers.length < usingImagesListCounter; i = getRndInteger(0, usingImagesListCounter)) {
                console.log('Выпало значение: ' + i);
                if (!changedImagesNumbers.includes('stickers/' + i + '.png')) {
                  console.log('Выпавшего значения ' + i + ' нет в массиве');
                  changedImagesNumbers.push('stickers/' + i + '.png');
                  console.log('Пополнение массива: ' + changedImagesNumbers + '\nДлина массива: ' + changedImagesNumbers.length);
                }

              }
             for (let j = 0; j < usingImagesListCounter; j++) {
               if (usingImagesList.item(j).hasAttribute('src')) {
                  usingImagesList.item(j).setAttribute('src', changedImagesNumbers[j]);
                }
            }
          }
        }
      });
    }
  });
