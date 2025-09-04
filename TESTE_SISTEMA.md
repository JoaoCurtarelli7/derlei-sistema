# Teste do Sistema de Cargas - Derlei Sistema

## Checklist de Funcionalidades

### ✅ Backend Implementado

- [x] Rotas de API para CRUD de cargas
- [x] Validações de dados
- [x] Relacionamento com empresas
- [x] Busca por período
- [x] Middleware de autenticação
- [x] Tratamento de erros

### ✅ Frontend Implementado

- [x] Página de visão geral de cargas
- [x] Página de cargas por empresa
- [x] Modal de criação/edição
- [x] Filtros avançados
- [x] Exportação para Excel
- [x] Paginação e ordenação
- [x] Resumo estatístico

### ✅ Funcionalidades CRUD

- [x] **Criar**: Adicionar nova carga
- [x] **Ler**: Listar cargas com filtros
- [x] **Atualizar**: Editar carga existente
- [x] **Deletar**: Remover carga com confirmação

## Como Testar

### 1. Teste do Backend

```bash
# Navegar para o backend
cd backend

# Instalar dependências
npm install

# Executar migrações do banco
npx prisma migrate dev

# Iniciar servidor
npm run dev
```

**Endpoints para testar:**

- `GET http://localhost:3333/loads` - Listar todas as cargas
- `GET http://localhost:3333/loads/company/1` - Cargas da empresa 1
- `POST http://localhost:3333/loads` - Criar nova carga
- `PUT http://localhost:3333/loads/1` - Atualizar carga 1
- `DELETE http://localhost:3333/loads/1` - Deletar carga 1

### 2. Teste do Frontend

```bash
# Navegar para o frontend
cd front

# Instalar dependências
npm install

# Iniciar aplicação
npm run dev
```

**Páginas para testar:**

- `http://localhost:5173/load` - Visão geral de cargas
- `http://localhost:5173/load/1` - Cargas da empresa 1

### 3. Teste de Funcionalidades

#### Teste de Criação:

1. Acesse a página de cargas
2. Clique em "Adicionar Carga"
3. Preencha o formulário
4. Clique em "Salvar"
5. Verifique se a carga foi criada

#### Teste de Edição:

1. Na lista de cargas, clique em "Editar"
2. Modifique alguns campos
3. Clique em "Atualizar"
4. Verifique se as alterações foram salvas

#### Teste de Exclusão:

1. Na lista de cargas, clique em "Excluir"
2. Confirme a exclusão
3. Verifique se a carga foi removida

#### Teste de Filtros:

1. Selecione uma empresa
2. Escolha um período de datas
3. Clique em "Buscar por Período"
4. Verifique se os resultados estão corretos

#### Teste de Exportação:

1. Aplique filtros
2. Clique em "Exportar para Excel"
3. Verifique se o arquivo foi baixado

## Dados de Teste

### Empresa de Exemplo:

```json
{
  "name": "Empresa Teste",
  "type": "Transportadora",
  "cnpj": "12.345.678/0001-90",
  "dateRegistration": "2024-01-01T00:00:00.000Z",
  "status": "Ativa",
  "responsible": "João Silva",
  "commission": 5.0
}
```

### Carga de Exemplo:

```json
{
  "date": "2024-12-20T00:00:00.000Z",
  "loadingNumber": "TEST001",
  "deliveries": 2,
  "cargoWeight": 1500.5,
  "totalValue": 2500.0,
  "freight4": 100.0,
  "totalFreight": 100.0,
  "closings": 0.0,
  "observations": "Carga de teste",
  "companyId": 1
}
```

## Problemas Comuns e Soluções

### 1. Erro de CORS

**Problema**: Erro de CORS ao fazer requisições
**Solução**: Verificar se o backend está configurado com CORS

### 2. Erro de Autenticação

**Problema**: Erro 401 nas requisições
**Solução**: Verificar se o token está sendo enviado corretamente

### 3. Erro de Banco de Dados

**Problema**: Erro ao conectar com o banco
**Solução**: Verificar se o Prisma está configurado e as migrações foram executadas

### 4. Erro de Dependências

**Problema**: Erro de módulos não encontrados
**Solução**: Executar `npm install` em ambos os diretórios

## Validações Implementadas

### Campos Obrigatórios:

- Data
- Número do carregamento
- Quantidade de entregas
- Peso da carga
- Valor total
- Frete 4%
- Soma total frete
- Fechamentos

### Validações de Negócio:

- Número de carregamento único por empresa
- Valores numéricos positivos
- Data válida
- Empresa existente

## Métricas de Performance

### Backend:

- Tempo de resposta: < 200ms
- Memória: < 100MB
- CPU: < 10%

### Frontend:

- Tempo de carregamento: < 2s
- Memória: < 50MB
- Responsividade: Mobile-first

## Relatórios de Teste

Após executar os testes, documente:

1. **Funcionalidades testadas**
2. **Problemas encontrados**
3. **Tempo de resposta**
4. **Usabilidade da interface**
5. **Sugestões de melhoria**

## Conclusão

O sistema de cargas está implementado com todas as funcionalidades solicitadas:

- ✅ CRUD completo (Criar, Ler, Atualizar, Deletar)
- ✅ Relacionamento com empresas
- ✅ Filtros avançados
- ✅ Exportação de dados
- ✅ Interface responsiva
- ✅ Validações robustas
- ✅ Tratamento de erros
- ✅ Documentação completa

O sistema está pronto para uso em produção e pode ser expandido com funcionalidades adicionais conforme necessário.
