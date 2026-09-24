import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Waitlist } from './waitlist';
import { AudioService } from '../../services/audio.service';

describe('Waitlist Component', () => {
  let component: Waitlist;
  let fixture: ComponentFixture<Waitlist>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Waitlist],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: AudioService,
          useValue: {
            registerUser: () => {},
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Waitlist);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should submit successfully and reset form', () => {
    component.waitlistForm.setValue({ email: 'test@example.com' });
    component.onSubmit();

    const req = httpMock.expectOne('/api/subscribe');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@example.com' });

    req.flush({ message: 'Success' });

    expect(component.success).toBe(true);
    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe('');
  });

  it('should show generic error message and NOT leak backend error details on failure', () => {
    component.waitlistForm.setValue({ email: 'test@example.com' });
    component.onSubmit();

    const req = httpMock.expectOne('/api/subscribe');
    req.flush(
      { error: 'Internal Database Connection Failed', details: 'Secret DB credentials leak' },
      { status: 500, statusText: 'Internal Server Error' },
    );

    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('Internal Database Connection Failed');
    expect(component.errorMessage).not.toContain('Secret DB credentials leak');
  });
});
