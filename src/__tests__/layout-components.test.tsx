import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { SectionHeader } from '../presentation/templates/SectionHeader';
import { PageHeader } from '../presentation/templates/PageHeader';
import { TabNav } from '../presentation/molecules/TabNav';
import { AuditLogList } from '../presentation/organisms/AuditLogList';

describe('SectionHeader', () => {
  it('renders kicker, title, description, and actions', () => {
    render(
      <SectionHeader
        kicker="Overview"
        title="Account Settings"
        description="Manage your account preferences"
        actions={<button type="button">Save</button>}
      />
    );

    expect(screen.getByText('Overview')).toBeDefined();
    expect(screen.getByText('Account Settings')).toBeDefined();
    expect(screen.getByText('Manage your account preferences')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Save' })).toBeDefined();
  });
});

describe('PageHeader enhanced', () => {
  it('renders breadcrumbs, kicker, title, and actions', () => {
    render(
      <MemoryRouter>
        <PageHeader
          breadcrumbs={[
            { label: 'Home', to: '/' },
            { label: 'Settings', to: '/settings' },
            { label: 'Security' },
          ]}
          kicker="Security Panel"
          title="Two-Factor Auth"
          description="Protect your workspace"
          actions={<button type="button">Enable</button>}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Home')).toBeDefined();
    expect(screen.getByText('Settings')).toBeDefined();
    expect(screen.getByText('Security')).toBeDefined();
    expect(screen.getByText('Security Panel')).toBeDefined();
    expect(screen.getByText('Two-Factor Auth')).toBeDefined();
    expect(screen.getByText('Protect your workspace')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Enable' })).toBeDefined();
  });
});

describe('TabNav', () => {
  it('renders router links with active status', () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <TabNav
          items={[
            { label: 'General', to: '/general' },
            { label: 'Profile', to: '/profile' },
            { label: 'Billing', to: '/billing' },
          ]}
        />
      </MemoryRouter>
    );

    const profileLink = screen.getByText('Profile');
    expect(profileLink).toBeDefined();
    expect(profileLink.closest('a')?.getAttribute('href')).toBe('/profile');
  });
});

describe('AuditLogList', () => {
  it('renders empty state when no entries', () => {
    render(<AuditLogList entries={[]} emptyLabel="No activity recorded" />);
    expect(screen.getByText('No activity recorded')).toBeDefined();
  });

  it('renders list of entries with actor, action, and target', () => {
    render(
      <AuditLogList
        entries={[
          {
            id: '1',
            actor: 'alice@example.com',
            action: 'updated role',
            target: 'bob@example.com',
            at: '2026-11-06T12:00:00Z',
          },
        ]}
      />
    );

    expect(screen.getByText('alice@example.com')).toBeDefined();
    expect(screen.getByText('updated role')).toBeDefined();
    expect(screen.getByText('bob@example.com')).toBeDefined();
  });
});
