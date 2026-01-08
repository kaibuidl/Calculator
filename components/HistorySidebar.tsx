
import React from 'react';
import { HistoryItem } from '../types';

interface HistorySidebarProps {
  history: HistoryItem[];
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ history }) => {
  const formatHistoryDate = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const dayInMs = 86400000;

    if (diff < dayInMs * 7) return 'Previous 7 Days';
    if (diff < dayInMs * 30) return 'Previous 30 Days';
    return 'Older';
  };

  const groupedHistory: Record<string, HistoryItem[]> = history.reduce((acc, item) => {
    const group = formatHistoryDate(item.timestamp);
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, HistoryItem[]>);

  const groups = ['Previous 7 Days', 'Previous 30 Days', 'Older'];

  return (
    <div className="w-[300px] border-r border-[#333] h-full overflow-y-auto bg-[#1c1c1e] p-4 custom-scrollbar flex flex-col gap-6">
      {groups.map(group => (
        groupedHistory[group] && groupedHistory[group].length > 0 && (
          <div key={group} className="flex flex-col gap-4">
            <h3 className="text-[#8e8e93] text-sm font-semibold px-2">{group}</h3>
            <div className="flex flex-col gap-6 px-2">
              {groupedHistory[group].map((item) => (
                <div key={item.id} className="flex flex-col items-start gap-1">
                  <div className="text-[#8e8e93] text-sm">{item.expression}</div>
                  <div className="text-white text-lg font-bold">{item.result}</div>
                </div>
              ))}
            </div>
          </div>
        )
      ))}
      {history.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-[#8e8e93] italic text-sm">
          No history yet
        </div>
      )}
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #444;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};
