import React from 'react';
import { render, act, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../../src/contexts/AuthContext';

const TestComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'logged-in' : 'logged-out'}</div>
      <div data-testid="username">{user?.username}</div>
      <button onClick={() => login('token', { id: '1', username: 'test' })}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides authentication context to children', () => {

    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-out');

    act(() => {
      screen.getByText('Login').click();
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-in');
    expect(screen.getByTestId('username')).toHaveTextContent('test');
    expect(localStorage.getItem('token')).toBe('token');
    expect(JSON.parse(localStorage.getItem('user')!)).toEqual({ id: '1', username: 'test' });

    act(() => {
      screen.getByText('Logout').click();
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-out');
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});