/**
TODO: 
- Refactor code to make it cleaner.
- Add Android icons.
- Make icon update upon click instead of updating when the content loads.
*/

import { View } from "react-native";
import React from "react";
import * as DropdownMenu from "zeego/dropdown-menu";
import { Ionicons } from "@expo/vector-icons";

interface LBDropdownMenuProps {
  selectedKey: string;
  onSelect: (key: string) => void;
}

const LBDropdownMenu = ({ selectedKey, onSelect }: LBDropdownMenuProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <View className="mr-3">
          <Ionicons name="menu-outline" size={28} color={"white"} />
        </View>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <DropdownMenu.Item key="0" onSelect={() => onSelect("0")}>
            <DropdownMenu.ItemTitle>Daily</DropdownMenu.ItemTitle>
            {selectedKey === "daily" && (
              <DropdownMenu.ItemIcon
                ios={{
                  name: "checkmark",
                  pointSize: 16,
                }}
              />
            )}
          </DropdownMenu.Item>
          <DropdownMenu.Item key="weekly" onSelect={() => onSelect("1")}>
            <DropdownMenu.ItemTitle>Weekly</DropdownMenu.ItemTitle>
            {selectedKey === "weekly" && (
              <DropdownMenu.ItemIcon
                ios={{
                  name: "checkmark",
                  pointSize: 16,
                }}
              />
            )}
          </DropdownMenu.Item>
          <DropdownMenu.Item key="monthly" onSelect={() => onSelect("2")}>
            <DropdownMenu.ItemTitle>Monthly</DropdownMenu.ItemTitle>
            {selectedKey === "monthly" && (
              <DropdownMenu.ItemIcon
                ios={{
                  name: "checkmark",
                  pointSize: 16,
                }}
              />
            )}
          </DropdownMenu.Item>
          <DropdownMenu.Item key="all" onSelect={() => onSelect("3")}>
            <DropdownMenu.ItemTitle>All</DropdownMenu.ItemTitle>
            {selectedKey === "all" && (
              <DropdownMenu.ItemIcon
                ios={{
                  name: "checkmark",
                  pointSize: 16,
                }}
              />
            )}
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Item key="trophy" onSelect={() => onSelect("4")}>
          <DropdownMenu.ItemTitle>Trophy</DropdownMenu.ItemTitle>
          {selectedKey === "trophy" && (
            <DropdownMenu.ItemIcon
              ios={{
                name: "checkmark",
                pointSize: 16,
              }}
            />
          )}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default LBDropdownMenu;
