import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const Button = ({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        "rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300",
        variant === "primary"
          ? "bg-violet-600 text-white hover:bg-violet-500 hover:shadow-[0_0_35px_rgba(79,40,183,.35)]"
          : "border border-white/10 bg-white/5 text-white hover:bg-white/10",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;