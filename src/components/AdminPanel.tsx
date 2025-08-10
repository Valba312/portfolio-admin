
import React, { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { useAppStore } from "@/store";
import { Button, Card, CardBody, CardHeader, Input, Separator, Textarea } from "@/components/ui";
import type { Content, Project, Job } from "@/data/defaultContent";
import { Download, Upload, Trash2, Plus, Home, Save, RotateCcw } from "lucide-react";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<label className="block"><div className="mb-1 text-sm text-neutral-300">{label}</div>{children}</label>);
}

export function AdminPanel() {
  const API_BASE = import.meta.env.VITE_API_BASE || "";
  const ENDPOINT = API_BASE + "/api/content";
  const [token, setToken] = useState(localStorage.getItem("portfolio-admin-token") || "");
  const fileInput = useRef<HTMLInputElement | null>(null);
  const { content, setContent, reset } = useAppStore();

  useEffect(() => { (async () => { try { const res = await fetch(ENDPOINT); if (res.ok) { const data = await res.json(); if (data) setContent(data as Content); } } catch {} })(); }, []);

  const handleExport = () => { const data = JSON.stringify(content, null, 2); const blob = new Blob([data], { type: "application/json" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "portfolio-content.json"; a.click(); URL.revokeObjectURL(url); };
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { try { setContent(JSON.parse(String(reader.result)) as Content); alert("Импортировано."); } catch (err) { alert("Не удалось импортировать JSON: " + (err as Error).message); } }; reader.readAsText(file); };

  const updateProfile = (path: string, value: string) => setContent({ ...content, profile: { ...content.profile, [path]: value } });
  const updateLink = (k: keyof typeof content.profile.links, v: string) => setContent({ ...content, profile: { ...content.profile, links: { ...content.profile.links, [k]: v } } });
  const addProject = () => setContent({ ...content, projects: [{ title: "Новый проект", description: "Описание", tags: ["Tag"], href: "#" }, ...content.projects] });
  const updateProject = (idx: number, patch: Partial<Project>) => { const arr = [...content.projects]; arr[idx] = { ...arr[idx], ...patch }; setContent({ ...content, projects: arr }); };
  const removeProject = (idx: number) => setContent({ ...content, projects: content.projects.filter((_, i) => i !== idx) });
  const addJob = () => setContent({ ...content, experience: [{ role: "Новая роль", company: "Компания", period: "2025", location: "Remote", points: ["Достижение"] }, ...content.experience] });
  const updateJob = (idx: number, patch: Partial<Job>) => { const arr = [...content.experience]; arr[idx] = { ...arr[idx], ...patch }; setContent({ ...content, experience: arr }); };
  const updateJobPoint = (jobIdx: number, pointIdx: number, value: string) => { const arr = [...content.experience]; const pts = [...arr[jobIdx].points]; pts[pointIdx] = value; arr[jobIdx] = { ...arr[jobIdx], points: pts }; setContent({ ...content, experience: arr }); };
  const addJobPoint = (jobIdx: number) => { const arr = [...content.experience]; arr[jobIdx] = { ...arr[jobIdx], points: [...arr[jobIdx].points, "Новый пункт"] }; setContent({ ...content, experience: arr }); };
  const removeJob = (idx: number) => setContent({ ...content, experience: content.experience.filter((_, i) => i !== idx) });
  const addSkill = () => setContent({ ...content, skills: ["Новый навык", ...content.skills] });
  const updateSkill = (idx: number, val: string) => { const arr = [...content.skills]; arr[idx] = val; setContent({ ...content, skills: arr }); };
  const removeSkill = (idx: number) => setContent({ ...content, skills: content.skills.filter((_, i) => i !== idx) });

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

      <Card className="mb-6"><CardHeader><div className="text-lg font-semibold">Профиль</div></CardHeader>
        <CardBody className="grid gap-4 md:grid-cols-2">
          <Field label="Имя"><Input value={content.profile.name} onChange={(e) => updateProfile("name", e.target.value)} /></Field>
          <Field label="Роль"><Input value={content.profile.title} onChange={(e) => updateProfile("title", e.target.value)} /></Field>
          <Field label="Локация"><Input value={content.profile.location} onChange={(e) => updateProfile("location", e.target.value)} /></Field>
          <Field label="Avatar URL"><Input value={content.profile.avatarUrl} onChange={(e) => updateProfile("avatarUrl", e.target.value)} /></Field>
          <div className="md:col-span-2"><Field label="О себе"><Textarea rows={4} value={content.profile.summary} onChange={(e) => updateProfile("summary", e.target.value)} /></Field></div>
        </CardBody>
        <Separator />
        <CardBody className="grid gap-4 md:grid-cols-2">
          <Field label="GitHub"><Input value={content.profile.links.github} onChange={(e) => updateLink("github", e.target.value)} /></Field>
          <Field label="LinkedIn"><Input value={content.profile.links.linkedin} onChange={(e) => updateLink("linkedin", e.target.value)} /></Field>
          <Field label="Email (mailto:you@example.com)"><Input value={content.profile.links.email} onChange={(e) => updateLink("email", e.target.value)} /></Field>
          <Field label="Phone (tel:+123456789)"><Input value={content.profile.links.phone} onChange={(e) => updateLink("phone", e.target.value)} /></Field>
          <Field label="URL резюме (PDF)"><Input value={content.profile.links.resume} onChange={(e) => updateLink("resume", e.target.value)} /></Field>
        </CardBody>
      </Card>

      <div className="mb-3 flex items-center justify-between"><div className="text-lg font-semibold">Проекты</div><Button onClick={() => setContent({ ...content, projects: [{ title: "Новый проект", description: "Описание", tags: ["Tag"], href: "#" }, ...content.projects] })}><Plus className="h-4 w-4" /> Добавить проект</Button></div>
      <div className="grid gap-4">
        {content.projects.map((p, idx) => (
          <Card key={idx}><CardBody className="grid gap-3 md:grid-cols-2">
            <Field label="Название"><Input value={p.title} onChange={(e) => { const arr=[...content.projects]; arr[idx]={...arr[idx], title:e.target.value}; setContent({ ...content, projects: arr }); }} /></Field>
            <Field label="Ссылка"><Input value={p.href} onChange={(e) => { const arr=[...content.projects]; arr[idx]={...arr[idx], href:e.target.value}; setContent({ ...content, projects: arr }); }} /></Field>
            <div className="md:col-span-2"><Field label="Описание"><Textarea rows={3} value={p.description} onChange={(e) => { const arr=[...content.projects]; arr[idx]={...arr[idx], description:e.target.value}; setContent({ ...content, projects: arr }); }} /></Field></div>
            <div className="md:col-span-2"><Field label="Теги (через запятую)"><Input value={p.tags.join(", ")} onChange={(e) => { const arr=[...content.projects]; arr[idx]={...arr[idx], tags:e.target.value.split(/\s*,\s*/).filter(Boolean)}; setContent({ ...content, projects: arr }); }} /></Field></div>
            <div className="flex items-center justify-end gap-2 md:col-span-2"><Button variant="outline" onClick={() => setContent({ ...content, projects: content.projects.filter((_, i) => i !== idx) })}><Trash2 className="h-4 w-4" /> Удалить</Button></div>
          </CardBody></Card>
        ))}
      </div>

      <Separator />

      <div className="mb-3 flex items-center justify-between"><div className="text-lg font-semibold">Опыт</div><Button onClick={() => setContent({ ...content, experience: [{ role: "Новая роль", company: "Компания", period: "2025", location: "Remote", points: ["Достижение"] }, ...content.experience] })}><Plus className="h-4 w-4" /> Добавить место</Button></div>
      <div className="grid gap-4">
        {content.experience.map((j, idx) => (
          <Card key={idx}><CardBody className="grid gap-3 md:grid-cols-2">
            <Field label="Роль"><Input value={j.role} onChange={(e) => { const arr=[...content.experience]; arr[idx]={...arr[idx], role:e.target.value}; setContent({ ...content, experience: arr }); }} /></Field>
            <Field label="Компания"><Input value={j.company} onChange={(e) => { const arr=[...content.experience]; arr[idx]={...arr[idx], company:e.target.value}; setContent({ ...content, experience: arr }); }} /></Field>
            <Field label="Период"><Input value={j.period} onChange={(e) => { const arr=[...content.experience]; arr[idx]={...arr[idx], period:e.target.value}; setContent({ ...content, experience: arr }); }} /></Field>
            <Field label="Локация"><Input value={j.location} onChange={(e) => { const arr=[...content.experience]; arr[idx]={...arr[idx], location:e.target.value}; setContent({ ...content, experience: arr }); }} /></Field>
            <div className="md:col-span-2"><div className="mb-2 text-sm text-neutral-300">Пункты</div><div className="grid gap-2">{j.points.map((pt, pIdx) => (<Input key={pIdx} value={pt} onChange={(e) => { const arr=[...content.experience]; const pts=[...arr[idx].points]; pts[pIdx]=e.target.value; arr[idx]={...arr[idx], points:pts}; setContent({ ...content, experience: arr }); }} />))}</div><div className="mt-2"><Button variant="outline" onClick={() => { const arr=[...content.experience]; arr[idx]={...arr[idx], points:[...arr[idx].points, "Новый пункт"]}; setContent({ ...content, experience: arr }); }}><Plus className="h-4 w-4" /> Добавить пункт</Button></div></div>
            <div className="flex items-center justify-end gap-2 md:col-span-2"><Button variant="outline" onClick={() => setContent({ ...content, experience: content.experience.filter((_, i) => i !== idx) })}><Trash2 className="h-4 w-4" /> Удалить</Button></div>
          </CardBody></Card>
        ))}
      </div>

      <Separator />

      <div className="mb-3 flex items-center justify-between"><div className="text-lg font-semibold">Навыки</div><Button onClick={() => setContent({ ...content, skills: ["Новый навык", ...content.skills] })}><Plus className="h-4 w-4" /> Добавить навык</Button></div>
      <div className="grid gap-2 md:grid-cols-2">{content.skills.map((s, idx) => (<div key={idx} className="flex items-center gap-2"><Input value={s} onChange={(e) => { const arr=[...content.skills]; arr[idx]=e.target.value; setContent({ ...content, skills: arr }); }} /><Button variant="outline" onClick={() => setContent({ ...content, skills: content.skills.filter((_, i) => i !== idx) })}><Trash2 className="h-4 w-4" /></Button></div>))}</div>

      <Separator />
      <Card><CardBody className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-neutral-300">Нажми «Опубликовать», чтобы сохранить на сервере (видно всем).</div>
        <div className="flex flex-wrap items-center gap-2">
          <Input placeholder="Admin token" value={token} onChange={(e) => { setToken(e.target.value); localStorage.setItem("portfolio-admin-token", e.target.value); }} style={{maxWidth:280}} />
          <Button onClick={async () => { try { const res = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(content) }); if (!res.ok) throw new Error(await res.text()); alert("Опубликовано ✔"); } catch (e) { alert("Ошибка публикации: " + (e as Error).message); } }}><Save className="h-4 w-4" /> Опубликовать</Button>
          <Link href="/"><Button variant="outline">На сайт</Button></Link>
        </div>
      </CardBody></Card>
    </div>
  );
}
