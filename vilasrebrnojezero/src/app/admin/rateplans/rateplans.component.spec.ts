import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateplansComponent } from './rateplans.component';

describe('RateplansComponent', () => {
  let component: RateplansComponent;
  let fixture: ComponentFixture<RateplansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateplansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateplansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
