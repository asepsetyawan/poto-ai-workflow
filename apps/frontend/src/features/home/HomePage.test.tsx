import { render, screen } from '@testing-library/react';
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
  it('shows POTO AI brand and primary CTAs', () => {
    renderHome();

    expect(screen.getByText('POTO AI')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Get started' })[0]).toHaveAttribute(
      'href',
      '/register',
    );
    expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/login');
  });

  it('presents image, video, and audio capabilities', () => {
    renderHome();

    expect(document.getElementById('capability-image')).toHaveTextContent('Image');
    expect(document.getElementById('capability-video')).toHaveTextContent('Video');
    expect(document.getElementById('capability-audio')).toHaveTextContent('Audio');
  });

  it('includes a closing get-started CTA', () => {
    renderHome();

    const links = screen.getAllByRole('link', { name: 'Get started' });
    expect(links.length).toBeGreaterThanOrEqual(2);
    expect(links.every((link) => link.getAttribute('href') === '/register')).toBe(true);
  });
});
