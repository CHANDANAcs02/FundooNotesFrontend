import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { Note, Label } from '../../models/note.model';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [],
  templateUrl: './note-card.html',
  styleUrl: './note-card.css'
})
export class NoteCard {

  @Input() note!: Note;

  @Input()
  context:
    'notes' |
    'archive' |
    'trash' |
    'reminders' = 'notes';

  @Input()
  availableLabels: Label[] = [];

  @Output()
  pinChanged = new EventEmitter<number>();

  @Output()
  archiveClicked = new EventEmitter<number>();

  @Output()
  trashClicked = new EventEmitter<number>();

  @Output()
  restoreClicked = new EventEmitter<number>();

  @Output()
  reminderClicked = new EventEmitter<number>();

  @Output()
  labelAdded =
    new EventEmitter<{
      noteId: number;
      labelId: number;
    }>();

  @Output()
  labelRemoved =
    new EventEmitter<{
      noteId: number;
      labelId: number;
    }>();

  showLabelMenu = false;

  togglePin(): void {
    this.pinChanged.emit(this.note.id);
  }

  archiveNote(): void {
    this.archiveClicked.emit(this.note.id);
  }

  trashNote(): void {
    this.trashClicked.emit(this.note.id);
  }

  restoreNote(): void {
    this.restoreClicked.emit(this.note.id);
  }

  addReminder(): void {
    this.reminderClicked.emit(this.note.id);
  }

  toggleLabelMenu(): void {
    this.showLabelMenu = !this.showLabelMenu;
  }

  hasLabel(labelId: number): boolean {
    return this.note.labels.some(
      label => label.id === labelId
    );
  }

  toggleLabel(label: Label): void {

    if (this.hasLabel(label.id)) {

      this.labelRemoved.emit({
        noteId: this.note.id,
        labelId: label.id
      });

    } else {

      this.labelAdded.emit({
        noteId: this.note.id,
        labelId: label.id
      });

    }
  }

  formatReminder(
    reminder: string | null
  ): string {

    if (!reminder) {
      return '';
    }

    const date = new Date(reminder);

    if (isNaN(date.getTime())) {
      return reminder;
    }

    return date.toLocaleString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }
    );
  }
}