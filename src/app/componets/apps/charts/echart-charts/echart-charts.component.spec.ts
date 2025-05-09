import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EchartChartsComponent } from './echart-charts.component';

describe('EchartChartsComponent', () => {
  let component: EchartChartsComponent;
  let fixture: ComponentFixture<EchartChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EchartChartsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EchartChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
