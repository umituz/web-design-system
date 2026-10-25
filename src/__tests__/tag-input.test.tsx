import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { TagInput } from '../presentation/molecules/TagInput';

afterEach(cleanup);

describe('TagInput (Molecule)', () => {
  it('renders existing tags as chips', () => {
    render(<TagInput tags={['urgent', 'follow-up']} onTagsChange={() => {}} />);
    expect(screen.getByText('urgent')).toBeDefined();
    expect(screen.getByText('follow-up')).toBeDefined();
  });

  it('commits the draft on Enter and clears it', () => {
    const onTagsChange = vi.fn();
    render(<TagInput tags={[]} onTagsChange={onTagsChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '  new-tag  ' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onTagsChange).toHaveBeenCalledWith(['new-tag']);
    expect((input as HTMLInputElement).value).toBe('');
  });

  it('commits the draft on comma without letting it into the draft', () => {
    const onTagsChange = vi.fn();
    render(<TagInput tags={[]} onTagsChange={onTagsChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.keyDown(input, { key: ',' });
    expect(onTagsChange).toHaveBeenCalledWith(['a']);
    expect((input as HTMLInputElement).value).toBe('');
  });

  it('ignores duplicate and empty commits', () => {
    const onTagsChange = vi.fn();
    render(<TagInput tags={['x']} onTagsChange={onTagsChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'x' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onTagsChange).not.toHaveBeenCalled();
  });

  it('removes the last tag on Backspace with an empty draft', () => {
    const onTagsChange = vi.fn();
    render(<TagInput tags={['a', 'b']} onTagsChange={onTagsChange} />);
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Backspace' });
    expect(onTagsChange).toHaveBeenCalledWith(['a']);
  });

  it('commits on blur by default and skips when commitOnBlur is false', () => {
    const onTagsChange = vi.fn();
    const { unmount } = render(
      <>
        <TagInput tags={[]} onTagsChange={onTagsChange} aria-label="commits" />
        <TagInput tags={[]} onTagsChange={onTagsChange} commitOnBlur={false} aria-label="skips" />
      </>
    );
    fireEvent.change(screen.getByLabelText('commits'), { target: { value: 'from-blur' } });
    fireEvent.blur(screen.getByLabelText('commits'));
    expect(onTagsChange).toHaveBeenCalledWith(['from-blur']);
    fireEvent.change(screen.getByLabelText('skips'), { target: { value: 'dropped' } });
    fireEvent.blur(screen.getByLabelText('skips'));
    expect(onTagsChange).toHaveBeenCalledTimes(1);
    unmount();
  });

  it('removes a tag through its chip remove control', () => {
    const onTagsChange = vi.fn();
    render(<TagInput tags={['keep', 'drop']} onTagsChange={onTagsChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Remove drop' }));
    expect(onTagsChange).toHaveBeenCalledWith(['keep']);
  });
});
