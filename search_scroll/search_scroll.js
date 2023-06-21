'use strict'
window.addEventListener("load", function (event) { //ждем загрузку стилей из CSS-файлов
  const searchHighlight = document.getElementsByClassName('SearchHighlight'); //ищем стиль SearchHighlight
  if (searchHighlight) searchHighlight.item(0).scrollIntoView({block: "center"}); //проматываем окно до первого выделенного стилем слова
})