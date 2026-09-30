import { useCallback, useState } from 'react';

/** Minimal form state with per-field validation rules: { field: (value, all) => message | undefined } */
export function useForm(initial, rules = {}) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});

  const set = useCallback((key, value) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  }, []);

  const validate = useCallback(() => {
    const next = {};
    for (const [key, rule] of Object.entries(rules)) {
      const message = rule(values[key], values);
      if (message) next[key] = message;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [rules, values]);

  const reset = useCallback(
    (next = initial) => {
      setValues(next);
      setErrors({});
    },
    [initial],
  );

  return { values, errors, set, validate, reset };
}

export const required = (label) => (v) =>
  String(v ?? '').trim() ? undefined : `${label} is required`;
export const email = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v ?? '').trim())
    ? undefined
    : 'Enter a valid email address';
