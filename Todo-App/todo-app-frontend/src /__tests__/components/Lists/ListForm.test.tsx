import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ListForm from '../../../components/Lists/ListForm';

describe('ListForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form correctly', () => {
    render(<ListForm onSubmit={mockOnSubmit} />);
    expect(screen.getByPlaceholderText('List name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add list/i })).toBeInTheDocument();
  });

  it('handles form submission', () => {
    render(<ListForm onSubmit={mockOnSubmit} />);
    
    const input = screen.getByPlaceholderText('List name');
    fireEvent.change(input, { target: { value: 'New List' } });
    fireEvent.submit(screen.getByRole('button', { name: /add list/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith('New List');
    expect(input).toHaveValue('');
  });

  it('does not submit empty list name', () => {
    render(<ListForm onSubmit={mockOnSubmit} />);
    
    fireEvent.submit(screen.getByRole('button', { name: /add list/i }));
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});