"""Deadline arithmetic for the EP screens: business days (Ley 19.880 art. 25) and calendar days."""

from datetime import date, timedelta

from app.models import Deadline
from app.schemas.ep import DeadlineView

SATURDAY = 5
# A deadline is critical when less than this share of its term remains.
CRITICAL_SHARE = 0.25
# Without a known start, a deadline is critical when this few days remain.
CRITICAL_DAYS_WITHOUT_START = 7

# shortcut: Chilean national holidays hardcoded for 2026-2027, replace with a holiday table when the demo outlives 2027.
HOLIDAYS = frozenset(
    date.fromisoformat(day)
    for day in (
        "2026-01-01",
        "2026-04-03",
        "2026-04-04",
        "2026-05-01",
        "2026-05-21",
        "2026-06-21",
        "2026-06-29",
        "2026-07-16",
        "2026-08-15",
        "2026-09-18",
        "2026-09-19",
        "2026-10-12",
        "2026-10-31",
        "2026-11-01",
        "2026-12-08",
        "2026-12-25",
        "2027-01-01",
        "2027-03-26",
        "2027-03-27",
        "2027-05-01",
        "2027-05-21",
        "2027-06-21",
        "2027-06-28",
        "2027-07-16",
        "2027-08-15",
        "2027-09-18",
        "2027-09-19",
        "2027-10-11",
        "2027-10-31",
        "2027-11-01",
        "2027-12-08",
        "2027-12-25",
    )
)


def is_business_day(day: date) -> bool:
    return day.weekday() < SATURDAY and day not in HOLIDAYS


def days_between(start: date, end: date, business: bool) -> int:
    """Days after `start` up to and including `end`; zero when `end` is not after `start`."""
    if end <= start:
        return 0
    if not business:
        return (end - start).days
    return sum(1 for offset in range(1, (end - start).days + 1) if is_business_day(start + timedelta(days=offset)))


def deadline_view(deadline: Deadline, today: date) -> DeadlineView:
    remaining = days_between(today, deadline.due_on, deadline.business_days)
    total = days_between(deadline.starts_on, deadline.due_on, deadline.business_days) if deadline.starts_on else None
    critical = remaining <= total * CRITICAL_SHARE if total else remaining <= CRITICAL_DAYS_WITHOUT_START
    return DeadlineView(
        kind=deadline.kind,
        title=deadline.title,
        due_on=deadline.due_on,
        business_days=deadline.business_days,
        remaining_days=remaining,
        total_days=total,
        article=deadline.article,
        note=deadline.note,
        critical=critical,
    )
