import { runpress } from "./_test-helpers"

test(`press help`, async (done) => {
  const result = await runpress(`help`)

  expect(result).toContain("press")
  expect(result).toContain("new")
  expect(result).toContain("generate")
  expect(result).toContain("doctor")
  expect(result).toContain(`community.infinite.red`)

  done()
})
