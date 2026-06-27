import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-legal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './legal.html',
  styleUrl: './legal.css'
})
export class Legal {
  activeTab: string = 'terminos';
  isSidebarOpen: boolean = false;

  constructor(public audioService: AudioService) {
    const hash = window.location.hash.replace('#', '');
    if (['terminos', 'privacidad', 'cookies', 'reclamaciones'].includes(hash)) {
      this.activeTab = hash;
    }
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.isSidebarOpen = false;
    window.history.replaceState(null, '', `/legal#${tab}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleTheme() {
    document.body.classList.toggle('light-theme');
  }
}
