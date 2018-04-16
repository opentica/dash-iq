import rp from 'request-promise'
import moment from 'moment'
import qs from 'querystring'
import { log } from 'util'

// Build base options for each rest call
const options = {
  url: 'https://analytics.api.appdynamics.com:443/events/query',
  method: 'POST',
  headers: {
    'X-Events-API-AccountName': process.env.API_ACCOUNT_NAME,
    'X-Events-API-Key': process.env.API_KEY,
    'Content-type': 'application/vnd.appd.events+text;v=2',
  },
}

export default {
  Query: {
    analyticsQuery: async (__, { queryString, timeMagnitude, timeUnits }) => {
      const query = {
        start:
          timeMagnitude && timeUnits
            ? moment()
                .subtract(timeMagnitude, timeUnits)
                .toISOString(true)
            : undefined,
        limit: 10000,
      }

      const requestData = await rp({
        ...options,
        url: `${options.url}?${qs.stringify(query)}`,
        body: queryString,
      })
        .promise()
        .then(rawData => {
          const data = JSON.parse(rawData)
          return data[0]
        })

      const { fields } = requestData
      const results =
        requestData.results &&
        requestData.results.map(results => ({
          results,
        }))

      return { fields, results }
    },
    analyticsQueries: async (
      __,
      { analyticsQueries, timeMagnitude, timeUnits }
    ) => {
      const query = {
        start:
          timeMagnitude && timeUnits
            ? moment()
                .subtract(timeMagnitude, timeUnits)
                .toISOString(true)
            : undefined,
        limit: 10000,
      }
      const requestData = await rp({
        ...options,
        url: `${options.url}?${qs.stringify(query)}`,
        body: JSON.stringify(
          analyticsQueries.map(({ label, queryString }) => ({
            label,
            query: queryString,
          }))
        ),
      })
        .promise()
        .then(rawData => JSON.parse(rawData))

      const results = requestData.map(({ label, fields, results }) => ({
        fields,
        label,
        results:
          results &&
          results.map(results => ({
            results,
          })),
      }))

      return results
    },
  },
}
