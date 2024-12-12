import { View } from "react-native";
import React from "react";
import * as DropdownMenu from "zeego/dropdown-menu";
import { Ionicons } from "@expo/vector-icons";

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
  const daysOptions = [
    { key: 1, label: "Daily" },
    { key: 7, label: "Weekly" },
    { key: 30, label: "Monthly" },
    { key: 9999, label: "All Time" },
  ];

  const categoryOptions = [
    { key: "nether", label: "Nether" },
    { key: "bastion", label: "Bastion" },
    { key: "fortress", label: "Fortress" },
    { key: "first_structure", label: "First Structure" },
    { key: "second_structure", label: "Second Structure" },
    { key: "first_portal", label: "First Portal" },
    { key: "second_portal", label: "Second Portal" },
    { key: "stronghold", label: "Stronghold" },
    { key: "end", label: "End" },
    { key: "finish", label: "Finish" },
  ];

  const typeOptions = [
    { key: "count", label: "Count" },
    { key: "average", label: "Average" },
    { key: "fastest", label: "Fastest" },
    { key: "conversion", label: "Conversion" },
  ];

  const renderCheckmark = (currentValue: any, selectedValue: any) =>
    currentValue === selectedValue ? (
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
          <View className="mr-3">
            <Ionicons name="menu-outline" size={28} color={"white"} />
          </View>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger key="type">
              <DropdownMenu.ItemTitle>Sort By</DropdownMenu.ItemTitle>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              {typeOptions.map(({ key, label }) => (
                <DropdownMenu.Item key={key} onSelect={() => onTypeSelect(key as typeof type)}>
                  <DropdownMenu.ItemTitle>{label}</DropdownMenu.ItemTitle>
                  {renderCheckmark(type, key)}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger key="category">
              <DropdownMenu.ItemTitle>Category</DropdownMenu.ItemTitle>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              {categoryOptions.map(({ key, label }) => (
                <DropdownMenu.Item key={key} onSelect={() => onCategorySelect(key)}>
                  <DropdownMenu.ItemTitle>{label}</DropdownMenu.ItemTitle>
                  {renderCheckmark(category, key)}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger key="days">
              <DropdownMenu.ItemTitle>Time Period</DropdownMenu.ItemTitle>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              {daysOptions.map(({ key, label }) => (
                <DropdownMenu.Item key={key.toString()} onSelect={() => onDaysSelect(key)}>
                  <DropdownMenu.ItemTitle>{label}</DropdownMenu.ItemTitle>
                  {renderCheckmark(days, key)}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </View>
  );
};

export default StatsRightComponent;
