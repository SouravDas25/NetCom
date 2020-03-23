const fs = require('fs');

export class FileSystemHelper {

  static collectionDir = "./networkLogs/collections";

  public static async getCollections() {
    let collections: Array<Object> = fs.readdirSync(FileSystemHelper.collectionDir);
    return collections;
  }

}
