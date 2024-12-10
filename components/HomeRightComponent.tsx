import { View } from "react-native";
import React from "react";
import * as DropdownMenu from "zeego/dropdown-menu";
import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";

interface HomeRightComponentProps {
  liveOnly: boolean;
  gameVersion: string;
  onGameVersionSelect: (key: string) => void;
  onLiveOnlyToggle: () => void;
}

const HomeRightComponent = ({
  liveOnly,
  gameVersion,
  onGameVersionSelect,
  onLiveOnlyToggle,
}: HomeRightComponentProps) => {
  // const router = useRouter();

  const versions = [
    { key: "1.16.1", label: "1.16.1" },
    { key: "1.15.2", label: "1.15.2" },
    { key: "1.7.10", label: "1.7.10" },
    { key: "1.8.9", label: "1.8.9" },
    { key: "1.14.4", label: "1.14.4" },
    { key: "1.12.2", label: "1.12.2" },
    { key: "1.16.5", label: "1.16.5" },
    { key: "1.17.1", label: "1.17.1" },
  ];

  const renderCheckmark = (key: string) =>
    gameVersion === key ? (
      <DropdownMenu.ItemIcon
        ios={{
          name: "checkmark",
          pointSize: 16,
        }}
      />
    ) : null;

  return (
    <View className="flex flex-row-reverse items-center">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <View style={{ marginRight: 12 }}>
            <Ionicons name="menu-outline" size={28} color="white" />
          </View>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger key="version">
              <DropdownMenu.ItemTitle>Select Version</DropdownMenu.ItemTitle>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              {versions.map(({ key, label }) => (
                <DropdownMenu.Item key={key} onSelect={() => onGameVersionSelect(key)}>
                  <DropdownMenu.ItemTitle>{label}</DropdownMenu.ItemTitle>
                  {renderCheckmark(key)}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Item key="liveOnly" onSelect={onLiveOnlyToggle}>
            <DropdownMenu.ItemTitle>Live Only</DropdownMenu.ItemTitle>
            {liveOnly && (
              <DropdownMenu.ItemIcon
                ios={{
                  name: "checkmark",
                  pointSize: 16,
                }}
              />
            )}
          </DropdownMenu.Item>
          {/* <DropdownMenu.Item key="settings" onSelect={() => router.push("/settings")}>
            <DropdownMenu.ItemTitle>Settings</DropdownMenu.ItemTitle>
          </DropdownMenu.Item> */}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </View>
  );
};

export default HomeRightComponent;
