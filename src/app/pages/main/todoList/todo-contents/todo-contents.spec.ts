import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoContents } from './todo-contents';

describe('TodoContents', () => {
  let component: TodoContents;
  let fixture: ComponentFixture<TodoContents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoContents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoContents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
