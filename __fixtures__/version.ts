import { jest } from '@jest/globals'

export const findNeoFormVersion =
  jest.fn<typeof import('../src/version.js').findNeoFormVersion>()
