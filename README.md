# @umituz/web-design-system

> Web Design System - Atomic Design components (Atoms, Molecules, Organisms) for React applications

## 📦 Installation

```bash
npm install @umituz/web-design-system
# or
yarn add @umituz/web-design-system
# or
pnpm add @umituz/web-design-system
```

## 🚀 Quick Start

```tsx
// ✅ Use subpath imports (RECOMMENDED)
import { Button } from '@umituz/web-design-system/atoms';
import { Card } from '@umituz/web-design-system/organisms';

function App() {
  return (
    <Card>
      <Button variant="primary">Click me</Button>
    </Card>
  );
}
```

## 📚 Available Subpaths

### Atoms (Smallest UI Elements)
```tsx
import {
  Button,
  Badge,
  Input,
  Text,
  Icon,
  Spinner
} from '@umituz/web-design-system/atoms';
```

### Molecules (Simple Combinations)
```tsx
import {
  FormField,
  SearchBox,
  Avatar,
  Chip,
  Toggle
} from '@umituz/web-design-system/molecules';
```

### Organisms (Complex UI Components)
```tsx
import {
  Card,
  Alert,
  Modal,
  Navbar
} from '@umituz/web-design-system/organisms';
```

### Templates (Page Structures)
```tsx
import {
  Form,
  List,
  Section,
  PageLayout,
  PageHeader,
  ResponsiveContainer,
  ProjectSkeleton
} from '@umituz/web-design-system/templates';
```

### Hooks (React Hooks)
```tsx
import {
  useTheme,
  useMediaQuery,
  useBreakpoint,
  useLocalStorage,
  useLanguage,
  useClickOutside,
  useKeyboard,
  useEscape,
  useDebounce,
  useClipboard,
  useToggle,
  useScrollLock
} from '@umituz/web-design-system/hooks';
```

### Tokens (Design Tokens)
```tsx
import {
  lightColorTokens,
  darkColorTokens,
  spacing,
  fontSizes,
  radii,
  shadows
} from '@umituz/web-design-system/tokens';
```

### Types (TypeScript Types)
```tsx
import type {
  SizeVariant,
  ColorVariant,
  BaseProps
} from '@umituz/web-design-system/types';
```

### Security (Security & Validation)
```tsx
import {
  validateInput,
  validateEmail,
  validateUrl,
  sanitizeInput,
  validateFileName,
  CSP_CONFIG,
  SECURITY_HEADERS,
  VALIDATION_CONFIGS
} from '@umituz/web-design-system/security';

import { useFormValidation, COMMON_RULES } from '@umituz/web-design-system/security';
```

### Performance (Performance Optimization)
```tsx
import {
  usePerformanceMonitor,
  useLazyLoading,
  useMemoryOptimization,
  useLazyImage,
  useLazyComponent,
  useVirtualList
} from '@umituz/web-design-system/performance';
```

### Error (Error Handling & Boundaries)
```tsx
import {
  ErrorBoundary,
  ErrorDisplay,
  SuspenseWrapper,
  NetworkError,
  NotFoundError,
  ApiError
} from '@umituz/web-design-system/error';
```

## 🎨 Component Examples

### Button

```tsx
import { Button } from '@umituz/web-design-system/atoms';

<Button variant="primary" size="md">Primary Button</Button>
<Button variant="secondary" size="lg">Secondary Button</Button>
<Button variant="success" size="sm">Success Button</Button>
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@umituz/web-design-system/organisms';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
</Card>
```

### Alert

```tsx
import { Alert } from '@umituz/web-design-system/organisms';

<Alert variant="success">Success message!</Alert>
<Alert variant="warning">Warning message!</Alert>
<Alert variant="destructive">Error message!</Alert>
```

### Theme Hook

```tsx
import { useTheme } from '@umituz/web-design-system/hooks';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button onClick={toggleTheme}>
      Current: {theme}
    </Button>
  );
}
```

### Language Hook

```tsx
import { useLanguage } from '@umituz/web-design-system/hooks';

function LanguageSelector() {
  const { currentLanguage, changeLanguage, t, supportedLanguages } = useLanguage({
    defaultLanguage: 'en-US',
    supportedLanguages: {
      'en-US': { name: 'English', flag: '🇺🇸' },
      'tr-TR': { name: 'Türkçe', flag: '🇹🇷' },
      'de-DE': { name: 'Deutsch', flag: '🇩🇪' },
    }
  });

  return (
    <select value={currentLanguage} onChange={(e) => changeLanguage(e.target.value)}>
      {Object.entries(supportedLanguages).map(([code, { name, flag }]) => (
        <option key={code} value={code}>{flag} {name}</option>
      ))}
    </select>
  );
}
```

### Breakpoint Hook

```tsx
import { useBreakpoint, useMediaQuery } from '@umituz/web-design-system/hooks';

function ResponsiveComponent() {
  const breakpoint = useBreakpoint();
  const isDesktop = useMediaQuery('lg');
  const isTablet = useMediaQuery('md');

  return (
    <div>
      Current breakpoint: {breakpoint || 'mobile'}
      {isDesktop && <DesktopNavigation />}
      {isTablet && !isDesktop && <TabletNavigation />}
    </div>
  );
}
```

## 📱 Responsive Templates

### ResponsiveContainer

```tsx
import { ResponsiveContainer } from '@umituz/web-design-system/templates';

// Auto-responsive container with different max widths per device
<ResponsiveContainer
  mobileMaxWidth="full"
  tabletMaxWidth="lg"
  desktopMaxWidth="xl"
  gradient
  minHeight="screen"
>
  <h1>Auto-responsive content</h1>
  <p>This container automatically adjusts based on screen size</p>
</ResponsiveContainer>

// Custom responsive container
<ResponsiveContainer
  mobilePadding={false}
  tabletPadding={true}
  desktopPadding={true}
  centered={false}
>
  <div>Custom responsive layout</div>
</ResponsiveContainer>
```

## 🎯 Design Tokens

### Colors

```tsx
import { lightColorTokens, darkColorTokens } from '@umituz/web-design-system/tokens';

// Light mode
const colors = lightColorTokens;
// {
//   primary: 'hsl(187 75% 38%)',
//   background: 'hsl(210 20% 98%)',
//   ...
// }

// Dark mode
const darkColors = darkColorTokens;
```

### Spacing

```tsx
import { spacing } from '@umituz/web-design-system/tokens';

const gap = spacing['4']; // '1rem'
```

### Typography

```tsx
import { fontSizes, fontWeights } from '@umituz/web-design-system/tokens';

const fontSize = fontSizes['lg']; // '1.125rem'
const fontWeight = fontWeights['semibold']; // '600'
```

## 🔒 Security Features

### Input Validation
```tsx
import { validateEmail, sanitizeInput, validateFileName } from '@umituz/web-design-system/security';

// Validate email
const result = validateEmail('user@example.com');
if (result.isValid) {
  // Email is valid
}

// Sanitize user input
const clean = sanitizeInput(userInput);

// Validate file names
const fileResult = validateFileName(fileName);
```

### Form Validation Hook
```tsx
import { useFormValidation, COMMON_RULES } from '@umituz/web-design-system/security';

const MyForm = () => {
  const { formData, errors, updateField, validateAllFields, isFormValid } = useFormValidation(
    { name: '', email: '' },
    {
      name: COMMON_RULES.name,
      email: COMMON_RULES.email
    }
  );

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => updateField('name', e.target.value)}
      />
      {errors.name && <span className="error">{errors.name}</span>}
    </form>
  );
};
```

## ⚡ Performance Features

### Performance Monitoring
```tsx
import { usePerformanceMonitor } from '@umituz/web-design-system/performance';

const MyComponent = () => {
  const { metrics, getPerformanceReport } = usePerformanceMonitor({
    componentName: 'MyComponent',
    trackRenders: true,
    trackMemory: true
  });

  return <div>Render time: {metrics.renderTime}ms</div>;
};
```

### Lazy Loading
```tsx
import { useLazyLoading, useLazyImage } from '@umituz/web-design-system/performance';

const LazyImage = () => {
  const { targetRef, imageSrc, isLoaded } = useLazyImage('/large-image.jpg');

  return (
    <div ref={targetRef}>
      {isLoaded ? <img src={imageSrc} alt="Lazy loaded" /> : <div>Loading...</div>}
    </div>
  );
};
```

### Memory Optimization
```tsx
import { useMemoryOptimization } from '@umituz/web-design-system/performance';

const MyComponent = () => {
  const { addEventListener, setTimeout, addCleanup, getMemoryStats } = useMemoryOptimization();

  useEffect(() => {
    const cleanup = addEventListener(window, 'resize', handleResize);
    const timerId = setTimeout(() => {}, 1000);

    return () => {
      cleanup();
      // Automatic cleanup on unmount
    };
  }, []);

  return <div>Memory stats: {getMemoryStats().totalTrackedItems} items</div>;
};
```

## 🚨 Error Handling

### Error Boundary
```tsx
import { ErrorBoundary } from '@umituz/web-design-system/error';

<ErrorBoundary
  level="page"
  showDetails={true}
  onError={(error, errorInfo) => console.error(error)}
>
  <MyComponent />
</ErrorBoundary>
```

### Error Display
```tsx
import { ErrorDisplay, NetworkError, ApiError } from '@umituz/web-design-system/error';

<ErrorDisplay
  error={error}
  title="Something went wrong"
  severity="error"
  showRetry={true}
  onRetry={retryFunction}
/>

<NetworkError onRetry={retry} />
<ApiError error={apiError} onRetry={retry} />
```

### Suspense Wrapper
```tsx
import { SuspenseWrapper, PageSuspense } from '@umituz/web-design-system/error';

<PageSuspense loadingText="Loading page...">
  <MyLazyComponent />
</PageSuspense>

<SuspenseWrapper variant="card" errorBoundaryLevel="feature">
  <AsyncComponent />
</SuspenseWrapper>
```

## 📐 Atomic Design Principles

This package follows Atomic Design methodology:

- **Atoms**: Basic building blocks (Button, Input, Icon)
- **Molecules**: Simple combinations (FormField, SearchBox, Chip)
- **Organisms**: Complex components (Card, Modal, Navbar)
- **Templates**: Page structures (Form, List, Section)

## 🌐 Tailwind CSS Integration

This design system works seamlessly with Tailwind CSS. Make sure your Tailwind config includes the CSS variables:

```css
/* Your global CSS */
@layer base {
  :root {
    --background: 210 20% 98%;
    --foreground: 220 20% 12%;
    --primary: 187 75% 38%;
    --primary-foreground: 0 0% 100%;
    /* ... more tokens */
  }

  .dark {
    --background: 220 20% 7%;
    --foreground: 210 20% 92%;
    --primary: 187 85% 53%;
    --primary-foreground: 220 20% 7%;
    /* ... more tokens */
  }
}
```

## 📄 License

MIT

## 🤝 Contributing

This package is part of the @umituz organization. For issues and feature requests, please visit the GitHub repository.
