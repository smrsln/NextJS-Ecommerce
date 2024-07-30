import { useMutation, UseMutationResult } from "react-query";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

const useSignUpMutation = (): UseMutationResult<
  void,
  Error,
  { email: string; password: string }
> => {
  return useMutation<void, Error, { email: string; password: string }>(
    async ({ email, password }) => {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    },
    {
      onMutate: async () => {
        toast.info("Creating user...");
      },
      onSuccess: (_, variables) => {
        toast.success("Sign up successful", {
          description: "You have successfully signed up",
        });
        signIn("credentials", {
          email: variables.email,
          password: variables.password,
          redirect: true,
        });
      },
      onError: (error: Error) => {
        toast.error(error.message, {
          description: "Sign up failed",
        });
      },
      retry: (failureCount, error) => {
        // If there's an error (e.g., server responded with an error), don't retry
        if (error) return false;
        // Otherwise, retry up to 3 times
        return failureCount < 3;
      },
      retryDelay: 1000,
    }
  );
};

export default useSignUpMutation;
