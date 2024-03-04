"use client";
import React, { useEffect, useState } from "react";
import Container from "./Container";
import {
    Select,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectItem,
} from "./ui/select";
import useLocation from "@/hooks/useLocation";
import { ICity, IState } from "country-state-city";

import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { Button } from "./ui/button";

export const LocationFilter = () => {
    const [country, setCountry] = useState("")
    const [state, setState] = useState("")
    const [city, setCity] = useState("")
    const { getAllCountries, getCountryStates, getStateCities } = useLocation();
    const [states, setStates] = useState<IState[]>([]);
    const [cities, setCities] = useState<ICity[]>([]);
    const countries = getAllCountries();
    const params = useSearchParams();
    const router = useRouter();


    const handleClear = () => {
        router.push("/");
        setCountry("");
        setState("");
        setCity("");
    };
    useEffect(() => {
        const countryStates = getCountryStates(country);
        if (countryStates) setStates(countryStates);
        setState("");
        setCity("");
    }, [country]);

    useEffect(() => {
        const StateCities = getStateCities(country, state);
        if (StateCities) {
            setCities(StateCities);
            setCity("");
        }
    }, [country, state]);

    useEffect(() => {
        if (country === "" && state === "" && city === "") return router.push("/");
        let currentQuery: any = {};
        if (params) {
            currentQuery = qs.parse(params.toString());
        }
        if (state) {
            currentQuery = {
                ...currentQuery,
                state,
            };
        }

        if (city) {
            currentQuery = {
                ...currentQuery,
                city,
            };
        }

        if (country) {
            currentQuery = {
                ...currentQuery,
                country,
            };
        }

        if (state == "") delete currentQuery.state;

        if (city == "") delete currentQuery.city;

        const url = qs.stringifyUrl(
            {
                url: "/",
                query: currentQuery,
            },
            { skipNull: true, skipEmptyString: true }
        );
        router.push(url);
    }, [country, state, city]);

    return (
        <Container>
            <div className="flex gap-2 md:gap-4 items-center justify-center text-sm">
                <div>
                    <Select value={country} onValueChange={(val) => setCountry(val)}>
                        <SelectTrigger className="bg-background ">
                            <SelectValue placeholder="Country" />
                        </SelectTrigger>
                        <SelectContent>
                            {countries.map((country) => {
                                return (
                                    <SelectItem key={country.isoCode} value={country.isoCode}>
                                        {country.name}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Select value={state} onValueChange={(val) => setState(val)}>
                        <SelectTrigger className="bg-background ">
                            <SelectValue placeholder="State" />
                        </SelectTrigger>
                        <SelectContent>
                            {!!states.length &&
                                states.map((state) => {
                                    return (
                                        <SelectItem key={state.isoCode} value={state.isoCode}>
                                            {state.name}
                                        </SelectItem>
                                    );
                                })}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Select value={city} onValueChange={(val) => setCity(val)}>
                        <SelectTrigger className="bg-background ">
                            <SelectValue placeholder="City" />
                        </SelectTrigger>
                        <SelectContent>
                            {!!cities.length &&
                                cities.map((city) => {
                                    return (
                                        <SelectItem key={city.name} value={city.name}>
                                            {city.name}
                                        </SelectItem>
                                    );
                                })}
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={() => handleClear()} variant={"outline"}>
                    Clear Filters
                </Button>
            </div>
        </Container>
    );
};
