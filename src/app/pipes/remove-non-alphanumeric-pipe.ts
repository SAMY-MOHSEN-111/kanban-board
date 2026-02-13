import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'removeNonAlphanumeric'})
export class RemoveNonAlphanumericPipe implements PipeTransform {
  transform(value: string): unknown {
    return value.replace(/[^a-zA-Z0-9 ]/g, ' ');
  }
}
