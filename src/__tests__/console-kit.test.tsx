import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import {
  ConsoleLabelsProvider,
  DEFAULT_CONSOLE_LABELS,
  formatTemplate,
  mergeLabels,
} from '../presentation/page-kit/console-labels';
import { NoResults } from '../presentation/organisms/NoResults';
import { ErrorState } from '../presentation/organisms/ErrorState';
import { validateForm, validateValue } from '../presentation/organisms/FormDrawer';

afterEach(cleanup);

describe('formatTemplate', () => {
  it('interpolates single-brace tokens', () => {
    expect(formatTemplate('En az {min} olmalı', { min: 3 })).toBe('En az 3 olmalı');
  });

  it('keeps unknown tokens intact', () => {
    expect(formatTemplate('{a} {b}', { a: 1 })).toBe('1 {b}');
  });
});

describe('mergeLabels', () => {
  it('deep-merges without mutating defaults', () => {
    const merged = mergeLabels(DEFAULT_CONSOLE_LABELS, {
      form: { cancel: 'Vazgeç' },
      toolbar: { search: 'Ara' },
    });
    expect(merged.form.cancel).toBe('Vazgeç');
    expect(merged.form.save).toBe('Save');
    expect(merged.toolbar.search).toBe('Ara');
    expect(DEFAULT_CONSOLE_LABELS.form.cancel).toBe('Cancel');
  });
});

describe('validateValue', () => {
  const msg = 'x';
  it('flags empty required values only', () => {
    expect(validateValue('', [{ type: 'required', message: msg }])).toBe(msg);
    expect(validateValue('a', [{ type: 'required', message: msg }])).toBeNull();
  });

  it('checks numeric bounds', () => {
    expect(validateValue(5, [{ type: 'min', value: 10, message: msg }])).toBe(msg);
    expect(validateValue(15, [{ type: 'max', value: 10, message: msg }])).toBe(msg);
    expect(validateValue('10', [{ type: 'max', value: 10, message: msg }])).toBeNull();
  });

  it('checks minLength, email and date shapes', () => {
    expect(validateValue('ab', [{ type: 'minLength', value: 3, message: msg }])).toBe(msg);
    expect(validateValue('nope', [{ type: 'email', message: msg }])).toBe(msg);
    expect(validateValue('a@b.co', [{ type: 'email', message: msg }])).toBeNull();
    expect(validateValue('2026-13-01', [{ type: 'date', message: msg }])).toBeNull();
    expect(validateValue('2026-11-27', [{ type: 'date', message: msg }])).toBeNull();
  });

  it('skips non-required rules for empty values', () => {
    expect(validateValue('', [{ type: 'email', message: msg }])).toBeNull();
  });
});

describe('validateForm', () => {
  it('collects errors per field', () => {
    const errors = validateForm(
      { a: '', b: 'ok' },
      { a: [{ type: 'required', message: 'req' }], b: [{ type: 'required', message: 'req' }] },
    );
    expect(Object.keys(errors)).toEqual(['a']);
  });
});

describe('NoResults', () => {
  it('renders localized preset strings from the provider', () => {
    render(
      <ConsoleLabelsProvider labels={{ noResults: { title: 'Eşleşen kayıt yok', description: 'Filtreleri değiştirin', clear: 'Temizle' } }}>
        <NoResults onClear={() => {}} />
      </ConsoleLabelsProvider>,
    );
    expect(screen.getByText('Eşleşen kayıt yok')).toBeDefined();
    expect(screen.getByText('Temizle')).toBeDefined();
  });

  it('falls back to default labels without a provider', () => {
    render(<NoResults />);
    expect(screen.getByText(DEFAULT_CONSOLE_LABELS.noResults.title)).toBeDefined();
  });
});

describe('ErrorState', () => {
  it('preset mode fills title and description from labels', () => {
    render(
      <ConsoleLabelsProvider labels={{ errorState: { title: 'Hata', description: 'Yüklenemedi', retry: 'Tekrar dene' } }}>
        <ErrorState onRetry={() => {}} />
      </ConsoleLabelsProvider>,
    );
    expect(screen.getByText('Hata')).toBeDefined();
    expect(screen.getByText('Yüklenemedi')).toBeDefined();
    expect(screen.getByText('Tekrar dene')).toBeDefined();
  });

  it('explicit title keeps description opt-in behavior', () => {
    render(<ErrorState title="Custom" onRetry={() => {}} />);
    expect(screen.getByText('Custom')).toBeDefined();
    expect(screen.queryByText(DEFAULT_CONSOLE_LABELS.errorState.description)).toBeNull();
  });
});
