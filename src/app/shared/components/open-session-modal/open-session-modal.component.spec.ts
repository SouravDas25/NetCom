import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {OpenSessionModalComponent} from './open-session-modal.component';

describe('OpenSessionModalComponent', () => {
  let component: OpenSessionModalComponent;
  let fixture: ComponentFixture<OpenSessionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OpenSessionModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenSessionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
