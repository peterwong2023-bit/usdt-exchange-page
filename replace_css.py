import re

with open('/Users/wongpeter/Desktop/usdt-exchange-page/docs/mockup/withdraw-stats-tron-usdt.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_css = """<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/remixicon@4.1.0/fonts/remixicon.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js"></script>
<style>
  :root {
    --bg-main: #f3f5f9;
    --bg-card: #ffffff;
    --border-soft: #e5e8f0;
    --text-main: #1e293b;
    --text-muted: #64748b;
    --text-light: #94a3b8;
    --primary: #2563eb;
    --primary-hover: #1d4ed8;
    --primary-light: #eff6ff;
    --success: #10b981;
    --success-light: #ecfdf5;
    --warning: #f59e0b;
    --warning-light: #fffbeb;
    --danger: #ef4444;
    --danger-light: #fef2f2;
    --purple: #8b5cf6;
    --purple-light: #f5f3ff;
    --sb-bg: #090e17;
    --sb-text: #64748b;
    --sb-active: #ffffff;
    --shadow-sm: 0 2px 4px rgba(15,23,42,0.02);
    --shadow-md: 0 4px 12px rgba(15,23,42,0.04);
    --shadow-lg: 0 12px 32px rgba(15,23,42,0.06);
    --radius-sm: 6px;
    --radius-md: 12px;
    --radius-lg: 16px;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: var(--bg-main); color: var(--text-main); font-family: 'Outfit', -apple-system, sans-serif; font-size: 13px; display: flex; min-height: 100vh; -webkit-font-smoothing: antialiased; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

  /* Animations */
  @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .kr > div { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
  .kr > div:nth-child(1) { animation-delay: 0.1s; }
  .kr > div:nth-child(2) { animation-delay: 0.15s; }
  .kr > div:nth-child(3) { animation-delay: 0.2s; }
  .kr > div:nth-child(4) { animation-delay: 0.25s; }
  .wl-card { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both; }
  .cd { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both; }
  .btab-wrap { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both; }

  /* Sidebar */
  .sb { width: 220px; min-height: 100vh; background: var(--sb-bg); flex-shrink: 0; overflow-y: auto; padding-bottom: 20px; border-right: 1px solid rgba(255,255,255,0.05); }
  .sb-logo { padding: 24px 20px 4px; font-size: 18px; font-weight: 700; color: #fff; letter-spacing: -0.5px; display: flex; align-items: center; gap: 8px; }
  .sb-logo::before { content: ''; display: block; width: 8px; height: 8px; background: var(--primary); border-radius: 50%; box-shadow: 0 0 12px var(--primary); }
  .sb-ver { padding: 0 20px 24px 36px; font-size: 10px; color: #475569; font-family: 'JetBrains Mono', monospace; }
  .n { padding: 10px 20px; font-size: 13px; color: var(--sb-text); cursor: pointer; display: flex; align-items: center; gap: 12px; transition: all .2s; font-weight: 500; }
  .n:hover { color: #fff; background: rgba(255,255,255,.03); }
  .n i { font-size: 16px; width: 20px; text-align: center; opacity: 0.7; }
  .sec { padding: 16px 20px 8px; font-size: 11px; color: #475569; cursor: pointer; display: flex; align-items: center; gap: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
  .sec i { font-size: 14px; width: 20px; text-align: center; }
  .sec .arr { margin-left: auto; font-size: 14px; }
  .nc { padding: 9px 20px 9px 52px; font-size: 13px; color: #94a3b8; cursor: pointer; transition: all .2s; display: flex; align-items: center; gap: 10px; font-weight: 400; position: relative; }
  .nc:hover { color: #fff; }
  .nc i { font-size: 15px; width: 18px; text-align: center; opacity: 0.5; }
  .nc.act { color: #fff; font-weight: 600; background: linear-gradient(90deg, rgba(37,99,235,0.1) 0%, transparent 100%); }
  .nc.act i { opacity: 1; color: var(--primary); }
  .nc.act::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--primary); border-radius: 0 4px 4px 0; box-shadow: 0 0 10px rgba(37,99,235,0.5); }

  /* Topbar */
  .topbar { height: 60px; background: rgba(255,255,255,0.8); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border-soft); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; position: sticky; top: 0; z-index: 10; }
  .topbar .hb { font-size: 20px; color: var(--text-muted); cursor: pointer; transition: color .2s; }
  .topbar .hb:hover { color: var(--text-main); }
  .topbar .usr { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 500; color: var(--text-main); cursor: pointer; }
  .topbar .av { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--purple)); display: flex; align-items: center; justify-content: center; font-size: 13px; color: #fff; font-weight: 600; box-shadow: 0 2px 8px rgba(37,99,235,0.2); }

  /* Main Layout */
  .mw { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .mn { flex: 1; padding: 24px 32px; overflow-y: auto; }
  .bc { font-size: 12px; color: var(--text-muted); margin-bottom: 16px; display: flex; align-items: center; gap: 6px; font-weight: 500; }
  .bc a { color: var(--text-muted); text-decoration: none; transition: color .2s; }
  .bc a:hover { color: var(--primary); }
  .pt { font-size: 24px; font-weight: 700; color: var(--text-main); margin-bottom: 24px; display: flex; align-items: flex-end; justify-content: space-between; letter-spacing: -0.5px; }
  .pt .upd { font-size: 12px; color: var(--text-light); font-weight: 400; letter-spacing: 0; display: flex; align-items: center; gap: 4px; }
  .pt .upd::before { content: ''; display: block; width: 6px; height: 6px; background: var(--success); border-radius: 50%; }

  /* Filters */
  .frow { display: flex; align-items: flex-end; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; background: var(--bg-card); padding: 16px 20px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border: 1px solid var(--border-soft); }
  .fg { display: flex; flex-direction: column; gap: 6px; }
  .fg label { font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
  .fg select, .fg input[type="date"] { background: var(--bg-main); border: 1px solid transparent; color: var(--text-main); padding: 8px 12px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 500; font-family: 'Outfit', sans-serif; outline: none; min-width: 140px; transition: all .2s; cursor: pointer; }
  .fg select:focus, .fg input:focus, .fg select:hover, .fg input:hover { border-color: var(--primary); background: #fff; box-shadow: 0 0 0 3px var(--primary-light); }
  .prs { display: flex; background: var(--bg-main); border-radius: var(--radius-sm); overflow: hidden; padding: 2px; }
  .prs .p { padding: 6px 16px; font-size: 13px; font-weight: 600; cursor: pointer; color: var(--text-muted); border-radius: 4px; transition: all .2s; }
  .prs .p.on { background: #fff; color: var(--primary); box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
  .prs .p:hover:not(.on) { color: var(--text-main); }
  .bq { padding: 8px 20px; border-radius: var(--radius-sm); font-size: 13px; background: var(--primary); color: #fff; border: none; cursor: pointer; font-weight: 600; font-family: 'Outfit', sans-serif; transition: all .2s; box-shadow: 0 2px 8px rgba(37,99,235,0.2); }
  .bq:hover { background: var(--primary-hover); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37,99,235,0.3); }
  .brr { padding: 8px 20px; border-radius: var(--radius-sm); font-size: 13px; background: #fff; color: var(--text-muted); border: 1px solid var(--border-soft); cursor: pointer; font-weight: 600; font-family: 'Outfit', sans-serif; transition: all .2s; }
  .brr:hover { border-color: var(--text-muted); color: var(--text-main); background: var(--bg-main); }

  /* KPI Cards */
  .kr { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  @media (max-width: 1000px) { .kr { grid-template-columns: repeat(2, 1fr); } }
  .k { background: var(--bg-card); border: 1px solid var(--border-soft); border-radius: var(--radius-lg); padding: 20px 24px; transition: all .25s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: var(--shadow-sm); position: relative; overflow: hidden; }
  .k::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: var(--border-soft); transition: background .25s; }
  .k:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); }
  .k:nth-child(1):hover::after { background: var(--primary); }
  .k:nth-child(2):hover::after { background: var(--warning); }
  .k:nth-child(3):hover::after { background: var(--purple); }
  .k:nth-child(4):hover::after { background: var(--text-muted); }
  .k .kl { font-size: 13px; font-weight: 600; color: var(--text-muted); display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
  .k .kl .d { width: 8px; height: 8px; border-radius: 2px; }
  .k .kv { font-size: 28px; font-weight: 700; line-height: 1.2; font-family: 'JetBrains Mono', monospace; letter-spacing: -1px; }
  .k .ks { font-size: 12px; font-weight: 500; color: var(--text-light); margin-top: 8px; line-height: 1.5; }
  .k .ks .up { color: var(--success); }
  .k .ks .dn { color: var(--danger); }

  /* Utility classes */
  .mono { font-family: 'JetBrains Mono', monospace; }
  .dim { color: var(--text-light); }
  .tag { display: inline-flex; align-items: center; justify-content: center; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; font-family: 'Outfit', sans-serif; letter-spacing: 0.3px; }
  .tag-g { background: var(--success-light); color: var(--success); }
  .tag-r { background: var(--danger-light); color: var(--danger); }
  .tag-y { background: var(--warning-light); color: var(--warning); }
  .tag-b { background: var(--primary-light); color: var(--primary); }
  .tag-gray { background: var(--bg-main); color: var(--text-muted); }
  .tag-v { background: var(--purple-light); color: var(--purple); }
  .tag-orange { background: #fff7ed; color: #ea580c; }
  .ol { color: var(--primary); cursor: pointer; font-weight: 600; font-size: 13px; transition: color .2s; }
  .ol:hover { color: var(--primary-hover); text-decoration: underline; }

  /* Net Tags */
  .net-cell { display: inline-flex; align-items: center; gap: 6px; }
  .net-tag { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; letter-spacing: 0.5px; font-family: 'Outfit', sans-serif; text-transform: uppercase; }
  .net-tag.in { background: var(--success-light); color: var(--success); border: 1px solid rgba(16,185,129,0.2); }
  .net-tag.out { background: var(--danger-light); color: var(--danger); border: 1px solid rgba(239,68,68,0.2); }
  .net-warn { color: var(--warning); font-size: 14px; cursor: help; margin-left: 2px; }
  .cg { color: var(--success); font-weight: 600; }
  .cr { color: var(--danger); font-weight: 600; }
  .co { color: var(--warning); font-weight: 600; }
  .cb2 { color: var(--primary); font-weight: 600; }
  .cv { color: var(--purple); font-weight: 600; }

  /* Water Level Card */
  .wl-card { background: var(--bg-card); border: 1px solid var(--border-soft); border-radius: var(--radius-lg); margin-bottom: 24px; padding: 24px; box-shadow: var(--shadow-sm); }
  .wl-title { font-size: 15px; font-weight: 700; color: var(--text-main); margin-bottom: 20px; display: flex; align-items: center; gap: 8px; letter-spacing: -0.2px; }
  .wl-title i { font-size: 18px; background: var(--primary-light); padding: 4px; border-radius: 6px; }
  
  .wl-bar-wrap { position: relative; height: 44px; background: var(--bg-main); border-radius: 8px; margin-bottom: 16px; overflow: visible; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); }
  .wl-zone { position: absolute; top: 0; height: 100%; transition: all 0.3s; }
  .wl-zone-danger { background: repeating-linear-gradient(45deg, rgba(239,68,68,0.05), rgba(239,68,68,0.05) 10px, rgba(239,68,68,0.1) 10px, rgba(239,68,68,0.1) 20px); border-radius: 8px 0 0 8px; border-right: 1px solid rgba(239,68,68,0.2); }
  .wl-zone-warning { background: rgba(245,158,11,0.08); border-right: 1px solid rgba(245,158,11,0.2); }
  .wl-zone-normal { background: rgba(16,185,129,0.08); border-right: 1px solid rgba(16,185,129,0.2); }
  .wl-zone-over { background: repeating-linear-gradient(-45deg, rgba(239,68,68,0.05), rgba(239,68,68,0.05) 10px, rgba(239,68,68,0.1) 10px, rgba(239,68,68,0.1) 20px); border-radius: 0 8px 8px 0; }
  
  .wl-marker { position: absolute; top: -8px; width: 2px; height: 60px; z-index: 2; transition: all 0.3s; }
  .wl-marker-label { position: absolute; top: -26px; left: 50%; transform: translateX(-50%); font-size: 10px; font-weight: 700; white-space: nowrap; padding: 2px 8px; border-radius: 12px; letter-spacing: 0.5px; }
  .wl-marker-val { position: absolute; bottom: -22px; left: 50%; transform: translateX(-50%); font-size: 11px; font-weight: 600; font-family: 'JetBrains Mono', monospace; color: var(--text-muted); white-space: nowrap; }
  
  .wl-current { position: absolute; top: 4px; width: 36px; height: 36px; border-radius: 50%; z-index: 5; display: flex; align-items: center; justify-content: center; transform: translateX(-50%); box-shadow: 0 4px 12px rgba(0,0,0,.15); cursor: pointer; transition: left 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
  .wl-current::before { content: ''; position: absolute; inset: -6px; border-radius: 50%; border: 2px solid currentColor; opacity: 0.3; animation: wlPulse 2s ease-out infinite; }
  .wl-current::after { content: ''; position: absolute; top: -10px; left: 50%; transform: translateX(-50%); border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid currentColor; }
  .wl-current-tip { position: absolute; bottom: calc(100% + 14px); left: 50%; transform: translateX(-50%); background: #0f172a; color: #fff; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; font-family: 'JetBrains Mono', monospace; white-space: nowrap; opacity: 0; pointer-events: none; transition: all .2s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0 8px 24px rgba(15,23,42,0.3); }
  .wl-current-tip::after { content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid #0f172a; }
  .wl-current:hover .wl-current-tip { opacity: 1; bottom: calc(100% + 18px); }
  @keyframes wlPulse { 0% { opacity: 0.5; transform: scale(0.8); } 100% { opacity: 0; transform: scale(1.6); } }

  .wl-status { border-radius: var(--radius-md); padding: 16px 20px; transition: all .3s; }
  .wl-status.st-normal { background: var(--success-light); border: 1px solid rgba(16,185,129,0.2); }
  .wl-status.st-wait-batch { background: var(--warning-light); border: 1px solid rgba(245,158,11,0.2); }
  .wl-status.st-wait-window { background: var(--warning-light); border: 1px solid rgba(245,158,11,0.2); }
  .wl-status.st-ready { background: var(--success-light); border: 1px solid rgba(16,185,129,0.2); }
  .wl-status.st-force { background: var(--danger-light); border: 1px solid rgba(239,68,68,0.2); }
  .wl-status.st-low { background: var(--danger-light); border: 1px solid rgba(239,68,68,0.2); }
  
  .wl-status-r1 { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
  .wl-status-tag { font-size: 14px; font-weight: 700; display: flex; align-items: center; gap: 6px; letter-spacing: -0.3px; }
  .wl-status-num { font-size: 20px; font-weight: 700; font-family: 'JetBrains Mono', monospace; letter-spacing: -0.5px; }
  .wl-status-pills { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
  .wl-pill { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 600; font-family: 'JetBrains Mono', monospace; }
  .wl-pill.unmet { background: #fff; border: 1px solid rgba(239,68,68,0.3); color: var(--danger); box-shadow: 0 2px 4px rgba(239,68,68,0.05); }
  .wl-pill.wait { background: #fff; border: 1px solid rgba(245,158,11,0.3); color: var(--warning); box-shadow: 0 2px 4px rgba(245,158,11,0.05); }
  .wl-pill.met { background: #fff; border: 1px solid rgba(16,185,129,0.3); color: var(--success); box-shadow: 0 2px 4px rgba(16,185,129,0.05); }
  .wl-pill .wl-pill-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .wl-status-hint { font-size: 12px; font-weight: 500; color: var(--text-muted); margin-top: 10px; }

  /* Recommendations */
  .wl-rec-marker { position: absolute; top: -8px; width: 0; height: 60px; z-index: 1; border-left: 2px dashed; opacity: 0.5; }
  .wl-rec-marker-label { position: absolute; bottom: -36px; left: 50%; transform: translateX(-50%); font-size: 10px; font-weight: 600; white-space: nowrap; padding: 2px 6px; border-radius: 4px; background: var(--bg-main); border: 1px solid var(--border-soft); }
  .wl-rec-row { display: flex; align-items: center; gap: 10px; padding: 12px 16px; margin-bottom: 16px; background: var(--bg-main); border: 1px dashed #cbd5e1; border-radius: var(--radius-md); font-size: 13px; font-weight: 500; color: var(--text-main); cursor: pointer; transition: all .2s; }
  .wl-rec-row:hover { background: #f1f5f9; border-color: #94a3b8; }
  .wl-rec-icon { color: var(--primary); font-size: 16px; background: var(--primary-light); padding: 4px; border-radius: 6px; }
  .wl-rec-vals { font-family: 'JetBrains Mono', monospace; color: var(--text-main); font-weight: 600; margin-left: 4px; }
  .wl-rec-diff { font-size: 12px; display: flex; gap: 12px; flex-wrap: wrap; margin-left: 8px; }
  .wl-rec-toggle { margin-left: auto; color: var(--primary); font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 4px; }
  .wl-rec-toggle i { font-size: 16px; transition: transform .3s cubic-bezier(0.16, 1, 0.3, 1); }
  .wl-rec-detail { display: none; background: #fff; border: 1px solid var(--border-soft); border-radius: var(--radius-md); padding: 20px; margin-bottom: 16px; box-shadow: var(--shadow-sm); animation: fadeUp 0.3s ease-out; }
  .wl-rec-detail.open { display: block; }
  .wl-rec-formula { margin-bottom: 16px; background: var(--bg-main); padding: 12px 16px; border-radius: var(--radius-sm); }
  .wl-rec-formula-title { font-size: 13px; font-weight: 700; color: var(--text-main); margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
  .wl-rec-formula-calc { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-muted); margin-bottom: 4px; padding-left: 26px; }
  .wl-rec-formula-compare { font-size: 12px; font-weight: 500; color: var(--text-light); padding-left: 26px; margin-top: 6px; }
  .wl-rec-data-hint { font-size: 12px; font-weight: 500; color: var(--text-light); margin-top: 16px; padding-top: 16px; border-top: 1px dashed var(--border-soft); display: flex; align-items: center; gap: 6px; }

  /* Charts & Tables Container */
  .cd { background: var(--bg-card); border: 1px solid var(--border-soft); border-radius: var(--radius-lg); margin-bottom: 24px; box-shadow: var(--shadow-sm); overflow: hidden; }
  .ch { display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; border-bottom: 1px solid var(--border-soft); background: rgba(255,255,255,0.5); }
  .ch h3 { font-size: 16px; font-weight: 700; color: var(--text-main); letter-spacing: -0.3px; }
  .cb { padding: 20px; }

  /* Legends */
  .legend-row { display: flex; gap: 20px; flex-wrap: wrap; align-items: center; }
  .legend-row label { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500; color: var(--text-muted); cursor: pointer; position: relative; transition: color .2s; }
  .legend-row label:hover { color: var(--text-main); }
  .legend-row input[type="checkbox"] { accent-color: var(--primary); width: 14px; height: 14px; cursor: pointer; }
  .legend-tip { display: none; position: absolute; bottom: calc(100% + 10px); left: 50%; transform: translateX(-50%); background: #0f172a; color: #fff; padding: 12px 16px; border-radius: 8px; font-size: 12px; line-height: 1.6; white-space: nowrap; z-index: 100; box-shadow: 0 10px 25px rgba(15,23,42,0.3); pointer-events: none; opacity: 0; animation: fadeUp 0.2s forwards; }
  .legend-tip::after { content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border: 6px solid transparent; border-top-color: #0f172a; }
  .legend-tip b { color: #fff; font-size: 13px; display: block; margin-bottom: 4px; font-weight: 700; }
  .legend-tip .lt-dim { color: #94a3b8; font-weight: 400; }
  .legend-row label:hover .legend-tip { display: block; }

  /* Tables */
  .tbl { width: 100%; border-collapse: separate; border-spacing: 0; }
  .tbl th { text-align: left; padding: 14px 16px; background: var(--bg-main); color: var(--text-muted); font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid var(--border-soft); white-space: nowrap; position: sticky; top: 0; z-index: 2; }
  .tbl td { padding: 14px 16px; border-bottom: 1px solid var(--border-soft); font-size: 13px; font-weight: 500; color: var(--text-main); white-space: nowrap; transition: background .15s; }
  .tbl tr:last-child td { border-bottom: none; }
  .tbl tr:hover td { background: #f8fafc; }
  .th-tip { color: #94a3b8; font-size: 14px; cursor: help; margin-left: 4px; vertical-align: text-bottom; }

  /* Pagination */
  .pgb { display: flex; align-items: center; justify-content: flex-end; gap: 8px; padding: 16px 24px; font-size: 13px; font-weight: 500; color: var(--text-muted); border-top: 1px solid var(--border-soft); background: var(--bg-main); }
  .pg { min-width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); cursor: pointer; background: #fff; border: 1px solid var(--border-soft); color: var(--text-muted); font-size: 13px; font-weight: 600; transition: all .2s; }
  .pg:hover { border-color: var(--primary); color: var(--primary); transform: translateY(-1px); box-shadow: 0 2px 4px rgba(37,99,235,0.1); }
  .pg.on { background: var(--primary); color: #fff; border-color: var(--primary); box-shadow: 0 2px 8px rgba(37,99,235,0.25); }

  /* Buttons & Utilities */
  .btn-create { padding: 8px 16px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 600; font-family: 'Outfit', sans-serif; border: 1px solid var(--border-soft); background: #fff; color: var(--text-main); cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all .2s; box-shadow: 0 1px 2px rgba(0,0,0,0.02); }
  .btn-create:hover { border-color: var(--primary); color: var(--primary); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37,99,235,0.1); }
  .truncate { max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: inline-block; vertical-align: middle; }

  /* Bottom Tabs */
  .btab-wrap { background: var(--bg-card); border: 1px solid var(--border-soft); border-radius: var(--radius-lg); margin-bottom: 24px; box-shadow: var(--shadow-sm); overflow: hidden; }
  .btab-nav { display: flex; background: var(--bg-main); border-bottom: 1px solid var(--border-soft); padding: 0 8px; }
  .btab-btn { padding: 16px 24px; font-size: 14px; font-weight: 600; color: var(--text-muted); cursor: pointer; border-bottom: 2px solid transparent; transition: all .2s; user-select: none; position: relative; }
  .btab-btn:hover { color: var(--text-main); }
  .btab-btn.active { color: var(--primary); border-bottom-color: var(--primary); background: #fff; border-radius: 8px 8px 0 0; }
  .btab-panel { display: none; }
  .btab-panel.active { display: block; animation: fadeUp 0.3s ease-out; }
  .btab-filter { display: flex; align-items: center; gap: 12px; padding: 16px 24px; border-bottom: 1px solid var(--border-soft); flex-wrap: wrap; background: #fff; }
  .btab-filter select, .btab-filter input[type="date"] { background: var(--bg-main); border: 1px solid transparent; color: var(--text-main); padding: 8px 12px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 500; font-family: 'Outfit', sans-serif; outline: none; transition: all .2s; cursor: pointer; }
  .btab-filter select:focus, .btab-filter input:focus, .btab-filter select:hover, .btab-filter input:hover { border-color: var(--primary); background: #fff; box-shadow: 0 0 0 3px var(--primary-light); }
  .btab-actions { margin-left: auto; display: flex; gap: 10px; }

  /* Drawer */
  .drawer-mask { position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(4px); z-index: 100; opacity: 0; pointer-events: none; transition: opacity .3s cubic-bezier(0.16, 1, 0.3, 1); }
  .drawer-mask.open { opacity: 1; pointer-events: auto; }
  .drawer { position: fixed; top: 0; right: -640px; width: 640px; height: 100vh; background: #fff; z-index: 101; transition: right .4s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: -10px 0 40px rgba(0,0,0,.1); display: flex; flex-direction: column; }
  .drawer.open { right: 0; }
  .drawer-header { padding: 20px 28px; border-bottom: 1px solid var(--border-soft); display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; background: var(--bg-main); }
  .drawer-header h3 { font-size: 18px; font-weight: 700; color: var(--text-main); letter-spacing: -0.3px; }
  .drawer-close { font-size: 22px; color: var(--text-muted); cursor: pointer; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all .2s; background: #fff; box-shadow: var(--shadow-sm); border: 1px solid var(--border-soft); }
  .drawer-close:hover { background: var(--danger-light); color: var(--danger); border-color: transparent; transform: rotate(90deg); }
  .drawer-body { flex: 1; overflow-y: auto; padding: 28px; }
</style>"""

content = re.sub(r'<link href="https://cdn.jsdelivr.net/npm/remixicon@4.1.0/fonts/remixicon.css" rel="stylesheet">\n<script src="https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js"></script>\n<style>.*?</style>', new_css, content, flags=re.DOTALL)

with open('/Users/wongpeter/Desktop/usdt-exchange-page/docs/mockup/withdraw-stats-tron-usdt.html', 'w', encoding='utf-8') as f:
    f.write(content)
