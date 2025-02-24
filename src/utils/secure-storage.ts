import CryptoJS from 'crypto-js'
import { jwtDecode } from 'jwt-decode'

const ENCRYPTION_KEY =
  import.meta.env.VITE_ENCRYPTION_KEY || 'your-fallback-key'

export const secureStorage = {
  set: (key: string, value: any) => {
    try {
      // Convert the value to string and create a checksum
      const valueStr = JSON.stringify(value)
      const checksum = CryptoJS.SHA256(valueStr + ENCRYPTION_KEY).toString()

      // Combine data with checksum
      const dataWithChecksum = {
        data: valueStr,
        checksum,
      }

      // Encrypt the entire package
      const encryptedValue = CryptoJS.AES.encrypt(
        JSON.stringify(dataWithChecksum),
        ENCRYPTION_KEY
      ).toString()

      localStorage.setItem(key, encryptedValue)
    } catch (error) {
      console.error('Error setting secure storage:', error)
    }
  },

  get: (key: string) => {
    try {
      const encryptedValue = localStorage.getItem(key)
      if (!encryptedValue) return null

      // Decrypt the data
      const decrypted = CryptoJS.AES.decrypt(encryptedValue, ENCRYPTION_KEY)
      const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8)

      // Parse the data and checksum
      const { data, checksum } = JSON.parse(decryptedStr)

      // Verify checksum
      const verifyChecksum = CryptoJS.SHA256(data + ENCRYPTION_KEY).toString()
      if (checksum !== verifyChecksum) {
        console.error('Storage tampering detected')
        return null
      }

      return JSON.parse(data)
    } catch (error) {
      console.error('Error getting secure storage:', error)
      return null
    }
  },

  verify: (token: string | null): boolean => {
    if (!token) return false
    try {
      const decoded = jwtDecode(token)
      // Only verify expiration for regular tokens
      if ('exp' in decoded) {
        return decoded.exp! * 1000 > Date.now()
      }
      // For refresh tokens or other types, just verify they can be decoded
      return true
    } catch {
      return false
    }
  },
}
