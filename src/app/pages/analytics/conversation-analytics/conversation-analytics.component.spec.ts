import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationAnalyticsComponent } from './conversation-analytics.component';

describe('ConversationAnalyticsComponent', () => {
  let component: ConversationAnalyticsComponent;
  let fixture: ComponentFixture<ConversationAnalyticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConversationAnalyticsComponent]
    });
    fixture = TestBed.createComponent(ConversationAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
