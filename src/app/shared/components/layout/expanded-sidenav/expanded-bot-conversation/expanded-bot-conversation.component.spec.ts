import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandedBotConversationComponent } from './expanded-bot-conversation.component';

describe('ExpandedBotConversationComponent', () => {
  let component: ExpandedBotConversationComponent;
  let fixture: ComponentFixture<ExpandedBotConversationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpandedBotConversationComponent]
    });
    fixture = TestBed.createComponent(ExpandedBotConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
