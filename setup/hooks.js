const {
  Before,
  After,
  BeforeAll,
  AfterAll,
  AfterStep
} = require('@cucumber/cucumber')
const CONFIG_DATA = require('./configData')
const { getBrowserType } = require('./init')
const allure = require('allure-js-commons')
const { setDefaultTimeout } = require('@cucumber/cucumber')
const { getRunId, updateTestCase } = require('../utils/testrailUtils')
const TEST_RUN_NAME = process.env.runname

setDefaultTimeout(CONFIG_DATA.default_timeout * 1000)
let step = 0
let feature = 0
let testStatusContent
let runId

BeforeAll(async function () {
  // Launch browser
  const browserType = await getBrowserType()
  global.browser = await browserType.launch({
    headless: CONFIG_DATA.headlessMode,
    args: ['--start-maximized']
  })
  try {
    runId = await getRunId(TEST_RUN_NAME)
  } catch (err) {
    runId = 'failed'
    console.log('Error: ' + err)
  }
})

AfterAll(async function () {
  await global.browser.close()
})

Before(async function () {
  // Creating new browser context
  if (CONFIG_DATA.device) {
    global.context = await global.browser.newContext({ ...CONFIG_DATA.device })
  } else {
    global.context = await global.browser.newContext({
      ...CONFIG_DATA.device,
      viewport: null
    })
  }
  global.page = await global.context.newPage()
  await global.context.tracing.start({
    path: 'trace.json',
    screenshots: true,
    snapshots: true
  })
})

Before({ tags: '@API-UI or @API' }, async function () {
  const config = require('config')
  const endpoints = require('../config/apiEndPoints.json')
  const { request } = require('playwright')
  const { ApiUtils } = require('../utils/ApiUtils')
  const { cryptoJSDecryption } = require('../utils/cryptoJSDecrypt')
  const API_LOGINURL = config.get('api.baseUrl') + endpoints.login
  const USER_NAME = config.get('api.username')
  const PASS_WORD = config.get('api.password')
  const SECRET_KEY = process.env.SECRET_KEY
  const username = cryptoJSDecryption(USER_NAME, SECRET_KEY)
  const password = cryptoJSDecryption(PASS_WORD, SECRET_KEY)
  /** Creating new api context */
  global.apiContext = await request.newContext()
  const apiutil = new ApiUtils(global.page)
  const loginPayload = {
    userEmail: username,
    userPassword: password
  }
  await apiutil.getToken(loginPayload, API_LOGINURL)
})

After(async function (Scenario) {
  feature++
  await global.context.tracing.stop({
    path: `reports/trace/trace${feature}.zip`
  })
  await global.page.close()
  await global.context.close()
  // update test case in test rail
  if (runId !== 'failed') {
    try {
      if (Scenario.result.status === 'PASSED') {
        testStatusContent = {
          comment: 'working as expected',
          status_id: 1
        }
      } else {
        testStatusContent = {
          comment: Scenario.result.exception.message,
          status_id: 5
        }
      }
      const testCaseId = Scenario.pickle.tags[0].name.slice(2)
      await updateTestCase(runId, testCaseId, testStatusContent)
    } catch (err) {
      console.log('Error ' + err)
    }
  }
})

AfterStep(async function (Scenario) {
  step++
  if (Scenario.result.status === 'FAILED') {
    const screenshotPath = `reports/screenshots/step-${step}.png`
    const screenshot = await global.page.screenshot({
      path: screenshotPath,
      type: 'png'
    })
    await this.attach(screenshot, 'image/png')
    await allure.attachment(
      'Screenshot',
      Buffer.from(screenshot, 'base64'),
      'image/png'
    )
  }
})
