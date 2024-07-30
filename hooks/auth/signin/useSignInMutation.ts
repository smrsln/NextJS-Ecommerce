import { useMutation, UseMutationResult } from "react-query";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { setCookieService } from "@/app/services/cookie-service";

const useSignInMutation = (): UseMutationResult<
  void,
  Error,
  { email: string; password: string; rememberMe: boolean }
> => {
  return useMutation<
    void,
    Error,
    { email: string; password: string; rememberMe: boolean }
  >(
    async ({ email, password }) => {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        } else {
          throw new Error("Unexpected response from server");
        }
      }
    },
    {
      onMutate: async () => {
        toast.info("Signing in...");
      },
      onSuccess: async (_, variables) => {
        toast.success("Sign in successful", {
          description: "You have successfully signed in",
        });
        if (variables.rememberMe) {
          await setCookieService("rememberMe", "true", 60 * 60 * 24 * 180);
        }
        signIn("credentials", {
          email: variables.email,
          password: variables.password,
          redirect: true,
        });
      },
      onError: (error: Error) => {
        toast.error(error.message, {
          description: "Sign in failed",
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

export default useSignInMutation;
