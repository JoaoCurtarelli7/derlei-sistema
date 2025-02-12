import { setToken, removeToken, getToken } from './token'

// Função de login
export const login = (token) => {
  setToken(token) // Salva o token em um cookie httpOnly
}

// Função de logout
export const logout = () => {
  removeToken() // Remove o token do cookie
}

// Função de verificação de autenticação
export const isAuthenticated = () => {
  const token = getToken()
  return !!token // Retorna true se houver um token válido
}
