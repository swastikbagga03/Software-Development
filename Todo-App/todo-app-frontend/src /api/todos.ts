import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getLists = () => api.get('/todos/lists');
export const createList = (name: string) => api.post('/todos/lists', { name });
export const updateList = (id: string, name: string) => api.put(`/todos/lists/${id}`, { name });
export const deleteList = (id: string) => api.delete(`/todos/lists/${id}`);

export const getItems = (listId: string) => api.get(`/todos/lists/${listId}/items`);
export const createItem = (listId: string, title: string, detail: string) => 
  api.post(`/todos/lists/${listId}/items`, { title, detail });
export const updateItem = (listId: string, itemId: string, title: string, detail: string) =>
  api.put(`/todos/lists/${listId}/items/${itemId}`, { title, detail });
export const deleteItem = (listId: string, itemId: string) =>
  api.delete(`/todos/lists/${listId}/items/${itemId}`);