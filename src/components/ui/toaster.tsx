"use client"

import { useToast } from "@/hooks/use-toast"

export function Toaster() {
    const { toasts } = useToast()

    return (
        <div className="fixed top-0 right-0 z-50 flex flex-col gap-2 p-4">
            {toasts.map(({ id, title, description }) => (
                <div
                    key={id}
                    className="bg-white rounded-lg shadow-lg p-4 min-w-[300px] border border-gray-200"
                >
                    {title && <p className="font-semibold text-gray-900">{title}</p>}
                    {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
                </div>
            ))}
        </div>
    )
}