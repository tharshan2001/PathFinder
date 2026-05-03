import { useEffect, useCallback } from 'react';
import { useToastStore } from '../stores/toastStore';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const styleMap = {
  success: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-600', text: 'text-emerald-800', progress: 'bg-emerald-500' },
  error: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-600', text: 'text-red-800', progress: 'bg-red-500' },
  warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-600', text: 'text-amber-800', progress: 'bg-amber-500' },
  info: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600', text: 'text-blue-800', progress: 'bg-blue-500' },
};

const ToastItem = ({ toast }) => {
  const { id, message, type, duration } = toast;
  const removeToast = useToastStore((state) => state.removeToast);
  const styles = styleMap[type] || styleMap.info;
  const Icon = iconMap[type] || iconMap.info;

  const handleDismiss = useCallback(() => {
    removeToast(id);
  }, [id, removeToast]);

  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(handleDismiss, duration);
    return () => clearTimeout(timer);
  }, [id, duration, handleDismiss]);

  return (
    <div className={`relative overflow-hidden rounded-xl border ${styles.bg} ${styles.border} shadow-lg backdrop-blur-sm animate-slide-in-right`}>
      <div className="flex items-start gap-3 p-4 pr-10">
        <Icon size={20} className={`shrink-0 mt-0.5 ${styles.icon}`} />
        <p className={`text-sm font-medium ${styles.text} flex-1`}>{message}</p>
        <button
          onClick={handleDismiss}
          className={`absolute top-3 right-3 p-1 rounded-lg hover:bg-black/5 transition-colors ${styles.icon}`}
        >
          <X size={14} />
        </button>
      </div>
      {duration && (
        <div className={`h-0.5 ${styles.progress} opacity-40`} style={{ animation: `shrink ${duration}ms linear forwards` }} />
      )}
    </div>
  );
};

export const ToastContainer = () => {
  const toasts = useToastStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 w-96 max-w-[calc(100vw-2rem)]">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </div>
    </>
  );
};
