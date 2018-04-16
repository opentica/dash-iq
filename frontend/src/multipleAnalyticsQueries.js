import gql from 'graphql-tag'

export default gql`
  query analyticsQueries(
    $analyticsQueries: [AnalyticsQuery]
    $timeMagnitude: Int
    $timeUnits: String
  ) {
    analyticsQueries(
      analyticsQueries: $analyticsQueries
      timeMagnitude: $timeMagnitude
      timeUnits: $timeUnits
    ) {
      fields {
        label
      }
      results {
        results
      }
      label
    }
  }
`
