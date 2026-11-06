import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { FilterSelect } from '../presentation/molecules/FilterSelect';
import { FilterBar } from '../presentation/organisms/FilterBar';
import {
  FilterPanel,
  FilterSection,
  CheckFilterList,
  SingleSelectFilterList,
} from '../presentation/organisms/FilterPanel';
import { NextSteps } from '../presentation/organisms/NextSteps';

describe('FilterSelect', () => {
  it('renders allLabel and options with aria-label', () => {
    const onChange = vi.fn();
    render(
      <FilterSelect
        value=""
        onChange={onChange}
        ariaLabel="Filter status"
        allLabel="All statuses"
        options={[
          { value: 'active', label: 'Active' },
          { value: 'pending', label: 'Pending' },
        ]}
      />
    );

    const select = screen.getByLabelText('Filter status') as HTMLSelectElement;
    expect(select).toBeDefined();
    expect(screen.getByText('All statuses')).toBeDefined();
    expect(screen.getByText('Active')).toBeDefined();

    fireEvent.change(select, { target: { value: 'active' } });
    expect(onChange).toHaveBeenCalledWith('active');
  });
});

describe('FilterBar', () => {
  it('renders search, children, and actions', () => {
    const onSearchChange = vi.fn();
    render(
      <FilterBar
        search={{
          value: 'query',
          onChange: onSearchChange,
          placeholder: 'Search items...',
        }}
        actions={<button type="button">Export</button>}
      >
        <span>Custom Filter</span>
      </FilterBar>
    );

    expect(screen.getByPlaceholderText('Search items...')).toBeDefined();
    expect(screen.getByText('Custom Filter')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Export' })).toBeDefined();
  });

  it('renders gracefully without search or actions', () => {
    const { container } = render(
      <FilterBar>
        <span>Only filters</span>
      </FilterBar>
    );
    expect(screen.getByText('Only filters')).toBeDefined();
    expect(container.querySelector('.udb-filter-bar')).not.toBeNull();
  });
});

describe('FilterPanel and Sections', () => {
  it('renders panel with title, clear button, and section', () => {
    const onClear = vi.fn();
    render(
      <FilterPanel title="Filters" onClear={onClear} clearLabel="Reset">
        <FilterSection title="Category">
          <span>Items</span>
        </FilterSection>
      </FilterPanel>
    );

    expect(screen.getByText('Filters')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeDefined();
    expect(screen.getByText('Category')).toBeDefined();
    expect(screen.getByText('Items')).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(onClear).toHaveBeenCalled();
  });

  it('handles CheckFilterList toggle and maxVisible', () => {
    const onToggle = vi.fn();
    const options = [
      { value: 'a', label: 'Alpha', count: 12 },
      { value: 'b', label: 'Beta', count: 4 },
      { value: 'c', label: 'Gamma' },
    ];

    render(
      <CheckFilterList
        options={options}
        selected={['a']}
        onToggle={onToggle}
      />
    );

    const alphaBtn = screen.getByRole('checkbox', { name: /Alpha/i });
    expect(alphaBtn.getAttribute('aria-checked')).toBe('true');
    expect(screen.getByText('12')).toBeDefined();

    fireEvent.click(alphaBtn);
    expect(onToggle).toHaveBeenCalledWith('a');
  });

  it('handles SingleSelectFilterList selection', () => {
    const onChange = vi.fn();
    const options = [
      { value: 'monthly', label: 'Monthly' },
      { value: 'yearly', label: 'Yearly' },
    ];

    render(
      <SingleSelectFilterList
        options={options}
        value="monthly"
        onChange={onChange}
      />
    );

    const yearlyBtn = screen.getByRole('radio', { name: /Yearly/i });
    expect(yearlyBtn.getAttribute('aria-checked')).toBe('false');

    fireEvent.click(yearlyBtn);
    expect(onChange).toHaveBeenCalledWith('yearly');
  });
});

describe('NextSteps', () => {
  it('renders lead text and navigation links', () => {
    render(
      <MemoryRouter>
        <NextSteps
          lead="Recommended Actions"
          links={[
            { to: '/dashboard/exam', label: 'Take Exam' },
            { to: '/dashboard/stats', label: 'View Stats' },
          ]}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Recommended Actions')).toBeDefined();
    expect(screen.getByText('Take Exam')).toBeDefined();
    expect(screen.getByText('View Stats')).toBeDefined();
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });
});
