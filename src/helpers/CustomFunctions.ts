export const getAge = (birthday: Date | string): number | null => { // get the age by date
  if(!birthday) {
    return null;
  }

  const currentDate = new Date();
  const birthDate = new Date(birthday);
  const monthDiff = currentDate.getMonth() - birthDate.getMonth();
  let age = currentDate.getFullYear() - birthDate.getFullYear();

  if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age;
}