import React from "react";
import { Svg, Path } from "react-native-svg";

export default function ClipboardIcon({ size = 24, color = "black" }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M16 2H8C6.9 2 6 2.9 6 4H4V20H20V4H18C18 2.9 17.1 2 16 2ZM8 4H16V6H8V4ZM18 18H6V6H8V8H16V6H18V18Z"
        fill={color}
      />
    </Svg>
  );
}