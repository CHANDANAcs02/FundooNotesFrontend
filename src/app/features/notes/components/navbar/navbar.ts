import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  @Output() searchChanged = new EventEmitter<string>();

  searchText = '';


  onSearch(): void {
    this.searchChanged.emit(this.searchText);
  }


  onSearchInput(): void {
    this.searchChanged.emit(this.searchText);
  }


  refresh(): void {
    console.log('Refresh clicked');
  }


  changeView(): void {
    console.log('View toggle clicked');
  }


  openSettings(): void {
    console.log('Settings clicked');
  }


  openGoogleApps(): void {
    console.log('Google Apps clicked');
  }

}