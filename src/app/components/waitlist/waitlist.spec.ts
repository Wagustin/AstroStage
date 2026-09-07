import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Waitlist } from './waitlist';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AudioService } from '../../services/audio.service';
import { vi } from 'vitest';

describe('Waitlist Component', () => {
  let component: Waitlist;
  let fixture: ComponentFixture<Waitlist>;
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle successful subscription', () => {
    component.waitlistForm.controls['email'].setValue('test@example.com');
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

  it('should show generic error message and NOT expose internal error details when HTTP request fails', () => {
    component.waitlistForm.controls['email'].setValue('test@example.com');
    component.onSubmit();

    const req = httpMock.expectOne('/api/subscribe');
    req.flush(
      { error: 'Sensitive database failure details', details: 'Secret connection string' },
      { status: 500, statusText: 'Internal Server Error' },
    );

    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('Sensitive database failure details');
    expect(component.errorMessage).not.toContain('Secret connection string');
  });
});
