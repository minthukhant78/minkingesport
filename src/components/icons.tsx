
import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
      <path d="M5 20h14" />
    </svg>
  );
}

export function TiktokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg id="Apple" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect height="427.97" rx="71.15" width="427.97" x="42.01" y="42.95"/>
        <path fill="#00f6ef" d="M389.39,221.92V164.85c-74.6-3.15-77-70.94-77-77.31v-.48H254.73V309.33h0a45.66,45.66,0,1,1-32.36-43.71V206.76a104.57,104.57,0,0,0-13.32-.85A103.42,103.42,0,1,0,312.47,309.33c0-1.45,0-2.89-.1-4.32V195.56C338.92,219.85,389.39,221.92,389.39,221.92Z"/>
        <path fill="#fff" d="M406.37,236V178.9c-74.61-3.15-77-70.94-77-77.31v-.48H271.71V323.38h0a45.66,45.66,0,1,1-32.36-43.7V220.81A104.57,104.57,0,0,0,226,220,103.42,103.42,0,1,0,329.45,323.38c0-1.45,0-2.89-.1-4.32V209.61C355.9,233.9,406.37,236,406.37,236Z"/>
        <path fill="#ff004f" d="M313.82,101.11c2.78,15.14,10.9,38.81,34.57,52.66-18.09-21.07-19-48.26-19-52.18v-.48Z"/>
        <path fill="#ff004f" d="M406.37,236V178.9a106.46,106.46,0,0,1-17-2v44.95s-50.47-2.07-77-26.36V304.91c.06,1.43.1,2.87.1,4.32a103.43,103.43,0,0,1-160.72,86.1,103.41,103.41,0,0,0,177.7-71.95c0-1.45,0-2.89-.1-4.32V209.61C355.9,233.9,406.37,236,406.37,236Z"/>
        <path fill="#ff004f" d="M222.37,265.53a45.69,45.69,0,0,0-33.19,84.85,45.69,45.69,0,0,1,50.17-70.7V220.81A104.57,104.57,0,0,0,226,220c-1.23,0-2.44,0-3.66.07Z"/>
    </svg>
  );
}

export function PlayStoreIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <polygon fill="#57CEF3" points="7,3 7,61 40,32" />
      <polygon fill="#FFF200" points="36,32 44,22 59,32 44,42" />
      <polygon fill="#48FF48" points="36,32 7,3 11,3 45,23" />
      <polygon fill="#FF6C58" points="36,32 7,61 11,61 45,41" />
    </svg>
  );
}

export function AppleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      enableBackground="new 0 0 24 24"
      version="1.1"
      viewBox="0 0 24 24"
      {...props}
    >
      <defs>
        <linearGradient id="appStoreGradient" gradientUnits="userSpaceOnUse" x1="12" x2="12" y1="0.5" y2="23.5">
          <stop offset="0" style={{ stopColor: "#15BEF0" }} />
          <stop offset="0.155" style={{ stopColor: "#18B2E8" }} />
          <stop offset="0.432" style={{ stopColor: "#2094D2" }} />
          <stop offset="0.797" style={{ stopColor: "#2E62AF" }} />
          <stop offset="1" style={{ stopColor: "#374499" }} />
        </linearGradient>
      </defs>
      <g>
        <circle cx="12" cy="12" r="11.5" fill="url(#appStoreGradient)" />
        <path
          d="M11.217 7.154l-.897-.404c-.256-.115-.558.003-.666.263L9.196 8.108l1.818.847.462-1.16c.1-.25-.014-.532-.259-.641z"
          fill="#FFFFFF"
        />
        <polygon
          fill="#FFFFFF"
          points="9.003 8.57 5.781 16.276 7.737 17.187 10.829 9.42"
        />
        <polygon
          fill="#FFFFFF"
          points="5.59 16.739 5.5 19.563 7.538 17.645"
        />
        <polygon
          fill="#FFFFFF"
          points="16.393 11.5 17.229 13.5 21 13.5 21 11.5"
        />
        <path
          d="M16.158 12.235l-3.288-7.865c-.109-.26-.41-.379-.667-.263l-.896.404c-.244.11-.358.392-.259.641l3.178 7.983L16.158 12.235z"
          fill="#FFFFFF"
        />
        <polygon
          fill="#FFFFFF"
          points="16.351 12.697 14.411 13.6 14.96 14.978 16.933 14.089"
        />
        <path
          d="M17.098 14.563l-1.904.857-.002.002c-.06.454-.109 1.078.106 1.568.513 1.17 1.532 1.851 1.354 2.87 0 0 1.299-1.688 1.448-2.776.18-1.308-.5-2.082-1.002-2.518z"
          fill="#FFFFFF"
        />
        <polygon
          fill="#FFFFFF"
          points="9.743 13.5 13.833 13.5 13.037 11.5 10.539 11.5"
        />
        <polygon
          fill="#FFFFFF"
          points="7.236 11.5 3 11.5 3 13.5 6.4 13.5"
        />
      </g>
    </svg>
  );
}

export function XIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            {...props}
        >
            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.931ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
        </svg>
    );
}
