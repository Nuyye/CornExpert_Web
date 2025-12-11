import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { RiUserStarLine, RiCalendarLine, RiArrowRightLine, RiGovernmentLine } from "react-icons/ri";

const NewsWidget = () => {
  const [berita, setBerita] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBerita = async () => {
        try {
            const { data, error } = await supabase.from('berita').select('*').order('id', { ascending: false }).limit(5);
            if (!error) setBerita(data);
        } catch (err) {
            console.error("Error berita:", err);
        } finally {
            setLoading(false);
        }
    };
    fetchBerita();
  }, []);

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
      <div className="card-header bg-white py-3 px-4 border-bottom d-flex justify-content-between align-items-center">
        <h6 className="fw-bold m-0 text-dark d-flex align-items-center gap-2">
           <RiGovernmentLine className="text-success" size={20}/> 
           Info Tani & Kebijakan
        </h6>
      </div>
      
      <div className="card-body p-0">
        <div className="list-group list-group-flush">
          {loading ? (
              <div className="p-4 text-center text-muted">Memuat Berita...</div>
          ) : berita.length === 0 ? (
              <div className="p-4 text-center text-muted">Belum ada berita terbaru.</div>
          ) : (
              berita.map((item) => (
                <a key={item.id} href={item.link_url} target="_blank" rel="noreferrer" className="list-group-item list-group-item-action p-3 border-bottom-0 border-top hover-bg-light transition-all">
                  <div className="d-flex gap-3">
                    <div className="flex-shrink-0" style={{width: '80px', height: '80px'}}>
                      <img src={item.gambar_url || 'https://via.placeholder.com/100'} alt="news" className="w-100 h-100 object-fit-cover rounded-3 shadow-sm"/>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <small className="text-success fw-bold d-flex align-items-center gap-1" style={{fontSize: '0.7rem'}}>
                            <RiUserStarLine /> {item.sumber}
                        </small>
                        <small className="text-muted d-flex align-items-center gap-1" style={{fontSize: '0.65rem'}}>
                            <RiCalendarLine /> {item.tanggal}
                        </small>
                      </div>
                      <h6 className="fw-bold text-dark mb-1 lh-sm clamp-2" style={{fontSize: '0.95rem'}}>{item.judul}</h6>
                      <p className="text-muted mb-0 lh-sm clamp-2 d-none d-md-block" style={{fontSize: '0.8rem'}}>{item.snippet}</p>
                    </div>
                  </div>
                </a>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsWidget;