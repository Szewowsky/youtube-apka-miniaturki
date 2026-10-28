import { describe, expect, it } from 'vitest';
import { manifest } from '../manifest.config';

describe('manifest Wtyczki', () => {
  it('prosi tylko o uprawnienia downloads i storage', () => {
    expect([...manifest.permissions].sort()).toEqual(['downloads', 'storage']);
  });

  it('ma dostęp tylko do YouTube i serwera Miniaturek', () => {
    expect([...manifest.host_permissions].sort()).toEqual([
      'https://i.ytimg.com/*',
      'https://www.youtube.com/*',
    ]);
  });

  it('nie ma uprawnienia tabs, <all_urls> ani wyskakującego okienka', () => {
    const tekst = JSON.stringify(manifest);
    expect(tekst).not.toContain('"tabs"');
    expect(tekst).not.toContain('<all_urls>');
    expect(manifest.action).not.toHaveProperty('default_popup');
  });

  it('ma Ikony Wtyczki w rozmiarach 16, 32, 48 i 128', () => {
    expect(Object.keys(manifest.icons)).toEqual(['16', '32', '48', '128']);
  });
});
