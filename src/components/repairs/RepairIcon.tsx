/** Single-stroke line icons, matching the shop's existing icon set. */
const PATHS: Record<string, React.ReactNode> = {
  screen: (
    <>
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
      <path d="M10 19h4" />
      <path d="m9 7 6 6M15 7l-6 6" />
    </>
  ),
  battery: (
    <>
      <rect x="2.5" y="7" width="16" height="10" rx="2.5" />
      <path d="M21.5 10.5v3" />
      <path d="M6 10.5v3M9.5 10.5v3" />
    </>
  ),
  tools: (
    <>
      <path d="M14.5 6a3.5 3.5 0 0 0 4.6 4.6L21 12.5 12.5 21 4 12.5 5.9 10.6A3.5 3.5 0 0 0 10.5 6" />
    </>
  ),
  water: (
    <>
      <path d="M12 3s6 6.4 6 10.2A6 6 0 0 1 6 13.2C6 9.4 12 3 12 3z" />
    </>
  ),
  laptop: (
    <>
      <rect x="4" y="5" width="16" height="11" rx="2" />
      <path d="M2 19h20" />
    </>
  ),
  console: (
    <>
      <rect x="2.5" y="8" width="19" height="9" rx="4.5" />
      <path d="M7 11v3M5.5 12.5h3" />
      <circle cx="16" cy="11.8" r="0.9" />
      <circle cx="18.2" cy="13.6" r="0.9" />
    </>
  ),
}

export function RepairIcon({ name }: { name: string }) {
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
      aria-hidden="true"
    >
      {PATHS[name] ?? PATHS.tools}
    </svg>
  )
}
