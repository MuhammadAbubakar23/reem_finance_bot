import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandedHumanInteractionsComponent } from './expanded-human-interactions.component';

describe('ExpandedHumanInteractionsComponent', () => {
  let component: ExpandedHumanInteractionsComponent;
  let fixture: ComponentFixture<ExpandedHumanInteractionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpandedHumanInteractionsComponent]
    });
    fixture = TestBed.createComponent(ExpandedHumanInteractionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
