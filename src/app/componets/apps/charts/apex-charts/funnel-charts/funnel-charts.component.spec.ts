import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunnelChartsComponent } from './funnel-charts.component';

describe('FunnelChartsComponent', () => {
  let component: FunnelChartsComponent;
  let fixture: ComponentFixture<FunnelChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FunnelChartsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FunnelChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
