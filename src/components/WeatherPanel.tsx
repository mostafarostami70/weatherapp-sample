import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { useGetWeatherByLocationQuery, useGetHistoryByLocationQuery } from '../services/weather';
import { useGetGeoLocationQuery } from '../services/geolocation';

// کامپوننت اصلی برای نمایش پنل آب و هوا
const WeatherPanel: React.FC = () => {
  // state برای ذخیره موقعیت جغرافیایی
  const [position, setPosition] = useState<{ lat: number; lon: number } | null>(null);
  // state برای ذخیره تاریخ فعلی
  const [currentDate, setCurrentDate] = useState<string | null>(null);

  // استفاده از RTK Query برای دریافت موقعیت جغرافیایی
  const { data: locationData, error: locationError, isLoading: locationLoading } = useGetGeoLocationQuery(undefined, {
    skip: position !== null // اگر position قبلاً تنظیم شده باشد، این query را اجرا نکن
  });

  // useEffect برای دریافت موقعیت جغرافیایی از طریق API مرورگر
  useEffect(() => {
    const savedPosition = null; // در اینجا می‌توانید از یک مقدار ذخیره شده استفاده کنید
    if (savedPosition) {
      setPosition(savedPosition);
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition = { lat: position.coords.latitude, lon: position.coords.longitude };
          setPosition(newPosition);
        },
        (error) => console.error(error)
      );
    }
  }, []);

  // استفاده از RTK Query برای دریافت اطلاعات آب و هوای فعلی
  const { data: weatherData, error: weatherError, isLoading: weatherIsLoading } = useGetWeatherByLocationQuery(
    position ? position : locationData ? { lat: locationData.lat, lon: locationData.lon } : { lat: 0, lon: 0 },
    { skip: !position && !locationData } // اگر هیچ موقعیتی در دسترس نباشد، این query را اجرا نکن
  );

  // useEffect برای تنظیم تاریخ فعلی بر اساس داده‌های آب و هوا
  useEffect(() => {
    if (weatherData && weatherData.location && weatherData.location.localtime) {
      const date = new Date(weatherData.location.localtime);
      setCurrentDate(date.toISOString().split('T')[0]);
    }
  }, [weatherData]);

  // استفاده از RTK Query برای دریافت اطلاعات تاریخی آب و هوا
  const { data: historyData, error: historyError, isLoading: historyIsLoading } = useGetHistoryByLocationQuery(
    position && currentDate
      ? { ...position, date: currentDate }
      : locationData && currentDate
        ? { lat: locationData.lat, lon: locationData.lon, date: currentDate }
        : { lat: 0, lon: 0, date: '' },
    { skip: !position && !locationData || !currentDate } // اگر موقعیت یا تاریخ در دسترس نباشد، این query را اجرا نکن
  );

  // لاگ کردن داده‌ها برای اهداف دیباگ
  console.log(historyData);
  console.log(weatherData);

  // نمایش پیام بارگذاری در حین دریافت داده‌ها
  if (locationLoading || weatherIsLoading || historyIsLoading) return <Typography>در حال بررسی اطلاعات...</Typography>;

  // نمایش پیام خطا در صورت بروز مشکل
  if (locationError || weatherError || historyError) return <Typography>خطا: {(locationError || weatherError || historyError)?.message}</Typography>;

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}>
      {weatherData && historyData && (
        <Box sx={{
          backgroundImage: 'url("https://unsplash.it/600/400?image=1043&blur")',
          backgroundSize: 'cover',
          borderRadius: 2,
          boxShadow: '25px 25px 40px 0px rgba(0,0,0,0.33)',
          color: '#fff',
          overflow: 'hidden',
          padding: 3,
          display: 'inline-block',
          textAlign: 'center'
        }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h4">{weatherData.location.name}</Typography>
              <Typography variant="subtitle1">{currentDate}</Typography>
              <Typography variant="h5"><i className="mi mi-fw mi-lg mi-rain-heavy"></i> {weatherData.current.condition.text}</Typography>
              <Box
                component="img"
                sx={{
                  height: 50,
                  width: 50,
                  maxHeight: { xs: 50, md: 50 },
                  maxWidth: { xs: 50, md: 50 },
                }}
                alt="The house from the offer."
                src={weatherData.current.condition.icon}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h1">{weatherData.current.temp_c}°</Typography>
              <Typography variant="subtitle1">{historyData.forecast.forecastday[0].day.mintemp_c}° / {historyData.forecast.forecastday[0].day.maxtemp_c}°</Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                {['چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه', 'یک‌شنبه', 'دو‌شنبه'].map((day, index) => (
                  <Grid item xs={4} sm={2} key={index} textAlign="center">
                    <Typography variant="h5">{day}</Typography>
                    <Typography variant="body1"><i className="mi mi-fw mi-2x mi-cloud-sun"></i><br />9°/18°</Typography>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>)}
    </Box>
  );
};

export default WeatherPanel;