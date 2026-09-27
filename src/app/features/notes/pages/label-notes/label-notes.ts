import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';
import { NoteCard } from '../../components/note-card/note-card';
import { Note, Label } from '../../models/note.model';
import { NoteService } from '../../services/note';
import { LabelService } from '../../services/label';

@Component({
  selector: 'app-label-notes',
  standalone: true,
  imports: [Navbar, Sidebar, NoteCard],
  templateUrl: './label-notes.html',
  styleUrl: './label-notes.css'
})
export class LabelNotes implements OnInit {

  notes: Note[] = [];
  labels: Label[] = [];
  labelName = '';

  constructor(
    private route: ActivatedRoute,
    private noteService: NoteService,
    private labelService: LabelService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.labelName = params.get('label') ?? '';
      this.loadNotes();
    });
    this.loadLabels();
  }

  loadNotes(): void {
    if (!this.labelName) return;

    this.noteService.getNotesByLabel(this.labelName).subscribe({
      next: notes => {
        this.notes = notes.filter(
          note => !note.archived && !note.trashed
        );
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Failed to load label notes:', error);
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
      error: error => console.error('Failed to update pin:', error)
    });
  }

  archiveNote(noteId: number): void {
    this.noteService.archiveNote(noteId).subscribe({
      next: () => {
        this.notes = this.notes.filter(note => note.id !== noteId);
        this.cdr.detectChanges();
      },
      error: error => console.error('Failed to archive note:', error)
    });
  }

  trashNote(noteId: number): void {
    this.noteService.trashNote(noteId).subscribe({
      next: () => {
        this.notes = this.notes.filter(note => note.id !== noteId);
        this.cdr.detectChanges();
      },
      error: error => console.error('Failed to trash note:', error)
    });
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
        if (note) note.reminder = response.reminderTime;
        this.cdr.detectChanges();
      },
      error: error => console.error('Failed to set reminder:', error)
    });
  }

  addLabelToNote(event: { noteId: number; labelId: number }): void {
    this.noteService.addLabelToNote(event.noteId, event.labelId).subscribe({
      next: () => {
        const note = this.notes.find(item => item.id === event.noteId);
        const label = this.labels.find(item => item.id === event.labelId);
        if (note && label && !note.labels.some(item => item.id === label.id)) {
          note.labels = [...note.labels, label];
        }
        this.cdr.detectChanges();
      },
      error: error => console.error('Failed to add label:', error)
    });
  }

  removeLabelFromNote(event: { noteId: number; labelId: number }): void {
    this.noteService.removeLabelFromNote(event.noteId, event.labelId).subscribe({
      next: () => {
        const note = this.notes.find(item => item.id === event.noteId);
        if (note) {
          note.labels = note.labels.filter(label => label.id !== event.labelId);
        }
        if (note && !note.labels.some(label => label.name === this.labelName)) {
          this.notes = this.notes.filter(item => item.id !== note.id);
        }
        this.cdr.detectChanges();
      },
      error: error => console.error('Failed to remove label:', error)
    });
  }
}
