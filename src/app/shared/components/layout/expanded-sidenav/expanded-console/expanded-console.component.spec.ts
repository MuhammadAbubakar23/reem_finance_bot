import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandedConsoleComponent } from './expanded-console.component';

describe('ExpandedConsoleComponent', () => {
  let component: ExpandedConsoleComponent;
  let fixture: ComponentFixture<ExpandedConsoleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpandedConsoleComponent]
    });
    fixture = TestBed.createComponent(ExpandedConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
