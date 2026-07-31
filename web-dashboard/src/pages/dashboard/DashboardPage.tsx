export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-h1 font-bold mb-lg">Tableau de bord</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
        <div className="card">
          <p className="text-caption text-text-secondary dark:text-dark-text-secondary mb-xs">
            Chiffre d'affaires aujourd'hui
          </p>
          <p className="text-display font-bold text-primary">0 XOF</p>
        </div>
        <div className="card">
          <p className="text-caption text-text-secondary dark:text-dark-text-secondary mb-xs">
            Commandes en cours
          </p>
          <p className="text-display font-bold text-warning">0</p>
        </div>
        <div className="card">
          <p className="text-caption text-text-secondary dark:text-dark-text-secondary mb-xs">
            Tables occupées
          </p>
          <p className="text-display font-bold text-info">0</p>
        </div>
        <div className="card">
          <p className="text-caption text-text-secondary dark:text-dark-text-secondary mb-xs">
            Personnel présent
          </p>
          <p className="text-display font-bold text-success">0</p>
        </div>
      </div>
    </div>
  );
}
