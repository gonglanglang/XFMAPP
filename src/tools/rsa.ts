import JSEncrypt from "jsencrypt";
import CryptoJS from "crypto-js";
const rsaPublicKey =
  "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCD1ESdrq6oRXrxAJ2UJbL/S5HpHsNP3WnHwKeHQb41Cc28JhX8HfZVrMvk7Xn5Sh8K9uCTkjMWAraTyE1PWJK8StAwaeVaN2tWlnvKKc+OlC6zCB4gNBWQh4DhsGr3aunMW4X1OyaLOU0WrxcIqpx7sFJ+8j+iEASTAC5ooW6tNQIDAQAB";
const PhoneKey = "i13PYteZ7b4l+V4WOUKLRw=="; // 解密手机号key UTF-8
// 解密函数
export function decryptAES(encryptedData: string, key: string) {
  const keyBytes = CryptoJS.enc.Utf8.parse(key);
  const encryptedDataBytes = CryptoJS.enc.Base64.parse(encryptedData);
  const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext: encryptedDataBytes });
  // 解密
  const decrypted = CryptoJS.AES.decrypt(cipherParams, keyBytes, {
    mode: CryptoJS.mode.ECB, // 默认模式
    padding: CryptoJS.pad.Pkcs7, // 默认填充
  });
  // 将解密结果转换为字符串
  return decrypted.toString(CryptoJS.enc.Utf8);
}

class Rsa {
  private encryptor: JSEncrypt;

  constructor() {
    this.encryptor = new JSEncrypt();
    this.encryptor.setPublicKey(rsaPublicKey as string);
  }

  encrypt(data: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const encryptedData = this.encryptor.encrypt(data);
      if (encryptedData) {
        resolve(encryptedData);
      } else {
        reject(new Error("Encryption failed"));
      }
    });
  }
  // 解密手机号
  decryptPhone(encryptedData: string) {
    return decryptAES(encryptedData, PhoneKey);
  }
}

export default Rsa;
