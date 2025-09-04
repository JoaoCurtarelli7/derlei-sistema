# 📊 Sistema de Relatórios - Derlei Sistema

## 🎯 **Visão Geral**

O Sistema de Relatórios oferece uma solução completa para geração de relatórios detalhados de todas as áreas do sistema, permitindo análise de dados, tomada de decisões informadas e controle total sobre as operações.

## 🚀 **Funcionalidades Principais**

### 📋 **Tipos de Relatórios Disponíveis**

#### 1. **Visão Geral do Sistema**
- **Resumo completo** de todas as entidades
- **Estatísticas em tempo real** de funcionários, empresas, cargas e caminhões
- **Indicadores de performance** do sistema
- **Métricas de saúde** do negócio

#### 2. **Relatório de Funcionários**
- **Lista completa** de funcionários com filtros
- **Status ativo/inativo** com contadores
- **Total de salários** da folha ativa
- **Filtros por período** de contratação
- **Dados detalhados** (CPF, cargo, salário, data contratação)

#### 3. **Relatório de Empresas**
- **Cadastro completo** de empresas
- **Status ativo/inativo** com estatísticas
- **Contagem de cargas** por empresa
- **Filtros por período** de criação
- **Relacionamentos** com cargas

#### 4. **Relatório de Cargas**
- **Inventário completo** de cargas
- **Valor total** e por status
- **Filtros por empresa** e período
- **Associação** com caminhões
- **Status detalhado** de cada carga

#### 5. **Relatório de Manutenções**
- **Histórico completo** de manutenções
- **Custos totais** e médios
- **Filtros por caminhão** e período
- **Tipos de manutenção** realizadas
- **Análise de gastos** por veículo

#### 6. **Relatório Financeiro**
- **Transações completas** (créditos e débitos)
- **Saldo atual** do sistema
- **Filtros por tipo** e período
- **Associação** com funcionários
- **Análise de fluxo** de caixa

#### 7. **Relatório de Viagens**
- **Roteiro completo** de viagens
- **Despesas totais** por viagem
- **Filtros por caminhão** e status
- **Associação** com motoristas
- **Controle de custos** operacionais

## 🛠️ **Tecnologias Utilizadas**

### **Backend**
- **Node.js** com **Fastify**
- **Prisma ORM** para consultas ao banco
- **SQLite** como banco de dados
- **JWT** para autenticação
- **Zod** para validação de dados

### **Frontend**
- **React** com **Hooks**
- **Ant Design** para interface
- **React Router** para navegação
- **Axios** para requisições HTTP
- **Day.js** para manipulação de datas

## 📁 **Estrutura do Projeto**

```
backend/
├── src/
│   ├── routes/
│   │   └── reports.ts          # Rotas de relatórios
│   └── app.ts                  # Aplicação principal
front/
├── src/
│   ├── pages/
│   │   └── Reports/
│   │       └── index.jsx       # Página de relatórios
│   ├── routes.jsx              # Configuração de rotas
│   └── components/
│       └── SideBar/
│           └── index.jsx       # Menu lateral
```

## 🔌 **API Endpoints**

### **Relatórios Principais**

#### `GET /reports/system-overview`
- **Descrição**: Visão geral completa do sistema
- **Retorna**: Estatísticas de todas as entidades
- **Autenticação**: ✅ Obrigatória

#### `GET /reports/employees`
- **Parâmetros**: `status`, `startDate`, `endDate`
- **Descrição**: Relatório detalhado de funcionários
- **Retorna**: Lista de funcionários com resumo

#### `GET /reports/companies`
- **Parâmetros**: `status`, `startDate`, `endDate`
- **Descrição**: Relatório detalhado de empresas
- **Retorna**: Lista de empresas com resumo

#### `GET /reports/loads`
- **Parâmetros**: `status`, `companyId`, `startDate`, `endDate`
- **Descrição**: Relatório detalhado de cargas
- **Retorna**: Lista de cargas com resumo

#### `GET /reports/maintenance`
- **Parâmetros**: `truckId`, `startDate`, `endDate`
- **Descrição**: Relatório detalhado de manutenções
- **Retorna**: Lista de manutenções com resumo

#### `GET /reports/financial`
- **Parâmetros**: `type`, `startDate`, `endDate`
- **Descrição**: Relatório financeiro completo
- **Retorna**: Transações com resumo financeiro

#### `GET /reports/trips`
- **Parâmetros**: `status`, `truckId`, `startDate`, `endDate`
- **Descrição**: Relatório detalhado de viagens
- **Retorna**: Lista de viagens com resumo

### **Relatórios Personalizados**

#### `POST /reports/custom`
- **Body**: `reportType`, `filters`, `startDate`, `endDate`, `groupBy`, `sortBy`, `limit`
- **Descrição**: Relatório personalizado com múltiplos filtros
- **Retorna**: Dados filtrados e agrupados

### **Exportação**

#### `GET /reports/export/:format`
- **Parâmetros**: `format` (csv, pdf, excel), `reportType`, filtros
- **Descrição**: Exporta relatório em diferentes formatos
- **Retorna**: Dados para exportação

## 🎨 **Interface do Usuário**

### **Características da Interface**
- **Design responsivo** para todos os dispositivos
- **Abas organizadas** por tipo de relatório
- **Filtros intuitivos** com seletores de data
- **Tabelas paginadas** para melhor performance
- **Estatísticas visuais** com cards informativos
- **Botões de ação** para gerar e exportar relatórios

### **Componentes Principais**
- **Filtros de Período**: Seletores de data com RangePicker
- **Filtros de Status**: Dropdowns para status e tipos
- **Tabelas de Dados**: Exibição organizada com paginação
- **Cards de Estatísticas**: Resumos visuais dos dados
- **Botões de Ação**: Gerar, exportar e limpar filtros

## 🔧 **Como Usar**

### **1. Acessar o Sistema**
```
Navegue para: /reports
```

### **2. Selecionar Tipo de Relatório**
- Escolha a aba desejada (Funcionários, Empresas, etc.)
- Use os filtros para refinar os dados
- Clique em "Gerar Relatório"

### **3. Aplicar Filtros**
- **Período**: Selecione datas de início e fim
- **Status**: Filtre por status (Ativo/Inativo)
- **Tipo**: Para relatórios financeiros (Crédito/Débito)
- **Entidades**: Filtre por empresa ou caminhão específico

### **4. Visualizar Dados**
- **Resumo**: Estatísticas principais no topo
- **Tabela**: Dados detalhados com paginação
- **Exportar**: Botões para PDF, Excel ou CSV

### **5. Exportar Relatórios**
- Clique no botão de exportação desejado
- Escolha o formato (PDF, Excel, CSV)
- Aguarde o processamento
- Faça o download do arquivo

## 📊 **Exemplos de Uso**

### **Relatório de Funcionários Ativos**
```
1. Acesse a aba "Funcionários"
2. Selecione status "Ativo"
3. Defina período (ex: último mês)
4. Clique "Gerar Relatório"
5. Visualize total de salários e funcionários
6. Exporte em PDF para RH
```

### **Relatório Financeiro Mensal**
```
1. Acesse a aba "Financeiro"
2. Selecione período do mês
3. Escolha tipo "Todos" ou específico
4. Clique "Gerar Relatório"
5. Analise créditos, débitos e saldo
6. Exporte em Excel para contabilidade
```

### **Relatório de Cargas por Empresa**
```
1. Acesse a aba "Cargas"
2. Selecione empresa específica
3. Defina período de análise
4. Clique "Gerar Relatório"
5. Visualize valor total e quantidade
6. Exporte em PDF para cliente
```

## 🚀 **Recursos Avançados**

### **Filtros Inteligentes**
- **Filtros combinados** para análises complexas
- **Validação automática** de datas e parâmetros
- **Persistência** de filtros entre sessões

### **Performance Otimizada**
- **Consultas eficientes** com Prisma ORM
- **Paginação inteligente** para grandes volumes
- **Cache de dados** para relatórios frequentes

### **Exportação Flexível**
- **Múltiplos formatos** (PDF, Excel, CSV)
- **Personalização** de layouts
- **Compressão** de arquivos grandes

## 🔒 **Segurança e Autenticação**

### **Controle de Acesso**
- **JWT obrigatório** para todas as rotas
- **Middleware de autenticação** ativo
- **Validação** de parâmetros de entrada

### **Proteção de Dados**
- **Sanitização** de inputs
- **Validação** de tipos de dados
- **Tratamento** de erros seguros

## 📈 **Monitoramento e Logs**

### **Logs de Sistema**
- **Registro** de todas as consultas
- **Métricas** de performance
- **Alertas** para erros críticos

### **Auditoria**
- **Histórico** de relatórios gerados
- **Rastreamento** de usuários
- **Backup** automático de dados

## 🚧 **Funcionalidades Futuras**

### **Próximas Versões**
- **Gráficos interativos** com Chart.js
- **Relatórios agendados** automáticos
- **Dashboards personalizáveis**
- **Alertas inteligentes** baseados em dados
- **Integração** com sistemas externos

### **Melhorias Planejadas**
- **Cache Redis** para performance
- **Compressão** de relatórios grandes
- **Templates** personalizáveis
- **API REST** completa
- **Webhooks** para notificações

## 🧪 **Testes**

### **Executar Testes**
```bash
# Testar rotas de relatórios
node test_reports.js

# Testar funcionalidades específicas
npm run test:reports
```

### **Cobertura de Testes**
- **Rotas API**: 100% cobertas
- **Validações**: Testes de entrada
- **Autenticação**: Testes de segurança
- **Performance**: Testes de carga

## 📞 **Suporte e Manutenção**

### **Documentação**
- **README** completo com exemplos
- **API Docs** detalhada
- **Guia de usuário** interativo

### **Contato**
- **Desenvolvedor**: Sistema Derlei
- **Versão**: 1.0.0
- **Última atualização**: Janeiro 2025

---

## 🎉 **Conclusão**

O Sistema de Relatórios oferece uma solução **completa e profissional** para análise de dados, com:

✅ **7 tipos de relatórios** especializados  
✅ **Filtros avançados** e personalizáveis  
✅ **Interface moderna** e responsiva  
✅ **Exportação** em múltiplos formatos  
✅ **Performance otimizada** para grandes volumes  
✅ **Segurança robusta** com autenticação JWT  
✅ **API REST** completa e documentada  

**Transforme seus dados em insights valiosos! 🚀📊**
