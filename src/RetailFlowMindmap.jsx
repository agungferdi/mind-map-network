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
import './RetailFlowMindmap.css';

const nodeDetails = {
  MAIN: {
    title: 'Retail Flow with AIDC',
    category: 'Main Flow',
    type: 'Automatic Identification & Data Capture',
    description: 'Complete retail transaction journey mengintegrasikan teknologi Checkpoint RFID, POS+ System, dan Chainway RFID readers dari receiving hingga post-sale operations.',
    vendor: 'Integrated Ecosystem',
    product: 'Checkpoint + POS+ + Chainway Integration',
    specs: [
      'RFID Labels & Tags (Checkpoint)',
      'POS+ Terminals & Kiosks',
      'Chainway Handheld/Fixed RFID Readers',
      'Real-time Inventory Management',
      'Loss Prevention & Security'
    ],
    additionalInfo: 'End-to-end retail solution dengan automation penuh dari receiving warehouse hingga customer checkout dan post-sale reconciliation.'
  },

  PHASE1: {
    title: 'Phase 1: Receiving & Warehouse',
    category: 'Warehouse Operations',
    type: 'Product Receiving',
    description: 'Tahap penerimaan barang dari supplier dengan RFID tagging dan scanning menggunakan Chainway devices.',
    vendor: 'Checkpoint + Chainway',
    product: 'RFID Labels + Chainway Readers',
    specs: [
      'Product Tagging dengan Checkpoint RFID Labels',
      'EPC (Electronic Product Code) Encoding',
      'Chainway C72/C5/C75 Handheld Readers',
      'Batch Reading untuk Multiple Items',
      'Real-time WMS Data Sync'
    ],
    additionalInfo: 'Barang diterima dengan RFID tags sudah attached. Chainway readers membaca batch items, menyimpan data di WMS secara otomatis tanpa manual data entry.'
  },

  RECEIVING: {
    title: 'Receiving Scan',
    category: 'Step 1',
    type: 'Data Capture',
    description: 'Warehouse staff menggunakan Chainway handheld readers untuk scan incoming items.',
    vendor: 'Chainway',
    product: 'Chainway C72/C5 Handheld RFID Reader',
    specs: [
      'Multiple Tag Reading',
      'Batch Processing Capability',
      'Real-time Data Sync',
      '30m Read Range',
      '1300+ tags/detik'
    ],
    additionalInfo: 'Operator scan setiap pallet/carton dengan reader. Sistem otomatis mencatat kehadiran barang tanpa perlu stop aliran barang.'
  },

  TAGGING: {
    title: 'Product Tagging',
    category: 'Step 0',
    type: 'Source Tagging',
    description: 'Setiap item dilengkapi dengan Checkpoint RFID Label dari supplier atau di receiving dock.',
    vendor: 'Checkpoint',
    product: 'Checkpoint Intelligent RFID Labels',
    specs: [
      'Multi-format Labels',
      'Item-level Tracking',
      'EPC Standard Compliant',
      'High Detection Rate',
      'Multiple Tech Options (RFID+EAS)'
    ],
    additionalInfo: 'Label dirancang khusus untuk item. Setiap label memiliki unique EPC code yang dapat dilacak di seluruh supply chain.'
  },

  PHASE2: {
    title: 'Phase 2: Stocking & Merchandising',
    category: 'Store Operations',
    type: 'Inventory Management',
    description: 'Tahap memindahkan barang dari receiving ke shelf dan monitoring merchandise display.',
    vendor: 'Checkpoint + Chainway + POS+',
    product: 'SFERO + Chainway Readers + POS+ System',
    specs: [
      'Real-time Location Tracking',
      'Planogram Compliance Monitoring',
      'Display Management',
      'Stock Level Alerts',
      'Inventory Visibility'
    ],
    additionalInfo: 'Barang dipindahkan ke shelf dengan lokasi tercatat. Checkpoint SFERO dan Chainway readers memantau pergerakan barang dan ketersediaan stok.'
  },

  STOCKING: {
    title: 'Stocking to Shelves',
    category: 'Step 2',
    type: 'Merchandise Placement',
    description: 'Staff menempatkan barang ke shelf dengan scanning lokasi menggunakan Chainway readers.',
    vendor: 'Chainway + Checkpoint',
    product: 'Chainway Handheld + SFERO Monitoring',
    specs: [
      'Item to Location Mapping',
      'Timestamp Recording',
      'Mobile Tablet Support (MC50)',
      'Real-time Location Display',
      'Misplaced Item Detection'
    ],
    additionalInfo: 'Setiap item di-scan saat placement ke shelf. Data tersimpan: Item ID, Lokasi, Waktu. Chainway MC50 tablet menampilkan lokasi mapping real-time.'
  },

  MONITORING: {
    title: 'Display Monitoring',
    category: 'Step 3',
    type: 'Continuous Tracking',
    description: 'Checkpoint SFERO system dan Chainway readers memantau pergerakan barang secara real-time.',
    vendor: 'Checkpoint + Chainway',
    product: 'SFERO System + Chainway Fixed Readers',
    specs: [
      'Real-time Movement Detection',
      '95%+ Detection Rate',
      'Section-based Inventory',
      'Automatic Stock Alerts',
      'Planogram Compliance Check'
    ],
    additionalInfo: 'Sistem otomatis mendeteksi setiap pergerakan barang. Alert muncul jika stock rendah atau barang tidak sesuai planogram.'
  },

  PHASE3: {
    title: 'Phase 3: Customer Shopping',
    category: 'Sales Operations',
    type: 'Customer Interaction',
    description: 'Tahap customer browsing, memilih produk, dan melakukan transaksi di checkout.',
    vendor: 'Checkpoint + POS+ + Chainway',
    product: 'SFERO + POS+ Kiosk/Terminal + Chainway Readers',
    specs: [
      'Real-time Item Detection',
      'Multiple Checkout Options',
      'Payment Methods Integration',
      'Receipt Generation',
      'Transaction Logging'
    ],
    additionalInfo: 'Customer browse produk. Checkpoint SFERO mendeteksi pergerakan item. Checkout dilakukan via POS+ kiosk atau cashier terminal.'
  },

  BROWSING: {
    title: 'Customer Browsing',
    category: 'Step 4',
    type: 'Shopping Phase',
    description: 'Customer melihat dan mengambil produk dari shelf untuk dibeli.',
    vendor: 'Checkpoint',
    product: 'Checkpoint SFERO/G36 Antennas',
    specs: [
      'Invisible Detection',
      'Movement Tracking',
      'Behavior Analytics',
      'No Intrusive Surveillance',
      'Real-time Section Inventory'
    ],
    additionalInfo: 'Saat customer mengambil barang, antenna Checkpoint otomatis mendeteksi pergerakan. Data terekam untuk analytics dan inventory.'
  },

  CHECKOUT_SELF: {
    title: 'Self-Checkout (Option 1)',
    category: 'Step 5A',
    type: 'Payment Processing',
    description: 'Customer melakukan scan dan pembayaran sendiri menggunakan POS+ Kiosk dengan optional Chainway reader integration.',
    vendor: 'POS+ + Chainway (Optional)',
    product: 'POS+ Self-Service Kiosk + Chainway R6/C72',
    specs: [
      'Touchscreen Interface',
      'Barcode/RFID Scanning',
      'Multiple Payment Methods',
      'Receipt Printing',
      'Transaction Recording'
    ],
    additionalInfo: 'Customer scan item via barcode. Optional RFID scan untuk dual-verification. Bayar via cash/card/digital. Receipt otomatis tercetak.'
  },

  CHECKOUT_CASHIER: {
    title: 'Cashier Checkout (Option 2)',
    category: 'Step 5B',
    type: 'Payment Processing',
    description: 'Cashier memproses pembayaran menggunakan POS+ Terminal Series A/AO dengan scanning items.',
    vendor: 'POS+',
    product: 'POS+ Terminal Series A/AO',
    specs: [
      'Barcode Scanner Integration',
      'Optional RFID Reader',
      'Multi-payment Support',
      'Thermal Receipt Printer',
      'Facial Recognition (A9)'
    ],
    additionalInfo: 'Cashier scan item via barcode. Optional Chainway reader untuk dual-verification via RFID. Multiple payment options. Receipt dengan item + RFID info.'
  },

  PHASE4: {
    title: 'Phase 4: Exit & Security',
    category: 'Loss Prevention',
    type: 'Security Verification',
    description: 'Tahap verifikasi barang di exit gate untuk memastikan semua items sudah ter-verify dan dibayar.',
    vendor: 'Checkpoint + Chainway',
    product: 'SFERO/G36 + Chainway UR4/UR8/URA4',
    specs: [
      'Automated Exit Detection',
      '95%+ Detection Rate',
      'Directional Awareness (Wirama Radar)',
      'Tag Validation Against Receipt',
      'Instant Alert System'
    ],
    additionalInfo: 'Setiap barang yang keluar melewati antenna Checkpoint & Chainway readers. Sistem validasi otomatis: Tag di receipt? ✓ Unpaid item? → ALARM.'
  },

  EXIT_GATE: {
    title: 'Exit Gate Verification',
    category: 'Step 6',
    type: 'Security Check',
    description: 'Sistem exit gate membaca RFID tags dan validasi terhadap paid items dari receipt.',
    vendor: 'Checkpoint + Chainway',
    product: 'SFERO/G36 Antennas + Chainway UR4/UR8',
    specs: [
      '>95% Detection Rate',
      'Directional Detection',
      'Multi-tag Reading',
      'Real-time Validation',
      'Forensic Data Recording'
    ],
    additionalInfo: 'Exit antennas membaca semua tags keluar. System match dengan receipt items. Discrepancy → trigger alarm. Staff lakukan courtesy checkout atau prevention.'
  },

  VALIDATION: {
    title: 'Validation Logic',
    category: 'Step 6A',
    type: 'System Processing',
    description: 'Sistem otomatis memvalidasi setiap item yang keluar terhadap receipt yang sudah dibayar.',
    vendor: 'Custom Middleware',
    product: 'RFID Middleware Validation Engine',
    specs: [
      'Match: Tag in paid items',
      'Mismatch: Unpaid item alert',
      'Directional: Into/Out/Along door',
      'Forensic: Tag ID, timestamp, location',
      'Exception Handling'
    ],
    additionalInfo: 'Validasi dilakukan real-time. Jika ada mismatch, system trigger alert dan staff siap intercept barang sebelum keluar.'
  },

  PHASE5: {
    title: 'Phase 5: Post-Sale & Reconciliation',
    category: 'Analytics & Reporting',
    type: 'Data Processing',
    description: 'Tahap finalisasi transaksi, inventory update, dan reporting untuk analytics dan loss prevention.',
    vendor: 'Checkpoint + Chainway + Custom System',
    product: 'Integrated Analytics Platform',
    specs: [
      'Inventory Update Automation',
      'Cycle Count & Audit',
      'Loss Prevention Investigation',
      'Real-time Reporting',
      'Shrinkage Tracking'
    ],
    additionalInfo: 'Setelah customer keluar, sistem update inventory secara otomatis. Data dianalisis untuk shrinkage tracking dan loss prevention insights.'
  },

  INVENTORY_UPDATE: {
    title: 'Inventory Update',
    category: 'Step 7',
    type: 'Data Processing',
    description: 'POS system dan exit readers update inventory count secara real-time setelah customer keluar.',
    vendor: 'POS+ + Checkpoint',
    product: 'Inventory Management System',
    specs: [
      'Automatic Stock Deduction',
      'Exit Reader Confirmation',
      'Real-time Sync',
      'Discrepancy Detection',
      '98%+ Accuracy'
    ],
    additionalInfo: 'Saat customer keluar dengan barang yang sudah dibayar, inventory secara otomatis dikurangi. Final reconciliation instant.'
  },

  CYCLE_COUNT: {
    title: 'Cycle Count & Audit',
    category: 'Step 8',
    type: 'Periodic Inventory',
    description: 'Staff melakukan physical count menggunakan Chainway handheld readers untuk verifikasi inventory accuracy.',
    vendor: 'Chainway',
    product: 'Chainway C5/C72 Handheld RFID Readers',
    specs: [
      'Bulk Reading Capability',
      'Real-time Comparison',
      'Instant Discrepancy Alert',
      'Section-based Counting',
      'Quick Reconciliation'
    ],
    additionalInfo: 'Cycle count yang biasanya berhari-hari sekarang hanya butuh beberapa jam. Chainway reader bulk read semua items, instant compare dengan system.'
  },

  INVESTIGATION: {
    title: 'Loss Prevention Investigation',
    category: 'Step 9',
    type: 'Issue Resolution',
    description: 'Staff melakukan investigasi terhadap discrepancy atau missing items menggunakan Chainway readers.',
    vendor: 'Chainway',
    product: 'Chainway Handheld Readers + Tablets',
    specs: [
      'Zone-based Search',
      'Item Location Tracking',
      'Movement History',
      'Forensic Data Analysis',
      'Quick Resolution'
    ],
    additionalInfo: 'Jika ada barang hilang, Chainway reader dapat locate item atau show forensic data. Investiasi lebih cepat dan akurat.'
  },

  REPORTING: {
    title: 'Reporting & Analytics',
    category: 'Step 10',
    type: 'Dashboard & Insights',
    description: 'HQ Dashboard menerima semua data untuk analytics, shrinkage tracking, dan decision making.',
    vendor: 'Integrated System',
    product: 'Central Analytics Dashboard',
    specs: [
      'Real-time Inventory Accuracy',
      'Shrinkage Rate Tracking',
      'Loss Prevention Events',
      'Sales by Category',
      'Customer Behavior Patterns',
      'Staff Performance Metrics'
    ],
    additionalInfo: 'Semua data dari warehouse hingga exit gate teraggregasi. Dashboard menampilkan KPI real-time. Alerts automatic untuk anomalies.'
  }
};

const initialNodes = [
  // Main Node
  {
    id: 'MAIN',
    type: 'default',
    data: { label: 'Retail Flow\nwith AIDC' },
    position: { x: 475, y: 0 },
    style: {
      background: '#FF6B6B',
      color: 'white',
      border: '3px solid #ef5b5b',
      borderRadius: '12px',
      padding: '15px',
      fontSize: '13px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '130px',
      boxShadow: '0 0 30px rgba(255, 107, 107, 0.8)'
    }
  },

  // 5 Main Phases
  {
    id: 'PHASE1',
    type: 'default',
    data: { label: 'Phase 1\nReceiving &\nWarehouse' },
    position: { x: 50, y: 120 },
    style: {
      background: '#4ECDC4',
      color: 'white',
      border: '2px solid #3ebcb4',
      borderRadius: '10px',
      padding: '12px',
      fontSize: '11px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '110px'
    }
  },
  {
    id: 'PHASE2',
    type: 'default',
    data: { label: 'Phase 2\nStocking &\nMerchandise' },
    position: { x: 210, y: 120 },
    style: {
      background: '#95E1D3',
      color: '#333',
      border: '2px solid #85d1c3',
      borderRadius: '10px',
      padding: '12px',
      fontSize: '11px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '110px'
    }
  },
  {
    id: 'PHASE3',
    type: 'default',
    data: { label: 'Phase 3\nCustomer\nShopping' },
    position: { x: 370, y: 120 },
    style: {
      background: '#F7DC6F',
      color: '#333',
      border: '2px solid #e7cc5f',
      borderRadius: '10px',
      padding: '12px',
      fontSize: '11px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '110px'
    }
  },
  {
    id: 'PHASE4',
    type: 'default',
    data: { label: 'Phase 4\nExit &\nSecurity' },
    position: { x: 530, y: 120 },
    style: {
      background: '#FF9999',
      color: 'white',
      border: '2px solid #ef8989',
      borderRadius: '10px',
      padding: '12px',
      fontSize: '11px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '110px'
    }
  },
  {
    id: 'PHASE5',
    type: 'default',
    data: { label: 'Phase 5\nPost-Sale &\nReconciliation' },
    position: { x: 690, y: 120 },
    style: {
      background: '#9D6BFF',
      color: 'white',
      border: '2px solid #8d5bef',
      borderRadius: '10px',
      padding: '12px',
      fontSize: '11px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '110px'
    }
  },

  // Phase 1 Details
  {
    id: 'TAGGING',
    type: 'default',
    data: { label: 'Tagging\n(Checkpoint)' },
    position: { x: 0, y: 250 },
    style: {
      background: '#4ECDC4',
      color: 'white',
      border: '1px solid #3ebcb4',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '10px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '95px'
    }
  },
  {
    id: 'RECEIVING',
    type: 'default',
    data: { label: 'Receiving\nScan (C72)' },
    position: { x: 100, y: 250 },
    style: {
      background: '#4ECDC4',
      color: 'white',
      border: '1px solid #3ebcb4',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '10px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '95px'
    }
  },

  // Phase 2 Details
  {
    id: 'STOCKING',
    type: 'default',
    data: { label: 'Stocking\n(Placement)' },
    position: { x: 200, y: 250 },
    style: {
      background: '#95E1D3',
      color: '#333',
      border: '1px solid #85d1c3',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '10px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '95px'
    }
  },
  {
    id: 'MONITORING',
    type: 'default',
    data: { label: 'Display\nMonitoring' },
    position: { x: 300, y: 250 },
    style: {
      background: '#95E1D3',
      color: '#333',
      border: '1px solid #85d1c3',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '10px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '95px'
    }
  },

  // Phase 3 Details
  {
    id: 'BROWSING',
    type: 'default',
    data: { label: 'Customer\nBrowsing' },
    position: { x: 350, y: 250 },
    style: {
      background: '#F7DC6F',
      color: '#333',
      border: '1px solid #e7cc5f',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '10px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '95px'
    }
  },
  {
    id: 'CHECKOUT_SELF',
    type: 'default',
    data: { label: 'Self-Checkout\n(Kiosk)' },
    position: { x: 450, y: 250 },
    style: {
      background: '#F7DC6F',
      color: '#333',
      border: '1px solid #e7cc5f',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '10px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '95px'
    }
  },
  {
    id: 'CHECKOUT_CASHIER',
    type: 'default',
    data: { label: 'Cashier\nCheckout (POS+)' },
    position: { x: 550, y: 250 },
    style: {
      background: '#F7DC6F',
      color: '#333',
      border: '1px solid #e7cc5f',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '10px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '95px'
    }
  },

  // Phase 4 Details
  {
    id: 'EXIT_GATE',
    type: 'default',
    data: { label: 'Exit Gate\nVerification' },
    position: { x: 500, y: 250 },
    style: {
      background: '#FF9999',
      color: 'white',
      border: '1px solid #ef8989',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '10px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '95px'
    }
  },
  {
    id: 'VALIDATION',
    type: 'default',
    data: { label: 'Validation\nLogic' },
    position: { x: 600, y: 250 },
    style: {
      background: '#FF9999',
      color: 'white',
      border: '1px solid #ef8989',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '10px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '95px'
    }
  },

  // Phase 5 Details
  {
    id: 'INVENTORY_UPDATE',
    type: 'default',
    data: { label: 'Inventory\nUpdate' },
    position: { x: 650, y: 250 },
    style: {
      background: '#9D6BFF',
      color: 'white',
      border: '1px solid #8d5bef',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '10px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '95px'
    }
  },
  {
    id: 'CYCLE_COUNT',
    type: 'default',
    data: { label: 'Cycle Count\n& Audit' },
    position: { x: 750, y: 250 },
    style: {
      background: '#9D6BFF',
      color: 'white',
      border: '1px solid #8d5bef',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '10px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '95px'
    }
  },
  {
    id: 'INVESTIGATION',
    type: 'default',
    data: { label: 'Loss Prevention\nInvestigation' },
    position: { x: 850, y: 250 },
    style: {
      background: '#9D6BFF',
      color: 'white',
      border: '1px solid #8d5bef',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '10px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '95px'
    }
  },
  {
    id: 'REPORTING',
    type: 'default',
    data: { label: 'Reporting &\nAnalytics' },
    position: { x: 950, y: 250 },
    style: {
      background: '#9D6BFF',
      color: 'white',
      border: '1px solid #8d5bef',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '10px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '95px'
    }
  }
];

const initialEdges = [
  // Main to Phases
  { id: 'MAIN-PHASE1', source: 'MAIN', target: 'PHASE1', animated: true, style: { stroke: '#FF6B6B', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#FF6B6B' } },
  { id: 'MAIN-PHASE2', source: 'MAIN', target: 'PHASE2', animated: true, style: { stroke: '#FF6B6B', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#FF6B6B' } },
  { id: 'MAIN-PHASE3', source: 'MAIN', target: 'PHASE3', animated: true, style: { stroke: '#FF6B6B', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#FF6B6B' } },
  { id: 'MAIN-PHASE4', source: 'MAIN', target: 'PHASE4', animated: true, style: { stroke: '#FF6B6B', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#FF6B6B' } },
  { id: 'MAIN-PHASE5', source: 'MAIN', target: 'PHASE5', animated: true, style: { stroke: '#FF6B6B', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#FF6B6B' } },

  // Phase 1 Connections
  { id: 'PHASE1-TAGGING', source: 'PHASE1', target: 'TAGGING', animated: false, style: { stroke: '#4ECDC4', strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#4ECDC4' } },
  { id: 'PHASE1-RECEIVING', source: 'PHASE1', target: 'RECEIVING', animated: false, style: { stroke: '#4ECDC4', strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#4ECDC4' } },
  { id: 'TAGGING-RECEIVING', source: 'TAGGING', target: 'RECEIVING', animated: true, label: 'Products arrive', style: { stroke: '#4ECDC4', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#4ECDC4' } },

  // Phase 2 Connections
  { id: 'PHASE2-STOCKING', source: 'PHASE2', target: 'STOCKING', animated: false, style: { stroke: '#95E1D3', strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#95E1D3' } },
  { id: 'PHASE2-MONITORING', source: 'PHASE2', target: 'MONITORING', animated: false, style: { stroke: '#95E1D3', strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#95E1D3' } },
  { id: 'RECEIVING-STOCKING', source: 'RECEIVING', target: 'STOCKING', animated: true, label: 'Stock to shelf', style: { stroke: '#95E1D3', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#95E1D3' } },
  { id: 'STOCKING-MONITORING', source: 'STOCKING', target: 'MONITORING', animated: true, label: 'Real-time tracking', style: { stroke: '#95E1D3', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#95E1D3' } },

  // Phase 3 Connections
  { id: 'PHASE3-BROWSING', source: 'PHASE3', target: 'BROWSING', animated: false, style: { stroke: '#F7DC6F', strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#F7DC6F' } },
  { id: 'PHASE3-CHECKOUT_SELF', source: 'PHASE3', target: 'CHECKOUT_SELF', animated: false, style: { stroke: '#F7DC6F', strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#F7DC6F' } },
  { id: 'PHASE3-CHECKOUT_CASHIER', source: 'PHASE3', target: 'CHECKOUT_CASHIER', animated: false, style: { stroke: '#F7DC6F', strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#F7DC6F' } },
  { id: 'MONITORING-BROWSING', source: 'MONITORING', target: 'BROWSING', animated: true, label: 'Customer shop', style: { stroke: '#F7DC6F', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#F7DC6F' } },
  { id: 'BROWSING-CHECKOUT_SELF', source: 'BROWSING', target: 'CHECKOUT_SELF', animated: true, label: 'Options', style: { stroke: '#F7DC6F', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#F7DC6F' } },
  { id: 'BROWSING-CHECKOUT_CASHIER', source: 'BROWSING', target: 'CHECKOUT_CASHIER', animated: true, label: 'or', style: { stroke: '#F7DC6F', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#F7DC6F' } },

  // Phase 4 Connections
  { id: 'PHASE4-EXIT_GATE', source: 'PHASE4', target: 'EXIT_GATE', animated: false, style: { stroke: '#FF9999', strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#FF9999' } },
  { id: 'PHASE4-VALIDATION', source: 'PHASE4', target: 'VALIDATION', animated: false, style: { stroke: '#FF9999', strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#FF9999' } },
  { id: 'CHECKOUT_SELF-EXIT_GATE', source: 'CHECKOUT_SELF', target: 'EXIT_GATE', animated: true, label: 'After payment', style: { stroke: '#FF9999', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#FF9999' } },
  { id: 'CHECKOUT_CASHIER-EXIT_GATE', source: 'CHECKOUT_CASHIER', target: 'EXIT_GATE', animated: true, style: { stroke: '#FF9999', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#FF9999' } },
  { id: 'EXIT_GATE-VALIDATION', source: 'EXIT_GATE', target: 'VALIDATION', animated: true, label: 'Verify items', style: { stroke: '#FF9999', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#FF9999' } },

  // Phase 5 Connections
  { id: 'PHASE5-INVENTORY_UPDATE', source: 'PHASE5', target: 'INVENTORY_UPDATE', animated: false, style: { stroke: '#9D6BFF', strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#9D6BFF' } },
  { id: 'PHASE5-CYCLE_COUNT', source: 'PHASE5', target: 'CYCLE_COUNT', animated: false, style: { stroke: '#9D6BFF', strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#9D6BFF' } },
  { id: 'PHASE5-INVESTIGATION', source: 'PHASE5', target: 'INVESTIGATION', animated: false, style: { stroke: '#9D6BFF', strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#9D6BFF' } },
  { id: 'PHASE5-REPORTING', source: 'PHASE5', target: 'REPORTING', animated: false, style: { stroke: '#9D6BFF', strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#9D6BFF' } },
  { id: 'VALIDATION-INVENTORY_UPDATE', source: 'VALIDATION', target: 'INVENTORY_UPDATE', animated: true, label: 'Auto update', style: { stroke: '#9D6BFF', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#9D6BFF' } },
  { id: 'INVENTORY_UPDATE-CYCLE_COUNT', source: 'INVENTORY_UPDATE', target: 'CYCLE_COUNT', animated: false, style: { stroke: '#9D6BFF', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#9D6BFF' } },
  { id: 'CYCLE_COUNT-INVESTIGATION', source: 'CYCLE_COUNT', target: 'INVESTIGATION', animated: false, style: { stroke: '#9D6BFF', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#9D6BFF' } },
  { id: 'INVESTIGATION-REPORTING', source: 'INVESTIGATION', target: 'REPORTING', animated: false, style: { stroke: '#9D6BFF', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#9D6BFF' } },
];

function RetailFlowMindmap() {
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
        <h1>Retail Flow with AIDC</h1>
        <p>Complete retail transaction journey dari Receiving hingga Analytics - Klik node untuk detail</p>
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
          nodeStrokeWidth={3}
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
                <h4>Vendor & Produk</h4>
                <p><strong>Vendor:</strong> {selectedNode.vendor}</p>
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
                <h4>Detail Implementasi</h4>
                <p className="data-flow">{selectedNode.additionalInfo}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="legend">
        <h3>Legend</h3>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#FF6B6B' }}></span>
          <span>Main Flow</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#4ECDC4' }}></span>
          <span>Phase 1: Receiving</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#95E1D3' }}></span>
          <span>Phase 2: Stocking</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#F7DC6F' }}></span>
          <span>Phase 3: Shopping</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#FF9999' }}></span>
          <span>Phase 4: Exit/Security</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#9D6BFF' }}></span>
          <span>Phase 5: Post-Sale</span>
        </div>
      </div>
    </div>
  );
}

export default RetailFlowMindmap;
