import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { TripCardComponent } from '../trip-card/trip-card.component';
import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trip';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-trip-listing',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CommonModule, FormsModule, TripCardComponent],
  templateUrl: './trip-listing.component.html',
  styleUrl: './trip-listing.component.css',
  providers: [TripDataService]
})
export class TripListingComponent implements OnInit {

  trips!: Trip[];
  message: string = '';
  searchText: string = '';
  maxPrice: number | null = null;

  constructor(
    private tripDataService: TripDataService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    console.log('trip-listing constructor');
  }

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  // Trips matching the search box (name, resort or code) and the max price
  get filteredTrips(): Trip[] {
    if (!this.trips) {
      return [];
    }
    const text = this.searchText.trim().toLowerCase();
    return this.trips.filter(trip => {
      const matchesText = !text ||
        trip.name.toLowerCase().includes(text) ||
        trip.resort.toLowerCase().includes(text) ||
        trip.code.toLowerCase().includes(text);
      const matchesPrice = !this.maxPrice || Number(trip.perPerson) <= this.maxPrice;
      return matchesText && matchesPrice;
    });
  }

  public addTrip(): void {
    this.router.navigate(['add-trip']);
  }

  private getStuff(): void {
    this.tripDataService.getTrips()
      .subscribe({
        next: (value: any) => {
          this.trips = value;
          if (value.length > 0) {
            this.message = 'There are ' + value.length + ' trips available.';
          } else {
            this.message = 'There were no trips retrieved from the database';
          }
          console.log(this.message);
        },
        error: (error: any) => {
          console.log('Error: ' + error);
        }
      });
  }

  public onTripDeleted(): void {
    this.getStuff();
  }

  ngOnInit(): void {
    console.log('ngOnInit');
    this.getStuff();
  }
}
