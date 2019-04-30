import { generateKeyHash } from '../utils'

export const DEFAULT_OPTION = {
  markdown: '',
}

export const EVENT_KEYS = generateKeyHash([
  'Enter',
  'Backspace',
  'Delete',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Tab',
  'Escape'
])