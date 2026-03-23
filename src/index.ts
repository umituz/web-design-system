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
export * from './infrastructure/security';
export * from './infrastructure/performance';
export * from './infrastructure/error';
export * from './presentation/templates';
export * from './presentation/hooks';

// Atoms
export type { ButtonProps } from './presentation/atoms/Button';
export { Button } from './presentation/atoms/Button';
export type { BadgeProps } from './presentation/atoms/Badge';
export { Badge } from './presentation/atoms/Badge';
export type { InputProps } from './presentation/atoms/Input';
export { Input } from './presentation/atoms/Input';
export type { TextProps, TextElement, TextVariant, TextSize } from './presentation/atoms/Text';
export { Text } from './presentation/atoms/Text';
export type { IconProps } from './presentation/atoms/Icon';
export { Icon } from './presentation/atoms/Icon';
export type { SpinnerProps } from './presentation/atoms/Spinner';
export { Spinner } from './presentation/atoms/Spinner';
export type { CheckboxProps } from './presentation/atoms/Checkbox';
export { Checkbox } from './presentation/atoms/Checkbox';
export type { RadioProps } from './presentation/atoms/Radio';
export { Radio } from './presentation/atoms/Radio';
export type { SliderProps } from './presentation/atoms/Slider';
export { Slider } from './presentation/atoms/Slider';
export type { DividerProps } from './presentation/atoms/Divider';
export { Divider } from './presentation/atoms/Divider';
export type { SkeletonProps } from './presentation/atoms/Skeleton';
export { Skeleton } from './presentation/atoms/Skeleton';
export type { LinkProps } from './presentation/atoms/Link';
export { Link } from './presentation/atoms/Link';
export type { TooltipProps } from './presentation/atoms/Tooltip';
export { Tooltip } from './presentation/atoms/Tooltip';
export type { ProgressProps } from './presentation/atoms/Progress';
export { Progress } from './presentation/atoms/Progress';
export { Label } from './presentation/atoms/Label';
export type { AspectRatioProps } from './presentation/atoms/AspectRatio';
export { AspectRatio } from './presentation/atoms/AspectRatio';
export type { SwitchProps } from './presentation/atoms/Switch';
export { Switch } from './presentation/atoms/Switch';
export { Separator } from './presentation/atoms/Separator';
export { Toggle as ToggleAtom, toggleVariants } from './presentation/atoms/Toggle';

// Molecules
export type { FormFieldProps } from './presentation/molecules/FormField';
export { FormField } from './presentation/molecules/FormField';
export type { SearchBoxProps } from './presentation/molecules/SearchBox';
export { SearchBox } from './presentation/molecules/SearchBox';
export type { AvatarProps, AvatarImageProps, AvatarFallbackProps } from './presentation/molecules/Avatar';
export { Avatar, AvatarImage, AvatarFallback } from './presentation/molecules/Avatar';
export type { ChipProps } from './presentation/molecules/Chip';
export { Chip } from './presentation/molecules/Chip';
export type { ToggleProps } from './presentation/molecules/Toggle';
export { Toggle } from './presentation/molecules/Toggle';
export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton } from './presentation/molecules/Select';
export type { TextareaProps } from './presentation/molecules/Textarea';
export { Textarea } from './presentation/molecules/Textarea';
export type { RadioGroupProps, RadioOption } from './presentation/molecules/RadioGroup';
export { RadioGroup } from './presentation/molecules/RadioGroup';
export type { CheckboxGroupProps, CheckboxOption } from './presentation/molecules/CheckboxGroup';
export { CheckboxGroup } from './presentation/molecules/CheckboxGroup';
export type { InputGroupProps } from './presentation/molecules/InputGroup';
export { InputGroup, GroupedInput } from './presentation/molecules/InputGroup';
export { ScrollArea, ScrollBar } from './presentation/molecules/ScrollArea';
export type { ListItemProps } from './presentation/molecules/ListItem';
export { ListItem } from './presentation/molecules/ListItem';

export * from './presentation/organisms';
