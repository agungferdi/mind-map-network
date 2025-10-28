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

// Import product images
import ura4Image from './images/URA4.png.png';
import c5Image from './images/c5.png.png';
import c72Image from './images/c72.png.png';
import c66Image from './images/c66.png.png';

const nodeDetails = {
  W1: {
    title: 'Inbound Reception (URA4)',
    category: 'Warehouse Inbound',
    type: 'Fixed RFID Portal',
    description: 'Penerimaan barang di mana setiap product dilengkapi RFID label. Fixed RFID reader URA4 ditempatkan di pintu masuk untuk automated reading. Sistem membaca dengan akurasi tinggi dan kecepatan optimal hingga 1300+ tags/sec.',
    brand: 'Chainway',
    product: 'Chainway URA4 4-Channel Fixed RFID Reader',
    image: ura4Image,
    specs: [
      'OS: Android 9',
      'CPU: Octa-core 1.8GHz',
      'RAM+ROM: 3GB+32GB / 2GB+16GB (Optional)',
      'RFID: Impinj E Series (Gen2X Supported)',
      'Protocol: EPC Global UHF Class 1 Gen2 / ISO18000-6C',
      'Frequency: 865-868MHz / 920-925MHz / 902-928MHz',
      '4-Channel 50Ω TNC Port',
      'Output Power: 1W (30dBm) / 2W Optional (33dBm)',
      'Power Precision: +/- 1dB',
      'Receive Sensitivity: < -84dBm',
      'Read Rate: 1300+ tags/sec',
      'Connectivity: RS232, RJ45, 3xUSB2.0, Type-C, HDMI',
      'Power: DC 12V, POE (802.3af), POE+ (802.3at)',
      'Antenna Support: 6dBic, 9dBic',
      'Ethernet: 10/100 Base-T',
      'WLAN: 802.11 a/b/g/n/ac, 2.4G/5G',
      'Operating Temp: -25°C to 65°C'
    ],
    additionalInfo: 'Setiap product otomatis tercatat di inventory digital tanpa perlu operator menghentikan aliran. URA4 dengan Android 9, Impinj E Series chip, dan 4-channel capability memberikan stabilitas tinggi. Mendukung Impinj Gen2X untuk enhanced performance. Read rate 1300+ tags/sec dengan receive sensitivity <-84dBm. Support multiple power options (DC/POE/POE+) dan connectivity (RS232/RJ45/USB/HDMI). Compatible dengan berbagai tipe antenna (6dBic, 9dBic). Operating temperature range luas (-25°C to 65°C) untuk warehouse environment ekstrim.'
  },
  W2: {
    title: 'Storage & Inventory (C5)',
    category: 'Warehouse',
    type: 'Handheld UHF RFID Computer',
    description: 'C5 handheld UHF RFID computer untuk real-time inventory tracking dan storage optimization. Operator dapat melakukan stock checking di mana saja di warehouse dengan mobility tinggi dan performa UHF terbaik.',
    brand: 'Chainway',
    product: 'Chainway C5 Handheld UHF RFID Computer',
    image: c5Image,
    specs: [
      'OS: Android 11/13',
      'CPU: Octa-core 2.2GHz',
      'RAM+ROM: 3GB+32GB / 4GB+64GB',
      'Display: 5" (1280x720) / 6" (2160x1080)',
      'RFID: Impinj E Series (Gen2X Supported)',
      'Protocol: EPCglobal Gen2 (ISO18000-6C)',
      'Frequency: 865-868MHz / 920-925MHz / 902-928MHz',
      'Output Power: 1W (30dBm) / 2W Optional',
      'Max Read Range: 30m (MR6), 32m (M750), 33m (H3)',
      'Read Rate: 1300+ tags/sec',
      'Battery: 6700mAh / 13400mAh Pistol Battery',
      'Durability: IP65, 1.5m Drop Test',
      'Camera: 5MP Front, 13MP Rear',
      '2D Barcode, NFC, Fingerprint (Optional)'
    ],
    additionalInfo: 'C5 dengan Android 11/13 dan UHF module berbasis Impinj E Series memberikan performa industry-leading. Mendukung Impinj Gen2X untuk enhanced RFID performance. Read range hingga 33m dan 1300+ tags/sec. Battery removable 6700mAh atau 13400mAh pistol battery untuk operational shift panjang. IP65 rated untuk warehouse environment yang demanding.'
  },
  W3: {
    title: 'Cycle Count & Audit (C72 / C66)',
    category: 'Warehouse',
    type: 'Inventory Verification',
    description: 'C72 atau C66 handheld RFID reader untuk cycle count dan audit inventory. C72: high-performance dengan battery besar untuk intensive operations. C66: compact design dengan quick charge untuk lightweight tasks.',
    brand: 'Chainway',
    product: 'Chainway C72 / C66 Handheld UHF RFID Reader',
    image: c72Image,
    image2: c66Image,
    specs: [
      '=== C72 Specifications ===',
      'OS: Android 11/13',
      'CPU: Octa-core 2.3GHz',
      'RAM+ROM: 3GB+32GB / 4GB+64GB',
      'Display: 5.2" IPS 1920x1080',
      'RFID: Impinj E Series (Gen2X Supported)',
      'Protocol: EPC C1 GEN2 / ISO18000-6C',
      'Frequency: 865-868MHz / 920-925MHz / 902-928MHz',
      'Output Power: 1W (30dBm) / 2W Optional',
      'Max Read Range: 26m (MR6), 28m (M750), 30m (H3)',
      'Read Rate: 1300+ tags/sec',
      'Battery: 8000mAh',
      'Durability: IP65, 1.5m Drop',
      'Camera: 13MP Autofocus with Flash',
      '',
      '=== C66 Specifications ===',
      'OS: Android 11/13',
      'CPU: Octa-core 2.0GHz',
      'RAM+ROM: 3GB+32GB / 4GB+64GB / 6GB+128GB',
      'Display: 5.5" IPS 1440x720',
      'RFID: Built-in UHF (Optional)',
      'Battery: 4420mAh / 5200mAh (Fingerprint/UHF)',
      'Quick Charge: QC3.0 Supported',
      'Durability: IP65 / IP67 Optional, 1.8m Drop',
      'Camera: 13MP Rear Autofocus',
      '2D Barcode, NFC, Fingerprint (Optional)'
    ],
    additionalInfo: 'Cycle count yang biasanya berhari-hari kini hanya butuh beberapa jam. C72: intensive operations dengan 8000mAh battery, IP65, Impinj E Series UHF module, read rate 1300+ tags/sec, ideal untuk high-volume warehouse. C66: compact & cost-effective dengan 5.5" display, 5200mAh battery, QC3.0 quick charge, IP65/IP67, UHF sled support untuk high extensibility, ideal untuk lightweight warehouse tasks.'
  },
  W4: {
    title: 'Outbound Verification (URA4)',
    category: 'Warehouse Outbound',
    type: 'Automated Tunnel Check',
    description: 'Tunnel RFID dengan URA4 untuk verifikasi otomatis sebelum shipment keluar. Sistem mencegah product yang tidak ter-verify meninggalkan warehouse dengan read rate hingga 1300+ tags/sec.',
    brand: 'Chainway',
    product: 'Chainway URA4 4-Channel Fixed RFID Reader',
    image: ura4Image,
    specs: [
      'OS: Android 9',
      'CPU: Octa-core 1.8GHz',
      'RAM+ROM: 3GB+32GB / 2GB+16GB (Optional)',
      'RFID: Impinj E Series (Gen2X Supported)',
      'Protocol: EPC Global UHF Class 1 Gen2 / ISO18000-6C',
      'Frequency: 865-868MHz / 920-925MHz / 902-928MHz',
      '4-Channel 50Ω TNC Port',
      'Output Power: 1W (30dBm) / 2W Optional (33dBm)',
      'Receive Sensitivity: < -84dBm',
      'Read Rate: 1300+ tags/sec',
      'Connectivity: RS232, RJ45, 3xUSB2.0, Type-C, HDMI',
      'Power: DC 12V, POE (802.3af), POE+ (802.3at)',
      'Automated Rejection Alert',
      'Ambient Temp Monitor Supported',
      'Antenna Detector Supported',
      'Operating Temp: -25°C to 65°C'
    ],
    additionalInfo: 'Setiap product yang keluar harus melewati tunnel RFID. URA4 dengan 4-channel capability dan high stability mencegah shipment dengan discrepancy. Read rate 1300+ tags/sec memastikan no-miss detection. Android 9 platform dengan octa-core 1.8GHz processor untuk processing cepat. Support automated rejection alert, ambient temperature monitor, dan antenna detector untuk reliability maksimal. Multiple connectivity options (RS232/RJ45/USB/HDMI) memudahkan integration dengan warehouse management system.'
  },
  C1: {
    title: 'Middleware Layer',
    category: 'Central Hub',
    type: 'Data Integration Platform',
    description: 'Custom middleware application yang mengintegrasikan semua data dari Chainway devices (URA4, C5, C72) melalui HTTP API atau WebSocket. Middleware menerima data real-time dari field devices, memproses data, dan mengirimkan ke database backend untuk storage dan analytics.',
    brand: 'Custom Development',
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
    additionalInfo: 'Middleware berfungsi sebagai jembatan antara Chainway field devices dan database backend. Menerima RFID scan data dari URA4, inventory updates dari C5, dan audit logs dari C72. Semua data dikonversi ke format standard, divalidasi, dan diteruskan ke backend database untuk real-time inventory visibility dan historical analytics.'
  }
};

const initialNodes = [
  // Inbound Section
  {
    id: 'W1',
    type: 'default',
    data: { label: 'Inbound\nReception\n(URA4)' },
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
    data: { label: 'Storage &\nInventory\n(C5)' },
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
    data: { label: 'Cycle Count\n& Audit\n(C72/C66)' },
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
    data: { label: 'Outbound\nVerification\n(URA4)' },
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
        <p>Chainway RFID Solution - Inbound (URA4) → Storage (C5) → Audit (C72/C66) → Outbound (URA4) → Middleware API Gateway → Backend DB</p>
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
          <div className="modal-content-with-image" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>✕</button>
            
            <div className="modal-header">
              <h2>{selectedNode.title}</h2>
              <span className="modal-category">{selectedNode.category}</span>
            </div>

            <div className="modal-body-grid">
              {/* Left Column: Product Image(s) */}
              {(selectedNode.image || selectedNode.image2) && (
                <div className="modal-image-section">
                  {selectedNode.image && (
                    <img 
                      src={selectedNode.image} 
                      alt={selectedNode.product} 
                      className="product-image"
                      style={{ marginBottom: selectedNode.image2 ? '15px' : '0' }}
                    />
                  )}
                  {selectedNode.image2 && (
                    <img 
                      src={selectedNode.image2} 
                      alt={`${selectedNode.product} - Option 2`} 
                      className="product-image"
                    />
                  )}
                </div>
              )}

              {/* Right Column: Product Information */}
              <div className="modal-info-section">
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
                  <h4>Fungsi</h4>
                  <p><strong>Tipe:</strong> {selectedNode.type}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="legend">
        <h3>Legend</h3>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#FF6B6B' }}></span>
          <span>RFID Gate (URA4)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#FFB347' }}></span>
          <span>Handheld (C5)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#FFD700' }}></span>
          <span>Cycle Count (C72/C66)</span>
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
