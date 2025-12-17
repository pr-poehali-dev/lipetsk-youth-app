import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface CommunityCardProps {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  isJoined?: boolean;
  onToggleJoin?: (id: string) => void;
}

export default function CommunityCard({
  id,
  name,
  description,
  members,
  category,
  isJoined = false,
  onToggleJoin
}: CommunityCardProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const getCategoryIcon = (cat: string) => {
    const icons: Record<string, string> = {
      'спорт': 'Dumbbell',
      'творчество': 'Palette',
      'образование': 'GraduationCap',
      'развлечения': 'PartyPopper',
      'музыка': 'Music',
      'технологии': 'Laptop'
    };
    return icons[cat.toLowerCase()] || 'Users';
  };

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm hover:bg-card transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-secondary/10 animate-scale-in">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardContent className="p-6 relative">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20 group-hover:border-primary transition-colors">
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground font-bold text-lg">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1 text-foreground group-hover:text-secondary transition-colors">
              {name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name={getCategoryIcon(category)} size={14} className="text-accent" />
              <span>{category}</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-foreground/80">
            <Icon name="Users" size={16} className="text-primary" />
            <span className="font-medium">{members} человек</span>
          </div>

          <Button
            onClick={() => onToggleJoin?.(id)}
            variant={isJoined ? 'outline' : 'default'}
            size="sm"
            className={isJoined 
              ? 'border-primary text-primary hover:bg-primary hover:text-primary-foreground' 
              : 'bg-gradient-to-r from-secondary to-accent text-secondary-foreground font-semibold shadow-md'
            }
          >
            {isJoined ? (
              <>
                <Icon name="Check" size={14} className="mr-1" />
                В группе
              </>
            ) : (
              <>
                <Icon name="Plus" size={14} className="mr-1" />
                Вступить
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
