import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandedAnalyticsComponent } from './expanded-analytics.component';

describe('ExpandedAnalyticsComponent', () => {
  let component: ExpandedAnalyticsComponent;
  let fixture: ComponentFixture<ExpandedAnalyticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpandedAnalyticsComponent]
    });
    fixture = TestBed.createComponent(ExpandedAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
