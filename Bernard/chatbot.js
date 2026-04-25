// ════════════════════════════════════════════
//  HIRAYA AI CHATBOT ENGINE
//  Direct Claude API — no n8n dependency
//  Shared singleton: window.chatEngine
// ════════════════════════════════════════════

(function () {
  'use strict';

  const CLAUDE_API = 'https://api.anthropic.com/v1/messages';
  const MODEL_FAST   = 'claude-haiku-4-5-20251001'; // tool lookups, quick Q&A
  const MODEL_SMART  = 'claude-sonnet-4-6';          // reports, analysis
  const MAX_HISTORY  = 8;
  const PHP_TO_USD   = 57; // 1 USD = 57 PHP (approximate)
  const toUSD = php => (php / PHP_TO_USD);

  function isReportRequest(msg) {
    return /report|summary|analysis|executive|brief|overview/i.test(msg);
  }

  // ── Build compressed dashboard snapshot (< 600 tokens) ──────────────
  function buildSystemPrompt() {
    const cfg    = (typeof getWhiteLabelConfig === 'function') ? getWhiteLabelConfig() : {};
    const company = cfg.companyName || 'Hiraya Supply Corp';
    const today  = new Date().toLocaleDateString('en-PH', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
    const user   = (typeof _currentUser !== 'undefined' && _currentUser) ? `${_currentUser.displayName} (${_currentUser.role})` : 'Admin';

    // Sales snapshot
    const orders   = (typeof ORDERS_DATA !== 'undefined') ? ORDERS_DATA : [];
    const mar      = orders.filter(o => o.date.startsWith('2026-03'));
    const marRev   = mar.reduce((s, o) => s + o.amount, 0);
    const target   = 600000;
    const unpaid   = orders.filter(o => o.payment === 'Unpaid');
    const unpaidAmt = unpaid.reduce((s, o) => s + o.amount, 0);
    const custMap  = {};
    mar.forEach(o => { custMap[o.customer] = (custMap[o.customer] || 0) + o.amount; });
    const top3     = Object.entries(custMap).sort((a,b) => b[1]-a[1]).slice(0,3)
                       .map(([c,v]) => `${c} $${(toUSD(v)/1000).toFixed(1)}k`).join(', ');

    // Inventory snapshot
    const inv      = (typeof SEED_INVENTORY !== 'undefined') ? SEED_INVENTORY : [];
    const lowStock = inv.filter(i => i.stock <= (typeof LOW_STOCK_THRESHOLD !== 'undefined' ? LOW_STOCK_THRESHOLD : 20));
    const lowStr   = lowStock.map(i => `${i.name} (${i.stock} ${i.unit})`).join(', ') || 'None';

    // HR snapshot
    const employees = (typeof getHREmployees === 'function') ? getHREmployees() : [];
    const present  = employees.filter(e => e.status === 'Present').length;
    const onLeave  = employees.filter(e => e.status === 'On Leave');
    const absent   = employees.filter(e => e.status === 'Absent');

    // CRM + Leads snapshot
    const contacts = (typeof getCRMContacts === 'function') ? getCRMContacts() : [];
    const leads    = (typeof getLeads === 'function') ? getLeads() : [];
    const hotLeads = leads.filter(l => l.status === 'Hot');
    const hotStr   = hotLeads.map(l => `${l.company} $${(toUSD(l.value)/1000).toFixed(1)}k`).join(', ') || 'None';

    return `You are the AI business assistant for ${company}.
Today: ${today}. User: ${user}.

BUSINESS SNAPSHOT:
Sales (Mar 2026): $${Math.round(toUSD(marRev)).toLocaleString()} revenue, ${mar.length} orders. Target: $${Math.round(toUSD(target)).toLocaleString()} (${Math.round(marRev/target*100)}%).
Top customers: ${top3 || 'N/A'}.
Unpaid invoices: ${unpaid.length} orders totaling $${Math.round(toUSD(unpaidAmt)).toLocaleString()}.

Inventory: ${inv.length} products. LOW STOCK (≤20 units): ${lowStr}.

HR: ${employees.length} employees. Present: ${present}. On leave: ${onLeave.length}${onLeave.length ? ' ('+onLeave.map(e=>e.name).join(', ')+')' : ''}. Absent: ${absent.length}${absent.length ? ' ('+absent.map(e=>e.name).join(', ')+')' : ''}.

CRM: ${contacts.length} contacts. Leads: ${leads.length} active. Hot leads: ${hotLeads.length} — ${hotStr}.

RESPONSE FORMAT RULES (follow exactly):
- NEVER use markdown tables (no | pipes). Use structured sections instead.
- Use ## for section headers (e.g. ## Sales Overview)
- Use stat lines with this exact format: STAT: label | value (e.g. STAT: Revenue | $10,306)
- Use bullet points with - for lists
- Use ALERT: prefix for warnings/issues that need attention (e.g. ALERT: 3 items low in stock)
- Use ACTION: prefix for recommended next steps (e.g. ACTION: Follow up with Lopez Builders on unpaid invoice)
- Always end responses with a ## What's Next section listing 2-4 ACTION: items
- Be concise. Skip filler phrases. Lead with the most important number or finding.
- Currency: US Dollar ($). All raw amounts from tools are in PHP — divide by ${PHP_TO_USD} to convert. Always display as $ (e.g. $1,234). Date format: Month DD, YYYY.
- When adding records, confirm with: DONE: [what was added/changed]`;
  }

  // ── Tool definitions ────────────────────────────────────────────────
  const TOOLS = [
    {
      name: 'get_sales_summary',
      description: 'Get sales revenue, order counts, top customers, and payment status breakdown for a given period.',
      input_schema: {
        type: 'object',
        properties: {
          period: { type: 'string', description: 'Month filter e.g. "2026-03" or "all". Default: current month.' }
        }
      }
    },
    {
      name: 'get_inventory_status',
      description: 'Get all products with stock levels. Highlights low-stock items.',
      input_schema: { type: 'object', properties: {} }
    },
    {
      name: 'get_hr_overview',
      description: 'Get employee list with attendance status, leave balances, and payroll total.',
      input_schema: { type: 'object', properties: {} }
    },
    {
      name: 'get_crm_contacts',
      description: 'Get all CRM contacts with company, type (Client/Partner), and contact info.',
      input_schema: { type: 'object', properties: {} }
    },
    {
      name: 'get_leads_report',
      description: 'Get all sales leads with status (Hot/Warm/Cold/Quoted), value, and assigned staff.',
      input_schema: { type: 'object', properties: {} }
    },
    {
      name: 'get_financial_summary',
      description: 'Get revenue vs target, paid/pending/unpaid invoice breakdown.',
      input_schema: { type: 'object', properties: {} }
    },
    {
      name: 'get_order_details',
      description: 'Search orders by customer name, payment status, or delivery status.',
      input_schema: {
        type: 'object',
        properties: {
          customer:  { type: 'string', description: 'Filter by customer name (partial match ok)' },
          payment:   { type: 'string', description: 'Filter by payment: Paid, Unpaid, Pending' },
          delivery:  { type: 'string', description: 'Filter by delivery: Delivered, In Transit, Pending' }
        }
      }
    },
    {
      name: 'add_lead',
      description: 'Add a new sales lead to the leads module.',
      input_schema: {
        type: 'object',
        properties: {
          company:  { type: 'string' },
          person:   { type: 'string' },
          type:     { type: 'string', description: 'Contractor, Developer, Retailer, Engineer' },
          mobile:   { type: 'string' },
          value:    { type: 'number', description: 'Estimated deal value in PHP' },
          status:   { type: 'string', description: 'Hot, Warm, Cold, Prospect' },
          assigned: { type: 'string', description: 'Staff name to assign this lead to' }
        },
        required: ['company', 'status']
      }
    },
    {
      name: 'update_lead_status',
      description: 'Update the status of an existing lead.',
      input_schema: {
        type: 'object',
        properties: {
          company:    { type: 'string', description: 'Company name of the lead (partial match ok)' },
          new_status: { type: 'string', description: 'New status: Hot, Warm, Cold, Quoted, Won ✓, Lost ✗' }
        },
        required: ['company', 'new_status']
      }
    },
    {
      name: 'add_crm_contact',
      description: 'Add a new contact to the CRM.',
      input_schema: {
        type: 'object',
        properties: {
          company: { type: 'string' },
          person:  { type: 'string' },
          type:    { type: 'string', description: 'Client or Partner' },
          phone:   { type: 'string' },
          email:   { type: 'string' }
        },
        required: ['company', 'type']
      }
    },
    {
      name: 'get_communications_digest',
      description: 'Get unread emails, SMS, and website inquiries for triage. Returns what needs attention.',
      input_schema: {
        type: 'object',
        properties: {
          source: { type: 'string', description: 'all, email, sms, or inquiries. Default: all' }
        }
      }
    },
    {
      name: 'search_all_records',
      description: 'Search across orders, leads, CRM contacts, and employees by keyword.',
      input_schema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search keyword' }
        },
        required: ['query']
      }
    }
  ];

  // ── Tool executors ───────────────────────────────────────────────────
  function executeTool(name, input) {
    const orders    = (typeof ORDERS_DATA !== 'undefined') ? ORDERS_DATA : [];
    const inv       = (typeof SEED_INVENTORY !== 'undefined') ? SEED_INVENTORY : [];
    const employees = (typeof getHREmployees === 'function') ? getHREmployees() : [];
    const contacts  = (typeof getCRMContacts === 'function') ? getCRMContacts() : [];
    const leads     = (typeof getLeads === 'function') ? getLeads() : [];

    switch (name) {
      case 'get_sales_summary': {
        const period = input.period || '2026-03';
        const filtered = period === 'all' ? orders : orders.filter(o => o.date.startsWith(period));
        const total    = filtered.reduce((s, o) => s + o.amount, 0);
        const byStatus = { Paid: 0, Pending: 0, Unpaid: 0 };
        filtered.forEach(o => { byStatus[o.payment] = (byStatus[o.payment] || 0) + o.amount; });
        const custMap  = {};
        filtered.forEach(o => { custMap[o.customer] = (custMap[o.customer] || 0) + o.amount; });
        const topCust  = Object.entries(custMap).sort((a,b) => b[1]-a[1]).slice(0,5);
        return { period, total_revenue: total, order_count: filtered.length, by_payment: byStatus, top_customers: topCust };
      }
      case 'get_inventory_status': {
        const threshold = typeof LOW_STOCK_THRESHOLD !== 'undefined' ? LOW_STOCK_THRESHOLD : 20;
        const low = inv.filter(i => i.stock <= threshold);
        return { total_products: inv.length, low_stock_count: low.length, low_stock_items: low, all_products: inv };
      }
      case 'get_hr_overview': {
        const total   = employees.length;
        const present = employees.filter(e => e.status === 'Present');
        const leave   = employees.filter(e => e.status === 'On Leave');
        const absent  = employees.filter(e => e.status === 'Absent');
        const payroll = employees.reduce((s, e) => s + (e.salary || 0), 0);
        return { total, present: present.length, on_leave: leave.map(e => e.name), absent: absent.map(e => e.name), monthly_payroll: payroll, employees };
      }
      case 'get_crm_contacts': {
        const clients  = contacts.filter(c => c.type === 'Client');
        const partners = contacts.filter(c => c.type === 'Partner');
        return { total: contacts.length, clients: clients.length, partners: partners.length, contacts };
      }
      case 'get_leads_report': {
        const byStatus = {};
        leads.forEach(l => { byStatus[l.status] = (byStatus[l.status] || 0) + 1; });
        const totalValue = leads.reduce((s, l) => s + (l.value || 0), 0);
        return { total: leads.length, by_status: byStatus, total_pipeline_value: totalValue, leads };
      }
      case 'get_financial_summary': {
        const marOrders = orders.filter(o => o.date.startsWith('2026-03'));
        const rev       = marOrders.reduce((s, o) => s + o.amount, 0);
        const target    = 600000;
        const paid      = marOrders.filter(o => o.payment === 'Paid').reduce((s, o) => s + o.amount, 0);
        const pending   = marOrders.filter(o => o.payment === 'Pending').reduce((s, o) => s + o.amount, 0);
        const unpaid    = marOrders.filter(o => o.payment === 'Unpaid').reduce((s, o) => s + o.amount, 0);
        return { month: 'March 2026', revenue: rev, target, achievement_pct: Math.round(rev/target*100), paid, pending, unpaid };
      }
      case 'get_order_details': {
        let result = [...orders];
        if (input.customer) result = result.filter(o => o.customer.toLowerCase().includes(input.customer.toLowerCase()));
        if (input.payment)  result = result.filter(o => o.payment === input.payment);
        if (input.delivery) result = result.filter(o => o.delivery === input.delivery);
        return { count: result.length, orders: result.slice(0, 20) };
      }
      case 'add_lead': {
        const newLead = {
          company:  input.company  || 'Unknown',
          person:   input.person   || '',
          type:     input.type     || 'Prospect',
          mobile:   input.mobile   || '',
          value:    input.value    || 0,
          status:   input.status   || 'Warm',
          assigned: input.assigned || '',
          date:     new Date().toISOString().split('T')[0],
          _key:     'ai_' + Date.now()
        };
        const all = (typeof getLeads === 'function') ? getLeads() : [];
        all.unshift(newLead);
        localStorage.setItem('hiraya_leads', JSON.stringify(all));
        if (typeof renderLeads === 'function') renderLeads();
        return { success: true, message: `Lead added: ${newLead.company} (${newLead.status})`, lead: newLead };
      }
      case 'update_lead_status': {
        const all = (typeof getLeads === 'function') ? getLeads() : [];
        const idx = all.findIndex(l => l.company.toLowerCase().includes(input.company.toLowerCase()));
        if (idx === -1) return { success: false, message: `No lead found matching "${input.company}"` };
        const old = all[idx].status;
        all[idx].status = input.new_status;
        localStorage.setItem('hiraya_leads', JSON.stringify(all));
        if (typeof renderLeads === 'function') renderLeads();
        return { success: true, message: `Updated ${all[idx].company}: ${old} → ${input.new_status}` };
      }
      case 'add_crm_contact': {
        const newContact = {
          company: input.company || 'Unknown',
          person:  input.person  || '',
          type:    input.type    || 'Client',
          phone:   input.phone   || '',
          email:   input.email   || '',
          _key:    'ai_' + Date.now()
        };
        const all = (typeof getCRMContacts === 'function') ? getCRMContacts() : [];
        all.unshift(newContact);
        localStorage.setItem('hiraya_crm_contacts', JSON.stringify(all));
        if (typeof renderCRM === 'function') renderCRM();
        return { success: true, message: `Contact added: ${newContact.company}`, contact: newContact };
      }
      case 'get_communications_digest': {
        const src = (input.source || 'all').toLowerCase();
        const result = {};
        if (src === 'all' || src === 'email') {
          result.emails = { total: MOCK_EMAILS.length, unread: MOCK_EMAILS.filter(e => !e.read).length, items: MOCK_EMAILS.slice(0, 6) };
        }
        if (src === 'all' || src === 'sms') {
          result.sms = { total: MOCK_SMS.length, unread: MOCK_SMS.filter(s => !s.read).length, items: MOCK_SMS.slice(0, 5) };
        }
        if (src === 'all' || src === 'inquiries') {
          result.inquiries = { total: MOCK_INQUIRIES.length, items: MOCK_INQUIRIES.slice(0, 5) };
        }
        return result;
      }
      case 'search_all_records': {
        const q = input.query.toLowerCase();
        const matchOrders   = orders.filter(o => o.customer.toLowerCase().includes(q) || o.products.toLowerCase().includes(q));
        const matchLeads    = leads.filter(l => l.company.toLowerCase().includes(q) || (l.person||'').toLowerCase().includes(q));
        const matchContacts = contacts.filter(c => c.company.toLowerCase().includes(q) || (c.person||'').toLowerCase().includes(q));
        const matchEmp      = employees.filter(e => e.name.toLowerCase().includes(q) || e.position.toLowerCase().includes(q));
        return { query: input.query, orders: matchOrders.slice(0,5), leads: matchLeads.slice(0,5), contacts: matchContacts.slice(0,5), employees: matchEmp.slice(0,5) };
      }
      default:
        return { error: 'Unknown tool: ' + name };
    }
  }

  // ── Tool call label for UI feedback ─────────────────────────────────
  const TOOL_LABELS = {
    get_sales_summary:        '📊 Checking sales data...',
    get_inventory_status:     '📦 Checking inventory...',
    get_hr_overview:          '👥 Checking HR records...',
    get_crm_contacts:         '🤝 Loading CRM contacts...',
    get_leads_report:         '🎯 Reviewing leads...',
    get_financial_summary:    '💰 Analyzing financials...',
    get_order_details:        '🔍 Searching orders...',
    add_lead:                 '✅ Adding new lead...',
    update_lead_status:       '✏️ Updating lead status...',
    add_crm_contact:          '➕ Adding CRM contact...',
    get_communications_digest:'📬 Reading messages...',
    search_all_records:       '🔍 Searching all records...',
  };

  // ── Core streaming chat function ─────────────────────────────────────
  async function streamChat(messages, apiKey, model, onChunk, onToolCall, onDone) {
    const body = { model, max_tokens: 1024, stream: true, tools: TOOLS, messages };

    const resp = await fetch(CLAUDE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify(body)
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.error?.message || `API error ${resp.status}`);
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullText = '';
    let toolUse = null;
    let toolInputStr = '';
    let stopReason = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') continue;
        let evt;
        try { evt = JSON.parse(data); } catch { continue; }

        if (evt.type === 'content_block_start' && evt.content_block?.type === 'tool_use') {
          toolUse = { id: evt.content_block.id, name: evt.content_block.name };
          toolInputStr = '';
          if (onToolCall) onToolCall(TOOL_LABELS[toolUse.name] || '🔧 Working...');
        }
        if (evt.type === 'content_block_delta') {
          if (evt.delta?.type === 'text_delta') {
            fullText += evt.delta.text;
            if (onChunk) onChunk(evt.delta.text);
          }
          if (evt.delta?.type === 'input_json_delta') {
            toolInputStr += evt.delta.partial_json;
          }
        }
        if (evt.type === 'message_delta') {
          stopReason = evt.delta?.stop_reason;
        }
      }
    }

    // Handle tool use (agentic loop)
    if (stopReason === 'tool_use' && toolUse) {
      let toolInput = {};
      try { toolInput = JSON.parse(toolInputStr); } catch { toolInput = {}; }
      const toolResult = executeTool(toolUse.name, toolInput);

      // Build next messages with tool result
      const nextMessages = [
        ...messages,
        { role: 'assistant', content: [{ type: 'tool_use', id: toolUse.id, name: toolUse.name, input: toolInput }] },
        { role: 'user',      content: [{ type: 'tool_result', tool_use_id: toolUse.id, content: JSON.stringify(toolResult) }] }
      ];

      // Continue streaming with tool result
      return streamChat(nextMessages, apiKey, model, onChunk, onToolCall, onDone);
    }

    if (onDone) onDone(fullText);
    return fullText;
  }

  // ── Build proactive welcome message ─────────────────────────────────
  function getProactiveAlerts() {
    const inv    = (typeof SEED_INVENTORY !== 'undefined') ? SEED_INVENTORY : [];
    const orders = (typeof ORDERS_DATA !== 'undefined') ? ORDERS_DATA : [];
    const leads  = (typeof getLeads === 'function') ? getLeads() : [];
    const threshold = typeof LOW_STOCK_THRESHOLD !== 'undefined' ? LOW_STOCK_THRESHOLD : 20;

    const alerts = [];
    const lowStock = inv.filter(i => i.stock <= threshold);
    if (lowStock.length) alerts.push(`⚠️ <strong>${lowStock.length} items low in stock</strong> — reorder needed`);

    const unpaid = orders.filter(o => o.payment === 'Unpaid');
    if (unpaid.length) {
      const amt = unpaid.reduce((s, o) => s + o.amount, 0);
      alerts.push(`💰 <strong>${unpaid.length} unpaid invoices</strong> totaling $${Math.round(toUSD(amt)).toLocaleString()}`);
    }

    const hotLeads = leads.filter(l => l.status === 'Hot');
    if (hotLeads.length) alerts.push(`🎯 <strong>${hotLeads.length} hot leads</strong> need follow-up`);

    const mar    = orders.filter(o => o.date.startsWith('2026-03'));
    const rev    = mar.reduce((s, o) => s + o.amount, 0);
    const target = 600000;
    const pct    = Math.round(rev / target * 100);
    alerts.push(`📊 Revenue at <strong>${pct}% of target</strong> ($${Math.round(toUSD(rev)).toLocaleString()} / $${Math.round(toUSD(target)).toLocaleString()})`);

    return alerts;
  }

  // ── Public singleton ─────────────────────────────────────────────────
  window.chatEngine = {
    history: [],
    isStreaming: false,

    get apiKey() { return localStorage.getItem('hiraya_claude_api_key') || ''; },

    async send(message, onChunk, onToolCall, onDone, onError) {
      if (this.isStreaming) return;
      if (!this.apiKey) {
        if (onError) onError('No API key set. Go to Settings → AI Configuration to add your Anthropic API key.');
        return;
      }
      this.isStreaming = true;
      this.history.push({ role: 'user', content: message });

      const model    = isReportRequest(message) ? MODEL_SMART : MODEL_FAST;
      const messages = this.history.slice(-MAX_HISTORY).map(m => ({ role: m.role, content: m.content }));
      const sysPmpt  = buildSystemPrompt();

      // Inject system prompt as first user message if history has only 1 item
      const apiMessages = [
        { role: 'user', content: sysPmpt + '\n\n---\nUser message: ' + (messages[0]?.content || message) },
        ...messages.slice(1)
      ];

      try {
        const fullText = await streamChat(apiMessages, this.apiKey, model, onChunk, onToolCall, (text) => {
          this.history.push({ role: 'assistant', content: text });
          this.history = this.history.slice(-MAX_HISTORY);
          this.isStreaming = false;
          if (onDone) onDone(text);
        });
      } catch (err) {
        this.isStreaming = false;
        const msg = err.message || 'Connection error';
        if (onError) onError(msg);
      }
    },

    clear() {
      this.history = [];
      this.isStreaming = false;
    },

    getProactiveAlerts
  };

})();
