export const capitalize = (value: string) => {
  const answer = value
    .toLowerCase()
    .replace(/(^|\s)\w/g, firstLetter => firstLetter.toUpperCase());
  console.log(answer);
  return answer;
};
