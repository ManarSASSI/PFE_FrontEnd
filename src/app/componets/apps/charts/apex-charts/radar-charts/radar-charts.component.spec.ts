import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadarChartsComponent } from './radar-charts.component';

describe('RadarChartsComponent', () => {
  let component: RadarChartsComponent;
  let fixture: ComponentFixture<RadarChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadarChartsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RadarChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
