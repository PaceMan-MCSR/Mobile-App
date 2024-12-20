import { View } from "react-native";
import React from "react";
import * as DropdownMenu from "zeego/dropdown-menu";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "nativewind";
interface StatsRightComponentProps {
  days: number;
  category: string;
  type: "count" | "average" | "fastest" | "conversion";
  onDaysSelect: (days: number) => void;
  onCategorySelect: (category: string) => void;
  onTypeSelect: (type: "count" | "average" | "fastest" | "conversion") => void;
}

const StatsRightComponent = ({
  days,
  category,
  type,
  onDaysSelect,
  onCategorySelect,
  onTypeSelect,
}: StatsRightComponentProps) => {
  const { colorScheme } = useColorScheme();
  const tint = Colors[colorScheme!].tint;
  const daysOptions = [
    { key: 1, label: "Daily" },
    { key: 7, label: "Weekly" },
    { key: 30, label: "Monthly" },
    { key: 9999, label: "All Time" },
  ];

  const categoryOptions = [
    { key: "nether", label: "Nether Enter" },
    { key: "bastion", label: "Bastion Enter" },
    { key: "fortress", label: "Fortress Enter" },
    { key: "first_structure", label: "Structure 1 Enter" },
    { key: "second_structure", label: "Structure 2 Enter" },
    { key: "first_portal", label: "First Portal" },
    { key: "second_portal", label: "Second Portal" },
    { key: "stronghold", label: "Stronghold Enter" },
    { key: "end", label: "End Enter" },
    { key: "finish", label: "Completion" },
  ];

  const typeOptions = [
    { key: "count", label: "Count" },
    { key: "average", label: "Average" },
    { key: "fastest", label: "Fastest" },
    { key: "conversion", label: "Conversion" },
  ];

  return (
    <View className="flex flex-row-reverse items-center">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <View>
            <Ionicons name="menu-outline" size={28} color={tint} />
          </View>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger key="type">
              <DropdownMenu.ItemTitle>Sort By</DropdownMenu.ItemTitle>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              {typeOptions.map(({ key, label }) => (
                <DropdownMenu.CheckboxItem
                  key={key}
                  value={type === key}
                  onValueChange={(next) => next && onTypeSelect(key as typeof type)}
                >
                  <DropdownMenu.ItemTitle>{label}</DropdownMenu.ItemTitle>
                  <DropdownMenu.ItemIndicator />
                </DropdownMenu.CheckboxItem>
              ))}
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger key="category">
              <DropdownMenu.ItemTitle>Category</DropdownMenu.ItemTitle>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              {categoryOptions.map(({ key, label }) => (
                <DropdownMenu.CheckboxItem
                  key={key}
                  value={category === key}
                  onValueChange={(next) => next && onCategorySelect(key)}
                >
                  <DropdownMenu.ItemTitle>{label}</DropdownMenu.ItemTitle>
                  <DropdownMenu.ItemIndicator />
                </DropdownMenu.CheckboxItem>
              ))}
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger key="days">
              <DropdownMenu.ItemTitle>Time Period</DropdownMenu.ItemTitle>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              {daysOptions.map(({ key, label }) => (
                <DropdownMenu.CheckboxItem
                  key={key.toString()}
                  value={days === key}
                  onValueChange={(next) => next && onDaysSelect(key)}
                >
                  <DropdownMenu.ItemTitle>{label}</DropdownMenu.ItemTitle>
                  <DropdownMenu.ItemIndicator />
                </DropdownMenu.CheckboxItem>
              ))}
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </View>
  );
};

export default StatsRightComponent;
