import { Component, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-alquiler',
  standalone: true,
  imports: [],
  templateUrl: './alquiler.html',
  styleUrl: './alquiler.css',
})
export class Alquiler {
  constructor(private el: ElementRef) {}

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const x = event.clientX;
    const y = event.clientY;
    this.el.nativeElement.style.setProperty('--mouse-x', `${x}px`);
    this.el.nativeElement.style.setProperty('--mouse-y', `${y}px`);
  }
}
