import { useState, useRef, useCallback, type UIEvent } from 'react';
import { computeVisibleItemRange, totalScrollHeight } from '../calculation';

export interface VirtualListItem<T> {
  item: T;
  index: number;
  style: {
    position: 'absolute';
    top: number;
    height: number;
    width: string;
  };
}

export interface VirtualListOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export const useVirtualList = <T>(items: T[], options: VirtualListOptions) => {
  const { itemHeight, containerHeight, overscan } = options;
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const totalHeight = totalScrollHeight(items.length, itemHeight);
  const { startIndex, endIndex } = computeVisibleItemRange({
    scrollTop,
    itemHeight,
    containerHeight,
    totalItems: items.length,
    overscan,
  });

  const visibleItems: VirtualListItem<T>[] = items
    .slice(startIndex, endIndex + 1)
    .map((item, index) => ({
      item,
      index: startIndex + index,
      style: {
        position: 'absolute' as const,
        top: (startIndex + index) * itemHeight,
        height: itemHeight,
        width: '100%',
      },
    }));

  const handleScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return {
    scrollElementRef,
    visibleItems,
    totalHeight,
    handleScroll,
    startIndex,
    endIndex,
  };
};
