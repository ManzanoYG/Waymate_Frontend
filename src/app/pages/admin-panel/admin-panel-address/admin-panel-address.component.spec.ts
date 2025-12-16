import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPanelAddressComponent } from './admin-panel-address.component';

describe('AdminPanelAddressComponent', () => {
  let component: AdminPanelAddressComponent;
  let fixture: ComponentFixture<AdminPanelAddressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminPanelAddressComponent]
    });
    fixture = TestBed.createComponent(AdminPanelAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
