import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Staff } from './staff';

describe('Staff', () => {
  // Instance of staff component being tested
  let component: Staff;

  // Test fixture used to create and interact with the component
  let fixture: ComponentFixture<Staff>;

  // Configurate the testing environment before each test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Staff],
    }).compileComponents();

    // Create an instance of the Staff component
    fixture = TestBed.createComponent(Staff);
    component = fixture.componentInstance;

    // Wait for Angular to finish initializing the component
    await fixture.whenStable();
  });

  // Verify that the Staff component is created successfully 
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
