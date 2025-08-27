<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CmsSetting;

class CmsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // HOME PAGE SETTINGS
            [
                'page' => 'home',
                'section' => 'hero',
                'key' => 'title',
                'value' => 'Discover Robin\'s',
                'type' => 'text',
                'description' => 'Main hero title',
                'sort_order' => 1
            ],
            [
                'page' => 'home',
                'section' => 'hero',
                'key' => 'subtitle',
                'value' => 'Unique Art',
                'type' => 'text',
                'description' => 'Hero subtitle with gradient effect',
                'sort_order' => 2
            ],
            [
                'page' => 'home',
                'section' => 'hero',
                'key' => 'description',
                'value' => 'Explore Robin\'s personal collection of original masterpieces and limited edition prints, each piece crafted with passion and artistic vision',
                'type' => 'textarea',
                'description' => 'Hero description text',
                'sort_order' => 3
            ],
            [
                'page' => 'home',
                'section' => 'hero',
                'key' => 'primary_button_text',
                'value' => 'Explore Gallery',
                'type' => 'text',
                'description' => 'Primary call-to-action button text',
                'sort_order' => 4
            ],
            [
                'page' => 'home',
                'section' => 'hero',
                'key' => 'secondary_button_text',
                'value' => 'View Featured',
                'type' => 'text',
                'description' => 'Secondary button text',
                'sort_order' => 5
            ],

            // HOME STATS SECTION
            [
                'page' => 'home',
                'section' => 'stats',
                'key' => 'show_stats',
                'value' => '1',
                'type' => 'boolean',
                'description' => 'Show/hide stats section',
                'sort_order' => 1
            ],
            [
                'page' => 'home',
                'section' => 'stats',
                'key' => 'stat1_label',
                'value' => 'Original Artworks',
                'type' => 'text',
                'description' => 'First stat label',
                'sort_order' => 2
            ],
            [
                'page' => 'home',
                'section' => 'stats',
                'key' => 'stat2_label',
                'value' => 'Limited Editions',
                'type' => 'text',
                'description' => 'Second stat label',
                'sort_order' => 3
            ],
            [
                'page' => 'home',
                'section' => 'stats',
                'key' => 'stat3_label',
                'value' => 'Art Mediums',
                'type' => 'text',
                'description' => 'Third stat label',
                'sort_order' => 4
            ],

            // HOME FEATURED SECTION
            [
                'page' => 'home',
                'section' => 'featured',
                'key' => 'title',
                'value' => 'Featured Artworks',
                'type' => 'text',
                'description' => 'Featured artworks section title',
                'sort_order' => 1
            ],
            [
                'page' => 'home',
                'section' => 'featured',
                'key' => 'description',
                'value' => 'Discover Robin\'s handpicked selection of exceptional pieces that showcase the diversity and creativity of contemporary art',
                'type' => 'textarea',
                'description' => 'Featured artworks description',
                'sort_order' => 2
            ],
            [
                'page' => 'home',
                'section' => 'featured',
                'key' => 'button_text',
                'value' => 'View All Artworks',
                'type' => 'text',
                'description' => 'Featured section CTA button text',
                'sort_order' => 3
            ],

            // HOME ABOUT SECTION
            [
                'page' => 'home',
                'section' => 'about',
                'key' => 'title',
                'value' => 'About Robin\'s Artwork',
                'type' => 'text',
                'description' => 'About section title',
                'sort_order' => 1
            ],
            [
                'page' => 'home',
                'section' => 'about',
                'key' => 'paragraph1',
                'value' => 'Robin Aitken is a passionate artist who has rediscovered his love for painting after a distinguished 25-year career in eCommerce technology. Now retired and based in the stunning Cairngorms National Park in Scotland, Robin combines his artistic vision with the breathtaking natural beauty of the Scottish Highlands.',
                'type' => 'textarea',
                'description' => 'First about paragraph',
                'sort_order' => 2
            ],
            [
                'page' => 'home',
                'section' => 'about',
                'key' => 'paragraph2',
                'value' => 'Every artwork in this collection represents Robin\'s unique perspective, combining his technical background with artistic creativity. Whether you\'re a seasoned collector or just beginning your art journey, Robin\'s pieces capture the timeless beauty of Scotland\'s landscapes and are designed to resonate with your soul and transform your space.',
                'type' => 'textarea',
                'description' => 'Second about paragraph',
                'sort_order' => 3
            ],
            [
                'page' => 'home',
                'section' => 'about',
                'key' => 'button_text',
                'value' => 'Get in Touch',
                'type' => 'text',
                'description' => 'About section CTA button text',
                'sort_order' => 4
            ],

            // HOME CONTACT CTA SECTION
            [
                'page' => 'home',
                'section' => 'contact_cta',
                'key' => 'title',
                'value' => 'Ready to Start Your Collection?',
                'type' => 'text',
                'description' => 'Contact CTA section title',
                'sort_order' => 1
            ],
            [
                'page' => 'home',
                'section' => 'contact_cta',
                'key' => 'description',
                'value' => 'Have questions about our artworks or need assistance with your purchase? Our team is here to help you find the perfect piece for your collection.',
                'type' => 'textarea',
                'description' => 'Contact CTA description',
                'sort_order' => 2
            ],
            [
                'page' => 'home',
                'section' => 'contact_cta',
                'key' => 'primary_button_text',
                'value' => 'Browse Gallery',
                'type' => 'text',
                'description' => 'Primary CTA button text',
                'sort_order' => 3
            ],
            [
                'page' => 'home',
                'section' => 'contact_cta',
                'key' => 'secondary_button_text',
                'value' => 'Contact Us',
                'type' => 'text',
                'description' => 'Secondary CTA button text',
                'sort_order' => 4
            ],

            // GALLERY PAGE SETTINGS
            [
                'page' => 'gallery',
                'section' => 'header',
                'key' => 'title',
                'value' => 'Art Gallery',
                'type' => 'text',
                'description' => 'Gallery page main title',
                'sort_order' => 1
            ],
            [
                'page' => 'gallery',
                'section' => 'header',
                'key' => 'description',
                'value' => 'Discover extraordinary artworks that tell stories, evoke emotions, and transform spaces. Each piece is carefully curated to bring beauty and inspiration to your life.',
                'type' => 'textarea',
                'description' => 'Gallery page description',
                'sort_order' => 2
            ],
            [
                'page' => 'gallery',
                'section' => 'controls',
                'key' => 'show_filters',
                'value' => '1',
                'type' => 'boolean',
                'description' => 'Show/hide filter section',
                'sort_order' => 1
            ],
            [
                'page' => 'gallery',
                'section' => 'controls',
                'key' => 'show_search',
                'value' => '1',
                'type' => 'boolean',
                'description' => 'Show/hide search functionality',
                'sort_order' => 2
            ],
            [
                'page' => 'gallery',
                'section' => 'controls',
                'key' => 'show_cart_button',
                'value' => '1',
                'type' => 'boolean',
                'description' => 'Show/hide add to cart buttons on artwork cards',
                'sort_order' => 3
            ],
            [
                'page' => 'gallery',
                'section' => 'controls',
                'key' => 'show_favorite_button',
                'value' => '1',
                'type' => 'boolean',
                'description' => 'Show/hide favorite buttons on artwork cards',
                'sort_order' => 4
            ],

            // ABOUT PAGE SETTINGS
            [
                'page' => 'about',
                'section' => 'hero',
                'key' => 'title',
                'value' => 'About Robin',
                'type' => 'text',
                'description' => 'About page hero title',
                'sort_order' => 1
            ],
            [
                'page' => 'about',
                'section' => 'hero',
                'key' => 'description',
                'value' => 'Discover the artist behind the canvas and the passion that drives every brushstroke',
                'type' => 'textarea',
                'description' => 'About page hero description',
                'sort_order' => 2
            ],
            [
                'page' => 'about',
                'section' => 'story',
                'key' => 'title',
                'value' => 'The Artist\'s Journey',
                'type' => 'text',
                'description' => 'Artist story section title',
                'sort_order' => 1
            ],
            [
                'page' => 'about',
                'section' => 'philosophy',
                'key' => 'title',
                'value' => 'Artistic Philosophy',
                'type' => 'text',
                'description' => 'Philosophy section title',
                'sort_order' => 1
            ],

            // CONTACT PAGE SETTINGS
            [
                'page' => 'contact',
                'section' => 'hero',
                'key' => 'title',
                'value' => 'Get in Touch',
                'type' => 'text',
                'description' => 'Contact page hero title',
                'sort_order' => 1
            ],
            [
                'page' => 'contact',
                'section' => 'hero',
                'key' => 'description',
                'value' => 'Have questions about Robin\'s artwork? Want to commission a piece? We\'d love to hear from you.',
                'type' => 'textarea',
                'description' => 'Contact page hero description',
                'sort_order' => 2
            ],

            // GLOBAL SETTINGS
            [
                'page' => 'global',
                'section' => 'site',
                'key' => 'site_name',
                'value' => 'Robin\'s Artwork',
                'type' => 'text',
                'description' => 'Site name displayed in header and footer',
                'sort_order' => 1
            ],
            [
                'page' => 'global',
                'section' => 'site',
                'key' => 'tagline',
                'value' => 'Discover unique artworks inspired by the Scottish Highlands',
                'type' => 'text',
                'description' => 'Site tagline for SEO and meta descriptions',
                'sort_order' => 2
            ],
            [
                'page' => 'global',
                'section' => 'contact',
                'key' => 'email',
                'value' => 'hello@robinsartwork.com',
                'type' => 'text',
                'description' => 'Main contact email address',
                'sort_order' => 1
            ],
            [
                'page' => 'global',
                'section' => 'contact',
                'key' => 'phone',
                'value' => '(123) 456-7890',
                'type' => 'text',
                'description' => 'Contact phone number',
                'sort_order' => 2
            ],
            [
                'page' => 'global',
                'section' => 'contact',
                'key' => 'address',
                'value' => 'Cromdale, Cairngorms National Park, Scotland, United Kingdom',
                'type' => 'textarea',
                'description' => 'Studio/business address',
                'sort_order' => 3
            ]
        ];

        foreach ($settings as $setting) {
            CmsSetting::updateOrCreate(
                [
                    'page' => $setting['page'],
                    'section' => $setting['section'],
                    'key' => $setting['key']
                ],
                $setting
            );
        }

        $this->command->info('CMS settings seeded successfully!');
    }
}