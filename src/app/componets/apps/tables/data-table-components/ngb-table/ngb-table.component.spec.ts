import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbTableComponent } from './ngb-table.component';

describe('NgbTableComponent', () => {
  let component: NgbTableComponent;
  let fixture: ComponentFixture<NgbTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgbTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NgbTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
