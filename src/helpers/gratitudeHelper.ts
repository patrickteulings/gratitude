
// Interface
import { IGratitude } from '@/interfaces/gratitude';


/**
 * @description Groups gratitude items by day
 */


export const getUniqueDates = (data: IGratitude[]) => {
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

/*
 * Get the nr of consecutive days the user has added at least one gratitude
*/

export function getStreak (): number {
  return 8;
}
