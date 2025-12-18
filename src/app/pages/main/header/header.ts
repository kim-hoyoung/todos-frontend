import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { TodoStore } from '../../../store/todo.store';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(public todoStore: TodoStore) {}

  prevDay() {
    const day = new Date(this.todoStore.selectedDate());
    day.setDate(day.getDate() - 1);
    this.todoStore.setSelectedDate(day);
  }

  nextDay() {
    const day = new Date(this.todoStore.selectedDate());
    day.setDate(day.getDate() + 1);
    this.todoStore.setSelectedDate(day);
  }
  @ViewChild('dateInput') dateInput!: ElementRef<HTMLInputElement>;

  openDatePicker() {
    this.dateInput.nativeElement.showPicker();
  }

  onDateChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (!value) return;

    this.todoStore.setSelectedDate(new Date(value));
  }
}
