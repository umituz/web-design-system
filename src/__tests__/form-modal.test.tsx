import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { FormModal } from '../presentation/organisms/FormModal';
import type { FormModalValues } from '../presentation/organisms/FormModal';

afterEach(cleanup);

const steps = [
  {
    title: 'Pair',
    fields: [
      { name: 'category', label: 'Category', type: 'select' as const, options: [{ value: 'alpha', label: 'Alpha' }, { value: 'beta', label: 'Beta' }] },
      {
        name: 'sub',
        label: 'Sub',
        type: 'select' as const,
        options: (values: FormModalValues) =>
          values.category === 'beta'
            ? [{ value: 'b1', label: 'B one' }, { value: 'b2', label: 'B two' }]
            : [{ value: 'a1', label: 'A one' }, { value: 'a2', label: 'A two' }],
      },
    ],
  },
];

function renderModal(onSubmit: (values: FormModalValues) => void) {
  return render(<FormModal title="Pair" steps={steps} onSubmit={onSubmit} onClose={() => {}} embedded />);
}

describe('FormModal dependent options', () => {
  it('resolves function options from the current values', () => {
    renderModal(() => {});
    const sub = screen.getByLabelText('Sub') as HTMLSelectElement;
    expect([...sub.options].map((o) => o.value)).toEqual(['a1', 'a2']);
    expect(screen.getByLabelText('Category') as unknown as HTMLSelectElement).toBeTruthy();
  });

  it('keeps a static-array default (first option) as the initial value', () => {
    renderModal(() => {});
    expect((screen.getByLabelText('Category') as HTMLSelectElement).value).toBe('alpha');
  });

  it('snaps a dependent select when its value leaves the resolved options', () => {
    const onSubmit = vi.fn();
    renderModal(onSubmit);

    const category = screen.getByLabelText('Category') as HTMLSelectElement;
    const sub = screen.getByLabelText('Sub') as HTMLSelectElement;

    fireEvent.change(sub, { target: { value: 'a2' } });
    fireEvent.change(category, { target: { value: 'beta' } });

    expect([...sub.options].map((o) => o.value)).toEqual(['b1', 'b2']);
    expect(sub.value).toBe('b1');

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSubmit).toHaveBeenCalledWith({ category: 'beta', sub: 'b1' });
  });

  it('leaves a dependent select alone while its value stays valid', () => {
    const onSubmit = vi.fn();
    renderModal(onSubmit);

    fireEvent.change(screen.getByLabelText('Sub'), { target: { value: 'a2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSubmit).toHaveBeenCalledWith({ category: 'alpha', sub: 'a2' });
  });
});
