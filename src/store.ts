import { configureStore } from '@reduxjs/toolkit';
import { weatherApi } from './services/weather';
import { geoLocationApi } from './services/geolocation';

// ایجاد Redux store با استفاده از configureStore از Redux Toolkit
export const store = configureStore({
  // تعریف reducerها برای store
  reducer: {
    // اضافه کردن reducerهای مربوط به APIهای RTK Query
    [weatherApi.reducerPath]: weatherApi.reducer,
    [geoLocationApi.reducerPath]: geoLocationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    // اضافه کردن middlewareهای پیش‌فرض به همراه middlewareهای RTK Query
    getDefaultMiddleware().concat(weatherApi.middleware, geoLocationApi.middleware),
});
