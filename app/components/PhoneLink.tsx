"use client";

export default function PhoneLink({
  phone,
  className = "underline",
  style,
  children,
}: {
  phone: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  return (
    <a href={`tel:${phone}`} className={className} style={style}>
      {children ?? phone}
    </a>
  );
}
