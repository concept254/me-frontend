import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

const API = import.meta.env.VITE_API_URL

export default function AdminDashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('about')
  const [status, setStatus] = useState(null)

  // About
  const [about, setAbout] = useState(null)

  // Skills
  const [skills, setSkills] = useState([])
  const [skillForm, setSkillForm] = useState({ name: '', category: '', level: 80, sort_order: 0 })
  const [editingSkill, setEditingSkill] = useState(null)

  // Experience
  const [experience, setExperience] = useState([])
  const [expForm, setExpForm] = useState({ company: '', role: '', description: '', start_date: '', end_date: '', current: false, location: '' })
  const [editingExp, setEditingExp] = useState(null)

  // Education
  const [education, setEducation] = useState([])
  const [eduForm, setEduForm] = useState({ institution: '', qualification: '', field: '', start_date: '', end_date: '', current: false, description: '' })
  const [editingEdu, setEditingEdu] = useState(null)

  // Projects
  const [projects, setProjects] = useState([])
  const [projForm, setProjForm] = useState({ title: '', description: '', tech: '', url: '', github_url: '', image_url: '', featured: false, sort_order: 0 })
  const [editingProj, setEditingProj] = useState(null)

  // Blog
  const [posts, setPosts] = useState([])
  const [postForm, setPostForm] = useState({ title: '', slug: '', body: '', excerpt: '', category: '', tags: '', featured_image: '', published: false })
  const [editingPost, setEditingPost] = useState(null)

  // Contacts
  const [contacts, setContacts] = useState([])

  // Newsletter
  const [subscribers, setSubscribers] = useState([])

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login')
      return
    }
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      const [aboutRes, skillsRes, expRes, eduRes, projRes, postsRes, contactsRes, subsRes] = await Promise.all([
        axios.get(API + '/api/me/about'),
        axios.get(API + '/api/me/skills'),
        axios.get(API + '/api/me/experience'),
        axios.get(API + '/api/me/education'),
        axios.get(API + '/api/me/projects'),
        axios.get(API + '/api/me/admin/blog'),
        axios.get(API + '/api/me/admin/contacts'),
        axios.get(API + '/api/me/admin/newsletter'),
      ])
      setAbout(aboutRes.data)
      setSkills(skillsRes.data)
      setExperience(expRes.data)
      setEducation(eduRes.data)
      setProjects(projRes.data)
      setPosts(postsRes.data)
      setContacts(contactsRes.data)
      setSubscribers(subsRes.data)
    } catch (err) {
      console.error(err)
    }
  }

  const showStatus = (msg, type = 'success') => {
    setStatus({ msg, type })
    setTimeout(() => setStatus(null), 3000)
  }

  // ── About handlers ───────────────────────────
  const saveAbout = async () => {
    try {
      await axios.put(API + '/api/me/admin/about', about)
      showStatus('About updated!')
    } catch (err) {
      showStatus('Failed to update', 'error')
    }
  }

  // ── Skills handlers ──────────────────────────
  const saveSkill = async () => {
    try {
      if (editingSkill) {
        await axios.put(API + '/api/me/admin/skills/' + editingSkill, skillForm)
        showStatus('Skill updated!')
      } else {
        await axios.post(API + '/api/me/admin/skills', skillForm)
        showStatus('Skill added!')
      }
      setSkillForm({ name: '', category: '', level: 80, sort_order: 0 })
      setEditingSkill(null)
      const res = await axios.get(API + '/api/me/skills')
      setSkills(res.data)
    } catch (err) {
      showStatus('Failed to save skill', 'error')
    }
  }

  const deleteSkill = async (id) => {
    if (!confirm('Delete this skill?')) return
    await axios.delete(API + '/api/me/admin/skills/' + id)
    setSkills(skills.filter(s => s.id !== id))
    showStatus('Skill deleted!')
  }

  // ── Experience handlers ──────────────────────
  const saveExp = async () => {
    try {
      if (editingExp) {
        await axios.put(API + '/api/me/admin/experience/' + editingExp, expForm)
        showStatus('Experience updated!')
      } else {
        await axios.post(API + '/api/me/admin/experience', expForm)
        showStatus('Experience added!')
      }
      setExpForm({ company: '', role: '', description: '', start_date: '', end_date: '', current: false, location: '' })
      setEditingExp(null)
      const res = await axios.get(API + '/api/me/experience')
      setExperience(res.data)
    } catch (err) {
      showStatus('Failed to save', 'error')
    }
  }

  const deleteExp = async (id) => {
    if (!confirm('Delete this experience?')) return
    await axios.delete(API + '/api/me/admin/experience/' + id)
    setExperience(experience.filter(e => e.id !== id))
    showStatus('Deleted!')
  }

  // ── Education handlers ───────────────────────
  const saveEdu = async () => {
    try {
      if (editingEdu) {
        await axios.put(API + '/api/me/admin/education/' + editingEdu, eduForm)
        showStatus('Education updated!')
      } else {
        await axios.post(API + '/api/me/admin/education', eduForm)
        showStatus('Education added!')
      }
      setEduForm({ institution: '', qualification: '', field: '', start_date: '', end_date: '', current: false, description: '' })
      setEditingEdu(null)
      const res = await axios.get(API + '/api/me/education')
      setEducation(res.data)
    } catch (err) {
      showStatus('Failed to save', 'error')
    }
  }

  const deleteEdu = async (id) => {
    if (!confirm('Delete this education?')) return
    await axios.delete(API + '/api/me/admin/education/' + id)
    setEducation(education.filter(e => e.id !== id))
    showStatus('Deleted!')
  }

  // ── Projects handlers ────────────────────────
  const saveProj = async () => {
    try {
      if (editingProj) {
        await axios.put(API + '/api/me/admin/projects/' + editingProj, projForm)
        showStatus('Project updated!')
      } else {
        await axios.post(API + '/api/me/admin/projects', projForm)
        showStatus('Project added!')
      }
      setProjForm({ title: '', description: '', tech: '', url: '', github_url: '', image_url: '', featured: false, sort_order: 0 })
      setEditingProj(null)
      const res = await axios.get(API + '/api/me/projects')
      setProjects(res.data)
    } catch (err) {
      showStatus('Failed to save', 'error')
    }
  }

  const deleteProj = async (id) => {
    if (!confirm('Delete this project?')) return
    await axios.delete(API + '/api/me/admin/projects/' + id)
    setProjects(projects.filter(p => p.id !== id))
    showStatus('Deleted!')
  }

  // ── Blog handlers ────────────────────────────
  const autoSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const savePost = async () => {
    try {
      if (editingPost) {
        await axios.put(API + '/api/me/admin/blog/' + editingPost, postForm)
        showStatus('Post updated!')
      } else {
        await axios.post(API + '/api/me/admin/blog', postForm)
        showStatus('Post created!')
      }
      setPostForm({ title: '', slug: '', body: '', excerpt: '', category: '', tags: '', featured_image: '', published: false })
      setEditingPost(null)
      const res = await axios.get(API + '/api/me/admin/blog')
      setPosts(res.data)
    } catch (err) {
      showStatus(err.response?.data?.error || 'Failed to save', 'error')
    }
  }

  const deletePost = async (id) => {
    if (!confirm('Delete this post?')) return
    await axios.delete(API + '/api/me/admin/blog/' + id)
    setPosts(posts.filter(p => p.id !== id))
    showStatus('Deleted!')
  }

  const tabs = [
    { id: 'about', label: '👤 About' },
    { id: 'skills', label: '⚡ Skills' },
    { id: 'experience', label: '💼 Experience' },
    { id: 'education', label: '🎓 Education' },
    { id: 'projects', label: '🚀 Projects' },
    { id: 'blog', label: '✍️ Blog' },
    { id: 'contacts', label: '📧 Contacts' },
    { id: 'newsletter', label: '📰 Newsletter' },
  ]

  const inputClass = "w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
  const labelClass = "text-xs text-gray-400 uppercase tracking-wider mb-1 block"
  const btnPrimary = "px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition"
  const btnDanger = "px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-400 text-xs transition"
  const btnEdit = "px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 text-xs transition"

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="font-bold text-white">Klaus<span className="text-indigo-400">.</span></span>
          <span className="text-gray-500 text-sm">Admin Panel</span>
        </div>
        <div className="flex items-center gap-4">
          {status && (
            <span className={`text-sm px-3 py-1 rounded-full ${status.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {status.msg}
            </span>
          )}
          <Link to="/" className="text-sm text-gray-400 hover:text-white transition">View Site</Link>
          <button onClick={() => { signOut(); navigate('/admin/login') }}
            className="text-sm px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:text-white transition">
            Sign Out
          </button>
        </div>
      </div>

      <div className="flex pt-16">

        {/* Sidebar */}
        <div className="fixed left-0 top-16 bottom-0 w-52 bg-gray-900 border-r border-gray-800 p-4 overflow-y-auto">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="ml-52 flex-1 p-8">

          {/* ── ABOUT ── */}
          {activeTab === 'about' && about && (
            <div>
              <h2 className="text-2xl font-black mb-6">About</h2>
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Name</label>
                    <input className={inputClass} value={about.name || ''} onChange={e => setAbout({ ...about, name: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Title</label>
                    <input className={inputClass} value={about.title || ''} onChange={e => setAbout({ ...about, title: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Tagline</label>
                  <input className={inputClass} value={about.tagline || ''} onChange={e => setAbout({ ...about, tagline: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Bio</label>
                  <textarea rows={4} className={inputClass} value={about.bio || ''} onChange={e => setAbout({ ...about, bio: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Email</label>
                    <input className={inputClass} value={about.email || ''} onChange={e => setAbout({ ...about, email: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input className={inputClass} value={about.phone || ''} onChange={e => setAbout({ ...about, phone: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Location</label>
                    <input className={inputClass} value={about.location || ''} onChange={e => setAbout({ ...about, location: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>GitHub</label>
                    <input className={inputClass} value={about.github || ''} onChange={e => setAbout({ ...about, github: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>LinkedIn</label>
                    <input className={inputClass} value={about.linkedin || ''} onChange={e => setAbout({ ...about, linkedin: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Website</label>
                    <input className={inputClass} value={about.website || ''} onChange={e => setAbout({ ...about, website: e.target.value })} />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="available" checked={about.available || false}
                    onChange={e => setAbout({ ...about, available: e.target.checked })}
                    className="w-4 h-4 accent-indigo-600" />
                  <label htmlFor="available" className="text-sm text-gray-300">Available for work</label>
                </div>
                <button onClick={saveAbout} className={btnPrimary}>Save About</button>
              </div>
            </div>
          )}

          {/* ── SKILLS ── */}
          {activeTab === 'skills' && (
            <div>
              <h2 className="text-2xl font-black mb-6">Skills</h2>
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6 space-y-4">
                <h3 className="font-semibold text-white">{editingSkill ? 'Edit Skill' : 'Add Skill'}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Name</label>
                    <input className={inputClass} placeholder="React / Vite" value={skillForm.name} onChange={e => setSkillForm({ ...skillForm, name: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Category</label>
                    <input className={inputClass} placeholder="Frontend" value={skillForm.category} onChange={e => setSkillForm({ ...skillForm, category: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Level: {skillForm.level}%</label>
                  <input type="range" min="1" max="100" value={skillForm.level}
                    onChange={e => setSkillForm({ ...skillForm, level: parseInt(e.target.value) })}
                    className="w-full accent-indigo-600" />
                </div>
                <div className="flex gap-3">
                  <button onClick={saveSkill} className={btnPrimary}>{editingSkill ? 'Update' : 'Add Skill'}</button>
                  {editingSkill && (
                    <button onClick={() => { setEditingSkill(null); setSkillForm({ name: '', category: '', level: 80, sort_order: 0 }) }}
                      className="px-4 py-2 rounded-xl border border-gray-700 text-gray-400 text-sm transition hover:text-white">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                {skills.map(skill => (
                  <div key={skill.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800 flex justify-between items-center">
                    <div>
                      <span className="text-white font-semibold">{skill.name}</span>
                      <span className="text-gray-500 text-sm ml-3">{skill.category}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-indigo-400 text-sm font-bold">{skill.level}%</span>
                      <button onClick={() => { setEditingSkill(skill.id); setSkillForm({ name: skill.name, category: skill.category, level: skill.level, sort_order: skill.sort_order }) }} className={btnEdit}>Edit</button>
                      <button onClick={() => deleteSkill(skill.id)} className={btnDanger}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── EXPERIENCE ── */}
          {activeTab === 'experience' && (
            <div>
              <h2 className="text-2xl font-black mb-6">Experience</h2>
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6 space-y-4">
                <h3 className="font-semibold text-white">{editingExp ? 'Edit Experience' : 'Add Experience'}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Company</label>
                    <input className={inputClass} value={expForm.company} onChange={e => setExpForm({ ...expForm, company: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Role</label>
                    <input className={inputClass} value={expForm.role} onChange={e => setExpForm({ ...expForm, role: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Start Date</label>
                    <input className={inputClass} placeholder="Jan 2023" value={expForm.start_date} onChange={e => setExpForm({ ...expForm, start_date: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>End Date</label>
                    <input className={inputClass} placeholder="Dec 2024" disabled={expForm.current} value={expForm.end_date} onChange={e => setExpForm({ ...expForm, end_date: e.target.value })} />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={expForm.current} onChange={e => setExpForm({ ...expForm, current: e.target.checked })} className="w-4 h-4 accent-indigo-600" />
                  <label className="text-sm text-gray-300">Currently working here</label>
                </div>
                <div>
                  <label className={labelClass}>Location</label>
                  <input className={inputClass} value={expForm.location} onChange={e => setExpForm({ ...expForm, location: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Description</label>
                  <textarea rows={3} className={inputClass} value={expForm.description} onChange={e => setExpForm({ ...expForm, description: e.target.value })} />
                </div>
                <div className="flex gap-3">
                  <button onClick={saveExp} className={btnPrimary}>{editingExp ? 'Update' : 'Add Experience'}</button>
                  {editingExp && (
                    <button onClick={() => { setEditingExp(null); setExpForm({ company: '', role: '', description: '', start_date: '', end_date: '', current: false, location: '' }) }}
                      className="px-4 py-2 rounded-xl border border-gray-700 text-gray-400 text-sm transition hover:text-white">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                {experience.map(exp => (
                  <div key={exp.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800 flex justify-between items-start">
                    <div>
                      <p className="text-white font-semibold">{exp.role}</p>
                      <p className="text-indigo-400 text-sm">{exp.company}</p>
                      <p className="text-gray-500 text-xs">{exp.start_date} — {exp.current ? 'Present' : exp.end_date}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingExp(exp.id); setExpForm({ company: exp.company, role: exp.role, description: exp.description || '', start_date: exp.start_date || '', end_date: exp.end_date || '', current: exp.current, location: exp.location || '' }) }} className={btnEdit}>Edit</button>
                      <button onClick={() => deleteExp(exp.id)} className={btnDanger}>Delete</button>
                    </div>
                  </div>
                ))}
                {experience.length === 0 && <p className="text-gray-500 text-sm">No experience added yet</p>}
              </div>
            </div>
          )}

          {/* ── EDUCATION ── */}
          {activeTab === 'education' && (
            <div>
              <h2 className="text-2xl font-black mb-6">Education</h2>
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6 space-y-4">
                <h3 className="font-semibold text-white">{editingEdu ? 'Edit Education' : 'Add Education'}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Institution</label>
                    <input className={inputClass} value={eduForm.institution} onChange={e => setEduForm({ ...eduForm, institution: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Qualification</label>
                    <input className={inputClass} value={eduForm.qualification} onChange={e => setEduForm({ ...eduForm, qualification: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Field of Study</label>
                  <input className={inputClass} value={eduForm.field} onChange={e => setEduForm({ ...eduForm, field: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Start Date</label>
                    <input className={inputClass} placeholder="2020" value={eduForm.start_date} onChange={e => setEduForm({ ...eduForm, start_date: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>End Date</label>
                    <input className={inputClass} placeholder="2023" disabled={eduForm.current} value={eduForm.end_date} onChange={e => setEduForm({ ...eduForm, end_date: e.target.value })} />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={eduForm.current} onChange={e => setEduForm({ ...eduForm, current: e.target.checked })} className="w-4 h-4 accent-indigo-600" />
                  <label className="text-sm text-gray-300">Currently studying</label>
                </div>
                <div>
                  <label className={labelClass}>Description</label>
                  <textarea rows={2} className={inputClass} value={eduForm.description} onChange={e => setEduForm({ ...eduForm, description: e.target.value })} />
                </div>
                <div className="flex gap-3">
                  <button onClick={saveEdu} className={btnPrimary}>{editingEdu ? 'Update' : 'Add Education'}</button>
                  {editingEdu && (
                    <button onClick={() => { setEditingEdu(null); setEduForm({ institution: '', qualification: '', field: '', start_date: '', end_date: '', current: false, description: '' }) }}
                      className="px-4 py-2 rounded-xl border border-gray-700 text-gray-400 text-sm transition hover:text-white">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                {education.map(edu => (
                  <div key={edu.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800 flex justify-between items-start">
                    <div>
                      <p className="text-white font-semibold">{edu.qualification}</p>
                      <p className="text-indigo-400 text-sm">{edu.institution}</p>
                      <p className="text-gray-500 text-xs">{edu.field}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingEdu(edu.id); setEduForm({ institution: edu.institution, qualification: edu.qualification, field: edu.field || '', start_date: edu.start_date || '', end_date: edu.end_date || '', current: edu.current, description: edu.description || '' }) }} className={btnEdit}>Edit</button>
                      <button onClick={() => deleteEdu(edu.id)} className={btnDanger}>Delete</button>
                    </div>
                  </div>
                ))}
                {education.length === 0 && <p className="text-gray-500 text-sm">No education added yet</p>}
              </div>
            </div>
          )}

          {/* ── PROJECTS ── */}
          {activeTab === 'projects' && (
            <div>
              <h2 className="text-2xl font-black mb-6">Projects</h2>
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6 space-y-4">
                <h3 className="font-semibold text-white">{editingProj ? 'Edit Project' : 'Add Project'}</h3>
                <div>
                  <label className={labelClass}>Title</label>
                  <input className={inputClass} value={projForm.title} onChange={e => setProjForm({ ...projForm, title: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Description</label>
                  <textarea rows={3} className={inputClass} value={projForm.description} onChange={e => setProjForm({ ...projForm, description: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Tech Stack (comma separated)</label>
                  <input className={inputClass} placeholder="React, Node.js, PostgreSQL" value={projForm.tech} onChange={e => setProjForm({ ...projForm, tech: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Live URL</label>
                    <input className={inputClass} value={projForm.url} onChange={e => setProjForm({ ...projForm, url: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>GitHub URL</label>
                    <input className={inputClass} value={projForm.github_url} onChange={e => setProjForm({ ...projForm, github_url: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Image URL</label>
                  <input className={inputClass} value={projForm.image_url} onChange={e => setProjForm({ ...projForm, image_url: e.target.value })} />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={projForm.featured} onChange={e => setProjForm({ ...projForm, featured: e.target.checked })} className="w-4 h-4 accent-indigo-600" />
                  <label className="text-sm text-gray-300">Featured project</label>
                </div>
                <div className="flex gap-3">
                  <button onClick={saveProj} className={btnPrimary}>{editingProj ? 'Update' : 'Add Project'}</button>
                  {editingProj && (
                    <button onClick={() => { setEditingProj(null); setProjForm({ title: '', description: '', tech: '', url: '', github_url: '', image_url: '', featured: false, sort_order: 0 }) }}
                      className="px-4 py-2 rounded-xl border border-gray-700 text-gray-400 text-sm transition hover:text-white">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                {projects.map(proj => (
                  <div key={proj.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800 flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-semibold">{proj.title}</p>
                        {proj.featured && <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-600/20 text-indigo-400">Featured</span>}
                      </div>
                      <p className="text-gray-500 text-xs mt-1">{proj.tech}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingProj(proj.id); setProjForm({ title: proj.title, description: proj.description || '', tech: proj.tech || '', url: proj.url || '', github_url: proj.github_url || '', image_url: proj.image_url || '', featured: proj.featured, sort_order: proj.sort_order }) }} className={btnEdit}>Edit</button>
                      <button onClick={() => deleteProj(proj.id)} className={btnDanger}>Delete</button>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && <p className="text-gray-500 text-sm">No projects added yet</p>}
              </div>
            </div>
          )}

          {/* ── BLOG ── */}
          {activeTab === 'blog' && (
            <div>
              <h2 className="text-2xl font-black mb-6">Blog</h2>
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6 space-y-4">
                <h3 className="font-semibold text-white">{editingPost ? 'Edit Post' : 'New Post'}</h3>
                <div>
                  <label className={labelClass}>Title</label>
                  <input className={inputClass} value={postForm.title}
                    onChange={e => setPostForm({ ...postForm, title: e.target.value, slug: editingPost ? postForm.slug : autoSlug(e.target.value) })} />
                </div>
                <div>
                  <label className={labelClass}>Slug</label>
                  <input className={inputClass} value={postForm.slug} onChange={e => setPostForm({ ...postForm, slug: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Excerpt</label>
                  <textarea rows={2} className={inputClass} value={postForm.excerpt} onChange={e => setPostForm({ ...postForm, excerpt: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Body</label>
                  <textarea rows={10} className={inputClass} value={postForm.body} onChange={e => setPostForm({ ...postForm, body: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Category</label>
                    <input className={inputClass} value={postForm.category} onChange={e => setPostForm({ ...postForm, category: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Tags (comma separated)</label>
                    <input className={inputClass} value={postForm.tags} onChange={e => setPostForm({ ...postForm, tags: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Featured Image URL</label>
                  <input className={inputClass} value={postForm.featured_image} onChange={e => setPostForm({ ...postForm, featured_image: e.target.value })} />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={postForm.published} onChange={e => setPostForm({ ...postForm, published: e.target.checked })} className="w-4 h-4 accent-indigo-600" />
                  <label className="text-sm text-gray-300">Published</label>
                </div>
                <div className="flex gap-3">
                  <button onClick={savePost} className={btnPrimary}>{editingPost ? 'Update Post' : 'Create Post'}</button>
                  {editingPost && (
                    <button onClick={() => { setEditingPost(null); setPostForm({ title: '', slug: '', body: '', excerpt: '', category: '', tags: '', featured_image: '', published: false }) }}
                      className="px-4 py-2 rounded-xl border border-gray-700 text-gray-400 text-sm transition hover:text-white">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                {posts.map(post => (
                  <div key={post.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800 flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-semibold">{post.title}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${post.published ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs mt-1">{post.category} · {post.views} views</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingPost(post.id); setPostForm({ title: post.title, slug: post.slug, body: post.body || '', excerpt: post.excerpt || '', category: post.category || '', tags: post.tags || '', featured_image: post.featured_image || '', published: post.published }) }} className={btnEdit}>Edit</button>
                      <button onClick={() => deletePost(post.id)} className={btnDanger}>Delete</button>
                    </div>
                  </div>
                ))}
                {posts.length === 0 && <p className="text-gray-500 text-sm">No posts yet</p>}
              </div>
            </div>
          )}

          {/* ── CONTACTS ── */}
          {activeTab === 'contacts' && (
            <div>
              <h2 className="text-2xl font-black mb-6">Contacts ({contacts.filter(c => !c.is_read).length} unread)</h2>
              <div className="space-y-4">
                {contacts.map(contact => (
                  <div key={contact.id} className={`bg-gray-900 rounded-xl p-5 border transition ${contact.is_read ? 'border-gray-800' : 'border-indigo-500/50'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-white font-semibold">{contact.name}</p>
                        <p className="text-indigo-400 text-sm">{contact.email}</p>
                        {contact.subject && <p className="text-gray-400 text-sm">{contact.subject}</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">{new Date(contact.date_created).toLocaleDateString()}</span>
                        {!contact.is_read && (
                          <button onClick={async () => {
                            await axios.put(API + '/api/me/admin/contacts/' + contact.id + '/read')
                            setContacts(contacts.map(c => c.id === contact.id ? { ...c, is_read: true } : c))
                          }} className={btnEdit}>Mark read</button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{contact.message}</p>
                  </div>
                ))}
                {contacts.length === 0 && <p className="text-gray-500">No messages yet</p>}
              </div>
            </div>
          )}

          {/* ── NEWSLETTER ── */}
          {activeTab === 'newsletter' && (
            <div>
              <h2 className="text-2xl font-black mb-6">Newsletter ({subscribers.length} subscribers)</h2>
              <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-800">
                    <tr>
                      <th className="text-left px-6 py-3 text-gray-400 font-medium">Email</th>
                      <th className="text-left px-6 py-3 text-gray-400 font-medium">Status</th>
                      <th className="text-left px-6 py-3 text-gray-400 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {subscribers.map(sub => (
                      <tr key={sub.id} className="hover:bg-gray-800/50 transition">
                        <td className="px-6 py-3 text-white">{sub.email}</td>
                        <td className="px-6 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${sub.subscribed ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                            {sub.subscribed ? 'Subscribed' : 'Unsubscribed'}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-gray-400">{new Date(sub.date_created).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {subscribers.length === 0 && <p className="text-gray-500 text-sm p-6">No subscribers yet</p>}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}