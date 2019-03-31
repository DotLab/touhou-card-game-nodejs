export const avatarIconUrl = 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzMwMHB4JyB3aWR0aD0nMzAwcHgnICBmaWxsPSIjMDAwMDAwIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHJva2Utd2lkdGg9IjAuNTAxIiBzdHJva2UtbGluZWpvaW49ImJldmVsIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHZlcnNpb249IjEuMSIgb3ZlcmZsb3c9InZpc2libGUiIHZpZXdCb3g9IjAgMCA5NiA5NiIgeD0iMHB4IiB5PSIwcHgiPjxnIGZpbGw9Im5vbmUiIHN0cm9rZT0iYmxhY2siIGZvbnQtZmFtaWx5PSJUaW1lcyBOZXcgUm9tYW4iIGZvbnQtc2l6ZT0iMTYiIHRyYW5zZm9ybT0ic2NhbGUoMSAtMSkiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTk2KSI+PGc+PHBhdGggZD0iTSAzMi4xOSwyOS42NzcgTCAzMi4xOSwzMS4yNjIgQyAzMi4xOSwzNS45NjEgMzMuOTc4LDM5LjQzNSAzNi45OTQsNDEuNjg1IEMgMzkuOTQxLDQzLjg4MyA0My44NzUsNDQuNzggNDcuOTk4LDQ0Ljc4IEMgNTIuMTIyLDQ0Ljc4IDU2LjA1OSw0My44ODMgNTkuMDAzLDQxLjY4NSBDIDYyLjAxOCwzOS40MzYgNjMuODA5LDM1Ljk1NyA2My44MDksMzEuMjYyIEwgNjMuODA5LDI5LjY3NyBMIDMyLjE5LDI5LjY3NyBaIE0gMzkuMjE5LDU3LjU0MyBDIDM5LjIxOSw2Mi4zODkgNDMuMTUyLDY2LjMyMyA0Ny45OTcsNjYuMzIzIEMgNTIuODQ0LDY2LjMyMyA1Ni43NzcsNjIuMzg5IDU2Ljc3Nyw1Ny41NDMgQyA1Ni43NzcsNTIuNjk3IDUyLjg0NCw0OC43NjQgNDcuOTk3LDQ4Ljc2NCBDIDQzLjE1Miw0OC43NjQgMzkuMjE5LDUyLjY5NyAzOS4yMTksNTcuNTQzIFoiIHN0cm9rZT0ibm9uZSIgZmlsbD0iIzAwMDAwMCIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2Utd2lkdGg9IjAuNSIgbWFya2VyLXN0YXJ0PSJub25lIiBtYXJrZXItZW5kPSJub25lIiBzdHJva2UtbWl0ZXJsaW1pdD0iNzkuODQwMzE5MzYxMjc3NSI+PC9wYXRoPjwvZz48L2c+PC9nPjwvc3ZnPg==';

export function formatDate(date) {
  if (date == null) return null;
  if (typeof date === 'string') {
    date = new Date(date);
  }
  if (new Date().setHours(0, 0, 0, 0) <= date.getTime()) { // date is in today
    return date.toLocaleTimeString();
  }
  return date.toLocaleDateString();
}

export function formatDateTime(date) {
  if (date == null) return null;
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toLocaleString(date);
}

export function formatNumber(number) {
  if (number == null) return null;
  if (typeof number === 'string') {
    number = parseFloat(number);
  }
  return number.toLocaleString();
}

export function formatNumberShort(number, digitCount) {
  if (number == null) return null;
  if (typeof number === 'string') {
    number = parseFloat(number);
  }
  if (number < 1e3) {
    return number.toString();
  }
  if (number < 1e6) {
    return `${(number / 1e3).toFixed(digitCount)}K`;
  }
  if (number < 1e9) {
    return `${(number / 1e6).toFixed(digitCount)}M`;
  }
  return `${(number / 1e9).toFixed(digitCount)}B`;
}

const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;

export function formatTime(time) {
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

export function onChange(e) {
  /* eslint-disable-next-line no-invalid-this */
  this.setState({[e.target.name]: e.target.value});
}

export function onCheckboxChange(e) {
  /* eslint-disable-next-line no-invalid-this */
  this.setState({[e.target.name]: e.target.checked});
}

export function onTextareaChange(e) {
  /* eslint-disable-next-line no-invalid-this */
  this.setState({[e.target.name]: e.target.value});
  /* eslint-disable-next-line no-invalid-this */
  this.setState({[e.target.name + 'LineCount']: e.target.value.split('\n').length});
}

export function onChangeNamed(name, e) {
  /* eslint-disable-next-line no-invalid-this */
  this.setState({[name]: e.target.value});
}

export function onChangeNamedDirect(name, value) {
  /* eslint-disable-next-line no-invalid-this */
  this.setState({[name]: value});
}

export function onSubmit(func) {
  return function(e) {
    e.preventDefault();
    func();
  };
}
