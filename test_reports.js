const http = require('http');

function testReports() {
  console.log('🧪 Testando sistema de relatórios...\n');
  
  const tests = [
    {
      name: 'Relatório Geral do Sistema',
      path: '/reports/system-overview',
      expectedStatus: 401 // Deve retornar 401 sem autenticação
    },
    {
      name: 'Relatório de Funcionários',
      path: '/reports/employees',
      expectedStatus: 401
    },
    {
      name: 'Relatório de Empresas',
      path: '/reports/companies',
      expectedStatus: 401
    },
    {
      name: 'Relatório de Cargas',
      path: '/reports/loads',
      expectedStatus: 401
    },
    {
      name: 'Relatório de Manutenções',
      path: '/reports/maintenance',
      expectedStatus: 401
    },
    {
      name: 'Relatório Financeiro',
      path: '/reports/financial',
      expectedStatus: 401
    },
    {
      name: 'Relatório de Viagens',
      path: '/reports/trips',
      expectedStatus: 401
    }
  ];

  let completedTests = 0;
  let passedTests = 0;

  tests.forEach(test => {
    const options = {
      hostname: 'localhost',
      port: 3333,
      path: test.path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      const status = res.statusCode;
      const passed = status === test.expectedStatus;
      
      if (passed) {
        passedTests++;
        console.log(`✅ ${test.name}: Status ${status} (esperado: ${test.expectedStatus})`);
      } else {
        console.log(`❌ ${test.name}: Status ${status} (esperado: ${test.expectedStatus})`);
      }
      
      completedTests++;
      
      if (completedTests === tests.length) {
        console.log(`\n📊 Resultado dos Testes:`);
        console.log(`✅ Passou: ${passedTests}/${completedTests}`);
        console.log(`❌ Falhou: ${completedTests - passedTests}/${completedTests}`);
        
        if (passedTests === completedTests) {
          console.log('\n🎉 Todos os testes passaram! Sistema de relatórios está funcionando!');
        } else {
          console.log('\n⚠️ Alguns testes falharam. Verifique o backend.');
        }
      }
    });

    req.on('error', (error) => {
      console.error(`❌ ${test.name}: Erro de conexão - ${error.message}`);
      completedTests++;
      
      if (completedTests === tests.length) {
        console.log('\n💡 Certifique-se de que o backend está rodando em http://localhost:3333');
      }
    });

    req.end();
  });
}

testReports();
