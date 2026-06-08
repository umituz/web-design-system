# @umituz/web-design-system

> Web Design System - Atomic Design components (Atoms, Molecules, Organisms) for React applications

## Installation

```bash
npm install @umituz/web-design-system
# or
yarn add @umituz/web-design-system
# or
pnpm add @umituz/web-design-system
```

## Quick Start

```tsx
// Use subpath imports (RECOMMENDED)
import { Button } from '@umituz/web-design-system/atoms';
import { Card } from '@umituz/web-design-system/organisms';

function App() {
  return (
    <Card>
      <Button>Click me</Button>
    </Card>
  );
}
```

## Available Subpaths

### Atoms (Smallest UI Elements)
```tsx
import {
  Button,
  Badge,
  Input,
  Text,
  Icon,
  Spinner,
  Checkbox,
  Radio,
  Slider,
  Divider,
  Skeleton,
  Link,
  Tooltip,
  Progress,
  Label,
  AspectRatio,
  Switch,
  Separator,
  Toggle,
  IconButton,
  Show,
  Hide
} from '@umituz/web-design-system/atoms';
```

### Molecules (Simple Combinations)
```tsx
import {
  FormField,
  SearchBox,
  Avatar,
  Chip,
  Toggle as MoleculeToggle,
  Select,
  Textarea,
  RadioGroup,
  CheckboxGroup,
  InputGroup,
  ScrollArea,
  ListItem,
  ActiveFilterTags,
  Breadcrumb,
  CodeBlock
} from '@umituz/web-design-system/molecules';
```

### Organisms (Complex UI Components)
```tsx
import {
  Card,
  Alert,
  Modal,
  Navbar,
  Table,
  Tabs,
  Accordion,
  Dialog,
  Breadcrumbs,
  HoverCard,
  Popover,
  Collapsible,
  Sheet,
  Footer,
  EmptyState,
  LoadingState,
  DataTable,
  StatCard,
  FormModal,
  Grid,
  ConfirmDialog,
  Calendar,
  AlertDialog,
  DropdownMenu,
  ToggleGroup,
  ImageLightbox,
  NewsletterSignup,
  Comments,
  FilterBar,
  FilterSidebar,
  MainNavbar,
  MetricCard,
  QuickActionCard
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
  ProjectSkeleton,
  ResponsiveContainer
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
  fontWeights,
  radii,
  shadows,
  durations,
  easings
} from '@umituz/web-design-system/tokens';
```

### Types (TypeScript Types)
```tsx
import type {
  SizeVariant,
  ColorVariant,
  ColorScheme,
  BaseProps,
  ChildrenProps,
  Breakpoint,
  UseBreakpointReturn
} from '@umituz/web-design-system/types';
```

### Security (Security & Validation)
```tsx
import {
  validateInput,
  validateEmail,
  validateUrl,
  validateRequired,
  sanitizeInput,
  validateFileName,
  validateCSPCompliance,
  CSP_CONFIG,
  SECURITY_HEADERS,
  VALIDATION_CONFIGS,
  FILE_SECURITY_CONFIG,
  RATE_LIMIT_CONFIG,
  SESSION_CONFIG,
  CORS_CONFIG
} from '@umituz/web-design-system/security';

import { useFormValidation, COMMON_RULES, VALIDATION_PATTERNS } from '@umituz/web-design-system/security';
```

### Performance (Performance Optimization)
```tsx
import {
  usePerformanceMonitor,
  useRenderPerformance,
  useMemoryOptimization,
  useMemoryLeakDetector,
  useIntersectionObserver,
  useLazyImage,
  useVirtualList,
  useResourcePreloader,
  useLazyComponent,
  useProgressiveEnhancement,
  useLazyLoading,
  performanceUtils
} from '@umituz/web-design-system/performance';
```

### Error (Error Handling & Boundaries)
```tsx
import {
  ErrorBoundary,
  ErrorDisplay,
  NetworkError,
  NotFoundError,
  PermissionError,
  ApiError,
  SuspenseWrapper,
  PageSuspense,
  ComponentSuspense,
  FeatureSuspense,
  InlineSuspense
} from '@umituz/web-design-system/error';
```

## Component Examples

### Button

```tsx
import { Button } from '@umituz/web-design-system/atoms';

<Button variant="default" size="md">Default Button</Button>
<Button variant="secondary" size="lg">Secondary Button</Button>
<Button variant="destructive" size="sm">Destructive Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="link">Link Button</Button>
```

**Button variants**: `default` | `destructive` | `outline` | `secondary` | `ghost` | `link`
**Button sizes**: `default` | `sm` | `lg` | `icon`

### Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@umituz/web-design-system/organisms';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**Card variants**: `default` | `outlined` | `elevated`

### Alert

```tsx
import { Alert, AlertTitle, AlertDescription } from '@umituz/web-design-system/organisms';

<Alert variant="default">
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>This is an informational alert.</AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong.</AlertDescription>
</Alert>
```

**Alert variants**: `default` | `destructive`

### IconButton

```tsx
import { IconButton } from '@umituz/web-design-system/atoms';
import { Settings } from 'lucide-react';

<IconButton icon={<Settings className="h-5 w-5" />} label="Settings" />
<IconButton icon={<X />} label="Close" variant="outline" size="sm" />
```

### Theme Hook

```tsx
import { useTheme } from '@umituz/web-design-system/hooks';
import { Button } from '@umituz/web-design-system/atoms';

function ThemeToggle() {
  const { theme, effectiveTheme, toggleTheme, setTheme } = useTheme();
  return (
    <Button onClick={toggleTheme}>
      Current: {theme} (effective: {effectiveTheme})
    </Button>
  );
}
```

### Language Hook

```tsx
import { useLanguage } from '@umituz/web-design-system/hooks';
import { Globe } from 'lucide-react';

function LanguageSelector() {
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage({
    defaultLanguage: 'en',
    supportedLanguages: {
      'en': { name: 'English', icon: <Globe className="h-4 w-4" /> },
      'tr': { name: 'Türkçe', icon: <Globe className="h-4 w-4" /> },
    }
  });

  return (
    <select value={currentLanguage} onChange={(e) => changeLanguage(e.target.value)}>
      {Object.entries(supportedLanguages).map(([code, { name }]) => (
        <option key={code} value={code}>{name}</option>
      ))}
    </select>
  );
}
```

### MainNavbar with custom router

```tsx
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { MainNavbar, NavItem, MainNavbarLanguage } from '@umituz/web-design-system/organisms';
import { Languages, Moon } from 'lucide-react';

const navItems: NavItem[] = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
];

const languages: Record<string, MainNavbarLanguage> = {
  en: { name: 'English', icon: <Languages className="h-4 w-4" /> },
  tr: { name: 'Türkçe', icon: <Languages className="h-4 w-4" /> },
};

<MainNavbar
  appName="My App"
  navItems={navItems}
  supportedLanguages={languages}
  currentLanguage="en"
  onLanguageChange={(code) => console.log('change to', code)}
  theme="light"
  onThemeToggle={() => console.log('toggle theme')}
  githubUrl="https://github.com/my-org/my-app"
  LinkComponent={RouterLink}
/>
```

### Responsive Templates

```tsx
import { ResponsiveContainer } from '@umituz/web-design-system/templates';

<ResponsiveContainer
  mobileMaxWidth="full"
  tabletMaxWidth="lg"
  desktopMaxWidth="xl"
  gradient
  minHeight="screen"
>
  <h1>Auto-responsive content</h1>
</ResponsiveContainer>
```

## Design Tokens

### Colors

```tsx
import { lightColorTokens, darkColorTokens } from '@umituz/web-design-system/tokens';

const light = lightColorTokens;  // light theme color tokens
const dark = darkColorTokens;    // dark theme color tokens
```

### Spacing

```tsx
import { spacing } from '@umituz/web-design-system/tokens';

const gap = spacing['4']; // '1rem'
```

### Typography

```tsx
import { fontSizes, fontWeights } from '@umituz/web-design-system/tokens';

const fontSize = fontSizes['lg'];   // '1.125rem'
const fontWeight = fontWeights['semibold']; // '600'
```

## Security Features

### Input Validation

```tsx
import { validateEmail, sanitizeInput, validateFileName } from '@umituz/web-design-system/security';

const result = validateEmail('user@example.com');
if (result.isValid) {
  // Email is valid
}

const clean = sanitizeInput(userInput);
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
    <form>
      <input
        value={formData.name}
        onChange={(e) => updateField('name', e.target.value)}
      />
      {errors.name && <span className="error">{errors.name}</span>}
    </form>
  );
};
```

## Performance Features

### Performance Monitoring

```tsx
import { usePerformanceMonitor } from '@umituz/web-design-system/performance';

const MyComponent = () => {
  const { metrics, getPerformanceReport } = usePerformanceMonitor({
    componentName: 'MyComponent',
    trackRenders: true,
  });

  return <div>Render time: {metrics.renderTime.toFixed(2)}ms</div>;
};
```

### Lazy Image

```tsx
import { useLazyImage } from '@umituz/web-design-system/performance';

const LazyImage = () => {
  const { targetRef, imageSrc, isLoaded } = useLazyImage('/large-image.jpg');

  return (
    <div ref={targetRef}>
      {isLoaded ? <img src={imageSrc} alt="Lazy loaded" /> : <div>Loading...</div>}
    </div>
  );
};
```

### Virtual List

```tsx
import { useVirtualList } from '@umituz/web-design-system/performance';

const BigList = ({ items }: { items: string[] }) => {
  const { scrollElementRef, visibleItems, totalHeight, handleScroll } = useVirtualList(items, {
    itemHeight: 40,
    containerHeight: 400,
  });

  return (
    <div
      ref={scrollElementRef}
      onScroll={handleScroll}
      style={{ height: 400, overflow: 'auto', position: 'relative' }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ item, style, index }) => (
          <div key={index} style={style}>{item}</div>
        ))}
      </div>
    </div>
  );
};
```

### Memory Optimization

```tsx
import { useMemoryOptimization } from '@umituz/web-design-system/performance';

const MyComponent = () => {
  const { addEventListener, setTimeout, getMemoryStats } = useMemoryOptimization();

  useEffect(() => {
    const cleanup = addEventListener(window, 'resize', () => {});
    const timerId = setTimeout(() => {}, 1000);
    return () => cleanup();
  }, []);

  return <div>Tracked items: {getMemoryStats().totalTrackedItems}</div>;
};
```

## Error Handling

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

**Levels**: `page` | `component` | `feature`

### Error Display

```tsx
import { ErrorDisplay, NetworkError, ApiError } from '@umituz/web-design-system/error';

<ErrorDisplay
  error={error}
  title="Something went wrong"
  severity="error"
  showRetry
  onRetry={retryFunction}
/>

<NetworkError onRetry={retry} />
<ApiError error={apiError} onRetry={retry} />
```

**Variants**: `default` | `minimal` | `card` | `inline`
**Severities**: `error` | `warning` | `info`

### Suspense Wrapper

```tsx
import { PageSuspense, FeatureSuspense } from '@umituz/web-design-system/error';

<PageSuspense loadingText="Loading page...">
  <MyLazyComponent />
</PageSuspense>

<FeatureSuspense>
  <AsyncComponent />
</FeatureSuspense>
```

## Atomic Design Principles

This package follows Atomic Design methodology:

- **Atoms**: Basic building blocks (Button, Input, Icon, Spinner)
- **Molecules**: Simple combinations (FormField, SearchBox, Chip, Toggle, CodeBlock)
- **Organisms**: Complex components (Card, Modal, Navbar, DataTable, FilterBar)
- **Templates**: Page structures (Form, List, Section, PageLayout, PageHeader, ResponsiveContainer)

## Tailwind CSS Integration

This design system works seamlessly with Tailwind CSS. Make sure your Tailwind config includes the CSS variables:

```css
@layer base {
  :root {
    --background: 210 20% 98%;
    --foreground: 220 20% 12%;
    --primary: 187 75% 38%;
    --primary-foreground: 0 0% 100%;
    --secondary: 210 20% 96%;
    --secondary-foreground: 220 20% 12%;
    --muted: 210 20% 96%;
    --muted-foreground: 220 10% 40%;
    --accent: 210 20% 94%;
    --accent-foreground: 220 20% 12%;
    --destructive: 0 75% 50%;
    --destructive-foreground: 0 0% 100%;
    --border: 220 15% 88%;
    --input: 220 15% 88%;
    --ring: 187 75% 38%;
    --card: 0 0% 100%;
    --card-foreground: 220 20% 12%;
    --popover: 0 0% 100%;
    --popover-foreground: 220 20% 12%;
    --success: 142 70% 35%;
    --success-foreground: 0 0% 100%;
    --warning: 38 90% 50%;
    --warning-foreground: 0 0% 100%;
    --info: 217 90% 55%;
    --info-foreground: 0 0% 100%;
  }

  .dark {
    --background: 220 20% 7%;
    --foreground: 210 20% 92%;
    --primary: 187 85% 53%;
    --primary-foreground: 220 20% 7%;
    --secondary: 220 20% 12%;
    --secondary-foreground: 210 20% 92%;
    --muted: 220 20% 12%;
    --muted-foreground: 220 10% 60%;
    --accent: 220 20% 16%;
    --accent-foreground: 210 20% 92%;
    --destructive: 0 70% 55%;
    --destructive-foreground: 0 0% 100%;
    --border: 220 20% 18%;
    --input: 220 20% 18%;
    --ring: 187 85% 53%;
    --card: 220 20% 9%;
    --card-foreground: 210 20% 92%;
    --popover: 220 20% 9%;
    --popover-foreground: 210 20% 92%;
    --success: 142 70% 45%;
    --success-foreground: 220 20% 7%;
    --warning: 38 90% 55%;
    --warning-foreground: 220 20% 7%;
    --info: 217 90% 60%;
    --info-foreground: 220 20% 7%;
  }
}
```

## License

MIT

## Contributing

This package is part of the @umituz organization. For issues and feature requests, please visit the GitHub repository.
