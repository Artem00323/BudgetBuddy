import React, { useState, useEffect } from 'react';
import Header from './Header';
import BudgetForm from './BudgetForm';
import ExpenseForm from './ExpenseForm';
import BudgetSummary from './BudgetSummary';
import BudgetCharts from './BudgetCharts';
import InstallmentOptions from './InstallmentOptions';
import InflationCalculator from './InflationCalculator';
import FinancialAdvisor from './FinancialAdvisor';
import { Container, Row, Col, Tab, Nav } from 'react-bootstrap';
import { 
  getBalance, 
  saveBalance, 
  getMandatoryExpenses, 
  saveMandatoryExpenses, 
  getPurchaseCost, 
  savePurchaseCost,
  getSalary,
  saveSalary
} from '../services/storageService';

function App() {
  // Состояния для хранения данных (инициализируются из хранилища)
  const [balance, setBalance] = useState(0);
  const [mandatoryExpenses, setMandatoryExpenses] = useState([]);
  const [purchaseCost, setPurchaseCost] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [salary, setSalary] = useState(0);
  const [selectedPaymentType, setSelectedPaymentType] = useState('immediate'); // immediate, credit, installment
  
  // Загрузка данных из хранилища при монтировании компонента
  useEffect(() => {
    const storedBalance = getBalance();
    const storedExpenses = getMandatoryExpenses();
    const storedPurchaseCost = getPurchaseCost();
    const storedSalary = getSalary();
    
    setBalance(storedBalance);
    setMandatoryExpenses(storedExpenses);
    setPurchaseCost(storedPurchaseCost);
    setSalary(storedSalary);
  }, []);
  
  // Сохранение баланса в хранилище при изменении
  useEffect(() => {
    saveBalance(balance);
  }, [balance]);
  
  // Сохранение расходов в хранилище при изменении
  useEffect(() => {
    saveMandatoryExpenses(mandatoryExpenses);
  }, [mandatoryExpenses]);
  
  // Сохранение стоимости покупки в хранилище при изменении
  useEffect(() => {
    savePurchaseCost(purchaseCost);
  }, [purchaseCost]);
  
  // Сохранение зарплаты в хранилище при изменении
  useEffect(() => {
    saveSalary(salary);
  }, [salary]);
  
  // Расчет оставшегося бюджета
  useEffect(() => {
    const totalMandatoryExpenses = mandatoryExpenses.reduce(
      (total, expense) => total + parseFloat(expense.amount), 0
    );
    
    const remaining = balance - purchaseCost - totalMandatoryExpenses;
    setRemainingBudget(remaining);
  }, [balance, mandatoryExpenses, purchaseCost]);
  
  // Функция для добавления обязательного расхода
  const addMandatoryExpense = (expense) => {
    setMandatoryExpenses([...mandatoryExpenses, expense]);
  };
  
  // Функция для удаления обязательного расхода
  const removeMandatoryExpense = (id) => {
    setMandatoryExpenses(mandatoryExpenses.filter(expense => expense.id !== id));
  };
  
  return (
    <div className="app">
      <Header />
      <Container className="mt-4">
        <Row>
          <Col md={6}>
            <BudgetForm 
              balance={balance} 
              setBalance={setBalance} 
              mandatoryExpenses={mandatoryExpenses}
              setMandatoryExpenses={setMandatoryExpenses}
              addMandatoryExpense={addMandatoryExpense}
              removeMandatoryExpense={removeMandatoryExpense}
              salary={salary}
              setSalary={setSalary}
            />
          </Col>
          <Col md={6}>
            <ExpenseForm 
              purchaseCost={purchaseCost} 
              setPurchaseCost={setPurchaseCost} 
            />
            <BudgetSummary 
              balance={balance}
              mandatoryExpenses={mandatoryExpenses}
              purchaseCost={purchaseCost}
              remainingBudget={remainingBudget}
              salary={salary}
            />
          </Col>
        </Row>
        
        <Row className="mt-4">
          <Col>
            <Tab.Container defaultActiveKey="charts">
              <Nav variant="pills" className="mb-3">
                <Nav.Item>
                  <Nav.Link eventKey="charts">Графики и прогнозы</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="installment">Рассрочка</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="inflation">Инфляция</Nav.Link>
                </Nav.Item>
              </Nav>
              
              <Tab.Content>
                <Tab.Pane eventKey="charts">
                  <BudgetCharts
                    balance={balance}
                    mandatoryExpenses={mandatoryExpenses}
                    purchaseCost={purchaseCost}
                    remainingBudget={remainingBudget}
                    salary={salary}
                    selectedPaymentType={selectedPaymentType}
                    setSelectedPaymentType={setSelectedPaymentType}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="installment">
                  <InstallmentOptions
                    purchaseCost={purchaseCost}
                    balance={balance}
                    mandatoryExpenses={mandatoryExpenses}
                    salary={salary}
                    setSelectedPaymentType={setSelectedPaymentType}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="inflation">
                  <InflationCalculator
                    purchaseCost={purchaseCost}
                  />
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Col>
        </Row>
      </Container>
      
      {/* Финансовый советник (всплывающее окно в нижнем правом углу) */}
      <FinancialAdvisor
        balance={balance}
        mandatoryExpenses={mandatoryExpenses}
        purchaseCost={purchaseCost}
        salary={salary}
        selectedPaymentType={selectedPaymentType}
      />
    </div>
  );
}

export default App; 