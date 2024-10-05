import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectChannelsComponent } from './connect-channels.component';

describe('ConnectChannelsComponent', () => {
  let component: ConnectChannelsComponent;
  let fixture: ComponentFixture<ConnectChannelsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectChannelsComponent]
    });
    fixture = TestBed.createComponent(ConnectChannelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
