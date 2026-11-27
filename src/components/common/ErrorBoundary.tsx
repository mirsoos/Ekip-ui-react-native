import React, { Component, useEffect, useRef, useState, type ErrorInfo, type ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { GlassButton } from '../glass';
import { AuroraBackground } from '../AuroraBackground';
import { PixelFightStage } from './PixelFightStage';
import { Icons } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onReset?: () => void;
  onGoHome?: () => void;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Dedicated Glass Error Boundary
 * Renders directly with full-screen Liquid Glass coverage (zIndex: 99999).
 * Bulletproof on iOS, Android, and Web without native Modal or WebView dependencies.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);

    if (__DEV__) {
      console.error('[ErrorBoundary caught error]:', error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    this.props.onReset?.();
  };

  handleGoHome = () => {
    this.resetError();
    this.props.onGoHome?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <DedicatedErrorSheet
          title={this.props.fallbackTitle}
          message={this.props.fallbackMessage}
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={this.resetError}
          onGoHome={this.props.onGoHome ? this.handleGoHome : undefined}
        />
      );
    }

    return this.props.children;
  }
}

export interface DedicatedErrorSheetProps {
  title?: string;
  message?: string;
  error: Error | null;
  errorInfo?: ErrorInfo | null;
  onRetry: () => void;
  onGoHome?: () => void;
}

/**
 * Custom Dedicated Error Bottom Sheet
 * Native-safe, zero webview dependencies, styled with authentic Liquid Glass tokens.
 */
export function DedicatedErrorSheet({
  title,
  message,
  error,
  errorInfo,
  onRetry,
  onGoHome,
}: DedicatedErrorSheetProps) {
  const { colors, isDark } = useTheme();
  const { t } = useI18n();
  const [showDetails, setShowDetails] = useState(false);

  const finalTitle = title ?? t('error.boundaryTitle');
  const finalMessage = message ?? t('error.boundaryMessage');

  // Entrance & Exit animated values
  const [backdropAnim] = useState(() => new Animated.Value(0));
  const [slideAnim] = useState(() => new Animated.Value(600));
  const isClosing = useRef(false);

  useEffect(() => {
    // Smooth Entrance: backdrop fade-in + sheet spring slide-up
    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.ease),
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        bounciness: 4,
        speed: 14,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  }, [backdropAnim, slideAnim]);

  // Guaranteed Exit animation before triggering action
  const handleAction = (actionCallback: () => void) => {
    if (isClosing.current) return;
    isClosing.current = true;

    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 240,
        easing: Easing.in(Easing.ease),
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(slideAnim, {
        toValue: 600,
        duration: 260,
        easing: Easing.in(Easing.ease),
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start(() => {
      actionCallback();
    });
  };

  return (
    <View style={styles.rootContainer} pointerEvents="box-none">
      {/* 1. Underlying Aurora Background */}
      <AuroraBackground isDark={isDark} />

      {/* 2. Frosted backdrop overlay */}
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: backdropAnim,
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.65)' : 'rgba(0, 0, 0, 0.35)',
          },
        ]}
      />

      {/* 3. Interactive Retro 8-bit Combat Stage */}
      <Animated.View
        style={[
          styles.fightStageWrap,
          {
            opacity: backdropAnim,
          },
        ]}
        pointerEvents="auto"
      >
        <PixelFightStage height={Platform.OS === 'web' ? 240 : 200} />
      </Animated.View>

      {/* 4. Sheet Container: slides up from bottom */}
      <View style={styles.sheetWrap} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.sheetContainer,
            {
              backgroundColor: isDark ? 'rgba(14, 17, 27, 0.95)' : 'rgba(255, 255, 255, 0.92)',
              borderColor: colors.glassBorderStrong,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Top Handle Bar */}
          <View
            style={[
              styles.handle,
              { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.20)' },
            ]}
          />

          {/* Header Row: Dedicated Alert Badge & Text */}
          <View style={styles.headerRow}>
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor: isDark ? 'rgba(244, 63, 94, 0.15)' : 'rgba(244, 63, 94, 0.10)',
                  borderColor: isDark ? 'rgba(244, 63, 94, 0.35)' : 'rgba(244, 63, 94, 0.25)',
                },
              ]}
            >
              <Icons.AlertCircle size={24} color="#f43f5e" strokeWidth={2.4} />
            </View>

            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={[styles.mainTitle, { color: colors.textPrimary }]}>
                {finalTitle}
              </Text>
              <Text style={[styles.mainMessage, { color: colors.textSecondary }]}>
                {finalMessage}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsWrap}>
            <GlassButton
              variant="primary"
              icon="RefreshCw"
              fullWidth
              onPress={() => handleAction(onRetry)}
            >
              {t('error.tryAgain')}
            </GlassButton>

            {onGoHome && (
              <GlassButton
                variant="secondary"
                icon="Compass"
                fullWidth
                onPress={() => handleAction(onGoHome)}
              >
                {t('error.goHome')}
              </GlassButton>
            )}
          </View>

          {/* Technical Details Accordion */}
          {error && (
            <View style={[styles.debugSection, { borderTopColor: colors.divider }]}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowDetails((v) => !v)}
                style={styles.debugToggle}
              >
                <Text style={[styles.debugToggleText, { color: colors.textTertiary }]}>
                  {showDetails ? 'Hide technical details' : 'Show technical details'}
                </Text>
                {showDetails ? (
                  <Icons.ChevronUp size={14} color={colors.textTertiary} />
                ) : (
                  <Icons.ChevronDown size={14} color={colors.textTertiary} />
                )}
              </TouchableOpacity>

              {showDetails && (
                <ScrollView
                  style={[
                    styles.debugBox,
                    {
                      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.55)' : 'rgba(0, 0, 0, 0.05)',
                      borderColor: colors.divider,
                    },
                  ]}
                >
                  <Text style={styles.debugErrorName}>
                    {error.name}: {error.message}
                  </Text>
                  {error.stack && (
                    <Text style={[styles.debugStack, { color: colors.textTertiary }]}>
                      {error.stack}
                    </Text>
                  )}
                  {errorInfo?.componentStack && (
                    <Text style={[styles.debugStack, { color: colors.textTertiary, marginTop: 6 }]}>
                      Component Stack:{errorInfo.componentStack}
                    </Text>
                  )}
                </ScrollView>
              )}
            </View>
          )}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    ...StyleSheet.absoluteFill,
    zIndex: 99999,
    justifyContent: 'flex-end',
    backgroundColor: '#060814',
    overflow: 'hidden',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    zIndex: 1,
  },
  fightStageWrap: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 65 : (Platform.OS === 'ios' ? 140 : 125),
    left: 0,
    right: 0,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetWrap: {
    position: 'relative',
    width: '100%',
    zIndex: 3,
  },
  sheetContainer: {
    width: '100%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.5,
    shadowRadius: 28,
    elevation: 32,
    overflow: 'hidden',
  },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  mainMessage: {
    fontSize: 13,
    lineHeight: 18,
  },
  actionsWrap: {
    gap: 10,
  },
  debugSection: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  debugToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  debugToggleText: {
    fontSize: 11,
    fontWeight: '600',
  },
  debugBox: {
    maxHeight: 130,
    marginTop: 8,
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  debugErrorName: {
    color: '#f43f5e',
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '700',
    marginBottom: 4,
  },
  debugStack: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    lineHeight: 14,
  },
});
