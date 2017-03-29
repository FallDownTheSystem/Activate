import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessFormsComponent } from './access-forms.component';

describe('AccessFormsComponent', () => {
  let component: AccessFormsComponent;
  let fixture: ComponentFixture<AccessFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
