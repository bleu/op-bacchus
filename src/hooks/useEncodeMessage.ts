// import { ethers } from 'ethers';

// async function generateSymmetricKey(): Promise<CryptoKey> {
//   return await window.crypto.subtle.generateKey(
//     { name: "AES-GCM", length: 256 },
//     true,
//     ["encrypt", "decrypt"]
//   );
// }

// interface EncryptedData {
//   iv: Uint8Array;
//   encrypted: ArrayBuffer;
// }

// async function encryptMessage(message: string, symmetricKey: CryptoKey): Promise<EncryptedData> {
//   const enc = new TextEncoder();
//   const iv = window.crypto.getRandomValues(new Uint8Array(12));
//   const encrypted = await window.crypto.subtle.encrypt(
//     { name: "AES-GCM", iv: iv },
//     symmetricKey,
//     enc.encode(message)
//   );
//   return { iv, encrypted };
// }

// async function decryptMessage(encryptedData: EncryptedData, symmetricKey: CryptoKey): Promise<string> {
//   const dec = new TextDecoder();
//   const decrypted = await window.crypto.subtle.decrypt(
//     { name: "AES-GCM", iv: encryptedData.iv },
//     symmetricKey,
//     encryptedData.encrypted
//   );
//   return dec.decode(decrypted);
// }

// interface EncryptedPackage {
//   encryptedMessage: EncryptedData;
//   encryptedSymKey: string;
// }

// async function encryptForRecipient(message: string, recipientPublicKey: string): Promise<EncryptedPackage> {
//   const symmetricKey = await generateSymmetricKey();
//   const encryptedMessage = await encryptMessage(message, symmetricKey);

//   const exportedSymKey = await window.crypto.subtle.exportKey("raw", symmetricKey);
//   const encryptedSymKey = await ethers.signMessage.encryptData(ethers.getBytes(recipientPublicKey), exportedSymKey);

//   return {
//     encryptedMessage,
//     encryptedSymKey: ethers.hexlify(encryptedSymKey)
//   };
// }

// async function decryptAsRecipient(encryptedData: EncryptedPackage, recipientPrivateKey: string): Promise<string> {
//   const decryptedSymKey = await ethers.SigningKey.recoverPublicKey(
//     recipientPrivateKey,
//     ethers.getBytes(encryptedData.encryptedSymKey)
//   );

//   const symmetricKey = await window.crypto.subtle.importKey(
//     "raw",
//     decryptedSymKey,
//     { name: "AES-GCM", length: 256 },
//     true,
//     ["encrypt", "decrypt"]
//   );

//   return await decryptMessage(encryptedData.encryptedMessage, symmetricKey);
// }

// // Example usage:
// async function example(): Promise<void> {
//   // Generate a random Ethereum key pair for this example
//   const wallet = ethers.Wallet.createRandom();
//   const publicKey = wallet.publicKey;
//   const privateKey = wallet.privateKey;

//   const message = "Hello, Ethereum!";
//   console.log("Original message:", message);

//   try {
//     // Encrypt
//     const encrypted = await encryptForRecipient(message, publicKey);
//     console.log("Encrypted data:", encrypted);

//     // Decrypt
//     const decrypted = await decryptAsRecipient(encrypted, privateKey);
//     console.log("Decrypted message:", decrypted);
//   } catch (error) {
//     console.error("An error occurred:", error);
//   }
// }

// example().catch(console.error);
