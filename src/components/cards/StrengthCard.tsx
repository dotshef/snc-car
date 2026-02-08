interface StrengthCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function StrengthCard({ icon, title, description }: StrengthCardProps) {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 border border-border rounded-xl p-6 text-center hover:shadow-xl hover:border-secondary transition-all duration-300">
      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
    </div>
  );
}
