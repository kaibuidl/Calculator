
import React from 'react';
import { HistoryItem } from '../types';

interface HistorySidebarProps {
  history: HistoryItem[];
  isVisible: boolean;
  onClose: () => void;
  onClear: () => void;
  isMobile?: boolean;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ 
  history, 
  isVisible, 
  onClose,
  onClear,
  isMobile = true
}) => {
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

  if (!isMobile) {
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
          .custom-scrollbar::-webkit-scrollbar { width: 8px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #444; border-radius: 10px; }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 z-40 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div className={`fixed bottom-0 left-0 right-0 bg-[#1c1c1e] rounded-t-[20px] transition-transform duration-300 ease-out z-50 flex flex-col h-[70vh] ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="w-full flex justify-center pt-2 pb-4" onClick={onClose}>
          <div className="w-10 h-1 bg-[#3a3a3c] rounded-full" />
        </div>
        <div className="flex justify-between items-center px-6 mb-4">
          <button onClick={onClose} className="text-[#ff9f0a] font-medium">Edit</button>
          <button onClick={onClose} className="text-[#ff9f0a] font-bold">Done</button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-10 custom-scrollbar">
          {groups.map(group => (
            groupedHistory[group] && groupedHistory[group].length > 0 && (
              <div key={group} className="flex flex-col gap-4 mb-8">
                <h3 className="text-[#8e8e93] text-sm font-semibold">{group}</h3>
                <div className="flex flex-col gap-6">
                  {groupedHistory[group].map((item) => (
                    <div key={item.id} className="flex flex-col items-start">
                      <div className="text-[#8e8e93] text-lg">{item.expression}</div>
                      <div className="text-white text-3xl font-bold">{item.result}</div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
          {history.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-[#8e8e93] italic text-sm py-20">
              No history yet
            </div>
          )}
        </div>
        <div className="p-6 border-t border-[#333] flex justify-between">
          <button onClick={onClear} className="text-[#ff453a]">Clear</button>
        </div>
      </div>
      <style>{` .custom-scrollbar::-webkit-scrollbar { width: 0px; } `}</style>
    </>
  );
};
