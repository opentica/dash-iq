export default `
type Query {
  analyticsQuery(queryString: String, timeMagnitude: Int, timeUnits: String): QueryResult
  analyticsQueries(analyticsQueries: [AnalyticsQuery], timeMagnitude: Int, timeUnits: String): [QueryResult]
}
input AnalyticsQuery {
  queryString: String
  label: String
}
type Field {
  label: String
  field: String
  type: String
  aggregation: String
}
type Result {
  results: [String]
}
type QueryResult {
  fields: [Field]
  results: [Result]
  label: String
}
`
