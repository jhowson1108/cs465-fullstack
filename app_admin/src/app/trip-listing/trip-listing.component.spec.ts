import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { TripListingComponent } from './trip-listing.component';
import { TripDataService } from '../services/trip-data.service';
import { trips } from '../data/trips';

describe('TripListingComponent', () => {
  let component: TripListingComponent;
  let fixture: ComponentFixture<TripListingComponent>;

  const mockTripDataService = {
    getTrips: () => of(trips),
    deleteTrip: () => of({})
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripListingComponent],
      providers: [provideRouter([])]
    })
      .overrideComponent(TripListingComponent, {
        set: { providers: [{ provide: TripDataService, useValue: mockTripDataService }] }
      })
      .compileComponents();

    fixture = TestBed.createComponent(TripListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the mock trips', () => {
    expect(component.trips.length).toEqual(trips.length);
    expect(component.message).toEqual('There are ' + trips.length + ' trips available.');
  });

  it('should render a trip card for each trip', () => {
    const cards = fixture.nativeElement.querySelectorAll('app-trip-card');
    expect(cards.length).toEqual(trips.length);
  });

  it('should filter trips by search text', () => {
    component.searchText = 'gale';
    expect(component.filteredTrips.map(t => t.code)).toEqual(['GALR210214']);
  });

  it('should filter trips by max price', () => {
    component.maxPrice = 1000;
    expect(component.filteredTrips.every(t => Number(t.perPerson) <= 1000)).toBe(true);
    expect(component.filteredTrips.length).toBeGreaterThan(0);
  });

  it('should return no trips when nothing matches', () => {
    component.searchText = 'no such place';
    expect(component.filteredTrips.length).toEqual(0);
  });

  it('should hide the Add Trip button when logged out', () => {
    const buttons = [...fixture.nativeElement.querySelectorAll('button')] as HTMLElement[];
    expect(buttons.some(b => b.textContent?.includes('Add Trip'))).toBe(false);
  });
});
