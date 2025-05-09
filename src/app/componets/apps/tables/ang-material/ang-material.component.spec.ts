import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularMaterialTableComponent } from './ang-material.component';


describe('AngularMaterialTableComponent', () => {
  let component: AngularMaterialTableComponent;
  let fixture: ComponentFixture<AngularMaterialTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularMaterialTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AngularMaterialTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
