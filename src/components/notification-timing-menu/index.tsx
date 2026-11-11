import NotificationTimingMenuTrigger from "@/components/notification-timing-menu/trigger";
import { NotificationTimingMenuProps } from "@/components/notification-timing-menu/types";
import { Host } from "@expo/ui";
import { Menu, Picker, RNHostView, Text } from "@expo/ui/swift-ui";
import { pickerStyle, tag } from "@expo/ui/swift-ui/modifiers";

export default function NotificationTimingMenu({ value, options, getLabel, onChange }: NotificationTimingMenuProps) {
  return (
    <Host matchContents>
      <Menu
        label={
          <RNHostView matchContents>
            <NotificationTimingMenuTrigger label={getLabel(value)} />
          </RNHostView>
        }
      >
        <Picker selection={value} onSelectionChange={onChange} modifiers={[pickerStyle("inline")]}>
          {options.map((option) => (
            <Text key={option} modifiers={[tag(option)]}>
              {getLabel(option)}
            </Text>
          ))}
        </Picker>
      </Menu>
    </Host>
  );
}
