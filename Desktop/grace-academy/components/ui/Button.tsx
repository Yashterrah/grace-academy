import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "gold" | "outlineLight";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-teal-600 text-cream-50 hover:bg-teal-700 shadow-card hover:shadow-card-hover focus-visible:outline-teal-600",
  secondary:
    "bg-transparent text-teal-600 border border-teal-600/40 hover:bg-teal-50 focus-visible:outline-teal-600",
  ghost:
    "bg-transparent text-ink hover:bg-ink/5 focus-visible:outline-ink",
  gold:
    "bg-gold-400 text-teal-900 hover:bg-gold-300 shadow-glow focus-visible:outline-gold-400",
  outlineLight:
    "bg-white/0 text-cream-50 border border-cream-50/40 hover:bg-white/10 focus-visible:outline-cream-50",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-sm px-4 py-2 rounded-full",
  md: "text-[0.95rem] px-5 py-3 rounded-full",
  lg: "text-base px-7 py-4 rounded-full",
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

interface ButtonAsButton
  extends BaseProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> {
  href?: undefined;
}

interface ButtonAsLink
  extends BaseProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> {
  href: string;
  external?: boolean;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const baseClasses =
  "inline-flex items-center justify-center gap-2 font-body font-semibold tracking-wide transition-all duration-200 ease-out disabled:opacity-50 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98]";

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

  if ("href" in props && props.href) {
    const { href, external, ...rest } = props as ButtonAsLink;
    if (external || href.startsWith("http") || href.startsWith("https://wa.me")) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    );
  }

  const { ...rest } = props as ButtonAsButton;
  return (
    <button className={classes} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
