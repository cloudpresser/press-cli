import { filesystem } from "gluegun"
import * as tempy from "tempy"
import { run, runpress, runError } from "./_test-helpers"

const APP_NAME = "Foo"
const EXPO_APP_NAME = "Bar"

const originalDir = process.cwd()
let tempDir: string

beforeEach(() => {
  tempDir = tempy.directory()
  process.chdir(tempDir)
})

afterEach(() => {
  process.chdir(originalDir)
  filesystem.remove(tempDir) // clean up our mess
})

test(`press new (no name)`, async (done) => {
  const result = await runError(`new`)
  expect((result as any).stdout).toContain(`Project name is required`)
  done()
})

test(`press new ${APP_NAME}`, async (done) => {
  const result = await runpress(`new ${APP_NAME}`)

  expect(result).toContain(`Using react-native-cli`)
  expect(result).toContain(`press CLI pressd ${APP_NAME}`)

  // now let's examine the spun-up app
  process.chdir(APP_NAME)

  const dirs = filesystem.list(`.`)
  expect(dirs).toContain("ios")
  expect(dirs).toContain("android")
  expect(dirs).toContain("app")

  await testSpunUpApp()

  // we're done!
  process.chdir("..")
  done()
})

test(`press new ${EXPO_APP_NAME} --expo`, async (done) => {
  const result = await runpress(`new ${EXPO_APP_NAME} --expo`)

  expect(result).toContain(`Using expo-cli`)
  expect(result).toContain(`press CLI pressd ${EXPO_APP_NAME}`)

  // now let's examine the spun-up app
  process.chdir(EXPO_APP_NAME)

  const dirs = filesystem.list(`.`)
  expect(dirs).toContain("app")

  await testSpunUpApp()

  // we're done!
  process.chdir("..")
  done()
})

async function testSpunUpApp() {
  // run typescript
  let resultTS
  try {
    resultTS = await run(`yarn compile`)
  } catch (e) {
    resultTS = e.stdout
    console.error(resultTS)
  }
  expect(resultTS).not.toContain("error")

  // check the contents of press/templates
  const templates = filesystem.list(`./press/templates`)
  expect(templates).toContain("component")
  expect(templates).toContain("model")
  expect(templates).toContain("screen")

  // check the basic contents of package.json
  const pressJSON = filesystem.read(`./package.json`, "json")
  expect(pressJSON).toHaveProperty("scripts")
  expect(pressJSON).toHaveProperty("dependencies")
  expect(pressJSON).toHaveProperty("detox.configurations")

  // check the app.tsx file
  const appJS = filesystem.read(`./app/app.tsx`)
  expect(appJS).toContain("export default App")
  expect(appJS).toContain("RootStore")

  // now lets test generators too, since we have a properly spun-up app!
  // components
  const componentGen = await runpress(`generate component WompBomp`)
  expect(componentGen).toContain(`app/components/womp-bomp/womp-bomp.tsx`)
  expect(filesystem.list(`${process.cwd()}/app/components`)).toContain("womp-bomp")
  expect(filesystem.read(`${process.cwd()}/app/components/womp-bomp/womp-bomp.tsx`)).toContain(
    "export const WompBomp",
  )

  // models
  const modelGen = await runpress(`generate model mod-test`)
  expect(modelGen).toContain(`app/models/mod-test/mod-test.ts`)
  expect(modelGen).toContain(`app/models/mod-test/mod-test.test.ts`)
  expect(filesystem.list(`${process.cwd()}/app/models`)).toContain("mod-test")
  expect(filesystem.read(`${process.cwd()}/app/models/mod-test/mod-test.ts`)).toContain(
    "export const ModTestModel",
  )

  // screens
  const screenGen = await runpress(`generate screen bowser-screen`)
  expect(screenGen).toContain(`Stripping Screen from end of name`)
  expect(screenGen).toContain(`app/screens/bowser/bowser-screen.tsx`)
  expect(filesystem.list(`${process.cwd()}/app/screens/bowser`)).toContain("bowser-screen.tsx")
  expect(filesystem.read(`${process.cwd()}/app/screens/bowser/bowser-screen.tsx`)).toContain(
    "export const BowserScreen",
  )

  // run the tests; if they fail, run will raise and this test will fail
  await run(`yarn test --updateSnapshot`)
  await run(`yarn lint`)
  await run(`yarn compile`)
  expect(await run("git diff HEAD")).toEqual("")
}
