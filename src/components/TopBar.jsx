import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { RiSearchLine, RiArrowRightSLine, RiVirusLine, RiUser3Fill } from "react-icons/ri";

const Topbar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [allPenyakit, setAllPenyakit] = useState([]);
    const navigate = useNavigate();

    // Load data ringkas buat search (ID, Nama, Kode)
    useEffect(() => {
        const fetchSearchData = async () => {
            const { data } = await supabase.from('penyakit').select('id, nama, kode');
            if (data) setAllPenyakit(data);
        };
        fetchSearchData();
    }, []);

    // Logic Filtering Search
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.length > 0) {
            const filtered = allPenyakit.filter(item => 
                item.nama.toLowerCase().includes(value.toLowerCase()) || 
                item.kode.toLowerCase().includes(value.toLowerCase())
            );
            setResults(filtered);
        } else {
            setResults([]);
        }
    };

    const goToDetail = (id) => {
        setSearchTerm(''); 
        setResults([]);    
        navigate(`/penyakit/${id}`);
    };

    return (
        <div className="bg-white py-3 px-4 shadow-sm mb-4 rounded-4 d-flex justify-content-between align-items-center position-relative">
            
            {/* Judul Kiri */}
            <h5 className="fw-bold m-0 text-dark d-none d-md-block">Admin Panel</h5>

            {/* SEARCH BAR CENTER */}
            <div className="position-relative" style={{width: '100%', maxWidth: '400px'}}>
                <div className="input-group bg-light rounded-pill overflow-hidden border">
                    <span className="input-group-text bg-transparent border-0 ps-3">
                        <RiSearchLine className="text-muted" />
                    </span>
                    <input 
                        type="text" 
                        className="form-control bg-transparent border-0 shadow-none small"
                        placeholder="Cari penyakit (Ketik: Bulai)..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>

                {/* DROPDOWN HASIL */}
                {results.length > 0 && (
                    <div className="position-absolute w-100 bg-white shadow-lg rounded-3 mt-2 overflow-hidden border" style={{zIndex: 1000, top: '100%'}}>
                        <div className="bg-light p-2 border-bottom">
                            <small className="fw-bold text-muted ps-2">HASIL PENCARIAN</small>
                        </div>
                        {results.map(item => (
                            <div 
                                key={item.id}
                                onClick={() => goToDetail(item.id)}
                                className="p-3 d-flex align-items-center justify-content-between border-bottom hover-bg-light cursor-pointer"
                                style={{cursor: 'pointer'}}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-danger bg-opacity-10 text-danger p-2 rounded">
                                        <RiVirusLine />
                                    </div>
                                    <div>
                                        <p className="mb-0 fw-bold text-dark small">{item.nama}</p>
                                        <span className="badge bg-secondary bg-opacity-10 text-secondary" style={{fontSize: '0.6rem'}}>{item.kode}</span>
                                    </div>
                                </div>
                                <RiArrowRightSLine className="text-muted"/>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Profil Kanan */}
            <div className="d-flex align-items-center gap-3">
                <div className="text-end d-none d-md-block" style={{lineHeight: '1.2'}}>
                    <span className="d-block fw-bold small">Admin Corn</span>
                    <span className="text-muted" style={{fontSize: '10px'}}>Super User</span>
                </div>
                <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{width: '40px', height: '40px'}}>
                    <RiUser3Fill />
                </div>
            </div>

        </div>
    );
};

export default Topbar;