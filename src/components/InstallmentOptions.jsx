import React, { useState, useEffect } from 'react';
import { Card, Form, Row, Col, Table, Button } from 'react-bootstrap';
import { getInstallmentRate, getConsumerCreditRate, calculateAnnuityPayment } from '../services/financeDataService';

function InstallmentOptions({ purchaseCost, balance, mandatoryExpenses, salary, setSelectedPaymentType }) {
  const [installmentMonths, setInstallmentMonths] = useState(6);
  const [interestRate, setInterestRate] = useState(getInstallmentRate());
  const [creditMonths, setCreditMonths] = useState(12);
  const [creditRate, setCreditRate] = useState(getConsumerCreditRate());
  
  // Обновление ставок при изменении в сервисе
  useEffect(() => {
    setInterestRate(getInstallmentRate());
    setCreditRate(getConsumerCreditRate());
  }, []);
  
  // Расчет ежемесячного платежа по рассрочке
  const calculateInstallmentPayment = () => {
    if (installmentMonths <= 0) return 0;
    
    const monthlyRate = interestRate / 100 / 12;
    
    if (monthlyRate === 0) {
      // Без процентов, просто деление
      return purchaseCost / installmentMonths;
    } else {
      // С процентами, аннуитетный платеж
      return calculateAnnuityPayment(purchaseCost, interestRate, installmentMonths);
    }
  };
  
  // Расчет ежемесячного платежа по кредиту
  const calculateCreditPayment = () => {
    if (creditMonths <= 0) return 0;
    return calculateAnnuityPayment(purchaseCost, creditRate, creditMonths);
  };
  
  const installmentMonthlyPayment = calculateInstallmentPayment();
  const creditMonthlyPayment = calculateCreditPayment();
  
  // Расчет общей суммы обязательных расходов
  const totalMandatoryExpenses = mandatoryExpenses.reduce(
    (total, expense) => total + parseFloat(expense.amount), 0
  );
  
  // Данные для таблицы рассрочки
  const installmentData = Array.from({ length: installmentMonths }, (_, i) => {
    // Оставшийся долг
    let remainingDebt = purchaseCost;
    let totalPaid = 0;
    const monthlyRate = interestRate / 100 / 12;
    
    for (let j = 0; j <= i; j++) {
      if (monthlyRate === 0) {
        // Без процентов
        remainingDebt -= purchaseCost / installmentMonths;
        totalPaid += purchaseCost / installmentMonths;
      } else {
        // С процентами
        const interestPayment = remainingDebt * monthlyRate;
        const principalPayment = installmentMonthlyPayment - interestPayment;
        
        remainingDebt -= principalPayment;
        totalPaid += installmentMonthlyPayment;
      }
    }
    
    // Расчет остатка бюджета после платежа с учетом зарплаты
    const monthlyExpenses = totalMandatoryExpenses + installmentMonthlyPayment;
    const remainingBudget = balance - monthlyExpenses + (salary * (i + 1));
    
    return {
      month: i + 1,
      payment: Math.round(installmentMonthlyPayment),
      remainingDebt: Math.round(Math.max(0, remainingDebt)),
      totalPaid: Math.round(totalPaid),
      budgetAfterPayment: Math.round(Math.max(0, remainingBudget))
    };
  });
  
  // Данные для таблицы кредита
  const creditData = Array.from({ length: creditMonths }, (_, i) => {
    // Оставшийся долг
    let remainingDebt = purchaseCost;
    let totalPaid = 0;
    const monthlyRate = creditRate / 100 / 12;
    
    for (let j = 0; j <= i; j++) {
      const interestPayment = remainingDebt * monthlyRate;
      const principalPayment = creditMonthlyPayment - interestPayment;
      
      remainingDebt -= principalPayment;
      totalPaid += creditMonthlyPayment;
    }
    
    // Расчет остатка бюджета после платежа с учетом зарплаты
    const monthlyExpenses = totalMandatoryExpenses + creditMonthlyPayment;
    const remainingBudget = balance - monthlyExpenses + (salary * (i + 1));
    
    return {
      month: i + 1,
      payment: Math.round(creditMonthlyPayment),
      remainingDebt: Math.round(Math.max(0, remainingDebt)),
      totalPaid: Math.round(totalPaid),
      budgetAfterPayment: Math.round(Math.max(0, remainingBudget))
    };
  });
  
  // Выбор способа оплаты
  const selectPaymentMethod = (method) => {
    setSelectedPaymentType(method);
  };
  
  return (
    <Card className="mt-4">
      <Card.Header className="bg-info text-white">
        <h5 className="mb-0">Варианты оплаты</h5>
      </Card.Header>
      <Card.Body>
        <div className="mb-4">
          <h5>Сравнение способов оплаты</h5>
          <div className="d-flex justify-content-between mt-3">
            <Button 
              variant="outline-primary" 
              className="w-30"
              onClick={() => selectPaymentMethod('immediate')}
            >
              Оплатить сразу
              <div className="small mt-1">Полная сумма: {purchaseCost} ₽</div>
            </Button>
            
            <Button 
              variant="outline-primary" 
              className="w-30"
              onClick={() => selectPaymentMethod('installment')}
            >
              Рассрочка
              <div className="small mt-1">{installmentMonthlyPayment.toFixed(0)} ₽ × {installmentMonths} мес.</div>
            </Button>
            
            <Button 
              variant="outline-primary" 
              className="w-30"
              onClick={() => selectPaymentMethod('credit')}
            >
              Кредит
              <div className="small mt-1">{creditMonthlyPayment.toFixed(0)} ₽ × {creditMonths} мес.</div>
            </Button>
          </div>
        </div>

        <ul className="nav nav-tabs" id="myTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button className="nav-link active" id="installment-tab" data-bs-toggle="tab" data-bs-target="#installment" type="button" role="tab">
              Рассрочка
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="credit-tab" data-bs-toggle="tab" data-bs-target="#credit" type="button" role="tab">
              Кредит
            </button>
          </li>
        </ul>
        
        <div className="tab-content" id="myTabContent">
          <div className="tab-pane fade show active" id="installment" role="tabpanel">
            <Row className="mt-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Количество месяцев рассрочки</Form.Label>
                  <Form.Control 
                    type="number" 
                    min="1"
                    max="36"
                    value={installmentMonths} 
                    onChange={(e) => setInstallmentMonths(parseInt(e.target.value) || 1)} 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Процентная ставка (годовых, %)</Form.Label>
                  <Form.Control 
                    type="number" 
                    min="0"
                    max="30"
                    step="0.1"
                    value={interestRate} 
                    onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)} 
                  />
                  <Form.Text className="text-muted">
                    Стандартная ставка по рассрочке: {getInstallmentRate()}%
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            
            <div className="alert alert-info mt-3">
              <div className="d-flex justify-content-between">
                <span>Ежемесячный платеж:</span>
                <strong>{Math.round(installmentMonthlyPayment)} ₽</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Общая сумма выплат:</span>
                <strong>{Math.round(installmentMonthlyPayment * installmentMonths)} ₽</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Переплата:</span>
                <strong>{Math.round(installmentMonthlyPayment * installmentMonths - purchaseCost)} ₽</strong>
              </div>
            </div>
            
            <h6 className="mt-4 mb-3">График платежей</h6>
            <div className="table-responsive">
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Месяц</th>
                    <th>Платеж</th>
                    <th>Остаток долга</th>
                    <th>Всего выплачено</th>
                    <th>Остаток бюджета</th>
                  </tr>
                </thead>
                <tbody>
                  {installmentData.map((data) => (
                    <tr key={data.month}>
                      <td>{data.month}</td>
                      <td>{data.payment} ₽</td>
                      <td>{data.remainingDebt} ₽</td>
                      <td>{data.totalPaid} ₽</td>
                      <td className={data.budgetAfterPayment < 5000 ? 'text-danger' : 'text-success'}>
                        {data.budgetAfterPayment} ₽
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            
            <div className="mt-3 text-muted">
              <p><small>
                {interestRate > 0 
                  ? `При рассрочке на ${installmentMonths} месяцев со ставкой ${interestRate}% годовых ваша переплата составит ${Math.round(installmentMonthlyPayment * installmentMonths - purchaseCost)} ₽.` 
                  : `При беспроцентной рассрочке на ${installmentMonths} месяцев переплаты не будет.`}
              </small></p>
              {installmentData.some(data => data.budgetAfterPayment < 5000) && (
                <p className="text-danger"><small>Внимание! В некоторые месяцы ваш бюджет опустится ниже безопасного уровня (5000 ₽).</small></p>
              )}
            </div>
          </div>
          
          <div className="tab-pane fade" id="credit" role="tabpanel">
            <Row className="mt-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Срок кредита (месяцев)</Form.Label>
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
                <Form.Group className="mb-3">
                  <Form.Label>Процентная ставка (годовых, %)</Form.Label>
                  <Form.Control 
                    type="number" 
                    min="5"
                    max="40"
                    step="0.1"
                    value={creditRate} 
                    onChange={(e) => setCreditRate(parseFloat(e.target.value) || getConsumerCreditRate())} 
                  />
                  <Form.Text className="text-muted">
                    Текущая средняя ставка по потребкредитам: {getConsumerCreditRate()}%
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            
            <div className="alert alert-info mt-3">
              <div className="d-flex justify-content-between">
                <span>Ежемесячный платеж:</span>
                <strong>{Math.round(creditMonthlyPayment)} ₽</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Общая сумма выплат:</span>
                <strong>{Math.round(creditMonthlyPayment * creditMonths)} ₽</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Переплата:</span>
                <strong>{Math.round(creditMonthlyPayment * creditMonths - purchaseCost)} ₽</strong>
              </div>
            </div>
            
            <h6 className="mt-4 mb-3">График платежей</h6>
            <div className="table-responsive">
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Месяц</th>
                    <th>Платеж</th>
                    <th>Остаток долга</th>
                    <th>Всего выплачено</th>
                    <th>Остаток бюджета</th>
                  </tr>
                </thead>
                <tbody>
                  {creditData.map((data) => (
                    <tr key={data.month}>
                      <td>{data.month}</td>
                      <td>{data.payment} ₽</td>
                      <td>{data.remainingDebt} ₽</td>
                      <td>{data.totalPaid} ₽</td>
                      <td className={data.budgetAfterPayment < 5000 ? 'text-danger' : 'text-success'}>
                        {data.budgetAfterPayment} ₽
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            
            <div className="mt-3 text-muted">
              <p><small>
                При кредите на {creditMonths} месяцев со ставкой {creditRate}% годовых ваша переплата составит {Math.round(creditMonthlyPayment * creditMonths - purchaseCost)} ₽.
              </small></p>
              {creditData.some(data => data.budgetAfterPayment < 5000) && (
                <p className="text-danger"><small>Внимание! В некоторые месяцы ваш бюджет опустится ниже безопасного уровня (5000 ₽).</small></p>
              )}
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default InstallmentOptions; 