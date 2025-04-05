import React, { useState } from 'react';
import { Card, Form, Button, ListGroup } from 'react-bootstrap';

function BudgetForm({ balance, setBalance, mandatoryExpenses, setMandatoryExpenses, addMandatoryExpense, removeMandatoryExpense, salary, setSalary }) {
  // Состояния для формы добавления обязательных расходов
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [editAmount, setEditAmount] = useState('');
  
  // Обработчик изменения баланса
  const handleBalanceChange = (e) => {
    const value = e.target.value;
    if (value === '' || !isNaN(value)) {
      setBalance(parseFloat(value) || 0);
    }
  };

  // Обработчик изменения зарплаты
  const handleSalaryChange = (e) => {
    const value = e.target.value;
    if (value === '' || !isNaN(value)) {
      setSalary(parseFloat(value) || 0);
    }
  };
  
  // Предотвращение отправки формы при нажатии Enter в поле баланса
  const handleBalanceFormSubmit = (e) => {
    e.preventDefault();
  };
  
  // Обработчик отправки формы расходов
  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (expenseName.trim() && expenseAmount && !isNaN(expenseAmount)) {
      const newExpense = {
        id: Date.now(),
        name: expenseName,
        amount: parseFloat(expenseAmount)
      };
      addMandatoryExpense(newExpense);
      // Очистка формы
      setExpenseName('');
      setExpenseAmount('');
    }
  };
  
  // Начать редактирование расхода
  const startEditing = (expense) => {
    setEditingExpenseId(expense.id);
    setEditAmount(expense.amount);
  };
  
  // Сохранить изменённый расход
  const saveExpenseEdit = (id) => {
    if (!isNaN(editAmount) && editAmount !== '') {
      const updatedExpenses = mandatoryExpenses.map(expense => 
        expense.id === id ? {...expense, amount: parseFloat(editAmount)} : expense
      );
      
      // Обновляем список расходов напрямую
      setMandatoryExpenses(updatedExpenses);
      
      // Сбросить состояние редактирования
      setEditingExpenseId(null);
      setEditAmount('');
    }
  };
  
  // Отменить редактирование
  const cancelEditing = () => {
    setEditingExpenseId(null);
    setEditAmount('');
  };
  
  return (
    <Card className="mb-4">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Управление бюджетом</h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleBalanceFormSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Текущий баланс</Form.Label>
            <Form.Control 
              type="number" 
              value={balance || ''} 
              onChange={handleBalanceChange} 
              placeholder="Введите ваш текущий баланс"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Стабильная зарплата (в месяц)</Form.Label>
            <Form.Control 
              type="number" 
              value={salary || ''} 
              onChange={handleSalaryChange} 
              placeholder="Введите размер вашей ежемесячной зарплаты"
            />
            <Form.Text className="text-muted">
              Используется для расчета прогнозов бюджета
            </Form.Text>
          </Form.Group>
        </Form>
        
        <h5 className="mt-4">Обязательные расходы</h5>
        <Form onSubmit={handleExpenseSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Название расхода</Form.Label>
            <Form.Control 
              type="text" 
              value={expenseName} 
              onChange={(e) => setExpenseName(e.target.value)} 
              placeholder="Например: коммунальные платежи"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Сумма</Form.Label>
            <Form.Control 
              type="number" 
              value={expenseAmount} 
              onChange={(e) => setExpenseAmount(e.target.value)} 
              placeholder="Введите сумму"
            />
          </Form.Group>
          
          <Button variant="success" type="submit">
            Добавить расход
          </Button>
        </Form>
        
        {mandatoryExpenses.length > 0 && (
          <ListGroup className="mt-4">
            {mandatoryExpenses.map((expense) => (
              <ListGroup.Item key={expense.id} className="d-flex justify-content-between align-items-center">
                {editingExpenseId === expense.id ? (
                  <div className="d-flex align-items-center w-100">
                    <span className="fw-bold me-2">{expense.name}</span>
                    <Form.Control 
                      type="number" 
                      className="mx-2"
                      style={{width: '100px'}}
                      value={editAmount} 
                      onChange={(e) => setEditAmount(e.target.value)}
                    />
                    <div className="ms-auto">
                      <Button 
                        variant="success" 
                        size="sm"
                        className="me-2"
                        onClick={() => saveExpenseEdit(expense.id)}
                      >
                        Сохранить
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={cancelEditing}
                      >
                        Отмена
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <span className="fw-bold">{expense.name}</span>
                      <span className="ms-3">{expense.amount} ₽</span>
                    </div>
                    <div>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        className="me-2"
                        onClick={() => startEditing(expense)}
                      >
                        Изменить
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => removeMandatoryExpense(expense.id)}
                      >
                        Удалить
                      </Button>
                    </div>
                  </>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
}

export default BudgetForm; 