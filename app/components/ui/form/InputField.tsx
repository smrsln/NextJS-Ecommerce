import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form/form";
import { Input } from "@/app/components/ui/form/input";
import { twMerge } from "tailwind-merge";

type InputFieldProps = {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  control: any;
  errors: any;
  variant: "signIn" | "signUp";
  className?: string;
};

const classSets = {
  signIn:
    "block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300",
  signUp:
    "block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300",
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type,
  placeholder,
  control,
  errors,
  variant,
  className,
}) => {
  const selectecClassSet = classSets[variant];
  const finalClassName = twMerge(selectecClassSet, className);
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={name} className="sr-only">
            {label}
          </FormLabel>
          <FormControl>
            <Input
              type={type}
              id={name}
              placeholder={placeholder}
              className={finalClassName}
              {...field}
            />
          </FormControl>
          {errors[name] && <FormMessage>{errors[name].message}</FormMessage>}
        </FormItem>
      )}
    />
  );
};

export { InputField };
