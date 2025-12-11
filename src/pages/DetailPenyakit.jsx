import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { RiMicroscopeLine, RiQuestionLine, RiBookOpenLine, RiArrowLeftLine } from 'react-icons/ri';

const DetailPenyakit = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    const [penyakit, setPenyakit] = useState(null);
    const [gejalaTerkait, setGejalaTerkait] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Ambil Detail Penyakit
                const { data: pData, error: pError } = await supabase
                    .from('penyakit')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (pError || !pData) throw new Error("Penyakit tidak ditemukan.");
                setPenyakit(pData);

                // 2. Ambil Gejala Terkait
                const { data: gData, error: gError } = await supabase
                    .from('basis_pengetahuan')
                    .select(`gejala (kode, nama)`)
                    .eq('penyakit_id', id);
                
                if (gError) throw gError;
                setGejalaTerkait(gData.map(item => item.gejala));

            } catch (err) {
                console.error("Gagal ambil data detail:", err.message);
                setPenyakit(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    if (loading) return <div className="p-5 text-center"><div className="spinner-border text-success"></div></div>;
    
    if (!penyakit) return (
        <div className="p-5 text-center">
            <h3 className='text-danger'>Data Tidak Ditemukan!</h3>
            <button onClick={() => navigate('/data-penyakit')} className="btn btn-warning mt-3">Kembali</button>
        </div>
    );

    return (
        <div className="container-fluid pb-5 animate__animated animate__fadeIn">
            
            <button onClick={() => navigate('/data-penyakit')} className="btn btn-sm btn-light text-muted fw-bold mb-4 d-flex align-items-center gap-2">
                <RiArrowLeftLine /> Kembali ke Daftar
            </button>

            {/* HEADER & FOTO PENYAKIT + FOTO PENYEBAB */}
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden mb-5">
                <div className="row g-0">
                    
                    {/* FOTO 1: GEJALA DI JAGUNG */}
                    <div className="col-md-5 position-relative bg-light">
                        <img 
                            src={penyakit.foto_url || 'https://via.placeholder.com/600x400?text=Foto+Tidak+Tersedia'} 
                            className="img-fluid h-100 object-fit-cover w-100" 
                            alt={penyakit.nama} 
                            style={{minHeight: '300px'}}
                        />
                        <div className="position-absolute top-0 start-0 m-3">
                             <span className="badge bg-danger shadow-sm px-3 py-2 fw-bold" style={{fontSize: '1rem'}}>{penyakit.kode}</span>
                        </div>
                    </div>

                    {/* INFO DETIL */}
                    <div className="col-md-7">
                        <div className="card-body p-5">
                            <h1 className="fw-bold text-dark display-6 mb-2">{penyakit.nama}</h1>
                            <p className="text-muted mb-4 border-bottom pb-3">Informasi lengkap mengenai diagnosa dan penanganan.</p>
                            
                            {/* SECTION: TERSANGKA UTAMA (REQ BARU) */}
                            <div className="bg-light rounded-4 p-3 border d-flex align-items-center gap-4">
                                {/* Foto Mikroorganisme */}
                                <div className="flex-shrink-0">
                                     <img 
                                        src={penyakit.foto_penyebab || 'https://via.placeholder.com/100?text=No+Img'} 
                                        className="rounded-circle border border-3 border-white shadow-sm object-fit-cover"
                                        style={{width: '80px', height: '80px'}} 
                                        alt="Mikroorganisme"
                                     />
                                </div>
                                <div>
                                    <small className="text-uppercase text-muted fw-bold d-block mb-1" style={{fontSize: '0.65rem'}}>
                                        PENYEBAB UTAMA ({penyakit.jenis_penyebab || 'Unknown'})
                                    </small>
                                    <h6 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                                         <RiMicroscopeLine className="text-primary"/> 
                                         {penyakit.penyebab || 'Belum ada data penyebab.'}
                                    </h6>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                
                {/* GEJALA TERKAIT */}
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-4">
                            <h5 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2">
                                <RiQuestionLine /> GEJALA TERLIHAT
                            </h5>
                            {gejalaTerkait.length > 0 ? (
                                <div className="d-flex flex-wrap gap-2">
                                    {gejalaTerkait.map((g, index) => (
                                        <div key={index} className="bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill small fw-bold border border-primary border-opacity-25">
                                            {g.nama}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted small">Belum ada gejala yang dihubungkan.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* SOLUSI PENANGANAN */}
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-4">
                            <h5 className="fw-bold text-warning mb-3 d-flex align-items-center gap-2">
                                <RiBookOpenLine /> SOLUSI PENANGANAN
                            </h5>
                            <p className="text-dark opacity-75" style={{lineHeight: '1.8', whiteSpace: 'pre-line'}}>
                                {penyakit.solusi}
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DetailPenyakit;