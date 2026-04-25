// ── Chart registry (so we can destroy before reinit) ──
const CHARTS = {};
function kill(id) { if (CHARTS[id]) { CHARTS[id].destroy(); delete CHARTS[id]; } }

const BASE_OPTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
};

// ── Tick formatter ───────────────────────────
const pesoK = v => '₱' + (v / 1000).toFixed(0) + 'k';


// ════════════════════════════════════════════
//  CHART INITIALIZERS
// ════════════════════════════════════════════

function initOverview() {
  kill('ov-revenue'); kill('ov-category');

  CHARTS['ov-revenue'] = new Chart(document.getElementById('ov-revenue'), {
    type: 'line',
    data: {
      labels: MONTHS,
      datasets: [{
        data: REVENUE,
        borderColor: CHART_COLORS.black,
        backgroundColor: 'rgba(17,17,17,0.07)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: CHART_COLORS.black,
        pointRadius: 4,
        pointHoverRadius: 7,
      }]
    },
    options: {
      ...BASE_OPTS,
      scales: {
        y: { grid:{color:'#F3F4F6'}, ticks:{callback:pesoK, font:{size:11}}, border:{display:false} },
        x: { grid:{display:false}, ticks:{font:{size:11}} }
      }
    }
  });

  CHARTS['ov-category'] = new Chart(document.getElementById('ov-category'), {
    type: 'doughnut',
    data: {
      labels: ['Cement','Steel','Aggregates','Others'],
      datasets: [{ data:[34,28,18,20], backgroundColor:['#111111','#555','#AAA','#DDD'], borderWidth:0 }]
    },
    options: { ...BASE_OPTS, cutout:'72%' }
  });
}

function initSales() {
  kill('sl-revenue'); kill('sl-top');
  // Seed quotation with one blank line if empty
  if (!document.getElementById('qt-items').children.length) { addQtLine(); }
  // Set today's date on quotation
  const today = new Date().toISOString().split('T')[0];
  if (document.getElementById('qt-date') && !document.getElementById('qt-date').value) document.getElementById('qt-date').value = today;

  CHARTS['sl-revenue'] = new Chart(document.getElementById('sl-revenue'), {
    type: 'bar',
    data: {
      labels: MONTHS,
      datasets: [{
        data: REVENUE,
        backgroundColor: MONTHS.map((_, i) => i === 5 ? CHART_COLORS.black : CHART_COLORS.pale),
        borderRadius: 8,
        borderSkipped: false,
      }]
    },
    options: {
      ...BASE_OPTS,
      scales: {
        y: { grid:{color:'#F3F4F6'}, ticks:{callback:pesoK, font:{size:11}}, border:{display:false} },
        x: { grid:{display:false}, ticks:{font:{size:11}} }
      }
    }
  });

  CHARTS['sl-top'] = new Chart(document.getElementById('sl-top'), {
    type: 'bar',
    data: {
      labels: ['Cement','Steel Bar','Hollow Blk','Gravel','Plywood'],
      datasets: [{
        data: [199720, 164478, 105736, 58742, 58742],
        backgroundColor: ['#111111','#3A3A3C','#636366','#8E8E93','#C7C7CC'],
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      ...BASE_OPTS,
      indexAxis: 'y',
      scales: {
        x: { grid:{color:'#F3F4F6'}, ticks:{callback:pesoK, font:{size:10}}, border:{display:false} },
        y: { grid:{display:false}, ticks:{font:{size:11}} }
      }
    }
  });
}

function initInventory() {
  kill('inv-stock');

  const stockLabels = ['Hollow Blk 4"','Hollow Blk 6"','Steel 10mm','Masonry Cem','Steel 12mm','Gravel','Plywood 3/4"','Portland Cem','GI Sheet','Steel 16mm'];
  const stockVals   = [84, 52, 85, 80, 62, 60, 36, 45, 20, 16];
  const stockColors = stockVals.map(v => v < 30 ? '#EF4444' : v < 50 ? '#F59E0B' : CHART_COLORS.black);

  CHARTS['inv-stock'] = new Chart(document.getElementById('inv-stock'), {
    type: 'bar',
    data: {
      labels: stockLabels,
      datasets: [{
        data: stockVals,
        backgroundColor: stockColors,
        borderRadius: 4,
        borderSkipped: false,
      }]
    },
    options: {
      ...BASE_OPTS,
      indexAxis: 'y',
      scales: {
        x: { max:100, grid:{color:'#F3F4F6'}, ticks:{callback:v=>v+'%', font:{size:10}}, border:{display:false} },
        y: { grid:{display:false}, ticks:{font:{size:10}} }
      }
    }
  });
}

function initHR() {
  kill('hr-attendance');

  CHARTS['hr-attendance'] = new Chart(document.getElementById('hr-attendance'), {
    type: 'bar',
    data: {
      labels: ['Mon','Tue','Wed','Thu','Fri'],
      datasets: [{
        data: [10, 9, 10, 9, 8],
        backgroundColor: ['#111111','#111111','#111111','#111111','#3A3A3C'],
        borderRadius: 8,
        borderSkipped: false,
      }]
    },
    options: {
      ...BASE_OPTS,
      scales: {
        y: { min:0, max:10, grid:{color:'#F3F4F6'}, ticks:{stepSize:2, font:{size:11}}, border:{display:false} },
        x: { grid:{display:false}, ticks:{font:{size:11}} }
      }
    }
  });
}

function initAnalytics() {
  kill('an-revenue'); kill('an-category'); kill('an-compare');

  const d = HIST['2026'];
  CHARTS['an-revenue'] = new Chart(document.getElementById('an-revenue'), {
    type: 'line',
    data: {
      labels: d.labels,
      datasets: [{
        data: d.revenue,
        borderColor: CHART_COLORS.black,
        backgroundColor: 'rgba(17,17,17,0.08)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: CHART_COLORS.black,
        pointRadius: 4,
        pointHoverRadius: 7,
      }]
    },
    options: {
      ...BASE_OPTS,
      scales: {
        y: { grid:{color:'#F3F4F6'}, ticks:{callback:pesoK, font:{size:11}}, border:{display:false} },
        x: { grid:{display:false}, ticks:{font:{size:11}} }
      }
    }
  });

  CHARTS['an-category'] = new Chart(document.getElementById('an-category'), {
    type: 'doughnut',
    data: {
      labels: ['Cement','Steel','Aggregates','Masonry','Wood & Metal','Others'],
      datasets: [{
        data: [34, 28, 12, 10, 8, 8],
        backgroundColor: ['#111111','#3A3A3C','#636366','#8E8E93','#AEAEB2','#D1D1D6'],
        borderWidth: 3,
        borderColor: '#fff',
      }]
    },
    options: {
      ...BASE_OPTS,
      cutout: '58%',
      plugins: { legend: { display: true, position: 'right', labels: { font:{size:11}, boxWidth:12, padding:10 } } }
    }
  });

  // Default comparison: Feb vs Mar 2026
  const catsA = CAT_PCT.map(p => Math.round(HIST['2026'].revenue[1] * p));
  const catsB = CAT_PCT.map(p => Math.round(HIST['2026'].revenue[2] * p));
  CHARTS['an-compare'] = new Chart(document.getElementById('an-compare'), {
    type: 'bar',
    data: {
      labels: CAT_NAMES,
      datasets: [
        { label:'Feb 2026', data: catsA, backgroundColor: CHART_COLORS.pale, borderRadius:5, borderSkipped:false },
        { label:'Mar 2026', data: catsB, backgroundColor: CHART_COLORS.black, borderRadius:5, borderSkipped:false },
      ]
    },
    options: {
      ...BASE_OPTS,
      plugins: { legend: { display:true, labels:{ font:{size:10}, boxWidth:10 } } },
      scales: {
        y: { grid:{color:'#F3F4F6'}, ticks:{callback:pesoK, font:{size:10}}, border:{display:false} },
        x: { grid:{display:false}, ticks:{font:{size:10}} }
      }
    }
  });

  // Default insights
  renderInsights('Feb 2026', HIST['2026'].revenue[1], catsA, 'Mar 2026', HIST['2026'].revenue[2], catsB);
}

// ── Analytics: switch year ───────────────────
function setAnalyticsYear(year, btn) {
  document.querySelectorAll('.an-yr-btn').forEach(b => {
    b.className = 'an-yr-btn px-4 py-1.5 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-100 transition';
  });
  btn.className = 'an-yr-btn px-4 py-1.5 rounded-xl text-xs font-semibold bg-gray-900 text-white transition';

  const d = HIST[year];
  // Update trend chart
  CHARTS['an-revenue'].data.labels   = d.labels;
  CHARTS['an-revenue'].data.datasets[0].data = d.revenue;
  CHARTS['an-revenue'].update();
  document.getElementById('an-trend-label').textContent = d.labels[0] + ' – ' + d.labels[d.labels.length-1] + ' ' + year;

  // Update KPIs
  const total    = d.revenue.reduce((a,b) => a+b, 0);
  const maxRev   = Math.max(...d.revenue);
  const bestIdx  = d.revenue.indexOf(maxRev);
  const avg      = Math.round(total / d.revenue.length);
  document.getElementById('an-kpi-total').textContent      = '₱' + (total / 1000000).toFixed(2) + 'M';
  document.getElementById('an-kpi-period').textContent     = d.labels[0] + '–' + d.labels[d.labels.length-1] + ' ' + year;
  document.getElementById('an-kpi-best-month').textContent = d.labels[bestIdx];
  document.getElementById('an-kpi-best-val').textContent   = '₱' + maxRev.toLocaleString();
  document.getElementById('an-kpi-avg').textContent        = '₱' + avg.toLocaleString();
  document.getElementById('an-kpi-months').textContent     = 'over ' + d.revenue.length + ' month' + (d.revenue.length > 1 ? 's' : '');
}

// ── Analytics: update month dropdowns when year changes ──
function updateMonthOpts(side) {
  const yr  = document.getElementById('cmp-year-' + side).value;
  const sel = document.getElementById('cmp-month-' + side);
  sel.innerHTML = '';
  const labels = HIST[yr].labels;
  for (let i = labels.length - 1; i >= 0; i--) {
    const opt = document.createElement('option');
    opt.value       = i;
    opt.textContent = labels[i] + ' ' + yr;
    sel.appendChild(opt);
  }
}

// ── Analytics: run comparison ────────────────
function runComparison() {
  const yearA  = document.getElementById('cmp-year-a').value;
  const monthA = parseInt(document.getElementById('cmp-month-a').value);
  const yearB  = document.getElementById('cmp-year-b').value;
  const monthB = parseInt(document.getElementById('cmp-month-b').value);

  const revA   = HIST[yearA].revenue[monthA];
  const revB   = HIST[yearB].revenue[monthB];
  const labelA = HIST[yearA].labels[monthA] + ' ' + yearA;
  const labelB = HIST[yearB].labels[monthB] + ' ' + yearB;

  const catsA = CAT_PCT.map(p => Math.round(revA * p));
  const catsB = CAT_PCT.map(p => Math.round(revB * p));

  kill('an-compare');
  CHARTS['an-compare'] = new Chart(document.getElementById('an-compare'), {
    type: 'bar',
    data: {
      labels: CAT_NAMES,
      datasets: [
        { label: labelA, data: catsA, backgroundColor: CHART_COLORS.pale,  borderRadius:5, borderSkipped:false },
        { label: labelB, data: catsB, backgroundColor: CHART_COLORS.black, borderRadius:5, borderSkipped:false },
      ]
    },
    options: {
      ...BASE_OPTS,
      plugins: { legend: { display:true, labels:{ font:{size:10}, boxWidth:10 } } },
      scales: {
        y: { grid:{color:'#F3F4F6'}, ticks:{callback:pesoK, font:{size:10}}, border:{display:false} },
        x: { grid:{display:false}, ticks:{font:{size:10}} }
      }
    }
  });

  renderInsights(labelA, revA, catsA, labelB, revB, catsB);
}

// ── Analytics: generate insights ─────────────
function renderInsights(labelA, revA, catsA, labelB, revB, catsB) {
  const pctChange = ((revB - revA) / revA * 100).toFixed(1);
  const grew      = revB >= revA;
  const arrow     = grew ? '↑' : '↓';
  const color     = grew ? 'text-emerald-600' : 'text-red-500';

  // Biggest category gain and drop
  let gainIdx = 0, dropIdx = 0;
  CAT_NAMES.forEach((_, i) => {
    if ((catsB[i] - catsA[i]) > (catsB[gainIdx] - catsA[gainIdx])) gainIdx = i;
    if ((catsB[i] - catsA[i]) < (catsB[dropIdx] - catsA[dropIdx])) dropIdx = i;
  });

  const gainDiff = catsB[gainIdx] - catsA[gainIdx];
  const dropDiff = catsB[dropIdx] - catsA[dropIdx];

  const items = [];
  items.push(`<span class="${color} font-semibold">${arrow} ${Math.abs(pctChange)}% ${grew ? 'growth' : 'decline'}</span> — Revenue moved from ₱${revA.toLocaleString()} (${labelA}) to ₱${revB.toLocaleString()} (${labelB}).`);

  if (gainDiff > 0)
    items.push(`<strong>${CAT_NAMES[gainIdx]}</strong> was the strongest category in ${labelB}, gaining +₱${gainDiff.toLocaleString()} vs ${labelA}.`);

  if (dropDiff < 0)
    items.push(`<strong>${CAT_NAMES[dropIdx]}</strong> had the biggest decline (−₱${Math.abs(dropDiff).toLocaleString()}). Consider a targeted discount or bundle to recover this segment.`);

  if (!grew) {
    items.push(`<span class="font-semibold text-gray-700">Action:</span> Follow up with clients who ordered in ${labelA} but not in ${labelB}. A quick check-in call often re-activates orders.`);
    items.push(`<span class="font-semibold text-gray-700">Action:</span> Review ${CAT_NAMES[dropIdx]} pricing — competitors may be offering better rates. A short-term promo or volume deal could win back volume.`);
  } else {
    items.push(`<span class="font-semibold text-gray-700">Keep momentum:</span> ${labelB} is performing well. Push your Hot leads to close before month-end to protect next month's numbers.`);
    items.push(`<span class="font-semibold text-gray-700">Stock alert:</span> ${CAT_NAMES[gainIdx]} is growing fast — confirm reorder levels are high enough to avoid stockouts.`);
  }

  const html = items.map(t =>
    `<div class="flex gap-2.5 items-start"><div class="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 flex-shrink-0"></div><p class="text-sm text-gray-600 leading-relaxed">${t}</p></div>`
  ).join('');

  document.getElementById('an-insights-content').innerHTML = html;
}

// ════════════════════════════════════════════
//  NAVIGATION
// ════════════════════════════════════════════

const PAGE_MAP = {
  'overview':   { title:'Overview',            init: initOverview   },
  'sales':      { title:'Sales',               init: initSales      },
  'inventory':  { title:'Inventory',           init: initInventory  },
  'hr':         { title:'Human Resources',     init: () => { initHR(); loadHREmployees(); } },
  'analytics':  { title:'Analytics',           init: initAnalytics  },
  'leads':      { title:'Leads Generation',    init: loadLeads      },
  'crm':        { title:'CRM',                 init: loadCRMContacts},
  'settings':   { title:'Settings',            init: ()=>{}         },
  'assistant':  { title:'AI Assistant',        init: ()=>{}         },
};

function showPage(name, el) {
  // Permission check — block if current user doesn't have access
  if (currentUser && !currentUser.pages.includes(name)) {
    showToast('You do not have access to this page.');
    return;
  }
  // hide all pages
  document.querySelectorAll('[id^="page-"]').forEach(p => p.classList.add('hidden'));
  // show target
  const target = document.getElementById('page-' + name);
  if (target) { target.classList.remove('hidden'); target.style.animation='none'; target.offsetHeight; target.style.animation=''; }
  // update title
  if (PAGE_MAP[name]) document.getElementById('pageTitle').textContent = PAGE_MAP[name].title;
  // update nav active state
  document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
  if (el) el.classList.add('active');
  // log navigation
  if (currentUser) logActivity('navigate', 'Opened ' + (PAGE_MAP[name] ? PAGE_MAP[name].title : name));
  // update float quick chips based on current page
  updateFloatChips(name);
  // init page
  if (name === 'settings') { renderAccountsTable(); switchSettingsTab('accounts'); return; }
  if (name === 'assistant') { initAssistantPage(); return; }
  // init charts after a tick (so canvas is visible and sized)
  if (PAGE_MAP[name]) setTimeout(() => PAGE_MAP[name].init(), 60);
}

// ════════════════════════════════════════════
//  ACCOUNTS & PERMISSIONS SYSTEM
// ════════════════════════════════════════════

const ALL_PAGES = [
  { id:'overview',   label:'Overview',         icon:'fa-th-large' },
  { id:'sales',      label:'Sales',             icon:'fa-chart-line' },
  { id:'inventory',  label:'Inventory',         icon:'fa-boxes' },
  { id:'hr',         label:'Human Resources',   icon:'fa-users' },
  { id:'leads',      label:'Leads',             icon:'fa-funnel-dollar' },
  { id:'crm',        label:'CRM',               icon:'fa-handshake' },
  { id:'analytics',  label:'Analytics',         icon:'fa-chart-bar' },
  { id:'settings',   label:'Settings',          icon:'fa-cog' },
];

const ROLE_DEFAULTS = {
  admin:     ['overview','sales','inventory','hr','leads','crm','analytics','assistant','settings'],
  manager:   ['overview','sales','inventory','hr','leads','crm','analytics','assistant'],
  assistant: ['overview','crm','leads'],
};

const DEFAULT_ACCOUNTS = [
  { id:'1', username:'admin', password:'hiraya2024', role:'admin', displayName:'Administrator',
    pages: ROLE_DEFAULTS.admin }
];

const ACCOUNTS_KEY      = 'hiraya_accounts';
const WHITELABEL_KEY    = 'hiraya_whitelabel';
const LOGIN_HISTORY_KEY = 'hiraya_login_history';
const ACTIVITY_LOG_KEY  = 'hiraya_activity_log';
const MAX_LOGIN_HIST    = 200;
const MAX_ACTIVITY_LOG  = 500;

let currentUser = null;

function getAccounts() {
  try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)) || DEFAULT_ACCOUNTS; }
  catch(e) { return DEFAULT_ACCOUNTS; }
}
function saveAccounts(arr) { localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(arr)); }

function getWhiteLabelConfig() {
  const defaults = { companyName:'HIRAYA', subtitle:'Construction Supply', logoUrl:'logo.png', sidebarColor:'#111111', hideHint:false };
  try { return Object.assign({}, defaults, JSON.parse(localStorage.getItem(WHITELABEL_KEY)) || {}); }
  catch(e) { return defaults; }
}
function saveWhiteLabelConfig(cfg) { localStorage.setItem(WHITELABEL_KEY, JSON.stringify(cfg)); }

function applyPermissions(account) {
  ALL_PAGES.forEach(p => {
    const el = document.getElementById('nav-' + p.id);
    if (!el) return;
    el.classList.toggle('hidden', !account.pages.includes(p.id));
  });
  // Show/hide admin nav label
  const adminLabel = document.getElementById('nav-label-admin');
  if (adminLabel) adminLabel.classList.toggle('hidden', !account.pages.includes('settings'));
  // Update sidebar user info
  const nameEl = document.getElementById('sidebarUserName');
  if (nameEl) nameEl.textContent = account.displayName;
  const roleEl = document.getElementById('sidebarUserRole');
  if (roleEl) roleEl.textContent = account.role.charAt(0).toUpperCase() + account.role.slice(1);
}

function applyWhiteLabel(cfg) {
  // Sidebar
  const bn = document.getElementById('sidebarBrandName');
  if (bn) bn.textContent = cfg.companyName;
  const bs = document.getElementById('sidebarBrandSubtitle');
  if (bs) bs.textContent = cfg.subtitle;
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.style.background = cfg.sidebarColor;
  const logoEl = document.getElementById('sidebarLogo');
  if (logoEl && cfg.logoUrl) logoEl.src = cfg.logoUrl;
  // Login page
  const ln = document.getElementById('loginBrandName');
  if (ln) ln.textContent = cfg.companyName;
  const ls = document.getElementById('loginBrandSubtitle');
  if (ls) ls.textContent = cfg.subtitle;
  const hint = document.getElementById('loginHint');
  if (hint) hint.classList.toggle('hidden', !!cfg.hideHint);
  // Browser tab
  document.title = cfg.companyName + ' — Dashboard';
}

function handleLogin() {
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPass').value;
  const accounts = getAccounts();
  const account  = accounts.find(a => a.username === u && a.password === p);
  if (account) {
    currentUser = account;
    logLogin(account);
    document.getElementById('loginPage').style.display = 'none';
    const app = document.getElementById('dashboardApp');
    app.style.display = 'block';
    app.classList.remove('hidden');
    document.getElementById('floatAI').style.display = 'block';
    applyPermissions(account);
    applyWhiteLabel(getWhiteLabelConfig());
    updateClock();
    // Navigate to first allowed page
    const firstPage = account.pages[0] || 'overview';
    const firstNav  = document.getElementById('nav-' + firstPage);
    showPage(firstPage, firstNav);
    setTimeout(initOverview, 80);
    startInboxPolling();
    setTimeout(updateFloatAlertBadge, 300);
  } else {
    document.getElementById('loginError').classList.remove('hidden');
  }
}

function handleLogout() {
  logActivity('logout', 'Logged out');
  currentUser = null;
  stopInboxPolling();
  document.getElementById('dashboardApp').style.display = 'none';
  document.getElementById('floatAI').style.display = 'none';
  document.getElementById('floatChatPanel').style.display = 'none';
  document.getElementById('loginPage').style.display = 'flex';
  document.getElementById('loginPass').value = '';
  document.getElementById('loginError').classList.add('hidden');
  // Re-apply white label to login page
  applyWhiteLabel(getWhiteLabelConfig());
}

// ════════════════════════════════════════════
//  LOGIN HISTORY & ACTIVITY LOG
// ════════════════════════════════════════════

function getLoginHistory() {
  try { return JSON.parse(localStorage.getItem(LOGIN_HISTORY_KEY) || '[]'); }
  catch(e) { return []; }
}
function getActivityLog() {
  try { return JSON.parse(localStorage.getItem(ACTIVITY_LOG_KEY) || '[]'); }
  catch(e) { return []; }
}

function logLogin(account) {
  const hist = getLoginHistory();
  hist.unshift({
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    username: account.username,
    displayName: account.displayName,
    role: account.role
  });
  if (hist.length > MAX_LOGIN_HIST) hist.length = MAX_LOGIN_HIST;
  localStorage.setItem(LOGIN_HISTORY_KEY, JSON.stringify(hist));
}

function logActivity(actionType, detail) {
  if (!currentUser) return;
  const log = getActivityLog();
  log.unshift({
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    username: currentUser.username,
    displayName: currentUser.displayName,
    actionType,
    detail
  });
  if (log.length > MAX_ACTIVITY_LOG) log.length = MAX_ACTIVITY_LOG;
  localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(log));
}

function fmtLogTime(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-PH', { month:'short', day:'numeric', year:'numeric' }) + ' ' +
         d.toLocaleTimeString('en-PH', { hour:'2-digit', minute:'2-digit', hour12:true });
}

const ACTIVITY_ICONS = {
  login:    { icon:'fa-sign-in-alt',   cls:'act-type-login'    },
  logout:   { icon:'fa-sign-out-alt',  cls:'act-type-logout'   },
  navigate: { icon:'fa-compass',       cls:'act-type-navigate' },
  hr:       { icon:'fa-users',         cls:'act-type-hr'       },
  sales:    { icon:'fa-chart-line',    cls:'act-type-sales'    },
  leads:    { icon:'fa-funnel-dollar', cls:'act-type-leads'    },
  crm:      { icon:'fa-handshake',     cls:'act-type-crm'      },
  settings: { icon:'fa-cog',           cls:'act-type-settings' },
};

function renderLoginHistory() {
  const tbody = document.getElementById('loginHistoryBody');
  if (!tbody) return;
  const hist = getLoginHistory();
  if (hist.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-center text-gray-400 text-xs py-8">No login records yet.</td></tr>';
    return;
  }
  const roleColor = { admin:'role-badge-admin', manager:'role-badge-manager', assistant:'role-badge-assistant' };
  tbody.innerHTML = hist.map(h => `
    <tr>
      <td class="text-xs text-gray-500 font-mono">${fmtLogTime(h.timestamp)}</td>
      <td class="font-semibold text-sm text-gray-900">${escHtml(h.displayName)}</td>
      <td><span class="font-mono text-xs text-gray-600">@${escHtml(h.username)}</span></td>
      <td><span class="badge ${roleColor[h.role] || 'role-badge-admin'}">${h.role}</span></td>
    </tr>`).join('');
}

function renderActivityLog() {
  const tbody = document.getElementById('activityLogBody');
  if (!tbody) return;
  const log = getActivityLog();
  if (log.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-center text-gray-400 text-xs py-8">No activity recorded yet.</td></tr>';
    return;
  }
  tbody.innerHTML = log.map(e => {
    const ai = ACTIVITY_ICONS[e.actionType] || ACTIVITY_ICONS.navigate;
    return `<tr>
      <td class="text-xs text-gray-500 font-mono">${fmtLogTime(e.timestamp)}</td>
      <td><span class="font-semibold text-sm text-gray-900">${escHtml(e.displayName)}</span> <span class="text-xs text-gray-400">@${escHtml(e.username)}</span></td>
      <td><i class="fas ${ai.icon} ${ai.cls} mr-1.5"></i><span class="text-xs font-semibold capitalize ${ai.cls}">${e.actionType}</span></td>
      <td class="text-xs text-gray-500">${escHtml(e.detail)}</td>
    </tr>`;
  }).join('');
}

function clearLoginHistory() {
  if (!confirm('Clear all login history? This cannot be undone.')) return;
  localStorage.removeItem(LOGIN_HISTORY_KEY);
  renderLoginHistory();
  showToast('Login history cleared.');
}

function clearActivityLog() {
  if (!confirm('Clear all activity log? This cannot be undone.')) return;
  localStorage.removeItem(ACTIVITY_LOG_KEY);
  renderActivityLog();
  showToast('Activity log cleared.');
}

// ════════════════════════════════════════════
//  SETTINGS PAGE — ACCOUNTS TAB
// ════════════════════════════════════════════

function switchSettingsTab(tab) {
  ['accounts','whitelabel','loginhistory','activity'].forEach(t => {
    document.getElementById('stab-' + t).classList.toggle('active', t === tab);
    document.getElementById('spanel-' + t).classList.toggle('hidden', t !== tab);
  });
  if (tab === 'accounts')     renderAccountsTable();
  if (tab === 'whitelabel')   loadWLForm();
  if (tab === 'loginhistory') renderLoginHistory();
  if (tab === 'activity')     renderActivityLog();
  loadApiKeyStatus();
}

function renderAccountsTable() {
  const accounts = getAccounts();
  const tbody = document.getElementById('accountsTableBody');
  if (!tbody) return;
  tbody.innerHTML = accounts.map(a => {
    const pageChips = a.pages.filter(p => p !== 'settings').map(p => {
      const pg = ALL_PAGES.find(x => x.id === p);
      return `<span class="perm-chip on">${pg ? pg.label : p}</span>`;
    }).join(' ');
    const isCurrentUser = currentUser && a.id === currentUser.id;
    return `<tr class="acct-row-${a.role}">
      <td>
        <div class="font-semibold text-gray-900 text-sm">${escHtml(a.displayName)}</div>
        ${isCurrentUser ? '<span class="text-xs text-green-600 font-semibold">(You)</span>' : ''}
      </td>
      <td><span class="font-mono text-sm text-gray-600">${escHtml(a.username)}</span></td>
      <td><span class="badge role-badge-${a.role} capitalize">${a.role}</span></td>
      <td><div class="flex flex-wrap gap-1">${pageChips}</div></td>
      <td>
        <div class="flex gap-2">
          <button onclick="openAccountModal('${a.id}')" class="text-xs text-gray-500 hover:text-gray-900 font-medium px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <i class="fas fa-pen mr-1"></i> Edit
          </button>
          ${!isCurrentUser ? `<button onclick="deleteAccount('${a.id}')" class="text-xs text-red-400 hover:text-red-600 font-medium px-3 py-1 border border-red-100 rounded-lg hover:bg-red-50 transition">
            <i class="fas fa-trash mr-1"></i> Delete
          </button>` : ''}
        </div>
      </td>
    </tr>`;
  }).join('');
}

function openAccountModal(id) {
  const modal = document.getElementById('accountModal');
  modal.classList.remove('hidden');
  // Render permission checkboxes
  const permsDiv = document.getElementById('permCheckboxes');
  permsDiv.innerHTML = ALL_PAGES.map(p => `
    <label class="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 border border-gray-100">
      <input type="checkbox" class="perm-check w-4 h-4" value="${p.id}" id="perm-${p.id}">
      <span class="text-xs text-gray-700 font-medium">${p.label}</span>
    </label>`).join('');

  if (id) {
    // Edit mode
    const account = getAccounts().find(a => a.id === id);
    if (!account) return;
    document.getElementById('accountModalTitle').textContent = 'Edit Account';
    document.getElementById('acct-id').value           = account.id;
    document.getElementById('acct-displayname').value  = account.displayName;
    document.getElementById('acct-username').value     = account.username;
    document.getElementById('acct-password').value     = account.password;
    document.getElementById('acct-role').value         = account.role;
    ALL_PAGES.forEach(p => {
      const cb = document.getElementById('perm-' + p.id);
      if (cb) cb.checked = account.pages.includes(p.id);
    });
  } else {
    // Add mode
    document.getElementById('accountModalTitle').textContent = 'Add Account';
    document.getElementById('acct-id').value           = '';
    document.getElementById('acct-displayname').value  = '';
    document.getElementById('acct-username').value     = '';
    document.getElementById('acct-password').value     = '';
    document.getElementById('acct-role').value         = 'manager';
    applyRoleDefaults();
  }
}

function closeAccountModal() {
  document.getElementById('accountModal').classList.add('hidden');
}

function applyRoleDefaults() {
  const role   = document.getElementById('acct-role').value;
  const perms  = ROLE_DEFAULTS[role] || [];
  ALL_PAGES.forEach(p => {
    const cb = document.getElementById('perm-' + p.id);
    if (cb) cb.checked = perms.includes(p.id);
  });
}

function saveAccount() {
  const id          = document.getElementById('acct-id').value.trim();
  const displayName = document.getElementById('acct-displayname').value.trim();
  const username    = document.getElementById('acct-username').value.trim().toLowerCase();
  const password    = document.getElementById('acct-password').value;
  const role        = document.getElementById('acct-role').value;
  const pages       = Array.from(document.querySelectorAll('.perm-check:checked')).map(c => c.value);

  if (!displayName || !username || !password) { showToast('Please fill in all required fields.'); return; }

  const accounts = getAccounts();
  // Check duplicate username
  const dupCheck = accounts.find(a => a.username === username && a.id !== id);
  if (dupCheck) { showToast('Username already exists.'); return; }

  if (id) {
    const idx = accounts.findIndex(a => a.id === id);
    if (idx >= 0) accounts[idx] = { ...accounts[idx], displayName, username, password, role, pages };
  } else {
    accounts.push({ id: Date.now().toString(), displayName, username, password, role, pages });
  }
  saveAccounts(accounts);
  logActivity('settings', (id ? 'Updated' : 'Created') + ' account: @' + username + ' (' + role + ')');
  closeAccountModal();
  renderAccountsTable();
  showToast('Account saved.');
}

function deleteAccount(id) {
  if (!confirm('Delete this account? This cannot be undone.')) return;
  const delAcct = getAccounts().find(a => a.id === id);
  const accounts = getAccounts().filter(a => a.id !== id);
  saveAccounts(accounts);
  logActivity('settings', 'Deleted account: @' + (delAcct ? delAcct.username : id));
  renderAccountsTable();
  showToast('Account deleted.');
}

// ════════════════════════════════════════════
//  SETTINGS PAGE — WHITE LABEL TAB
// ════════════════════════════════════════════

function loadWLForm() {
  const cfg = getWhiteLabelConfig();
  document.getElementById('wl-name').value     = cfg.companyName;
  document.getElementById('wl-subtitle').value = cfg.subtitle;
  document.getElementById('wl-logo').value     = cfg.logoUrl || '';
  document.getElementById('wl-color').value    = cfg.sidebarColor || '#111111';
  document.getElementById('wl-color-hex').value= cfg.sidebarColor || '#111111';
  document.getElementById('wl-hidehint').checked = !!cfg.hideHint;
  updateWLPreview();
}

function syncColorPicker() {
  const hex = document.getElementById('wl-color-hex').value.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
    document.getElementById('wl-color').value = hex;
    updateWLPreview();
  }
}

function updateWLPreview() {
  const name    = document.getElementById('wl-name').value || 'HIRAYA';
  const sub     = document.getElementById('wl-subtitle').value || 'Company';
  const logo    = document.getElementById('wl-logo').value;
  const color   = document.getElementById('wl-color').value || '#111111';
  document.getElementById('wl-color-hex').value = color;
  document.getElementById('wlPreviewName').textContent     = name;
  document.getElementById('wlPreviewSubtitle').textContent = sub;
  document.getElementById('wlPreview').style.background    = color;
  document.getElementById('wlPreviewLoginName').textContent= name;
  document.getElementById('wlPreviewLoginSub').textContent = sub;
  if (logo) document.getElementById('wlPreviewLogo').src   = logo;
}

function saveWhiteLabel() {
  const cfg = {
    companyName:  document.getElementById('wl-name').value.trim() || 'HIRAYA',
    subtitle:     document.getElementById('wl-subtitle').value.trim() || 'Construction Supply',
    logoUrl:      document.getElementById('wl-logo').value.trim() || 'logo.png',
    sidebarColor: document.getElementById('wl-color').value || '#111111',
    hideHint:     document.getElementById('wl-hidehint').checked,
  };
  saveWhiteLabelConfig(cfg);
  applyWhiteLabel(cfg);
  logActivity('settings', 'Updated white label brand settings');
  showToast('Brand settings saved and applied.');
}

function resetWhiteLabel() {
  localStorage.removeItem(WHITELABEL_KEY);
  loadWLForm();
  applyWhiteLabel(getWhiteLabelConfig());
  showToast('Brand settings reset to defaults.');
}

// Apply white label on page load (before login)
(function() { applyWhiteLabel(getWhiteLabelConfig()); })();

// ════════════════════════════════════════════
//  UTILITIES
// ════════════════════════════════════════════

function updateClock() {
  const now = new Date();
  document.getElementById('currentDate').textContent =
    now.toLocaleDateString('en-PH', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  document.getElementById('lastUpdated').textContent =
    now.toLocaleTimeString('en-PH', { hour:'2-digit', minute:'2-digit' });
}

function triggerRefresh() {
  const icon = document.getElementById('refreshIcon');
  icon.classList.add('fa-spin');
  setTimeout(() => { icon.classList.remove('fa-spin'); updateClock(); }, 900);
}

// ════════════════════════════════════════════
//  HR TAB SWITCHER
// ════════════════════════════════════════════
function switchHRTab(tab, el) {
  document.getElementById('hr-overview').classList.toggle('hidden', tab !== 'overview');
  document.getElementById('hr-contacts').classList.toggle('hidden', tab !== 'contacts');
  document.querySelectorAll('.hr-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

function openAddEmployee() { document.getElementById('empModal').classList.remove('hidden'); }
function closeAddEmployee() {
  document.getElementById('empModal').classList.add('hidden');
  document.getElementById('empForm').reset();
}
function saveEmployee() {
  const name     = document.getElementById('emp-name').value.trim();
  const position = document.getElementById('emp-position').value.trim();
  const salary   = document.getElementById('emp-salary').value.trim();
  if (!name || !position || !salary) { showToast('Please fill in Name, Position, and Salary.'); return; }

  const status   = document.getElementById('emp-status').value;
  const leave    = document.getElementById('emp-leave').value || '0';
  const mobile   = document.getElementById('emp-mobile').value.trim();
  const email    = document.getElementById('emp-email').value.trim();
  const ecName   = document.getElementById('emp-ec-name').value.trim();
  const ecRel    = document.getElementById('emp-ec-rel').value.trim();
  const ecMobile = document.getElementById('emp-ec-mobile').value.trim();

  // initials for avatar
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const badgeMap = { 'Present':'badge-present', 'On Leave':'badge-leave', 'Absent':'badge-absent' };
  const badgeClass = badgeMap[status] || 'badge-present';
  const salaryFmt = '₱' + Number(salary).toLocaleString();

  // 1. Add row to Employee Directory (Overview tab)
  const empRow = document.createElement('tr');
  empRow.innerHTML = `<td><div class="flex items-center gap-3"><div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">${initials}</div><span class="font-medium text-gray-900">${name}</span></div></td><td class="text-gray-400">${position}</td><td><span class="badge ${badgeClass}">${status}</span></td><td class="text-gray-600">${leave} days</td><td class="font-semibold">${salaryFmt}</td>`;
  document.getElementById('hr-emp-tbody').appendChild(empRow);

  // 2. Add row to Contact Directory (Contacts tab)
  if (mobile || email) {
    const contRow = document.createElement('tr');
    contRow.innerHTML = `<td><div class="flex items-center gap-3"><div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">${initials}</div><span class="font-medium text-gray-900">${name}</span></div></td><td class="text-gray-400">${position}</td><td class="font-mono text-xs text-gray-700">${mobile || '—'}</td><td class="text-xs text-blue-600">${email || '—'}</td>`;
    document.getElementById('hr-contact-tbody').appendChild(contRow);
  }

  // 3. Add row to Emergency Contacts (Contacts tab)
  if (ecName) {
    const ecRow = document.createElement('tr');
    ecRow.innerHTML = `<td class="font-medium text-gray-900">${name}</td><td>${ecName}</td><td class="text-gray-400">${ecRel || '—'}</td><td class="font-mono text-xs">${ecMobile || '—'}</td>`;
    document.getElementById('hr-emergency-tbody').appendChild(ecRow);
  }

  // Persist to localStorage
  const empRecord = {
    _key: Date.now() + '_' + Math.random().toString(36).slice(2,6),
    name, position, salary, status, leave, mobile, email,
    ecName, ecRel, ecMobile
  };
  const emps = getHREmployees();
  emps.push(empRecord);
  _saveHREmployees(emps);

  // Data saved to localStorage above — no backend sync in demo mode

  closeAddEmployee();
  logActivity('hr', 'Added employee: ' + name + ' (' + position + ')');
  showToast(name + ' added to HR directory.');
}

// ── HR localStorage ───────────────────────
const HR_EMPLOYEES_KEY = 'hiraya_hr_employees';

function getHREmployees() {
  try { return JSON.parse(localStorage.getItem(HR_EMPLOYEES_KEY) || '[]'); }
  catch(e) { return []; }
}

function _saveHREmployees(arr) {
  localStorage.setItem(HR_EMPLOYEES_KEY, JSON.stringify(arr));
}

function loadHREmployees() {
  const empTbody   = document.getElementById('hr-emp-tbody');
  const contTbody  = document.getElementById('hr-contact-tbody');
  const ecTbody    = document.getElementById('hr-emergency-tbody');
  if (!empTbody) return;

  // Remove previously loaded rows
  empTbody.querySelectorAll('tr[data-emp-key]').forEach(r => r.remove());
  contTbody && contTbody.querySelectorAll('tr[data-emp-key]').forEach(r => r.remove());
  ecTbody  && ecTbody.querySelectorAll('tr[data-emp-key]').forEach(r => r.remove());

  getHREmployees().forEach(e => {
    const initials   = e.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
    const badgeMap   = {'Present':'badge-present','On Leave':'badge-leave','Absent':'badge-absent'};
    const badgeClass = badgeMap[e.status] || 'badge-present';
    const salaryFmt  = '₱' + Number(e.salary).toLocaleString();

    const empRow = document.createElement('tr');
    empRow.dataset.empKey = e._key;
    empRow.innerHTML = `<td><div class="flex items-center gap-3"><div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">${initials}</div><span class="font-medium text-gray-900">${escHtml(e.name)}</span></div></td><td class="text-gray-400">${escHtml(e.position)}</td><td><span class="badge ${badgeClass}">${e.status}</span></td><td class="text-gray-600">${e.leave||'0'} days</td><td class="font-semibold">${salaryFmt}</td>`;
    empTbody.appendChild(empRow);

    if (contTbody && (e.mobile || e.email)) {
      const contRow = document.createElement('tr');
      contRow.dataset.empKey = e._key;
      contRow.innerHTML = `<td><div class="flex items-center gap-3"><div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">${initials}</div><span class="font-medium text-gray-900">${escHtml(e.name)}</span></div></td><td class="text-gray-400">${escHtml(e.position)}</td><td class="font-mono text-xs text-gray-700">${escHtml(e.mobile||'—')}</td><td class="text-xs text-blue-600">${escHtml(e.email||'—')}</td>`;
      contTbody.appendChild(contRow);
    }

    if (ecTbody && e.ecName) {
      const ecRow = document.createElement('tr');
      ecRow.dataset.empKey = e._key;
      ecRow.innerHTML = `<td class="font-medium text-gray-900">${escHtml(e.name)}</td><td>${escHtml(e.ecName)}</td><td class="text-gray-400">${escHtml(e.ecRel||'—')}</td><td class="font-mono text-xs">${escHtml(e.ecMobile||'—')}</td>`;
      ecTbody.appendChild(ecRow);
    }
  });
}

// ════════════════════════════════════════════
//  NOTIFICATION PANEL
// ════════════════════════════════════════════
function toggleNotif() {
  const panel = document.getElementById('notifPanel');
  panel.classList.toggle('hidden');
}
// Close notification panel when clicking outside
document.addEventListener('click', e => {
  const panel = document.getElementById('notifPanel');
  if (panel && !panel.classList.contains('hidden')) {
    if (!e.target.closest('#notifPanel') && !e.target.closest('[onclick="toggleNotif()"]')) {
      panel.classList.add('hidden');
    }
  }
});

// ════════════════════════════════════════════
//  FLOATING AI CHAT BUBBLE
// ════════════════════════════════════════════
// ════════════════════════════════════════════
//  API KEY MANAGEMENT
// ════════════════════════════════════════════

function saveApiKey() {
  const key = document.getElementById('aiApiKeyInput').value.trim();
  const status = document.getElementById('aiKeyStatus');
  if (!key) { status.innerHTML = '<span style="color:#dc2626;">Please enter an API key.</span>'; return; }
  status.innerHTML = '<span style="color:#6b7280;"><i class="fas fa-circle-notch fa-spin mr-1"></i>Verifying key…</span>';
  // Ping Claude with a minimal request to verify the key is valid
  fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 5, messages: [{ role:'user', content:'Hi' }] })
  })
  .then(r => {
    if (r.ok || r.status === 200) {
      localStorage.setItem('hiraya_claude_api_key', key);
      if (window.chatEngine) window.chatEngine.history = [];
      status.innerHTML = '<span style="color:#16a34a;"><i class="fas fa-check-circle mr-1"></i>Connected — API key verified.</span>';
      document.getElementById('aiApiKeyInput').value = '';
    } else if (r.status === 401) {
      status.innerHTML = '<span style="color:#dc2626;"><i class="fas fa-times-circle mr-1"></i>Invalid key — authentication failed.</span>';
    } else {
      status.innerHTML = `<span style="color:#dc2626;"><i class="fas fa-times-circle mr-1"></i>Error ${r.status} — check key and try again.</span>`;
    }
  })
  .catch(() => {
    status.innerHTML = '<span style="color:#f59e0b;"><i class="fas fa-exclamation-circle mr-1"></i>Could not verify — saved anyway. Check your connection.</span>';
    localStorage.setItem('hiraya_claude_api_key', key);
    document.getElementById('aiApiKeyInput').value = '';
  });
}

function loadApiKeyStatus() {
  const key = localStorage.getItem('hiraya_claude_api_key');
  const status = document.getElementById('aiKeyStatus');
  if (!status) return;
  if (key) {
    status.innerHTML = '<span style="color:#16a34a;"><i class="fas fa-circle mr-1" style="font-size:8px;"></i>Connected — API key is set.</span>';
  } else {
    status.innerHTML = '<span style="color:#f59e0b;"><i class="fas fa-exclamation-circle mr-1"></i>No API key. Enter your key above to enable AI.</span>';
  }
}

// ════════════════════════════════════════════
//  PAGE-AWARE FLOAT CHIPS
// ════════════════════════════════════════════

const FLOAT_CHIPS = {
  sales:     [['Sales trend', 'What is the sales trend for March 2026?'], ['Top customers', 'Who are my top 3 customers this month?'], ['Unpaid invoices', 'Which customers have unpaid invoices and how much do they owe?']],
  inventory: [['Low stock', 'Which items are low in stock and need reordering?'], ['Reorder list', 'Give me a full reorder list for this week.'], ['Category breakdown', 'Show me sales by category.']],
  hr:        [['Who\'s present?', 'How many employees are present today and who is absent?'], ['Payroll summary', 'What is the total monthly payroll?'], ['Leave requests', 'Who is on leave right now?']],
  leads:     [['Hot leads', 'List all hot leads with their estimated value.'], ['Follow-up needed', 'Which leads have not been followed up recently?'], ['Pipeline value', 'What is the total value of my active pipeline?']],
  crm:       [['Pipeline health', 'Give me a health check on our CRM pipeline.'], ['New contacts', 'Who are the most recently added CRM contacts?'], ['Follow-up needed', 'Which CRM contacts need a follow-up this week?']],
  _default:  [['Daily briefing', 'Give me a complete daily briefing.'], ['Financial summary', 'What is our financial status this month?'], ['Quick report', 'Generate an executive summary report.']]
};

function updateFloatChips(page) {
  const container = document.getElementById('floatQuickChips');
  if (!container) return;
  const chips = FLOAT_CHIPS[page] || FLOAT_CHIPS._default;
  container.innerHTML = chips.map(([label, msg]) =>
    `<button onclick="quickChat(${JSON.stringify(msg)})" style="background:white;color:#374151;border:1px solid #e5e7eb;cursor:pointer;padding:4px 10px;border-radius:20px;font-size:11px;white-space:nowrap;">${escHtml(label)}</button>`
  ).join('');
}

// ════════════════════════════════════════════
//  FULL-PAGE ASSISTANT
// ════════════════════════════════════════════

function initAssistantPage() {
  // Show proactive welcome if first time
  const msgsEl = document.getElementById('assistantMessages');
  if (!msgsEl) return;
  if (msgsEl.dataset.initialized) return;
  msgsEl.dataset.initialized = 'true';

  const alerts = (typeof window.chatEngine !== 'undefined') ? window.chatEngine.getProactiveAlerts() : [];
  const welcomeHtml = `
    <div style="max-width:600px;">
      <p style="font-weight:700;font-size:14px;margin-bottom:8px;">Good day! Here's your business snapshot:</p>
      ${alerts.map(a => `<p style="padding:4px 0;font-size:13px;">• ${a}</p>`).join('')}
      <p style="margin-top:10px;color:#6b7280;font-size:12px;">Ask me anything about your business — sales, inventory, HR, leads, or financials.</p>
    </div>`;
  msgsEl.innerHTML = `<div style="display:flex;gap:8px;"><div style="width:28px;height:28px;background:#1f2937;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;"><i class="fas fa-robot" style="font-size:10px;color:white;"></i></div><div style="background:white;color:#374151;border-radius:12px 12px 12px 4px;padding:12px 16px;max-width:85%;font-size:13px;line-height:1.6;box-shadow:0 1px 4px rgba(0,0,0,0.08);">${welcomeHtml}</div></div>`;
}

function toggleFloatChat() {
  const panel = document.getElementById('floatChatPanel');
  const icon = document.getElementById('floatAIIcon');
  const isOpen = panel.style.display === 'flex';
  panel.style.display = isOpen ? 'none' : 'flex';
  panel.style.flexDirection = 'column';
  icon.className = isOpen ? 'fas fa-robot' : 'fas fa-times';
  if (!isOpen) {
    // Hide alert badge when chat is opened
    const badge = document.getElementById('floatAlertBadge');
    if (badge) badge.style.display = 'none';
    setTimeout(() => document.getElementById('floatInput')?.focus(), 50);
  }
}

// ════════════════════════════════════════════
//  AI CHAT
// ════════════════════════════════════════════

// Conversation history for multi-turn context (kept in memory per session)
let _chatHistory = [];

function appendMsg(html, isUser) {
  const msgs = document.getElementById('floatMessages');
  const avatarUser = `<div style="width:24px;height:24px;background:#e5e7eb;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;"><i class="fas fa-user text-gray-500" style="font-size:9px;"></i></div>`;
  const avatarAI   = `<div style="width:24px;height:24px;background:#1f2937;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;"><i class="fas fa-robot text-white" style="font-size:9px;"></i></div>`;
  const bubble = isUser
    ? `<div style="display:flex;gap:6px;flex-direction:row-reverse;">${avatarUser}<div style="background:#1f2937;color:white;border-radius:12px 12px 4px 12px;padding:8px 12px;max-width:82%;font-size:12px;line-height:1.5;">${html}</div></div>`
    : `<div style="display:flex;gap:6px;">${avatarAI}<div style="background:white;color:#374151;border-radius:12px 12px 12px 4px;padding:8px 12px;max-width:82%;font-size:12px;line-height:1.5;box-shadow:0 1px 3px rgba(0,0,0,0.06);">${html}</div></div>`;
  msgs.insertAdjacentHTML('beforeend', bubble);
  msgs.scrollTop = msgs.scrollHeight;
}

function sendChat(targetInputId, targetMsgsId) {
  const inputEl = document.getElementById(targetInputId || 'floatInput');
  const msgsEl  = document.getElementById(targetMsgsId  || 'floatMessages');
  const msg = inputEl.value.trim();
  if (!msg || window.chatEngine.isStreaming) return;
  inputEl.value = '';
  inputEl.disabled = true;

  const now = new Date().toLocaleTimeString('en-PH', { hour:'numeric', minute:'2-digit', hour12:true });
  const avatarUser = `<div style="width:24px;height:24px;background:#e5e7eb;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;"><i class="fas fa-user" style="font-size:9px;color:#6b7280;"></i></div>`;
  const avatarAI   = `<div style="width:24px;height:24px;background:#1f2937;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;"><i class="fas fa-robot" style="font-size:9px;color:white;"></i></div>`;
  msgsEl.insertAdjacentHTML('beforeend', `<div style="display:flex;gap:6px;flex-direction:row-reverse;align-items:flex-end;"><div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px;max-width:82%;"><div style="background:#1f2937;color:white;border-radius:12px 12px 4px 12px;padding:8px 12px;font-size:12px;line-height:1.5;">${escHtml(msg)}</div><span class="chat-ts">${now}</span></div>${avatarUser}</div>`);
  msgsEl.scrollTop = msgsEl.scrollHeight;

  const bubbleId = 'ai-bubble-' + Date.now();
  msgsEl.insertAdjacentHTML('beforeend', `<div id="${bubbleId}" style="display:flex;gap:6px;align-items:flex-end;">${avatarAI}<div style="display:flex;flex-direction:column;gap:2px;max-width:82%;"><div class="ai-msg-bubble" style="background:white;color:#374151;border-radius:12px 12px 12px 4px;padding:8px 12px;font-size:12px;line-height:1.6;box-shadow:0 1px 3px rgba(0,0,0,0.06);"><i class="fas fa-circle-notch fa-spin" style="font-size:11px;color:#9ca3af;margin-right:4px;"></i><span style="color:#9ca3af">Thinking…</span></div><span class="chat-ts">${now}</span></div></div>`);
  msgsEl.scrollTop = msgsEl.scrollHeight;

  const bubbleEl = document.querySelector('#' + bubbleId + ' .ai-msg-bubble');
  let fullText = '';

  window.chatEngine.send(msg,
    // onChunk — stream text
    (chunk) => {
      if (fullText === '') bubbleEl.innerHTML = '';
      fullText += chunk;
      bubbleEl.innerHTML = formatAIText(fullText) + '<span class="typing-cursor">▍</span>';
      msgsEl.scrollTop = msgsEl.scrollHeight;
    },
    // onToolCall — show animated indicator
    (label) => {
      bubbleEl.innerHTML = `<span class="ai-tool-indicator"><span class="ai-tool-dots"><span></span><span></span><span></span></span><span>${escHtml(label)}</span></span>`;
      msgsEl.scrollTop = msgsEl.scrollHeight;
    },
    // onDone
    () => {
      bubbleEl.innerHTML = formatAIText(fullText);
      // Add copy button below bubble
      const copyBtn = document.createElement('button');
      copyBtn.className = 'chat-copy-btn';
      copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(fullText).then(() => {
          copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied';
          setTimeout(() => { copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy'; }, 2000);
        });
      };
      bubbleEl.parentElement.appendChild(copyBtn);
      // Add follow-up suggestion chips
      const chips = getSuggestedFollowUps(fullText, msg);
      const chipsEl = document.createElement('div');
      chipsEl.className = 'ai-followup-chips';
      chips.forEach(chip => {
        const btn = document.createElement('button');
        btn.className = 'ai-followup-chip';
        btn.textContent = chip;
        btn.onclick = () => {
          const iId = targetInputId || 'floatInput';
          const mId = targetMsgsId  || 'floatMessages';
          document.getElementById(iId).value = chip;
          sendChat(iId, mId);
        };
        chipsEl.appendChild(btn);
      });
      msgsEl.appendChild(chipsEl);
      msgsEl.scrollTop = msgsEl.scrollHeight;
      inputEl.disabled = false;
      inputEl.focus();
    },
    // onError
    (errMsg) => {
      bubbleEl.innerHTML = `<span style="color:#dc2626;">⚠️ ${escHtml(errMsg)}</span>`;
      msgsEl.scrollTop = msgsEl.scrollHeight;
      inputEl.disabled = false;
      inputEl.focus();
    }
  );
}

function formatAIText(raw) {
  // Section icon map
  const ICONS = {
    'sales': '💰', 'revenue': '💰', 'financial': '💳', 'invoice': '🧾',
    'inventory': '📦', 'stock': '📦', 'reorder': '🔄',
    'hr': '👥', 'employee': '👥', 'staff': '👥', 'attendance': '🗓️',
    'lead': '🎯', 'pipeline': '🎯', 'crm': '🤝', 'contact': '🤝',
    'communication': '📬', 'email': '📧', 'sms': '💬', 'inquiry': '🌐',
    "what's next": '⚡', 'next': '⚡', 'action': '⚡', 'recommendation': '⚡',
    'alert': '🚨', 'warning': '🚨', 'summary': '📊', 'overview': '📊',
    'briefing': '📋', 'report': '📋'
  };

  function sectionIcon(title) {
    const t = title.toLowerCase();
    for (const [k, v] of Object.entries(ICONS)) { if (t.includes(k)) return v; }
    return '▸';
  }

  // Escape HTML first
  let esc = raw.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  // Process line by line
  const lines = esc.split('\n');
  let html = '';
  let inStatGroup = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      if (inStatGroup) { html += '</div>'; inStatGroup = false; }
      continue;
    }

    // ## Section header
    if (/^#{1,3}\s+/.test(line)) {
      if (inStatGroup) { html += '</div>'; inStatGroup = false; }
      const title = line.replace(/^#{1,3}\s+/, '');
      const icon  = sectionIcon(title);
      html += `<div class="ai-section-header"><span class="ai-section-icon">${icon}</span><span>${title}</span></div>`;
      continue;
    }

    // STAT: label | value
    if (/^STAT:/i.test(line)) {
      const parts = line.replace(/^STAT:\s*/i,'').split('|');
      const label = (parts[0]||'').trim();
      const value = (parts[1]||'').trim();
      if (!inStatGroup) { html += '<div class="ai-stat-row">'; inStatGroup = true; }
      html += `<div class="ai-stat-chip"><span class="ai-stat-label">${label}</span><span class="ai-stat-value">${value}</span></div>`;
      continue;
    }

    // Close stat group before non-stat lines
    if (inStatGroup) { html += '</div>'; inStatGroup = false; }

    // ALERT: warning
    if (/^ALERT:/i.test(line)) {
      const msg = line.replace(/^ALERT:\s*/i,'');
      html += `<div class="ai-alert"><span class="ai-alert-icon">⚠️</span><span>${msg.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')}</span></div>`;
      continue;
    }

    // ACTION: recommendation
    if (/^ACTION:/i.test(line)) {
      const msg = line.replace(/^ACTION:\s*/i,'');
      html += `<div class="ai-action"><span class="ai-action-num">→</span><span>${msg.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')}</span></div>`;
      continue;
    }

    // DONE: confirmation
    if (/^DONE:/i.test(line)) {
      const msg = line.replace(/^DONE:\s*/i,'');
      html += `<div class="ai-done"><span>✓</span><span>${msg.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')}</span></div>`;
      continue;
    }

    // Bullet point
    if (/^[-•]\s+/.test(line)) {
      const content = line.replace(/^[-•]\s+/,'').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');
      html += `<div class="ai-bullet"><span class="ai-bullet-dot">•</span><span>${content}</span></div>`;
      continue;
    }

    // Regular paragraph line
    html += `<p class="ai-para">${line.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')}</p>`;
  }

  if (inStatGroup) html += '</div>';
  return html;
}

function quickChat(msg, inputId, msgsId) {
  // Works for both float panel and full-page assistant
  const iId = inputId || 'floatInput';
  const mId = msgsId  || 'floatMessages';
  if (!inputId && document.getElementById('floatChatPanel').style.display !== 'flex') toggleFloatChat();
  document.getElementById(iId).value = msg;
  sendChat(iId, mId);
}

function clearChat(msgsId) {
  window.chatEngine.clear();
  const msgs = document.getElementById(msgsId || 'floatMessages');
  if (msgs) while (msgs.children.length > 1) msgs.removeChild(msgs.lastChild);
  // Also clear full assistant if open
  const asstMsgs = document.getElementById('assistantMessages');
  if (asstMsgs && (!msgsId || msgsId === 'assistantMessages'))
    while (asstMsgs.children.length > 1) asstMsgs.removeChild(asstMsgs.lastChild);
}

// ── Follow-up chip suggestions ───────────────
function getSuggestedFollowUps(text, userMsg) {
  const t = (text + ' ' + userMsg).toLowerCase();
  if (t.includes('sales') || t.includes('revenue') || t.includes('order'))
    return ["Which customers haven't paid yet?", 'Who are my top 3 customers?', 'Sales vs target this month'];
  if (t.includes('inventory') || t.includes('stock') || t.includes('reorder') || t.includes('cement') || t.includes('steel'))
    return ['What should I reorder this week?', 'Full inventory list', 'Which items will run out first?'];
  if (t.includes('hr') || t.includes('employee') || t.includes('staff') || t.includes('leave') || t.includes('payroll') || t.includes('absent') || t.includes('present'))
    return ["What's the total payroll this month?", 'Who is on leave today?', 'Attendance summary'];
  if (t.includes('lead') || t.includes('pipeline') || t.includes('prospect'))
    return ['Which leads need follow-up today?', 'Leads not contacted in 7 days', 'Add a new lead'];
  if (t.includes('crm') || t.includes('contact') || t.includes('client') || t.includes('partner'))
    return ['Which clients need a follow-up?', 'Show unpaid invoices by client', 'Recent interactions'];
  if (t.includes('email') || t.includes('sms') || t.includes('inbox') || t.includes('message') || t.includes('inquiry'))
    return ['What needs a response today?', 'New inquiries this week', 'Simulate a new message'];
  return ['Drill into sales details', 'Check low stock items', 'Show hot leads'];
}

// ── Alert badge on float bubble ──────────────
function updateFloatAlertBadge() {
  const badge = document.getElementById('floatAlertBadge');
  if (!badge) return;
  let count = 0;
  if (typeof PRODUCTS !== 'undefined') PRODUCTS.forEach(p => { if ((p.stock || 0) <= 20) count++; });
  const orders = typeof ORDERS_DATA !== 'undefined' ? ORDERS_DATA : [];
  orders.forEach(o => { if ((o.payment || '').toLowerCase() === 'unpaid') count++; });
  if (count > 0) { badge.textContent = count; badge.style.display = 'flex'; }
  else { badge.style.display = 'none'; }
}



// ── Sales sub-tab switcher ───────────────────
function switchSalesTab(tab, el) {
  ['overview','orders','quotation','reports'].forEach(t =>
    document.getElementById('sl-panel-' + t).classList.toggle('hidden', t !== tab)
  );
  document.querySelectorAll('.sl-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  if (tab === 'overview') setTimeout(() => { kill('sl-revenue'); kill('sl-top'); initSales(); }, 60);
}

// ── Sales target tracker ─────────────────────
function updateTarget() {
  const target  = parseFloat(document.getElementById('sl-target-input').value) || 0;
  const current = 587420;
  if (target <= 0) return;
  const pct       = Math.min(100, (current / target * 100)).toFixed(1);
  const remaining = target - current;
  document.getElementById('sl-target-bar').style.width       = pct + '%';
  document.getElementById('sl-target-pct').textContent       = pct + '%';
  document.getElementById('sl-target-max').textContent       = '₱' + target.toLocaleString();
  document.getElementById('sl-target-remaining').textContent =
    remaining > 0 ? '₱' + remaining.toLocaleString() + ' remaining to goal' : 'Target achieved!';
}

// ── New Order modal ──────────────────────────
function openAddOrder()  { document.getElementById('orderModal').classList.remove('hidden'); document.getElementById('ord-customer').focus(); }
function closeAddOrder() { document.getElementById('orderModal').classList.add('hidden'); document.getElementById('orderForm').reset(); }
function saveOrder() {
  const customer = document.getElementById('ord-customer').value.trim();
  const products = document.getElementById('ord-products').value.trim();
  const amount   = parseFloat(document.getElementById('ord-amount').value) || 0;
  const payment  = document.getElementById('ord-payment').value;
  const delivery = document.getElementById('ord-delivery').value;
  if (!customer || !products) { showToast('Please fill in Customer and Products.'); return; }
  const today  = new Date().toLocaleDateString('en-PH', { month:'short', day:'numeric' });
  const nextId = '#ORD-' + (1044 + document.getElementById('sl-orders-tbody').rows.length);
  const pBadge = { 'Paid':'badge-paid','Pending':'badge-pending','Unpaid':'badge-unpaid' }[payment] || '';
  const dBadge = { 'Delivered':'badge-delivered','In Transit':'badge-transit','Pending':'badge-pending' }[delivery] || '';
  const row = document.createElement('tr');
  row.innerHTML = `
    <td class="font-mono text-gray-500">${nextId}</td>
    <td class="text-gray-400">${today}</td>
    <td class="font-medium text-gray-900">${customer}</td>
    <td class="text-gray-500">${products}</td>
    <td class="font-semibold">₱${amount.toLocaleString()}</td>
    <td><span class="badge ${pBadge}">${payment}</span></td>
    <td><span class="badge ${dBadge}">${delivery}</span></td>
    <td><button onclick="deleteOrderRow(this)" class="text-gray-300 hover:text-red-400 text-xs transition"><i class="fas fa-trash"></i></button></td>`;
  document.getElementById('sl-orders-tbody').appendChild(row);
  logActivity('sales', 'Created order for: ' + customer + ' (' + nextId + ')');
  closeAddOrder();
}
function deleteOrderRow(btn) {
  showConfirm('Remove this order?', 'The order will be removed from the list.', () => {
    btn.closest('tr').remove();
    showToast('Order removed.');
  });
}

// ── Quotation builder ────────────────────────
function addQtLine() {
  const opts = PRODUCTS.map(p =>
    `<option value="${p.price}" data-unit="${p.unit}">${p.name}</option>`
  ).join('');
  const row = document.createElement('tr');
  row.innerHTML = `
    <td class="py-1 pr-2">
      <select class="qt-prod w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none" onchange="onQtProdChange(this)">
        <option value="">Select product…</option>${opts}
      </select>
    </td>
    <td class="py-1 px-2 text-center"><span class="qt-unit text-xs text-gray-400">—</span></td>
    <td class="py-1 px-2"><input type="number" class="qt-qty w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-center focus:outline-none" value="1" min="1" oninput="recalcQt()"></td>
    <td class="py-1 px-2"><input type="number" class="qt-price w-24 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-right focus:outline-none" value="0" oninput="recalcQt()"></td>
    <td class="py-1 pl-2 text-right font-semibold text-sm qt-line-total">₱0</td>
    <td class="py-1 pl-2"><button onclick="this.closest('tr').remove();recalcQt()" class="text-gray-300 hover:text-red-400 text-xs transition">✕</button></td>`;
  document.getElementById('qt-items').appendChild(row);
}
function onQtProdChange(sel) {
  const tr    = sel.closest('tr');
  const price = parseFloat(sel.value) || 0;
  const unit  = sel.options[sel.selectedIndex]?.dataset.unit || '—';
  tr.querySelector('.qt-unit').textContent = unit;
  tr.querySelector('.qt-price').value      = price;
  recalcQt();
}
function recalcQt() {
  let sub = 0;
  document.querySelectorAll('#qt-items tr').forEach(r => {
    const line = (parseFloat(r.querySelector('.qt-qty').value)||0) * (parseFloat(r.querySelector('.qt-price').value)||0);
    r.querySelector('.qt-line-total').textContent = '₱' + line.toLocaleString();
    sub += line;
  });
  const vat = sub * 0.12;
  document.getElementById('qt-subtotal').textContent = '₱' + sub.toLocaleString();
  document.getElementById('qt-vat').textContent      = '₱' + Math.round(vat).toLocaleString();
  document.getElementById('qt-total').textContent    = '₱' + Math.round(sub + vat).toLocaleString();
}
function clearQuotation() {
  document.getElementById('qt-items').innerHTML = '';
  ['qt-client','qt-notes'].forEach(id => document.getElementById(id).value = '');
  ['qt-subtotal','qt-vat','qt-total'].forEach(id => document.getElementById(id).textContent = '₱0');
  addQtLine();
}

// ── Reports: preview + CSV download ─────────
function previewReport() {
  const from = document.getElementById('rpt-from').value;
  const to   = document.getElementById('rpt-to').value;
  const data = ORDERS_DATA.filter(o => (!from || o.date >= from) && (!to || o.date <= to));
  const paidTotal   = data.filter(o => o.payment === 'Paid').reduce((s,o) => s+o.amount, 0);
  const unpaidTotal = data.filter(o => o.payment !== 'Paid').reduce((s,o) => s+o.amount, 0);
  document.getElementById('rpt-count').textContent  = data.length + ' orders';
  document.getElementById('rpt-total').textContent  = '₱' + data.reduce((s,o) => s+o.amount, 0).toLocaleString();
  document.getElementById('rpt-paid').textContent   = '₱' + paidTotal.toLocaleString();
  document.getElementById('rpt-unpaid').textContent = '₱' + unpaidTotal.toLocaleString();
  document.getElementById('rpt-summary').classList.remove('hidden');
  const pc = { 'Paid':'badge-paid','Pending':'badge-pending','Unpaid':'badge-unpaid' };
  document.getElementById('rpt-preview-tbody').innerHTML = data.map(o => `
    <tr>
      <td class="font-mono text-gray-500">${o.id}</td>
      <td class="text-gray-400">${o.date}</td>
      <td class="font-medium text-gray-900">${o.customer}</td>
      <td class="text-gray-500">${o.products}</td>
      <td class="font-semibold">₱${o.amount.toLocaleString()}</td>
      <td><span class="badge ${pc[o.payment]||''}">${o.payment}</span></td>
      <td class="text-gray-500">${o.delivery}</td>
    </tr>`).join('');
  document.getElementById('rpt-preview-wrap').classList.remove('hidden');
}

function downloadCSV() {
  const from = document.getElementById('rpt-from').value;
  const to   = document.getElementById('rpt-to').value;
  const data = ORDERS_DATA.filter(o => (!from || o.date >= from) && (!to || o.date <= to));
  if (!data.length) { showToast('No orders found for the selected date range.'); return; }
  const headers = ['Order ID','Date','Customer','Products','Amount (PHP)','Payment','Delivery'];
  const rows    = data.map(o => [o.id, o.date, `"${o.customer}"`, `"${o.products}"`, o.amount, o.payment, o.delivery]);
  const csv     = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob    = new Blob([csv], { type:'text/csv;charset=utf-8;' });
  const url     = URL.createObjectURL(blob);
  const a       = document.createElement('a');
  a.href        = url;
  a.download    = 'hiraya_sales_' + (from || 'all') + '_to_' + (to || 'all') + '.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// ════════════════════════════════════════════
//  LEADS — ADD / DELETE
// ════════════════════════════════════════════

function openAddLead() {
  document.getElementById('leadModal').classList.remove('hidden');
  document.getElementById('lead-company').focus();
}

function closeAddLead() {
  document.getElementById('leadModal').classList.add('hidden');
  document.getElementById('leadForm').reset();
}

// ── Leads localStorage ───────────────────────
const LEADS_KEY = 'hiraya_leads';

function getLeads() {
  try { return JSON.parse(localStorage.getItem(LEADS_KEY) || '[]'); }
  catch(e) { return []; }
}

function _saveLeads(arr) {
  localStorage.setItem(LEADS_KEY, JSON.stringify(arr));
}

const LEAD_BADGE_MAP = {
  'Hot':'badge-hot','Warm':'badge-warm','Cold':'badge-cold',
  'Quoted':'badge-quoted','Prospect':'badge-prospect','Won ✓':'badge-won','Lost ✗':'badge-lost'
};

function buildLeadRow(l) {
  const displayValue = l.value ? '₱' + Number(l.value).toLocaleString() : '—';
  const badge = `<span class="badge ${LEAD_BADGE_MAP[l.status] || 'badge-prospect'}">${escHtml(l.status)}</span>`;
  const tr = document.createElement('tr');
  tr.dataset.leadKey = l._key;
  tr.innerHTML = `
    <td class="font-medium text-gray-900">${escHtml(l.company)}</td>
    <td class="text-gray-400">${escHtml(l.type)}</td>
    <td>${escHtml(l.person)}</td>
    <td class="font-mono text-xs">${escHtml(l.mobile)}</td>
    <td class="font-semibold">${displayValue}</td>
    <td>${badge}</td>
    <td class="text-gray-400">${l.date}</td>
    <td class="text-gray-600">${escHtml(l.assigned || '—')}</td>
    <td><button onclick="deleteLeadRow(this)" class="text-gray-300 hover:text-red-400 transition text-xs"><i class="fas fa-trash"></i></button></td>`;
  return tr;
}

function loadLeads() {
  const tbody = document.getElementById('leads-tbody');
  tbody.querySelectorAll('tr[data-lead-key]').forEach(r => r.remove());
  getLeads().forEach(l => tbody.appendChild(buildLeadRow(l)));
}

function saveLead() {
  const company  = document.getElementById('lead-company').value.trim();
  const type     = document.getElementById('lead-type').value;
  const person   = document.getElementById('lead-person').value.trim();
  const mobile   = document.getElementById('lead-mobile').value.trim();
  const value    = document.getElementById('lead-value').value.trim();
  const status   = document.getElementById('lead-status').value;
  const assigned = document.getElementById('lead-assigned').value.trim();

  if (!company || !person || !mobile) {
    showToast('Please fill in Company, Contact Person, and Mobile.');
    return;
  }

  const lead = {
    _key: Date.now() + '_' + Math.random().toString(36).slice(2,6),
    company, type, person, mobile, value, status, assigned,
    date: new Date().toLocaleDateString('en-PH', { month:'short', day:'numeric' })
  };

  const leads = getLeads();
  leads.unshift(lead);
  _saveLeads(leads);

  document.getElementById('leads-tbody').insertBefore(buildLeadRow(lead),
    document.getElementById('leads-tbody').firstChild);

  // Data saved to localStorage above — no backend sync in demo mode

  logActivity('leads', 'Added lead: ' + company + ' (' + person + ')');
  closeAddLead();
  showToast(company + ' added to Leads.');
}

function deleteLeadRow(btn) {
  showConfirm('Remove this lead?', 'The lead will be removed from the pipeline.', () => {
    const tr  = btn.closest('tr');
    const key = tr.dataset.leadKey;
    if (key) {
      const updated = getLeads().filter(l => l._key !== key);
      _saveLeads(updated);
    }
    tr.remove();
    logActivity('leads', 'Deleted lead');
    showToast('Lead removed.');
  });
}

// ════════════════════════════════════════════
//  CRM — CONTACT STORAGE (localStorage)
// ════════════════════════════════════════════

const CRM_CONTACTS_KEY = 'hiraya_crm_contacts';

function getCRMContacts() {
  try { return JSON.parse(localStorage.getItem(CRM_CONTACTS_KEY) || '[]'); }
  catch(e) { return []; }
}

function _saveCRMContacts(arr) {
  localStorage.setItem(CRM_CONTACTS_KEY, JSON.stringify(arr));
}

function buildCRMRow(c) {
  const isPartner = c.type === 'Partner';
  const badge = isPartner
    ? `<span class="badge badge-quoted" style="background:#f0fdf4;color:#166534;">Partner</span>`
    : `<span class="badge badge-ok">Client</span>`;
  const emailHtml = c.email ? `<p class="text-xs text-blue-500">${escHtml(c.email)}</p>` : '';
  const emailBtn  = c.email
    ? `<button onclick="openEmailModal('${escHtml(c.email)}','${escHtml(c.person)}','')" class="text-gray-400 hover:text-blue-600 transition text-xs" title="Send Email"><i class="fas fa-envelope"></i></button>`
    : '';
  const tr = document.createElement('tr');
  tr.dataset.contactKey = c._key;
  tr.innerHTML = `
    <td class="font-medium text-gray-900">${escHtml(c.company)}</td>
    <td><p class="font-medium text-gray-900">${escHtml(c.person)}</p>${emailHtml}</td>
    <td>${badge}</td>
    <td class="font-mono text-xs">${escHtml(c.phone)}</td>
    <td class="text-gray-400">—</td>
    <td class="font-semibold">₱0</td>
    <td class="flex gap-2 items-center">
      <button onclick="openMessage('${escHtml(c.company)}','${escHtml(c.person)}','','${escHtml(c.email||'')}')" class="text-gray-400 hover:text-gray-900 transition text-xs" title="Message Thread"><i class="fas fa-comments"></i></button>
      ${emailBtn}
      <button onclick="deleteCRMRow(this)" class="text-gray-300 hover:text-red-400 transition text-xs" title="Delete"><i class="fas fa-trash"></i></button>
    </td>`;
  return tr;
}

function loadCRMContacts() {
  const tbody = document.getElementById('crm-tbody');
  tbody.querySelectorAll('tr[data-contact-key]').forEach(r => r.remove());
  getCRMContacts().forEach(c => tbody.appendChild(buildCRMRow(c)));
}

// ════════════════════════════════════════════
//  CRM — ADD / DELETE CONTACT
// ════════════════════════════════════════════

function openAddContact() {
  document.getElementById('crmModal').classList.remove('hidden');
  document.getElementById('crm-company').focus();
}

function closeAddContact() {
  document.getElementById('crmModal').classList.add('hidden');
  document.getElementById('crmContactForm').reset();
}

function saveContact() {
  const company = document.getElementById('crm-company').value.trim();
  const person  = document.getElementById('crm-person').value.trim();
  const type    = document.getElementById('crm-type').value;
  const phone   = document.getElementById('crm-phone').value.trim();
  const email   = document.getElementById('crm-email').value.trim();

  if (!company || !person || !phone) {
    showToast('Please fill in Company, Contact Person, and Phone.');
    return;
  }

  const contact = {
    _key:    Date.now() + '_' + Math.random().toString(36).slice(2,6),
    company, person, type, phone, email
  };

  // Persist to localStorage
  const contacts = getCRMContacts();
  contacts.push(contact);
  _saveCRMContacts(contacts);

  // Render row
  document.getElementById('crm-tbody').appendChild(buildCRMRow(contact));

  // Data saved to localStorage above — no backend sync in demo mode

  logActivity('crm', 'Added CRM contact: ' + person + ' (' + company + ')');
  closeAddContact();
  showToast(person + ' added to CRM.');
}

function deleteCRMRow(btn) {
  showConfirm('Remove this contact?', 'The contact will be removed from the directory.', () => {
    const tr  = btn.closest('tr');
    const key = tr.dataset.contactKey;
    if (key) {
      const updated = getCRMContacts().filter(c => c._key !== key);
      _saveCRMContacts(updated);
    }
    tr.remove();
    logActivity('crm', 'Deleted CRM contact');
    showToast('Contact removed.');
  });
}

// ════════════════════════════════════════════
//  CRM — MESSAGE THREAD
// ════════════════════════════════════════════

const N8N_WEBHOOK = CONFIG.webhookUrl;

// State for current open thread
let _msgContact = { id: '', name: '', company: '' };

function openMessage(company, person, contactId, email) {
  _msgContact = {
    id:      contactId || person.replace(/\s+/g, '_'),
    name:    person,
    company: company,
    email:   email || ''
  };

  // Set header
  const initials = person.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  document.getElementById('msgAvatar').textContent     = initials;
  document.getElementById('msgModalTitle').textContent = person;
  document.getElementById('msgRecipient').textContent  = company;
  document.getElementById('msgBody').value             = '';
  document.getElementById('logReceivedBanner').classList.add('hidden');
  document.getElementById('msgReceivedText').value     = '';

  // Clear thread and show loading
  const thread = document.getElementById('crmThread');
  thread.innerHTML = '<div class="flex items-center justify-center h-full text-gray-400 text-xs"><i class="fas fa-spinner fa-spin mr-2"></i>Loading messages…</div>';

  document.getElementById('msgModal').classList.remove('hidden');
  document.getElementById('msgBody').focus();

  // Load messages from n8n
  loadCRMMessages();
}

function closeMessage() {
  document.getElementById('msgModal').classList.add('hidden');
  _msgContact = { id: '', name: '', company: '', email: '' };
}

// ════════════════════════════════════════════
//  CRM — DIRECT EMAIL
// ════════════════════════════════════════════

function openEmailModal(email, name, contactId) {
  document.getElementById('emailTo').value         = email || '';
  document.getElementById('emailToName').textContent  = name || email;
  document.getElementById('emailToDisplay').textContent = email || '';
  document.getElementById('emailSubject').value = '';
  document.getElementById('emailBody').value    = '';
  document.getElementById('emailContactId').value = contactId || name.replace(/\s+/g, '_');
  document.getElementById('emailStatusMsg').textContent = '';
  document.getElementById('emailModal').classList.remove('hidden');
  document.getElementById('emailSubject').focus();
}

function closeEmailModal() {
  document.getElementById('emailModal').classList.add('hidden');
}

async function sendDirectEmail() {
  const toEmail   = document.getElementById('emailTo').value.trim();
  const toName    = document.getElementById('emailToName').textContent;
  const subject   = document.getElementById('emailSubject').value.trim();
  const body      = document.getElementById('emailBody').value.trim();
  const contactId = document.getElementById('emailContactId').value;
  const statusEl  = document.getElementById('emailStatusMsg');
  const sendBtn   = document.getElementById('emailSendBtn');

  if (!toEmail) { statusEl.textContent = 'No email address for this contact.'; return; }
  if (!subject) { statusEl.textContent = 'Please enter a subject.'; return; }
  if (!body)    { statusEl.textContent = 'Please write a message.'; return; }

  sendBtn.disabled = true;
  sendBtn.textContent = 'Sending…';
  statusEl.textContent = '';

  // Demo mode: simulate email sent (real Outlook integration available in Pro plan)
  await new Promise(r => setTimeout(r, 800));
  statusEl.style.color = '#16a34a';
  statusEl.textContent = 'Email sent! (Demo mode — connect Outlook in Pro plan)';
  setTimeout(closeEmailModal, 1800);
  sendBtn.disabled = false;
  sendBtn.textContent = 'Send Email';
}

async function loadCRMMessages() {
  const thread = document.getElementById('crmThread');
  thread.innerHTML = `
    <div id="crmThreadEmpty" class="flex flex-col items-center justify-center h-full text-center text-gray-400">
      <i class="fas fa-comments text-3xl mb-2 opacity-30"></i>
      <p class="text-xs">No messages yet.<br>Start the conversation below.</p>
    </div>`;
}

function appendMsgBubble(direction, text, timestamp, channel, scroll = true) {
  const thread = document.getElementById('crmThread');

  // Remove empty-state placeholder if present
  const empty = document.getElementById('crmThreadEmpty');
  if (empty) empty.remove();

  const isSent = direction === 'Sent';
  const time   = timestamp ? new Date(timestamp).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }) : '';
  const ch     = channel || '';
  const chIcon = { 'SMS':'fa-sms', 'Viber':'fa-comment-dots', 'Email':'fa-envelope',
                   'WhatsApp':'fa-whatsapp', 'In-App':'fa-comment' }[ch] || 'fa-comment';

  const wrapper = document.createElement('div');
  wrapper.className = `flex ${isSent ? 'justify-end' : 'justify-start'}`;
  wrapper.innerHTML = `
    <div class="max-w-xs">
      <div class="${isSent ? 'msg-sent' : 'msg-received'} px-4 py-2.5 text-sm">${escHtml(text)}</div>
      <p class="text-gray-400 text-xs mt-1 ${isSent ? 'text-right' : 'text-left'}">
        ${isSent ? '<span class="text-gray-500">You</span> · ' : `<span class="text-gray-500">${escHtml(_msgContact.name)}</span> · `}
        ${time}${ch ? ` · <i class="fas ${chIcon}"></i> ${ch}` : ''}
      </p>
    </div>`;
  thread.appendChild(wrapper);
  if (scroll) thread.scrollTop = thread.scrollHeight;
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

async function sendCRMMessage() {
  const body = document.getElementById('msgBody').value.trim();
  if (!body) return;
  const channel = document.getElementById('msgChannel').value;
  const now     = new Date().toISOString();

  // Optimistically show in thread
  appendMsgBubble('Sent', body, now, channel);
  document.getElementById('msgBody').value = '';

  showToast('Message logged. (Demo mode)');
}

async function logReceivedMsg() {
  const body = document.getElementById('msgReceivedText').value.trim();
  if (!body) return;
  const channel = document.getElementById('msgChannel').value;
  const now     = new Date().toISOString();

  appendMsgBubble('Received', body, now, channel);
  document.getElementById('msgReceivedText').value = '';
  document.getElementById('logReceivedBanner').classList.add('hidden');

  showToast('Received message logged. (Demo mode)');
}

function showToast(text) {
  const t = document.getElementById('toast');
  t.textContent = text;
  t.classList.remove('hidden', 'opacity-0');
  t.classList.add('opacity-100');
  setTimeout(() => {
    t.classList.remove('opacity-100');
    t.classList.add('opacity-0');
    setTimeout(() => t.classList.add('hidden'), 400);
  }, 3000);
}

// ════════════════════════════════════════════
//  DARK MODE
// ════════════════════════════════════════════

function toggleDarkMode() {
  const isDark = document.body.classList.toggle('dm');
  const icon = document.getElementById('dmIcon');
  icon.className = isDark ? 'fas fa-sun text-yellow-400 text-sm' : 'fas fa-moon text-gray-500 text-sm';
  localStorage.setItem('hiraya_dark', isDark ? '1' : '0');
}

function initDarkMode() {
  if (localStorage.getItem('hiraya_dark') === '1') {
    document.body.classList.add('dm');
    const icon = document.getElementById('dmIcon');
    if (icon) icon.className = 'fas fa-sun text-yellow-400 text-sm';
  }
}

// ════════════════════════════════════════════
//  CRM TAB SWITCHER
// ════════════════════════════════════════════

function switchCRMTab(tab, el) {
  ['contacts','inbox','sent','drafts','tickets'].forEach(t => {
    document.getElementById('crm-panel-' + t).classList.toggle('hidden', t !== tab);
  });
  document.querySelectorAll('.crm-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');

  // Lazy load on first switch
  if (tab === 'inbox')   loadCRMInbox();
  if (tab === 'sent')    loadCRMSent();
  if (tab === 'drafts')  renderDrafts();
  if (tab === 'tickets') renderTickets();
}

// ════════════════════════════════════════════
//  CRM INBOX
// ════════════════════════════════════════════

async function loadCRMInbox() {
  const list = document.getElementById('crm-inbox-list');
  // Demo mode: load from comms.js mock data
  const msgs = [
    ...MOCK_EMAILS.map(e => ({ contactName: e.name, company: e.from.split('@')[1]?.split('.')[0] || '', message: e.subject, timestamp: e.date, channel: 'Email', read: e.read, contactId: e.id, email: e.from })),
    ...MOCK_SMS.map(s => ({ contactName: s.name, company: '', message: s.message.slice(0, 60) + '…', timestamp: s.date, channel: 'SMS', read: s.read, contactId: s.id, email: '' }))
  ].sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  const unread = msgs.filter(m => !m.read).length;
  updateInboxBadge(unread);
  list.innerHTML = msgs.map(m => `
    <div class="msg-card ${m.read ? '' : 'unread'}" onclick="openMessage('${escHtml(m.company||m.contactName||'Unknown')}','${escHtml(m.contactName||'')}','${escHtml(m.contactId||'')}','${escHtml(m.email||'')}')">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
            ${(m.contactName||'?').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-900">${escHtml(m.contactName||'Unknown')}</p>
            <p class="text-xs text-gray-400">${m.channel === 'Email' ? escHtml(m.email||'') : escHtml(m.company||'')}</p>
            <p class="text-xs text-gray-600 mt-1">${escHtml(m.message||'')}</p>
          </div>
        </div>
        <div class="text-right flex-shrink-0">
          <p class="text-xs text-gray-400">${m.timestamp ? new Date(m.timestamp).toLocaleDateString('en-PH',{month:'short',day:'numeric'}) : ''}</p>
          <span class="text-xs text-gray-400"><i class="fas ${m.channel==='SMS'?'fa-sms':'fa-envelope'} mr-0.5"></i>${escHtml(m.channel)}</span>
        </div>
      </div>
    </div>`).join('');
}

function updateInboxBadge(count) {
  const badge = document.getElementById('crm-inbox-badge');
  if (badge) {
    if (count > 0) { badge.textContent = count; badge.classList.remove('hidden'); }
    else           { badge.classList.add('hidden'); }
  }
  // Notification bell dot
  const dot = document.querySelector('.notif-dot');
  if (dot) dot.style.display = count > 0 ? 'block' : 'none';
  // Bell unread count text
  const unreadEl = document.querySelector('#notifPanel .text-xs.text-gray-400');
  if (unreadEl && unreadEl.textContent.includes('unread')) {
    unreadEl.textContent = count > 0 ? count + ' unread' : '0 unread';
  }
}

// ════════════════════════════════════════════
//  REAL-TIME INBOX POLLING
// ════════════════════════════════════════════

let _inboxPollTimer   = null;
let _lastInboxCount   = -1;   // -1 = not yet initialized

function startInboxPolling() {
  if (_inboxPollTimer) return;
  _pollInboxOnce();                                     // immediate check on login
  _inboxPollTimer = setInterval(_pollInboxOnce, 30000); // every 30 s
}

function stopInboxPolling() {
  if (_inboxPollTimer) { clearInterval(_inboxPollTimer); _inboxPollTimer = null; }
  _lastInboxCount = -1;
}

async function _pollInboxOnce() {
  // Demo mode: count unread from mock comms data
  const count = (typeof MOCK_EMAILS !== 'undefined' ? MOCK_EMAILS.filter(e => !e.read).length : 0)
              + (typeof MOCK_SMS    !== 'undefined' ? MOCK_SMS.filter(s => !s.read).length : 0);
  _lastInboxCount = count;
  updateInboxBadge(count);
}

function _addBellNotification(m) {
  const container = document.querySelector('#notifPanel .py-2.max-h-72');
  if (!container) return;
  const div = document.createElement('div');
  div.className = 'px-5 py-3 hover:bg-gray-50 cursor-pointer border-l-4 border-blue-500';
  div.onclick = () => {
    document.getElementById('notifPanel').classList.add('hidden');
    showPage('crm', document.getElementById('nav-crm'));
    setTimeout(() => {
      const inboxBtn = document.querySelector('.crm-tab:nth-child(2)');
      if (inboxBtn) switchCRMTab('inbox', inboxBtn);
    }, 150);
  };
  const time = m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) : 'Just now';
  div.innerHTML = `
    <p class="text-xs font-semibold text-gray-900">📬 New message — ${escHtml(m.contactName || 'Client')}</p>
    <p class="text-xs text-gray-400 mt-0.5">${escHtml((m.message||'').slice(0,55))}${(m.message||'').length>55?'…':''}</p>
    <p class="text-xs text-gray-300 mt-0.5">${time}</p>`;
  container.insertBefore(div, container.firstChild);
}

// ════════════════════════════════════════════
//  CRM SENT
// ════════════════════════════════════════════

async function loadCRMSent() {
  const list = document.getElementById('crm-sent-list');
  list.innerHTML = '<div class="flex flex-col items-center justify-center h-32 text-gray-400 text-xs"><i class="fas fa-paper-plane text-2xl mb-2 opacity-30"></i><p>No sent messages.<br><span style="font-size:10px;color:#d1d5db;">Real Outlook sync available in Pro plan.</span></p></div>';
}

// ════════════════════════════════════════════
//  CRM DRAFTS  (localStorage)
// ════════════════════════════════════════════

const DRAFTS_KEY = 'hiraya_crm_drafts';

function getDrafts() {
  try { return JSON.parse(localStorage.getItem(DRAFTS_KEY) || '[]'); }
  catch(e) { return []; }
}

function saveDraft() {
  const to      = document.getElementById('emailTo').value.trim();
  const toName  = document.getElementById('emailToName').textContent.trim();
  const subject = document.getElementById('emailSubject').value.trim();
  const body    = document.getElementById('emailBody').value.trim();
  const contact = document.getElementById('emailContactId').value;
  if (!to && !subject && !body) { showToast('Nothing to save — draft is empty.'); return; }
  const drafts = getDrafts();
  drafts.push({ id: Date.now(), to, toName, subject, body, contactId: contact, savedAt: new Date().toISOString() });
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  updateDraftsBadge(drafts.length);
  showToast('Draft saved.');
  closeEmailModal();
}

function deleteDraft(id) {
  const drafts = getDrafts().filter(d => d.id !== id);
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  updateDraftsBadge(drafts.length);
  renderDrafts();
  showToast('Draft deleted.');
}

function openDraft(id) {
  const d = getDrafts().find(d => d.id === id);
  if (!d) return;
  openEmailModal(d.to, d.toName, d.contactId);
  setTimeout(() => {
    document.getElementById('emailSubject').value = d.subject || '';
    document.getElementById('emailBody').value    = d.body    || '';
  }, 50);
  deleteDraft(id);  // remove draft once opened for editing
}

function renderDrafts() {
  const list   = document.getElementById('crm-drafts-list');
  const drafts = getDrafts();
  updateDraftsBadge(drafts.length);
  if (drafts.length === 0) {
    list.innerHTML = '<div class="flex flex-col items-center justify-center h-32 text-gray-400 text-xs"><i class="fas fa-file-alt text-2xl mb-2 opacity-30"></i><p>No drafts saved yet.</p></div>';
    return;
  }
  list.innerHTML = drafts.map(d => `
    <div class="msg-card flex items-start justify-between gap-3">
      <div class="flex items-start gap-3 flex-1">
        <div class="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
          <i class="fas fa-file-alt text-yellow-600" style="font-size:11px;"></i>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-gray-900">To: ${escHtml(d.toName || d.to || 'No recipient')}</p>
          <p class="text-xs text-gray-500 truncate">${escHtml(d.subject || '(no subject)')}</p>
          <p class="text-xs text-gray-400 mt-0.5">${new Date(d.savedAt).toLocaleDateString('en-PH',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}</p>
        </div>
      </div>
      <div class="flex gap-2 flex-shrink-0">
        <button onclick="openDraft(${d.id})" class="text-xs text-blue-600 hover:text-blue-800 font-medium transition">Edit</button>
        <button onclick="deleteDraft(${d.id})" class="text-xs text-red-400 hover:text-red-600 transition"><i class="fas fa-trash"></i></button>
      </div>
    </div>`).join('');
}

function updateDraftsBadge(count) {
  const badge = document.getElementById('crm-drafts-badge');
  if (!badge) return;
  if (count > 0) { badge.textContent = count; badge.classList.remove('hidden'); }
  else           { badge.classList.add('hidden'); }
}

// ════════════════════════════════════════════
//  CRM TICKETS
// ════════════════════════════════════════════

const TICKETS_KEY = 'hiraya_crm_tickets';

function getTickets() {
  try { return JSON.parse(localStorage.getItem(TICKETS_KEY) || '[]'); }
  catch(e) { return []; }
}

function openTicketModal() {
  document.getElementById('ticketModal').classList.remove('hidden');
  document.getElementById('tkt-subject').focus();
}

function closeTicketModal() {
  document.getElementById('ticketModal').classList.add('hidden');
  ['tkt-subject','tkt-client','tkt-assigned','tkt-description'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

function saveTicket() {
  const subject     = document.getElementById('tkt-subject').value.trim();
  const client      = document.getElementById('tkt-client').value.trim();
  const priority    = document.getElementById('tkt-priority').value;
  const category    = document.getElementById('tkt-category').value;
  const assigned    = document.getElementById('tkt-assigned').value.trim();
  const description = document.getElementById('tkt-description').value.trim();
  if (!subject) { showToast('Please enter a subject.'); return; }

  const tickets = getTickets();
  const tkt = {
    id:          'TKT-' + String(Date.now()).slice(-5),
    subject, client, priority, category, assigned, description,
    status:      'Open',
    createdAt:   new Date().toISOString()
  };
  tickets.unshift(tkt);
  localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));

  // Ticket saved to localStorage — no backend sync in demo mode

  closeTicketModal();
  renderTickets();
  logActivity('crm', 'Created ticket ' + tkt.id + ': ' + tkt.subject);
  showToast('Ticket ' + tkt.id + ' created.');
}

function updateTicketStatus(id, newStatus) {
  const tickets = getTickets().map(t => t.id === id ? { ...t, status: newStatus } : t);
  localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
  renderTickets();
  logActivity('crm', 'Updated ticket ' + id + ' status to: ' + newStatus);
  showToast('Ticket status updated to ' + newStatus + '.');
}

function deleteTicket(id) {
  showConfirm('Delete this ticket?', 'This action cannot be undone.', () => {
    const tickets = getTickets().filter(t => t.id !== id);
    localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
    renderTickets();
    logActivity('crm', 'Deleted ticket ' + id);
    showToast('Ticket deleted.');
  });
}

function renderTickets() {
  const list    = document.getElementById('crm-tickets-list');
  const tickets = getTickets();
  if (tickets.length === 0) {
    list.innerHTML = '<div class="flex flex-col items-center justify-center h-32 text-gray-400 text-xs"><i class="fas fa-ticket-alt text-2xl mb-2 opacity-30"></i><p>No tickets yet. Create your first ticket.</p></div>';
    return;
  }
  const statusBadge = { 'Open':'badge-open', 'In Progress':'badge-inprogress', 'Resolved':'badge-resolved', 'Closed':'badge-closed' };
  const priorityColor = { 'Urgent':'text-red-600', 'High':'text-orange-500', 'Medium':'text-yellow-600', 'Low':'text-gray-400' };
  list.innerHTML = `
    <table class="w-full">
      <thead><tr>
        <th>Ticket ID</th><th>Subject</th><th>Client</th><th>Category</th><th>Priority</th><th>Status</th><th>Date</th><th>Actions</th>
      </tr></thead>
      <tbody>` +
    tickets.map(t => `
      <tr>
        <td class="font-mono text-xs text-gray-500">${t.id}</td>
        <td class="font-medium text-gray-900 max-w-[180px] truncate">${escHtml(t.subject)}</td>
        <td class="text-gray-500 text-xs">${escHtml(t.client||'—')}</td>
        <td class="text-gray-400 text-xs">${escHtml(t.category||'—')}</td>
        <td class="text-xs font-semibold ${priorityColor[t.priority]||'text-gray-400'}">${t.priority}</td>
        <td>
          <select class="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none" onchange="updateTicketStatus('${t.id}',this.value)">
            ${['Open','In Progress','Resolved','Closed'].map(s => `<option${t.status===s?' selected':''}>${s}</option>`).join('')}
          </select>
        </td>
        <td class="text-gray-400 text-xs">${new Date(t.createdAt).toLocaleDateString('en-PH',{month:'short',day:'numeric'})}</td>
        <td><button onclick="deleteTicket('${t.id}')" class="text-gray-300 hover:text-red-400 transition text-xs"><i class="fas fa-trash"></i></button></td>
      </tr>`).join('') +
    '</tbody></table>';
}

// ════════════════════════════════════════════
//  CLIENT CONTACT FORM
// ════════════════════════════════════════════

function openClientContact() {
  document.getElementById('clientContactModal').classList.remove('hidden');
  document.getElementById('cc-name').focus();
}

function closeClientContact() {
  document.getElementById('clientContactModal').classList.add('hidden');
  ['cc-name','cc-company','cc-mobile','cc-email','cc-message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('cc-status').textContent = '';
}

async function sendClientMessage() {
  const name    = document.getElementById('cc-name').value.trim();
  const company = document.getElementById('cc-company').value.trim();
  const mobile  = document.getElementById('cc-mobile').value.trim();
  const email   = document.getElementById('cc-email').value.trim();
  const message = document.getElementById('cc-message').value.trim();
  const statusEl = document.getElementById('cc-status');
  const btn      = document.getElementById('cc-send-btn');

  if (!name || !mobile || !message) {
    statusEl.style.color = '#dc2626';
    statusEl.textContent = 'Please fill in Name, Mobile, and Message.';
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-circle-notch fa-spin mr-1"></i> Sending…';
  statusEl.textContent = '';

  await new Promise(r => setTimeout(r, 600));
  statusEl.style.color = '#16a34a';
  statusEl.textContent = 'Message received! We\'ll get back to you shortly.';
  setTimeout(closeClientContact, 2000);
  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
}

// ════════════════════════════════════════════
//  CUSTOM CONFIRM DIALOG
// ════════════════════════════════════════════

let _confirmCallback = null;

function showConfirm(text, sub, callback) {
  document.getElementById('confirmText').textContent = text || 'Are you sure?';
  document.getElementById('confirmSub').textContent  = sub  || 'This action cannot be undone.';
  _confirmCallback = callback;
  document.getElementById('confirmModal').classList.remove('hidden');
}

function confirmResolve(ok) {
  document.getElementById('confirmModal').classList.add('hidden');
  if (ok && typeof _confirmCallback === 'function') _confirmCallback();
  _confirmCallback = null;
}

// ── Demo seed: populate localStorage on first run ───────────────────
if (!localStorage.getItem(HR_EMPLOYEES_KEY))  localStorage.setItem(HR_EMPLOYEES_KEY,  JSON.stringify(SEED_EMPLOYEES));
if (!localStorage.getItem(LEADS_KEY))         localStorage.setItem(LEADS_KEY,         JSON.stringify(SEED_LEADS));
if (!localStorage.getItem(CRM_CONTACTS_KEY))  localStorage.setItem(CRM_CONTACTS_KEY,  JSON.stringify(SEED_CRM_CONTACTS));

// ── Boot ────────────────────────────────────
updateClock();
initDarkMode();
updateDraftsBadge(getDrafts().length);
document.getElementById('loginPass').addEventListener('keydown', e => {
  if (e.key === 'Enter') handleLogin();
});

