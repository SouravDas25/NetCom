import {Component, OnInit} from '@angular/core';
import {NetworkLogsHelper} from "../shared/helpers/NetworkLogsHelper";
import {
  faArrowDown,
  faArrowRight,
  faArrowUp,
  faCheck,
  faFilter,
  faMicrophone,
  faStopCircle,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import {ShellExecutorHelper} from "../shared/helpers/ShellExecutorHelper";
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  faFilter = faFilter;
  faTrash = faTrash;
  faMicrophone = faMicrophone;
  faStopCircle = faStopCircle;
  faArrowRight = faArrowRight;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faCheck = faCheck;

  networkLog = [];
  items = [];
  selectedItem;

  isCharlesRunning: Boolean = false;
  isRecoding: Boolean = false;

  is1stCompleted: Boolean = false;
  is2stCompleted: Boolean = false;

  isWebAutomationRunning: Boolean = false;

  constructor(private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.loadData(false);
  }

  async loadData(fallback: boolean = false) {
    this.networkLog = await NetworkLogsHelper.getComparedNetworkTraffic(fallback);
    console.log(this.networkLog);
    this.items = this.networkLog;
  }

  onClick(item) {
    this.selectedItem = item;
  }

  runOrStopCharlesOnClick() {
    if (this.isCharlesRunning) {
      ShellExecutorHelper.killCharles();
    } else {
      ShellExecutorHelper.runCharles();
    }
    this.isCharlesRunning = !this.isCharlesRunning;
  }

  startRecoding() {
    if (!this.isCharlesRunning) {
      this.toastr.info("Charles is not running, please start charles first.");
      return;
    }
    if (!this.is1stCompleted) {
      this.toastr.info("Please record the web first.");
      return;
    }
    ShellExecutorHelper.startRecording();
    this.isRecoding = true;
  }

  clearSession() {
    if (!this.isCharlesRunning) {
      this.toastr.info("Charles is not running, please start charles first.");
      return;
    }
    ShellExecutorHelper.clearSession();
  }

  completeRecording() {
    if (!this.isCharlesRunning) {
      this.toastr.info("Charles is not running, please start charles first.");
      return;
    }
    if (!this.isRecoding) {
      this.toastr.error("Recording should be on to stop it.");
      return;
    }
    ShellExecutorHelper.completeRecording(this.is1stCompleted ? "session2" : "session1");
    if (!this.is1stCompleted) this.is1stCompleted = true;
    else this.is2stCompleted = true;

    this.isRecoding = false;

    if (this.is1stCompleted && this.is2stCompleted) {
      this.loadData(true);
    }
  }


  async runWebAutomation() {
    if (!this.isCharlesRunning) {
      this.toastr.info("Charles is not running, please start charles first.");
      return;
    }
    try {
      this.isWebAutomationRunning = true;
      await ShellExecutorHelper.runWebAutomation();
      this.is1stCompleted = true;
    }
    catch (e) {
      this.toastr.error("Error Occurred while running Web Automation.");
    }
    finally {
      this.isWebAutomationRunning = false;
    }
  }
}
