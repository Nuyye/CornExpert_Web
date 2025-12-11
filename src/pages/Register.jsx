import React, { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate, Link } from 'react-router-dom'
import { RiSeedlingFill } from "react-icons/ri"

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Fungsi Supabase buat Bikin Akun Baru
      // FIX: Hapus 'data' karena gak dipake, cukup ambil 'error'
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
      })

      if (error) throw error

      alert('Registrasi Berhasil! Silakan Login.')
      navigate('/login') // Lempar ke halaman login
      
    } catch (error) {
      alert('Gagal Daftar: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{backgroundColor: '#0a2e1d'}}>
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden" style={{maxWidth: '400px', width: '100%'}}>
        <div className="card-body p-5">
          
          <div className="text-center mb-4">
            <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-flex mb-3">
                <RiSeedlingFill size={40} className="text-success" />
            </div>
            <h3 className="fw-bold text-dark">Buat Akun Baru</h3>
            <p className="text-muted small">Gabung komunitas CornExpert sekarang.</p>
          </div>

          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">EMAIL ADDRESS</label>
              <input 
                type="email" 
                className="form-control form-control-lg bg-light border-0" 
                placeholder="petani@contoh.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="form-label small fw-bold text-muted">PASSWORD</label>
              <input 
                type="password" 
                className="form-control form-control-lg bg-light border-0" 
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button disabled={loading} className="btn btn-success w-100 py-3 fw-bold rounded-pill shadow-sm mb-3">
              {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
            </button>
          </form>

          <div className="text-center mt-4 pt-3 border-top">
            <small className="text-muted">Sudah punya akun? </small>
            <Link to="/login" className="text-success fw-bold text-decoration-none">
                Login Disini
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Register