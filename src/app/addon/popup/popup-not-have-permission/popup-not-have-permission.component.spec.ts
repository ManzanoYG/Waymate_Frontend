import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupNotHavePermissionComponent } from './popup-not-have-permission.component';

describe('PopupNotHavePermissionComponent', () => {
  let component: PopupNotHavePermissionComponent;
  let fixture: ComponentFixture<PopupNotHavePermissionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupNotHavePermissionComponent]
    });
    fixture = TestBed.createComponent(PopupNotHavePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
