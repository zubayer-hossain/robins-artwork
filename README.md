# Robin's Artwork - Artist Portfolio & Store

A modern, production-ready artist portfolio and online store built with Laravel 11, Inertia.js, React, and Tailwind CSS. Features a public gallery, secure checkout with Stripe, and a comprehensive admin panel for managing artworks, editions, and orders.

## 🚀 Features

### Public Storefront
- **Gallery**: Browse and filter artworks by medium, year, price, and tags
- **Artwork Details**: View high-resolution images, artist stories, and purchase options
- **Checkout**: Secure Stripe-powered checkout for one-time payments
- **Responsive Design**: Mobile-first design with Tailwind CSS and shadcn/ui components

### Admin Panel
- **Dashboard**: Overview of sales, inventory, and customer metrics
- **Artwork Management**: CRUD operations for artworks with image uploads
- **Edition Management**: Create and manage limited/open editions
- **Order Management**: View and manage customer orders
- **User Management**: Role-based access control for admins and customers

### Technical Features
- **Image Pipeline**: Automatic image conversions (thumb, medium, xl) with MediaLibrary
- **SEO Optimized**: Meta tags, Open Graph, and clean URLs
- **Security**: RBAC, CSRF protection, and Stripe webhook verification
- **Performance**: Database indexing, eager loading, and optimized queries

## 🛠 Tech Stack

- **Backend**: Laravel 11 (PHP 8.2+)
- **Database**: MySQL 8.0+
- **Frontend**: Inertia.js + React 18
- **Styling**: Tailwind CSS + shadcn/ui
- **Payments**: Stripe (laravel/cashier)
- **Authentication**: Laravel Breeze
- **Authorization**: spatie/laravel-permission
- **Media Management**: spatie/laravel-medialibrary
- **Query Building**: spatie/laravel-query-builder
- **Build Tool**: Vite

## 📋 Requirements

- PHP 8.2 or higher
- Composer 2.0+
- Node.js 18+ and NPM
- MySQL 8.0+
- Laragon/XAMPP/WAMP (Windows) or similar local development environment

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd robins-artwork

# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### 2. Environment Configuration

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

Edit `.env` file with your configuration:

```env
# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=robins_artwork
DB_USERNAME=root
DB_PASSWORD=

# Stripe (get from https://dashboard.stripe.com/apikeys)
STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App URL
APP_URL=http://localhost:8000

# Cashier
CASHIER_CURRENCY=usd
CASHIER_CURRENCY_LOCALE=en

# Queue (for webhook processing)
QUEUE_CONNECTION=database

# Mail (using log driver for development)
MAIL_MAILER=log
MAIL_FROM_ADDRESS="hello@robins-artwork.com"
```

### 3. Database Setup

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE robins_artwork CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Run migrations
php artisan migrate

# Seed demo data
php artisan db:seed
```

### 4. Storage and Media

```bash
# Create storage symlink
php artisan storage:link

# Set proper permissions (Linux/Mac)
chmod -R 775 storage bootstrap/cache
```

### 5. Build and Run

```bash
# Build frontend assets
npm run build

# Start development server
php artisan serve

# In another terminal, start queue worker (for webhooks)
php artisan queue:work
```

Visit `http://localhost:8000` in your browser.

## 👥 Demo Accounts

After seeding, you'll have these demo accounts:

- **Admin**: `admin@demo.test` / `password`
- **Customer**: `customer@demo.test` / `password`

## 🔧 Development Commands

### Database
```bash
# Reset and reseed database
php artisan migrate:fresh --seed

# Create new migration
php artisan make:migration create_table_name

# Rollback last migration
php artisan migrate:rollback
```

### Frontend
```bash
# Watch for changes (development)
npm run dev

# Build for production
npm run build

# Add new shadcn/ui component
npx shadcn@latest add component_name
```

### Artisan Commands
```bash
# Clear all caches
php artisan optimize:clear

# List all routes
php artisan route:list

# Tinker (interactive shell)
php artisan tinker
```

## 📁 Project Structure

```
robins-artwork/
├── app/
│   ├── Http/Controllers/          # Application controllers
│   │   ├── Admin/                # Admin controllers
│   │   ├── ArtworkController.php # Public artwork controller
│   │   ├── CheckoutController.php # Stripe checkout
│   │   └── WebhookController.php # Stripe webhooks
│   ├── Models/                   # Eloquent models
│   ├── Policies/                 # Authorization policies
│   └── Mail/                     # Email templates
├── database/
│   ├── migrations/               # Database schema
│   ├── seeders/                  # Demo data
│   └── factories/                # Model factories
├── resources/
│   ├── js/
│   │   ├── Pages/                # Inertia pages
│   │   │   ├── Admin/            # Admin pages
│   │   │   ├── Gallery/          # Public gallery
│   │   │   └── Checkout/         # Checkout pages
│   │   └── components/ui/        # shadcn/ui components
│   └── views/                    # Blade templates
├── routes/
│   └── web.php                   # Application routes
└── storage/
    ├── app/private/              # Private media (originals)
    └── app/public/               # Public media (conversions)
```

## 🎨 Customization

### Adding New Artwork Fields

1. Create a migration:
```bash
php artisan make:migration add_field_to_artworks_table
```

2. Update the migration file and run:
```bash
php artisan migrate
```

3. Update the `Artwork` model, controller, and React forms.

### Custom Image Conversions

Edit `app/Models/Artwork.php` in the `registerMediaCollections()` method:

```php
->addMediaConversion('custom')
    ->width(1500)
    ->height(1000)
    ->format('webp')
    ->quality(90);
```

### Adding New Payment Methods

The checkout system is designed to be extensible. Modify `CheckoutController` to support additional payment providers.

## 🔒 Security Features

- **Role-Based Access Control**: Admin and customer roles with granular permissions
- **CSRF Protection**: Built-in Laravel CSRF tokens
- **Stripe Webhook Verification**: Secure webhook processing
- **Input Validation**: Server-side validation for all forms
- **SQL Injection Protection**: Eloquent ORM with parameterized queries
- **XSS Protection**: Automatic output escaping in Blade templates

## 📱 Responsive Design

The application is built with a mobile-first approach using Tailwind CSS:

- **Breakpoints**: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- **Grid System**: Responsive grid layouts for artwork galleries
- **Navigation**: Collapsible navigation for mobile devices
- **Images**: Responsive images with proper aspect ratios

## 🧪 Testing

```bash
# Run all tests
php artisan test

# Run specific test file
php artisan test --filter ArtworkTest

# Run tests with coverage (requires Xdebug)
php artisan test --coverage
```

## 🚀 Deployment

### Production Checklist

1. **Environment Variables**:
   - Set `APP_ENV=production`
   - Set `APP_DEBUG=false`
   - Configure production database credentials
   - Set production Stripe keys
   - Configure production mail settings

2. **Performance**:
   - Run `php artisan config:cache`
   - Run `php artisan route:cache`
   - Run `php artisan view:cache`
   - Set up Redis for caching (optional)

3. **Queue Workers**:
   - Set up supervisor for queue workers
   - Configure failed job handling

4. **Storage**:
   - Configure cloud storage (AWS S3, DigitalOcean Spaces)
   - Set up CDN for public media

### Deployment Commands

```bash
# Production build
npm run build

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Optimize autoloader
composer install --optimize-autoloader --no-dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 🆘 Support

For support and questions:

- Check the [Laravel documentation](https://laravel.com/docs)
- Review [Inertia.js documentation](https://inertiajs.com/)
- Check [Stripe documentation](https://stripe.com/docs)
- Open an issue in this repository

## 🙏 Acknowledgments

- [Laravel](https://laravel.com/) - The PHP framework
- [Inertia.js](https://inertiajs.com/) - Modern monoliths
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Stripe](https://stripe.com/) - Payment processing
- [Spatie](https://spatie.be/) - Quality Laravel packages

---

**Built with ❤️ using modern web technologies**
