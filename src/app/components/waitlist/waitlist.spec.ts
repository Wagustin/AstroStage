import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
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

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should successfully submit valid email', () => {
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
    expect(component.errorMessage).toBe('');
  });

  it('should show a generic error message and NOT expose sensitive server error details on failure', () => {
    component.waitlistForm.setValue({ email: 'test@example.com' });
    component.onSubmit();

    const req = httpTesting.expectOne('/api/subscribe');

    // Simulate backend response containing sensitive/internal details
    req.flush(
      {
        error: 'Database connection failed: postgres://admin:secret@internal-db:5432/astro',
        details: 'Internal Server Error at line 42 in /var/task/handler.js',
      },
      { status: 500, statusText: 'Internal Server Error' },
    );

    expect(component.loading).toBe(false);
    expect(component.success).toBe(false);
    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('Database connection failed');
    expect(component.errorMessage).not.toContain('postgres://');
    expect(component.errorMessage).not.toContain('handler.js');
  });
});
