import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { Label } from '../../models/label.model';
import { LabelService } from '../../services/label';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit {


  labels: Label[] = [];

  constructor(
    private labelService: LabelService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.labels = this.labelService.getCurrentLabels();

    this.labelService.labels$.subscribe(labels => {
      this.labels = labels;
      this.cdr.detectChanges();
    });

    this.labelService.getLabels().subscribe({
      error: error => {
        console.error('Failed to load sidebar labels:', error);
      }
    });
  }

  openEditLabels(): void {
    this.router.navigate(['/notes'], {
      queryParams: { editLabels: 'true' }
    });
  }
}
