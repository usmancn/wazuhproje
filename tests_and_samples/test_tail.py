import subprocess
import time

cmd = ["ssh", "-i", "/Users/osmancingoz/.ssh/ubuntu_wazuh", "-o", "StrictHostKeyChecking=no", "osman@192.168.64.4", "stdbuf -oL sudo tail -F /var/ossec/logs/alerts/alerts.json"]
proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, text=True, bufsize=1)

start = time.time()
for line in proc.stdout:
    print(time.time() - start, "GOT LINE:", line[:50])
    if time.time() - start > 5:
        break
