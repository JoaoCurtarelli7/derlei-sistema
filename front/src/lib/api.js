import axios from 'axios'
import { getToken } from './token'

const api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

api.interceptors.request.use(
  (config) => {
    const token = getToken() // Obtém o token do cookie
    if (token) {
      config.headers.Authorization = `Bearer ${token}` // Adiciona o token nas requisições
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Interceptor de resposta para tratar erros globais
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se a resposta for de erro de autenticação (401), redireciona para o login
    if (error.response && error.response.status === 401) {
      window.location.href = '/login' // Redireciona para a página de login
    }
    return Promise.reject(error)
  },
)

export default api
