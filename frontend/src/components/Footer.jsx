import { Mail, Phone, MapPin, Globe, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="w-full bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300 mt-auto">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          <div className="flex flex-col space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">MasterMind</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Test your knowledge, challenge your mind, and track your progress with our dynamic quiz platform.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="p-2 bg-slate-100 dark:bg-slate-900 rounded-full text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-sm">
                <Globe className="w-5 h-5" />
              </a>
              <a href="https://wa.me/message/U434IWO2R56CB1" className="p-2 bg-slate-100 dark:bg-slate-900 rounded-full text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-sm">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-slate-500 dark:text-slate-400 group cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                <Mail className="w-5 h-5 text-indigo-500 dark:text-indigo-400 mt-0.5 group-hover:scale-110 transition-transform" />
                <span> <a href="yoonismaxamedaxmed3@gmail.com">yoonismaxamedaxmed3@gmail.com</a></span>
              </li>
              <li className="flex items-start gap-3 text-slate-500 dark:text-slate-400 group cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                <Phone className="w-5 h-5 text-indigo-500 dark:text-indigo-400 mt-0.5 group-hover:scale-110 transition-transform" />
                <span> <a href="https://wa.me/message/U434IWO2R56CB1">+2520618720972</a></span>
              </li>
              <li className="flex items-start gap-3 text-slate-500 dark:text-slate-400 group cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                <MapPin className="w-5 h-5 text-indigo-500 dark:text-indigo-400 mt-0.5 group-hover:scale-110 transition-transform" />
                <span>xirfad Knowledge web<br/>mogadisho</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About Us</a></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">FAQ</a></li>
            </ul>
          </div>
          
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-500 text-sm flex flex-col items-center">
          <p>&copy; {new Date().getFullYear()} MasterMind Quiz App. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
