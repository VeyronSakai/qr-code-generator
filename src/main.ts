import * as core from '@actions/core'
import * as fs from 'fs'
import * as path from 'path'
import QRCode from 'qrcode'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    // Get inputs
    const text: string = core.getInput('text', { required: true })
    const outputPath: string = core.getInput('output-path', { required: true })

    // Parse and validate width
    const widthInput: string = core.getInput('width') || '256'
    const width: number = parseInt(widthInput, 10)
    if (Number.isNaN(width) || width <= 0) {
      throw new Error(
        `Invalid width: ${widthInput}. Must be a positive integer.`
      )
    }

    // Parse and validate margin
    const marginInput: string = core.getInput('margin') || '1'
    const margin: number = parseInt(marginInput, 10)
    if (Number.isNaN(margin) || margin < 0) {
      throw new Error(
        `Invalid margin: ${marginInput}. Must be a non-negative integer.`
      )
    }

    const type: string = core.getInput('type') || 'png'

    // Validate type
    if (type !== 'png' && type !== 'svg') {
      throw new Error(`Invalid type: ${type}. Must be 'png' or 'svg'`)
    }

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Generating QR code for text: ${text}`)
    core.debug(`Output path: ${outputPath}`)
    core.debug(`Width: ${width}, Margin: ${margin}, Type: ${type}`)

    // Ensure the directory exists
    const dir = path.dirname(outputPath)
    if (dir && dir !== '.') {
      fs.mkdirSync(dir, { recursive: true })
    }

    // Generate the QR code
    await QRCode.toFile(outputPath, text, {
      type: type as 'png' | 'svg',
      width,
      margin
    })

    core.info(`QR code generated successfully at: ${outputPath}`)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) {
      core.setFailed(`Failed to generate QR code: ${error.message}`)
    } else {
      core.setFailed('Failed to generate QR code: Unknown error')
    }
  }
}
