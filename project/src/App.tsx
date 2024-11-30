import React from 'react';
import { LineupSettings } from './types/player';
import LineupBuilder from './components/LineupBuilder';
import { players } from './data/players';

const DEFAULT_SETTINGS: LineupSettings = {
  salaryCap: 50000,
  positions: [
    { position: 'QB', count: 1 },
    { position: 'RB', count: 2 },
    { position: 'WR', count: 3 },
    { position: 'TE', count: 1 },
    { position: 'FLEX', count: 1 },
    { position: 'DST', count: 1 },
  ],
  maxFromTeam: 4,
};

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          DFS Lineup Optimizer
        </h1>
        <LineupBuilder
          players={players}
          settings={DEFAULT_SETTINGS}
        />
      </div>
    </div>
  );
}

export default App;