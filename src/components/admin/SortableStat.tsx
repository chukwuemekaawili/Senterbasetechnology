import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, GripVertical, Zap, Home, Clock, Users, Shield, Sun, Tv, Phone, Award, TrendingUp, Target, CheckCircle, Star, Heart, LucideIcon } from "lucide-react";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Zap,
  Home,
  Clock,
  Users,
  Shield,
  Sun,
  Tv,
  Phone,
  Award,
  TrendingUp,
  Target,
  CheckCircle,
  Star,
  Heart,
};

interface StatDB {
  id: string;
  icon: string;
  value: number;
  suffix: string;
  label: string;
  subtext: string | null;
  sort_order: number;
  published: boolean;
}

interface SortableStatProps {
  stat: StatDB;
  onEdit: (stat: StatDB) => void;
  onDelete: (id: string) => void;
}

export function SortableStat({ stat, onEdit, onDelete }: SortableStatProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stat.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const IconComponent = iconMap[stat.icon] || Zap;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-pointer hover:shadow-md transition-shadow ${isDragging ? "shadow-lg ring-2 ring-primary" : ""}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          {/* Drag handle */}
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded touch-none"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </button>

          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-2xl font-bold text-secondary">
              {stat.value.toLocaleString()}{stat.suffix}
            </p>
          </div>
          <Badge variant={stat.published ? "default" : "secondary"}>
            {stat.published ? "Live" : "Draft"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-base">{stat.label}</CardTitle>
        {stat.subtext && (
          <CardDescription className="text-sm">{stat.subtext}</CardDescription>
        )}
        <div className="flex gap-2 mt-3">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(stat);
            }}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(stat.id);
            }}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
