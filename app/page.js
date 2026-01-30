'use client'

import { useState } from 'react'

export default function Home() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, history: messages })
      })

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🤖 Rozy</h1>
        <p style={styles.subtitle}>Your AI Assistant</p>
      </div>

      <div style={styles.chatContainer}>
        {messages.length === 0 && (
          <div style={styles.welcome}>
            <h2>👋 Hello! I'm Rozy</h2>
            <p>Ask me anything and I'll help you!</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              ...(msg.role === 'user' ? styles.userMessage : styles.assistantMessage)
            }}
          >
            <strong>{msg.role === 'user' ? 'You' : 'Rozy'}:</strong>
            <p style={{ margin: '8px 0 0 0', whiteSpace: 'pre-wrap' }}>{msg.content}</p>
          </div>
        ))}

        {loading && (
          <div style={styles.loading}>
            <span>Rozy is thinking...</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          style={styles.input}
          disabled={loading}
        />
        <button type="submit" style={styles.button} disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    maxWidth: '900px',
    margin: '0 auto',
    backgroundColor: '#f5f5f5'
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  title: {
    margin: 0,
    fontSize: '32px'
  },
  subtitle: {
    margin: '5px 0 0 0',
    opacity: 0.9,
    fontSize: '16px'
  },
  chatContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  welcome: {
    textAlign: 'center',
    color: '#666',
    marginTop: '50px'
  },
  message: {
    padding: '15px',
    borderRadius: '12px',
    maxWidth: '80%',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  userMessage: {
    backgroundColor: '#667eea',
    color: 'white',
    alignSelf: 'flex-end',
    marginLeft: 'auto'
  },
  assistantMessage: {
    backgroundColor: 'white',
    color: '#333',
    alignSelf: 'flex-start'
  },
  loading: {
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '12px',
    maxWidth: '80%',
    color: '#666',
    fontStyle: 'italic',
    alignSelf: 'flex-start'
  },
  form: {
    display: 'flex',
    gap: '10px',
    padding: '20px',
    backgroundColor: 'white',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    border: '2px solid #e0e0e0',
    borderRadius: '24px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  button: {
    padding: '12px 32px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '24px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.05)'
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed'
    }
  }
}
