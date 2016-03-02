/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {NgIf} from 'angular2/common';

@Component({
  selector: 'error',
  directives: [NgIf],
  template: `
  <svg *ngIf="loading" class="icon icon-load" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <path opacity=".25" d="M16 0 A16 16 0 0 0 16 32 A16 16 0 0 0 16 0 M16 4 A12 12 0 0 1 16 28 A12 12 0 0 1 16 4"/>
    <path d="M16 0 A16 16 0 0 1 32 16 L28 16 A12 12 0 0 0 16 4z"/>
  </svg>
  <p *ngIf="!ok" class="error-item">
    <span class="error">
      <svg class="icon icon-error" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
        <path d="M3.09 0c-.06 0-.1.04-.13.09l-2.94 6.81c-.02.05-.03.13-.03.19v.81c0 .05.04.09.09.09h6.81c.05 0 .09-.04.09-.09v-.81c0-.05-.01-.14-.03-.19l-2.94-6.81c-.02-.05-.07-.09-.13-.09h-.81zm-.09 3h1v2h-1v-2zm0 3h1v1h-1v-1z" />
      </svg>
    </span>
    <span class="error error-text">Something went wrong.. </span>
    <button (click)="retryClicked()">
      <p>Retry </p>
      <svg class="icon icon-refresh" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
        <path d="M4 0c-1.65 0-3 1.35-3 3h-1l1.5 2 1.5-2h-1c0-1.11.89-2 2-2v-1zm2.5 1l-1.5 2h1c0 1.11-.89 2-2 2v1c1.65 0 3-1.35 3-3h1l-1.5-2z" transform="translate(0 1)" />
      </svg>
    </button>
  </p>`
})

export class ErrorComponent {
  @Input() loading: boolean;
  @Input() ok: boolean;
  @Output() retry: EventEmitter = new EventEmitter();

  retryClicked()
  {
    this.retry.emit(null);
  }
}