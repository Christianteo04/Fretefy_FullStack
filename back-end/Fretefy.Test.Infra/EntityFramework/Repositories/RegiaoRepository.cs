using Fretefy.Test.Domain.Entities;
using Fretefy.Test.Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Fretefy.Test.Infra.EntityFramework.Repositories
{
    public class RegiaoRepository : IRegiaoRepository
    {
        private readonly TestDbContext _context;

        public RegiaoRepository(TestDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Regiao>> ListarComCidadesAsync()
        {
            return await _context.Regioes
                .AsNoTracking()
                .Include(r => r.RegiaoCidades)
                    .ThenInclude(rc => rc.Cidade)
                .ToListAsync();
        }

        public async Task<Regiao> ObterPorIdComCidadesAsync(Guid id)
        {
            return await _context.Regioes
                .Include(r => r.RegiaoCidades)
                    .ThenInclude(rc => rc.Cidade)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<bool> NomeJaExiste(string nome, Guid? idExcluido = null)
        {
            return await _context.Regioes
                .AsNoTracking()
                .AnyAsync(r => r.Nome.ToUpper() == nome.ToUpper() && r.Id != idExcluido);
        }

        public async Task AdicionarAsync(Regiao regiao)
        {
            _context.Regioes.Add(regiao);
            await _context.SaveChangesAsync();
        }

        public async Task AtualizarAsync(Regiao regiao)
        {
            await _context.SaveChangesAsync();
        }
    }
}