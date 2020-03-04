import {Component, OnInit} from '@angular/core';
import {NetworkLogsHelper} from "../shared/helpers/NetworkLogsHelper";
import {faFilter, faMicrophone, faStopCircle, faTrash} from '@fortawesome/free-solid-svg-icons';

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

  networkLog = [];
  items = [];
  selectedItem;

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


}
