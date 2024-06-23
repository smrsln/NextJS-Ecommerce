"use client";

import { z } from "zod";
import { useSignupForm, signupSchema } from "@/hooks/auth/useSignUpForm";
import { Form } from "@/app/components/ui/form/form";
import { InputField, LoadingButton } from "@/app/components/form";
import { AuthLayout, SignUpSubFormContent } from "@/app/components/auth";
import useSignUpMutation from "@/hooks/auth/useSignUpMutation";

const SignUp = () => {
  const formMethods = useSignupForm();
  const signUpMutation = useSignUpMutation();

  const isDisabled = signUpMutation.isLoading || signUpMutation.isSuccess;

  const handleSignUp = async (values: z.infer<typeof signupSchema>) => {
    signUpMutation.mutate(values);
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = formMethods;

  return (
    <>
      <AuthLayout
        title="Sign up"
        subTitle="Sign up for shopping..."
        subFormContent={<SignUpSubFormContent />}
      >
        <Form {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit(handleSignUp)}
            className="mt-6 space-y-2"
          >
            <InputField
              label="Email"
              name="email"
              type="text"
              placeholder="Enter your email"
              control={control}
              errors={errors}
              variant="signUp"
              disabled={isDisabled}
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              control={control}
              errors={errors}
              variant="signUp"
              disabled={isDisabled}
            />
            <div className="flex flex-col mt-4 lg:space-y-2">
              <LoadingButton
                isLoading={isDisabled}
                loadingText="Please wait.."
                type="submit"
                buttonText="Sign up"
              />
            </div>
          </form>
        </Form>
      </AuthLayout>
    </>
  );
};

export default SignUp;
