// ════════════════════════════════════════════
//  COMMUNICATIONS MOCK DATA — Demo Mode
//  Realistic construction supply context
//  Used by chatbot tools: get_email_digest,
//  get_sms_digest, get_web_inquiries
// ════════════════════════════════════════════

const MOCK_EMAILS = [
  {
    id: 'e001', from: 'juan.santos@abcconstruction.ph', name: 'Juan Santos',
    subject: 'Bulk cement order inquiry — March delivery',
    body: 'Good day. We need 500 bags Portland Cement 40kg for our Pasig project. Can you confirm availability and give us your best bulk price? We need delivery by April 5.',
    date: '2026-03-30', read: false, priority: 'high'
  },
  {
    id: 'e002', from: 'procurement@lopezbuilders.com', name: 'Lopez Builders',
    subject: 'Re: Quote #2026-089 — follow up',
    body: 'Hi, just following up on the quote we requested last week for steel bars and hollow blocks. Our project manager is waiting for this before we can proceed. Please update.',
    date: '2026-03-29', read: true, priority: 'high'
  },
  {
    id: 'e003', from: 'frank.makati@makatidev.com', name: 'Frank Makati',
    subject: 'New project — materials requirement list attached',
    body: 'Hello, we are starting a 5-floor commercial building in Makati. Attached is our initial materials list. We need pricing for cement, steel, gravel, and hollow blocks. Budget is ₱2M for materials.',
    date: '2026-03-29', read: false, priority: 'high'
  },
  {
    id: 'e004', from: 'grace.lim@cebucement.ph', name: 'Grace Lim (PhilSupply)',
    subject: 'March invoice and delivery schedule',
    body: 'Please find attached the March delivery schedule and invoice for your reference. Payment terms: net 30. Let me know if you have questions.',
    date: '2026-03-28', read: true, priority: 'normal'
  },
  {
    id: 'e005', from: 'rtan@tanengineering.ph', name: 'Roberto Tan',
    subject: 'Steel bar quote request — urgent',
    body: 'We need 200pcs Steel Bar 16mm and 150pcs Steel Bar 12mm ASAP. Project starts April 3. Can you deliver within 2 days of PO? Please reply with price and lead time.',
    date: '2026-03-28', read: false, priority: 'high'
  },
  {
    id: 'e006', from: 'bencruz@cruzhardware.ph', name: 'Ben Cruz',
    subject: 'Re: Our last order — delivery complaint',
    body: 'Hi, our last delivery (ORD-1042) had 3 damaged hollow blocks. Please arrange replacement or credit note. We are a regular customer and expect better quality control.',
    date: '2026-03-27', read: true, priority: 'normal'
  },
  {
    id: 'e007', from: 'alice.reyes@reyesproperties.ph', name: 'Alice Reyes',
    subject: 'Project timeline update — order may be delayed',
    body: 'Hello, just a heads-up that our Cavite project has been delayed by 2 weeks due to permits. The quoted order (₱320,000) will likely be pushed to late April. Please keep the quote valid.',
    date: '2026-03-26', read: true, priority: 'normal'
  },
  {
    id: 'e008', from: 'admin@nuevobuilders.com', name: 'Nueva Builders Inc',
    subject: 'Payment confirmation — ORD-1040',
    body: 'Please be advised that payment for Order #ORD-1040 amounting to ₱41,600 has been processed via bank transfer. Reference: BDO-2026-0330-88421. Please confirm receipt.',
    date: '2026-03-26', read: true, priority: 'normal'
  },
  {
    id: 'e009', from: 'supplies@greentech.ph', name: 'GreenTech Construction',
    subject: 'Monthly standing order renewal',
    body: 'Hi, we would like to renew our monthly standing order for cement and sand (same quantities as last month). Please prepare the standard PO and send us for approval.',
    date: '2026-03-25', read: true, priority: 'low'
  },
  {
    id: 'e010', from: 'edwin.soriano@nationalsteel.ph', name: 'Edwin Soriano (National Steel)',
    subject: 'New steel bar pricelist — effective April 1',
    body: 'Dear valued partner, please find attached our updated pricelist effective April 1, 2026. Steel bar prices will increase by 4–6% due to raw material costs. Kindly update your records.',
    date: '2026-03-24', read: true, priority: 'normal'
  },
];

const MOCK_SMS = [
  {
    id: 's001', from: '+63917-555-0142', name: 'Maria Cruz',
    message: 'Hi sir, interested po sa bulk order ng hollow blocks. Pwede po ba magrequest ng quote? Need namin ng 1000pcs 4" at 500pcs 6".',
    date: '2026-03-30', read: false
  },
  {
    id: 's002', from: '+63918-555-7731', name: 'Unknown',
    message: 'Good morning. Do you deliver to Cavite? We need 50 bags cement and 10m3 sand for a house construction.',
    date: '2026-03-30', read: false
  },
  {
    id: 's003', from: '+63919-555-1003', name: 'Roberto Tan',
    message: 'Hi, nakita ko na yung quote. Okay na. Puwede na mag-PO ngayon. Kelan kaya available yung stocks?',
    date: '2026-03-29', read: true
  },
  {
    id: 's004', from: '+63920-555-4429', name: 'Unknown',
    message: 'Hello, naghahanap kami ng supplier ng GI sheets at plywood for a warehouse project sa Laguna. 500sqm floor area. Interested kayo?',
    date: '2026-03-28', read: true
  },
  {
    id: 's005', from: '+63917-555-1001', name: 'Juan Santos',
    message: 'Sir, sent na ang email re: cement order. Please confirm kung may stocks pa kayo. Urgent po ito.',
    date: '2026-03-28', read: true
  },
];

const MOCK_INQUIRIES = [
  {
    id: 'w001', name: 'Roberto dela Vega', email: 'rdv@delavegaroofing.com',
    company: 'Dela Vega Roofing',
    message: 'We are looking for a reliable supplier for GI sheets (26GA and 24GA) and roofing accessories. We do about 15-20 roofing projects per month across Metro Manila. Please send us your pricelist and can we set up an account?',
    date: '2026-03-30', source: 'Website Contact Form'
  },
  {
    id: 'w002', name: 'Christine Abad', email: 'cabad@abadconstruction.com',
    company: 'Abad Construction',
    message: 'Looking for a construction materials supplier for our ongoing project in Bulacan. Need cement (300 bags), steel bars, and aggregates. Do you offer credit terms for contractors?',
    date: '2026-03-29', source: 'Website Contact Form'
  },
  {
    id: 'w003', name: 'Marco Villanueva', email: 'marco@villanuevabuild.ph',
    company: 'Villanueva Builders',
    message: 'Hello, we found your website through Google. We need a materials quote for a 3-bedroom house construction. Can someone call me to discuss? +63917-888-2211',
    date: '2026-03-28', source: 'Website Contact Form'
  },
];

// Pool of random messages for "Simulate New Message" demo button
const _SIM_POOL = [
  { type:'email', from:'newlead@pacificbuilders.ph', name:'Pacific Builders Corp', subject:'Materials inquiry — new project Q2 2026', body:'Hi, we have a large residential project starting Q2. Estimated materials needed: 1,500 bags cement, 500pcs steel bar 12mm, gravel and sand. Can we schedule a meeting to discuss bulk pricing and delivery?' },
  { type:'sms',   from:'+63920-555-8812', name:'Unknown', message:'Good day, looking for supplier ng lumber at plywood for furniture workshop sa QC. Daily volume. Interested kayo mag-supply?' },
  { type:'inquiry', name:'Antonio Reyes', email:'antonioreyes@build.ph', company:'AR Construction', message:'Referred by Alice Reyes. Need quote for 200 bags cement and steel bars for a residential project. Can you send price list?' },
  { type:'email', from:'supply@fortaleza.ph', name:'Fortaleza Construction', subject:'Urgent restock needed', body:'We are running low on hollow blocks and sand on our active site. Can you deliver 2,000pcs 4" hollow blocks and 5m3 sand by tomorrow morning? Same address as our last order.' },
  { type:'sms',   from:'+63918-555-3394', name:'Unknown', message:'Hello po, may available ba kayong Portland cement? Need today or tomorrow. 20 bags lang.' },
];

let _simIndex = 0;

function simulateNewMessage() {
  const msg = _SIM_POOL[_simIndex % _SIM_POOL.length];
  _simIndex++;
  const now = new Date().toISOString().split('T')[0];
  if (msg.type === 'email') {
    MOCK_EMAILS.unshift({ id: 'sim' + Date.now(), from: msg.from, name: msg.name, subject: msg.subject, body: msg.body, date: now, read: false, priority: 'high' });
  } else if (msg.type === 'sms') {
    MOCK_SMS.unshift({ id: 'sim' + Date.now(), from: msg.from, name: msg.name, message: msg.message, date: now, read: false });
  } else {
    MOCK_INQUIRIES.unshift({ id: 'sim' + Date.now(), name: msg.name, email: msg.email, company: msg.company, message: msg.message, date: now, source: 'Website Contact Form' });
  }
  return msg;
}
