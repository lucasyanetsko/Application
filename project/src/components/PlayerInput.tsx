import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Player } from '../types/player';
import CsvGuide from './CsvGuide';

interface PlayerInputProps {
  onPlayersUpload: (players: Player[]) => void;
}

export default function PlayerInput({ onPlayersUpload }: PlayerInputProps) {
  const [error, setError] = useState<string>('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n');
        const headers = lines[0].toLowerCase().split(',');
        
        // Validate headers
        const requiredHeaders = ['id', 'name', 'position', 'team', 'salary', 'projection'];
        const hasAllHeaders = requiredHeaders.every(header => 
          headers.includes(header.toLowerCase())
        );
        
        if (!hasAllHeaders) {
          throw new Error('CSV file is missing required columns');
        }

        const players: Player[] = lines.slice(1)
          .filter(line => line.trim() !== '')
          .map((line) => {
            const values = line.split(',');
            if (values.length !== requiredHeaders.length) {
              throw new Error('Invalid number of columns in CSV row');
            }

            const salary = parseInt(values[4]);
            const projection = parseFloat(values[5]);

            if (isNaN(salary) || isNaN(projection)) {
              throw new Error('Invalid salary or projection value');
            }

            return {
              id: values[0],
              name: values[1],
              position: values[2],
              team: values[3],
              salary,
              projection,
              value: (projection / salary) * 1000
            };
          });

        onPlayersUpload(players);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error parsing CSV file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Upload Players</h2>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Upload a CSV file with player data
        </p>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          Select File
        </label>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
      <CsvGuide />
    </div>
  );
}