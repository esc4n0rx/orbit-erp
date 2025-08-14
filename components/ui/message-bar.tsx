"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const messageBarVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-border",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive bg-destructive/10",
        warning:
          "border-yellow-500/50 text-yellow-800 dark:text-yellow-200 [&>svg]:text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20",
        success:
          "border-green-500/50 text-green-800 dark:text-green-200 [&>svg]:text-green-600 bg-green-50 dark:bg-green-900/20",
        info:
          "border-blue-500/50 text-blue-800 dark:text-blue-200 [&>svg]:text-blue-600 bg-blue-50 dark:bg-blue-900/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const iconMap = {
  default: Info,
  destructive: AlertCircle,
  warning: AlertTriangle,
  success: CheckCircle,
  info: Info,
}

export interface MessageBarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof messageBarVariants> {
  title?: string
  onClose?: () => void
  closable?: boolean
}

const MessageBar = React.forwardRef<HTMLDivElement, MessageBarProps>(
  ({ className, variant = "default", title, onClose, closable = true, children, ...props }, ref) => {
    const Icon = iconMap[variant || "default"]

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(messageBarVariants({ variant }), className)}
        {...props}
      >
        <Icon className="h-4 w-4" />
        <div className="flex-1">
          {title && (
            <h5 className="mb-1 font-medium leading-none tracking-tight">
              {title}
            </h5>
          )}
          <div className="text-sm [&_p]:leading-relaxed">
            {children}
          </div>
        </div>
        {closable && onClose && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 h-6 w-6 p-0 hover:bg-transparent"
            onClick={onClose}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Fechar</span>
          </Button>
        )}
      </div>
    )
  }
)
MessageBar.displayName = "MessageBar"

export { MessageBar, messageBarVariants }