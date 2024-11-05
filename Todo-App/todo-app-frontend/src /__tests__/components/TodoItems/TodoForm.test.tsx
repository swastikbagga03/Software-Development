import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoForm from '../../../components/TodoItems/TodoForm';

describe('TodoForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form correctly', () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Detail')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  });

  it('handles form submission', () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);
    
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New Task' } });
    fireEvent.change(screen.getByLabelText('Detail'), { target: { value: 'Task details' } });
    fireEvent.submit(screen.getByRole('button', { name: /add task/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith('New Task', 'Task details');
  });

  it('renders with initial values', () => {
    render(
      <TodoForm
        onSubmit={mockOnSubmit}
        initialValues={{ title: 'Test Task', detail: 'Test Detail' }}
      />
    );

    expect(screen.getByLabelText('Title')).toHaveValue('Test Task');
    expect(screen.getByLabelText('Detail')).toHaveValue('Test Detail');
    expect(screen.getByRole('button', { name: /update task/i })).toBeInTheDocument();
  });
});