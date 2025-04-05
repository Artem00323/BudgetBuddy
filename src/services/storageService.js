// Сервис для работы с локальным хранилищем

// Ключи для хранения данных
const STORAGE_KEYS = {
  BALANCE: 'budgetBuddy_balance',
  MANDATORY_EXPENSES: 'budgetBuddy_mandatoryExpenses',
  PURCHASE_COST: 'budgetBuddy_purchaseCost',
};

// Сохранение баланса
export const saveBalance = (balance) => {
  try {
    localStorage.setItem(STORAGE_KEYS.BALANCE, JSON.stringify(balance));
  } catch (error) {
    console.error('Error saving balance to localStorage:', error);
  }
};

// Получение баланса
export const getBalance = () => {
  const balance = localStorage.getItem('balance');
  return balance ? parseFloat(balance) : 0;
};

// Сохранение обязательных расходов
export const saveMandatoryExpenses = (expenses) => {
  try {
    localStorage.setItem(STORAGE_KEYS.MANDATORY_EXPENSES, JSON.stringify(expenses));
  } catch (error) {
    console.error('Error saving mandatory expenses to localStorage:', error);
  }
};

// Получение обязательных расходов
export const getMandatoryExpenses = () => {
  const expenses = localStorage.getItem('mandatoryExpenses');
  return expenses ? JSON.parse(expenses) : [];
};

// Сохранение стоимости покупки
export const savePurchaseCost = (cost) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PURCHASE_COST, JSON.stringify(cost));
  } catch (error) {
    console.error('Error saving purchase cost to localStorage:', error);
  }
};

// Получение стоимости покупки
export const getPurchaseCost = () => {
  const cost = localStorage.getItem('purchaseCost');
  return cost ? parseFloat(cost) : 0;
};

// Очистка всех данных
export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing data from localStorage:', error);
  }
};

// Функция для получения стабильной зарплаты из localStorage
export const getSalary = () => {
  const salary = localStorage.getItem('salary');
  return salary ? parseFloat(salary) : 0;
};

// Функция для сохранения стабильной зарплаты в localStorage
export const saveSalary = (salary) => {
  localStorage.setItem('salary', salary);
}; 