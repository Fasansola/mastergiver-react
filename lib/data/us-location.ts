import { State, City } from 'country-state-city';

export interface LocationOption {
  label: string;
  value: string;
}

export function getUSStates(): LocationOption[] {
  return State.getStatesOfCountry('US').map((state) => ({
    label: state.name,
    value: state.isoCode,
  }));
}

export function getUSCitiesByState(stateCode: string): LocationOption[] {
  return City.getCitiesOfState('US', stateCode).map((city) => ({
    label: city.name,
    value: city.name,
  }));
}
