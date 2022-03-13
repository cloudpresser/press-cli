import { system, filesystem } from "gluegun"
const stripANSI = require("strip-ansi") // why...

const press = "node " + filesystem.path(__dirname, "..", "bin", "press")
const shellOpts = { stdio: "inherit" }

jest.setTimeout(8 * 60 * 1000)

export async function runpress(cmd: string): Promise<string> {
  return run(`${press} ${cmd}`)
}

export async function run(cmd: string): Promise<string> {
  const resultANSI = await system.run(`${cmd}`, shellOpts)
  return stripANSI(resultANSI)
}

export async function runError(cmd: string): Promise<string | any> {
  let resultANSI: string
  try {
    resultANSI = await system.run(`${press} ${cmd}`, shellOpts)
  } catch (e) {
    return e
  }
  return `No error thrown? Output: ${resultANSI}`
}
