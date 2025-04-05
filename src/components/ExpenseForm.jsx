import React from 'react';
import { Card, Form } from 'react-bootstrap';

function ExpenseForm({ purchaseCost, setPurchaseCost }) {
  // Обработчик изменения стоимости покупки
  const handlePurchaseCostChange = (e) => {
    const value = e.target.value;
    if (value === '' || !isNaN(value)) {
      setPurchaseCost(parseFloat(value) || 0);
    }
  };
  
  // Предотвращение отправки формы при нажатии Enter
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  
  return (
    <Card className="mb-4">
      <Card.Header className="bg-secondary text-white">
        <h5 className="mb-0">Планируемая покупка</h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Стоимость покупки</Form.Label>
            <Form.Control 
              type="number" 
              value={purchaseCost || ''} 
              onChange={handlePurchaseCostChange} 
              placeholder="Введите стоимость планируемой покупки"
            />
            <Form.Text className="text-muted">
              Введите сумму, которую вы планируете потратить на покупку
            </Form.Text>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default ExpenseForm; 