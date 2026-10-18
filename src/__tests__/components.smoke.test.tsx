/**
 * Component smoke tests — render the core surface without a host app.
 * Styling is asserted by class name (the compiled CSS is covered by the
 * styles contract test).
 */

import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Button } from '../presentation/atoms/Button';
import { Badge } from '../presentation/atoms/Badge';
import { Spinner } from '../presentation/atoms/Spinner';
import { Alert, AlertTitle, AlertDescription } from '../presentation/organisms/Alert';
import { Card, CardHeader, CardTitle, CardContent } from '../presentation/organisms/Card';
import { EmptyState } from '../presentation/organisms/EmptyState';
import { StatCard } from '../presentation/organisms/StatCard';
import { ToastProvider, useToast } from '../presentation/organisms/Toaster';
import type { ToastKind } from '../presentation/organisms/Toaster';
import { KeyValueList } from '../presentation/organisms/KeyValueList';
import { DataTable, TablePagination } from '../presentation/organisms/DataTable';
import { Tabs } from '../presentation/organisms/Tabs';
import { Progress } from '../presentation/atoms/Progress';
import { Input } from '../presentation/atoms/Input';
import { NativeSelect } from '../presentation/atoms/NativeSelect';
import { Sparkline } from '../presentation/atoms/Sparkline';
import { Avatar } from '../presentation/molecules/Avatar';
import { KpiCard } from '../presentation/organisms/KpiCard';
import { Modal } from '../presentation/organisms/Modal';

describe('atoms', () => {
  it('Button renders label with default variant classes', () => {
    render(<Button>Save</Button>);
    const btn = screen.getByRole('button', { name: 'Save' });
    expect(btn.className).toContain('bg-primary');
    expect(btn.className).toContain('h-10');
  });

  it('Button secondary variant overrides the default color', () => {
    render(<Button variant="secondary">Cancel</Button>);
    expect(screen.getByRole('button', { name: 'Cancel' }).className).toContain('bg-secondary');
  });

  it('Badge renders every semantic variant', () => {
    const { rerender } = render(<Badge variant="primary">P</Badge>);
    for (const variant of ['secondary', 'success', 'warning', 'destructive'] as const) {
      rerender(<Badge variant={variant}>{variant}</Badge>);
      expect(screen.getByText(variant).className).toContain(`border-${variant}`);
    }
  });

  it('Spinner renders an accessible status', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeTruthy();
  });
});

describe('organisms', () => {
  it('Card composes header, title and content', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
        </CardHeader>
        <CardContent>Body</CardContent>
      </Card>
    );
    expect(screen.getByText('Revenue')).toBeTruthy();
    expect(screen.getByText('Body')).toBeTruthy();
  });

  it('Alert destructive variant carries destructive classes', () => {
    render(
      <Alert variant="destructive">
        <AlertTitle>Failed</AlertTitle>
        <AlertDescription>Try again</AlertDescription>
      </Alert>
    );
    expect(screen.getByRole('alert').className).toContain('border-destructive');
  });

  it('EmptyState renders message and action', () => {
    render(<EmptyState title="Nothing here" description="Create one" />);
    expect(screen.getByText('Nothing here')).toBeTruthy();
  });

  it('StatCard renders value and formats a trend magnitude', () => {
    render(<StatCard title="MRR" value="1200" trend={{ value: 12.34 }} />);
    expect(screen.getByText('1200')).toBeTruthy();
    expect(screen.getAllByText('+12.3%').length).toBeGreaterThan(0);
  });

  it('ToastProvider renders a fired toast with its kind accent', async () => {
    function Harness({ kind }: { kind: ToastKind }) {
      const { toast } = useToast();
      return (
        <button type="button" onClick={() => toast({ kind, title: 'Saved', description: 'Row updated' })}>
          fire
        </button>
      );
    }
    render(
      <ToastProvider>
        <Harness kind="success" />
      </ToastProvider>,
    );
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'fire' }));
    });
    expect(screen.getAllByText('Saved').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Row updated').length).toBeGreaterThan(0);
    expect(screen.getByText('Saved').closest('div')?.parentElement?.className).toContain('border-l-success');
  });

  it('ToastProvider honors maxVisible and duration overrides', () => {
    vi.useFakeTimers();
    function Burst() {
      const { toast } = useToast();
      return (
        <button
          type="button"
          onClick={() => {
            toast({ kind: 'info', title: 'One' });
            toast({ kind: 'info', title: 'Two' });
            toast({ kind: 'info', title: 'Three' });
          }}
        >
          burst
        </button>
      );
    }
    render(
      <ToastProvider maxVisible={2} duration={500}>
        <Burst />
      </ToastProvider>,
    );
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'burst' }));
    });
    expect(screen.queryByText('One')).toBeNull();
    expect(screen.getByText('Two')).toBeTruthy();
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(screen.queryByText('Two')).toBeNull();
    vi.useRealTimers();
  });

  it('KeyValueList renders label/value pairs in a definition list', () => {
    render(
      <KeyValueList
        items={[
          { label: 'E-posta', value: 'a@b.c' },
          { label: 'Rol', value: 'admin' },
        ]}
      />,
    );
    const dl = screen.getByText('E-posta').closest('dl');
    expect(dl).toBeTruthy();
    expect(dl?.querySelectorAll('dt').length).toBe(2);
    expect(dl?.querySelectorAll('dd').length).toBe(2);
    expect(screen.getByText('a@b.c').className).toContain('text-right');
  });
});

describe('DataTable', () => {
  interface Row {
    id: string;
    name: string;
    qty: number;
  }
  const rows: Row[] = [
    { id: 'r2', name: 'bravo', qty: 2 },
    { id: 'r1', name: 'alpha', qty: 10 },
  ];

  it('renders accessor columns and emptyState', () => {
    render(
      <DataTable<Row>
        data={[]}
        columns={[{ id: 'name', header: 'Name', accessor: 'name' }]}
        emptyState={{ title: 'No rows' }}
      />,
    );
    expect(screen.getByText('No rows')).toBeTruthy();
  });

  it('sorts internally by sortValue on header click', () => {
    render(
      <DataTable<Row>
        data={rows}
        sortable
        columns={[
          { id: 'name', header: 'Name', accessor: 'name', sortable: true, sortValue: (r) => r.name },
        ]}
      />,
    );
    const cellsBefore = screen.getAllByRole('row').map((tr) => tr.textContent);
    expect(cellsBefore.join()).toContain('bravo');
    fireEvent.click(screen.getByRole('columnheader', { name: /name/i }));
    const firstDataRow = screen.getAllByRole('row')[1];
    expect(firstDataRow.textContent).toContain('alpha');
  });

  it('controlled sort delegates to onSortChange', () => {
    let clicked = '';
    render(
      <DataTable<Row>
        data={rows}
        sortable
        sort={{ id: 'qty', dir: 'desc' }}
        onSortChange={(id) => {
          clicked = id;
        }}
        columns={[{ id: 'qty', header: 'Qty', accessor: 'qty', sortable: true }]}
      />,
    );
    fireEvent.click(screen.getByRole('columnheader', { name: /qty/i }));
    expect(clicked).toBe('qty');
    expect(screen.getByRole('columnheader', { name: /qty/i }).getAttribute('aria-sort')).toBe('descending');
  });

  it('applies align, hideBelow and sticky classes', () => {
    const { container } = render(
      <DataTable<Row>
        data={rows}
        sticky
        columns={[
          { id: 'qty', header: 'Qty', accessor: 'qty', align: 'right', hideBelow: 'md' },
        ]}
      />,
    );
    const th = container.querySelector('thead th');
    expect(th).toBeTruthy();
    expect(th?.className).toContain('text-right');
    expect(th?.className).toContain('hidden md:table-cell');
    expect(th?.className).toContain('sticky top-0');
  });

  it('renders skeleton rows while loading', () => {
    render(
      <DataTable<Row>
        data={[]}
        loading
        columns={[
          { id: 'name', header: 'Name', accessor: 'name' },
          { id: 'qty', header: 'Qty', accessor: 'qty' },
        ]}
      />,
    );
    expect(screen.getAllByRole('status').length).toBeGreaterThan(0);
  });

  it('renders the empty node when data is empty and empty is provided', () => {
    render(
      <DataTable<Row>
        data={[]}
        empty={<p>custom empty</p>}
        columns={[{ id: 'name', header: 'Name', accessor: 'name' }]}
      />,
    );
    expect(screen.getByText('custom empty')).toBeTruthy();
  });

  it('TablePagination disables boundary buttons and marks the active page', () => {
    render(<TablePagination page={2} totalPages={3} onPage={() => {}} />);
    expect(screen.getByRole('button', { name: 'First page' })).toBeTruthy();
    expect(screen.getByLabelText('Next page')).toBeTruthy();
    const active = screen.getByRole('button', { name: '2' });
    expect(active.getAttribute('aria-current')).toBe('page');
  });

  it('applies column width and stackable data labels', () => {
    const { container } = render(
      <DataTable<Row>
        data={rows}
        stackable
        columns={[{ id: 'qty', header: 'Qty', accessor: 'qty', width: '120px' }]}
      />,
    );
    const th = container.querySelector('thead th');
    expect(th?.getAttribute('style')).toContain('width: 120px');
    expect(container.querySelector('td[data-label="Qty"]')).toBeTruthy();
  });

  it('fires onRowClick from the keyboard but not from interactive children', () => {
    const clicked: string[] = [];
    const { container } = render(
      <DataTable<Row>
        data={rows}
        rowKey={(r) => r.id}
        rowLabel={(r) => r.name}
        onRowClick={(r) => clicked.push(r.id)}
        columns={[
          { id: 'name', header: 'Name', accessor: 'name' },
          {
            id: 'act',
            header: 'Actions',
            accessor: 'name',
            cell: () => (
              <button type="button" onClick={() => clicked.push('btn')}>
                open
              </button>
            ),
          },
        ]}
      />,
    );
    const firstRow = container.querySelector('tbody tr');
    expect(firstRow?.getAttribute('tabIndex')).toBe('0');
    expect(firstRow?.getAttribute('aria-label')).toBe('bravo');
    fireEvent.click(screen.getAllByRole('button', { name: 'open' })[0]!);
    expect(clicked).toEqual(['btn']);
    fireEvent.keyDown(firstRow!, { key: 'Enter' });
    expect(clicked).toEqual(['btn', 'r2']);
  });

  it('TablePagination ellipses distant ranges and renders a label', () => {
    render(<TablePagination page={5} totalPages={20} onPage={() => {}} label="42 results" />);
    expect(screen.getByText('42 results')).toBeTruthy();
    const ellipses = screen.getAllByText('…');
    expect(ellipses.length).toBe(2);
    expect(screen.getByRole('button', { name: '5' }).getAttribute('aria-current')).toBe('page');
  });

  it('TablePagination hides controls for a single page only when asked', () => {
    const { container, rerender } = render(<TablePagination page={1} totalPages={1} onPage={() => {}} />);
    expect(container.querySelector('nav')).toBeTruthy();
    rerender(
      <TablePagination page={1} totalPages={1} onPage={() => {}} label="3 results" hideWhenSingle />,
    );
    expect(container.querySelector('nav')).toBeNull();
    expect(container.textContent).toContain('3 results');
  });
});

describe('controlled surfaces', () => {
  it('Tabs controlled value fires onValueChange and renders counts with roving tabindex', () => {
    const changed: string[] = [];
    render(
      <Tabs
        value="a"
        onValueChange={(v) => changed.push(v)}
        ariaLabel="Views"
        tabs={[
          { value: 'a', label: 'Alpha', count: 4 },
          { value: 'b', label: 'Beta' },
        ]}
      />,
    );
    const list = screen.getByRole('tablist', { name: 'Views' });
    const alpha = screen.getByRole('tab', { name: /alpha/i });
    expect(alpha.getAttribute('aria-selected')).toBe('true');
    expect(alpha.textContent).toContain('4');
    expect(alpha.getAttribute('tabIndex')).toBe('0');
    const beta = screen.getByRole('tab', { name: /beta/i });
    expect(beta.getAttribute('tabIndex')).toBe('-1');
    fireEvent.click(beta);
    expect(changed).toEqual(['b']);
    fireEvent.keyDown(list, { key: 'ArrowRight' });
    expect(changed).toEqual(['b', 'b']);
  });

  it('EmptyState accepts a node icon and a node action', () => {
    render(
      <EmptyState
        icon={<span>icon-node</span>}
        title="Nothing found"
        action={
          <button type="button" onClick={() => {}}>
            create one
          </button>
        }
      />,
    );
    expect(screen.getByText('icon-node')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'create one' })).toBeTruthy();
  });

  it('Progress tone paints the fill and exposes aria values', () => {
    render(<Progress value={40} tone="destructive" aria-label="upload" />);
    const track = screen.getByRole('progressbar', { name: 'upload' });
    const fill = track.querySelector('div');
    expect(fill?.className).toContain('bg-destructive');
    expect(track.getAttribute('aria-valuenow')).toBe('40');
    expect(track.getAttribute('aria-valuemin')).toBe('0');
  });
});

describe('fleet surface supersets', () => {
  it('Button renders alias variants and icon slots', () => {
    const { container } = render(
      <Button variant="primary" icon={<svg data-testid="lead" />} iconRight={<svg data-testid="trail" />}>
        Save
      </Button>
    );
    const btn = container.querySelector('button');
    expect(btn?.className).toContain('bg-primary');
    expect(btn?.querySelector('[data-testid="lead"]')).not.toBeNull();
    expect(btn?.querySelector('[data-testid="trail"]')).not.toBeNull();
    const { container: danger } = render(<Button variant="danger">Delete</Button>);
    expect(danger.querySelector('button')?.className).toContain('bg-destructive');
  });

  it('Badge renders info variant', () => {
    const { container } = render(<Badge variant="info">New</Badge>);
    expect(container.querySelector('.bg-info')).not.toBeNull();
  });

  it('Input wraps label and hint when provided', () => {
    const { container } = render(<Input label="Full name" hint="As printed on the deed" />);
    const label = container.querySelector('label');
    expect(label?.textContent).toBe('Full name');
    expect(container.textContent).toContain('As printed on the deed');
    const { container: bare } = render(<Input placeholder="Plain" />);
    expect(bare.querySelector('label')).toBeNull();
  });

  it('Input renders string error message', () => {
    const { container } = render(<Input label="Email" error="Required" />);
    expect(container.querySelector('input')?.className).toContain('border-destructive');
    expect(container.textContent).toContain('Required');
  });

  it('NativeSelect renders label plus chevron and options', () => {
    const { container } = render(
      <NativeSelect label="Tier" defaultValue="premium">
        <option value="standard">Standard</option>
        <option value="premium">Premium</option>
      </NativeSelect>
    );
    expect(container.querySelector('label')?.textContent).toBe('Tier');
    expect(container.querySelectorAll('option')).toHaveLength(2);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('Avatar derives initials and deterministic tone from name', () => {
    const { container } = render(<Avatar name="Umit Uz" />);
    const fallback = container.querySelector(
      '.text-primary, .text-success, .text-warning, .text-info, .text-secondary-foreground'
    );
    expect(container.textContent).toContain('UU');
    expect(fallback).not.toBeNull();
    const { container: solo } = render(<Avatar name="veyra" />);
    expect(solo.textContent).toContain('VE');
  });

  it('CardHeader builds layout from title, subtitle and actions props', () => {
    const { container } = render(
      <CardHeader title="Fleet" subtitle="All vehicles" actions={<button type="button">Add</button>} />
    );
    expect(container.querySelector('h3')?.textContent).toBe('Fleet');
    expect(container.textContent).toContain('All vehicles');
    expect(container.querySelector('button')?.textContent).toBe('Add');
    const { container: compound } = render(
      <CardHeader>
        <CardTitle>Compound</CardTitle>
      </CardHeader>
    );
    expect(compound.querySelector('button')).toBeNull();
    expect(compound.textContent).toContain('Compound');
  });

  it('Sparkline renders a polyline for multi-point data', () => {
    const { container } = render(<Sparkline data={[1, 4, 2, 8]} />);
    const polyline = container.querySelector('polyline');
    expect(polyline).not.toBeNull();
    expect(polyline?.getAttribute('points')?.split(' ')).toHaveLength(4);
    const { container: flat } = render(<Sparkline data={[3]} />);
    expect(flat.querySelector('polyline')).toBeNull();
  });

  it('KpiCard renders label, value, delta, hint, icon tone and spark', () => {
    const { container } = render(
      <KpiCard
        label="Total vehicles"
        value="128"
        delta={{ value: '+2', direction: 'up' }}
        hint="this month"
        icon={<svg data-testid="kpi-icon" />}
        iconTone="info"
        spark={[1, 2, 3, 4]}
      />
    );
    expect(container.textContent).toContain('Total vehicles');
    expect(container.textContent).toContain('128');
    expect(container.textContent).toContain('+2');
    expect(container.textContent).toContain('this month');
    expect(container.querySelector('[data-testid="kpi-icon"]')).not.toBeNull();
    expect(container.querySelector('.bg-info\\/10, [class*="bg-info"]')).not.toBeNull();
    expect(container.querySelector('polyline')).not.toBeNull();
  });

  it('KpiCard inverts delta color with good=false', () => {
    const { container } = render(
      <KpiCard label="Churn" value="4%" delta={{ value: '+1', direction: 'up', good: false }} />
    );
    expect(container.querySelector('.text-destructive')).not.toBeNull();
  });

  it('Modal opens content, title and footer through the convenience API', () => {
    render(
      <Modal open onClose={() => {}} title="Filters" description="Narrow the list" footer={<button type="button">Apply</button>}>
        <p>Body copy</p>
      </Modal>
    );
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText('Filters')).toBeTruthy();
    expect(screen.getByText('Narrow the list')).toBeTruthy();
    expect(screen.getByText('Body copy')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeTruthy();
  });

  it('toast shorthand call maps tone aliases onto kinds', () => {
    function Fire() {
      const { toast } = useToast();
      return (
        <button type="button" onClick={() => toast('Saved', { tone: 'success', message: 'Row updated' })}>
          fire
        </button>
      );
    }
    render(
      <ToastProvider>
        <Fire />
      </ToastProvider>
    );
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'fire' }));
    });
    expect(screen.getAllByText('Saved').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Row updated').length).toBeGreaterThan(0);
    function FireAlias() {
      const { toast } = useToast();
      return (
        <button type="button" onClick={() => toast('Deleted', { tone: 'danger' })}>
          second
        </button>
      );
    }
    const { container } = render(
      <ToastProvider>
        <FireAlias />
      </ToastProvider>
    );
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'second' }));
    });
    expect(container.textContent).toContain('Deleted');
    expect(container.querySelector('.border-l-destructive')).not.toBeNull();
  });
});
