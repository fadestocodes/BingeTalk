// components/FilmmakerIcon.js
import React from 'react';
import { Svg, Path, Circle } from 'react-native-svg';

export default function FilmloverIcon({ size = 28.2, color = '#9ca3af' }) {

     // Original width and height of the SVG
  const originalWidth = 28.2;
  const originalHeight = 22.9;

  // Calculate proportional width and height based on size
  const scale = size / originalWidth;
  const width = originalWidth * scale;
  const height = originalHeight * scale;

  return (
    <Svg width={width} height={height} viewBox="0 0 28.2 22.9">
      {/* st0 paths */}
      <Path
        d="M16.6,20.6v-2c0-2.2-1.8-4-4-4h-6c-2.2,0-4,1.8-4,4v2"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle
        cx="9.6"
        cy="6.6"
        r="4"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* st1 paths */}
      <Path
        d="M25.5,11.8c.7,0,1.3-.6,1.3-1.3s-.6-1.3-1.3-1.3c0-.7-.6-1.3-1.3-1.3s-1.3.6-1.3,1.3c0-.7-.6-1.3-1.3-1.3s-1.3.6-1.3,1.3c0-.7-.6-1.3-1.3-1.3s-1.3.6-1.3,1.3c-.7,0-1.3.6-1.3,1.3s.6,1.3,1.3,1.3"
        fill="none"
        stroke={color}
        strokeWidth={1.1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20.2,21.1l-.7-9.3"
        fill="none"
        stroke={color}
        strokeWidth={1.1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22.8,21.1l.7-9.3"
        fill="none"
        stroke={color}
        strokeWidth={1.1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M26.8,11.8c.3,0,.6.3.5.7l-1.7,7.9c0,.3-.5.7-.8.7h-6.6c-.4,0-.7-.3-.8-.7l-1.7-7.9c0-.4.2-.7.5-.7h10.6Z"
        fill="none"
        stroke={color}
        strokeWidth={1.1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
