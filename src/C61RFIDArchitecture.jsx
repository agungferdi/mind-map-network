import React, { useCallback, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './C61RFIDArchitecture.css';

const nodeDetails = {
  MAIN: {
    title: 'Chainway C61 RFID Write/Read App',
    category: 'Main Architecture',
    type: 'End-to-End Solution',
    description: 'Complete system architecture untuk Chainway C61 handheld RFID reader dengan kemampuan write EPC (text ke hex conversion), read tag, dan integrasi ke Odoo ERP untuk master data dan inventory management.',
    brand: 'Chainway + Custom Development',
    product: 'C61 RFID App with Odoo Integration',
    specs: [
      'Chainway C61 Handheld RFID Reader',
      'Text ↔ Hex Conversion Engine',
      'Local Validation & Caching',
      'REST API Gateway',
      'Middleware Business Logic',
      'Odoo ERP Integration (XML-RPC)',
      'Real-time Sync',
      'Offline Mode Support'
    ],
    additionalInfo: 'Sistem terintegrasi untuk operasi RFID di lapangan. User input text biasa, app otomatis convert ke hexadecimal yang valid untuk EPC. Semua data ter-sinkronisasi dengan Odoo untuk master data management dan reporting.'
  },

  L1_ANDROID: {
    title: 'Layer 1: Android App (C61)',
    category: 'Client Layer',
    type: 'Mobile Application',
    description: 'Android native app di Chainway C61 dengan Chainway RFID SDK untuk read/write operations. Menyediakan UI yang user-friendly untuk input data dan display results.',
    brand: 'Chainway',
    product: 'Chainway C61 + Custom Android App',
    specs: [
      'OS: Android 11/13',
      'RFID SDK: Chainway Java SDK',
      'UHF Gen2 Support',
      'Impinj E Series Chip',
      'Read Range: 0-25m',
      'Data Input: Text format',
      'Local Database: SQLite',
      'HTTP Client for API'
    ],
    additionalInfo: 'Chainway C61 adalah dedicated handheld RFID reader dengan built-in UHF module. App ini menggunakan Chainway RFID SDK (Java-based) untuk hardware communication. Menyimpan data lokal di SQLite untuk offline mode.'
  },

  L1_TEXT_HEX: {
    title: 'Text ↔ Hex Converter',
    category: 'Data Processing',
    type: 'Conversion Engine',
    description: 'Module untuk convert text input ke hexadecimal format yang valid untuk EPC standard. Termasuk validation untuk panjang data, allowed characters, dan format compliance.',
    brand: 'Custom Component',
    product: 'Text-Hex Conversion Library',
    specs: [
      'Input: Plain text (ASCII)',
      'Output: Valid Hex string',
      'EPC Standard: Compliance check',
      'Length Validation: Max 96-bit',
      'Character Filtering: Allowed chars only',
      'Error Handling: User feedback',
      'Bi-directional: Text ↔ Hex'
    ],
    additionalInfo: 'User bisa input text biasa, misal: "PROD-SKU-001" → convert ke hex → write ke tag. Sebaliknya saat read tag, hex otomatis convert kembali ke text untuk display. Validation memastikan format valid sesuai EPC Gen2 standard (96-bit).'
  },

  L1_RFID_OPS: {
    title: 'RFID Read/Write Operations',
    category: 'Hardware Interface',
    type: 'RFID Module',
    description: 'Direct integration dengan Chainway C61 RFID hardware menggunakan Chainway Java SDK. Handle untuk read existing tags dan write new EPC data.',
    brand: 'Chainway',
    product: 'Chainway RFID SDK (Java)',
    specs: [
      'RFID Frequency: 902-928 MHz',
      'Protocol: EPC Gen2',
      'Read Mode: Single/Bulk',
      'Write Mode: EPC + User Memory',
      'Power Control: Adjustable',
      'Antenna: Tunable',
      'Error Recovery: Retry logic',
      'Performance: 1300+ tags/sec'
    ],
    additionalInfo: 'Chainway RFID SDK menyediakan Java interface untuk hardware operations. Read operation bisa detect multiple tags atau single tag. Write operation harus pass EPC dalam hex format yang valid.'
  },

  L1_LOCAL_CACHE: {
    title: 'Local Caching & Validation',
    category: 'Data Management',
    type: 'Offline Storage',
    description: 'SQLite database lokal di device untuk caching read data, pending writes, dan operation logs. Enable offline mode dan sync saat connection available.',
    brand: 'Custom Component',
    product: 'Local Data Layer (SQLite)',
    specs: [
      'Database: SQLite',
      'Tables: Tags, Operations, Logs',
      'Sync Status: Tracked per record',
      'Conflict Resolution: Last-write-wins',
      'Data Validation: Local rules',
      'Encryption: Optional AES',
      'Offline Support: Full capability',
      'Sync Queue: Persistent'
    ],
    additionalInfo: 'Menyimpan history operasi RFID (read/write) dengan status sync. User bisa work offline, semua data akan di-queue dan sync otomatis saat online. Local validation memastikan data quality sebelum send ke server.'
  },

  L2_MIDDLEWARE: {
    title: 'Layer 2: Middleware Server',
    category: 'Business Logic Layer',
    type: 'API Gateway & Processing',
    description: 'Backend server yang menerima data dari C61 app melalui REST API. Melakukan business logic validation, logging, dan preparing data untuk Odoo integration.',
    brand: 'Custom Development',
    product: 'Middleware (Node.js / Python)',
    specs: [
      'Framework: Express.js / FastAPI',
      'REST API: Endpoints untuk read/write',
      'Authentication: JWT / OAuth2',
      'Rate Limiting: Per device/user',
      'Data Validation: Schema validation',
      'Error Handling: Comprehensive',
      'Logging: ELK Stack compatible',
      'Queue: Redis for async jobs'
    ],
    additionalInfo: 'Middleware berfungsi sebagai jembatan antara C61 app dan Odoo ERP. Handle business logic seperti SKU validation, inventory checking, user authorization. Menyimpan audit trail lengkap untuk compliance.'
  },

  L2_HEX_VALIDATION: {
    title: 'Hex Format Validation',
    category: 'Business Logic',
    type: 'Data Verification',
    description: 'Server-side validation untuk memastikan hex data valid sesuai EPC standard sebelum diterima dari app atau dikirim ke Odoo.',
    brand: 'Custom Component',
    product: 'Hex Validator Service',
    specs: [
      'EPC Class: GEN2',
      'Bit Length: 96-bit standard',
      'Format: 24 hex chars (96-bit)',
      'Check Digit: Optional validation',
      'Range Check: Valid hex values',
      'Business Rules: SKU format',
      'Error Messages: Detailed feedback',
      'Logging: All validation attempts'
    ],
    additionalInfo: 'Double-check di server memastikan integrity. Validasi format EPC (24 karakter hex = 96 bit), structure sesuai business rules, dan consistency dengan master data di Odoo.'
  },

  L2_TAG_HISTORY: {
    title: 'Tag History & Audit Log',
    category: 'Data Persistence',
    type: 'Logging System',
    description: 'Menyimpan complete history setiap operasi RFID (read/write) termasuk timestamp, operator, device ID, dan hasil operasi untuk audit trail dan troubleshooting.',
    brand: 'Custom Component',
    product: 'Audit Log Database',
    specs: [
      'Database: PostgreSQL',
      'Storage: Operation logs',
      'Retention: 2+ years',
      'Indexing: Date, operator, tag',
      'Query: Fast historical search',
      'Export: CSV/JSON format',
      'Compliance: Full audit trail',
      'Encryption: At rest + in transit'
    ],
    additionalInfo: 'Setiap kali C61 melakukan read atau write, event terekam di middleware dengan detail lengkap. Membantu untuk troubleshooting masalah, compliance audit, dan performance analysis.'
  },

  L3_ODOO: {
    title: 'Layer 3: Odoo ERP',
    category: 'Master Data & Reporting',
    type: 'Business System',
    description: 'Odoo ERP sebagai single source of truth untuk master data (products, SKUs, inventory). Middleware sync read/write results ke Odoo dan fetch master data untuk validation.',
    brand: 'Odoo',
    product: 'Odoo (Community / Enterprise)',
    specs: [
      'Module: Inventory + Stock',
      'API: XML-RPC',
      'Authentication: API Key',
      'Data: Products, SKUs, Locations',
      'Sync Direction: Bidirectional',
      'Update Frequency: Real-time',
      'Barcode Module: Integration',
      'Reporting: Standard reports'
    ],
    additionalInfo: 'Odoo menjadi master repository untuk product master data, SKU, inventory levels, dan locations. Middleware query Odoo untuk validate SKU saat write operation, dan update inventory saat tag dibaca di lokasi tertentu.'
  },

  L3_SKU_LOOKUP: {
    title: 'SKU Master Data Lookup',
    category: 'Data Reference',
    type: 'Master Data Management',
    description: 'Middleware fetch product/SKU master data dari Odoo untuk validation dan enrichment. Memastikan setiap tag yang ditulis terhubung dengan valid SKU di system.',
    brand: 'Odoo',
    product: 'Odoo Inventory Module',
    specs: [
      'Data Model: products.product',
      'Fields: ID, SKU, EAN13, Name',
      'Custom Field: EPC hex',
      'Lookup: By SKU or EPC',
      'Caching: Redis cache (5min)',
      'Fallback: Local reference',
      'Error Handling: Graceful'
    ],
    additionalInfo: 'Saat user input text "PROD-SKU-001", middleware lookup di Odoo untuk confirm SKU valid. Jika valid, get master data (nama produk, kategori, harga). Jika tidak valid, reject dengan error message.'
  },

  L3_INVENTORY_SYNC: {
    title: 'Inventory Real-time Sync',
    category: 'Data Synchronization',
    type: 'Integration Point',
    description: 'Update inventory levels di Odoo real-time saat tag dibaca di warehouse locations. Memastikan stock levels selalu accurate dan up-to-date.',
    brand: 'Odoo',
    product: 'Odoo Stock Module + Custom Integration',
    specs: [
      'Method: XML-RPC API call',
      'Event: RFID tag read',
      'Action: Increase stock at location',
      'Quantity: Adjustable per operation',
      'Movement Type: Auto-detected',
      'Timestamp: Server clock',
      'Status: Atomic transaction',
      'Rollback: On error'
    ],
    additionalInfo: 'Setiap tag yang dibaca di receiving location → update stock di Odoo inventory. Setiap tag ditulis → create stock movement untuk write-off atau relocation. Inventory accuracy terjaga real-time.'
  },

  FLOW_WRITE: {
    title: 'Write Flow: Text → Hex → Tag',
    category: 'Operation Flow',
    type: 'Write Process',
    description: 'Complete flow untuk write operation: user input text → convert hex → validate → write ke tag → confirm & sync ke Odoo.',
    brand: 'Process',
    product: 'Write Operation Flow',
    specs: [
      '1. User input text (SKU)',
      '2. Local format validation',
      '3. Send to middleware',
      '4. Server hex validation',
      '5. Odoo SKU lookup',
      '6. Format hex command',
      '7. Write to C61 device',
      '8. Confirm write success',
      '9. Create inventory movement',
      '10. Return to app'
    ],
    additionalInfo: 'Write operation melibatkan multiple validation steps untuk memastikan integrity. Jika ada error di any step, rollback dan provide clear error message ke user.'
  },

  FLOW_READ: {
    title: 'Read Flow: Tag → Hex → Text',
    category: 'Operation Flow',
    type: 'Read Process',
    description: 'Complete flow untuk read operation: scan tag dengan C61 → receive hex → convert text → validate dengan Odoo → update inventory → display result.',
    brand: 'Process',
    product: 'Read Operation Flow',
    specs: [
      '1. C61 scan tag (antenna)',
      '2. Receive hex data',
      '3. Convert hex to text',
      '4. Local validation',
      '5. Send to middleware',
      '6. Odoo SKU lookup',
      '7. Check inventory',
      '8. Update stock level',
      '9. Create stock move',
      '10. Display result to user'
    ],
    additionalInfo: 'Read operation cepat dan real-time. Middleware validate EPC hex dan fetch product details dari Odoo untuk display. Stock level update instantly untuk accurate inventory.'
  },

  TECH_STACK: {
    title: 'Technology Stack',
    category: 'Technical Details',
    type: 'Implementation',
    description: 'Recommended technology stack untuk full solution implementation.',
    brand: 'Multi-vendor',
    product: 'Technology Recommendations',
    specs: [
      'Mobile: Android (Java/Kotlin)',
      'RFID SDK: Chainway Java SDK',
      'Middleware: Node.js + Express.js',
      'Cache: Redis',
      'Database: PostgreSQL + SQLite',
      'Message Queue: RabbitMQ',
      'ERP: Odoo (Python)',
      'API: REST + XML-RPC'
    ],
    additionalInfo: 'Stack yang proven dan scalable. Node.js untuk middleware karena high throughput. PostgreSQL untuk production database. Redis untuk caching dan session. RabbitMQ untuk async job processing. Odoo untuk ERP.'
  },

  BEST_PRACTICE: {
    title: 'Architecture Best Practices',
    category: 'Design Principles',
    type: 'Guidelines',
    description: 'Key architectural decisions dan best practices untuk robust dan maintainable system.',
    brand: 'Architecture Patterns',
    product: 'Best Practices',
    specs: [
      'Separation of Concerns: 3-layer',
      'API First: REST endpoints',
      'Local Validation: Before send',
      'Offline First: Sync when online',
      'Idempotency: Safe retries',
      'Error Handling: Graceful degradation',
      'Logging: Comprehensive audit',
      'Security: Authentication + Encryption'
    ],
    additionalInfo: 'Design pattern mengikuti industry best practices. 3-layer architecture (client, middleware, ERP) memudahkan scaling dan maintenance. Offline-first approach memastikan reliability di field.'
  }
};

const initialNodes = [
  // Main Hub
  {
    id: 'MAIN',
    type: 'default',
    data: { label: 'C61 RFID\nWrite/Read\nApp' },
    position: { x: 400, y: 0 },
    style: {
      background: '#FF6B6B',
      color: 'white',
      border: '3px solid #ef5b5b',
      borderRadius: '12px',
      padding: '15px',
      fontSize: '13px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '180px',
      boxShadow: '0 0 30px rgba(255, 107, 107, 0.8)'
    }
  },

  // Layer 1: Android App
  {
    id: 'L1_ANDROID',
    type: 'default',
    data: { label: 'Layer 1:\nAndroid App\n(C61)' },
    position: { x: 100, y: 120 },
    style: {
      background: '#4ECDC4',
      color: 'white',
      border: '2px solid #3ebcb4',
      borderRadius: '10px',
      padding: '12px',
      fontSize: '11px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '120px'
    }
  },

  {
    id: 'L1_TEXT_HEX',
    type: 'default',
    data: { label: 'Text ↔\nHex\nConverter' },
    position: { x: 250, y: 120 },
    style: {
      background: '#95E1D3',
      color: '#333',
      border: '2px solid #85d1c3',
      borderRadius: '10px',
      padding: '12px',
      fontSize: '11px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '120px'
    }
  },

  {
    id: 'L1_RFID_OPS',
    type: 'default',
    data: { label: 'RFID\nRead/Write\nOps' },
    position: { x: 400, y: 120 },
    style: {
      background: '#4ECDC4',
      color: 'white',
      border: '2px solid #3ebcb4',
      borderRadius: '10px',
      padding: '12px',
      fontSize: '11px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '120px'
    }
  },

  {
    id: 'L1_LOCAL_CACHE',
    type: 'default',
    data: { label: 'Local Cache\n& Validation\n(SQLite)' },
    position: { x: 550, y: 120 },
    style: {
      background: '#95E1D3',
      color: '#333',
      border: '2px solid #85d1c3',
      borderRadius: '10px',
      padding: '12px',
      fontSize: '11px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '120px'
    }
  },

  // Layer 2: Middleware
  {
    id: 'L2_MIDDLEWARE',
    type: 'default',
    data: { label: 'Layer 2:\nMiddleware\nServer' },
    position: { x: 100, y: 280 },
    style: {
      background: '#F7DC6F',
      color: '#333',
      border: '2px solid #e7cc5f',
      borderRadius: '10px',
      padding: '12px',
      fontSize: '11px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '120px'
    }
  },

  {
    id: 'L2_HEX_VALIDATION',
    type: 'default',
    data: { label: 'Hex Format\nValidation' },
    position: { x: 250, y: 280 },
    style: {
      background: '#FFB347',
      color: 'white',
      border: '2px solid #ef9337',
      borderRadius: '10px',
      padding: '12px',
      fontSize: '11px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '120px'
    }
  },

  {
    id: 'L2_TAG_HISTORY',
    type: 'default',
    data: { label: 'Tag History\n& Audit Log' },
    position: { x: 400, y: 280 },
    style: {
      background: '#FFB347',
      color: 'white',
      border: '2px solid #ef9337',
      borderRadius: '10px',
      padding: '12px',
      fontSize: '11px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '120px'
    }
  },

  // Layer 3: Odoo
  {
    id: 'L3_ODOO',
    type: 'default',
    data: { label: 'Layer 3:\nOdoo ERP' },
    position: { x: 100, y: 440 },
    style: {
      background: '#9D6BFF',
      color: 'white',
      border: '2px solid #8d5bef',
      borderRadius: '10px',
      padding: '12px',
      fontSize: '11px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '120px'
    }
  },

  {
    id: 'L3_SKU_LOOKUP',
    type: 'default',
    data: { label: 'SKU Master\nData Lookup' },
    position: { x: 250, y: 440 },
    style: {
      background: '#C39BD3',
      color: 'white',
      border: '2px solid #b88cc4',
      borderRadius: '10px',
      padding: '12px',
      fontSize: '11px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '120px'
    }
  },

  {
    id: 'L3_INVENTORY_SYNC',
    type: 'default',
    data: { label: 'Inventory\nReal-time Sync' },
    position: { x: 400, y: 440 },
    style: {
      background: '#C39BD3',
      color: 'white',
      border: '2px solid #b88cc4',
      borderRadius: '10px',
      padding: '12px',
      fontSize: '11px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '120px'
    }
  },

  // Operation Flows
  {
    id: 'FLOW_WRITE',
    type: 'default',
    data: { label: 'Write Flow:\nText → Hex\n→ Tag' },
    position: { x: 550, y: 280 },
    style: {
      background: '#FF9999',
      color: 'white',
      border: '2px solid #ef8989',
      borderRadius: '10px',
      padding: '12px',
      fontSize: '10px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '110px'
    }
  },

  {
    id: 'FLOW_READ',
    type: 'default',
    data: { label: 'Read Flow:\nTag → Hex\n→ Text' },
    position: { x: 550, y: 360 },
    style: {
      background: '#FF9999',
      color: 'white',
      border: '2px solid #ef8989',
      borderRadius: '10px',
      padding: '12px',
      fontSize: '10px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '110px'
    }
  },

  // Tech Stack & Best Practices
  {
    id: 'TECH_STACK',
    type: 'default',
    data: { label: 'Technology\nStack' },
    position: { x: 700, y: 200 },
    style: {
      background: '#85C1E2',
      color: 'white',
      border: '2px solid #75b1d2',
      borderRadius: '10px',
      padding: '12px',
      fontSize: '11px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '110px'
    }
  },

  {
    id: 'BEST_PRACTICE',
    type: 'default',
    data: { label: 'Best\nPractices' },
    position: { x: 700, y: 300 },
    style: {
      background: '#85C1E2',
      color: 'white',
      border: '2px solid #75b1d2',
      borderRadius: '10px',
      padding: '12px',
      fontSize: '11px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '110px'
    }
  }
];

const initialEdges = [
  // Main to Layer 1
  { id: 'MAIN-L1_ANDROID', source: 'MAIN', target: 'L1_ANDROID', animated: true, style: { stroke: '#FF6B6B', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#FF6B6B' } },
  { id: 'MAIN-L1_TEXT_HEX', source: 'MAIN', target: 'L1_TEXT_HEX', animated: true, style: { stroke: '#FF6B6B', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#FF6B6B' } },
  { id: 'MAIN-L1_RFID_OPS', source: 'MAIN', target: 'L1_RFID_OPS', animated: true, style: { stroke: '#FF6B6B', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#FF6B6B' } },
  { id: 'MAIN-L1_LOCAL_CACHE', source: 'MAIN', target: 'L1_LOCAL_CACHE', animated: true, style: { stroke: '#FF6B6B', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#FF6B6B' } },

  // Layer 1 to Layer 2 (via REST API)
  { id: 'L1_ANDROID-L2_MIDDLEWARE', source: 'L1_ANDROID', target: 'L2_MIDDLEWARE', label: 'REST API', animated: true, style: { stroke: '#4ECDC4', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#4ECDC4' } },
  { id: 'L1_LOCAL_CACHE-L2_MIDDLEWARE', source: 'L1_LOCAL_CACHE', target: 'L2_MIDDLEWARE', label: 'Sync queue', animated: true, style: { stroke: '#95E1D3', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#95E1D3' } },

  // Layer 2 Components
  { id: 'L2_MIDDLEWARE-L2_HEX_VALIDATION', source: 'L2_MIDDLEWARE', target: 'L2_HEX_VALIDATION', animated: false, style: { stroke: '#F7DC6F', strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#F7DC6F' } },
  { id: 'L2_MIDDLEWARE-L2_TAG_HISTORY', source: 'L2_MIDDLEWARE', target: 'L2_TAG_HISTORY', animated: false, style: { stroke: '#F7DC6F', strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#F7DC6F' } },

  // Layer 2 to Layer 3 (via XML-RPC)
  { id: 'L2_MIDDLEWARE-L3_ODOO', source: 'L2_MIDDLEWARE', target: 'L3_ODOO', label: 'XML-RPC API', animated: true, style: { stroke: '#FFB347', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#FFB347' } },
  { id: 'L2_HEX_VALIDATION-L3_SKU_LOOKUP', source: 'L2_HEX_VALIDATION', target: 'L3_SKU_LOOKUP', animated: false, style: { stroke: '#FFB347', strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#FFB347' } },
  { id: 'L2_TAG_HISTORY-L3_INVENTORY_SYNC', source: 'L2_TAG_HISTORY', target: 'L3_INVENTORY_SYNC', animated: false, style: { stroke: '#FFB347', strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#FFB347' } },

  // Operation Flows
  { id: 'L1_TEXT_HEX-FLOW_WRITE', source: 'L1_TEXT_HEX', target: 'FLOW_WRITE', animated: true, label: 'Input', style: { stroke: '#FF9999', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#FF9999' } },
  { id: 'L1_RFID_OPS-FLOW_READ', source: 'L1_RFID_OPS', target: 'FLOW_READ', animated: true, label: 'Scan', style: { stroke: '#FF9999', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#FF9999' } },
  { id: 'FLOW_WRITE-L2_MIDDLEWARE', source: 'FLOW_WRITE', target: 'L2_MIDDLEWARE', animated: true, style: { stroke: '#FF9999', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#FF9999' } },
  { id: 'FLOW_READ-L2_MIDDLEWARE', source: 'FLOW_READ', target: 'L2_MIDDLEWARE', animated: true, style: { stroke: '#FF9999', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#FF9999' } },

  // Tech Stack & Best Practices
  { id: 'MAIN-TECH_STACK', source: 'MAIN', target: 'TECH_STACK', animated: false, style: { stroke: '#85C1E2', strokeWidth: 2, strokeDasharray: '5,5' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#85C1E2' } },
  { id: 'L2_MIDDLEWARE-BEST_PRACTICE', source: 'L2_MIDDLEWARE', target: 'BEST_PRACTICE', animated: false, style: { stroke: '#85C1E2', strokeWidth: 2, strokeDasharray: '5,5' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#85C1E2' } }
];

function C61RFIDArchitecture() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const onConnect = useCallback(
    (params) => setEdges((eds) => [...eds, params]),
    [setEdges]
  );

  const handleNodeClick = (nodeId) => {
    setSelectedNode(nodeDetails[nodeId]);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedNode(null);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div className="header">
        <h1>Chainway C61 RFID Write/Read Architecture</h1>
        <p>3-Layer Architecture: Android App (Text↔Hex Conversion) → Middleware (Business Logic) → Odoo ERP (Master Data & Inventory)</p>
      </div>

      <ReactFlow
        nodes={nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            onClick: () => handleNodeClick(node.id)
          }
        }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(event, node) => handleNodeClick(node.id)}
        fitView
        attributionPosition="bottom-left"
      >
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            return node.style.background;
          }}
          nodeStrokeWidth={2}
          zoomable
          pannable
        />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>

      {/* Modal Popup */}
      {showModal && selectedNode && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>✕</button>
            
            <div className="modal-header">
              <h2>{selectedNode.title}</h2>
              <span className="modal-category">{selectedNode.category}</span>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h4>Deskripsi</h4>
                <p>{selectedNode.description}</p>
              </div>

              <div className="modal-section">
                <h4>Brand & Produk</h4>
                <p><strong>Brand:</strong> {selectedNode.brand}</p>
                <p><strong>Produk:</strong> {selectedNode.product}</p>
              </div>

              <div className="modal-section">
                <h4>Spesifikasi</h4>
                <ul>
                  {selectedNode.specs.map((spec, idx) => (
                    <li key={idx}>{spec}</li>
                  ))}
                </ul>
              </div>

              <div className="modal-section">
                <h4>Informasi Tambahan</h4>
                <p>{selectedNode.additionalInfo}</p>
              </div>

              <div className="modal-section">
                <h4>Tipe</h4>
                <p><strong>{selectedNode.type}</strong></p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="legend">
        <h3>Legend</h3>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#FF6B6B' }}></span>
          <span>Main / Hub</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#4ECDC4' }}></span>
          <span>Layer 1 (Android)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#F7DC6F' }}></span>
          <span>Layer 2 (Middleware)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#9D6BFF' }}></span>
          <span>Layer 3 (Odoo ERP)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#FF9999' }}></span>
          <span>Operation Flows</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#85C1E2' }}></span>
          <span>Support Components</span>
        </div>
      </div>
    </div>
  );
}

export default C61RFIDArchitecture;
