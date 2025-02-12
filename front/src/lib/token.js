import Cookies from 'js-cookie'

export function setToken(token) {
  Cookies.set('authToken', token, {
    expires: 7, // O token expira em 7 dias
    secure: true, // Garante que o cookie só será enviado via HTTPS
    sameSite: 'Strict', // Protege contra CSRF
  })
}

export function getToken() {
  const token = Cookies.get('authToken') // Pega o token do cookie
  return token || null
}

// Função para remover o token do cookie
export function removeToken() {
  Cookies.remove('authToken') // Remove o token
}
