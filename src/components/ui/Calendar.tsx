import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface CalendarProps {
  value?: Date;
  onChange?: (date: Date | null) => void;
  disabled?: boolean;
}

export function Calendar({ value, onChange, disabled }: CalendarProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateCalendar value={value} onChange={onChange} disabled={disabled} />
    </LocalizationProvider>
  );
}
