"use client";

import { z } from "zod";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useMutation } from "react-query";
import { signInService } from "@/app/services/signin-service";
import { toast } from "sonner";
import { Form } from "@/app/components/ui/form/form";
import { InputField, LoadingButton } from "@/app/components/ui/form";
import { useSigninForm, signinSchema } from "@/hooks/use-signin-form";
import { AuthLayout } from "@/app/components/auth/AuthLayout";

const SignIn = () => {
  const form = useSigninForm(); // This is a custom hook that returns a form object

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const signInMutation = useMutation(signInService, {
    onMutate: () => {
      toast.info("Signing in...");
    },
    onSuccess: ({ data }) => {
      toast.success("Sign in successful", {
        description: "You have successfully signed in",
      });
      signIn("credentials", {
        email: data.email,
        password: form.getValues().password,
        redirect: true,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message, {
        description: "Sign in failed",
      });
    },
  });

  const handleSignIn = async (values: z.infer<typeof signinSchema>) => {
    signInMutation.mutate(values);
  };

  const subFormContent = (
    <>
      <Link
        href="/forgot-password"
        className="inline-flex justify-center py-4 text-base font-medium text-gray-500 focus:outline-none hover:text-neutral-600 focus:text-blue-600 sm:text-sm"
      >
        Forgot password?
      </Link>
      <Link
        href="/signup"
        className="inline-flex justify-center py-2 text-base font-medium text-gray-500 focus:outline-none hover:text-neutral-600 focus:text-blue-600 sm:text-sm"
      >
        Don't have an account? <span className="underline">Sign up</span>
      </Link>
    </>
  );

  return (
    <AuthLayout
      title="Sign in"
      subTitle="Login for shopping..."
      subFormContent={subFormContent}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSignIn)}
          className="mt-6 space-y-2"
        >
          <InputField
            label="Email"
            name="email"
            type="text"
            placeholder="Enter your email"
            control={control}
            errors={errors}
            variant="signIn"
            disabled={signInMutation.isLoading}
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            control={control}
            errors={errors}
            variant="signIn"
            disabled={signInMutation.isLoading}
          />
          <div className="flex flex-col mt-4 lg:space-y-2">
            <LoadingButton
              isLoading={signInMutation.isLoading}
              loadingText="Please wait.."
              type="submit"
              buttonText="Sign in"
            />
          </div>
        </form>
      </Form>
    </AuthLayout>
  );
};

export default SignIn;
