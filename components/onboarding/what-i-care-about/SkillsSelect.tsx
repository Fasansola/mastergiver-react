import { SkillItem, useOnboardingStore } from '@/lib/store/onboarding.store';
import { Combobox, Portal } from '@ark-ui/react';
import { Box, Span, useFilter, useListCollection } from '@chakra-ui/react';

interface SkillsComboboxItem {
  label: string;
  value: string;
  slug: string;
}

interface SkillsSelectProps {
  skills: SkillItem[];
}

const SkillsSelect = ({ skills }: SkillsSelectProps) => {
  const { selectedSkills, addSkill } = useOnboardingStore();
  const { contains } = useFilter({ sensitivity: 'base' });

  // Transform CauseItem[] into the shape Chakra's useListCollection expects
  const comboboxItems: SkillsComboboxItem[] = skills.map((skill) => ({
    label: skill.name,
    value: skill.id,
    slug: skill.slug,
  }));

  const { collection, filter } = useListCollection({
    initialItems: comboboxItems,
    filter: (inputValue, filterText, item) => {
      // Filter out already selected causes
      const isSelected = selectedSkills.some((c) => c.id === item.value);
      if (isSelected) return false;
      return contains(item.label, filterText);
    },
  });

  const handleSelect = (details: Combobox.ValueChangeDetails) => {
    const selectedId = details.value[0];
    if (!selectedId) return;

    const skill = skills.find((s) => s.id === selectedId);
    if (!skill) return;

    addSkill(skill);
  };

  return (
    <Combobox.Root
      collection={collection}
      onValueChange={handleSelect}
      onInputValueChange={(e) => filter(e.inputValue)}
      value={[]}
      placeholder="Search skills..."
      closeOnSelect
      openOnClick
      multiple
      className="fullWidth"
    >
      <Combobox.Control className="fullWidth">
        <Combobox.Input
          placeholder="Search skills"
          className="fullWidth inputForm"
        />
        <Combobox.ClearTrigger />
        <Combobox.Trigger />
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content className="fullWidth max-h-64 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg z-10">
            <Combobox.Empty>
              <Box textAlign="center" py="4" color="gray.500">
                No skills found
              </Box>
            </Combobox.Empty>
            {collection.items.map((item) => (
              <Combobox.Item key={item.value} item={item}>
                <Box
                  _hover={{ backgroundColor: '#ECEBF8' }}
                  p="4"
                  cursor="pointer"
                  h="52px"
                >
                  <Span flex={1}>{item.label}</Span>
                </Box>
                <Combobox.ItemIndicator />
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  );
};

export default SkillsSelect;
