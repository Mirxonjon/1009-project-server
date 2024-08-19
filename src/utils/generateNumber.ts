export const generateRandomNumber = async (): Promise<number> => {
    const min = 1000; // 4 xonali sonlarning minimal qiymati
    const max = 9999; // 4 xonali sonlarning maksimal qiymati

    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  export const secondsSinceGivenTime = async (givenDate: Date): Promise<number> => {

    const currentDate = new Date();

    const differenceInMilliseconds = currentDate.getTime() - givenDate.getTime();

    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);

    return differenceInSeconds;
}