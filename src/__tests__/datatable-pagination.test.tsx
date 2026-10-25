import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { DataTable } from '../presentation/organisms/DataTable';
import { TablePagination } from '../presentation/organisms/DataTable';

afterEach(cleanup);

interface Row {
  id: string;
  name: string;
}

const rows: Row[] = Array.from({ length: 25 }, (_, i) => ({ id: `r${i}`, name: `Row ${i + 1}` }));
const columns = [{ id: 'name', header: 'Name', accessor: 'name' as const }];

describe('TablePagination page size', () => {
  it('renders the rows-per-page select only when wired', () => {
    render(<TablePagination page={1} totalPages={3} onPage={() => {}} />);
    expect(screen.queryByRole('combobox')).toBeNull();
  });

  it('reports the chosen size', () => {
    const onPageSize = vi.fn();
    render(
      <TablePagination page={1} totalPages={3} onPage={() => {}} pageSizeOptions={[10, 25]} pageSize={10} onPageSize={onPageSize} />
    );
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '25' } });
    expect(onPageSize).toHaveBeenCalledWith(25);
  });
});

describe('DataTable pageSizeOptions', () => {
  it('changes the page size and resets to the first page', () => {
    const onPageSizeChange = vi.fn();
    render(
      <DataTable
        data={rows}
        columns={columns}
        rowKey={(row) => row.id}
        paginated
        pageSize={10}
        pageSizeOptions={[10, 25]}
        onPageSizeChange={onPageSizeChange}
      />
    );
    expect(screen.getByText('Showing 1 to 10 of 25 results')).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByText('Showing 11 to 20 of 25 results')).toBeDefined();
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '25' } });
    expect(onPageSizeChange).toHaveBeenCalledWith(25);
    expect(screen.getByText('Showing 1 to 25 of 25 results')).toBeDefined();
  });
});
