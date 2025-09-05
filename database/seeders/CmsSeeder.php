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

            // GALLERY CONTROLS SECTION
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

            // GALLERY EMPTY STATE SECTION
            [
                'page' => 'gallery',
                'section' => 'empty_state',
                'key' => 'title',
                'value' => 'No Artworks Found',
                'type' => 'text',
                'description' => 'Empty state section title',
                'sort_order' => 1
            ],
            [
                'page' => 'gallery',
                'section' => 'empty_state',
                'key' => 'description',
                'value' => 'We couldn\'t find any artworks matching your current filters. Don\'t worry though - our collection is always growing!',
                'type' => 'textarea',
                'description' => 'Empty state description',
                'sort_order' => 2
            ],
            [
                'page' => 'gallery',
                'section' => 'empty_state',
                'key' => 'primary_button_text',
                'value' => '🔍 Browse All Artworks',
                'type' => 'text',
                'description' => 'Primary empty state button text',
                'sort_order' => 3
            ],
            [
                'page' => 'gallery',
                'section' => 'empty_state',
                'key' => 'secondary_button_text',
                'value' => '💬 Ask About Commissions',
                'type' => 'text',
                'description' => 'Secondary empty state button text',
                'sort_order' => 4
            ],

            // GALLERY CTA SECTION
            [
                'page' => 'gallery',
                'section' => 'cta',
                'key' => 'show_cta',
                'value' => '1',
                'type' => 'boolean',
                'description' => 'Show/hide CTA section',
                'sort_order' => 1
            ],
            [
                'page' => 'gallery',
                'section' => 'cta',
                'key' => 'title',
                'value' => 'Can\'t Find What You\'re Looking For?',
                'type' => 'text',
                'description' => 'Gallery CTA section title',
                'sort_order' => 2
            ],
            [
                'page' => 'gallery',
                'section' => 'cta',
                'key' => 'description',
                'value' => 'Our collection is constantly growing with new pieces inspired by the stunning Scottish Highlands. Let us know what you\'re looking for, and we\'ll help you find the perfect artwork for your space.',
                'type' => 'textarea',
                'description' => 'Gallery CTA description',
                'sort_order' => 3
            ],
            [
                'page' => 'gallery',
                'section' => 'cta',
                'key' => 'button_text',
                'value' => '💌 Get in Touch',
                'type' => 'text',
                'description' => 'Gallery CTA button text',
                'sort_order' => 4
            ],

            // GALLERY FEATURES SECTION
            [
                'page' => 'gallery',
                'section' => 'features',
                'key' => 'feature1_title',
                'value' => 'Custom Commissions',
                'type' => 'text',
                'description' => 'First feature card title',
                'sort_order' => 1
            ],
            [
                'page' => 'gallery',
                'section' => 'features',
                'key' => 'feature1_description',
                'value' => 'Personalized artwork tailored to your vision',
                'type' => 'text',
                'description' => 'First feature card description',
                'sort_order' => 2
            ],
            [
                'page' => 'gallery',
                'section' => 'features',
                'key' => 'feature2_title',
                'value' => 'Scottish Landscapes',
                'type' => 'text',
                'description' => 'Second feature card title',
                'sort_order' => 3
            ],
            [
                'page' => 'gallery',
                'section' => 'features',
                'key' => 'feature2_description',
                'value' => 'Inspired by the beautiful Cairngorms',
                'type' => 'text',
                'description' => 'Second feature card description',
                'sort_order' => 4
            ],
            [
                'page' => 'gallery',
                'section' => 'features',
                'key' => 'feature3_title',
                'value' => 'Studio Visits',
                'type' => 'text',
                'description' => 'Third feature card title',
                'sort_order' => 5
            ],
            [
                'page' => 'gallery',
                'section' => 'features',
                'key' => 'feature3_description',
                'value' => 'Visit Robin\'s studio in the Highlands',
                'type' => 'text',
                'description' => 'Third feature card description',
                'sort_order' => 6
            ],

            // GALLERY FOOTER INFO SECTION
            [
                'page' => 'gallery',
                'section' => 'footer_info',
                'key' => 'info1_text',
                'value' => 'Free consultation',
                'type' => 'text',
                'description' => 'First footer info text',
                'sort_order' => 1
            ],
            [
                'page' => 'gallery',
                'section' => 'footer_info',
                'key' => 'info2_text',
                'value' => 'Worldwide shipping',
                'type' => 'text',
                'description' => 'Second footer info text',
                'sort_order' => 2
            ],
            [
                'page' => 'gallery',
                'section' => 'footer_info',
                'key' => 'info3_text',
                'value' => 'Secure payments',
                'type' => 'text',
                'description' => 'Third footer info text',
                'sort_order' => 3
            ],

            // ABOUT PAGE SETTINGS
            [
                'page' => 'about',
                'section' => 'hero',
                'key' => 'show_hero',
                'value' => '1',
                'type' => 'boolean',
                'description' => 'Show/hide hero section',
                'sort_order' => 1
            ],
            [
                'page' => 'about',
                'section' => 'hero',
                'key' => 'title',
                'value' => 'About Robin',
                'type' => 'text',
                'description' => 'About page hero title',
                'sort_order' => 2
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

            // ABOUT STORY SECTION
            [
                'page' => 'about',
                'section' => 'story',
                'key' => 'show_story',
                'value' => '1',
                'type' => 'boolean',
                'description' => 'Show/hide story section',
                'sort_order' => 1
            ],
            [
                'page' => 'about',
                'section' => 'story',
                'key' => 'title',
                'value' => 'The Artist\'s Journey',
                'type' => 'text',
                'description' => 'Artist story section title',
                'sort_order' => 2
            ],
            [
                'page' => 'about',
                'section' => 'story',
                'key' => 'paragraph1',
                'value' => 'Robin Aitken\'s artistic journey is a beautiful story of rediscovery and passion. After a distinguished 25-year career in eCommerce technology, working with major retailers and leading innovative search solutions, Robin has embraced retirement as an opportunity to return to his artistic roots.',
                'type' => 'textarea',
                'description' => 'First paragraph of artist story',
                'sort_order' => 2
            ],
            [
                'page' => 'about',
                'section' => 'story',
                'key' => 'paragraph2',
                'value' => 'Now based in the stunning Cairngorms National Park in Cromdale, Scotland, Robin combines his love for painting with running a charming Bed & Breakfast. The breathtaking Scottish landscapes and serene Highland atmosphere provide endless inspiration for his artwork.',
                'type' => 'textarea',
                'description' => 'Second paragraph of artist story',
                'sort_order' => 3
            ],
            [
                'page' => 'about',
                'section' => 'story',
                'key' => 'paragraph3',
                'value' => 'Robin\'s technical background and "can do" attitude from his professional life translates beautifully into his artistic practice, where he approaches each canvas with the same dedication and problem-solving mindset that made him successful in eCommerce solutions.',
                'type' => 'textarea',
                'description' => 'Third paragraph of artist story',
                'sort_order' => 4
            ],
            [
                'page' => 'about',
                'section' => 'story',
                'key' => 'image_url',
                'value' => 'https://picsum.photos/600/600?random=robin-portrait',
                'type' => 'text',
                'description' => 'Story section image URL',
                'sort_order' => 5
            ],
            [
                'page' => 'about',
                'section' => 'story',
                'key' => 'image_alt',
                'value' => 'Robin\'s Studio in the Cairngorms',
                'type' => 'text',
                'description' => 'Story section image alt text',
                'sort_order' => 6
            ],

            // ABOUT PHILOSOPHY SECTION
            [
                'page' => 'about',
                'section' => 'philosophy',
                'key' => 'show_philosophy',
                'value' => '1',
                'type' => 'boolean',
                'description' => 'Show/hide philosophy section',
                'sort_order' => 1
            ],
            [
                'page' => 'about',
                'section' => 'philosophy',
                'key' => 'title',
                'value' => 'Artistic Philosophy',
                'type' => 'text',
                'description' => 'Philosophy section title',
                'sort_order' => 2
            ],
            [
                'page' => 'about',
                'section' => 'philosophy',
                'key' => 'description',
                'value' => 'Every artwork tells a story, every color evokes an emotion, and every brushstroke carries intention',
                'type' => 'textarea',
                'description' => 'Philosophy section description',
                'sort_order' => 2
            ],
            [
                'page' => 'about',
                'section' => 'philosophy',
                'key' => 'card1_title',
                'value' => 'Emotional Connection',
                'type' => 'text',
                'description' => 'First philosophy card title',
                'sort_order' => 3
            ],
            [
                'page' => 'about',
                'section' => 'philosophy',
                'key' => 'card1_description',
                'value' => 'Art should move beyond the visual and create an emotional response that resonates with the viewer\'s own experiences and feelings.',
                'type' => 'textarea',
                'description' => 'First philosophy card description',
                'sort_order' => 4
            ],
            [
                'page' => 'about',
                'section' => 'philosophy',
                'key' => 'card2_title',
                'value' => 'Authentic Expression',
                'type' => 'text',
                'description' => 'Second philosophy card title',
                'sort_order' => 5
            ],
            [
                'page' => 'about',
                'section' => 'philosophy',
                'key' => 'card2_description',
                'value' => 'Every piece is created with genuine passion and authenticity, reflecting Robin\'s true artistic voice and personal experiences.',
                'type' => 'textarea',
                'description' => 'Second philosophy card description',
                'sort_order' => 6
            ],
            [
                'page' => 'about',
                'section' => 'philosophy',
                'key' => 'card3_title',
                'value' => 'Timeless Beauty',
                'type' => 'text',
                'description' => 'Third philosophy card title',
                'sort_order' => 7
            ],
            [
                'page' => 'about',
                'section' => 'philosophy',
                'key' => 'card3_description',
                'value' => 'Creating art that transcends trends and speaks to universal human experiences, ensuring each piece remains relevant and meaningful.',
                'type' => 'textarea',
                'description' => 'Third philosophy card description',
                'sort_order' => 8
            ],

            // ABOUT PROCESS SECTION
            [
                'page' => 'about',
                'section' => 'process',
                'key' => 'show_process',
                'value' => '1',
                'type' => 'boolean',
                'description' => 'Show/hide process section',
                'sort_order' => 1
            ],
            [
                'page' => 'about',
                'section' => 'process',
                'key' => 'title',
                'value' => 'Process & Technique',
                'type' => 'text',
                'description' => 'Process section title',
                'sort_order' => 2
            ],
            [
                'page' => 'about',
                'section' => 'process',
                'key' => 'paragraph1',
                'value' => 'Robin\'s creative process is uniquely influenced by his technical background in eCommerce solutions. He approaches each artwork with the same systematic thinking and attention to detail that made him successful in product management and sales.',
                'type' => 'textarea',
                'description' => 'First paragraph of process section',
                'sort_order' => 2
            ],
            [
                'page' => 'about',
                'section' => 'process',
                'key' => 'paragraph2',
                'value' => 'Living in the Cairngorms National Park provides Robin with endless natural inspiration - from the dramatic mountain landscapes to the changing seasons and wildlife. His paintings capture the essence of Scotland\'s natural beauty, combining traditional techniques with contemporary perspectives.',
                'type' => 'textarea',
                'description' => 'Second paragraph of process section',
                'sort_order' => 3
            ],
            [
                'page' => 'about',
                'section' => 'process',
                'key' => 'paragraph3',
                'value' => 'Robin\'s "can do" attitude from his professional life translates into his artistic practice, where he\'s not afraid to experiment with new techniques and push creative boundaries. Each piece reflects his deep connection to the Scottish Highlands and his passion for capturing its timeless beauty.',
                'type' => 'textarea',
                'description' => 'Third paragraph of process section',
                'sort_order' => 4
            ],
            [
                'page' => 'about',
                'section' => 'process',
                'key' => 'image_url',
                'value' => 'https://picsum.photos/600/600?random=robin-process',
                'type' => 'text',
                'description' => 'Process section image URL',
                'sort_order' => 5
            ],
            [
                'page' => 'about',
                'section' => 'process',
                'key' => 'image_alt',
                'value' => 'Artistic Process',
                'type' => 'text',
                'description' => 'Process section image alt text',
                'sort_order' => 6
            ],

            // ABOUT CTA SECTION
            [
                'page' => 'about',
                'section' => 'cta',
                'key' => 'show_cta',
                'value' => '1',
                'type' => 'boolean',
                'description' => 'Show/hide CTA section',
                'sort_order' => 1
            ],
            [
                'page' => 'about',
                'section' => 'cta',
                'key' => 'title',
                'value' => 'Ready to Experience Robin\'s Art?',
                'type' => 'text',
                'description' => 'About page CTA title',
                'sort_order' => 2
            ],
            [
                'page' => 'about',
                'section' => 'cta',
                'key' => 'description',
                'value' => 'Explore the gallery and discover pieces that speak to your soul, or get in touch to learn more about Robin\'s artistic journey.',
                'type' => 'textarea',
                'description' => 'About page CTA description',
                'sort_order' => 2
            ],
            [
                'page' => 'about',
                'section' => 'cta',
                'key' => 'primary_button_text',
                'value' => 'Explore Gallery',
                'type' => 'text',
                'description' => 'Primary CTA button text',
                'sort_order' => 3
            ],
            [
                'page' => 'about',
                'section' => 'cta',
                'key' => 'secondary_button_text',
                'value' => 'Get in Touch',
                'type' => 'text',
                'description' => 'Secondary CTA button text',
                'sort_order' => 4
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

            // CONTACT FORM SECTION
            [
                'page' => 'contact',
                'section' => 'form',
                'key' => 'title',
                'value' => 'Send us a Message',
                'type' => 'text',
                'description' => 'Contact form section title',
                'sort_order' => 1
            ],
            [
                'page' => 'contact',
                'section' => 'form',
                'key' => 'success_title',
                'value' => 'Message Sent Successfully! 🎉',
                'type' => 'text',
                'description' => 'Success message title',
                'sort_order' => 2
            ],
            [
                'page' => 'contact',
                'section' => 'form',
                'key' => 'success_message',
                'value' => 'Thank you for reaching out! Robin has received your message and will get back to you within 24 hours. We appreciate your interest in his artwork and B&B.',
                'type' => 'textarea',
                'description' => 'Success message content',
                'sort_order' => 3
            ],
            [
                'page' => 'contact',
                'section' => 'form',
                'key' => 'response_time_text',
                'value' => 'Response time: Usually within 24 hours',
                'type' => 'text',
                'description' => 'Response time information',
                'sort_order' => 4
            ],

            // CONTACT INFO SECTION
            [
                'page' => 'contact',
                'section' => 'info',
                'key' => 'title',
                'value' => 'Contact Information',
                'type' => 'text',
                'description' => 'Contact information section title',
                'sort_order' => 1
            ],
            [
                'page' => 'contact',
                'section' => 'info',
                'key' => 'studio_title',
                'value' => 'Visit Our Studio',
                'type' => 'text',
                'description' => 'Studio visit section title',
                'sort_order' => 2
            ],
            [
                'page' => 'contact',
                'section' => 'info',
                'key' => 'studio_details',
                'value' => 'By appointment only<br />Robin\'s Art Studio & B&B<br />Cromdale, Cairngorms National Park<br />Scotland, United Kingdom',
                'type' => 'textarea',
                'description' => 'Studio location and visit details',
                'sort_order' => 3
            ],
            [
                'page' => 'contact',
                'section' => 'info',
                'key' => 'email_title',
                'value' => 'Email Us',
                'type' => 'text',
                'description' => 'Email section title',
                'sort_order' => 4
            ],
            [
                'page' => 'contact',
                'section' => 'info',
                'key' => 'email_address',
                'value' => 'hello@robinsartwork.com',
                'type' => 'text',
                'description' => 'Main contact email address',
                'sort_order' => 5
            ],
            [
                'page' => 'contact',
                'section' => 'info',
                'key' => 'email_note',
                'value' => 'We typically respond within 24 hours',
                'type' => 'text',
                'description' => 'Email response time note',
                'sort_order' => 6
            ],
            [
                'page' => 'contact',
                'section' => 'info',
                'key' => 'phone_title',
                'value' => 'Phone',
                'type' => 'text',
                'description' => 'Phone section title',
                'sort_order' => 7
            ],
            [
                'page' => 'contact',
                'section' => 'info',
                'key' => 'phone_number',
                'value' => '(123) 456-7890',
                'type' => 'text',
                'description' => 'Contact phone number',
                'sort_order' => 8
            ],
            [
                'page' => 'contact',
                'section' => 'info',
                'key' => 'phone_hours',
                'value' => 'Available Tue-Sat, 10 AM - 6 PM',
                'type' => 'text',
                'description' => 'Phone availability hours',
                'sort_order' => 9
            ],
            [
                'page' => 'contact',
                'section' => 'info',
                'key' => 'social_title',
                'value' => 'Social Media',
                'type' => 'text',
                'description' => 'Social media section title',
                'sort_order' => 10
            ],
            [
                'page' => 'contact',
                'section' => 'info',
                'key' => 'social_description',
                'value' => 'Follow Robin\'s artistic journey',
                'type' => 'text',
                'description' => 'Social media section description',
                'sort_order' => 11
            ],
            [
                'page' => 'contact',
                'section' => 'info',
                'key' => 'linkedin_url',
                'value' => 'https://www.linkedin.com/in/robin-aitken-56180410/',
                'type' => 'text',
                'description' => 'LinkedIn profile URL',
                'sort_order' => 12
            ],
            [
                'page' => 'contact',
                'section' => 'info',
                'key' => 'facebook_url',
                'value' => 'https://www.facebook.com/robin.aitken.woodley',
                'type' => 'text',
                'description' => 'Facebook profile URL',
                'sort_order' => 13
            ],

            // CONTACT FAQ SECTION
            [
                'page' => 'contact',
                'section' => 'faq',
                'key' => 'title',
                'value' => 'Frequently Asked Questions',
                'type' => 'text',
                'description' => 'FAQ section title',
                'sort_order' => 1
            ],
            [
                'page' => 'contact',
                'section' => 'faq',
                'key' => 'description',
                'value' => 'Common questions about Robin\'s artwork and services',
                'type' => 'textarea',
                'description' => 'FAQ section description',
                'sort_order' => 2
            ],
            [
                'page' => 'contact',
                'section' => 'faq',
                'key' => 'faq1_question',
                'value' => 'Can I commission a custom piece?',
                'type' => 'text',
                'description' => 'First FAQ question',
                'sort_order' => 3
            ],
            [
                'page' => 'contact',
                'section' => 'faq',
                'key' => 'faq1_answer',
                'value' => 'Yes! Robin accepts custom commissions. Please contact us with your vision, timeline, and budget, and we\'ll discuss how to bring your idea to life.',
                'type' => 'textarea',
                'description' => 'First FAQ answer',
                'sort_order' => 4
            ],
            [
                'page' => 'contact',
                'section' => 'faq',
                'key' => 'faq2_question',
                'value' => 'Do you ship internationally?',
                'type' => 'text',
                'description' => 'Second FAQ question',
                'sort_order' => 5
            ],
            [
                'page' => 'contact',
                'section' => 'faq',
                'key' => 'faq2_answer',
                'value' => 'We ship worldwide! All artwork is carefully packaged and insured. Shipping costs and delivery times vary by location.',
                'type' => 'textarea',
                'description' => 'Second FAQ answer',
                'sort_order' => 6
            ],
            [
                'page' => 'contact',
                'section' => 'faq',
                'key' => 'faq3_question',
                'value' => 'Can I visit the studio?',
                'type' => 'text',
                'description' => 'Third FAQ question',
                'sort_order' => 7
            ],
            [
                'page' => 'contact',
                'section' => 'faq',
                'key' => 'faq3_answer',
                'value' => 'Studio visits are available by appointment only. Robin also runs a charming B&B in the Cairngorms National Park, so you can combine your art appreciation with a beautiful Scottish Highland getaway.',
                'type' => 'textarea',
                'description' => 'Third FAQ answer',
                'sort_order' => 8
            ],
            [
                'page' => 'contact',
                'section' => 'faq',
                'key' => 'faq4_question',
                'value' => 'What payment methods do you accept?',
                'type' => 'text',
                'description' => 'Fourth FAQ question',
                'sort_order' => 9
            ],
            [
                'page' => 'contact',
                'section' => 'faq',
                'key' => 'faq4_answer',
                'value' => 'We accept all major credit cards, PayPal, and bank transfers. For high-value pieces, we can arrange payment plans.',
                'type' => 'textarea',
                'description' => 'Fourth FAQ answer',
                'sort_order' => 10
            ],

            // CONTACT CTA SECTION
            [
                'page' => 'contact',
                'section' => 'cta',
                'key' => 'title',
                'value' => 'Ready to Start Your Collection?',
                'type' => 'text',
                'description' => 'Contact page CTA title',
                'sort_order' => 1
            ],
            [
                'page' => 'contact',
                'section' => 'cta',
                'key' => 'description',
                'value' => 'Browse Robin\'s gallery and discover pieces that speak to your soul, or get in touch to discuss custom commissions.',
                'type' => 'textarea',
                'description' => 'Contact page CTA description',
                'sort_order' => 2
            ],
            [
                'page' => 'contact',
                'section' => 'cta',
                'key' => 'primary_button_text',
                'value' => 'Explore Gallery',
                'type' => 'text',
                'description' => 'Primary CTA button text',
                'sort_order' => 3
            ],
            [
                'page' => 'contact',
                'section' => 'cta',
                'key' => 'secondary_button_text',
                'value' => 'Learn More About Robin',
                'type' => 'text',
                'description' => 'Secondary CTA button text',
                'sort_order' => 4
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
            ],
            
            // GLOBAL SOCIAL MEDIA SETTINGS
            [
                'page' => 'global',
                'section' => 'social',
                'key' => 'social_title',
                'value' => 'Follow Robin\'s Journey',
                'type' => 'text',
                'description' => 'Social media section title',
                'sort_order' => 1
            ],
            [
                'page' => 'global',
                'section' => 'social',
                'key' => 'social_description',
                'value' => 'Connect with Robin on social media for updates, behind-the-scenes content, and artistic inspiration',
                'type' => 'textarea',
                'description' => 'Social media section description',
                'sort_order' => 2
            ],
            [
                'page' => 'global',
                'section' => 'social',
                'key' => 'linkedin_url',
                'value' => 'https://www.linkedin.com/in/robin-aitken-56180410/',
                'type' => 'text',
                'description' => 'LinkedIn profile URL',
                'sort_order' => 3
            ],
            [
                'page' => 'global',
                'section' => 'social',
                'key' => 'facebook_url',
                'value' => 'https://www.facebook.com/robin.aitken.woodley',
                'type' => 'text',
                'description' => 'Facebook profile URL',
                'sort_order' => 4
            ],
            [
                'page' => 'global',
                'section' => 'social',
                'key' => 'instagram_url',
                'value' => 'https://www.instagram.com/robinsartwork',
                'type' => 'text',
                'description' => 'Instagram profile URL',
                'sort_order' => 5
            ],
            [
                'page' => 'global',
                'section' => 'social',
                'key' => 'twitter_url',
                'value' => 'https://twitter.com/robinsartwork',
                'type' => 'text',
                'description' => 'Twitter/X profile URL',
                'sort_order' => 6
            ],
            
            // IMAGE MANAGEMENT SETTINGS
            [
                'page' => 'global',
                'section' => 'images',
                'key' => 'max_file_size',
                'value' => '10240',
                'type' => 'number',
                'description' => 'Maximum file size for image uploads in KB (10MB = 10240KB)',
                'sort_order' => 1
            ],
            [
                'page' => 'global',
                'section' => 'images',
                'key' => 'allowed_types',
                'value' => 'jpeg,png,jpg,gif,webp',
                'type' => 'text',
                'description' => 'Allowed image file types (comma-separated)',
                'sort_order' => 2
            ],
            [
                'page' => 'global',
                'section' => 'images',
                'key' => 'auto_optimize',
                'value' => '1',
                'type' => 'boolean',
                'description' => 'Automatically optimize images on upload',
                'sort_order' => 3
            ],
            [
                'page' => 'global',
                'section' => 'images',
                'key' => 'create_thumbnails',
                'value' => '1',
                'type' => 'boolean',
                'description' => 'Create thumbnail versions of uploaded images',
                'sort_order' => 4
            ],
            [
                'page' => 'global',
                'section' => 'images',
                'key' => 'uploaded_images',
                'value' => '[]',
                'type' => 'json',
                'description' => 'Uploaded images data for CMS image management',
                'sort_order' => 5
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