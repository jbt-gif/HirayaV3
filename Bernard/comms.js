// ════════════════════════════════════════════
//  COMMUNICATIONS MOCK DATA — Demo Mode
//  Realistic construction supply context
//  Used by chatbot tools: get_email_digest,
//  get_sms_digest, get_web_inquiries
// ════════════════════════════════════════════

const MOCK_EMAILS = [
  {
    id: 'e001', from: 'john.mitchell@abcconstruction.com', name: 'John Mitchell',
    subject: 'Bulk cement order inquiry — April delivery',
    body: 'Hi, we need 500 bags of Portland Cement 40kg for our Springfield project. Can you confirm availability and give us your best bulk price? We need delivery by April 5.',
    date: '2026-03-30', read: false, priority: 'high'
  },
  {
    id: 'e002', from: 'procurement@lopezbuilders.com', name: 'Lopez Builders',
    subject: 'Re: Quote #2026-089 — follow up',
    body: 'Hi, just following up on the quote we requested last week for steel bars and hollow blocks. Our project manager is waiting on this before we can proceed. Please advise.',
    date: '2026-03-29', read: true, priority: 'high'
  },
  {
    id: 'e003', from: 'frank.martin@metrodevelopers.com', name: 'Frank Martin',
    subject: 'New project — materials requirement list attached',
    body: 'Hello, we are starting a 5-floor commercial building in downtown Boston. Attached is our initial materials list. We need pricing for cement, steel, gravel, and hollow blocks. Budget is $35,000 for materials.',
    date: '2026-03-29', read: false, priority: 'high'
  },
  {
    id: 'e004', from: 'grace.lin@pacificcement.com', name: 'Grace Lin (Pacific Cement)',
    subject: 'March invoice and delivery schedule',
    body: 'Please find attached the March delivery schedule and invoice for your reference. Payment terms: net 30. Let us know if you have any questions.',
    date: '2026-03-28', read: true, priority: 'normal'
  },
  {
    id: 'e005', from: 'rtan@tanengineering.com', name: 'Robert Tang',
    subject: 'Steel bar quote request — urgent',
    body: 'We need 200 pcs Steel Bar 16mm and 150 pcs Steel Bar 12mm as soon as possible. Project starts April 3. Can you deliver within 2 days of PO? Please reply with price and lead time.',
    date: '2026-03-28', read: false, priority: 'high'
  },
  {
    id: 'e006', from: 'ben.crawford@crawfordhardware.com', name: 'Ben Crawford',
    subject: 'Re: Our last order — delivery complaint',
    body: 'Hi, our last delivery (ORD-1042) had 3 damaged hollow blocks. Please arrange a replacement or issue a credit note. We are a regular customer and expect better quality control.',
    date: '2026-03-27', read: true, priority: 'normal'
  },
  {
    id: 'e007', from: 'alice.reynolds@reynoldsproperties.com', name: 'Alice Reynolds',
    subject: 'Project timeline update — order may be delayed',
    body: 'Hello, just a heads-up that our Newport project has been delayed by 2 weeks due to permit issues. The quoted order ($5,614) will likely be pushed to late April. Please keep the quote valid.',
    date: '2026-03-26', read: true, priority: 'normal'
  },
  {
    id: 'e008', from: 'admin@nevadabuilders.com', name: 'Nevada Builders Inc',
    subject: 'Payment confirmation — ORD-1040',
    body: 'Please be advised that payment for Order #ORD-1040 amounting to $730 has been processed via bank transfer. Reference: BNK-2026-0330-88421. Please confirm receipt.',
    date: '2026-03-26', read: true, priority: 'normal'
  },
  {
    id: 'e009', from: 'supplies@greentechconstruction.com', name: 'GreenTech Construction',
    subject: 'Monthly standing order renewal',
    body: 'Hi, we would like to renew our monthly standing order for cement and sand — same quantities as last month. Please prepare the standard PO and send it over for approval.',
    date: '2026-03-25', read: true, priority: 'low'
  },
  {
    id: 'e010', from: 'edwin.sorenson@nationalsteel.com', name: 'Edwin Sorenson (National Steel)',
    subject: 'New steel bar pricelist — effective April 1',
    body: 'Dear valued partner, please find attached our updated pricelist effective April 1, 2026. Steel bar prices will increase by 4–6% due to raw material costs. Please update your records accordingly.',
    date: '2026-03-24', read: true, priority: 'normal'
  },
];

const MOCK_SMS = [
  {
    id: 's001', from: '+1-617-555-3042', name: 'Maria Carter',
    message: 'Hi, I am interested in a bulk order of hollow blocks. Can I request a quote? Need 1,000 pcs 4-inch and 500 pcs 6-inch.',
    date: '2026-03-30', read: false
  },
  {
    id: 's002', from: '+1-617-555-7731', name: 'Unknown',
    message: 'Good morning. Do you deliver to Worcester? We need 50 bags cement and 10m3 sand for a house construction.',
    date: '2026-03-30', read: false
  },
  {
    id: 's003', from: '+1-617-555-1003', name: 'Robert Tang',
    message: 'Hi, I reviewed the quote. Looks good — ready to issue a PO. When will the stock be available?',
    date: '2026-03-29', read: true
  },
  {
    id: 's004', from: '+1-617-555-4429', name: 'Unknown',
    message: 'Hello, looking for a supplier of GI sheets and plywood for a warehouse project in Providence. 500 sqft floor area. Are you able to supply?',
    date: '2026-03-28', read: true
  },
  {
    id: 's005', from: '+1-617-555-1001', name: 'John Mitchell',
    message: 'Hi, sent you an email about the cement order. Please confirm if you still have stock. This is urgent.',
    date: '2026-03-28', read: true
  },
];

const MOCK_INQUIRIES = [
  {
    id: 'w001', name: 'Robert Vega', email: 'rvega@vegaroofing.com',
    company: 'Vega Roofing',
    message: 'We are looking for a reliable supplier for GI sheets (26GA and 24GA) and roofing accessories. We handle about 15-20 roofing projects per month across Greater Boston. Please send us your pricelist — can we set up an account?',
    date: '2026-03-30', source: 'Website Contact Form'
  },
  {
    id: 'w002', name: 'Christine Abbott', email: 'cabbott@abbottconstruction.com',
    company: 'Abbott Construction',
    message: 'Looking for a construction materials supplier for our ongoing project in Cambridge. Need cement (300 bags), steel bars, and aggregates. Do you offer credit terms for contractors?',
    date: '2026-03-29', source: 'Website Contact Form'
  },
  {
    id: 'w003', name: 'Mark Villa', email: 'mark@villabuild.com',
    company: 'Villa Builders',
    message: 'Hello, we found your website through Google. We need a materials quote for a 3-bedroom house construction. Can someone call me to discuss? +1-617-888-2211',
    date: '2026-03-28', source: 'Website Contact Form'
  },
];

// Pool of random messages for "Simulate New Message" demo button
const _SIM_POOL = [
  { type:'email', from:'inquiry@pacificbuilders.com', name:'Pacific Builders Corp', subject:'Materials inquiry — new project Q2 2026', body:'Hi, we have a large residential project starting Q2. Estimated materials needed: 1,500 bags cement, 500 pcs steel bar 12mm, gravel and sand. Can we schedule a meeting to discuss bulk pricing and delivery?' },
  { type:'sms',   from:'+1-617-555-8812', name:'Unknown', message:'Good morning, looking for a supplier of lumber and plywood for a furniture workshop in Cambridge. High daily volume. Are you able to supply regularly?' },
  { type:'inquiry', name:'Anthony Reynolds', email:'anthonyreynolds@arconstruction.com', company:'AR Construction', message:'Referred by Alice Reynolds. Need a quote for 200 bags cement and steel bars for a residential project. Can you send a price list?' },
  { type:'email', from:'supply@fortressconstruction.com', name:'Fortress Construction', subject:'Urgent restock needed', body:'We are running low on hollow blocks and sand on our active site. Can you deliver 2,000 pcs 4-inch hollow blocks and 5m3 sand by tomorrow morning? Same address as our last order.' },
  { type:'sms',   from:'+1-617-555-3394', name:'Unknown', message:'Hello, do you have Portland cement available? Need delivery today or tomorrow. About 20 bags.' },
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
