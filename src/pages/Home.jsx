import React from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiCheckCircle, FiCpu, FiShield, FiPlay } from "react-icons/fi"
import { RiSeedlingFill } from "react-icons/ri"

// --- 1. IMPORT GAMBAR DARI ASSETS ---
// Pastikan nama file sama persis (bg-jagung.jpg)
import bgImage from '../assets/bg-jagung.jpg'

function Home() {
  return (
    <div className="min-vh-100 d-flex flex-column" style={{ fontFamily: "'Poppins', sans-serif" }}>
      
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg py-3 fixed-top shadow-sm" 
           style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
        <div className="container">
          <div className="d-flex align-items-center gap-2">
             <div className="bg-success rounded-3 p-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                <RiSeedlingFill color="white" size={24} />
             </div>
             <h5 className="mb-0 fw-bold" style={{ color: '#14532d' }}>CornExpert</h5>
          </div>
          <div>
            <Link to="/login" className="btn rounded-pill px-4 fw-bold" 
              style={{ border: '2px solid #14532d', color: '#14532d' }}>
              Login Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION DENGAN GAMBAR LOKAL */}
      <section className="flex-grow-1 d-flex align-items-center justify-content-center pt-5 pb-5 text-center px-3"
        style={{ 
          marginTop: '60px',
          // --- 2. PANGGIL VARIABEL GAMBAR DI SINI ---
          // Perhatiin tanda petik miring (backticks) ` ` bukan ' '
          background: `linear-gradient(rgba(6, 78, 59, 0.85), rgba(20, 83, 45, 0.9)), url(${bgImage})`,
          
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed', 
          color: 'white',
          minHeight: '85vh',
          borderBottomRightRadius: '50px',
          borderBottomLeftRadius: '50px'
        }}>
        
        <div className="container">
            <div className="mb-4 d-inline-block px-4 py-2 rounded-pill fw-bold small shadow" 
                 style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(251, 191, 36, 0.5)', color: '#fbbf24', backdropFilter: 'blur(5px)' }}>
               ✨ Sistem Pakar Cerdas v1.0
            </div>
            
            <h1 className="display-3 fw-bold mb-4" style={{ lineHeight: '1.2', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
              Solusi Cerdas Petani <br/> 
              <span style={{ color: '#fbbf24' }}>Panen Jagung Melimpah</span>
            </h1>
            
            <p className="lead mb-5 px-md-5 mx-auto text-white-50" style={{ maxWidth: '700px' }}>
              Deteksi penyakit tanaman jagung lebih awal dengan teknologi AI. 
              Tingkatkan kualitas hasil panen Anda tanpa khawatir serangan hama yang terlambat ditangani.
            </p>
            
            <div className="d-flex gap-3 justify-content-center flex-column flex-sm-row">
              <Link to="/Dashboard" className="btn btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg d-flex align-items-center justify-content-center gap-2"
                style={{ 
                   background: 'linear-gradient(45deg, #f59e0b, #fbbf24)', 
                   color: '#000',
                   border: 'none',
                   transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                 Mulai Diagnosa Sekarang <FiArrowRight />
              </Link>
              
              <button className="btn btn-outline-light btn-lg rounded-pill px-5 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                 style={{ backdropFilter: 'blur(5px)' }}>
                 <FiPlay /> Demo Video
              </button>
            </div>

            <div className="row mt-5 pt-4 justify-content-center g-4 text-white">
               <div className="col-4 col-md-2 border-end border-white border-opacity-25">
                 <h3 className="fw-bold mb-0">98%</h3>
                 <small className="text-white-50">Akurasi</small>
               </div>
               <div className="col-4 col-md-2 border-end border-white border-opacity-25">
                 <h3 className="fw-bold mb-0">2s</h3>
                 <small className="text-white-50">Kecepatan</small>
               </div>
               <div className="col-4 col-md-2">
                 <h3 className="fw-bold mb-0">24/7</h3>
                 <small className="text-white-50">Online</small>
               </div>
            </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-5" style={{ backgroundColor: '#f0fdf4' }}>
        <div className="container py-4">
          <div className="row justify-content-center mb-5">
             <div className="col-md-8 text-center">
                <h6 className="text-success fw-bold text-uppercase ls-2">Kenapa Memilih Kami?</h6>
                <h2 className="fw-bold text-dark">Teknologi Pertanian Masa Depan</h2>
             </div>
          </div>

          <div className="row g-4 text-center">
             <div className="col-md-4">
               <div className="p-5 rounded-4 h-100 border-0 shadow-sm bg-white card-hover">
                 <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-block mb-4">
                    <FiCpu size={32} className="text-success" />
                 </div>
                 <h4 className="fw-bold text-dark mb-3">AI Powered</h4>
                 <p className="text-muted">Menggunakan algoritma Case Based Reasoning (CBR) yang mampu belajar dari kasus-kasus sebelumnya.</p>
               </div>
             </div>
             <div className="col-md-4">
               <div className="p-5 rounded-4 h-100 border-0 shadow-sm bg-white card-hover">
                 <div className="bg-warning bg-opacity-10 p-3 rounded-circle d-inline-block mb-4">
                    <FiShield size={32} className="text-warning" />
                 </div>
                 <h4 className="fw-bold text-dark mb-3">Database Valid</h4>
                 <p className="text-muted">Setiap data gejala dan solusi telah divalidasi langsung oleh pakar pertanian profesional.</p>
               </div>
             </div>
             <div className="col-md-4">
               <div className="p-5 rounded-4 h-100 border-0 shadow-sm bg-white card-hover">
                 <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-4">
                    <FiCheckCircle size={32} className="text-primary" />
                 </div>
                 <h4 className="fw-bold text-dark mb-3">User Friendly</h4>
                 <p className="text-muted">Tampilan dirancang sangat sederhana agar mudah digunakan oleh petani di lapangan.</p>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-4 text-center text-secondary small bg-white border-top">
        <div className="container d-flex justify-content-between align-items-center flex-column flex-md-row">
           <p className="mb-0">&copy; 2025 CornExpert System.</p>
           <p className="mb-0">Dibuat dengan 🌽 untuk Petani Indonesia</p>
        </div>
      </footer>

    </div>
  )
}

export default Home