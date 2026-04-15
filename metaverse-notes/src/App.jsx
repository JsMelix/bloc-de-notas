import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [notes, setNotes] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [formData, setFormData] = useState({ title: '', content: '' })
  const [particles, setParticles] = useState([])

  // Cargar notas desde localStorage al iniciar
  useEffect(() => {
    const savedNotes = localStorage.getItem('metaverse-notes')
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
    
    // Generar partículas para el fondo
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDelay: Math.random() * 15,
      animationDuration: 15 + Math.random() * 10
    }))
    setParticles(newParticles)
  }, [])

  // Guardar notas en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem('metaverse-notes', JSON.stringify(notes))
  }, [notes])

  const openModal = (note = null) => {
    if (note) {
      setEditingNote(note)
      setFormData({ title: note.title, content: note.content })
    } else {
      setEditingNote(null)
      setFormData({ title: '', content: '' })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingNote(null)
    setFormData({ title: '', content: '' })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const saveNote = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Por favor, completa tanto el título como el contenido de la nota.')
      return
    }

    if (editingNote) {
      // Actualizar nota existente
      setNotes(prev => prev.map(note => 
        note.id === editingNote.id 
          ? { ...note, title: formData.title, content: formData.content, updatedAt: new Date().toISOString() }
          : note
      ))
    } else {
      // Crear nueva nota
      const newNote = {
        id: Date.now(),
        title: formData.title,
        content: formData.content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setNotes(prev => [newNote, ...prev])
    }

    closeModal()
  }

  const deleteNote = (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta nota del metaverso?')) {
      setNotes(prev => prev.filter(note => note.id !== id))
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <>
      {/* Fondo animado */}
      <div className="metaverse-background">
        <div className="grid-lines"></div>
        <div className="floating-particles">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="particle"
              style={{
                left: `${particle.left}%`,
                animationDelay: `${particle.animationDelay}s`,
                animationDuration: `${particle.animationDuration}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="app-container">
        {/* Header */}
        <header className="header">
          <h1 className="title">METAVESE NOTES</h1>
          <p className="subtitle">Tu espacio de almacenamiento en el metaverso</p>
        </header>

        {/* Panel de notas */}
        {notes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <p className="empty-state-text">No hay notas en el metaverso. ¡Crea tu primera nota!</p>
          </div>
        ) : (
          <div className="notes-panel">
            {notes.map(note => (
              <div key={note.id} className="note-card">
                <div className="note-header">
                  <h3 className="note-title">{note.title}</h3>
                  <span className="note-date">{formatDate(note.updatedAt)}</span>
                </div>
                <div className="note-content">{note.content}</div>
                <div className="note-actions">
                  <button className="btn btn-edit" onClick={() => openModal(note)}>
                    Editar
                  </button>
                  <button className="btn btn-danger" onClick={() => deleteNote(note.id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botón flotante para nueva nota */}
        <button className="fab" onClick={() => openModal()}>
          +
        </button>

        {/* Modal para crear/editar nota */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">
                {editingNote ? 'EDITAR NOTA' : 'NUEVA NOTA'}
              </h2>
              
              <div className="form-group">
                <label className="form-label" htmlFor="title">TÍTULO</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="form-input"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ingresa el título de tu nota..."
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="content">CONTENIDO</label>
                <textarea
                  id="content"
                  name="content"
                  className="form-textarea"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Escribe el contenido de tu nota aquí..."
                />
              </div>

              <div className="modal-actions">
                <button className="btn btn-danger" onClick={closeModal}>
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={saveNote}>
                  {editingNote ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App
