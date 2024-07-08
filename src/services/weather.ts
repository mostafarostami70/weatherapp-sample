import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_KEY = '26e70c226fe6466990e123001240607';

interface WeatherResponse {
  location: {
    name: string;
  };
  history?: any;
}

interface Location {
  lat: number;
  lon: number;
}

interface HistoryLocation extends Location {
  date: string;
}

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.weatherapi.com/v1/' }),
  endpoints: (builder) => ({
    getWeatherByLocation: builder.query<WeatherResponse, Location>({
      query: ({ lat, lon }) => `current.json?key=${API_KEY}&q=${lat},${lon}`,
    }),
    getHistoryByLocation: builder.query<WeatherResponse, HistoryLocation>({
      query: ({ lat, lon, date }) => `history.json?key=${API_KEY}&q=${lat},${lon}&dt=${date}`,
    }),
  }),
});

export const { useGetWeatherByLocationQuery, useGetHistoryByLocationQuery } = weatherApi;
