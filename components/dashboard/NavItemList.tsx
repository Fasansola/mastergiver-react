import { Stack } from '@chakra-ui/react';
import DashboardIcon from '@/public/components-assets/umbrella.svg';
import LogOutIcon from '@/public/components-assets/log-out.svg';
import SettingsIcon from '@/public/components-assets/settings.svg';
import AccountIcon from '@/public/components-assets/account.svg';
import NavItem from './NavItem';
import { getCurrentUser } from '@/lib/auth/session';

const NavItemList = async () => {
  const user = await getCurrentUser();

  return (
    <Stack as="nav" width="100%" gap="4">
      <NavItem
        href={'/dashboard'}
        iconSrc={DashboardIcon.src}
        label={'Dashboard'}
      />
      <NavItem
        href={`/profile/${user?.profile?.username}`}
        iconSrc={AccountIcon.src}
        label={'View My Public Profile'}
      />
      <NavItem
        href={'/settings'}
        iconSrc={SettingsIcon.src}
        label={'Account Settings'}
      />
      <NavItem href={'/logout'} iconSrc={LogOutIcon.src} label={'Log Out'} />
    </Stack>
  );
};

export default NavItemList;
