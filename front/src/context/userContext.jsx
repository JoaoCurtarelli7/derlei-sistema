// src/context/UserContext.js
import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../lib/api'
import { message } from 'antd'

const UserContext = createContext()

export const UserProvider = ({ children, navigate }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/me')
        setUser(response.data)
      } catch (error) {
        if (error.response && error.response.status === 401) {
          message.error('Sua sessão expirou. Faça login novamente.')
          navigate('/login')
        } else {
          message.error('Erro ao carregar dados do usuário. Tente novamente.')
        }
      }
    }

    fetchUserData()
  }, [navigate])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUserContext = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserContext deve ser usado dentro de um UserProvider')
  }
  return context
}
