import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { vi } from 'vitest';
import { Waitlist } from './waitlist';
import { AudioService } from '../../services/audio.service';

describe('Waitlist Component', () => {
  let fixture: ComponentFixture<Waitlist>;
  let component: Waitlist;
  let mockHttpClient: { post: ReturnType<typeof vi.fn> };
  let mockAudioService: { registerUser: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    vi.useFakeTimers();
    mockHttpClient = {
      post: vi.fn(),
    };
    mockAudioService = {
      registerUser: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Waitlist],
      providers: [
        { provide: HttpClient, useValue: mockHttpClient },
        { provide: AudioService, useValue: mockAudioService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Waitlist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set generic error message on HTTP error and not leak raw backend error details', () => {
    const errorSubject = new Subject();
    mockHttpClient.post.mockReturnValue(errorSubject);

    component.waitlistForm.setValue({ email: 'fan@example.com' });
    component.onSubmit();
    expect(component.loading).toBe(true);

    const sensitiveBackendError = {
      status: 500,
      error: {
        error: 'Database connection failed: postgresql://admin:secret@db.internal:5432/astro',
        details: 'Stack trace: at Query.run (/app/node_modules/pg/lib/query.js:12)',
      },
      message: 'Http failure response for /api/subscribe: 500 Internal Server Error',
    };

    errorSubject.error(sensitiveBackendError);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const errorMsgElement = compiled.querySelector('.error-msg');

    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('postgres');
    expect(component.errorMessage).not.toContain('Stack trace');
    expect(component.errorMessage).not.toContain('Http failure response');
    expect(errorMsgElement?.textContent).toContain(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
  });

  it('should handle successful subscription and reset state', () => {
    const responseSubject = new Subject();
    mockHttpClient.post.mockReturnValue(responseSubject);

    component.waitlistForm.setValue({ email: 'fan@example.com' });
    fixture.detectChanges();

    component.onSubmit();
    expect(component.loading).toBe(true);

    responseSubject.next({ message: 'Success' });
    responseSubject.complete();

    expect(component.success).toBe(true);
    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe('');
    expect(mockAudioService.registerUser).toHaveBeenCalled();

    vi.advanceTimersByTime(4000);
    expect(component.success).toBe(false);
  });
});
