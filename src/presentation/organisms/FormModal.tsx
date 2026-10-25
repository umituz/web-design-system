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
  options?: FormModalOption[] | ((values: FormModalValues) => FormModalOption[]);
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
  initial?: FormModalValues;
  preview?: ReactNode;
  submitLabel?: string;
  wide?: boolean;
  embedded?: boolean;
  cancelLabel?: string;
  backLabel?: string;
  continueLabel?: string;
  requiredMessage?: string;
  invalidEmailMessage?: string;
  invalidTelMessage?: string;
  invalidNumberMessage?: string;
}

export interface FormModalMessages {
  required: string;
  invalidEmail: string;
  invalidTel: string;
  invalidNumber: string;
}

/** Resolves a field's options — static arrays pass through, functions
 *  receive the current values so a select can depend on earlier fields. */
function fieldOptions(f: FormModalField, values: FormModalValues): FormModalOption[] {
  return typeof f.options === 'function' ? f.options(values) : (f.options ?? []);
}

function initialValues(steps: FormStep[], initial?: FormModalValues): FormModalValues {
  const v: FormModalValues = {};
  steps.forEach((s) =>
    s.fields.forEach((f) => {
      v[f.name] =
        f.defaultValue ??
        (f.type === 'checkbox'
          ? false
          : f.type === 'number'
            ? ''
            : f.type === 'select'
              ? Array.isArray(f.options)
                ? f.options[0]?.value ?? ''
                : ''
              : '');
    })
  );
  if (initial) {
    for (const [name, value] of Object.entries(initial)) {
      if (value !== undefined && value !== null) v[name] = value;
    }
  }
  return v;
}

function validateField(f: FormModalField, val: string | number | boolean | undefined, m: FormModalMessages): string {
  if (f.required && (val === '' || val === undefined || val === null)) return m.required;
  if (f.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val))) return m.invalidEmail;
  if (f.type === 'tel' && val && !/[\d+()-\s]{7,}/.test(String(val))) return m.invalidTel;
  if (f.type === 'number' && val !== '' && isNaN(Number(val))) return m.invalidNumber;
  return '';
}

export function FormModal(
  { title, steps, onSubmit, onClose, initial, preview, submitLabel = 'Save', wide, embedded, cancelLabel = 'Cancel', backLabel = 'Back', continueLabel = 'Continue', requiredMessage = 'This field is required.', invalidEmailMessage = 'Enter a valid email address.', invalidTelMessage = 'Enter a valid phone number.', invalidNumberMessage = 'Enter a number.' }: FormModalProps
) {
  const messages: FormModalMessages = { required: requiredMessage, invalidEmail: invalidEmailMessage, invalidTel: invalidTelMessage, invalidNumber: invalidNumberMessage };
  const [values, setValues] = useState<FormModalValues>(() => initialValues(steps, initial));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);

  const cur = steps[step] as FormStep | undefined;
  const total = steps.length;

  const set = (name: string, val: string | number | boolean) => {
    const next: FormModalValues = { ...values, [name]: val };
    const cleared = [name];
    // A dependent select must never hold a value its resolved options no
    // longer contain — snap it to the first option (or '') and clear its error.
    for (const s of steps) {
      for (const f of s.fields) {
        if (f.type !== 'select' || typeof f.options !== 'function') continue;
        const opts = f.options(next);
        if (!opts.some((o) => o.value === String(next[f.name]))) {
          next[f.name] = opts[0]?.value ?? '';
          cleared.push(f.name);
        }
      }
    }
    setValues(next);
    setErrors((e) => (cleared.some((n) => e[n]) ? { ...e, ...Object.fromEntries(cleared.map((n) => [n, ''])) } : e));
  };

  const validateStep = (idx: number): boolean => {
    const errs: Record<string, string> = {};
    for (const f of steps[idx]!.fields) {
      const err = validateField(f, values[f.name], messages);
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
        const err = validateField(f, values[f.name], messages);
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
          {backLabel}
        </Button>
      )}
      <Button variant="secondary" size="sm" onClick={onClose}>
        {cancelLabel}
      </Button>
      <Button size="sm" onClick={submit}>
        {step < total - 1 ? continueLabel : submitLabel}
      </Button>
    </>
  );

  const body = (
    <>
      {preview && <div className="mb-4 first:mt-0">{preview}</div>}
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
                      options={fieldOptions(f, values)}
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
