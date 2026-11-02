import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Waitlist } from './waitlist';
import { AudioService } from '../../services/audio.service';
import { vi } from 'vitest';

describe('Waitlist Component', () => {
  let fixture: ComponentFixture<Waitlist>;
  let component: Waitlist;
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

  it('should create the waitlist component', () => {
    expect(component).toBeTruthy();
  });

  it('should not expose raw backend error details when subscribe fails', () => {
    component.waitlistForm.setValue({ email: 'test@example.com' });
    component.onSubmit();

    expect(component.loading).toBe(true);

    const req = httpTesting.expectOne('/api/subscribe');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@example.com' });

    // Simulate backend error with sensitive information leakage
    const sensitiveErrorPayload = {
      error: 'SQLSTATE[42000]: Syntax error or access violation: SELECT * FROM secrets',
      details: {
        dbHost: 'internal-db.private.net',
        stackTrace: 'at queryInternal (/server.js:42)',
      },
    };

    req.flush(sensitiveErrorPayload, {
      status: 500,
      statusText: 'Internal Server Error',
    });

    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('SQLSTATE');
    expect(component.errorMessage).not.toContain('internal-db.private.net');
    expect(component.errorMessage).not.toContain('stackTrace');
  });

  it('should handle successful subscription', () => {
    component.waitlistForm.setValue({ email: 'fan@example.com' });
    component.onSubmit();

    const req = httpTesting.expectOne('/api/subscribe');
    req.flush({ message: 'Suscripción exitosa, correo enviado.' });

    expect(component.success).toBe(true);
    expect(component.loading).toBe(false);
    expect(component.submitted).toBe(false);
    expect(audioServiceSpy.registerUser).toHaveBeenCalled();
  });
});
