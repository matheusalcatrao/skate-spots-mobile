import { useState } from "react";
import {
  TextInput,
  type TextInputProps,
} from "react-native";

const baseClassName =
  "w-full rounded-[10px] border-2 border-lime-300 bg-transparent px-[25px] py-[10px] text-white";

/** Matches web-style input + :active inset glow (approximated while focused). */
export function PrimaryTextInput({
  className,
  style,
  onFocus,
  onBlur,
  ...props
}: TextInputProps & { className?: string }) {
  const [focused, setFocused] = useState(false);

  return (
    <TextInput
      placeholderTextColor="#767575"
      {...props}
      className={[baseClassName, focused && "bg-lime-300/10", className]
        .filter(Boolean)
        .join(" ")}
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      style={[
        focused
          ? {
              shadowColor: "#bef264",
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 0.55,
              shadowRadius: 15,
            }
          : undefined,
        style,
      ]}
    />
  );
}
