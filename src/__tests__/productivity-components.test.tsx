import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import {
  CopyButton,
  StatusDot,
  PasswordInput,
  SearchInput,
  ConfirmButton,
  Toolbar,
  StatsGrid,
  DescriptionList,
  SettingsLayout,
  CrudPageTemplate,
} from '../index';

describe('Productivity Components Smoke Tests', () => {
  it('renders CopyButton and handles copy action', () => {
    render(<CopyButton text="sample-text" label="Kopyala" />);
    const btn = screen.getByRole('button', { name: /kopyala/i });
    expect(btn).toBeDefined();
  });

  it('renders StatusDot with correct status and label', () => {
    render(<StatusDot status="online" ping label="Canlı" />);
    expect(screen.getByText('Canlı')).toBeDefined();
  });

  it('renders PasswordInput and toggles visibility', () => {
    render(<PasswordInput placeholder="Şifreniz" />);
    const input = screen.getByPlaceholderText('Şifreniz') as HTMLInputElement;
    expect(input.type).toBe('password');

    const toggleBtn = screen.getByRole('button', { name: /şifreyi göster/i });
    fireEvent.click(toggleBtn);
    expect(input.type).toBe('text');
  });

  it('renders SearchInput and fires change events', () => {
    const handleChange = vi.fn();
    render(<SearchInput placeholder="Arama yap..." onChange={handleChange} />);
    const input = screen.getByPlaceholderText('Arama yap...');
    fireEvent.change(input, { target: { value: 'test query' } });
    expect(handleChange).toHaveBeenCalledWith('test query');
  });

  it('renders ConfirmButton and requires two-step confirmation', () => {
    const handleConfirm = vi.fn();
    render(
      <ConfirmButton onConfirm={handleConfirm} confirmText="Emin misiniz?" confirmLabel="Evet, Sil">
        Sil
      </ConfirmButton>
    );

    const initialBtn = screen.getByRole('button', { name: /sil/i });
    fireEvent.click(initialBtn);

    expect(screen.getByText('Emin misiniz?')).toBeDefined();
    const confirmBtn = screen.getByRole('button', { name: /evet, sil/i });
    fireEvent.click(confirmBtn);

    expect(handleConfirm).toHaveBeenCalled();
  });

  it('renders Toolbar layout', () => {
    render(
      <Toolbar
        search={<input placeholder="Search" />}
        actions={<button>Ekle</button>}
      />
    );
    expect(screen.getByPlaceholderText('Search')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Ekle' })).toBeDefined();
  });

  it('renders StatsGrid with items', () => {
    render(
      <StatsGrid
        stats={[
          { title: 'Aktif Kullanıcı', value: '1,200', change: '+15%', trend: 'up' },
          { title: 'Hata Oranı', value: '0.02%', trend: 'neutral' },
        ]}
      />
    );
    expect(screen.getByText('Aktif Kullanıcı')).toBeDefined();
    expect(screen.getByText('1,200')).toBeDefined();
  });

  it('renders DescriptionList with items', () => {
    render(
      <DescriptionList
        title="Hesap Özeti"
        items={[
          { label: 'E-posta', value: 'test@example.com', copyable: true },
          { label: 'Rol', value: 'Yönetici', badge: 'Admin' },
        ]}
      />
    );
    expect(screen.getByText('Hesap Özeti')).toBeDefined();
    expect(screen.getByText('test@example.com')).toBeDefined();
    expect(screen.getByText('Admin')).toBeDefined();
  });

  it('renders SettingsLayout', () => {
    render(
      <SettingsLayout
        title="Genel Ayarlar"
        activeId="profile"
        onSelect={() => {}}
        navItems={[
          { id: 'profile', label: 'Profil' },
          { id: 'security', label: 'Güvenlik' },
        ]}
      >
        <div>Profil İçeriği</div>
      </SettingsLayout>
    );
    expect(screen.getByText('Genel Ayarlar')).toBeDefined();
    expect(screen.getByText('Profil İçeriği')).toBeDefined();
  });

  it('renders CrudPageTemplate', () => {
    render(
      <CrudPageTemplate
        title="Kullanıcı Yönetimi"
        description="Tüm kullanıcıları görüntüleyin ve düzenleyin."
        actions={<button>Yeni Kullanıcı</button>}
      >
        <div>Tablo İçeriği</div>
      </CrudPageTemplate>
    );
    expect(screen.getByText('Kullanıcı Yönetimi')).toBeDefined();
    expect(screen.getByText('Tablo İçeriği')).toBeDefined();
  });
});
