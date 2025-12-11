import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { RiBookReadLine, RiAddLine, RiDeleteBinLine, RiPriceTag3Line, RiCloseLine, RiShieldCheckLine } from "react-icons/ri";

const AturanPenyakit = () => {
  const [aturanList, setAturanList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State Modal
  const [showModal, setShowModal] = useState(false);
  const [penyakitOptions, setPenyakitOptions] = useState([]);
  const [gejalaOptions, setGejalaOptions] = useState([]);
  const [form, setForm] = useState({ penyakit_id: "", gejala_id: "" });

  // --- 👮‍♂️ CEK STATUS ADMIN ---
  const isAdmin = localStorage.getItem('CORN_ADMIN') === 'true';

  // 1. FETCH DATA ATURAN
  const fetchAturan = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("basis_pengetahuan")
        .select(`
          id,
          penyakit_id,
          gejala_id,
          penyakit (id, kode, nama),
          gejala (id, kode, nama)
        `);

      if (error) throw error;

      const groupedData = {};
      data.forEach((row) => {
        if (row.penyakit && row.gejala) {
            const pId = row.penyakit.id;
            if (!groupedData[pId]) {
                groupedData[pId] = {
                    penyakit: row.penyakit,
                    gejalaList: [] 
                };
            }
            groupedData[pId].gejalaList.push({ ...row.gejala, relasi_id: row.id });
        }
      });
      setAturanList(Object.values(groupedData));
    } catch (err) {
      console.error("Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
      if (!isAdmin) return; // Gak usah fetch opsi kalau bukan admin (hemat kuota)
      const { data: pData } = await supabase.from('penyakit').select('id, kode, nama').order('kode');
      const { data: gData } = await supabase.from('gejala').select('id, kode, nama').order('kode');
      setPenyakitOptions(pData || []);
      setGejalaOptions(gData || []);
  };

  useEffect(() => {
    fetchAturan();
    fetchOptions();
  }, []);

  // 3. HANDLER TAMBAH
  const handleSimpan = async (e) => {
      e.preventDefault();
      if (!isAdmin) return alert("Akses Ditolak!");
      if(!form.penyakit_id || !form.gejala_id) return alert("Pilih dulu bro!");

      try {
          const { error } = await supabase.from('basis_pengetahuan').insert([form]);
          if(error) throw error;
          alert("Aturan berhasil ditambahkan!");
          setShowModal(false);
          setForm({ penyakit_id: "", gejala_id: "" });
          fetchAturan();
      } catch (err) {
          alert("Gagal: " + err.message);
      }
  };

  // 4. HANDLER HAPUS
  const handleHapusRelasi = async (idRelasi) => {
      if (!isAdmin) return; // Proteksi
      if(window.confirm("Hapus gejala ini dari aturan?")) {
          try {
              await supabase.from('basis_pengetahuan').delete().eq('id', idRelasi);
              fetchAturan();
          } catch (err) {
    alert("Gagal hapus: " + err.message); // <--- Tambahin err.message
}
      }
  };

  return (
    <div className="container-fluid pb-5">
      
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
        <div>
          <h2 className="fw-bold text-dark mb-1">Basis Pengetahuan</h2>
          <p className="text-muted mb-0">
            {isAdmin ? "Hubungkan Penyakit & Gejala (Mode Admin)." : "Daftar referensi aturan diagnosa (Mode Lihat)."}
          </p>
        </div>
        <div className="d-flex align-items-center gap-2 bg-white px-3 py-2 rounded-pill shadow-sm">
           {isAdmin ? <RiShieldCheckLine className="text-danger"/> : <RiBookReadLine className="text-primary" />}
           <span className={`fw-bold small ${isAdmin ? 'text-danger' : 'text-primary'}`}>
             {isAdmin ? "ADMIN RULE" : "RULE BASE"}
           </span>
        </div>
      </div>

      {/* CARD TABEL */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-header bg-white py-3 px-4 border-bottom d-flex justify-content-between align-items-center">
            <h6 className="fw-bold m-0 text-dark">Daftar Aturan Aktif</h6>
            
            {/* HIDE TOMBOL TAMBAH KALAU BUKAN ADMIN */}
            {isAdmin && (
                <button 
                    onClick={() => setShowModal(true)} 
                    className="btn btn-sm btn-primary rounded-pill px-3 fw-bold d-flex align-items-center gap-2"
                >
                    <RiAddLine /> Tambah Rule Baru
                </button>
            )}
        </div>

        <div className="card-body p-0">
            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                        <tr>
                            <th className="py-3 ps-4 text-secondary small fw-bold">KODE</th>
                            <th className="py-3 text-secondary small fw-bold">NAMA PENYAKIT</th>
                            <th className="py-3 text-secondary small fw-bold">GEJALA TERKAIT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="3" className="text-center py-5">Loading...</td></tr>
                        ) : aturanList.length === 0 ? (
                            <tr><td colSpan="3" className="text-center py-5">Belum ada aturan.</td></tr>
                        ) : (
                            aturanList.map((item, index) => (
                                <tr key={index}>
                                    <td className="ps-4">
                                        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                                            {item.penyakit.kode}
                                        </span>
                                    </td>
                                    <td className="fw-bold text-dark">{item.penyakit.nama}</td>
                                    <td className="py-3">
                                        <div className="d-flex flex-wrap gap-2">
                                            {item.gejalaList.map((g, idx) => (
                                                <div key={idx} className="d-flex align-items-center gap-2 bg-light border px-3 py-1 rounded-pill small text-secondary shadow-sm">
                                                    <RiPriceTag3Line size={12} className="text-muted"/>
                                                    <span>{g.nama}</span>
                                                    
                                                    {/* HIDE TOMBOL X (HAPUS) KALAU BUKAN ADMIN */}
                                                    {isAdmin && (
                                                        <button 
                                                            onClick={() => handleHapusRelasi(g.relasi_id)}
                                                            className="btn btn-link p-0 text-danger" 
                                                            style={{textDecoration: 'none'}}
                                                        >
                                                            ×
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>

      {/* MODAL (HANYA RENDER JIKA ADMIN) */}
      {isAdmin && showModal && (
          <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center" style={{zIndex: 1050}}>
              <div className="card border-0 shadow-lg rounded-4" style={{width: '500px'}}>
                  <div className="card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center">
                      <h5 className="fw-bold m-0">Tambah Aturan Baru</h5>
                      <button onClick={() => setShowModal(false)} className="btn btn-light rounded-circle p-2"><RiCloseLine/></button>
                  </div>
                  <div className="card-body p-4 pt-0">
                      <form onSubmit={handleSimpan}>
                          <div className="mb-3">
                              <label className="form-label small fw-bold text-muted">PILIH PENYAKIT</label>
                              <select 
                                className="form-select" 
                                value={form.penyakit_id} 
                                onChange={(e) => setForm({...form, penyakit_id: e.target.value})}
                                required
                              >
                                  <option value="">-- Pilih Penyakit --</option>
                                  {penyakitOptions.map(p => (
                                      <option key={p.id} value={p.id}>{p.kode} - {p.nama}</option>
                                  ))}
                              </select>
                          </div>
                          <div className="mb-4">
                              <label className="form-label small fw-bold text-muted">PILIH GEJALA</label>
                              <select 
                                className="form-select"
                                value={form.gejala_id}
                                onChange={(e) => setForm({...form, gejala_id: e.target.value})}
                                required
                              >
                                  <option value="">-- Pilih Gejala --</option>
                                  {gejalaOptions.map(g => (
                                      <option key={g.id} value={g.id}>{g.kode} - {g.nama}</option>
                                  ))}
                              </select>
                          </div>
                          <button type="submit" className="btn btn-primary w-100 rounded-pill py-2 fw-bold">
                              Simpan Aturan
                          </button>
                      </form>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default AturanPenyakit;