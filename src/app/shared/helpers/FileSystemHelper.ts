const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

export class FileSystemHelper {

  static collectionDir = "./networkLogs/collections";

  public static async getCollections() {
    let collections: Array<Object> = fs.readdirSync(FileSystemHelper.collectionDir);
    return collections;
  }

  public static async saveSession(filename: String, session: Array<Object>) {
    let saveFilePath = FileSystemHelper.collectionDir + "/" + filename;
    return await this.saveJsonFile(saveFilePath, session);
  }

  public static async saveJsonFile(filePath: String, data: Array<Object>): Promise<Boolean> {
    let dataStr = JSON.stringify(data);
    try {
      await writeFile(filePath, dataStr);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  public static async loadJsonFile(filename: string): Promise<Array<Object>> {
    let data;
    try {
      data = await readFile(filename);
      data = JSON.parse(data);
      // console.log(data);
      return data;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

}
