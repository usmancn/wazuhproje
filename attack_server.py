#!/usr/bin/env python3
"""Wazuh Sunum - Saldiri Simülasyonu Sunucusu"""

import json, subprocess, threading, time, os
from http.server import HTTPServer, BaseHTTPRequestHandler

UBUNTU_IP = "192.168.64.4"
SSH_KEY   = os.path.expanduser("~/.ssh/ubuntu_wazuh")
SSH_USER  = "osman"
ALERTS_FILE = os.path.join(os.path.dirname(__file__), "all_alerts.json")
PORT = 8877

HTML_FILE = os.path.join(os.path.dirname(__file__), "sunum_app.html")

def ssh(cmd, timeout=15):
    try:
        r = subprocess.run(
            ["ssh", "-i", SSH_KEY, "-o", "StrictHostKeyChecking=no",
             "-o", f"ConnectTimeout={timeout}", f"{SSH_USER}@{UBUNTU_IP}", cmd],
            capture_output=True, text=True, timeout=timeout+5)
        return r.stdout.strip(), r.returncode == 0
    except Exception as e:
        return str(e), False

def get_status():
    out, ok = ssh("dpkg -l wazuh-manager 2>/dev/null | grep '^ii' | awk '{print $3}'")
    version = out.strip() if ok and out.strip() else "?"
    count_out, _ = ssh("sudo wc -l /var/ossec/logs/alerts/alerts.json 2>/dev/null")
    count = count_out.split()[0] if count_out else "?"
    return {"ok": ok and version != "?", "version": version, "count": count}

def load_alerts():
    alerts = []
    try:
        with open(ALERTS_FILE) as f:
            for line in f:
                line = line.strip()
                if line:
                    try: alerts.append(json.loads(line))
                    except: pass
    except: pass
    return alerts

def run_ssh_attack(username, attempts=8):
    results = []
    for i in range(attempts):
        try:
            port = 55000 + i
            log_msg = f"Invalid user {username} from 192.168.64.1 port {port}"
            subprocess.run(
                ["ssh", "-o", "StrictHostKeyChecking=no",
                 "-o", "ConnectTimeout=3", "-o", "BatchMode=yes",
                 f"osman@{UBUNTU_IP}",
                 f"sudo logger -t sshd '{log_msg}'"],
                capture_output=True, timeout=5)
            results.append({"attempt": i+1, "target": f"{username}@{UBUNTU_IP}", "result": "REJECTED (Simulated)"})
        except Exception as e:
            results.append({"attempt": i+1, "result": str(e)})
        time.sleep(0.2)
    return results

class Handler(BaseHTTPRequestHandler):
    def log_message(self, *a): pass

    def send_json(self, data, code=200):
        body = json.dumps(data, ensure_ascii=False).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def send_html(self, path):
        try:
            with open(path, "rb") as f: body = f.read()
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        except:
            self.send_response(404); self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        p = self.path.split("?")[0]
        if p == "/" or p == "/index.html":
            self.send_html(HTML_FILE)
        elif p == "/api/status":
            self.send_json(get_status())
        elif p == "/api/alerts":
            alerts = load_alerts()
            self.send_json({"alerts": alerts, "total": len(alerts)})
        elif p == "/api/sync":
            # Ubuntu'dan alertleri çek
            out, ok = ssh("sudo cat /var/ossec/logs/alerts/alerts.json 2>/dev/null")
            if ok and out:
                with open(ALERTS_FILE, "w") as f:
                    f.write(out)
                alerts = load_alerts()
                self.send_json({"synced": True, "count": len(alerts)})
            else:
                self.send_json({"synced": False, "count": len(load_alerts())})
        else:
            self.send_response(404); self.end_headers()

    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length)
        try: data = json.loads(body)
        except: data = {}

        if self.path == "/api/attack":
            username = data.get("username", "hacker")
            attempts = int(data.get("attempts", 8))
            threading.Thread(target=run_ssh_attack, args=(username, attempts), daemon=True).start()
            self.send_json({"started": True, "msg": f"{attempts} SSH denemesi başlatıldı → {username}@{UBUNTU_IP}"})
        elif self.path == "/api/sudo_attack":
            # Sudo yetki yükseltme simülasyonu
            out, _ = ssh("sudo id 2>/dev/null && sudo bash -c 'echo SUDO_OK' 2>/dev/null")
            self.send_json({"executed": True, "output": out or "Simüle edildi"})
        else:
            self.send_response(404); self.end_headers()

if __name__ == "__main__":
    print(f"\n{'='*50}")
    print(f"  Wazuh Sunum Sunucusu — Port {PORT}")
    print(f"  http://localhost:{PORT}")
    print(f"  Ubuntu: {UBUNTU_IP}")
    print(f"{'='*50}\n")
    server = HTTPServer(("0.0.0.0", PORT), Handler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nSunucu durduruldu.")
