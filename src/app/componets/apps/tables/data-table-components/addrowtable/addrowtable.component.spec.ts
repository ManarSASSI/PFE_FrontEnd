import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddrowtableComponent } from './addrowtable.component';

describe('AddrowtableComponent', () => {
  let component: AddrowtableComponent;
  let fixture: ComponentFixture<AddrowtableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddrowtableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddrowtableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
