import { Building2, MapPin, Users } from 'lucide-react';
import { getPlatformStats } from '@/lib/actions/stats';

export async function Stats() {
  const platformStats = await getPlatformStats();

  const stats = [
    {
      icon: Building2,
      value: platformStats.companiesFormatted,
      label: 'Verified Companies',
      description: 'Across all categories',
    },
    {
      icon: MapPin,
      value: platformStats.citiesFormatted,
      label: 'Cities Covered',
      description: 'Pan-India presence',
    },
    {
      icon: Users,
      value: platformStats.usersFormatted,
      label: 'Active Users',
      description: 'Growing community',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-teal-600 to-emerald-600">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-white/10 mb-4">
                <stat.icon className="h-7 w-7 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-lg font-medium text-teal-100 mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-teal-200">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
