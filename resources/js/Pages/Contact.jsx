import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import PublicLayout from '@/Layouts/PublicLayout';
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Contact({ success, errors, cmsSettings = {} }) {
    const [showSuccess, setShowSuccess] = useState(false);
    
    // Helper function to get CMS value
    const getCmsValue = (section, key, defaultValue = '') => {
        return cmsSettings[section]?.[key] || defaultValue;
    };
    
    const { data, setData, post, processing, reset } = useForm({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('contact.store'), {
            onSuccess: () => {
                reset();
                window.toast?.success('Your message has been sent successfully! We\'ll get back to you soon.', 'Message Sent');
                setShowSuccess(true);
                // Hide success message after 8 seconds
                setTimeout(() => setShowSuccess(false), 8000);
            },
            onError: () => {
                window.toast?.error('There was an error sending your message. Please try again.', 'Error');
            }
        });
    };

    // Show success message when it's passed from backend
    useEffect(() => {
        if (success) {
            window.toast?.success('Your message has been sent successfully! We\'ll get back to you soon.', 'Message Sent');
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 8000);
        }
    }, [success]);

    return (
        <PublicLayout>
            <Head title="Contact Robin's Artwork" />
            
            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            {getCmsValue('hero', 'title', 'Get in Touch')}
                        </h1>
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
                            {getCmsValue('hero', 'description', 'Have questions about Robin\'s artwork? Want to commission a piece? We\'d love to hear from you.')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Form & Info */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
                                {getCmsValue('form', 'title', 'Send us a Message')}
                            </h2>
                            
                            {/* Success Message - Enhanced UI */}
                            {showSuccess && (
                                <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-lg">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <h3 className="text-lg font-semibold text-green-800 mb-2">
                                                {getCmsValue('form', 'success_title', 'Message Sent Successfully! 🎉')}
                                            </h3>
                                            <p className="text-green-700 leading-relaxed">
                                                {getCmsValue('form', 'success_message', 'Thank you for reaching out! Robin has received your message and will get back to you within 24 hours. We appreciate your interest in his artwork and B&B.')}
                                            </p>
                                            <div className="mt-4 flex items-center text-sm text-green-600">
                                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                </svg>
                                                {getCmsValue('form', 'response_time_text', 'Response time: Usually within 24 hours')}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowSuccess(false)}
                                            className="ml-4 flex-shrink-0 text-green-400 hover:text-green-600 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 mb-2 block">
                                            First Name *
                                        </Label>
                                        <Input
                                            id="firstName"
                                            type="text"
                                            placeholder="Your first name"
                                            className={`w-full ${errors.firstName ? 'border-red-500' : ''}`}
                                            value={data.firstName}
                                            onChange={(e) => setData('firstName', e.target.value)}
                                            required
                                        />
                                        {errors.firstName && (
                                            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 mb-2 block">
                                            Last Name *
                                        </Label>
                                        <Input
                                            id="lastName"
                                            type="text"
                                            placeholder="Your last name"
                                            className={`w-full ${errors.lastName ? 'border-red-500' : ''}`}
                                            value={data.lastName}
                                            onChange={(e) => setData('lastName', e.target.value)}
                                            required
                                        />
                                        {errors.lastName && (
                                            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                                        )}
                                    </div>
                                </div>
                                
                                <div>
                                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                                        Email Address *
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your.email@example.com"
                                        className={`w-full ${errors.email ? 'border-red-500' : ''}`}
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <Label htmlFor="subject" className="text-sm font-medium text-gray-700 mb-2 block">
                                        Subject *
                                    </Label>
                                    <Input
                                        id="subject"
                                        type="text"
                                        placeholder="What's this about?"
                                        className={`w-full ${errors.subject ? 'border-red-500' : ''}`}
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        required
                                    />
                                    {errors.subject && (
                                        <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <Label htmlFor="message" className="text-sm font-medium text-gray-700 mb-2 block">
                                        Message *
                                    </Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Tell us more about your inquiry..."
                                        rows={6}
                                        className={`w-full ${errors.message ? 'border-red-500' : ''}`}
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        required
                                    />
                                    {errors.message && (
                                        <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                                    )}
                                </div>
                                
                                <Button 
                                    type="submit" 
                                    size="lg" 
                                    className="w-full bg-purple-600 hover:bg-purple-700 py-4 text-lg font-semibold transition-all duration-200 transform hover:scale-[1.02]"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending Message...
                                        </div>
                                    ) : (
                                        'Send Message'
                                    )}
                                </Button>
                            </form>
                        </div>
                        
                        {/* Contact Information */}
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
                                {getCmsValue('info', 'title', 'Contact Information')}
                            </h2>
                            
                            <div className="space-y-8">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-xl">📍</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {getCmsValue('info', 'studio_title', 'Visit Our Studio')}
                                        </h3>
                                        <div 
                                            className="text-gray-600 leading-relaxed"
                                            dangerouslySetInnerHTML={{
                                                __html: getCmsValue('info', 'studio_details', 'By appointment only<br />Robin\'s Art Studio & B&B<br />Cromdale, Cairngorms National Park<br />Scotland, United Kingdom')
                                            }}
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-xl">📧</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {getCmsValue('info', 'email_title', 'Email Us')}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            <a href={`mailto:${getCmsValue('info', 'email_address', 'hello@robinsartwork.com')}`} className="text-purple-600 hover:text-purple-700">
                                                {getCmsValue('info', 'email_address', 'hello@robinsartwork.com')}
                                            </a><br />
                                            {getCmsValue('info', 'email_note', 'We typically respond within 24 hours')}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-xl">📱</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {getCmsValue('info', 'phone_title', 'Phone')}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            <a href={`tel:${getCmsValue('info', 'phone_number', '(123) 456-7890').replace(/[^0-9+]/g, '')}`} className="text-purple-600 hover:text-purple-700">
                                                {getCmsValue('info', 'phone_number', '(123) 456-7890')}
                                            </a><br />
                                            {getCmsValue('info', 'phone_hours', 'Available Tue-Sat, 10 AM - 6 PM')}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-xl">💬</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {getCmsValue('info', 'social_title', 'Social Media')}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed mb-3">
                                            {getCmsValue('info', 'social_description', 'Follow Robin\'s artistic journey')}
                                        </p>
                                        <div className="flex space-x-4">
                                            {getCmsValue('info', 'linkedin_url') && (
                                                <a 
                                                    href={getCmsValue('info', 'linkedin_url', 'https://www.linkedin.com/in/robin-aitken-56180410/')} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-colors duration-200"
                                                    aria-label="LinkedIn Profile"
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                                    </svg>
                                                </a>
                                            )}
                                            {getCmsValue('info', 'facebook_url') && (
                                                <a 
                                                    href={getCmsValue('info', 'facebook_url', 'https://www.facebook.com/robin.aitken.woodley')} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-colors duration-200"
                                                    aria-label="Facebook Profile"
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                                    </svg>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                            {getCmsValue('faq', 'title', 'Frequently Asked Questions')}
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            {getCmsValue('faq', 'description', 'Common questions about Robin\'s artwork and services')}
                        </p>
                    </div>
                    
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-2xl shadow-lg">
                            <h3 className="text-xl font-semibold mb-4 text-gray-900">
                                {getCmsValue('faq', 'faq1_question', 'Can I commission a custom piece?')}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {getCmsValue('faq', 'faq1_answer', 'Yes! Robin accepts custom commissions. Please contact us with your vision, timeline, and budget, and we\'ll discuss how to bring your idea to life.')}
                            </p>
                        </div>
                        
                        <div className="bg-white p-8 rounded-2xl shadow-lg">
                            <h3 className="text-xl font-semibold mb-4 text-gray-900">
                                {getCmsValue('faq', 'faq2_question', 'Do you ship internationally?')}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {getCmsValue('faq', 'faq2_answer', 'We ship worldwide! All artwork is carefully packaged and insured. Shipping costs and delivery times vary by location.')}
                            </p>
                        </div>
                        
                        <div className="bg-white p-8 rounded-2xl shadow-lg">
                            <h3 className="text-xl font-semibold mb-4 text-gray-900">
                                {getCmsValue('faq', 'faq3_question', 'Can I visit the studio?')}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {getCmsValue('faq', 'faq3_answer', 'Studio visits are available by appointment only. Robin also runs a charming B&B in the Cairngorms National Park, so you can combine your art appreciation with a beautiful Scottish Highland getaway.')}
                            </p>
                        </div>
                        
                        <div className="bg-white p-8 rounded-2xl shadow-lg">
                            <h3 className="text-xl font-semibold mb-4 text-gray-900">
                                {getCmsValue('faq', 'faq4_question', 'What payment methods do you accept?')}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {getCmsValue('faq', 'faq4_answer', 'We accept all major credit cards, PayPal, and bank transfers. For high-value pieces, we can arrange payment plans.')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        {getCmsValue('cta', 'title', 'Ready to Start Your Collection?')}
                    </h2>
                    <p className="text-xl mb-10 leading-relaxed">
                        {getCmsValue('cta', 'description', 'Browse Robin\'s gallery and discover pieces that speak to your soul, or get in touch to discuss custom commissions.')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href={route('gallery')}>
                            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                                {getCmsValue('cta', 'primary_button_text', 'Explore Gallery')}
                            </Button>
                        </Link>
                        <Link href={route('about')}>
                            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                                {getCmsValue('cta', 'secondary_button_text', 'Learn More About Robin')}
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
