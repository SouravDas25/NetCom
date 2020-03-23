import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FileSystemHelper} from "../../helpers/FileSystemHelper";
import {faTimes} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-open-session-modal',
  templateUrl: './open-session-modal.component.html',
  styleUrls: ['./open-session-modal.component.css']
})
export class OpenSessionModalComponent implements OnInit {

  faTimes = faTimes;

  public filename: String;
  public collections;

  constructor(public activeModal: NgbActiveModal) {
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

  openSession() {
    this.activeModal.close(this.filename);
  }

}
