// Актуальные финансовые показатели для России
// В реальном приложении эти данные могли бы обновляться через API

// Ключевая ставка ЦБ РФ на 2024 год (16% на май 2024)
export const getKeyRate = () => {
  return 16;
};

// Средняя ставка по кредитам на 2024 год (~18-23%)
export const getAverageCreditRate = () => {
  return 20.5;
};

// Средняя ставка по потребительским кредитам на 2024 год (~20-25%)
export const getConsumerCreditRate = () => {
  return 22.8;
};

// Ставка по рассрочке (обычно 0% на короткий срок, но с скрытой наценкой)
export const getInstallmentRate = () => {
  return 0;
};

// Текущий уровень инфляции на 2024 год (прогноз ~8-9%)
export const getInflationRate = () => {
  return 8.5;
};

// Функция для расчета аннуитетного платежа по кредиту
export const calculateAnnuityPayment = (amount, annualRate, months) => {
  const monthlyRate = annualRate / 100 / 12;
  return amount * monthlyRate * Math.pow(1 + monthlyRate, months) / 
         (Math.pow(1 + monthlyRate, months) - 1);
}; 