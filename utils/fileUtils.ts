
export const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const [header, base64] = result.split(',');
      if (!header || !base64) {
        reject(new Error("Invalid file format for Base64 conversion."));
        return;
      }
      
      const mimeTypeMatch = header.match(/:(.*?);/);
      if (!mimeTypeMatch || !mimeTypeMatch[1]) {
        reject(new Error("Could not determine MIME type from file header."));
        return;
      }
      
      resolve({ base64, mimeType: mimeTypeMatch[1] });
    };
    reader.onerror = (error) => reject(error);
  });
};
