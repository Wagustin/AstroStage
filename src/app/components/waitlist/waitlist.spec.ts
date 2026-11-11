import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Waitlist } from './waitlist';
import { AudioService } from '../../services/audio.service';
import { vi } from 'vitest';

describe('Waitlist Component', () => {
  let fixture: ComponentFixture<Waitlist>;
  let component: Waitlist;
  let httpMock: HttpTestingController;
  let audioServiceMock: { registerUser: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    audioServiceMock = {
      registerUser: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Waitlist],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AudioService, useValue: audioServiceMock },
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

  it('should successfully submit and reset form on success', () => {
    component.waitlistForm.setValue({ email: 'test@example.com' });
    component.onSubmit();

    expect(component.loading).toBe(true);

    const req = httpMock.expectOne('/api/subscribe');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@example.com' });

    req.flush({ message: 'Success' });

    expect(component.success).toBe(true);
    expect(component.loading).toBe(false);
    expect(audioServiceMock.registerUser).toHaveBeenCalled();
  });

  it('should display generic error message on HTTP error and not leak backend error details', () => {
    component.waitlistForm.setValue({ email: 'attacker@example.com' });
    component.onSubmit();

    expect(component.loading).toBe(true);

    const req = httpMock.expectOne('/api/subscribe');
    // Simulate backend leaking sensitive DB or environment details
    req.flush(
      {
        error: 'Postgres connection failed: password=secret at 10.0.0.1',
        details: 'Stack trace at /app/api/subscribe.ts:42',
      },
      { status: 500, statusText: 'Internal Server Error' },
    );

    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('Postgres');
    expect(component.errorMessage).not.toContain('secret');
    expect(component.errorMessage).not.toContain('Stack trace');
  });
});
