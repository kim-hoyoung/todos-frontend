import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoDetailPanel } from './todo-detail-panel';

describe('TodoDetails', () => {
  let component: TodoDetailPanel;
  let fixture: ComponentFixture<TodoDetailPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoDetailPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoDetailPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
