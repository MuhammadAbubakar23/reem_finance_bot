import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentimentsAndTagsComponent } from './sentiments-and-tags.component';

describe('SentimentsAndTagsComponent', () => {
  let component: SentimentsAndTagsComponent;
  let fixture: ComponentFixture<SentimentsAndTagsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SentimentsAndTagsComponent]
    });
    fixture = TestBed.createComponent(SentimentsAndTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
