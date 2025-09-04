const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Iniciando população do banco de dados...')

  try {
    // 1. Criar Empresas
    console.log('📊 Criando empresas...')
    const company1 = await prisma.company.upsert({
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
    })

    const company2 = await prisma.company.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: 'Logística XYZ S.A.',
        type: 'Logística',
        cnpj: '98.765.432/0001-11',
        dateRegistration: new Date('2019-03-20'),
        status: 'Ativo',
        responsible: 'Maria Santos',
        commission: 7.0
      }
    })

    const company3 = await prisma.company.upsert({
      where: { id: 3 },
      update: {},
      create: {
        name: 'Frete Rápido ME',
        type: 'Frete',
        cnpj: '11.222.333/0001-22',
        dateRegistration: new Date('2021-06-10'),
        status: 'Ativo',
        responsible: 'Pedro Costa',
        commission: 4.0
      }
    })

    // 2. Criar Funcionários
    console.log('👥 Criando funcionários...')
    const employee1 = await prisma.employee.upsert({
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
    })

    const employee2 = await prisma.employee.upsert({
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
    })

    const employee3 = await prisma.employee.upsert({
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
    })

    // 3. Criar Caminhões
    console.log('🚛 Criando caminhões...')
    const truck1 = await prisma.truck.upsert({
      where: { id: 1 },
      update: {},
      create: {
        plate: 'ABC-1234',
        model: 'Volvo FH 460',
        year: 2020,
        capacity: 25000,
        status: 'Ativo'
      }
    })

    const truck2 = await prisma.truck.upsert({
      where: { id: 2 },
      update: {},
      create: {
        plate: 'XYZ-5678',
        model: 'Scania R 450',
        year: 2019,
        capacity: 30000,
        status: 'Ativo'
      }
    })

    // 4. Criar Cargas
    console.log('📦 Criando cargas...')
    const load1 = await prisma.load.upsert({
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
        companyId: company1.id,
        truckId: truck1.id,
        status: 'Concluída'
      }
    })

    const load2 = await prisma.load.upsert({
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
        companyId: company2.id,
        truckId: truck2.id,
        status: 'Em Trânsito'
      }
    })

    // 5. Criar Manutenções
    console.log('🔧 Criando manutenções...')
    const maintenance1 = await prisma.maintenance.upsert({
      where: { id: 1 },
      update: {},
      create: {
        description: 'Troca de óleo e filtros',
        date: new Date('2024-01-10'),
        value: 450.00,
        type: 'Preventiva',
        truckId: truck1.id
      }
    })

    const maintenance2 = await prisma.maintenance.upsert({
      where: { id: 2 },
      update: {},
      create: {
        description: 'Reparo no sistema de freios',
        date: new Date('2024-01-18'),
        value: 1200.00,
        type: 'Corretiva',
        truckId: truck2.id
      }
    })

    // 6. Criar Transações Financeiras
    console.log('💰 Criando transações financeiras...')
    const transaction1 = await prisma.transaction.upsert({
      where: { id: 1 },
      update: {},
      create: {
        date: new Date('2024-01-15'),
        type: 'Crédito',
        amount: 2700.00,
        description: 'Recebimento frete CAR-001',
        employeeId: employee1.id
      }
    })

    const transaction2 = await prisma.transaction.upsert({
      where: { id: 2 },
      update: {},
      create: {
        date: new Date('2024-01-16'),
        type: 'Débito',
        amount: 450.00,
        description: 'Manutenção preventiva - ABC-1234',
        employeeId: employee2.id
      }
    })

    const transaction3 = await prisma.transaction.upsert({
      where: { id: 3 },
      update: {},
      create: {
        date: new Date('2024-01-20'),
        type: 'Crédito',
        amount: 3450.00,
        description: 'Recebimento frete CAR-002',
        employeeId: employee1.id
      }
    })

    // 7. Criar Viagens
    console.log('🗺️ Criando viagens...')
    const trip1 = await prisma.trip.upsert({
      where: { id: 1 },
      update: {},
      create: {
        origin: 'São Paulo/SP',
        destination: 'Rio de Janeiro/RJ',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-16'),
        status: 'Concluída',
        truckId: truck1.id,
        driverId: employee1.id
      }
    })

    const trip2 = await prisma.trip.upsert({
      where: { id: 2 },
      update: {},
      create: {
        origin: 'São Paulo/SP',
        destination: 'Belo Horizonte/MG',
        startDate: new Date('2024-01-20'),
        endDate: null,
        status: 'Em Andamento',
        truckId: truck2.id,
        driverId: employee3.id
      }
    })

    // 8. Criar Despesas das Viagens
    console.log('💸 Criando despesas das viagens...')
    const expense1 = await prisma.expense.upsert({
      where: { id: 1 },
      update: {},
      create: {
        description: 'Combustível',
        amount: 350.00,
        date: new Date('2024-01-15'),
        tripId: trip1.id
      }
    })

    const expense2 = await prisma.expense.upsert({
      where: { id: 2 },
      update: {},
      create: {
        description: 'Pedágio',
        amount: 120.00,
        date: new Date('2024-01-15'),
        tripId: trip1.id
      }
    })

    console.log('✅ Banco de dados populado com sucesso!')
    console.log(`📊 Dados criados:`)
    console.log(`   - 3 empresas`)
    console.log(`   - 3 funcionários`)
    console.log(`   - 2 caminhões`)
    console.log(`   - 2 cargas`)
    console.log(`   - 2 manutenções`)
    console.log(`   - 3 transações financeiras`)
    console.log(`   - 2 viagens`)
    console.log(`   - 2 despesas`)

  } catch (error) {
    console.error('❌ Erro ao popular banco de dados:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
