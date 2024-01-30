const { CucumberRailClient } = require('testrail-integration')
const { base64Decryption } = require('./base64Decrypt')
const CONFIG_DATA = require('../setup/configData')

const trailUsername = base64Decryption(CONFIG_DATA.testrail_username)
const trailPassword = base64Decryption(CONFIG_DATA.testrail_password)
const trailUrl = CONFIG_DATA.testrail_url
const trailProjectId = CONFIG_DATA.testrail_projectid

let runId

const options = {
  username: trailUsername,
  password: trailPassword,
  url: trailUrl
}

const testrail = new CucumberRailClient(options)

/**
 * Function to get the run id
 * @param {string} TEST_RUN_NAME test run name in test rail
 * @returns run id of the particular test run
 */
async function getRunId (TEST_RUN_NAME) {
  const runList = await testrail.getRuns(trailProjectId)
  const runIdArray = runList.runs
  for (let i = 0; i < runIdArray.length; i++) {
    if (runIdArray[i].name === TEST_RUN_NAME) {
      runId = runIdArray[i].id
      break
    }
  }
  if (!runId) {
    const planList = await testrail.getPlans(trailProjectId)
    const planIdArray = planList.plans
    for (let i = 0; i < planIdArray.length; i++) {
      const planId = planIdArray[i].id
      const planRuns = await testrail.getPlan(planId)
      for (const entry of planRuns.entries) {
        for (const run of entry.runs) {
          if (run.name === TEST_RUN_NAME) {
            runId = run.id
            break
          }
        }
      }
    }
  }
  return runId
}
/**
 * Function to update the test case in test rail runs
 * @param {string} runId Run id in the test rail
 * @param {string} testCaseId Test Case id to be updated in the test rail
 * @param {object} testStatusContent test status message to be updated
 */
async function updateTestCase (runId, testCaseId, testStatusContent) {
  await testrail.addResultForCase(runId, testCaseId, testStatusContent)
}

module.exports = { getRunId, updateTestCase }
