import { motion } from "motion/react";
import {
  Code2,
  Rocket,
  Brain,
  Youtube,
  ExternalLink,
  ChevronRight,
  Quote,
} from "lucide-react";

const techStack = [
  { name: "Java", color: "bg-red-500" },
  { name: "JS/TS", color: "bg-yellow-500" },
  { name: "Kotlin", color: "bg-indigo-500" },
  { name: "Dart", color: "bg-teal-500" },
];

const projects = [
  {
    title: "Real-time Chat Engine",
    role: "Lead Developer",
    tech: ["Java", "Socket", "Redis"],
    result: "Reduced latency by 40% using custom NIO implementation.",
  },
  {
    title: "E-commerce Platform",
    role: "Full-stack Developer",
    tech: ["React", "Node.js", "PostgreSQL"],
    result: "Scaled to 10k+ daily active users.",
  },
];

const journey = [
  { title: "System Design", type: "Learning", icon: Brain },
  { title: "Tech Talk TV", type: "YouTube", icon: Youtube },
  { title: "Advanced Flutter", type: "Course", icon: Rocket },
];

export default function Home() {
  return (
    <div className="h-full w-full bg-[#121212] text-white overflow-y-auto custom-scrollbar">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          <span className="text-purple-400 font-mono tracking-widest uppercase text-xs mb-4 block">
            Portfolio & Tech Wiki
          </span>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            효율을 추구하는
            <br />
            개발자
          </h1>
          <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto">
            단순한 코딩을 넘어, 시스템의 효율성과 지식의 연결성을 고민합니다.
            학습한 모든 기술은 유기적인 마인드맵으로 정리하여 공유합니다.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce"
        >
          <span className="text-[10px] text-white/50 uppercase tracking-[0.3em]">
            Scroll to explore
          </span>
          <div className="w-[3px] h-12 bg-gradient-to-b from-purple-500/70 to-transparent" />
        </motion.div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-32 px-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <Code2 className="text-purple-400 w-6 h-6" />
          <h2 className="text-3xl font-bold tracking-tight">Tech Stack</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {techStack.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group"
            >
              <div
                className={`w-2 h-2 rounded-full ${tech.color} mb-4 shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
              />
              <span className="text-xl font-semibold">{tech.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Philosophy & Approach Section */}
      <section className="py-32 px-6 max-w-5xl mx-auto border-y border-white/5">
        <div className="grid md:grid-cols-[1fr_2fr] gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-6">
              <Quote className="text-purple-400 w-6 h-6" />
              <h2 className="text-3xl font-bold tracking-tight">Philosophy</h2>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              기술은 도구일 뿐이며, 본질은 문제를 해결하는 방식에 있습니다. 저는
              복잡한 시스템을 단순화하고, 반복되는 비효율을 제거하는 과정에서
              가장 큰 즐거움을 느낍니다.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-purple-400">
                지식의 유기적 연결
              </h3>
              <p className="text-white/60 leading-relaxed">
                단편적인 지식 습득보다는 기술 간의 상관관계를 파악하는 것을
                중요하게 생각합니다. Java의 NIO가 어떻게 고성능 서버의 기반이
                되는지, React의 렌더링 원리가 어떻게 사용자 경험에 직결되는지
                깊이 있게 탐구하고 이를 마인드맵으로 구조화합니다.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-purple-400">
                지속 가능한 코드
              </h3>
              <p className="text-white/60 leading-relaxed">
                빠른 개발도 중요하지만, 유지보수가 용이하고 확장 가능한 설계를
                지향합니다. 클린 코드 원칙을 준수하며, 동료 개발자들이 읽기 쉽고
                신뢰할 수 있는 코드를 작성하기 위해 끊임없이 고민합니다.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-purple-400">
                사용자 중심의 효율성
              </h3>
              <p className="text-white/60 leading-relaxed">
                백엔드에서의 1ms 단축이 수만 명의 사용자에게는 쾌적한 경험으로
                돌아온다는 믿음으로 성능 최적화에 집중합니다. 불필요한 리소스
                낭비를 줄이고, 가장 효율적인 경로를 찾는 것이 개발자의 사명이라
                믿습니다.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-32 px-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <Rocket className="text-purple-400 w-6 h-6" />
          <h2 className="text-3xl font-bold tracking-tight">
            Project Showcase
          </h2>
        </div>
        <div className="grid gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-purple-500/30 transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h3 className="text-2xl font-bold">{project.title}</h3>
                <span className="px-4 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm font-medium border border-purple-500/20">
                  {project.role}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-mono text-white/40 bg-white/5 px-2 py-1 rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <p className="text-white/60 leading-relaxed flex items-start gap-2">
                <ChevronRight className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                {project.result}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Learning Journey Section */}
      <section className="py-32 px-6 max-w-5xl mx-auto mb-32">
        <div className="flex items-center gap-4 mb-12">
          <Brain className="text-purple-400 w-6 h-6" />
          <h2 className="text-3xl font-bold tracking-tight">
            Learning Journey
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {journey.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 group hover:bg-white/10 transition-colors"
            >
              <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 group-hover:scale-110 transition-transform">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-white/30 block mb-1">
                  {item.type}
                </span>
                <span className="font-semibold">{item.title}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 text-center">
        <p className="text-white/20 text-sm font-medium">
          © 2026 Developer Portfolio. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
