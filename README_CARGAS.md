# Sistema de Gerenciamento de Cargas - Derlei Sistema

## Visão Geral

O sistema de cargas foi implementado com funcionalidades completas de CRUD (Criar, Ler, Atualizar, Deletar) para gerenciar cargas e pedidos de diferentes empresas. Cada empresa possui suas próprias cargas e o sistema permite uma visão geral consolidada.

## Funcionalidades Implementadas

### Backend (Node.js + Prisma)

#### Rotas de API:

1. **GET /loads** - Lista todas as cargas de todas as empresas
2. **GET /loads/company/:companyId** - Lista cargas de uma empresa específica
3. **GET /loads/:id** - Busca uma carga específica por ID
4. **POST /loads** - Cria uma nova carga
5. **PUT /loads/:id** - Atualiza uma carga existente
6. **DELETE /loads/:id** - Remove uma carga
7. **GET /loads/period** - Busca cargas por período (com filtro opcional por empresa)

#### Validações Implementadas:

- Verificação de existência da empresa
- Validação de números de carregamento únicos por empresa
- Validação de dados obrigatórios
- Verificação de duplicatas na atualização

### Frontend (React + Ant Design)

#### Páginas Implementadas:

1. **Visão Geral (/load)** - Lista todas as cargas de todas as empresas
2. **Cargas por Empresa (/load/:id)** - Gerencia cargas de uma empresa específica

#### Funcionalidades da Interface:

- **Criar Carga**: Modal com formulário completo
- **Editar Carga**: Edição inline com validações
- **Excluir Carga**: Confirmação antes da exclusão
- **Filtros Avançados**:
  - Por empresa
  - Por período de datas
  - Por status (recentes/antigas)
  - Busca textual
- **Exportação para Excel**: Relatórios personalizados
- **Paginação**: Navegação por páginas
- **Ordenação**: Por data, valor, frete
- **Resumo Estatístico**: Totais e métricas

## Estrutura do Banco de Dados

### Modelo Load (Carga):

```prisma
model Load {
  id            Int      @id @default(autoincrement())
  date          DateTime
  loadingNumber String
  deliveries    Int
  cargoWeight   Float
  totalValue    Float
  freight4      Float
  totalFreight  Float
  closings      Float
  observations  String?
  companyId     Int
  company       Company  @relation(fields: [companyId], references: [id])
}
```

### Relacionamentos:

- Cada carga pertence a uma empresa
- Uma empresa pode ter múltiplas cargas
- Validação de integridade referencial

## Como Usar

### 1. Acessar o Sistema

- Navegue para `/load` para ver todas as cargas
- Navegue para `/load/:id` para ver cargas de uma empresa específica

### 2. Criar Nova Carga

1. Clique em "Adicionar Carga"
2. Preencha o formulário:
   - Selecione a empresa
   - Insira a data
   - Número do carregamento
   - Quantidade de entregas
   - Peso da carga
   - Valor total
   - Observações (opcional)
3. Clique em "Salvar"

### 3. Editar Carga Existente

1. Clique no botão "Editar" na linha da carga
2. Modifique os campos desejados
3. Clique em "Atualizar"

### 4. Excluir Carga

1. Clique no botão "Excluir" na linha da carga
2. Confirme a exclusão

### 5. Filtrar e Buscar

- **Por Empresa**: Selecione uma empresa específica
- **Por Período**: Use o seletor de datas
- **Por Status**: Filtre por cargas recentes ou antigas
- **Busca Textual**: Digite para buscar por número ou observações

### 6. Exportar Dados

1. Aplique os filtros desejados
2. Clique em "Exportar para Excel"
3. O arquivo será baixado com os dados filtrados

## Características Técnicas

### Validações:

- Campos obrigatórios marcados com *
- Validação de tipos de dados
- Verificação de valores mínimos
- Cálculo automático de frete 4%
- Prevenção de duplicatas

### Performance:

- Paginação para grandes volumes de dados
- Filtros otimizados
- Lazy loading de dados
- Cache de empresas

### Segurança:

- Autenticação obrigatória
- Validação de entrada
- Sanitização de dados
- Controle de acesso por empresa

## Arquivos Principais

### Backend:
- `backend/src/routes/load.ts` - Rotas da API
- `backend/prisma/schema.prisma` - Esquema do banco

### Frontend:
- `front/src/pages/Load/index.jsx` - Página de cargas por empresa
- `front/src/pages/Load/LoadCompanies/index.tsx` - Visão geral de cargas
- `front/src/components/Modal/Load/index.jsx` - Modal de criação/edição
- `front/src/components/SideBar/index.jsx` - Navegação

## Próximas Melhorias Sugeridas

1. **Relatórios Avançados**: Gráficos e dashboards
2. **Notificações**: Alertas para cargas vencidas
3. **Histórico**: Log de alterações
4. **Backup**: Exportação automática de dados
5. **API Externa**: Integração com sistemas de terceiros
6. **Mobile**: Interface responsiva para dispositivos móveis

## Suporte

Para dúvidas ou problemas, consulte a documentação da API ou entre em contato com a equipe de desenvolvimento.
