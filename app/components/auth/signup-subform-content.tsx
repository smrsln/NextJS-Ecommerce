import React from "react";
import Link from "next/link";

const SignUpSubFormContent: React.FC = () => {
  return (
    <>
      <Link
        href="/signin"
        type="button"
        className="inline-flex justify-center py-4 text-base font-medium text-gray-500 focus:outline-none hover:text-neutral-600 focus:text-blue-600 sm:text-sm"
      >
        Already have an account? Sign in
      </Link>
    </>
  );
};

export { SignUpSubFormContent };
