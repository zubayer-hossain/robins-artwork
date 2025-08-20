import * as React from "react"
import { cn } from "@/lib/utils"

const Select = React.forwardRef(({ className, children, value, onValueChange, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false)
  
  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.select-container')) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])
  
  return (
    <div ref={ref} className={cn("relative select-container", className)} {...props}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          // Check displayName to identify component types
          if (child.type.displayName === "SelectTrigger") {
            return React.cloneElement(child, {
              isOpen,
              setIsOpen,
              value
            })
          } else if (child.type.displayName === "SelectContent") {
            return React.cloneElement(child, {
              isOpen,
              setIsOpen,
              onValueChange
            })
          }
          return child
        }
        return child
      })}
    </div>
  )
})
Select.displayName = "Select"

const SelectTrigger = React.forwardRef(({ className, children, isOpen, setIsOpen, value, placeholder, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500",
      className
    )}
    onClick={() => setIsOpen(!isOpen)}
    {...props}
  >
    <span className="block truncate">
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type.displayName === "SelectValue") {
          return React.cloneElement(child, { value })
        }
        return child
      }) || (value && value !== 'all' ? value : placeholder || "Select option...")}
    </span>
    <svg className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>
))
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = React.forwardRef(({ className, placeholder, value, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("block truncate", className)}
    {...props}
  >
    {value && value !== 'all' ? value : placeholder}
  </span>
))
SelectValue.displayName = "SelectValue"

const SelectContent = React.forwardRef(({ className, children, isOpen, setIsOpen, onValueChange, ...props }, ref) => {
  if (!isOpen) return null
  
  return (
    <div
      ref={ref}
      className={cn(
        "absolute top-full z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg mt-1",
        className
      )}
      {...props}
    >
      <div className="p-1">
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              isOpen,
              setIsOpen,
              onValueChange
            })
          }
          return child
        })}
      </div>
    </div>
  )
})
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef(({ className, children, value, isOpen, setIsOpen, onValueChange, ...props }, ref) => {
  const handleClick = () => {
    if (onValueChange) {
      onValueChange(value)
    }
    if (setIsOpen) {
      setIsOpen(false)
    }
  }

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900",
        className
      )}
      onClick={handleClick}
      data-value={value}
      {...props}
    >
      {children}
    </button>
  )
})
SelectItem.displayName = "SelectItem"

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
}
