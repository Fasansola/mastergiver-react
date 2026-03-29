import { Heading, Stack } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';
import SettingNavItem from './settings/SettingNavItem';

const Settingslayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Stack gap="0">
        <Stack
          py="6"
          px="5"
          borderBottom="solid 1px"
          borderColor="border.default"
        >
          <Heading fontWeight="500" fontSize="heading">
            Account Settings
          </Heading>
        </Stack>
        <Stack direction={{ base: 'column', lg: 'row' }} alignItems="start">
          <Stack
            borderRight={{ base: 'none', lg: 'solid 1px' }}
            borderBottom={{ base: 'solid 1px', lg: 'none' }}
            borderColor="border.default"
            minW={{ base: '0', lg: '320px' }}
            minH={{ base: '0', lg: '100vh' }}
            w={{ base: '100%', lg: 'auto' }}
          >
            <Stack as="nav" width="100%" gap="0" direction={{ base: 'row', lg: 'column' }}>
              <SettingNavItem label="Edit Profile" href="/settings" />
              <SettingNavItem
                label="Email Address & Password"
                href="/settings/account"
              />
            </Stack>
          </Stack>
          <Stack
            py="6"
            px={{ base: '4', lg: '5' }}
            alignItems="start"
            justifyContent="start"
            w="100%"
          >
            <Stack bg="background.white" p={{ base: '4', lg: '8' }} w="100%">
              {children}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default Settingslayout;
