import { Country, State, City } from "country-state-city"

const useLocation = () => {
    const getCountryByCode = (countrycode: string) => {
        return Country.getAllCountries().find((country) => country.isoCode === countrycode)
    }
    const getStateByCode = (countrycode: string, statecode: string) => {
        const state = State.getAllStates().find((state) => state.countryCode === countrycode && state.isoCode === statecode)
        if (!state)
            return null;
        return state;

    }
    const getCountryStates = (countrycode: string) => {
        return State.getAllStates().filter((state) => state.countryCode === countrycode);
    }
    const getStateCities = (countrycode: string, statecode?: string) => {
        return City.getAllCities().filter((city) => city.countryCode === countrycode && city.stateCode === statecode)
    }
    return {
        getAllCountries:Country.getAllCountries,
        getCountryByCode,
        getStateByCode,
        getCountryStates,
        getStateCities
    }
}
export default useLocation