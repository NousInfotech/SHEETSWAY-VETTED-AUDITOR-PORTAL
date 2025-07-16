"use client";

import * as React from "react";
import { X, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "./button";

interface MultiSelectCreatableProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export function MultiSelectCreatable({
  options,
  value,
  onChange,
  placeholder = "Select...",
}: MultiSelectCreatableProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const selectedValues = new Set(value);

  const handleSelect = (selectedValue: string) => {
    if (selectedValues.has(selectedValue)) {
      selectedValues.delete(selectedValue);
    } else {
      selectedValues.add(selectedValue);
    }
    onChange(Array.from(selectedValues));
    setInputValue("");
  };

  const handleCreate = (newValue: string) => {
    const trimmedValue = newValue.trim();
    if (trimmedValue && !selectedValues.has(trimmedValue)) {
      selectedValues.add(trimmedValue);
      onChange(Array.from(selectedValues));
    }
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && inputValue) {
      handleCreate(inputValue);
    }
  };

  const filteredOptions = options.filter(
    (option) => !selectedValues.has(option)
  );

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-10"
          >
            {value.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {value.map((val) => (
                  <Badge
                    key={val}
                    variant="secondary"
                    className="mr-1"
                    onClick={(e) => { e.stopPropagation(); handleSelect(val); }}
                  >
                    {val}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command onKeyDown={handleKeyDown}>
            <CommandInput
              placeholder="Search or create new..."
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandEmpty>
                {inputValue && <CommandItem onSelect={() => handleCreate(inputValue)}>Create "{inputValue}"</CommandItem>}
                {!inputValue && "No results found."}
              </CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => handleSelect(option)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValues.has(option) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}