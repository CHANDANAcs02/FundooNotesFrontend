import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Note } from '../../models/note.model';

@Component({
  selector: 'app-note-form',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './note-form.html',
  styleUrl: './note-form.css'
})
export class NoteForm {

  @Output() noteSaved =
    new EventEmitter<Note>();

  isExpanded = false;

  title = '';

  content = '';

  pinned = false;


  openEditor(): void {

    this.isExpanded = true;

  }


  togglePin(): void {

    this.pinned = !this.pinned;

  }


  closeEditor(): void {

    this.isExpanded = false;

  }


  saveNote(): void {

    if (
      this.title.trim() === '' &&
      this.content.trim() === ''
    ) {

      this.isExpanded = false;

      return;
    }

    const note: Note = {

      id: 0,

      title: this.title.trim(),

      content: this.content.trim(),

      color: null,

      pinned: this.pinned,

      archived: false,

      trashed: false,

      reminder: null,

      labels: []

    };

    this.noteSaved.emit(note);

    this.title = '';

    this.content = '';

    this.pinned = false;

    this.isExpanded = false;

  }

}