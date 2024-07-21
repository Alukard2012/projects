'use strict';

document.addEventListener("DOMContentLoaded", function () {

  function findBodyElem(selector) {
    return document.body.querySelector(selector);
  }

  function showElem(elem) {
    if (elem) {
      elem.style.display = 'block';
    }
  }

  function showBtn(elem, btn) {
    if (elem) {
      showElem(btn);
      return true;
    }
    return false;
  }

  const contentWindow = document.getElementById('mc-main-content'); // Определяем область поиска управляемых элементов

  // Обновляем видимость кнопок аккордеона
  function updateAccordionButton() {
    const accordionButton = findBodyElem('button.expand-all-button');
    const accordion = contentWindow ? contentWindow.querySelector('div.MCDropDown') : null;

    const isAccordionBtnAvailable = showBtn(accordion, accordionButton);

    return isAccordionBtnAvailable;
  }

  // Обновляем видимость кнопок подсветки
  function updateHighlightButton(observer) {
    const highlightButton = findBodyElem('button.remove-highlight-button');
    const highlight = findBodyElem('span.SearchHighlight');

    const isHighlightBtnAvailable = showBtn(highlight, highlightButton);

    if (isHighlightBtnAvailable && observer) {
      observer.disconnect(); // Останавливаем observer, если кнопка уже видима
    }

    if (highlightButton) {
      highlightButton.addEventListener('click', () => {
        if (!highlight) {
          highlightButton.disabled = true;
        }
      });
    }
    return isHighlightBtnAvailable;
  }

  function updateSeparator() {
    const toolbar = findBodyElem('div.button-group-container-left'); // Ищем тулбар, в котором расположены кнопки
    const separator = toolbar ? findBodyElem('div.button-separator') : null;

    const isAccordionBtnAvailable = updateAccordionButton();
    const isHighlightBtnAvailable = updateHighlightButton(null); // Передаем null, так как observer не нужен здесь

    if (separator) {
      if (isAccordionBtnAvailable || isHighlightBtnAvailable) {
        showElem(separator);
      }
    }

  }

  // Наблюдатель за изменениями в DOM для подсветки
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeType === Node.ELEMENT_NODE && node.matches('span.SearchHighlight')) {
          // Обновляем кнопки подсветки и разделитель при добавлении нового элемента подсветки в DOM
          const isHighlightBtnAvailable = updateHighlightButton(observer);
          if (isHighlightBtnAvailable) {
            updateSeparator();
          }
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true }); // Настраиваем наблюдение за изменениями в теле документа

  updateAccordionButton(); // Инициализируем обновление кнопок аккордеона при загрузке страницы
  updateSeparator(); // Инициализируем обновление разделителя при загрузке страницы

});
