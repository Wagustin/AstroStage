import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Waitlist } from './waitlist';
import { AudioService } from '../../services/audio.service';
import { vi } from 'vitest';

describe('Waitlist Component', () => {
  let component: Waitlist;
  let fixture: ComponentFixture<Waitlist>;
  let httpTesting: HttpTestingController;
  let audioServiceSpy: { registerUser: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    audioServiceSpy = {
      registerUser: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Waitlist],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AudioService, useValue: audioServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Waitlist);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create component and initialize form', () => {
    expect(component).toBeTruthy();
    expect(component.waitlistForm.get('email')).toBeTruthy();
    expect(component.waitlistForm.valid).toBe(false);
  });

  it('should handle successful subscription', () => {
    component.waitlistForm.setValue({ email: 'test@example.com' });
    component.onSubmit();

    expect(component.loading).toBe(true);

    const req = httpTesting.expectOne('/api/subscribe');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@example.com' });

    req.flush({ message: 'Success' });

    expect(component.loading).toBe(false);
    expect(component.success).toBe(true);
    expect(audioServiceSpy.registerUser).toHaveBeenCalled();
  });

  it('should set generic error message on HTTP error and not leak backend error details', () => {
    component.waitlistForm.setValue({ email: 'test@example.com' });
    component.onSubmit();

    const req = httpTesting.expectOne('/api/subscribe');
    req.flush(
      { error: 'Sensitive Database StackTrace or Secret' },
      { status: 500, statusText: 'Internal Server Error' },
    );

    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('Sensitive Database StackTrace or Secret');
  });
});
