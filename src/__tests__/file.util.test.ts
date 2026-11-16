import { afterEach, describe, expect, it, vi } from 'vitest';
import { downloadTextFile } from '../infrastructure/utils/file.util';

describe('file util', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('creates, downloads and revokes a blob URL', () => {
    const createObjectURL = vi.fn((blob: Blob) => {
      void blob;
      return 'blob:mock-url';
    });
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', { ...URL, createObjectURL, revokeObjectURL });

    const clicks: Array<{ href: string; download: string }> = [];
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      clicks.push({ href: this.href, download: this.download });
    });

    downloadTextFile('notes.txt', 'hello', 'text/plain');

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    const blob = createObjectURL.mock.calls[0]?.[0];
    expect(blob).toBeDefined();
    expect(blob?.type).toBe('text/plain');
    expect(clicks).toHaveLength(1);
    expect(clicks[0]?.download).toBe('notes.txt');
    expect(clicks[0]?.href).toContain('blob:mock-url');
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });
});
