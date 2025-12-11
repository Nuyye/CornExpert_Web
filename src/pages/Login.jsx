import React, { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate, Link } from 'react-router-dom'
import { RiSeedlingFill, RiUserAddLine } from "react-icons/ri"

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // 1. Proses Login ke Supabase
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (error) throw error

      // 2. Kalau sukses, langsung lempar ke Dashboard
      navigate('/dashboard')
      
    } catch (error) {
      alert('Gagal Masuk Bro: ' + error.message)
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
            <h4 className="fw-bold text-dark">Welcome Petani!</h4>
            <p className="text-muted small">Silakan masuk untuk akses sistem.</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">EMAIL ADDRESS</label>
              <input 
                type="email" 
                className="form-control form-control-lg bg-light border-0" 
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button disabled={loading} className="btn btn-warning w-100 py-3 fw-bold rounded-pill shadow-sm text-dark mb-3">
              {loading ? "Checking..." : "Masuk System →"}
            </button>
          </form>

          {/* LINK KE REGISTER */}
          <div className="text-center mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
            <Link to="/" className="text-muted small text-decoration-none">
                ← Kembali
            </Link>
            
            <div>
                <span className="text-muted small me-1">Belum punya akun?</span>
                <Link to="/register" className="text-success fw-bold text-decoration-none d-inline-flex align-items-center gap-1">
                    <RiUserAddLine size={14}/> Daftar
                </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Login