const axios = require('axios');

const API_BASE_URL = 'http://localhost:3333';

// Simular um token de autenticação (você precisará de um token válido)
const AUTH_TOKEN = 'seu_token_aqui';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${AUTH_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function testEmployeeCRUD() {
  console.log('🧪 Testando CRUD de Funcionários...\n');

  try {
    // 1. Testar criação de funcionário
    console.log('1️⃣ Criando funcionário...');
    const newEmployee = {
      name: 'João Silva',
      role: 'Motorista',
      baseSalary: 2500.00,
      status: 'Ativo',
      cpf: '123.456.789-00',
      phone: '(11) 99999-9999',
      email: 'joao.silva@empresa.com',
      address: 'Rua das Flores, 123 - São Paulo/SP',
      hireDate: '2024-01-15'
    };

    const createResponse = await api.post('/employees', newEmployee);
    console.log('✅ Funcionário criado:', createResponse.data);
    const employeeId = createResponse.data.id;

    // 2. Testar busca de funcionário
    console.log('\n2️⃣ Buscando funcionário...');
    const getResponse = await api.get(`/employees/${employeeId}`);
    console.log('✅ Funcionário encontrado:', getResponse.data);

    // 3. Testar atualização de funcionário
    console.log('\n3️⃣ Atualizando funcionário...');
    const updateData = {
      name: 'João Silva Santos',
      role: 'Motorista Senior',
      baseSalary: 2800.00,
      status: 'Ativo',
      cpf: '123.456.789-00',
      phone: '(11) 98888-8888',
      email: 'joao.santos@empresa.com',
      address: 'Rua das Flores, 456 - São Paulo/SP',
      hireDate: '2024-01-15'
    };

    const updateResponse = await api.put(`/employees/${employeeId}`, updateData);
    console.log('✅ Funcionário atualizado:', updateResponse.data);

    // 4. Testar adição de transação
    console.log('\n4️⃣ Adicionando transação...');
    const transactionData = {
      type: 'Crédito',
      amount: 500.00,
      date: '2024-12-27'
    };

    const transactionResponse = await api.post(`/employees/${employeeId}/transactions`, transactionData);
    console.log('✅ Transação criada:', transactionResponse.data);

    // 5. Testar busca de transações
    console.log('\n5️⃣ Buscando transações...');
    const transactionsResponse = await api.get(`/employees/${employeeId}/transactions`);
    console.log('✅ Transações encontradas:', transactionsResponse.data);

    // 6. Testar busca com filtros
    console.log('\n6️⃣ Testando busca com filtros...');
    const searchResponse = await api.get('/employees/search?name=João&status=Ativo');
    console.log('✅ Busca com filtros:', searchResponse.data);

    // 7. Testar listagem de funcionários
    console.log('\n7️⃣ Listando funcionários...');
    const listResponse = await api.get('/employees');
    console.log('✅ Lista de funcionários:', listResponse.data);

    // 8. Testar exclusão de funcionário
    console.log('\n8️⃣ Excluindo funcionário...');
    await api.delete(`/employees/${employeeId}`);
    console.log('✅ Funcionário excluído com sucesso!');

    console.log('\n🎉 Todos os testes passaram com sucesso!');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n💡 Dica: Verifique se o token de autenticação está válido');
    }
  }
}

// Executar os testes
testEmployeeCRUD();

