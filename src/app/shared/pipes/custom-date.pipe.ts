import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    // Split the input date string into its components
    const [day, month, year, hours, minutes, seconds] = value.split(/[/ :]/);
    const parsedDate = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);

    // Create options for date formatting
    const dateOptions: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: '2-digit',
      // year: 'numeric',
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };

    // Format the date using Intl.DateTimeFormat
    const dateFormatter = new Intl.DateTimeFormat('en-US', dateOptions);
    const timeFormatter = new Intl.DateTimeFormat('en-US', timeOptions);

    // Combine the formatted date and time
    return `${dateFormatter.format(parsedDate)}, ${timeFormatter.format(parsedDate)}`;
  }
}
