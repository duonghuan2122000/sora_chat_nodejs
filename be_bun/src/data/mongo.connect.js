import mongoose from "mongoose";

class MongoConnect {
  constructor() {
    this._db = mongoose.connect(process.env.MONGO_URI);
  }

  static getInstance() {
    const _this = this;
    if (!_this._instance) {
      _this._instance = new MongoConnect();
    }

    return _this._instance;
  }

  async init() {
    await this._db;
  }

  async close() {
    const _this = this;
    if (_this._instance) {
      _this._instance = null;
    }
  }
}

export const mongoConnect = MongoConnect.getInstance();
