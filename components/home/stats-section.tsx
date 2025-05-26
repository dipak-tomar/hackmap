export function StatsSection() {
  const stats = [
    { label: "Active Hackathons", value: "150+" },
    { label: "Registered Users", value: "25K+" },
    { label: "Teams Formed", value: "5K+" },
    { label: "Projects Created", value: "12K+" },
  ]

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Join Our Growing Community</h2>
          <p className="text-muted-foreground">Thousands of developers are already building amazing projects</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
