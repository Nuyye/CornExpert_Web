import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { RiNewspaperLine, RiMessage2Line, RiDeleteBinLine, RiAddLine, RiCheckDoubleLine, RiShieldCheckLine } from "react-icons/ri";

const ManajemenKonten = () => {
  const [activeTab, setActiveTab] = useState('berita');
  const [loading, setLoading] = useState(true); // <--- Sekarang ini KEPAKE buat spinner
  const [isAdmin] = useState(localStorage.getItem('CORN_ADMIN') === 'true');

  // State Data
  const [listBerita, setListBerita] = useState([]);
  const [listMasukan, setListMasukan] = useState([]);

  // State Form Berita (Hapus showForm karena gak dipake)
  const [formBerita, setFormBerita] = useState({ judul: '', sumber: '', snippet: '', link_url: '#', gambar_url: '' });

  // --- FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'berita') {
        const { data } = await supabase.from('berita').select('*').order('id', { ascending: false });
        setListBerita(data || []);
      } else {
        const { data } = await supabase.from('masukan').select('*').order('id', { ascending: false });
        setListMasukan(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // --- LOGIC BERITA ---
  const simpanBerita = async (e) => {
    e.preventDefault();
    if (!isAdmin) return alert("Akses Ditolak!");
    
    try {
      const { error } = await supabase.from('berita').insert([formBerita]);
      if (error) throw error;
      alert("Berita berhasil dipublish!");
      // Reset Form
      setFormBerita({ judul: '', sumber: '', snippet: '', link_url: '#', gambar_url: '' });
      fetchData();
    } catch (err) {
      alert("Gagal: " + err.message);
    }
  };

  const hapusBerita = async (id) => {
    if (!isAdmin || !window.confirm("Hapus berita ini?")) return;
    await supabase.from('berita').delete().eq('id', id);
    fetchData();
  };

  // --- LOGIC MASUKAN ---
  const hapusPesan = async (id) => {
    if (!isAdmin || !window.confirm("Hapus pesan ini?")) return;
    await supabase.from('masukan').delete().eq('id', id);
    fetchData();
  };

  const tandaiSelesai = async (id) => {
    if (!isAdmin) return;
    await supabase.from('masukan').update({ status: 'Selesai' }).eq('id', id);
    fetchData();
  };

  // PROTEKSI HALAMAN
  if (!isAdmin) {
      return (
          <div className="d-flex flex-column align-items-center justify-content-center vh-100 pb-5">
              <RiShieldCheckLine size={80} className="text-danger mb-3"/>
              <h3 className="fw-bold">Akses Terbatas!</h3>
              <p className="text-muted">Halaman ini khusus untuk Super Admin.</p>
          </div>
      )
  }

  return (
    <div className="container-fluid pb-5">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
        <div>
          <h2 className="fw-bold text-dark mb-1">Manajemen Konten</h2>
          <p className="text-muted mb-0">Kelola berita pertanian dan kotak masuk petani.</p>
        </div>
      </div>

      {/* TABS NAVIGASI */}
      <ul className="nav nav-pills mb-4 bg-white p-2 rounded-pill shadow-sm d-inline-flex">
        <li className="nav-item">
          <button 
            className={`nav-link rounded-pill px-4 fw-bold ${activeTab === 'berita' ? 'active bg-success' : 'text-muted'}`}
            onClick={() => setActiveTab('berita')}
          >
            <RiNewspaperLine className="me-2"/> Berita & Info
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link rounded-pill px-4 fw-bold ${activeTab === 'masukan' ? 'active bg-warning text-dark' : 'text-muted'}`}
            onClick={() => setActiveTab('masukan')}
          >
            <RiMessage2Line className="me-2"/> Kotak Masuk
          </button>
        </li>
      </ul>

      {/* --- BAGIAN 1: TAB BERITA --- */}
      {activeTab === 'berita' && (
        <div className="row g-4">
            {/* Form Tambah Berita (Kiri) */}
            <div className="col-md-4">
                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-header bg-white py-3 px-4 border-bottom">
                        <h6 className="fw-bold m-0 text-success"><RiAddLine/> Publish Berita Baru</h6>
                    </div>
                    <div className="card-body p-4">
                        <form onSubmit={simpanBerita}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">JUDUL BERITA</label>
                                <input type="text" className="form-control" required value={formBerita.judul} onChange={e => setFormBerita({...formBerita, judul: e.target.value})} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">SUMBER (Cth: Kementan)</label>
                                <input type="text" className="form-control" required value={formBerita.sumber} onChange={e => setFormBerita({...formBerita, sumber: e.target.value})} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">RINGKASAN (Snippet)</label>
                                <textarea className="form-control" rows="3" required value={formBerita.snippet} onChange={e => setFormBerita({...formBerita, snippet: e.target.value})}></textarea>
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">LINK GAMBAR</label>
                                <input type="text" className="form-control" placeholder="https://..." value={formBerita.gambar_url} onChange={e => setFormBerita({...formBerita, gambar_url: e.target.value})} />
                            </div>
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted">LINK BERITA LENGKAP</label>
                                <input type="text" className="form-control" placeholder="#" value={formBerita.link_url} onChange={e => setFormBerita({...formBerita, link_url: e.target.value})} />
                            </div>
                            <button type="submit" className="btn btn-success w-100 rounded-pill fw-bold">Publish Sekarang</button>
                        </form>
                    </div>
                </div>
            </div>

            {/* List Berita (Kanan) */}
            <div className="col-md-8">
                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body p-0">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-success" role="status"></div>
                                <p className="mt-2 text-muted">Memuat data berita...</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="ps-4 py-3 text-muted small">JUDUL</th>
                                            <th className="py-3 text-muted small">TANGGAL</th>
                                            <th className="py-3 text-end pe-4 text-muted small">AKSI</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listBerita.length === 0 ? (
                                            <tr><td colSpan="3" className="text-center py-4 text-muted">Belum ada berita.</td></tr>
                                        ) : (
                                            listBerita.map(item => (
                                                <tr key={item.id}>
                                                    <td className="ps-4">
                                                        <p className="fw-bold mb-0 text-dark clamp-1">{item.judul}</p>
                                                        <small className="text-muted">{item.sumber}</small>
                                                    </td>
                                                    <td className="small text-secondary">{item.tanggal}</td>
                                                    <td className="text-end pe-4">
                                                        <button onClick={() => hapusBerita(item.id)} className="btn btn-sm btn-light text-danger rounded-circle p-2"><RiDeleteBinLine/></button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- BAGIAN 2: TAB MASUKAN / CALL CENTER --- */}
      {activeTab === 'masukan' && (
          <div className="card border-0 shadow-sm rounded-4">
              <div className="card-header bg-white py-3 px-4 border-bottom">
                  <h6 className="fw-bold m-0 text-dark">Pesan Masuk dari Petani</h6>
              </div>
              <div className="card-body p-0">
                {loading ? (
                    <div className="text-center py-5"><div className="spinner-border text-warning"></div></div>
                ) : listMasukan.length === 0 ? (
                    <div className="text-center py-5 text-muted">Belum ada pesan masuk.</div>
                ) : (
                    <div className="list-group list-group-flush">
                        {listMasukan.map(msg => (
                            <div key={msg.id} className={`list-group-item p-4 border-bottom ${msg.status === 'Selesai' ? 'bg-light opacity-75' : ''}`}>
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <div>
                                        <h6 className="fw-bold mb-0">{msg.nama_pengirim || "Anonim"}</h6>
                                        <small className="text-muted">{new Date(msg.created_at).toLocaleString()}</small>
                                    </div>
                                    <div>
                                        {msg.status === 'Selesai' ? (
                                            <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3">Selesai</span>
                                        ) : (
                                            <span className="badge bg-warning text-dark rounded-pill px-3">Baru</span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-dark mb-3 bg-light p-3 rounded-3 fst-italic">"{msg.pesan}"</p>
                                <div className="d-flex gap-2">
                                    {msg.status !== 'Selesai' && (
                                        <button onClick={() => tandaiSelesai(msg.id)} className="btn btn-sm btn-success rounded-pill px-3">
                                            <RiCheckDoubleLine className="me-1"/> Tandai Dibaca
                                        </button>
                                    )}
                                    <button onClick={() => hapusPesan(msg.id)} className="btn btn-sm btn-outline-danger rounded-pill px-3">
                                        <RiDeleteBinLine className="me-1"/> Hapus
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
              </div>
          </div>
      )}

    </div>
  );
};

export default ManajemenKonten;