import { render, screen } from '@testing-library/react';
import App from './App';

test('renders main header content', () => {
  render(<App />);
  const heading = screen.getByText(/Populares esta semana/i);
  expect(heading).toBeInTheDocument();
});
