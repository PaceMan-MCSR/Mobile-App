import { Host } from "@expo/ui";
import { Button, Menu, RNHostView } from "@expo/ui/swift-ui";

import type { ContextMenuProps } from "./types";

export default function ContextMenu<T extends string | number>({
  trigger,
  options,
  selectedValue,
  onSelect,
}: ContextMenuProps<T>) {
  return (
    <Host matchContents>
      <Menu label={<RNHostView matchContents>{trigger}</RNHostView>}>
        {options.map((option) => (
          <Button
            key={String(option.value)}
            label={`${selectedValue === option.value ? "✓ " : ""}${option.label}`}
            onPress={() => onSelect(option.value)}
          />
        ))}
      </Menu>
    </Host>
  );
}
