import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {

  // Configurate the testing environment before each test runs
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  // Verify that the applicatio component is created successfully
  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  // Verify that the application's title is rendered correctly
  it('should render title', async () => {

    // Creates an instance of the App component for testing
    const fixture = TestBed.createComponent(App);

    // Wait for Angular to finish rendering the component
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    //Finds the first <h1> element in the rendered HTML
    // and retieves the text inside to check if it contains the title
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, grocery-store-ui');
  });
});
