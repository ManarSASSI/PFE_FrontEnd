import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolarareaChartsComponent } from './polararea-charts.component';

describe('PolarareaChartsComponent', () => {
  let component: PolarareaChartsComponent;
  let fixture: ComponentFixture<PolarareaChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolarareaChartsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PolarareaChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
