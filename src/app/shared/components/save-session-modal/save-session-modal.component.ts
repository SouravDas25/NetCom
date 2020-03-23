import {Component, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FileSystemHelper} from "../../helpers/FileSystemHelper";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {ToastrService} from "ngx-toastr";
import {NetworkLogsHelper} from "../../helpers/NetworkLogsHelper";

@Component({
  selector: 'save-modal-session',
  templateUrl: './save-session-modal.component.html',
  styleUrls: ['./save-session-modal.component.scss']
})
export class SaveSessionModal implements OnInit {

  faCross = faTimes;

  public sessionData: Array<object>;
  public filename: String;

  public collections;

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal, private toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.load();
  }

  async load() {
    this.collections = await FileSystemHelper.getCollections();
    console.log(this.collections);
  }

  selectFile(col: string) {
    this.filename = col;
  }

  async saveSession() {
    let rcd = NetworkLogsHelper.reconstructOriginalLogs(this.sessionData);
    await FileSystemHelper.saveSession(this.filename, rcd);
    this.toastr.info("Session Data Saved.");
    this.activeModal.close(this.filename);
    // console.log("Saved File");
  }
}
