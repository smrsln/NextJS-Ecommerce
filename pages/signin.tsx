"use client";

import { useState } from "react";
import { z } from "zod";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useMutation } from "react-query";
import { signInService } from "@/app/services/signin-service";
import { toast } from "sonner";
import { Form } from "@/app/components/ui/form/form";
import { InputField, LoadingButton } from "@/app/components/ui/form";
import { useSigninForm, signinSchema } from "@/hooks/use-signin-form";

const SignIn = () => {
  const form = useSigninForm(); // This is a custom hook that returns a form object
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      setIsLoading(false);
      toast.error(error.message, {
        description: "Sign in failed",
      });
    },
  });

  const handleSignIn = async (values: z.infer<typeof signinSchema>) => {
    setIsLoading(true);
    signInMutation.mutate(values);
  };

  return (
    <section>
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 md:px-12 lg:px-24 lg:py-24">
        <div className="justify-center mx-auto text-left align-bottom transition-all transform bg-white rounded-lg sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="grid flex-wrap items-center justify-center grid-cols-1 mx-auto shadow-xl lg:grid-cols-2 rounded-xl">
            <div className="w-full px-6 py-3">
              <div>
                <div className="mt-3 text-left sm:mt-5">
                  <div className="inline-flex items-center w-full">
                    <h3 className="text-lg font-bold text-neutral-600 leading-6 lg:text-5xl">
                      Sign in
                    </h3>
                  </div>
                  <div className="mt-4 text-base text-gray-500">
                    <p>Sign in to get our newest news.</p>
                  </div>
                </div>
              </div>
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
                  />
                  <InputField
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    control={control}
                    errors={errors}
                    variant="signIn"
                  />
                  <div className="flex flex-col mt-4 lg:space-y-2">
                    <LoadingButton
                      isLoading={isLoading}
                      loadingText="Please wait.."
                      type="submit"
                    />
                    <Link
                      href="#"
                      type="button"
                      className="inline-flex justify-center py-4 text-base font-medium text-gray-500 focus:outline-none hover:text-neutral-600 focus:text-blue-600 sm:text-sm"
                    >
                      Forgot your Password?
                    </Link>
                    <Link
                      href="/signup"
                      className="inline-flex justify-center py-4 text-base font-medium text-gray-500 focus:outline-none hover:text-neutral-600 focus:text-blue-600 sm:text-sm"
                    >
                      Don't have an account?{" "}
                      <span className="font-bold underline">Sign up</span>
                    </Link>
                  </div>
                </form>
              </Form>
            </div>
            <div
              className="order-first hidden w-full lg:block relative"
              style={{ position: "relative" }}
            >
              <Image
                className="object-cover h-full bg-cover rounded-l-lg"
                src="https://images.unsplash.com/photo-1491933382434-500287f9b54b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWgelvHx8fHx8&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=1000&amp;q=80"
                alt=""
                width={1000}
                height={667}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
