import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface EventCardProps {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  description: string;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export default function EventCard({
  id,
  title,
  category,
  date,
  time,
  location,
  participants,
  description,
  isFavorite = false,
  onToggleFavorite
}: EventCardProps) {
  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      'спорт': 'bg-accent text-accent-foreground',
      'творчество': 'bg-secondary text-secondary-foreground',
      'образование': 'bg-primary text-primary-foreground',
      'развлечения': 'bg-muted text-foreground'
    };
    return colors[cat.toLowerCase()] || 'bg-muted text-foreground';
  };

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm hover:bg-card transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10 animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardContent className="p-6 relative">
        <div className="flex justify-between items-start mb-4">
          <Badge className={`${getCategoryColor(category)} font-semibold px-3 py-1`}>
            {category}
          </Badge>
          <button
            onClick={() => onToggleFavorite?.(id)}
            className="transition-transform hover:scale-110"
          >
            <Icon
              name={isFavorite ? 'Heart' : 'Heart'}
              size={20}
              className={isFavorite ? 'fill-secondary text-secondary' : 'text-muted-foreground hover:text-secondary'}
            />
          </button>
        </div>

        <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-foreground/80">
            <Icon name="Calendar" size={16} className="text-primary" />
            <span>{date}</span>
            <Icon name="Clock" size={16} className="text-primary ml-2" />
            <span>{time}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-foreground/80">
            <Icon name="MapPin" size={16} className="text-secondary" />
            <span>{location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-foreground/80">
            <Icon name="Users" size={16} className="text-accent" />
            <span>{participants} участников</span>
          </div>
        </div>

        <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold shadow-lg">
          Записаться
        </Button>
      </CardContent>
    </Card>
  );
}
