import { parseCCode } from './modules/parser.js'

const onCopyClick = (e) => {
    var textarea = document.getElementById('cCodeOutput')

    // Select the text in the textarea
    textarea.select()
    textarea.setSelectionRange(0, 99999) // For mobile devices

    // Copy the text to the clipboard
    document.execCommand('copy')

    // Optional: Alert the user that the content was copied
    alert('Text copied to clipboard!')
  },
  onCompileClick = (e) => {
    const cCode = document.getElementById('cCodeInput').value

    // TODO make a pre parse looking for an ENTRYPOINT() keyword

    // TODO make a pre parse looking for a FunctionRegistry registry[] = { .. } code

    document.getElementById('cCodeOutput').value = parseCCode(cCode)
  },
  init = (e) => {
    document.removeEventListener('DOMContentLoaded', init, false)

    document
      .getElementById('compile-btn')
      .addEventListener('click', onCompileClick, false)

    document
      .getElementById('copyBtn')
      .addEventListener('click', onCopyClick, false)
  }

document.addEventListener('DOMContentLoaded', init, false)
