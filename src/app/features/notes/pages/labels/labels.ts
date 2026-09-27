import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Label } from '../../models/label.model';
import {
  LabelRequest,
  LabelService
} from '../../services/label';

@Component({
  selector: 'app-labels',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './labels.html',
  styleUrl: './labels.css'
})
export class Labels implements OnInit, OnChanges {

  @Input() isOpen = false;

  @Output() closed = new EventEmitter<void>();

  labels: Label[] = [];
  newLabelName = '';
  editingLabelId: number | null = null;
  editingLabelName = '';

  constructor(
    private labelService: LabelService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLabels();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']?.currentValue === true) {
      this.loadLabels();
    }
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

  createLabel(): void {
    const name = this.newLabelName.trim();

    if (!name) {
      return;
    }

    const request: LabelRequest = { name };

    this.labelService.createLabel(request).subscribe({
      next: label => {
        this.labels = [...this.labels, label];
        this.newLabelName = '';
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Failed to create label:', error);
      }
    });
  }

  startEditing(label: Label): void {
    this.editingLabelId = label.id;
    this.editingLabelName = label.name;
  }

  cancelEditing(): void {
    this.editingLabelId = null;
    this.editingLabelName = '';
  }

  updateLabel(): void {
    if (this.editingLabelId === null) {
      return;
    }

    const name = this.editingLabelName.trim();

    if (!name) {
      return;
    }

    this.labelService.updateLabel(
      this.editingLabelId,
      { name }
    ).subscribe({
      next: updatedLabel => {
        this.labels = this.labels.map(label =>
          label.id === updatedLabel.id
            ? updatedLabel
            : label
        );

        this.cancelEditing();
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Failed to update label:', error);
      }
    });
  }

  deleteLabel(labelId: number): void {
    this.labelService.deleteLabel(labelId).subscribe({
      next: () => {
        this.labels = this.labels.filter(
          label => label.id !== labelId
        );
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Failed to delete label:', error);
      }
    });
  }

  close(): void {
    this.closed.emit();
  }
}
