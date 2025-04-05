import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Form, ListGroup, Badge } from 'react-bootstrap';
import { FaRobot, FaTimes, FaChevronUp, FaChevronDown } from 'react-icons/fa';

function FinancialAdvisor({ balance, mandatoryExpenses, purchaseCost, salary, selectedPaymentType }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: 'bot', 
      text: 'Привет! Я ваш финансовый советник. Спросите меня о вашем бюджете, покупках или финансовых стратегиях.' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Прокрутка к последнему сообщению
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Функция для имитации ответа бота
  const generateBotResponse = (userMessage) => {
    setIsTyping(true);
    
    // Базовая финансовая информация
    const totalExpenses = mandatoryExpenses.reduce(
      (total, expense) => total + parseFloat(expense.amount), 0
    );
    const remainingAfterExpenses = balance - totalExpenses;
    const remainingAfterPurchase = remainingAfterExpenses - purchaseCost;
    const monthlySavings = salary - totalExpenses;
    
    // Массив возможных ответов на основе финансовой информации
    const possibleResponses = [
      // Общие вопросы о бюджете
      {
        patterns: ['бюджет', 'баланс', 'финансы', 'состояние'],
        response: `Ваш текущий баланс составляет ${balance} ₽. Ежемесячные обязательные расходы: ${totalExpenses} ₽. ` +
          `После всех расходов у вас останется ${remainingAfterExpenses} ₽.`
      },
      // Вопросы о покупке
      {
        patterns: ['покупк', 'купить', 'приобрести', 'позволить'],
        response: `Стоимость вашей планируемой покупки: ${purchaseCost} ₽. ` +
          `После покупки у вас останется ${remainingAfterPurchase} ₽. ` +
          (remainingAfterPurchase < 0 
            ? `Похоже, вам не хватает ${Math.abs(remainingAfterPurchase)} ₽ для этой покупки.` 
            : (remainingAfterPurchase < 5000 
              ? `Это меньше рекомендуемой финансовой подушки в 5000 ₽.` 
              : `Это хороший запас после покупки.`))
      },
      // Вопросы о доходах
      {
        patterns: ['доход', 'зарплат', 'заработ', 'получа'],
        response: `Ваш ежемесячный доход составляет ${salary} ₽. ` +
          `После всех обязательных расходов (${totalExpenses} ₽) у вас остается ${monthlySavings} ₽ ежемесячно.`
      },
      // Вопросы о способах оплаты
      {
        patterns: ['оплат', 'платеж', 'рассрочк', 'кредит', 'способ оплаты'],
        response: `Выбранный вами способ оплаты: ${
          selectedPaymentType === 'immediate' ? 'оплата сразу' : 
          selectedPaymentType === 'installment' ? 'рассрочка' : 
          selectedPaymentType === 'credit' ? 'кредит' : 'не выбран'
        }. ` + 
        (selectedPaymentType === 'immediate' 
          ? `При немедленной оплате вы избегаете дополнительных процентов, но сразу тратите ${purchaseCost} ₽.` 
          : selectedPaymentType === 'installment' 
            ? `Рассрочка позволяет разбить сумму покупки на несколько платежей.` 
            : selectedPaymentType === 'credit' 
              ? `Кредит позволяет приобрести товар сейчас, но вы будете платить проценты.` 
              : `Рекомендую выбрать способ оплаты, соответствующий вашей финансовой ситуации.`)
      },
      // Вопросы о расходах
      {
        patterns: ['расход', 'трат', 'тратить'],
        response: `Ваши ежемесячные обязательные расходы составляют ${totalExpenses} ₽. ` +
          `Это ${(totalExpenses / (salary || 1) * 100).toFixed(1)}% от вашего дохода. ` +
          (totalExpenses > salary * 0.7 
            ? `Это довольно высокий процент расходов, рекомендую пересмотреть бюджет.` 
            : `Это приемлемый уровень расходов.`)
      },
      // Вопросы о планировании
      {
        patterns: ['план', 'экономи', 'сохран', 'накопи', 'сбереж'],
        response: `При вашем ежемесячном доходе ${salary} ₽ и расходах ${totalExpenses} ₽, ` +
          `вы можете откладывать около ${monthlySavings} ₽ каждый месяц. ` +
          (monthlySavings <= 0 
            ? `К сожалению, ваши расходы превышают доходы, что затрудняет накопления.` 
            : `За год это позволит накопить около ${monthlySavings * 12} ₽.`)
      },
      // Стандартный ответ
      {
        patterns: [''],
        response: `Я могу рассказать о вашем бюджете (${balance} ₽), ежемесячных расходах (${totalExpenses} ₽), ` +
          `планируемых покупках (${purchaseCost} ₽) и помочь с финансовым планированием. Что вас интересует?`
      }
    ];
    
    // Находим подходящий ответ
    let foundResponse = possibleResponses[possibleResponses.length - 1].response; // стандартный ответ
    
    for (const resp of possibleResponses) {
      if (resp.patterns.some(pattern => userMessage.toLowerCase().includes(pattern))) {
        foundResponse = resp.response;
        break;
      }
    }
    
    // Имитация задержки при ответе
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: prev.length + 1, 
        type: 'bot', 
        text: foundResponse 
      }]);
      setIsTyping(false);
    }, 1000);
  };

  // Обработчик отправки сообщения
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    // Добавляем сообщение пользователя
    setMessages(prev => [...prev, { 
      id: prev.length + 1, 
      type: 'user', 
      text: inputMessage 
    }]);
    
    // Генерируем ответ
    generateBotResponse(inputMessage);
    
    // Очищаем ввод
    setInputMessage('');
  };

  // Стили для всплывающего окна
  const advisorStyle = {
    position: 'fixed',
    bottom: isOpen ? '20px' : '10px',
    right: '20px',
    width: isOpen ? '350px' : 'auto',
    zIndex: 1000,
    boxShadow: '0 0 20px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease'
  };

  const toggleBubbleStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    boxShadow: '0 0 15px rgba(0,0,0,0.2)',
    zIndex: 1000
  };

  // Рендер компонента
  return (
    <div style={advisorStyle}>
      {!isOpen ? (
        <Button 
          variant="primary" 
          style={toggleBubbleStyle}
          onClick={() => setIsOpen(true)}
        >
          <FaRobot size={24} />
        </Button>
      ) : (
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
            <div>
              <FaRobot className="me-2" /> Финансовый советник
            </div>
            <div>
              <Button 
                variant="link" 
                className="p-0 text-white" 
                onClick={() => setIsOpen(false)}
              >
                <FaTimes />
              </Button>
            </div>
          </Card.Header>
          <Card.Body style={{ height: '300px', overflowY: 'auto', padding: '0.5rem' }}>
            <ListGroup variant="flush">
              {messages.map(message => (
                <ListGroup.Item 
                  key={message.id}
                  className={`border-0 ${message.type === 'user' ? 'text-end' : ''}`}
                >
                  {message.type === 'user' ? (
                    <div className="d-inline-block bg-primary text-white p-2 rounded-3 mb-1">
                      {message.text}
                    </div>
                  ) : (
                    <div className="d-inline-block bg-light p-2 rounded-3 mb-1">
                      {message.text}
                    </div>
                  )}
                </ListGroup.Item>
              ))}
              {isTyping && (
                <ListGroup.Item className="border-0">
                  <Badge bg="secondary" className="p-2">
                    Советник печатает...
                  </Badge>
                </ListGroup.Item>
              )}
              <div ref={messagesEndRef} />
            </ListGroup>
          </Card.Body>
          <Card.Footer className="p-1">
            <Form onSubmit={handleSendMessage}>
              <div className="d-flex">
                <Form.Control
                  type="text"
                  placeholder="Задайте вопрос о финансах..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                />
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="ms-2"
                  disabled={isTyping}
                >
                  →
                </Button>
              </div>
            </Form>
          </Card.Footer>
        </Card>
      )}
    </div>
  );
}

export default FinancialAdvisor; 