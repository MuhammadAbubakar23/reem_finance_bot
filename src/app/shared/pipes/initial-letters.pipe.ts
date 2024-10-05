import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initialLetters'
})
export class InitialLettersPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
