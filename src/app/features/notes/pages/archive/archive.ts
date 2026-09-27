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
  selector: 'app-archive',
  standalone: true,
  imports: [
    Navbar,
    Sidebar,
    NoteCard
  ],
  templateUrl: './archive.html',
  styleUrl: './archive.css'
})
export class Archive implements OnInit {

  notes: Note[] = [];

  constructor(
    private noteService: NoteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {

    console.log('Loading archived notes...');

    this.noteService.getArchivedNotes().subscribe({

      next: (notes) => {

        console.log(
          'Archived notes received:',
          notes
        );

        // Display the notes immediately
        this.notes = notes;

        // Force Angular to update the page
        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error(
          'Failed to load archived notes:',
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
      .unarchiveNote(noteId)
      .subscribe({

        next: () => {

          this.notes = this.notes.filter(
            note => note.id !== noteId
          );

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Failed to unarchive note:',
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
            'Failed to trash archived note:',
            error
          );

        }

      });

  }

}