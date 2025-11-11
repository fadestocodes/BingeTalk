// components/FilmmakerIcon.js
import React from 'react';
import { Svg, Path, Circle } from 'react-native-svg';

export default function FilmmakerIcon({ size = 28.2, color = '#9ca3af' }) {


     // Original width and height of the SVG
  const originalWidth = 28.2;
  const originalHeight = 22.9;

  // Calculate proportional width and height based on size
  const scale = size / originalWidth;
  const width = originalWidth * scale;
  const height = originalHeight * scale;
  return (
    <Svg width={width} height={height} viewBox="0 0 29.2 22.9">
      <Path
        d="M16.4,20.6v-2c0-2.2-1.8-4-4-4h-6c-2.2,0-4,1.8-4,4v2"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle
        cx="9.4"
        cy="6.6"
        r="4"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M27.1,9.5l-12.5,3.6-.7-1.7c-.2-.8.2-1.6.9-1.8l9.8-2.9c.8-.2,1.6.2,1.8.9l.6,1.9Z"
        fill="none"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17,9l2.2,2.8"
        fill="none"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21.4,7.6l2.2,2.9"
        fill="none"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14.6,13.1h13.1v5.8c0,.8-.6,1.5-1.5,1.5h-10.2c-.8,0-1.5-.6-1.5-1.5v-5.8Z"
        fill="none"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
