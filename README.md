# EVOKE - Event Management Platform

EVOKE is a modern event management and ticketing platform that enables users to discover, create, and manage unforgettable events. Built with React, TypeScript, and Vite, it provides a seamless experience for event organizers and attendees alike.

## 🚀 Features

### For Event Organizers
- **Event Creation & Management**: Create and manage events with detailed information
- **Ticket Management**: Set up different ticket types and pricing tiers
- **QR Code Integration**: Generate and scan QR codes for ticket validation
- **Event Dashboard**: Comprehensive analytics and management tools
- **Real-time Updates**: Live updates for event changes and notifications

### For Event Attendees
- **Event Discovery**: Browse and discover events in your area
- **Ticket Purchase**: Secure ticket purchasing with multiple payment options
- **Digital Tickets**: QR code-based digital tickets for easy access
- **Event Calendar**: Personal calendar integration for event tracking
- **Social Features**: Connect with other attendees and share experiences

### Technical Features
- **Modern UI/UX**: Built with Tailwind CSS and Radix UI components
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **TypeScript**: Full type safety and better development experience
- **Testing**: Comprehensive test suite with Vitest and Testing Library
- **SEO Optimized**: Built-in SEO features for better discoverability
- **Performance**: Optimized bundle size and loading times

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Testing**: Vitest, Testing Library
- **Build Tools**: Vite, TypeScript
- **Code Quality**: ESLint, Prettier

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/coded00/EvokeNew.git
cd EvokeNew
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173)

### 4. Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/            # Base UI components (buttons, inputs, etc.)
│   └── ErrorBoundary.tsx
├── screens/           # Page components
│   ├── Home/
│   ├── CreateEvent/
│   ├── EventDetail/
│   └── ...
├── lib/              # Utilities and services
│   ├── hooks/        # Custom React hooks
│   ├── store.ts      # State management
│   └── utils.ts      # Helper functions
├── assets/           # Static assets (icons, images)
└── test/            # Test setup and utilities
```

## 🧪 Testing

### Run Tests
```bash
npm test              # Run tests in watch mode
npm run test:run      # Run tests once
npm run test:ui       # Run tests with UI
npm run test:coverage # Run tests with coverage
```

### Testing Guidelines
- Write tests for all new components and features
- Maintain good test coverage
- Use Testing Library for component testing
- Follow testing best practices

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run analyze` - Analyze bundle size
- `npm run lighthouse` - Run Lighthouse performance audit

## 📝 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages

### Component Guidelines
- Use functional components with hooks
- Implement proper TypeScript interfaces
- Follow component naming conventions
- Keep components focused and reusable

### State Management
- Use Zustand for global state
- Keep local state in components when appropriate
- Follow state management best practices

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url_here
VITE_APP_NAME=EVOKE
```

### Tailwind Configuration
The project uses Tailwind CSS with custom configuration in `tailwind.config.js`.

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Pull Request Guidelines
- Provide a clear description of changes
- Include screenshots for UI changes
- Ensure all tests pass
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/coded00/EvokeNew/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🎯 Roadmap

- [ ] Advanced event analytics
- [ ] Multi-language support
- [ ] Mobile app development
- [ ] Payment gateway integration
- [ ] Social media integration
- [ ] Advanced search and filtering
- [ ] Real-time notifications
- [ ] Event recommendations

---

**Built with ❤️ by the EVOKE Team, more features ate still being built.**
