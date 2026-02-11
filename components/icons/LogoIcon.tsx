
import React from 'react';

export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2.5 2.5a3.5 3.5 0 0 1 5 0L12 7l4.5-4.5a3.5 3.5 0 0 1 5 0v0a3.5 3.5 0 0 1 0 5L17 12l4.5 4.5a3.5 3.5 0 0 1-5 5L12 17l-4.5 4.5a3.5 3.5 0 0 1-5-5v0a3.5 3.5 0 0 1 0-5L7 12 2.5 7.5a3.5 3.5 0 0 1 0-5Z" />
    <path d="M12 12a3 3 0 1 0 0-0.001 3 3 0 0 0 0 0.001Z" />
  </svg>
);
