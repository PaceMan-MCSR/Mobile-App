import { Stack } from "expo-router";
import type { ImageSourcePropType } from "react-native";
import type { SFSymbol } from "sf-symbols-typescript";

export type HeaderMenuIcon = { ios: SFSymbol; android: ImageSourcePropType };

export type HeaderMenuItem =
  | { type: "submenu"; key: string; title: string; inline?: boolean; items: HeaderMenuItem[] }
  | { type: "action"; key: string; title: string; isOn?: boolean; destructive?: boolean; onPress: () => void };

// NOTE: This is a plain function, not a component. Stack.Toolbar matches its children by
// strict identity (child.type === Stack.Toolbar.Menu), so the items must be literal toolbar
// primitives — wrapping them in a component would make them unrecognized and dropped.
function renderItem(item: HeaderMenuItem) {
  if (item.type === "submenu") {
    return (
      <Stack.Toolbar.Menu key={item.key} title={item.title} inline={item.inline}>
        {item.items.map(renderItem)}
      </Stack.Toolbar.Menu>
    );
  }
  return (
    <Stack.Toolbar.MenuAction key={item.key} isOn={item.isOn} destructive={item.destructive} onPress={item.onPress}>
      {item.title}
    </Stack.Toolbar.MenuAction>
  );
}

export default function HeaderMenu({ icon, items }: { icon: HeaderMenuIcon; items: HeaderMenuItem[] }) {
  return (
    <Stack.Toolbar placement="right">
      <Stack.Toolbar.Menu icon={process.env.EXPO_OS === "ios" ? icon.ios : icon.android}>
        {items.map(renderItem)}
      </Stack.Toolbar.Menu>
    </Stack.Toolbar>
  );
}
