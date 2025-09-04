const { spawn } = require('child_process');
const path = require('path');

console.log('🔍 DIAGNÓSTICO DO SERVIDOR BACKEND\n');
console.log('=' .repeat(50));

// Verificar se estamos no diretório correto
const currentDir = process.cwd();
console.log(`📁 Diretório atual: ${currentDir}`);

// Verificar se o backend existe
const backendPath = path.join(currentDir, 'backend');
const fs = require('fs');

if (!fs.existsSync(backendPath)) {
  console.log('❌ Diretório backend não encontrado!');
  process.exit(1);
}

console.log('✅ Diretório backend encontrado');

// Verificar arquivos essenciais
const essentialFiles = [
  'package.json',
  'src/server.ts',
  'src/app.ts',
  'prisma/schema.prisma'
];

essentialFiles.forEach(file => {
  const filePath = path.join(backendPath, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - NÃO ENCONTRADO`);
  }
});

// Verificar dependências
console.log('\n📦 VERIFICANDO DEPENDÊNCIAS...');
const packageJsonPath = path.join(backendPath, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  console.log(`   Nome: ${packageJson.name}`);
  console.log(`   Versão: ${packageJson.version}`);
  console.log(`   Scripts disponíveis: ${Object.keys(packageJson.scripts).join(', ')}`);
}

// Tentar iniciar o servidor
console.log('\n🚀 TENTANDO INICIAR O SERVIDOR...');
console.log('   Comando: npm run dev');

const npmProcess = spawn('npm', ['run', 'dev'], {
  cwd: backendPath,
  stdio: 'pipe'
});

let output = '';
let errorOutput = '';

npmProcess.stdout.on('data', (data) => {
  output += data.toString();
  console.log(`   [STDOUT] ${data.toString().trim()}`);
});

npmProcess.stderr.on('data', (data) => {
  errorOutput += data.toString();
  console.log(`   [STDERR] ${data.toString().trim()}`);
});

npmProcess.on('close', (code) => {
  console.log(`\n📊 PROCESSO FINALIZADO COM CÓDIGO: ${code}`);
  
  if (code === 0) {
    console.log('✅ Servidor iniciado com sucesso!');
  } else {
    console.log('❌ Erro ao iniciar servidor');
    console.log('\n🔍 ANÁLISE DO ERRO:');
    
    if (errorOutput.includes('ENOENT')) {
      console.log('   ❌ Arquivo não encontrado - Verificar dependências');
    } else if (errorOutput.includes('EADDRINUSE')) {
      console.log('   ❌ Porta já em uso - Matar processo existente');
    } else if (errorOutput.includes('prisma')) {
      console.log('   ❌ Problema com Prisma - Verificar banco de dados');
    } else {
      console.log(`   ❌ Erro desconhecido: ${errorOutput}`);
    }
    
    console.log('\n💡 SOLUÇÕES:');
    console.log('   1. npm install (instalar dependências)');
    console.log('   2. npx prisma generate (gerar cliente Prisma)');
    console.log('   3. npx prisma migrate dev (executar migrações)');
    console.log('   4. Verificar se a porta 3333 está livre');
  }
});

// Timeout para parar o processo
setTimeout(() => {
  console.log('\n⏰ TIMEOUT - Parando processo...');
  npmProcess.kill();
}, 10000);

