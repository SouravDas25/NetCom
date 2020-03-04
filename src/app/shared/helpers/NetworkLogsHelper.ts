const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);


export class NetworkLogsHelper {

  public static async loadNetworkLogs(): Promise<Array<Object>> {
    let data;
    try {
      data = await readFile('./networkLogs/network.json');
      data = JSON.parse(data);
      return data;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  public static async saveNetworkLogs(data): Promise<Boolean> {
    data = JSON.stringify(data);
    try {
      await writeFile('./networkLogs/network.json', data);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }


  public static async filterNetworkLogs() {
    let data = [];
    let networkLogs = await NetworkLogsHelper.loadNetworkLogs();
    networkLogs.forEach((item) => {
      item['name'] = null;
      if (item['path'] != null) {
        let list = item['path'].split("/");
        console.log(list);
        item['name'] = list[list.length - 1];
      }
      if(item['name'] != null){
        data.push(item);
      }
    });
    console.log(data);
    // await NetworkLogsHelper.saveNetworkLogs(networkLogs);
    return data;
  }

}
