    function switchAITab(tabId, btn) {
      document.querySelectorAll('.ai-tab-content').forEach(function (el) { el.classList.remove('active'); });
      document.querySelectorAll('.ai-tab-btn').forEach(function (el) { el.classList.remove('active'); });
      document.getElementById(tabId).classList.add('active');
      btn.classList.add('active');
    }
    const API = 'http://localhost:8877';
    const BRUTE = [
      { r: "5710", l: 5, d: "sshd: Attempt to login - non-existent user", log: "Invalid user hacker from 192.168.64.1 port 41200", t: "12:39:01" },
      { r: "5710", l: 5, d: "sshd: Attempt to login - non-existent user", log: "Invalid user hacker from 192.168.64.1 port 41210", t: "12:39:02" },
      { r: "5710", l: 5, d: "sshd: Attempt to login - non-existent user", log: "Invalid user hacker from 192.168.64.1 port 41220", t: "12:39:03" },
      { r: "5710", l: 5, d: "sshd: Attempt to login - non-existent user", log: "Invalid user hacker from 192.168.64.1 port 41230", t: "12:39:04" },
      { r: "5710", l: 5, d: "sshd: Attempt to login - non-existent user", log: "Invalid user hacker from 192.168.64.1 port 41240", t: "12:39:05" },
      { r: "5710", l: 5, d: "sshd: Attempt to login - non-existent user", log: "Invalid user hacker from 192.168.64.1 port 41250", t: "12:39:06" },
      { r: "5710", l: 5, d: "sshd: Attempt to login - non-existent user", log: "Invalid user hacker from 192.168.64.1 port 41260", t: "12:39:07" },
      { r: "5712", l: 10, d: "sshd: BRUTE FORCE DETECTED - access attempt!", log: "Invalid user hacker from 192.168.64.1 port 41270", t: "12:39:08" }
    ];

    function show(id, btn) {
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.getElementById(id).classList.add('active');
      btn.classList.add('active');
      if (id === 'ai') loadAIPage();
    }

    function showTab(id, btn) {
      document.querySelectorAll('.tab-content').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.getElementById(id).classList.add('active');
      btn.classList.add('active');
    }

    var _aiRefreshTimer = null;
    var _pollTimer = null;

    function runLiveAnalysis() {
      var btn = document.getElementById('btn-live-analyze');
      var box = document.getElementById('live-analyze-status');
      var step = document.getElementById('live-analyze-step');
      if (btn) { btn.disabled = true; btn.innerHTML = '<span style="animation:spin 1s linear infinite; display:inline-block">⏳</span> Başlatılıyor...'; }
      if (box) box.style.display = 'flex';
      if (step) step.textContent = 'Güvenlik API\'sine bağlanılıyor...';

      ['auth-findings', 'syslog-findings', 'kern-findings'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.innerHTML = '<div style="color:var(--blue);text-align:center;padding:30px;font-size:0.85rem;animation:pulse 1.5s infinite;"> Canlı Loglar Çekiliyor & Analiz Ediliyor...</div>';
      });
      var rep = document.getElementById('ai-report-content');
      if (rep) rep.innerHTML = '<div style="color:var(--blue);text-align:center;padding:40px;animation:pulse 1.5s infinite;"> Seçili Otonom Yapay Zeka (AI) Modeli düşüncesini oluşturuyor...</div>';

      var provider = document.getElementById('llmProviderSel') ? document.getElementById('llmProviderSel').value : 'gemini';

      fetch(API + '/api/run_live_analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: '', llm_provider: provider })
      }).then(r => r.json()).then(res => {
        if (!res.started) {
          if (step) step.textContent = res.msg || 'Zaten çalışıyor';
          return;
        }
        pollAnalysisStatus();
      }).catch(() => {
        if (step) step.textContent = ' Hata: attack_server.py çalışmıyor';
        if (btn) { btn.disabled = false; btn.innerHTML = 'Analizi Başlat'; }
      });
    }

    function pollAnalysisStatus() {
      if (_pollTimer) clearInterval(_pollTimer);
      _pollTimer = setInterval(function () {
        fetch(API + '/api/analyze_status').then(r => r.json()).then(s => {
          var step = document.getElementById('live-analyze-step');
          var btn = document.getElementById('btn-live-analyze');
          var box = document.getElementById('live-analyze-status');
          if (step) step.textContent = s.step || '...';
          if (s.done || !s.running) {
            clearInterval(_pollTimer);
            if (btn) { btn.disabled = false; btn.innerHTML = 'Analizi Yeniden Başlat'; }
            if (s.error) {
              if (step) step.textContent = ' Hata: ' + s.error;
            } else {
              if (box) setTimeout(function () { box.style.display = 'none'; }, 2000);
              loadAIPage();
            }
          }
        });
      }, 2000);
    }

    function renderLogFindings(containerId, badgeId, findings, logSource) {
      var el = document.getElementById(containerId);
      var badge = document.getElementById(badgeId);
      if (!findings || !findings.length) {
        el.innerHTML = '<div style="color:#27ae60;font-size:0.8rem;text-align:center;padding:30px;letter-spacing:0.3px;">Tehdit tespit edilmedi — Log temiz.</div>';
        if (badge) badge.textContent = 'Temiz';
        return;
      }
      if (badge) {
        var c = findings.filter(f => f.severity === 'CRITICAL').reduce((s, f) => s + (f.event_count || 1), 0);
        var h = findings.filter(f => f.severity === 'HIGH').reduce((s, f) => s + (f.event_count || 1), 0);
        var m = findings.filter(f => f.severity === 'MEDIUM').reduce((s, f) => s + (f.event_count || 1), 0);
        badge.innerHTML = (c ? '<b style="color:var(--crit)">' + c + ' KRİTİK</b> ' : '') + (h ? '<b style="color:var(--warn)">' + h + ' YÜKSEK</b> ' : '') + (m ? '<b style="color:var(--blue)">' + m + ' ORTA</b>' : '');
      }

      el.innerHTML = '';
      var llmProvider = (document.getElementById('llmProviderSel') || { value: 'gemini' }).value;
      var apiKey = window._geminiKey || '';

      findings.forEach(function (f, idx) {
        var sev = (f.severity || '').toUpperCase();
        var normalizedSev = (sev.includes('CRIT') || sev.includes('KRİT') || sev.includes('KRIT')) ? 'CRITICAL' : 
                            (sev.includes('HIGH') || sev.includes('YÜK') || sev.includes('YUK')) ? 'HIGH' : 'MEDIUM';
        f.severity = normalizedSev;
        
        var sevColor = f.severity === 'CRITICAL' ? 'var(--crit)' : f.severity === 'HIGH' ? 'var(--warn)' : 'var(--blue)';
        var sevTr = f.severity === 'CRITICAL' ? 'KRİTİK' : f.severity === 'HIGH' ? 'YÜKSEK' : 'ORTA';
        var aiId = containerId + '-ai-' + idx;

        var alertPayload = {
          rule: {
            id: f.rule_id || '0000', description: f.description, level: f.severity === 'CRITICAL' ? 10 : f.severity === 'HIGH' ? 7 : 3,
            mitre: f.mitre ? { id: [f.mitre], tactic: [f.tactic || ''], technique: [f.technique || ''] } : {}
          },
          full_log: f.sample_log || f.description,
          agent: { name: 'osmanubuntu' },
          llm_provider: llmProvider,
          api_key: apiKey
        };
        var encodedPayload = encodeURIComponent(JSON.stringify(alertPayload)).replace(/'/g, "%27");
        var countStr = (f.event_count > 1 ? f.event_count : '1') + ' olay';

        var card = document.createElement('div');
        card.className = 'ai-threat-card';
        card.setAttribute('data-severity', sevTr);
        
        var rawLogHtml = '';
        if (f.sample_log) {
          rawLogHtml = '<div style="font-family:var(--font-mono); font-size:0.68rem; color:var(--t2); background:rgba(0,0,0,0.3); border:1px solid var(--border-soft); padding:6px; border-radius:4px; max-height:80px; overflow-y:auto; margin-top:6px;">' + f.sample_log + '</div>';
        }

        var mitreHtml = f.mitre ? '<span class="ai-threat-mitre">' + f.mitre + '</span>' : '';

        card.innerHTML = 
          '<div class="ai-threat-header">' +
            '<span style="background:' + sevColor + '22; color:' + sevColor + '; border:1px solid ' + sevColor + '44; padding:3px 10px; border-radius:12px; font-size:0.65rem; font-weight:700; text-transform:uppercase;">' + sevTr + '</span>' +
            mitreHtml +
          '</div>' +
          '<div class="ai-threat-desc" style="margin-top:6px;">' + f.description + '</div>' +
          rawLogHtml +
          '<div class="ai-threat-footer" style="margin-top:10px;">' +
            '<div class="ai-threat-meta">' +
              '<span>Olay: ' + countStr + '</span>' +
              '<span>Log: <strong style="color:var(--blue)">' + logSource + '</strong></span>' +
            '</div>' +
            '<div class="ai-trigger-box">' +
              '<select class="modern-select localSelector" style="padding:4px 8px; font-size:0.7rem; margin-right:8px; background:rgba(0,0,0,0.3); color:var(--blue); border:1px solid var(--border); border-radius:3px;">' +
                '<option value="gemini" selected>Gemini</option>' +
                '<option value="ollama">Ollama</option>' +
              '</select>' +
              '<button onclick="triggerCardAnalysis(this, \'' + encodedPayload + '\')" style="padding:4px 10px; background:linear-gradient(135deg,var(--blue),var(--purple)); border:none; border-radius:4px; color:#fff; font-size:0.65rem; font-weight:600; cursor:pointer; text-transform:uppercase;">AI ile Detay</button>' +
            '</div>' +
          '</div>' +
          '<div class="ai-res-content" id="' + aiId + '" style="display:none; margin-top:10px; border-top:1px dashed var(--border); padding-top:10px; font-size:0.75rem; line-height:1.6;"></div>';
        
        el.appendChild(card);
      });
    }

    function exportReportPDF() {
      var content = document.getElementById('ai-report-content');
      var reportFile = document.getElementById('ai-report-file');
      if (!content || content.innerText.trim().length < 20) {
        alert('Önce bir analiz raporu oluşturmanız gerekiyor.');
        return;
      }
      var filename = (reportFile && reportFile.textContent) ? reportFile.textContent : 'wazuh_analiz_raporu';
      var printWindow = window.open('', '_blank', 'width=900,height=700');
      printWindow.document.write('<html><head><title>' + filename + '</title>');
      printWindow.document.write('<style>');
      printWindow.document.write('body { font-family: "Segoe UI", sans-serif; font-size:13px; color:#1a1a2e; background:#fff; padding:40px; line-height:1.7; }');
      printWindow.document.write('h1,h2,h3 { color:#0d47a1; border-bottom:1px solid #e0e0e0; padding-bottom:6px; }');
      printWindow.document.write('pre, code { background:#f5f5f5; padding:4px 8px; border-radius:4px; font-size:12px; }');
      printWindow.document.write('pre { display:block; padding:12px; overflow-x:auto; white-space:pre-wrap; }');
      printWindow.document.write('.header { border-bottom:2px solid #0d47a1; padding-bottom:12px; margin-bottom:24px; }');
      printWindow.document.write('* { color: #1a1a2e !important; text-shadow: none !important; }');
      printWindow.document.write('pre, code { color: #d32f2f !important; }');
      printWindow.document.write('@media print { body { padding:20px; } }');
      printWindow.document.write('</style></head><body>');
      printWindow.document.write('<div class="header"><h1>Wazuh AI SIEM — Guvenlik Analiz Raporu</h1>');
      printWindow.document.write('<p style="color:#555;font-size:12px;">Dosya: ' + filename + ' | Tarih: ' + new Date().toLocaleString('tr-TR') + '</p></div>');
      printWindow.document.write(content.innerHTML);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      setTimeout(function () { printWindow.print(); }, 500);
    }

    function downloadMarkdown() {
      var content = document.getElementById('ai-report-content');
      if (!content || content.innerText.trim().length < 20) return alert('Önce bir analiz raporu oluşturmanız gerekiyor.');
      var rawMd = window._lastMarkdownReport || content.innerText;
      var blob = new Blob([rawMd], { type: 'text/markdown' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'wazuh_ai_rapor.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    function copyMarkdown() {
      var content = document.getElementById('ai-report-content');
      if (!content || content.innerText.trim().length < 20) return alert('Önce bir analiz raporu oluşturmanız gerekiyor.');
      var rawMd = window._lastMarkdownReport || content.innerText;
      navigator.clipboard.writeText(rawMd).then(() => alert('Markdown panoya kopyalandı!'));
    }

    function loadAIPage() {
      var now = new Date();
      var badge = document.getElementById('ai-refresh-badge');
      if (badge) badge.textContent = 'Son güncelleme: ' + now.toLocaleTimeString('tr-TR');

      // Her halükarda gerçek logları çek (AI sonucu olmasa bile)
      fetch(API + '/api/raw_logs').then(r => r.json()).then(rawRes => {
        if (rawRes.ok) {
          var authEl = document.getElementById('raw-auth-log');
          if (authEl && rawRes['auth.log']) authEl.textContent = rawRes['auth.log'].join('\n');
          var sysEl = document.getElementById('raw-syslog-log');
          if (sysEl && rawRes['syslog']) sysEl.textContent = rawRes['syslog'].join('\n');
          var kernEl = document.getElementById('raw-kern-log');
          if (kernEl && rawRes['kern.log']) kernEl.textContent = rawRes['kern.log'].join('\n');
        }
      }).catch(() => {});


      fetch(API + '/api/per_source').then(r => r.json()).then(res => {
        var crit = 0, high = 0, med = 0, event_sum = 0;
        if (res.ok && res.data) {
          var d = res.data;
          renderLogFindings('auth-findings', 'auth-badge', d['auth.log'] || [], 'auth.log');
          renderLogFindings('syslog-findings', 'syslog-badge', d['syslog'] || [], 'syslog');
          renderLogFindings('kern-findings', 'kern-badge', d['kern.log'] || [], 'kern.log');

          ['auth.log', 'syslog', 'kern.log'].forEach(k => {
            (d[k] || []).forEach(f => {
              var c = f.event_count || 1;
              event_sum += c;
              var sev = (f.severity || '').toUpperCase();
              if (sev.includes('CRIT') || sev.includes('KRİT') || sev.includes('KRIT')) crit += c;
              else if (sev.includes('HIGH') || sev.includes('YÜK') || sev.includes('YUK')) high += c;
              else med += c;
            });
          });
          renderMitreMap(d);
        } else {
          var msg = '<div style="color:var(--t2);text-align:center;padding:30px;font-size:0.85rem;">Analiz verisi bulunamadı. Lütfen Canlı Analiz başlatın.</div>';
          ['auth-findings', 'syslog-findings', 'kern-findings'].forEach(id => { var el = document.getElementById(id); if (el) el.innerHTML = msg; });
        }
        var set = function (id, v) { var e = document.getElementById(id); if (e) e.textContent = v || '0'; };
        set('cnt-critical', crit); set('cnt-high', high); set('cnt-medium', med); set('cnt-total', event_sum);
      }).catch(() => { });

      fetch(API + '/api/latest_report').then(r => r.json()).then(res => {
        var el = document.getElementById('ai-report-content');
        var fl = document.getElementById('ai-report-file');
        if (res.ok && res.report) {
          if (fl) fl.textContent = res.file;
          var titleEl = document.getElementById('ai-report-title');
          if (titleEl) {
            var provMatch = res.report.match(/LLM:\**\s*(OLLAMA|GEMINI|OPENAI|LLAMA3)/i);
            var reportLLM = provMatch ? provMatch[1].toUpperCase() : 'GEMINI';
            var mName = reportLLM === 'OLLAMA' || reportLLM === 'LLAMA3' ? 'Ollama (Yerel Model)' : reportLLM === 'OPENAI' ? 'OpenAI GPT-4o' : 'Google Gemini 2.5 Flash';
            titleEl.innerHTML = '<span style="font-size: 1.3rem;"></span> ' + mName + ' — Kapsamlı Otonom Rapor';
          }

          var rpt = res.report;
          var authMatch = rpt.match(/##  auth\.log Analizi[^\n]*\n([\s\S]*?)(?=## syslog Analizi|##  kern\.log Analizi|$)/);
          var sysMatch = rpt.match(/## syslog Analizi[^\n]*\n([\s\S]*?)(?=##  kern\.log Analizi|$)/);
          var kernMatch = rpt.match(/##  kern\.log Analizi[^\n]*\n([\s\S]*?)(?=## |$)/);

          function formatMarkdownToHTML(text) {
            var lines = text.split(/\r?\n/);
            var formatted = '';
            var inCodeBlock = false;
            var codeContent = '';

            for (var i = 0; i < lines.length; i++) {
              var l = lines[i].trim();

              if (l.startsWith('```')) {
                if (inCodeBlock) {
                  formatted += '<div style="margin-top:10px;margin-bottom:10px;"><pre style="background:#000;color:var(--t2);padding:16px;border-radius:8px;font-family:var(--font-mono);font-size:0.8rem;border:1px solid var(--border);overflow-x:auto;">' + codeContent + '</pre></div>';
                  inCodeBlock = false;
                  codeContent = '';
                } else {
                  inCodeBlock = true;
                }
                continue;
              }

              if (inCodeBlock) {
                codeContent += lines[i] + '\n';
                continue;
              }

              if (!l) { formatted += '<div style="height:10px;"></div>'; continue; }

              l = l.replace(/\[(CRITICAL|KRİTİK|Kritik)\]/gi, '<span style="background:var(--crit);color:#fff;padding:2px 6px;border-radius:4px;font-size:0.75rem;font-weight:700;">$1</span>')
                   .replace(/\[(HIGH|YÜKSEK|Yüksek)\]/gi, '<span style="background:var(--warn);color:#111;padding:2px 6px;border-radius:4px;font-size:0.75rem;font-weight:700;">$1</span>')
                   .replace(/\[(MEDIUM|ORTA|Orta)\]/gi, '<span style="background:var(--ok);color:#111;padding:2px 6px;border-radius:4px;font-size:0.75rem;font-weight:700;">$1</span>')
                   .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#fff">$1</strong>')
                   .replace(/`(.*?)`/g, '<code style="background:rgba(255,255,255,0.1);padding:2px 6px;border-radius:4px;color:var(--blue);">$1</code>');

              if (l.startsWith('# ')) {
                formatted += '<div style="color:var(--blue);font-weight:700;font-size:1.4rem;margin:20px 0 10px 0;border-bottom:1px solid rgba(14,165,233,0.3);padding-bottom:10px;">' + l.substring(2) + '</div>';
              } else if (l.startsWith('## ')) {
                formatted += '<div style="color:var(--purple);font-weight:700;font-size:1.2rem;margin:20px 0 10px 0;">' + l.substring(3) + '</div>';
              } else if (l.startsWith('### ')) {
                var h = l.replace('### ', '');
                var icon = '';
                var color = '#fff';
                if (h.includes('[CRITICAL]')) { icon = ''; color = 'var(--crit)'; h = h.replace('', '').replace('[CRITICAL]', '').trim(); }
                else if (h.includes('[HIGH]')) { icon = ''; color = 'var(--warn)'; h = h.replace('', '').replace('[HIGH]', '').trim(); }
                else if (h.includes('[MEDIUM]')) { icon = ''; color = 'var(--accent)'; h = h.replace('', '').replace('[MEDIUM]', '').trim(); }
                else if (h.includes('[LOW]')) { icon = ''; color = 'var(--ok)'; h = h.replace('', '').replace('[LOW]', '').trim(); }
                formatted += '<div style="color:' + color + ';font-weight:700;margin-top:16px;margin-bottom:8px;font-size:0.95rem;display:flex;align-items:center;gap:6px;">' + icon + ' ' + h + '</div>';
              } else if (l.toLowerCase().startsWith('- ne oldu:') || l.toLowerCase().startsWith('- **ne oldu:**')) {
                var textCont = l.replace(/- \**Ne [Oo]ldu:\** ?/i, '').trim();
                formatted += '<div style="margin-bottom:4px;padding-left:12px;border-left:2px solid rgba(255,255,255,0.1);"><strong style="color:var(--t2);">Durum:</strong> <span style="color:#e2e8f0;">' + textCont + '</span></div>';
              } else if (l.toLowerCase().startsWith('- risk:') || l.toLowerCase().startsWith('- **risk:**')) {
                var textCont = l.replace(/- \**Risk:\** ?/i, '').trim();
                formatted += '<div style="margin-bottom:4px;padding-left:12px;border-left:2px solid rgba(255,255,255,0.1);"><strong style="color:var(--t2);">Risk:</strong> <span style="color:var(--warn);">' + textCont + '</span></div>';
              } else if (l.toLowerCase().startsWith('- yapılacak:') || l.toLowerCase().startsWith('- **yapılacak:**') || l.toLowerCase().startsWith('- çözüm komutu:') || l.toLowerCase().startsWith('- **çözüm komutu:**')) {
                var textCont = l.replace(/- \**Yapılacak:\** ?/i, '').replace(/- \**Çözüm Komutu:\** ?/i, '').trim();
                formatted += '<div style="margin-bottom:12px;padding-left:12px;border-left:2px solid rgba(255,255,255,0.1);"><strong style="color:var(--t2);">Aksiyon:</strong> <span style="color:var(--ok);font-weight:600;">' + textCont + '</span></div>';
              } else if (l.startsWith('- ')) {
                formatted += '<div style="margin-bottom:4px;padding-left:12px;border-left:2px solid rgba(255,255,255,0.1);">' + l.substring(2) + '</div>';
              } else if (l.startsWith('---')) {
                formatted += '<div style="height:1px;background:rgba(255,255,255,0.1);margin:20px 0;"></div>';
              } else {
                formatted += '<div style="margin-bottom:4px;color:#e2e8f0;">' + l + '</div>';
              }
            }
            return formatted;
          }

          function injectAIAdvice(cId, text) {
            var c = document.getElementById(cId);
            if (!c || !text) return;
            var txt = text.trim();
            if (!txt) {
              var idx = 0; while (document.getElementById(cId + '-ai-' + idx)) { document.getElementById(cId + '-ai-' + idx).innerHTML = '<span style="opacity:0.5">Ek görüş yok.</span>'; idx++; }
              return;
            }

            var lines = txt.split(/\r?\n/);
            var blocks = [];
            var currentBlock = '';
            for (var i = 0; i < lines.length; i++) {
              var l = lines[i].trim();
              if (/^(#{3,4}\s+|\s*#{0,4}\s*|\s*\s*)/.test(l)) {
                if (currentBlock !== '') blocks.push(currentBlock);
                currentBlock = l + '\n';
              } else if (l !== '') {
                currentBlock += l + '\n';
              }
            }
            if (currentBlock !== '') blocks.push(currentBlock);

            if (blocks.length === 1 && document.getElementById(cId + '-ai-1')) {
              var aiCol0 = document.getElementById(cId + '-ai-0');
              if (aiCol0) {
                aiCol0.innerHTML = '<div style="margin-bottom:10px;color:var(--blue);font-weight:bold;">Genel AI Yorumu:</div>' + formatMarkdownToHTML(blocks[0]);
              }
              var idx = 1;
              while (document.getElementById(cId + '-ai-' + idx)) {
                document.getElementById(cId + '-ai-' + idx).innerHTML = '<span style="opacity:0.5; font-style:italic;">Yapay zeka tüm dosyayı tek bir özette değerlendirdi (Yukarıya bakınız).</span>';
                idx++;
              }
              return;
            }

            for (var i = 0; i < blocks.length; i++) {
              var aiCol = document.getElementById(cId + '-ai-' + i);
              if (aiCol) {
                aiCol.innerHTML = formatMarkdownToHTML(blocks[i]);
              }
            }

            var j = blocks.length;
            while (document.getElementById(cId + '-ai-' + j)) {
              document.getElementById(cId + '-ai-' + j).innerHTML = '<span style="opacity:0.3">Özel görüş üretilmedi.</span>';
              j++;
            }
          }
          injectAIAdvice('auth-findings', authMatch ? authMatch[1] : '');
          injectAIAdvice('syslog-findings', sysMatch ? sysMatch[1] : '');
          injectAIAdvice('kern-findings', kernMatch ? kernMatch[1] : '');

          window._lastMarkdownReport = rpt;
          var fullReportFormatted = formatMarkdownToHTML(rpt);
          el.innerHTML = '<div style="font-size:0.68rem; font-weight:700; color:var(--t3); text-transform:uppercase; letter-spacing:0.7px; margin-bottom:12px; padding-bottom:10px; border-bottom:1px solid var(--border);">Analiz Raporu</div><div style="font-size:0.85rem; line-height:1.8; color:var(--t1);">' + fullReportFormatted + '</div>';
        } else {
          el.innerHTML = '<div style="text-align:center; padding: 40px; color: var(--t2);">Henüz üretilmiş bir rapor bulunmuyor.</div>';
        }
      }).catch(() => { });
    }

    function addLog(msg, color) {
      var box = document.getElementById('attackLog');
      var d = document.createElement('div');
      d.style.color = color || 'var(--text-muted)';
      d.style.padding = '2px 0';
      d.textContent = '> ' + msg;
      box.appendChild(d);
      box.scrollTop = box.scrollHeight;
    }

    function renderAlerts(arr) {
      var feed = document.getElementById('alertFeed');
      feed.innerHTML = '';
      arr.forEach(function (a, i) {
        setTimeout(function () {
          var isCrit = a.l >= 10;
          var isWarn = a.l >= 5 && a.l < 10;
          var cls = isCrit ? 'l10' : isWarn ? 'l5' : 'l3';
          var d = new Date();
          d.setSeconds(d.getSeconds() - (arr.length - i));
          var rawJson = { "timestamp": d.toISOString(), "rule": { "level": a.l, "description": a.d, "id": a.r }, "agent": { "id": "000", "name": "osmanubuntu" }, "manager": { "name": "osmanubuntu" }, "full_log": a.log, "decoder": { "name": "sshd" }, "location": "/var/log/auth.log" };
          var jsonStr = JSON.stringify(rawJson, null, 2);

          var div = document.createElement('div');
          div.className = 'alert-card ' + cls;

          var aiBtnHtml = '<div style="background:var(--bg-row); border:1px solid var(--border); padding:10px 14px; border-radius:4px; margin-bottom:10px; display:flex; gap:8px; align-items:center;">' +
            '<button onclick="analyzeSingleAlert(this, \'' + encodeURIComponent(jsonStr) + '\')" style="padding:6px 14px; background:var(--blue); border:none; border-radius:3px; color:#fff; font-family:var(--font-sans); font-size:0.72rem; font-weight:700; cursor:pointer; text-transform:uppercase; letter-spacing:0.4px;"> Manuel Yorumla</button>' +
            '<button onclick="toggleJsonPanel(this)" data-json=\'' + encodeURIComponent(jsonStr) + '\' style="padding:6px 14px; background:transparent; border:1px solid var(--border); border-radius:3px; color:var(--t2); font-family:var(--font-sans); font-size:0.72rem; font-weight:700; cursor:pointer; text-transform:uppercase; letter-spacing:0.4px; transition:all 0.15s;"> JSON</button>' +
            '</div>';
          var aiResHtml = '<div class="ai-single-res" style="display:none;margin-bottom:12px;padding:14px;background:var(--bg-card);border:1px solid var(--border);border-left:2px solid var(--blue);border-radius:4px;font-size:0.82rem;color:var(--t1);line-height:1.6;"></div>';

          div.innerHTML =
            '<div class="alert-header">' +
            '<span class="alert-title">Rule ' + a.r + ' &middot; Lvl ' + a.l + '</span>' +
            '<span style="font-size:0.7rem; color:var(--t2);">' + d.toLocaleTimeString() + '</span>' +
            '</div>' +
            '<div class="alert-desc">' + a.d + '</div>' +
            '<div class="alert-raw">' + a.log + '</div>' +
            '<div style="margin-top:12px;">' + aiBtnHtml + aiResHtml + '</div>';

          feed.prepend(div);


          if (isCrit) {
            var autoBox = document.createElement('div');
            autoBox.style.cssText = 'margin-top:10px;padding:12px;background:var(--bg-row);border:1px solid var(--border);border-left:2px solid var(--blue);border-radius:4px;font-size:0.8rem;color:var(--t1);';
            autoBox.innerHTML = '<div style="animation:pulse 1s infinite;color:var(--crit);font-weight:600;margin-bottom:6px;"> Kritik tehdit için Otonom AI devrede... Lütfen sıranızı bekleyin.</div>';
            div.appendChild(autoBox);
            enqueueAiAnalysis(autoBox, rawJson);
          }

        }, i * 500);
      });
    }

    function startAttack() {
      var btn = document.getElementById('btnBrute');
      var username = document.getElementById('usernameInput').value || 'hacker';
      var count = parseInt(document.getElementById('countSel').value) || 8;
      btn.disabled = true;
      btn.innerHTML = 'Saldırı devam ediyor...';
      document.getElementById('attackLog').innerHTML = '';
      document.getElementById('alertFeed').innerHTML = '<div style="height: 100%; display: flex; align-items: center; justify-content: center; color: var(--t2); font-size: 0.9rem; flex-direction: column; gap: 12px;"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity:0.3"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>Wazuh dinliyor, loglar bekleniyor...</div>';

      var xhr = new XMLHttpRequest();
      xhr.open('POST', API + '/api/attack', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.timeout = 3000;
      xhr.onload = function () {
        if (xhr.status === 200) {
          addLog('Bağlantı kuruldu. Gerçek SSH saldırıları başlatılıyor...', 'var(--accent)');
          var i = 0;
          var iv = setInterval(function () {
            i++;
            addLog('[' + new Date().toLocaleTimeString() + '] ssh ' + username + '@192.168.64.4: Permission denied (password).', 'var(--crit)');
            if (i >= count) {
              clearInterval(iv);
              addLog('Görev tamamlandı. AI Analizi tetikleniyor...', 'var(--ok)');
              renderAlerts(BRUTE);
              btn.disabled = false;
              btn.innerHTML = '<span></span> SSH BRUTE-FORCE BAŞLAT';
              setTimeout(runLiveAnalysis, 1500);
            }
          }, 500);
        } else { runDemo(username, count); }
      };
      xhr.onerror = xhr.ontimeout = function () { runDemo(username, count); };
      try { xhr.send(JSON.stringify({ username: username, attempts: count })); } catch (e) { runDemo(username, count); }

      function runDemo(user, cnt) {
        addLog('Demo modu aktif. Parametreler ile simüle ediliyor...', 'var(--accent)');
        var i = 0;
        var iv = setInterval(function () {
          i++;
          addLog('[' + new Date().toLocaleTimeString() + '] ssh ' + user + '@192.168.64.4: Permission denied (password).', 'var(--crit)');
          if (i >= cnt) {
            clearInterval(iv);
            addLog('Simülasyon tamamlandı.', 'var(--ok)');
            renderAlerts(BRUTE);
            btn.disabled = false;
            btn.innerHTML = '<span></span> SSH BRUTE-FORCE BAŞLAT';
            setTimeout(runLiveAnalysis, 1500);
          }
        }, 500);
      }
    }

    function showSudoAlert() {
      var feed = document.getElementById('alertFeed');
      feed.innerHTML = '';
      var box = document.getElementById('attackLog');
      box.innerHTML = '';
      addLog('Kullanıcı içi sudo yetkisi simüle ediliyor...', 'var(--accent)');

      fetch(API + '/api/sudo_attack', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }).then(r => r.json()).then(res => {
        setTimeout(function () { addLog('[' + new Date().toLocaleTimeString() + '] osman → root : COMMAND=/bin/bash', 'var(--crit)'); }, 600);
        setTimeout(function () {
          addLog('Rule 5402 tespit edildi (MITRE T1548.003). Wazuh logu yakaladı.', 'var(--ok)');
          fetch(API + '/api/sync').then(r => r.json()).then(syncRes => {
            loadAllLogs();

            var rawJson = { "timestamp": new Date().toISOString(), "rule": { "level": 10, "description": "Successful sudo to ROOT executed.", "id": "5402" }, "mitre": { "id": ["T1548.003"], "tactic": ["Privilege Escalation"], "technique": ["Sudo and Sudo Caching"] }, "agent": { "id": "000", "name": "osmanubuntu" }, "manager": { "name": "osmanubuntu" }, "full_log": "osman : USER=root ; COMMAND=/bin/bash", "decoder": { "name": "sudo" }, "location": "/var/log/auth.log" };
            var jsonStr = JSON.stringify(rawJson, null, 2);

            var div = document.createElement('div');
            div.className = 'alert-card l10';

            var aiBtnHtml = '<div style="background:var(--bg-row); border:1px solid var(--border); padding:10px 14px; border-radius:4px; margin-bottom:10px; display:flex; gap:8px; align-items:center;">' +
              '<button onclick="analyzeSingleAlert(this, \'' + encodeURIComponent(jsonStr) + '\')" style="padding:6px 14px; background:var(--blue); border:none; border-radius:3px; color:#fff; font-family:var(--font-sans); font-size:0.72rem; font-weight:700; cursor:pointer; text-transform:uppercase; letter-spacing:0.4px;"> Manuel Yorumla</button>' +
              '<button onclick="toggleJsonPanel(this)" data-json=\'' + encodeURIComponent(jsonStr) + '\' style="padding:6px 14px; background:transparent; border:1px solid var(--border); border-radius:3px; color:var(--t2); font-family:var(--font-sans); font-size:0.72rem; font-weight:700; cursor:pointer; text-transform:uppercase; letter-spacing:0.4px; transition:all 0.15s;"> JSON</button>' +
              '</div>';
            var aiResHtml = '<div class="ai-single-res" style="display:none;margin-bottom:12px;padding:14px;background:var(--bg-card);border:1px solid var(--border);border-left:2px solid var(--blue);border-radius:4px;font-size:0.82rem;color:var(--t1);line-height:1.6;"></div>';

            div.innerHTML =
              '<div class="alert-header">' +
              '<span class="alert-title" style="color:var(--crit)"> Rule 5402 &middot; KRİTİK</span>' +
              '<span style="font-size:0.7rem; color:var(--t2);">' + new Date().toLocaleTimeString() + '</span>' +
              '</div>' +
              '<div class="alert-desc">Successful sudo to ROOT executed.</div>' +
              '<div class="alert-raw">osman : USER=root ; COMMAND=/bin/bash</div>' +
              '<div style="font-size:0.75rem; color:var(--purple); margin-top:8px;">MITRE: T1548.003 — Sudo and Sudo Caching</div>' +
              '<div style="margin-top:12px;">' + aiBtnHtml + aiResHtml + '</div>';

            feed.appendChild(div);

            var autoBox = document.createElement('div');
            autoBox.style.cssText = 'margin-top:10px;padding:12px;background:var(--bg-row);border:1px solid var(--border);border-left:2px solid var(--blue);border-radius:4px;font-size:0.8rem;color:var(--t1);';
            autoBox.innerHTML = '<div style="animation:pulse 1s infinite;color:var(--crit);font-weight:600;margin-bottom:6px;"> Yetki Yükseltme tespit edildi. Otonom AI devrede... Lütfen sıranızı bekleyin.</div>';
            div.appendChild(autoBox);
            enqueueAiAnalysis(autoBox, rawJson);

          });
        }, 1200);
      });
    }

    function toggleJsonPanel(btn) {
      var container = btn.closest('.alert-card') || btn.parentElement.parentElement;
      var existing = container.querySelector('.json-raw-panel');
      if (existing) { existing.remove(); btn.style.color = 'var(--t2)'; btn.style.borderColor = 'var(--border)'; return; }
      var json = decodeURIComponent(btn.getAttribute('data-json') || '{}');
      var panel = document.createElement('pre');
      panel.className = 'json-raw-panel';
      panel.style.cssText = 'background:#04080f; border:1px solid var(--border); border-radius:4px; padding:12px; font-family:var(--font-mono); font-size:0.68rem; color:#7fb3d3; white-space:pre-wrap; word-wrap:break-word; margin:6px 0; max-height:220px; overflow-y:auto;';
      try { panel.textContent = JSON.stringify(JSON.parse(json), null, 2); } catch (e) { panel.textContent = json; }
      btn.parentElement.insertAdjacentElement('afterend', panel);
      btn.style.color = 'var(--blue)';
      btn.style.borderColor = 'var(--blue)';
    }

    var isSingleAnalysisRunning = false;
    function analyzeSingleAlert(btn, encodedJson) {
      if (isSingleAnalysisRunning) {
        alert("Şu anda devam eden bir yapay zeka analizi var. Lütfen tamamlanmasını bekleyin.");
        return;
      }

      var resDiv = btn.parentElement.nextElementSibling;
      if (resDiv && resDiv.classList.contains('json-raw-panel')) resDiv = resDiv.nextElementSibling;
      btn.textContent = 'Bekleyin...';
      btn.disabled = true;
      isSingleAnalysisRunning = true;
      if (resDiv) { resDiv.style.display = 'block'; resDiv.innerHTML = '<span style="color:var(--blue);font-size:0.72rem;font-family:var(--font-mono);">LLM analiz ediyor...</span>'; }

      var jsonStr = decodeURIComponent(encodedJson);
      var jsonData;
      try { jsonData = JSON.parse(jsonStr); } catch (e) { jsonData = { "raw": jsonStr }; }

      var providerEl = btn.parentElement.querySelector('.singleLLMSelector') || document.getElementById('liveLLMSelector');
      if (providerEl) { jsonData.llm_provider = providerEl.value; }

      if (jsonData.llm_provider === 'gemini') jsonData.api_key = '';
      else jsonData.api_key = '';

      fetch(API + '/api/analyze_single_alert', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(jsonData)
      }).then(r => r.json()).then(res => {
        btn.textContent = 'Tekrar Yorumla';
        btn.disabled = false;
        isSingleAnalysisRunning = false;
        if (res.ok && res.explanation) {
          var txt = res.explanation.trim()
            .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#fff">$1</strong>')
            .replace(/```[a-zA-Z]*[ \r\n]*([\s\S]*?)```/g, '<pre style="background:var(--bg);border:1px solid var(--border);border-radius:3px;padding:8px;font-size:0.7rem;margin:6px 0;overflow-x:auto;color:#7fb3d3;">$1</pre>')
            .replace(/`([^`]+)`/g, '<code style="background:rgba(0,0,0,0.5);color:var(--ok);padding:2px 6px;border-radius:4px;">$1</code>')
            .replace(/\n/g, '<br>');
          resDiv.innerHTML = '<div style="font-size:0.65rem;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:0.7px;margin-bottom:8px;">LLM ANALIZI</div><div style="line-height:1.6">' + txt + '</div>';
        } else {
          resDiv.innerHTML = '<span style="color:var(--crit)"> Hata: ' + (res.error || 'Bilinmeyen hata') + '</span>';
        }
      }).catch(() => {
        btn.textContent = 'Tekrar Yorumla';
        btn.disabled = false;
        isSingleAnalysisRunning = false;
        resDiv.innerHTML = '<span style="color:var(--crit)"> Sunucuya ulaşılamadı.</span>';
      });
    }

    window._aiQueue = [];
    window._isAiQueueRunning = false;

    function enqueueAiAnalysis(autoBox, jsonData) {
      window._aiQueue.push({ box: autoBox, data: jsonData });
      if (!window._isAiQueueRunning) {
        processAiQueue();
      }
    }

    function processAiQueue() {
      if (window._aiQueue.length === 0) {
        window._isAiQueueRunning = false;
        return;
      }
      window._isAiQueueRunning = true;
      var task = window._aiQueue.shift();

      var provider = document.getElementById('liveLLMSelector') ? document.getElementById('liveLLMSelector').value : 'gemini';
      task.data.llm_provider = provider;
      if (provider === 'gemini') task.data.api_key = ''; else task.data.api_key = '';

      fetch(API + '/api/analyze_single_alert', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task.data)
      }).then(r => r.json()).then(res => {
        if (res.ok) {
          task.box.style.background = 'var(--bg-card)'; task.box.style.border = '1px solid var(--border)'; task.box.style.borderLeft = '2px solid var(--blue)';
          var txt = res.explanation.trim()
            .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#fff">$1</strong>')
            .replace(/```[a-zA-Z]*[ \r\n]*([\s\S]*?)```/g, '<pre style="background:var(--bg);border:1px solid var(--border);border-radius:3px;padding:8px;font-size:0.7rem;margin:6px 0;overflow-x:auto;color:#7fb3d3;">$1</pre>')
            .replace(/`([^`]+)`/g, '<code style="background:rgba(0,0,0,0.5);color:var(--ok);padding:2px 6px;border-radius:4px;">$1</code>')
            .replace(/\n/g, '<br>');
          task.box.innerHTML = '<div style="font-size:0.65rem;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:0.7px;margin-bottom:8px;">LLM ANALIZI</div><div style="line-height:1.6;color:#e2e8f0">' + txt + '</div>';
        } else {
          task.box.innerHTML = '<span style="color:var(--warn)"> AI Analizi yapılamadı.</span>';
        }
      }).catch(() => { task.box.innerHTML = '<span style="color:var(--warn)"> AI bağlantı hatası.</span>'; })
        .finally(() => {
          processAiQueue();
        });
    }

    function triggerCardAnalysis(btn, encodedJson) {
      if (isSingleAnalysisRunning) {
        alert("Şu anda devam eden bir yapay zeka analizi var. Lütfen tamamlanmasını bekleyin.");
        return;
      }

      var triggerBox = btn.parentElement;
      var card = btn.closest('.ai-threat-card');
      var resContent = card ? card.querySelector('.ai-res-content') : triggerBox.parentElement.parentElement.querySelector('.ai-res-content');
      var providerEl = triggerBox.querySelector('.localSelector');
      var globalProv = document.getElementById('llmProviderSel');
      var provider = providerEl ? providerEl.value : (globalProv ? globalProv.value : 'gemini');

      btn.textContent = 'Analiz Ediliyor...';
      btn.disabled = true;
      isSingleAnalysisRunning = true;

      resContent.style.display = 'block';
      resContent.innerHTML = '<div style="display:flex; align-items:center; gap:8px; color:var(--blue); font-size:0.75rem;"><div style="width:14px;height:14px;border:2px solid var(--border);border-top-color:var(--blue);border-radius:50%;animation:spin 0.8s linear infinite;"></div>LLM çalışıyor, lütfen bekleyin...</div>';

      var jsonStr = decodeURIComponent(encodedJson);
      var jsonData;
      try { jsonData = JSON.parse(jsonStr); } catch (e) { jsonData = { "raw": jsonStr }; }
      jsonData.llm_provider = provider;
      jsonData.api_key = '';

      fetch(API + '/api/analyze_single_alert', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(jsonData)
      }).then(r => r.json()).then(res => {
        isSingleAnalysisRunning = false;
        triggerBox.style.display = 'none'; // hide the trigger box on success
        if (res.ok && res.explanation) {
          var txt = res.explanation.trim()
            .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--t1)">$1</strong>')
            .replace(/```[a-zA-Z]*[ \r\n]*([\s\S]*?)```/g, '<pre style="background:var(--bg);border:1px solid var(--border);border-radius:3px;padding:8px;font-size:0.7rem;margin:6px 0;overflow-x:auto;color:#7fb3d3;">$1</pre>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
          resContent.innerHTML = txt;
        } else {
          triggerBox.style.display = 'block';
          btn.textContent = 'Yeniden Dene';
          btn.disabled = false;
          resContent.innerHTML = '<span style="color:var(--crit)"> Hata: ' + (res.error || 'Bilinmeyen hata') + '</span>';
        }
      }).catch(() => {
        isSingleAnalysisRunning = false;
        triggerBox.style.display = 'block';
        btn.textContent = 'Yeniden Dene';
        btn.disabled = false;
        resContent.innerHTML = '<span style="color:var(--crit)"> Sunucuya ulaşılamadı.</span>';
      });
    }

    function checkStatus() {
      var dot = document.getElementById('statusDot');
      var txt = document.getElementById('statusText');
      dot.className = 'dot pulse';
      txt.textContent = 'Sorgulanıyor...';
      var xhr = new XMLHttpRequest();
      xhr.open('GET', API + '/api/status', true);
      xhr.timeout = 15000;
      xhr.onload = function () {
        try {
          var d = JSON.parse(xhr.responseText);
          if (d.ok) {
            dot.className = 'dot';
            txt.innerHTML = 'Manager: <strong style="color:var(--ok)">' + d.version + '</strong><br>Olay Sayısı: <strong>' + d.count + '</strong>';
            var dTotal = document.getElementById('dash-total'); if (dTotal) dTotal.textContent = d.count;
            if (window.updateReactDashboard) {
              window.updateReactDashboard({ total: d.count });
            }
          } else {
            dot.className = 'dot off';
            txt.textContent = 'Bağlantı sorunu';
          }
        } catch (e) { dot.className = 'dot off'; txt.textContent = 'Demo Modu'; }
      };
      xhr.onerror = xhr.ontimeout = function () {
        dot.className = 'dot off';
        txt.innerHTML = 'Backend Çevrimdışı<br><span style="font-size:0.7rem">Demo Modu Aktif</span>';
      };
      xhr.send();
    }

    function loadAllLogs() {
      var tbody = document.querySelector('#logsTable tbody');
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--t2);padding:40px;">Sunucudan veriler çekiliyor...</td></tr>';
      var syncXhr = new XMLHttpRequest();
      syncXhr.open('GET', API + '/api/sync', true);
      syncXhr.onload = function () {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', API + '/api/alerts', true);
        xhr.onload = function () {
          if (xhr.status === 200) {
            try {
              var data = JSON.parse(xhr.responseText);
              document.getElementById('totalLogsCount').textContent = data.total;
              var crit = 0, warn = 0, sudo = 0;
              var topThreats = [];
              
              window._allArchiveLogs = data.alerts.reverse().map(function(a) {
                var rule = a.rule || {};
                if (rule.id === "5402") rule.level = 10;
                var l = rule.level || 0;
                if (l >= 10) crit++;
                if (l >= 5 && l < 10) warn++;
                if (rule.id === "5402") sudo++;
                
                if (l >= 7 && topThreats.length < 10) {
                    var sevStr = l >= 10 ? 'KRİTİK' : 'YÜKSEK';
                    var dt2 = a.data || {};
                    var userip2 = (dt2.srcuser || dt2.dstuser || dt2.username || '') + (dt2.srcip ? '@'+dt2.srcip : '');
                    if (!userip2 || userip2 === '@') userip2 = 'Bilinmeyen';
                    topThreats.push({
                        id: topThreats.length + 1,
                        time: a.timestamp ? new Date(a.timestamp).toLocaleTimeString('tr-TR') : '-',
                        level: sevStr,
                        rule: rule.id,
                        desc: rule.description,
                        src: userip2,
                        raw: JSON.stringify(a)
                    });
                }
                return a;
              });

              applyArchiveFilters();

              // Live update stats with anim
              updateDashValue('dash-crit', crit);
              updateDashValue('dash-warn', warn);
              updateDashValue('dash-sudo', sudo);
              if (data.total !== undefined) {
                updateDashValue('dash-total', data.total);
              }
              
              if(window.updateReactDashboard) {
                window.updateReactDashboard({
                  total: data.total || 0,
                  bruteForce: crit,
                  sshFail: warn,
                  sudo: sudo,
                  recentThreats: topThreats.slice(0, 5)
                });
              }
            } catch (e) { tbody.innerHTML = '<tr><td colspan="5" style="color:var(--crit)">Veri hatası</td></tr>'; }
          }
        };
        xhr.send();
      };
      syncXhr.onerror = function () { tbody.innerHTML = '<tr><td colspan="5" style="color:var(--crit)">Eşitleme hatası</td></tr>'; };
      syncXhr.send();
    }

    function updateDashValue(id, val) {
      var el = document.getElementById(id);
      if (!el) return;
      var oldVal = el.textContent.trim();
      if (oldVal !== String(val)) {
        el.textContent = val;
        if (oldVal !== "..." && oldVal !== "") {
          el.classList.remove('updated');
          void el.offsetWidth; // Trigger reflow to restart animation
          el.classList.add('updated');
          setTimeout(function () { el.classList.remove('updated'); }, 800);
        }
      }
    }

    window.onload = function () {
      setTimeout(checkStatus, 500);
      setTimeout(loadAllLogs, 1000);

      setInterval(function () {
        var overviewPage = document.getElementById('overview');
        var archivePage = document.getElementById('all-logs');
        var aiPage = document.getElementById('ai');
        if ((overviewPage && overviewPage.classList.contains('active')) ||
          (archivePage && archivePage.classList.contains('active')) ||
          (aiPage && aiPage.classList.contains('active'))) {
          // Ssshh, loadAllLogs is silent and updates everything
          var syncXhr = new XMLHttpRequest();
          syncXhr.open('GET', API + '/api/sync', true);
          syncXhr.onload = function () {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', API + '/api/alerts', true);
            xhr.onload = function () {
              if (xhr.status === 200) {
                try {
                  var data = JSON.parse(xhr.responseText);
                  var totalEl = document.getElementById('totalLogsCount');
                  if (totalEl) totalEl.textContent = data.total;

                  var crit = 0, warn = 0, sudo = 0;
                  var topThreats = [];

                  window._allArchiveLogs = data.alerts.reverse().map(function (a) {
                    var rule = a.rule || {};
                    if (rule.id === "5402") rule.level = 10;
                    var l = rule.level || 0;
                    if (l >= 10) crit++;
                    if (l >= 5 && l < 10) warn++;
                    if (rule.id === "5402") sudo++;

                    if (l >= 7 && topThreats.length < 10) {
                      var sevStr = l >= 10 ? 'KRİTİK' : 'YÜKSEK';
                      var dt2 = a.data || {};
                      var userip2 = (dt2.srcuser || dt2.dstuser || dt2.username || '') + (dt2.srcip ? '@' + dt2.srcip : '');
                      if (!userip2 || userip2 === '@') userip2 = 'Bilinmeyen';
                      topThreats.push({
                        id: topThreats.length + 1,
                        time: a.timestamp ? new Date(a.timestamp).toLocaleTimeString('tr-TR') : '-',
                        level: sevStr,
                        rule: rule.id,
                        desc: rule.description,
                        src: userip2,
                        raw: JSON.stringify(a)
                      });
                    }
                    return a;
                  });

                  if (archivePage && archivePage.classList.contains('active')) {
                    var drawer = document.getElementById('logDetailDrawer');
                    var isDrawerOpen = drawer && drawer.style.right === '0px';
                    if (!isDrawerOpen) {
                       applyArchiveFilters();
                    }
                  }

                  if (aiPage && aiPage.classList.contains('active')) {
                    var isAiDetailOpen = false;
                    document.querySelectorAll('.ai-res-content').forEach(function(r) {
                      if(r.style.display !== 'none' && r.innerHTML.trim() !== '') isAiDetailOpen = true;
                    });
                    if(!isAiDetailOpen) {
                      fetch(API + '/api/per_source').then(function(r) { return r.json(); }).then(function(res) {
                        if (res.ok && res.data) {
                          var d = res.data;
                          renderLogFindings('auth-findings', 'auth-badge', d['auth.log'] || [], 'auth.log');
                          renderLogFindings('syslog-findings', 'syslog-badge', d['syslog'] || [], 'syslog');
                          renderLogFindings('kern-findings', 'kern-badge', d['kern.log'] || [], 'kern.log');
                          renderMitreMap(d);
                          
                          var crit2 = 0, high2 = 0, med2 = 0, event_sum2 = 0;
                          ['auth.log', 'syslog', 'kern.log'].forEach(function(k) {
                            (d[k] || []).forEach(function(f) {
                              var c = f.event_count || 1;
                              event_sum2 += c;
                              var sev = (f.severity || '').toUpperCase();
                              if (sev.includes('CRIT') || sev.includes('KRİT') || sev.includes('KRIT')) crit2 += c;
                              else if (sev.includes('HIGH') || sev.includes('YÜK') || sev.includes('YUK')) high2 += c;
                              else med2 += c;
                            });
                          });
                          var set2 = function (id, v) { var e = document.getElementById(id); if (e) e.textContent = v || '0'; };
                          set2('cnt-critical', crit2); set2('cnt-high', high2); set2('cnt-medium', med2); set2('cnt-total', event_sum2);
                        }
                      }).catch(function() {});
                      
                      fetch(API + '/api/raw_logs').then(function(r) { return r.json(); }).then(function(rawRes) {
                        if (rawRes.ok) {
                          var authEl = document.getElementById('raw-auth-log');
                          if (authEl && rawRes['auth.log']) authEl.textContent = rawRes['auth.log'].join('\n');
                          var sysEl = document.getElementById('raw-syslog-log');
                          if (sysEl && rawRes['syslog']) sysEl.textContent = rawRes['syslog'].join('\n');
                          var kernEl = document.getElementById('raw-kern-log');
                          if (kernEl && rawRes['kern.log']) kernEl.textContent = rawRes['kern.log'].join('\n');
                        }
                      }).catch(function() {});
                    }
                  }

                  updateDashValue('dash-crit', crit);
                  updateDashValue('dash-warn', warn);
                  updateDashValue('dash-sudo', sudo);
                  if (data.total !== undefined) {
                    updateDashValue('dash-total', data.total);
                  }
                  
                  if(window.updateReactDashboard) {
                    window.updateReactDashboard({
                      total: data.total || 0,
                      bruteForce: crit,
                      sshFail: warn,
                      sudo: sudo,
                      recentThreats: topThreats.slice(0, 5)
                    });
                  }
                } catch (e) { }
              }
            };
            xhr.send();
          };
          syncXhr.send();
        }
      }, 5000);
    };

    function filterFindings(logType, level, btn) {
      var container = btn.parentElement;
      container.querySelectorAll('.ai-filter-btn').forEach(function(b) {
        b.classList.remove('active');
        b.style.background = 'transparent';
      });
      btn.classList.add('active');
      btn.style.background = 'rgba(255,255,255,0.1)';

      var cards = document.querySelectorAll('#' + logType + '-findings .ai-threat-card');
      cards.forEach(function(card) {
        if (level === 'ALL' || card.getAttribute('data-severity') === level) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }

    function renderMitreMap(data) {
      var mapEl = document.getElementById('mitre-map');
      if (!mapEl) return;
      var tactics = [
        { id: "TA0001", name: "Initial Access" },
        { id: "TA0002", name: "Execution" },
        { id: "TA0003", name: "Persistence" },
        { id: "TA0004", name: "Privilege Escalation" },
        { id: "TA0005", name: "Defense Evasion" },
        { id: "TA0006", name: "Credential Access" },
        { id: "TA0007", name: "Discovery" },
        { id: "TA0008", name: "Lateral Movement" },
        { id: "TA0009", name: "Collection" },
        { id: "TA0011", name: "Command and Control" }
      ];

      var detected = {};
      ['auth.log', 'syslog', 'kern.log'].forEach(function(k) {
        (data[k] || []).forEach(function(f) {
          if (f.mitre) {
            var tName = f.tactic || 'Credential Access'; 
            var tMatch = tactics.find(t => t.name.toLowerCase() === tName.toLowerCase()) || tactics[5];
            var severityWeight = f.severity === 'CRITICAL' ? 10 : (f.severity === 'HIGH' ? 7 : 3);
            if (!detected[tMatch.id] || detected[tMatch.id].weight < severityWeight) {
              detected[tMatch.id] = { weight: severityWeight, name: f.mitre + ' ' + (f.technique || '') };
            }
          }
        });
      });

      // Special fallback check
      if (document.getElementById('cnt-critical') && document.getElementById('cnt-critical').textContent !== '—' && parseInt(document.getElementById('cnt-critical').textContent) > 0) {
        if (!detected["TA0004"]) detected["TA0004"] = { weight: 10, name: "T1548.003 Sudo" };
      }

      var html = '';
      tactics.forEach(function(t) {
        var det = detected[t.id];
        var cls = '';
        var tooltip = 'Tespit Yok';
        if (det) {
          if (det.weight >= 10) { cls = 'detected-crit'; tooltip = det.name; }
          else if (det.weight >= 5) { cls = 'detected-warn'; tooltip = det.name; }
          else { cls = 'detected-warn'; tooltip = det.name; }
        }
        html += '<div class="mitre-cell ' + cls + '" title="' + tooltip + '">' +
                  '<div class="m-id">' + t.id + '</div>' +
                  '<div class="m-name">' + t.name + '</div>' +
                '</div>';
      });
      mapEl.innerHTML = html;
    }

    window._filteredArchiveLogs = [];
    window._archiveCurrentPage = 1;
    window._archivePerPage = 25;

    function applyArchiveFilters() {
      if (!window._allArchiveLogs) return;
      var searchEl = document.getElementById('archiveSearch');
      var levelEl = document.getElementById('archiveLevelFilter');
      var ruleEl = document.getElementById('archiveRuleFilter');
      var timeEl = document.getElementById('archiveTimeFilter');
      
      if(!searchEl) return; // Prevent errors if DOM isn't ready
      
      var text = (searchEl.value || '').toLowerCase();
      var level = levelEl.value || 'ALL';
      var ruleId = (ruleEl.value || '').toLowerCase();
      var timeLimit = timeEl.value || 'ALL';
      
      var now = new Date();

      window._filteredArchiveLogs = window._allArchiveLogs.filter(function(log) {
         var r = log.rule || {};
         var dt = log.data || {};
         var l = r.level || 0;
         if (r.id === "5402") l = 10;
         
         // 1. Text Filter
         var desc = (r.description || '').toLowerCase();
         var userip = ((dt.srcuser || dt.dstuser || dt.username || '') + ' ' + (dt.srcip || '')).toLowerCase();
         if (text && !desc.includes(text) && !userip.includes(text) && !(log.full_log || '').toLowerCase().includes(text)) {
           return false;
         }
         
         // 2. Level Filter
         if (level === 'CRITICAL' && l < 10) return false;
         if (level === 'HIGH' && (l < 7 || l >= 10)) return false;
         if (level === 'MEDIUM' && l > 6) return false;
         
         // 3. Rule Filter
         if (ruleId && r.id && !r.id.toString().includes(ruleId)) return false;
         
         // 4. Time Filter
         if (timeLimit !== 'ALL' && log.timestamp) {
            var logTime = new Date(log.timestamp);
            var diffHours = (now - logTime) / (1000 * 60 * 60);
            if (timeLimit === '1H' && diffHours > 1) return false;
            if (timeLimit === '6H' && diffHours > 6) return false;
            if (timeLimit === '24H' && diffHours > 24) return false;
         }
         
         return true;
      });

      window._archiveCurrentPage = 1;
      var statusEl = document.getElementById('archiveFilterStatus');
      if(statusEl) statusEl.textContent = window._filteredArchiveLogs.length + ' kayıt listeleniyor...';
      renderArchiveTable();
    }

    function renderArchiveTable() {
      var tbody = document.getElementById('logsTableBody');
      if(!tbody) return;
      
      var start = (window._archiveCurrentPage - 1) * window._archivePerPage;
      var end = start + window._archivePerPage;
      var pageLogs = window._filteredArchiveLogs.slice(start, end);
      
      var totalPages = Math.ceil(window._filteredArchiveLogs.length / window._archivePerPage) || 1;
      var pageInfo = document.getElementById('archivePageInfo');
      if(pageInfo) pageInfo.textContent = window._archiveCurrentPage + ' / ' + totalPages;
      
      var btnPrev = document.getElementById('btnPrevPage');
      var btnNext = document.getElementById('btnNextPage');
      if(btnPrev) btnPrev.disabled = window._archiveCurrentPage <= 1;
      if(btnNext) btnNext.disabled = window._archiveCurrentPage >= totalPages;

      if (pageLogs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--t2);padding:40px;">Aranan kriterlere uygun log bulunamadı.</td></tr>';
        return;
      }
      
      var html = '';
      pageLogs.forEach(function(a) {
        var rule = a.rule || {};
        var l = rule.level || 0;
        if (rule.id === "5402") l = 10;
        var d = rule.description || '-';
        var r = rule.id || '-';
        var t = a.timestamp ? new Date(a.timestamp).toLocaleString('tr-TR') : '-';
        
        var dt = a.data || {};
        var userip = (dt.srcuser || dt.dstuser || dt.username || '') + (dt.srcip ? '@'+dt.srcip : '');
        if (!userip || userip === '@') userip = 'Bilinmeyen';

        var bg = l >= 10 ? 'var(--crit)' : l >= 7 ? 'var(--warn)' : 'var(--ok)';
        var badgeHtml = '<span style="background:' + bg + '22; color:' + bg + '; border:1px solid ' + bg + '44; padding:3px 8px; border-radius:12px; font-size:0.65rem; font-weight:bold;">' + l + '</span>';

        var icon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity:0.6;margin-right:6px;vertical-align:middle"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
        if (d.toLowerCase().includes('sudo') || r === '5402') {
           icon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" stroke-width="2" style="margin-right:6px;vertical-align:middle"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>';
        } else if (d.toLowerCase().includes('brute') || l >= 10) {
           icon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--crit)" stroke-width="2" style="margin-right:6px;vertical-align:middle"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
        } else if (d.toLowerCase().includes('auth') || d.toLowerCase().includes('login') || d.toLowerCase().includes('session')) {
           icon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--warn)" stroke-width="2" style="margin-right:6px;vertical-align:middle"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
        }

        var jsonStr = encodeURIComponent(JSON.stringify(a)).replace(/'/g, "%27");

        html += '<tr style="cursor:pointer; transition:background 0.2s;" onmouseover="this.style.background=\'rgba(255,255,255,0.03)\'" onmouseout="this.style.background=\'transparent\'" onclick="openLogDrawer(\'' + jsonStr + '\')">'
          + '<td style="color:var(--t2)">' + t + '</td>'
          + '<td style="font-family:var(--font-mono)">' + badgeHtml + '</td>'
          + '<td style="font-family:var(--font-mono); color:var(--cyan)">' + r + '</td>'
          + '<td style="color:#e2e8f0">' + icon + d + '</td>'
          + '<td style="font-family:var(--font-mono); color:var(--t2)">' + userip + '</td>'
          + '<td style="text-align:right;">'
          + '<span style="display:flex;gap:6px;justify-content:flex-end;">'
          + '<span onclick="event.stopPropagation(); openLogDrawer(\'' + jsonStr + '\')" style="font-size:0.7rem;color:var(--t2);cursor:pointer;background:rgba(255,255,255,0.1);padding:4px 8px;border-radius:4px;transition:0.2s;">JSON </span>'
          + '<span onclick="event.stopPropagation(); openLogDrawer(\'' + jsonStr + '\')" style="font-size:0.7rem;color:#fff;cursor:pointer;background:linear-gradient(135deg,var(--accent),var(--purple));padding:4px 8px;border-radius:4px;transition:0.2s;">AI </span>'
          + '</span>'
          + '</td>'
          + '</tr>';
      });
      tbody.innerHTML = html;
    }

    function prevArchivePage() {
      if (window._archiveCurrentPage > 1) {
        window._archiveCurrentPage--;
        renderArchiveTable();
      }
    }

    function nextArchivePage() {
      var totalPages = Math.ceil(window._filteredArchiveLogs.length / window._archivePerPage) || 1;
      if (window._archiveCurrentPage < totalPages) {
        window._archiveCurrentPage++;
        renderArchiveTable();
      }
    }

    function changeArchivePerPage() {
      window._archivePerPage = parseInt(document.getElementById('archivePerPage').value) || 25;
      window._archiveCurrentPage = 1;
      renderArchiveTable();
    }

    function openLogDrawer(encodedJson) {
      var data = JSON.parse(decodeURIComponent(encodedJson));
      var drawer = document.getElementById('logDetailDrawer');
      var content = document.getElementById('drawerContent');
      if(!drawer || !content) return;
      
      var rule = data.rule || {};
      var l = rule.level || 0;
      if (rule.id === "5402") l = 10;
      var bg = l >= 10 ? 'var(--crit)' : l >= 7 ? 'var(--warn)' : 'var(--ok)';
      var badgeHtml = '<span style="background:' + bg + '22; color:' + bg + '; border:1px solid ' + bg + '44; padding:4px 10px; border-radius:12px; font-size:0.7rem; font-weight:bold;">Seviye ' + l + '</span>';

      var t = data.timestamp ? new Date(data.timestamp).toLocaleString('tr-TR') : '-';

      content.innerHTML = 
        '<div style="margin-bottom:20px;">' +
          '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">' +
            '<div style="font-family:var(--font-mono); color:var(--cyan); font-size:1.2rem; font-weight:bold;">Rule ID: ' + (rule.id || '-') + '</div>' +
            badgeHtml +
          '</div>' +
          '<div style="font-size:0.9rem; color:#e2e8f0; margin-bottom:16px; line-height:1.5;">' + (rule.description || '-') + '</div>' +
          '<div style="color:var(--t2); font-size:0.8rem; display:flex; flex-direction:column; gap:8px; margin-bottom:20px; font-family:var(--font-mono);">' +
            '<div><strong style="color:var(--t1)">Zaman:</strong> ' + t + '</div>' +
            '<div><strong style="color:var(--t1)">Ajan:</strong> ' + (data.agent ? data.agent.name : '-') + '</div>' +
          '</div>' +
        '</div>' +
        '<div style="margin-bottom:20px;">' +
          '<h4 style="color:var(--purple); margin-bottom:10px; font-size:0.85rem; text-transform:uppercase; border-bottom:1px solid var(--border); padding-bottom:6px; display:flex; align-items:center; gap:6px;">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg> AI İle Yorumla</h4>' +
          '<div class="ai-interp-panel" style="background:rgba(0,0,0,0.2); padding:12px; border-radius:8px; border:1px solid var(--border);">' +
            '<div style="display:flex; gap:10px; align-items:center; margin-bottom:10px;">' +
              '<select class="modern-select singleLLMSelector" style="padding:6px 12px;font-size:0.75rem; background:rgba(0,0,0,0.5); border:1px solid var(--border);">' +
                '<option value="gemini">Gemini 2.5 Flash</option>' +
                '<option value="ollama">Ollama</option>' +
              '</select>' +
              '<button class="btn-primary" onclick="analyzeSingleAlert(this, \'' + encodedJson + '\')" style="padding:8px 16px;font-size:0.75rem; background:linear-gradient(135deg,var(--accent),var(--purple)); border:none; border-radius:4px; color:#fff; cursor:pointer;">Model ile Analiz Et</button>' +
            '</div>' +
            '<div class="ai-single-res" style="display:none; padding:12px; background:var(--bg-card); border:1px solid var(--border); border-left:2px solid var(--purple); border-radius:4px; font-size:0.8rem; color:var(--t1); line-height:1.6; max-height:200px; overflow-y:auto;"></div>' +
          '</div>' +
        '</div>' +
        '<div style="margin-bottom:20px;">' +
          '<h4 style="color:var(--t1); margin-bottom:10px; font-size:0.85rem; text-transform:uppercase; border-bottom:1px solid var(--border); padding-bottom:6px;">Detaylı Olay Logu</h4>' +
          '<div style="background:var(--bg); border:1px solid var(--border); padding:12px; border-radius:6px; font-family:var(--font-mono); font-size:0.75rem; color:var(--t2); word-break:break-all; max-height:150px; overflow-y:auto;">' + (data.full_log || '-') + '</div>' +
        '</div>' +
        '<div style="margin-bottom:20px;">' +
          '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid var(--border); padding-bottom:6px;">' +
             '<h4 style="color:var(--t1); margin:0; font-size:0.85rem; text-transform:uppercase;">Ham JSON Verisi</h4>' +
             '<button onclick="copyToClipboard(decodeURIComponent(\'' + encodedJson + '\'))" style="background:transparent;border:none;color:var(--blue);cursor:pointer;font-size:0.7rem;padding:4px;">Kopyala</button>' +
          '</div>' +
          '<pre style="background:#04080f; border:1px solid var(--border); padding:12px; border-radius:6px; font-family:var(--font-mono); font-size:0.75rem; color:#7fb3d3; overflow-x:auto;">' + JSON.stringify(data, null, 2) + '</pre>' +
        '</div>';

      drawer.style.right = '0';
    }

    function copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(function() {
        // success
      }).catch(function(err) {
        console.error('Kopyalama hatası:', err);
      });
    }

    function downloadLogsCSV() {
      if(!window._filteredArchiveLogs || window._filteredArchiveLogs.length === 0) return alert('İndirilecek veri yok.');
      var header = ['Zaman', 'Seviye', 'Kural ID', 'Açıklama', 'Tam Log'].join(',') + '\n';
      var csv = header + window._filteredArchiveLogs.map(function(a) {
        var r = a.rule || {};
        var l = r.level || 0;
        if (r.id === "5402") l = 10;
        var desc = (r.description || '').replace(/"/g, '""');
        var full = (a.full_log || '').replace(/"/g, '""');
        var t = a.timestamp || '';
        return [t, l, r.id || '', '"' + desc + '"', '"' + full + '"'].join(',');
      }).join('\n');

      var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "wazuh_arsiv_export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    function downloadLogsJSON() {
      if(!window._filteredArchiveLogs || window._filteredArchiveLogs.length === 0) return alert('İndirilecek veri yok.');
      var jsonStr = JSON.stringify(window._filteredArchiveLogs, null, 2);
      var blob = new Blob([jsonStr], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "wazuh_arsiv_export.json");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
