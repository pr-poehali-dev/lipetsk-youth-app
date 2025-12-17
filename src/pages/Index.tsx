import { useState, useEffect } from 'react';
import EventCard from '@/components/EventCard';
import CommunityCard from '@/components/CommunityCard';
import NavigationBar from '@/components/NavigationBar';
import ChatWindow from '@/components/ChatWindow';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Event {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  description: string;
}

interface Community {
  id: string;
  name: string;
  category: string;
  description: string;
  members: number;
}

export default function Index() {
  const [activeTab, setActiveTab] = useState('events');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('все');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
    fetchCommunities();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/af47ddec-f8cf-44df-937b-46be8a87af18');
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunities = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/39a2fb46-48e4-438e-ad34-303a064e0bfd');
      const data = await response.json();
      setCommunities(data.communities || []);
    } catch (error) {
      console.error('Error fetching communities:', error);
    }
  };

  const categories = ['все', 'спорт', 'творчество', 'образование', 'развлечения', 'музыка', 'технологии'];

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

            {loading ? (
              <div className="text-center py-16">
                <Icon name="Loader2" size={48} className="mx-auto text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">Загружаем события...</p>
              </div>
            ) : (
              <>
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
              </>
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

        {activeTab === 'chat' && (
          <div className="h-[calc(100vh-12rem)] animate-fade-in">
            <ChatWindow />
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