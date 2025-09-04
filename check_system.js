const http = require('http');

console.log('🔍 VERIFICANDO STATUS DO SISTEMA...\n');

// Teste simples de conectividade
function testConnection() {
  const req = http.request({
    hostname: 'localhost',
    port: 3333,
    path: '/',
    method: 'GET'
  }, (res) => {
    console.log(`✅ Servidor respondendo na porta 3333`);
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   Headers: ${JSON.stringify(res.headers)}`);
  });

  req.on('error', (error) => {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Servidor não está rodando na porta 3333');
      console.log('💡 Soluções:');
      console.log('   1. cd backend && npm run dev');
      console.log('   2. cd backend && npx tsx src/server.ts');
      console.log('   3. Verificar se há erros no console');
    } else {
      console.log(`❌ Erro de conexão: ${error.message}`);
    }
  });

  req.end();
}

// Verificar se o arquivo de teste existe
const fs = require('fs');
const path = require('path');

console.log('📁 VERIFICANDO ARQUIVOS DO SISTEMA...\n');

const filesToCheck = [
  'backend/src/server.ts',
  'backend/src/app.ts',
  'backend/src/routes/employee.ts',
  'backend/src/routes/company.ts',
  'backend/src/routes/reports.ts',
  'front/src/pages/Employee/index.jsx',
  'front/src/pages/Reports/index.jsx',
  'front/src/lib/api.js',
  'front/src/routes.jsx'
];

filesToCheck.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - NÃO ENCONTRADO`);
  }
});

console.log('\n🔌 TESTANDO CONECTIVIDADE...\n');
testConnection();

console.log('\n📋 PRÓXIMOS PASSOS:');
console.log('1. Verificar se o backend está rodando');
console.log('2. Verificar logs de erro no console');
console.log('3. Testar rotas individuais');
console.log('4. Verificar configuração do banco de dados');

