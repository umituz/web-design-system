import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { Form, FormActions } from '../presentation/templates/Form';

afterEach(cleanup);

describe('FormActions', () => {
  it('renders a plain right-aligned action row by default', () => {
    const { container } = render(<FormActions>Save</FormActions>);
    const element = container.firstElementChild as HTMLElement;
    expect(element.tagName).toBe('DIV');
    expect(element.className).not.toContain('sticky');
    expect(element.className).toContain('justify-end');
  });

  it('pins itself to the bottom of the scroll container when sticky', () => {
    const { container } = render(<FormActions sticky>Save</FormActions>);
    const element = container.firstElementChild as HTMLElement;
    expect(element.className).toContain('sticky');
    expect(element.className).toContain('bottom-0');
  });

  it('renders inside a form alongside other content', () => {
    const { container } = render(
      <Form>
        <FormActions sticky>Save</FormActions>
      </Form>
    );
    expect(container.querySelector('form .sticky')).toBeTruthy();
  });
});
