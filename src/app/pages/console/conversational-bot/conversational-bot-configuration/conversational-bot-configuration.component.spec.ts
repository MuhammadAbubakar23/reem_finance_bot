import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationalBotConfigurationComponent } from './conversational-bot-configuration.component';

describe('ConversationalBotConfigurationComponent', () => {
  let component: ConversationalBotConfigurationComponent;
  let fixture: ComponentFixture<ConversationalBotConfigurationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConversationalBotConfigurationComponent]
    });
    fixture = TestBed.createComponent(ConversationalBotConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
