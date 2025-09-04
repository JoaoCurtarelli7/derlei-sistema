# Sistema de Gestão de Funcionários

## 📋 Visão Geral

Este sistema oferece um CRUD completo para gerenciamento de funcionários, incluindo cadastro, edição, exclusão, visualização de detalhes e controle de transações financeiras (créditos e débitos).

## 🚀 Funcionalidades

### ✨ Gestão de Funcionários

- **Cadastro completo** com validação de dados
- **Edição** de informações existentes
- **Exclusão** com confirmação
- **Visualização detalhada** de cada funcionário
- **Busca e filtros** avançados
- **Ordenação** por diferentes critérios

### 💰 Controle Financeiro

- **Transações** de crédito e débito
- **Histórico** completo de movimentações
- **Saldo atual** em tempo real
- **Estatísticas** financeiras
- **Relatórios** organizados

### 🔍 Campos do Funcionário

- Nome completo
- Cargo/função
- Salário base
- Status (Ativo/Inativo)
- CPF (único, opcional)
- Telefone
- Email
- Endereço
- Data de contratação
- Timestamps de criação/atualização

## 🛠️ Tecnologias Utilizadas

### Backend

- **Node.js** com **Fastify**
- **Prisma ORM** para banco de dados
- **SQLite** como banco de dados
- **Zod** para validação de dados
- **JWT** para autenticação

### Frontend

- **React** com **Vite**
- **Ant Design** para interface
- **Axios** para requisições HTTP
- **React Router** para navegação
- **Day.js** para manipulação de datas

## 📁 Estrutura do Projeto

```
derlei-sistema/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── employee.ts          # Rotas da API
│   │   └── prisma/
│   │       └── schema.prisma        # Schema do banco
├── front/
│   ├── src/
│   │   ├── pages/Employee/
│   │   │   ├── index.jsx            # Lista de funcionários
│   │   │   └── Details/
│   │   │       └── index.jsx        # Detalhes do funcionário
│   │   └── components/Modal/
│   │       └── Employee/
│   │           └── index.jsx        # Modal de cadastro/edição
```

## 🚀 Como Usar

### 1. Iniciar o Backend

```bash
cd backend
npm install
npm run dev
```

### 2. Iniciar o Frontend

```bash
cd front
npm install
npm run dev
```

### 3. Acessar o Sistema

- Abra o navegador em `http://localhost:5173`
- Navegue para a seção de Funcionários
- Faça login com suas credenciais

## 📡 API Endpoints

### Funcionários

#### `GET /employees`

Lista todos os funcionários com paginação e ordenação.

**Query Parameters:**

- `page`: Número da página
- `limit`: Itens por página
- `sortBy`: Campo para ordenação
- `sortOrder`: `asc` ou `desc`

**Resposta:**

```json
[
  {
    "id": 1,
    "name": "João Silva",
    "role": "Motorista",
    "baseSalary": 2500.0,
    "status": "Ativo",
    "cpf": "123.456.789-00",
    "phone": "(11) 99999-9999",
    "email": "joao@empresa.com",
    "address": "Rua das Flores, 123",
    "hireDate": "2024-01-15T00:00:00.000Z",
    "createdAt": "2024-12-27T10:00:00.000Z",
    "updatedAt": "2024-12-27T10:00:00.000Z"
  }
]
```

#### `GET /employees/:id`

Busca um funcionário específico com suas transações.

**Resposta:**

```json
{
  "id": 1,
  "name": "João Silva",
  "role": "Motorista",
  "baseSalary": 2500.0,
  "status": "Ativo",
  "cpf": "123.456.789-00",
  "phone": "(11) 99999-9999",
  "email": "joao@empresa.com",
  "address": "Rua das Flores, 123",
  "hireDate": "2024-01-15T00:00:00.000Z",
  "transactions": [
    {
      "id": 1,
      "type": "Crédito",
      "amount": 500.0,
      "date": "2024-12-27T00:00:00.000Z"
    }
  ]
}
```

#### `POST /employees`

Cria um novo funcionário.

**Body:**

```json
{
  "name": "João Silva",
  "role": "Motorista",
  "baseSalary": 2500.0,
  "status": "Ativo",
  "cpf": "123.456.789-00",
  "phone": "(11) 99999-9999",
  "email": "joao@empresa.com",
  "address": "Rua das Flores, 123",
  "hireDate": "2024-01-15"
}
```

#### `PUT /employees/:id`

Atualiza um funcionário existente.

**Body:** Mesmo formato do POST

#### `DELETE /employees/:id`

Remove um funcionário.

### Transações

#### `GET /employees/:id/transactions`

Lista todas as transações de um funcionário.

#### `POST /employees/:id/transactions`

Adiciona uma nova transação.

**Body:**

```json
{
  "type": "Crédito",
  "amount": 500.0,
  "date": "2024-12-27"
}
```

### Busca

#### `GET /employees/search`

Busca funcionários com filtros.

**Query Parameters:**

- `name`: Nome ou parte do nome
- `role`: Cargo ou parte do cargo
- `status`: Status (Ativo/Inativo)

## 🔐 Autenticação

Todas as rotas requerem autenticação via JWT. Inclua o token no header:

```
Authorization: Bearer seu_token_jwt
```

## 📊 Banco de Dados

### Tabela Employee

```sql
CREATE TABLE Employee (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  baseSalary REAL NOT NULL,
  status TEXT NOT NULL,
  cpf TEXT UNIQUE,
  phone TEXT,
  email TEXT,
  address TEXT,
  hireDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela Transaction

```sql
CREATE TABLE Transaction (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  amount REAL NOT NULL,
  date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  employeeId INTEGER NOT NULL,
  FOREIGN KEY (employeeId) REFERENCES Employee(id) ON DELETE CASCADE
);
```

## 🧪 Testes

Para testar a API, use o arquivo `test_employee_crud.js`:

```bash
cd backend
node test_employee_crud.js
```

**Nota:** Atualize o `AUTH_TOKEN` no arquivo de teste com um token válido.

## 🎯 Funcionalidades Avançadas

### Filtros e Busca

- Busca por nome, cargo, CPF ou email
- Filtro por status
- Ordenação por qualquer campo
- Paginação configurável

### Validações

- CPF único (quando fornecido)
- Email válido
- Salário maior que zero
- Nome com mínimo de 2 caracteres
- Campos obrigatórios validados

### Interface Responsiva

- Layout adaptável para diferentes dispositivos
- Componentes otimizados para mobile
- Navegação intuitiva

## 🚨 Tratamento de Erros

O sistema inclui tratamento robusto de erros:

- **400**: Dados inválidos ou CPF duplicado
- **401**: Não autorizado
- **404**: Funcionário não encontrado
- **500**: Erro interno do servidor

## 🔄 Atualizações Futuras

- [ ] Relatórios em PDF
- [ ] Exportação para Excel
- [ ] Notificações em tempo real
- [ ] Dashboard com gráficos
- [ ] Integração com folha de pagamento
- [ ] Backup automático do banco

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique os logs do servidor
2. Confirme se o banco está sincronizado
3. Teste as rotas individualmente
4. Verifique a autenticação

## 📝 Licença

Este projeto é parte do sistema Derlei e está sob licença proprietária.

