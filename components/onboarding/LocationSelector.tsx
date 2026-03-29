'use client';

import { getUSCitiesByState, getUSStates } from '@/lib/data/us-location';
import {
  Select,
  Portal,
  createListCollection,
  FieldErrorText,
  Flex,
  Field,
} from '@chakra-ui/react';
import { useMemo } from 'react';

const states = getUSStates();
const stateCollection = createListCollection({ items: states });

// ── Controlled Props (used in ProfilePreview + Settings) ──

interface ControlledLocationSelectorProps {
  mode: 'controlled';
  value: { state: string; city: string };
  onChange: (state: string, city: string) => void;
}

// ── Form Props (used in CreateProfileForm with RHF) ───────

interface FormLocationSelectorProps {
  mode: 'form';
  errors?: {
    state?: { message?: string };
    city?: { message?: string };
  };
  state: string;
  city: string;
  onStateChange: (value: string) => void;
  onCityChange: (value: string) => void;
}

type LocationSelectorProps =
  | ControlledLocationSelectorProps
  | FormLocationSelectorProps;

const LocationSelector = (props: LocationSelectorProps) => {
  const selectedState =
    props.mode === 'controlled' ? props.value.state : props.state;
  const selectedCity =
    props.mode === 'controlled' ? props.value.city : props.city;

  const handleStateChange = (value: string) => {
    if (props.mode === 'controlled') {
      props.onChange(value, ''); // Reset city when state changes
    } else {
      props.onStateChange(value);
    }
  };

  const handleCityChange = (value: string) => {
    if (props.mode === 'controlled') {
      props.onChange(selectedState, value);
    } else {
      props.onCityChange(value);
    }
  };

  const cities = selectedState ? getUSCitiesByState(selectedState) : [];
  const citiesCollection = useMemo(
    () => createListCollection({ items: cities }),
    [cities]
  );

  const stateError =
    props.mode === 'form' ? props.errors?.state?.message : undefined;
  const cityError =
    props.mode === 'form' ? props.errors?.city?.message : undefined;

  return (
    <Flex gap="5" direction={{ base: 'column', md: 'row' }}>
      <Field.Root>
        <Select.Root
          value={selectedState ? [selectedState] : []}
          onValueChange={({ value }) => handleStateChange(value[0] ?? '')}
          invalid={!!stateError}
          collection={stateCollection}
          gap="2"
        >
          <Select.HiddenSelect />
          <Select.Label color="text.primary">State</Select.Label>
          <Select.Control>
            <Select.Trigger className="inputForm" height="48px">
              <Select.ValueText
                placeholder="Select state"
                color="text.primary"
                fontSize="md"
              />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {states.map((state) => (
                  <Select.Item item={state} key={state.value}>
                    {state.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
          {stateError && <FieldErrorText>{stateError}</FieldErrorText>}
        </Select.Root>
      </Field.Root>

      <Field.Root>
        <Select.Root
          value={selectedCity ? [selectedCity] : []}
          onValueChange={({ value }) => handleCityChange(value[0] ?? '')}
          invalid={!!cityError}
          collection={citiesCollection}
          disabled={!selectedState}
          gap="2"
        >
          <Select.HiddenSelect />
          <Select.Label color="text.primary">City</Select.Label>
          <Select.Control>
            <Select.Trigger className="inputForm" height="48px">
              <Select.ValueText
                placeholder="Select city"
                color="text.primary"
                fontSize="md"
              />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {cities.map((city) => (
                  <Select.Item item={city} key={city.value}>
                    {city.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
          {cityError && <FieldErrorText>{cityError}</FieldErrorText>}
        </Select.Root>
      </Field.Root>
    </Flex>
  );
};

export default LocationSelector;
