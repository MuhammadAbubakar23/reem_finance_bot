import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotMonitoringComponent } from './chat-history.component';

describe('BotMonitoringComponent', () => {
  let component: BotMonitoringComponent;
  let fixture: ComponentFixture<BotMonitoringComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BotMonitoringComponent]
    });
    fixture = TestBed.createComponent(BotMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
