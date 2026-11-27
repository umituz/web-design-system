import { useMemo, useState } from 'react';
import { Drawer } from './Drawer';
import { Button } from '../atoms/Button';
import { Checkbox } from '../atoms/Checkbox';
import { Input } from '../atoms/Input';
import { NativeSelect } from '../atoms/NativeSelect';
import { Textarea } from '../molecules/Textarea';
import { formatTemplate, mergeLabels, useConsoleLabels } from '../page-kit/console-labels';
import type { LabelOverrides, ConsoleFormLabels } from '../page-kit/console-labels';

export type FieldRule =
  | { type: 'required'; message: string }
  | { type: 'min'; value: number; message: string }
  | { type: 'max'; value: number; message: string }
  | { type: 'minLength'; value: number; message: string }
  | { type: 'pattern'; value: RegExp; message: string }
  | { type: 'number'; message: string }
  | { type: 'date'; message: string }
  | { type: 'email'; message: string };

export type FormValues = Record<string, string | number | undefined | null>;

export function validateValue(value: unknown, rules: FieldRule[]): string | null {
  for (const rule of rules) {
    const empty = value == null || value === '';
    switch (rule.type) {
      case 'required':
        if (empty) return rule.message;
        break;
      case 'number':
        if (!empty && Number.isNaN(Number(value))) return rule.message;
        break;
      case 'min':
        if (!empty && Number(value) < rule.value) return rule.message;
        break;
      case 'max':
        if (!empty && Number(value) > rule.value) return rule.message;
        break;
      case 'minLength':
        if (!empty && String(value).length < rule.value) return rule.message;
        break;
      case 'pattern':
        if (!empty && !rule.value.test(String(value))) return rule.message;
        break;
      case 'date':
        if (!empty && !/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return rule.message;
        break;
      case 'email':
        if (!empty && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value))) return rule.message;
        break;
    }
  }
  return null;
}

export function validateForm(
  values: FormValues,
  schema: Record<string, FieldRule[]>,
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const [field, rules] of Object.entries(schema)) {
    const err = validateValue(values[field], rules);
    if (err) errors[field] = err;
  }
  return errors;
}

interface FieldBase {
  name: string;
  label: string;
  required?: boolean;
  hint?: string;
  minLength?: number;
  span?: 1 | 2;
}

export type FieldConfig =
  | (FieldBase & { type: 'text' | 'date'; placeholder?: string })
  | (FieldBase & { type: 'email'; placeholder?: string })
  | (FieldBase & { type: 'textarea'; placeholder?: string; rows?: number })
  | (FieldBase & { type: 'number'; placeholder?: string; min?: number; max?: number; step?: number })
  | (FieldBase & { type: 'select'; options: { value: string; label: string }[]; placeholder?: string })
  | (FieldBase & { type: 'checkbox' });

export type SubmitValues = Record<string, string | number | boolean>;

type DrawerFormValue = string | number | boolean | null | undefined;

export interface FormDrawerProps {
  open: boolean;
  title: string;
  eyebrow?: string;
  fields: FieldConfig[];
  initial?: Record<string, DrawerFormValue>;
  submitting?: boolean;
  submitLabel?: string;
  onClose: () => void;
  onSubmit: (values: SubmitValues) => void | Promise<void>;
  labels?: LabelOverrides<ConsoleFormLabels>;
}

export function FormDrawer({
  open,
  title,
  eyebrow,
  fields,
  initial,
  submitting,
  submitLabel,
  onClose,
  onSubmit,
  labels,
}: FormDrawerProps): React.ReactNode {
  const consoleLabels = useConsoleLabels();
  const t = mergeLabels(consoleLabels.form, labels);

  const [values, setValues] = useState<Record<string, DrawerFormValue>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [wasOpen, setWasOpen] = useState(false);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      const seed: Record<string, DrawerFormValue> = {};
      for (const f of fields) {
        if (f.type === 'checkbox') seed[f.name] = Boolean(initial?.[f.name]);
        else seed[f.name] = initial?.[f.name] ?? '';
      }
      setValues(seed);
      setErrors({});
    }
  }

  const schema = useMemo(() => {
    const s: Record<string, FieldRule[]> = {};
    for (const f of fields) {
      const rules: FieldRule[] = [];
      if (f.required) rules.push({ type: 'required', message: t.required });
      if (f.type === 'number') rules.push({ type: 'number', message: t.number });
      if (f.type === 'number' && f.min != null) {
        rules.push({ type: 'min', value: f.min, message: formatTemplate(t.minValue, { min: f.min }) });
      }
      if (f.type === 'number' && f.max != null) {
        rules.push({ type: 'max', value: f.max, message: formatTemplate(t.maxValue, { max: f.max }) });
      }
      if (f.type === 'email') rules.push({ type: 'email', message: t.invalidEmail });
      if (f.type === 'date' && f.required) rules.push({ type: 'date', message: t.invalidDate });
      if (f.minLength != null) {
        rules.push({ type: 'minLength', value: f.minLength, message: formatTemplate(t.minLength, { n: f.minLength }) });
      }
      s[f.name] = rules;
    }
    return s;
  }, [fields, t]);

  const submit = async () => {
    const errs = validateForm(
      values as Record<string, string | number | undefined | null>,
      schema,
    );
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const out: SubmitValues = {};
    for (const f of fields) {
      const v = values[f.name];
      if (f.type === 'number') {
        out[f.name] = v === '' || v == null ? (f.required ? Number(v) : (undefined as unknown as number)) : Number(v);
      } else if (f.type === 'checkbox') out[f.name] = Boolean(v);
      else out[f.name] = v ?? '';
    }
    await onSubmit(out);
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={title}
      eyebrow={eyebrow}
      wide
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            {t.cancel}
          </Button>
          <Button onClick={() => void submit()} disabled={submitting}>
            {submitLabel ?? t.save}
          </Button>
        </>
      }
    >
      <div className="form-grid">
        {fields.map((f) => {
          const err = errors[f.name];
          if (f.type === 'checkbox') {
            return (
              <div key={f.name} className={f.span === 2 ? 'form-span-2' : undefined} style={{ paddingTop: 22 }}>
                <Checkbox
                  label={f.label}
                  checked={Boolean(values[f.name])}
                  onCheckedChange={(c) => setValues((v) => ({ ...v, [f.name]: c }))}
                />
              </div>
            );
          }
          const common = {
            label: f.label,
            required: f.required,
            hint: err ? undefined : f.hint,
            error: err || undefined,
            className: f.span === 2 ? 'form-span-2' : undefined,
            placeholder: 'placeholder' in f ? f.placeholder : undefined,
            disabled: submitting,
            value: (values[f.name] ?? '') as string,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
              setValues((v) => ({ ...v, [f.name]: e.target.value })),
          };
          if (f.type === 'select') {
            return (
              <NativeSelect
                key={f.name}
                {...common}
                options={[{ value: '', label: f.placeholder ?? t.selectOption }, ...f.options]}
              />
            );
          }
          if (f.type === 'textarea') {
            return <Textarea key={f.name} {...common} rows={f.rows ?? 3} />;
          }
          if (f.type === 'number') {
            return <Input key={f.name} {...common} type="number" min={f.min} max={f.max} step={f.step ?? 'any'} />;
          }
          return <Input key={f.name} {...common} type={f.type} />;
        })}
      </div>
    </Drawer>
  );
}
