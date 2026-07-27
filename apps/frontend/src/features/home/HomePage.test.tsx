import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { HomePage } from '@/features/home/HomePage';

function renderHome() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
}

describe('HomePage', () => {
  it('shows POTO AI studio structure without Lumina trademarks', () => {
    const { container } = renderHome();

    expect(screen.getByRole('heading', { name: 'POTO AI' })).toBeInTheDocument();
    expect(screen.getByLabelText('Featured models')).toBeInTheDocument();
    expect(screen.getByLabelText('Model grid')).toBeInTheDocument();
    expect(screen.getByLabelText('Inspiration')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/describe the scene/i)).toBeInTheDocument();

    const grid = screen.getByLabelText('Model grid');
    expect(within(grid).getAllByText('Image').length).toBeGreaterThanOrEqual(1);
    expect(within(grid).getAllByText('Video').length).toBeGreaterThanOrEqual(1);
    expect(within(grid).getAllByText('Audio').length).toBeGreaterThanOrEqual(1);

    const pageText = container.textContent ?? '';
    expect(pageText).not.toMatch(/Lumina|Seedream|Seedance|ByteDance/i);
  });

  it('routes try-now and prompt actions to register', () => {
    renderHome();

    expect(screen.getAllByRole('link', { name: 'Try now' })[0]).toHaveAttribute(
      'href',
      '/register',
    );
    expect(screen.getByRole('link', { name: 'Generate' })).toHaveAttribute('href', '/register');

    const input = screen.getByPlaceholderText(/describe the scene/i);
    fireEvent.change(input, { target: { value: 'a neon city' } });
    expect(input).toHaveValue('a neon city');
  });
});
