import React, { useState, useEffect } from 'react'

const FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed'
}

function App() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState(FILTERS.ALL)
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('react-todos')
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos))
      } catch (error) {
        console.error('Error loading todos from localStorage:', error)
      }
    }
  }, [])

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('react-todos', JSON.stringify(todos))
  }, [todos])

  // Generate unique ID for new todos
  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  // Add new todo
  const addTodo = () => {
    const trimmedValue = inputValue.trim()
    if (trimmedValue === '') return

    const newTodo = {
      id: generateId(),
      text: trimmedValue,
      completed: false,
      createdAt: Date.now()
    }

    setTodos(prevTodos => [...prevTodos, newTodo])
    setInputValue('')
  }

  // Handle input key press
  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  // Toggle todo completion
  const toggleTodo = (id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  // Delete todo
  const deleteTodo = (id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id))
  }

  // Start editing todo
  const startEdit = (id, text) => {
    setEditingId(id)
    setEditValue(text)
  }

  // Save edited todo
  const saveEdit = () => {
    const trimmedValue = editValue.trim()
    if (trimmedValue === '') {
      cancelEdit()
      return
    }

    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === editingId ? { ...todo, text: trimmedValue } : todo
      )
    )
    setEditingId(null)
    setEditValue('')
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null)
    setEditValue('')
  }

  // Handle edit input key press
  const handleEditKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEdit()
    } else if (e.key === 'Escape') {
      cancelEdit()
    }
  }

  // Filter todos based on current filter
  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case FILTERS.ACTIVE:
        return !todo.completed
      case FILTERS.COMPLETED:
        return todo.completed
      default:
        return true
    }
  })

  // Get active todos count
  const activeTodosCount = todos.filter(todo => !todo.completed).length

  return (
    <div className="todo-app">
      <div className="todo-header">
        <h1>Todo App</h1>
        <p>Stay organized and productive</p>
      </div>

      <div className="todo-input-container">
        <input
          type="text"
          className="todo-input"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleInputKeyPress}
        />
      </div>

      <div className="todo-filters">
        <button
          className={`filter-btn ${filter === FILTERS.ALL ? 'active' : ''}`}
          onClick={() => setFilter(FILTERS.ALL)}
        >
          All ({todos.length})
        </button>
        <button
          className={`filter-btn ${filter === FILTERS.ACTIVE ? 'active' : ''}`}
          onClick={() => setFilter(FILTERS.ACTIVE)}
        >
          Active ({activeTodosCount})
        </button>
        <button
          className={`filter-btn ${filter === FILTERS.COMPLETED ? 'active' : ''}`}
          onClick={() => setFilter(FILTERS.COMPLETED)}
        >
          Completed ({todos.length - activeTodosCount})
        </button>
      </div>

      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <h3>No todos found</h3>
            <p>
              {filter === FILTERS.ALL
                ? "Add a todo above to get started!"
                : filter === FILTERS.ACTIVE
                ? "No active todos. Great job!"
                : "No completed todos yet."}
            </p>
          </div>
        ) : (
          filteredTodos.map(todo => (
            <div key={todo.id} className="todo-item">
              <input
                type="checkbox"
                className="todo-checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              
              {editingId === todo.id ? (
                <>
                  <input
                    type="text"
                    className="todo-edit-input"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyPress={handleEditKeyPress}
                    autoFocus
                  />
                  <div className="todo-actions">
                    <button className="todo-btn save-btn" onClick={saveEdit}>
                      Save
                    </button>
                    <button className="todo-btn cancel-btn" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span
                    className={`todo-text ${todo.completed ? 'completed' : ''}`}
                    onClick={() => toggleTodo(todo.id)}
                  >
                    {todo.text}
                  </span>
                  <div className="todo-actions">
                    <button
                      className="todo-btn edit-btn"
                      onClick={() => startEdit(todo.id, todo.text)}
                    >
                      Edit
                    </button>
                    <button
                      className="todo-btn delete-btn"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {todos.length > 0 && (
        <div className="todo-footer">
          {activeTodosCount} {activeTodosCount === 1 ? 'item' : 'items'} left
        </div>
      )}
    </div>
  )
}

export default App
