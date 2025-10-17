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
import './App.css';

// Node Details/Information
const nodeDetails = {
  A1: {
    title: 'RFID Handler',
    category: 'End Device',
    type: 'Input Device',
    description: 'Perangkat untuk membaca dan menulis data RFID tag pada produk.',
    vendor: 'Chainway',
    product: 'Chainway C3 - Handheld RFID Reader',
    specs: ['UHF RFID Reader', 'Operating Range: up to 7m', 'Dual Frequency: 865-868 MHz / 902-928 MHz'],
    dataFlow: 'Mengirim data produk → Access Switch 1'
  },
  A2: {
    title: 'RFID Gate',
    category: 'End Device',
    type: 'Input Device',
    description: 'Portal RFID untuk membaca tag secara otomatis saat barang melewati.',
    vendor: 'Checkpoint Systems',
    product: 'Checkpoint UHF RFID Portal',
    specs: ['Portal RFID UHF', 'Real-time Inventory Tracking', 'Accuracy: 99%+'],
    dataFlow: 'Mengirim data exit gate → Access Switch 1'
  },
  A3: {
    title: 'Barcode Device',
    category: 'End Device',
    type: 'Input Device',
    description: 'Perangkat scanner barcode untuk input data produk dan stok.',
    vendor: 'Chainway',
    product: 'Chainway MC51 - Mobile Computer',
    specs: ['1D/2D Barcode Scanner', 'Android OS', 'IP67 Rating (Water-resistant)'],
    dataFlow: 'Mengirim scan barcode → Access Switch 2'
  },
  A4: {
    title: 'Point of Sale',
    category: 'End Device',
    type: 'Input/Output Device',
    description: 'Terminal POS untuk transaksi penjualan dan inventory management.',
    vendor: 'POSPlus',
    product: 'POSPlus Integrated POS System',
    specs: ['Integrated Payment Gateway', 'Receipt Printer Built-in', 'Real-time Sync with Database'],
    dataFlow: 'Mengirim transaksi → Access Switch 2, Menerima data dari Server'
  },
  B1: {
    title: 'Access Switch 1',
    category: 'Access Layer',
    type: 'Network Switch',
    description: 'Switch layer pertama yang menghubungkan RFID Handler dan RFID Gate.',
    specs: ['Layer 2 Switch', '24-48 Port', 'Gigabit Speed (1Gbps)'],
    dataFlow: 'Menerima dari RFID devices → Forward ke Distribution Switch',
    additionalInfo: {
      lan: 'LAN (Local Area Network) adalah jaringan lokal yang terdiri dari semua device yang terhubung melalui Switch ini. Access Switch berfungsi menghubungkan semua device akhir (End Devices) dalam satu segmen LAN. Semua device di LAN memiliki IP Local 192.168.x.x dan berkomunikasi internal tanpa lewat Internet. Router memisahkan LAN dari WAN (Internet).'
    }
  },
  B2: {
    title: 'Access Switch 2',
    category: 'Access Layer',
    type: 'Network Switch',
    description: 'Switch layer pertama yang menghubungkan Barcode Device dan POS.',
    specs: ['Layer 2 Switch', '24-48 Port', 'Gigabit Speed (1Gbps)'],
    dataFlow: 'Menerima dari Barcode & POS → Forward ke Distribution Switch',
    additionalInfo: {
      lan: 'LAN (Local Area Network) adalah jaringan lokal yang terdiri dari semua device yang terhubung melalui Switch ini. Access Switch berfungsi menghubungkan semua device akhir (End Devices) dalam satu segmen LAN. Semua device di LAN memiliki IP Local 192.168.x.x dan berkomunikasi internal tanpa lewat Internet. Router memisahkan LAN dari WAN (Internet).'
    }
  },
  C: {
    title: 'Distribution Switch',
    category: 'Distribution Layer',
    type: 'Network Switch',
    description: 'Switch layer kedua yang mengagregasi traffic dari semua access switch.',
    specs: ['Layer 2/3 Switch', 'High Performance', '10Gbps Uplink'],
    dataFlow: 'Menerima dari Access Switches → Forward ke Core Switch'
  },
  D: {
    title: 'Core Switch',
    category: 'Core Layer',
    type: 'Network Switch',
    description: 'Backbone jaringan internal, menghubungkan semua traffic utama.',
    specs: ['Layer 3 Switch', 'Core Infrastructure', '40-100Gbps Capacity'],
    dataFlow: 'Routing traffic dari Distribution → Router'
  },
  E: {
    title: 'Router',
    category: 'Control & Management',
    type: 'Network Device',
    description: 'Mengarahkan traffic antara jaringan internal dan eksternal. Router menggunakan IP Public untuk berkomunikasi dengan ISP dan Internet, serta IP Local (Private) untuk jaringan internal LAN.',
    vendor: 'Maipu',
    product: 'Maipu MP1900X Series Access Router / NSR1900X-22 MPLS Access Router',
    specs: [
      'Access Router dengan MPLS Support',
      'NAT/PAT Support (Network Address Translation)',
      'IP Public: untuk komunikasi dengan ISP (WAN side)',
      'IP Local/Private: 192.168.0.0/16 untuk LAN internal (LAN side)',
      'VPN Capable dengan IPsec/L2TP',
      'Dual Network Interface: WAN dan LAN',
      'BGP, OSPF, RIP Routing Protocol Support'
    ],
    dataFlow: 'Gateway antara Internal Network (LAN) ↔ Firewall ↔ ISP (WAN)',
    additionalInfo: {
      ipPublic: 'IP Public adalah alamat IP yang unik di Internet, diberikan oleh ISP. Digunakan untuk komunikasi dengan server eksternal dan cloud. Setiap perangkat di WAN melihat router dengan IP Public ini.',
      ipLocal: 'IP Local (Private) adalah alamat IP internal dari range 192.168.x.x, 10.x.x.x, atau 172.16-31.x.x. Digunakan hanya dalam LAN, tidak bisa diakses dari Internet. Router menerjemahkan IP Local ke IP Public melalui NAT.',
      nat: 'NAT (Network Address Translation) memungkinkan ribuan device dengan IP Local untuk berbagi satu IP Public. Router mengelola mapping antara IP Local perangkat internal dengan IP Public. Contoh: Device internal 192.168.1.5 dapat berkomunikasi dengan Internet melalui IP Public 203.45.67.89.'
    }
  },
  F: {
    title: 'Firewall',
    category: 'Security Layer',
    type: 'Security Device',
    description: 'Melindungi jaringan dari ancaman eksternal dengan filtering traffic.',
    specs: ['Stateful Firewall', 'DPI (Deep Packet Inspection)', 'IDS/IPS Integration'],
    dataFlow: 'Monitore & filter traffic antara Router ↔ ISP'
  },
  I: {
    title: 'ISP',
    category: 'Internet & ISP',
    type: 'External Provider',
    description: 'Internet Service Provider yang menyediakan konektivitas ke cloud.',
    specs: ['WAN Connection', 'Bandwidth: 10-100 Mbps', 'Redundancy Available'],
    dataFlow: 'Gateway ke Internet publik'
  },
  H: {
    title: 'Cloud',
    category: 'Cloud',
    type: 'External Service',
    description: 'Cloud storage dan backup untuk redundancy data.',
    specs: ['Cloud Provider', 'Multi-region Deployment', '99.9% Uptime SLA'],
    dataFlow: 'Backup & external API integration'
  },
  S1: {
    title: 'Web Server',
    category: 'Servers',
    type: 'Server',
    description: 'Melayani HTTP/HTTPS request, UI aplikasi inventory.',
    specs: ['Linux/Windows', 'Apache/Nginx', 'Load Balancing Ready'],
    dataFlow: 'Menerima request dari client → Return response'
  },
  S2: {
    title: 'Database Server',
    category: 'Servers',
    type: 'Server',
    description: 'Menyimpan semua data inventory, transaksi, dan user.',
    specs: ['MySQL/PostgreSQL', '1TB+ Storage', 'Replication Active-Passive'],
    dataFlow: 'CRUD operations untuk inventory data'
  },
  S3: {
    title: 'Application Server',
    category: 'Servers',
    type: 'Server',
    description: 'Backend application logic untuk processing bisnis inventory.',
    specs: ['Node.js/Java/Python', 'Message Queue: RabbitMQ', 'Cache: Redis'],
    dataFlow: 'Business logic processing & data validation'
  }
};

const initialNodes = [
  // End Devices Group
  {
    id: 'A1',
    type: 'default',
    data: { label: 'RFID Handler' },
    position: { x: 50, y: 100 },
    style: { 
      background: '#4d96ff', 
      color: 'white', 
      border: '2px solid #3d86ef',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '12px',
      fontWeight: 'bold'
    },
  },
  {
    id: 'A2',
    type: 'default',
    data: { label: 'RFID Gate' },
    position: { x: 200, y: 100 },
    style: { 
      background: '#4d96ff', 
      color: 'white', 
      border: '2px solid #3d86ef',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '12px',
      fontWeight: 'bold'
    },
  },
  {
    id: 'A3',
    type: 'default',
    data: { label: 'Barcode Device' },
    position: { x: 350, y: 100 },
    style: { 
      background: '#4d96ff', 
      color: 'white', 
      border: '2px solid #3d86ef',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '12px',
      fontWeight: 'bold'
    },
  },
  {
    id: 'A4',
    type: 'default',
    data: { label: 'Point of Sale' },
    position: { x: 500, y: 100 },
    style: { 
      background: '#4d96ff', 
      color: 'white', 
      border: '2px solid #3d86ef',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '12px',
      fontWeight: 'bold'
    },
  },
  
  // Access Switch Layer
  {
    id: 'B1',
    type: 'default',
    data: { label: 'Access Switch 1' },
    position: { x: 125, y: 250 },
    style: { 
      background: '#9d6bff', 
      color: 'white', 
      border: '2px solid #8d5bef',
      borderRadius: '8px',
      padding: '12px',
      fontSize: '13px',
      fontWeight: 'bold'
    },
  },
  {
    id: 'B2',
    type: 'default',
    data: { label: 'Access Switch 2' },
    position: { x: 425, y: 250 },
    style: { 
      background: '#9d6bff', 
      color: 'white', 
      border: '2px solid #8d5bef',
      borderRadius: '8px',
      padding: '12px',
      fontSize: '13px',
      fontWeight: 'bold'
    },
  },
  
  // Distribution Switch Layer
  {
    id: 'C',
    type: 'default',
    data: { label: 'Distribution Switch' },
    position: { x: 275, y: 400 },
    style: { 
      background: '#ffd93d', 
      color: '#333', 
      border: '2px solid #efc92d',
      borderRadius: '8px',
      padding: '14px',
      fontSize: '14px',
      fontWeight: 'bold'
    },
  },
  
  // Core Layer
  {
    id: 'D',
    type: 'default',
    data: { label: 'Core Switch' },
    position: { x: 275, y: 550 },
    style: { 
      background: '#ff6b6b', 
      color: 'white', 
      border: '2px solid #ef5b5b',
      borderRadius: '8px',
      padding: '14px',
      fontSize: '14px',
      fontWeight: 'bold'
    },
  },
  
  // Control & Management
  {
    id: 'E',
    type: 'default',
    data: { label: 'Router' },
    position: { x: 275, y: 700 },
    style: { 
      background: '#6bcf7f', 
      color: 'white', 
      border: '2px solid #5bbf6f',
      borderRadius: '8px',
      padding: '14px',
      fontSize: '14px',
      fontWeight: 'bold'
    },
  },
  
  // Firewall (Security Layer)
  {
    id: 'F',
    type: 'default',
    data: { label: 'Firewall' },
    position: { x: 275, y: 775 },
    style: { 
      background: '#ff6f00', 
      color: 'white', 
      border: '2px solid #e56500',
      borderRadius: '8px',
      padding: '14px',
      fontSize: '14px',
      fontWeight: 'bold'
    },
  },
  
  // Internet & ISP
  {
    id: 'I',
    type: 'default',
    data: { label: 'ISP' },
    position: { x: 275, y: 925 },
    style: { 
      background: '#ff9999', 
      color: 'white', 
      border: '2px solid #ef8989',
      borderRadius: '8px',
      padding: '14px',
      fontSize: '14px',
      fontWeight: 'bold'
    },
  },
  {
    id: 'H',
    type: 'default',
    data: { label: 'Cloud' },
    position: { x: 275, y: 1075 },
    style: { 
      background: '#c0c0c0', 
      color: '#333', 
      border: '2px solid #b0b0b0',
      borderRadius: '8px',
      padding: '14px',
      fontSize: '14px',
      fontWeight: 'bold'
    },
  },
  
  // Servers
  {
    id: 'S1',
    type: 'default',
    data: { label: 'Web Server' },
    position: { x: 50, y: 1150 },
    style: { 
      background: '#95e1d3', 
      color: '#333', 
      border: '2px solid #85d1c3',
      borderRadius: '8px',
      padding: '12px',
      fontSize: '13px',
      fontWeight: 'bold'
    },
  },
  {
    id: 'S2',
    type: 'default',
    data: { label: 'Database Server' },
    position: { x: 250, y: 1150 },
    style: { 
      background: '#95e1d3', 
      color: '#333', 
      border: '2px solid #85d1c3',
      borderRadius: '8px',
      padding: '12px',
      fontSize: '13px',
      fontWeight: 'bold'
    },
  },
  {
    id: 'S3',
    type: 'default',
    data: { label: 'Application Server' },
    position: { x: 450, y: 1150 },
    style: { 
      background: '#95e1d3', 
      color: '#333', 
      border: '2px solid #85d1c3',
      borderRadius: '8px',
      padding: '12px',
      fontSize: '13px',
      fontWeight: 'bold'
    },
  },
];

const initialEdges = [
  // End Devices to Access Switches
  { id: 'e-A1-B1', source: 'A1', target: 'B1', type: 'default', animated: false },
  { id: 'e-A2-B1', source: 'A2', target: 'B1', type: 'default', animated: false },
  { id: 'e-A3-B2', source: 'A3', target: 'B2', type: 'default', animated: false },
  { id: 'e-A4-B2', source: 'A4', target: 'B2', type: 'default', animated: false },
  
  // Access Switches to Distribution
  { id: 'e-B1-C', source: 'B1', target: 'C', label: 'Uplink', type: 'default', animated: false, style: { stroke: '#9d6bff', strokeWidth: 2 } },
  { id: 'e-B2-C', source: 'B2', target: 'C', label: 'Uplink', type: 'default', animated: false, style: { stroke: '#9d6bff', strokeWidth: 2 } },
  
  // Distribution to Core
  { id: 'e-C-D', source: 'C', target: 'D', label: 'Uplink', type: 'default', animated: false, style: { stroke: '#ffd93d', strokeWidth: 2 } },
  
  // Core to Router
  { id: 'e-D-E', source: 'D', target: 'E', label: 'Ethernet', type: 'default', animated: false, style: { stroke: '#ff6b6b', strokeWidth: 2 } },
  
  // Router to Firewall
  { id: 'e-E-F', source: 'E', target: 'F', label: 'Protected', type: 'default', animated: false, style: { stroke: '#6bcf7f', strokeWidth: 2 } },
  
  // Firewall to ISP
  { id: 'e-F-I', source: 'F', target: 'I', label: 'Secured', type: 'default', animated: false, style: { stroke: '#ff6f00', strokeWidth: 2 } },
  
  // ISP to Cloud
  { id: 'e-I-H', source: 'I', target: 'H', label: 'Internet', type: 'default', animated: false, style: { stroke: '#ff9999', strokeWidth: 2 } },
  
  // Cloud to Servers
  { id: 'e-H-S1', source: 'H', target: 'S1', type: 'default', animated: false },
  { id: 'e-H-S2', source: 'H', target: 'S2', type: 'default', animated: false },
  { id: 'e-H-S3', source: 'H', target: 'S3', type: 'default', animated: false },
  
  // Servers Response (dashed lines)
  { 
    id: 'e-S1-H', 
    source: 'S1', 
    target: 'H', 
    label: 'Response', 
    type: 'default', 
    animated: true,
    style: { stroke: '#95e1d3', strokeWidth: 2, strokeDasharray: '5,5' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#95e1d3' }
  },
  { 
    id: 'e-S2-H', 
    source: 'S2', 
    target: 'H', 
    label: 'Response', 
    type: 'default', 
    animated: true,
    style: { stroke: '#95e1d3', strokeWidth: 2, strokeDasharray: '5,5' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#95e1d3' }
  },
  { 
    id: 'e-S3-H', 
    source: 'S3', 
    target: 'H', 
    label: 'Response', 
    type: 'default', 
    animated: true,
    style: { stroke: '#95e1d3', strokeWidth: 2, strokeDasharray: '5,5' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#95e1d3' }
  },
];

function App() {
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
        <h1>Network Topology Diagram</h1>
        <p>Data Flow dari Device ke Server - Klik node untuk detail</p>
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

              {selectedNode.additionalInfo && (
                <div className="modal-section">
                  <h4>Penjelasan Teknis</h4>
                  {selectedNode.additionalInfo.ipPublic && (
                    <div className="info-box">
                      <p><strong>IP Public (WAN):</strong></p>
                      <p className="info-text">{selectedNode.additionalInfo.ipPublic}</p>
                    </div>
                  )}
                  {selectedNode.additionalInfo.ipLocal && (
                    <div className="info-box">
                      <p><strong>IP Local/Private (LAN):</strong></p>
                      <p className="info-text">{selectedNode.additionalInfo.ipLocal}</p>
                    </div>
                  )}
                  {selectedNode.additionalInfo.nat && (
                    <div className="info-box">
                      <p><strong>NAT (Network Address Translation):</strong></p>
                      <p className="info-text">{selectedNode.additionalInfo.nat}</p>
                    </div>
                  )}
                  {selectedNode.additionalInfo.lan && (
                    <div className="info-box">
                      <p><strong>LAN (Local Area Network):</strong></p>
                      <p className="info-text">{selectedNode.additionalInfo.lan}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="legend">
        <h3>Legend</h3>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#4d96ff' }}></span>
          <span>End Devices</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#9d6bff' }}></span>
          <span>Access Switch Layer</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#ffd93d' }}></span>
          <span>Distribution Switch Layer</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#ff6b6b' }}></span>
          <span>Core Layer</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#6bcf7f' }}></span>
          <span>Control & Management</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#ff6f00' }}></span>
          <span>Firewall</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#ff9999' }}></span>
          <span>Internet & ISP</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#95e1d3' }}></span>
          <span>Servers</span>
        </div>
      </div>
    </div>
  );
}

export default App;
