/**
 * FormModal Component (Organism)
 * @description Schema-driven multi-step form inside a modal (or embedded card).
 * Steps declare typed fields; the engine renders controls, validates per step
 * and submits the collected values as a flat record.
 */

import { useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import { cn } from '../../infrastructure/utils';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { NativeSelect } from '../atoms/NativeSelect';
import { Checkbox } from '../atoms/Checkbox';
import { Textarea } from '../molecules/Textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card';
import { Modal } from './Modal';

export type FormModalFieldType = 'text' | 'email' | 'tel' | 'number' | 'date' | 'time' | 'select' | 'textarea' | 'checkbox';

export interface FormModalOption {
  value: string;
  label: string;
}

export interface FormModalField {
  name: string;
  label: string;
  type: FormModalFieldType;
  required?: boolean;
  hint?: string;
  placeholder?: string;
  options?: FormModalOption[];
  /** Span both grid columns on wide layouts. */
  span?: boolean;
  min?: number;
  max?: number;
  defaultValue?: string | number | boolean;
}

export interface FormStep {
  title: string;
  desc?: string;
  fields: FormModalField[];
}

export type FormModalValues = Record<string, string | number | boolean>;

export interface FormModalProps {
  title: ReactNode;
  steps: FormStep[];
  onSubmit: (values: FormModalValues) => void;
  onClose: () => void;
  submitLabel?: string;
  wide?: boolean;
  /** Render as an inline card instead of an overlay dialog. */
  embedded?: boolean;
}

function initialValues(steps: FormStep[]): FormModalValues {
  const v: FormModalValues = {};
  steps.forEach((s) =>
    s.fields.forEach((f) => {
      v[f.name] =
        f.defaultValue ?? (f.type === 'checkbox' ? false : f.type === 'number' ? '' : f.type === 'select' ? f.options?.[0]?.value ?? '' : '');
    })
  );
  return v;
}

function validateField(f: FormModalField, val: string | number | boolean | undefined): string {
  if (f.required && (val === '' || val === undefined || val === null)) return 'This field is required.';
  if (f.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val))) return 'Enter a valid email address.';
  if (f.type === 'tel' && val && !/[\d+()-\s]{7,}/.test(String(val))) return 'Enter a valid phone number.';
  if (f.type === 'number' && val !== '' && isNaN(Number(val))) return 'Enter a number.';
  return '';
}

export function FormModal({ title, steps, onSubmit, onClose, submitLabel = 'Save', wide, embedded }: FormModalProps) {
  const [values, setValues] = useState<FormModalValues>(() => initialValues(steps));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);

  const cur = steps[step] as FormStep | undefined;
  const total = steps.length;

  const set = (name: string, val: string | number | boolean) => {
    setValues((v) => ({ ...v, [name]: val }));
    setErrors((e) => (e[name] ? { ...e, [name]: '' } : e));
  };

  const validateStep = (idx: number): boolean => {
    const errs: Record<string, string> = {};
    for (const f of steps[idx]!.fields) {
      const err = validateField(f, values[f.name]);
      if (err) errs[f.name] = err;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = () => {
    if (!validateStep(step)) return;
    if (step < total - 1) {
      setStep(step + 1);
      return;
    }
    for (let i = 0; i < total; i++) {
      for (const f of steps[i]!.fields) {
        const err = validateField(f, values[f.name]);
        if (err) {
          setStep(i);
          setErrors({ [f.name]: err });
          return;
        }
      }
    }
    onSubmit(values);
  };

  const footer = (
    <>
      {total > 1 && (
        <span className="mr-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <ChevronLeft className="h-3 w-3" aria-hidden="true" />
          Step {step + 1} of {total}
        </span>
      )}
      {step > 0 && (
        <Button variant="secondary" size="sm" onClick={() => setStep(step - 1)}>
          Back
        </Button>
      )}
      <Button variant="secondary" size="sm" onClick={onClose}>
        Cancel
      </Button>
      <Button size="sm" onClick={submit}>
        {step < total - 1 ? 'Continue' : submitLabel}
      </Button>
    </>
  );

  const body = (
    <>
      {total > 1 && (
        <div aria-hidden="true" className="mb-4 flex gap-1.5">
          {steps.map((_, i) => (
            <span key={i} className={cn('h-1.5 flex-1 rounded-full', i <= step ? 'bg-primary' : 'bg-border')} />
          ))}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {cur?.fields.map((f) => {
          const err = errors[f.name] || undefined;
          const fid = `ff_${f.name}`;
          return (
            <div key={f.name} className={cn('flex flex-col gap-1.5', f.span && 'sm:col-span-2')}>
              {f.type === 'checkbox' ? (
                <Checkbox
                  id={fid}
                  checked={Boolean(values[f.name])}
                  onCheckedChange={(c) => set(f.name, c)}
                  label={f.label}
                  hint={f.hint}
                />
              ) : (
                <>
                  <label htmlFor={fid} className="text-sm font-medium">
                    {f.label}
                    {f.required && (
                      <span className="ml-0.5 text-destructive" aria-hidden="true">
                        *
                      </span>
                    )}
                  </label>
                  {f.type === 'select' ? (
                    <NativeSelect
                      id={fid}
                      options={f.options}
                      value={String(values[f.name] ?? '')}
                      error={Boolean(err)}
                      onChange={(e) => set(f.name, e.target.value)}
                    />
                  ) : f.type === 'textarea' ? (
                    <Textarea
                      id={fid}
                      placeholder={f.placeholder}
                      value={String(values[f.name] ?? '')}
                      error={Boolean(err)}
                      onChange={(e) => set(f.name, e.target.value)}
                    />
                  ) : (
                    <Input
                      id={fid}
                      type={f.type}
                      placeholder={f.placeholder}
                      min={f.min}
                      max={f.max}
                      value={String(values[f.name] ?? '')}
                      error={Boolean(err)}
                      onChange={(e) => set(f.name, f.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
                    />
                  )}
                  {err ? (
                    <p role="alert" className="text-xs text-destructive">
                      {err}
                    </p>
                  ) : (
                    f.hint && <p className="text-xs text-muted-foreground">{f.hint}</p>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
      {cur?.desc && <p className="mt-3 text-xs text-muted-foreground">{cur.desc}</p>}
    </>
  );

  if (embedded) {
    return (
      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{cur?.title}</CardDescription>
        </CardHeader>
        <CardContent>{body}</CardContent>
        <CardFooter className="flex flex-wrap items-center justify-end gap-2">{footer}</CardFooter>
      </Card>
    );
  }

  return (
    <Modal open onClose={onClose} title={title} footer={footer} size={wide ? 'lg' : 'md'}>
      {body}
    </Modal>
  );
}
