import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-ink-950 text-paper-50 selection:bg-violet-500/30">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-4">
          Make every playlist flow.
        </h1>
        <p className="text-xl text-ink-300">
          Intelligent music transitions built for the modern DJ and audiophile.
        </p>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/player"
            className="px-8 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors w-full sm:w-auto"
          >
            Open Player
          </Link>
          <Link 
            href="/login"
            className="px-8 py-3 rounded-full bg-ink-800 hover:bg-ink-700 text-paper-100 font-medium transition-colors w-full sm:w-auto"
          >
            Login
          </Link>
          <Link 
            href="/register"
            className="px-8 py-3 rounded-full border border-ink-700 hover:bg-ink-800 text-paper-100 font-medium transition-colors w-full sm:w-auto"
          >
            Create Account
          </Link>
        </div>
      </div>
    </main>
  );
}
