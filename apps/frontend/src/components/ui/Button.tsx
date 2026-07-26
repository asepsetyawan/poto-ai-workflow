import { Slot } from '@radix-ui/react-slot';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  asChild?: boolean;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'rounded-md bg-teal-500 px-5 py-2.5 font-medium text-graphite-50 no-underline transition hover:bg-teal-400',
  secondary:
    'rounded-md border border-graphite-100/40 px-5 py-2.5 font-medium text-graphite-50 no-underline transition hover:border-teal-400 hover:text-teal-400',
  ghost:
    'rounded-md px-5 py-2.5 font-medium text-teal-400 no-underline transition hover:text-teal-500',
};

export function Button({
  children,
  variant = 'primary',
  asChild = false,
  className = '',
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp className={`${variantClasses[variant]} ${className}`.trim()} {...props}>
      {children}
    </Comp>
  );
}
