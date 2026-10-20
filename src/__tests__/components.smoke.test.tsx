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
import { Breadcrumbs } from '../presentation/organisms/Breadcrumb';
import { Card, CardHeader, CardTitle, CardContent } from '../presentation/organisms/Card';
import { CommandPalette } from '../presentation/organisms/CommandPalette';
import { EmptyState } from '../presentation/organisms/EmptyState';
import { StatCard } from '../presentation/organisms/StatCard';
import { ToastProvider, useToast } from '../presentation/organisms/Toaster';
import type { ToastKind } from '../presentation/organisms/Toaster';
import { KeyValueList } from '../presentation/organisms/KeyValueList';
import { DataTable, TablePagination } from '../presentation/organisms/DataTable';
import { Tabs } from '../presentation/organisms/Tabs';
import { Progress } from '../presentation/atoms/Progress';
import { ProgressRing } from '../presentation/atoms/ProgressRing';
import { Input } from '../presentation/atoms/Input';
import { Textarea } from '../presentation/atoms/Textarea';
import { NativeSelect } from '../presentation/atoms/NativeSelect';
import { Sparkline } from '../presentation/atoms/Sparkline';
import { Avatar } from '../presentation/molecules/Avatar';
import { SearchBox } from '../presentation/molecules/SearchBox';
import { Chip } from '../presentation/molecules/Chip';
import { KpiCard } from '../presentation/organisms/KpiCard';
import { Modal } from '../presentation/organisms/Modal';
import { Drawer } from '../presentation/organisms/Drawer';
import { Timeline } from '../presentation/organisms/Timeline';
import { Checklist } from '../presentation/organisms/Checklist';
import { FormModal } from '../presentation/organisms/FormModal';
import { ConfirmDialog } from '../presentation/organisms/ConfirmDialog';
import { StatusBadge } from '../presentation/organisms/StatusBadge';
import { Lightbox } from '../presentation/organisms/Lightbox';
import { StatPill } from '../presentation/molecules/StatPill';
import { BatteryPill } from '../presentation/atoms/BatteryPill';
import { Kbd } from '../presentation/atoms/Kbd';
import { CalendarBoard } from '../presentation/organisms/CalendarBoard';
import type { CalendarEvent } from '../presentation/organisms/CalendarBoard';

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

  it('Badge outline variant stays transparent', () => {
    render(<Badge variant="outline">draft</Badge>);
    expect(screen.getByText('draft').className).toContain('bg-transparent');
    expect(screen.getByText('draft').className).toContain('border-border');
  });

  it('Spinner renders an accessible status', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeTruthy();
  });

  it('Textarea wires label, error text and rows', () => {
    render(<Textarea label="Notes" error="required" rows={4} />);
    const box = screen.getByRole('textbox', { name: 'Notes' });
    expect(box.getAttribute('rows')).toBe('4');
    expect(box.getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText('required').className).toContain('text-destructive');
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

  it('Alert carries tone classes for info, warning and success', () => {
    const { rerender } = render(
      <Alert variant="info">
        <AlertTitle>Heads up</AlertTitle>
      </Alert>
    );
    expect(screen.getByRole('alert').className).toContain('border-info');
    rerender(
      <Alert variant="warning">
        <AlertTitle>Check</AlertTitle>
      </Alert>
    );
    expect(screen.getByRole('alert').className).toContain('border-warning');
    rerender(
      <Alert variant="success">
        <AlertTitle>Done</AlertTitle>
      </Alert>
    );
    expect(screen.getByRole('alert').className).toContain('border-success');
  });

  it('Breadcrumbs renders custom content nodes for SPA router links', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Home', content: <a href="/home">Home</a> },
          { label: 'Library', href: '/library' },
          { label: 'Word list' },
        ]}
      />
    );
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(nav.textContent).toContain('Home');
    expect(nav.textContent).toContain('Word list');
    // custom content anchor + the href-based Link, plain label renders no anchor
    const anchors = nav.querySelectorAll('a');
    expect(anchors.length).toBe(2);
    expect(anchors[0]?.getAttribute('href')).toBe('/home');
    expect(anchors[1]?.getAttribute('href')).toBe('/library');
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

  it('selectable rows fire onSelectionChange and expose the bulkBar selection', () => {
    const calls: string[][] = [];
    render(
      <DataTable<Row>
        data={rows}
        rowKey={(r) => r.id}
        selectable
        onSelectionChange={(ids) => calls.push([...ids])}
        bulkBar={({ ids, clear }) => (
          <div>
            <span>{ids.length} selected</span>
            <button type="button" onClick={clear}>
              clear
            </button>
          </div>
        )}
        columns={[{ id: 'name', header: 'Name', accessor: 'name' }]}
      />,
    );
    const boxes = screen.getAllByRole('checkbox');
    expect(boxes.length).toBe(3);
    expect(screen.queryByText('1 selected')).toBeNull();
    fireEvent.click(boxes[1]!);
    expect(calls[calls.length - 1]).toEqual(['r2']);
    expect(screen.getByText('1 selected')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'clear' }));
    expect(calls[calls.length - 1]).toEqual([]);
    expect(screen.queryByText('1 selected')).toBeNull();
  });

  it('header checkbox toggles the page and reflects partial selection', () => {
    render(
      <DataTable<Row>
        data={rows}
        rowKey={(r) => r.id}
        selectable
        columns={[{ id: 'name', header: 'Name', accessor: 'name' }]}
      />,
    );
    const header = screen.getAllByRole('checkbox')[0] as HTMLInputElement;
    const first = screen.getAllByRole('checkbox')[1] as HTMLInputElement;
    fireEvent.click(first);
    expect(header.indeterminate).toBe(true);
    fireEvent.click(header);
    const boxes = screen.getAllByRole('checkbox') as HTMLInputElement[];
    expect(boxes.map((box) => box.checked)).toEqual([true, true, true]);
    fireEvent.click(header);
    expect(boxes.slice(1).every((box) => !box.checked)).toBe(true);
    expect(header.indeterminate).toBe(false);
  });

  it('hides optional columns until enabled and offers the columns menu with the toolbar', () => {
    render(
      <DataTable<Row>
        data={rows}
        toolbar={<input aria-label="filter rows" />}
        columns={[
          { id: 'name', header: 'Name', accessor: 'name' },
          { id: 'qty', header: 'Qty', accessor: 'qty', optional: true },
        ]}
      />,
    );
    expect(screen.getByRole('columnheader', { name: /name/i })).toBeTruthy();
    expect(screen.queryByRole('columnheader', { name: /qty/i })).toBeNull();
    expect(screen.queryByText('10')).toBeNull();
    expect(screen.getByRole('button', { name: /columns/i })).toBeTruthy();
    expect(screen.getByLabelText('filter rows')).toBeTruthy();
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

  it('ProgressRing paints the arc, clamps overshoot and shows the percentage', () => {
    render(<ProgressRing value={140} tone="success" label="gear readiness" />);
    const ring = screen.getByRole('progressbar', { name: 'gear readiness' });
    expect(ring.getAttribute('aria-valuenow')).toBe('100');
    const arc = ring.querySelectorAll('circle')[1];
    expect(arc?.getAttribute('class')).toContain('stroke-success');
    expect(screen.getByText('100%')).toBeTruthy();
  });

  it('ProgressRing hides the value label on demand', () => {
    render(<ProgressRing value={62} showValue={false} aria-label="capacity" />);
    expect(screen.queryByText('62%')).toBeNull();
    const ring = screen.getByRole('progressbar', { name: 'capacity' });
    expect(ring.getAttribute('aria-valuenow')).toBe('62');
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

  it('KpiCard valueTone paints the metric value', () => {
    const { container } = render(<KpiCard label="Overdue" value="7" valueTone="destructive" />);
    expect(container.querySelector('.text-2xl')!.className).toContain('text-destructive');
  });

  it('KpiCard alert applies destructive emphasis', () => {
    const { container } = render(<KpiCard label="Offline" value="3" alert />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('border-destructive');
    expect(el.className).toContain('bg-destructive');
  });

  it('KpiCard flat delta renders muted without an icon', () => {
    const { container } = render(<KpiCard label="Renewals" value="4" delta={{ value: '4 renew ≤45d', direction: 'flat' }} />);
    expect(container.textContent).toContain('4 renew ≤45d');
    const delta = container.querySelector('.text-muted-foreground + span, span.inline-flex');
    expect(container.querySelector('svg.lucide-trending-up, svg.lucide-trending-down')).toBeNull();
    expect(delta).not.toBeNull();
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

describe('shell sweep surface (4.18)', () => {
  it('Button ink and onInk variants paint their surfaces', () => {
    const { container } = render(<Button variant="ink">Ink</Button>);
    expect(container.querySelector('button')?.className).toContain('bg-foreground');
    const { container: onInk } = render(<Button variant="onInk">On ink</Button>);
    expect(onInk.querySelector('button')?.className).toContain('bg-background');
  });

  it('Card asChild merges onto the child and interactive adds pointer classes', () => {
    const { container } = render(
      <Card asChild interactive>
        <a href="/x">Card link</a>
      </Card>
    );
    const link = container.querySelector('a');
    expect(link?.className).toContain('bg-card');
    expect(link?.className).toContain('cursor-pointer');
    expect(container.querySelector('div')).toBeNull();
  });

  it('Tabs showPanel=false renders the list only', () => {
    const { container } = render(
      <Tabs tabs={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]} value="a" showPanel={false} />
    );
    expect(container.querySelector('[role="tablist"]')).not.toBeNull();
    expect(container.querySelector('[role="tabpanel"]')).toBeNull();
  });

  it('Chip selected toggles primary tone with aria-pressed', () => {
    const { container } = render(
      <Chip label="Active" selected removable={false} onClick={() => {}} />
    );
    const chip = container.querySelector('[aria-pressed="true"]');
    expect(chip?.className).toContain('bg-primary');
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

  it('Input renders prefix and suffix adornments with padded control', () => {
    const { container } = render(<Input prefix="$" suffix="per book" />);
    expect(container.querySelector('input')?.className).toContain('pl-7');
    expect(container.querySelector('input')?.className).toContain('pr-7');
    expect(container.querySelector('span[aria-hidden]')?.textContent).toBe('$');
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

  it('FormModal seeds values from initial and renders preview above fields', () => {
    const onSubmit = vi.fn();
    render(
      <FormModal
        title="FM edit"
        initial={{ name: 'Ada', tier: 'pro' }}
        preview={<p>Edit note</p>}
        steps={[
          {
            title: 'Ident',
            fields: [
              { name: 'name', label: 'Full name', type: 'text', required: true },
              { name: 'tier', label: 'Tier', type: 'select', options: [{ value: 'basic', label: 'Basic' }, { value: 'pro', label: 'Pro' }] },
            ],
          },
        ]}
        onSubmit={onSubmit}
        onClose={() => {}}
      />,
    );
    expect(screen.getByText('Edit note')).toBeTruthy();
    expect((screen.getByLabelText(/full name/i) as HTMLInputElement).value).toBe('Ada');
    expect((screen.getByLabelText(/tier/i) as HTMLSelectElement).value).toBe('pro');
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSubmit).toHaveBeenCalledWith({ name: 'Ada', tier: 'pro' });
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

  it('FormModal honours custom button and validation labels', () => {
    const onSubmit = vi.fn();
    render(
      <FormModal
        title="FM i18n"
        cancelLabel="Vazgeç"
        continueLabel="Devam"
        backLabel="Geri"
        submitLabel="Kaydet"
        requiredMessage="Zorunlu alan."
        steps={[
          {
            title: 'Kimlik',
            fields: [
              { name: 'name', label: 'Ad', type: 'text', required: true },
            ],
          },
          { title: 'İletişim', fields: [{ name: 'email', label: 'E-posta', type: 'email' }] },
        ]}
        onSubmit={onSubmit}
        onClose={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Devam' }));
    expect(screen.getByText('Zorunlu alan.')).toBeTruthy();
    fireEvent.change(screen.getByLabelText(/Ad/), { target: { value: 'Ada' } });
    fireEvent.click(screen.getByRole('button', { name: 'Devam' }));
    fireEvent.click(screen.getByRole('button', { name: 'Geri' }));
    fireEvent.click(screen.getByRole('button', { name: 'Devam' }));
    fireEvent.click(screen.getByRole('button', { name: 'Kaydet' }));
    expect(onSubmit).toHaveBeenCalledWith({ name: 'Ada', email: '' });
  });

  it('ConfirmDialog confirms and closes, cancel only closes', () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    render(
      <ConfirmDialog title="Delete row?" body="This cannot be undone." confirmLabel="Delete" onConfirm={onConfirm} onClose={onClose} />,
    );
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText('This cannot be undone.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});

describe('status + stat surfaces', () => {
  it('StatusBadge resolves vocab entries and falls back to neutral raw value', () => {
    const vocab = {
      active: { label: 'Active', tone: 'success' as const },
      held: { label: 'On hold', tone: 'warning' as const },
    };
    const { rerender } = render(<StatusBadge vocab={vocab} value="active" />);
    const el = screen.getByText('Active');
    expect(el.className).toContain('bg-success');
    expect(el.className).not.toContain('font-mono');
    rerender(<StatusBadge vocab={vocab} value="unknown-state" />);
    expect(screen.getByText('unknown-state').className).toContain('bg-secondary');
  });

  it('StatPill renders value over label with tone coloring', () => {
    const { container } = render(<StatPill label="Open tasks" value={12} tone="destructive" />);
    const pill = container.firstElementChild as HTMLElement;
    expect(pill.className).toContain('bg-muted/40');
    const value = pill.firstElementChild as HTMLElement;
    expect(value.className).toContain('text-destructive');
    expect(screen.getByText('Open tasks').className).toContain('text-muted-foreground');
  });

  it('Lightbox opens with media, zoom toggles on click and Escape closes', () => {
    const onClose = vi.fn();
    render(
      <Lightbox open onClose={onClose} alt="Engine bay photo" caption="Motor · 12.400 km">
        <img src="engine.png" alt="" />
      </Lightbox>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeTruthy();
    const zoomWrap = dialog.querySelector('.cursor-zoom-in') as HTMLElement;
    expect(zoomWrap).toBeTruthy();
    fireEvent.click(zoomWrap);
    expect(zoomWrap.className).toContain('cursor-zoom-out');
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});

describe('calendar board', () => {
  const events: CalendarEvent[] = [
    { id: 'f1', date: '2026-03-10', time: '09:30', title: 'IST to GVA', tone: 'primary' },
    { id: 'f2', date: '2026-03-10', time: '07:00', title: 'AOG check', tone: 'warning' },
    { id: 'f3', date: '2026-03-10', time: '07:15', title: 'Crew brief', tone: 'info' },
    { id: 'f4', date: '2026-03-10', time: '07:45', title: 'Catering', tone: 'neutral' },
    { id: 'm1', date: '2026-03-12', time: '14:00', title: 'C-check window', tone: 'danger' },
  ];

  it('renders a 42-cell month grid with the event chip on its day and +N overflow', () => {
    render(
      <CalendarBoard
        events={events}
        initialDate="2026-03-10"
        legend={[{ tone: 'primary', label: 'Flight' }, { tone: 'danger', label: 'Maintenance' }]}
      />,
    );
    expect(screen.getByText('Flight')).toBeTruthy();
    expect(screen.getByText('Maintenance')).toBeTruthy();
    expect(screen.getByText('AOG check')).toBeTruthy(); // earliest three, time-sorted, survive the cap
    expect(screen.queryByText('IST to GVA')).toBeNull(); // 09:30 falls past maxPerDay
    expect(screen.getByText('+1')).toBeTruthy();
    // month title + 42 day numbers rendered
    expect(screen.getByText('March 2026')).toBeTruthy();
    expect(screen.getAllByText('10').length).toBeGreaterThan(0);
  });

  it('fires onViewEvent from a chip and onSelectDate from a cell', () => {
    const onViewEvent = vi.fn();
    const onSelectDate = vi.fn();
    render(<CalendarBoard events={events} initialDate="2026-03-10" onViewEvent={onViewEvent} onSelectDate={onSelectDate} />);
    fireEvent.click(screen.getByText('C-check window'));
    expect(onViewEvent).toHaveBeenCalledWith(expect.objectContaining({ id: 'm1' }));
    fireEvent.click(screen.getAllByText('15')[0]!);
    expect(onSelectDate).toHaveBeenCalledWith(expect.stringMatching(/^2026-03-1[05]$/));
  });

  it('groups the day view by hour rows and switches views through the header', () => {
    render(<CalendarBoard events={events} initialDate="2026-03-10" view="day" />);
    expect(screen.getAllByText('07:00').length).toBe(2); // hour label + chip time
    expect(screen.getAllByText('09:00').length).toBe(1); // hour label only — the chip reads 09:30
    expect(screen.queryByText('C-check window')).toBeNull(); // other day entirely — its hour label still grids
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Nothing scheduled.')).toBeTruthy();
    fireEvent.click(screen.getByText('Today'));
    expect(screen.getByText(/October \d{1,2}, 2026/)).toBeTruthy(); // cursor jumped to the real today
  });

  it('stacks the week view by weekday columns', () => {
    render(<CalendarBoard events={events} initialDate="2026-03-10" view="week" />);
    expect(screen.getByText('C-check window')).toBeTruthy();
    expect(screen.getByText('Crew brief')).toBeTruthy();
  });
});

describe('CommandPalette (4.19)', () => {
  const coursesSelect = vi.fn();
  const groups = [
    {
      heading: 'Go to',
      items: [
        { id: 'home', label: 'Home', hint: '/app', onSelect: vi.fn() },
        { id: 'courses', label: 'Courses', keywords: 'lessons learning', onSelect: coursesSelect },
      ],
    },
    {
      heading: 'Actions',
      items: [
        { id: 'theme', label: 'Toggle theme', onSelect: vi.fn() },
        { id: 'nuke', label: 'Delete everything', danger: true, onSelect: vi.fn() },
      ],
    },
  ];
  const open = vi.fn();

  const renderPalette = () => render(<CommandPalette open onOpenChange={open} groups={groups} />);

  it('renders grouped options and the combobox when open', () => {
    renderPalette();
    expect(screen.getByRole('combobox')).toBeTruthy();
    expect(screen.getByRole('option', { name: /home/i })).toBeTruthy();
    expect(screen.getByText('Go to')).toBeTruthy();
    expect(screen.getByText('Actions')).toBeTruthy();
    expect(screen.getByRole('option', { name: /delete everything/i })).toBeTruthy();
  });

  it('filters by label and keywords, hides empty groups', () => {
    renderPalette();
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'less' } });
    expect(screen.getByRole('option', { name: /courses/i })).toBeTruthy();
    expect(screen.queryByRole('option', { name: /home/i })).toBeNull();
    expect(screen.getByText('Go to')).toBeTruthy(); // Courses survived via keywords
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'delete' } });
    expect(screen.queryByText('Go to')).toBeNull(); // only the Actions group matched
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'zzz' } });
    expect(screen.getByText('No results.')).toBeTruthy();
  });

  it('Enter runs the highlighted option and closes; arrows move the selection', () => {
    renderPalette();
    const input = screen.getByRole('combobox');
    fireEvent.keyDown(input, { key: 'ArrowDown' }); // Home → Courses
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(coursesSelect).toHaveBeenCalled();
    expect(open).toHaveBeenCalledWith(false);
  });

  it('Escape closes via the Radix dialog', () => {
    renderPalette();
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' });
    expect(open).toHaveBeenCalledWith(false);
  });
});
