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
  Section
} from '@umituz/web-design-system/templates';
```

### Hooks (React Hooks)
```tsx
import {
  useTheme,
  useMediaQuery,
  useBreakpoint,
  useLocalStorage
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
