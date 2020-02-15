
export const getCustomWeatherDescription = (temp: number): string => {
  let body = '';

  if (temp > 25)  body = `Icecream time`;
  if (temp < 25)  body = `Ray Ban weather`;
  if (temp < 20)  body = `Really nice Outside`;
  if (temp < 15)  body = `Kinda Ok Outside`;
  if (temp < 10)  body = `Like, Sweater cold`;
  if (temp < 5)  body = `So Cold You'd want UGGS`;
  if (temp < 0)  body = `Friggin Cold`;

  return body;
};
