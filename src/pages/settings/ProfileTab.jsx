import { useEffect, useRef, useState } from 'react';
import { Camera, Check, Shuffle, Trash2 } from 'lucide-react';
import { usersApi } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { email as emailRule, required, useForm } from '@/hooks/useForm';
import { Avatar } from '@/components/ui/Avatar';
import { Button, IconButton } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { Field, Input, Textarea } from '@/components/ui/Field';
import { cn } from '@/utils/cn';

const RULES = {
  firstName: required('First name'),
  lastName: required('Last name'),
  email: emailRule,
};
const COLORS = [1, 2, 3, 4, 5];
const MAX_PHOTO_BYTES = 4 * 1024 * 1024; // 4MB — generous for a demo, keeps db.json sane

export function ProfileTab({ user }) {
  const toast = useToast();
  const fileInputRef = useRef(null);
  const { values, errors, set, validate, reset } = useForm(
    {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      company: user.company,
      phone: user.phone,
      bio: user.bio,
    },
    RULES,
  );
  const [saving, setSaving] = useState(false);
  const [colorIndex, setColorIndex] = useState(user.avatarColorIndex ?? 1);
  const [photo, setPhoto] = useState(user.avatarImage ?? null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [colorSaving, setColorSaving] = useState(false);

  useEffect(() => {
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      company: user.company,
      phone: user.phone,
      bio: user.bio,
    });
    setColorIndex(user.avatarColorIndex ?? 1);
    setPhoto(user.avatarImage ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const applyColor = async (next) => {
    const previous = colorIndex;
    setColorIndex(next); // instant feedback in this form
    setColorSaving(true);
    try {
      await usersApi.updateCurrentUser({ avatarColorIndex: next });
      // The navbar, sidebar and profile page all re-read the current user via the same
      // API, so this one save is what makes the new color show up everywhere else too.
      toast.success('Avatar color updated');
    } catch (err) {
      setColorIndex(previous);
      toast.error('Could not update avatar color', { description: err.message });
    } finally {
      setColorSaving(false);
    }
  };

  const shuffleColor = () => {
    const choices = COLORS.filter((c) => c !== colorIndex);
    applyColor(choices[Math.floor(Math.random() * choices.length)]);
  };

  const pickPhoto = () => fileInputRef.current?.click();

  const onPhotoSelected = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('That’s not an image', { description: 'Choose a JPG, PNG, WEBP or GIF file.' });
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      toast.error('Photo is too large', { description: 'Please choose an image under 4MB.' });
      return;
    }
    setPhotoBusy(true);
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Could not read that file'));
        reader.readAsDataURL(file);
      });
      setPhoto(dataUrl);
      await usersApi.updateCurrentUser({ avatarImage: dataUrl });
      toast.success('Profile photo updated', { description: 'Now showing across the app.' });
    } catch (err) {
      toast.error('Could not update your photo', { description: err.message });
    } finally {
      setPhotoBusy(false);
    }
  };

  const removePhoto = async () => {
    setPhotoBusy(true);
    try {
      setPhoto(null);
      await usersApi.updateCurrentUser({ avatarImage: null });
      toast.success('Photo removed', { description: 'Back to your initials avatar.' });
    } catch (err) {
      toast.error('Could not remove photo', { description: err.message });
    } finally {
      setPhotoBusy(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await usersApi.updateCurrentUser({
        ...values,
        avatarColorIndex: colorIndex,
        avatarImage: photo,
      });
      toast.success('Profile updated', {
        description: 'Your name and details now show up across the app.',
      });
    } catch (err) {
      toast.error('Could not update profile', { description: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Public profile" description="This is how your teammates see you." />
      <form onSubmit={onSubmit} noValidate className="space-y-6 p-6">
        <div className="flex flex-wrap items-center gap-5">
          <div className="relative">
            <Avatar
              name={`${values.firstName} ${values.lastName}`}
              size="xl"
              colorIndex={colorIndex}
              src={photo}
            />
            <button
              type="button"
              onClick={pickPhoto}
              disabled={photoBusy}
              aria-label="Upload a profile photo"
              className="absolute -bottom-1 -right-1 inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface bg-ink text-canvas shadow-card transition-transform hover:scale-105 disabled:opacity-60"
            >
              <Camera className="h-3.5 w-3.5" aria-hidden />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onPhotoSelected}
              className="hidden"
              aria-hidden
            />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-ink">
              {photo ? 'Profile photo' : 'Avatar color'}
            </p>
            <p className="mb-2.5 text-xs text-ink-3">
              {photo
                ? 'Uploaded from your device — shown wherever your avatar appears.'
                : 'We generate your avatar from your initials — pick an accent color, or upload a photo.'}
            </p>
            {photo ? (
              <div className="flex items-center gap-2">
                <Button size="sm" icon={Camera} onClick={pickPhoto} disabled={photoBusy}>
                  Change photo
                </Button>
                <Button
                  size="sm"
                  variant="secondary" tone="danger"
                  icon={Trash2}
                  onClick={removePhoto}
                  disabled={photoBusy}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={`Use avatar color ${c}`}
                    aria-pressed={colorIndex === c}
                    disabled={colorSaving}
                    onClick={() => applyColor(c)}
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-full ring-offset-2 ring-offset-surface transition-transform hover:scale-105 disabled:opacity-60',
                      colorIndex === c && 'ring-2 ring-ink',
                    )}
                    style={{ background: `var(--c${c})` }}
                  >
                    {colorIndex === c && <Check className="h-3.5 w-3.5 text-white" aria-hidden />}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={shuffleColor}
                  disabled={colorSaving}
                  className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs font-medium text-ink-2 transition-colors hover:bg-sunken hover:text-ink disabled:opacity-60"
                >
                  <Shuffle className="h-3.5 w-3.5" aria-hidden />
                  Shuffle
                </button>
                <IconButton
                  label="Upload a photo instead"
                  icon={Camera}
                  size="sm"
                  onClick={pickPhoto}
                  disabled={photoBusy}
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name" required error={errors.firstName}>
            <Input value={values.firstName} onChange={(e) => set('firstName', e.target.value)} />
          </Field>
          <Field label="Last name" required error={errors.lastName}>
            <Input value={values.lastName} onChange={(e) => set('lastName', e.target.value)} />
          </Field>
          <Field label="Email" required error={errors.email}>
            <Input
              type="email"
              value={values.email}
              onChange={(e) => set('email', e.target.value)}
            />
          </Field>
          <Field label="Phone">
            <Input type="tel" value={values.phone} onChange={(e) => set('phone', e.target.value)} />
          </Field>
          <Field label="Role">
            <Input value={values.role} onChange={(e) => set('role', e.target.value)} />
          </Field>
          <Field label="Company">
            <Input value={values.company} onChange={(e) => set('company', e.target.value)} />
          </Field>
        </div>
        <Field label="Bio" hint="Shown on your profile page.">
          <Textarea value={values.bio} onChange={(e) => set('bio', e.target.value)} rows={3} />
        </Field>
        <div className="flex justify-end border-t border-line pt-4">
          <Button variant="primary" type="submit" loading={saving}>
            Save changes
          </Button>
        </div>
      </form>
    </Card>
  );
}
