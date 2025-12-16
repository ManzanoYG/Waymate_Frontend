import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupNotConnectedComponent } from './popup-not-connected.component';

describe('PopupNotConnectedComponent', () => {
  let component: PopupNotConnectedComponent;
  let fixture: ComponentFixture<PopupNotConnectedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupNotConnectedComponent]
    });
    fixture = TestBed.createComponent(PopupNotConnectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
