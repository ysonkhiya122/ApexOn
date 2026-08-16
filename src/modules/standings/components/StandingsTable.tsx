import React from 'react';
import { Trophy, Award } from 'lucide-react';
import './standings-table.scss';

interface DriverStandingsEntry {
  position: string;
  points: string;
  wins: string;
  Driver?: {
    givenName: string;
    familyName: string;
    nationality?: string;
  };
  Constructors?: Array<{
    name: string;
    nationality?: string;
  }>;
}

interface ConstructorStandingsEntry {
  position: string;
  points: string;
  wins: string;
  Constructor: {
    name: string;
    nationality?: string;
  };
}

interface StandingsTableProps {
  type: 'drivers' | 'constructors';
  standings: DriverStandingsEntry[] | ConstructorStandingsEntry[];
}

export const StandingsTable: React.FC<StandingsTableProps> = ({ type, standings }) => {
  const getPositionBadgeStyle = (position: number) => {
    if (position === 1) return 'standings-table__pos--first';
    if (position === 2) return 'standings-table__pos--second';
    if (position === 3) return 'standings-table__pos--third';
    return '';
  };

  return (
    <div className="standings-table">
      <table className="standings-table__table">
        <thead className="standings-table__header">
          <tr>
            <th className="standings-table__th standings-table__th--pos">Pos</th>
            {type === 'drivers' ? (
              <th className="standings-table__th standings-table__th--driver">Driver</th>
            ) : (
              <th className="standings-table__th standings-table__th--constructor">Constructor</th>
            )}
            {type === 'drivers' && (
              <th className="standings-table__th standings-table__th--team">Team</th>
            )}
            <th className="standings-table__th standings-table__th--points">Points</th>
            <th className="standings-table__th standings-table__th--wins">Wins</th>
          </tr>
        </thead>
        <tbody className="standings-table__body">
          {standings.map((entry: any, idx: number) => {
            const position = parseInt(entry.position, 10);
            return (
              <tr key={idx} className="standings-table__row">
                <td
                  className={`standings-table__td standings-table__td--pos ${getPositionBadgeStyle(position)}`}
                >
                  {position === 1 ? (
                    <Trophy size={16} className="standings-table__icon" />
                  ) : position <= 3 ? (
                    <Award size={16} className="standings-table__icon" />
                  ) : (
                    position
                  )}
                </td>
                {type === 'drivers' ? (
                  <>
                    <td className="standings-table__td standings-table__td--driver">
                      <span className="standings-table__name">
                        {entry.Driver?.givenName} {entry.Driver?.familyName}
                      </span>
                    </td>
                    <td className="standings-table__td standings-table__td--team">
                      {entry.Constructors?.[0]?.name}
                    </td>
                  </>
                ) : (
                  <td className="standings-table__td standings-table__td--constructor">
                    <span className="standings-table__name">{entry.Constructor?.name}</span>
                  </td>
                )}
                <td className="standings-table__td standings-table__td--points">
                  <span className="standings-table__points">{entry.points}</span>
                </td>
                <td className="standings-table__td standings-table__td--wins">{entry.wins}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
