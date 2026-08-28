import { Component, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-waitlist',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './waitlist.html',
  styleUrl: './waitlist.css',
})
export class Waitlist {
  waitlistForm: FormGroup;
  submitted = false;
  success = false;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private el: ElementRef,
    private audioService: AudioService,
  ) {
    this.waitlistForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const x = event.clientX;
    const y = event.clientY;
    this.el.nativeElement.style.setProperty('--mouse-x', `${x}px`);
    this.el.nativeElement.style.setProperty('--mouse-y', `${y}px`);
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.waitlistForm.valid) {
      this.loading = true;
      const email = this.waitlistForm.value.email;

      this.http.post('/api/subscribe', { email }).subscribe({
        next: () => {
          this.success = true;
          this.waitlistForm.reset();
          this.submitted = false;
          this.loading = false;

          this.audioService.registerUser();

          setTimeout(() => {
            this.success = false;
          }, 4000);
        },
        error: (err) => {
          console.error('Error suscribiendo:', err);
          // Security: Display a generic error message to avoid exposing backend implementation details or raw error responses to end users.
          this.errorMessage =
            'Hubo un problema al intentar unirte a la lista. Por favor, intenta de nuevo.';
          this.loading = false;
        },
      });
    }
  }
}
