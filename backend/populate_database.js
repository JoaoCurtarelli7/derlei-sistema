const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function populateDatabase() {
  try {
    console.log('🚀 Iniciando população do banco de dados...')

    // Limpar dados existentes (opcional - descomente se quiser limpar)
    // await prisma.transaction.deleteMany()
    // await prisma.trip.deleteMany()
    // await prisma.maintenance.deleteMany()
    // await prisma.load.deleteMany()
    // await prisma.truck.deleteMany()
    // await prisma.employee.deleteMany()
    // await prisma.company.deleteMany()

    // 1. Criar Empresas
    console.log('📊 Criando empresas...')
    const companies = await Promise.all([
      prisma.company.upsert({
        where: { id: 1 },
        update: {},
        create: {
          name: 'Transportadora ABC Ltda',
          type: 'Transportadora',
          cnpj: '12.345.678/0001-90',
          dateRegistration: new Date('2020-01-15'),
          status: 'Ativo',
          responsible: 'João Silva',
          commission: 5.5
        }
      }),
      prisma.company.upsert({
        where: { id: 2 },
        update: {},
        create: {
          name: 'Logística XYZ S.A.',
          type: 'Logística',
          cnpj: '98.765.432/0001-10',
          dateRegistration: new Date('2019-03-20'),
          status: 'Ativo',
          responsible: 'Maria Santos',
          commission: 7.0
        }
      }),
      prisma.company.upsert({
        where: { id: 3 },
        update: {},
        create: {
          name: 'Frete Rápido ME',
          type: 'Frete',
          cnpj: '11.222.333/0001-44',
          dateRegistration: new Date('2021-06-10'),
          status: 'Ativo',
          responsible: 'Pedro Costa',
          commission: 4.0
        }
      }),
      prisma.company.upsert({
        where: { id: 4 },
        update: {},
        create: {
          name: 'Cargas Pesadas Ltda',
          type: 'Transporte Pesado',
          cnpj: '55.666.777/0001-88',
          dateRegistration: new Date('2018-11-05'),
          status: 'Inativo',
          responsible: 'Ana Oliveira',
          commission: 6.5
        }
      })
    ])

    // 2. Criar Funcionários
    console.log('👥 Criando funcionários...')
    const employees = await Promise.all([
      prisma.employee.upsert({
        where: { id: 1 },
        update: {},
        create: {
          name: 'Carlos Eduardo Silva',
          cpf: '123.456.789-00',
          phone: '(11) 99999-1111',
          email: 'carlos.silva@empresa.com',
          address: 'Rua das Flores, 123 - São Paulo/SP',
          role: 'Motorista',
          baseSalary: 3500.00,
          hireDate: new Date('2020-02-15'),
          status: 'Ativo'
        }
      }),
      prisma.employee.upsert({
        where: { id: 2 },
        update: {},
        create: {
          name: 'Fernanda Lima',
          cpf: '987.654.321-00',
          phone: '(11) 88888-2222',
          email: 'fernanda.lima@empresa.com',
          address: 'Av. Paulista, 456 - São Paulo/SP',
          role: 'Gerente de Operações',
          baseSalary: 5500.00,
          hireDate: new Date('2019-05-10'),
          status: 'Ativo'
        }
      }),
      prisma.employee.upsert({
        where: { id: 3 },
        update: {},
        create: {
          name: 'Roberto Santos',
          cpf: '456.789.123-00',
          phone: '(11) 77777-3333',
          email: 'roberto.santos@empresa.com',
          address: 'Rua da Consolação, 789 - São Paulo/SP',
          role: 'Motorista',
          baseSalary: 3200.00,
          hireDate: new Date('2021-01-20'),
          status: 'Ativo'
        }
      }),
      prisma.employee.upsert({
        where: { id: 4 },
        update: {},
        create: {
          name: 'Patricia Costa',
          cpf: '789.123.456-00',
          phone: '(11) 66666-4444',
          email: 'patricia.costa@empresa.com',
          address: 'Rua Augusta, 321 - São Paulo/SP',
          role: 'Auxiliar Administrativo',
          baseSalary: 2200.00,
          hireDate: new Date('2020-08-15'),
          status: 'Inativo'
        }
      }),
      prisma.employee.upsert({
        where: { id: 5 },
        update: {},
        create: {
          name: 'Marcos Oliveira',
          cpf: '321.654.987-00',
          phone: '(11) 55555-5555',
          email: 'marcos.oliveira@empresa.com',
          address: 'Rua Oscar Freire, 654 - São Paulo/SP',
          role: 'Motorista',
          baseSalary: 3800.00,
          hireDate: new Date('2019-12-01'),
          status: 'Ativo'
        }
      })
    ])

    // 3. Criar Caminhões
    console.log('🚛 Criando caminhões...')
    const trucks = await Promise.all([
      prisma.truck.upsert({
        where: { id: 1 },
        update: {},
        create: {
          plate: 'ABC-1234',
          model: 'Volvo FH 460',
          year: 2020,
          capacity: 25000,
          status: 'Ativo'
        }
      }),
      prisma.truck.upsert({
        where: { id: 2 },
        update: {},
        create: {
          plate: 'XYZ-5678',
          model: 'Scania R 450',
          year: 2019,
          capacity: 30000,
          status: 'Ativo'
        }
      }),
      prisma.truck.upsert({
        where: { id: 3 },
        update: {},
        create: {
          plate: 'DEF-9012',
          model: 'Mercedes Actros 2651',
          year: 2021,
          capacity: 28000,
          status: 'Ativo'
        }
      }),
      prisma.truck.upsert({
        where: { id: 4 },
        update: {},
        create: {
          plate: 'GHI-3456',
          model: 'Iveco Stralis 450',
          year: 2018,
          capacity: 26000,
          status: 'Inativo'
        }
      })
    ])

    // 4. Criar Cargas
    console.log('📦 Criando cargas...')
    const loads = await Promise.all([
      prisma.load.upsert({
        where: { id: 1 },
        update: {},
        create: {
          date: new Date('2024-01-15'),
          loadingNumber: 'CAR-001',
          deliveries: 'São Paulo - Rio de Janeiro',
          cargoWeight: 15000,
          totalValue: 2500.00,
          freight4: 200.00,
          totalFreight: 2700.00,
          closings: 'Entrega realizada com sucesso',
          observations: 'Carga frágil - manuseio cuidadoso',
          companyId: companies[0].id,
          truckId: trucks[0].id,
          status: 'Concluída'
        }
      }),
      prisma.load.upsert({
        where: { id: 2 },
        update: {},
        create: {
          date: new Date('2024-01-20'),
          loadingNumber: 'CAR-002',
          deliveries: 'São Paulo - Belo Horizonte',
          cargoWeight: 20000,
          totalValue: 3200.00,
          freight4: 250.00,
          totalFreight: 3450.00,
          closings: 'Em trânsito',
          observations: 'Carga perigosa - documentos em ordem',
          companyId: companies[1].id,
          truckId: trucks[1].id,
          status: 'Em Trânsito'
        }
      }),
      prisma.load.upsert({
        where: { id: 3 },
        update: {},
        create: {
          date: new Date('2024-01-25'),
          loadingNumber: 'CAR-003',
          deliveries: 'São Paulo - Brasília',
          cargoWeight: 18000,
          totalValue: 2800.00,
          freight4: 180.00,
          totalFreight: 2980.00,
          closings: 'Aguardando coleta',
          observations: 'Carga refrigerada',
          companyId: companies[2].id,
          truckId: trucks[2].id,
          status: 'Pendente'
        }
      }),
      prisma.load.upsert({
        where: { id: 4 },
        update: {},
        create: {
          date: new Date('2024-01-30'),
          loadingNumber: 'CAR-004',
          deliveries: 'São Paulo - Salvador',
          cargoWeight: 22000,
          totalValue: 4000.00,
          freight4: 300.00,
          totalFreight: 4300.00,
          closings: 'Entrega realizada',
          observations: 'Carga de alta prioridade',
          companyId: companies[0].id,
          truckId: trucks[0].id,
          status: 'Concluída'
        }
      })
    ])

    // 5. Criar Manutenções
    console.log('🔧 Criando manutenções...')
    const maintenances = await Promise.all([
      prisma.maintenance.upsert({
        where: { id: 1 },
        update: {},
        create: {
          description: 'Troca de óleo e filtros',
          date: new Date('2024-01-10'),
          value: 450.00,
          type: 'Preventiva',
          truckId: trucks[0].id
        }
      }),
      prisma.maintenance.upsert({
        where: { id: 2 },
        update: {},
        create: {
          description: 'Reparo no sistema de freios',
          date: new Date('2024-01-18'),
          value: 1200.00,
          type: 'Corretiva',
          truckId: trucks[1].id
        }
      }),
      prisma.maintenance.upsert({
        where: { id: 3 },
        update: {},
        create: {
          description: 'Revisão geral do motor',
          date: new Date('2024-01-22'),
          value: 2800.00,
          type: 'Preventiva',
          truckId: trucks[2].id
        }
      }),
      prisma.maintenance.upsert({
        where: { id: 4 },
        update: {},
        create: {
          description: 'Troca de pneus',
          date: new Date('2024-01-28'),
          value: 1800.00,
          type: 'Preventiva',
          truckId: trucks[0].id
        }
      })
    ])

    // 6. Criar Transações Financeiras
    console.log('💰 Criando transações financeiras...')
    const transactions = await Promise.all([
      prisma.transaction.upsert({
        where: { id: 1 },
        update: {},
        create: {
          date: new Date('2024-01-15'),
          type: 'Crédito',
          amount: 2700.00,
          description: 'Recebimento frete CAR-001',
          employeeId: employees[0].id
        }
      }),
      prisma.transaction.upsert({
        where: { id: 2 },
        update: {},
        create: {
          date: new Date('2024-01-16'),
          type: 'Débito',
          amount: 450.00,
          description: 'Manutenção preventiva - ABC-1234',
          employeeId: employees[1].id
        }
      }),
      prisma.transaction.upsert({
        where: { id: 3 },
        update: {},
        create: {
          date: new Date('2024-01-20'),
          type: 'Crédito',
          amount: 3450.00,
          description: 'Recebimento frete CAR-002',
          employeeId: employees[0].id
        }
      }),
      prisma.transaction.upsert({
        where: { id: 4 },
        update: {},
        create: {
          date: new Date('2024-01-18'),
          type: 'Débito',
          amount: 1200.00,
          description: 'Reparo sistema de freios - XYZ-5678',
          employeeId: employees[1].id
        }
      }),
      prisma.transaction.upsert({
        where: { id: 5 },
        update: {},
        create: {
          date: new Date('2024-01-25'),
          type: 'Crédito',
          amount: 2980.00,
          description: 'Recebimento frete CAR-003',
          employeeId: employees[2].id
        }
      }),
      prisma.transaction.upsert({
        where: { id: 6 },
        update: {},
        create: {
          date: new Date('2024-01-22'),
          type: 'Débito',
          amount: 2800.00,
          description: 'Revisão geral motor - DEF-9012',
          employeeId: employees[1].id
        }
      }),
      prisma.transaction.upsert({
        where: { id: 7 },
        update: {},
        create: {
          date: new Date('2024-01-30'),
          type: 'Crédito',
          amount: 4300.00,
          description: 'Recebimento frete CAR-004',
          employeeId: employees[0].id
        }
      }),
      prisma.transaction.upsert({
        where: { id: 8 },
        update: {},
        create: {
          date: new Date('2024-01-28'),
          type: 'Débito',
          amount: 1800.00,
          description: 'Troca de pneus - ABC-1234',
          employeeId: employees[1].id
        }
      })
    ])

    // 7. Criar Viagens
    console.log('🗺️ Criando viagens...')
    const trips = await Promise.all([
      prisma.trip.upsert({
        where: { id: 1 },
        update: {},
        create: {
          origin: 'São Paulo/SP',
          destination: 'Rio de Janeiro/RJ',
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-01-16'),
          status: 'Concluída',
          truckId: trucks[0].id,
          driverId: employees[0].id
        }
      }),
      prisma.trip.upsert({
        where: { id: 2 },
        update: {},
        create: {
          origin: 'São Paulo/SP',
          destination: 'Belo Horizonte/MG',
          startDate: new Date('2024-01-20'),
          endDate: null,
          status: 'Em Andamento',
          truckId: trucks[1].id,
          driverId: employees[2].id
        }
      }),
      prisma.trip.upsert({
        where: { id: 3 },
        update: {},
        create: {
          origin: 'São Paulo/SP',
          destination: 'Brasília/DF',
          startDate: new Date('2024-01-25'),
          endDate: null,
          status: 'Pendente',
          truckId: trucks[2].id,
          driverId: employees[4].id
        }
      }),
      prisma.trip.upsert({
        where: { id: 4 },
        update: {},
        create: {
          origin: 'São Paulo/SP',
          destination: 'Salvador/BA',
          startDate: new Date('2024-01-30'),
          endDate: new Date('2024-02-01'),
          status: 'Concluída',
          truckId: trucks[0].id,
          driverId: employees[0].id
        }
      })
    ])

    // 8. Criar Despesas das Viagens
    console.log('💸 Criando despesas das viagens...')
    const expenses = await Promise.all([
      prisma.expense.upsert({
        where: { id: 1 },
        update: {},
        create: {
          description: 'Combustível',
          amount: 350.00,
          date: new Date('2024-01-15'),
          tripId: trips[0].id
        }
      }),
      prisma.expense.upsert({
        where: { id: 2 },
        update: {},
        create: {
          description: 'Pedágio',
          amount: 120.00,
          date: new Date('2024-01-15'),
          tripId: trips[0].id
        }
      }),
      prisma.expense.upsert({
        where: { id: 3 },
        update: {},
        create: {
          description: 'Alimentação',
          amount: 80.00,
          date: new Date('2024-01-15'),
          tripId: trips[0].id
        }
      }),
      prisma.expense.upsert({
        where: { id: 4 },
        update: {},
        create: {
          description: 'Combustível',
          amount: 280.00,
          date: new Date('2024-01-20'),
          tripId: trips[1].id
        }
      }),
      prisma.expense.upsert({
        where: { id: 5 },
        update: {},
        create: {
          description: 'Pedágio',
          amount: 95.00,
          date: new Date('2024-01-20'),
          tripId: trips[1].id
        }
      })
    ])

    console.log('✅ Banco de dados populado com sucesso!')
    console.log(`📊 Dados criados:`)
    console.log(`   - ${companies.length} empresas`)
    console.log(`   - ${employees.length} funcionários`)
    console.log(`   - ${trucks.length} caminhões`)
    console.log(`   - ${loads.length} cargas`)
    console.log(`   - ${maintenances.length} manutenções`)
    console.log(`   - ${transactions.length} transações financeiras`)
    console.log(`   - ${trips.length} viagens`)
    console.log(`   - ${expenses.length} despesas`)

  } catch (error) {
    console.error('❌ Erro ao popular banco de dados:', error)
  } finally {
    await prisma.$disconnect()
  }
}

populateDatabase()
