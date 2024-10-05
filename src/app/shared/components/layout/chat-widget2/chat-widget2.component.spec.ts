import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatWidget2Component } from './chat-widget2.component';

describe('ChatWidget2Component', () => {
  let component: ChatWidget2Component;
  let fixture: ComponentFixture<ChatWidget2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatWidget2Component]
    });
    fixture = TestBed.createComponent(ChatWidget2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
