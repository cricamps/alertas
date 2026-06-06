import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  template: `
    <div *ngIf="isIframe; else content" style="display:none"></div>
    <ng-template #content>
      <app-navbar></app-navbar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </ng-template>
  `
})
export class AppComponent implements OnInit, OnDestroy {
  isIframe = false;
  private destroy$ = new Subject<void>();

  constructor(
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService
  ) {}

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;
    this.msalService.initialize().subscribe();

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((s: InteractionStatus) => s === InteractionStatus.None),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const accounts = this.msalService.instance.getAllAccounts();
        if (accounts.length === 0) {
          this.msalService.loginRedirect();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
