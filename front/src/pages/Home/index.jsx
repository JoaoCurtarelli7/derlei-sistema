import { Col, Row } from 'antd'
import Chart from 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { useEffect, useRef, useState } from 'react'
import image from '../../components/assets/image3.png'
import api from '../../lib/api'
import './styles.less'

export default function Home() {
  const chartRef = useRef(null)
  const chartRefDonor = useRef(null)

  const [donor, setDonor] = useState([])
  const [donatary, setDonatary] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [donorResponse, donataryResponse] = await Promise.all([
          api.get('/donor'),
          api.get('/donatary'),
        ])

        setDonor(donorResponse.data)
        setDonatary(donataryResponse.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (donor.length > 0 || donatary.length > 0) {
      const data = {
        labels: ['Doadores', 'Donatário'],
        datasets: [
          {
            data: [donor.length, donatary.length],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
            borderWidth: 1,
          },
        ],
      }

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            formatter: (value) => {
              return value || ''
            },
            color: 'black',
            anchor: 'end',
            align: 'start',
            offset: 8,
          },
        },
      }

      const ctx = chartRefDonor.current.getContext('2d')
      const newChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data,
        options,
        plugins: [ChartDataLabels],
      })

      return () => {
        newChartInstance.destroy()
      }
    }
  }, [donor.length, donatary.length])

  return (
    <div>
      <Row className="image">
        <img
          className="style-image"
          src={image}
          alt=""
          height="350"
          width="80%"
        />
      </Row>

      <div className="title">
        <span className="text-title">Dashboard do Sistema</span>
      </div>

      <Row gutter={[20, 16]} className="quadrados">
        <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="quadrado">
            <canvas ref={chartRef} width={200} height={200}></canvas>
          </div>
        </Col>

        <Col
          span={12}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div className="quadrado">
            <canvas ref={chartRefDonor} width={200} height={200}></canvas>
          </div>
        </Col>
      </Row>
    </div>
  )
}
