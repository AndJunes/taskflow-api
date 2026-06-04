export const Logo = () => (
  <div className="flex items-center gap-3">
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" aria-hidden="true">
      <rect width="6" height="25" rx="2" fill="#635FC7" />
      <rect x="9" width="6" height="25" rx="2" fill="#635FC7" fillOpacity="0.75" />
      <rect x="18" width="6" height="25" rx="2" fill="#635FC7" fillOpacity="0.5" />
    </svg>
    <span className="text-[32px] font-bold text-black dark:text-white">kanban</span>
  </div>
);

export const BoardIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89v3.822h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z" />
  </svg>
);

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const EyeSlashIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

export const EyeIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const SunIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

export const MoonIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
  </svg>
);

export const EllipsisIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 5 20" fill="currentColor" aria-hidden="true">
    <circle cx="2.5" cy="2.5" r="2.5" />
    <circle cx="2.5" cy="10" r="2.5" />
    <circle cx="2.5" cy="17.5" r="2.5" />
  </svg>
);

export const CheckIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 5l3.5 3.5L11 1" />
  </svg>
);

export const CrossIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M1 1l13 13M14 1L1 14" />
  </svg>
);

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 25" xmlns="http://www.w3.org/2000/svg">
      <rect width="6" height="25" rx="2" fill="#635FC7" />
      <rect opacity="0.75" x="9" width="6" height="25" rx="2" fill="#635FC7" />
      <rect opacity="0.5" x="18" width="6" height="25" rx="2" fill="#635FC7" />
    </svg>
  );
}

export function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.368 12V7.344H12V4.632H7.368V0H4.656v4.632H0v2.712h4.656V12z" />
    </svg>
  );
}