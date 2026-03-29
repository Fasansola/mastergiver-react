import { CauseItem, useOnboardingStore } from '@/lib/store/onboarding.store';
import { Combobox, Portal } from '@ark-ui/react';
import {
  Box,
  HStack,
  Span,
  useFilter,
  useListCollection,
} from '@chakra-ui/react';
import Image from 'next/image';

interface CausesComboboxItem {
  label: string;
  value: string;
  color: string;
  icon: string;
  slug: string;
}

interface CausesSelectProps {
  causes: CauseItem[];
}

const CausesSelect = ({ causes }: CausesSelectProps) => {
  const { selectedCauses, addCause } = useOnboardingStore();
  const { contains } = useFilter({ sensitivity: 'base' });

  // Transform CauseItem[] into the shape Chakra's useListCollection expects
  const comboboxItems: CausesComboboxItem[] = causes.map((cause) => ({
    label: cause.name,
    value: cause.id,
    color: cause.color,
    slug: cause.slug,
    icon: cause.icon,
  }));

  const { collection, filter } = useListCollection({
    initialItems: comboboxItems,
    filter: (inputValue, filterText, item) => {
      // Filter out already selected causes
      const isSelected = selectedCauses.some((c) => c.id === item.value);
      if (isSelected) return false;
      return contains(item.label, filterText);
    },
  });

  const handleSelect = (details: Combobox.ValueChangeDetails) => {
    const selectedId = details.value[0];
    if (!selectedId) return;

    const cause = causes.find((c) => c.id === selectedId);
    if (!cause) return;

    addCause(cause);
  };

  return (
    <Combobox.Root
      collection={collection}
      onValueChange={handleSelect}
      onInputValueChange={(e) => filter(e.inputValue)}
      value={[]}
      placeholder="Search causes..."
      closeOnSelect
      multiple
      openOnClick
      className="fullWidth"
    >
      <Combobox.Control className="fullWidth">
        <Combobox.Input
          placeholder="Search causes"
          className="fullWidth inputForm"
        />
        <Combobox.ClearTrigger />
        <Combobox.Trigger />
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content className="fullWidth max-h-64 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg z-10 flex flex-col">
            <Combobox.Empty>
              <Box textAlign="center" py="4" color="gray.500">
                No causes found
              </Box>
            </Combobox.Empty>
            {collection.items.map((item) => (
              <Combobox.Item key={item.value} item={item}>
                <HStack
                  _hover={{ backgroundColor: '#ECEBF8' }}
                  p="2"
                  cursor="pointer"
                  gap="3"
                >
                  <Image
                    alt={item.label}
                    src={item.icon}
                    width={36}
                    height={36}
                  />
                  <Span flex={1}>{item.label}</Span>
                </HStack>
                <Combobox.ItemIndicator />
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  );
};

export default CausesSelect;
