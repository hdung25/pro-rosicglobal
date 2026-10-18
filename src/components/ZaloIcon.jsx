/**
 * Official Zalo app icon (taken from the Zalo PC app), used instead of the
 * small "Zalo" wordmark from react-icons so it reads like the other channels.
 */
export function ZaloIcon({ size = 18, className = "" }) {
  return (
    <img
      className={`zalo-icon ${className}`.trim()}
      src="/images/social/zalo-icon.png"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      draggable="false"
    />
  );
}
