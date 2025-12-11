import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { RiDashboardLine, RiVirusLine, RiSearchEyeLine, RiBookOpenLine, RiSeedlingFill, RiAdminLine, RiLockUnlockLine, RiNewspaperLine, RiCloseLine } from "react-icons/ri"

// Terima Props isOpen dan closeSidebar dari App.jsx
const Sidebar = ({ isOpen, closeSidebar }) => {
  const location = useLocation()
  
  // LOGIC ADMIN
  const [isAdmin] = useState(() => {
    return localStorage.getItem('CORN_ADMIN') === 'true'
  })

  const handleAdminAccess = () => {
    if (isAdmin) {
        if(window.confirm("Keluar dari Mode Admin?")) {
            localStorage.removeItem('CORN_ADMIN')
            window.location.reload()
        }
    } else {
        const pass = prompt("Masukkan Password Developer:")
        if (pass === "petani123") { 
            localStorage.setItem('CORN_ADMIN', 'true')
            alert("Mode Admin Aktif!")
            window.location.reload()
        }
    }
  }

  const isActive = (path) => location.pathname === path ? "bg-warning text-dark fw-bold shadow-sm" : "text-white-50 hover-text-white"

  return (
    // TAMBAHIN CLASS 'sidebar-container' dan logic 'show'
    <div className={`d-flex flex-column flex-shrink-0 p-3 text-white fixed-top sidebar-container ${isOpen ? 'show' : ''}`} 
      style={{ width: '280px', height: '100vh', backgroundColor: '#1e3a2a', borderRight: '1px solid #ffffff10', transition: 'transform 0.3s ease' }}>
      
      {/* HEADER LOGO + TOMBOL CLOSE (Di HP) */}
      <div className="d-flex align-items-center justify-content-between mb-4 mt-2 px-2">
          <Link to="/dashboard" className="d-flex align-items-center text-white text-decoration-none gap-3" onClick={closeSidebar}>
            <div className="bg-white p-2 rounded-3 d-flex align-items-center justify-content-center" style={{width: 40, height: 40}}>
                <RiSeedlingFill className="text-success" size={24}/>
            </div>
            <div style={{lineHeight: '1.2'}}>
                <span className="fs-5 fw-bold tracking-wide d-block">CornExpert</span>
                <span className={`badge ${isAdmin ? 'bg-danger' : 'bg-secondary'} bg-opacity-25 text-white`} style={{fontSize: '9px', letterSpacing: '1px'}}>
                    {isAdmin ? "SUPER ADMIN" : "GUEST MODE"}
                </span>
            </div>
          </Link>
          
          {/* TOMBOL X (Hanya muncul di HP buat nutup sidebar) */}
          <button onClick={closeSidebar} className="btn btn-link text-white-50 d-md-none p-0">
             <RiCloseLine size={24}/>
          </button>
      </div>
      
      <hr className="border-secondary opacity-25 my-4" />
      
      {/* MENU NAVIGASI */}
      <ul className="nav nav-pills flex-column mb-auto gap-2">
        <li className="nav-item">
          <Link to="/dashboard" onClick={closeSidebar} className={`nav-link d-flex align-items-center gap-3 ${isActive('/dashboard')}`}>
            <RiDashboardLine size={20} /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/diagnosis" onClick={closeSidebar} className={`nav-link d-flex align-items-center gap-3 ${isActive('/diagnosis')}`}>
            <RiSearchEyeLine size={20} /> Mulai Diagnosis
          </Link>
        </li>
        <li>
          <Link to="/data-penyakit" onClick={closeSidebar} className={`nav-link d-flex align-items-center gap-3 ${isActive('/data-penyakit')}`}>
            <RiVirusLine size={20} /> Data Penyakit
          </Link>
        </li>
        <li>
          <Link to="/aturan-penyakit" onClick={closeSidebar} className={`nav-link d-flex align-items-center gap-3 ${isActive('/aturan-penyakit')}`}>
            <RiBookOpenLine size={20} /> Basis Pengetahuan
          </Link>
        </li>

        {isAdmin && (
            <li className="mt-3 pt-3 border-top border-secondary border-opacity-25">
                <small className="text-white-50 ms-3 mb-2 d-block fw-bold" style={{fontSize: '0.7rem'}}>ADMIN AREA</small>
                <Link to="/manajemen-konten" onClick={closeSidebar} className={`nav-link d-flex align-items-center gap-3 ${isActive('/manajemen-konten')}`}>
                    <RiNewspaperLine size={20} /> Manajemen Konten
                </Link>
            </li>
        )}
      </ul>
      
      <hr className="border-secondary opacity-25" />
      
      {/* TOMBOL BAWAH */}
      <div className="mt-auto">
          <button onClick={() => { closeSidebar(); handleAdminAccess(); }} className={`btn w-100 text-start d-flex align-items-center gap-3 px-3 py-2 rounded-3 transition-all ${isAdmin ? 'btn-danger text-white' : 'btn-outline-secondary text-white-50'}`}>
              {isAdmin ? <RiLockUnlockLine size={20} /> : <RiAdminLine size={20} />}
              <strong>{isAdmin ? "Exit Admin Mode" : "Akses Admin"}</strong>
          </button>
      </div>
    </div>
  )
}

export default Sidebar