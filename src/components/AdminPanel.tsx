
import React, { useRef } from "react";
import { Link, useLocation } from "wouter";
import { useAppStore } from "@/store";
import { Button, Card, CardBody, CardHeader, Input, Separator, Textarea, Badge } from "@/components/ui";
import type { Content, Project, Job } from "@/data/defaultContent";
import { DEFAULT_CONTENT } from "@/data/defaultContent";
import { Download, Upload, Trash2, Plus, Home, Save, RotateCcw } from "lucide-react";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-sm text-neutral-300">{label}</div>
      {children}
    </label>
  );
}

export function AdminPanel() {
  const fileInput = useRef<HTMLInputElement | null>(null);
  const { content, setContent, reset } = useAppStore();
  const [, navigate] = useLocation();

  const handleExport = () => {
    const data = JSON.stringify(content, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio-content.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        // naive validation
        if (!parsed?.profile || !Array.isArray(parsed?.projects)) throw new Error("Invalid format");
        setContent(parsed as Content);
        alert("Импортировано.");
      } catch (err) {
        alert("Не удалось импортировать JSON: " + (err as Error).message);
      }
    };
    reader.readAsText(file);
  };

  const updateProfile = (path: string, value: string) => {
    setContent({
      ...content,
      profile: { ...content.profile, [path]: value }
    });
  };

  const updateLink = (key: keyof typeof content.profile.links, value: string) => {
    setContent({
      ...content,
      profile: { ...content.profile, links: { ...content.profile.links, [key]: value } }
    });
  };

  const addProject = () => {
    const p: Project = { title: "Новый проект", description: "Описание", tags: ["Tag"], href: "#" };
    setContent({ ...content, projects: [p, ...content.projects] });
  };

  const updateProject = (idx: number, patch: Partial<Project>) => {
    const arr = [...content.projects];
    arr[idx] = { ...arr[idx], ...patch };
    setContent({ ...content, projects: arr });
  };

  const removeProject = (idx: number) => {
    const arr = content.projects.filter((_, i) => i !== idx);
    setContent({ ...content, projects: arr });
  };

  const addJob = () => {
    const j: Job = { role: "Новая роль", company: "Компания", period: "2025", location: "Remote", points: ["Достижение"] };
    setContent({ ...content, experience: [j, ...content.experience] });
  };

  const updateJob = (idx: number, patch: Partial<Job>) => {
    const arr = [...content.experience];
    arr[idx] = { ...arr[idx], ...patch };
    setContent({ ...content, experience: arr });
  };

  const updateJobPoint = (jobIdx: number, pointIdx: number, value: string) => {
    const arr = [...content.experience];
    const pts = [...arr[jobIdx].points];
    pts[pointIdx] = value;
    arr[jobIdx] = { ...arr[jobIdx], points: pts };
    setContent({ ...content, experience: arr });
  };

  const addJobPoint = (jobIdx: number) => {
    const arr = [...content.experience];
    arr[jobIdx] = { ...arr[jobIdx], points: [...arr[jobIdx].points, "Новый пункт"] };
    setContent({ ...content, experience: arr });
  };

  const removeJob = (idx: number) => {
    const arr = content.experience.filter((_, i) => i !== idx);
    setContent({ ...content, experience: arr });
  };

  const addSkill = () => {
    setContent({ ...content, skills: ["Новый навык", ...content.skills] });
  };

  const updateSkill = (idx: number, val: string) => {
    const arr = [...content.skills];
    arr[idx] = val;
    setContent({ ...content, skills: arr });
  };

  const removeSkill = (idx: number) => {
    setContent({ ...content, skills: content.skills.filter((_, i) => i !== idx) });
  };

  return (
    <div className="container py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="text-2xl font-semibold">Админ панель</div>
        <div className="flex gap-2">
          <Link href="/"><Button variant="outline"><Home className="h-4 w-4" /> На сайт</Button></Link>
          <Button onClick={handleExport}><Download className="h-4 w-4" /> Export JSON</Button>
          <input type="file" accept="application/json" hidden ref={fileInput} onChange={handleImport} />
          <Button variant="outline" onClick={() => fileInput.current?.click()}><Upload className="h-4 w-4" /> Import JSON</Button>
          <Button variant="outline" onClick={() => { reset(); alert("Сброшено к дефолту."); }}><RotateCcw className="h-4 w-4" /> Reset</Button>
        </div>
      </div>

      {/* PROFILE */}
      <Card className="mb-6">
        <CardHeader>
          <div className="text-lg font-semibold">Профиль</div>
        </CardHeader>
        <CardBody className="grid gap-4 md:grid-cols-2">
          <Field label="Имя">
            <Input value={content.profile.name} onChange={(e) => updateProfile("name", e.target.value)} />
          </Field>
          <Field label="Роль">
            <Input value={content.profile.title} onChange={(e) => updateProfile("title", e.target.value)} />
          </Field>
          <Field label="Локация">
            <Input value={content.profile.location} onChange={(e) => updateProfile("location", e.target.value)} />
          </Field>
          <Field label="Avatar URL">
            <Input value={content.profile.avatarUrl} onChange={(e) => updateProfile("avatarUrl", e.target.value)} />
          </Field>
          <div className="md:col-span-2">
            <Field label="О себе">
              <Textarea rows={4} value={content.profile.summary} onChange={(e) => updateProfile("summary", e.target.value)} />
            </Field>
          </div>
        </CardBody>
        <Separator />
        <CardBody className="grid gap-4 md:grid-cols-2">
          <Field label="GitHub">
            <Input value={content.profile.links.github} onChange={(e) => updateLink("github", e.target.value)} />
          </Field>
          <Field label="LinkedIn">
            <Input value={content.profile.links.linkedin} onChange={(e) => updateLink("linkedin", e.target.value)} />
          </Field>
          <Field label="Email (mailto:you@example.com)">
            <Input value={content.profile.links.email} onChange={(e) => updateLink("email", e.target.value)} />
          </Field>
          <Field label="Phone (tel:+123456789)">
            <Input value={content.profile.links.phone} onChange={(e) => updateLink("phone", e.target.value)} />
          </Field>
          <Field label="URL резюме (PDF)">
            <Input value={content.profile.links.resume} onChange={(e) => updateLink("resume", e.target.value)} />
          </Field>
        </CardBody>
      </Card>

      {/* PROJECTS */}
      <div className="mb-3 flex items-center justify-between">
        <div className="text-lg font-semibold">Проекты</div>
        <Button onClick={addProject}><Plus className="h-4 w-4" /> Добавить проект</Button>
      </div>
      <div className="grid gap-4">
        {content.projects.map((p, idx) => (
          <Card key={idx}>
            <CardBody className="grid gap-3 md:grid-cols-2">
              <Field label="Название">
                <Input value={p.title} onChange={(e) => updateProject(idx, { title: e.target.value })} />
              </Field>
              <Field label="Ссылка">
                <Input value={p.href} onChange={(e) => updateProject(idx, { href: e.target.value })} />
              </Field>
              <div className="md:col-span-2">
                <Field label="Описание">
                  <Textarea rows={3} value={p.description} onChange={(e) => updateProject(idx, { description: e.target.value })} />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label="Теги (через запятую)">
                  <Input value={p.tags.join(", ")} onChange={(e) => updateProject(idx, { tags: e.target.value.split(/\s*,\s*/).filter(Boolean) })} />
                </Field>
              </div>
              <div className="flex items-center justify-end gap-2 md:col-span-2">
                <Button variant="outline" onClick={() => removeProject(idx)}><Trash2 className="h-4 w-4" /> Удалить</Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Separator />

      {/* EXPERIENCE */}
      <div className="mb-3 flex items-center justify-between">
        <div className="text-lg font-semibold">Опыт</div>
        <Button onClick={addJob}><Plus className="h-4 w-4" /> Добавить место</Button>
      </div>
      <div className="grid gap-4">
        {content.experience.map((j, idx) => (
          <Card key={idx}>
            <CardBody className="grid gap-3 md:grid-cols-2">
              <Field label="Роль">
                <Input value={j.role} onChange={(e) => updateJob(idx, { role: e.target.value })} />
              </Field>
              <Field label="Компания">
                <Input value={j.company} onChange={(e) => updateJob(idx, { company: e.target.value })} />
              </Field>
              <Field label="Период">
                <Input value={j.period} onChange={(e) => updateJob(idx, { period: e.target.value })} />
              </Field>
              <Field label="Локация">
                <Input value={j.location} onChange={(e) => updateJob(idx, { location: e.target.value })} />
              </Field>
              <div className="md:col-span-2">
                <div className="mb-2 text-sm text-neutral-300">Пункты</div>
                <div className="grid gap-2">
                  {j.points.map((pt, pIdx) => (
                    <Input key={pIdx} value={pt} onChange={(e) => updateJobPoint(idx, pIdx, e.target.value)} />
                  ))}
                </div>
                <div className="mt-2"><Button variant="outline" onClick={() => addJobPoint(idx)}><Plus className="h-4 w-4" /> Добавить пункт</Button></div>
              </div>
              <div className="flex items-center justify-end gap-2 md:col-span-2">
                <Button variant="outline" onClick={() => removeJob(idx)}><Trash2 className="h-4 w-4" /> Удалить</Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Separator />

      {/* SKILLS */}
      <div className="mb-3 flex items-center justify-between">
        <div className="text-lg font-semibold">Навыки</div>
        <Button onClick={addSkill}><Plus className="h-4 w-4" /> Добавить навык</Button>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {content.skills.map((s, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <Input value={s} onChange={(e) => updateSkill(idx, e.target.value)} />
            <Button variant="outline" onClick={() => removeSkill(idx)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
      </div>

      <Separator />

      <Card>
        <CardBody className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-neutral-300">Изменения сохраняются автоматически (localStorage).</div>
          <div className="flex gap-2">
            <Link href="/"><Button><Save className="h-4 w-4" /> Опубликовать (локально)</Button></Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
