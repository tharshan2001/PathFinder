import Feed from '../components/dashboard/Feed';
import { useApp } from '../context/AppContext';

export default function FeedPage() {
  const { user } = useApp();

  return (
    <div className="animate-in max-w-2xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Home
        </h1>
        <p className="text-slate-500 mt-1">Check out the latest updates from your community</p>
      </div>
      <Feed />
    </div>
  );
}
