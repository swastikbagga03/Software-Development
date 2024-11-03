import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '../components/Auth/LoginForm';
import { AuthProvider } from '../contexts/AuthContext';
import userEvent from '@testing-library/user-event';

test('renders login form and handles submission', async () => {
  render(
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );

  const usernameInput = screen.getByPlaceholderText(/username/i);
  const passwordInput = screen.getByPlaceholderText(/password/i);
  const submitButton = screen.getByRole('button', { name: /sign in/i });

  await userEvent.type(usernameInput, 'testuser');
  await userEvent.type(passwordInput, 'password123');
  fireEvent.click(submitButton);

});