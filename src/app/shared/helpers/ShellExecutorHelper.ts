const util = require('util');
const {spawn} = require('child_process');
const exec = util.promisify(require('child_process').exec);


export class ShellExecutorHelper {

  public static async runCharlesStream(): Promise<void> {
    try {
      const child = spawn('Charles -headless',);
      child.stdout.setEncoding("utf8");
      child.stdout.on('data', (chunk) => {
        console.log(`Charles : ${chunk}`);
      });
      child.stderr.setEncoding("utf8");
      child.on('close', (chunk) => {
        console.log(`Charles : ${chunk}`);
      });
    } catch (err) {
      console.error(err);
    }
  }

  public static async runCharles(): Promise<void> {
    try {
      const {stdout, stderr} = await exec('Charles -headless');
      console.log('stdout:', stdout);
      console.log('stderr:', stderr);
    } catch (err) {
      console.error(err);
    }
  }

  public static async killCharles(): Promise<void> {
    try {
      const {stdout, stderr} = await exec('killall Charles');
      console.log('stdout:', stdout);
      console.log('stderr:', stderr);
    } catch (err) {
      console.error(err);
    }
  }

  public static async startRecording(): Promise<void> {
    try {
      const {stdout, stderr} = await exec('curl -v -x http://127.0.0.1:8888 http://control.charles/recording/start');
      console.log('stdout:', stdout);
      console.log('stderr:', stderr);
    } catch (err) {
      console.error(err);
    }
  }

  public static async downloadNetworkLogs(fileName: string): Promise<void> {
    try {
      const {stdout, stderr} = await exec(`curl -o ./networkLogs/${fileName}.json -x http://127.0.0.1:8888 http://control.charles/session/export-json`);
      console.log('stdout:', stdout);
      console.log('stderr:', stderr);
    } catch (err) {
      console.error(err);
    }
  }

  public static async completeRecording(fileName: string): Promise<void> {
    await ShellExecutorHelper.downloadNetworkLogs(fileName);
    await ShellExecutorHelper.stopRecording();
  }


  public static async stopRecording(): Promise<void> {
    try {
      const {stdout, stderr} = await exec('curl -v -x http://127.0.0.1:8888 http://control.charles/recording/stop');
      console.log('stdout:', stdout);
      console.log('stderr:', stderr);
    } catch (err) {
      console.error(err);
    }
  }

  public static async clearSession(): Promise<void> {
    try {
      const {stdout, stderr} = await exec('curl -v -x http://127.0.0.1:8888 http://control.charles/session/clear');
      console.log('stdout:', stdout);
      console.log('stderr:', stderr);
    } catch (err) {
      console.error(err);
    }
  }

  public static async runWebAutomation(): Promise<void> {
    try {
      const {stdout, stderr} = await exec('cd /Users/i353584/Desktop/SeleniumScript && python3 /Users/i353584/Desktop/SeleniumScript/requestAutomationScript.py');
      console.log('stdout:', stdout);
      console.log('stderr:', stderr);
    } catch (err) {
      console.error(err);
    }
  }





}
