const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const dayFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 *
 * @param date Date
 * @param longNames Boolean
 *
 * @description Get a readable date (English notation) from a Date() object, using either longhand or shorthand notation
 */

export const readableDate = (date: Date, longNames: boolean) => {
  const dayName = (longNames === false) ? day[date.getDay()] : dayFull[date.getDay()];
  const monthName = (longNames === false) ? month[date.getMonth()] : monthFull[date.getMonth()];
  return `${dayName}, ${ monthName } ${ date.getDate() }${ ordinalSuffix(date.getDate()) }, ${ date.getFullYear() }`;
};

/**
 *
 * @param i Number
 * @desc Add a suffix to a months' day's eg: 1st, 3rd, 4th
 *
 */

const ordinalSuffix = (i: number) => {
  const j: number = i % 10;
  const k: number = i % 100;

  if (j === 1 && k !== 11) {
      return 'st';
  }
  if (j === 2 && k !== 12) {
      return 'nd';
  }
  if (j === 3 && k !== 13) {
      return 'rd';
  }
  return 'th';
};

/**
 *
 * @param date Date
 * @param includeSeconds Boolean
 *
 * @description Get a readable time (English notation) from a Date() object
 */

export const readableTime = (date: Date, includeSeconds: boolean = false) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${addLeadingZero(hours)}:${addLeadingZero(minutes)}:${addLeadingZero(seconds)}`;
};

const addLeadingZero = (nmbr: number) => (nmbr < 10) ? '0' + nmbr : nmbr;

/**
 * @description Groups gratitude items by day
 */


interface Gratitude {
  timeStamp: any;
  dayStamp?: any;
  title: string;
  body: string;
  color?: string;
}

export const getUniqueDates = (data: Gratitude[]) => {
  const uniqueDays: any = [...new Set(data.map((dataItem) => dataItem.dayStamp.seconds))];
  const testArr: any = [];

  uniqueDays.sort().reverse(); // Should this be a sort method? Since we don't know the order inside the Firebase database?

  for (const gratitude of uniqueDays) {
    const itemArr = data.filter((item) => item.dayStamp.seconds === gratitude);

    // Sort all items added on ONE SPECIFIC day by the time added
    itemArr.sort((a, b) => b.timeStamp.seconds - a.timeStamp.seconds);
    testArr.push(itemArr);
  }
  return testArr;
};
