import React from "react";
import Link from "next/link";

const SignInSubFormContent: React.FC = () => {
  return (
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
};

export { SignInSubFormContent };
