# QR Code Generator Action

A GitHub Action to generate QR code images from text or URLs.

## Features

- Generate QR codes as PNG or SVG images
- Customizable width and margin

## Usage

### Basic Example

```yaml
steps:
  - name: Generate QR Code
    uses: VeyronSakai/qr-code-generator@v0.1
    with:
      text: 'https://github.com/VeyronSakai/qr-code-generator'
      output-path: 'qrcode.png'
```

## Inputs

| Name          | Description                                               | Required | Default |
| ------------- | --------------------------------------------------------- | -------- | ------- |
| `text`        | The text to encode into the QR code                       | Yes      | -       |
| `output-path` | File path where the generated QR code image will be saved | Yes      | -       |
| `width`       | Width of the QR code image in pixels                      | No       | `256`   |
| `margin`      | Quiet zone size around the QR code                        | No       | `1`     |
| `type`        | Output format type (`png` or `svg`)                       | No       | `png`   |

## Examples

### Generate QR Code and Upload as Artifact

```yaml
name: Generate QR Code
on: [push]

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - name: Generate QR Code
        uses: VeyronSakai/qr-code-generator@v0.1
        with:
          text: ${{ github.server_url }}/${{ github.repository }}
          output-path: repo-qr.png

      - name: Upload QR Code
        uses: actions/upload-artifact@v3
        with:
          name: qr-code
          path: repo-qr.png
```

## Development

### Prerequisites

- Node.js 20.x or later
- npm

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the action:
   ```bash
   npm run bundle
   ```
4. Run tests:
   ```bash
   npm test
   ```

### Local Testing

You can test the action locally using the `@github/local-action` utility:

```bash
npx @github/local-action . src/main.ts .env
```

Create a `.env` file with your test inputs:

```env
INPUT_TEXT=https://example.com
INPUT_OUTPUT-PATH=test-qr.png
INPUT_WIDTH=256
INPUT_MARGIN=1
INPUT_TYPE=png
```

## License

MIT
