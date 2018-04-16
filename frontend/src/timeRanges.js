const ranges = [
  { name: 'Last 15 min', timeMagnitude: 15, timeUnits: 'minutes' },
  { name: 'Last 30 min', timeMagnitude: 30, timeUnits: 'minutes' },
  { name: 'Last 1 Hour', timeMagnitude: 1, timeUnits: 'hours' },
  { name: 'Last 4 Hours', timeMagnitude: 4, timeUnits: 'hours' },
  { name: 'Last 12 Hours', timeMagnitude: 12, timeUnits: 'hours' },
  { name: 'Last 1 Day', timeMagnitude: 1, timeUnits: 'days' },
  { name: 'Last 3 Days', timeMagnitude: 3, timeUnits: 'days' },
  { name: 'Last Week', timeMagnitude: 1, timeUnits: 'weeks' },
  { name: 'Last Month', timeMagnitude: 1, timeUnits: 'months' },
]

export default ranges

export const getSeriesIntervalSize = ({ name }) => {
  return '1m'
}
