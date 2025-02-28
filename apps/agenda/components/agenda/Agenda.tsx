"use client";

import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";

import dayGridPlugin from "@fullcalendar/daygrid";
import React from "react";
import MissionAgenda from "./MissionAgenda";

const Agenda = ({ events }) => {
  const [missions, setMissions] = React.useState([]);

  function dateWasClicked(info) {
    const clickedDate = info.date;

    setMissions(
      events.filter((event) => {
        const eventDate = new Date(event.start);
        return (
          eventDate.getDate() === clickedDate.getDate() &&
          eventDate.getMonth() === clickedDate.getMonth() &&
          eventDate.getFullYear() === clickedDate.getFullYear()
        );
      }),
    );
  }

  function eventWasClicked(info) {
    const clickedDate = info.event.start;
    setMissions(
      events.filter((event) => {
        const eventDate = new Date(event.start);
        return (
          eventDate.getDate() === clickedDate.getDate() &&
          eventDate.getMonth() === clickedDate.getMonth() &&
          eventDate.getFullYear() === clickedDate.getFullYear()
        );
      }),
    );
  }

  return (
    <>
      <div className="col-lg-6">
        <div className="card">
          <div className="card-body">
            <FullCalendar
              plugins={[interactionPlugin, dayGridPlugin]}
              initialView="dayGridMonth"
              locale={frLocale}
              selectable={false}
              navLinks={false}
              showNonCurrentDates={false}
              events={events}
              dateClick={(info) => {
                dateWasClicked(info);
              }}
              eventClick={(info) => {
                eventWasClicked(info);
              }}
            />
          </div>
        </div>
      </div>
      <div className="col-lg-6">
        {missions.length > 0 && (
          <>
            <div className="card bg-secondary-lt mb-2">
              <div className="card-body">
                <h3 className="card-title">
                  Missions du {missions[0].start.toLocaleDateString("fr-FR")}
                </h3>
              </div>
            </div>
            {missions.map((mission) => (
              <MissionAgenda key={mission.id} event={mission} />
            ))}
          </>
        )}
        {missions.length === 0 && (
          <div className="card mb-2">
            <div className="card-status-top bg-danger"></div>
            <div className="card-body">
              <h3 className="card-title">Tutoriel</h3>
              <p className="text-secondary">
                Commencez par cliquer sur une date pour voir les missions
                prévues ce jour-ci.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Agenda;
