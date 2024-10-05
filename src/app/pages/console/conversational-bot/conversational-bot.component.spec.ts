import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationalBotComponent } from './conversational-bot.component';

describe('ConversationalBotComponent', () => {
  let component: ConversationalBotComponent;
  let fixture: ComponentFixture<ConversationalBotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConversationalBotComponent]
    });
    fixture = TestBed.createComponent(ConversationalBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
