import Icon from '@/components/ui/icon';

interface NavigationBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function NavigationBar({ activeTab, onTabChange }: NavigationBarProps) {
  const tabs = [
    { id: 'events', label: 'События', icon: 'CalendarDays' },
    { id: 'communities', label: 'Сообщества', icon: 'Users' },
    { id: 'chat', label: 'Чат', icon: 'MessageCircle' },
    { id: 'profile', label: 'Профиль', icon: 'User' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border/50 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-around py-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? 'text-primary scale-110'
                  : 'text-muted-foreground hover:text-foreground hover:scale-105'
              }`}
            >
              <Icon
                name={tab.icon}
                size={24}
                className={activeTab === tab.id ? 'drop-shadow-[0_0_8px_rgba(155,135,245,0.5)]' : ''}
              />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}