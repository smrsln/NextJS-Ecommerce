import React from "react";

interface State {
  hasError: boolean;
}

interface Props {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  async componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to an error reporting service
    try {
      const response = await fetch("/api/logError", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error: error.toString(), errorInfo }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log(await response.json());
    } catch (error) {
      console.error("Error logging failed:", error);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <>
          <h1>"Something went wrong."</h1>
          <button onClick={this.handleRetry}>Retry</button>
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
