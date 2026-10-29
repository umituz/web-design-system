import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Stepper } from '../presentation/organisms/Stepper';

afterEach(cleanup);

const steps = [
  { id: 'a', label: 'Account' },
  { id: 'b', label: 'Profile' },
  { id: 'c', label: 'Review' },
];

describe('Stepper status derivation', () => {
  it('marks only the current step with aria-current', () => {
    render(<Stepper steps={steps} currentStep={1} ariaLabel="Progress" />);
    const list = screen.getByRole('list', { name: 'Progress' });
    const current = list.querySelectorAll('[aria-current="step"]');
    expect(current).toHaveLength(1);
    expect(current[0]?.textContent).toContain('Profile');
  });

  it('shows a check icon for completed steps and numbers for the rest', () => {
    render(<Stepper steps={steps} currentStep={1} />);
    const items = screen.getAllByRole('listitem');
    expect(items[0]?.querySelector('svg')).not.toBeNull();
    expect(items[1]?.querySelector('svg')).toBeNull();
    expect(items[1]?.textContent).toContain('2');
    expect(items[2]?.textContent).toContain('3');
  });

  it('lets step.status override the derived status', () => {
    render(<Stepper steps={[{ ...steps[0]!, status: 'error' }, steps[1]!]} currentStep={0} />);
    const items = screen.getAllByRole('listitem');
    expect(items[0]?.textContent).toContain('Account');
    const dot = items[0]?.querySelector('span');
    expect(dot?.className).toContain('border-destructive');
  });
});

describe('Stepper selection gating', () => {
  it('fires onStepSelect only for completed steps by default', () => {
    const onSelect = vi.fn();
    render(<Stepper steps={steps} currentStep={2} onStepSelect={onSelect} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: /account/i }));
    expect(onSelect).toHaveBeenCalledWith(0);
    expect(screen.queryByRole('button', { name: /review/i })).toBeNull();
  });

  it('canSelect gates forward jumps', () => {
    const onSelect = vi.fn();
    render(
      <Stepper steps={steps} currentStep={0} onStepSelect={onSelect} canSelect={(i) => i <= 1} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /profile/i }));
    expect(onSelect).toHaveBeenCalledWith(1);
    expect(screen.queryByRole('button', { name: /review/i })).toBeNull();
  });

  it('locked steps never render as buttons', () => {
    render(
      <Stepper
        steps={[steps[0]!, { ...steps[1]!, locked: true }, steps[2]!]}
        currentStep={2}
        onStepSelect={() => {}}
      />,
    );
    expect(screen.queryByRole('button', { name: /profile/i })).toBeNull();
    expect(screen.getByRole('button', { name: /account/i })).toBeTruthy();
  });

  it('renders no buttons without onStepSelect', () => {
    render(<Stepper steps={steps} currentStep={1} />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});

describe('Stepper orientation', () => {
  it('stacks vertically with a rail segment between steps', () => {
    const { container } = render(<Stepper steps={steps} currentStep={1} orientation="vertical" />);
    const list = container.querySelector('ol');
    expect(list?.className).toContain('flex-col');
    const rail = container.querySelectorAll('ol > li > span.w-px');
    expect(rail).toHaveLength(2);
    expect(rail[0]?.className).toContain('bg-primary/60');
    expect(rail[1]?.className).toContain('bg-border');
  });

  it('renders descriptions and the optional marker', () => {
    render(
      <Stepper
        steps={[{ id: 'a', label: 'Account', description: 'Your details', optional: true }]}
        currentStep={0}
      />,
    );
    expect(screen.getByText('Your details')).toBeTruthy();
    expect(screen.getByText('(optional)')).toBeTruthy();
  });
});
