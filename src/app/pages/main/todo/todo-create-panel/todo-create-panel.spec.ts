import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoCreatePanel } from './todo-create-panel';

describe('TodoContents', () => {
  let component: TodoCreatePanel;
  let fixture: ComponentFixture<TodoCreatePanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoCreatePanel],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoCreatePanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
