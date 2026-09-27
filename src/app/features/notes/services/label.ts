import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { Label } from '../models/label.model';

export interface LabelRequest {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class LabelService {

  private readonly apiUrl = 'http://localhost:8080/api/labels';

  private readonly labelsSubject =
    new BehaviorSubject<Label[]>([]);

  readonly labels$ = this.labelsSubject.asObservable();

  getCurrentLabels(): Label[] {
    return this.labelsSubject.value;
  }

  constructor(private http: HttpClient) {}

  getLabels(): Observable<Label[]> {
    return this.http.get<Label[]>(this.apiUrl).pipe(
      tap(labels => this.labelsSubject.next(labels))
    );
  }

  createLabel(request: LabelRequest): Observable<Label> {
    return this.http.post<Label>(this.apiUrl, request).pipe(
      tap(label => {
        this.labelsSubject.next([
          ...this.labelsSubject.value,
          label
        ]);
      })
    );
  }

  updateLabel(
    id: number,
    request: LabelRequest
  ): Observable<Label> {
    return this.http.put<Label>(
      `${this.apiUrl}/${id}`,
      request
    ).pipe(
      tap(updatedLabel => {
        this.labelsSubject.next(
          this.labelsSubject.value.map(label =>
            label.id === updatedLabel.id
              ? updatedLabel
              : label
          )
        );
      })
    );
  }

  deleteLabel(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    ).pipe(
      tap(() => {
        this.labelsSubject.next(
          this.labelsSubject.value.filter(
            label => label.id !== id
          )
        );
      })
    );
  }
}
