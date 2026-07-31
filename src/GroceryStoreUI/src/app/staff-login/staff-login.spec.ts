import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffLogin } from './staff-login';

describe('StaffLogin', () => {

  // Component instance used during testing
  let component: StaffLogin;

  // Provides access to the component and its template
  let fixture: ComponentFixture<StaffLogin>;

  // Sets up the testing environemnt before each test
  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [StaffLogin],
    }).compileComponents();

    // Creates an instance of the StaffLogin component
    fixture = TestBed.createComponent(StaffLogin);

    // Retrives the component instance for testing
    component = fixture.componentInstance;

    // Waits for Angular to finish rendering the component
    await fixture.whenStable();
  });

  // Verifies that the component is created siccessfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
