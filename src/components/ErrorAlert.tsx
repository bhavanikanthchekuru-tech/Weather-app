import React from 'react';
import { AlertCircle, X, RotateCcw } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onDismiss: () => void;
  onRetry?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  onDismiss,
  onRetry,
}) => {
  return (
    <div
      id="weather-error-banner"
      role="alert"
      className="max-w-3xl mx-auto w-full p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 shadow-xl flex items-start justify-between gap-3 animate-fade-in"
    >
      <div className="flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div>
          <h4 id="error-title" className="text-sm font-bold text-rose-100">
            Search or Weather Error
          </h4>
          <p id="error-message" className="text-xs text-rose-300 mt-0.5 leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 shrink-0">
        {onRetry && (
          <button
            id="btn-retry-error"
            onClick={onRetry}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold border border-rose-500/40 transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        )}
        <button
          id="btn-dismiss-error"
          onClick={onDismiss}
          className="p-1 rounded-lg text-rose-400 hover:text-rose-100 hover:bg-rose-500/20 transition"
          title="Dismiss error"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
