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

function formatTime(time) {
  if (isNaN(time)) {
    return 0;
  } else if (time < 60000) { // less than a minute
    return (time/100).toFixed(2) + ' seconds';
  } else if (time < 3600000) { // less than an hour
    return (time/60000).toFixed(2) + ' minutes';
  } else if (time < 86400000) { // less than a day
    return (time/3600000).toFixed(2) + ' hours';
  } else { // more than a day
    return (time/86400000).toFixed(2) + ' days';
  }
}
