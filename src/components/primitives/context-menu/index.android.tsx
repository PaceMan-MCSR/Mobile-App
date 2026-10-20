import { Host } from "@expo/ui";
import { Text as ComposeText, DropdownMenu, DropdownMenuItem, RNHostView } from "@expo/ui/jetpack-compose";
import { useState } from "react";
import { Pressable } from "react-native";

import type { ContextMenuProps } from "./types";

export default function ContextMenu<T extends string | number>({
  trigger,
  options,
  selectedValue,
  onSelect,
}: ContextMenuProps<T>) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Host matchContents>
      <DropdownMenu expanded={expanded} onDismissRequest={() => setExpanded(false)}>
        <DropdownMenu.Trigger>
          <RNHostView matchContents>
            <Pressable onPress={() => setExpanded(true)}>{trigger}</Pressable>
          </RNHostView>
        </DropdownMenu.Trigger>
        <DropdownMenu.Items>
          {options.map((option) => (
            <DropdownMenuItem
              key={String(option.value)}
              onClick={() => {
                onSelect(option.value);
                setExpanded(false);
              }}
            >
              <DropdownMenuItem.Text>
                <ComposeText>{option.label}</ComposeText>
              </DropdownMenuItem.Text>
              {selectedValue === option.value && (
                <DropdownMenuItem.TrailingIcon>
                  <ComposeText>✓</ComposeText>
                </DropdownMenuItem.TrailingIcon>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenu.Items>
      </DropdownMenu>
    </Host>
  );
}
