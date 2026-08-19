import socket,subprocess,sys,time,webbrowser
from pathlib import Path
ROOT=Path(__file__).resolve().parent; VENDOR=ROOT/"vendor"
if VENDOR.exists():sys.path.insert(0,str(VENDOR))
def ready():
    try:
        with socket.create_connection(("127.0.0.1",8765),timeout=.3):return True
    except OSError:return False
if not ready():
    flags=subprocess.CREATE_NO_WINDOW if sys.platform=="win32" else 0
    subprocess.Popen([sys.executable,"-m","uvicorn","backend.main:app","--host","127.0.0.1","--port","8765"],cwd=ROOT,creationflags=flags)
    for _ in range(80):
        if ready():break
        time.sleep(.25)
edge=Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"); url="http://127.0.0.1:8765"
subprocess.Popen([str(edge),f"--app={url}","--start-maximized"]) if edge.exists() else webbrowser.open(url)
