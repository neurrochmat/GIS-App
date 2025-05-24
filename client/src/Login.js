import React, { useState } from 'react'
import axios from 'axios'
import './App.css'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      onLogin(res.data.user)
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal')
    }
  }

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{width:'100%', display:'flex', flexDirection:'column', alignItems:'center'}}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" style={{width:'100%', marginTop:'0.5rem'}}>Login</button>
      </form>
      {error && <p style={{color:'red', marginTop:'0.5rem'}}>{error}</p>}
    </div>
  )
}

export default Login
