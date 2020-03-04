import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HomeRoutingModule} from './home-routing.module';

import {HomeComponent} from './home.component';
import {SharedModule} from '../shared/shared.module';

import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MainBodyComponent} from "./main-body/main-body.component";
import {AccordionModule} from "ngx-bootstrap";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CollapseModule} from 'ngx-bootstrap/collapse';
import {NgxTextDiffComponent, NgxTextDiffModule} from 'ngx-text-diff';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {ButtonsModule} from 'ngx-bootstrap/buttons';
import {TooltipModule} from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [HomeComponent, MainBodyComponent],
  exports: [
    HomeComponent
  ],
  imports: [CommonModule, SharedModule, HomeRoutingModule, FontAwesomeModule,
    AccordionModule, BrowserAnimationsModule, CollapseModule, NgxTextDiffModule, TabsModule.forRoot(), ButtonsModule,
    TooltipModule.forRoot()],
  entryComponents: [NgxTextDiffComponent]
})
export class HomeModule {
}
