using Fretefy.Test.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Fretefy.Test.Domain.Interfaces.Repositories
{
    public interface IRegiaoRepository
    {
        Task<IEnumerable<Regiao>> ListarComCidadesAsync();
        Task<Regiao> ObterPorIdComCidadesAsync(Guid id);
        Task<bool> NomeJaExiste(string nome, Guid? idExcluido = null);
        Task AdicionarAsync(Regiao regiao);
        Task AtualizarAsync(Regiao regiao);
    }
}