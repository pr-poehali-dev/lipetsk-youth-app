import { useState } from 'react';
import EventCard from '@/components/EventCard';
import CommunityCard from '@/components/CommunityCard';
import NavigationBar from '@/components/NavigationBar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

export default function Index() {
  const [activeTab, setActiveTab] = useState('events');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('все');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>([]);

  const categories = ['все', 'спорт', 'творчество', 'образование', 'развлечения', 'музыка', 'технологии'];

  const events = [
    {
      id: '1',
      title: 'Футбольный турнир "Кубок Липецка"',
      category: 'спорт',
      date: '25 декабря',
      time: '14:00',
      location: 'Стадион "Металлург"',
      participants: 42,
      description: 'Открытый турнир для молодежных команд. Приходи со своей командой или присоединяйся к новым знакомым!'
    },
    {
      id: '2',
      title: 'Мастер-класс по граффити',
      category: 'творчество',
      date: '22 декабря',
      time: '16:00',
      location: 'Арт-пространство "Циферблат"',
      participants: 18,
      description: 'Научись создавать уличное искусство от профессиональных художников. Все материалы предоставляются.'
    },
    {
      id: '3',
      title: 'Хакатон: Создай приложение',
      category: 'образование',
      date: '28-29 декабря',
      time: '10:00',
      location: 'Коворкинг "Точка кипения"',
      participants: 65,
      description: '48-часовой марафон по разработке. Найди команду, реализуй идею и получи призы!'
    },
    {
      id: '4',
      title: 'Новогодняя вечеринка',
      category: 'развлечения',
      date: '31 декабря',
      time: '20:00',
      location: 'Клуб "Underground"',
      participants: 120,
      description: 'Встречай Новый Год с молодежью Липецка! DJ-сет, конкурсы, фотозона и море позитива.'
    }
  ];

  const communities = [
    {
      id: '1',
      name: 'Беговой клуб Липецка',
      category: 'спорт',
      description: 'Пробежки каждое утро в парке. Присоединяйся к здоровому образу жизни!',
      members: 87
    },
    {
      id: '2',
      name: 'Творческая лаборатория',
      category: 'творчество',
      description: 'Художники, музыканты, писатели — место для креативных экспериментов.',
      members: 54
    },
    {
      id: '3',
      name: 'IT-комьюнити Липецк',
      category: 'технологии',
      description: 'Разработчики, дизайнеры и все, кто интересуется технологиями.',
      members: 143
    },
    {
      id: '4',
      name: 'Киноклуб "48 кадров"',
      category: 'развлечения',
      description: 'Смотрим и обсуждаем авторское кино каждую пятницу.',
      members: 32
    },
    {
      id: '5',
      name: 'Музыкальная гостиная',
      category: 'музыка',
      description: 'Акустические концерты, джем-сейшены, обмен опытом между музыкантами.',
      members: 76
    },
    {
      id: '6',
      name: 'Языковой клуб',
      category: 'образование',
      description: 'Практика английского, немецкого, испанского с носителями и энтузиастами.',
      members: 98
    }
  ];

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const toggleJoin = (id: string) => {
    setJoinedCommunities(prev =>
      prev.includes(id) ? prev.filter(com => com !== id) : [...prev, id]
    );
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'все' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         community.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'все' || community.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Липецк Live
              </h1>
              <p className="text-sm text-muted-foreground">Твоя молодежная афиша</p>
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Icon name="Bell" size={24} className="text-foreground" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-secondary rounded-full animate-pulse" />
            </Button>
          </div>

          <div className="relative">
            <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск событий, сообществ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/50 border-border/50 focus:border-primary transition-colors"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {categories.map((cat) => (
            <Badge
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`cursor-pointer whitespace-nowrap px-4 py-2 transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg scale-105'
                  : 'bg-card/50 text-foreground hover:bg-card hover:scale-105'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Badge>
          ))}
        </div>

        {activeTab === 'events' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Ближайшие события
              </h2>
              <span className="text-sm text-muted-foreground">
                {filteredEvents.length} событий
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  {...event}
                  isFavorite={favorites.includes(event.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-16 animate-fade-in">
                <Icon name="SearchX" size={64} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">Ничего не найдено</h3>
                <p className="text-muted-foreground">Попробуйте изменить фильтры или поисковый запрос</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'communities' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Сообщества по интересам
              </h2>
              <Button className="bg-gradient-to-r from-secondary to-accent text-secondary-foreground font-semibold">
                <Icon name="Plus" size={18} className="mr-2" />
                Создать
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCommunities.map((community) => (
                <CommunityCard
                  key={community.id}
                  {...community}
                  isJoined={joinedCommunities.includes(community.id)}
                  onToggleJoin={toggleJoin}
                />
              ))}
            </div>

            {filteredCommunities.length === 0 && (
              <div className="text-center py-16 animate-fade-in">
                <Icon name="Users" size={64} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">Ничего не найдено</h3>
                <p className="text-muted-foreground">Попробуйте изменить фильтры или создайте свое сообщество</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="text-center py-16 animate-fade-in">
            <Icon name="Calendar" size={64} className="mx-auto text-primary mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">Календарь событий</h3>
            <p className="text-muted-foreground mb-6">Планируй участие и не пропускай важные мероприятия</p>
            <Button className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
              Открыть календарь
            </Button>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="text-center py-16 animate-fade-in">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-4 flex items-center justify-center">
                  <Icon name="User" size={48} className="text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-1">Твой профиль</h3>
                <p className="text-muted-foreground">Управляй подписками и интересами</p>
              </div>

              <div className="space-y-4 text-left bg-card/50 rounded-lg p-6 border border-border/50">
                <div className="flex items-center justify-between py-3 border-b border-border/30">
                  <div className="flex items-center gap-3">
                    <Icon name="Heart" size={20} className="text-secondary" />
                    <span className="font-medium">Избранное</span>
                  </div>
                  <Badge className="bg-secondary/20 text-secondary">{favorites.length}</Badge>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border/30">
                  <div className="flex items-center gap-3">
                    <Icon name="Users" size={20} className="text-accent" />
                    <span className="font-medium">Мои группы</span>
                  </div>
                  <Badge className="bg-accent/20 text-accent-foreground">{joinedCommunities.length}</Badge>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Icon name="CalendarCheck" size={20} className="text-primary" />
                    <span className="font-medium">Предстоящие</span>
                  </div>
                  <Badge className="bg-primary/20 text-primary">3</Badge>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <NavigationBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
