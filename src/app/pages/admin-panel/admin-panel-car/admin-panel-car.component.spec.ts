import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPanelCarComponent } from './admin-panel-car.component';

describe('AdminPanelCarComponent', () => {
  let component: AdminPanelCarComponent;
  let fixture: ComponentFixture<AdminPanelCarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminPanelCarComponent]
    });
    fixture = TestBed.createComponent(AdminPanelCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
