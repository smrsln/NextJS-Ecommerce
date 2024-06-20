import React from "react";
import { Button } from "@/app/components/ui/buttons/button";
import { Loader2 } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  loadingText?: string;
  variant?: "primary";
}

const classSets = {
  primary:
    "flex items-center justify-center w-full px-10 py-4 text-base font-medium text-center transition duration-500 ease-in-out transform rounded-xl ",
};

const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  loadingText = "Please wait",
  children,
  variant = "primary",
  className,
  ...props
}) => {
  const finalClassName = twMerge(
    classSets[variant], // Select class set based on the variant
    isLoading ? "cursor-not-allowed" : "hover:scale-105", // Conditional class for loading state
    className // User-provided classes
  );

  return (
    <Button disabled={isLoading} className={finalClassName} {...props}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export { LoadingButton };
