import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom"; 
import { RiVirusFill, RiAddLine, RiEditLine, RiDeleteBinLine, RiImageAddLine, RiLinksLine, RiShieldCheckLine } from "react-icons/ri";

const DataPenyakit = () => {
  // State Data
  const [dataPenyakit, setDataPenyakit] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State Form CRUD
  const [mode, setMode] = useState('tabel'); 
  const [idEdit, setIdEdit] = useState(null);
  
  // State Form Input
  const [form, setForm] = useState({ 
    kode: '', nama: '', solusi: '',
    penyebab: '', jenis_penyebab: 'Belum Diketahui', 
    foto_url: '', foto_penyebab: ''
  });

  // --- 👮‍♂️ CEK STATUS ADMIN (LOGIC BARU) ---
  const isAdmin = localStorage.getItem('CORN_ADMIN') === 'true';

  // 1. FETCH DATA
  const ambilData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('penyakit').select('*').order('id', { ascending: true });
      if (error) throw error;
      setDataPenyakit(data);
    } catch (error) {
      alert("Gagal ambil data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ambilData();
  }, []);

  // 2. HANDLER HAPUS
  const hapusData = async (id) => {
    if (!isAdmin) return alert("Eits! Anda bukan Admin!"); // Proteksi ganda
    
    if (window.confirm("Yakin mau hapus data ini bro?")) {
      try {
        const { error } = await supabase.from('penyakit').delete().eq('id', id);
        if (error) throw error;
        ambilData(); 
      } catch (error) {
        alert("Gagal hapus: " + error.message);
      }
    }
  };

  // 3. HANDLER SIMPAN
  const simpanData = async (e) => {
    e.preventDefault();
    if (!isAdmin) return alert("Anda tidak punya akses!"); // Proteksi ganda

    try {
      if (mode === 'tambah') {
        const { error } = await supabase.from('penyakit').insert([form]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('penyakit').update(form).eq('id', idEdit);
        if (error) throw error;
      }
      resetForm();
      ambilData();
    } catch (error) {
      alert("Gagal simpan: " + error.message);
    }
  };

  const resetForm = () => {
    setMode('tabel');
    setForm({ 
        kode: '', nama: '', solusi: '', 
        penyebab: '', jenis_penyebab: 'Belum Diketahui', 
        foto_url: '', foto_penyebab: '' 
    });
  };

  const bukaEdit = (item) => {
    if (!isAdmin) return; 
    setMode('edit');
    setIdEdit(item.id);
    setForm({ 
        kode: item.kode, 
        nama: item.nama, 
        solusi: item.solusi,
        penyebab: item.penyebab || '',
        jenis_penyebab: item.jenis_penyebab || 'Belum Diketahui',
        foto_url: item.foto_url || '',
        foto_penyebab: item.foto_penyebab || ''
    });
  };

  return (
    <div className="container-fluid pb-5">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
        <div>
          <h2 className="fw-bold text-dark mb-1">Data Penyakit</h2>
          <p className="text-muted mb-0">
            {isAdmin ? "Kelola daftar penyakit (Mode Admin)." : "Daftar referensi penyakit jagung (Mode Lihat)."}
          </p>
        </div>
        <div className="d-flex align-items-center gap-2 bg-white px-3 py-2 rounded-pill shadow-sm">
           {isAdmin ? <RiShieldCheckLine className="text-danger"/> : <RiVirusFill className="text-success" />}
           <span className={`fw-bold small ${isAdmin ? 'text-danger' : 'text-success'}`}>
             {isAdmin ? "ADMIN ACCESS" : "READ ONLY"}
           </span>
        </div>
      </div>

      {/* KONTEN UTAMA */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-body p-4">
          
          {/* HEADER TABEL & TOMBOL TAMBAH (Hanya Muncul Jika Admin) */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0 text-dark">
              {mode === 'tabel' ? '📋 List Penyakit Terdaftar' : (mode === 'tambah' ? '➕ Tambah Penyakit Baru' : '✏️ Edit Data Penyakit')}
            </h5>
            
            {/* LOGIC HIDE TOMBOL TAMBAH */}
            {isAdmin && mode === 'tabel' && (
              <button onClick={() => { setMode('tambah'); resetForm(); }} className="btn btn-warning fw-bold text-dark rounded-pill px-4 shadow-sm d-flex align-items-center gap-2">
                <RiAddLine /> Tambah Data
              </button>
            )}
            
            {mode !== 'tabel' && (
              <button onClick={() => setMode('tabel')} className="btn btn-light rounded-pill px-4">Batal</button>
            )}
          </div>

          {/* MODE TABEL */}
          {mode === 'tabel' ? (
             <div className="table-responsive">
                <table className="table table-hover align-middle">
                   <thead className="bg-light">
                      <tr>
                         <th className="py-3 ps-3 rounded-start text-secondary small fw-bold">KODE</th>
                         <th className="py-3 text-secondary small fw-bold">NAMA PENYAKIT</th>
                         <th className="py-3 text-secondary small fw-bold">PENYEBAB</th>
                         <th className="py-3 pe-3 rounded-end text-center text-secondary small fw-bold" style={{width: isAdmin ? '180px' : '100px'}}>AKSI</th>
                      </tr>
                   </thead>
                   <tbody>
                      {loading ? (
                        <tr><td colSpan="4" className="text-center py-5">Loading data...</td></tr>
                      ) : dataPenyakit.length === 0 ? (
                        <tr><td colSpan="4" className="text-center py-5 text-muted">Belum ada data.</td></tr>
                      ) : (
                        dataPenyakit.map((item) => (
                           <tr key={item.id}>
                              <td className="ps-3"><span className="badge bg-secondary bg-opacity-10 text-secondary">{item.kode}</span></td>
                              <td className="fw-bold text-dark">
                                  {item.nama}
                                  {item.foto_url && <RiImageAddLine className="ms-2 text-success" title="Ada Foto"/>}
                              </td>
                              <td className="text-muted small">
                                {item.jenis_penyebab ? <span className="badge bg-info bg-opacity-10 text-info me-2">{item.jenis_penyebab}</span> : '-'}
                                {item.penyebab || '-'}
                              </td>
                              <td className="text-center pe-3">
                                 {/* SEMUA BISA LIHAT TOMBOL DETAIL */}
                                 <Link to={`/penyakit/${item.id}`} className="btn btn-sm btn-success me-2 rounded-pill px-3 py-1 fw-bold" style={{fontSize: '0.8rem'}}>
                                    Detail
                                 </Link>
                                 
                                 {/* LOGIC HIDE TOMBOL EDIT & HAPUS */}
                                 {isAdmin && (
                                   <>
                                     <button onClick={() => bukaEdit(item)} className="btn btn-sm btn-light text-primary me-2 rounded-circle p-2"><RiEditLine size={16}/></button>
                                     <button onClick={() => hapusData(item.id)} className="btn btn-sm btn-light text-danger rounded-circle p-2"><RiDeleteBinLine size={16}/></button>
                                   </>
                                 )}
                              </td>
                           </tr>
                        ))
                      )}
                   </tbody>
                </table>
             </div>
          ) : (
             /* MODE FORM (HANYA MUNCUL KALAU ADMIN) */
             isAdmin ? (
               <form onSubmit={simpanData}>
                  <div className="row g-3">
                     {/* ... (BAGIAN FORM SAMA KAYAK SEBELUMNYA) ... */}
                     <div className="col-12"><h6 className="fw-bold text-primary border-bottom pb-2">1. Informasi Dasar</h6></div>
                     <div className="col-md-3">
                        <label className="form-label small fw-bold text-muted">KODE</label>
                        <input type="text" className="form-control" value={form.kode} onChange={(e) => setForm({...form, kode: e.target.value})} required />
                     </div>
                     <div className="col-md-9">
                        <label className="form-label small fw-bold text-muted">NAMA PENYAKIT</label>
                        <input type="text" className="form-control" value={form.nama} onChange={(e) => setForm({...form, nama: e.target.value})} required />
                     </div>

                     <div className="col-12 mt-4"><h6 className="fw-bold text-primary border-bottom pb-2">2. Penyebab & Solusi</h6></div>
                     <div className="col-md-4">
                        <label className="form-label small fw-bold text-muted">JENIS PENYEBAB</label>
                        <select className="form-select" value={form.jenis_penyebab} onChange={(e) => setForm({...form, jenis_penyebab: e.target.value})}>
                            <option value="Belum Diketahui">Belum Diketahui</option>
                            <option value="Jamur (Fungi)">Jamur (Fungi)</option>
                            <option value="Bakteri">Bakteri</option>
                            <option value="Virus">Virus</option>
                            <option value="Hama">Hama / Serangga</option>
                            <option value="Kekurangan Nutrisi">Kekurangan Nutrisi</option>
                            <option value="Lingkungan">Faktor Lingkungan</option>
                        </select>
                     </div>
                     <div className="col-md-8">
                        <label className="form-label small fw-bold text-muted">NAMA PENYEBAB</label>
                        <input type="text" className="form-control" value={form.penyebab} onChange={(e) => setForm({...form, penyebab: e.target.value})} />
                     </div>
                     <div className="col-12">
                        <label className="form-label small fw-bold text-muted">SOLUSI</label>
                        <textarea className="form-control" rows="3" value={form.solusi} onChange={(e) => setForm({...form, solusi: e.target.value})} required></textarea>
                     </div>

                     <div className="col-12 mt-4"><h6 className="fw-bold text-primary border-bottom pb-2">3. Media</h6></div>
                     <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted">LINK FOTO PENYAKIT</label>
                        <input type="text" className="form-control" value={form.foto_url} onChange={(e) => setForm({...form, foto_url: e.target.value})} />
                     </div>
                     <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted">LINK FOTO PENYEBAB</label>
                        <input type="text" className="form-control" value={form.foto_penyebab} onChange={(e) => setForm({...form, foto_penyebab: e.target.value})} />
                     </div>

                     <div className="col-12 mt-5">
                        <button type="submit" className="btn btn-success fw-bold w-100 py-3 rounded-pill shadow-sm">
                           Simpan Data
                        </button>
                     </div>
                  </div>
               </form>
             ) : (
               <div className="text-center py-5">
                 <h4 className="text-danger">Akses Ditolak!</h4>
                 <p>Anda harus login sebagai Admin untuk mengakses halaman ini.</p>
                 <button onClick={() => setMode('tabel')} className="btn btn-secondary">Kembali</button>
               </div>
             )
          )}

        </div>
      </div>
    </div>
  );
};

export default DataPenyakit;