import React from 'react';

interface Props {
  x: number;
  y: number;
  color?: string;
}

const EthMarker: React.FC<Props> = ({ x, y, color = '#045388' }) => (
  <g transform={`translate(${x - 15.5}, ${y - 22})`}>
    <path
      d="M28.0105 22.2916L18.3406 4.48692C17.2063 2.39842 14.2095 2.39535 13.071 4.48152L3.35378 22.286C2.82514 23.2546 2.87092 24.4353 3.47298 25.36L13.1903 40.2858C14.3752 42.1058 17.0413 42.1028 18.2222 40.2802L27.892 25.3546C28.4895 24.4323 28.535 23.2572 28.0105 22.2916Z"
      fill={color}
      stroke={color}
      strokeWidth="4"
    />
    <path
      d="M15.7008 26.0613L8.20605 21.3505M15.7008 26.0613L23.0522 21.3505M15.7008 26.0613V17.4248M8.20605 21.3505L15.7008 8.50281M8.20605 21.3505L15.7008 17.4248M15.7008 8.50281L23.0522 21.3505M15.7008 8.50281V17.4248M23.0522 21.3505L15.7008 17.4248M15.6297 29.9885L8.18799 25.383L15.6297 36.6265M15.6297 29.9885L23.1722 25.3829L15.6297 36.6265M15.6297 29.9885V36.6265"
      stroke="white"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </g>
);

export default EthMarker;
