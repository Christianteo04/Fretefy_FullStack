using Fretefy.Test.Domain.Entities;
using Fretefy.Test.Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Fretefy.Test.Infra.EntityFramework.Repositories
{
    public class CidadeRepository : ICidadeRepository
    {
        private readonly DbSet<Cidade> _dbSet;

        public CidadeRepository(DbContext dbContext)
        {
            _dbSet = dbContext.Set<Cidade>();
        }

        public async Task<Cidade> GetByIdAsync(Guid id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task<IEnumerable<Cidade>> ListAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public async Task<IEnumerable<Cidade>> ListByUfAsync(string uf)
        {
            return await _dbSet.Where(w => EF.Functions.Like(w.UF, $"%{uf}%"))
                               .ToListAsync();
        }

        public async Task<IEnumerable<Cidade>> QueryAsync(string terms)
        {
            return await _dbSet.Where(w => EF.Functions.Like(w.Nome, $"%{terms}%") || EF.Functions.Like(w.UF, $"%{terms}%"))
                               .ToListAsync();
        }

        public async Task<IEnumerable<Cidade>> ListByIdsAsync(IEnumerable<Guid> ids)
        {
            if (ids == null || !ids.Any())
            {
                return new List<Cidade>();
            }

            return await _dbSet.Where(c => ids.Contains(c.Id))
                .ToListAsync();
        }
    }
}