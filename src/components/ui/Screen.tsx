import { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ViewStyle } from "react-native";

interface ScreenProps {
  children: ReactNode;
  className?: string;
  style?: ViewStyle;
}

export function Screen({ children, className, style }: ScreenProps) {
  return (
    <SafeAreaView
      className={`flex-1 bg-surface-primary ${className ?? ""}`}
      style={style}
    >
      {children}
    </SafeAreaView>
  );
}
