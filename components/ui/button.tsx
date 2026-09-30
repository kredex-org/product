import { clsx } from "clsx";
import { type ButtonHTMLAttributes } from "react";

type Variant = "default" | "outline" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  isLoading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  default: "bg-violet-600 text-white hover:bg-violet-700",
  outline: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
};

export function Button({ className, variant = "default", isLoading, children, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex min-h-9 items-center justify-center rounded-full px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        variantStyles[variant],
        className,
      )}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && (
        <svg
          className="mr-2 h-4 w-4 animate-spin text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
