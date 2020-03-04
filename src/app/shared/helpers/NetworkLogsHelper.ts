import {Md5} from 'ts-md5/dist/md5';

const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);


export class NetworkLogsHelper {

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

  public static async loadNetworkLogs(): Promise<Array<Object>> {
    return await this.loadJsonFile('./networkLogs/network.json');
  }

  public static async loadControlLogs(): Promise<Array<Object>> {
    return await this.loadJsonFile('./networkLogs/control.json');
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

  public static hashTraffic(item): string {
    let md5 = new Md5();
    md5.appendStr(item['host']);
    md5.appendStr(item['path']);
    md5.appendStr(item['method']);
    // md5.appendStr(item['query']);
    return <string>md5.end();
  }

  public static async getComparedNetworkTraffic() {
    let networkLogs = await NetworkLogsHelper.loadNetworkLogs();
    let controlLogs = await NetworkLogsHelper.loadControlLogs();
    networkLogs = await this.filterNetworkTraffic(networkLogs);
    controlLogs = await this.filterNetworkTraffic(controlLogs);

    let networkTraffic = [];

    let mergeCollection = new Map();


    networkLogs.forEach((item) => {
      let hashStr = NetworkLogsHelper.hashTraffic(item);
      mergeCollection.set(hashStr, item);
    });

    controlLogs.forEach((item) => {
      let hashStr = NetworkLogsHelper.hashTraffic(item);

      if (mergeCollection.has(hashStr)) {
        networkTraffic.push({
          "name": item['name'],
          "host": item['host'],
          "method": item['method'],
          "path": item['path'],
          "scheme": item['scheme'],
          "query": item['query'],
          "traffic1": mergeCollection.get(hashStr),
          "traffic2": item,
        });
      } else {
        mergeCollection.set(hashStr, item);
      }
    });

    return networkTraffic;
  }


  public static async filterNetworkTraffic(networkLogs) {
    let data = [];
    networkLogs.forEach((item) => {

      let request = item['request'];
      if (request != null) {

        let body = request['body'];
        if (body != null) {
          body = body['text'];
          // console.log(body);
          if (body != null) {
            try {
              item['request']['body'] = JSON.parse(body);
            } catch (e) {
              item['request']['body'] = body;
            }
          }
        }
      }


      item['name'] = null;
      if (item['path'] != null) {
        let list = item['path'].split("/");
        // console.log(list);
        item['name'] = list[list.length - 1];
      }
      if (item['name'] != null) {
        data.push(item);
      }
    });
    // console.log(data);
    // await NetworkLogsHelper.saveNetworkLogs(networkLogs);
    return data;
  }

  public static mergeHeaders(traffic1Headers: Array<Object>, traffic2Headers: Array<Object>): Array<Object> {
    let mergeCollection = new Map();

    traffic1Headers.forEach((item) => {
      mergeCollection.set(item['name'], item['value']);
    });

    traffic2Headers.forEach((item) => {
      if (mergeCollection.has(item['name'])) {
        item['value2'] = mergeCollection.get(item['name']);
      }
    });

    // console.log(traffic2Headers);
    return traffic2Headers;
  }

}
