import { useMutation, UseMutationResult } from "react-query";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { signInService } from "@/app/services/signin-service";

type SignInMutationProps = {
  email: string;
  password: string;
};

const useSignInMutation = (): UseMutationResult<
  void,
  Error,
  SignInMutationProps
> => {
  return useMutation<void, Error, SignInMutationProps>(signInService, {
    onMutate: async (variables) => {
      toast.info("Signing in...");
    },
    onSuccess: (data, variables) => {
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
  });
};

export default useSignInMutation;
