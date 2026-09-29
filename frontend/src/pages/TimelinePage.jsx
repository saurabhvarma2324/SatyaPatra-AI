import React, { useState, useEffect } from 'react';
import { Clock, Filter } from 'lucide-react';
import { timelineAPI } from '../services/api';
import { TimelineViewer } from '../components/timeline/TimelineViewer';

export const TimelinePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    timelineAPI.getAllTimeline()
      .then(res => {
        if (res.data?.data) setEvents(res.data.data);
      })
      .catch(err => console.warn('Error fetching timeline:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          <span>Forensic Investigation Audit Timeline</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Chronological sequence of email arrival, parsing, AI scoring, threat enrichment, and human investigator actions.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500 animate-pulse font-mono">
          Loading audit events...
        </div>
      ) : (
        <TimelineViewer events={events} />
      )}
    </div>
  );
};

export default TimelinePage;
