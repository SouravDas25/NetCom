import {NetworkLogsHelper} from "./NetworkLogsHelper";
import {ShellExecutorHelper} from "./ShellExecutorHelper";

export class NetCmpService {

  public isCharlesRunning: Boolean = false;
  public isWebAutomationRunning: Boolean = false;
  public isRecoding: Boolean = false;

  originalLogsFilePath = null;
  controlLogsFilePath = null;
  comparedLogs;

  originalSessionType = "Select session 1";
  controlSessionType = "Select session 2";

  public get isSessionTypeManual(): Boolean {
    return this.isControlSessionTypeManual || this.isOriginalSessionTypeManual;
  }

  public get isOriginalSessionTypeManual(): Boolean {
    return this.originalSessionType == "record";
  }

  public get isControlSessionTypeManual(): Boolean {
    return this.controlSessionType == "record";
  }

  public get isOriginalLogSet(): Boolean {
    return this.originalLogsFilePath != null;
  }

  public get isControlLogSet(): Boolean {
    return this.controlLogsFilePath != null;
  }

  public get isAllSet(): Boolean {
    return this.isControlLogSet && this.isOriginalLogSet;
  }

  public setManualSessionType() {
    if (!this.isOriginalLogSet) {
      this.originalSessionType = "record";
    } else {
      this.controlSessionType = "record";
    }
  }

  public setFromFile(filename: string) {
    let filepath = "/collections/" + filename;
    if (!this.isOriginalLogSet) {
      this.setOriginalLogs(filepath);
      this.originalSessionType = filename;
    } else {
      this.setControlLogs(filepath);
      this.controlSessionType = filename;
    }
  }

  public async setFromWebAutomation() {
    if (!this.isRecoding) {
      this.startRecoding();
    }
    if (!this.isOriginalLogSet) {
      this.originalSessionType = "selenium";
    } else {
      this.controlSessionType = "selenium";
    }
    try {
      this.clearSession();
      await this.runWebAutomation();
      this.completeRecording();
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  public async getCmpLogs() {
    this.comparedLogs = await NetworkLogsHelper.getComparedNetworkTraffic(this.originalLogsFilePath, this.controlLogsFilePath);
    return this.comparedLogs;
  }

  completeRecording() {
    if (!this.isCharlesRunning) {
      throw new Error("Charles is not running.");
    }
    if (!this.isRecoding) {
      throw new Error("Recording should be on to stop it.");
    }
    ShellExecutorHelper.completeRecording(this.isOriginalLogSet ? "session2" : "session1");
    if (!this.isOriginalLogSet) {
      this.setOriginalLogs("/session1.json");
      // this.originalSessionType = "session1.json";
    } else {
      this.setControlLogs("/session2.json");
      // this.controlSessionType = "session2.json";
    }

    this.isRecoding = false;
  }

  clearSession() {
    if (!this.isCharlesRunning) {
      throw new Error("Charles is not running.");
    }
    ShellExecutorHelper.clearSession();
  }

  startRecoding() {
    if (!this.isCharlesRunning) {
      throw new Error("Charles is not running.");
    }
    ShellExecutorHelper.startRecording();
    this.isRecoding = true;
  }

  public runOrStopCharles(): void {
    try {
      if (this.isCharlesRunning) {
        ShellExecutorHelper.killCharles();
      } else {
        ShellExecutorHelper.runCharles();
      }
      this.isCharlesRunning = !this.isCharlesRunning;
    } catch (e) {
      console.log(e);
    }
  }

  protected setOriginalLogs(filepath: string) {
    this.originalLogsFilePath = filepath;
  }

  protected setControlLogs(filepath: string) {
    this.controlLogsFilePath = filepath;
  }

  protected async runWebAutomation() {
    if (!this.isCharlesRunning) {
      throw new Error("Charles is not running.");
    }
    try {
      this.isWebAutomationRunning = true;
      await ShellExecutorHelper.runWebAutomation();
    } catch (e) {
      throw e;
    } finally {
      this.isWebAutomationRunning = false;
    }
  }

}

