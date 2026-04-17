'use client';

/**
 * Business dashboard navigation links + logout.
 *
 * A Client Component so it can use usePathname() for active-link detection
 * and useState/useRouter for the logout confirmation flow.
 *
 * Active item:  filled purple background, white text, shadow
 * Inactive item: transparent background, dark text, larger border-radius
 *
 * Logout is rendered as an inactive-styled button (not a link) at the bottom
 * of the list. Clicking it opens a confirmation dialog before signing out.
 */

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import EditProfileIcon from '@/public/business-assets/editProfile.svg';
import SettingsIcon from '@/public/business-assets/settings.svg';
import BillingIcon from '@/public/business-assets/billing.svg';
import LogoutIcon from '@/public/business-assets/logout.svg';
import { logoutAction } from '@/lib/actions/auth.actions';
import LogoutConfirmDialog from '@/components/shared/LogoutConfirmDialog';
import { HStack, Stack, Text } from '@chakra-ui/react';

interface NavItem {
  label: string;
  href: string;
  // StaticImageData from next/image — typed as the imported SVG module shape
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Edit Profile',
    href: '/business/dashboard/edit-profile',
    icon: EditProfileIcon,
  },
  {
    label: 'Account Settings',
    href: '/business/dashboard/account-settings',
    icon: SettingsIcon,
  },
  {
    label: 'Billing/Payments',
    href: '/business/dashboard/billing',
    icon: BillingIcon,
  },
];

// Shared style helpers so the logout button exactly matches an inactive link
const inactiveItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  width: '100%',
  textDecoration: 'none',
  borderRadius: '14px',
  padding: '12px 16px',
  height: '56px',
  background: 'transparent',
  transition: 'background 0.15s, box-shadow 0.15s',
};

const inactiveLabelStyle: React.CSSProperties = {
  fontWeight: 500,
  fontSize: '18px',
  lineHeight: '20px',
  letterSpacing: '-0.15px',
  color: '#000000',
};

const BusinessSidebarNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    await logoutAction();
    router.push('/business/signin');
  };

  return (
    <>
      <Stack as="nav" gap="6" flex="1">
        {/* Regular nav links */}
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                width: '100%',
                textDecoration: 'none',
                borderRadius: isActive ? '8px' : '14px',
                padding: isActive ? '10px' : '12px 16px',
                height: isActive ? '52px' : '56px',
                background: isActive ? '#2F2B77' : 'transparent',
                boxShadow: isActive
                  ? '0px 8px 10px -6px #E2E1FF, 0px 20px 25px -5px #D4D1FF'
                  : 'none',
                transition: 'background 0.15s, box-shadow 0.15s',
              }}
            >
              <Image
                src={item.icon}
                alt=""
                width={32}
                height={32}
                // Invert the icon to white when the item is active
                style={{
                  flexShrink: 0,
                  filter: isActive
                    ? 'brightness(0) invert(1)'
                    : 'brightness(0)',
                }}
              />
              <Text
                fontWeight="500"
                fontSize="subheading"
                style={{
                  color: isActive ? '#FFFFFF' : '#000000',
                }}
              >
                {item.label}
              </Text>
            </Link>
          );
        })}

        {/* Logout — styled as an inactive nav item, triggers confirmation dialog */}
        <HStack
          gap="4"
          onClick={() => setDialogOpen(true)}
          style={{ ...inactiveItemStyle, cursor: 'pointer' }}
        >
          <Image
            src={LogoutIcon}
            alt=""
            width={32}
            height={32}
            style={{ flexShrink: 0 }}
          />
          <span style={inactiveLabelStyle}>Log out</span>
        </HStack>
      </Stack>

      <LogoutConfirmDialog
        isOpen={dialogOpen}
        isLoading={isLoggingOut}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
};

export default BusinessSidebarNav;
