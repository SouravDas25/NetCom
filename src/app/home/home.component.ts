import {Component, OnInit} from '@angular/core';
import {NetworkLogsHelper} from "../shared/helpers/NetworkLogsHelper";
import { faFilter } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  faFilter = faFilter;

  networkLog = [];
  items = [];
  selectedItem;

  constructor() {
  }

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    this.networkLog = await NetworkLogsHelper.filterNetworkLogs();
    this.items = this.networkLog;
  }

  onClick(item) {
    this.selectedItem = item;
  }


}
