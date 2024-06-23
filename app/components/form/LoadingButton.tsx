import React from "react";
import { Button } from "@/app/components/ui/buttons/button";
import { Loader2 } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  loadingText?: string;
  variant?: "primary";
  buttonText: string;
}

const classSets = {
  primary:
    "flex items-center justify-center w-full px-10 py-4 text-base font-medium text-center text-white transition duration-500 ease-in-out transform bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
};

const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  loadingText = "Please wait",
  buttonText,
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
        buttonText
      )}
    </Button>
  );
};

export { LoadingButton };
