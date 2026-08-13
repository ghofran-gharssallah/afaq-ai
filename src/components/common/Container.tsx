import type { ReactNode } from "react";
import clsx from "clsx";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container = ({ children, className }: ContainerProps) => {
  return (
    <div
      className={clsx(
        "mx-auto w-full max-w-[1450px] px-4 lg:px-6",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Container;