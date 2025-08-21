import * as React from "react"
import { cn } from "@/lib/utils"

const DropdownMenuContext = React.createContext()

const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef(null)

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
      <div ref={dropdownRef} className="relative">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}
DropdownMenu.displayName = "DropdownMenu"

const DropdownMenuTrigger = React.forwardRef(({ className, asChild, children, ...props }, ref) => {
  const { isOpen, setIsOpen } = React.useContext(DropdownMenuContext)
  
  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  if (asChild) {
    return React.cloneElement(children, {
      ref,
      onClick: handleClick,
      className: cn("cursor-pointer", className, children.props.className),
      ...props
    })
  }
  
  return (
    <button
      ref={ref}
      onClick={handleClick}
      className={cn("cursor-pointer", className)}
      {...props}
    >
      {children}
    </button>
  )
})
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuContent = React.forwardRef(({ className, align = "end", sideOffset = 4, children, ...props }, ref) => {
  const { isOpen } = React.useContext(DropdownMenuContext)

  if (!isOpen) return null

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 shadow-lg",
        align === "end" ? "right-0" : "left-0",
        "top-full mt-1",
        "animate-in fade-in-0 zoom-in-95 duration-100",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef(({ className, inset, asChild, children, onClick, ...props }, ref) => {
  const { setIsOpen } = React.useContext(DropdownMenuContext)
  
  const handleClick = (e) => {
    if (onClick) {
      onClick(e)
    }
    setIsOpen(false)
  }

  if (asChild) {
    return React.cloneElement(children, {
      ref,
      onClick: handleClick,
      className: cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900",
        inset && "pl-8",
        className,
        children.props.className
      ),
      ...props
    })
  }
  
  return (
    <div
      ref={ref}
      onClick={handleClick}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
DropdownMenuItem.displayName = "DropdownMenuItem"

const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-gray-100", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
}
