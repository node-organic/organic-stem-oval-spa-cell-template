const path = require('path')
const os = require('os')

const exec = require('child_process').exec
const terminate = require('terminate')
const puppeteer = require('puppeteer')

const timeout = function (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

let tempDir = path.join(os.tmpdir(), 'test-stack-upgrade-' + Math.random())

process.on('unhandledRejection', error => {
  console.error(error.stack)
  process.exit(1)
})

test('stack upgrade', async () => {
  jest.setTimeout(60 * 1000)
  let execute = require('../index')
  await execute({
    destDir: tempDir,
    answers: {
      'cell-name': 'test',
      'cell-groups': 'default',
      'cell-port': 7080,
      'cell-mountpoint': '/'
    }
  })
})

test('the cell works', async () => {
  const width = 1920
  const height = 1080
  let cmds = [
    'cd ' + tempDir + '/cells/test',
    'npx webpack-dev-server'
  ]
  let child = exec(cmds.join(' && '))
  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)
  await timeout(3000)
  let browser = await puppeteer.launch({
    headless: true,
    slowMo: 80,
    args: [`--window-size=${width},${height}`]
  })
  let page = await browser.newPage()
  await page.setViewport({ width, height })

  await page.goto('http://localhost:7080/')
  await page.waitForSelector('h1')

  browser.close()
  terminate(child.pid)
})
