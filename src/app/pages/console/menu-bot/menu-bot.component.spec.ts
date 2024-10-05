import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuBotComponent } from './menu-bot.component';

describe('MenuBotComponent', () => {
  let component: MenuBotComponent;
  let fixture: ComponentFixture<MenuBotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuBotComponent]
    });
    fixture = TestBed.createComponent(MenuBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
