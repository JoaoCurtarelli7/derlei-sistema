const axios = require('axios');

// Teste de criação de fechamento
async function testCreateClosing() {
  try {
    const response = await axios.post('http://localhost:3333/closings', {
      monthId: 1,
      companyId: null,
      name: "Teste de Fechamento",
      startDate: "01/12/2024",
      endDate: "31/12/2024"
    });
    
    console.log('Sucesso:', response.data);
  } catch (error) {
    console.error('Erro:', error.response?.data || error.message);
  }
}

// Teste de criação de entrada financeira
async function testCreateFinancialEntry() {
  try {
    const response = await axios.post('http://localhost:3333/financial/entries', {
      description: "Teste de entrada",
      amount: "1000.50",
      category: "Fretes",
      date: "01/12/2024",
      type: "entrada",
      companyId: null,
      closingId: null,
      observations: "Teste de observação"
    });
    
    console.log('Sucesso:', response.data);
  } catch (error) {
    console.error('Erro:', error.response?.data || error.message);
  }
}

// Executar testes
testCreateFinancialEntry();
