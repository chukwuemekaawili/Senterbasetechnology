import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Zap, Home, Clock, Users, Shield, Sun, Tv, Phone, Award, TrendingUp, Target, CheckCircle, Star, Heart, LucideIcon } from "lucide-react";
import { useStats } from "@/hooks/useStats";
import { AdminEditButton } from "@/components/admin/AdminEditButton";

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

// Fallback stats if database is empty
const fallbackStats = [
  { icon: "Home", value: 500, suffix: "+", label: "Projects Delivered", subtext: "since 2014" },
  { icon: "Users", value: 850, suffix: "+", label: "Satisfied Clients", subtext: "across FCT" },
  { icon: "Clock", value: 10, suffix: "+", label: "Years Experience", subtext: "in the field" },
  { icon: "Zap", value: 24, suffix: "/7", label: "Support Available", subtext: "always ready" },
];

const AnimatedCounter = ({ 
  value, 
  suffix, 
  inView 
}: { 
  value: number; 
  suffix: string; 
  inView: boolean 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, inView]);

  return (
    <span className="font-heading text-4xl md:text-5xl font-bold text-secondary">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const StatsCounter = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { data: dbStats, isLoading } = useStats();

  // Use database stats if available, otherwise fallback
  const stats = dbStats && dbStats.length > 0 
    ? dbStats.filter(s => s.published).map(s => ({
        icon: s.icon,
        value: s.value,
        suffix: s.suffix,
        label: s.label,
        subtext: s.subtext || "",
      }))
    : fallbackStats;

  if (isLoading) {
    return (
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="w-14 h-14 bg-white/10 rounded-full mx-auto mb-3" />
                <div className="h-10 bg-white/10 rounded w-24 mx-auto mb-2" />
                <div className="h-4 bg-white/10 rounded w-32 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="py-16 bg-primary relative">
      {/* Admin Edit Button */}
      <div className="absolute top-4 right-4 z-10">
        <AdminEditButton href="/admin/stats" label="Edit Stats" />
      </div>
      <div className="container mx-auto px-4">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          {stats.map((stat, index) => {
            const IconComponent = iconMap[stat.icon] || Zap;
            return (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="flex justify-center mb-3">
                  <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center">
                    <IconComponent className="w-7 h-7 text-secondary" />
                  </div>
                </div>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} inView={isInView} />
                <p className="font-body text-primary-foreground mt-2 text-sm md:text-base font-medium">
                  {stat.label}
                </p>
                <p className="font-body text-primary-foreground/60 text-xs mt-0.5">
                  {stat.subtext}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsCounter;
