# BudgetBuddy - Планировщик бюджета и финансовый помощник

BudgetBuddy - это интерактивное веб-приложение для планирования личного бюджета и финансов, разработанное с использованием React и Bootstrap. Приложение помогает пользователям управлять своими финансами, планировать крупные покупки и принимать обоснованные финансовые решения.

## Текущий функционал

### Управление бюджетом
- Отслеживание текущего баланса и ежемесячной зарплаты
- Добавление, редактирование и удаление обязательных расходов
- Планирование крупных покупок с расчетом влияния на бюджет

### Финансовое планирование
- Прогнозирование бюджета на основе текущих финансов и расходов
- Визуализация финансовых данных с помощью интерактивных графиков
- Сравнение различных финансовых стратегий

### Способы оплаты и анализ
- Сравнение различных способов оплаты (немедленная оплата, рассрочка, кредит)
- Расчет ежемесячных платежей и общей переплаты по кредиту или рассрочке
- Построение графиков платежей и остатка бюджета

### Расчет инфляции
- Прогнозирование влияния инфляции на стоимость планируемой покупки
- Использование актуальных данных по инфляции в России
- Детальная таблица изменения стоимости с течением времени

### Финансовый советник (LLM-ассистент)
- Встроенный чат-бот для получения финансовых советов
- Анализ текущего финансового состояния пользователя
- Персонализированные рекомендации на основе введенных данных

## Технические особенности
- Использование React и React Bootstrap для создания пользовательского интерфейса
- Локальное хранение данных с помощью localStorage
- Интерактивные графики на базе Recharts
- Интеграция с актуальными финансовыми показателями
- Адаптивный дизайн для использования на различных устройствах

## Планы на будущее

### Расширение функционала
- Интеграция с банковскими API для автоматической загрузки транзакций
- Категоризация расходов и доходов с аналитикой
- Установка финансовых целей и отслеживание прогресса
- Система уведомлений о приближающихся платежах и превышении бюджета

### Улучшение финансового советника
- Подключение к реальной LLM-модели через API (например, OpenAI GPT)
- Обучение модели на финансовых данных для более точных рекомендаций
- Добавление голосового ввода для общения с ассистентом
- Предоставление актуальных новостей и трендов финансового рынка

### Социальные функции
- Возможность сравнения своих финансовых показателей со средними по региону/возрасту
- Обмен финансовыми стратегиями с другими пользователями
- Система достижений и наград за финансовую дисциплину

### Технические улучшения
- Переход на серверную архитектуру с безопасным хранением данных
- Поддержка нескольких валют и языков
- Экспорт данных в различные форматы (PDF, Excel)
- Мобильное приложение на базе React Native

## Начало работы

1. Клонируйте репозиторий
2. Установите зависимости: `npm install`
3. Запустите приложение: `npm start`
4. Откройте [http://localhost:3000](http://localhost:3000) в вашем браузере

## Технические требования
- Node.js 14+
- npm 6+

## Лицензия
MIT
