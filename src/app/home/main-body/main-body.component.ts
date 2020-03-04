import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  OnChanges,
  OnDestroy,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {AccordionConfig} from 'ngx-bootstrap/accordion';
import {DiffResults} from 'ngx-text-diff/lib/ngx-text-diff.model';
import {NgxTextDiffComponent} from "ngx-text-diff";
import {NetworkLogsHelper} from "../../shared/helpers/NetworkLogsHelper";

export function getAccordionConfig(): AccordionConfig {
  return Object.assign(new AccordionConfig(), {closeOthers: true});
}

@Component({
  selector: 'app-main-body',
  templateUrl: './main-body.component.html',
  styleUrls: ['./main-body.component.css'],
  providers: [{provide: AccordionConfig, useFactory: getAccordionConfig}]
})
export class MainBodyComponent implements OnChanges, OnDestroy {

  @Input() networkTraffic1: Object;
  @Input() networkTraffic2: Object;
  @Input() displayName: string;

  isRequestCollapsed = false;
  isDiffVisible = false;

  requestHeaders: Array<Object> = [];

  @ViewChild("diffContainer", {read: ViewContainerRef}) container: ViewContainerRef;
  private componentRef: ComponentRef<NgxTextDiffComponent>;

  constructor(private resolver: ComponentFactoryResolver) {
  }

  get left() {
    return JSON.stringify(this.networkTraffic1['body'], null, 4);
  }

  get right() {
    return JSON.stringify(this.networkTraffic2['body'], null, 4);
  }

  createComponent() {
    this.container.clear();
    const factory: ComponentFactory<NgxTextDiffComponent> = this.resolver.resolveComponentFactory(NgxTextDiffComponent);
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.left = this.left;
    this.componentRef.instance.right = this.right;
    this.isDiffVisible = true;
  }

  ngOnChanges(): void {

    if (this.container != null) {
      this.createComponent()
    }

    this.requestHeaders = [];
    let headers1: Array<Object> = this.networkTraffic1['header']['headers'];
    let headers2: Array<Object> = this.networkTraffic2['header']['headers'];
    // console.log(headers);
    if (headers1 && headers2) {
      this.requestHeaders = NetworkLogsHelper.mergeHeaders(headers1, headers2);
    }

  }

  destroyComponent() {
    this.componentRef.destroy();
  }

  onCompareResults(diffResults: DiffResults) {
    console.log('diffResults', diffResults);
  }

  ngOnDestroy(): void {
    this.destroyComponent();
  }


}
