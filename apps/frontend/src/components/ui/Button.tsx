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
    'inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 py-2.5 font-semibold text-studio-950 no-underline transition hover:bg-cyan-300',
  secondary:
    'inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-black/40 px-5 py-2.5 font-medium text-studio-50 no-underline backdrop-blur-sm transition hover:border-cyan-400 hover:text-cyan-300',
  ghost:
    'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-medium text-cyan-300 no-underline transition hover:text-cyan-400',
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
