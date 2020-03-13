import {Md5} from 'ts-md5/dist/md5';

var Multimap = require('multimap');

const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

function isObject(v) {
  return '[object Object]' === Object.prototype.toString.call(v);
}


export class NetworkLogsHelper {

  public static jsonSort(o) {
    if (Array.isArray(o)) {
      return o.sort().map(NetworkLogsHelper.jsonSort);
    } else if (isObject(o)) {
      return Object
        .keys(o)
        .sort()
        .reduce(function (a, k) {
          a[k] = NetworkLogsHelper.jsonSort(o[k]);

          return a;
        }, {});
    }

    return o;
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

  public static async loadNetworkLogs(fallback: Boolean = false): Promise<Array<Object>> {
    let filename = fallback ? 'network.json' : 'session1.json';
    return await this.loadJsonFile(`./networkLogs/${filename}`);
  }

  public static async loadControlLogs(fallback: Boolean = false): Promise<Array<Object>> {
    let filename = fallback ? 'control.json' : 'session2.json';
    return await this.loadJsonFile(`./networkLogs/${filename}`);
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

  public static async getComparedNetworkTraffic(fallback: Boolean = false) {
    let networkLogs = await NetworkLogsHelper.loadNetworkLogs(fallback);
    let controlLogs = await NetworkLogsHelper.loadControlLogs(fallback);
    networkLogs = await this.filterNetworkTraffic(networkLogs);
    controlLogs = await this.filterNetworkTraffic(controlLogs);

    let networkTraffic = [];

    let mergeCollection = new Multimap();


    networkLogs.forEach((item) => {
      let hashStr = NetworkLogsHelper.hashTraffic(item);
      mergeCollection.set(hashStr, item);
    });

    controlLogs.forEach((item) => {
      if (item == null) return;
      let hashStr = NetworkLogsHelper.hashTraffic(item);

      if (mergeCollection.has(hashStr)) {
        let values: Array<Object> = mergeCollection.get(hashStr);
        let item2 = values[0];
        if (item2 == null) return;
        mergeCollection.delete(hashStr, item2);
        let isResponseDiff = JSON.stringify(item2['response']['body']) != JSON.stringify(item['response']['body']);
        let isRequestDiff = JSON.stringify(item2['request']['body']) != JSON.stringify(item['request']['body']);
        networkTraffic.push({
          "name": item['name'],
          "host": item['host'],
          "method": item['method'],
          "path": item['path'],
          "scheme": item['scheme'],
          "query": item['query'],
          "isResponseDiff": isResponseDiff,
          "isRequestDiff": isRequestDiff,
          "traffic1": item2,
          "traffic2": item,
        });
      } else {
        mergeCollection.set(hashStr, item);
      }
    });
    // console.log(networkTraffic);
    return networkTraffic;
  }

  public static jsonifyBody(item, key) {

    let traffic = item[key];
    if (traffic != null) {

      let body = traffic['body'];
      if (body != null) {
        body = body['text'];
        // console.log(body);
        if (body != null) {
          try {
            item[key]['body'] = JSON.parse(body);
            item[key]['body'] = NetworkLogsHelper.jsonSort(item[key]['body']);
          } catch (e) {
            item[key]['body'] = body;
          }
        }
      }
    }
  }

  public static async filterNetworkTraffic(networkLogs) {
    let data = [];
    networkLogs.forEach((item) => {


      NetworkLogsHelper.jsonifyBody(item, 'request');
      NetworkLogsHelper.jsonifyBody(item, 'response');

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
