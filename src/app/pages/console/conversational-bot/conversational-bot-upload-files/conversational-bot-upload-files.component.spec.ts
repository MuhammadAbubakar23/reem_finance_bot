import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationalBotUploadFilesComponent } from './conversational-bot-upload-files.component';

describe('ConversationalBotUploadFilesComponent', () => {
  let component: ConversationalBotUploadFilesComponent;
  let fixture: ComponentFixture<ConversationalBotUploadFilesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConversationalBotUploadFilesComponent]
    });
    fixture = TestBed.createComponent(ConversationalBotUploadFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
