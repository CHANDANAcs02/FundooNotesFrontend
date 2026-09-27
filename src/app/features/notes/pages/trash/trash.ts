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
  selector: 'app-trash',
  standalone: true,
  imports: [
    Navbar,
    Sidebar,
    NoteCard
  ],
  templateUrl: './trash.html',
  styleUrl: './trash.css'
})
export class Trash implements OnInit {

  notes: Note[] = [];

  constructor(
    private noteService: NoteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {

    console.log('Loading trashed notes...');

    this.noteService.getTrashNotes().subscribe({

      next: (notes) => {

        console.log(
          'Trashed notes received:',
          notes
        );

        // Display exactly what the backend returns
        this.notes = notes;

        // Update the view immediately
        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error(
          'Failed to load trash:',
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

  restoreNote(noteId: number): void {

    this.noteService
      .restoreNote(noteId)
      .subscribe({

        next: () => {

          this.notes = this.notes.filter(
            note => note.id !== noteId
          );

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Failed to restore note:',
            error
          );

        }

      });

  }

  deletePermanently(noteId: number): void {

    this.noteService
      .deleteNotePermanently(noteId)
      .subscribe({

        next: () => {

          this.notes = this.notes.filter(
            note => note.id !== noteId
          );

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Failed to permanently delete note:',
            error
          );

        }

      });

  }

}