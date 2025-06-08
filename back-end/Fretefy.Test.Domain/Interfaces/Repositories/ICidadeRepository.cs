using Fretefy.Test.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Fretefy.Test.Domain.Interfaces.Repositories
{
    public interface ICidadeRepository
    {
        Task<Cidade> GetByIdAsync(Guid id);
        Task<IEnumerable<Cidade>> ListAsync();
        Task<IEnumerable<Cidade>> ListByUfAsync(string uf);
        Task<IEnumerable<Cidade>> QueryAsync(string terms);
        Task<IEnumerable<Cidade>> ListByIdsAsync(IEnumerable<Guid> ids);
    }
}
