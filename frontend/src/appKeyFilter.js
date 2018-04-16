export default (process.env.REACT_APP_APP_KEY
  ? `AND appkey = "${process.env.REACT_APP_APP_KEY}"`
  : '')
