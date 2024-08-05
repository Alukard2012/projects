import os
import logging
from datetime import datetime
from bs4 import BeautifulSoup
import time

# Начальные параметры
root_dir = os.getcwd()  # Каталог, из которого начинается поиск файлов. Можно указать любой путь, по умолчанию текущий.
file_extension = "htm"  # Расширение файлов, в которые будет добавлен мастерпейдж
root_dir_name = "Content"  # Имя корневого каталога, относительно которого вставляется путь до мастерпейджа
masterpage_with_menu = "SideNavPrettifyMistakes.flmsp"  # Мастерпейдж с меню
masterpage_without_menu = "SideNavPrettifyMistakesWithoutMenu.flmsp"  # Мастерпейдж без меню
exclude_conditions = ["Default.Additional", "Default.Expectation", "Default.Obsolete", "Tasks."]
# Список значений атрибута MadCap:conditions, которые исключаются в проекте


def find_files(dir_path, extension):
    return [
        os.path.join(root, file)
        for root, _, files in os.walk(dir_path)
        for file in files if file.endswith(f".{extension}")
    ]


def check_h2_tags(opened_file, tag_attrs, file, logger):
    h2_list = opened_file.find_all("h2", class_="unnum")
    if not h2_list:
        logger.info(f"{file}\n> Нет заголовков h2.unnum. Меню не требуется.")
        return False  # Если ни одного h2.unnum не найдено, нужно проверить мастерпейдж на наличие меню.

    for h2_tag in h2_list:
        if not any(tag in h2_tag.get("MadCap:conditions", "") for tag in tag_attrs):
            logger.info(f"{file}\n> Найден h2.unnum без исключенных тегов. Меню требуется.")
            return True  # Найден h2.unnum без указанных тегов, нужно проверить мастерпейдж на наличие меню.

    logger.info(f"{file}\n> Все заголовки h2.unnum содержат исключенные теги. Меню не требуется.")
    return False  # Все h2.unnum содержат указанные теги, ничего делать не нужно.


def calc_relative_path(dir_name, dir_path):
    if dir_name in dir_path:
        level_count = dir_path.count(os.sep, dir_path.find(dir_name)) - 1
        return (".." + os.sep) * level_count
    return ""


def write_changes(file, soup):
    with open(file, "w", encoding="utf-8") as f:
        f.write(str(soup))


def add_log_str(log_name, log_string, log_string_2):
    max_retries = 5
    for attempt in range(max_retries):
        try:
            with open(f"{log_name}.log", "a", encoding="utf-8") as f:
                f.write(f"{log_string}\n> {log_string_2}\n\n")
            break
        except PermissionError as e:
            if attempt < (max_retries - 1):
                time.sleep(1)  # подождем перед новой попыткой
            else:
                logger = logging.getLogger()
                logger.error(f"Не удалось записать в лог {log_name} после {max_retries} попыток: {e}")


def remove_log(log_name):
    log_path = os.path.join(os.getcwd(), f"{log_name}.log")
    if os.path.exists(log_path):
        try:
            os.remove(log_path)
        except PermissionError as e:
            print(f"Не удалось удалить {log_name}: {e.strerror}")


def setup_logging(log_file):
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    # Создание обработчика для записи логов в файл
    file_handler = logging.FileHandler(log_file, encoding='utf-8')
    file_handler.setFormatter(logging.Formatter('%(message)s'))
    logger.addHandler(file_handler)

    # Создание обработчика для вывода логов в консоль
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(logging.Formatter('%(message)s'))
    logger.addHandler(console_handler)

    # Добавить дату и время создания в лог-файл
    logger.info(f"Лог создан {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

    return logger


def teardown_logging():
    logger = logging.getLogger()
    for handler in logger.handlers[:]:
        handler.close()
        logger.removeHandler(handler)


def main():
    while True:
        try:
            log_config = int(input("Включить дополнительное логирование с группировкой? Да - 1, Нет - 0: "))
            if log_config not in [0, 1]:
                raise ValueError("Введите 1 или 0.")
            break
        except ValueError as e:
            print(f"Некорректный ввод: {e}. Пожалуйста, введите 1 или 0.")

    # Файлы логов
    execution_log = "execution"
    changed_files = "masterpage_added"
    not_changed_files = "not_changed"
    check_needed = "manual_check_needed"

    # Удаление логов перед запуском
    for log_file in [execution_log, changed_files, not_changed_files, check_needed]:
        remove_log(log_file)

    # Настройка логирования
    logger = setup_logging(f"{execution_log}.log")

    for file in find_files(root_dir, file_extension):
        with open(file, "r", encoding="utf-8") as f:
            soup = BeautifulSoup(f, "xml")

        html_tag = soup.html
        if html_tag is None:
            logger.info(f"{file}\n> Нет HTML-тегов.\n")
            if log_config == 1:
                add_log_str(not_changed_files, file, "В файле нет HTML-тегов.")
            continue

        level = calc_relative_path(root_dir_name, file)
        style_attr = html_tag.get("style")
        snippet_block = soup.find("MadCap:snippetBlock")

        # Проверка наличия h2.unnum
        has_unnum_h2 = check_h2_tags(soup, exclude_conditions, file, logger)

        if not has_unnum_h2:
            # Если ни одного h2.unnum не найдено, нужно проверить мастерпейдж
            if style_attr and "mc-master-page" in style_attr:
                if masterpage_with_menu in style_attr:
                    if snippet_block:
                        logger.info(f"> Мастерпейдж с меню. Найден сниппет, может h2 внутри."
                                    f" Требуется ручная проверка. Сохраняем в файл {check_needed}.log.\n")
                        # Мастерпейдж с меню, но h2 не найдены.
                        # Возможно, они есть в сниппете, нужно проверить руками.
                        if log_config == 1:
                            add_log_str(check_needed, file, f"Мастерпейдж с меню, заголовков нет."
                                                            " Требуется проверить заголовки в сниппете.")
                    else:
                        logger.info("> Мастерпейдж с меню, заменяем на без меню.\n")
                        # Мастерпейдж с меню, заменяем на без меню
                        masterpage_path = os.path.join("Resources", "MasterPages", masterpage_without_menu)
                        html_tag['style'] = f"mc-master-page: url(\"{level + masterpage_path}\");"
                        write_changes(file, soup)
                        if log_config == 1:
                            add_log_str(changed_files, file, html_tag['style'])
                else:
                    logger.info("> Мастерпейдж уже без меню, ничего не делаем.\n")
                    # Мастерпейдж без меню, пропускаем
                    if log_config == 1:
                        add_log_str(not_changed_files, file, html_tag['style'])
            else:
                logger.info("> Мастерпейдж не указан или style отсутствует, ничего не делаем.\n")
                # Мастерпейдж вообще не указан или style отсутствует, пропускаем
                if log_config == 1:
                    add_log_str(not_changed_files, file, html_tag['style'] if style_attr else html_tag.attrs)
        else:
            # Есть h2.unnum, анализируем их теги
            if "style" not in html_tag.attrs:
                logger.info("> Style отсутствует. Добавляем style и мастерпейдж с меню.\n")
                # Стиль не указан, добавляем style и мастерпейдж с меню
                masterpage_path = os.path.join("Resources", "MasterPages", masterpage_with_menu)
                full_path = f"mc-master-page: url(\"{level + masterpage_path}\");"
                html_tag['style'] = full_path
                write_changes(file, soup)
                if log_config == 1:
                    add_log_str(changed_files, file, html_tag['style'])
            elif style_attr and masterpage_without_menu in style_attr:
                logger.info("> Указан мастерпейдж без меню. Заменяем мастерпейдж на с меню.\n")
                # Мастерпейдж без меню, заменяем на мастерпейдж с меню
                masterpage_path = os.path.join("Resources", "MasterPages", masterpage_with_menu)
                full_path = f"mc-master-page: url(\"{level + masterpage_path}\");"
                html_tag['style'] = full_path
                write_changes(file, soup)
                if log_config == 1:
                    add_log_str(changed_files, file, html_tag['style'])
            else:
                logger.info("> Мастерпейдж уже с меню, ничего не делаем.\n")
                # Мастерпейдж уже с меню, пропускаем
                if log_config == 1:
                    add_log_str(not_changed_files, file, style_attr)

    logger.info("Работа скрипта завершена успешно.\n")
    teardown_logging()


if __name__ == "__main__":
    main()
    # Выполнение main происходит, если к скрипту обращаются напрямую.
    # Если скрипт подключен как модуль, доступны только функции за пределами main.
