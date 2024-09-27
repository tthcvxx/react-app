import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

const data = [
  { date: '2023-01-01', sentiment: 0.5, importance: 'medium', persona: 'Senator A', event: 'Supported climate bill', id: 1, image: '/api/placeholder/50/50' },
  { date: '2023-03-15', sentiment: -0.8, importance: 'high', persona: 'Senator A', event: 'Voted against carbon tax', id: 2, inconsistentWith: 1, image: '/api/placeholder/50/50' },
  { date: '2023-06-30', sentiment: 0.2, importance: 'low', persona: 'Senator B', event: 'Proposed education reform', id: 3, image: '/api/placeholder/50/50' },
  { date: '2023-09-01', sentiment: 1, importance: 'high', persona: 'Senator A', event: 'Announced green energy initiative', id: 4, image: '/api/placeholder/50/50' },
  { date: '2023-11-15', sentiment: -0.3, importance: 'medium', persona: 'Senator B', event: 'Criticized education spending', id: 5, inconsistentWith: 3, image: '/api/placeholder/50/50' },
];

const importanceToSize: { [key: string]: number } = {
  low: 5,
  medium: 10,
  high: 15,
};

interface PersonaIconProps {
  persona: string;
  image: string;
}

const PersonaIcon: React.FC<PersonaIconProps> = ({ persona, image }) => {
  return (
    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300">
      <img src={image} alt={persona} className="w-full h-full object-cover" />
    </div>
  );
};

interface EventBoxProps {
  event: {
    x: number;
    y: number;
    date: string;
    sentiment: number;
    importance: string;
    persona: string;
    event: string;
    id: number;
    image: string;
    inconsistentWith?: number;
  };
  isOpen: boolean;
  toggleOpen: (id: number) => void;
}

const EventBox: React.FC<EventBoxProps> = ({ event, isOpen, toggleOpen }) => {
  return (
    <div 
      className={`absolute p-2 bg-white border rounded shadow-md cursor-pointer transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-16 h-16'}`} 
      style={{
        left: `${event.x}px`, 
        top: `${event.y}px`, 
        transform: 'translate(-50%, -50%)'
      }}
      onClick={() => toggleOpen(event.id)}
    >
      <div className="flex items-center space-x-2">
        <PersonaIcon persona={event.persona} image={event.image} />
        {isOpen && (
          <div className="flex-1">
            <h3 className="font-bold">{event.persona}</h3>
            <p className="text-sm">{event.event}</p>
            {event.inconsistentWith && (
              <p className="text-red-500 text-xs mt-1">Inconsistent with previous statement</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const PoliticalConsistencyWidget: React.FC = () => {
  const [openEvent, setOpenEvent] = useState<number | null>(null);

  const toggleOpen = (id: number) => {
    setOpenEvent(openEvent === id ? null : id);
  };

  return (
    <div>
      <LineChart width={600} height={300} data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="sentiment"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
          dot={({ cx, cy, payload }) => (
            <circle
              cx={cx}
              cy={cy}
              r={importanceToSize[payload.importance]}
              fill={payload.inconsistentWith ? 'red' : 'blue'}
            />
          )}
        />
      </LineChart>
      {data.map((event) => (
        <EventBox
          key={event.id}
          event={{
            ...event,
            x: (new Date(event.date).getTime() - new Date(data[0].date).getTime()) / (24 * 60 * 60 * 1000) * 2 + 20,
            y: (1 - event.sentiment) * 150 + 10,
          }}
          isOpen={openEvent === event.id}
          toggleOpen={() => toggleOpen(event.id)}
        />
      ))}
    </div>
  );
};

export default PoliticalConsistencyWidget;
