import { parseCCode } from './modules/parser.js'
import {
  checkEntryPoint,
  checkRegisterFunctionArray,
} from './modules/checker.js'

const onInfoExpanderClick = (e) => {
    const myInfo = document.getElementById('info')

    !myInfo.classList.contains('show')
      ? myInfo.classList.add('show')
      : myInfo.classList.remove('show')
  },
  onPasteClick = (e) => {
    const textAreaTarget = document.getElementById('cCodeInput')

    navigator.clipboard
      .readText()
      .then((text) => {
        textAreaTarget.value = text
      })
      .catch((err) => {
        console.error('Failed to read clipboard contents: ', err)
        alert('Unable to paste from clipboard. Check permissions.')
      })
  },
  onCopyClick = (e) => {
    var textarea = document.getElementById('cCodeOutput')

    textarea.select()
    textarea.setSelectionRange(0, 99999)

    document.execCommand('copy')

    alert('Text copied to clipboard!')
  },
  onCompileClick = (e) => {
    const cCode = document.getElementById('cCodeInput').value

    checkEntryPoint(cCode)

    checkRegisterFunctionArray(cCode)

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

    document
      .getElementById('pasteBtn')
      .addEventListener('click', onPasteClick, false)

    document
      .getElementById('about-expander')
      .addEventListener('click', onInfoExpanderClick, false)
  }

document.addEventListener('DOMContentLoaded', init, false)
