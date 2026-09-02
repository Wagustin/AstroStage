import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Waitlist } from './waitlist';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

describe('Waitlist Component', () => {
  let component: Waitlist;
  let fixture: ComponentFixture<Waitlist>;
  let httpClientMock: { post: ReturnType<typeof vi.fn> };

  beforeAll(() => {
    if (!globalThis.IntersectionObserver) {
      globalThis.IntersectionObserver = class IntersectionObserver {
        constructor() {}
        disconnect() {}
        observe() {}
        unobserve() {}
        takeRecords() {
          return [];
        }
      } as unknown as typeof globalThis.IntersectionObserver;
    }
  });

  beforeEach(async () => {
    httpClientMock = {
      post: vi.fn().mockReturnValue(of({ message: 'Success' })),
    };

    await TestBed.configureTestingModule({
      imports: [Waitlist],
      providers: [{ provide: HttpClient, useValue: httpClientMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(Waitlist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display generic error message and not leak backend error details when subscribe fails', () => {
    const sensitiveBackendError = {
      error: {
        error: 'Database error: Connection timed out at /var/www/secret/db.ts',
        details: 'Secret internal state details',
      },
      message: 'Sensitive internal error message',
    };

    httpClientMock.post.mockReturnValue(throwError(() => sensitiveBackendError));

    component.waitlistForm.setValue({ email: 'test@example.com' });
    component.onSubmit();

    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('Database error');
    expect(component.errorMessage).not.toContain('Secret internal state');
    expect(component.errorMessage).not.toContain('Sensitive internal error');
  });
});
