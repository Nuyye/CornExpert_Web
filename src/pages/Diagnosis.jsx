import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { RiVirusFill, RiSearchEyeLine, RiCloseLine, RiAddLine } from "react-icons/ri"; 

const Diagnosis = () => {
  // State Data
  const [gejalaList, setGejalaList] = useState([]); // Database Gejala
  const [selectedGejala, setSelectedGejala] = useState([]); // Gejala yang dipilih user
  const [hasilDiagnosa, setHasilDiagnosa] = useState(null);
  
  // State UX (Hapus loadingData yang bikin error)
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. LOAD DATA GEJALA DARI SUPABASE
  useEffect(() => {
    const fetchGejala = async () => {
      // Kita gak butuh loadingData di sini karena user bakal search
      const { data, error } = await supabase
        .from("gejala")
        .select("*")
        .order("kode", { ascending: true }); // Pastikan kolom di DB namanya 'kode' dan 'nama'
      
      if (!error) setGejalaList(data);
    };
    fetchGejala();
  }, []);

  // 2. LOGIKA TAMBAH GEJALA (KLIK DARI HASIL SEARCH)
  const handleSelectGejala = (item) => {
    // Cek duplikat biar gak double
    const isExist = selectedGejala.find((g) => g.id === item.id);
    if (!isExist) {
      setSelectedGejala([...selectedGejala, item]);
    }
    setSearchTerm(""); // Reset search bar biar bersih
  };

  // 3. LOGIKA HAPUS GEJALA (KLIK TOMBOL X)
  const handleRemoveGejala = (id) => {
    setSelectedGejala(selectedGejala.filter((item) => item.id !== id));
  };

  // 4. LOGIKA CBR (Algorithm)
  const prosesDiagnosa = async () => {
    if (selectedGejala.length === 0) return alert("Pilih minimal 1 gejala dulu bro!");
    
    setLoading(true);
    setHasilDiagnosa(null);

    try {
      // Ambil Rules dari Database
      const { data: basisData, error } = await supabase
        .from("basis_pengetahuan")
        .select(`penyakit_id, gejala_id, penyakit (kode, nama, solusi)`);
      
      if (error) throw error;

      // Grouping Rules
      const cases = {};
      basisData.forEach((row) => {
        const pId = row.penyakit_id;
        if (!cases[pId]) {
            cases[pId] = { 
                detail: row.penyakit, 
                gejalaRules: [] 
            };
        }
        cases[pId].gejalaRules.push(row.gejala_id);
      });

      // Hitung Similarity
      let bestMatch = null;
      let highestScore = 0;
      const userGejalaIds = selectedGejala.map(g => g.id);

      Object.keys(cases).forEach((key) => {
        const pData = cases[key];
        const matches = userGejalaIds.filter((id) => pData.gejalaRules.includes(id)).length;
        
        // Rumus CBR: (Jumlah Cocok / Total Rules) * 100
        const score = (matches / pData.gejalaRules.length) * 100;
        const persentase = score.toFixed(1);

        if (parseFloat(persentase) > highestScore) {
            highestScore = parseFloat(persentase);
            bestMatch = { ...pData.detail, persentase: persentase };
        }
      });

      // Simulasi mikir
      setTimeout(() => {
        if (bestMatch && highestScore > 0) {
            setHasilDiagnosa(bestMatch);
        } else {
            setHasilDiagnosa({ nama: "Tidak Teridentifikasi", solusi: "Gejala tidak cocok dengan database.", persentase: 0 });
        }
        setLoading(false);
      }, 800);

    } catch (err) {
      console.error(err);
      alert("Error diagnosa: " + err.message);
      setLoading(false);
    }
  };

  // Filter List Gejala berdasarkan Search Term
  const filteredGejala = gejalaList.filter((item) => 
     item.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
     item.kode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid pb-5">
      
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
        <div>
          <h2 className="fw-bold text-dark mb-1">Diagnosa Tanaman</h2>
          <p className="text-muted mb-0">Cari gejala yang terlihat pada jagung Anda.</p>
        </div>
        <div className="d-flex align-items-center gap-2 bg-white px-3 py-2 rounded-pill shadow-sm">
           <RiSearchEyeLine className="text-warning" size={20} />
           <span className="fw-bold small text-warning">AI SYSTEM</span>
        </div>
      </div>

      <div className="row g-4">
        {/* KOLOM KIRI: INPUT & SELECTED */}
        <div className="col-md-7">
            <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4">
                    <label className="fw-bold small text-muted mb-2">1. CARI & PILIH GEJALA</label>
                    
                    {/* INPUT SEARCH */}
                    <div className="position-relative">
                        <input 
                            type="text" 
                            className="form-control form-control-lg bg-light border-0 ps-4"
                            placeholder="Ketik gejala... (misal: kuning, bercak)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {/* DROPDOWN HASIL SEARCH */}
                        {searchTerm && (
                            <div className="position-absolute w-100 bg-white shadow-lg rounded-3 mt-2 overflow-auto border" style={{zIndex: 10, maxHeight: '250px'}}>
                                {filteredGejala.length > 0 ? (
                                    filteredGejala.map(item => (
                                        <div 
                                            key={item.id} 
                                            onClick={() => handleSelectGejala(item)}
                                            className="p-3 border-bottom d-flex justify-content-between align-items-center hover-bg-light"
                                            style={{cursor: 'pointer'}}
                                        >
                                            <div>
                                                <span className="badge bg-secondary bg-opacity-10 text-secondary me-2">{item.kode}</span>
                                                <span className="fw-medium text-dark">{item.nama}</span>
                                            </div>
                                            <RiAddLine className="text-success" />
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-3 text-center text-muted small">Gejala tidak ditemukan bro.</div>
                                )}
                            </div>
                        )}
                    </div>

                    <hr className="my-4 border-light"/>

                    {/* LIST GEJALA TERPILIH (TAGS) */}
                    <label className="fw-bold small text-muted mb-3">2. GEJALA DIPILIH ({selectedGejala.length})</label>
                    
                    <div className="d-flex flex-wrap gap-2">
                        {selectedGejala.length === 0 && (
                            <div className="text-center w-100 py-4 bg-light rounded-3 border border-dashed">
                                <small className="text-muted">Belum ada gejala dipilih. Ketik di atas!</small>
                            </div>
                        )}
                        
                        {selectedGejala.map((item) => (
                            <div key={item.id} className="bg-success text-white px-3 py-2 rounded-pill d-flex align-items-center gap-2 shadow-sm animate__animated animate__fadeIn">
                                <small className="fw-bold">{item.nama}</small>
                                <button onClick={() => handleRemoveGejala(item.id)} className="btn btn-sm p-0 text-white opacity-75 hover-opacity-100">
                                    <RiCloseLine size={18}/>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* FOOTER: TOMBOL PROSES */}
                <div className="card-footer bg-white border-0 p-4">
                     <button 
                        onClick={prosesDiagnosa} 
                        disabled={loading || selectedGejala.length === 0}
                        className="btn btn-warning w-100 fw-bold py-3 rounded-pill shadow-sm text-dark d-flex justify-content-center align-items-center gap-2"
                     >
                        {loading ? <div className="spinner-border spinner-border-sm"></div> : <RiVirusFill size={20}/>}
                        {loading ? "Sedang Menganalisa..." : "PROSES DIAGNOSA SEKARANG"}
                     </button>
                </div>
            </div>
        </div>

        {/* KOLOM KANAN: HASIL DIAGNOSA */}
        <div className="col-md-5">
             {hasilDiagnosa ? (
                <div className="card border-0 shadow rounded-4 overflow-hidden animate__animated animate__fadeInRight h-100">
                    <div className={`p-4 text-white ${parseFloat(hasilDiagnosa.persentase) > 50 ? 'bg-success' : 'bg-danger'}`}>
                        <p className="mb-1 opacity-75 small fw-bold tracking-wide">HASIL ANALISA SISTEM</p>
                        <h2 className="fw-bold mb-0">{hasilDiagnosa.nama}</h2>
                    </div>
                    <div className="card-body p-4 bg-white d-flex flex-column">
                         <div className="text-center my-3">
                             <div className="display-4 fw-bold text-dark">{hasilDiagnosa.persentase}%</div>
                             <small className="text-muted text-uppercase fw-bold">Tingkat Kecocokan</small>
                         </div>

                         <div className="bg-light p-4 rounded-4 mt-3 flex-grow-1">
                            <h6 className="fw-bold text-success mb-2 d-flex align-items-center gap-2">
                                <RiSearchEyeLine /> SOLUSI PENANGANAN:
                            </h6>
                            <p className="text-dark opacity-75 mb-0" style={{lineHeight: '1.6'}}>
                                {hasilDiagnosa.solusi}
                            </p>
                         </div>

                         <button onClick={() => { setHasilDiagnosa(null); setSelectedGejala([]); setSearchTerm(""); }} className="btn btn-outline-secondary w-100 rounded-pill mt-4">
                            Diagnosa Ulang
                         </button>
                    </div>
                </div>
             ) : (
                <div className="card border-0 shadow-sm rounded-4 h-100 bg-light d-flex align-items-center justify-content-center p-5 text-center">
                    <div className="opacity-50">
                        <RiVirusFill size={60} className="text-secondary mb-3"/>
                        <h5 className="fw-bold text-secondary">Menunggu Input...</h5>
                        <p className="small text-muted">Pilih gejala di sebelah kiri lalu klik Proses.</p>
                    </div>
                </div>
             )}
        </div>

      </div>
    </div>
  );
};

export default Diagnosis;