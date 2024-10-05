import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InitialsService {

  constructor() { }
  getInitials(value: string): string {
    if (!value) {
      return '';
    }
    const words = value.split(' ');
    const initials = words.map(word => word.charAt(0)).join('').slice(0, 2);
    return initials.toUpperCase();
  }
}
