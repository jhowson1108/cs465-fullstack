import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { TripCardComponent } from './trip-card.component';
import { TripDataService } from '../services/trip-data.service';
import { trips } from '../data/trips';

describe('TripCardComponent', () => {
  let component: TripCardComponent;
  let fixture: ComponentFixture<TripCardComponent>;
  let deletedCode = '';

  const mockTripDataService = {
    deleteTrip: (code: string) => {
      deletedCode = code;
      return of({ message: 'Trip ' + code + ' deleted' });
    }
  };

  beforeEach(async () => {
    deletedCode = '';
    await TestBed.configureTestingModule({
      imports: [TripCardComponent],
      providers: [
        provideRouter([]),
        { provide: TripDataService, useValue: mockTripDataService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TripCardComponent);
    component = fixture.componentInstance;
    component.trip = trips[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the trip name and price', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.card-header')?.textContent).toContain(trips[0].name);
    expect(el.textContent).toContain('$799.00');
  });

  it('should store the trip code when editing', () => {
    component.editTrip(trips[0] as any);
    expect(localStorage.getItem('tripCode')).toEqual(trips[0].code);
  });

  it('should delete the trip and emit tripDeleted after confirm', () => {
    let emitted = false;
    component.tripDeleted.subscribe(() => emitted = true);
    window.confirm = () => true;
    component.deleteTrip(trips[0] as any);
    expect(deletedCode).toEqual(trips[0].code);
    expect(emitted).toBe(true);
  });

  it('should not delete when confirm is cancelled', () => {
    window.confirm = () => false;
    component.deleteTrip(trips[0] as any);
    expect(deletedCode).toEqual('');
  });
});
