import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineChartsComponent } from './timeline-charts.component';

describe('TimelineChartsComponent', () => {
  let component: TimelineChartsComponent;
  let fixture: ComponentFixture<TimelineChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineChartsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimelineChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
