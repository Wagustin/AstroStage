import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Waitlist } from './waitlist';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { AudioService } from '../../services/audio.service';

describe('Waitlist', () => {
  let component: Waitlist;
  let fixture: ComponentFixture<Waitlist>;
  let httpClientSpy: { post: ReturnType<typeof vi.fn> };
  let audioServiceSpy: { registerUser: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    httpClientSpy = { post: vi.fn() };
    audioServiceSpy = { registerUser: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Waitlist],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: AudioService, useValue: audioServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Waitlist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create waitlist component', () => {
    expect(component).toBeTruthy();
  });

  it('should handle successful subscription', () => {
    httpClientSpy.post.mockReturnValue(of({ message: 'Success' }));
    component.waitlistForm.controls['email'].setValue('test@example.com');

    component.onSubmit();

    expect(httpClientSpy.post).toHaveBeenCalledWith('/api/subscribe', {
      email: 'test@example.com',
    });
    expect(component.success).toBe(true);
    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe('');
    expect(audioServiceSpy.registerUser).toHaveBeenCalled();
  });

  it('should set generic error message and NOT expose backend error details when HTTP request fails', () => {
    const backendErrorResponse = {
      error: {
        error: 'Database Connection Failed',
        details: 'psql: FATAL: password authentication failed for user "postgres"',
      },
      message: 'Http failure response for /api/subscribe: 500 Internal Server Error',
    };

    httpClientSpy.post.mockReturnValue(throwError(() => backendErrorResponse));
    component.waitlistForm.controls['email'].setValue('test@example.com');

    component.onSubmit();

    expect(component.loading).toBe(false);
    expect(component.success).toBe(false);
    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('Database Connection Failed');
    expect(component.errorMessage).not.toContain('postgres');
    expect(component.errorMessage).not.toContain('Http failure response');
  });
});
