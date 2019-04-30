const ID_PREFIX = 'jy-'

let id = 0

export const getUniqueId = () => `${ID_PREFIX}${id++}`

export const getLongUniqueId = () => `${getUniqueId()}-${(+new Date()).toString(32)}`

export const generateKeyHash = keys => {
  return keys.reduce((acc, key) => {
    return Object.assign(acc, { [key]: key })
  }, {})
}