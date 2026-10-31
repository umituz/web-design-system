import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MarkdownText } from '../presentation/molecules/MarkdownText';

afterEach(cleanup);

describe('MarkdownText blocks', () => {
  it('renders plain text as a paragraph', () => {
    render(<MarkdownText>hello world</MarkdownText>);
    expect(screen.getByText('hello world').tagName).toBe('P');
  });

  it('renders heading levels', () => {
    render(
      <MarkdownText>
        {'# Title\n## Sub\n### Tiny'}
      </MarkdownText>
    );
    expect(screen.getByText('Title').tagName).toBe('H3');
    expect(screen.getByText('Sub').tagName).toBe('H4');
    expect(screen.getByText('Tiny').tagName).toBe('H5');
  });

  it('renders fenced code blocks as pre', () => {
    render(
      <MarkdownText>
        {"```\nconst a = 1;\nconst b = 2;\n```"}
      </MarkdownText>
    );
    const pre = document.querySelector('pre');
    expect(pre?.textContent).toContain('const a = 1;');
    expect(pre?.querySelector('code')).not.toBeNull();
  });

  it('renders ordered and unordered lists', () => {
    render(
      <MarkdownText>
        {'- one\n- two\n\n1. first\n2. second'}
      </MarkdownText>
    );
    expect(screen.getByText('one').closest('ul')).not.toBeNull();
    expect(screen.getByText('first').closest('ol')).not.toBeNull();
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
  });

  it('keeps single newline inside a paragraph as a line break', () => {
    const { container } = render(<MarkdownText>{'line one\nline two'}</MarkdownText>);
    const paragraph = container.querySelector('p');
    expect(paragraph?.textContent).toBe('line oneline two');
    expect(paragraph?.querySelectorAll('br')).toHaveLength(1);
  });
});

describe('MarkdownText inline', () => {
  it('renders bold italic and inline code', () => {
    render(<MarkdownText>{'a **bold** and *thin* and `mono` end'}</MarkdownText>);
    expect(screen.getByText('bold').tagName).toBe('STRONG');
    expect(screen.getByText('thin').tagName).toBe('EM');
    expect(screen.getByText('mono').tagName).toBe('CODE');
  });

  it('renders http links with safe rel', () => {
    render(<MarkdownText>{'see [docs](https://example.com/x) now'}</MarkdownText>);
    const link = screen.getByRole('link', { name: 'docs' });
    expect(link.getAttribute('href')).toBe('https://example.com/x');
    expect(link.getAttribute('rel')).toContain('noopener');
    expect(link.getAttribute('target')).toBe('_blank');
  });

  it('does not render non-http link targets as anchors', () => {
    render(<MarkdownText>{'click [here](javascript:alert(1))'}</MarkdownText>);
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('never interprets html in the source text', () => {
    render(<MarkdownText>{'<script>alert(1)</script> stays text'}</MarkdownText>);
    expect(document.querySelector('script')).toBeNull();
    expect(screen.getByText(/stays text/)).not.toBeNull();
  });

  it('renders an empty string without blocks', () => {
    const { container } = render(<MarkdownText>{''}</MarkdownText>);
    expect(container.querySelector('div')?.children).toHaveLength(0);
  });
});
