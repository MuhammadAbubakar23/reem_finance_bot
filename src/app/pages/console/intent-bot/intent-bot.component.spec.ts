import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntentBotComponent } from './intent-bot.component';

describe('IntentBotComponent', () => {
  let component: IntentBotComponent;
  let fixture: ComponentFixture<IntentBotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IntentBotComponent]
    });
    fixture = TestBed.createComponent(IntentBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
