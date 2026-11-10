import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { EntityRow } from '../presentation/molecules/EntityRow';
import { PlaceholderPanel } from '../presentation/molecules/PlaceholderPanel';

describe('EntityRow', () => {
  it('renders title, icon, meta and aside correctly', () => {
    render(
      <MemoryRouter>
        <ul>
          <EntityRow
            icon={<span data-testid="icon">ICON</span>}
            title="Comprehensive Auto"
            meta={['Renewal date: 2026-12-01', 'Policy #A-9928']}
            badge={<span data-testid="badge">Active</span>}
            aside={<span data-testid="aside">$120/mo</span>}
          />
        </ul>
      </MemoryRouter>
    );

    expect(screen.getByText('Comprehensive Auto')).toBeDefined();
    expect(screen.getByTestId('icon')).toBeDefined();
    expect(screen.getByText('Renewal date: 2026-12-01')).toBeDefined();
    expect(screen.getByText('Policy #A-9928')).toBeDefined();
    expect(screen.getByTestId('badge')).toBeDefined();
    expect(screen.getByTestId('aside')).toBeDefined();
  });

  it('renders as a link when to prop is provided', () => {
    render(
      <MemoryRouter>
        <ul>
          <EntityRow
            icon={<span>ICON</span>}
            title="Homeowners Plus"
            to="/policies/123"
            highlight={true}
          />
        </ul>
      </MemoryRouter>
    );

    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/policies/123');
    expect(link.className).toContain('highlight');
    expect(screen.getByRole('img', { name: 'Unread' })).toBeDefined();
  });
});

describe('PlaceholderPanel', () => {
  it('renders step, title, description and capabilities', () => {
    render(
      <PlaceholderPanel
        step="Step 4"
        title="Automated Claims"
        description="Submit photos and get instant estimates."
        capabilities={['Direct damage upload', 'Fast adjuster review']}
      >
        <div data-testid="extra-child">Extra content</div>
      </PlaceholderPanel>
    );

    expect(screen.getByText('Roadmap · Step 4')).toBeDefined();
    expect(screen.getByText('Automated Claims')).toBeDefined();
    expect(screen.getByText('Submit photos and get instant estimates.')).toBeDefined();
    expect(screen.getByText('Direct damage upload')).toBeDefined();
    expect(screen.getByText('Fast adjuster review')).toBeDefined();
    expect(screen.getByTestId('extra-child')).toBeDefined();
  });
});
