document.addEventListener("DOMContentLoaded", function(event) {
  const controlUrl = '/C:/Users/Fa1thLeSS/Desktop/AF/april_fool.html';
  const newImg1 = 'https://i.ytimg.com/vi/XvYIjV2GK98/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLC3yGqY80bjGnFNgSL6eRK2AZvcsQ';
  const newImg2 = 'https://cs13.pikabu.ru/post_img/big/2021/04/01/10/1617293581130457062.jpg';
  const newImg3 = 'https://pbs.twimg.com/media/ErFKNhbVoAEYHnp.jpg';
  const newImg4 = 'http://sun9-4.userapi.com/impg/Lmo16n0cy6W8B8tM5n4xDiwM4hSb3cPnbZ2z3w/UizG6sj9fJE.jpg?size=736x729&quality=96&sign=c3e277120e6f83b9c2f3e0de32cc2d2c&type=album';
  const newImg5 = 'https://cs5.pikabu.ru/post_img/2015/01/25/5/1422169982_1351220881.jpg';
  const newImg6 = 'https://avatars.mds.yandex.net/i?id=5406710c298b0cdc3d4f9bcd4154b6a046f411c7-8407394-images-thumbs&n=13';
  const newImg7 = 'https://i.pinimg.com/originals/73/94/65/7394652b36873dc3d607894967e50aed.jpg';
  const newImg8 = 'https://i.pinimg.com/originals/42/b8/bc/42b8bcc40413bb87f3f4f0ae92a26bf2.jpg';
  const newImg9 = 'https://i.pinimg.com/originals/4c/d7/73/4cd77327fe3a4e18390c281ccf5e01f3.jpg';
  const clicks = 2;
  var newImgs = [newImg1, newImg2, newImg3, newImg4, newImg5, newImg6, newImg7, newImg8, newImg9];

  const logo = document.querySelector('.logo');
  const currentUrl = document.location.pathname;
  if(logo) {
    logo.addEventListener('click', (e) => {
          if (clicks == e.detail && currentUrl == controlUrl) {
            let tileContent = document.querySelectorAll('div.tile-content > img');
            if (tileContent.length > 0) {
              for (let j = 0; j < tileContent.length; j++) {
                let currentImage = tileContent.item(j);
                console.log(tileContent.item(j));
                if (currentImage.hasAttribute('src') && j < 9) {
                  console.log('Цикл прошел ' + (j+1) + ' раз');
                  currentImage.setAttribute('src', newImgs[j])
                }
            }
          }
        }
  });
  }
})
