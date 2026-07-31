import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Customer } from './customer';

describe('Customer', () => {
  // Intance of Customer component
  let component: Customer;
  // Text fixture used to create and interact with the component
  let fixture: ComponentFixture<Customer>;

  // Configurate the testing environment before each test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Customer],
    }).compileComponents();

    // Create an instance of the Customer component 
    fixture = TestBed.createComponent(Customer);
    component = fixture.componentInstance;

    // Wait for Angular to finish initalizing the component
    await fixture.whenStable();
  });

  // Verify that the Customer component got created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
