import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  message?: string;
  fullscreen?: boolean;
  size?: 'xs' | 'small' | 'medium' | 'large';
}

const Loading: React.FC<LoadingProps> = ({ 
  message = "Loading...", 
  fullscreen = true,
  size = 'medium'
}) => {
  const sizeMap = {
    xs: { icon: 'h-2 w-2', text: 'text-xs' },
    small: { icon: 'h-4 w-4', text: 'text-sm' },
    medium: { icon: 'h-8 w-8', text: 'text-base' },
    large: { icon: 'h-12 w-12', text: 'text-lg' },
  };

  return (
    <div
      className={`flex flex-row items-center justify-center space-x-2 ${fullscreen ? "h-[calc(100vh-8rem)] w-full" : "py-8 w-full"}`}
      data-testid="loading-component"
    >
      <Loader2 className={`${sizeMap[size].icon} animate-spin text-primary`} />
      {message && (
        <span className={`${sizeMap[size].text} font-medium text-muted-foreground`}>{message}</span>
      )}
    </div>
  );
};

export default Loading;
