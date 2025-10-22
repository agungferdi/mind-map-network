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
import './IntegrationFlowchart.css';

const nodeDetails = {
  W1: {
    title: 'Inbound Reception (UR4/UR8)',
    category: 'Warehouse Inbound',
    type: 'Fixed RFID Portal',
    description: 'Penerimaan barang di mana setiap pallet dilengkapi RFID label. Fixed RFID readers UR4/UR8 ditempatkan di pintu masuk untuk automated reading. Sistem membaca hingga 1300+ tags per detik dengan akurasi 99.9%.',
    vendor: 'Chainway',
    product: 'Chainway UR4/UR8 Fixed RFID Reader',
    specs: [
      'Chip: Impinj E710',
      'Max Read Range: 30 meter',
      'Read Rate: 1300+ tags/detik',
      'Antena: 4-Port (UR4) atau 8-Port (UR8)',
      'Koneksi: 4G/WiFi/POE'
    ],
    additionalInfo: 'Barang otomatis tercatat di inventory digital tanpa perlu operator menghentikan aliran. Akurasi mencapai 99.9% dan proses sangat cepat.'
  },
  W2: {
    title: 'Storage & Inventory (MC50)',
    category: 'Warehouse',
    type: 'Mobile Inventory Management',
    description: 'MC50 dengan 5G connectivity untuk real-time inventory tracking dan storage optimization. Operator dapat melakukan stock checking di mana saja di warehouse dengan response time yang sangat cepat.',
    vendor: 'Chainway',
    product: 'Chainway MC50 Handheld Computer',
    specs: [
      'Display: 6" HD (18:9)',
      'Chip: Impinj E710 RFID',
      '5G Ready, WiFi 6',
      'Max Read Range: 30 meter',
      '5000mAh Battery, 1.5m Drop Proof',
      'Camera + NFC + Barcode'
    ],
    additionalInfo: 'Dengan 5G connectivity, data tersinkronisasi real-time dengan ItemOptix. Visibility penuh terhadap inventory membuat storage optimization menjadi lebih mudah dan efisien.'
  },
  W3: {
    title: 'Cycle Count & Audit (C75)',
    category: 'Warehouse',
    type: 'Inventory Verification',
    description: 'C75 dengan built-in printer untuk cycle count dan audit inventory. Operator bisa langsung mencetak label dan manifest tanpa perlu perangkat tambahan.',
    vendor: 'Chainway',
    product: 'Chainway C75 Handheld Computer with Printer',
    specs: [
      'Display: 5.2" IPS 1080P',
      'Built-in Thermal Printer (85mm/s)',
      'RFID Reader (Impinj E710)',
      '8000mAh Battery',
      'IP65, 1.5m Drop Proof',
      'Barcode + NFC + Camera'
    ],
    additionalInfo: 'Cycle count yang biasanya berhari-hari kini hanya butuh beberapa jam. Printing built-in mempercepat pembuatan dokumentasi dan manifests.'
  },
  W4: {
    title: 'Outbound Verification (UR4/UR8)',
    category: 'Warehouse',
    type: 'Automated Tunnel Check',
    description: 'Tunnel RFID dengan UR4/UR8 untuk verifikasi otomatis sebelum shipment keluar. Sistem mencegah barang yang tidak ter-verify meninggalkan warehouse.',
    vendor: 'Chainway',
    product: 'Chainway UR4/UR8 Fixed RFID Reader',
    specs: [
      'Impinj E710 Chip',
      '30 meter Read Range',
      '1300+ tags/detik',
      'Automated Rejection Alert',
      'Accuracy: 99.9%',
      '4-Port (UR4) atau 8-Port (UR8)'
    ],
    additionalInfo: 'Setiap pallet yang keluar harus melewati tunnel RFID. Sistem ini menghalangi shipment dengan discrepancy dan menjaga 99.9% accuracy.'
  },
  C1: {
    title: 'Middleware Layer',
    category: 'Central Hub',
    type: 'Data Integration Platform',
    description: 'Custom middleware application yang mengintegrasikan semua data dari Chainway devices (UR4/UR8, MC50, C75) melalui HTTP API atau WebSocket. Middleware menerima data real-time dari field devices, memproses data, dan mengirimkan ke database backend untuk storage dan analytics.',
    vendor: 'Custom Development',
    product: 'Warehouse RFID Middleware - HTTP/WebSocket Gateway',
    specs: [
      'HTTP REST API Gateway untuk Chainway Devices',
      'WebSocket Real-time Data Streaming',
      'Data Parsing & Validation Engine',
      'Connection Pooling & Load Balancing',
      'Error Handling & Retry Mechanism',
      'Database Backend Integration',
      'Request/Response Logging & Monitoring'
    ],
    additionalInfo: 'Middleware berfungsi sebagai jembatan antara Chainway field devices dan database backend. Menerima RFID scan data dari UR4/UR8, inventory updates dari MC50, dan audit logs dari C75. Semua data dikonversi ke format standard, divalidasi, dan diteruskan ke backend database untuk real-time inventory visibility dan historical analytics.'
  }
};

const initialNodes = [
  // Inbound Section
  {
    id: 'W1',
    type: 'default',
    data: { label: 'Inbound\nReception\n(UR4/UR8)' },
    position: { x: 100, y: 150 },
    style: {
      background: '#FF6B6B',
      color: 'white',
      border: '2px solid #ef5b5b',
      borderRadius: '8px',
      padding: '12px',
      fontSize: '12px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '110px'
    }
  },

  // Storage Section
  {
    id: 'W2',
    type: 'default',
    data: { label: 'Storage &\nInventory\n(MC50)' },
    position: { x: 350, y: 150 },
    style: {
      background: '#FFB347',
      color: 'white',
      border: '2px solid #ef9337',
      borderRadius: '8px',
      padding: '12px',
      fontSize: '12px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '110px'
    }
  },

  // Cycle Count Section
  {
    id: 'W3',
    type: 'default',
    data: { label: 'Cycle Count\n& Audit\n(C75)' },
    position: { x: 600, y: 150 },
    style: {
      background: '#FFD700',
      color: '#333',
      border: '2px solid #efb300',
      borderRadius: '8px',
      padding: '12px',
      fontSize: '12px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '110px'
    }
  },

  // Outbound Section
  {
    id: 'W4',
    type: 'default',
    data: { label: 'Outbound\nVerification\n(UR4/UR8)' },
    position: { x: 850, y: 150 },
    style: {
      background: '#FF6B6B',
      color: 'white',
      border: '2px solid #ef5b5b',
      borderRadius: '8px',
      padding: '12px',
      fontSize: '12px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '110px'
    }
  },

  // Central Hub
  {
    id: 'C1',
    type: 'default',
    data: { label: 'Middleware\nLayer\n(API/WS)' },
    position: { x: 475, y: 350 },
    style: {
      background: '#9D6BFF',
      color: 'white',
      border: '3px solid #8d5bef',
      borderRadius: '12px',
      padding: '15px',
      fontSize: '12px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '130px',
      boxShadow: '0 0 25px rgba(157, 107, 255, 0.6)'
    }
  }
];

const initialEdges = [
  // Main Flow - Left to Right
  { 
    id: 'W1-W2', 
    source: 'W1', 
    target: 'W2', 
    label: 'Stock In', 
    type: 'default', 
    animated: true, 
    style: { stroke: '#FF6B6B', strokeWidth: 3 }, 
    markerEnd: { type: MarkerType.ArrowClosed, color: '#FF6B6B' } 
  },
  { 
    id: 'W2-W3', 
    source: 'W2', 
    target: 'W3', 
    label: 'Verification', 
    type: 'default', 
    animated: true, 
    style: { stroke: '#FFB347', strokeWidth: 3 }, 
    markerEnd: { type: MarkerType.ArrowClosed, color: '#FFB347' } 
  },
  { 
    id: 'W3-W4', 
    source: 'W3', 
    target: 'W4', 
    label: 'Approved', 
    type: 'default', 
    animated: true, 
    style: { stroke: '#FFD700', strokeWidth: 3 }, 
    markerEnd: { type: MarkerType.ArrowClosed, color: '#FFD700' } 
  },

  // All nodes to Central Hub (Data Integration)
  { 
    id: 'W1-C1', 
    source: 'W1', 
    target: 'C1', 
    type: 'default', 
    animated: false, 
    style: { stroke: '#9D6BFF', strokeWidth: 2, strokeDasharray: '5,5' }, 
    markerEnd: { type: MarkerType.ArrowClosed, color: '#9D6BFF' } 
  },
  { 
    id: 'W2-C1', 
    source: 'W2', 
    target: 'C1', 
    type: 'default', 
    animated: false, 
    style: { stroke: '#9D6BFF', strokeWidth: 2, strokeDasharray: '5,5' }, 
    markerEnd: { type: MarkerType.ArrowClosed, color: '#9D6BFF' } 
  },
  { 
    id: 'W3-C1', 
    source: 'W3', 
    target: 'C1', 
    type: 'default', 
    animated: false, 
    style: { stroke: '#9D6BFF', strokeWidth: 2, strokeDasharray: '5,5' }, 
    markerEnd: { type: MarkerType.ArrowClosed, color: '#9D6BFF' } 
  },
  { 
    id: 'W4-C1', 
    source: 'W4', 
    target: 'C1', 
    type: 'default', 
    animated: false, 
    style: { stroke: '#9D6BFF', strokeWidth: 2, strokeDasharray: '5,5' }, 
    markerEnd: { type: MarkerType.ArrowClosed, color: '#9D6BFF' } 
  },
];

function IntegrationFlowchart() {
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
        <h1>Warehouse Integration Flow</h1>
        <p>Chainway RFID Solution - Inbound → Storage → Audit → Outbound → Middleware API Gateway → Backend DB</p>
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
                <h4>Data Flow</h4>
                <p className="data-flow">{selectedNode.dataFlow}</p>
              </div>

              <div className="modal-section">
                <h4>Fungsi</h4>
                <p><strong>Tipe:</strong> {selectedNode.type}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="legend">
        <h3>Legend</h3>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#FF6B6B' }}></span>
          <span>RFID Gate (UR4/UR8)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#FFB347' }}></span>
          <span>Mobile Device (MC50)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#FFD700' }}></span>
          <span>Cycle Count (C75)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#9D6BFF' }}></span>
          <span>Middleware (API/WS)</span>
        </div>
      </div>
    </div>
  );
}

export default IntegrationFlowchart;
