import { OrgSearchResult } from '@/app/api/organizations/search/route';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Item Types

export interface CauseItem {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: string | null;
}

export interface SkillItem {
  id: string;
  name: string;
  slug: string;
}

export type OrgItem = OrgSearchResult;

// Store Shape

interface OnboardingStore {
  selectedCauses: CauseItem[];
  selectedSkills: SkillItem[];
  selectedOrgs: OrgItem[];
  whyIGive: string;

  // Caueses action
  addCause: (cause: CauseItem) => void;
  removeCause: (id: string) => void;

  // Skills action
  addSkill: (skill: SkillItem) => void;
  removeSkill: (id: string) => void;

  // Organization actions
  addOrg: (org: OrgItem) => void;
  removeOrg: (pledgeOrgId: string) => void;

  // Why I Give Actions
  setWhyIGive: (value: string) => void;

  // Reset
  clearAll: () => void;
}

// Initial State

const initialState = {
  selectedCauses: [],
  selectedSkills: [],
  selectedOrgs: [],
  whyIGive: '',
};

// Store

export const useOnboardingStore = create<OnboardingStore>()(
  devtools(
    (set) => ({
      ...initialState,

      // Causes
      addCause: (cause) =>
        set(
          (state) => {
            // Prevent duplicates
            const exists = state.selectedCauses.some((c) => c.id === cause.id);
            if (exists) return state;
            return { selectedCauses: [...state.selectedCauses, cause] };
          },
          false,
          'addCause'
        ),

      removeCause: (id) =>
        set(
          (state) => ({
            selectedCauses: state.selectedCauses.filter((c) => c.id !== id),
          }),
          false,
          'removeCause'
        ),

      // Skills
      addSkill: (skill) =>
        set(
          (state) => {
            // Prevent duplicates
            const exists = state.selectedSkills.some((s) => s.id === skill.id);
            if (exists) return state;
            return { selectedSkills: [...state.selectedSkills, skill] };
          },
          false,
          'addSkill'
        ),

      removeSkill: (id) =>
        set(
          (state) => ({
            selectedSkills: state.selectedSkills.filter((s) => s.id !== id),
          }),
          false,
          'removeSkill'
        ),

      // Organizations
      addOrg: (org) =>
        set(
          (state) => {
            // Prevent duplicates
            const exists = state.selectedOrgs.some(
              (o) => o.pledgeOrgId === org.pledgeOrgId
            );
            if (exists) return state;
            return { selectedOrgs: [...state.selectedOrgs, org] };
          },
          false,
          'addOrg'
        ),

      removeOrg: (pledgeOrgId) =>
        set(
          (state) => ({
            selectedOrgs: state.selectedOrgs.filter(
              (o) => o.pledgeOrgId !== pledgeOrgId
            ),
          }),
          false,
          'removeOrg'
        ),

      // Why I Give
      setWhyIGive: (value) =>
        set(
          () => ({
            whyIGive: value,
          }),
          false,
          'setWhyIGive'
        ),

      // Reset All
      clearAll: () => set(initialState, false, 'clearAll'),
    }),
    { name: 'OnboardingStore' }
  )
);
