import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  message?: string;
  fullscreen?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const Loading: React.FC<LoadingProps> = ({ 
  message = "Loading...", 
  fullscreen = true,
  size = 'medium' 
}) => {
  const sizeMap = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  };

  return (
    <div
      className={`flex flex-col items-center justify-center ${fullscreen ? "h-[calc(100vh-8rem)] w-full" : "py-8 w-full"}`}
      data-testid="loading-component"
    >
      <Loader2 className={`${sizeMap[size]} animate-spin text-primary mb-2`} />
      {message && (
        <span className="text-sm font-medium text-muted-foreground">{message}</span>
      )}
    </div>
  );
};

export default Loading;
