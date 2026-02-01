import sharp from "sharp";
import minioService from "./minio.service.js";

class ImageService {
  /**
   * Process and upload image to Minio
   * @param {Buffer} buffer - Image buffer
   * @param {string} originalName - Original filename
   * @returns {Promise<string>} - Uploaded filename
   */
  async uploadImage(buffer, originalName) {
    const filename = `${crypto.randomUUID()}.webp`;

    const processedBuffer = await sharp(buffer)
      .resize({
        width: 1200,
        withoutEnlargement: true,
        fit: "inside",
      })
      .webp({ quality: 80 })
      .toBuffer();

    await minioService.putObject(
      filename,
      processedBuffer,
      processedBuffer.length,
      {
        "Content-Type": "image/webp",
        "Original-Name": originalName,
      },
    );

    return filename;
  }

  /**
   * Get image stream from Minio
   * @param {string} filename - Filename in Minio
   * @returns {Promise<{stream: ReadableStream, stat: any}>}
   */
  async getImage(filename) {
    const stream = await minioService.getObject(filename);
    const stat = await minioService.statObject(filename);
    return { stream, stat };
  }
}

export default new ImageService();
