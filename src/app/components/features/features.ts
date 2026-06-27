import { Component, ElementRef, ViewChild, HostListener, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-features',
  imports: [CommonModule],
  templateUrl: './features.html',
  styleUrl: './features.css',
})
export class Features implements AfterViewInit, OnDestroy {
  @ViewChild('scrollVideoDark') videoDark!: ElementRef<HTMLVideoElement>;
  @ViewChild('scrollVideoLight') videoLight!: ElementRef<HTMLVideoElement>;
  @ViewChild('featuresSection') sectionElement!: ElementRef<HTMLElement>;

  activeFeature = 1;
  
  // Lerp State
  targetProgress = 0;
  currentProgress = 0;
  animationFrameId: number | null = null;

  ngAfterViewInit() {
    if (this.videoDark) {
      this.videoDark.nativeElement.load();
      this.videoDark.nativeElement.pause();
    }
    if (this.videoLight) {
      this.videoLight.nativeElement.load();
      this.videoLight.nativeElement.pause();
    }

    // Start Lerp rendering loop
    this.renderLoop();
  }

  ngOnDestroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  renderLoop = () => {
    // --- MOMENTUM SCRUBBING (Rueda con impulso) ---
    // Smooth, gradual deceleration with no sudden stops
    const lerpFactor = 0.05;
    this.currentProgress += (this.targetProgress - this.currentProgress) * lerpFactor;

    // Snap only at the extremely microscopic level to prevent infinite calculation
    if (Math.abs(this.targetProgress - this.currentProgress) < 0.0001) {
      this.currentProgress = this.targetProgress;
    }

    const vidDark = this.videoDark?.nativeElement;
    const vidLight = this.videoLight?.nativeElement;

    if (vidDark && !isNaN(vidDark.duration) && vidDark.duration > 0) {
      if (!vidDark.paused) vidDark.pause();
      const targetTime = Math.min(this.currentProgress, 0.99) * vidDark.duration;
      
      // Update only if difference is significant to save rendering thread in Chrome
      if (Math.abs(vidDark.currentTime - targetTime) > 0.015) {
        vidDark.currentTime = targetTime;
        if (vidLight) {
          vidLight.currentTime = targetTime;
        }
      }
    }

    // Update the UI state based on current (interpolated) progress
    // Balanced the thresholds: 0.33 and 0.66 so each slide gets exactly 1/3 of the scroll.
    if (this.currentProgress < 0.33) {
      this.activeFeature = 1;
    } else if (this.currentProgress < 0.66) {
      this.activeFeature = 2;
    } else if (this.currentProgress >= 0.66 && this.currentProgress <= 1) {
      this.activeFeature = 3;
    } else {
      this.activeFeature = 0;
    }

    // Edge case for hiding text when scrolled totally above
    if (this.currentProgress === 0 && this.targetProgress === 0 && this.sectionElement) {
      const rect = this.sectionElement.nativeElement.getBoundingClientRect();
      if (rect.top > window.innerHeight) {
        this.activeFeature = 0;
      }
    }

    this.animationFrameId = requestAnimationFrame(this.renderLoop);
  }

  @HostListener('window:scroll')
  onScroll() {
    if (!this.sectionElement) return;

    const section = this.sectionElement.nativeElement;
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    const scrollableDistance = section.offsetHeight - windowHeight;
    const scrolled = -rect.top;

    let rawProgress = scrolled / scrollableDistance;
    this.targetProgress = Math.max(0, Math.min(1, rawProgress));
  }
}
