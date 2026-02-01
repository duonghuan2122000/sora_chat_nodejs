import * as Minio from "minio";

class MinioService {
  constructor() {
    this.client = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || "localhost",
      port: parseInt(process.env.MINIO_PORT) || 9000,
      useSSL: process.env.MINIO_USE_SSL === "true",
      accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
      secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
    });
    this.bucketName = process.env.MINIO_BUCKET || "sora_chat_image";
    this.ensureBucketExists();
  }

  async ensureBucketExists() {
    try {
      const exists = await this.client.bucketExists(this.bucketName);
      if (!exists) {
        await this.client.makeBucket(this.bucketName);
        console.log(`Bucket ${this.bucketName} created successfully.`);
      }
    } catch (err) {
      console.error("Error ensuring bucket exists:", err);
    }
  }

  async putObject(objectName, stream, size, metaData = {}) {
    return await this.client.putObject(
      this.bucketName,
      objectName,
      stream,
      size,
      metaData,
    );
  }

  async getObject(objectName) {
    return await this.client.getObject(this.bucketName, objectName);
  }

  async statObject(objectName) {
    return await this.client.statObject(this.bucketName, objectName);
  }
}

export default new MinioService();
