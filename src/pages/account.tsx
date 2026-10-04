import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Link } from 'wouter';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Info } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const signInSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(8, 'Use at least 8 characters.'),
});

const signUpSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name.'),
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(8, 'Use at least 8 characters.'),
  confirmPassword: z.string().min(1, 'Confirm your password.'),
}).refine((values) => values.password === values.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
});

type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;

function AccountShell({ children, kind }: { children: React.ReactNode; kind: 'signin' | 'signup' }) {
  const isSignUp = kind === 'signup';
  return (
    <div className="account-page">
      <header className="account-topbar">
        <Link href="/" className="brand-mark" data-testid="link-account-home">
          dastoor<span>SOUTH ASIAN WEAR</span>
        </Link>
        <Link href="/" className="account-back" data-testid="link-back-to-store">
          <ArrowLeft size={14} aria-hidden="true" /> Back to the edit
        </Link>
      </header>
      <main className="account-main">
        <section className="account-form-wrap" aria-labelledby="account-heading">
          {children}
        </section>
        <aside className="account-editorial" aria-label="Dastoor wardrobe editorial">
          <img
            src={isSignUp ? '/collections/kurtas.jpg' : '/collections/occasionwear.jpg'}
            alt={isSignUp
              ? 'Editorial portrait of a man in a muted sage kurta beneath a sunlit archway.'
              : 'Editorial portrait of a man wearing a deep green traditional outfit in a historic stone courtyard.'}
            data-testid="img-account-editorial"
          />
          <span className="account-image-index" aria-hidden="true">{isSignUp ? '02' : '01'}</span>
          <div className="account-image-copy">
            <div className="eyebrow">A wardrobe shaped by ritual</div>
            <h2>{isSignUp ? <>A little more<br />room to belong.</> : <>For the days<br />that bring us together.</>}</h2>
            <p>South Asian dressing, considered for familiar days and the gatherings worth remembering.</p>
          </div>
        </aside>
      </main>
      <footer className="account-footnote">
        <span><strong>Dastoor</strong> — an editorial wardrobe preview</span>
        <span>{isSignUp ? 'A considered beginning' : 'Everyday wear, and beyond'}</span>
      </footer>
    </div>
  );
}

function ServiceNotice() {
  return (
    <div className="account-service-note" role="note" data-testid="notice-account-services">
      <Info size={15} aria-hidden="true" />
      <span>Account services are not connected in this preview. Your details stay in this form and are not sent or saved.</span>
    </div>
  );
}

export function SignInPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [status, setStatus] = useState('');
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onSubmit',
  });

  const submitLocally = (_values: SignInValues) => {
    setStatus('Your details pass local validation. No sign-in was performed.');
  };

  return (
    <AccountShell kind="signin">
      <div className="account-kicker">Welcome back</div>
      <h1 id="account-heading" className="account-heading" data-testid="text-account-heading">Come on in.</h1>
      <p className="account-subtitle">A preview of the Dastoor sign-in form.</p>
      <Form {...form}>
        <form className="account-form" onSubmit={form.handleSubmit(submitLocally)} noValidate data-testid="form-signin">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="account-field">
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input {...field} type="email" autoComplete="email" placeholder="you@example.com" className="account-input" data-testid="input-signin-email" />
                </FormControl>
                <FormMessage className="account-error" data-testid="error-signin-email" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="account-field">
                <FormLabel>Password</FormLabel>
                <div className="account-input-wrap">
                  <FormControl>
                    <Input {...field} type={passwordVisible ? 'text' : 'password'} autoComplete="current-password" placeholder="At least 8 characters" className="account-input with-toggle" data-testid="input-signin-password" />
                  </FormControl>
                  <button
                    className="password-toggle"
                    type="button"
                    onClick={() => setPasswordVisible((visible) => !visible)}
                    aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                    aria-pressed={passwordVisible}
                    data-testid="button-toggle-signin-password"
                  >
                    {passwordVisible ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                <FormMessage className="account-error" data-testid="error-signin-password" />
              </FormItem>
            )}
          />
          <button className="account-submit" type="submit" data-testid="button-submit-signin">
            Check details <ArrowRight size={14} aria-hidden="true" />
          </button>
        </form>
      </Form>
      <ServiceNotice />
      {status && <p className="account-status" role="status" data-testid="status-signin">{status}</p>}
      <p className="account-switch">
        New to Dastoor? <Link href="/signup" data-testid="link-to-signup">Create an account <ArrowRight size={12} aria-hidden="true" /></Link>
      </p>
    </AccountShell>
  );
}

export function SignUpPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [status, setStatus] = useState('');
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
    mode: 'onSubmit',
  });

  const submitLocally = (_values: SignUpValues) => {
    setStatus('Your details pass local validation. No account was created.');
  };

  return (
    <AccountShell kind="signup">
      <div className="account-kicker">A place in the edit</div>
      <h1 id="account-heading" className="account-heading" data-testid="text-account-heading">Make it yours.</h1>
      <p className="account-subtitle">A preview of the Dastoor sign-up form.</p>
      <Form {...form}>
        <form className="account-form" onSubmit={form.handleSubmit(submitLocally)} noValidate data-testid="form-signup">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="account-field">
                <FormLabel>Your name</FormLabel>
                <FormControl>
                  <Input {...field} type="text" autoComplete="name" placeholder="Name as you'd like us to know it" className="account-input" data-testid="input-signup-name" />
                </FormControl>
                <FormMessage className="account-error" data-testid="error-signup-name" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="account-field">
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input {...field} type="email" autoComplete="email" placeholder="you@example.com" className="account-input" data-testid="input-signup-email" />
                </FormControl>
                <FormMessage className="account-error" data-testid="error-signup-email" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="account-field">
                <FormLabel>Password</FormLabel>
                <div className="account-input-wrap">
                  <FormControl>
                    <Input {...field} type={passwordVisible ? 'text' : 'password'} autoComplete="new-password" placeholder="At least 8 characters" className="account-input with-toggle" data-testid="input-signup-password" />
                  </FormControl>
                  <button
                    className="password-toggle"
                    type="button"
                    onClick={() => setPasswordVisible((visible) => !visible)}
                    aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                    aria-pressed={passwordVisible}
                    data-testid="button-toggle-signup-password"
                  >
                    {passwordVisible ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                <FormMessage className="account-error" data-testid="error-signup-password" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="account-field">
                <FormLabel>Confirm password</FormLabel>
                <div className="account-input-wrap">
                  <FormControl>
                    <Input {...field} type={confirmationVisible ? 'text' : 'password'} autoComplete="new-password" placeholder="Enter your password again" className="account-input with-toggle" data-testid="input-signup-confirm-password" />
                  </FormControl>
                  <button
                    className="password-toggle"
                    type="button"
                    onClick={() => setConfirmationVisible((visible) => !visible)}
                    aria-label={confirmationVisible ? 'Hide confirmation password' : 'Show confirmation password'}
                    aria-pressed={confirmationVisible}
                    data-testid="button-toggle-signup-confirm-password"
                  >
                    {confirmationVisible ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                <FormMessage className="account-error" data-testid="error-signup-confirm-password" />
              </FormItem>
            )}
          />
          <button className="account-submit" type="submit" data-testid="button-submit-signup">
            Check details <ArrowRight size={14} aria-hidden="true" />
          </button>
        </form>
      </Form>
      <ServiceNotice />
      {status && <p className="account-status" role="status" data-testid="status-signup">{status}</p>}
      <p className="account-switch">
        Already have an account? <Link href="/signin" data-testid="link-to-signin">Sign in <ArrowRight size={12} aria-hidden="true" /></Link>
      </p>
    </AccountShell>
  );
}