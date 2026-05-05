
// ════════════════════════════════════════════
//  DEPLOYMENT CONFIG
// ════════════════════════════════════════════
const CONFIG = {
  webhookUrl: '', // n8n removed — using Claude API directly
};

// ── Shared Data ─────────────────────────────
const MONTHS   = ['Oct','Nov','Dec','Jan','Feb','Mar'];
const REVENUE  = [485000, 520000, 610000, 478000, 543000, 587420];

// Full historical dataset for Analytics (multi-year)
const HIST = {
  '2025': {
    labels:  ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    revenue: [312000,298000,345000,380000,410000,395000,420000,445000,430000,485000,520000,610000]
  },
  '2026': {
    labels:  ['Jan','Feb','Mar'],
    revenue: [478000,543000,587420]
  }
};
// Category names + percentage split (used to compute per-category values dynamically)
const CAT_NAMES = ['Cement','Steel','Aggregates','Masonry','Wood/Metal'];
const CAT_PCT   = [0.34, 0.28, 0.12, 0.10, 0.16];
const CHART_COLORS = {
  black:  '#111111',
  dark:   '#3A3A3C',
  mid:    '#6B6B6D',
  light:  '#AEAEB2',
  pale:   '#D1D1D6',
  muted:  '#E5E5EA',
};

// ════════════════════════════════════════════
//  SALES — TABS, TARGET, QUOTATION, REPORTS
// ════════════════════════════════════════════

const PRODUCTS = [
  { name:'Portland Cement 40kg', unit:'bag',    price:240  },
  { name:'Steel Bar 10mm',       unit:'pc',     price:360  },
  { name:'Steel Bar 12mm',       unit:'pc',     price:520  },
  { name:'Steel Bar 16mm',       unit:'pc',     price:890  },
  { name:'Hollow Blocks 4"',    unit:'pc',     price:18   },
  { name:'Hollow Blocks 6"',    unit:'pc',     price:24   },
  { name:'River Sand',           unit:'m³',    price:1200 },
  { name:'Gravel 3/4"',         unit:'m³',    price:1400 },
  { name:'Plywood 3/4"',        unit:'sheet', price:1050 },
  { name:'GI Sheet 26GA',        unit:'sheet', price:480  },
  { name:'GI Sheet 24GA',        unit:'sheet', price:580  },
  { name:'Rebar Tie Wire',       unit:'kg',    price:75   },
  { name:'CHB Mortar',           unit:'bag',   price:280  },
  { name:'Lumber 2x3',          unit:'bd ft', price:45   },
];

const ORDERS_DATA = [
  { id:'#ORD-1043', date:'2026-03-19', customer:'ABC Construction Corp',      products:'Cement, Steel Bar 12mm',    amount:28500, payment:'Paid',    delivery:'Delivered' },
  { id:'#ORD-1042', date:'2026-03-18', customer:'Summit Builders',            products:'Hollow Blocks, Sand',       amount:14200, payment:'Pending', delivery:'In Transit' },
  { id:'#ORD-1041', date:'2026-03-17', customer:'Reynolds Development Group', products:'Plywood, GI Sheet',         amount:32800, payment:'Unpaid',  delivery:'Delivered' },
  { id:'#ORD-1040', date:'2026-03-16', customer:'Nevada Builders Inc',        products:'Steel Bar 16mm, Gravel',    amount:41600, payment:'Paid',    delivery:'Delivered' },
  { id:'#ORD-1039', date:'2026-03-15', customer:'GreenTech Construction',     products:'Portland Cement, Sand',     amount:22400, payment:'Paid',    delivery:'Delivered' },
  { id:'#ORD-1038', date:'2026-03-14', customer:'Mendez Construction',        products:'Portland Cement x80',       amount:19200, payment:'Unpaid',  delivery:'Pending'   },
  { id:'#ORD-1037', date:'2026-03-13', customer:'LJ Builders Corp',           products:'Steel Bar 10mm x100',       amount:36000, payment:'Paid',    delivery:'Delivered' },
  { id:'#ORD-1036', date:'2026-03-12', customer:'Fortress Construction',      products:'Gravel 10m3, Hollow Blocks',amount:18500, payment:'Paid',    delivery:'Delivered' },
  { id:'#ORD-1035', date:'2026-02-28', customer:'Nevada Builders Inc',        products:'Cement x200',               amount:48000, payment:'Paid',    delivery:'Delivered' },
  { id:'#ORD-1034', date:'2026-02-25', customer:'ABC Construction Corp',      products:'Steel Bar 12mm x50',        amount:27500, payment:'Paid',    delivery:'Delivered' },
  { id:'#ORD-1033', date:'2026-02-22', customer:'Summit Builders',            products:'Hollow Blocks, Sand',       amount:16800, payment:'Paid',    delivery:'Delivered' },
  { id:'#ORD-1032', date:'2026-02-18', customer:'Pacific Builders Corp',      products:'Portland Cement x150',      amount:36000, payment:'Unpaid',  delivery:'Delivered' },
  { id:'#ORD-1031', date:'2026-02-14', customer:'Golden Gate Contractors',    products:'GI Sheet 26GA x30',         amount:21600, payment:'Paid',    delivery:'Delivered' },
  { id:'#ORD-1030', date:'2026-02-10', customer:'Reynolds Development Group', products:'Plywood 3/4 x40',           amount:19200, payment:'Paid',    delivery:'Delivered' },
  { id:'#ORD-1025', date:'2026-01-28', customer:'Nevada Builders Inc',        products:'Cement x180, Gravel',       amount:44800, payment:'Paid',    delivery:'Delivered' },
  { id:'#ORD-1024', date:'2026-01-22', customer:'Allied Contractors',         products:'Steel Bar 16mm x60',        amount:38400, payment:'Paid',    delivery:'Delivered' },
  { id:'#ORD-1023', date:'2026-01-18', customer:'Mendez Construction',        products:'Portland Cement x100',      amount:24000, payment:'Unpaid',  delivery:'Delivered' },
  { id:'#ORD-1022', date:'2026-01-12', customer:'GreenTech Construction',     products:'Sand 15m3, Gravel 10m3',    amount:18600, payment:'Paid',    delivery:'Delivered' },
  { id:'#ORD-1021', date:'2026-01-08', customer:'Summit Builders',            products:'Steel Bar 10mm x80',        amount:28800, payment:'Paid',    delivery:'Delivered' },
];

// ════════════════════════════════════════════
//  DEMO SEED DATA — pre-populates HR, Leads, CRM
//  for first-run demo mode (loaded into localStorage)
// ════════════════════════════════════════════
const LOW_STOCK_THRESHOLD = 20;

const SEED_INVENTORY = [
  { name:'Portland Cement 40kg', unit:'bag',    price:240,  stock:8   },
  { name:'Steel Bar 10mm',       unit:'pc',     price:360,  stock:12  },
  { name:'Steel Bar 12mm',       unit:'pc',     price:520,  stock:45  },
  { name:'Steel Bar 16mm',       unit:'pc',     price:890,  stock:38  },
  { name:'Hollow Blocks 4"',    unit:'pc',     price:18,   stock:15  },
  { name:'Hollow Blocks 6"',    unit:'pc',     price:24,   stock:72  },
  { name:'River Sand',           unit:'m³',    price:1200, stock:30  },
  { name:'Gravel 3/4"',         unit:'m³',    price:1400, stock:25  },
  { name:'Plywood 3/4"',        unit:'sheet', price:1050, stock:60  },
  { name:'GI Sheet 26GA',        unit:'sheet', price:480,  stock:88  },
  { name:'GI Sheet 24GA',        unit:'sheet', price:580,  stock:54  },
  { name:'Rebar Tie Wire',       unit:'kg',    price:75,   stock:120 },
  { name:'CHB Mortar',           unit:'bag',   price:280,  stock:18  },
  { name:'Lumber 2x3',          unit:'bd ft', price:45,   stock:200 },
];

const SEED_EMPLOYEES = [
  { name:'Sarah Mitchell',  position:'Sales Manager',        status:'Present',  leave:3, salary:45000, mobile:'+1-617-555-0101', email:'smitchell@hiraya.com',  _key:'seed1' },
  { name:'James Reed',      position:'Warehouse Staff',      status:'Present',  leave:5, salary:22000, mobile:'+1-617-555-0102', email:'jreed@hiraya.com',      _key:'seed2' },
  { name:'Anna Clark',      position:'Accountant',           status:'On Leave', leave:0, salary:38000, mobile:'+1-617-555-0103', email:'aclark@hiraya.com',     _key:'seed3' },
  { name:'Robert Tang',     position:'Delivery Driver',      status:'Present',  leave:7, salary:20000, mobile:'+1-617-555-0104', email:'rtang@hiraya.com',      _key:'seed4' },
  { name:'Lisa Garcia',     position:'Customer Service',     status:'Present',  leave:4, salary:25000, mobile:'+1-617-555-0105', email:'lgarcia@hiraya.com',    _key:'seed5' },
  { name:'Mark Davis',      position:'Inventory Officer',    status:'Absent',   leave:2, salary:28000, mobile:'+1-617-555-0106', email:'mdavis@hiraya.com',     _key:'seed6' },
  { name:'Carol Flores',    position:'HR Officer',           status:'Present',  leave:6, salary:32000, mobile:'+1-617-555-0107', email:'cflores@hiraya.com',    _key:'seed7' },
  { name:'Dennis Mercer',   position:'Sales Representative', status:'Present',  leave:3, salary:24000, mobile:'+1-617-555-0108', email:'dmercer@hiraya.com',    _key:'seed8' },
];

const SEED_LEADS = [
  { company:'ABC Construction',       person:'John Smith',    type:'Contractor', mobile:'+1-617-555-1001', value:250000, status:'Hot',     assigned:'Sarah Mitchell', date:'2026-03-25', _key:'lead1' },
  { company:'Lopez Builders',         person:'Peter Lopez',   type:'Developer',  mobile:'+1-617-555-1002', value:180000, status:'Warm',    assigned:'Dennis Mercer',  date:'2026-03-22', _key:'lead2' },
  { company:'Tan Engineering',        person:'Robert Tang',   type:'Engineer',   mobile:'+1-617-555-1003', value:95000,  status:'Hot',     assigned:'Sarah Mitchell', date:'2026-03-28', _key:'lead3' },
  { company:'Crawford Hardware',      person:'Ben Crawford',  type:'Retailer',   mobile:'+1-617-555-1004', value:45000,  status:'Cold',    assigned:'Dennis Mercer',  date:'2026-03-10', _key:'lead4' },
  { company:'Reynolds Properties',    person:'Alice Reynolds',type:'Developer',  mobile:'+1-617-555-1005', value:320000, status:'Quoted',  assigned:'Sarah Mitchell', date:'2026-03-15', _key:'lead5' },
  { company:'Metro Developers Inc',   person:'Frank Martin',  type:'Developer',  mobile:'+1-617-555-1006', value:500000, status:'Warm',    assigned:'Dennis Mercer',  date:'2026-03-20', _key:'lead6' },
];

const SEED_CRM_CONTACTS = [
  { company:'ABC Construction',            person:'John Smith',     type:'Client',  phone:'+1-617-555-1001', email:'jsmith@abcconstruction.com',   _key:'crm1' },
  { company:'Lopez Builders',              person:'Peter Lopez',    type:'Client',  phone:'+1-617-555-1002', email:'plopez@lopezbuilders.com',      _key:'crm2' },
  { company:'Allied Supply Corp',          person:'Linda Baker',    type:'Partner', phone:'+1-617-555-2001', email:'lbaker@alliedsupply.com',       _key:'crm3' },
  { company:'Metro Hardware',              person:'Carlos Gomez',   type:'Client',  phone:'+1-617-555-2002', email:'cgomez@metrohardware.com',      _key:'crm4' },
  { company:'Tan Engineering',             person:'Robert Tang',    type:'Client',  phone:'+1-617-555-1003', email:'rtang@tanengineering.com',      _key:'crm5' },
  { company:'Pacific Cement Distributors', person:'Grace Lin',      type:'Partner', phone:'+1-617-555-3001', email:'glin@pacificcement.com',        _key:'crm6' },
  { company:'Reynolds Properties',         person:'Alice Reynolds', type:'Client',  phone:'+1-617-555-1005', email:'areynolds@reynoldsproperties.com',_key:'crm7' },
  { company:'National Steel Corp',         person:'Edwin Sorenson', type:'Partner', phone:'+1-617-555-3002', email:'esorenson@nationalsteel.com',   _key:'crm8' },
];
