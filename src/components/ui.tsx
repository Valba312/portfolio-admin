
import React from "react";
export function Button({ children, variant = "solid", className = "", ...props }:
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "solid" | "outline" }) {
  const base = "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition";
  const solid = "border border-neutral-700 bg-neutral-800 hover:bg-neutral-700";
  const outline = "border border-neutral-700 hover:bg-neutral-800";
  return <button className={`${base} ${variant === "solid" ? solid : outline} ${className}`} {...props}>{children}</button>;
}
export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) { return <div className={`card ${className}`}>{children}</div>; }
export function CardHeader({ className = "", children }: { className?: string; children: React.ReactNode }) { return <div className={`px-4 pt-4 ${className}`}>{children}</div>; }
export function CardBody({ className = "", children }: { className?: string; children: React.ReactNode }) { return <div className={`px-4 pb-4 ${className}`}>{children}</div>; }
export function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) { return <span className={`badge ${className}`}>{children}</span>; }
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) { return <input {...props} className={`input ${props.className || ""}`} />; }
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea {...props} className={`textarea ${props.className || ""}`} />; }
export function Separator({ className = "" }: { className?: string }) { return <div className={`separator ${className}`} />; }
