import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { RiMenuLine } from "react-icons/ri" // Import Icon Hamburger

// --- IMPORT HALAMAN ---
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import DataPenyakit from './pages/DataPenyakit'
import Diagnosis from './pages/Diagnosis' 
import AturanPenyakit from './pages/AturanPenyakit'
import DetailPenyakit from './pages/DetailPenyakit'
import ManajemenKonten from './pages/ManajemenKonten'

// --- IMPORT KOMPONEN ---
import Sidebar from './components/Sidebar'
import Topbar from './components/TopBar' 

// =========================================================
// LAYOUT UTAMA (RESPONSIVE VERSION)
// =========================================================
const MainLayout = ({ children }) => {
  // State buat buka/tutup Sidebar di Mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* 1. SIDEBAR (Kita oper state isOpen ke sini) */}
      <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />

      {/* OVERLAY HITAM (Cuma muncul di HP pas menu dibuka) */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* 2. AREA KONTEN UTAMA */}
      <main className="main-content-area">
        
        {/* TOMBOL HAMBURGER (CUMA MUNCUL DI HP) */}
        <div className="d-md-none p-3 pb-0 d-flex align-items-center justify-content-between">
            <h5 className="fw-bold text-success m-0">CornExpert</h5>
            <button 
                onClick={() => setIsSidebarOpen(true)} 
                className="btn btn-light shadow-sm text-success border"
            >
                <RiMenuLine size={24}/>
            </button>
        </div>

        {/* TOPBAR BIASA */}
        <div className="d-none d-md-block">
             <Topbar />
        </div>

        {/* KONTEN */}
        <div className="mt-3 mt-md-0">
            {children}
        </div>
        
      </main>
    </div>
  );
};

// --- APLIKASI UTAMA ---
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/data-penyakit" element={<MainLayout><DataPenyakit /></MainLayout>} />
        <Route path="/diagnosis" element={<MainLayout><Diagnosis /></MainLayout>} />
        <Route path="/aturan-penyakit" element={<MainLayout><AturanPenyakit /></MainLayout>} />
        <Route path="/manajemen-konten" element={<MainLayout><ManajemenKonten /></MainLayout>} />
        <Route path="/penyakit/:id" element={<MainLayout><DetailPenyakit /></MainLayout>} />

      </Routes>
    </Router>
  )
}

export default App