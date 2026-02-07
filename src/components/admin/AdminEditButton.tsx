import { Link } from "react-router-dom";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface AdminEditButtonProps {
  /** The admin route to navigate to (e.g., "/admin/content" or "/admin/team") */
  href: string;
  /** Optional label for the button tooltip */
  label?: string;
  /** Optional className for custom positioning */
  className?: string;
}

/**
 * A floating edit button that only appears for authenticated admin users.
 * Place this component within sections that should be editable.
 */
export function AdminEditButton({ href, label = "Edit", className = "" }: AdminEditButtonProps) {
  const { isAdmin, isLoading } = useAuth();

  // Don't render anything for non-admins
  if (isLoading || !isAdmin) {
    return null;
  }

  return (
    <Link to={href} className={className}>
      <Button
        variant="secondary"
        size="sm"
        className="gap-1.5 shadow-md hover:shadow-lg transition-shadow opacity-80 hover:opacity-100"
      >
        <Edit className="h-3.5 w-3.5" />
        <span className="text-xs">{label}</span>
      </Button>
    </Link>
  );
}
