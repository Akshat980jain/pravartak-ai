const crypto = require('crypto');

class EncryptionService {
  constructor() {
    this.algorithm = 'aes-256-cbc';
    this.secretKey = process.env.ENCRYPTION_KEY || 'your-32-character-encryption-key';
    this.ivKey = process.env.IV_KEY || 'your-16-character-iv-key';
    
    // Ensure keys are the correct length
    this.secretKey = crypto.createHash('sha256').update(this.secretKey).digest();
    this.iv = Buffer.from(this.ivKey, 'utf8').slice(0, 16);
  }

  /**
   * Encrypt sensitive data
   * @param {string} text - Text to encrypt
   * @returns {string} - Encrypted text
   */
  encrypt(text) {
    try {
      const cipher = crypto.createCipher(this.algorithm, this.secretKey);
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return encrypted;
    } catch (error) {
      throw new Error('Encryption failed: ' + error.message);
    }
  }

  /**
   * Decrypt sensitive data
   * @param {string} encryptedText - Encrypted text
   * @returns {string} - Decrypted text
   */
  decrypt(encryptedText) {
    try {
      const decipher = crypto.createDecipher(this.algorithm, this.secretKey);
      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      throw new Error('Decryption failed: ' + error.message);
    }
  }

  /**
   * Hash sensitive data (one-way)
   * @param {string} text - Text to hash
   * @returns {string} - Hashed text
   */
  hash(text) {
    return crypto.createHash('sha256').update(text).digest('hex');
  }

  /**
   * Generate random token
   * @param {number} length - Token length
   * @returns {string} - Random token
   */
  generateToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generate UUID
   * @returns {string} - UUID
   */
  generateUUID() {
    return crypto.randomUUID();
  }

  /**
   * Encrypt Aadhaar number
   * @param {string} aadhaar - Aadhaar number
   * @returns {string} - Encrypted Aadhaar
   */
  encryptAadhaar(aadhaar) {
    if (!aadhaar || aadhaar.length !== 12) {
      throw new Error('Invalid Aadhaar number');
    }
    return this.encrypt(aadhaar);
  }

  /**
   * Decrypt Aadhaar number
   * @param {string} encryptedAadhaar - Encrypted Aadhaar
   * @returns {string} - Decrypted Aadhaar
   */
  decryptAadhaar(encryptedAadhaar) {
    return this.decrypt(encryptedAadhaar);
  }

  /**
   * Encrypt bank account details
   * @param {object} bankDetails - Bank account details
   * @returns {object} - Encrypted bank details
   */
  encryptBankDetails(bankDetails) {
    const encrypted = { ...bankDetails };
    if (encrypted.accountNumber) {
      encrypted.accountNumber = this.encrypt(encrypted.accountNumber);
    }
    if (encrypted.ifscCode) {
      encrypted.ifscCode = this.encrypt(encrypted.ifscCode);
    }
    return encrypted;
  }

  /**
   * Decrypt bank account details
   * @param {object} encryptedBankDetails - Encrypted bank details
   * @returns {object} - Decrypted bank details
   */
  decryptBankDetails(encryptedBankDetails) {
    const decrypted = { ...encryptedBankDetails };
    if (decrypted.accountNumber) {
      decrypted.accountNumber = this.decrypt(decrypted.accountNumber);
    }
    if (decrypted.ifscCode) {
      decrypted.ifscCode = this.decrypt(decrypted.ifscCode);
    }
    return decrypted;
  }
}

module.exports = new EncryptionService();
