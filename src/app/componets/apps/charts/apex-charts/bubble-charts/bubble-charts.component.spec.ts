import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BubbleChartsComponent } from './bubble-charts.component';

describe('BubbleChartsComponent', () => {
  let component: BubbleChartsComponent;
  let fixture: ComponentFixture<BubbleChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BubbleChartsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BubbleChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
