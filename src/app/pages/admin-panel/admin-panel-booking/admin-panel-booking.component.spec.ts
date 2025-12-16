import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPanelBookingComponent } from './admin-panel-booking.component';

describe('AdminPanelBookingComponent', () => {
  let component: AdminPanelBookingComponent;
  let fixture: ComponentFixture<AdminPanelBookingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminPanelBookingComponent]
    });
    fixture = TestBed.createComponent(AdminPanelBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
