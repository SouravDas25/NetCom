import {Component, Input, OnInit} from '@angular/core';
import {AccordionConfig} from 'ngx-bootstrap/accordion';


export function getAccordionConfig(): AccordionConfig {
  return Object.assign(new AccordionConfig(), {closeOthers: true});
}

@Component({
  selector: 'app-main-body',
  templateUrl: './main-body.component.html',
  styleUrls: ['./main-body.component.css'],
  providers: [{provide: AccordionConfig, useFactory: getAccordionConfig}]
})
export class MainBodyComponent implements OnInit {

  @Input() selectedLogItem: Object;

  isRequestCollapsed = false;
  isResponseCollapsed = false;


  constructor() {
  }

  ngOnInit(): void {
  }

}
