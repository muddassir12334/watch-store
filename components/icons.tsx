import type { SVGProps } from "react";

function Icon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

type Props = SVGProps<SVGSVGElement>;

export const HeartIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z" />
  </Icon>
);
export const BagIcon = (p: Props) => (
  <Icon {...p}>
    <rect x="5" y="8" width="14" height="12.5" rx="3" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </Icon>
);
export const MenuIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icon>
);
export const CloseIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
);
export const SearchIcon = (p: Props) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4.5 4.5" />
  </Icon>
);
export const ShareIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M20 12v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h4" />
    <path d="M15 4h5v5M20 4l-8 8" />
  </Icon>
);
export const ListIcon = (p: Props) => (
  <Icon {...p}>
    <rect x="4" y="4" width="16" height="16" rx="4" />
    <path d="M8.5 9.5h7M8.5 12h7M8.5 14.5h4" />
  </Icon>
);
export const PrevIcon = (p: Props) => (
  <Icon {...p}>
    <rect x="3" y="6" width="18" height="12" rx="6" />
    <path d="M9 6v12" />
  </Icon>
);
export const NextIcon = (p: Props) => (
  <Icon {...p}>
    <rect x="3" y="6" width="18" height="12" rx="6" />
    <path d="M15 6v12" />
  </Icon>
);
export const MinusIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M6 12h12" />
  </Icon>
);
export const PlusIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M6 12h12M12 6v12" />
  </Icon>
);
export const UserIcon = (p: Props) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="10" r="2.6" />
    <path d="M6.8 18.2a5.6 5.6 0 0 1 10.4 0" />
  </Icon>
);
export const CompareIcon = (p: Props) => (
  <Icon {...p}>
    <rect x="3.5" y="5" width="7" height="14" rx="2.5" />
    <rect x="13.5" y="5" width="7" height="14" rx="2.5" />
  </Icon>
);
