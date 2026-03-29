'use client';

// TYPES

import {
  launchProfile,
  saveProfileSettings,
} from '@/lib/actions/onboarding.actions';
import {
  CauseItem,
  OrgItem,
  SkillItem,
  useOnboardingStore,
} from '@/lib/store/onboarding.store';
import {
  Button,
  Heading,
  Separator,
  Span,
  Stack,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  AboutMeSection,
  CausesSection,
  LocationSection,
  NameSection,
  OrganizationsSection,
  ProfilePictureSection,
  SkillsSection,
  UsernameSection,
  WhyIGiveSection,
} from '@/components/onboarding/profile-preview';

export type ProfilePreviewMode = 'onboarding' | 'settings';

export interface ProfileData {
  firstName: string;
  lastName: string;
  username: string;
  profilePicture: string | null;
  state: string | null;
  city: string | null;
  aboutMe: string | null;
  whyIGive: string | null;
}

interface EditingState {
  name: boolean;
  location: boolean;
  aboutMe: boolean;
  whyIGive: boolean;
  causes: boolean;
  skills: boolean;
  organizations: boolean;
}

interface ProfilePreviewProps {
  mode: ProfilePreviewMode;
  initialData: ProfileData;
  existingCauses: CauseItem[];
  existingSkills: SkillItem[];
  existingOrgs: OrgItem[];
  allCauses: CauseItem[];
  allSkills: SkillItem[];
}

// COMPONENT

const ProfilePreview = ({
  mode,
  initialData,
  existingCauses,
  existingSkills,
  existingOrgs,
  allCauses,
  allSkills,
}: ProfilePreviewProps) => {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    selectedCauses,
    selectedSkills,
    selectedOrgs,
    addCause,
    addOrg,
    addSkill,
    clearAll,
  } = useOnboardingStore();

  //   All editable profile data lives here
  const [profileData, setProfileData] = useState<ProfileData>(initialData);

  //   Track which section is being edited
  const [editing, setEditing] = useState<EditingState>({
    name: false,
    location: false,
    aboutMe: false,
    whyIGive: false,
    causes: false,
    skills: false,
    organizations: false,
  });

  //   Generic field updater

  const updateField = <K extends keyof ProfileData>(
    field: K,
    value: ProfileData[K]
  ) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  //   Toggle edit mode for section
  const toggleEditing = (section: keyof EditingState) => {
    setEditing((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      if (mode === 'onboarding') {
        const result = await launchProfile({
          ...profileData,
          causeIds: selectedCauses.map((c) => c.id),
          skillIds: selectedSkills.map((s) => s.id),
          organizations: selectedOrgs,
        });

        if (!result.success) {
          setError(result.error ?? 'Something went wrong. Please try again.');
          return;
        }

        clearAll();

        router.push('/onboarding/confirmation');
      } else {
        // For settings mode, we would call an updateProfile action instead
        const result = await saveProfileSettings({
          ...profileData,
          whyIGive: profileData.whyIGive ?? '',
          causeIds: selectedCauses.map((c) => c.id),
          skillIds: selectedSkills.map((s) => s.id),
          organizations: selectedOrgs,
        });

        if (!result.success) {
          setError(result.error ?? 'Something went wrong. Please try again.');
          return;
        }

        setEditing({
          name: false,
          location: false,
          aboutMe: false,
          whyIGive: false,
          causes: false,
          skills: false,
          organizations: false,
        });
      }
    } finally {
      setIsSaving(false);
      router.refresh();
    }
  };

  useEffect(() => {
    existingCauses.forEach(addCause);
    existingSkills.forEach(addSkill);
    existingOrgs.forEach(addOrg);
  }, [existingCauses, existingSkills, existingOrgs]);

  // COMPONENTS
  return (
    <Stack gap="10" width="100%">
      <ProfilePictureSection
        profilePicture={profileData.profilePicture}
        onUpload={(url: string) => updateField('profilePicture', url)}
        onDelete={() => updateField('profilePicture', null)}
      />
      <Separator
        variant="solid"
        colorPalette="gray"
        height="1px"
        width="100%"
      />
      <Stack gap="8">
        <Heading fontWeight="700">Account Details</Heading>
        <Stack gap="6">
          <UsernameSection username={profileData.username} />
          <NameSection
            firstName={profileData.firstName}
            lastName={profileData.lastName}
            isEditing={editing.name}
            onToggleEdit={() => toggleEditing('name')}
            onChange={(firstName, lastName) => {
              updateField('firstName', firstName);
              updateField('lastName', lastName);
            }}
          />
          <LocationSection
            city={profileData.city}
            state={profileData.state}
            isEditing={editing.location}
            onToggleEdit={() => toggleEditing('location')}
            onChange={(state, city) => {
              updateField('state', state);
              updateField('city', city);
            }}
          />
        </Stack>
      </Stack>

      <Stack gap="8">
        <Heading fontWeight="700">Account Information</Heading>
        <Stack gap="6">
          <AboutMeSection
            aboutMe={profileData.aboutMe}
            isEditing={editing.aboutMe}
            onToggleEdit={() => toggleEditing('aboutMe')}
            onChange={(value) => updateField('aboutMe', value)}
          />
          <WhyIGiveSection
            whyIGive={profileData.whyIGive}
            isEditing={editing.whyIGive}
            onToggleEdit={() => toggleEditing('whyIGive')}
            onChange={(value) => updateField('whyIGive', value)}
          />
        </Stack>
      </Stack>

      <CausesSection
        allCauses={allCauses}
        isEditing={editing.causes}
        onToggleEdit={() => toggleEditing('causes')}
      />
      <SkillsSection
        allSkills={allSkills}
        isEditing={editing.skills}
        onToggleEdit={() => toggleEditing('skills')}
      />
      <OrganizationsSection
        isEditing={editing.organizations}
        onToggleEdit={() => toggleEditing('organizations')}
      />

      {error && (
        <Span color="fg.error" textStyle="sm">
          {error}
        </Span>
      )}

      {/* Save Button */}
      <Button
        onClick={handleSave}
        loading={isSaving}
        loadingText={mode === 'onboarding' ? 'Launching...' : 'Saving...'}
        size="md"
        width="100%"
      >
        {mode === 'onboarding' ? 'Launch Profile' : 'Save Changes'}
      </Button>
    </Stack>
  );
};

export default ProfilePreview;
