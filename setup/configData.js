const { devices } = require('playwright')
/**
 * Data values required to launch the application
 */
const CONFIG_DATA = {
  browserName: process.env.browser,
  parallel: 1,
  headlessMode: false,
  device: devices[''],
  default_timeout: 30, // seconds
  // smtp_username and password must be base 64 encrypted
  // Note: If 2FA is enabled, you should use app-password else you can use gmail login password
  smtp_username: 'YWRhcnNodmlqYXlhbkBxYnVyc3QuY29t',
  smtp_pass: 'bmx3emppemxxaGRscWxocQ==',
  testrail_username: 'YWRhcnNocWJAbWFpbGluYXRvci5jb20=',
  testrail_password: 'WXN3dUt4V2NtYUhIcjFLS0NwT3AtNGtOU1FiZk1ISmlSZlNtNmU4bDY=',
  testrail_url: 'https://adarshqb.testrail.io',
  testrail_projectid: 1
}

module.exports = CONFIG_DATA
