"use client";

import { z } from "zod";
import { Form } from "@/app/components/ui/form/form";
import { InputField, LoadingButton, Checkbox } from "@/app/components/form";
import { useSigninForm, signinSchema } from "@/hooks/auth/useSignInForm";
import { AuthLayout, SignInSubFormContent } from "@/app/components/auth";
import useSignInMutation from "@/hooks/auth/useSignInMutation";

const SignIn = () => {
  const formMethods = useSigninForm();
  const signInMutation = useSignInMutation();

  const isDisabled = signInMutation.isLoading || signInMutation.isSuccess;

  const handleSignIn = async (values: z.infer<typeof signinSchema>) => {
    signInMutation.mutate(values);
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = formMethods;

  return (
    <AuthLayout
      title="Sign in"
      subTitle="Login for shopping..."
      subFormContent={<SignInSubFormContent />}
    >
      <Form {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit(handleSignIn)}
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
            disabled={isDisabled}
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            control={control}
            errors={errors}
            variant="signIn"
            disabled={isDisabled}
          />
          <div className="flex flex-col mt-4 lg:space-y-2">
            <LoadingButton
              isLoading={isDisabled}
              loadingText="Please wait.."
              type="submit"
              buttonText="Sign in"
            />
          </div>
          <Checkbox label="Remember Me" name="rememberMe" control={control} />
        </form>
      </Form>
    </AuthLayout>
  );
};

export default SignIn;
