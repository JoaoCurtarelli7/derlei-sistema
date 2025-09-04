import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import dayjs from 'dayjs'

// Função para exportar relatório em PDF
export const exportToPDF = (data, columns, title, filename) => {
  try {
    const doc = new jsPDF()
    
    // Cabeçalho do documento
    doc.setFontSize(20)
    doc.text(title, 14, 22)
    
    // Informações do relatório
    doc.setFontSize(10)
    doc.text(`Gerado em: ${dayjs().format('DD/MM/YYYY HH:mm')}`, 14, 30)
    doc.text(`Total de registros: ${data ? data.length : 0}`, 14, 35)
    
    // Verificar se há dados
    if (!data || data.length === 0) {
      doc.setFontSize(12)
      doc.text('Nenhum dado encontrado para este relatório.', 14, 50)
    } else {
      // Preparar dados para a tabela
      const tableData = data.map(item => {
        return columns.map(col => {
          try {
            if (col.render && typeof col.render === 'function') {
              // Para colunas com render customizado, extrair o valor
              const element = col.render(item[col.dataIndex], item)
              if (typeof element === 'string') {
                return element
              } else if (element && element.props && element.props.children) {
                return element.props.children
              }
              return item[col.dataIndex] || ''
            }
            return item[col.dataIndex] || ''
          } catch (error) {
            console.warn('Erro ao processar coluna:', col.title, error)
            return item[col.dataIndex] || ''
          }
        })
      })
      
      const tableColumns = columns.map(col => col.title)
      
      // Adicionar tabela
      doc.autoTable({
        head: [tableColumns],
        body: tableData,
        startY: 45,
        styles: {
          fontSize: 8,
          cellPadding: 3
        },
        headStyles: {
          fillColor: [24, 144, 255],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        margin: { top: 45 }
      })
    }
    
    // Rodapé
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 60
    doc.setFontSize(8)
    doc.text('Sistema Derlei - Relatórios', 14, finalY)
    doc.text(`Página ${doc.internal.getNumberOfPages()}`, 180, finalY)
    
    // Salvar arquivo
    doc.save(`${filename}_${dayjs().format('YYYY-MM-DD_HH-mm')}.pdf`)
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    throw new Error('Erro ao gerar arquivo PDF')
  }
}

// Função para exportar relatório em Excel
export const exportToExcel = (data, columns, title, filename) => {
  try {
    // Verificar se há dados
    if (!data || data.length === 0) {
      // Criar workbook com mensagem de "sem dados"
      const wb = XLSX.utils.book_new()
      const infoData = [
        ['Relatório:', title],
        ['Gerado em:', dayjs().format('DD/MM/YYYY HH:mm')],
        ['Total de registros:', 0],
        [''],
        ['Status:', 'Nenhum dado encontrado para este relatório.']
      ]
      
      const infoSheet = XLSX.utils.aoa_to_sheet(infoData)
      XLSX.utils.book_append_sheet(wb, infoSheet, 'Informações')
      
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      
      saveAs(blob, `${filename}_${dayjs().format('YYYY-MM-DD_HH-mm')}.xlsx`)
      return
    }

    // Preparar dados para o Excel
    const excelData = data.map(item => {
      const row = {}
      columns.forEach(col => {
        try {
          if (col.render && typeof col.render === 'function') {
            // Para colunas com render customizado, extrair o valor
            const element = col.render(item[col.dataIndex], item)
            if (typeof element === 'string') {
              row[col.title] = element
            } else if (element && element.props && element.props.children) {
              row[col.title] = element.props.children
            } else {
              row[col.title] = item[col.dataIndex] || ''
            }
          } else {
            row[col.title] = item[col.dataIndex] || ''
          }
        } catch (error) {
          console.warn('Erro ao processar coluna:', col.title, error)
          row[col.title] = item[col.dataIndex] || ''
        }
      })
      return row
    })
    
    // Criar workbook
    const wb = XLSX.utils.book_new()
    
    // Adicionar informações do relatório
    const infoData = [
      ['Relatório:', title],
      ['Gerado em:', dayjs().format('DD/MM/YYYY HH:mm')],
      ['Total de registros:', data.length],
      [''],
      ['Dados do Relatório:']
    ]
    
    const infoSheet = XLSX.utils.aoa_to_sheet(infoData)
    XLSX.utils.book_append_sheet(wb, infoSheet, 'Informações')
    
    // Adicionar dados principais
    const dataSheet = XLSX.utils.json_to_sheet(excelData)
    
    // Ajustar largura das colunas
    const colWidths = columns.map(() => ({ wch: 20 }))
    dataSheet['!cols'] = colWidths
    
    XLSX.utils.book_append_sheet(wb, dataSheet, 'Dados')
    
    // Gerar arquivo Excel
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    
    saveAs(blob, `${filename}_${dayjs().format('YYYY-MM-DD_HH-mm')}.xlsx`)
  } catch (error) {
    console.error('Erro ao gerar Excel:', error)
    throw new Error('Erro ao gerar arquivo Excel')
  }
}

// Função para exportar relatório de funcionários
export const exportEmployeeReport = (data, format) => {
  const columns = [
    { title: 'Nome', dataIndex: 'name' },
    { title: 'CPF', dataIndex: 'cpf' },
    { title: 'Cargo', dataIndex: 'role' },
    { title: 'Status', dataIndex: 'status', 
      render: (status) => status || 'N/A' },
    { title: 'Salário Base', dataIndex: 'baseSalary',
      render: (value) => {
        try {
          return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(value || 0)
        } catch (error) {
          return 'R$ 0,00'
        }
      } },
    { title: 'Data Contratação', dataIndex: 'hireDate',
      render: (date) => {
        try {
          return date ? dayjs(date).format('DD/MM/YYYY') : 'N/A'
        } catch (error) {
          return 'N/A'
        }
      } }
  ]
  
  if (format === 'pdf') {
    exportToPDF(data, columns, 'Relatório de Funcionários', 'funcionarios')
  } else if (format === 'excel') {
    exportToExcel(data, columns, 'Relatório de Funcionários', 'funcionarios')
  }
}

// Função para exportar relatório de empresas
export const exportCompanyReport = (data, format) => {
  const columns = [
    { title: 'Nome', dataIndex: 'name' },
    { title: 'CNPJ', dataIndex: 'cnpj' },
    { title: 'Status', dataIndex: 'status',
      render: (status) => status },
    { title: 'Cargas', dataIndex: 'loads',
      render: (loads) => loads?.length || 0 },
    { title: 'Data Criação', dataIndex: 'createdAt',
      render: (date) => dayjs(date).format('DD/MM/YYYY') }
  ]
  
  if (format === 'pdf') {
    exportToPDF(data, columns, 'Relatório de Empresas', 'empresas')
  } else if (format === 'excel') {
    exportToExcel(data, columns, 'Relatório de Empresas', 'empresas')
  }
}

// Função para exportar relatório de cargas
export const exportLoadsReport = (data, format) => {
  const columns = [
    { title: 'Descrição', dataIndex: 'description' },
    { title: 'Empresa', dataIndex: ['company', 'name'] },
    { title: 'Caminhão', dataIndex: ['truck', 'plate'] },
    { title: 'Status', dataIndex: 'status',
      render: (status) => status },
    { title: 'Valor', dataIndex: 'value',
      render: (value) => new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value || 0) },
    { title: 'Data Criação', dataIndex: 'createdAt',
      render: (date) => dayjs(date).format('DD/MM/YYYY') }
  ]
  
  if (format === 'pdf') {
    exportToPDF(data, columns, 'Relatório de Cargas', 'cargas')
  } else if (format === 'excel') {
    exportToExcel(data, columns, 'Relatório de Cargas', 'cargas')
  }
}

// Função para exportar relatório de manutenções
export const exportMaintenanceReport = (data, format) => {
  const columns = [
    { title: 'Descrição', dataIndex: 'description' },
    { title: 'Caminhão', dataIndex: ['truck', 'plate'] },
    { title: 'Data', dataIndex: 'date',
      render: (date) => dayjs(date).format('DD/MM/YYYY') },
    { title: 'Valor', dataIndex: 'value',
      render: (value) => new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value || 0) },
    { title: 'Tipo', dataIndex: 'type' }
  ]
  
  if (format === 'pdf') {
    exportToPDF(data, columns, 'Relatório de Manutenções', 'manutencoes')
  } else if (format === 'excel') {
    exportToExcel(data, columns, 'Relatório de Manutenções', 'manutencoes')
  }
}

// Função para exportar relatório financeiro
export const exportFinancialReport = (data, format) => {
  const columns = [
    { title: 'Data', dataIndex: 'date',
      render: (date) => dayjs(date).format('DD/MM/YYYY') },
    { title: 'Tipo', dataIndex: 'type',
      render: (type) => type },
    { title: 'Valor', dataIndex: 'amount',
      render: (value) => new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value || 0) },
    { title: 'Funcionário', dataIndex: ['employee', 'name'] },
    { title: 'Descrição', dataIndex: 'description' }
  ]
  
  if (format === 'pdf') {
    exportToPDF(data, columns, 'Relatório Financeiro', 'financeiro')
  } else if (format === 'excel') {
    exportToExcel(data, columns, 'Relatório Financeiro', 'financeiro')
  }
}

// Função para exportar relatório de viagens
export const exportTripsReport = (data, format) => {
  const columns = [
    { title: 'Origem', dataIndex: 'origin' },
    { title: 'Destino', dataIndex: 'destination' },
    { title: 'Caminhão', dataIndex: ['truck', 'plate'] },
    { title: 'Motorista', dataIndex: ['driver', 'name'] },
    { title: 'Status', dataIndex: 'status',
      render: (status) => status },
    { title: 'Data Início', dataIndex: 'startDate',
      render: (date) => dayjs(date).format('DD/MM/YYYY') }
  ]
  
  if (format === 'pdf') {
    exportToPDF(data, columns, 'Relatório de Viagens', 'viagens')
  } else if (format === 'excel') {
    exportToExcel(data, columns, 'Relatório de Viagens', 'viagens')
  }
}
