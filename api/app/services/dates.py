"""Date math for legal terms: calendar days, business days and waiting time."""

from dataclasses import dataclass
from datetime import date, timedelta

SATURDAY = 5
MONTHS_PER_YEAR = 12

# shortcut: fixed Chilean holidays for the demo window only, replace with a holiday table before real use.
HOLIDAYS = {
    date(2026, 12, 8),
    date(2026, 12, 25),
    date(2027, 1, 1),
    date(2027, 4, 2),
    date(2027, 4, 3),
    date(2027, 5, 1),
    date(2027, 5, 21),
}


@dataclass
class Elapsed:
    years: int
    months: int


def days_left(today: date, due_on: date) -> int:
    """Calendar days from today until the due date; 0 once it passed."""
    return max((due_on - today).days, 0)


def is_business_day(day: date) -> bool:
    return day.weekday() < SATURDAY and day not in HOLIDAYS


def business_days_left(today: date, due_on: date) -> int:
    """Business days after today up to and including the due date."""
    count = 0
    day = today + timedelta(days=1)
    while day <= due_on:
        count += is_business_day(day)
        day += timedelta(days=1)
    return count


def elapsed(since: date, today: date) -> Elapsed:
    """Whole years and months between two dates ("3 años y 4 meses")."""
    months = (today.year - since.year) * MONTHS_PER_YEAR + today.month - since.month
    if today.day < since.day:
        months -= 1
    return Elapsed(years=months // MONTHS_PER_YEAR, months=months % MONTHS_PER_YEAR)
