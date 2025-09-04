const axios = require('axios');

async function testBackend() {
  try {
    console.log('🧪 Testando conexão com backend...');
    
    // Testar se o servidor está rodando
    const response = await axios.get('http://localhost:3333/companies');
    console.log('✅ Backend está funcionando!');
    console.log('📊 Empresas encontradas:', response.data.length);
    
  } catch (error) {
    console.error('❌ Erro ao conectar com backend:', error.message);
    console.log('💡 Certifique-se de que o backend está rodando em http://localhost:3333');
  }
}

testBackend();
