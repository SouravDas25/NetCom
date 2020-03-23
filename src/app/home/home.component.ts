import {Component, OnInit} from '@angular/core';
import {
  faArrowDown,
  faArrowRight,
  faArrowUp,
  faCheck,
  faEraser,
  faFilter,
  faMicrophone,
  faSave,
  faStopCircle,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import {ToastrService} from 'ngx-toastr';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SaveSessionModal} from "../shared/components/save-session-modal/save-session-modal.component";
import {OpenSessionModalComponent} from "../shared/components/open-session-modal/open-session-modal.component";
import {NetCmpService} from "../shared/helpers/NetCmpService";

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
  faEraser = faEraser;
  faSave = faSave;

  networkLog = [];
  items = [];
  selectedItem;

  netCmpService: NetCmpService = new NetCmpService();


  constructor(private toastr: ToastrService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    // this.loadData();
  }

  async loadData() {
    this.networkLog = await this.netCmpService.getCmpLogs();

    console.log(this.networkLog);
    this.items = this.networkLog;
  }

  onClick(item) {
    this.selectedItem = item;
  }


  async deleteRecord(index) {
    this.items.splice(index, 1);
  }

  async openSaveModal() {
    const modalRef = this.modalService.open(SaveSessionModal);
    modalRef.componentInstance.sessionData = this.items;
    modalRef.componentInstance.name = 'World';
    try {
      let result = await modalRef.result;
      console.log(result);
      this.netCmpService.setFromFile(result);
    } catch (e) {
      console.log(e)
    }
  }

  async openSessionModal() {
    const modalRef = this.modalService.open(OpenSessionModalComponent);
    modalRef.componentInstance.name = 'World';
    try {
      let result = await modalRef.result;
      this.netCmpService.setFromFile(result);
      console.log(result);
    } catch (e) {
      console.log(e)
    }
  }
}
