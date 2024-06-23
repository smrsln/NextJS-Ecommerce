import { useMutation, UseMutationResult } from "react-query";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { signInService } from "@/app/services/signin-service";

const useSignInMutation = (): UseMutationResult<
  void,
  Error,
  { email: string; password: string }
> => {
  return useMutation<void, Error, { email: string; password: string }>(
    signInService,
    {
      onMutate: async () => {
        toast.info("Signing in...");
      },
      onSuccess: (_, variables) => {
        toast.success("Sign in successful", {
          description: "You have successfully signed in",
        });
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
