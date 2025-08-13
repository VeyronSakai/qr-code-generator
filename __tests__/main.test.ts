/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import * as path from 'path'

// Mock qrcode module
const mockToFile = jest.fn<() => Promise<void>>()
jest.unstable_mockModule('qrcode', () => ({
  default: {
    toFile: mockToFile
  }
}))

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('fs', () => ({
  mkdirSync: jest.fn()
}))
jest.unstable_mockModule('path', () => path)

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../src/main.js')

describe('main.ts', () => {
  beforeEach(() => {
    // Reset all mocks
    mockToFile.mockReset()
    mockToFile.mockResolvedValue()

    // Set the action's inputs as return values from core.getInput().
    core.getInput.mockImplementation((name: string) => {
      switch (name) {
        case 'text':
          return 'https://example.com'
        case 'output-path':
          return 'qrcode.png'
        case 'width':
          return '256'
        case 'margin':
          return '1'
        case 'type':
          return 'png'
        default:
          return ''
      }
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Generates QR code successfully', async () => {
    await run()

    // Verify QR code generation was called with correct parameters
    expect(mockToFile).toHaveBeenCalledWith(
      'qrcode.png',
      'https://example.com',
      {
        type: 'png',
        width: 256,
        margin: 1
      }
    )

    // Verify info message was logged
    expect(core.info).toHaveBeenCalledWith(
      'QR code generated successfully at: qrcode.png'
    )
  })

  it('Sets a failed status for invalid type', async () => {
    // Clear the getInput mock and return an invalid type value.
    core.getInput.mockClear().mockImplementation((name: string) => {
      switch (name) {
        case 'text':
          return 'https://example.com'
        case 'output-path':
          return 'qrcode.png'
        case 'type':
          return 'invalid'
        default:
          return ''
      }
    })

    await run()

    // Verify that the action was marked as failed.
    expect(core.setFailed).toHaveBeenCalledWith(
      "Failed to generate QR code: Invalid type: invalid. Must be 'png' or 'svg'"
    )
  })

  it('Handles QR code generation error', async () => {
    // Mock QR code generation to fail
    mockToFile.mockRejectedValueOnce(new Error('Generation failed'))

    await run()

    // Verify that the action was marked as failed.
    expect(core.setFailed).toHaveBeenCalledWith(
      'Failed to generate QR code: Generation failed'
    )
  })

  it('Sets a failed status for invalid width', async () => {
    // Clear the getInput mock and return an invalid width value.
    core.getInput.mockClear().mockImplementation((name: string) => {
      switch (name) {
        case 'text':
          return 'https://example.com'
        case 'output-path':
          return 'qrcode.png'
        case 'width':
          return 'not-a-number'
        default:
          return ''
      }
    })

    await run()

    // Verify that the action was marked as failed.
    expect(core.setFailed).toHaveBeenCalledWith(
      'Failed to generate QR code: Invalid width: not-a-number. Must be a positive integer.'
    )
  })

  it('Sets a failed status for negative width', async () => {
    // Clear the getInput mock and return a negative width value.
    core.getInput.mockClear().mockImplementation((name: string) => {
      switch (name) {
        case 'text':
          return 'https://example.com'
        case 'output-path':
          return 'qrcode.png'
        case 'width':
          return '-100'
        default:
          return ''
      }
    })

    await run()

    // Verify that the action was marked as failed.
    expect(core.setFailed).toHaveBeenCalledWith(
      'Failed to generate QR code: Invalid width: -100. Must be a positive integer.'
    )
  })

  it('Sets a failed status for invalid margin', async () => {
    // Clear the getInput mock and return an invalid margin value.
    core.getInput.mockClear().mockImplementation((name: string) => {
      switch (name) {
        case 'text':
          return 'https://example.com'
        case 'output-path':
          return 'qrcode.png'
        case 'margin':
          return 'invalid'
        default:
          return ''
      }
    })

    await run()

    // Verify that the action was marked as failed.
    expect(core.setFailed).toHaveBeenCalledWith(
      'Failed to generate QR code: Invalid margin: invalid. Must be a non-negative integer.'
    )
  })

  it('Sets a failed status for negative margin', async () => {
    // Clear the getInput mock and return a negative margin value.
    core.getInput.mockClear().mockImplementation((name: string) => {
      switch (name) {
        case 'text':
          return 'https://example.com'
        case 'output-path':
          return 'qrcode.png'
        case 'margin':
          return '-5'
        default:
          return ''
      }
    })

    await run()

    // Verify that the action was marked as failed.
    expect(core.setFailed).toHaveBeenCalledWith(
      'Failed to generate QR code: Invalid margin: -5. Must be a non-negative integer.'
    )
  })
})
