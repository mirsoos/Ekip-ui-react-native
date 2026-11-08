declare module '@shopify/flash-list' {
  import * as React from 'react';
  import {
    ScrollViewProps,
    StyleProp,
    ViewStyle,
  } from 'react-native';

  export interface ListRenderItemInfo<T> {
    item: T;
    index: number;
    target?: string;
    extraData?: any;
  }

  export type ListRenderItem<T> = (info: ListRenderItemInfo<T>) => React.ReactElement | null;

  export interface FlashListProps<T> extends Omit<ScrollViewProps, 'contentContainerStyle'> {
    data: readonly T[] | null | undefined;
    renderItem?: any;
    getItemType?: (item: T, index: number, extraData?: any) => string | number | undefined;
    keyExtractor?: (item: T, index: number) => string;
    estimatedItemSize?: number;
    extraData?: any;
    inverted?: boolean;
    onEndReached?: (() => void) | null;
    onEndReachedThreshold?: number | null;
    contentContainerStyle?: StyleProp<ViewStyle>;
    ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
    ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
    ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
    maintainVisibleContentPosition?: {
      minIndexForVisible: number;
      autoscrollToTopThreshold?: number;
    };
    removeClippedSubviews?: boolean;
    drawDistance?: number;
  }

  export class FlashList<T> extends React.Component<FlashListProps<T>> {
    scrollToOffset(params: { offset: number; animated?: boolean }): void;
    scrollToIndex(params: { index: number; animated?: boolean; viewPosition?: number }): void;
    scrollToEnd(params?: { animated?: boolean }): void;
    prepareForLayoutAnimationRender(): void;
  }

  export type AnimatedFlashListProps<T> = FlashListProps<T>;
  export class AnimatedFlashList<T> extends React.Component<AnimatedFlashListProps<T>> {}
}
