/**
 * AspectRatio Component
 * @description Aspect ratio container component
 * @example
 * import { AspectRatio } from '@umituz/web-design-system/atoms';
 *
 * <AspectRatio ratio={16 / 9}>
 *   <img src="..." alt="..." className="object-cover w-full h-full" />
 * </AspectRatio>
 */

import * as React from "react";

import { cn } from "../../infrastructure/utils/cn";

interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number;
}

const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ className, ratio = 16 / 9, ...props }, ref) => (
    <div
      ref={ref}
      style={{ paddingBottom: `${100 / ratio}%` }}
      className={cn("relative w-full", className)}
      {...props}
    />
  )
);
AspectRatio.displayName = "AspectRatio";

export { AspectRatio };
export type { AspectRatioProps };
