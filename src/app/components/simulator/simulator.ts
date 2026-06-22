import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-simulator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './simulator.html',
  styleUrl: './simulator.css',
})
export class Simulator {
  activeTab: 'vr' | 'ar' = 'vr';

  setTab(tab: 'vr' | 'ar') {
    this.activeTab = tab;
  }
}
