"use client"

import * as React from "react"
import { Controller, FormProvider, useFormContext } from "react-hook-form"

const Form = FormProvider

const FormFieldContext = React.createContext<{ name: string }>({ name: "" })

const FormField = ({ ...props }: any) => {
    return (
        <FormFieldContext.Provider value={{ name: props.name }}>
            <Controller {...props} />
        </FormFieldContext.Provider>
    )
}

const FormItemContext = React.createContext<{ id: string }>({ id: "" })

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        const id = React.useId()
        return (
            <FormItemContext.Provider value={{ id }}>
                <div ref={ref} className={className} {...props} />
            </FormItemContext.Provider>
        )
    }
)
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
    ({ className, ...props }, ref) => {
        return <label ref={ref} className={className} {...props} />
    }
)
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ ...props }, ref) => {
        return <div ref={ref} {...props} />
    }
)
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => {
        return <p ref={ref} className={`text-sm text-gray-500 ${className}`} {...props} />
    }
)
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, children, ...props }, ref) => {
        const { formState } = useFormContext()
        const fieldContext = React.useContext(FormFieldContext)
        const error = formState.errors[fieldContext.name]
        const body = error ? String(error?.message) : children
        if (!body) return null
        return (
            <p ref={ref} className={`text-sm font-medium text-red-500 ${className}`} {...props}>
                {body}
            </p>
        )
    }
)
FormMessage.displayName = "FormMessage"

export { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField }