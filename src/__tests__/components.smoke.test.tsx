/**
 * Component smoke tests — render the core surface without a host app.
 * Styling is asserted by class name (the compiled CSS is covered by the
 * styles contract test).
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';

afterEach(cleanup);
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
import { SearchBox } from '../presentation/molecules/SearchBox';
import { KpiCard } from '../presentation/organisms/KpiCard';
import { Modal } from '../presentation/organisms/Modal';
import { Drawer } from '../presentation/organisms/Drawer';
import { Timeline } from '../presentation/organisms/Timeline';
import { Checklist } from '../presentation/organisms/Checklist';
import { FormModal } from '../presentation/organisms/FormModal';
import { BatteryPill } from '../presentation/atoms/BatteryPill';
import { Kbd } from '../presentation/atoms/Kbd';

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
    expect(firstDataRow?.textContent).toContain('alpha');
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

  it('KpiCard alert applies destructive emphasis', () => {
    const { container } = render(<KpiCard label="Offline" value="3" alert />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('border-destructive');
    expect(el.className).toContain('bg-destructive');
  });

  it('KpiCard onClick is interactive and fires', () => {
    const onClick = vi.fn();
    const { container } = render(<KpiCard label="Open" value="7" onClick={onClick} />);
    const el = container.firstChild as HTMLElement;
    expect(el.getAttribute('role')).toBe('button');
    expect(el.className).toContain('cursor-pointer');
    fireEvent.click(el);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('SearchBox clears a non-empty value', () => {
    const onChange = vi.fn();
    render(<SearchBox value="wheat" onChange={onChange} placeholder="Find" />);
    expect(screen.getByPlaceholderText('Find')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('SearchBox renders no clear control when value is empty', () => {
    const { container } = render(<SearchBox value="" onChange={() => {}} />);
    expect(container.querySelector('button[aria-label="Clear search"]')).toBeNull();
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

describe('fleet aliases', () => {
  it('Badge tone alias, small and dot compose onto variant surface', () => {
    const { container } = render(<Badge tone="danger" small dot>Urgent</Badge>);
    const badge = container.querySelector('div');
    expect(badge?.className).toContain('bg-destructive');
    expect(badge?.className).toContain('text-xs');
    expect(badge?.querySelector('span')).not.toBeNull();
  });

  it('Button block stretches full width', () => {
    const { container } = render(<Button block>Continue</Button>);
    expect(container.querySelector('button')?.className).toContain('w-full');
  });

  it('Input renders a leading icon with padded control', () => {
    const { container } = render(<Input icon={<svg data-testid="i" />} placeholder="Search" />);
    expect(container.querySelector('[data-testid="i"]')).not.toBeNull();
    expect(container.querySelector('input')?.className).toContain('pl-9');
  });

  it('Modal subtitle renders as the description line', () => {
    render(<Modal open onClose={() => {}} title="Compare" subtitle="Two vehicles side by side" />);
    expect(screen.getByText('Two vehicles side by side')).toBeTruthy();
  });

  it('Progress label feeds the accessible name', () => {
    const { container } = render(<Progress value={50} label="Health score" />);
    expect(container.querySelector('[role="progressbar"]')?.getAttribute('aria-label')).toBe('Health score');
  });

  it('KpiCard violet icon tone applies violet chip classes', () => {
    const { container } = render(<KpiCard label="Market" value="12" icon={<span>x</span>} iconTone="violet" />);
    expect(container.querySelector('.text-violet-600')).not.toBeNull();
  });
});

describe('accessia supersets', () => {
  it('Drawer renders title, subtitle, footer and the wide size class', () => {
    render(
      <Drawer
        open
        onClose={() => {}}
        title="Panel"
        subtitle="Quick actions"
        wide
        footer={<button type="button">Save</button>}
      >
        <p>Panel body</p>
      </Drawer>
    );
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText('Panel')).toBeTruthy();
    expect(screen.getByText('Quick actions')).toBeTruthy();
    expect(screen.getByText('Panel body')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Save' })).toBeTruthy();
    expect(screen.getByRole('dialog').className).toContain('sm:max-w-2xl');
  });

  it('Drawer hides header and footer when only children are given', () => {
    render(
      <Drawer open onClose={() => {}}>
        <p>Only body</p>
      </Drawer>
    );
    expect(screen.getByText('Only body')).toBeTruthy();
    expect(screen.getByRole('dialog').querySelector('h2')).toBeNull();
  });

  it('Drawer eyebrow renders as the overline above the title', () => {
    render(
      <Drawer open onClose={() => {}} eyebrow="TASK · 2026" title="Panel">
        <p>Body</p>
      </Drawer>
    );
    const dialog = screen.getByRole('dialog');
    const overline = dialog.querySelector('p');
    expect(overline?.textContent).toBe('TASK · 2026');
    expect(overline?.className).toContain('uppercase');
    expect(dialog.querySelector('h2')?.textContent).toBe('Panel');
  });

  it('DataTable rowClass applies a per-row class', () => {
    const { container } = render(
      <DataTable<{ id: string; name: string; qty: number }>
        data={[
          { id: 'rc-b', name: 'rc-bravo', qty: 2 },
          { id: 'rc-a', name: 'rc-alpha', qty: 10 },
        ]}
        columns={[{ id: 'name', header: 'Name', accessor: 'name' }]}
        rowKey={(r) => r.id}
        rowClass={(r) => (r.qty > 5 ? 'row-overdue' : undefined)}
      />,
    );
    const trs = Array.from(container.querySelectorAll('tbody tr'));
    const alphaRow = trs.find((tr) => tr.textContent?.includes('rc-alpha'));
    const bravoRow = trs.find((tr) => tr.textContent?.includes('rc-bravo'));
    expect(alphaRow?.className).toContain('row-overdue');
    expect(bravoRow?.className).not.toContain('row-overdue');
  });

  it('Badge mono applies the mono font class', () => {
    const { container } = render(<Badge tone="danger" mono>ERR-4021</Badge>);
    expect(container.querySelector('div')?.className).toContain('font-mono');
  });

  it('Modal danger paints the title destructive with a warning icon', () => {
    render(
      <Modal open onClose={() => {}} title="Delete row" danger>
        <p>This cannot be undone</p>
      </Modal>
    );
    expect(screen.getByRole('dialog').className).toContain('border-destructive');
    expect(screen.getByText('Delete row').className).toContain('text-destructive');
    expect(screen.getByRole('dialog').querySelector('h2 svg')).not.toBeNull();
  });

  it('NativeSelect options prop renders option elements before children', () => {
    const { container } = render(
      <NativeSelect
        label="Sort"
        defaultValue="new"
        options={[
          { value: 'new', label: 'Newest' },
          { value: 'old', label: 'Oldest' },
        ]}
      >
        <option value="other">Other</option>
      </NativeSelect>
    );
    const options = container.querySelectorAll('option');
    expect(options).toHaveLength(3);
    expect(options[0]?.textContent).toBe('Newest');
    expect(options[2]?.textContent).toBe('Other');
  });

  it('DataTable initialSort orders rows before any header click', () => {
    interface Local {
      id: string;
      name: string;
    }
    render(
      <DataTable<Local>
        data={[
          { id: 'b', name: 'bravo' },
          { id: 'a', name: 'alpha' },
        ]}
        sortable
        initialSort={{ id: 'name', dir: 'asc' }}
        columns={[{ id: 'name', header: 'Name', accessor: 'name', sortable: true, sortValue: (r) => r.name }]}
      />,
    );
    expect(screen.getAllByRole('row')[1]?.textContent).toContain('alpha');
  });

  it('DataTable cell-only column works without accessor and honors controlled null sort', () => {
    interface Local {
      id: string;
      name: string;
    }
    const { container } = render(
      <DataTable<Local>
        data={[
          { id: 'cn-b', name: 'cn-bravo' },
          { id: 'cn-a', name: 'cn-alpha' },
        ]}
        sortable
        sort={null}
        onSortChange={() => {}}
        columns={[{ id: 'name', header: 'Name', cell: (r) => <em>{r.name}</em> }]}
      />,
    );
    const firstCell = container.querySelector('tbody td');
    expect(firstCell?.textContent).toContain('cn-bravo');
    expect(firstCell?.innerHTML).toContain('<em>');
  });

  it('Progress info tone paints the fill info', () => {
    render(<Progress value={60} tone="info" aria-label="load" />);
    expect(screen.getByRole('progressbar', { name: 'load' }).querySelector('div')?.className).toContain('bg-info');
  });

  it('BatteryPill clamps charge and tones low values destructive', () => {
    const neg = render(<BatteryPill pct={-5} />);
    expect(neg.container.textContent).toContain('0%');
    const crit = render(<BatteryPill pct={15} />);
    expect(crit.container.querySelector('span')?.className).toContain('text-destructive');
    const good = render(<BatteryPill pct={80} />);
    expect(good.container.querySelector('span')?.className).toContain('text-success');
  });

  it('Kbd renders key cap content', () => {
    const { container } = render(<Kbd>⌘K</Kbd>);
    expect(container.querySelector('kbd')?.textContent).toBe('⌘K');
  });

  it('Timeline renders newest first with tone dots and meta override', () => {
    const { container } = render(
      <Timeline
        items={[
          { at: '2026-01-01T09:00:00Z', title: 'First entry', tone: 'success' },
          { at: '2026-01-02T09:00:00Z', title: 'Second entry', tone: 'destructive', meta: 'Manual meta', body: 'detail copy' },
        ]}
      />,
    );
    const items = container.querySelectorAll('ol > li');
    expect(items).toHaveLength(2);
    expect(items[0]?.textContent).toContain('Second entry');
    expect(items[0]?.textContent).toContain('Manual meta');
    expect(items[0]?.textContent).toContain('detail copy');
    expect(items[1]?.textContent).toContain('First entry');
    const dots = container.querySelectorAll('li > span');
    expect(dots[0]?.className).toContain('bg-destructive');
    expect(dots[1]?.className).toContain('bg-success');
  });

  it('Checklist shows progress and toggles by id', () => {
    const onToggle = vi.fn();
    render(
      <Checklist
        onToggle={onToggle}
        items={[
          { id: 'a', label: 'Survey site', done: true, doneBy: 'Naomi', doneAt: '2026-10-01T10:00:00Z' },
          { id: 'b', label: 'Mount panel', done: false },
          { id: 'c', label: 'Wire zones', done: false },
        ]}
      />,
    );
    expect(screen.getByText('1 of 3 complete')).toBeTruthy();
    fireEvent.click(screen.getByText('Mount panel'));
    expect(onToggle).toHaveBeenCalledWith('b');
  });

  it('FormModal validates, advances steps and submits collected values', () => {
    const onSubmit = vi.fn();
    render(
      <FormModal
        title="FM submit flow"
        steps={[
          {
            title: 'Ident',
            fields: [
              { name: 'name', label: 'Full name', type: 'text', required: true },
              { name: 'tier', label: 'Tier', type: 'select', options: [{ value: 'basic', label: 'Basic' }, { value: 'pro', label: 'Pro' }] },
            ],
          },
          { title: 'Contact', fields: [{ name: 'email', label: 'Contact email', type: 'email', required: true, span: true }] },
        ]}
        onSubmit={onSubmit}
        onClose={() => {}}
      />,
    );
    expect(screen.getByText('Step 1 of 2')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByText('This field is required.')).toBeTruthy();
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Ada' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByText('Step 2 of 2')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByText('Step 1 of 2')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.change(screen.getByLabelText(/contact email/i), { target: { value: 'ada@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSubmit).toHaveBeenCalledWith({ name: 'Ada', tier: 'basic', email: 'ada@example.com' });
  });

  it('FormModal embedded mode renders a card with a checkbox field', () => {
    const onSubmit = vi.fn();
    render(
      <FormModal
        title="FM embedded card"
        embedded
        steps={[{ title: 'Only step', fields: [{ name: 'welcome', label: 'Send welcome email', type: 'checkbox', hint: 'First touch' }] }]}
        onSubmit={onSubmit}
        onClose={() => {}}
        submitLabel="Create"
      />,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
    const box = screen.getByRole('checkbox');
    expect(box).toBeTruthy();
    fireEvent.click(box);
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    expect(onSubmit).toHaveBeenCalledWith({ welcome: true });
  });
});
