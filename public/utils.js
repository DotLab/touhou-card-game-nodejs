/* eslint-disable no-console, no-unused-vars */

// source: https://github.com/DotLab/gskse-client-react/blob/master/src/utils.js
function formatDate(date) {
  if (date == null) return null;
  if (typeof date === 'string') {
    date = new Date(date);
  }
  if (new Date().setHours(0, 0, 0, 0) <= date.getTime()) { // date is in today
    return date.toLocaleTimeString();
  }
  return date.toLocaleDateString();
}

const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;

function formatTime(time) {
  console.log(time);
  if (typeof time === 'string') {
    time = parseInt(time);
  }

  if (time < minute) { // less than a minute
    return (time / second).toFixed(2) + ' seconds';
  } else if (time < hour) { // less than an hour
    return (time / minute).toFixed(2) + ' minutes';
  } else if (time < day) { // less than a day
    return (time / hour).toFixed(2) + ' hours';
  } else { // more than a day
    return (time / day).toFixed(2) + ' days';
  }
}
