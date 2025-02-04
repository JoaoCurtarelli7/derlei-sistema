import React from 'react'
import { Typography, Table, Card } from 'antd'

const { Title } = Typography

// Adicionando suporte para `ref` com React.forwardRef
const PrintableReport = React.forwardRef(({ title, sections }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#fff',
      }}
    >
      <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
        {title}
      </Title>
      {sections.map((section, index) => (
        <Card
          key={index}
          title={section.title}
          bordered
          style={{ marginBottom: '20px', borderColor: '#ddd' }}
        >
          <Table
            dataSource={section.data}
            columns={section.columns}
            pagination={false}
            size="small"
            style={{ border: '1px solid #ddd' }}
          />
        </Card>
      ))}
    </div>
  )
})

// Adicionando displayName para debugging
PrintableReport.displayName = 'PrintableReport'

export default PrintableReport
