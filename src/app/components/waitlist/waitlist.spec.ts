import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Waitlist } from './waitlist';
import { AudioService } from '../../services/audio.service';
import { vi } from 'vitest';

describe('Waitlist Component Security', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    const audioServiceMock = {
      registerUser: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Waitlist, HttpClientTestingModule],
      providers: [{ provide: AudioService, useValue: audioServiceMock }],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should not expose sensitive backend error details in errorMessage upon API failure', () => {
    const fixture = TestBed.createComponent(Waitlist);
    const component = fixture.componentInstance;

    component.waitlistForm.setValue({ email: 'test@example.com' });
    component.onSubmit();

    const req = httpMock.expectOne('/api/subscribe');
    expect(req.request.method).toBe('POST');

    // Simulate backend error leaking database or internal stack trace
    const sensitiveError = {
      error: 'Postgres connection failed: role "db_admin" password authentication failed',
      details: 'Stack trace at line 42 in /var/task/db.js',
    };

    req.flush(sensitiveError, { status: 500, statusText: 'Internal Server Error' });

    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('Postgres');
    expect(component.errorMessage).not.toContain('db_admin');
    expect(component.errorMessage).not.toContain('Stack trace');
  });
});
