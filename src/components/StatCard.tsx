import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  className?: string;
}

const StatCard = ({ title, value, icon, trend, className }: Props) => (
  <div className={cn("bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-elevated transition-shadow", className)}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-heading font-bold mt-1">{value}</p>
        {trend && <p className="text-xs text-success mt-1">{trend}</p>}
      </div>
      <div className="p-2.5 rounded-lg bg-accent text-accent-foreground">{icon}</div>
    </div>
  </div>
);

export default StatCard;
