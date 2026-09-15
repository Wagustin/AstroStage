import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Waitlist } from './waitlist';
import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest';

describe('Waitlist Component Error Handling', () => {
  let fixture: ComponentFixture<Waitlist>;
  let component: Waitlist;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Waitlist],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Waitlist);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should display generic error message when endpoint returns error details', () => {
    component.waitlistForm.setValue({ email: 'test@example.com' });
    component.onSubmit();

    const req = httpMock.expectOne('/api/subscribe');
    expect(req.request.method).toBe('POST');

    req.flush(
      {
        error: 'Sensitive backend internal details',
        details: 'Database connection failed at 10.0.0.1',
      },
      { status: 500, statusText: 'Internal Server Error' },
    );

    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe(
      'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.',
    );
    expect(component.errorMessage).not.toContain('Sensitive backend internal details');
    expect(component.errorMessage).not.toContain('Database connection failed');
  });
});
