import { useState } from 'react'
import './App.css'

function Auth({ onLogin, onRegister }) {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Por favor, completa todos los campos.')
      return
    }

    if (formData.password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres.')
      return
    }

    const users = JSON.parse(localStorage.getItem('metaverse-users') || '[]')

    if (isLoginMode) {
      // Modo login
      const user = users.find(u => u.username === formData.username && u.password === formData.password)
      if (user) {
        onLogin(user)
      } else {
        setError('Usuario o contraseña incorrectos.')
      }
    } else {
      // Modo registro
      const existingUser = users.find(u => u.username === formData.username)
      if (existingUser) {
        setError('Este usuario ya existe. Elige otro nombre.')
      } else {
        const newUser = {
          id: Date.now(),
          username: formData.username,
          password: formData.password,
          createdAt: new Date().toISOString()
        }
        users.push(newUser)
        localStorage.setItem('metaverse-users', JSON.stringify(users))
        onRegister(newUser)
      }
    }
  }

  return (
    <div className="auth-overlay">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">METAVESE NOTES</h1>
          <p className="auth-subtitle">Accede a tu espacio personal en el metaverso</p>
        </div>

        <div className="auth-card">
          <h2 className="auth-card-title">
            {isLoginMode ? 'INICIAR SESIÓN' : 'CREAR CUENTA'}
          </h2>

          {error && (
            <div className="auth-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="auth-username">USUARIO</label>
              <input
                type="text"
                id="auth-username"
                name="username"
                className="form-input"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Ingresa tu nombre de usuario..."
                autoComplete="off"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="auth-password">CONTRASEÑA</label>
              <input
                type="password"
                id="auth-password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Ingresa tu contraseña..."
              />
            </div>

            <button type="submit" className="btn btn-primary auth-submit">
              {isLoginMode ? 'Entrar' : 'Registrarse'}
            </button>
          </form>

          <div className="auth-toggle">
            {isLoginMode ? (
              <p>
                ¿No tienes cuenta?{' '}
                <button onClick={() => setIsLoginMode(false)} className="auth-link">
                  Regístrate aquí
                </button>
              </p>
            ) : (
              <p>
                ¿Ya tienes cuenta?{' '}
                <button onClick={() => setIsLoginMode(true)} className="auth-link">
                  Inicia sesión
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth
