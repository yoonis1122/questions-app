import { Building, Target, Lightbulb, Rocket, Users, Heart, Phone } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 mb-4 tracking-tight drop-shadow-sm flex items-center justify-center gap-3">
          <span className="text-blue-500">🔷</span> About Us
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
          Learn more about our mission, vision, and the passionate team behind MasterMind.
        </p>
      </div>

      <div className="space-y-12">
        {/* Who We Are */}
        <section className="bg-white dark:bg-slate-900/60 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <Building className="w-8 h-8 text-indigo-500" />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Who We Are</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
            We are a passionate team dedicated to building modern, interactive, and user-friendly web applications. Our mission is to create digital experiences that are simple, engaging, and impactful for users across different platforms.
          </p>
        </section>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-indigo-50 dark:bg-indigo-950/20 p-8 rounded-3xl border border-indigo-100 dark:border-indigo-900">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-indigo-500" />
              <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">Our Mission</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
              Our mission is to deliver high-quality applications that solve real-world problems. We focus on innovation, performance, and usability to ensure every user has the best experience possible.
            </p>
          </section>

          <section className="bg-purple-50 dark:bg-purple-950/20 p-8 rounded-3xl border border-purple-100 dark:border-purple-900">
            <div className="flex items-center gap-3 mb-4">
              <Rocket className="w-8 h-8 text-purple-500" />
              <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100">Our Vision</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
              We aim to become a leading platform in creating smart and engaging applications that help users learn, explore, and grow in the digital world.
            </p>
          </section>
        </div>

        {/* What We Do */}
        <section className="bg-white dark:bg-slate-900/60 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="w-8 h-8 text-amber-500" />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">What We Do</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg mb-6">
            We specialize in:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              Full-stack web development (MERN Stack)
            </li>
            <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
              <div className="w-2 h-2 rounded-full bg-pink-500"></div>
              Interactive quiz and learning platforms
            </li>
            <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              User authentication and secure systems
            </li>
            <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              Responsive and modern UI/UX design
            </li>
          </ul>
        </section>

        {/* Team & Choose Us */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-blue-500" />
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Our Team</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Our team consists of creative developers, designers, and problem-solvers who are committed to continuous learning and improvement. We believe in teamwork, innovation, and delivering excellence.
            </p>
          </section>

          <section className="bg-rose-50 dark:bg-rose-950/20 p-8 rounded-3xl border border-rose-100 dark:border-rose-900">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-rose-500" />
              <h2 className="text-xl font-bold text-rose-900 dark:text-rose-100">Why Choose Us</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <span className="text-rose-500">✔</span> Clean and modern design
              </li>
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <span className="text-rose-500">✔</span> Fast and reliable performance
              </li>
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <span className="text-rose-500">✔</span> User-focused development
              </li>
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <span className="text-rose-500">✔</span> Continuous updates and improvements
              </li>
            </ul>
          </section>
        </div>

        {/* Contact info */}
        <section id="contact" className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 md:p-12 rounded-[2rem] shadow-2xl shadow-indigo-500/30 text-white flex flex-col items-center text-center mt-12">
          <Phone className="w-12 h-12 mb-6 opacity-90" />
          <h2 className="text-3xl font-extrabold mb-4 text-white">Contact Us</h2>
          <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">
            If you have any questions, feedback, or collaboration ideas, feel free to reach out to us anytime.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/20">
            <div className="flex flex-col items-center gap-2">
              <span className="text-indigo-200 text-sm font-bold uppercase tracking-wider">Email</span>
              <a href="mailto:yoonismaxamedaxmed3@gmail.com" className="font-medium hover:text-indigo-200 transition-colors">yoonismaxamedaxmed3@gmail.com</a>
            </div>
            <div className="flex flex-col items-center gap-2 border-t md:border-t-0 md:border-l border-white/20 pt-6 md:pt-0">
              <span className="text-indigo-200 text-sm font-bold uppercase tracking-wider">Phone</span>
              <a href="tel:+252618720972" className="font-medium hover:text-indigo-200 transition-colors">+252 618 720972</a>
            </div>
            <div className="flex flex-col items-center gap-2 border-t md:border-t-0 md:border-l border-white/20 pt-6 md:pt-0">
              <span className="text-indigo-200 text-sm font-bold uppercase tracking-wider">Location</span>
              <span className="font-medium">Mogadisho, Somalia</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
