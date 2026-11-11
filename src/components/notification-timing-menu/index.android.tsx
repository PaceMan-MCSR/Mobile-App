import NotificationTimingMenuTrigger from "@/components/notification-timing-menu/trigger";
import { NotificationTimingMenuProps } from "@/components/notification-timing-menu/types";
import { useColorsForUI } from "@/hooks/use-colors-for-ui";
import Check from "@expo/material-symbols/check.xml";
import {
  Box,
  DropdownMenuGroup,
  DropdownMenuPopup,
  Host,
  Icon,
  RNHostView,
  SelectableDropdownMenuItem,
  Text,
} from "@expo/ui/jetpack-compose";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { Pressable } from "react-native";

export default function NotificationTimingMenu({ value, options, getLabel, onChange }: NotificationTimingMenuProps) {
  const [expanded, setExpanded] = useState(false);
  const { colorScheme } = useColorScheme();
  const { backgroundColor, tintColor, tabBarIndicatorColor } = useColorsForUI();

  return (
    <Host matchContents colorScheme={colorScheme}>
      <Box>
        <RNHostView matchContents>
          <Pressable onPress={() => setExpanded(true)}>
            <NotificationTimingMenuTrigger label={getLabel(value)} />
          </Pressable>
        </RNHostView>
        <DropdownMenuPopup expanded={expanded} onDismissRequest={() => setExpanded(false)}>
          <DropdownMenuGroup containerColor={backgroundColor} tonalElevation={0}>
            {options.map((option, index) => (
              <SelectableDropdownMenuItem
                key={option}
                selected={value === option}
                shapes={{ index, count: options.length }}
                colors={{
                  textColor: tintColor,
                  containerColor: backgroundColor,
                  selectedTextColor: tintColor,
                  selectedContainerColor: tabBarIndicatorColor,
                  selectedLeadingIconColor: tintColor,
                }}
                onClick={() => {
                  onChange(option);
                  setExpanded(false);
                }}
              >
                <SelectableDropdownMenuItem.Text>
                  <Text>{getLabel(option)}</Text>
                </SelectableDropdownMenuItem.Text>
                <SelectableDropdownMenuItem.SelectedLeadingIcon>
                  <Icon source={Check} contentDescription="Selected" />
                </SelectableDropdownMenuItem.SelectedLeadingIcon>
              </SelectableDropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuPopup>
      </Box>
    </Host>
  );
}
