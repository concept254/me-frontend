import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

export default function Home() {
  const [about, setAbout] = useState(null)
  const [skills, setSkills] = useState([])
  const [projects, setProjects] = useState([])
  const [experience, setExperience] = useState([])
  const [education, setEducation] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [contactStatus, setContactStatus] = useState(null)
  const [newsletter, setNewsletter] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState(null)
  const [activeSkillTab, setActiveSkillTab] = useState('All')

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [aboutRes, skillsRes, projectsRes, expRes, eduRes, testimonialsRes] = await Promise.all([
          axios.get(`${API}/api/me/about`),
          axios.get(`${API}/api/me/skills`),
          axios.get(`${API}/api/me/projects`),
          axios.get(`${API}/api/me/experience`),
          axios.get(`${API}/api/me/education`),
          axios.get(`${API}/api/me/testimonials`),
        ])
        setAbout(aboutRes.data)
        setSkills(skillsRes.data)
        setProjects(projectsRes.data)
        setExperience(expRes.data)
        setEducation(eduRes.data)
        setTestimonials(testimonialsRes.data)
      } catch (err) {
        console.error('Failed to load data', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const handleContact = async () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactStatus({ type: 'error', message: 'Please fill in all required fields' })
      return
    }
    try {
      await axios.post(`${API}/api/me/contact`, contactForm)
      setContactStatus({ type: 'success', message: 'Message sent! I will get back to you soon.' })
      setContactForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      setContactStatus({ type: 'error', message: 'Failed to send message, please try again' })
    }
  }

  const handleNewsletter = async () => {
    if (!newsletter) return
    try {
      await axios.post(`${API}/api/me/newsletter`, { email: newsletter })
      setNewsletterStatus({ type: 'success', message: 'Subscribed successfully!' })
      setNewsletter('')
    } catch (err) {
      setNewsletterStatus({ type: 'error', message: 'Failed to subscribe, please try again' })
    }
  }

  const skillCategories = ['All', ...new Set(skills.map(s => s.category))]
  const filteredSkills = activeSkillTab === 'All' ? skills : skills.filter(s => s.category === activeSkillTab)

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="flex gap-2">
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── Hero ─────────────────────────────────────── */}
      <section id="about" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">

        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 text-center">

          {/* Available badge */}
          {about?.available && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-sm mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Available for work
            </div>
          )}

          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6">
            <span className="text-white">Hi, I'm </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              {about?.name}
            </span>
          </h1>

          <p className="text-2xl md:text-3xl text-gray-400 font-light mb-4">
            {about?.title}
          </p>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            {about?.bio}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <a
              href="#projects"
              className="px-8 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition text-sm"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="px-8 py-3 rounded-full border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-semibold transition text-sm"
            >
              Get In Touch
            </a>
            {about?.github && (
              <a
                href={about.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 rounded-full border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-semibold transition text-sm"
              >
                GitHub ↗
              </a>
            )}
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto border-t border-gray-800 pt-10">
            {[
              { label: 'Skills', value: skills.length + '+' },
              { label: 'Projects', value: projects.length + '+' },
              { label: 'Location', value: 'JHB, SA' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-black text-white">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Skills ───────────────────────────────────── */}
      <section id="skills" className="py-24 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-2">What I know</p>
            <h2 className="text-4xl font-black text-white">Tech Stack</h2>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 flex-wrap mb-10">
            {skillCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveSkillTab(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  activeSkillTab === cat
                    ? 'bg-indigo-600 text-white'
                    : 'border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Skills grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSkills.map(skill => (
              <div key={skill.id} className="bg-gray-900 rounded-xl p-5 border border-gray-800 hover:border-indigo-500/50 transition group">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white font-semibold">{skill.name}</span>
                  <span className="text-indigo-400 text-sm font-bold">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 mt-2 block">{skill.category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Experience ───────────────────────────────── */}
      <section id="experience" className="py-24 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-2">Where I've worked</p>
            <h2 className="text-4xl font-black text-white">Experience</h2>
          </div>

          {experience.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-4xl mb-4">💼</p>
              <p>Work experience coming soon</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-800 ml-6 hidden md:block" />
              <div className="space-y-8">
                {experience.map((exp, i) => (
                  <div key={exp.id} className="md:pl-16 relative">
                    {/* Timeline dot */}
                    <div className="absolute left-4 top-6 w-4 h-4 rounded-full bg-indigo-600 border-2 border-gray-950 hidden md:block" />
                    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-indigo-500/30 transition">
                      <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                          <p className="text-indigo-400 font-medium">{exp.company}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-gray-400">
                            {exp.start_date} — {exp.current ? 'Present' : exp.end_date}
                          </span>
                          {exp.current && (
                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                              Current
                            </span>
                          )}
                          {exp.location && <p className="text-xs text-gray-500 mt-1">{exp.location}</p>}
                        </div>
                      </div>
                      {exp.description && (
                        <p className="text-gray-400 text-sm leading-relaxed mt-3">{exp.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Education ────────────────────────────────── */}
      <section id="education" className="py-24 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-2">Where I studied</p>
            <h2 className="text-4xl font-black text-white">Education</h2>
          </div>

          {education.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-4xl mb-4">🎓</p>
              <p>Education history coming soon</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {education.map(edu => (
                <div key={edu.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-indigo-500/30 transition">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center text-2xl flex-shrink-0">
                      🎓
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{edu.qualification}</h3>
                      <p className="text-indigo-400 font-medium text-sm">{edu.institution}</p>
                      {edu.field && <p className="text-gray-500 text-sm">{edu.field}</p>}
                      <p className="text-gray-500 text-xs mt-2">
                        {edu.start_date} — {edu.current ? 'Present' : edu.end_date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Projects ─────────────────────────────────── */}
      <section id="projects" className="py-24 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-2">What I've built</p>
              <h2 className="text-4xl font-black text-white">Projects</h2>
            </div>
            <Link to="/blog" className="text-sm text-indigo-400 hover:text-indigo-300 transition">
              Read my blog →
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🚀</p>
              <p className="text-gray-500">Projects coming soon</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <div key={project.id} className="bg-gray-900 rounded-xl border border-gray-800 hover:border-indigo-500/50 transition group overflow-hidden">
                  {project.image_url ? (
                    <img src={project.image_url} alt={project.title} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 flex items-center justify-center">
                      <span className="text-4xl">🚀</span>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-white">{project.title}</h3>
                      {project.featured && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/20">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{project.description}</p>
                    {project.tech && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech.split(',').map(t => (
                          <span key={t} className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-400">
                            {t.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-3">
                      {project.url && (
                        <a href={project.url} target="_blank" rel="noopener noreferrer"
                          className="text-sm text-indigo-400 hover:text-indigo-300 transition">
                          Live ↗
                        </a>
                      )}
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                          className="text-sm text-gray-400 hover:text-white transition">
                          GitHub ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────── */}
      {testimonials.length > 0 && (
        <section id="testimonials" className="py-24 border-t border-gray-800">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-12">
              <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-2">Kind words</p>
              <h2 className="text-4xl font-black text-white">Testimonials</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map(t => (
                <div key={t.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <div className="flex mb-4">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className={i < t.rating ? 'text-yellow-400' : 'text-gray-700'}>⭐</span>
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600/30 flex items-center justify-center text-white font-bold">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{t.name}</p>
                      <p className="text-gray-500 text-xs">{t.role} — {t.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Newsletter ───────────────────────────────── */}
      <section className="py-24 border-t border-gray-800">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-2">Stay updated</p>
          <h2 className="text-4xl font-black text-white mb-4">Subscribe to my newsletter</h2>
          <p className="text-gray-400 mb-8">Get notified when I publish new blog posts about software engineering, tech trends and more.</p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              value={newsletter}
              onChange={e => setNewsletter(e.target.value)}
              className="flex-1 rounded-full bg-gray-900 border border-gray-700 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleNewsletter}
              className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition"
            >
              Subscribe
            </button>
          </div>
          {newsletterStatus && (
            <p className={`text-sm mt-3 ${newsletterStatus.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {newsletterStatus.message}
            </p>
          )}
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────── */}
      <section id="contact" className="py-24 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-2">Let's talk</p>
            <h2 className="text-4xl font-black text-white">Get In Touch</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Contact info */}
            <div>
              <p className="text-gray-400 leading-relaxed mb-8">
                I'm always open to new opportunities, collaborations or just a good conversation about tech. Feel free to reach out!
              </p>
              <div className="space-y-4">
                {about?.email && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center">📧</div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                      <a href={`mailto:${about.email}`} className="text-white hover:text-indigo-400 transition">{about.email}</a>
                    </div>
                  </div>
                )}
                {about?.phone && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center">📱</div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Phone</p>
                      <a href={`tel:${about.phone}`} className="text-white hover:text-indigo-400 transition">{about.phone}</a>
                    </div>
                  </div>
                )}
                {about?.location && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center">📍</div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Location</p>
                      <p className="text-white">{about.location}</p>
                    </div>
                  </div>
                )}
                {about?.github && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center">💻</div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">GitHub</p>
                      <a href={about.github} target="_blank" rel="noopener noreferrer" className="text-white hover:text-indigo-400 transition">{about.github}</a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact form */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your name *"
                  value={contactForm.name}
                  onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                  className="rounded-xl bg-gray-900 border border-gray-700 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="email"
                  placeholder="Your email *"
                  value={contactForm.email}
                  onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                  className="rounded-xl bg-gray-900 border border-gray-700 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <input
                type="text"
                placeholder="Subject"
                value={contactForm.subject}
                onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                className="w-full rounded-xl bg-gray-900 border border-gray-700 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
              <textarea
                rows={5}
                placeholder="Your message *"
                value={contactForm.message}
                onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                className="w-full rounded-xl bg-gray-900 border border-gray-700 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
              />
              {contactStatus && (
                <p className={`text-sm ${contactStatus.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {contactStatus.message}
                </p>
              )}
              <button
                onClick={handleContact}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────── */}
      <footer className="border-t border-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Klaus. Built with React, Node.js & PostgreSQL.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link to="/blog" className="hover:text-white transition">Blog</Link>
            {about?.github && (
              <a href={about.github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">GitHub</a>
            )}
            <a href={`mailto:${about?.email}`} className="hover:text-white transition">Email</a>
          </div>
        </div>
      </footer>

    </div>
  )
}