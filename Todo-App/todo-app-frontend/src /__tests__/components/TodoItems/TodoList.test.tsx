import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TodoList from '../../../components/TodoItems/TodoList';
import * as todosApi from '../../../api/todos';

jest.mock('../../../api/todos');

describe('TodoList', () => {
  const mockItems = [
    {
      _id: '1',
      title: 'Task 1',
      detail: 'Detail 1',
      dateAdded: new Date().toISOString(),
      list: 'list1',
    },
    {
      _id: '2',
      title: 'Task 2',
      detail: 'Detail 2',
      dateAdded: new Date().toISOString(),
      list: 'list1',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (todosApi.getItems as jest.Mock).mockResolvedValue({ data: mockItems });
  });

  it('renders todo items and allows creation of new item', async () => {
    (todosApi.createItem as jest.Mock).mockResolvedValue({
      data: {
        _id: '3',
        title: 'New Task',
        detail: 'New Detail',
        dateAdded: new Date().toISOString(),
        list: 'list1',
      },
    });

    render(<TodoList listId="list1" />);

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'New Task' },
    });
    fireEvent.change(screen.getByLabelText('Detail'), {
      target: { value: 'New Detail' },
    });
    fireEvent.click(screen.getByText('Add Task'));

    await waitFor(() => {
      expect(todosApi.createItem).toHaveBeenCalledWith('list1', 'New Task', 'New Detail');
    });
  });

  it('allows editing of todo item', async () => {
    (todosApi.updateItem as jest.Mock).mockResolvedValue({
      data: {
        _id: '1',
        title: 'Updated Task',
        detail: 'Updated Detail',
        dateAdded: new Date().toISOString(),
        list: 'list1',
      },
    });

    render(<TodoList listId="list1" />);

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText('Edit')[0]);
    
    fireEvent.change(screen.getByDisplayValue('Task 1'), {
      target: { value: 'Updated Task' },
    });
    fireEvent.change(screen.getByDisplayValue('Detail 1'), {
      target: { value: 'Updated Detail' },
    });
    fireEvent.click(screen.getByText('Update Task'));

    await waitFor(() => {
      expect(todosApi.updateItem).toHaveBeenCalledWith('list1', '1', 'Updated Task', 'Updated Detail');
    });
  });
});