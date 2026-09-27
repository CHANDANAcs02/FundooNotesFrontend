import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';
import { NoteCard } from '../../components/note-card/note-card';

import { Note } from '../../models/note.model';
import { NoteService } from '../../services/note';

@Component({
  selector: 'app-reminders',
  standalone: true,
  imports: [
    Navbar,
    Sidebar,
    NoteCard
  ],
  templateUrl: './reminders.html',
  styleUrl: './reminders.css'
})
export class Reminders implements OnInit {

  notes: Note[] = [];

  constructor(
    private noteService: NoteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {

    console.log('Loading reminder notes...');

    this.noteService
      .getReminderNotes()
      .subscribe({

        next: (notes) => {

          console.log(
            'Reminder notes received:',
            notes
          );

          this.notes = notes;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Failed to load reminders:',
            error
          );

          this.cdr.detectChanges();

        }

      });

  }

  togglePin(noteId: number): void {

    const note = this.notes.find(
      item => item.id === noteId
    );

    if (!note) {
      return;
    }

    this.noteService
      .togglePin(note)
      .subscribe({

        next: () => {

          note.pinned = !note.pinned;

          // Keep pinned reminders at the top
          this.notes = [
            ...this.notes.filter(
              item => item.pinned
            ),
            ...this.notes.filter(
              item => !item.pinned
            )
          ];

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Failed to update pin:',
            error
          );

        }

      });

  }

  archiveNote(noteId: number): void {

    this.noteService
      .archiveNote(noteId)
      .subscribe({

        next: () => {

          this.notes = this.notes.filter(
            note => note.id !== noteId
          );

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Failed to archive reminder:',
            error
          );

        }

      });

  }

  trashNote(noteId: number): void {

    this.noteService
      .trashNote(noteId)
      .subscribe({

        next: () => {

          this.notes = this.notes.filter(
            note => note.id !== noteId
          );

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Failed to trash reminder:',
            error
          );

        }

      });

  }

}