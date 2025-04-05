import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';

function BudgetSummary({ balance, mandatoryExpenses, purchaseCost, remainingBudget, salary }) {
  // Расчет общей суммы обязательных расходов
  const totalMandatoryExpenses = mandatoryExpenses.reduce(
    (total, expense) => total + parseFloat(expense.amount), 0
  );
  
  // Расчет месячного дохода (если указана зарплата)
  const monthlyIncome = salary || 0;
  
  // Расчет баланса после обязательных расходов
  const balanceAfterExpenses = balance - totalMandatoryExpenses;
  
  // Определение цвета для отображения остатка бюджета
  const getRemainingBudgetColor = () => {
    if (remainingBudget <= 0) return 'danger';
    if (remainingBudget < 5000) return 'warning';
    return 'success';
  };
  
  // Расчет количества месяцев для накопления на покупку
  const monthsToSave = monthlyIncome > totalMandatoryExpenses 
    ? Math.ceil(purchaseCost / (monthlyIncome - totalMandatoryExpenses))
    : Infinity;
  
  return (
    <Card className="mb-4">
      <Card.Header className="bg-info text-white">
        <h5 className="mb-0">Сводка по бюджету</h5>
      </Card.Header>
      <Card.Body>
        <ListGroup variant="flush">
          <ListGroup.Item className="d-flex justify-content-between">
            <span>Текущий баланс:</span>
            <span className="fw-bold">{balance} ₽</span>
          </ListGroup.Item>
          
          {monthlyIncome > 0 && (
            <ListGroup.Item className="d-flex justify-content-between">
              <span>Ежемесячный доход:</span>
              <span className="fw-bold">{monthlyIncome} ₽</span>
            </ListGroup.Item>
          )}
          
          <ListGroup.Item className="d-flex justify-content-between">
            <span>Обязательные расходы:</span>
            <span className="fw-bold">{totalMandatoryExpenses} ₽</span>
          </ListGroup.Item>
          
          <ListGroup.Item className="d-flex justify-content-between">
            <span>Баланс после обязательных расходов:</span>
            <span className={`fw-bold text-${balanceAfterExpenses < 0 ? 'danger' : 'success'}`}>
              {balanceAfterExpenses} ₽
            </span>
          </ListGroup.Item>
          
          <ListGroup.Item className="d-flex justify-content-between">
            <span>Стоимость покупки:</span>
            <span className="fw-bold">{purchaseCost} ₽</span>
          </ListGroup.Item>
          
          <ListGroup.Item className="d-flex justify-content-between">
            <span>Остаток после покупки:</span>
            <span className={`fw-bold text-${getRemainingBudgetColor()}`}>
              {remainingBudget} ₽
            </span>
          </ListGroup.Item>
          
          {monthlyIncome > 0 && (
            <ListGroup.Item className="d-flex justify-content-between">
              <span>Месяцев для накопления на покупку:</span>
              <span className="fw-bold">
                {monthsToSave === Infinity ? 'Невозможно накопить' : `${monthsToSave} мес.`}
              </span>
            </ListGroup.Item>
          )}
        </ListGroup>
        
        {remainingBudget < 0 && (
          <div className="alert alert-danger mt-3">
            <strong>Внимание!</strong> Ваших средств недостаточно для совершения покупки.
            {monthlyIncome > totalMandatoryExpenses && monthsToSave !== Infinity && (
              <p className="mb-0 mt-2">
                При текущем уровне доходов и расходов вы сможете накопить на покупку через {monthsToSave} месяцев.
              </p>
            )}
          </div>
        )}
        
        {remainingBudget >= 0 && remainingBudget < 5000 && (
          <div className="alert alert-warning mt-3">
            <strong>Обратите внимание!</strong> После покупки у вас останется менее 5000 ₽.
            Рекомендуется иметь финансовую подушку безопасности.
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default BudgetSummary; 