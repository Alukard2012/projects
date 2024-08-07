import os
import subprocess
import requests
from time import sleep
import signal
import socket
import sys


# Проверяет, установлен ли указанный программный компонент.
def is_program_installed(program):
    try:
        subprocess.check_output([program, "--version"], stderr=subprocess.STDOUT)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False


# Проверяет, что Docker Daemon запущен.
def ensure_docker_running():
    try:
        subprocess.check_output(["docker", "info"], stderr=subprocess.STDOUT)
        print("Docker daemon is running.", flush=True)
    except subprocess.CalledProcessError:
        print("Docker daemon is not running. Start Docker and retry.", flush=True)
        sys.exit(1)


# Устанавливает pip с помощью ensurepip.
def install_pip():
    run_command("python -m ensurepip --upgrade")
    run_command("python -m pip install --upgrade pip")


# Устанавливает Node.js с помощью npm и 'n'.
def install_node():
    run_command("npm install -g n")
    run_command("n latest")


# Устанавливает npm.
def install_npm():
    run_command("npm install -g npm")


# Устанавливает Puppeteer с помощью npm.
def install_puppeteer():
    run_command("npm install puppeteer")


# Устанавливает Python-зависимости из requirements.txt.
def install_python_dependencies():
    if os.path.exists("requirements.txt"):
        run_command("pip install -r requirements.txt")
    else:
        print("Error: requirements.txt file not found.", flush=True)
        sys.exit(1)


# Запускает команду в shell.
def run_command(command):
    process = subprocess.Popen(command, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    process.wait()
    if process.returncode != 0:
        raise subprocess.CalledProcessError(process.returncode, command)


# Проверяет, удовлетворены ли все Python-зависимости.
def check_python_dependencies():
    try:
        subprocess.check_output(["pip", "check"], stderr=subprocess.STDOUT)
        print("Python dependencies are already satisfied.", flush=True)
        return True
    except subprocess.CalledProcessError:
        return False


# Проверяет наличие файла workspace.
def check_workspace_file():
    dsl_exists = os.path.exists("workspace.dsl")
    json_exists = os.path.exists("workspace.json")
    if not dsl_exists and not json_exists:
        print("Error: workspace file not found. Please ensure 'workspace.dsl' or 'workspace.json' exists.", flush=True)
        sys.exit(1)


# Запускает Structurizr Lite в Docker и возвращает ID контейнера и порт.
def start_structurizr():
    port = 8080
    while True:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('localhost', port)) != 0:
                break
            port += 1

    current_dir = os.getcwd()
    command = f"docker run -d --rm -p {port}:8080 -v {current_dir}:/usr/local/structurizr structurizr/lite"
    print(f"Starting Structurizr Lite on port {port} with command: {command}", flush=True)
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                               universal_newlines=True)
    out, err = process.communicate()
    if process.returncode != 0:
        print(f"Failed to start Structurizr Lite: {err.strip()}", flush=True)
        sys.exit(1)

    container_id = out.strip()
    return container_id, port


# Ждет, пока сервер Structurizr Lite станет доступен.
def wait_for_server(port):
    url = f"http://localhost:{port}"
    for _ in range(24):  # 2 минуты
        try:
            if requests.get(url).status_code == 200:
                return True
        except requests.ConnectionError:
            sleep(5)
    return False


# Загружает диаграммы с Structurizr Lite.
def download_diagrams(port):
    command = f"node export-diagrams.js http://localhost:{port}/workspace/diagrams png"
    print(f"Running command to download diagrams: {command}", flush=True)
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                               universal_newlines=True)
    for line in process.stdout:
        print(line, end="", flush=True)
    for line in process.stderr:
        print(line, end="", flush=True)
    process.wait()


# Останавливает Structurizr контейнер.
def stop_structurizr(container_id):
    subprocess.run(f"docker stop {container_id}", shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


# Проверяет, установлен ли Puppeteer.
def is_puppeteer_installed():
    try:
        result = subprocess.run(["npm", "list", "puppeteer"], capture_output=True, text=True)
        if "puppeteer" in result.stdout:
            return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False
    return False


# Обрабатывает сигналы завершения процесса.
def handle_signal(signum, frame):
    sys.exit(0)


# Основная программа.
if __name__ == "__main__":
    signal.signal(signal.SIGTERM, handle_signal)
    signal.signal(signal.SIGINT, handle_signal)

    # Проверяет наличие workspace файлов
    check_workspace_file()

    print("Checking and installing dependencies...", flush=True)

    node_installed = is_program_installed("node")
    npm_installed = is_program_installed("npm")
    pip_installed = is_program_installed("pip")
    puppeteer_installed = is_puppeteer_installed()
    python_dependencies_satisfied = check_python_dependencies()

    if not node_installed:
        install_node()

    if not npm_installed:
        install_npm()

    if not pip_installed:
        install_pip()

    if not puppeteer_installed:
        install_puppeteer()

    if not python_dependencies_satisfied:
        install_python_dependencies()

    print("Dependencies are installed and ready.", flush=True)
    ensure_docker_running()

    container_id, port = start_structurizr()

    print("Waiting for Structurizr Lite to be ready...", flush=True)
    if not wait_for_server(port):
        print("The server did not become ready in time.", flush=True)
        stop_structurizr(container_id)
        sys.exit(1)

    # Загружает диаграммы после запуска и гарантии готовности сервера
    download_diagrams(port)
    stop_structurizr(container_id)
    print("Process completed successfully.", flush=True)
