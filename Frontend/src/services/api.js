import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
});

export const getFinancials = async (userId) => {
  const { data } = await client.get(`/api/financials/${userId}`);
  return data.data;
};

export const addExpense = async (userId, expense) => {
    const { data } = await client.post(`/api/expenses/${userId}`, expense);
    return data.data;
};

export const addIncome = async (userId, income) => {
    const { data } = await client.post(`/api/incomes/${userId}`, income);
    return data.data;
};

export const getBudgetAdvice = async (userId) => {
    const { data } = await client.get(`/api/budget/advice/${userId}`);
    return data.data;
};

export const sendChatMessage = async (userId, message, financialContext = null) => {
    const payload = {
        user_id: userId,
        message,
        financial_context: financialContext
    };
    const { data } = await client.post('/api/chat', payload);
    return data.message;
}
