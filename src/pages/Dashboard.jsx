import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { FiActivity, FiClock, FiSend } from "react-icons/fi"
import { RiVirusFill, RiPlantFill, RiNewspaperLine, RiCloseLine, RiCustomerService2Line } from "react-icons/ri"
import NewsWidget from '../components/NewsWidget' 

// --- MODAL CALL CENTER ---
const CallCenterModal = ({ onClose }) => {
    const [pesan, setPesan] = useState("")
    const [nama, setNama] = useState("")
    const [sending, setSending] = useState(false)

    const kirimMasukan = async (e) => {
        e.preventDefault()
        setSending(true)
        try {
            const { error } = await supabase.from('masukan').insert([{ nama_pengirim: nama, pesan: pesan }])
            if (error) throw error
            alert("Terima kasih! Masukan Anda telah terkirim ke Dinas Pertanian.")
            onClose()
        } catch (err) {
            alert("Gagal kirim: " + err.message)
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center" style={{zIndex: 2000}}>
            <div className="card border-0 shadow-lg rounded-4" style={{width: '500px'}}>
                <div className="card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold m-0 d-flex align-items-center gap-2"><RiCustomerService2Line className="text-warning"/> Layanan Petani</h5>
                    <button onClick={onClose} className="btn btn-light rounded-circle p-2"><RiCloseLine/></button>
                </div>
                <div className="card-body p-4 pt-0">
                    <p className="text-muted small">Silakan sampaikan kendala lapangan, kritik, atau saran untuk Dinas Pertanian.</p>
                    <form onSubmit={kirimMasukan}>
                        <div className="mb-3">
                            <label className="form-label small fw-bold">NAMA ANDA (Opsional)</label>
                            <input type="text" className="form-control" placeholder="Petani Jagung Pohuwato" value={nama} onChange={e => setNama(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label small fw-bold">PESAN / LAPORAN</label>
                            <textarea className="form-control" rows="4" required placeholder="Lapor pak, ada wabah baru di desa..." value={pesan} onChange={e => setPesan(e.target.value)}></textarea>
                        </div>
                        <button disabled={sending} className="btn btn-success w-100 rounded-pill fw-bold">
                            {sending ? "Mengirim..." : <><FiSend className="me-2"/> Kirim Laporan</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

// --- STAT CARD ---
const StatCard = ({ title, value, icon, colorClass, subtext }) => (
  <div className="col-md-4">
    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative">
      <div className="card-body p-4 d-flex align-items-center justify-content-between position-relative" style={{zIndex: 2}}>
        <div>
          <p className="text-muted mb-1 small text-uppercase fw-bold opacity-75">{title}</p>
          <h2 className="fw-bold mb-0 text-dark">{value}</h2>
          <small className={colorClass.replace('bg-', 'text-').replace('bg-opacity-10', '') + " fw-bold"}>{subtext}</small>
        </div>
        <div className={`p-3 rounded-circle ${colorClass}`} style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
      </div>
    </div>
  </div>
)

const Dashboard = () => {
  const [stats, setStats] = useState({ totalPenyakit: 0, totalGejala: 0, totalAturan: 0 })
  const [loading, setLoading] = useState(true) // <--- Ini dipake di bawah (Stats loading state)
  const [showCallCenter, setShowCallCenter] = useState(false)

  useEffect(() => {
    const hitungStatistik = async () => {
      try {
        const { count: cp } = await supabase.from('penyakit').select('*', { count: 'exact', head: true })
        const { count: cg } = await supabase.from('gejala').select('*', { count: 'exact', head: true })
        const { count: ca } = await supabase.from('basis_pengetahuan').select('*', { count: 'exact', head: true })
        setStats({ totalPenyakit: cp || 0, totalGejala: cg || 0, totalAturan: ca || 0 })
      } catch (err) { console.error(err) } finally { setLoading(false) }
    }
    hitungStatistik()
  }, [])

  return (
    <div className="container-fluid pb-5 animate__animated animate__fadeIn">
      
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-5 mt-2">
        <div>
          <h2 className="fw-bold text-dark mb-1">Overview Ladang</h2>
          <p className="text-muted mb-0">Selamat datang kembali! Pantau kondisi pertanian hari ini.</p>
        </div>
        <div className="d-flex align-items-center gap-2 bg-white px-4 py-2 rounded-pill shadow-sm border">
           <div className="spinner-grow spinner-grow-sm text-success" role="status"></div>
           <span className="fw-bold small text-success">SYSTEM ONLINE</span>
        </div>
      </div>

      {/* STATS */}
      <div className="row g-4 mb-5">
        <StatCard 
            title="Total Penyakit" 
            value={loading ? "..." : stats.totalPenyakit} 
            subtext="Data Terverifikasi" 
            colorClass="bg-danger bg-opacity-10 text-danger" 
            icon={<RiVirusFill size={28} />} 
        />
        <StatCard 
            title="Total Gejala" 
            value={loading ? "..." : stats.totalGejala} 
            subtext="Indikator Fisik" 
            colorClass="bg-warning bg-opacity-10 text-warning" 
            icon={<FiActivity size={28} />} 
        />
        <StatCard 
            title="Basis Pengetahuan" 
            value={loading ? "..." : stats.totalAturan} 
            subtext="Rules Kecerdasan" 
            colorClass="bg-primary bg-opacity-10 text-primary" 
            icon={<FiClock size={28} />} 
        />
      </div>

      <div className="row g-4">
        {/* KIRI: BANNER CALL CENTER & GRAFIK */}
        <div className="col-lg-7">
            
            {/* Banner Call Center */}
            <div className="card border-0 shadow-sm rounded-4 bg-success text-white overflow-hidden position-relative mb-4">
                <div className="card-body p-4 position-relative" style={{zIndex: 2}}>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h4 className="fw-bold mb-2">Punya Masalah Pertanian?</h4>
                            <p className="opacity-75 mb-0" style={{maxWidth: '400px'}}>Kirim laporan atau kritik langsung ke Dinas Pertanian.</p>
                        </div>
                        <button onClick={() => setShowCallCenter(true)} className="btn btn-warning text-dark fw-bold rounded-pill px-4 shadow-sm">
                            Hubungi Call Center
                        </button>
                    </div>
                </div>
                <RiNewspaperLine size={180} className="position-absolute text-white opacity-25" style={{bottom: '-40px', right: '50px', transform: 'rotate(-20deg)'}} />
            </div>

            {/* Grafik Placeholder */}
            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-header bg-white py-3 border-bottom">
                    <h6 className="fw-bold m-0 text-dark">📊 Tren Diagnosa (Data Real-time)</h6>
                </div>
                <div className="card-body d-flex align-items-center justify-content-center bg-light m-3 rounded-4 border border-dashed" style={{height: '220px'}}>
                    <div className="text-center text-muted opacity-50">
                        <RiPlantFill size={50} className="mb-3 text-success"/>
                        <h5 className="fw-bold">Grafik Belum Tersedia</h5>
                        <p className="small">Menunggu data interaksi petani lebih banyak.</p>
                    </div>
                </div>
            </div>
        </div>

        {/* KANAN: BERITA */}
        <div className="col-lg-5">
             <NewsWidget />
        </div>
      </div>

      {/* RENDER MODAL JIKA AKTIF */}
      {showCallCenter && <CallCenterModal onClose={() => setShowCallCenter(false)} />}

    </div>
  )
}

export default Dashboard