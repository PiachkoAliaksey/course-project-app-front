const today = new Date();
const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
const weekday = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
const month = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
export const date = `${time}, ${weekday[today.getDay()]} ${month[today.getMonth()]} ${today.getDate()} ${today.getFullYear()}`;
