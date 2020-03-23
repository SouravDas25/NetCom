import {Component, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FileSystemHelper} from "../../helpers/FileSystemHelper";

@Component({
  selector: 'save-modal-session',
  templateUrl: './save-session-modal.component.html',
  styleUrls: ['./save-session-modal.component.scss']
})
export class SaveSessionModal implements OnInit {

  public modal: Object;

  public collections;

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) {

  }

  ngOnInit(): void {
    this.load();
  }

  async load() {
    this.collections = await FileSystemHelper.getCollections();
    console.log(this.collections);
  }

}
