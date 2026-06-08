import { useResourcePreloader } from './useResourcePreloader';
import { useProgressiveEnhancement } from './useProgressiveEnhancement';

export interface UseLazyLoadingOptions {
  enableImageLazyLoading?: boolean;
  enableComponentLazyLoading?: boolean;
  enableVirtualization?: boolean;
  enablePreloading?: boolean;
  enableProgressiveEnhancement?: boolean;
}

export interface UseLazyLoadingReturn {
  preloadImage?: ReturnType<typeof useResourcePreloader>['preloadImage'];
  isOnline?: boolean;
  connectionType?: ReturnType<typeof useProgressiveEnhancement>['connectionType'];
  shouldLoadHeavyContent?: ReturnType<typeof useProgressiveEnhancement>['shouldLoadHeavyContent'];
  shouldPreloadContent?: ReturnType<typeof useProgressiveEnhancement>['shouldPreloadContent'];
}

export const useLazyLoading = (
  options: UseLazyLoadingOptions = {}
): UseLazyLoadingReturn => {
  const {
    enablePreloading = true,
    enableProgressiveEnhancement = true,
  } = options;

  const resourcePreloader = useResourcePreloader();
  const progressiveEnhancement = useProgressiveEnhancement();

  return {
    preloadImage: enablePreloading ? resourcePreloader.preloadImage : undefined,
    isOnline: enableProgressiveEnhancement ? progressiveEnhancement.isOnline : undefined,
    connectionType: enableProgressiveEnhancement
      ? progressiveEnhancement.connectionType
      : undefined,
    shouldLoadHeavyContent: enableProgressiveEnhancement
      ? progressiveEnhancement.shouldLoadHeavyContent
      : undefined,
    shouldPreloadContent: enableProgressiveEnhancement
      ? progressiveEnhancement.shouldPreloadContent
      : undefined,
  };
};
