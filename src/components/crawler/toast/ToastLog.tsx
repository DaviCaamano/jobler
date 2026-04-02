import '@components/crawler/toast/ToastLog.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChromeMessage } from '@interfaces/tab-messages';

const TOAST_VISIBLE_MS = 20000;
const TOAST_FADE_MS = 500;
const MAX_TOASTS = 5;

type ToastFunction = (message: string) => void;

type ToastEntry = {
    id: number;
    message: string;
    isLeaving: boolean;
};
type ToastTimers = { leave: ReturnType<typeof setTimeout>; remove: ReturnType<typeof setTimeout> };
export const ToastLog = () => {
    const [toasts, setToasts] = useState<ToastEntry[]>([]);
    const toastTimersRef = useRef<Map<number, ToastTimers>>(new Map());
    const toastCounterRef = useRef(0);

    const clearToastTimers = useCallback((id: number) => {
        const timers = toastTimersRef.current.get(id);
        if (!timers) {
            return;
        }

        clearTimeout(timers.leave);
        clearTimeout(timers.remove);
        toastTimersRef.current.delete(id);
    }, []);

    const removeToast = useCallback(
        (id: number) => {
            clearToastTimers(id);
            setToasts((prevState) => prevState.filter((toast) => toast.id !== id));
        },
        [clearToastTimers]
    );

    const post = useCallback<ToastFunction>(
        (message) => {
            const normalizedMessage = message.trim();
            if (!normalizedMessage) {
                return;
            }

            const id = ++toastCounterRef.current;

            setToasts((prevState) => {
                const nextToasts = [
                    ...prevState,
                    { id, message: normalizedMessage, isLeaving: false },
                ];

                if (nextToasts.length <= MAX_TOASTS) {
                    return nextToasts;
                }

                const droppedToasts = nextToasts.slice(0, nextToasts.length - MAX_TOASTS);
                droppedToasts.forEach((droppedToast) => clearToastTimers(droppedToast.id));

                return nextToasts.slice(-MAX_TOASTS);
            });

            const leave = setTimeout(() => {
                setToasts((prevState) =>
                    prevState.map((item) =>
                        item.id === id
                            ? {
                                  ...item,
                                  isLeaving: true,
                              }
                            : item
                    )
                );
            }, TOAST_VISIBLE_MS);

            const remove = setTimeout(() => {
                removeToast(id);
            }, TOAST_VISIBLE_MS + TOAST_FADE_MS);

            toastTimersRef.current.set(id, { leave, remove });
        },
        [clearToastTimers, removeToast]
    );

    useEffect(() => {
        const timersMap = toastTimersRef.current;

        const handleToastMessage = (event: { type: ChromeMessage; message: unknown }) => {
            if (event?.type !== ChromeMessage.toast || typeof event?.message !== 'string') {
                return;
            }
            post(event.message);
        };

        chrome.runtime.onMessage.addListener(handleToastMessage);

        return () => {
            chrome.runtime.onMessage.removeListener(handleToastMessage);
            timersMap.forEach((timers) => {
                clearTimeout(timers.leave);
                clearTimeout(timers.remove);
            });
            timersMap.clear();
        };
    }, [post]);

    return (
        <div
            className={`toast-log_toast-log ${toasts.length ? 'is-visible' : 'is-hidden'}`}
            aria-live="polite"
        >
            <div className="toast-log_toast-list">
                {toasts.map((item) => (
                    <p
                        key={item.id}
                        className={`toast-log_toast-item ${item.isLeaving ? 'is-leaving' : ''}`}
                    >
                        {item.message}
                    </p>
                ))}
            </div>
        </div>
    );
};
