type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/** Graceful initials fallback when there's no image — docs/design-system.md. */
export function Avatar({ name, src, size = "md", className = "" }: AvatarProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-bg-surface-hover font-medium text-text-primary ${sizeClasses[size]} ${className}`}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- avatar sources are arbitrary external URLs, not known ahead of time
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        getInitials(name)
      )}
    </span>
  );
}
