import {Component, OnInit} from '@angular/core';
import {NetworkLogsHelper} from "../shared/helpers/NetworkLogsHelper";
import {faFilter, faMicrophone, faStopCircle, faTrash, faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {ShellExecutorHelper} from "../shared/helpers/ShellExecutorHelper";

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

  networkLog = [];
  items = [];
  selectedItem;

  isCharlesRunning: Boolean = false;

  is1stCompleted: Boolean = false;
  is2stCompleted: Boolean = false;

  constructor() {
  }

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    this.networkLog = await NetworkLogsHelper.getComparedNetworkTraffic();
    // console.log(this.networkLog);
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
    ShellExecutorHelper.startRecording();
  }

  clearSession() {
    ShellExecutorHelper.clearSession();
  }

  completeRecording() {
    ShellExecutorHelper.completeRecording(this.is1stCompleted ? "session2" : "session1");
    if (!this.is1stCompleted) this.is1stCompleted = true;
    else this.is2stCompleted = true;

    if (this.is1stCompleted && this.is2stCompleted) {
      this.loadData();
    }
  }


}
