import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxplotChartsComponent } from './boxplot-charts.component';

describe('BoxplotChartsComponent', () => {
  let component: BoxplotChartsComponent;
  let fixture: ComponentFixture<BoxplotChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoxplotChartsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoxplotChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
