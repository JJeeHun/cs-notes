import { motion } from 'motion/react';
import { Shield, Lock, Key, Eye, ArrowLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface SecurityWikiProps {
  onBack: () => void;
}

export default function SecurityWiki({ onBack }: SecurityWikiProps) {
  const securityFeatures = [
    {
      title: 'Authentication',
      desc: 'Who are you? Supporting OAuth2, OIDC, and Form Login.',
      icon: Key,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10'
    },
    {
      title: 'Authorization',
      desc: 'What can you do? Role-based and Attribute-based access control.',
      icon: Shield,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    },
    {
      title: 'Exploit Protection',
      desc: 'CSRF, Clickjacking, and Header-based security.',
      icon: Lock,
      color: 'text-red-400',
      bg: 'bg-red-500/10'
    }
  ];

  return (
    <div className="h-full w-full bg-[#121212] text-white overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl mx-auto px-6 py-20">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white/40 hover:text-purple-400 transition-colors group mb-8 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Wiki</span>
          </button>
          
          <div className="flex items-center gap-6">
            <div className="p-5 bg-purple-500/20 rounded-3xl text-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
              <Shield className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-5xl font-bold tracking-tight mb-2">Spring Security</h1>
              <p className="text-white/40 font-mono text-sm uppercase tracking-[0.2em]">Enterprise Grade Protection</p>
            </div>
          </div>
        </motion.div>

        {/* Interactive Content */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {securityFeatures.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-purple-500/30 transition-all group"
            >
              <div className={`p-3 rounded-xl ${feature.bg} ${feature.color} w-fit mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Code Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-[#1a1a1a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
            <span className="text-xs font-mono text-white/40 uppercase tracking-widest">SecurityConfig.java</span>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
            </div>
          </div>
          <div className="p-8 font-mono text-sm leading-relaxed overflow-x-auto">
            <pre className="text-white/80">
              <code className="block">
{`@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/public/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2Login(withDefaults());
        
        return http.build();
    }
}`}
              </code>
            </pre>
          </div>
        </motion.div>

        {/* Status Board */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="p-8 bg-green-500/5 border border-green-500/10 rounded-3xl">
            <div className="flex items-center gap-3 mb-6 text-green-400">
              <CheckCircle2 className="w-6 h-6" />
              <h4 className="font-bold">Best Practices Applied</h4>
            </div>
            <ul className="space-y-4 text-sm text-white/60">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-green-400" />
                Always use HTTPS in production
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-green-400" />
                Enable CSRF protection for state-changing requests
              </li>
            </ul>
          </div>
          
          <div className="p-8 bg-yellow-500/5 border border-yellow-500/10 rounded-3xl">
            <div className="flex items-center gap-3 mb-6 text-yellow-400">
              <AlertTriangle className="w-6 h-6" />
              <h4 className="font-bold">Common Pitfalls</h4>
            </div>
            <ul className="space-y-4 text-sm text-white/60">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-yellow-400" />
                Permitting all requests in development and forgetting to change
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-yellow-400" />
                Hardcoding credentials in SecurityConfig
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
