document.addEventListener("DOMContentLoaded", function(event) {
  const controlUrl = '/C:/Users/Fa1thLeSS/Desktop/AF/april_fool.html';
  const newImg = 'https://i.ytimg.com/vi/XvYIjV2GK98/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLC3yGqY80bjGnFNgSL6eRK2AZvcsQ';
  const clicks = 2;

  const logo = document.getElementsByClassName('logo');
  const currentUrl = document.location.pathname;
  if(logo.item(0)) {
    logo.item(0).addEventListener('click', (e) => {
      if (clicks == e.detail && currentUrl == controlUrl) {
        const tileContent = document.getElementsByClassName('tile-content');
        if (tileContent.length > 0) {
          for (let j = 0; j < tileContent.length; j++) {
            let currentImage = tileContent.item(j).getElementsByTagName('img');
            if (currentImage.item(0).hasAttribute('src')) {
              currentImage.item(0).setAttribute('src', newImg)
            }
          }
        }
      }
    });
  }
})
