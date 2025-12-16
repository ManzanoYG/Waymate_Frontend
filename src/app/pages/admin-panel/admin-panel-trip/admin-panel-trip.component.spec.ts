import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPanelTripComponent } from './admin-panel-trip.component';

describe('AdminPanelTripComponent', () => {
  let component: AdminPanelTripComponent;
  let fixture: ComponentFixture<AdminPanelTripComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminPanelTripComponent]
    });
    fixture = TestBed.createComponent(AdminPanelTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
