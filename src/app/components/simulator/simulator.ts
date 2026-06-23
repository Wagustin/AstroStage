import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { AudioService } from '../../services/audio.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-simulator',
  standalone: true,
  imports: [],
  templateUrl: './simulator.html',
  styleUrl: './simulator.css',
})
export class Simulator implements OnInit, AfterViewInit, OnDestroy {
  activeTab: 'vr' | 'ar' = 'vr';
  isMuted = true;
  volume = 0.5;
  private muteSub!: Subscription;

  @ViewChild('experienceVideo') videoRef!: ElementRef<HTMLVideoElement>;

  constructor(private audioService: AudioService) {}

  ngOnInit() {
    this.muteSub = this.audioService.isGlobalMuted$.subscribe((shouldMute) => {
      if (shouldMute) {
        this.isMuted = true;
        if (this.videoRef?.nativeElement) {
          this.videoRef.nativeElement.muted = true;
        }
      }
    });
  }

  ngAfterViewInit() {
    this.setupIntersectionObserver();
  }

  ngOnDestroy() {
    if (this.muteSub) {
      this.muteSub.unsubscribe();
    }
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private observer: IntersectionObserver | null = null;

  private setupIntersectionObserver() {
    if (this.observer) {
      this.observer.disconnect();
    }
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.syncVideo();
        } else {
          if (this.videoRef?.nativeElement) {
            this.videoRef.nativeElement.pause();
          }
        }
      });
    }, { threshold: 0.1 });

    if (this.videoRef?.nativeElement) {
      this.observer.observe(this.videoRef.nativeElement);
    }
  }

  setTab(tab: 'vr' | 'ar') {
    this.activeTab = tab;
    // Let Angular render the new view, then setup the observer for the new video element
    setTimeout(() => this.setupIntersectionObserver(), 0);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.videoRef?.nativeElement) {
      this.videoRef.nativeElement.muted = this.isMuted;
    }
  }

  onVolumeChange(event: Event) {
    const val = +(event.target as HTMLInputElement).value;
    this.volume = val;
    if (this.videoRef?.nativeElement) {
      this.videoRef.nativeElement.volume = val;
      // If user drags volume up from 0, unmute
      if (val > 0 && this.isMuted) {
        this.isMuted = false;
        this.videoRef.nativeElement.muted = false;
      }
      if (val === 0) {
        this.isMuted = true;
        this.videoRef.nativeElement.muted = true;
      }
    }
  }

  private syncVideo() {
    if (this.videoRef?.nativeElement) {
      const v = this.videoRef.nativeElement;
      v.muted = this.isMuted;
      v.volume = this.volume;
      v.play().catch(() => {}); // autoplay may be blocked without muted
    }
  }
}

