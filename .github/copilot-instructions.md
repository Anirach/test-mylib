# GitHub Copilot Instructions

## Project Overview
This is a React TypeScript book management application built with Vite, using ShadCN UI components, Tailwind CSS, React Router, React Query, and React Hook Form.

## Tech Stack
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: ShadCN UI components
- **Styling**: Tailwind CSS with tailwindcss-animate
- **Routing**: React Router DOM v6
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Code Style & Patterns

### Component Structure
- Use functional components with TypeScript
- Prefer arrow function syntax for components
- Use the `const ComponentName = () => { ... }` pattern
- Export as default at the end of the file

### File Organization
- Components go in `src/components/`
- UI components are in `src/components/ui/` (ShadCN components)
- Pages go in `src/pages/`
- Types/interfaces go in `src/types/`
- Custom hooks go in `src/hooks/`
- Utilities go in `src/lib/`

### Import Conventions
- Use absolute imports with `@/` alias for src directory
- Group imports: React/external libraries first, then internal imports
- Separate UI components from other components in imports

### TypeScript Guidelines
- Always define proper interfaces for props and data structures
- Use strict typing - avoid `any` type
- Define interfaces in separate files in `src/types/` when shared
- Use proper generic types for React Query hooks

### ShadCN UI Components
- Always import UI components from `@/components/ui/`
- Use the existing UI components instead of creating custom ones
- Follow ShadCN component patterns and props
- Use `cn()` utility from `@/lib/utils` for conditional classes

### Styling with Tailwind
- Use Tailwind CSS classes for all styling
- Prefer utility classes over custom CSS
- Use responsive design patterns with Tailwind breakpoints
- Use the `cn()` utility function for conditional styling
- Follow mobile-first approach

### State Management
- Use React Query for server state management
- Use custom hooks for complex state logic
- Keep component state local when possible
- Use React Hook Form for form state

### Form Handling
- Use React Hook Form with Zod for validation
- Create form schemas using Zod
- Use ShadCN Form components for consistent styling
- Handle form errors properly with user-friendly messages

### Routing
- Use React Router v6 patterns
- Define routes in the main App.tsx
- Create route components in `src/pages/`
- Always include a catch-all route for 404 handling

## Naming Conventions
- **Components**: PascalCase (e.g., `BookCard`, `AddBookModal`)
- **Files**: PascalCase for components, camelCase for utilities
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Interfaces**: PascalCase with descriptive names

## Best Practices

### Performance
- Use React.memo for expensive components
- Implement proper loading states with React Query
- Use Suspense boundaries where appropriate
- Optimize images and assets

### Accessibility
- Use semantic HTML elements
- Include proper ARIA labels
- Ensure keyboard navigation works
- Use ShadCN components which have built-in accessibility

### Error Handling
- Implement proper error boundaries
- Handle async errors with React Query
- Show user-friendly error messages
- Use toast notifications for feedback

### Code Quality
- Follow ESLint rules defined in the project
- Use meaningful variable and function names
- Write self-documenting code
- Add comments for complex business logic only

## Project-Specific Rules

### Book Management Context
- Books have statuses: 'owned', 'lent', 'wishlist'
- Use the `Book` and `LendingInfo` interfaces from `src/types/book.ts`
- Implement proper CRUD operations for books
- Handle lending/borrowing workflows properly

### Component Patterns
- Modal components should use ShadCN Dialog component
- Use ShadCN Card components for book displays
- Implement search functionality with proper debouncing
- Use proper loading and empty states

### Data Fetching
- Use React Query for all API calls
- Implement proper caching strategies
- Handle loading and error states consistently
- Use optimistic updates where appropriate

### Form Validation
- Use Zod schemas for all form validation
- Provide clear validation error messages
- Implement real-time validation feedback
- Handle form submission states properly

## Examples to Follow

### Component Structure
```tsx
import { ComponentProps } from "react"
import { cn } from "@/lib/utils"

interface MyComponentProps extends ComponentProps<"div"> {
  title: string
  isActive?: boolean
}

const MyComponent = ({ title, isActive = false, className, ...props }: MyComponentProps) => {
  return (
    <div className={cn("base-styles", isActive && "active-styles", className)} {...props}>
      {title}
    </div>
  )
}

export default MyComponent
```

### React Query Hook
```tsx
import { useQuery } from "@tanstack/react-query"
import { Book } from "@/types/book"

export const useBooks = () => {
  return useQuery({
    queryKey: ["books"],
    queryFn: async (): Promise<Book[]> => {
      // API call implementation
    },
  })
}
```

### Form with Validation
```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
})

type FormData = z.infer<typeof formSchema>

const BookForm = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "",
    },
  })

  const onSubmit = (data: FormData) => {
    // Handle form submission
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
      </form>
    </Form>
  )
}
```

## What NOT to Do
- Don't use class components
- Don't create custom UI components when ShadCN equivalents exist
- Don't use inline styles - use Tailwind classes
- Don't ignore TypeScript errors
- Don't use `any` type
- Don't create overly complex component hierarchies
- Don't forget to handle loading and error states
- Don't use deprecated React patterns
