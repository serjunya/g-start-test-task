using Microsoft.EntityFrameworkCore;

namespace TilesApi.Models;

public class TilesContext: DbContext {
    public TilesContext(DbContextOptions<TilesContext> options)
        : base(options) {}

    public DbSet<TilesItem> TilesItems { get; set; } = null!;
}