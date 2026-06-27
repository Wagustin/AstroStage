import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private backgroundAudio: HTMLAudioElement | null = null;
  public isMuted = new BehaviorSubject<boolean>(false);
  
  // Observable that other components (like Simulator) can subscribe to
  isGlobalMuted$ = this.isMuted.asObservable();

  toggleMute() {
    const nextState = !this.isMuted.value;
    this.isMuted.next(nextState);
    if (this.backgroundAudio) {
      this.backgroundAudio.muted = nextState;
    }
  }

  private hasStartedPlaying = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.initBackgroundAudio();
      this.setupInteractionListener();
    }
  }

  private initBackgroundAudio() {
    this.backgroundAudio = new Audio('assets/nebula.mp3');
    this.backgroundAudio.loop = true;
    this.backgroundAudio.volume = 0.09; // Reduced by another 50%
    console.log('[AudioService] Audio initialized, attempting immediate play...');
    
    // Attempt immediate playback (often blocked by browsers)
    this.backgroundAudio.play().then(() => {
      console.log('[AudioService] Immediate autoplay succeeded!');
      this.hasStartedPlaying = true;
    }).catch(err => {
      console.warn('[AudioService] Immediate autoplay blocked by browser policy. Waiting for user interaction...', err);
    });
  }

  private setupInteractionListener() {
    // Autoplay policy requires user interaction before playing audio
    const startAudio = () => {
      if (!this.hasStartedPlaying && this.backgroundAudio) {
        console.log('[AudioService] Interaction detected, attempting to play...');
        
        this.backgroundAudio.play().then(() => {
          console.log('[AudioService] Successfully started playing background audio.');
          this.hasStartedPlaying = true;
        }).catch(err => {
          console.error('[AudioService] Audio autoplay blocked or failed:', err);
        });
        
        // Remove listeners once started
        window.removeEventListener('click', startAudio);
        window.removeEventListener('scroll', startAudio);
        window.removeEventListener('touchstart', startAudio);
        window.removeEventListener('keydown', startAudio);
      }
    };

    window.addEventListener('click', startAudio);
    window.addEventListener('scroll', startAudio, { passive: true });
    window.addEventListener('touchstart', startAudio, { passive: true });
    window.addEventListener('keydown', startAudio, { passive: true });
  }

  registerUser() {
    // Increase volume slightly but not too loud
    if (this.backgroundAudio) {
      // Fade in effect for volume increase
      let vol = this.backgroundAudio.volume;
      const targetVol = 0.5; // Restored to 0.5 as requested
      const fadeInterval = setInterval(() => {
        if (vol < targetVol) {
          vol += 0.05;
          this.backgroundAudio!.volume = Math.min(vol, targetVol);
        } else {
          clearInterval(fadeInterval);
        }
      }, 200);
      
      // If it hasn't started playing yet due to no interaction, force it to start
      if (!this.hasStartedPlaying) {
        this.backgroundAudio.play().catch(e => console.log(e));
        this.hasStartedPlaying = true;
      }
    }

    // Tell other components to mute their videos
    this.isMuted.next(true);
  }
}
