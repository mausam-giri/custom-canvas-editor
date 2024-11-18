import { cn } from "@/lib/utils";
import { FC, InputHTMLAttributes } from "react";

export interface CustomInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  title?: string;
  label?: string;
  containerClass?: string;
  labelClass?: string;
  children?: React.ReactNode;
  visible?: boolean;
  dataParse?: string;
}

export function Input({
  title,
  label,
  children,
  containerClass = "",
  labelClass = "",
  visible = true,
  ...props
}: CustomInputProps) {
  if (!visible) return null;

  return (
    <div
      title={title}
      className={cn(`flex gap-2 items-center`, containerClass)}
    >
      <label
        htmlFor={props.name}
        className={cn(
          "w-5 h-5 opacity-60 relative flex items-center justify-center",
          labelClass
        )}
      >
        {label || children}
      </label>
      <div className="flex-1">
        <input
          type={props.type || "text"}
          className={cn(
            "w-full min-w-10 py-1 border px-2 rounded-md outline-none focus:outline-blue-500",
            props.className
          )}
          {...props}
        />
      </div>
    </div>
  );
}
