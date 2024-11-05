import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ListView from '../../../components/Lists/ListView';
import * as todosApi from '../../../api/todos';

jest.mock('../../../api/todos');

describe('ListView', () => {
  const mockLists = [
    { _id: '1', name: 'List 1', user: 'user1' },
    { _id: '2', name: 'List 2', user: 'user1' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (todosApi.getLists as jest.Mock).mockResolvedValue({ data: mockLists });
  });

  it('renders lists and allows creation of new list', async () => {
    (todosApi.createList as jest.Mock).mockResolvedValue({
      data: { _id: '3', name: 'New List', user: 'user1' },
    });

    render(<ListView />);

    await waitFor(() => {
      expect(screen.getByText('List 1')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText('List 2')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('List name'), {
      target: { value: 'New List' },
    });
    fireEvent.click(screen.getByText('Add List'));

    await waitFor(() => {
      expect(todosApi.createList).toHaveBeenCalledWith('New List');
    });
  });

  it('allows editing of list name', async () => {
    (todosApi.updateList as jest.Mock).mockResolvedValue({
      data: { _id: '1', name: 'Updated List', user: 'user1' },
    });

    render(<ListView />);

    await waitFor(() => {
      expect(screen.getByText('List 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText('Edit')[0]);
    
    const input = screen.getByDisplayValue('List 1');
    fireEvent.change(input, { target: { value: 'Updated List' } });
    fireEvent.submit(input);

    await waitFor(() => {
      expect(todosApi.updateList).toHaveBeenCalledWith('1', 'Updated List');
    });
  });
});