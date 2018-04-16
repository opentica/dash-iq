import gql from 'graphql-tag'

export default gql`
  query analyticsQuery(
    $queryString: String
    $timeMagnitude: Int
    $timeUnits: String
  ) {
    analyticsQuery(
      queryString: $queryString
      timeMagnitude: $timeMagnitude
      timeUnits: $timeUnits
    ) {
      fields {
        label
      }
      results {
        results
      }
    }
  }
`
