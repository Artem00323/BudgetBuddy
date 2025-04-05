import React, { useState, useEffect } from 'react';
import { Card, Form, Row, Col, Table } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getInflationRate } from '../services/financeDataService';

function InflationCalculator({ purchaseCost }) {
  const [inflationRate, setInflationRate] = useState(getInflationRate()); // Используем актуальную инфляцию
  const [months, setMonths] = useState(12); // 12 месяцев по умолчанию
  
  // Обновление ставки инфляции при изменении в сервисе
  useEffect(() => {
    setInflationRate(getInflationRate());
  }, []);
  
  // Расчет стоимости с учетом инфляции
  const calculateInflationImpact = () => {
    const monthlyInflationRate = inflationRate / 100 / 12;
    
    return Array.from({ length: months }, (_, i) => {
      const monthlyInflation = Math.pow(1 + monthlyInflationRate, i);
      const inflatedCost = purchaseCost * monthlyInflation;
      const absoluteIncrease = inflatedCost - purchaseCost;
      const percentageIncrease = (monthlyInflation - 1) * 100;
      
      return {
        month: i + 1,
        inflatedCost: Math.round(inflatedCost),
        absoluteIncrease: Math.round(absoluteIncrease),
        percentageIncrease: Math.round(percentageIncrease * 100) / 100
      };
    });
  };
  
  const inflationData = calculateInflationImpact();
  
  // Преобразование данных для графика
  const chartData = inflationData.map((data) => ({
    month: `Месяц ${data.month}`,
    'Стоимость с учетом инфляции': data.inflatedCost,
    'Процент удорожания': data.percentageIncrease
  }));
  
  return (
    <Card className="mt-4">
      <Card.Header className="bg-warning text-white">
        <h5 className="mb-0">Расчет влияния инфляции</h5>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Годовая инфляция (%)</Form.Label>
              <Form.Control 
                type="number" 
                min="0"
                max="30"
                step="0.1"
                value={inflationRate} 
                onChange={(e) => setInflationRate(parseFloat(e.target.value) || 0)} 
              />
              <Form.Text className="text-muted">
                Текущий прогноз инфляции на 2024 год: {getInflationRate()}%
              </Form.Text>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Горизонт прогноза (месяцы)</Form.Label>
              <Form.Control 
                type="number" 
                min="1"
                max="60"
                value={months} 
                onChange={(e) => setMonths(parseInt(e.target.value) || 12)} 
              />
            </Form.Group>
          </Col>
        </Row>
        
        <div className="alert alert-warning mt-3">
          <div className="d-flex justify-content-between">
            <span>Текущая стоимость:</span>
            <strong>{Math.round(purchaseCost)} ₽</strong>
          </div>
          <div className="d-flex justify-content-between">
            <span>Стоимость через {months} мес.:</span>
            <strong>{inflationData[months-1]?.inflatedCost} ₽</strong>
          </div>
          <div className="d-flex justify-content-between">
            <span>Абсолютное удорожание:</span>
            <strong>{inflationData[months-1]?.absoluteIncrease} ₽</strong>
          </div>
          <div className="d-flex justify-content-between">
            <span>Процент удорожания:</span>
            <strong>{inflationData[months-1]?.percentageIncrease}%</strong>
          </div>
        </div>
        
        <h6 className="mt-4 mb-3">График влияния инфляции</h6>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="Стоимость с учетом инфляции" stroke="#8884d8" />
            <Line yAxisId="right" type="monotone" dataKey="Процент удорожания" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
        
        <h6 className="mt-4 mb-3">Детальная таблица изменения стоимости</h6>
        <div className="table-responsive">
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Месяц</th>
                <th>Стоимость с учетом инфляции</th>
                <th>Абсолютное удорожание</th>
                <th>Процент удорожания</th>
              </tr>
            </thead>
            <tbody>
              {inflationData.map((data) => (
                <tr key={data.month}>
                  <td>{data.month}</td>
                  <td>{data.inflatedCost} ₽</td>
                  <td>{data.absoluteIncrease} ₽</td>
                  <td>{data.percentageIncrease}%</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        
        <div className="mt-3 text-muted">
          <p><small>
            При годовой инфляции {inflationRate}% покупка будет дорожать примерно на {(inflationRate / 12).toFixed(2)}% в месяц. 
            Через {months} месяцев стоимость покупки вырастет на {inflationData[months-1]?.absoluteIncrease} ₽.
          </small></p>
          <p><small>
            Если вы планируете отложить покупку, учитывайте, что из-за инфляции она будет постепенно дорожать. 
            В некоторых случаях выгоднее совершить покупку сейчас, если ваш бюджет это позволяет.
          </small></p>
        </div>
      </Card.Body>
    </Card>
  );
}

export default InflationCalculator; 