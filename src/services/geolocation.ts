import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface GeoLocationResponse {
  geoplugin_latitude: string;
  geoplugin_longitude: string;
}

interface Location {
  lat: number;
  lon: number;
}

export const geoLocationApi = createApi({
  reducerPath: 'geoLocationApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://www.geoplugin.net/' }),
  endpoints: (builder) => ({
    getGeoLocation: builder.query<Location, void>({
      query: () => 'json.gp',
      transformResponse: (response: GeoLocationResponse): Location => ({
        lat: parseFloat(response.geoplugin_latitude),
        lon: parseFloat(response.geoplugin_longitude),
      }),
    }),
  }),
});

export const { useGetGeoLocationQuery } = geoLocationApi;
