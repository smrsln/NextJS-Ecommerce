import React, { useState } from "react";
import { useMutation } from "react-query";

interface Props {
  children: React.ReactNode;
}

async function logError({
  error,
  errorInfo,
}: {
  error: Error;
  errorInfo: React.ErrorInfo;
}) {
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

  return response.json();
}

const ErrorBoundary: React.FC<Props> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const mutation = useMutation(logError);

  const componentDidCatch = (error: Error, errorInfo: React.ErrorInfo) => {
    setHasError(true);
    mutation.mutate({ error, errorInfo });
  };

  const handleRetry = () => {
    setHasError(false);
  };

  if (hasError) {
    return (
      <>
        <h1>"Something went wrong."</h1>
        <button onClick={handleRetry}>Retry</button>
      </>
    );
  }

  return <>{children}</>;
};

export default ErrorBoundary;
