import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {ThemeService} from '@app/services/theme.service';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {heroMoonSolid, heroSunSolid} from '@ng-icons/heroicons/solid';

@Component({
  selector: 'app-nav-bar',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgIcon
  ],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
  viewProviders: [    provideIcons({ heroMoonSolid, heroSunSolid })],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavBar {
  readonly themeService = inject(ThemeService);

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
