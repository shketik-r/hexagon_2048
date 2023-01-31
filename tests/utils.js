const { getFieldPoints } = require("../rng-server/fieldUtils")
const { URL, URLSearchParams } = require("url")

const DELAY_BETWEEN_ACTIONS = 800

const getDataValue = (e) => e.evaluate((e) => e.getAttribute("data-value"))
const getDataStatus = (e) => e.evaluate((e) => e.getAttribute("data-status"))
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const createSerialServerHandler = (answers) => () => answers.length > 0 ? answers.shift() : []

async function readDOMField(page, radius) {
  const fieldPoints = getFieldPoints(radius)

  return await Promise.all(
    fieldPoints.map(async ({ x, y, z }) => {
      const element = await page.waitForSelector(`[data-x="${x}"][data-y="${y}"][data-z="${z}"]`)
      const value = parseInt(await getDataValue(element))
      return { x, y, z, value }
    }),
  )
}

const setupPage = async (browser, href, radius) => {
  const page = await browser.newPage()
  const testHref = new URL(href)
  const searchParams = new URLSearchParams()

  searchParams.append("hostname", "localhost")
  searchParams.append("port", "13337")
  searchParams.append("radius", radius)

  const url = testHref.toString() + "?" + searchParams.toString()

  await page.goto(url)
  await delay(DELAY_BETWEEN_ACTIONS)
  return page
}

const pressDirectionKeys = async (page, keys) => {
  for (let key of keys) {
    await page.keyboard.press("Key" + key.toUpperCase())
    await delay(DELAY_BETWEEN_ACTIONS)
  }
}

module.exports = {
  getDataStatus,
  setupPage,
  pressDirectionKeys,
  delay,
  readDOMField,
  createSerialServerHandler,
}
