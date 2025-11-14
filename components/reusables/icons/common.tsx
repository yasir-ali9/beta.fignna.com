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

export const ChevronDownIcon: React.FC<IconProps> = ({
  className = "",
  size = 10,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M7.08366 4.1665L5.00033 6.24984L2.91699 4.1665"
      stroke="currentColor"
      strokeWidth="0.833333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const AttachIcon: React.FC<IconProps> = ({
  className = "",
  size = 16,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
  >
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.5"
    >
      <path d="M14 12a6 6 0 1 1-6-6" />
      <path d="M10 12a6 6 0 1 1 6 6" />
    </g>
  </svg>
);

export const SendIcon: React.FC<IconProps> = ({
  className = "",
  size = 16,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
  >
    <g fill="none">
      <path
        fill="currentColor"
        fillOpacity=".16"
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        strokeWidth="1.5"
        d="m8 12l4-4m0 0l4 4m-4-4v8m10-4c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10"
      />
    </g>
  </svg>
);
