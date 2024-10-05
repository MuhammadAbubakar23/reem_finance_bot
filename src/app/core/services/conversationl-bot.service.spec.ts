import { TestBed } from '@angular/core/testing';

import { ConversationlBotService } from './conversationl-bot.service';

describe('ConversationlBotService', () => {
  let service: ConversationlBotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConversationlBotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
