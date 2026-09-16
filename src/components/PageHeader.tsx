interface PageHeaderProps {
  title: string;
  date?: string | null;
}

export default function PageHeader({title,date}: PageHeaderProps) {
  return (
    <div>
        <div className="mb-8">
            <h1 className="text-3xl font-bold">{title}</h1>

            {date && (
                <p className="mt-2 text-gray-500">
                Date: {new Date(date).toLocaleDateString()}
                </p>
            )}
        </div>
    </div>
  );
}