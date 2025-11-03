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
import './ColdStorageFoodFlow.css';

const nodeDetails = {
  PROJECT: {
    title: 'Cold Storage Food Flow - Dim Sum Inc.',
    category: 'Project Overview',
    type: 'Inara Group Implementation',
    description: 'Sistem RFID comprehensive untuk warehouse management bahan makanan dengan cold storage integration. Mencakup receiving, sorting, labeling, storage (cold & normal), stock opname, dan inventory tracking di cabang.',
    brand: 'Chainway + Tageos + Cirfid',
    product: 'Integrated RFID Warehouse Solution',
    specs: [
      'Created by: Muhammad Agung Ferdiansyah',
      'Partner: PT Delta Solusi Nusantara',
      'End User: Inara Group (Dim Sum inc.)',
      'Solution Focus: Food Material Cold Storage Management',
      'RFID Integration: Complete Tracking, No Manual Steps'
    ],
    additionalInfo: 'Solusi end-to-end terintegrasi penuh tanpa manual processing. Dari truck arrival hingga branch receiving, semua automated dengan RFID technology. Tageos untuk cold storage items, Cirfid untuk metal/liquid items, C5 sebagai mobile powerhouse untuk semua scanning operations.'
  },

  RECEIVING_WAREHOUSE: {
    title: 'Warehouse: Receiving, Sorting, Labeling & Initial Scan',
    category: 'Step 1: Warehouse Processing',
    type: 'Automated RFID Processing',
    description: 'Truk berisi bahan makanan tiba di warehouse. Proses fully integrated: sorting bahan berdasarkan jenis, packaging di plastik/karton, labeling dengan CP30 (print + encode RFID), dan scanning awal dengan C5 untuk validasi label. Output: setiap paket punya unique EPC code dan sudah tervalidasi sistem.',
    brand: 'Chainway + Tageos + Cirfid',
    product: 'CP30-25 Printer + C5 Reader + Tageos EOS-241 / Cirfid Ci-T5055 Labels',
    specs: [
      'Receiving: Unload & Quality check',
      'Sorting: By product type & category',
      'Packaging: Plastic bags / Cardboard boxes (standardized weight)',
      'RFID Labeling: CP30-25 print + encode in one process',
      'Labels: Tageos EOS-241 (cold storage -20°C) / Cirfid Ci-T5055 (metal/liquid)',
      'Initial Scan: C5 UHF reader validates each label (8m range)',
      'Data: Product type, weight, batch, expiry, storage requirement, unique EPC',
      'Speed: Optimized workflow untuk high-volume processing'
    ],
    additionalInfo: 'Proses terintegrasi tanpa manual. CP30 sekaligus print barcode 2D dan encode RFID. C5 langsung scan setiap label untuk validasi EPC code dan confirm ke system. Output: 100% labeled & verified paket ready untuk storage. Tageos EOS-241 tahan -40°C hingga +85°C untuk frozen items, Cirfid Ci-T5055 untuk metal/liquid items dengan anti-interference design.'
  },

  STORAGE_COLD: {
    title: 'Cold Storage -20°C + Stock Opname',
    category: 'Step 2A: Storage & Inventory Check (Cold)',
    type: 'Temperature Controlled Storage',
    description: 'Produk frozen (meat, ayam, seafood, ice cream) disimpan di cold storage -20°C. Proses stock opname regular menggunakan C5 untuk scan semua item, check inventory accuracy, dan update system. C5 tahan -20°C untuk warehouse operations di cold chamber.',
    brand: 'Tageos + Chainway',
    product: 'Tageos EOS-241 Labels + C5 UHF Reader (Cold Storage capable)',
    specs: [
      'Label: Tageos EOS-241 M830 (Impinj M830 chip)',
      'Operating Temperature: -40°C / +85°C',
      'Label Size: 18 x 44 mm, Read Range: up to 8m',
      'Substrate: PET Clear 50µm (permanent adhesive)',
      'C5 Reader: Android 13, -20°C operational temp',
      'Stock Opname: Regular scanning untuk inventory accuracy',
      'Features: Temperature resistant, moisture resistant, durable antenna',
      'Process: Scan all items, auto-match vs record, highlight discrepancy'
    ],
    additionalInfo: 'Tageos EOS-241 dengan chip Impinj M830 tahan extreme cold. C5 dengan temperature rating -20°C dapat dibawa langsung ke cold chamber untuk stock opname. Proses: staff buka cold storage, scan semua item dengan C5, system auto-calculate inventory vs record, highlight discrepancy jika ada. Data real-time sync ke Odoo.'
  },

  STORAGE_NORMAL: {
    title: 'Normal Storage (Room Temp) + Stock Opname',
    category: 'Step 2B: Storage & Inventory Check (Ambient)',
    type: 'Ambient Temperature Storage',
    description: 'Produk ambient (sayuran, minuman, dry goods) disimpan di storage normal. Stock opname regular menggunakan C5 untuk scanning semua item, validasi inventory, dan update system secara real-time.',
    brand: 'Tageos + Chainway',
    product: 'Tageos EOS-241 Labels + C5 UHF Reader',
    specs: [
      'Label: Tageos EOS-241 M830 (same high-temperature capability)',
      'Ideal Temperature: 15-25°C ambient',
      'Read Range: up to 8m dari C5 reader',
      'Stock Opname: Periodic inventory check (daily/weekly)',
      'C5 Scanning: Handheld, mobile untuk warehouse aisle',
      'Data Accuracy: 99.9% detection rate dengan 1300+ tags/sec',
      'Sync: Real-time to Odoo ERP inventory module',
      'Discrepancy Alert: Automatic loss prevention trigger'
    ],
    additionalInfo: 'Untuk ambient storage, Tageos EOS-241 cost-effective dengan performance sama. Stock opname lebih frequent karena tidak ada cold chain concern. Staff scan dengan C5 dari rak ke rak, system auto-update inventory, generate discrepancy report untuk loss prevention investigation. Proses bisa diselesaikan dalam hitungan jam vs hari dengan manual count.'
  },

  METAL_ITEMS: {
    title: 'Metal/Canned Items Storage + Stock Opname',
    category: 'Step 2C: Special Items (Canned/Metal)',
    type: 'Metal Product Tagging & Tracking',
    description: 'Produk kaleng (sarden, tuna, dll) dilabeli dengan anti-metal tags Cirfid. Stock opname menggunakan C5 untuk scan dan validasi metal items, minimize metal interference dengan Cirfid anti-metal design.',
    brand: 'Cirfid + Chainway',
    product: 'Cirfid Ci-T5055 Anti-Metal Labels + C5 UHF Reader',
    specs: [
      'Label: Cirfid Ci-T5055 (NXP UCODE 9 chip, 96-bit EPC)',
      'Size: 58.5 × 21 mm, Read Range: up to 5m',
      'Operating Temp: –20°C ~ +75°C (dapat cold & ambient)',
      'Anti-Metal Design: Minimize signal attenuation from metal',
      'C5 Scanning: Compatible dan reliable dengan metal container',
      'Storage: Dapat di cold storage atau ambient sesuai product type',
      'Accuracy: High stability with metal interference reduction',
      'Application: Kaleng sarden, tuna, atau metal packaging apapun'
    ],
    additionalInfo: 'Cirfid Ci-T5055 adalah solusi khusus untuk metal packaging. Design anti-metal reduce signal loss saat scan. Stock opname dengan C5 tetap akurat meskipun item dalam kaleng metal. Bisa digunakan untuk frozen metal items (kaleng ikan di freezer) maupun ambient metal items dengan read range tetap optimal.'
  },

  LIQUID_ITEMS: {
    title: 'Water/Liquid Pallets + Stock Opname',
    category: 'Step 2D: Special Items (Liquid/Pallet)',
    type: 'Liquid Product Tagging & Tracking',
    description: 'Palet plastik berisi botol air/minuman dilabeli Cirfid anti-liquid di palet. Stock opname palet menggunakan C5 untuk bulk tracking, check palet quantity & integrity, update system.',
    brand: 'Cirfid + Chainway',
    product: 'Cirfid Ci-T5055 Anti-Liquid Labels + C5 UHF Reader (Pallet-level)',
    specs: [
      'Label: Cirfid Ci-T5055 with anti-liquid coating',
      'Application: Pallet-level tracking (1 tag per palet ~20-30 botol)',
      'Size: 58.5 × 21 mm, Read Range: up to 5m',
      'Mounting: Direct adhesive on palet surface',
      'C5 Scanning: Pallet-by-pallet inventory check',
      'Efficiency: Reduced labeling cost vs item-level tagging',
      'Water-resistant: Coating prevent water content interference',
      'Output: Total quantity tracking, palet movement history'
    ],
    additionalInfo: 'Cirfid Ci-T5055 dengan anti-liquid coating untuk palet air mineral/minuman. Satu tag per palet efisien untuk volume management dan cost savings. Stock opname: staff scan setiap palet dengan C5, system track palet movement, update total quantity botol. Praktis untuk bulk items dengan minimal labeling cost dan maximum efficiency.'
  },

  STOCK_OPNAME: {
    title: 'Stock Opname Operations (Cold & Ambient)',
    category: 'Step 3: Regular Inventory Verification',
    type: 'Periodic Inventory Audit',
    description: 'Proses stock opname regular menggunakan C5 di semua storage area (cold -20°C & ambient). Staff scan setiap item/palet, system compare dengan inventory record, identify discrepancy untuk loss prevention investigation dan immediate action.',
    brand: 'Chainway',
    product: 'C5-2SE-U7EC-PC2C8R4A11(A13) UHF RFID Reader',
    specs: [
      'Device: C5 handheld RFID reader (Android 13)',
      'Capability: Multi-location stock opname (warehouse-wide)',
      'Cold Opname: Can operate at -20°C in cold storage -20°C',
      'Ambient Opname: Standard warehouse operations',
      'Read Range: Up to 8m untuk Tageos, 5m untuk Cirfid',
      'Data Accuracy: 1300+ tags/sec read rate, 99.9% accuracy',
      'Sync: Real-time data to Odoo inventory module',
      'Output: Discrepancy report, Loss prevention alert, Movement history'
    ],
    additionalInfo: 'C5 adalah tool utama untuk stock opname yang efficient. Temperature rating -20°C berarti staff bisa bawa langsung ke cold storage dengan battery 6700mAh (hot-swap pistol grip untuk continuous operation). Proses: scan semua item di location, C5 match dengan system record, highlight missing/extra items. Report discrepancy real-time untuk immediate action. Frequency: daily/weekly tergantung SOP perusahaan. Hasil: inventory accuracy meningkat drastis, loss prevention lebih efektif.'
  },

  BRANCH_RECEIVING: {
    title: 'Branch Receiving - Dim Sum Inc. Cabang',
    category: 'Step 4: Branch Delivery & Receiving',
    type: 'Multi-location Inventory Sync',
    description: 'Paket dari warehouse utama dikirim ke cabang Dim Sum Inc. Saat tiba di cabang, staff scan dengan C5 untuk confirm receipt, validate condition, dan update inventory di cabang location (Odoo). Traceability penuh dari warehouse → branch.',
    brand: 'Chainway',
    product: 'C5 UHF Reader - Branch Operations',
    specs: [
      'Scan at Delivery: C5 scan setiap item saat tiba di cabang',
      'Confirmation: Receipt confirmation automatic ke Odoo system',
      'Condition Check: Validate packaging integrity & product condition',
      'Batch Tracking: Check & record expiration date, batch number',
      'Multi-location: Separate inventory ledger per branch',
      'Real-time Sync: Data instant update di central Odoo ERP',
      'Chain of Custody: Complete tracking warehouse → branch → POS',
      'Scanner: 2D barcode SE4710 untuk fallback scanning'
    ],
    additionalInfo: 'C5 digunakan di cabang untuk receiving scan saat delivery tiba. Staff scan barcode 2D atau RFID EPC code, system confirm item sudah received di cabang location, validate quantity & condition (no damage, not expired). Data automatic update di Odoo dengan branch location tag. Memastikan full traceability dari warehouse central hingga point of sale di cabang. Stock immediately available untuk POS operations.'
  },

  BACKEND: {
    title: 'Backend Integration - Odoo ERP',
    category: 'Step 5: Data Management & Analytics',
    type: 'ERP Integration',
    description: 'Semua data RFID scan (dari C5 warehouse, CP30 printer, cabang) disinkronisasi ke Odoo ERP melalui REST API middleware. Inventory levels, batch tracking, expiration dates, storage location, semua tercentral di Odoo untuk reporting dan business intelligence.',
    brand: 'Odoo',
    product: 'Odoo ERP - Inventory Management Module',
    specs: [
      'Integration: REST API / XML-RPC dengan middleware',
      'Modules: Inventory, Stock, Purchase, Sales, Stock Move',
      'Real-time Sync: RFID data ↔ Odoo (push notification)',
      'Tracking: Batch, Expiration date, Storage location (cold/ambient/branch)',
      'Multi-warehouse: Support central warehouse + multiple branches',
      'Reports: Stock level, Movement history, Aging analysis, Loss report',
      'Temperature Compliance: Cold chain tracking & compliance logging',
      'Alerts: Expiration near/expired, Low stock, Discrepancy found'
    ],
    additionalInfo: 'Odoo menjadi central hub untuk semua business logic. Data dari C5 (warehouse & branch) dan CP30 (labeling) terintegrasi real-time untuk live inventory visibility. Batch & expiration tracking critical untuk food business compliance. Cold storage location tracking memastikan inventory accountability, food safety, dan regulatory compliance. Automated reporting untuk management dashboard.'
  }
};

const initialNodes = [
  // PROJECT NODE (Top)
  {
    id: 'PROJECT',
    type: 'default',
    data: { label: 'Cold Storage\nFood Flow\nDim Sum Inc.' },
    position: { x: 500, y: 0 },
    style: {
      background: '#FF6B6B',
      color: 'white',
      border: '3px solid #ef5b5b',
      borderRadius: '12px',
      padding: '15px',
      fontSize: '13px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '200px',
      boxShadow: '0 0 30px rgba(255, 107, 107, 0.8)'
    }
  },

  // MAIN FLOW (LEFT TO RIGHT)
  {
    id: 'RECEIVING_WAREHOUSE',
    type: 'default',
    data: { label: 'Step 1:\nWarehouse\nProcessing' },
    position: { x: 200, y: 150 },
    style: {
      background: '#4ECDC4',
      color: 'white',
      border: '2px solid #3ebcb4',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '11px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '130px'
    }
  },

  // STORAGE NODES (PARALLEL - MIDDLE)
  {
    id: 'STORAGE_COLD',
    type: 'default',
    data: { label: 'Step 2A:\nCold Storage\n-20°C' },
    position: { x: 50, y: 350 },
    style: {
      background: '#87CEEB',
      color: 'white',
      border: '2px solid #77beed',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '11px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '130px'
    }
  },

  {
    id: 'STORAGE_NORMAL',
    type: 'default',
    data: { label: 'Step 2B:\nNormal Storage\n(Room Temp)' },
    position: { x: 220, y: 350 },
    style: {
      background: '#FFD700',
      color: '#333',
      border: '2px solid #efb300',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '11px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '130px'
    }
  },

  // SPECIAL ITEMS (MIDDLE)
  {
    id: 'METAL_ITEMS',
    type: 'default',
    data: { label: 'Step 2C:\nMetal/Canned\nItems' },
    position: { x: 390, y: 350 },
    style: {
      background: '#C0C0C0',
      color: 'white',
      border: '2px solid #b0b0b0',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '11px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '130px'
    }
  },

  {
    id: 'LIQUID_ITEMS',
    type: 'default',
    data: { label: 'Step 2D:\nLiquid/Pallet\nItems' },
    position: { x: 560, y: 350 },
    style: {
      background: '#87CEEB',
      color: 'white',
      border: '2px solid #77beed',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '11px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '130px'
    }
  },

  // STOCK OPNAME
  {
    id: 'STOCK_OPNAME',
    type: 'default',
    data: { label: 'Step 3:\nStock Opname\n(C5)' },
    position: { x: 305, y: 550 },
    style: {
      background: '#FF9999',
      color: 'white',
      border: '2px solid #ef8989',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '11px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '130px'
    }
  },

  // BRANCH RECEIVING
  {
    id: 'BRANCH_RECEIVING',
    type: 'default',
    data: { label: 'Step 4:\nBranch\nReceiving' },
    position: { x: 100, y: 700 },
    style: {
      background: '#F7DC6F',
      color: '#333',
      border: '2px solid #e7cc5f',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '11px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '130px'
    }
  },

  // BACKEND
  {
    id: 'BACKEND',
    type: 'default',
    data: { label: 'Step 5:\nBackend\n(Odoo ERP)' },
    position: { x: 310, y: 700 },
    style: {
      background: '#9D6BFF',
      color: 'white',
      border: '2px solid #8d5bef',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '11px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '130px'
    }
  }
];

const initialEdges = [
  // Main flow from warehouse
  { 
    id: 'RECEIVING_WAREHOUSE-STORAGE_COLD', 
    source: 'RECEIVING_WAREHOUSE', 
    target: 'STORAGE_COLD', 
    label: 'Frozen', 
    animated: true, 
    style: { stroke: '#4ECDC4', strokeWidth: 2 }, 
    markerEnd: { type: MarkerType.ArrowClosed, color: '#4ECDC4' } 
  },
  { 
    id: 'RECEIVING_WAREHOUSE-STORAGE_NORMAL', 
    source: 'RECEIVING_WAREHOUSE', 
    target: 'STORAGE_NORMAL', 
    label: 'Ambient', 
    animated: true, 
    style: { stroke: '#4ECDC4', strokeWidth: 2 }, 
    markerEnd: { type: MarkerType.ArrowClosed, color: '#4ECDC4' } 
  },
  { 
    id: 'RECEIVING_WAREHOUSE-METAL_ITEMS', 
    source: 'RECEIVING_WAREHOUSE', 
    target: 'METAL_ITEMS', 
    label: 'Canned', 
    animated: true, 
    style: { stroke: '#4ECDC4', strokeWidth: 2 }, 
    markerEnd: { type: MarkerType.ArrowClosed, color: '#4ECDC4' } 
  },
  { 
    id: 'RECEIVING_WAREHOUSE-LIQUID_ITEMS', 
    source: 'RECEIVING_WAREHOUSE', 
    target: 'LIQUID_ITEMS', 
    label: 'Liquid/Pallet', 
    animated: true, 
    style: { stroke: '#4ECDC4', strokeWidth: 2 }, 
    markerEnd: { type: MarkerType.ArrowClosed, color: '#4ECDC4' } 
  },

  // To stock opname
  { 
    id: 'STORAGE_COLD-STOCK_OPNAME', 
    source: 'STORAGE_COLD', 
    target: 'STOCK_OPNAME', 
    label: '', 
    type: 'default', 
    animated: false, 
    style: { stroke: '#999', strokeWidth: 2, strokeDasharray: '5,5' }, 
    markerEnd: { type: MarkerType.ArrowClosed, color: '#999' } 
  },
  { 
    id: 'STORAGE_NORMAL-STOCK_OPNAME', 
    source: 'STORAGE_NORMAL', 
    target: 'STOCK_OPNAME', 
    label: '', 
    type: 'default', 
    animated: false, 
    style: { stroke: '#999', strokeWidth: 2, strokeDasharray: '5,5' }, 
    markerEnd: { type: MarkerType.ArrowClosed, color: '#999' } 
  },
  { 
    id: 'METAL_ITEMS-STOCK_OPNAME', 
    source: 'METAL_ITEMS', 
    target: 'STOCK_OPNAME', 
    label: '', 
    type: 'default', 
    animated: false, 
    style: { stroke: '#999', strokeWidth: 2, strokeDasharray: '5,5' }, 
    markerEnd: { type: MarkerType.ArrowClosed, color: '#999' } 
  },
  { 
    id: 'LIQUID_ITEMS-STOCK_OPNAME', 
    source: 'LIQUID_ITEMS', 
    target: 'STOCK_OPNAME', 
    label: '', 
    type: 'default', 
    animated: false, 
    style: { stroke: '#999', strokeWidth: 2, strokeDasharray: '5,5' }, 
    markerEnd: { type: MarkerType.ArrowClosed, color: '#999' } 
  },

  // To branch and backend
  { 
    id: 'STOCK_OPNAME-BRANCH_RECEIVING', 
    source: 'STOCK_OPNAME', 
    target: 'BRANCH_RECEIVING', 
    label: 'Delivery', 
    animated: true, 
    style: { stroke: '#FF9999', strokeWidth: 2 }, 
    markerEnd: { type: MarkerType.ArrowClosed, color: '#FF9999' } 
  },
  { 
    id: 'STOCK_OPNAME-BACKEND', 
    source: 'STOCK_OPNAME', 
    target: 'BACKEND', 
    label: 'Sync', 
    animated: true, 
    style: { stroke: '#FF9999', strokeWidth: 2 }, 
    markerEnd: { type: MarkerType.ArrowClosed, color: '#FF9999' } 
  },
  { 
    id: 'BRANCH_RECEIVING-BACKEND', 
    source: 'BRANCH_RECEIVING', 
    target: 'BACKEND', 
    label: 'Report', 
    animated: true, 
    style: { stroke: '#F7DC6F', strokeWidth: 2 }, 
    markerEnd: { type: MarkerType.ArrowClosed, color: '#F7DC6F' } 
  },

  // Back to PROJECT
  {
    id: 'PROJECT-RECEIVING_WAREHOUSE',
    source: 'PROJECT',
    target: 'RECEIVING_WAREHOUSE',
    animated: false,
    style: { stroke: '#FF6B6B', strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#FF6B6B' }
  }
];

function ColdStorageFoodFlow() {
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
        <h1>Cold Storage Food Flow</h1>
        <p>Inara Group (Dim Sum inc.) - RFID Warehouse Management dengan Cold Storage Integration | Tageos + Cirfid + Chainway</p>
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
                <h4>Detail</h4>
                <p>{selectedNode.additionalInfo}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="legend">
        <h3>Legend</h3>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#FF6B6B' }}></span>
          <span>Project</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#4ECDC4' }}></span>
          <span>Warehouse Processing</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#87CEEB' }}></span>
          <span>Cold/Liquid Storage</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#FFD700' }}></span>
          <span>Ambient Storage</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#C0C0C0' }}></span>
          <span>Metal Items</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#FF9999' }}></span>
          <span>Stock Opname</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#F7DC6F' }}></span>
          <span>Branch Receiving</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#9D6BFF' }}></span>
          <span>Backend ERP</span>
        </div>
      </div>
    </div>
  );
}

export default ColdStorageFoodFlow;
