import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotKpiComponent } from './bot-kpi.component';

describe('BotKpiComponent', () => {
  let component: BotKpiComponent;
  let fixture: ComponentFixture<BotKpiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BotKpiComponent]
    });
    fixture = TestBed.createComponent(BotKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
