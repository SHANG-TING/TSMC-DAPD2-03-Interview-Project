import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { GridWidgetData } from '@portal/data-access/models';

type PartialNullable<T> = {
  [P in keyof T]?: T[P] | null;
};
type DialogData = PartialNullable<Pick<GridWidgetData, 'name'>>;

@Component({
  selector: 'app-dialog-data-example',
  template: `
    <h2>Input Name</h2>
    <form [formGroup]="form">
      <input type="text" formControlName="name" />
      <button class="button" (click)="onSubmit()">Filter</button>
    </form>
    <button type="button" class="close-button" (click)="onClose()">X</button>
  `,
  styleUrl: './grid-filter-dialog.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class AppGridFilterDialogComponent implements OnInit {
  #data: DialogData = inject(DIALOG_DATA);
  #dialogRef = inject(DialogRef<DialogData>);
  #fb = inject(FormBuilder);

  form = this.#fb.group({
    name: [''],
  });

  ngOnInit(): void {
    this.form.reset(this.#data);
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.#dialogRef.close(this.form.value);
  }

  onClose() {
    this.#dialogRef.close();
  }
}
