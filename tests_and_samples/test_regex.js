const rpt = `## 📤 auth.log Analizi
### 🔴 [CRITICAL] SSH_BRUTE_FORCE

## 📜 syslog Analizi
Bu dosyada önemli bir tehdit tespit edilmedi.

## 🖥️ kern.log Analizi
### 🔵 [MEDIUM] APPARMOR_BLOCK`;

const authMatch = rpt.match(/## 📤 auth\.log Analizi[^\n]*\n([\s\S]*?)(?=## 📜 syslog Analizi|## 🖥️ kern\.log Analizi|$)/);
const sysMatch = rpt.match(/## 📜 syslog Analizi[^\n]*\n([\s\S]*?)(?=## 🖥️ kern\.log Analizi|$)/);
console.log(authMatch ? authMatch[1].trim() : "NOT MATCHED");
console.log(sysMatch ? sysMatch[1].trim() : "NOT MATCHED");
