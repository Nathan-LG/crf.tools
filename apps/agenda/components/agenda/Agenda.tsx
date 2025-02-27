"use client";

import { useRef } from "react";

import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";

import dayGridPlugin from "@fullcalendar/daygrid";
import { getEvents } from "@/app/utils/agenda/actions";

const Agenda = (events) => {
  const calendarRef = useRef(null);

  return (
    <FullCalendar
      plugins={[interactionPlugin, dayGridPlugin]}
      initialView="dayGridMonth"
      locale={frLocale}
      selectable={false}
      navLinks={false}
      showNonCurrentDates={false}
      ref={calendarRef}
      events={events}
    />
  );
};

export default Agenda;
