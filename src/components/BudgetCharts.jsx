import React, { useEffect, useState } from 'react';
import { Card, Form, Row, Col, ButtonGroup, ToggleButton } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getConsumerCreditRate, calculateAnnuityPayment, getInflationRate } from '../services/financeDataService';

function BudgetCharts({ balance, mandatoryExpenses, purchaseCost, remainingBudget, salary, selectedPaymentType, setSelectedPaymentType }) {
  const [forecastMonths, setForecastMonths] = useState(12);
  const [creditMonths, setCreditMonths] = useState(12);
  const [installmentMonths, setInstallmentMonths] = useState(6);
  const [creditRate, setCreditRate] = useState(getConsumerCreditRate());
  const [inflationRate, setInflationRate] = useState(getInflationRate());
  
  // Расчет общей суммы обязательных расходов
  const totalMandatoryExpenses = mandatoryExpenses.reduce(
    (total, expense) => total + parseFloat(expense.amount), 0
  );
  
  // Расчет ежемесячного платежа по кредиту
  const creditMonthlyPayment = calculateAnnuityPayment(purchaseCost, creditRate, creditMonths);
  
  // Расчет ежемесячного платежа по рассрочке
  const installmentMonthlyPayment = purchaseCost / installmentMonths;
  
  // Расчет прогноза бюджета на выбранное количество месяцев
  const calculateForecast = () => {
    const monthlyInflationRate = inflationRate / 100 / 12;
    
    // Расчет ежемесячных платежей в зависимости от выбранного способа оплаты
    let monthlyPayments = Array(forecastMonths).fill(0);
    let initialBalanceChange = 0;
    
    if (selectedPaymentType === 'immediate') {
      // При немедленной оплате баланс уменьшается сразу
      initialBalanceChange = -purchaseCost;
    } else if (selectedPaymentType === 'credit') {
      // При кредите платежи равномерны на протяжении срока кредита
      for (let i = 0; i < Math.min(forecastMonths, creditMonths); i++) {
        monthlyPayments[i] = -creditMonthlyPayment;
      }
    } else if (selectedPaymentType === 'installment') {
      // При рассрочке платежи равномерны на протяжении срока рассрочки
      for (let i = 0; i < Math.min(forecastMonths, installmentMonths); i++) {
        monthlyPayments[i] = -installmentMonthlyPayment;
      }
    }
    
    // Расчет прогноза для выбранного метода оплаты
    const forecastData = [];
    let currentBalance = balance + initialBalanceChange;
    let inflationFactor = 1;
    
    for (let i = 0; i < forecastMonths; i++) {
      inflationFactor *= (1 + monthlyInflationRate);
      
      // Расчет баланса с учетом зарплаты, обязательных расходов и платежей по кредиту/рассрочке
      currentBalance += salary - (totalMandatoryExpenses * inflationFactor) + monthlyPayments[i];
      
      forecastData.push({
        month: i + 1,
        'Прогноз баланса': Math.max(0, Math.round(currentBalance)),
        'Доход': Math.round(salary),
        'Расходы': Math.round(totalMandatoryExpenses * inflationFactor),
        'Платежи по кредиту/рассрочке': Math.abs(Math.round(monthlyPayments[i])) || 0
      });
    }
    
    return forecastData;
  };
  
  // Получение названия метода оплаты для отображения
  const getPaymentMethodName = () => {
    switch (selectedPaymentType) {
      case 'immediate': return 'оплата сразу';
      case 'credit': return `кредит на ${creditMonths} мес.`;
      case 'installment': return `рассрочка на ${installmentMonths} мес.`;
      default: return '';
    }
  };
  
  const forecastData = calculateForecast();
  
  // Варианты способов оплаты
  const paymentOptions = [
    { name: 'Оплата сразу', value: 'immediate' },
    { name: 'Рассрочка', value: 'installment' },
    { name: 'Кредит', value: 'credit' },
  ];
  
  return (
    <Card className="mt-4">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Прогноз бюджета</h5>
      </Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Горизонт прогноза (месяцы)</Form.Label>
              <Form.Control 
                type="number" 
                min="3"
                max="60"
                value={forecastMonths} 
                onChange={(e) => setForecastMonths(parseInt(e.target.value) || 12)} 
              />
            </Form.Group>
          </Col>
          <Col md={8}>
            <Form.Label>Способ оплаты покупки</Form.Label>
            <div>
              <ButtonGroup className="w-100">
                {paymentOptions.map((option, idx) => (
                  <ToggleButton
                    key={idx}
                    id={`radio-${idx}`}
                    type="radio"
                    variant="outline-primary"
                    name="payment-option"
                    value={option.value}
                    checked={selectedPaymentType === option.value}
                    onChange={(e) => setSelectedPaymentType(e.currentTarget.value)}
                  >
                    {option.name}
                  </ToggleButton>
                ))}
              </ButtonGroup>
            </div>
          </Col>
        </Row>
        
        {selectedPaymentType === 'credit' && (
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Срок кредита (месяцы)</Form.Label>
                <Form.Control 
                  type="number" 
                  min="3"
                  max="60"
                  value={creditMonths} 
                  onChange={(e) => setCreditMonths(parseInt(e.target.value) || 12)} 
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Процентная ставка (%)</Form.Label>
                <Form.Control 
                  type="number" 
                  min="5"
                  max="30"
                  step="0.1"
                  value={creditRate} 
                  onChange={(e) => setCreditRate(parseFloat(e.target.value) || getConsumerCreditRate())} 
                />
                <Form.Text className="text-muted">
                  Ежемесячный платеж: {Math.round(creditMonthlyPayment)} ₽
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
        )}
        
        {selectedPaymentType === 'installment' && (
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Срок рассрочки (месяцы)</Form.Label>
                <Form.Control 
                  type="number" 
                  min="1"
                  max="36"
                  value={installmentMonths} 
                  onChange={(e) => setInstallmentMonths(parseInt(e.target.value) || 6)} 
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Text className="mt-4">
                Ежемесячный платеж: {Math.round(installmentMonthlyPayment)} ₽
              </Form.Text>
            </Col>
          </Row>
        )}
          
        <h6 className="mb-3">Прогноз бюджета на {forecastMonths} месяцев ({getPaymentMethodName()})</h6>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={forecastData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" label={{ value: 'Месяц', position: 'insideBottomRight', offset: -10 }} />
            <YAxis label={{ value: 'Рубли', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value) => [`${value} ₽`, null]} />
            <Legend verticalAlign="top" height={36}/>
            <Line type="monotone" dataKey="Прогноз баланса" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
            <Line type="monotone" dataKey="Доход" stroke="#82ca9d" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="Расходы" stroke="#ff7300" strokeDasharray="3 4 5 2" />
            {(selectedPaymentType === 'credit' || selectedPaymentType === 'installment') && (
              <Line type="monotone" dataKey="Платежи по кредиту/рассрочке" stroke="#d62728" strokeDasharray="1 3" />
            )}
          </LineChart>
        </ResponsiveContainer>
                
        <div className="mt-3 text-muted">
          <p><small>
            График показывает прогноз вашего бюджета на ближайшие {forecastMonths} месяцев с учетом дохода, 
            обязательных расходов и выбранного способа оплаты покупки: {getPaymentMethodName()}.
          </small></p>
          <p><small>
            Инфляция учтена при расчете обязательных расходов (годовой уровень: {inflationRate}%).
          </small></p>
          {forecastData.some(data => data['Прогноз баланса'] < 5000) && (
            <p className="text-danger"><small>
              Внимание! В некоторые месяцы ваш бюджет опустится ниже безопасного уровня (5000 ₽).
            </small></p>
          )}
          {forecastData.some(data => data['Прогноз баланса'] === 0) && (
            <p className="text-danger"><small>
              Внимание! В некоторые месяцы ваш бюджет может быть полностью исчерпан.
            </small></p>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default BudgetCharts; 