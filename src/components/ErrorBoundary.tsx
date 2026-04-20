import { Component, ReactNode } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { i18n } from "@/lib/i18n";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    if (__DEV__) console.error("ErrorBoundary caught:", error);
  }

  private handleRetry = () => this.setState({ hasError: false });

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 bg-surface-primary items-center justify-center px-6">
          <Text className="text-content-primary text-xl font-bold mb-2">
            {i18n.t("errorBoundary.title")}
          </Text>
          <Text className="text-content-secondary text-center mb-6">
            {i18n.t("errorBoundary.description")}
          </Text>
          <TouchableOpacity
            onPress={this.handleRetry}
            className="bg-accent-primary px-8 py-3 rounded-2xl"
          >
            <Text className="text-white font-semibold text-base">
              {i18n.t("common.retry")}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}
