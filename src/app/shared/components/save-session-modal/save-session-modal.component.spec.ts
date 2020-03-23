import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SaveSessionModalComponent} from './save-session-modal.component';

describe('SaveSessionModalComponent', () => {
  let component: SaveSessionModalComponent;
  let fixture: ComponentFixture<SaveSessionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SaveSessionModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveSessionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
