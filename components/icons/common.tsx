import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

export const PlusIcon: React.FC<IconProps> = ({
  className = "",
  size = 16,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
  >
    <path
      fill="currentColor"
      d="M8 1.75a.75.75 0 0 1 .75.75v4.75h4.75a.75.75 0 0 1 0 1.5H8.75v4.75a.75.75 0 0 1-1.5 0V8.75H2.5a.75.75 0 0 1 0-1.5h4.75V2.5A.75.75 0 0 1 8 1.75"
    />
  </svg>
);

export const MinusIcon: React.FC<IconProps> = ({
  className = "",
  size = 16,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
  >
    <path
      fill="currentColor"
      d="M3 8a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 3 8"
    />
  </svg>
);

export const CenterIcon: React.FC<IconProps> = ({
  className = "",
  size = 16,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
  >
    <path
      fill="currentColor"
      d="M8 2.75a.75.75 0 0 1 .75.75v1.75h1.75a.75.75 0 0 1 0 1.5H8.75v3h1.75a.75.75 0 0 1 0 1.5H8.75V13a.75.75 0 0 1-1.5 0v-1.75H5.5a.75.75 0 0 1 0-1.5h1.75v-3H5.5a.75.75 0 0 1 0-1.5h1.75V3.5A.75.75 0 0 1 8 2.75"
    />
  </svg>
);

