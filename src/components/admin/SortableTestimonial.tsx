import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, GripVertical, Star } from "lucide-react";

interface TestimonialDB {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  initials: string;
  sort_order: number;
  published: boolean;
}

interface SortableTestimonialProps {
  testimonial: TestimonialDB;
  onEdit: (testimonial: TestimonialDB) => void;
  onDelete: (id: string) => void;
}

export function SortableTestimonial({ testimonial, onEdit, onDelete }: SortableTestimonialProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: testimonial.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-pointer hover:shadow-md transition-shadow ${isDragging ? "shadow-lg ring-2 ring-primary" : ""}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          {/* Drag handle */}
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded touch-none mt-1"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </button>

          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <span className="font-heading font-bold text-primary-foreground">
                {testimonial.initials}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base truncate">{testimonial.name}</CardTitle>
              <p className="text-sm text-muted-foreground truncate">{testimonial.role}</p>
            </div>
          </div>
          <Badge variant={testimonial.published ? "default" : "secondary"}>
            {testimonial.published ? "Live" : "Draft"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-0.5 mb-2">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
          ))}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          "{testimonial.content}"
        </p>
        <div className="flex gap-2 mt-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="-ml-2"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(testimonial);
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
              onDelete(testimonial.id);
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
