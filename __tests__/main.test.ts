/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import { findNeoFormVersion } from '../__fixtures__/version.js'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('../src/version.js', () => ({ findNeoFormVersion }))

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../src/main.js')

describe('main.ts', () => {
  beforeEach(() => {
    // Set the action's inputs as return values from core.getInput().
    core.getInput.mockImplementation((name: string) => {
      const inputs: Record<string, string> = {
        version: '1.21.11-*'
      }
      return inputs[name] || ''
    })

    // Mock findNeoFormVersion to return a version.
    findNeoFormVersion.mockImplementation(() => Promise.resolve('21.11.1'))
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Sets the version output when a version is found', async () => {
    await run()

    // Verify findNeoFormVersion was called with correct parameters.
    expect(findNeoFormVersion).toHaveBeenCalledWith({
      version: '1.21.11-*'
    })

    // Verify the version output was set.
    expect(core.setOutput).toHaveBeenCalledWith('version', '21.11.1')
  })

  it('Sets a failed status when no version is found', async () => {
    // Mock findNeoFormVersion to return undefined.
    findNeoFormVersion.mockClear().mockResolvedValueOnce(undefined)

    await run()

    // Verify that the action was marked as failed.
    expect(core.setFailed).toHaveBeenCalledWith('No matching version found')
  })

  it('Sets a failed status when an error occurs', async () => {
    // Mock findNeoFormVersion to throw an error.
    findNeoFormVersion
      .mockClear()
      .mockRejectedValueOnce(new Error('NeoForm API request failed: 500'))

    await run()

    // Verify that the action was marked as failed.
    expect(core.setFailed).toHaveBeenCalledWith(
      'NeoForm API request failed: 500'
    )
  })
})
