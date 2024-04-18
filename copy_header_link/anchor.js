'use strict'
document.addEventListener("DOMContentLoaded", function() {
  const copyIconInnerTag = '<path fill-rule="evenodd" clip-rule="evenodd" d="M8.7587 1H15.2413C16.0463 0.999988 16.7106 0.999977 17.2518 1.04419C17.8139 1.09012 18.3306 1.18868 18.816 1.43597C19.5686 1.81947 20.1805 2.43139 20.564 3.18404C20.8113 3.66937 20.9099 4.18608 20.9558 4.74817C21 5.28936 21 5.95372 21 6.75868V9.5C21 10.0523 20.5523 10.5 20 10.5C19.4477 10.5 19 10.0523 19 9.5V6.8C19 5.94342 18.9992 5.36113 18.9624 4.91104C18.9266 4.47262 18.8617 4.24842 18.782 4.09202C18.5903 3.7157 18.2843 3.40973 17.908 3.21799C17.7516 3.1383 17.5274 3.07337 17.089 3.03755C16.6389 3.00078 16.0566 3 15.2 3H8.8C7.94342 3 7.36113 3.00078 6.91104 3.03755C6.47262 3.07337 6.24842 3.1383 6.09202 3.21799C5.7157 3.40973 5.40973 3.7157 5.21799 4.09202C5.1383 4.24842 5.07337 4.47262 5.03755 4.91104C5.00078 5.36113 5 5.94342 5 6.8V17.2C5 18.0566 5.00078 18.6389 5.03755 19.089C5.07337 19.5274 5.1383 19.7516 5.21799 19.908C5.40973 20.2843 5.7157 20.5903 6.09202 20.782C6.24842 20.8617 6.47262 20.9266 6.91104 20.9624C7.36113 20.9992 7.94342 21 8.8 21H12C12.5523 21 13 21.4477 13 22C13 22.5523 12.5523 23 12 23H8.75868C7.95372 23 7.28936 23 6.74817 22.9558C6.18608 22.9099 5.66937 22.8113 5.18404 22.564C4.43139 22.1805 3.81947 21.5686 3.43597 20.816C3.18868 20.3306 3.09012 19.8139 3.04419 19.2518C2.99998 18.7106 2.99999 18.0463 3 17.2413V6.7587C2.99999 5.95373 2.99998 5.28937 3.04419 4.74817C3.09012 4.18608 3.18868 3.66937 3.43597 3.18404C3.81947 2.43139 4.43139 1.81947 5.18404 1.43597C5.66937 1.18868 6.18608 1.09012 6.74817 1.04419C7.28937 0.999977 7.95373 0.999988 8.7587 1Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M14 14C12.8954 14 12 14.8954 12 16C12 17.1046 12.8954 18 14 18H15.2C15.7523 18 16.2 18.4477 16.2 19C16.2 19.5523 15.7523 20 15.2 20H14C11.7909 20 10 18.2091 10 16C10 13.7909 11.7909 12 14 12H15.2C15.7523 12 16.2 12.4477 16.2 13C16.2 13.5523 15.7523 14 15.2 14H14ZM17.8 13C17.8 12.4477 18.2477 12 18.8 12H20C22.2091 12 24 13.7909 24 16C24 18.2091 22.2091 20 20 20H18.8C18.2477 20 17.8 19.5523 17.8 19C17.8 18.4477 18.2477 18 18.8 18H20C21.1046 18 22 17.1046 22 16C22 14.8954 21.1046 14 20 14H18.8C18.2477 14 17.8 13.5523 17.8 13ZM13 16C13 15.4477 13.4477 15 14 15L20 15C20.5523 15 21 15.4477 21 16C21 16.5523 20.5523 17 20 17L14 17C13.4477 17 13 16.5523 13 16Z"/>';
  const checkIconInnerTag = '<defs><style>.cls-1{fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}</style></defs><title/><g id="checkmark"><line class="cls-1" x1="3" x2="12" y1="16" y2="25"/><line class="cls-1" x1="12" x2="29" y1="25" y2="7"/></g>';

  function createSvgIcon(viewBoxValue, innerHtmlValue, className, isHidden) {
    const svgIcon = document.createElementNS("http://www.w3.org/2000/svg","svg"); // Создаем элемент SVG
    svgIcon.setAttributeNS(null,"viewBox",viewBoxValue); // Задаем значения viewBox.
    svgIcon.innerHTML = innerHtmlValue; // Добавляем теги внутрь SVG.
    svgIcon.classList.add(className); // Устанавливаем класс для SVG-элемента
    if (isHidden == true) svgIcon.classList.add('hidden'); // Устанавливаем класс, в котором прописано свойство для скрытия элемента со страницы.

    return svgIcon;
  }

  if (document.querySelector('h2[id]')) {
    const headersList = document.querySelectorAll('h2'); // Ищем заголовки.
    headersList.forEach((item) => {
      const copyBtnAttrs = createSvgIcon("0 0 24 24", copyIconInnerTag, 'copy_btn', true);
      const copyBtn = item.appendChild(copyBtnAttrs); // Создаем кнопки у каждого заголовка.
      const copyIcon = item.querySelector('.copy_btn');

      item.addEventListener('mouseenter', () => { // Проверяем, когда курсор наведен на заголовок.
        copyIcon.classList.remove('hidden');
      });
      item.addEventListener('mouseleave', () => { // Проверяем, когда курсор смещен с заголовка.
        if (!copyIcon.classList.contains('hidden')) {
          copyIcon.classList.add('hidden') // Скрываем кнопку.
        };
        const checkIcon = item.querySelector('.check_icon');
        if (checkIcon) {
          checkIcon.remove(); // Удаляем значок.
        };
      });

      copyBtn.addEventListener('click', (e) => { // Навешиваем слушатель клика по кнопке.
        const header = e.target.closest('h2'); // Ищем ближайший к нажатой кнопке заголовок.
        if (header) {
          const newUrl = location.protocol + '//' + location.host + location.pathname + '#' + header.id;
          history.pushState('', '', newUrl); // Заменяем URL в адресной строке без обновления страницы.
          navigator.clipboard.writeText(newUrl); // Копируем URL в буфер.
          copyIcon.classList.add('hidden'); // Скрываем кнопку.
          const checkIconAttrs = createSvgIcon("0 0 32 32", checkIconInnerTag, 'check_icon', false);
          const checkIcon = item.appendChild(checkIconAttrs); // Создаем значок у заголовка, где была нажата кнопка.
        };
      });
    });
  }
});
