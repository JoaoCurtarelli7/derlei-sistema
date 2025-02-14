import axios from 'axios'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'

const api = axios.create({
  baseURL: 'http://localhost:3333',
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') // Busca o token salvo no navegador

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Intercepta as respostas para lidar com erros de token expirado
api.interceptors.response.use(
  (response) => {
    return response // Retorna a resposta se não houver erro
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('token') // Remove o token do localStorage
      message.error('Sua sessão expirou. Faça login novamente.')

      // Redireciona o usuário para a tela de login
      const navigate = useNavigate() // Hook do react-router-dom
      navigate('/login') // Altere para a rota de login da sua aplicação
    }

    return Promise.reject(error)
  },
)

export default api
