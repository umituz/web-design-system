/**
 * @umituz/web-design-system
 *
 * Web Design System - Atomic Design components (Atoms, Molecules, Organisms)
 * for React applications with Tailwind CSS
 *
 * ⚠️ ONEMLI: App'ler bu root barrel'i kullanMAMALI.
 * Subpath import kullanin: "@umituz/web-design-system/atoms"
 *
 * @example
 * // ✅ DOGRU: Subpath import
 * import { Button, Input } from '@umituz/web-design-system/atoms';
 * import { Card } from '@umituz/web-design-system/organisms';
 *
 * // ❌ YANLIS: Root barrel import
 * import { Button, Card } from '@umituz/web-design-system';
 */

// Re-export everything for backward compatibility
export * from './domain/tokens';
export * from './domain/types';
export * from './infrastructure/utils';
export * from './infrastructure/constants';
export * from './presentation/atoms';
export * from './presentation/molecules';
export * from './presentation/organisms';
export * from './presentation/templates';
export * from './presentation/hooks';
