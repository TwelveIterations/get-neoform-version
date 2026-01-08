import * as core from '@actions/core'
import { findNeoFormVersion } from './version.js'

export async function run(): Promise<void> {
  try {
    const version: string = core.getInput('version', {
      required: true
    })

    const result = await findNeoFormVersion({ version })

    if (result) {
      core.setOutput('version', result)
    } else {
      core.setFailed('No matching NeoForm version found')
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
