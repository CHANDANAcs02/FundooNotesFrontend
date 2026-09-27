import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

import { Note, Label } from '../models/note.model';

interface BackendNote {
  id: number;
  title: string;
  description: string | null;
  color: string | null;
  pinned: boolean;
  archived: boolean;
  trashed: boolean;
  createdDate: string;
  updatedDate: string;
  reminderDate: string | null;
  reminderTime?: string | null;
  labels: Label[] | null;
}

interface BackendReminder {
  id: number;
  noteId: number;
  noteTitle: string;
  reminderTime: string;
  status: string;
}

export interface CreateNoteRequest {
  title: string;
  description: string;
  color: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private readonly apiUrl = 'http://localhost:8080/api/notes';
  private readonly reminderApiUrl = 'http://localhost:8080/api/reminders';

  constructor(private http: HttpClient) {}

  getNotes(): Observable<Note[]> {
    return this.getNotesWithReminders(
      this.http.get<BackendNote[]>(this.apiUrl)
    );
  }

  getArchivedNotes(): Observable<Note[]> {
    return this.getNotesWithReminders(
      this.http.get<BackendNote[]>(
        `${this.apiUrl}/filter/archived?archived=true`
      )
    );
  }

  getTrashNotes(): Observable<Note[]> {
    return this.getNotesWithReminders(
      this.http.get<BackendNote[]>(
        `${this.apiUrl}/filter/trashed?trashed=true`
      )
    );
  }

  getReminderNotes(): Observable<Note[]> {
    return this.getNotesWithReminders(
      this.http.get<BackendNote[]>(
        `${this.apiUrl}/filter/reminder`
      )
    );
  }

  getNotesByLabel(label: string): Observable<Note[]> {
    return this.getNotesWithReminders(
      this.http.get<BackendNote[]>(
        `${this.apiUrl}/filter/label?label=${encodeURIComponent(label)}`
      )
    );
  }

  addNote(request: CreateNoteRequest): Observable<Note> {
    return this.http
      .post<BackendNote>(this.apiUrl, request)
      .pipe(map(note => this.mapNote(note)));
  }

  togglePin(note: Note): Observable<void> {
    const url = note.pinned
      ? `${this.apiUrl}/${note.id}/unpin`
      : `${this.apiUrl}/${note.id}/pin`;

    return this.http.patch<void>(url, {});
  }

  archiveNote(noteId: number): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/${noteId}/archive`,
      {}
    );
  }

  unarchiveNote(noteId: number): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/${noteId}/unarchive`,
      {}
    );
  }

  trashNote(noteId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${noteId}`
    );
  }

  restoreNote(noteId: number): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/${noteId}/restore`,
      {}
    );
  }

  deleteNotePermanently(noteId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${noteId}/permanent`
    );
  }

  setReminder(
    noteId: number,
    reminder: string
  ): Observable<BackendReminder> {
    return this.http.post<BackendReminder>(
      `${this.apiUrl}/${noteId}/reminder`,
      { reminderTime: reminder }
    );
  }

  addLabelToNote(
    noteId: number,
    labelId: number
  ): Observable<string> {
    return this.http.post(
      `${this.apiUrl}/${noteId}/labels?labelId=${labelId}`,
      {},
      { responseType: 'text' }
    );
  }

  removeLabelFromNote(
    noteId: number,
    labelId: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${noteId}/labels/${labelId}`
    );
  }

  private getNotesWithReminders(
    notesRequest: Observable<BackendNote[]>
  ): Observable<Note[]> {
    return forkJoin({
      notes: notesRequest,
      reminders: this.http.get<BackendReminder[]>(
        this.reminderApiUrl
      )
    }).pipe(
      map(({ notes, reminders }) =>
        notes.map(note => {
          const reminder = reminders.find(
            item => item.noteId === note.id
          );

          return this.mapNote(
            note,
            reminder?.reminderTime ?? null
          );
        })
      )
    );
  }

  private mapNote(
    note: BackendNote,
    reminderOverride: string | null = null
  ): Note {
    return {
      id: note.id,
      title: note.title,
      content: note.description ?? '',
      color: note.color,
      pinned: note.pinned,
      archived: note.archived,
      trashed: note.trashed,
      reminder:
        reminderOverride ??
        note.reminderDate ??
        note.reminderTime ??
        null,
      labels: note.labels ?? []
    };
  }
}
