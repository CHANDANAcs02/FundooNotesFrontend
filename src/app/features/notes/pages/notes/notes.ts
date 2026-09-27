import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';
import { NoteForm } from '../../components/note-form/note-form';
import { NoteCard } from '../../components/note-card/note-card';

import { Note, Label } from '../../models/note.model';
import {
  CreateNoteRequest,
  NoteService
} from '../../services/note';
import { LabelService } from '../../services/label';
import { Labels } from '../labels/labels';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [Navbar, Sidebar, NoteForm, NoteCard, Labels],
  templateUrl: './notes.html',
  styleUrl: './notes.css'
})
export class Notes implements OnInit {

  notes: Note[] = [];
  labels: Label[] = [];
  showLabelsModal = false;
  searchText = '';

  constructor(
    private noteService: NoteService,
    private labelService: LabelService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadNotes();
    this.loadLabels();

    this.route.queryParamMap.subscribe(params => {
      this.showLabelsModal = params.get('editLabels') === 'true';
      this.cdr.detectChanges();
    });

    this.labelService.labels$.subscribe(labels => {
      this.labels = labels;
      this.cdr.detectChanges();
    });
  }

  loadNotes(): void {
    this.noteService.getNotes().subscribe({
      next: notes => {
        const activeNotes = notes.filter(
          note => !note.archived && !note.trashed
        );
        this.notes = this.filterNotes(activeNotes);
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Failed to load notes:', error);
        this.cdr.detectChanges();
      }
    });
  }

  loadLabels(): void {
    this.labelService.getLabels().subscribe({
      next: labels => {
        this.labels = labels;
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Failed to load labels:', error);
      }
    });
  }

  addNote(note: Note): void {
    const request: CreateNoteRequest = {
      title: note.title,
      description: note.content,
      color: note.color
    };

    this.noteService.addNote(request).subscribe({
      next: created => {
        const addCreatedNote = () => {
          this.notes = this.filterNotes([
            created,
            ...this.notes
          ]);
          this.cdr.detectChanges();
        };

        if (note.pinned && !created.pinned) {
          this.noteService.togglePin(created).subscribe({
            next: () => {
              created.pinned = true;
              addCreatedNote();
            },
            error: error => {
              console.error('Failed to pin created note:', error);
              addCreatedNote();
            }
          });
        } else {
          addCreatedNote();
        }
      },
      error: error => {
        console.error('Failed to create note:', error);
      }
    });
  }

  togglePin(noteId: number): void {
    const note = this.notes.find(item => item.id === noteId);
    if (!note) return;

    this.noteService.togglePin(note).subscribe({
      next: () => {
        note.pinned = !note.pinned;
        this.notes = [
          ...this.notes.filter(item => item.pinned),
          ...this.notes.filter(item => !item.pinned)
        ];
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Failed to update pin:', error);
      }
    });
  }

  archiveNote(noteId: number): void {
    this.noteService.archiveNote(noteId).subscribe({
      next: () => {
        this.notes = this.notes.filter(note => note.id !== noteId);
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Failed to archive note:', error);
      }
    });
  }

  trashNote(noteId: number): void {
    this.noteService.trashNote(noteId).subscribe({
      next: () => {
        this.notes = this.notes.filter(note => note.id !== noteId);
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Failed to trash note:', error);
      }
    });
  }

  searchNotes(searchText: string): void {
    this.searchText = searchText.trim().toLowerCase();
    this.loadNotes();
  }

  setReminder(noteId: number): void {
    const reminder = window.prompt(
      'Enter reminder date and time:',
      '2026-09-30T09:00'
    );

    if (!reminder) return;

    this.noteService.setReminder(noteId, reminder).subscribe({
      next: response => {
        const note = this.notes.find(item => item.id === noteId);
        if (note) {
          note.reminder = response.reminderTime;
        }
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Failed to set reminder:', error);
      }
    });
  }

  addLabelToNote(event: { noteId: number; labelId: number }): void {
    this.noteService
      .addLabelToNote(event.noteId, event.labelId)
      .subscribe({
        next: () => {
          const note = this.notes.find(
            item => item.id === event.noteId
          );
          const label = this.labels.find(
            item => item.id === event.labelId
          );

          if (
            note &&
            label &&
            !note.labels.some(item => item.id === label.id)
          ) {
            note.labels = [...note.labels, label];
          }

          this.cdr.detectChanges();
        },
        error: error => {
          console.error('Failed to add label:', error);
        }
      });
  }

  removeLabelFromNote(event: { noteId: number; labelId: number }): void {
    this.noteService
      .removeLabelFromNote(event.noteId, event.labelId)
      .subscribe({
        next: () => {
          const note = this.notes.find(
            item => item.id === event.noteId
          );

          if (note) {
            note.labels = note.labels.filter(
              label => label.id !== event.labelId
            );
          }

          this.cdr.detectChanges();
        },
        error: error => {
          console.error('Failed to remove label:', error);
        }
      });
  }

  openEditLabels(): void {
    this.showLabelsModal = true;
  }

  closeEditLabels(): void {
    this.showLabelsModal = false;

    this.router.navigate(['/notes'], {
      queryParams: {},
      replaceUrl: true
    });
  }

  private filterNotes(notes: Note[]): Note[] {
    if (!this.searchText) return notes;

    return notes.filter(note =>
      note.title.toLowerCase().includes(this.searchText) ||
      note.content.toLowerCase().includes(this.searchText)
    );
  }
}
