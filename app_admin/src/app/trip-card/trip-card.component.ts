import { ChangeDetectionStrategy, Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trip';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-trip-card',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CommonModule],
  templateUrl: './trip-card.component.html',
  styleUrl: './trip-card.component.css'
})
export class TripCardComponent implements OnInit {

  @Input('trip') trip: any;
  @Output() tripDeleted = new EventEmitter<void>();

  constructor(
    private router: Router,
    private tripDataService: TripDataService,
    private authenticationService: AuthenticationService
  ) {}

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  ngOnInit(): void {}

  public editTrip(trip: Trip) {
    localStorage.removeItem('tripCode');
    localStorage.setItem('tripCode', trip.code);
    this.router.navigate(['edit-trip']);
  }

  public deleteTrip(trip: Trip) {
    if (!confirm('Delete trip ' + trip.name + ' (' + trip.code + ')?')) {
      return;
    }
    this.tripDataService.deleteTrip(trip.code)
      .subscribe({
        next: () => {
          this.tripDeleted.emit();
        },
        error: (error: any) => {
          console.log('Error: ' + error);
        }
      });
  }
}
