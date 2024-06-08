'use strict'

window.onload =  function() {

  function findBodyElem(elemClass) {
    return document.body.querySelector(elemClass)
  }

  const contentWindow = document.getElementById('mc-main-content') //определяем область поиска управляемых элементов

  //ищем кнопки и управляемые ими элементы
  const accordionButton = findBodyElem('button.expand-all-button')
  const highlightButton = findBodyElem('button.remove-highlight-button')
  const accordion = contentWindow.querySelector('div.MCDropDown')
  const highlight = findBodyElem('span.SearchHighlight')

  function showElem(elem) {
    if (elem) elem.style.display = 'block'
  }

  function showAccordionBtn() {
    if (accordion) {
      showElem(accordionButton) //отображаем кнопку, если для нее есть управляемый элемент
      return true
    }
    else return false
  }

  function showHighlightBtn() {
    if (highlight) {
      showElem(highlightButton) //отображаем кнопку, если для нее есть управляемый элемент
      return true
    }
    else return false
  }

  const isAccordionBtnAvailable = showAccordionBtn()
  const isHighlightBtnAvailable = showHighlightBtn()

  if (isAccordionBtnAvailable || isHighlightBtnAvailable) {
    const toolbar = document.querySelector('div.button-group-container-left') //ищем тулбар, в котором расположены кнопки
    const separator = toolbar.querySelector('div.button-separator') //ищем разделитель в тулбаре
    showElem(separator)
  }

  highlightButton.addEventListener('click', function() {
    const highlights = document.getElementsByClassName('SearchHighlight');
    if (highlights.length === 0) {
      highlightButton.disabled = true;
    }
  });
}
