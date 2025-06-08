using Fretefy.Test.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Fretefy.Test.Domain.Interfaces.Services
{
    public interface ICidadeService
    {
        Task<Cidade> GetByIdAsync(Guid id);
        Task<IEnumerable<Cidade>> ListAsync();
        Task<IEnumerable<Cidade>> ListByUfAsync(string uf);
        Task<IEnumerable<Cidade>> QueryAsync(string terms);
    }
}
