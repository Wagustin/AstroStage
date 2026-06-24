import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-legal',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './legal.html',
  styleUrl: './legal.css'
})
export class Legal {
  toggleTheme() {
    document.body.classList.toggle('light-theme');
  }
}
