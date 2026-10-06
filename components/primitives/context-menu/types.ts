import type { ReactNode } from "react";

export type ContextMenuOption<T extends string | number> = {
  value: T;
  label: string;
};

export type ContextMenuProps<T extends string | number> = {
  trigger: ReactNode;
  options: readonly ContextMenuOption<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;
};
