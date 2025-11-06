export default function Logo({ className }) {
    return (
        <svg 
            id="Layer_1" 
            data-name="Layer 1" 
            xmlns="http://www.w3.org/2000/svg" 
            xmlns:xlink="http://www.w3.org/1999/xlink" 
            viewBox="0 0 23.19 32"
            className={className}
        >
            <defs>
                <linearGradient id="linear-gradient" x1="4.33" y1="5.17" x2="4.33" y2="27.83" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#8b56e1" />
                    <stop offset="0.35" stopColor="#9b56e1" />
                    <stop offset="1" stopColor="#c156e1" />
                </linearGradient>
            </defs>
            <rect
                className="cls-1"
                width="8.67"
                height="32"
                rx="4.33"
                fill="url(#linear-gradient)"
            />
            <rect
                className="cls-2"
                x="12.11"
                y="5.81"
                width="8.67"
                height="29.2"
                rx="4.33"
                transform="translate(14.4 -5.65) rotate(45)"
                fill="#8b56e1"
            />
            <circle
                className="cls-2"
                cx="18.85"
                cy="27.67"
                r="4.33"
                fill="#8b56e1"
            />
        </svg>
    );
}