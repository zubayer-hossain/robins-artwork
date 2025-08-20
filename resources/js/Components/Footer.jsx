import { Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-center md:text-left">
                        <p className="text-gray-600 text-sm">
                            © {new Date().getFullYear()} Robin's Artwork. All rights reserved.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <span>Created with</span>
                        <Heart className="w-4 h-4 text-red-500 fill-current" />
                        <span>by</span>
                        <a 
                            href="https://zubayerhs.com/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                            Zubayer
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
