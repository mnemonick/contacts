import { type ComponentProps, createElement, type CSSProperties, useEffect, useRef, useState } from "react";
import colors from "#/utils/colors.ts";
import { TEXT_MAX } from "%/utils/validate.ts";

const DIRTY_DELAY = 4000;

type Props = Omit<ComponentProps<"input">, "name" | "onChange" | "value" | "style"> & {
  name: string;
  onChange: (value: string) => void;
  value: string;
  style?: CSSProperties;
  icon?: string;
  invalid?: boolean;
  onDirty?: () => void;
};

// Renders a custom tag named after `name`, so E2E tests can locate the field by tag.
export default function ({ name, onChange, value, onDirty, icon, invalid, style, ...rest }: Props) {
  const [dirty, setDirty] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const $input: CSSProperties = {
    display: "block",
    outline: "none",
    fontFamily: "Montserrat",
    border: "none",
    height: "100%",
    width: "calc(100% - 64px)",
    fontSize: 20,
    background: "transparent",
    color: invalid ? colors.text.error : colors.text.strong
  };

  const $field: CSSProperties = {
    display: "flex",
    alignItems: "center",
    ...style
  };

  const $icon: CSSProperties = {
    color: $input.color,
    paddingLeft: 20,
    paddingRight: 20
  };

  return createElement(
    name,
    { style: $field },
    icon ? (
      <span style={$icon} className="material-symbols-outlined">
        {icon}
      </span>
    ) : null,
    <input
      maxLength={TEXT_MAX}
      {...rest}
      style={$input}
      value={value}
      onChange={(event) => {
        onChange(event.currentTarget.value);

        // Validation errors appear only after the user pauses typing for DIRTY_DELAY ms.
        if (typeof onDirty === "function" && !dirty) {
          clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => {
            setDirty(true);
            onDirty();
          }, DIRTY_DELAY);
        }
      }}
    />
  );
}
