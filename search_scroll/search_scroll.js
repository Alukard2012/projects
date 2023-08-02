'use strict'
if (navigator.userAgent.includes('Firefox')) //если используется Firefox, добавляем слушатель события DOMNodeInserted - оно устаревшее (удалить в случае проблем все до else)
  window.addEventListener('DOMNodeInserted', scroll)
else
  window.addEventListener('load', scroll); //ждем загрузку стилей из CSS-файлов

function scroll () {
  const searchHighlight = document.querySelector('span.SearchHighlight'); //ищем стиль SearchHighlight
  if (searchHighlight) searchHighlight.scrollIntoView({block: "center"}); //проматываем окно до первого выделенного стилем слова
}


//нужно доработать, пока не работает
/* const target = document.querySelector('body');

const observer = new MutationObserver(mutations => {
  if (document.querySelector('span.SearchHighlight')) document.querySelector('span.SearchHighlight').scrollIntoView({block: "center"});
});

const config = { attributes: true, childList: true, characterData: true };

observer.observe(target, config); */