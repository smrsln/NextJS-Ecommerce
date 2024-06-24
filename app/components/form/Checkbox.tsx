import React from "react";

type CheckboxProps = {
  label: string;
  name: string;
  control: any;
};

const Checkbox: React.FC<CheckboxProps> = ({ label, name, control }) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={name}
        {...control}
        className="text-primary-500 border-gray-300 rounded focus:ring-primary-500 dark:border-gray-200"
      />
      <label
        htmlFor={name}
        className="ml-2 text-sm text-neutral-70 dark:text-gray-200"
      >
        {label}
      </label>
    </div>
  );
};

export { Checkbox };
