import os
from bs4 import BeautifulSoup

dir_path = os.getcwd()  # Каталог, из которого стартует скрипт, можно указать любой путь.
extension = 'htm'  # Расширение файлов, в которые будет добавлен мастерпейдж.
dir_name = 'Content'  # Имя корневого каталога, относительно которого вставляется путь до мастерпейджа.
masterpage = 'SideNavPrettifyMistakes.flmsp'  # Файл мастерпейджа с расширением.

def find_files(dir_path, extension):
    file_list = []
    for root, dirs, files in os.walk(dir_path):
        for file in files:
            if file.endswith('.' + extension):
                file_path = os.path.join(root, file)
                file_list.append(file_path)
    return file_list


def calc_relative_path(dir_name, dir_path):
    if dir_name in dir_path:
        pos = dir_path.find(dir_name)
        level_count = dir_path.count(os.sep, pos) - 1
        path_level = ('..' + os.sep) * level_count
        return path_level


def write_changes(file):
    with open(file, 'w', encoding='utf-8') as f:
        f.write(str(soup))


def add_log_str(log_name, log_string, log_string_2):
    with open(log_name + '.log', 'a', encoding='utf-8') as f:
        f.write(f'{log_string}\n{log_string_2}\n\n')


def remove_log(log_name):
    os.remove(os.path.join(os.getcwd(), log_name))


log_config = int(input('Включить логирование? Да - 1, Нет - 0: '))
if log_config == 1:
    log_files = find_files(os.getcwd(), 'log')
    remove_list = ['style_added.log', 'masterpage_added.log', 'not_changed.log']
    for file in remove_list:
        for log_file in log_files:
            if file == os.path.basename(log_file):
                remove_log(file)

for file in find_files(dir_path, extension):
    with open(file, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f, 'xml')

    html_tag = soup.html
    level = calc_relative_path(dir_name, file)
    masterpage_path = str(os.path.join('Resources', 'MasterPages', masterpage))
    full_path = f'mc-master-page: url(\'{level + masterpage_path}\');'

    if 'style' not in html_tag.attrs:
        html_tag['style'] = full_path
        write_changes(file)
        if log_config == 1:
            add_log_str('style_added', file, html_tag['style'])

    elif 'style' in html_tag.attrs and 'mc-master-page' not in html_tag['style']:
        html_tag['style'] += ' ' + full_path
        write_changes(file)
        if log_config == 1:
            add_log_str('masterpage_added', file, html_tag['style'])

    else:
        if log_config == 1:
            add_log_str('not_changed', file, html_tag['style'])
