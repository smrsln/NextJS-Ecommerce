"use client";

import Link from "next/link";
import { Checkbox } from "@/app/components/ui/form/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/app/components/ui/form/form";
import { twMerge } from "tailwind-merge";

type CheckboxFieldProps = {
  label: string;
  labelClassName?: string;
  name: string;
  description?: string;
  link?: string;
  linkDescription?: string;
  control: any;
  errors: any;
  variant: "withDescription" | "default";
  className?: string;
  disabled?: boolean;
};

const classSets = {
  default: "",
  withDescription: "",
};

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  labelClassName,
  name,
  description,
  link,
  linkDescription,
  control,
  errors,
  variant,
  className,
  disabled,
}) => {
  const selectedClassSet = classSets[variant];
  const finalClassName = twMerge(selectedClassSet, className);
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox
              className={finalClassName}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className={labelClassName}>{label}</FormLabel>
            {variant === "withDescription" && (
              <FormDescription>
                {description}{" "}
                {link && (
                  <Link className="underline" href={link}>
                    {linkDescription}
                  </Link>
                )}
              </FormDescription>
            )}
            {errors[name] && (
              <FormDescription className="text-red-500">
                {errors[name].message}
              </FormDescription>
            )}
          </div>
        </FormItem>
      )}
    />
  );
};

export { CheckboxField };
