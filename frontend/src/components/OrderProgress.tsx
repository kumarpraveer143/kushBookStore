
import { Progress } from "@/components/ui/progress";
import { OrderStatus } from "@/lib/types";
import { calculateOrderProgress } from "@/lib/data";
import { CheckCircle, Truck, Package, Home, ShoppingBag } from "lucide-react";

interface OrderProgressProps {
  status: OrderStatus;
}

export function OrderProgress({ status }: OrderProgressProps) {
  const progress = calculateOrderProgress(status);
  
  return (
    <div className="w-full space-y-4">
      <Progress value={progress} className="h-2" />
      
      <div className="grid grid-cols-5 gap-1 text-xs md:text-sm">
        <StatusItem 
          label="Order Placed" 
          completed={progress >= 0} 
          active={status === "pending"} 
          icon={<ShoppingBag className="w-4 h-4" />}
        />
        <StatusItem 
          label="Processing" 
          completed={progress >= 25} 
          active={status === "processing"} 
          icon={<Package className="w-4 h-4" />}
        />
        <StatusItem 
          label="Shipped" 
          completed={progress >= 50} 
          active={status === "shipped"} 
          icon={<Truck className="w-4 h-4" />}
        />
        <StatusItem 
          label="Out for Delivery" 
          completed={progress >= 75} 
          active={status === "out-for-delivery"} 
          icon={<Home className="w-4 h-4" />}
        />
        <StatusItem 
          label="Delivered" 
          completed={progress >= 100} 
          active={status === "delivered"} 
          icon={<CheckCircle className="w-4 h-4" />}
        />
      </div>
    </div>
  );
}

interface StatusItemProps {
  label: string;
  completed: boolean;
  active: boolean;
  icon: React.ReactNode;
}

function StatusItem({ label, completed, active, icon }: StatusItemProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center
        ${completed 
          ? "bg-primary text-primary-foreground" 
          : "bg-muted text-muted-foreground"}
        ${active ? "ring-2 ring-primary ring-offset-2" : ""}
      `}>
        {completed ? <CheckCircle className="w-4 h-4" /> : icon}
      </div>
      <span className={`text-center ${active ? "font-medium" : ""}`}>
        {label}
      </span>
    </div>
  );
}
