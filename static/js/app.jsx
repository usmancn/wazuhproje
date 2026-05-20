    const { useState, useEffect } = React;
    const { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } = Recharts;

    const mockTrendData = Array.from({length: 24}).map((_, i) => ({
      name: `${i.toString().padStart(2, '0')}:00`,
      bruteForce: Math.floor(Math.random() * 50) + 10,
      sshFail: Math.floor(Math.random() * 20) + 5,
      sudo: Math.floor(Math.random() * 15)
    }));

    const mockPieData = [
      { name: 'Brute Force', value: 58, color: '#ff2d55' },
      { name: 'Başarısız SSH', value: 22, color: '#ffbe0b' },
      { name: 'Sudo Yükseltme', value: 14, color: '#bf5fff' },
      { name: 'Diğer', value: 6, color: '#00aaff' }
    ];

    const mockBarData = [
      { ip: '192.168.1.105', count: 342 },
      { ip: '10.0.0.45', count: 215 },
      { ip: '172.16.0.8', count: 180 },
      { ip: '8.8.8.8', count: 95 },
      { ip: '45.33.12.9', count: 42 }
    ];

    const mockThreats = [
      { id: 1, time: '14:05:22', level: 'KRİTİK', rule: '5402', desc: 'Successful sudo to ROOT executed', src: 'osman@192.168.64.4' },
      { id: 2, time: '14:03:10', level: 'KRİTİK', rule: '5712', desc: 'SSHD brute force trying to get access', src: 'hacker@10.0.0.45' },
      { id: 3, time: '13:59:45', level: 'ORTA', rule: '5716', desc: 'Invalid SSH connection attempt', src: 'unknown@45.33.12.9' },
      { id: 4, time: '13:50:12', level: 'DÜŞÜK', rule: '5501', desc: 'Pam session opened for user root', src: 'root@localhost' },
      { id: 5, time: '13:45:00', level: 'KRİTİK', rule: '5402', desc: 'Successful sudo to ROOT executed', src: 'osman@192.168.64.4' }
    ];

    const MetricCard = ({ title, value, desc, color, trend }) => (
      <div className="ag-glass" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: `3px solid ${color}` }}>
        <div style={{ color: 'var(--t2)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</div>
        <div style={{ fontSize: '2rem', fontWeight: '700', color: color, textShadow: `0 0 15px ${color}80`, fontFamily: 'var(--font-mono)' }}>
          {value}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--t3)' }}>{desc}</span>
          <span style={{ fontSize: '0.75rem', color: trend > 0 ? 'var(--crit)' : 'var(--ok)', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
            {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%
          </span>
        </div>
      </div>
    );

    const SocDashboard = () => {
      const [autoRefresh, setAutoRefresh] = useState(true);
      
      // Dinamik veri köprüsü - mevcut sunum_app.js'den verileri almak için
      const [realData, setRealData] = useState(null);

      useEffect(() => {
        // Vanilla JS tarafından çağrılabilmesi için global bir fonksiyon ekliyoruz
        window.updateReactDashboard = (data) => {
          setRealData(data);
        };
      }, []);

      const getLvlColor = (lvl) => {
        if(lvl === 'KRİTİK') return { bg: '#ff3b3b', text: '#fff', shadow: '0 0 8px #ff3b3b80' };
        if(lvl === 'ORTA') return { bg: '#ff9500', text: '#111', shadow: '0 0 8px #ff950080' };
        return { bg: '#30d158', text: '#111', shadow: '0 0 8px #30d15880' };
      };

      return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '1.4rem', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '1px', textShadow: '0 0 10px rgba(0,212,255,0.5)', margin: 0, fontFamily: 'var(--font-display)' }}>SOC Dashboard</h1>
              <div style={{ fontSize: '0.8rem', color: 'var(--t2)', marginTop: '4px' }}>Wazuh SIEM AI Destekli Analiz Merkezi</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(57,255,20,0.1)', border: '1px solid rgba(57,255,20,0.2)', padding: '6px 12px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, color: 'var(--neon-green)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              <span style={{ width: '6px', height: '6px', background: 'var(--neon-green)', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.5s infinite' }}></span>
              Canlı Veri Akışı
            </div>
          </div>

          {/* Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            <MetricCard title="Toplam Olay (Alert)" value={realData?.total || "4470"} desc="Sistemdeki tüm loglar" color="var(--cyan)" trend={+5.2} />
            <MetricCard title="Brute-Force (Kritik)" value="1131" desc="Şifre kırma saldırıları" color="var(--danger)" trend={+12.4} />
            <MetricCard title="Başarısız SSH (Orta)" value="279" desc="Yanlış şifre denemeleri" color="var(--warn)" trend={-2.1} />
            <MetricCard title="Yetki Yükseltme (Sudo)" value="692" desc="Root eylemleri" color="var(--purple)" trend={+8.7} />
          </div>

          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px' }}>
            
            {/* Area Chart */}
            <div className="ag-glass" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '0.8rem', color: 'var(--t1)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{color:'var(--cyan)'}}>■</span> Son 24 Saat Alert Trendi
              </h3>
              <div style={{ flex: 1, minHeight: '220px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockTrendData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorBrute" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ff2d55" stopOpacity={0.3}/><stop offset="95%" stopColor="#ff2d55" stopOpacity={0}/></linearGradient>
                      <linearGradient id="colorSsh" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ffbe0b" stopOpacity={0.3}/><stop offset="95%" stopColor="#ffbe0b" stopOpacity={0}/></linearGradient>
                      <linearGradient id="colorSudo" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#bf5fff" stopOpacity={0.3}/><stop offset="95%" stopColor="#bf5fff" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--t3)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--t3)" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(8,15,28,0.9)', borderColor: 'rgba(0,170,255,0.2)', color: '#fff', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="bruteForce" stroke="#ff2d55" strokeWidth={2} fillOpacity={1} fill="url(#colorBrute)" />
                    <Area type="monotone" dataKey="sshFail" stroke="#ffbe0b" strokeWidth={2} fillOpacity={1} fill="url(#colorSsh)" />
                    <Area type="monotone" dataKey="sudo" stroke="#bf5fff" strokeWidth={2} fillOpacity={1} fill="url(#colorSudo)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Donut Chart */}
            <div className="ag-glass" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '0.8rem', color: 'var(--t1)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{color:'var(--purple)'}}>■</span> Saldırı Tipi Dağılımı
              </h3>
              <div style={{ flex: 1, minHeight: '220px', position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={mockPieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                      {mockPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip itemStyle={{ color: '#fff' }} contentStyle={{ backgroundColor: 'rgba(8,15,28,0.9)', borderColor: 'rgba(0,170,255,0.2)', color: '#fff', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#fff' }}>4470</div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--t2)', textTransform: 'uppercase' }}>Toplam</div>
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="ag-glass" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '0.8rem', color: 'var(--t1)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{color:'var(--warn)'}}>■</span> En Çok Saldıran IP'ler
              </h3>
              <div style={{ flex: 1, minHeight: '220px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockBarData} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                    <XAxis type="number" stroke="var(--t3)" fontSize={11} hide />
                    <YAxis dataKey="ip" type="category" stroke="var(--t2)" fontSize={11} tickLine={false} axisLine={false} width={80} />
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: 'rgba(8,15,28,0.9)', borderColor: 'rgba(0,170,255,0.2)', color: '#fff', borderRadius: '8px' }} />
                    <Bar dataKey="count" fill="var(--cyan)" radius={[0, 4, 4, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Recent Threats Table */}
          <div className="ag-glass" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px', textShadow: '0 0 10px rgba(255,45,85,0.5)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Son Kritik Olaylar
              </h3>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--t2)', cursor: 'pointer' }}>
                Otomatik Yenile
                <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} style={{ accentColor: 'var(--blue)' }} />
              </label>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '12px 8px', fontWeight: 600 }}>Zaman</th>
                    <th style={{ padding: '12px 8px', fontWeight: 600 }}>Seviye</th>
                    <th style={{ padding: '12px 8px', fontWeight: 600 }}>Kural ID</th>
                    <th style={{ padding: '12px 8px', fontWeight: 600 }}>Açıklama</th>
                    <th style={{ padding: '12px 8px', fontWeight: 600 }}>Kullanıcı / IP</th>
                  </tr>
                </thead>
                <tbody>
                  {mockThreats.map((threat, idx) => {
                    const lvlStyle = getLvlColor(threat.level);
                    return (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.2s', cursor: 'default' }} onMouseOver={(e)=>e.currentTarget.style.background='rgba(255,255,255,0.03)'} onMouseOut={(e)=>e.currentTarget.style.background='transparent'}>
                      <td style={{ padding: '12px 8px', color: 'var(--t2)', fontFamily: 'var(--font-mono)' }}>{threat.time}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{ background: lvlStyle.bg, color: lvlStyle.text, boxShadow: lvlStyle.shadow, padding: '4px 10px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 700 }}>
                          {threat.level}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', color: 'var(--t1)', fontFamily: 'var(--font-mono)' }}>{threat.rule}</td>
                      <td style={{ padding: '12px 8px', color: '#fff' }}>{threat.desc}</td>
                      <td style={{ padding: '12px 8px', color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>{threat.src}</td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      );
    };

    const AlertCard = ({ alert }) => {
      const [showJson, setShowJson] = useState(false);
      const [aiStatus, setAiStatus] = useState('idle');
      const [aiResult, setAiResult] = useState('');

      useEffect(() => {
        // Otomatik analiz iptal edildi. Kullanıcı butona basarak başlatacak.
      }, []);

      const runAiAnalysis = async () => {
        setAiStatus('loading');
        try {
          const provider = document.getElementById('liveLLMSelector')?.value || 'gemini';
          
          const rawJson = { 
            "timestamp": new Date().toISOString(), 
            "rule": { "level": alert.level==='KRİTİK'?10:5, "description": alert.desc, "id": alert.rule }, 
            "agent": { "id": "000", "name": "osmanubuntu" }, 
            "full_log": alert.log || '',
            "llm_provider": provider,
            "api_key": ""
          };

          const res = await fetch(API + '/api/analyze_single_alert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rawJson)
          });
          const data = await res.json();
          
          if (data.ok && data.explanation) {
            let txt = data.explanation.trim()
              .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#fff">$1</strong>')
              .replace(/```[a-zA-Z]*[ \r\n]*([\s\S]*?)```/g, '<pre style="background:var(--bg);border:1px solid var(--border);border-radius:3px;padding:8px;font-size:0.7rem;margin:6px 0;overflow-x:auto;color:#7fb3d3;">$1</pre>')
              .replace(/`([^`]+)`/g, '<code style="background:rgba(0,0,0,0.5);color:var(--ok);padding:2px 6px;border-radius:4px;">$1</code>')
              .replace(/\n/g, '<br>');
            setAiResult(txt);
            setAiStatus('done');
          } else {
            setAiResult('Hata: ' + (data.error || 'Bilinmeyen hata'));
            setAiStatus('error');
          }
        } catch (e) {
          setAiResult('Sunucuya ulaşılamadı.');
          setAiStatus('error');
        }
      };

      const getLvlColor = (lvl) => {
        if(lvl === 'KRİTİK') return { bg: '#ff3b3b', text: '#fff', shadow: '0 0 8px #ff3b3b80' };
        if(lvl === 'ORTA') return { bg: '#ff9500', text: '#111', shadow: '0 0 8px #ff950080' };
        return { bg: '#30d158', text: '#111', shadow: '0 0 8px #30d15880' };
      };
      
      const style = getLvlColor(alert.level);
      const rawJsonForDisplay = JSON.stringify({ 
        "timestamp": new Date().toISOString(), 
        "rule": { "level": alert.level==='KRİTİK'?10:5, "description": alert.desc, "id": alert.rule }, 
        "agent": { "id": "000", "name": "osmanubuntu" }, 
        "full_log": alert.log || '' 
      }, null, 2);

      return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px', animation: alert.isNew ? 'card-pulse 1s ease-out' : 'fadeIn 0.3s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ background: style.bg, color: style.text, boxShadow: style.shadow, padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700 }}>
              {alert.level}
            </span>
            <span style={{ color: 'var(--t3)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>{alert.time}</span>
          </div>
          <div style={{ fontSize: '1rem', color: '#fff', fontWeight: 600, marginBottom: '4px' }}>Kural {alert.rule}: {alert.desc}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--cyan)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            {alert.src}
          </div>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <button onClick={runAiAnalysis} disabled={aiStatus === 'loading'} style={{ padding: '6px 12px', background: alert.level === 'KRİTİK' ? '#ff2d55' : 'var(--blue)', border: 'none', borderRadius: '4px', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold', cursor: aiStatus==='loading'?'not-allowed':'pointer', textTransform: 'uppercase' }}>
              {aiStatus === 'loading' ? 'Analiz Ediliyor...' : (alert.level === 'KRİTİK' ? 'ACİL YORUMLA' : 'Manuel Yorumla')}
            </button>
            <button onClick={() => setShowJson(!showJson)} style={{ padding: '6px 12px', background: showJson ? 'rgba(255,255,255,0.1)' : 'transparent', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--t2)', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase' }}>
              JSON
            </button>
          </div>
          
          {showJson && (
            <pre style={{ background: '#04080f', border: '1px solid var(--border)', borderRadius: '4px', padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#7fb3d3', whiteSpace: 'pre-wrap', wordWrap: 'break-word', maxHeight: '200px', overflowY: 'auto' }}>
              {rawJsonForDisplay}
            </pre>
          )}

          {aiStatus === 'loading' && alert.level === 'KRİTİK' && (
            <div style={{ padding: '12px', background: 'var(--bg-row)', border: '1px solid var(--border)', borderLeft: '2px solid var(--blue)', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--t1)', marginTop: '8px' }}>
              <div style={{ animation: 'pulse 1s infinite', color: 'var(--crit)', fontWeight: 600 }}> Kritik tehdit için Otonom AI devrede... Bekleniyor.</div>
            </div>
          )}

          {(aiStatus === 'done' || aiStatus === 'error') && (
            <div style={{ padding: '12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderLeft: '2px solid var(--blue)', borderRadius: '4px', fontSize: '0.82rem', color: 'var(--t1)', marginTop: '8px' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '8px' }}>LLM ANALİZİ</div>
              <div style={{ lineHeight: 1.6, color: aiStatus === 'error' ? 'var(--crit)' : '#e2e8f0' }} dangerouslySetInnerHTML={{ __html: aiResult }}></div>
            </div>
          )}
        </div>
      );
    };

    const LiveSimulationPanel = () => {
      const [username, setUsername] = useState('hacker');
      const [attempts, setAttempts] = useState(16);
      const [intensity, setIntensity] = useState(3);
      const [status, setStatus] = useState('idle'); // idle, running, done
      
      const [logs, setLogs] = useState(['> Sistem hazır. Emir bekleniyor...']);
      const [alerts, setAlerts] = useState([]);
      const [timeline, setTimeline] = useState([]);
      
      const [stats, setStats] = useState({ sent: 0, detected: 0, failed: 0, success: 0, startTime: null, detectionMs: null });
      
      const logContainerRef = React.useRef(null);
      
      const [lastPollTime, setLastPollTime] = useState(0);

      useEffect(() => {
        if (logContainerRef.current) {
          logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
      }, [logs]);

      // Canlı Wazuh loglarını dinleme (Polling)
      useEffect(() => {
        if (status === 'idle') return;
        const timer = setInterval(async () => {
          try {
            const res = await fetch(`${API}/api/poll_alerts?since=${lastPollTime}`);
            const data = await res.json();
            if (data.alerts && data.alerts.length > 0) {
              const newMapped = data.alerts.map((a, i) => {
                const isKritik = a.rule && a.rule.level >= 8;
                let lvl = isKritik ? 'KRİTİK' : (a.rule.level >= 5 ? 'ORTA' : 'DÜŞÜK');
                let timeStr = new Date().toLocaleTimeString('tr-TR');
                try { if(a.timestamp) timeStr = new Date(a.timestamp).toLocaleTimeString('tr-TR'); } catch(e){}
                return {
                  id: a.id || (Date.now() + i),
                  level: lvl,
                  rule: a.rule?.id || 'Unknown',
                  desc: a.rule?.description || 'No description',
                  src: a.agent?.name || a.location || 'Unknown',
                  time: timeStr,
                  log: a.full_log || '',
                  isNew: true
                };
              });

              const filtered = newMapped.filter(a => {
                const r = String(a.rule);
                if (['5501', '5502', '5715', '40112'].includes(r)) return false;
                if (r === '5402' && a.log && a.log.includes('cat /var/ossec/logs/alerts')) return false;
                return true;
              });

              if (filtered.length > 0) {
                setAlerts(prev => {
                  const combined = [...filtered, ...prev.map(p => ({...p, isNew: false}))];
                  return combined.sort((a, b) => {
                    const val = { 'KRİTİK': 3, 'ORTA': 2, 'DÜŞÜK': 1 };
                    return (val[b.level] || 0) - (val[a.level] || 0);
                  });
                });
                
                setStats(prev => {
                  const newDetected = prev.detected + filtered.length;
                  let detMs = prev.detectionMs;
                  if (!detMs && prev.startTime) detMs = Date.now() - prev.startTime;
                  return { ...prev, detected: newDetected, detectionMs: detMs };
                });
                
                const newTimeline = filtered.map((a, i) => ({
                   id: Date.now() + 'tl' + i,
                   time: a.time,
                   type: 'alert',
                   desc: `Wazuh: ${a.level} (${a.rule})`
                }));
                setTimeline(prev => [...prev, ...newTimeline]);
              }
            }
            if (data.server_time) {
              setLastPollTime(data.server_time);
            }
          } catch(e) {}
        }, 1500); // Her 1.5 saniyede bir sor
        return () => clearInterval(timer);
      }, [status, lastPollTime]);

      const startSim = async (type) => {
        if(status === 'brute' || status === 'sudo') return;
        setStatus(type);
        setLogs(['> Bağlantı kuruldu. Gerçek API isteği gönderiliyor...']);
        setAlerts([]);
        setTimeline([]);
        const stTime = Date.now();
        setStats({ sent: 0, detected: 0, failed: 0, success: 0, startTime: stTime, detectionMs: null });
        
        // Polling'i bu andan itibaren başlatmak için sunucu zamanını alalım
        try {
           const res = await fetch(API + '/api/poll_alerts');
           const data = await res.json();
           if(data.server_time) setLastPollTime(data.server_time);
        } catch(e){}

        // Gerçek backend API isteği
        const endpoint = type === 'sudo' ? '/api/sudo_attack' : '/api/attack';
        fetch(API + endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, attempts, speed: intensity }) 
        }).catch(err => console.log('Backend API Hatası', err));

        const delayMs = type === 'sudo' ? 1000 : 1000 - (intensity * 150); // 1->850ms, 5->250ms
        let i = 0;
        let detectedTime = null;
        
        const interval = setInterval(() => {
          i++;
          const now = new Date().toLocaleTimeString('tr-TR');
          
          if (type === 'brute') {
            setLogs(prev => [...prev, `[${now}] ssh ${username}@192.168.64.4: Permission denied (password).`]);
            setTimeline(prev => [...prev, { id: i, time: now, type: 'brute', desc: 'SSH login attempt' }]);
            setStats(prev => ({ ...prev, sent: i, failed: prev.failed + 1 }));
            // Frontend alert üretmeyi bıraktı. Artık Wazuh'u bekliyoruz.
          } else {
            // Sudo Demo
            if(i===1) {
              setLogs(prev => [...prev, `[${now}] sudo su -`]);
              setTimeline(prev => [...prev, { id: i, time: now, type: 'sudo', desc: 'Sudo command executed' }]);
              setStats(prev => ({ ...prev, sent: i, success: prev.success + 1 }));
            }
            if(i===2) {
              setLogs(prev => [...prev, `[${now}] root access granted.`]);
            }
          }
          
          if (i >= (type === 'sudo' ? 2 : attempts)) {
            clearInterval(interval);
            setStatus('done');
            setLogs(prev => [...prev, '> Saldırı scripti tamamlandı. Wazuh logları izleniyor...']);
          }
        }, delayMs);
      };

      const clearAll = () => {
        setAlerts([]);
        setTimeline([]);
        setLogs(['> Sistem hazır. Emir bekleniyor...']);
        setStats({ sent: 0, detected: 0, failed: 0, success: 0, startTime: null, detectionMs: null });
        setStatus('idle');
      };

      const getLvlColor = (lvl) => {
        if(lvl === 'KRİTİK') return { color: '#ff2d55', bg: 'rgba(255,45,85,0.15)' };
        if(lvl === 'ORTA') return { color: '#ffbe0b', bg: 'rgba(255,190,11,0.15)' };
        return { color: '#00ff87', bg: 'rgba(0,255,135,0.15)' };
      };

      return (
        <div style={{ padding: '0', display: 'flex', gap: '20px', height: 'calc(100vh - 56px)', boxSizing: 'border-box' }}>
          
          {/* SOL PANEL: Kontrol */}
          <div className="ag-glass" style={{ flex: '0 0 320px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '100%', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--crit)', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Saldırı Kontrol Paneli</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* YAPAY ZEKA MODELİ - EN ÜSTE ALALIM */}
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Yapay Zeka Modeli</div>
                <select id="liveLLMSelector" disabled={status==='brute' || status==='sudo'} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border)', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem' }}>
                  <option value="gemini">Google Gemini 2.5 Flash</option>
                  <option value="ollama">Ollama (Llama 3 Local)</option>
                </select>
              </div>

              {/* SSH BRUTE FORCE GRUBU */}
              <div style={{ background: 'rgba(255,45,85,0.03)', border: '1px solid rgba(255,45,85,0.1)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--danger)', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,45,85,0.1)', paddingBottom: '6px', marginBottom: '2px' }}>1. Dış Saldırı: SSH Brute-Force</div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Hedef Kullanıcı</div>
                    <input value={username} onChange={e=>setUsername(e.target.value)} disabled={status==='brute' || status==='sudo'} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border)', color: '#fff', padding: '6px 8px', borderRadius: '4px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Deneme Sayısı</div>
                    <select value={attempts} onChange={e=>setAttempts(Number(e.target.value))} disabled={status==='brute' || status==='sudo'} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border)', color: '#fff', padding: '6px 8px', borderRadius: '4px', fontSize: '0.85rem', boxSizing: 'border-box' }}>
                      <option value={4}>4 Deneme</option>
                      <option value={8}>8 Deneme</option>
                      <option value={16}>16 Deneme</option>
                      <option value={32}>32 Deneme</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Saldırı Hızı</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="range" min="1" max="5" value={intensity} onChange={e=>setIntensity(Number(e.target.value))} disabled={status==='brute' || status==='sudo'} style={{ flex: 1, accentColor: 'var(--danger)' }} />
                  </div>
                </div>

                <button onClick={() => startSim('brute')} disabled={status==='brute' || status==='sudo'} style={{ background: 'rgba(255,45,85,0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: (status==='brute' || status==='sudo')?'not-allowed':'pointer', textTransform: 'uppercase', letterSpacing: '1px', transition: 'all 0.2s', marginTop: '4px' }}>
                  {status==='brute' ? 'SSH Brute-Force Çalışıyor...' : 'SSH Brute-Force Başlat'}
                </button>
              </div>

              {/* SUDO YETKİ YÜKSELTME GRUBU */}
              <div style={{ background: 'rgba(191,95,255,0.03)', border: '1px solid rgba(191,95,255,0.1)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--purple)', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid rgba(191,95,255,0.1)', paddingBottom: '6px', marginBottom: '2px' }}>2. İç Tehdit: Yetki Yükseltme</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--t3)', lineHeight: '1.4' }}>Sisteme sızılmış varsayılır. Tek bir komut çalıştırılarak "Başarılı Sudo" (5402) tetiklenir.</div>
                
                <button onClick={() => startSim('sudo')} disabled={status==='brute' || status==='sudo'} style={{ background: 'rgba(191,95,255,0.1)', border: '1px solid var(--purple)', color: 'var(--purple)', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: (status==='brute' || status==='sudo')?'not-allowed':'pointer', textTransform: 'uppercase', letterSpacing: '1px', transition: 'all 0.2s' }}>
                  {status==='sudo' ? 'Sudo Çalışıyor...' : 'Sudo Kullan (Tek Sefer)'}
                </button>
              </div>

            </div>

            {/* TERMINAL KISMI - BÜYÜTÜLDÜ */}
            <div style={{ flex: '1 1 auto', minHeight: '180px', background: '#050a15', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }} ref={logContainerRef}>
              {logs.map((l, i) => (
                <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: l.includes('denied') ? 'var(--danger)' : l.includes('granted') || l.includes('tamam') ? 'var(--ok)' : 'var(--t2)' }}>
                  {l}
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(0,170,255,0.05)', border: '1px solid rgba(0,170,255,0.2)', borderRadius: '8px', padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--t3)', textTransform: 'uppercase' }}>Gönderilen İstek</div>
                <div style={{ fontSize: '1.2rem', color: 'var(--cyan)', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>{stats.sent}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--t3)', textTransform: 'uppercase' }}>Tespit (Alert)</div>
                <div style={{ fontSize: '1.2rem', color: 'var(--danger)', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>{stats.detected}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--t3)', textTransform: 'uppercase' }}>Başarısız Giriş</div>
                <div style={{ fontSize: '1.2rem', color: 'var(--warn)', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>{stats.failed}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--t3)', textTransform: 'uppercase' }}>Başarılı Giriş</div>
                <div style={{ fontSize: '1.2rem', color: 'var(--ok)', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>{stats.success}</div>
              </div>
            </div>
          </div>

          {/* ORTA PANEL: Wazuh Feed */}
          <div className="ag-glass" style={{ flex: '1', padding: '24px', display: 'flex', flexDirection: 'column', maxHeight: '100%', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
              <h2 style={{ fontSize: '1.2rem', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Wazuh Anlık Tespit Feed'i</h2>
              <button onClick={clearAll} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--t2)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', transition: 'background 0.2s' }} onMouseOver={e=>e.target.style.background='rgba(255,255,255,0.05)'} onMouseOut={e=>e.target.style.background='transparent'}>Tümünü Temizle</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '8px' }}>
              {alerts.length === 0 ? (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t3)', flexDirection: 'column', gap: '12px' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  {status === 'running' ? 'Simülasyon çalışıyor, loglar bekleniyor...' : 'Simülasyon başlatıldığında alarmlar burada görünecektir.'}
                </div>
              ) : (
                alerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
              )}
            </div>
          </div>

          {/* SAĞ PANEL: Timeline */}
          <div className="ag-glass" style={{ flex: '0 0 280px', padding: '24px', display: 'flex', flexDirection: 'column', maxHeight: '100%', overflow: 'hidden' }}>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--accent)', margin: 0, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>Saldırı Zaman Çizelgesi</h2>
            
            <div style={{ flex: 1, overflowY: 'auto', position: 'relative', paddingLeft: '12px' }}>
              <div style={{ position: 'absolute', left: '16px', top: 0, bottom: 0, width: '2px', background: 'var(--border)' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {timeline.length === 0 && <div style={{ color: 'var(--t3)', fontSize: '0.8rem', paddingLeft: '16px' }}>Henüz olay yok.</div>}
                {timeline.map((evt, idx) => {
                  const dotColor = evt.type === 'brute' ? 'var(--danger)' : evt.type === 'sudo' ? 'var(--purple)' : evt.type === 'alert' ? 'var(--warn)' : 'var(--ok)';
                  return (
                    <div key={idx} style={{ position: 'relative', paddingLeft: '24px', animation: 'fadeIn 0.3s' }}>
                      <div style={{ position: 'absolute', left: '-1px', top: '4px', width: '10px', height: '10px', borderRadius: '50%', background: dotColor, border: '2px solid var(--bg-card)' }}></div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>{evt.time}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--t1)', fontWeight: evt.type === 'alert' ? 600 : 400 }}>{evt.desc}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div style={{ marginTop: '20px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tespit Süresi (İlk Alert)</div>
              <div style={{ fontSize: '1.5rem', color: 'var(--ok)', fontWeight: 'bold', fontFamily: 'var(--font-mono)', margin: '8px 0' }}>
                {stats.detectionMs ? `${stats.detectionMs} ms` : '--'}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--t3)' }}>İlk ataktan tespite kadar geçen süre</div>
            </div>
          </div>

        </div>
      );
    };

    const rootElement = document.getElementById('react-root-dashboard');
    if (rootElement) {
        const root = ReactDOM.createRoot(rootElement);
        root.render(<SocDashboard />);
    }
    const liveElement = document.getElementById('react-root-live');
    if (liveElement) {
        const rootLive = ReactDOM.createRoot(liveElement);
        rootLive.render(<LiveSimulationPanel />);
    }
