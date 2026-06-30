"use client";

import { useState } from "react";
import {
  BellRing,
  Building2,
  Check,
  ChevronRight,
  CircleDollarSign,
  KeyRound,
  MapPin,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  UserCog,
  UsersRound,
} from "lucide-react";

// ============ TYPES ============
type Section = "users" | "roles" | "leads" | "projects" | "notifications" | "system";
type UserRole = "Assigner" | "Relationship Manager";

interface CRMUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
}

interface Project {
  id: number;
  name: string;
  status: "Active" | "Upcoming" | "Completed";
  location: string;
  budget: string;
}

// ============ CONSTANTS ============
const sections = [
  { id: "users" as const, label: "User Management", icon: UsersRound },
  { id: "roles" as const, label: "Roles & Permissions", icon: ShieldCheck },
  { id: "leads" as const, label: "Lead Configuration", icon: SlidersHorizontal },
  { id: "projects" as const, label: "Project Management", icon: Building2 },
  { id: "notifications" as const, label: "Notifications", icon: BellRing },
  { id: "system" as const, label: "System Settings", icon: Settings2 },
];

const initialUsers: CRMUser[] = [
  { id: 1, name: "Arvind Kumar", email: "arvind@vasiyam.com", role: "Assigner", active: true },
  { id: 2, name: "Priya Sharma", email: "priya@vasiyam.com", role: "Relationship Manager", active: true },
  { id: 3, name: "Suresh Kumar", email: "suresh@vasiyam.com", role: "Relationship Manager", active: false },
];

const initialProjects: Project[] = [
  { id: 1, name: "Vasiyam Hills", status: "Active", location: "Coimbatore", budget: "₹45L – ₹75L" },
  { id: 2, name: "Vasiyam Elite", status: "Upcoming", location: "Chennai", budget: "₹60L – ₹1.2Cr" },
];

const inputClass =
  "h-10 w-full rounded-lg border border-[#dfe4e2] bg-white px-3 text-sm text-[#18201e] outline-none transition focus:border-[#216b50] focus:ring-2 focus:ring-[#216b50]/10";

// ============ SHARED COMPONENTS ============
const PanelHeader = ({ title, description }: { title: string; description: string }) => (
  <div className="border-b border-[#e8ecea] px-5 py-4 sm:px-6">
    <h2 className="text-base font-semibold text-[#17201d]">{title}</h2>
    <p className="mt-1 text-xs text-[#7a8380]">{description}</p>
  </div>
);

const Toggle = ({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) => (
  <div className="flex items-center justify-between gap-5 border-b border-[#edf0ef] py-4 last:border-0">
    <div>
      <p className="text-sm font-medium text-[#17201d]">{label}</p>
      <p className="mt-1 text-xs text-[#7a8380]">{description}</p>
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        checked ? "bg-[#176044]" : "bg-[#cdd4d1]"
      }`}
    >
      <span
        className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  </div>
);

const TagManager = ({
  title,
  description,
  items,
  onChange,
}: {
  title: string;
  description: string;
  items: string[];
  onChange: (items: string[]) => void;
}) => {
  const [value, setValue] = useState("");

  const add = () => {
    const cleanValue = value.trim();
    if (!cleanValue || items.includes(cleanValue)) return;
    onChange([...items, cleanValue]);
    setValue("");
  };

  return (
    <div className="rounded-xl border border-[#e3e8e6] p-4">
      <h3 className="text-sm font-semibold text-[#17201d]">{title}</h3>
      <p className="mt-1 text-xs text-[#7a8380]">{description}</p>
      <div className="mt-4 flex gap-2">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && add()}
          placeholder={`Add ${title.toLowerCase()}`}
          className={inputClass}
        />
        <button
          type="button"
          onClick={add}
          className="inline-flex h-10 shrink-0 items-center gap-1 rounded-lg bg-[#176044] px-3 text-xs font-semibold text-white hover:bg-[#124e37]"
        >
          <Plus size={14} /> Add
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-2 rounded-full bg-[#edf6f2] px-3 py-1.5 text-xs font-medium text-[#176044]"
          >
            {item}
            <button type="button" onClick={() => onChange(items.filter((entry) => entry !== item))}>
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

// ============ SETTINGS PAGE ============
export default function SettingsPage() {
  // State
  const [active, setActive] = useState<Section>("users");
  const [message, setMessage] = useState("");
  
  // Users state
  const [users, setUsers] = useState(initialUsers);
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [userForm, setUserForm] = useState<{ name: string; email: string; role: UserRole }>({
    name: "",
    email: "",
    role: "Relationship Manager",
  });

  // Roles & Permissions state
  const [rolePermissions, setRolePermissions] = useState<Record<UserRole, string[]>>({
    Assigner: ["Dashboard", "Leads", "Lead Assignment", "Reports"],
    "Relationship Manager": ["Dashboard", "My Leads", "Activities", "Site Visits"],
  });

  // Leads state
  const [sources, setSources] = useState(["Website", "Referral", "Walk-in", "99acres"]);
  const [statuses, setStatuses] = useState(["New", "Contacted", "Qualified", "Lost"]);
  const [pipeline, setPipeline] = useState(["New", "Contacted", "Site Visit", "Negotiation", "Booked"]);
  const [scoreRules, setScoreRules] = useState(["Budget matched +20", "Site visit completed +30"]);

  // Projects state
  const [projects, setProjects] = useState(initialProjects);
  const [editingProject, setEditingProject] = useState<number | null>(null);
  const [projectForm, setProjectForm] = useState<Omit<Project, "id">>({
    name: "",
    status: "Active",
    location: "",
    budget: "",
  });

  // Notifications state
  const [notifications, setNotifications] = useState({
    email: true,
    followUp: true,
    assignment: true,
  });

  // System state
  const [system, setSystem] = useState({
    company: "Vasiyam Homes",
    timezone: "Asia/Kolkata",
    currency: "INR",
    dateFormat: "DD/MM/YYYY",
  });

  // ============ HANDLERS ============
  const notify = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 2500);
  };

  // User handlers
  const submitUser = () => {
    if (!userForm.name.trim() || !userForm.email.trim()) return;

    if (editingUser !== null) {
      setUsers((current) =>
        current.map((user) => (user.id === editingUser ? { ...user, ...userForm } : user))
      );
      notify("User updated successfully");
    } else {
      setUsers((current) => [...current, { id: Date.now(), ...userForm, active: true }]);
      notify("User created successfully");
    }

    setEditingUser(null);
    setUserForm({ name: "", email: "", role: "Relationship Manager" });
  };

  const startEditUser = (user: CRMUser) => {
    setEditingUser(user.id);
    setUserForm({ name: user.name, email: user.email, role: user.role });
  };

  // Project handlers
  const submitProject = () => {
    if (!projectForm.name.trim() || !projectForm.location.trim()) return;

    if (editingProject !== null) {
      setProjects((current) =>
        current.map((project) =>
          project.id === editingProject ? { id: project.id, ...projectForm } : project
        )
      );
      notify("Project updated successfully");
    } else {
      setProjects((current) => [...current, { id: Date.now(), ...projectForm }]);
      notify("Project added successfully");
    }

    setEditingProject(null);
    setProjectForm({ name: "", status: "Active", location: "", budget: "" });
  };

  const startEditProject = (project: Project) => {
    setEditingProject(project.id);
    setProjectForm({
      name: project.name,
      status: project.status,
      location: project.location,
      budget: project.budget,
    });
  };

  // Permission handler
  const togglePermission = (role: UserRole, permission: string) => {
    setRolePermissions((current) => ({
      ...current,
      [role]: current[role].includes(permission)
        ? current[role].filter((item) => item !== permission)
        : [...current[role], permission],
    }));
  };

  // ============ RENDER ============
  return (
    <main className="min-h-full bg-[#f5f7f6] p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#7a8380]">
              Dashboard <ChevronRight size={13} /> <span className="text-[#176044]">Settings</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#14201b]">Settings</h1>
            <p className="mt-1 text-sm text-[#77817d]">Configure and customize your CRM workspace.</p>
          </div>
          {message && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-medium text-emerald-700">
              <Check size={15} /> {message}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid gap-5 lg:grid-cols-[255px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="h-fit rounded-xl border border-[#e1e6e4] bg-white p-2 shadow-sm">
            <div className="mb-2 flex items-center gap-3 rounded-lg px-3 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eaf5f0] text-[#176044]">
                <UserCog size={17} />
              </span>
              <div>
                <p className="text-xs font-semibold text-[#17201d]">Administration</p>
                <p className="text-[10px] text-[#89918e]">CRM configuration</p>
              </div>
            </div>
            <nav className="flex gap-2 overflow-x-auto lg:block lg:space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                const selected = active === section.id;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActive(section.id)}
                    className={`flex min-w-[205px] items-center gap-3 rounded-lg px-3 py-3 text-left text-xs font-semibold transition lg:w-full ${
                      selected
                        ? "bg-[#eaf5f0] text-[#176044]"
                        : "text-[#626c68] hover:bg-[#f4f6f5] hover:text-[#17201d]"
                    }`}
                  >
                    <Icon size={16} />
                    <span className="flex-1">{section.label}</span>
                    {selected && <ChevronRight size={14} />}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Content Panel */}
          <section className="overflow-hidden rounded-xl border border-[#e1e6e4] bg-white shadow-sm">
            {/* Users Section */}
            {active === "users" && (
              <>
                <PanelHeader title="User Management" description="Create, edit, activate and manage CRM users." />
                <div className="p-5 sm:p-6">
                  {/* User Form */}
                  <div className="grid gap-3 rounded-xl border border-[#e4e9e7] bg-[#fafcfb] p-4 md:grid-cols-[1fr_1fr_190px_auto]">
                    <input
                      value={userForm.name}
                      onChange={(event) => setUserForm({ ...userForm, name: event.target.value })}
                      placeholder="Full name"
                      className={inputClass}
                    />
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={(event) => setUserForm({ ...userForm, email: event.target.value })}
                      placeholder="Email address"
                      className={inputClass}
                    />
                    <select
                      value={userForm.role}
                      onChange={(event) =>
                        setUserForm({ ...userForm, role: event.target.value as UserRole })
                      }
                      className={inputClass}
                    >
                      <option>Assigner</option>
                      <option>Relationship Manager</option>
                    </select>
                    <button
                      type="button"
                      onClick={submitUser}
                      className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-[#176044] px-4 text-xs font-semibold text-white hover:bg-[#124e37]"
                    >
                      {editingUser ? <Save size={14} /> : <Plus size={14} />}
                      {editingUser ? "Update" : "Create"}
                    </button>
                  </div>

                  {/* Users Table */}
                  <div className="mt-5 overflow-x-auto">
                    <table className="w-full min-w-[720px] text-left text-xs">
                      <thead className="border-b border-[#e7ebe9] text-[10px] uppercase tracking-wide text-[#87908d]">
                        <tr>
                          <th className="px-3 py-3 font-medium">User</th>
                          <th className="px-3 py-3 font-medium">Role</th>
                          <th className="px-3 py-3 font-medium">Status</th>
                          <th className="px-3 py-3 text-right font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-[#eef1f0] last:border-0">
                            <td className="px-3 py-3">
                              <p className="font-semibold text-[#17201d]">{user.name}</p>
                              <p className="mt-0.5 text-[10px] text-[#818a87]">{user.email}</p>
                            </td>
                            <td className="px-3 py-3 text-[#59635f]">{user.role}</td>
                            <td className="px-3 py-3">
                              <button
                                type="button"
                                onClick={() =>
                                  setUsers((current) =>
                                    current.map((item) =>
                                      item.id === user.id ? { ...item, active: !item.active } : item
                                    )
                                  )
                                }
                                className={`rounded-full px-2.5 py-1 font-medium ${
                                  user.active
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {user.active ? "Active" : "Inactive"}
                              </button>
                            </td>
                            <td className="px-3 py-3">
                              <div className="flex justify-end gap-1">
                                <button
                                  title="Reset password"
                                  onClick={() => notify(`Password reset link sent to ${user.email}`)}
                                  className="rounded-md p-2 text-[#66706c] hover:bg-amber-50 hover:text-amber-700"
                                >
                                  <KeyRound size={14} />
                                </button>
                                <button
                                  title="Edit user"
                                  onClick={() => startEditUser(user)}
                                  className="rounded-md p-2 text-[#66706c] hover:bg-blue-50 hover:text-blue-700"
                                >
                                  <Pencil size={14} />
                                </button>
                                <button
                                  title="Delete user"
                                  onClick={() =>
                                    setUsers((current) => current.filter((item) => item.id !== user.id))
                                  }
                                  className="rounded-md p-2 text-[#66706c] hover:bg-red-50 hover:text-red-600"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* Roles Section */}
            {active === "roles" && (
              <>
                <PanelHeader title="Role & Permission Management" description="Control module and feature access for each role." />
                <div className="grid gap-5 p-5 sm:p-6 xl:grid-cols-2">
                  {(["Assigner", "Relationship Manager"] as UserRole[]).map((role) => (
                    <div key={role} className="rounded-xl border border-[#e3e8e6] p-5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eaf5f0] text-[#176044]">
                          <ShieldCheck size={17} />
                        </span>
                        <div>
                          <h3 className="text-sm font-semibold text-[#17201d]">{role}</h3>
                          <p className="text-[10px] text-[#818a87]">Module access permissions</p>
                        </div>
                      </div>
                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {[
                          "Dashboard",
                          "Leads",
                          "My Leads",
                          "Lead Assignment",
                          "Activities",
                          "Site Visits",
                          "Projects",
                          "Reports",
                        ].map((permission) => (
                          <label
                            key={permission}
                            className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#e8ecea] p-3 text-xs text-[#505a56] hover:bg-[#fafcfb]"
                          >
                            <input
                              type="checkbox"
                              checked={rolePermissions[role].includes(permission)}
                              onChange={() => togglePermission(role, permission)}
                              className="accent-[#176044]"
                            />
                            {permission}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Leads Section */}
            {active === "leads" && (
              <>
                <PanelHeader title="Lead Configuration" description="Manage sources, statuses, pipeline stages and scoring rules." />
                <div className="grid gap-5 p-5 sm:p-6 xl:grid-cols-2">
                  <TagManager title="Lead Sources" description="Where leads are generated." items={sources} onChange={setSources} />
                  <TagManager title="Lead Status" description="Available lead status values." items={statuses} onChange={setStatuses} />
                  <TagManager title="Pipeline Stages" description="Stages used in the sales pipeline." items={pipeline} onChange={setPipeline} />
                  <TagManager title="Lead Score Rules" description="Rules that increase or reduce lead scores." items={scoreRules} onChange={setScoreRules} />
                </div>
              </>
            )}

            {/* Projects Section */}
            {active === "projects" && (
              <>
                <PanelHeader title="Project Management" description="Add and maintain project information used by the sales team." />
                <div className="p-5 sm:p-6">
                  {/* Project Form */}
                  <div className="grid gap-3 rounded-xl border border-[#e4e9e7] bg-[#fafcfb] p-4 md:grid-cols-2 xl:grid-cols-[1.2fr_.8fr_1fr_1fr_auto]">
                    <input
                      value={projectForm.name}
                      onChange={(event) => setProjectForm({ ...projectForm, name: event.target.value })}
                      placeholder="Project name"
                      className={inputClass}
                    />
                    <select
                      value={projectForm.status}
                      onChange={(event) =>
                        setProjectForm({ ...projectForm, status: event.target.value as Project["status"] })
                      }
                      className={inputClass}
                    >
                      <option>Active</option>
                      <option>Upcoming</option>
                      <option>Completed</option>
                    </select>
                    <input
                      value={projectForm.location}
                      onChange={(event) => setProjectForm({ ...projectForm, location: event.target.value })}
                      placeholder="Location"
                      className={inputClass}
                    />
                    <input
                      value={projectForm.budget}
                      onChange={(event) => setProjectForm({ ...projectForm, budget: event.target.value })}
                      placeholder="Budget range"
                      className={inputClass}
                    />
                    <button
                      onClick={submitProject}
                      className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-[#176044] px-4 text-xs font-semibold text-white"
                    >
                      {editingProject ? <Save size={14} /> : <Plus size={14} />}
                      {editingProject ? "Update" : "Add"}
                    </button>
                  </div>

                  {/* Projects Grid */}
                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {projects.map((project) => (
                      <div key={project.id} className="rounded-xl border border-[#e3e8e6] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-sm font-semibold text-[#17201d]">{project.name}</h3>
                            <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700">
                              {project.status}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => startEditProject(project)}
                              className="rounded-md p-2 hover:bg-blue-50 hover:text-blue-700"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() =>
                                setProjects((current) => current.filter((item) => item.id !== project.id))
                              }
                              className="rounded-md p-2 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#68726e]">
                          <span className="flex items-center gap-1.5">
                            <MapPin size={13} /> {project.location}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <CircleDollarSign size={13} /> {project.budget}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Notifications Section */}
            {active === "notifications" && (
              <>
                <PanelHeader title="Notification Settings" description="Choose which alerts administrators and users receive." />
                <div className="px-5 sm:px-6">
                  <Toggle
                    label="Email Notifications"
                    description="Send important CRM updates through email."
                    checked={notifications.email}
                    onChange={(value) => setNotifications({ ...notifications, email: value })}
                  />
                  <Toggle
                    label="Follow-up Reminders"
                    description="Remind relationship managers about scheduled follow-ups."
                    checked={notifications.followUp}
                    onChange={(value) => setNotifications({ ...notifications, followUp: value })}
                  />
                  <Toggle
                    label="Assignment Notifications"
                    description="Notify users when a new lead is assigned to them."
                    checked={notifications.assignment}
                    onChange={(value) => setNotifications({ ...notifications, assignment: value })}
                  />
                </div>
              </>
            )}

            {/* System Section */}
            {active === "system" && (
              <>
                <PanelHeader title="System Settings" description="Configure company identity and regional preferences." />
                <div className="p-5 sm:p-6">
                  {/* Logo Upload */}
                  <div className="mb-6 flex items-center gap-4 rounded-xl border border-[#e4e9e7] bg-[#fafcfb] p-4">
                    <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#176044] text-lg font-bold text-white">
                      VH
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#17201d]">Company Logo</p>
                      <p className="mt-1 text-xs text-[#7a8380]">PNG or JPG, maximum 2 MB.</p>
                    </div>
                    <button className="rounded-lg border border-[#dfe4e2] bg-white px-3 py-2 text-xs font-semibold hover:bg-[#f4f6f5]">
                      Upload Logo
                    </button>
                  </div>

                  {/* System Settings Form */}
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="text-xs font-medium text-[#39423f]">
                      Company Profile
                      <input
                        value={system.company}
                        onChange={(event) => setSystem({ ...system, company: event.target.value })}
                        className={`${inputClass} mt-1.5`}
                      />
                    </label>
                    <label className="text-xs font-medium text-[#39423f]">
                      Time Zone
                      <select
                        value={system.timezone}
                        onChange={(event) => setSystem({ ...system, timezone: event.target.value })}
                        className={`${inputClass} mt-1.5`}
                      >
                        <option>Asia/Kolkata</option>
                        <option>Asia/Dubai</option>
                        <option>Europe/London</option>
                      </select>
                    </label>
                    <label className="text-xs font-medium text-[#39423f]">
                      Currency
                      <select
                        value={system.currency}
                        onChange={(event) => setSystem({ ...system, currency: event.target.value })}
                        className={`${inputClass} mt-1.5`}
                      >
                        <option>INR</option>
                        <option>USD</option>
                        <option>AED</option>
                      </select>
                    </label>
                    <label className="text-xs font-medium text-[#39423f]">
                      Date Format
                      <select
                        value={system.dateFormat}
                        onChange={(event) => setSystem({ ...system, dateFormat: event.target.value })}
                        className={`${inputClass} mt-1.5`}
                      >
                        <option>DD/MM/YYYY</option>
                        <option>MM/DD/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex justify-end gap-2">
                    <button
                      onClick={() =>
                        setSystem({
                          company: "Vasiyam Homes",
                          timezone: "Asia/Kolkata",
                          currency: "INR",
                          dateFormat: "DD/MM/YYYY",
                        })
                      }
                      className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#dfe4e2] px-4 text-xs font-semibold text-[#55605c]"
                    >
                      <RotateCcw size={14} /> Reset
                    </button>
                    <button
                      onClick={() => notify("System settings saved")}
                      className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#176044] px-4 text-xs font-semibold text-white"
                    >
                      <Save size={14} /> Save Changes
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}