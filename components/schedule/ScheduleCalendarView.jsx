"use client";
import React, { useState, useCallback } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CustomToolbar = ({ label, onNavigate, onView, view }) => {
  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button type="button" onClick={() => onNavigate('PREV')}>Back</button>
        <button type="button" onClick={() => onNavigate('NEXT')}>Next</button>
      </span>
      <span className="rbc-toolbar-label">{label}</span>
      <span className="rbc-btn-group">
        <button type="button" className={view === 'month' ? 'rbc-active' : ''} onClick={() => onView('month')}>Month</button>
        <button type="button" className={view === 'week' ? 'rbc-active' : ''} onClick={() => onView('week')}>Week</button>
        <button type="button" className={view === 'day' ? 'rbc-active' : ''} onClick={() => onView('day')}>Day</button>
        <button type="button" className={view === 'agenda' ? 'rbc-active' : ''} onClick={() => onView('agenda')}>Agenda</button>
      </span>
    </div>
  );
};

export default function ScheduleCalendarView({ schedules, onSelectEvent }) {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(Views.MONTH);

  const events = schedules.flatMap(schedule => {
    const scheduleEvents = [];

    if (schedule.isRecurring) {
      const dayMap = { 'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6 };
      const selectedDays = schedule.daysOfWeek.map(day => dayMap[day]);

      let currentDate = moment(schedule.startDate);
      const endDate = moment(schedule.endDate);

      while (currentDate.isSameOrBefore(endDate, 'day')) {
        if (selectedDays.includes(currentDate.day())) {
          schedule.sessions.forEach(session => {
            const startDateTime = moment(currentDate).format('YYYY-MM-DD') + 'T' + moment(session.startTime).format('HH:mm:ss');
            const endDateTime = moment(currentDate).format('YYYY-MM-DD') + 'T' + moment(session.endTime).format('HH:mm:ss');

            scheduleEvents.push({
              id: schedule.id,
              title: schedule.title,
              start: new Date(startDateTime),
              end: new Date(endDateTime),
              allDay: false,
              resource: schedule, // Pass the entire schedule object
            });
          });
        }
        currentDate.add(1, 'day');
      }
    } else {
      // For single-day schedules, use startDate (which now holds the single date)
      schedule.sessions.forEach(session => {
        const startDateTime = moment(schedule.startDate).format('YYYY-MM-DD') + 'T' + moment(session.startTime).format('HH:mm:ss');
        const endDateTime = moment(schedule.startDate).format('YYYY-MM-DD') + 'T' + moment(session.endTime).format('HH:mm:ss');

        scheduleEvents.push({
          id: schedule.id,
          title: schedule.title,
          start: new Date(startDateTime),
          end: new Date(endDateTime),
          allDay: false,
          resource: schedule,
        });
      });
    }
    return scheduleEvents;
  });

  const handleNavigate = useCallback((newDate) => setDate(newDate), [setDate]);
  const handleView = useCallback((newView) => setView(newView), [setView]);

  return (
    <div className="h-[700px]">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        onSelectEvent={onSelectEvent}
        components={{
          toolbar: CustomToolbar,
        }}
        date={date}
        view={view}
        onNavigate={handleNavigate}
        onView={handleView}
      />
    </div>
  );
}