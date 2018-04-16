/*
 * Copyright 2018. AppDynamics LLC and its affiliates.
 * All Rights Reserved.
 * This is unpublished proprietary source code of AppDynamics LLC and its affiliates.
 * The copyright notice above does not evidence any actual or intended publication of such source code.
 */

export default (process.env.REACT_APP_APP_KEY
  ? `AND appkey = "${process.env.REACT_APP_APP_KEY}"`
  : '')
