/*
 * Copyright 2018. AppDynamics LLC and its affiliates.
 * All Rights Reserved.
 * This is unpublished proprietary source code of AppDynamics LLC and its affiliates.
 * The copyright notice above does not evidence any actual or intended publication of such source code.
 */

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
