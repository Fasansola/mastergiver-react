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
import { Controller, useFormContext } from 'react-hook-form';
import { CreateProfileFormValues } from './CreateProfileForm';
import { useEffect, useMemo } from 'react';

const states = getUSStates();
const stateCollection = createListCollection({ items: states });

const LocationSelector = () => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateProfileFormValues>();

  const selectedState = watch('state');
  const selectedCity = watch('city');

  // Reset cities when state change
  useEffect(() => {
    setValue('city', '', { shouldValidate: false });
  }, [selectedState, setValue]);

  const cities = selectedState ? getUSCitiesByState(selectedState) : [];
  const citiesCollection = useMemo(
    () => createListCollection({ items: cities }),
    [cities]
  );

  return (
    <Flex gap="5">
      <Field.Root>
        <Controller
          control={control}
          name="state"
          render={({ field }) => (
            <Select.Root
              name={field.name}
              value={field.value ? [field.value] : []}
              onValueChange={({ value }) => field.onChange(value[0] ?? '')}
              onInteractOutside={() => field.onBlur()}
              invalid={!!errors.state}
              collection={stateCollection}
              required
            >
              <Select.HiddenSelect required />
              <Select.Label color="text.primary">State</Select.Label>
              <Select.Control>
                <Select.Trigger className="inputForm" height="48px">
                  <Select.ValueText
                    placeholder="Select state"
                    color="text.primary"
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
              {errors.state && (
                <FieldErrorText>{errors.state.message}</FieldErrorText>
              )}
            </Select.Root>
          )}
        />
      </Field.Root>

      <Field.Root>
        <Controller
          control={control}
          name="city"
          render={({ field }) => (
            <Select.Root
              name={field.name}
              value={field.value ? [field.value] : []}
              invalid={!!errors.city}
              onValueChange={({ value }) => field.onChange(value[0] ?? '')}
              onInteractOutside={() => field.onBlur()}
              collection={citiesCollection}
              disabled={!selectedState}
              required
            >
              <Select.HiddenSelect required />
              <Select.Label color="text.primary">City</Select.Label>
              <Select.Control>
                <Select.Trigger className="inputForm" height="48px">
                  <Select.ValueText
                    placeholder="Select city"
                    color="text.primary"
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
              {errors.city && (
                <FieldErrorText>{errors.city.message}</FieldErrorText>
              )}
            </Select.Root>
          )}
        />
      </Field.Root>
    </Flex>
  );
};

export default LocationSelector;
