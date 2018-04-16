/*
 * Copyright 2018. AppDynamics LLC and its affiliates.
 * All Rights Reserved.
 * This is unpublished proprietary source code of AppDynamics LLC and its affiliates.
 * The copyright notice above does not evidence any actual or intended publication of such source code.
 */

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
