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

  @ViewChild('vrVideo') vrVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('arVideo') arVideo!: ElementRef<HTMLVideoElement>;

  private observer: IntersectionObserver | null = null;
  private isVisible = false;

  constructor(private audioService: AudioService, private el: ElementRef) {}

  ngOnInit() {
    this.muteSub = this.audioService.isGlobalMuted$.subscribe((shouldMute) => {
      if (shouldMute) {
        this.isMuted = true;
        this.applyMuteState();
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

  private setupIntersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.isVisible = entry.isIntersecting;
        if (this.isVisible) {
          this.syncVideo();
        } else {
          // Pause videos when scrolled away to save CPU
          if (this.vrVideo?.nativeElement) this.vrVideo.nativeElement.pause();
          if (this.arVideo?.nativeElement) this.arVideo.nativeElement.pause();
        }
      });
    }, { rootMargin: '400px', threshold: 0 });

    this.observer.observe(this.el.nativeElement);
  }

  setTab(tab: 'vr' | 'ar') {
    this.activeTab = tab;
    this.syncVideo();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.applyMuteState();
  }

  onVolumeChange(event: Event) {
    const val = +(event.target as HTMLInputElement).value;
    this.volume = val;
    
    // If user drags volume up from 0, unmute
    if (val > 0 && this.isMuted) {
      this.isMuted = false;
    }
    if (val === 0) {
      this.isMuted = true;
    }
    
    this.applyVolumeState();
  }

  private applyMuteState() {
    if (this.vrVideo?.nativeElement) {
      this.vrVideo.nativeElement.muted = this.isMuted;
    }
    if (this.arVideo?.nativeElement) {
      this.arVideo.nativeElement.muted = this.isMuted;
    }
  }

  private applyVolumeState() {
    this.applyMuteState();
    if (this.vrVideo?.nativeElement) {
      this.vrVideo.nativeElement.volume = this.volume;
    }
    if (this.arVideo?.nativeElement) {
      this.arVideo.nativeElement.volume = this.volume;
    }
  }

  private syncVideo() {
    this.applyVolumeState();
    
    const vrNode = this.vrVideo?.nativeElement;
    const arNode = this.arVideo?.nativeElement;
    
    if (this.activeTab === 'vr') {
      if (arNode) arNode.pause();
      if (vrNode && this.isVisible) vrNode.play().catch(() => {});
    } else {
      if (vrNode) vrNode.pause();
      if (arNode && this.isVisible) arNode.play().catch(() => {});
    }
  }
}

