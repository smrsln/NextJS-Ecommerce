import { useMutation } from "react-query";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { signInService } from "@/app/services/signin-service";

const useSignInMutation = () => {
  return useMutation(signInService, {
    onMutate: () => {
      toast.info("Signing in...");
    },
    onSuccess: ({ data }) => {
      toast.success("Sign in successful", {
        description: "You have successfully signed in",
      });
      signIn("credentials", {
        email: data.email,
        password: data.password,
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
