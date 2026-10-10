import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Waitlist } from './waitlist';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AudioService } from '../../services/audio.service';
import { vi } from 'vitest';

describe('Waitlist Component Security', () => {
  let component: Waitlist;
  let fixture: ComponentFixture<Waitlist>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    const audioServiceMock = {
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

  it('should display generic error message on HTTP error and NOT expose backend error details', () => {
    component.waitlistForm.setValue({ email: 'test@example.com' });
    component.onSubmit();

    const req = httpMock.expectOne('/api/subscribe');
    expect(req.request.method).toBe('POST');

    const sensitiveErrorPayload = {
      error: 'Database connection failed: postgres://admin:secret@db.internal:5432/db',
      details: 'Stack trace: at secretModule.ts:42',
    };

    req.flush(sensitiveErrorPayload, { status: 500, statusText: 'Internal Server Error' });

    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('Database connection failed');
    expect(component.errorMessage).not.toContain('secretModule');
    expect(component.loading).toBe(false);
  });
});
