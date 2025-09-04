// src/context/UserContext.js
import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../lib/api'
import { message } from 'antd'

const UserContext = createContext()

export const UserProvider = ({ children, navigate }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Função para carregar dados do usuário
  const fetchUserData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await api.get('/me')
      setUser(response.data)
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error)
      
      if (error.response && error.response.status === 401) {
        // Token expirado ou inválido
        localStorage.removeItem('token')
        setUser(null)
        message.error('Sua sessão expirou. Faça login novamente.')
        if (navigate) {
          navigate('/login')
        } else {
          window.location.href = '/login'
        }
      } else {
        setError('Erro ao carregar dados do usuário. Tente novamente.')
        message.error('Erro ao carregar dados do usuário. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Função para atualizar dados do usuário
  const updateUser = async (userData) => {
    try {
      const response = await api.put('/me', userData)
      setUser(response.data.user)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      throw error
    }
  }

  // Função para fazer logout
  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setError(null)
    message.success('Logout realizado com sucesso!')
    
    if (navigate) {
      navigate('/login')
    } else {
      window.location.href = '/login'
    }
  }

  // Função para verificar se o usuário está autenticado
  const isAuthenticated = () => {
    return !!localStorage.getItem('token') && !!user
  }

  // Carregar dados do usuário quando o componente montar
  useEffect(() => {
    fetchUserData()
  }, [])

  // Verificar token periodicamente (a cada 5 minutos)
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('token')
      if (token && user) {
        // Verificar se o token ainda é válido fazendo uma requisição
        api.get('/me').catch(() => {
          // Se falhar, fazer logout
          logout()
        })
      }
    }, 5 * 60 * 1000) // 5 minutos

    return () => clearInterval(interval)
  }, [user])

  const contextValue = {
    user,
    setUser,
    loading,
    error,
    updateUser,
    logout,
    isAuthenticated,
    refreshUser: fetchUserData
  }

  return (
    <UserContext.Provider value={contextValue}>
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
