import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuChatWidgetComponent } from './menu-chat-widget.component';

describe('MenuChatWidgetComponent', () => {
  let component: MenuChatWidgetComponent;
  let fixture: ComponentFixture<MenuChatWidgetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuChatWidgetComponent]
    });
    fixture = TestBed.createComponent(MenuChatWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
