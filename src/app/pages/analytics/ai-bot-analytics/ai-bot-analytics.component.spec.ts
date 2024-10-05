import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiBotAnalyticsComponent } from './ai-bot-analytics.component';

describe('AiBotAnalyticsComponent', () => {
  let component: AiBotAnalyticsComponent;
  let fixture: ComponentFixture<AiBotAnalyticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AiBotAnalyticsComponent]
    });
    fixture = TestBed.createComponent(AiBotAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
