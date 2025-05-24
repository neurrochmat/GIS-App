import React, { useState } from 'react'
import axios from 'axios'
import './App.css'

function Register({ onRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      await axios.post('http://localhost:5000/api/auth/register', { email, password })
      setSuccess('Registrasi berhasil, silakan login!')
      setEmail('')
      setPassword('')
      if (onRegister) onRegister()
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal')
    }
  }

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} style={{width:'100%', display:'flex', flexDirection:'column', alignItems:'center'}}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" style={{width:'100%', marginTop:'0.5rem'}}>Register</button>
      </form>
      {error && <p style={{color:'red', marginTop:'0.5rem'}}>{error}</p>}
      {success && <p style={{color:'green', marginTop:'0.5rem'}}>{success}</p>}
    </div>
  )
}

export default Register
