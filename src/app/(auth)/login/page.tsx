import Link from 'next/link';
import { EchoMark } from '@/components/EchoMark';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-10 flex justify-center">
          <EchoMark />
        </div>

        <div className="card flex flex-col gap-6">
          <div>
            <h1 className="font-display text-3xl text-text">Welcome back</h1>
            <p className="mt-2 text-sm text-text-muted">
              Sign in to your school or trust account.
            </p>
          </div>

          <form className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="text-text-muted">Email</span>
              <input type="email" className="input" placeholder="you@school.org" />
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="text-text-muted">Password</span>
              <input type="password" className="input" placeholder="••••••••" />
            </label>

            <Link href="/dashboard" className="btn btn-primary mt-2 w-full">
              Sign in
            </Link>
          </form>

          <div className="text-center text-xs text-text-muted">
            No account yet?{' '}
            <Link href="/onboarding" className="text-primary-light hover:underline">
              Set up your school
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
