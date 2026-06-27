import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
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
  private scrollListener!: () => void;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit() {
    if (this.videoDark) {
      this.videoDark.nativeElement.load();
      this.videoDark.nativeElement.pause();
    }
    if (this.videoLight) {
      this.videoLight.nativeElement.load();
      this.videoLight.nativeElement.pause();
    }

    this.ngZone.runOutsideAngular(() => {
      this.scrollListener = () => {
        if (!this.sectionElement) return;

        const section = this.sectionElement.nativeElement;
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        const scrollableDistance = section.offsetHeight - windowHeight;
        const scrolled = -rect.top;

        let rawProgress = scrolled / scrollableDistance;
        this.targetProgress = Math.max(0, Math.min(1, rawProgress));
      };
      
      window.addEventListener('scroll', this.scrollListener, { passive: true });
      this.renderLoop();
    });
  }

  ngOnDestroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
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
    const isLight = document.body.classList.contains('light-theme');
    const activeVid = isLight ? vidLight : vidDark;

    if (activeVid && !isNaN(activeVid.duration) && activeVid.duration > 0) {
      if (!activeVid.paused) activeVid.pause();
      const rawTargetTime = Math.min(this.currentProgress, 0.99) * activeVid.duration;
      
      // CHROME OPTIMIZATION: Snap to discrete 30fps frames (0.0333s)
      // This prevents Chrome from attempting to sub-frame interpolate 60 times a second
      const fps = 30;
      const frameTime = 1 / fps;
      const targetTime = Math.round(rawTargetTime / frameTime) * frameTime;
      
      // Update only if difference crosses a frame boundary
      if (Math.abs(activeVid.currentTime - targetTime) >= frameTime - 0.001) {
        activeVid.currentTime = targetTime;
      }
    }

    // Update the UI state based on current (interpolated) progress
    // Balanced the thresholds: 0.33 and 0.66 so each slide gets exactly 1/3 of the scroll.
    let newFeature = this.activeFeature;
    if (this.currentProgress < 0.33) {
      newFeature = 1;
    } else if (this.currentProgress < 0.66) {
      newFeature = 2;
    } else if (this.currentProgress >= 0.66 && this.currentProgress <= 1) {
      newFeature = 3;
    } else {
      newFeature = 0;
    }

    // Edge case for hiding text when scrolled totally above
    if (this.currentProgress === 0 && this.targetProgress === 0 && this.sectionElement) {
      const rect = this.sectionElement.nativeElement.getBoundingClientRect();
      if (rect.top > window.innerHeight) {
        newFeature = 0;
      }
    }
    
    if (this.activeFeature !== newFeature) {
      this.ngZone.run(() => {
        this.activeFeature = newFeature;
      });
    }

    this.animationFrameId = requestAnimationFrame(this.renderLoop);
  }
}
