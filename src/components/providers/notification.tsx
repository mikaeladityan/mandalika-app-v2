// components/providers/notification-toast-provider.tsx
"use client";

import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { toast } from "sonner";
import { notificationAtom } from "@/shared/store";

export function NotificationToastProvider() {
    const notification = useAtomValue(notificationAtom);

    useEffect(() => {
        if (!notification?.message) return;

        toast.success(notification.title, {
            duration: 4000,
            description: notification.message ? (
                <p className="text-xs text-gray-600 font-medium">{notification.message}</p>
            ) : undefined,
        });
    }, [notification]);

    return null;
}
