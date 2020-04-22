import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditOrganizationComponent } from './a-e-organization.component';

describe('AEOrganizationComponent', () => {
  let component: AddEditOrganizationComponent;
  let fixture: ComponentFixture<AddEditOrganizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditOrganizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
