# Plukos Recipes

A modern, full-stack recipe management application that combines elegant design with powerful functionality for organizing and sharing culinary creations.

## 🎯 Core Functionality

### Recipe Management
- **Create & Edit Recipes**: Rich form interface with dynamic ingredient/instruction lists, image uploads, and rating system
- **Recipe Discovery**: Browse all recipes with advanced search and filtering capabilities
- **Personal Collections**: Manage your own recipes with full CRUD operations
- **Recipe Import**: Import recipes from external URLs with automatic parsing

### User Experience Features
- **Smart Search**: Real-time search across recipe titles, descriptions, and tags
- **Advanced Filtering**: Multi-tag filtering with visual tag management
- **Favorites System**: Save and organize favorite recipes with persistent storage
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Theme Support**: Light/dark mode with system preference detection

### Authentication & Authorization
- **Mock Authentication**: Simulated login/registration system for demonstration
- **Protected Routes**: Secure access to user-specific features
- **Ownership Controls**: Edit permissions based on recipe authorship
- **Session Management**: Persistent user sessions with localStorage

## 🎨 Design Philosophy

### Modern UI/UX Principles
- **Component-Driven Architecture**: Built with reusable, composable UI components
- **Accessibility-First**: WCAG-compliant design with proper ARIA labels and keyboard navigation
- **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with interactivity
- **Performance Optimized**: Next.js 15 with React 19 for optimal loading and rendering

### Visual Design System
- **Design System**: shadcn/ui components with Radix UI primitives for consistency
- **Typography**: Inter font family with clear hierarchy and readable text
- **Color Palette**: HSL-based color system with semantic naming (primary, secondary, muted, etc.)
- **Spacing**: Consistent 4px grid system for predictable layouts
- **Animations**: Subtle transitions and micro-interactions for enhanced UX

### Layout & Navigation
- **Sticky Header**: Persistent navigation with user context
- **Card-Based Layout**: Recipe cards with hover effects and clear information hierarchy
- **Tabbed Interface**: Organized content sections (All Recipes, Favorites, Created)
- **Breadcrumb Navigation**: Clear path indication for complex workflows
- **Modal Dialogs**: Contextual actions without page navigation

## 🛠 Technical Architecture

### Frontend Stack
- **Framework**: Next.js 15 with App Router for modern React development
- **Language**: TypeScript for type safety and developer experience
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **Icons**: Lucide React for consistent iconography
- **State Management**: React Context API for global state
- **Forms**: React Hook Form with Zod validation
- **Notifications**: Sonner for toast notifications

### Key Design Patterns
- **Compound Components**: Complex UI elements built from smaller, reusable parts
- **Custom Hooks**: Encapsulated logic for favorites, authentication, and form handling
- **Protected Routes**: Higher-order components for authentication gating
- **Error Boundaries**: Graceful error handling with user-friendly messages
- **Loading States**: Skeleton loaders and progressive loading for better UX

### Component Architecture

components/
├── ui/ # Base UI components (shadcn/ui)
│ ├── button.tsx # Variant-based button system
│ ├── card.tsx # Content containers
│ ├── input.tsx # Form inputs
│ └── ...
├── recipe-card.tsx # Recipe display component
├── recipe-list.tsx # Grid layout with search/filter
├── recipe-filter.tsx # Tag-based filtering
├── recipe-actions.tsx # Contextual action buttons
├── header.tsx # Navigation and user menu
├── mode-toggle.tsx # Theme switching
└── protected-route.tsx # Authentication wrapper


## 🚀 Features in Detail

### Recipe Creation & Editing
- **Dynamic Lists**: Add/remove/reorder ingredients and instructions
- **Image Management**: URL input or file upload with preview
- **Tag System**: Custom tags with visual management
- **Rating Interface**: 5-star rating system
- **Form Validation**: Real-time validation with error messages
- **Auto-save**: Draft preservation (planned feature)

### Search & Discovery
- **Real-time Search**: Instant filtering as you type
- **Multi-criteria Filtering**: Search by title, tags, or ingredients
- **Tag Cloud**: Visual tag selection with active state indicators
- **Clear Filters**: One-click filter reset
- **Empty States**: Helpful messaging when no results found

### User Interface Elements
- **Responsive Grid**: Adaptive card layout (1-3 columns based on screen size)
- **Hover Effects**: Subtle animations and state changes
- **Loading States**: Skeleton loaders during data fetching
- **Error Handling**: User-friendly error messages with retry options
- **Toast Notifications**: Non-intrusive success/error feedback

### Theme & Accessibility
- **Dark/Light Mode**: Seamless theme switching
- **System Preference**: Automatic theme detection
- **High Contrast**: Accessible color combinations
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and semantic HTML

## 🔧 Development Features

### Developer Experience
- **TypeScript**: Full type safety with strict configuration
- **ESLint**: Code quality and consistency enforcement
- **Hot Reload**: Instant development feedback
- **Component Isolation**: Reusable, testable components
- **API Integration**: Type-safe API calls with error handling

### Performance Optimizations
- **Next.js Image**: Optimized image loading and sizing
- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Component-level lazy loading
- **Caching**: Strategic caching for API responses
- **Bundle Optimization**: Tree shaking and dead code elimination

## 📱 Responsive Design

### Breakpoint Strategy
- **Mobile First**: Designed for mobile, enhanced for larger screens
- **Flexible Grid**: CSS Grid and Flexbox for adaptive layouts
- **Touch Friendly**: Appropriate touch targets and gestures
- **Content Priority**: Important content prioritized on smaller screens

### Device Optimization
- **Mobile (320px+)**: Single column layout, simplified navigation
- **Tablet (768px+)**: Two-column grid, expanded navigation
- **Desktop (1024px+)**: Three-column grid, full feature set
- **Large Desktop (1400px+)**: Centered content with optimal reading width

## 🎯 User Journey

### New User Experience
1. **Landing**: Browse public recipes without authentication
2. **Registration**: Simple sign-up process
3. **Onboarding**: Guided recipe creation
4. **Discovery**: Explore and favorite recipes
5. **Creation**: Build personal recipe collection

### Power User Features
- **Bulk Operations**: Multiple recipe management
- **Advanced Search**: Complex filtering and sorting
- **Import Tools**: External recipe integration
- **Export Options**: Recipe sharing and backup
- **Analytics**: Usage insights and preferences

## 🔮 Future Enhancements

### Planned Features
- **Recipe Sharing**: Social features and community
- **Meal Planning**: Weekly planning and shopping lists
- **Nutritional Info**: Automatic nutrition calculation
- **Voice Commands**: Hands-free recipe navigation
- **Offline Support**: PWA capabilities for offline use
- **Recipe Scaling**: Automatic ingredient scaling
- **Cooking Timer**: Built-in cooking timers
- **Photo Gallery**: Multiple recipe photos
- **Recipe Reviews**: Community rating and reviews

This application represents a modern approach to recipe management, combining beautiful design with powerful functionality to create an exceptional user experience for culinary enthusiasts.