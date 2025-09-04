import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middlewares/authMiddleware";

export async function reportRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authenticate);

  // Relatório geral do sistema
  app.get("/reports/system-overview", async (req, rep) => {
    try {
      const [
        totalEmployees,
        activeEmployees,
        totalCompanies,
        activeCompanies,
        totalLoads,
        totalTrucks,
        totalMaintenance,
        totalTransactions
      ] = await Promise.all([
        prisma.employee.count(),
        prisma.employee.count({ where: { status: "Ativo" } }),
        prisma.company.count(),
        prisma.company.count({ where: { status: "Ativo" } }),
        prisma.load.count(),
        prisma.truck.count(),
        prisma.maintenance.count(),
        prisma.transaction.count()
      ]);

      return rep.send({
        summary: {
          totalEmployees,
          activeEmployees,
          inactiveEmployees: totalEmployees - activeEmployees,
          totalCompanies,
          activeCompanies,
          inactiveCompanies: totalCompanies - activeCompanies,
          totalLoads,
          totalTrucks,
          totalMaintenance,
          totalTransactions
        },
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Erro ao gerar relatório geral:", error);
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  // Relatório de funcionários
  app.get("/reports/employees", async (req, rep) => {
    try {
      const { status, startDate, endDate } = req.query;

      let whereClause: any = {};

      if (status && status !== 'todos') {
        whereClause.status = status;
      }

      if (startDate && endDate) {
        whereClause.hireDate = {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string)
        };
      }

      const employees = await prisma.employee.findMany({
        where: whereClause,
        include: {
          transactions: {
            orderBy: { date: 'desc' },
            take: 5
          }
        },
        orderBy: { name: 'asc' }
      });

      const totalSalary = employees
        .filter(emp => emp.status === 'Ativo')
        .reduce((sum, emp) => sum + emp.baseSalary, 0);

      return rep.send({
        employees,
        summary: {
          total: employees.length,
          active: employees.filter(emp => emp.status === 'Ativo').length,
          inactive: employees.filter(emp => emp.status === 'Inativo').length,
          totalSalary
        },
        filters: { status, startDate, endDate },
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Erro ao gerar relatório de funcionários:", error);
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  // Relatório de empresas
  app.get("/reports/companies", async (req, rep) => {
    try {
      const { status, startDate, endDate } = req.query;

      let whereClause: any = {};

      if (status && status !== 'todos') {
        whereClause.status = status;
      }

      if (startDate && endDate) {
        whereClause.createdAt = {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string)
        };
      }

      const companies = await prisma.company.findMany({
        where: whereClause,
        include: {
          loads: {
            orderBy: { createdAt: 'desc' },
            take: 3
          }
        },
        orderBy: { name: 'asc' }
      });

      return rep.send({
        companies,
        summary: {
          total: companies.length,
          active: companies.filter(comp => comp.status === 'Ativo').length,
          inactive: companies.filter(comp => comp.status === 'Inativo').length
        },
        filters: { status, startDate, endDate },
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Erro ao gerar relatório de empresas:", error);
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  // Relatório de cargas
  app.get("/reports/loads", async (req, rep) => {
    try {
      const { status, startDate, endDate, companyId } = req.query;

      let whereClause: any = {};

      if (status && status !== 'todos') {
        whereClause.status = status;
      }

      if (companyId && companyId !== 'todos') {
        whereClause.companyId = parseInt(companyId as string);
      }

      if (startDate && endDate) {
        whereClause.createdAt = {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string)
        };
      }

      const loads = await prisma.load.findMany({
        where: whereClause,
        include: {
          company: true,
          truck: true
        },
        orderBy: { createdAt: 'desc' }
      });

      const totalValue = loads.reduce((sum, load) => sum + (load.value || 0), 0);

      return rep.send({
        loads,
        summary: {
          total: loads.length,
          totalValue,
          byStatus: loads.reduce((acc, load) => {
            acc[load.status] = (acc[load.status] || 0) + 1;
            return acc;
          }, {} as any)
        },
        filters: { status, startDate, endDate, companyId },
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Erro ao gerar relatório de cargas:", error);
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  // Relatório de manutenções
  app.get("/reports/maintenance", async (req, rep) => {
    try {
      const { startDate, endDate, truckId } = req.query;

      let whereClause: any = {};

      if (truckId && truckId !== 'todos') {
        whereClause.truckId = parseInt(truckId as string);
      }

      if (startDate && endDate) {
        whereClause.date = {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string)
        };
      }

      const maintenance = await prisma.maintenance.findMany({
        where: whereClause,
        include: {
          truck: true
        },
        orderBy: { date: 'desc' }
      });

      const totalCost = maintenance.reduce((sum, maint) => sum + (maint.value || 0), 0);

      return rep.send({
        maintenance,
        summary: {
          total: maintenance.length,
          totalCost,
          averageCost: maintenance.length > 0 ? totalCost / maintenance.length : 0
        },
        filters: { startDate, endDate, truckId },
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Erro ao gerar relatório de manutenções:", error);
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  // Relatório financeiro
  app.get("/reports/financial", async (req, rep) => {
    try {
      const { startDate, endDate, type } = req.query;

      let whereClause: any = {};

      if (type && type !== 'todos') {
        whereClause.type = type;
      }

      if (startDate && endDate) {
        whereClause.date = {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string)
        };
      }

      const transactions = await prisma.transaction.findMany({
        where: whereClause,
        include: {
          employee: true
        },
        orderBy: { date: 'desc' }
      });

      const totalCredits = transactions
        .filter(t => t.type === 'Crédito')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const totalDebits = transactions
        .filter(t => t.type === 'Débito')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const balance = totalCredits - totalDebits;

      return rep.send({
        transactions,
        summary: {
          total: transactions.length,
          totalCredits,
          totalDebits,
          balance,
          byType: transactions.reduce((acc, t) => {
            acc[t.type] = (acc[t.type] || 0) + 1;
            return acc;
          }, {} as any)
        },
        filters: { startDate, endDate, type },
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Erro ao gerar relatório financeiro:", error);
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  // Relatório de viagens
  app.get("/reports/trips", async (req, rep) => {
    try {
      const { startDate, endDate, truckId, status } = req.query;

      let whereClause: any = {};

      if (status && status !== 'todos') {
        whereClause.status = status;
      }

      if (truckId && truckId !== 'todos') {
        whereClause.truckId = parseInt(truckId as string);
      }

      if (startDate && endDate) {
        whereClause.startDate = {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string)
        };
      }

      const trips = await prisma.trip.findMany({
        where: whereClause,
        include: {
          truck: true,
          driver: true,
          expenses: {
            orderBy: { date: 'desc' }
          }
        },
        orderBy: { startDate: 'desc' }
      });

      const totalExpenses = trips.reduce((sum, trip) => {
        return sum + trip.expenses.reduce((expSum, exp) => expSum + (exp.amount || 0), 0);
      }, 0);

      return rep.send({
        trips,
        summary: {
          total: trips.length,
          totalExpenses,
          byStatus: trips.reduce((acc, trip) => {
            acc[trip.status] = (acc[trip.status] || 0) + 1;
            return acc;
          }, {} as any)
        },
        filters: { startDate, endDate, truckId, status },
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Erro ao gerar relatório de viagens:", error);
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  // Relatório personalizado com múltiplos filtros
  app.post("/reports/custom", async (req, rep) => {
    try {
      const { 
        reportType, 
        filters, 
        startDate, 
        endDate, 
        groupBy,
        sortBy,
        limit 
      } = req.body;

      let result: any = {};

      switch (reportType) {
        case 'employees':
          result = await generateEmployeeReport(filters, startDate, endDate, groupBy, sortBy, limit);
          break;
        case 'financial':
          result = await generateFinancialReport(filters, startDate, endDate, groupBy, sortBy, limit);
          break;
        case 'operations':
          result = await generateOperationsReport(filters, startDate, endDate, groupBy, sortBy, limit);
          break;
        default:
          return rep.code(400).send({ message: "Tipo de relatório não suportado" });
      }

      return rep.send({
        ...result,
        filters: { reportType, filters, startDate, endDate, groupBy, sortBy, limit },
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Erro ao gerar relatório personalizado:", error);
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  // Exportar relatório em diferentes formatos
  app.get("/reports/export/:format", async (req, rep) => {
    try {
      const { format } = req.params;
      const { reportType, ...filters } = req.query;

      if (!['csv', 'pdf', 'excel'].includes(format)) {
        return rep.code(400).send({ message: "Formato não suportado" });
      }

      let reportData: any = {};

      // Gerar dados baseado no tipo de relatório
      switch (reportType) {
        case 'employees':
          reportData = await generateEmployeeReport(filters, filters.startDate, filters.endDate, '', '', 0);
          break;
        case 'companies':
          const companies = await prisma.company.findMany({
            where: buildWhereClause(filters),
            include: { loads: true }
          });
          reportData = { data: companies };
          break;
        case 'loads':
          const loads = await prisma.load.findMany({
            where: buildWhereClause(filters),
            include: { company: true, truck: true }
          });
          reportData = { data: loads };
          break;
        case 'maintenance':
          const maintenance = await prisma.maintenance.findMany({
            where: buildWhereClause(filters),
            include: { truck: true }
          });
          reportData = { data: maintenance };
          break;
        case 'financial':
          reportData = await generateFinancialReport(filters, filters.startDate, filters.endDate, '', '', 0);
          break;
        case 'trips':
          const trips = await prisma.trip.findMany({
            where: buildWhereClause(filters),
            include: { truck: true, driver: true, expenses: true }
          });
          reportData = { data: trips };
          break;
        default:
          return rep.code(400).send({ message: "Tipo de relatório não suportado" });
      }

      return rep.send({
        message: `Relatório ${reportType} preparado para exportação em ${format.toUpperCase()}`,
        data: reportData.data || reportData,
        format,
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Erro ao exportar relatório:", error);
      return rep.code(500).send({ message: "Erro interno do servidor" });
    }
  });
}

// Funções auxiliares para relatórios
async function generateEmployeeReport(filters: any, startDate: string, endDate: string, groupBy: string, sortBy: string, limit: number) {
  let whereClause: any = {};

  if (filters?.status && filters.status !== 'todos') {
    whereClause.status = filters.status;
  }

  if (startDate && endDate) {
    whereClause.hireDate = {
      gte: new Date(startDate),
      lte: new Date(endDate)
    };
  }

  const employees = await prisma.employee.findMany({
    where: whereClause,
    orderBy: { [sortBy || 'name']: 'asc' },
    take: limit || undefined
  });

  return {
    data: employees,
    summary: {
      total: employees.length,
      byStatus: employees.reduce((acc, emp) => {
        acc[emp.status] = (acc[emp.status] || 0) + 1;
        return acc;
      }, {} as any)
    }
  };
}

async function generateFinancialReport(filters: any, startDate: string, endDate: string, groupBy: string, sortBy: string, limit: number) {
  let whereClause: any = {};

  if (filters?.type && filters.type !== 'todos') {
    whereClause.type = filters.type;
  }

  if (startDate && endDate) {
    whereClause.date = {
      gte: new Date(startDate),
      lte: new Date(endDate)
    };
  }

  const transactions = await prisma.transaction.findMany({
    where: whereClause,
    orderBy: { [sortBy || 'date']: 'desc' },
    take: limit || undefined
  });

  return {
    data: transactions,
    summary: {
      total: transactions.length,
      totalAmount: transactions.reduce((sum, t) => sum + (t.amount || 0), 0)
    }
  };
}

async function generateOperationsReport(filters: any, startDate: string, endDate: string, groupBy: string, sortBy: string, limit: number) {
  const [loads, maintenance, trips] = await Promise.all([
    prisma.load.findMany({
      where: startDate && endDate ? {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      } : {},
      take: limit || undefined
    }),
    prisma.maintenance.findMany({
      where: startDate && endDate ? {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      } : {},
      take: limit || undefined
    }),
    prisma.trip.findMany({
      where: startDate && endDate ? {
        startDate: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      } : {},
      take: limit || undefined
    })
  ]);

  return {
    data: { loads, maintenance, trips },
    summary: {
      totalLoads: loads.length,
      totalMaintenance: maintenance.length,
      totalTrips: trips.length
    }
  };
}

async function generateReportData(reportType: string, filters: any) {
  // Implementar geração de dados para exportação
  return { message: "Função de exportação em desenvolvimento" };
}

// Função auxiliar para construir cláusula WHERE
function buildWhereClause(filters: any) {
  let whereClause: any = {};

  if (filters?.status && filters.status !== 'todos') {
    whereClause.status = filters.status;
  }

  if (filters?.type && filters.type !== 'todos') {
    whereClause.type = filters.type;
  }

  if (filters?.companyId && filters.companyId !== 'todos') {
    whereClause.companyId = parseInt(filters.companyId);
  }

  if (filters?.truckId && filters.truckId !== 'todos') {
    whereClause.truckId = parseInt(filters.truckId);
  }

  if (filters?.startDate && filters?.endDate) {
    const dateField = filters.reportType === 'employees' ? 'hireDate' : 
                     filters.reportType === 'financial' ? 'date' :
                     filters.reportType === 'maintenance' ? 'date' :
                     filters.reportType === 'trips' ? 'startDate' : 'createdAt';
    
    whereClause[dateField] = {
      gte: new Date(filters.startDate),
      lte: new Date(filters.endDate)
    };
  }

  return whereClause;
}
