import React from 'react';
import { FileDown } from 'lucide-react';

export default function CsvGuide() {
  const exampleCsv = `id,name,position,team,salary,projection
1,Patrick Mahomes,QB,KC,8200,24.5
2,Travis Kelce,TE,KC,7800,18.2
3,Justin Jefferson,WR,MIN,8900,22.1`;

  const downloadExample = () => {
    const blob = new Blob([exampleCsv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dfs-players-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-6 text-left">
      <h3 className="text-lg font-semibold mb-3">Required CSV Format</h3>
      <p className="text-sm text-gray-600 mb-4">
        Your CSV file must include the following columns in this exact order:
      </p>
      <div className="bg-gray-50 p-4 rounded-md mb-4">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left py-2">Column</th>
              <th className="text-left py-2">Description</th>
              <th className="text-left py-2">Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2">id</td>
              <td>Unique identifier</td>
              <td>1</td>
            </tr>
            <tr>
              <td className="py-2">name</td>
              <td>Player's full name</td>
              <td>Patrick Mahomes</td>
            </tr>
            <tr>
              <td className="py-2">position</td>
              <td>Player position (QB, RB, WR, TE, DST)</td>
              <td>QB</td>
            </tr>
            <tr>
              <td className="py-2">team</td>
              <td>Team abbreviation</td>
              <td>KC</td>
            </tr>
            <tr>
              <td className="py-2">salary</td>
              <td>Player salary (whole number)</td>
              <td>8200</td>
            </tr>
            <tr>
              <td className="py-2">projection</td>
              <td>Projected fantasy points</td>
              <td>24.5</td>
            </tr>
          </tbody>
        </table>
      </div>
      <button
        onClick={downloadExample}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
      >
        <FileDown className="w-4 h-4 mr-2" />
        Download Example CSV
      </button>
    </div>
  );
}