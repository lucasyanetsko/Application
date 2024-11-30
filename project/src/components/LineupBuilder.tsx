import React, { useState } from 'react';
import { Player, LineupSettings } from '../types/player';
import { canAddPlayerToLineup, getPositionDisplay } from '../utils/optimizer';

interface LineupBuilderProps {
  players: Player[];
  settings: LineupSettings;
}

export default function LineupBuilder({ players, settings }: LineupBuilderProps) {
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlayers = players.filter(player => 
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlayerSelect = (player: Player) => {
    if (canAddPlayerToLineup(player, selectedPlayers, settings)) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const handlePlayerRemove = (playerId: string) => {
    setSelectedPlayers(selectedPlayers.filter(p => p.id !== playerId));
  };

  const totalSalary = selectedPlayers.reduce((sum, player) => sum + player.salary, 0);
  const totalProjection = selectedPlayers.reduce((sum, player) => sum + player.projection, 0);
  const remainingSalary = settings.salaryCap - totalSalary;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Available Players</h2>
        <input
          type="text"
          placeholder="Search players..."
          className="w-full p-2 border rounded-md mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="h-[600px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Pos</th>
                <th className="px-4 py-2 text-left">Team</th>
                <th className="px-4 py-2 text-right">Salary</th>
                <th className="px-4 py-2 text-right">Proj</th>
                <th className="px-4 py-2 text-right">Value</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.map(player => (
                <tr key={player.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{player.name}</td>
                  <td className="px-4 py-2">{getPositionDisplay(player.position)}</td>
                  <td className="px-4 py-2">{player.team}</td>
                  <td className="px-4 py-2 text-right">${player.salary.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">{player.projection.toFixed(1)}</td>
                  <td className="px-4 py-2 text-right">{(player.projection / player.salary * 1000).toFixed(2)}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handlePlayerSelect(player)}
                      className="text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={
                        selectedPlayers.some(p => p.id === player.id) ||
                        !canAddPlayerToLineup(player, selectedPlayers, settings)
                      }
                    >
                      Add
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Current Lineup</h2>
        <div className="mb-4 space-y-2">
          <p className="text-sm text-gray-600">
            Salary: ${totalSalary.toLocaleString()} / ${settings.salaryCap.toLocaleString()}
            <span className={`ml-2 ${remainingSalary >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              (${remainingSalary.toLocaleString()} remaining)
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Projected Points: {totalProjection.toFixed(2)}
          </p>
        </div>
        <div className="space-y-2">
          {selectedPlayers.map(player => (
            <div
              key={player.id}
              className="flex items-center justify-between bg-gray-50 p-2 rounded"
            >
              <div>
                <span className="font-medium">{player.name}</span>
                <span className="text-sm text-gray-600 ml-2">
                  {getPositionDisplay(player.position)} - {player.team}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  ${player.salary.toLocaleString()}
                </span>
                <button
                  onClick={() => handlePlayerRemove(player.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}