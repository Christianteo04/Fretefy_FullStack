using Fretefy.Test.Domain.Entities;
using Fretefy.Test.Domain.Interfaces.Repositories;
using Fretefy.Test.Domain.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Fretefy.Test.Domain.Services
{
    public class CidadeService : ICidadeService
    {
        private readonly ICidadeRepository _cidadeRepository;

        public CidadeService(ICidadeRepository cidadeRepository)
        {
            _cidadeRepository = cidadeRepository;
        }

        public async Task<Cidade> GetByIdAsync(Guid id)
        {
            return await _cidadeRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Cidade>> ListAsync()
        {
            return await _cidadeRepository.ListAsync();
        }

        public async Task<IEnumerable<Cidade>> ListByUfAsync(string uf)
        {
            return await _cidadeRepository.ListByUfAsync(uf);
        }

        public async Task<IEnumerable<Cidade>> QueryAsync(string terms)
        {
            return await _cidadeRepository.QueryAsync(terms);
        }
    }
}