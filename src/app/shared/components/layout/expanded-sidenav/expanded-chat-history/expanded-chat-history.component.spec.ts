import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandedBotEscalationComponent } from './expanded-chat-history.component';

describe('ExpandedBotEscalationComponent', () => {
  let component: ExpandedBotEscalationComponent;
  let fixture: ComponentFixture<ExpandedBotEscalationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpandedBotEscalationComponent]
    });
    fixture = TestBed.createComponent(ExpandedBotEscalationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
