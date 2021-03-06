import { FormArray } from '@angular/forms';
import { FormlyFieldConfig } from '../components/formly.field.config';
import { FieldType } from './field.type';
import { clone } from '../utils';
import { FormlyFormBuilder } from '../services/formly.form.builder';

export abstract class FieldArrayType extends FieldType {
  formControl: FormArray;

  static createControl(model: any, field: FormlyFieldConfig): FormArray {
    const form = new FormArray(
      [],
      field.validators ? field.validators.validation : undefined,
      field.asyncValidators ? field.asyncValidators.validation : undefined,
    );

    field.fieldGroup = [];
    (model || []).forEach((m: any, i: number) => field.fieldGroup.push(
      { ...clone(field.fieldArray), key: `${i}` },
    ));

    return form;
  }

 constructor(private builder: FormlyFormBuilder) {
    super();
  }

  add() {
    const i = this.field.fieldGroup.length;
    this.model.push({});
    this.field.fieldGroup.push(
      { ...clone(this.field.fieldArray), key: `${this.field.fieldGroup.length}` },
    );

    this.builder.buildForm(this.formControl, [this.field.fieldGroup[i]], this.model, this.options);
    (<any> this.options).resetTrackModelChanges();
  }

  remove(i) {
    this.formControl.removeAt(i);
    this.field.fieldGroup.splice(i, 1);
    this.field.fieldGroup.forEach((f, index) => f.key = `${index}`);
    this.model.splice(i, 1);
    (<any> this.options).resetTrackModelChanges();
  }
}
