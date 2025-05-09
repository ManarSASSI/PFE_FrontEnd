import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatmapChartsComponent } from './heatmap-charts.component';

describe('HeatmapChartsComponent', () => {
  let component: HeatmapChartsComponent;
  let fixture: ComponentFixture<HeatmapChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeatmapChartsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeatmapChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
