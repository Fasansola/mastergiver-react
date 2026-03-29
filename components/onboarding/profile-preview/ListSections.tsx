import { Text, HStack, Heading, Stack } from '@chakra-ui/react';
import { GridType, SelectedGrid } from '../what-i-care-about/SelectedGrid';
import Image from 'next/image';
import AddIcon from '@/public/components-assets/add-element.svg';

interface ElementsSectionsProps {
  label: string;
  list: GridType;
  onClick?: () => void;
}

const ListSections = ({ label, list, onClick }: ElementsSectionsProps) => {
  return (
    <Stack>
      <HStack justifyContent="space-between" w="full">
        <Heading>{label}</Heading>
        <HStack gap="1" align="center" justifyContent="center">
          <Image alt="Add New" src={AddIcon} width={20} height={20} />
          <Text
            fontSize="sm"
            color="text.link"
            className="cursor-pointer"
            textTransform="uppercase"
            lineHeight={1}
            onClick={onClick}
          >
            Add New
          </Text>
        </HStack>
      </HStack>
      <SelectedGrid type={list} />
    </Stack>
  );
};

export default ListSections;
