const text = `Aşağıdaki bash komutu ile fail2ban yüklenir:
\`\`\`bash
sudo apt-get install fail2ban
\`\`\`
`;
const res = text.replace(/```[a-zA-Z]*[ \r\n]*([\s\S]*?)```/g, "<pre>$1</pre>");
console.log(res);
